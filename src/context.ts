// deno-lint-ignore-file camelcase
import { type Api, type Other as OtherApi } from "./core/api.ts";
import { type Methods, type RawApi } from "./core/client.ts";
import {
    type Filter,
    type FilterCore,
    type FilterQuery,
    matchFilter,
} from "./filter.ts";
import {
    type Chat,
    type ChatPermissions,
    type InlineQueryResult,
    type InputFile,
    type InputMedia,
    type InputMediaAudio,
    type InputMediaDocument,
    type InputMediaPhoto,
    type InputMediaVideo,
    type InputPaidMedia,
    type InputPollOption,
    type LabeledPrice,
    type Message,
    type MessageEntity,
    type PassportElementError,
    type ReactionType,
    type ReactionTypeEmoji,
    type Update,
    type User,
    type UserFromGetMe,
} from "./types.ts";

// === Util types
export type MaybeArray<T> = T | T[];
/** permits `string` but gives hints */
export type StringWithCommandSuggestions =
    | (string & Record<never, never>)
    | "start"
    | "help"
    | "settings"
    | "privacy";

type Other<M extends Methods<RawApi>, X extends string = never> = OtherApi<
    RawApi,
    M,
    X
>;
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
    ): <C extends Context>(ctx: C) => ctx is Filter<C, Q>;
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
        return <C extends Context>(ctx: C): ctx is Filter<C, Q> => pred(ctx);
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
        return <C extends Context>(ctx: C): ctx is ReactionContext<C> => {
            if (!hasMessageReaction(ctx)) return false;
            const { old_reaction, new_reaction } = ctx.messageReaction;
            for (const reaction of new_reaction) {
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
                } else {
                    // always regard unsupported emoji types as new
                }
                if (!isOld) {
                    if (reaction.type === "emoji") {
                        for (const wanted of normalized) {
                            if (wanted.type !== "emoji") continue;
                            if (wanted.emoji === reaction.emoji) {
                                return true;
                            }
                        }
                    } else if (reaction.type === "custom_emoji") {
                        for (const wanted of normalized) {
                            if (wanted.type !== "custom_emoji") continue;
                            if (
                                wanted.custom_emoji_id ===
                                    reaction.custom_emoji_id
                            ) {
                                return true;
                            }
                        }
                    } else {
                        // always regard unsupported emoji types as new
                        return true;
                    }
                }
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
 *    `ctx.reply`. This is nothing but a wrapper for `ctx.api.sendMessage` with
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
 * Read up about middleware on the
 * [website](https://grammy.dev/guide/context.html) if you want to know more
 * about the powerful opportunities that lie in context objects, and about how
 * grammY implements them.
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
     * Get the sender chat object from wherever possible. Alias for
     * `ctx.msg?.sender_chat`.
     */
    get senderChat(): Chat | undefined {
        // Keep in sync with types in `filter.ts`.
        return this.msg?.sender_chat;
    }
    /**
     * Get the user object from wherever possible. Alias for
     * `(this.businessConnection ?? this.messageReaction ??
     * (this.chatBoost?.boost ?? this.removedChatBoost)?.source)?.user ??
     * (this.callbackQuery ?? this.msg ?? this.inlineQuery ??
     * this.chosenInlineResult ?? this.shippingQuery ?? this.preCheckoutQuery ??
     * this.myChatMember ?? this.chatMember ?? this.chatJoinRequest)?.from`.
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
                    this.chatJoinRequest
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
     * Gets the chat identifier from wherever possible. Alias for `this.chat?.id
     * ?? this.businessConnection?.user_chat_id`.
     */
    get chatId(): number | undefined {
        // Keep in sync with types in `filter.ts`.
        return this.chat?.id ?? this.businessConnection?.user_chat_id;
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
     * ctx.enttities(['url', 'email']) // Returns url and email entities
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
     * }
     * ```
     * In the above example, a tada reaction was added by the user, and a custom
     * emoji reaction with the custom emoji 'id0123' was removed in the same
     * update. The user had already reacted with a thumbs up reaction, which
     * they left unchanged. As a result, the current reaction by the user is
     * thumbs up and tada. Note that the current reaction (both emoji and custom
     * emoji in one list) can also be obtained from
     * `ctx.messageReaction.new_reaction`.
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
    } {
        const emoji: ReactionTypeEmoji["emoji"][] = [];
        const emojiAdded: ReactionTypeEmoji["emoji"][] = [];
        const emojiKept: ReactionTypeEmoji["emoji"][] = [];
        const emojiRemoved: ReactionTypeEmoji["emoji"][] = [];
        const customEmoji: string[] = [];
        const customEmojiAdded: string[] = [];
        const customEmojiKept: string[] = [];
        const customEmojiRemoved: string[] = [];
        const r = this.messageReaction;
        if (r !== undefined) {
            const { old_reaction, new_reaction } = r;
            // group all current emoji in `emoji` and `customEmoji`
            for (const reaction of new_reaction) {
                if (reaction.type === "emoji") {
                    emoji.push(reaction.emoji);
                } else if (reaction.type === "custom_emoji") {
                    customEmoji.push(reaction.custom_emoji_id);
                }
            }
            // temporarily move all old emoji to the *Removed arrays
            for (const reaction of old_reaction) {
                if (reaction.type === "emoji") {
                    emojiRemoved.push(reaction.emoji);
                } else if (reaction.type === "custom_emoji") {
                    customEmojiRemoved.push(reaction.custom_emoji_id);
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

    /**
     * Context-aware alias for `api.sendMessage`. Use this method to send text messages. On success, the sent Message is returned.
     *
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendmessage
     */
    reply(
        text: string,
        other?: Other<"sendMessage", "chat_id" | "text">,
        signal?: AbortSignal,
    ) {
        return this.api.sendMessage(
            orThrow(this.chatId, "sendMessage"),
            text,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.forwardMessage`. Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#forwardmessage
     */
    forwardMessage(
        chat_id: number | string,
        other?: Other<
            "forwardMessage",
            "chat_id" | "from_chat_id" | "message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.forwardMessage(
            chat_id,
            orThrow(this.chatId, "forwardMessage"),
            orThrow(this.msgId, "forwardMessage"),
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.forwardMessages`. Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of MessageId of the sent messages is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages in the current chat to forward. The identifiers must be specified in a strictly increasing order.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#forwardmessages
     */
    forwardMessages(
        chat_id: number | string,
        message_ids: number[],
        other?: Other<
            "forwardMessages",
            "chat_id" | "from_chat_id" | "message_ids"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.forwardMessages(
            chat_id,
            orThrow(this.chatId, "forwardMessages"),
            message_ids,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.copyMessage`. Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#copymessage
     */
    copyMessage(
        chat_id: number | string,
        other?: Other<"copyMessage", "chat_id" | "from_chat_id" | "message_id">,
        signal?: AbortSignal,
    ) {
        return this.api.copyMessage(
            chat_id,
            orThrow(this.chatId, "copyMessage"),
            orThrow(this.msgId, "copyMessage"),
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.copyMessages`. Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of MessageId of the sent messages is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages in the current chat to copy. The identifiers must be specified in a strictly increasing order.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#copymessages
     */
    copyMessages(
        chat_id: number | string,
        message_ids: number[],
        other?: Other<
            "copyMessages",
            "chat_id" | "from_chat_id" | "message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.copyMessages(
            chat_id,
            orThrow(this.chatId, "copyMessages"),
            message_ids,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendPhoto`. Use this method to send photos. On success, the sent Message is returned.
     *
     * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendphoto
     */
    replyWithPhoto(
        photo: InputFile | string,
        other?: Other<"sendPhoto", "chat_id" | "photo">,
        signal?: AbortSignal,
    ) {
        return this.api.sendPhoto(
            orThrow(this.chatId, "sendPhoto"),
            photo,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendAudio`. Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     *
     * For sending voice messages, use the sendVoice method instead.
     *
     * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendaudio
     */
    replyWithAudio(
        audio: InputFile | string,
        other?: Other<"sendAudio", "chat_id" | "audio">,
        signal?: AbortSignal,
    ) {
        return this.api.sendAudio(
            orThrow(this.chatId, "sendAudio"),
            audio,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendDocument`. Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#senddocument
     */
    replyWithDocument(
        document: InputFile | string,
        other?: Other<"sendDocument", "chat_id" | "document">,
        signal?: AbortSignal,
    ) {
        return this.api.sendDocument(
            orThrow(this.chatId, "sendDocument"),
            document,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendVideo`. Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvideo
     */
    replyWithVideo(
        video: InputFile | string,
        other?: Other<"sendVideo", "chat_id" | "video">,
        signal?: AbortSignal,
    ) {
        return this.api.sendVideo(
            orThrow(this.chatId, "sendVideo"),
            video,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendAnimation`. Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendanimation
     */
    replyWithAnimation(
        animation: InputFile | string,
        other?: Other<"sendAnimation", "chat_id" | "animation">,
        signal?: AbortSignal,
    ) {
        return this.api.sendAnimation(
            orThrow(this.chatId, "sendAnimation"),
            animation,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendVoice`. Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvoice
     */
    replyWithVoice(
        voice: InputFile | string,
        other?: Other<"sendVoice", "chat_id" | "voice">,
        signal?: AbortSignal,
    ) {
        return this.api.sendVoice(
            orThrow(this.chatId, "sendVoice"),
            voice,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendVideoNote`. Use this method to send video messages. On success, the sent Message is returned.
     * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long.
     *
     * @param video_note Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data.. Sending video notes by a URL is currently unsupported
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvideonote
     */
    replyWithVideoNote(
        video_note: InputFile | string,
        other?: Other<"sendVideoNote", "chat_id" | "video_note">,
        signal?: AbortSignal,
    ) {
        return this.api.sendVideoNote(
            orThrow(this.chatId, "sendVideoNote"),
            video_note,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendMediaGroup`. Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of Messages that were sent is returned.
     *
     * @param media An array describing messages to be sent, must include 2-10 items
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendmediagroup
     */
    replyWithMediaGroup(
        media: ReadonlyArray<
            | InputMediaAudio
            | InputMediaDocument
            | InputMediaPhoto
            | InputMediaVideo
        >,
        other?: Other<"sendMediaGroup", "chat_id" | "media">,
        signal?: AbortSignal,
    ) {
        return this.api.sendMediaGroup(
            orThrow(this.chatId, "sendMediaGroup"),
            media,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendLocation`. Use this method to send point on the map. On success, the sent Message is returned.
     *
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendlocation
     */
    replyWithLocation(
        latitude: number,
        longitude: number,
        other?: Other<"sendLocation", "chat_id" | "latitude" | "longitude">,
        signal?: AbortSignal,
    ) {
        return this.api.sendLocation(
            orThrow(this.chatId, "sendLocation"),
            latitude,
            longitude,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.editMessageLiveLocation`. Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagelivelocation
     */
    editMessageLiveLocation(
        latitude: number,
        longitude: number,
        other?: Other<
            "editMessageLiveLocation",
            | "chat_id"
            | "message_id"
            | "inline_message_id"
            | "latitude"
            | "longitude"
        >,
        signal?: AbortSignal,
    ) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageLiveLocationInline(
                inlineId,
                latitude,
                longitude,
                other,
            )
            : this.api.editMessageLiveLocation(
                orThrow(this.chatId, "editMessageLiveLocation"),
                orThrow(this.msgId, "editMessageLiveLocation"),
                latitude,
                longitude,
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.stopMessageLiveLocation`. Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#stopmessagelivelocation
     */
    stopMessageLiveLocation(
        other?: Other<
            "stopMessageLiveLocation",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.stopMessageLiveLocationInline(inlineId, other)
            : this.api.stopMessageLiveLocation(
                orThrow(this.chatId, "stopMessageLiveLocation"),
                orThrow(this.msgId, "stopMessageLiveLocation"),
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.sendPaidMedia`. Use this method to send paid media to channel chats. On success, the sent Message is returned.
     *
     * @param star_count The number of Telegram Stars that must be paid to buy access to the media
     * @param media An array describing the media to be sent; up to 10 items
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendpaidmedia
     */
    sendPaidMedia(
        star_count: number,
        media: InputPaidMedia[],
        other?: Other<"sendPaidMedia", "chat_id" | "star_count" | "media">,
        signal?: AbortSignal,
    ) {
        return this.api.sendPaidMedia(
            orThrow(this.chatId, "sendPaidMedia"),
            star_count,
            media,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendVenue`. Use this method to send information about a venue. On success, the sent Message is returned.
     *
     * @param latitude Latitude of the venue
     * @param longitude Longitude of the venue
     * @param title Name of the venue
     * @param address Address of the venue
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvenue
     */
    replyWithVenue(
        latitude: number,
        longitude: number,
        title: string,
        address: string,
        other?: Other<
            "sendVenue",
            "chat_id" | "latitude" | "longitude" | "title" | "address"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.sendVenue(
            orThrow(this.chatId, "sendVenue"),
            latitude,
            longitude,
            title,
            address,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendContact`. Use this method to send phone contacts. On success, the sent Message is returned.
     *
     * @param phone_number Contact's phone number
     * @param first_name Contact's first name
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendcontact
     */
    replyWithContact(
        phone_number: string,
        first_name: string,
        other?: Other<"sendContact", "chat_id" | "phone_number" | "first_name">,
        signal?: AbortSignal,
    ) {
        return this.api.sendContact(
            orThrow(this.chatId, "sendContact"),
            phone_number,
            first_name,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendPoll`. Use this method to send a native poll. On success, the sent Message is returned.
     *
     * @param question Poll question, 1-300 characters
     * @param options A list of answer options, 2-10 strings 1-100 characters each
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendpoll
     */
    replyWithPoll(
        question: string,
        options: InputPollOption[],
        other?: Other<"sendPoll", "chat_id" | "question" | "options">,
        signal?: AbortSignal,
    ) {
        return this.api.sendPoll(
            orThrow(this.chatId, "sendPoll"),
            question,
            options,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendDice`. Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
     *
     * @param emoji Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, “🏀”, “⚽”, or “🎰”. Dice can have values 1-6 for “🎲” and “🎯”, values 1-5 for “🏀” and “⚽”, and values 1-64 for “🎰”. Defaults to “🎲”
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#senddice
     */
    replyWithDice(
        emoji: string,
        other?: Other<"sendDice", "chat_id" | "emoji">,
        signal?: AbortSignal,
    ) {
        return this.api.sendDice(
            orThrow(this.chatId, "sendDice"),
            emoji,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendChatAction`. Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
     *
     * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
     *
     * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
     *
     * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendchataction
     */
    replyWithChatAction(
        action:
            | "typing"
            | "upload_photo"
            | "record_video"
            | "upload_video"
            | "record_voice"
            | "upload_voice"
            | "upload_document"
            | "choose_sticker"
            | "find_location"
            | "record_video_note"
            | "upload_video_note",
        other?: Other<"sendChatAction", "chat_id" | "action">,
        signal?: AbortSignal,
    ) {
        return this.api.sendChatAction(
            orThrow(this.chatId, "sendChatAction"),
            action,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setMessageReaction`. Use this method to change the chosen reactions on a message. Service messages can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. In albums, bots must react to the first message. Returns True on success.
     *
     * @param reaction A list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmessagereaction
     */
    react(
        reaction: MaybeArray<ReactionTypeEmoji["emoji"] | ReactionType>,
        other?: Other<
            "setMessageReaction",
            "chat_id" | "message_id" | "reaction"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.setMessageReaction(
            orThrow(this.chatId, "setMessageReaction"),
            orThrow(this.msgId, "setMessageReaction"),
            typeof reaction === "string"
                ? [{ type: "emoji", emoji: reaction }]
                : (Array.isArray(reaction) ? reaction : [reaction])
                    .map((emoji) =>
                        typeof emoji === "string"
                            ? { type: "emoji", emoji }
                            : emoji
                    ),
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.getUserProfilePhotos`. Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getuserprofilephotos
     */
    getUserProfilePhotos(
        other?: Other<"getUserProfilePhotos", "user_id">,
        signal?: AbortSignal,
    ) {
        return this.api.getUserProfilePhotos(
            orThrow(this.from, "getUserProfilePhotos").id,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.getUserChatBoosts`. Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.
     *
     * @param chat_id Unique identifier for the chat or username of the channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getuserchatboosts
     */
    getUserChatBoosts(chat_id: number | string, signal?: AbortSignal) {
        return this.api.getUserChatBoosts(
            chat_id,
            orThrow(this.from, "getUserChatBoosts").id,
            signal,
        );
    }

    /**
     *  Context-aware alias for `api.getBusinessConnection`. Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getbusinessconnection
     */
    getBusinessConnection(signal?: AbortSignal) {
        return this.api.getBusinessConnection(
            orThrow(this.businessConnectionId, "getBusinessConnection"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.getFile`. Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
     *
     * Note: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getfile
     */
    getFile(signal?: AbortSignal) {
        const m = orThrow(this.msg, "getFile");
        const file = m.photo !== undefined
            ? m.photo[m.photo.length - 1]
            : m.animation ??
                m.audio ??
                m.document ??
                m.video ??
                m.video_note ??
                m.voice ??
                m.sticker;
        return this.api.getFile(orThrow(file, "getFile").file_id, signal);
    }

    /** @deprecated Use `banAuthor` instead. */
    kickAuthor(...args: Parameters<Context["banAuthor"]>) {
        return this.banAuthor(...args);
    }

    /**
     * Context-aware alias for `api.banChatMember`. Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatmember
     */
    banAuthor(
        other?: Other<"banChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.api.banChatMember(
            orThrow(this.chatId, "banAuthor"),
            orThrow(this.from, "banAuthor").id,
            other,
            signal,
        );
    }

    /** @deprecated Use `banChatMember` instead. */
    kickChatMember(...args: Parameters<Context["banChatMember"]>) {
        return this.banChatMember(...args);
    }

    /**
     * Context-aware alias for `api.banChatMember`. Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatmember
     */
    banChatMember(
        user_id: number,
        other?: Other<"banChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.api.banChatMember(
            orThrow(this.chatId, "banChatMember"),
            user_id,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.unbanChatMember`. Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unbanchatmember
     */
    unbanChatMember(
        user_id: number,
        other?: Other<"unbanChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.api.unbanChatMember(
            orThrow(this.chatId, "unbanChatMember"),
            user_id,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.restrictChatMember`. Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     *
     * @param permissions An object for new user permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#restrictchatmember
     */
    restrictAuthor(
        permissions: ChatPermissions,
        other?: Other<
            "restrictChatMember",
            "chat_id" | "user_id" | "permissions"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.restrictChatMember(
            orThrow(this.chatId, "restrictAuthor"),
            orThrow(this.from, "restrictAuthor").id,
            permissions,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.restrictChatMember`. Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param permissions An object for new user permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#restrictchatmember
     */
    restrictChatMember(
        user_id: number,
        permissions: ChatPermissions,
        other?: Other<
            "restrictChatMember",
            "chat_id" | "user_id" | "permissions"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.restrictChatMember(
            orThrow(this.chatId, "restrictChatMember"),
            user_id,
            permissions,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.promoteChatMember`. Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#promotechatmember
     */
    promoteAuthor(
        other?: Other<"promoteChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.api.promoteChatMember(
            orThrow(this.chatId, "promoteAuthor"),
            orThrow(this.from, "promoteAuthor").id,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.promoteChatMember`. Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#promotechatmember
     */
    promoteChatMember(
        user_id: number,
        other?: Other<"promoteChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.api.promoteChatMember(
            orThrow(this.chatId, "promoteChatMember"),
            user_id,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatAdministratorCustomTitle`. Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     *
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatadministratorcustomtitle
     */
    setChatAdministratorAuthorCustomTitle(
        custom_title: string,
        signal?: AbortSignal,
    ) {
        return this.api.setChatAdministratorCustomTitle(
            orThrow(this.chatId, "setChatAdministratorAuthorCustomTitle"),
            orThrow(this.from, "setChatAdministratorAuthorCustomTitle").id,
            custom_title,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatAdministratorCustomTitle`. Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatadministratorcustomtitle
     */
    setChatAdministratorCustomTitle(
        user_id: number,
        custom_title: string,
        signal?: AbortSignal,
    ) {
        return this.api.setChatAdministratorCustomTitle(
            orThrow(this.chatId, "setChatAdministratorCustomTitle"),
            user_id,
            custom_title,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.banChatSenderChat`. Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatsenderchat
     */
    banChatSenderChat(sender_chat_id: number, signal?: AbortSignal) {
        return this.api.banChatSenderChat(
            orThrow(this.chatId, "banChatSenderChat"),
            sender_chat_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.unbanChatSenderChat`. Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unbanchatsenderchat
     */
    unbanChatSenderChat(
        sender_chat_id: number,
        signal?: AbortSignal,
    ) {
        return this.api.unbanChatSenderChat(
            orThrow(this.chatId, "unbanChatSenderChat"),
            sender_chat_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatPermissions`. Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
     *
     * @param permissions New default chat permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatpermissions
     */
    setChatPermissions(
        permissions: ChatPermissions,
        other?: Other<"setChatPermissions", "chat_id" | "permissions">,
        signal?: AbortSignal,
    ) {
        return this.api.setChatPermissions(
            orThrow(this.chatId, "setChatPermissions"),
            permissions,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.exportChatInviteLink`. Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
     *
     * Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink or by calling the getChat method. If your bot needs to generate a new primary invite link replacing its previous one, use exportChatInviteLink again.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#exportchatinvitelink
     */
    exportChatInviteLink(signal?: AbortSignal) {
        return this.api.exportChatInviteLink(
            orThrow(this.chatId, "exportChatInviteLink"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.createChatInviteLink`. Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createchatinvitelink
     */
    createChatInviteLink(
        other?: Other<"createChatInviteLink", "chat_id">,
        signal?: AbortSignal,
    ) {
        return this.api.createChatInviteLink(
            orThrow(this.chatId, "createChatInviteLink"),
            other,
            signal,
        );
    }

    /**
     *  Context-aware alias for `api.editChatInviteLink`. Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
     *
     * @param invite_link The invite link to edit
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editchatinvitelink
     */
    editChatInviteLink(
        invite_link: string,
        other?: Other<"editChatInviteLink", "chat_id" | "invite_link">,
        signal?: AbortSignal,
    ) {
        return this.api.editChatInviteLink(
            orThrow(this.chatId, "editChatInviteLink"),
            invite_link,
            other,
            signal,
        );
    }

    /**
     *  Context-aware alias for `api.revokeChatInviteLink`. Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
     *
     * @param invite_link The invite link to revoke
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#revokechatinvitelink
     */
    revokeChatInviteLink(invite_link: string, signal?: AbortSignal) {
        return this.api.revokeChatInviteLink(
            orThrow(this.chatId, "editChatInviteLink"),
            invite_link,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.approveChatJoinRequest`. Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#approvechatjoinrequest
     */
    approveChatJoinRequest(
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.api.approveChatJoinRequest(
            orThrow(this.chatId, "approveChatJoinRequest"),
            user_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.declineChatJoinRequest`. Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#declinechatjoinrequest
     */
    declineChatJoinRequest(
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.api.declineChatJoinRequest(
            orThrow(this.chatId, "declineChatJoinRequest"),
            user_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatPhoto`. Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param photo New chat photo, uploaded using multipart/form-data
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatphoto
     */
    setChatPhoto(photo: InputFile, signal?: AbortSignal) {
        return this.api.setChatPhoto(
            orThrow(this.chatId, "setChatPhoto"),
            photo,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.deleteChatPhoto`. Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletechatphoto
     */
    deleteChatPhoto(signal?: AbortSignal) {
        return this.api.deleteChatPhoto(
            orThrow(this.chatId, "deleteChatPhoto"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatTitle`. Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param title New chat title, 1-255 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchattitle
     */
    setChatTitle(title: string, signal?: AbortSignal) {
        return this.api.setChatTitle(
            orThrow(this.chatId, "setChatTitle"),
            title,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatDescription`. Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param description New chat description, 0-255 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatdescription
     */
    setChatDescription(description: string | undefined, signal?: AbortSignal) {
        return this.api.setChatDescription(
            orThrow(this.chatId, "setChatDescription"),
            description,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.pinChatMessage`. Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param message_id Identifier of a message to pin
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#pinchatmessage
     */
    pinChatMessage(
        message_id: number,
        other?: Other<"pinChatMessage", "chat_id" | "message_id">,
        signal?: AbortSignal,
    ) {
        return this.api.pinChatMessage(
            orThrow(this.chatId, "pinChatMessage"),
            message_id,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.unpinChatMessage`. Use this method to remove a message from the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param message_id Identifier of a message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinchatmessage
     */
    unpinChatMessage(message_id?: number, signal?: AbortSignal) {
        return this.api.unpinChatMessage(
            orThrow(this.chatId, "unpinChatMessage"),
            message_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.unpinAllChatMessages`. Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallchatmessages
     */
    unpinAllChatMessages(signal?: AbortSignal) {
        return this.api.unpinAllChatMessages(
            orThrow(this.chatId, "unpinAllChatMessages"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.leaveChat`. Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#leavechat
     */
    leaveChat(signal?: AbortSignal) {
        return this.api.leaveChat(orThrow(this.chatId, "leaveChat"), signal);
    }

    /**
     * Context-aware alias for `api.getChat`. Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchat
     */
    getChat(signal?: AbortSignal) {
        return this.api.getChat(orThrow(this.chatId, "getChat"), signal);
    }

    /**
     * Context-aware alias for `api.getChatAdministrators`. Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of ChatMember objects.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatadministrators
     */
    getChatAdministrators(signal?: AbortSignal) {
        return this.api.getChatAdministrators(
            orThrow(this.chatId, "getChatAdministrators"),
            signal,
        );
    }

    /** @deprecated Use `getChatMembersCount` instead. */
    getChatMembersCount(...args: Parameters<Context["getChatMemberCount"]>) {
        return this.getChatMemberCount(...args);
    }

    /**
     * Context-aware alias for `api.getChatMemberCount`. Use this method to get the number of members in a chat. Returns Int on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmembercount
     */
    getChatMemberCount(signal?: AbortSignal) {
        return this.api.getChatMemberCount(
            orThrow(this.chatId, "getChatMemberCount"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.getChatMember`. Use this method to get information about a member of a chat. The method is guaranteed to work only if the bot is an administrator in the chat. Returns a ChatMember object on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmember
     */
    getAuthor(signal?: AbortSignal) {
        return this.api.getChatMember(
            orThrow(this.chatId, "getAuthor"),
            orThrow(this.from, "getAuthor").id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.getChatMember`. Use this method to get information about a member of a chat. The method is guaranteed to work only if the bot is an administrator in the chat. Returns a ChatMember object on success.
     *
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmember
     */
    getChatMember(user_id: number, signal?: AbortSignal) {
        return this.api.getChatMember(
            orThrow(this.chatId, "getChatMember"),
            user_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatStickerSet`. Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatstickerset
     */
    setChatStickerSet(sticker_set_name: string, signal?: AbortSignal) {
        return this.api.setChatStickerSet(
            orThrow(this.chatId, "setChatStickerSet"),
            sticker_set_name,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.deleteChatStickerSet`. Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletechatstickerset
     */
    deleteChatStickerSet(signal?: AbortSignal) {
        return this.api.deleteChatStickerSet(
            orThrow(this.chatId, "deleteChatStickerSet"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.createForumTopic`. Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns information about the created topic as a ForumTopic object.
     *
     * @param name Topic name, 1-128 characters
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createforumtopic
     */
    createForumTopic(
        name: string,
        other?: Other<"createForumTopic", "chat_id" | "name">,
        signal?: AbortSignal,
    ) {
        return this.api.createForumTopic(
            orThrow(this.chatId, "createForumTopic"),
            name,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.editForumTopic`. Use this method to edit name and icon of a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editforumtopic
     */
    editForumTopic(
        other?: Other<"editForumTopic", "chat_id" | "message_thread_id">,
        signal?: AbortSignal,
    ) {
        const message = orThrow(this.msg, "editForumTopic");
        const thread = orThrow(message.message_thread_id, "editForumTopic");
        return this.api.editForumTopic(message.chat.id, thread, other, signal);
    }

    /**
     * Context-aware alias for `api.closeForumTopic`. Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#closeforumtopic
     */
    closeForumTopic(signal?: AbortSignal) {
        const message = orThrow(this.msg, "closeForumTopic");
        const thread = orThrow(message.message_thread_id, "closeForumTopic");
        return this.api.closeForumTopic(message.chat.id, thread, signal);
    }

    /**
     * Context-aware alias for `api.reopenForumTopic`. Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#reopenforumtopic
     */
    reopenForumTopic(signal?: AbortSignal) {
        const message = orThrow(this.msg, "reopenForumTopic");
        const thread = orThrow(message.message_thread_id, "reopenForumTopic");
        return this.api.reopenForumTopic(message.chat.id, thread, signal);
    }

    /**
     * Context-aware alias for `api.deleteForumTopic`. Use this method to delete a forum topic along with all its messages in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deleteforumtopic
     */
    deleteForumTopic(signal?: AbortSignal) {
        const message = orThrow(this.msg, "deleteForumTopic");
        const thread = orThrow(message.message_thread_id, "deleteForumTopic");
        return this.api.deleteForumTopic(message.chat.id, thread, signal);
    }

    /**
     * Context-aware alias for `api.unpinAllForumTopicMessages`. Use this method to clear the list of pinned messages in a forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallforumtopicmessages
     */
    unpinAllForumTopicMessages(signal?: AbortSignal) {
        const message = orThrow(this.msg, "unpinAllForumTopicMessages");
        const thread = orThrow(
            message.message_thread_id,
            "unpinAllForumTopicMessages",
        );
        return this.api.unpinAllForumTopicMessages(
            message.chat.id,
            thread,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.editGeneralForumTopic`. Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have can_manage_topics administrator rights. Returns True on success.
     *
     * @param name New topic name, 1-128 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editgeneralforumtopic
     */
    editGeneralForumTopic(name: string, signal?: AbortSignal) {
        return this.api.editGeneralForumTopic(
            orThrow(this.chatId, "editGeneralForumTopic"),
            name,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.closeGeneralForumTopic`. Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#closegeneralforumtopic
     */
    closeGeneralForumTopic(signal?: AbortSignal) {
        return this.api.closeGeneralForumTopic(
            orThrow(this.chatId, "closeGeneralForumTopic"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.reopenGeneralForumTopic`. Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.     *
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#reopengeneralforumtopic
     */
    reopenGeneralForumTopic(signal?: AbortSignal) {
        return this.api.reopenGeneralForumTopic(
            orThrow(this.chatId, "reopenGeneralForumTopic"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.hideGeneralForumTopic`. Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#hidegeneralforumtopic
     */
    hideGeneralForumTopic(signal?: AbortSignal) {
        return this.api.hideGeneralForumTopic(
            orThrow(this.chatId, "hideGeneralForumTopic"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.unhideGeneralForumTopic`. Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unhidegeneralforumtopic
     */
    unhideGeneralForumTopic(signal?: AbortSignal) {
        return this.api.unhideGeneralForumTopic(
            orThrow(this.chatId, "unhideGeneralForumTopic"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.unpinAllGeneralForumTopicMessages`. Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages
     */
    unpinAllGeneralForumTopicMessages(signal?: AbortSignal) {
        return this.api.unpinAllGeneralForumTopicMessages(
            orThrow(this.chatId, "unpinAllGeneralForumTopicMessages"),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.answerCallbackQuery`. Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     *
     * Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via @BotFather and accept the terms. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answercallbackquery
     */
    answerCallbackQuery(
        other?: string | Other<"answerCallbackQuery", "callback_query_id">,
        signal?: AbortSignal,
    ) {
        return this.api.answerCallbackQuery(
            orThrow(this.callbackQuery, "answerCallbackQuery").id,
            typeof other === "string" ? { text: other } : other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatMenuButton`. Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatmenubutton
     */
    setChatMenuButton(
        other?: Other<"setChatMenuButton">,
        signal?: AbortSignal,
    ) {
        return this.api.setChatMenuButton(other, signal);
    }

    /**
     * Context-aware alias for `api.getChatMenuButton`. Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatmenubutton
     */
    getChatMenuButton(
        other?: Other<"getChatMenuButton">,
        signal?: AbortSignal,
    ) {
        return this.api.getChatMenuButton(other, signal);
    }

    /**
     * Context-aware alias for `api.setMyDefaultAdministratorRights`. Use this method to the change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are are free to modify the list before adding the bot. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmydefaultadministratorrights
     */
    setMyDefaultAdministratorRights(
        other?: Other<"setMyDefaultAdministratorRights">,
        signal?: AbortSignal,
    ) {
        return this.api.setMyDefaultAdministratorRights(other, signal);
    }

    /**
     * Context-aware alias for `api.getMyDefaultAdministratorRights`. Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyDefaultAdministratorRights(
        other?: Other<"getMyDefaultAdministratorRights">,
        signal?: AbortSignal,
    ) {
        return this.api.getMyDefaultAdministratorRights(other, signal);
    }

    /**
     * Context-aware alias for `api.editMessageText`. Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param text New text of the message, 1-4096 characters after entities parsing
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagetext
     */
    editMessageText(
        text: string,
        other?: Other<
            "editMessageText",
            "chat_id" | "message_id" | "inline_message_id" | "text"
        >,
        signal?: AbortSignal,
    ) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageTextInline(inlineId, text, other)
            : this.api.editMessageText(
                orThrow(this.chatId, "editMessageText"),
                orThrow(
                    this.msg?.message_id ?? this.messageReaction?.message_id ??
                        this.messageReactionCount?.message_id,
                    "editMessageText",
                ),
                text,
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.editMessageCaption`. Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagecaption
     */
    editMessageCaption(
        other?: Other<
            "editMessageCaption",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageCaptionInline(inlineId, other)
            : this.api.editMessageCaption(
                orThrow(this.chatId, "editMessageCaption"),
                orThrow(
                    this.msg?.message_id ?? this.messageReaction?.message_id ??
                        this.messageReactionCount?.message_id,
                    "editMessageCaption",
                ),
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.editMessageMedia`. Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param media An object for a new media content of the message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagemedia
     */
    editMessageMedia(
        media: InputMedia,
        other?: Other<
            "editMessageMedia",
            "chat_id" | "message_id" | "inline_message_id" | "media"
        >,
        signal?: AbortSignal,
    ) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageMediaInline(inlineId, media, other)
            : this.api.editMessageMedia(
                orThrow(this.chatId, "editMessageMedia"),
                orThrow(
                    this.msg?.message_id ?? this.messageReaction?.message_id ??
                        this.messageReactionCount?.message_id,
                    "editMessageMedia",
                ),
                media,
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.editMessageReplyMarkup`. Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagereplymarkup
     */
    editMessageReplyMarkup(
        other?: Other<
            "editMessageReplyMarkup",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageReplyMarkupInline(inlineId, other)
            : this.api.editMessageReplyMarkup(
                orThrow(this.chatId, "editMessageReplyMarkup"),
                orThrow(
                    this.msg?.message_id ?? this.messageReaction?.message_id ??
                        this.messageReactionCount?.message_id,
                    "editMessageReplyMarkup",
                ),
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.stopPoll`. Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#stoppoll
     */
    stopPoll(
        other?: Other<"stopPoll", "chat_id" | "message_id">,
        signal?: AbortSignal,
    ) {
        return this.api.stopPoll(
            orThrow(this.chatId, "stopPoll"),
            orThrow(
                this.msg?.message_id ?? this.messageReaction?.message_id ??
                    this.messageReactionCount?.message_id,
                "stopPoll",
            ),
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.deleteMessage`. Use this method to delete a message, including service messages, with the following limitations:
     * - A message can only be deleted if it was sent less than 48 hours ago.
     * - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
     * - Bots can delete outgoing messages in private chats, groups, and supergroups.
     * - Bots can delete incoming messages in private chats.
     * - Bots granted can_post_messages permissions can delete outgoing messages in channels.
     * - If the bot is an administrator of a group, it can delete any message there.
     * - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
     * Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletemessage
     */
    deleteMessage(signal?: AbortSignal) {
        return this.api.deleteMessage(
            orThrow(this.chatId, "deleteMessage"),
            orThrow(
                this.msg?.message_id ?? this.messageReaction?.message_id ??
                    this.messageReactionCount?.message_id,
                "deleteMessage",
            ),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.deleteMessages`. Use this method to delete multiple messages simultaneously. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletemessages
     */
    deleteMessages(message_ids: number[], signal?: AbortSignal) {
        return this.api.deleteMessages(
            orThrow(this.chatId, "deleteMessages"),
            message_ids,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendSticker`. Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
     *
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. Video and animated stickers can't be sent via an HTTP URL.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendsticker
     */
    replyWithSticker(
        sticker: InputFile | string,
        other?: Other<"sendSticker", "chat_id" | "sticker">,
        signal?: AbortSignal,
    ) {
        return this.api.sendSticker(
            orThrow(this.chatId, "sendSticker"),
            sticker,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }

    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
     *
     * @param custom_emoji_ids A list of custom emoji identifiers
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getcustomemojistickers
     */
    getCustomEmojiStickers(signal?: AbortSignal) {
        type Emoji = MessageEntity.CustomEmojiMessageEntity;
        return this.api.getCustomEmojiStickers(
            (this.msg?.entities ?? [])
                .filter((e): e is Emoji => e.type === "custom_emoji")
                .map((e) => e.custom_emoji_id),
            signal,
        );
    }

    /**
     * Context-aware alias for `api.answerInlineQuery`. Use this method to send answers to an inline query. On success, True is returned.
     * No more than 50 results per query are allowed.
     *
     * Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.
     *
     * @param results An array of results for the inline query
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answerinlinequery
     */
    answerInlineQuery(
        results: readonly InlineQueryResult[],
        other?: Other<"answerInlineQuery", "inline_query_id" | "results">,
        signal?: AbortSignal,
    ) {
        return this.api.answerInlineQuery(
            orThrow(this.inlineQuery, "answerInlineQuery").id,
            results,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendInvoice`. Use this method to send invoices. On success, the sent Message is returned.
     *
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     * @param currency Three-letter ISO 4217 currency code, see more on currencies
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendinvoice
     */
    replyWithInvoice(
        title: string,
        description: string,
        payload: string,
        currency: string,
        prices: readonly LabeledPrice[],
        other?: Other<
            "sendInvoice",
            | "chat_id"
            | "title"
            | "description"
            | "payload"
            | "currency"
            | "prices"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.sendInvoice(
            orThrow(this.chatId, "sendInvoice"),
            title,
            description,
            payload,
            currency,
            prices,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.answerShippingQuery`. If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
     *
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param ok Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answershippingquery
     */
    answerShippingQuery(
        ok: boolean,
        other?: Other<"answerShippingQuery", "shipping_query_id" | "ok">,
        signal?: AbortSignal,
    ) {
        return this.api.answerShippingQuery(
            orThrow(this.shippingQuery, "answerShippingQuery").id,
            ok,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.answerPreCheckoutQuery`. Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @param ok Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answerprecheckoutquery
     */
    answerPreCheckoutQuery(
        ok: boolean,
        other?:
            | string
            | Other<"answerPreCheckoutQuery", "pre_checkout_query_id" | "ok">,
        signal?: AbortSignal,
    ) {
        return this.api.answerPreCheckoutQuery(
            orThrow(this.preCheckoutQuery, "answerPreCheckoutQuery").id,
            ok,
            typeof other === "string" ? { error_message: other } : other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.refundStarPayment`. Refunds a successful payment in Telegram Stars.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#refundstarpayment
     */
    refundStarPayment(signal?: AbortSignal) {
        return this.api.refundStarPayment(
            orThrow(this.from, "refundStarPayment").id,
            orThrow(this.msg?.successful_payment, "refundStarPayment")
                .telegram_payment_charge_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setPassportDataErrors`. Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.
     *
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * @param errors An array describing the errors
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setpassportdataerrors
     */
    setPassportDataErrors(
        errors: readonly PassportElementError[],
        signal?: AbortSignal,
    ) {
        return this.api.setPassportDataErrors(
            orThrow(this.from, "setPassportDataErrors").id,
            errors,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendGame`. Use this method to send a game. On success, the sent Message is returned.
     *
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via BotFather.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendgame
     */
    replyWithGame(
        game_short_name: string,
        other?: Other<"sendGame", "chat_id" | "game_short_name">,
        signal?: AbortSignal,
    ) {
        return this.api.sendGame(
            orThrow(this.chatId, "sendGame"),
            game_short_name,
            { business_connection_id: this.businessConnectionId, ...other },
            signal,
        );
    }
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
export type HearsContext<C extends Context> = Filter<
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
export type CommandContext<C extends Context> = Filter<
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
export type CallbackQueryContext<C extends Context> = Filter<
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
export type GameQueryContext<C extends Context> = Filter<
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
export type InlineQueryContext<C extends Context> = Filter<
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
export type ReactionContext<C extends Context> = Filter<C, "message_reaction">;

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
export type ChosenInlineResultContext<C extends Context> = Filter<
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
export type PreCheckoutQueryContext<C extends Context> = Filter<
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
export type ShippingQueryContext<C extends Context> = Filter<
    NarrowMatch<C, string | RegExpMatchArray>,
    "shipping_query"
>;

type ChatTypeContextCore<T extends Chat["type"]> =
    & Record<"update", ChatTypeUpdate<T>> // ctx.update
    & ChatType<T> // ctx.chat
    & Record<"chatId", number> // ctx.chatId
    & ChatFrom<T> // ctx.from
    & ChatTypeRecord<"msg", T> // ctx.msg
    & AliasProps<ChatTypeUpdate<T>>; // ctx.message etc
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
function orThrow<T>(value: T | undefined, method: string): T {
    if (value === undefined) {
        throw new Error(`Missing information for API call to ${method}`);
    }
    return value;
}

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
