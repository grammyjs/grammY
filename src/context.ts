// deno-lint-ignore-file camelcase
import type { Api } from "./core/api.ts";
import {
    type FilterCore,
    type FilterQuery,
    type FilterQueryContext,
    matchFilter,
} from "./filter.ts";
import type {
    Chat,
    Message,
    MessageEntity,
    ReactionType,
    ReactionTypeEmoji,
    Update,
    User,
    UserFromGetMe,
} from "./types.ts";

// === Util types
export type MaybeArray<T> = T | T[];
/** permits `string` but gives hints */
export type StringWithCommandSuggestions =
    | (string & Record<never, never>)
    | "start"
    | "help"
    | "settings"
    | "privacy"
    | "developer_info";

type SnakeToCamelCase<S extends string> = S extends `${infer L}_${infer R}`
    ? `${L}${Capitalize<SnakeToCamelCase<R>>}`
    : S;
type AliasProps<U> = {
    [K in string & keyof U as SnakeToCamelCase<K>]: U[K];
};
type RenamedUpdate = AliasProps<Omit<Update, "update_id">>;

// === Context probing logic
interface StaticHas {
    /**
     * Generates a predicate function that can test context objects for matching
     * the given filter query. This uses the same logic as `bot.on`.
     *
     * @param filter The filter query to check
     */
    filterQuery<Q extends FilterQuery>(
        filter: Q | Q[],
    ): <C extends Context>(ctx: C) => ctx is FilterQueryContext<C, Q>;
    /**
     * Generates a predicate function that can test context objects for
     * containing the given text, or for the text to match the given regular
     * expression. This uses the same logic as `bot.hears`.
     *
     * @param trigger The string or regex to match
     */
    text(
        trigger: MaybeArray<string | RegExp>,
    ): <C extends Context>(ctx: C) => ctx is HearsContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * containing a command. This uses the same logic as `bot.command`.
     *
     * @param command The command to match
     */
    command(
        command: MaybeArray<StringWithCommandSuggestions>,
    ): <C extends Context>(ctx: C) => ctx is CommandContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * containing a message reaction update. This uses the same logic as
     * `bot.reaction`.
     *
     * @param reaction The reaction to test against
     */
    reaction(
        reaction: MaybeArray<ReactionTypeEmoji["emoji"] | ReactionType>,
    ): <C extends Context>(ctx: C) => ctx is ReactionContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * belonging to a chat with the given chat type. This uses the same logic as
     * `bot.chatType`.
     *
     * @param chatType The chat type to match
     */
    chatType<T extends Chat["type"]>(
        chatType: MaybeArray<T>,
    ): <C extends Context>(ctx: C) => ctx is ChatTypeContext<C, T>;
    /**
     * Generates a predicate function that can test context objects for
     * containing the given callback query, or for the callback query data to
     * match the given regular expression. This uses the same logic as
     * `bot.callbackQuery`.
     *
     * @param trigger The string or regex to match
     */
    callbackQuery(
        trigger: MaybeArray<string | RegExp>,
    ): <C extends Context>(ctx: C) => ctx is CallbackQueryContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * containing the given game query, or for the game name to match the given
     * regular expression. This uses the same logic as `bot.gameQuery`.
     *
     * @param trigger The string or regex to match
     */
    gameQuery(
        trigger: MaybeArray<string | RegExp>,
    ): <C extends Context>(ctx: C) => ctx is GameQueryContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * containing the given inline query, or for the inline query to match the
     * given regular expression. This uses the same logic as `bot.inlineQuery`.
     *
     * @param trigger The string or regex to match
     */
    inlineQuery(
        trigger: MaybeArray<string | RegExp>,
    ): <C extends Context>(ctx: C) => ctx is InlineQueryContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * containing the chosen inline result, or for the chosen inline result to
     * match the given regular expression.
     *
     * @param trigger The string or regex to match
     */
    chosenInlineResult(
        trigger: MaybeArray<string | RegExp>,
    ): <C extends Context>(ctx: C) => ctx is ChosenInlineResultContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * containing the given pre-checkout query, or for the pre-checkout query
     * payload to match the given regular expression. This uses the same logic
     * as `bot.preCheckoutQuery`.
     *
     * @param trigger The string or regex to match
     */
    preCheckoutQuery(
        trigger: MaybeArray<string | RegExp>,
    ): <C extends Context>(ctx: C) => ctx is PreCheckoutQueryContext<C>;
    /**
     * Generates a predicate function that can test context objects for
     * containing the given shipping query, or for the shipping query to match
     * the given regular expression. This uses the same logic as
     * `bot.shippingQuery`.
     *
     * @param trigger The string or regex to match
     */
    shippingQuery(
        trigger: MaybeArray<string | RegExp>,
    ): <C extends Context>(ctx: C) => ctx is ShippingQueryContext<C>;
}
const checker: StaticHas = {
    filterQuery<Q extends FilterQuery>(filter: Q | Q[]) {
        const pred = matchFilter(filter);
        return <C extends Context>(ctx: C): ctx is FilterQueryContext<C, Q> =>
            pred(ctx);
    },
    text(trigger) {
        const hasText = checker.filterQuery([":text", ":caption"]);
        const trg = triggerFn(trigger);
        return <C extends Context>(ctx: C): ctx is HearsContext<C> => {
            if (!hasText(ctx)) return false;
            const msg = ctx.message ?? ctx.channelPost;
            const txt = msg.text ?? msg.caption;
            return match(ctx, txt, trg);
        };
    },
    command(command) {
        const hasEntities = checker.filterQuery(":entities:bot_command");
        const atCommands = new Set<string>();
        const noAtCommands = new Set<string>();
        toArray(command).forEach((cmd) => {
            if (cmd.startsWith("/")) {
                throw new Error(
                    `Do not include '/' when registering command handlers (use '${
                        cmd.substring(1)
                    }' not '${cmd}')`,
                );
            }
            const set = cmd.includes("@") ? atCommands : noAtCommands;
            set.add(cmd);
        });
        return <C extends Context>(ctx: C): ctx is CommandContext<C> => {
            if (!hasEntities(ctx)) return false;
            const msg = ctx.message ?? ctx.channelPost;
            const txt = msg.text ?? msg.caption;
            return msg.entities.some((e) => {
                if (e.type !== "bot_command") return false;
                if (e.offset !== 0) return false;
                const cmd = txt.substring(1, e.length);
                if (noAtCommands.has(cmd) || atCommands.has(cmd)) {
                    ctx.match = txt.substring(cmd.length + 1).trimStart();
                    return true;
                }
                const index = cmd.indexOf("@");
                if (index === -1) return false;
                const atTarget = cmd.substring(index + 1).toLowerCase();
                const username = ctx.me.username.toLowerCase();
                if (atTarget !== username) return false;
                const atCommand = cmd.substring(0, index);
                if (noAtCommands.has(atCommand)) {
                    ctx.match = txt.substring(cmd.length + 1).trimStart();
                    return true;
                }
                return false;
            });
        };
    },
    reaction(reaction) {
        const hasMessageReaction = checker.filterQuery("message_reaction");
        const normalized: ReactionType[] = typeof reaction === "string"
            ? [{ type: "emoji", emoji: reaction }]
            : (Array.isArray(reaction) ? reaction : [reaction]).map((emoji) =>
                typeof emoji === "string" ? { type: "emoji", emoji } : emoji
            );
        const emoji = new Set(
            normalized.filter((r) => r.type === "emoji")
                .map((r) => r.emoji),
        );
        const customEmoji = new Set(
            normalized.filter((r) => r.type === "custom_emoji")
                .map((r) => r.custom_emoji_id),
        );
        const paid = normalized.some((r) => r.type === "paid");
        return <C extends Context>(ctx: C): ctx is ReactionContext<C> => {
            if (!hasMessageReaction(ctx)) return false;
            const { old_reaction, new_reaction } = ctx.messageReaction;
            // try to find a wanted reaction that is new and not old
            for (const reaction of new_reaction) {
                // first check if the reaction existed previously
                let isOld = false;
                if (reaction.type === "emoji") {
                    for (const old of old_reaction) {
                        if (old.type !== "emoji") continue;
                        if (old.emoji === reaction.emoji) {
                            isOld = true;
                            break;
                        }
                    }
                } else if (reaction.type === "custom_emoji") {
                    for (const old of old_reaction) {
                        if (old.type !== "custom_emoji") continue;
                        if (old.custom_emoji_id === reaction.custom_emoji_id) {
                            isOld = true;
                            break;
                        }
                    }
                } else if (reaction.type === "paid") {
                    for (const old of old_reaction) {
                        if (old.type !== "paid") continue;
                        isOld = true;
                        break;
                    }
                } else {
                    // always regard unsupported emoji types as new
                }
                // disregard reaction if it is not new
                if (isOld) continue;
                // check if the new reaction is wanted and short-circuit
                if (reaction.type === "emoji") {
                    if (emoji.has(reaction.emoji)) return true;
                } else if (reaction.type === "custom_emoji") {
                    if (customEmoji.has(reaction.custom_emoji_id)) return true;
                } else if (reaction.type === "paid") {
                    if (paid) return true;
                } else {
                    // always regard unsupported emoji types as new
                    return true;
                }
                // new reaction not wanted, check next one
            }
            return false;
        };
    },
    chatType<T extends Chat["type"]>(chatType: MaybeArray<T>) {
        const set = new Set<Chat["type"]>(toArray(chatType));
        return <C extends Context>(ctx: C): ctx is ChatTypeContext<C, T> =>
            ctx.chat?.type !== undefined && set.has(ctx.chat.type);
    },
    callbackQuery(trigger) {
        const hasCallbackQuery = checker.filterQuery("callback_query:data");
        const trg = triggerFn(trigger);
        return <C extends Context>(ctx: C): ctx is CallbackQueryContext<C> =>
            hasCallbackQuery(ctx) && match(ctx, ctx.callbackQuery.data, trg);
    },
    gameQuery(trigger) {
        const hasGameQuery = checker.filterQuery(
            "callback_query:game_short_name",
        );
        const trg = triggerFn(trigger);
        return <C extends Context>(ctx: C): ctx is GameQueryContext<C> =>
            hasGameQuery(ctx) &&
            match(ctx, ctx.callbackQuery.game_short_name, trg);
    },
    inlineQuery(trigger) {
        const hasInlineQuery = checker.filterQuery("inline_query");
        const trg = triggerFn(trigger);
        return <C extends Context>(ctx: C): ctx is InlineQueryContext<C> =>
            hasInlineQuery(ctx) && match(ctx, ctx.inlineQuery.query, trg);
    },
    chosenInlineResult(trigger) {
        const hasChosenInlineResult = checker.filterQuery(
            "chosen_inline_result",
        );
        const trg = triggerFn(trigger);
        return <C extends Context>(
            ctx: C,
        ): ctx is ChosenInlineResultContext<C> =>
            hasChosenInlineResult(ctx) &&
            match(ctx, ctx.chosenInlineResult.result_id, trg);
    },
    preCheckoutQuery(trigger) {
        const hasPreCheckoutQuery = checker.filterQuery("pre_checkout_query");
        const trg = triggerFn(trigger);
        return <C extends Context>(ctx: C): ctx is PreCheckoutQueryContext<C> =>
            hasPreCheckoutQuery(ctx) &&
            match(ctx, ctx.preCheckoutQuery.invoice_payload, trg);
    },
    shippingQuery(trigger) {
        const hasShippingQuery = checker.filterQuery("shipping_query");
        const trg = triggerFn(trigger);
        return <C extends Context>(ctx: C): ctx is ShippingQueryContext<C> =>
            hasShippingQuery(ctx) &&
            match(ctx, ctx.shippingQuery.invoice_payload, trg);
    },
};

// === Context class
/**
 * When your bot receives a message, Telegram sends an update object to your
 * bot. The update contains information about the chat, the user, and of course
 * the message itself. There are numerous other updates, too:
 * https://core.telegram.org/bots/api#update
 *
 * When grammY receives an update, it wraps this update into a context object
 * for you. Context objects are commonly named `ctx`. A context object does two
 * things:
 * 1. **`ctx.update`** holds the update object that you can use to process the
 *    message. This includes providing useful shortcuts for the update, for
 *    instance, `ctx.msg` is a shortcut that gives you the message object from
 *    the update—no matter whether it is contained in `ctx.update.message`, or
 *    `ctx.update.edited_message`, or `ctx.update.channel_post`, or
 *    `ctx.update.edited_channel_post`.
 * 2. **`ctx.api`** gives you access to the full Telegram Bot API so that you
 *    can directly call any method, such as responding via
 *    `ctx.api.sendMessage`. Also here, the context objects has some useful
 *    shortcuts for you. For instance, if you want to send a message to the same
 *    chat that a message comes from (i.e. just respond to a user) you can call
 *    `ctx.send`. This is nothing but a wrapper for `ctx.api.sendMessage` with
 *    the right `chat_id` pre-filled for you. Almost all methods of the Telegram
 *    Bot API have their own shortcut directly on the context object, so you
 *    probably never really have to use `ctx.api` at all.
 *
 * This context object is then passed to all of the listeners (called
 * middleware) that you register on your bot. Because this is so useful, the
 * context object is often used to hold more information. One example are
 * sessions (a chat-specific data storage that is stored in a database), and
 * another example is `ctx.match` that is used by `bot.command` and other
 * methods to keep information about how a regular expression was matched.
 *
 * Read up about middleware on the [website](https://grammy.dev/guide/context)
 * if you want to know more about the powerful opportunities that lie in context
 * objects, and about how grammY implements them.
 */
export class Context implements RenamedUpdate {
    /**
     * Used by some middleware to store information about how a certain string
     * or regular expression was matched.
     */
    public match: string | RegExpMatchArray | undefined;

    constructor(
        /**
         * The update object that is contained in the context.
         */
        public readonly update: Update,
        /**
         * An API instance that allows you to call any method of the Telegram
         * Bot API.
         */
        public readonly api: Api,
        /**
         * Information about the bot itself.
         */
        public readonly me: UserFromGetMe,
    ) {}

    // UPDATE SHORTCUTS

    // Keep in sync with types in `filter.ts`.
    /** Alias for `ctx.update.message` */
    get message() {
        return this.update.message;
    }
    /** Alias for `ctx.update.edited_message` */
    get editedMessage() {
        return this.update.edited_message;
    }
    /** Alias for `ctx.update.channel_post` */
    get channelPost() {
        return this.update.channel_post;
    }
    /** Alias for `ctx.update.edited_channel_post` */
    get editedChannelPost() {
        return this.update.edited_channel_post;
    }
    /** Alias for `ctx.update.business_connection` */
    get businessConnection() {
        return this.update.business_connection;
    }
    /** Alias for `ctx.update.business_message` */
    get businessMessage() {
        return this.update.business_message;
    }
    /** Alias for `ctx.update.edited_business_message` */
    get editedBusinessMessage() {
        return this.update.edited_business_message;
    }
    /** Alias for `ctx.update.deleted_business_messages` */
    get deletedBusinessMessages() {
        return this.update.deleted_business_messages;
    }
    /** Alias for `ctx.update.message_reaction` */
    get messageReaction() {
        return this.update.message_reaction;
    }
    /** Alias for `ctx.update.message_reaction_count` */
    get messageReactionCount() {
        return this.update.message_reaction_count;
    }
    /** Alias for `ctx.update.inline_query` */
    get inlineQuery() {
        return this.update.inline_query;
    }
    /** Alias for `ctx.update.chosen_inline_result` */
    get chosenInlineResult() {
        return this.update.chosen_inline_result;
    }
    /** Alias for `ctx.update.callback_query` */
    get callbackQuery() {
        return this.update.callback_query;
    }
    /** Alias for `ctx.update.shipping_query` */
    get shippingQuery() {
        return this.update.shipping_query;
    }
    /** Alias for `ctx.update.pre_checkout_query` */
    get preCheckoutQuery() {
        return this.update.pre_checkout_query;
    }
    /** Alias for `ctx.update.poll` */
    get poll() {
        return this.update.poll;
    }
    /** Alias for `ctx.update.poll_answer` */
    get pollAnswer() {
        return this.update.poll_answer;
    }
    /** Alias for `ctx.update.my_chat_member` */
    get myChatMember() {
        return this.update.my_chat_member;
    }
    /** Alias for `ctx.update.chat_member` */
    get chatMember() {
        return this.update.chat_member;
    }
    /** Alias for `ctx.update.chat_join_request` */
    get chatJoinRequest() {
        return this.update.chat_join_request;
    }
    /** Alias for `ctx.update.chat_boost` */
    get chatBoost() {
        return this.update.chat_boost;
    }
    /** Alias for `ctx.update.removed_chat_boost` */
    get removedChatBoost() {
        return this.update.removed_chat_boost;
    }
    /** Alias for `ctx.update.purchased_paid_media` */
    get purchasedPaidMedia() {
        return this.update.purchased_paid_media;
    }

    // AGGREGATION SHORTCUTS

    /**
     * Get the message object from wherever possible. Alias for `this.message ??
     * this.editedMessage ?? this.channelPost ?? this.editedChannelPost ??
     * this.businessMessage ?? this.editedBusinessMessage ??
     * this.callbackQuery?.message`.
     */
    get msg(): Message | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.message ??
                this.editedMessage ??
                this.channelPost ??
                this.editedChannelPost ??
                this.businessMessage ??
                this.editedBusinessMessage ??
                this.callbackQuery?.message
        );
    }
    /**
     * Get the message text from wherever possible. Alias for `this.msg?.text ??
     * this.msg?.caption`.
     */
    get txt(): string | undefined {
        // Keep in sync with types in `filter.ts`.
        const msg = this.msg;
        return msg?.text ?? msg?.caption;
    }
    /**
     * Get the chat object from wherever possible. Alias for `(this.msg ??
     * this.deletedBusinessMessages ?? this.messageReaction ??
     * this.messageReactionCount ?? this.myChatMember ??  this.chatMember ??
     * this.chatJoinRequest ?? this.chatBoost ??  this.removedChatBoost)?.chat`.
     */
    get chat(): Chat | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.msg ??
                this.deletedBusinessMessages ??
                this.messageReaction ??
                this.messageReactionCount ??
                this.myChatMember ??
                this.chatMember ??
                this.chatJoinRequest ??
                this.chatBoost ??
                this.removedChatBoost
        )?.chat;
    }
    /**
     * Get the user object from wherever possible. Alias for
     * `(this.businessConnection ?? this.messageReaction ??
     * (this.chatBoost?.boost ?? this.removedChatBoost)?.source)?.user ??
     * (this.callbackQuery ?? this.msg ?? this.inlineQuery ??
     * this.chosenInlineResult ?? this.shippingQuery ?? this.preCheckoutQuery ??
     * this.myChatMember ?? this.chatMember ?? this.chatJoinRequest ??
     * this.purchasedPaidMedia)?.from`.
     */
    get from(): User | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.businessConnection ??
                this.messageReaction ??
                (this.chatBoost?.boost ?? this.removedChatBoost)?.source
        )?.user ??
            (
                this.callbackQuery ??
                    this.msg ??
                    this.inlineQuery ??
                    this.chosenInlineResult ??
                    this.shippingQuery ??
                    this.preCheckoutQuery ??
                    this.myChatMember ??
                    this.chatMember ??
                    this.chatJoinRequest ??
                    this.purchasedPaidMedia
            )?.from;
    }

    /**
     * Get the message identifier from wherever possible. Alias for
     * `this.msg?.message_id ?? this.messageReaction?.message_id ??
     * this.messageReactionCount?.message_id`.
     */
    get msgId(): number | undefined {
        // Keep in sync with types in `filter.ts`.
        return this.msg?.message_id ?? this.messageReaction?.message_id ??
            this.messageReactionCount?.message_id;
    }
    /**
     * Gets the chat identifier from wherever possible. Alias for
     * `this.chatJoinRequest?.user_chat_id ?? this.chat?.id ??
     * this.businessConnection?.user_chat_id`.
     */
    get chatId(): number | undefined {
        // Keep in sync with types in `filter.ts`.
        return this.chatJoinRequest?.user_chat_id ?? this.chat?.id ??
            this.businessConnection?.user_chat_id;
    }
    /**
     * Get the inline message identifier from wherever possible. Alias for
     * `(ctx.callbackQuery ?? ctx.chosenInlineResult)?.inline_message_id`.
     */
    get inlineMessageId(): string | undefined {
        return (
            this.callbackQuery?.inline_message_id ??
                this.chosenInlineResult?.inline_message_id
        );
    }
    /**
     * Get the business connection identifier from wherever possible. Alias for
     * `this.msg?.business_connection_id ?? this.businessConnection?.id ??
     * this.deletedBusinessMessages?.business_connection_id`.
     */
    get businessConnectionId(): string | undefined {
        // Keep in sync with types in `filter.ts`.
        return this.msg?.business_connection_id ??
            this.businessConnection?.id ??
            this.deletedBusinessMessages?.business_connection_id;
    }
    /**
     * Get entities and their text. Extracts the text from `ctx.msg.text` or
     * `ctx.msg.caption`. Returns an empty array if one of `ctx.msg`,
     * `ctx.msg.text` or `ctx.msg.entities` is undefined.
     *
     * You can filter specific entity types by passing the `types` parameter.
     * Example:
     *
     * ```ts
     * ctx.entities() // Returns all entity types
     * ctx.entities('url') // Returns only url entities
     * ctx.entities(['url', 'email']) // Returns url and email entities
     * ```
     *
     * @param types Types of entities to return. Omit to get all entities.
     * @returns Array of entities and their texts, or empty array when there's no text
     */
    entities(): Array<
        MessageEntity & {
            /** Slice of the message text that contains this entity */
            text: string;
        }
    >;
    entities<T extends MessageEntity["type"]>(
        types: MaybeArray<T>,
    ): Array<
        MessageEntity & {
            type: T;
            /** Slice of the message text that contains this entity */
            text: string;
        }
    >;
    entities(types?: MaybeArray<MessageEntity["type"]>) {
        const message = this.msg;
        if (message === undefined) return [];

        const text = message.text ?? message.caption;
        if (text === undefined) return [];
        let entities = message.entities ?? message.caption_entities;
        if (entities === undefined) return [];
        if (types !== undefined) {
            const filters = new Set(toArray(types));
            entities = entities.filter((entity) => filters.has(entity.type));
        }

        return entities.map((entity) => ({
            ...entity,
            text: text.substring(entity.offset, entity.offset + entity.length),
        }));
    }
    /**
     * Find out which reactions were added and removed in a `message_reaction`
     * update. This method looks at `ctx.messageReaction` and computes the
     * difference between the old reaction and the new reaction. It also groups
     * the reactions by emoji reactions and custom emoji reactions. For example,
     * the resulting object could look like this:
     * ```ts
     * {
     *   emoji: ['👍', '🎉']
     *   emojiAdded: ['🎉'],
     *   emojiKept: ['👍'],
     *   emojiRemoved: [],
     *   customEmoji: [],
     *   customEmojiAdded: [],
     *   customEmojiKept: [],
     *   customEmojiRemoved: ['id0123'],
     *   paid: true,
     *   paidAdded: false,
     *   paidRemoved: false,
     * }
     * ```
     * In the above example, a tada reaction was added by the user, and a custom
     * emoji reaction with the custom emoji 'id0123' was removed in the same
     * update. The user had already reacted with a thumbs up reaction and a paid
     * star reaction, which they left both unchanged. As a result, the current
     * reaction by the user is thumbs up, tada, and a paid reaction. Note that
     * the current reaction (all emoji reactions regardless of type in one list)
     * can also be obtained from `ctx.messageReaction.new_reaction`.
     *
     * Remember that reaction updates only include information about the
     * reaction of a specific user. The respective message may have many more
     * reactions by other people which will not be included in this update.
     *
     * @returns An object containing information about the reaction update
     */
    reactions(): {
        /** Emoji currently present in this user's reaction */
        emoji: ReactionTypeEmoji["emoji"][];
        /** Emoji newly added to this user's reaction */
        emojiAdded: ReactionTypeEmoji["emoji"][];
        /** Emoji not changed by the update to this user's reaction */
        emojiKept: ReactionTypeEmoji["emoji"][];
        /** Emoji removed from this user's reaction */
        emojiRemoved: ReactionTypeEmoji["emoji"][];
        /** Custom emoji currently present in this user's reaction */
        customEmoji: string[];
        /** Custom emoji newly added to this user's reaction */
        customEmojiAdded: string[];
        /** Custom emoji not changed by the update to this user's reaction */
        customEmojiKept: string[];
        /** Custom emoji removed from this user's reaction */
        customEmojiRemoved: string[];
        /**
         * `true` if a paid reaction is currently present in this user's
         * reaction, and `false` otherwise
         */
        paid: boolean;
        /**
         * `true` if a paid reaction was newly added to this user's reaction,
         * and `false` otherwise
         */
        paidAdded: boolean;
    } {
        const emoji: ReactionTypeEmoji["emoji"][] = [];
        const emojiAdded: ReactionTypeEmoji["emoji"][] = [];
        const emojiKept: ReactionTypeEmoji["emoji"][] = [];
        const emojiRemoved: ReactionTypeEmoji["emoji"][] = [];
        const customEmoji: string[] = [];
        const customEmojiAdded: string[] = [];
        const customEmojiKept: string[] = [];
        const customEmojiRemoved: string[] = [];
        let paid = false;
        let paidAdded = false;
        const r = this.messageReaction;
        if (r !== undefined) {
            const { old_reaction, new_reaction } = r;
            // group all current emoji in `emoji` and `customEmoji`
            for (const reaction of new_reaction) {
                if (reaction.type === "emoji") {
                    emoji.push(reaction.emoji);
                } else if (reaction.type === "custom_emoji") {
                    customEmoji.push(reaction.custom_emoji_id);
                } else if (reaction.type === "paid") {
                    paid = paidAdded = true;
                }
            }
            // temporarily move all old emoji to the *Removed arrays
            for (const reaction of old_reaction) {
                if (reaction.type === "emoji") {
                    emojiRemoved.push(reaction.emoji);
                } else if (reaction.type === "custom_emoji") {
                    customEmojiRemoved.push(reaction.custom_emoji_id);
                } else if (reaction.type === "paid") {
                    paidAdded = false;
                }
            }
            // temporarily move all new emoji to the *Added arrays
            emojiAdded.push(...emoji);
            customEmojiAdded.push(...customEmoji);
            // drop common emoji from both lists and add them to `emojiKept`
            for (let i = 0; i < emojiRemoved.length; i++) {
                const len = emojiAdded.length;
                if (len === 0) break;
                const rem = emojiRemoved[i];
                for (let j = 0; j < len; j++) {
                    if (rem === emojiAdded[j]) {
                        emojiKept.push(rem);
                        emojiRemoved.splice(i, 1);
                        emojiAdded.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }
            // drop common custom emoji from both lists and add them to `customEmojiKept`
            for (let i = 0; i < customEmojiRemoved.length; i++) {
                const len = customEmojiAdded.length;
                if (len === 0) break;
                const rem = customEmojiRemoved[i];
                for (let j = 0; j < len; j++) {
                    if (rem === customEmojiAdded[j]) {
                        customEmojiKept.push(rem);
                        customEmojiRemoved.splice(i, 1);
                        customEmojiAdded.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }
        }
        return {
            emoji,
            emojiAdded,
            emojiKept,
            emojiRemoved,
            customEmoji,
            customEmojiAdded,
            customEmojiKept,
            customEmojiRemoved,
            paid,
            paidAdded,
        };
    }

    // PROBING SHORTCUTS

    /**
     * `Context.has` is an object that contains a number of useful functions for
     * probing context objects. Each of these functions can generate a predicate
     * function, to which you can pass context objects in order to check if a
     * condition holds for the respective context object.
     *
     * For example, you can call `Context.has.filterQuery(":text")` to generate
     * a predicate function that tests context objects for containing text:
     * ```ts
     * const hasText = Context.has.filterQuery(":text");
     *
     * if (hasText(ctx0)) {} // `ctx0` matches the filter query `:text`
     * if (hasText(ctx1)) {} // `ctx1` matches the filter query `:text`
     * if (hasText(ctx2)) {} // `ctx2` matches the filter query `:text`
     * ```
     * These predicate functions are used internally by the has-methods that are
     * installed on every context object. This means that calling
     * `ctx.has(":text")` is equivalent to
     * `Context.has.filterQuery(":text")(ctx)`.
     */
    static has = checker;
    /**
     * Returns `true` if this context object matches the given filter query, and
     * `false` otherwise. This uses the same logic as `bot.on`.
     *
     * @param filter The filter query to check
     */
    has<Q extends FilterQuery>(filter: Q | Q[]): this is FilterCore<Q> {
        return Context.has.filterQuery(filter)(this);
    }
    /**
     * Returns `true` if this context object contains the given text, or if it
     * contains text that matches the given regular expression. It returns
     * `false` otherwise. This uses the same logic as `bot.hears`.
     *
     * @param trigger The string or regex to match
     */
    hasText(trigger: MaybeArray<string | RegExp>): this is HearsContextCore {
        return Context.has.text(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given command, and
     * `false` otherwise. This uses the same logic as `bot.command`.
     *
     * @param command The command to match
     */
    hasCommand(
        command: MaybeArray<StringWithCommandSuggestions>,
    ): this is CommandContextCore {
        return Context.has.command(command)(this);
    }
    hasReaction(
        reaction: MaybeArray<ReactionTypeEmoji["emoji"] | ReactionType>,
    ): this is ReactionContextCore {
        return Context.has.reaction(reaction)(this);
    }
    /**
     * Returns `true` if this context object belongs to a chat with the given
     * chat type, and `false` otherwise. This uses the same logic as
     * `bot.chatType`.
     *
     * @param chatType The chat type to match
     */
    hasChatType<T extends Chat["type"]>(
        chatType: MaybeArray<T>,
    ): this is ChatTypeContextCore<T> {
        return Context.has.chatType(chatType)(this);
    }
    /**
     * Returns `true` if this context object contains the given callback query,
     * or if the contained callback query data matches the given regular
     * expression. It returns `false` otherwise. This uses the same logic as
     * `bot.callbackQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasCallbackQuery(
        trigger: MaybeArray<string | RegExp>,
    ): this is CallbackQueryContextCore {
        return Context.has.callbackQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given game query, or
     * if the contained game query matches the given regular expression. It
     * returns `false` otherwise. This uses the same logic as `bot.gameQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasGameQuery(
        trigger: MaybeArray<string | RegExp>,
    ): this is GameQueryContextCore {
        return Context.has.gameQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given inline query, or
     * if the contained inline query matches the given regular expression. It
     * returns `false` otherwise. This uses the same logic as `bot.inlineQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasInlineQuery(
        trigger: MaybeArray<string | RegExp>,
    ): this is InlineQueryContextCore {
        return Context.has.inlineQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the chosen inline result,
     * or if the contained chosen inline result matches the given regular
     * expression. It returns `false` otherwise. This uses the same logic as
     * `bot.chosenInlineResult`.
     *
     * @param trigger The string or regex to match
     */
    hasChosenInlineResult(
        trigger: MaybeArray<string | RegExp>,
    ): this is ChosenInlineResultContextCore {
        return Context.has.chosenInlineResult(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given pre-checkout
     * query, or if the contained pre-checkout query matches the given regular
     * expression. It returns `false` otherwise. This uses the same logic as
     * `bot.preCheckoutQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasPreCheckoutQuery(
        trigger: MaybeArray<string | RegExp>,
    ): this is PreCheckoutQueryContextCore {
        return Context.has.preCheckoutQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given shipping query,
     * or if the contained shipping query matches the given regular expression.
     * It returns `false` otherwise. This uses the same logic as
     * `bot.shippingQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasShippingQuery(
        trigger: MaybeArray<string | RegExp>,
    ): this is ShippingQueryContextCore {
        return Context.has.shippingQuery(trigger)(this);
    }

    // API
}

// === Filtered context types
type HearsContextCore =
    & FilterCore<":text" | ":caption">
    & NarrowMatchCore<string | RegExpMatchArray>;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.hears`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * `bot.hears` does it. This allows you to annotate context objects in
 * middleware that is not directly passed to `bot.hears`, hence not inferring
 * the correct type automatically. That way, handlers can be defined in separate
 * files and still have the correct types.
 */
export type HearsContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string | RegExpMatchArray>,
    ":text" | ":caption"
>;

type CommandContextCore =
    & FilterCore<":entities:bot_command">
    & NarrowMatchCore<string>;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.command`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * `bot.command` does it. This allows you to annotate context objects in
 * middleware that is not directly passed to `bot.command`, hence not inferring
 * the correct type automatically. That way, handlers can be defined in separate
 * files and still have the correct types.
 */
export type CommandContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string>,
    ":entities:bot_command"
>;
type NarrowMatchCore<T extends Context["match"]> = { match: T };
type NarrowMatch<C extends Context, T extends C["match"]> = {
    [K in keyof C]: K extends "match" ? (T extends C[K] ? T : never) : C[K];
};

type CallbackQueryContextCore = FilterCore<"callback_query:data">;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.callbackQuery`.
 *
 * This helper type can be used to annotate narrow down context objects the same
 * way `bot.callbackQuery` does it. This allows you to how context objects in
 * middleware that is not directly passed to `bot.callbackQuery`, hence not
 * inferring the correct type automatically. That way, handlers can be defined
 * in separate files and still have the correct types.
 */
export type CallbackQueryContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string | RegExpMatchArray>,
    "callback_query:data"
>;

type GameQueryContextCore = FilterCore<"callback_query:game_short_name">;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.gameQuery`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * `bot.gameQuery` does it. This allows you to annotate context objects in
 * middleware that is not directly passed to `bot.gameQuery`, hence not
 * inferring the correct type automatically. That way, handlers can be defined
 * in separate files and still have the correct types.
 */
export type GameQueryContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string | RegExpMatchArray>,
    "callback_query:game_short_name"
>;

type InlineQueryContextCore = FilterCore<"inline_query">;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.inlineQuery`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * annotate `bot.inlineQuery` does it. This allows you to context objects in
 * middleware that is not directly passed to `bot.inlineQuery`, hence not
 * inferring the correct type automatically. That way, handlers can be defined
 * in separate files and still have the correct types.
 */
export type InlineQueryContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string | RegExpMatchArray>,
    "inline_query"
>;

type ReactionContextCore = FilterCore<"message_reaction">;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.reaction`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * annotate `bot.reaction` does it. This allows you to context objects in
 * middleware that is not directly passed to `bot.reaction`, hence not inferring
 * the correct type automatically. That way, handlers can be defined in separate
 * files and still have the correct types.
 */
export type ReactionContext<C extends Context> = FilterQueryContext<
    C,
    "message_reaction"
>;

type ChosenInlineResultContextCore = FilterCore<"chosen_inline_result">;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.chosenInlineResult`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * annotate `bot.chosenInlineResult` does it. This allows you to context objects in
 * middleware that is not directly passed to `bot.chosenInlineResult`, hence not
 * inferring the correct type automatically. That way, handlers can be defined
 * in separate files and still have the correct types.
 */
export type ChosenInlineResultContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string | RegExpMatchArray>,
    "chosen_inline_result"
>;

type PreCheckoutQueryContextCore = FilterCore<"pre_checkout_query">;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.preCheckoutQuery`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * annotate `bot.preCheckoutQuery` does it. This allows you to context objects in
 * middleware that is not directly passed to `bot.preCheckoutQuery`, hence not
 * inferring the correct type automatically. That way, handlers can be defined
 * in separate files and still have the correct types.
 */
export type PreCheckoutQueryContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string | RegExpMatchArray>,
    "pre_checkout_query"
>;

type ShippingQueryContextCore = FilterCore<"shipping_query">;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.shippingQuery`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * annotate `bot.shippingQuery` does it. This allows you to context objects in
 * middleware that is not directly passed to `bot.shippingQuery`, hence not
 * inferring the correct type automatically. That way, handlers can be defined
 * in separate files and still have the correct types.
 */
export type ShippingQueryContext<C extends Context> = FilterQueryContext<
    NarrowMatch<C, string | RegExpMatchArray>,
    "shipping_query"
>;

type ChatTypeContextCore<T extends Chat["type"]> = T extends unknown ?
        & Record<"update", ChatTypeUpdate<T>> // ctx.update
        & ChatType<T> // ctx.chat
        & Record<"chatId", number> // ctx.chatId
        & ChatFrom<T> // ctx.from
        & ChatTypeRecord<"msg", T> // ctx.msg
        & AliasProps<ChatTypeUpdate<T>> // ctx.message etc
    : never;
/**
 * Type of the context object that is available inside the handlers for
 * `bot.chatType`.
 *
 * This helper type can be used to narrow down context objects the same way how
 * `bot.chatType` does it. This allows you to annotate context objects in
 * middleware that is not directly passed to `bot.chatType`, hence not inferring
 * the correct type automatically. That way, handlers can be defined in separate
 * files and still have the correct types.
 */
export type ChatTypeContext<C extends Context, T extends Chat["type"]> =
    T extends unknown ? C & ChatTypeContextCore<T> : never;
type ChatTypeUpdate<T extends Chat["type"]> =
    & ChatTypeRecord<
        | "message"
        | "edited_message"
        | "channel_post"
        | "edited_channel_post"
        | "my_chat_member"
        | "chat_member"
        | "chat_join_request",
        T
    >
    & Partial<Record<"callback_query", ChatTypeRecord<"message", T>>>
    & ConstrainUpdatesByChatType<T>;
type ConstrainUpdatesByChatType<T extends Chat["type"]> = Record<
    [T] extends ["channel"] ? "message" | "edited_message"
        : "channel_post" | "edited_channel_post",
    undefined
>;

type ChatTypeRecord<K extends string, T extends Chat["type"]> = Partial<
    Record<K, ChatType<T>>
>;
interface ChatType<T extends Chat["type"]> {
    chat: { type: T };
}
interface ChatFrom<T extends Chat["type"]> {
    // deno-lint-ignore ban-types
    from: [T] extends ["private"] ? {} : unknown;
}

// === Util functions
// function orThrow<T>(value: T | undefined, method: string): T {
//     if (value === undefined) {
//         throw new Error(`Missing information for API call to ${method}`);
//     }
//     return value;
// }

function triggerFn(trigger: MaybeArray<string | RegExp>) {
    return toArray(trigger).map((t) =>
        typeof t === "string"
            ? (txt: string) => (txt === t ? t : null)
            : (txt: string) => txt.match(t)
    );
}

function match<C extends Context>(
    ctx: C,
    content: string,
    triggers: Array<(content: string) => string | RegExpMatchArray | null>,
): boolean {
    for (const t of triggers) {
        const res = t(content);
        if (res) {
            ctx.match = res;
            return true;
        }
    }
    return false;
}
function toArray<E>(e: MaybeArray<E>): E[] {
    return Array.isArray(e) ? e : [e];
}
