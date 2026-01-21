// deno-lint-ignore-file camelcase
import type { Api } from "./api.ts";
import type { ApiParameters } from "./client.ts";
import {
    type FilterCore,
    type FilterQuery,
    type FilterQueryContext,
    matchFilter,
} from "./filter.ts";
import type {
    AcceptedGiftTypes,
    ApiMethods,
    BusinessConnection,
    Chat,
    ChatFullInfo,
    ChatInviteLink,
    ChatMember,
    ChatMemberAdministrator,
    ChatMemberOwner,
    ChatPermissions,
    File,
    ForumTopic,
    GameHighScore,
    InlineQueryResult,
    InputChecklist,
    InputFile,
    InputMedia,
    InputMediaAudio,
    InputMediaDocument,
    InputMediaPhoto,
    InputMediaVideo,
    InputPaidMedia,
    InputPollOption,
    InputProfilePhoto,
    InputSticker,
    InputStoryContent,
    LabeledPrice,
    Message,
    MessageEntity,
    MessageId,
    OwnedGifts,
    PassportElementError,
    Poll,
    PreparedInlineMessage,
    ReactionType,
    ReactionTypeEmoji,
    StarAmount,
    StickerSet,
    Story,
    Update,
    User,
    UserChatBoosts,
    UserFromGetMe,
    UserProfilePhotos,
} from "./types.ts";

// === Util types
/** A value or an array of such values. */
export type MaybeArray<T> = T | T[];
/** Permits `string` but gives hints. */
export type StringWithCommandSuggestions =
    | (string & Record<never, never>)
    | "start"
    | "help"
    | "settings"
    | "privacy"
    | "developer_info";

/**
 * Internal helper type to convert a string literal type from `snake_case` to
 * `camelCase`.
 *
 * @internal
 */
export type SnakeToCamelCase<S extends string> = S extends
    `${infer L}_${infer R}` ? `${L}${Capitalize<SnakeToCamelCase<R>>}`
    : S;
/**
 * Internal helper type to rename all properties of an object from `snake_case`
 * to `camelCase`.
 *
 * @internal
 */
export type AliasProps<U> = {
    [K in string & keyof U as SnakeToCamelCase<K>]: U[K];
};
/**
 * An object that has all the same properties as {@link Update} (except
 * {@link Update.update_id | update_id}) but with all top-level properties
 * renamed from `snake_case` to `camelCase`. Note that any nested properties are
 * not renamed.
 *
 * Most notably, instances of {@link Context} adhere to this structure.
 */
export type CamelCaseUpdate = AliasProps<Omit<Update, "update_id">>;

// === Context probing logic
/**
 * Collection of helper methods that can create predicate functions. Each
 * predicate function can be used to check context objects for having a
 * different property, such as containing a command, matching a filter query,
 * and so on.
 *
 * This is the type of the static `Context.has` property. It can be used as
 * follows.
 *
 * ```ts
 * const hasCommand = Context.has.command("start");
 *
 * // later:
 * if (hasCommand(ctx)) {
 *   // handle /start command
 *   const args = ctx.match;
 * }
 * ```
 */
export interface StaticHas {
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
export class Context implements CamelCaseUpdate {
    /**
     * Used by some middleware to store information about how a certain string
     * or regular expression was matched.
     */
    public match: string | RegExpMatchArray | undefined;

    /**
     * Constructs a new context object for an incomding update. This constructor
     * is invoked internally by grammY for every update object that is being
     * handled.
     *
     * If you think that you must construct your own context objects, you are
     * probably doing something wrong.
     *
     * @internal
     *
     * @param update The update that is being handled
     * @param api An API instance to use when calling methods
     * @param me A object containing bot information
     */
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
     * Get the user identifier from wherever possible. Alias for
     * `this.from?.id`.
     */
    get fromId(): number | undefined {
        // Keep in sync with types in `filter.ts`.
        return this.from?.id;
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
    /**
     * Context-aware alias for {@link Api.sendMessage | ctx.api.sendMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send text messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessage}
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendMessage(
        text: string,
        other?: Partial<ApiParameters<"sendMessage">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendMessage(
            ensureChatId("sendMessage", this, other),
            text,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendMessage | ctx.api.sendMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `from_chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async forwardMessage(
        chat_id: number | string,
        other?: Partial<ApiParameters<"forwardMessage">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.forwardMessage(
            chat_id,
            ensureFromChatId("forwardMessage", this, other),
            ensureMessageId("forwardMessage", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.forwardMessages | ctx.api.forwardMessages}. The following parameters are pre-supplied based on the current update:
     *
     * - `from_chat_id` from `ctx.chatId`
     *
     * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of {@link MessageId | MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_ids A list of 1-100 identifiers of messages in the chat _from_chat_id_ to forward. The identifiers must be specified in a strictly increasing order.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async forwardMessages(
        chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"forwardMessages">>,
        signal?: AbortSignal,
    ): Promise<MessageId[]> {
        return await this.api.forwardMessages(
            chat_id,
            ensureFromChatId("forwardMessages", this, other),
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.copyMessage | ctx.api.copyMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `from_chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method {@link ApiMethods.forwardMessage | forwardMessage}, but the copied message doesn't have a link to the original message. Returns the {@link MessageId | MessageId} of the sent message on success.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async copyMessage(
        chat_id: number | string,
        other?: Partial<ApiParameters<"copyMessage">>,
        signal?: AbortSignal,
    ): Promise<MessageId> {
        return await this.api.copyMessage(
            chat_id,
            ensureFromChatId("copyMessage", this, other),
            ensureMessageId("copyMessage", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.copyMessages | ctx.api.copyMessages}. The following parameters are pre-supplied based on the current update:
     *
     * - `from_chat_id` from `ctx.chatId`
     *
     * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method {@link ApiMethods.forwardMessages | forwardMessages}, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of {@link MessageId | MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_ids A list of 1-100 identifiers of messages in the chat _from_chat_id_ to copy. The identifiers must be specified in a strictly increasing order.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async copyMessages(
        chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"copyMessages">>,
        signal?: AbortSignal,
    ): Promise<MessageId[]> {
        return await this.api.copyMessages(
            chat_id,
            ensureFromChatId("copyMessages", this, other),
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendPhoto | ctx.api.sendPhoto}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send photos. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendphoto}
     * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendPhoto(
        photo: InputFile | string,
        other?: Partial<ApiParameters<"sendPhoto">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendPhoto(
            ensureChatId("sendPhoto", this, other),
            photo,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendAudio | ctx.api.sendAudio}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent {@link Message | Message} is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * For sending voice messages, use the {@link ApiMethods.sendVoice | sendVoice} method instead.
     *
     * @see {@link https://core.telegram.org/bots/api#sendaudio}
     * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendAudio(
        audio: InputFile | string,
        other?: Partial<ApiParameters<"sendAudio">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendAudio(
            ensureChatId("sendAudio", this, other),
            audio,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendDocument | ctx.api.sendDocument}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send general files. On success, the sent {@link Message | Message} is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#senddocument}
     * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendDocument(
        document: InputFile | string,
        other?: Partial<ApiParameters<"sendDocument">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendDocument(
            ensureChatId("sendDocument", this, other),
            document,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendVideo | ctx.api.sendVideo}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideo}
     * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVideo(
        video: InputFile | string,
        other?: Partial<ApiParameters<"sendVideo">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVideo(
            ensureChatId("sendVideo", this, other),
            video,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendAnimation | ctx.api.sendAnimation}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent {@link Message | Message} is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendanimation}
     * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendAnimation(
        animation: InputFile | string,
        other?: Partial<ApiParameters<"sendAnimation">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendAnimation(
            ensureChatId("sendAnimation", this, other),
            animation,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendVoice | ctx.api.sendVoice}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as {@link Audio | Audio} or {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvoice}
     * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVoice(
        voice: InputFile | string,
        other?: Partial<ApiParameters<"sendVoice">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVoice(
            ensureChatId("sendVoice", this, other),
            voice,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendVideoNote | ctx.api.sendVideoNote}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * As of {@link https://telegram.org/blog/video-messages-and-telescope | v.4.0}, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideonote}
     * @param video_note Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Sending video notes by a URL is currently unsupported
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVideoNote(
        video_note: InputFile | string,
        other?: Partial<ApiParameters<"sendVideoNote">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVideoNote(
            ensureChatId("sendVideoNote", this, other),
            video_note,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendPaidMedia | ctx.api.sendPaidMedia}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send paid media. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpaidmedia}
     * @param star_count The number of Telegram Stars that must be paid to buy access to the media; 1-25000
     * @param media An array describing the media to be sent; up to 10 items
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendPaidMedia(
        star_count: number,
        media: InputPaidMedia[],
        other?: Partial<ApiParameters<"sendPaidMedia">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendPaidMedia(
            ensureChatId("sendPaidMedia", this, other),
            star_count,
            media,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendMediaGroup | ctx.api.sendMediaGroup}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of {@link Message | Message} objects that were sent is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmediagroup}
     * @param media An array describing messages to be sent, must include 2-10 items
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendMediaGroup(
        media: Array<
            | InputMediaAudio
            | InputMediaDocument
            | InputMediaPhoto
            | InputMediaVideo
        >,
        other?: Partial<ApiParameters<"sendMediaGroup">>,
        signal?: AbortSignal,
    ): Promise<Message[]> {
        return await this.api.sendMediaGroup(
            ensureChatId("sendMediaGroup", this, other),
            media,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendLocation | ctx.api.sendLocation}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send point on the map. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendlocation}
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendLocation(
        latitude: number,
        longitude: number,
        other?: Partial<ApiParameters<"sendLocation">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendLocation(
            ensureChatId("sendLocation", this, other),
            latitude,
            longitude,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendVenue | ctx.api.sendVenue}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send information about a venue. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvenue}
     * @param latitude Latitude of the venue
     * @param longitude Longitude of the venue
     * @param title Name of the venue
     * @param address Address of the venue
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVenue(
        latitude: number,
        longitude: number,
        title: string,
        address: string,
        other?: Partial<ApiParameters<"sendVenue">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVenue(
            ensureChatId("sendVenue", this, other),
            latitude,
            longitude,
            title,
            address,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendContact | ctx.api.sendContact}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send phone contacts. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendcontact}
     * @param phone_number Contact's phone number
     * @param first_name Contact's first name
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendContact(
        phone_number: string,
        first_name: string,
        other?: Partial<ApiParameters<"sendContact">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendContact(
            ensureChatId("sendContact", this, other),
            phone_number,
            first_name,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendPoll | ctx.api.sendPoll}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     *
     * Use this method to send a native poll. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpoll}
     * @param question Poll question, 1-300 characters
     * @param options A list of 2-12 answer options
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendPoll(
        question: string,
        options: InputPollOption[],
        other?: Partial<ApiParameters<"sendPoll">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendPoll(
            ensureChatId("sendPoll", this, other),
            question,
            options,
            fillConnectionThread(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendChecklist | ctx.api.sendChecklist}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to send a checklist on behalf of a connected business account. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchecklist}
     * @param checklist An object for the checklist to send
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendChecklist(
        checklist: InputChecklist,
        other?: Partial<ApiParameters<"sendChecklist">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendChecklist(
            ensureBusinessConnectionId("sendChecklist", this, other),
            ensureChatId("sendChecklist", this, other),
            checklist,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendDice | ctx.api.sendDice}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send an animated emoji that will display a random value. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#senddice}
     * @param emoji Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, “🏀”, “⚽”, “🎳”, or “🎰”. Dice can have values 1-6 for “🎲”, “🎯” and “🎳”, values 1-5 for “🏀” and “⚽”, and values 1-64 for “🎰”. Defaults to “🎲”
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendDice(
        emoji?: "🎲" | "🎯" | "🏀" | "⚽" | "🎳" | "🎰",
        other?: Partial<ApiParameters<"sendDice">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendDice(
            ensureChatId("sendDice", this, other),
            emoji,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendMessageDraft | ctx.api.sendMessageDraft}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     *
     * Use this method to stream a partial message to a user while the message is being generated; supported only for bots with forum topic mode enabled. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessagedraft}
     * @param draft_id Unique identifier of the message draft; must be non-zero. Changes of drafts with the same identifier are animated
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendMessageDraft(
        draft_id: number,
        text: string,
        other?: Partial<ApiParameters<"sendMessageDraft">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.sendMessageDraft(
            ensureChatId("sendMessageDraft", this, other),
            draft_id,
            text,
            fillThread(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendChatAction | ctx.api.sendChatAction}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     *
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns _True_ on success.
     *
     * > Example: The {@link https://t.me/imagebot | ImageBot} needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use {@link ApiMethods.sendChatAction | sendChatAction} with _action_ = _upload_photo_. The user will see a “sending photo” status for the bot.
     *
     * We only recommend using this method when a response from the bot will take a **noticeable** amount of time to arrive.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchataction}
     * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for {@link ApiMethods.sendMessage | text messages}, _upload_photo_ for {@link ApiMethods.sendPhoto | photos}, _record_video_ or _upload_video_ for {@link ApiMethods.sendVideo | videos}, _record_voice_ or _upload_voice_ for {@link ApiMethods.sendVoice | voice notes}, _upload_document_ for {@link ApiMethods.sendDocument | general files}, _choose_sticker_ for {@link ApiMethods.sendSticker | stickers}, _find_location_ for {@link ApiMethods.sendLocation | location data}, _record_video_note_ or _upload_video_note_ for {@link ApiMethods.sendVideoNote | video notes}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendChatAction(
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
        other?: Partial<ApiParameters<"sendChatAction">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.sendChatAction(
            ensureChatId("sendChatAction", this, other),
            action,
            fillConnectionThread(this, other),
            signal,
        );
    }
    /**
     * Alias for {@link Context.setMessageReaction} which is a context-aware alias for {@link Api.setMessageReaction | ctx.api.setMessageReaction}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmessagereaction}
     * @param reaction A list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async react(
        reaction?: MaybeArray<ReactionType | ReactionTypeEmoji["emoji"]>,
        other?: Partial<ApiParameters<"setMessageReaction">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.setMessageReaction(reaction, other, signal);
    }
    /**
     * Context-aware alias for {@link Api.setMessageReaction | ctx.api.setMessageReaction}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmessagereaction}
     * @param reaction A list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setMessageReaction(
        reaction?: MaybeArray<ReactionType | ReactionTypeEmoji["emoji"]>,
        other?: Partial<ApiParameters<"setMessageReaction">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setMessageReaction(
            ensureChatId("setMessageReaction", this, other),
            ensureMessageId("setMessageReaction", this, other),
            reaction,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getUserProfilePhotos | ctx.api.getUserProfilePhotos}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to get a list of profile pictures for a user. Returns a {@link UserProfilePhotos | UserProfilePhotos} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getUserProfilePhotos(
        other?: Partial<ApiParameters<"getUserProfilePhotos">>,
        signal?: AbortSignal,
    ): Promise<UserProfilePhotos> {
        return await this.api.getUserProfilePhotos(
            ensureUserId("getUserProfilePhotos", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setUserEmojiStatus | ctx.api.setUserEmojiStatus}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method {@link https://core.telegram.org/bots/webapps#initializing-mini-apps | requestEmojiStatusAccess}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setuseremojistatus}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setUserEmojiStatus(
        other?: Partial<ApiParameters<"setUserEmojiStatus">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setUserEmojiStatus(
            ensureUserId("setUserEmojiStatus", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getFile | ctx.api.getFile}. The following parameters are pre-supplied based on the current update:
     *
     * - `file_id` from any message containing a photo, animation, audio, document, video, video note, voice, or sticker object
     *
     * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a {@link File | File} object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling {@link ApiMethods.getFile | getFile} again.
     *
     * **Note:** This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     *
     * @see {@link https://core.telegram.org/bots/api#getfile}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getFile(
        other?: Partial<ApiParameters<"getFile">>,
        signal?: AbortSignal,
    ): Promise<File> {
        return await this.api.getFile(
            ensureFileId("getFile", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.banChatMember | ctx.api.banChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless {@link ApiMethods.unbanChatMember | unbanned} first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatmember}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async banAuthor(
        other?: Partial<ApiParameters<"banChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.banChatMember(
            ensureChatId("banChatMember", this, other),
            ensureUserId("banChatMember", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.banChatMember | ctx.api.banChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless {@link ApiMethods.unbanChatMember | unbanned} first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatmember}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async banChatMember(
        user_id: number,
        other?: Partial<ApiParameters<"banChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.banChatMember(
            ensureChatId("banChatMember", this, other),
            user_id,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unbanChatMember | ctx.api.unbanChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter _only_if_banned_. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unbanAuthor(
        other?: Partial<ApiParameters<"unbanChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unbanChatMember(
            ensureChatId("unbanChatMember", this, other),
            ensureUserId("unbanChatMember", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unbanChatMember | ctx.api.unbanChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter _only_if_banned_. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unbanChatMember(
        user_id: number,
        other?: Partial<ApiParameters<"unbanChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unbanChatMember(
            ensureChatId("unbanChatMember", this, other),
            user_id,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.restrictChatMember | ctx.api.restrictChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass _True_ for all permissions to lift restrictions from a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#restrictchatmember}
     * @param permissions An object for new user permissions
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async restrictAuthor(
        permissions: ChatPermissions,
        other?: Partial<ApiParameters<"restrictChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.restrictChatMember(
            ensureChatId("restrictChatMember", this, other),
            ensureUserId("restrictChatMember", this, other),
            permissions,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.restrictChatMember | ctx.api.restrictChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass _True_ for all permissions to lift restrictions from a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#restrictchatmember}
     * @param user_id Unique identifier of the target user
     * @param permissions An object for new user permissions
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async restrictChatMember(
        user_id: number,
        permissions: ChatPermissions,
        other?: Partial<ApiParameters<"restrictChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.restrictChatMember(
            ensureChatId("restrictChatMember", this, other),
            user_id,
            permissions,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.promoteChatMember | ctx.api.promoteChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass _False_ for all boolean parameters to demote a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#promotechatmember}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async promoteChatMember(
        other?: Partial<ApiParameters<"promoteChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.promoteChatMember(
            ensureChatId("promoteChatMember", this, other),
            ensureUserId("promoteChatMember", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setChatAdministratorCustomTitle | ctx.api.setChatAdministratorCustomTitle}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatadministratorcustomtitle}
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatAdministratorCustomTitle(
        custom_title: string,
        other?: Partial<ApiParameters<"setChatAdministratorCustomTitle">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatAdministratorCustomTitle(
            ensureChatId("setChatAdministratorCustomTitle", this, other),
            ensureUserId("setChatAdministratorCustomTitle", this, other),
            custom_title,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.banChatSenderChat | ctx.api.banChatSenderChat}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `sender_chat_id` from `ctx.msg.sender_chat.id`
     *
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is {@link ApiMethods.unbanChatSenderChat | unbanned}, the owner of the banned chat won't be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatsenderchat}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async banChatSenderChat(
        other?: Partial<ApiParameters<"banChatSenderChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.banChatSenderChat(
            ensureChatId("banChatSenderChat", this, other),
            ensureSenderChatId("banChatSenderChat", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unbanChatSenderChat | ctx.api.unbanChatSenderChat}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `sender_chat_id` from `ctx.msg.sender_chat.id`
     *
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatsenderchat}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unbanChatSenderChat(
        other?: Partial<ApiParameters<"unbanChatSenderChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unbanChatSenderChat(
            ensureChatId("unbanChatSenderChat", this, other),
            ensureSenderChatId("unbanChatSenderChat", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setChatPermissions | ctx.api.setChatPermissions}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can_restrict_members_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatpermissions}
     * @param permissions An object for new default chat permissions
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatPermissions(
        permissions: ChatPermissions,
        other?: Partial<ApiParameters<"setChatPermissions">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatPermissions(
            ensureChatId("setChatPermissions", this, other),
            permissions,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.exportChatInviteLink | ctx.api.exportChatInviteLink}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as _String_ on success.
     *
     * > Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using {@link ApiMethods.exportChatInviteLink | exportChatInviteLink} or by calling the {@link ApiMethods.getChat | getChat} method. If your bot needs to generate a new primary invite link replacing its previous one, use {@link ApiMethods.exportChatInviteLink | exportChatInviteLink} again.
     *
     * @see {@link https://core.telegram.org/bots/api#exportchatinvitelink}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async exportChatInviteLink(
        other?: Partial<ApiParameters<"exportChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<string> {
        return await this.api.exportChatInviteLink(
            ensureChatId("exportChatInviteLink", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.createChatInviteLink | ctx.api.createChatInviteLink}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method {@link ApiMethods.revokeChatInviteLink | revokeChatInviteLink}. Returns the new invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatinvitelink}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createChatInviteLink(
        other?: Partial<ApiParameters<"createChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.createChatInviteLink(
            ensureChatId("createChatInviteLink", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editChatInviteLink | ctx.api.editChatInviteLink}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatinvitelink}
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editChatInviteLink(
        invite_link: string,
        other?: Partial<ApiParameters<"editChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.editChatInviteLink(
            ensureChatId("editChatInviteLink", this, other),
            invite_link,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.createChatSubscriptionInviteLink | ctx.api.createChatSubscriptionInviteLink}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to create a {@link https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions | subscription invite link} for a channel chat. The bot must have the _can_invite_users_ administrator rights. The link can be edited using the method {@link ApiMethods.editChatSubscriptionInviteLink | editChatSubscriptionInviteLink} or revoked using the method {@link ApiMethods.revokeChatInviteLink | revokeChatInviteLink}. Returns the new invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatsubscriptioninvitelink}
     * @param subscription_period The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).
     * @param subscription_price The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createChatSubscriptionInviteLink(
        subscription_period: 2592000,
        subscription_price: number,
        other?: Partial<ApiParameters<"createChatSubscriptionInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.createChatSubscriptionInviteLink(
            ensureChatId("createChatSubscriptionInviteLink", this, other),
            subscription_period,
            subscription_price,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editChatSubscriptionInviteLink | ctx.api.editChatSubscriptionInviteLink}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to edit a subscription invite link created by the bot. The bot must have the _can_invite_users_ administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatsubscriptioninvitelink}
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editChatSubscriptionInviteLink(
        invite_link: string,
        other?: Partial<ApiParameters<"editChatSubscriptionInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.editChatSubscriptionInviteLink(
            ensureChatId("editChatSubscriptionInviteLink", this, other),
            invite_link,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.revokeChatInviteLink | ctx.api.revokeChatInviteLink}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#revokechatinvitelink}
     * @param invite_link The invite link to revoke
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async revokeChatInviteLink(
        invite_link: string,
        other?: Partial<ApiParameters<"revokeChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.revokeChatInviteLink(
            ensureChatId("revokeChatInviteLink", this, other),
            invite_link,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.approveChatJoinRequest | ctx.api.approveChatJoinRequest}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvechatjoinrequest}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async approveChatJoinRequest(
        other?: Partial<ApiParameters<"approveChatJoinRequest">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.approveChatJoinRequest(
            ensureChatId("approveChatJoinRequest", this, other),
            ensureUserId("approveChatJoinRequest", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.declineChatJoinRequest | ctx.api.declineChatJoinRequest}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinechatjoinrequest}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async declineChatJoinRequest(
        other?: Partial<ApiParameters<"declineChatJoinRequest">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.declineChatJoinRequest(
            ensureChatId("declineChatJoinRequest", this, other),
            ensureUserId("declineChatJoinRequest", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setChatPhoto | ctx.api.setChatPhoto}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatphoto}
     * @param photo New chat photo, uploaded using multipart/form-data
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatPhoto(
        photo: InputFile,
        other?: Partial<ApiParameters<"setChatPhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatPhoto(
            ensureChatId("setChatPhoto", this, other),
            photo,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteChatPhoto | ctx.api.deleteChatPhoto}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteChatPhoto(
        other?: Partial<ApiParameters<"deleteChatPhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteChatPhoto(
            ensureChatId("deleteChatPhoto", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setChatTitle | ctx.api.setChatTitle}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchattitle}
     * @param title New chat title, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatTitle(
        title: string,
        other?: Partial<ApiParameters<"setChatTitle">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatTitle(
            ensureChatId("setChatTitle", this, other),
            title,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setChatDescription | ctx.api.setChatDescription}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatdescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatDescription(
        other?: Partial<ApiParameters<"setChatDescription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatDescription(
            ensureChatId("setChatDescription", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.pinChatMessage | ctx.api.pinChatMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async pinChatMessage(
        other?: Partial<ApiParameters<"pinChatMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.pinChatMessage(
            ensureChatId("pinChatMessage", this, other),
            ensureMessageId("pinChatMessage", this, other),
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unpinChatMessage | ctx.api.unpinChatMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinChatMessage(
        other?: Partial<ApiParameters<"unpinChatMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinChatMessage(
            ensureChatId("unpinChatMessage", this, other),
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unpinAllChatMessages | ctx.api.unpinAllChatMessages}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallchatmessages}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinAllChatMessages(
        other?: Partial<ApiParameters<"unpinAllChatMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinAllChatMessages(
            ensureChatId("unpinAllChatMessages", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.leaveChat | ctx.api.leaveChat}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method for your bot to leave a group, supergroup or channel. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#leavechat}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async leaveChat(
        other?: Partial<ApiParameters<"leaveChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.leaveChat(
            ensureChatId("leaveChat", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getChat | ctx.api.getChat}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to get up-to-date information about the chat. Returns a {@link ChatFullInfo | ChatFullInfo} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchat}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChat(
        other?: Partial<ApiParameters<"getChat">>,
        signal?: AbortSignal,
    ): Promise<ChatFullInfo> {
        return await this.api.getChat(
            ensureChatId("getChat", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getChatAdministrators | ctx.api.getChatAdministrators}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of {@link ChatMember | ChatMember} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatAdministrators(
        other?: Partial<ApiParameters<"getChatAdministrators">>,
        signal?: AbortSignal,
    ): Promise<Array<ChatMemberOwner | ChatMemberAdministrator>> {
        return await this.api.getChatAdministrators(
            ensureChatId("getChatAdministrators", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getChatMemberCount | ctx.api.getChatMemberCount}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to get the number of members in a chat. Returns _Int_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmembercount}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatMemberCount(
        other?: Partial<ApiParameters<"getChatMemberCount">>,
        signal?: AbortSignal,
    ): Promise<number> {
        return await this.api.getChatMemberCount(
            ensureChatId("getChatMemberCount", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getChatMember | ctx.api.getChatMember}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a {@link ChatMember | ChatMember} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmember}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatMember(
        other?: Partial<ApiParameters<"getChatMember">>,
        signal?: AbortSignal,
    ): Promise<ChatMember> {
        return await this.api.getChatMember(
            ensureChatId("getChatMember", this, other),
            ensureUserId("getChatMember", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setChatStickerSet | ctx.api.setChatStickerSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatstickerset}
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatStickerSet(
        sticker_set_name: string,
        other?: Partial<ApiParameters<"setChatStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatStickerSet(
            ensureChatId("setChatStickerSet", this, other),
            sticker_set_name,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteChatStickerSet | ctx.api.deleteChatStickerSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatstickerset}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteChatStickerSet(
        other?: Partial<ApiParameters<"deleteChatStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteChatStickerSet(
            ensureChatId("deleteChatStickerSet", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.createForumTopic | ctx.api.createForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns information about the created topic as a {@link ForumTopic | ForumTopic} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createforumtopic}
     * @param name Topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createForumTopic(
        name: string,
        other?: Partial<ApiParameters<"createForumTopic">>,
        signal?: AbortSignal,
    ): Promise<ForumTopic> {
        return await this.api.createForumTopic(
            ensureChatId("createForumTopic", this, other),
            name,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editForumTopic | ctx.api.editForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_thread_id` from `ctx.msg.message_thread_id`
     *
     * Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editForumTopic(
        other?: Partial<ApiParameters<"editForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.editForumTopic(
            ensureChatId("editForumTopic", this, other),
            ensureMessageThreadId("editForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.closeForumTopic | ctx.api.closeForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_thread_id` from `ctx.msg.message_thread_id`
     *
     * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closeforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async closeForumTopic(
        other?: Partial<ApiParameters<"closeForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.closeForumTopic(
            ensureChatId("closeForumTopic", this, other),
            ensureMessageThreadId("closeForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.reopenForumTopic | ctx.api.reopenForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_thread_id` from `ctx.msg.message_thread_id`
     *
     * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopenforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async reopenForumTopic(
        other?: Partial<ApiParameters<"reopenForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.reopenForumTopic(
            ensureChatId("reopenForumTopic", this, other),
            ensureMessageThreadId("reopenForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteForumTopic | ctx.api.deleteForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_thread_id` from `ctx.msg.message_thread_id`
     *
     * Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_delete_messages_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteForumTopic(
        other?: Partial<ApiParameters<"deleteForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteForumTopic(
            ensureChatId("deleteForumTopic", this, other),
            ensureMessageThreadId("deleteForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unpinAllForumTopicMessages | ctx.api.unpinAllForumTopicMessages}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_thread_id` from `ctx.msg.message_thread_id`
     *
     * Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallforumtopicmessages}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinAllForumTopicMessages(
        other?: Partial<ApiParameters<"unpinAllForumTopicMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinAllForumTopicMessages(
            ensureChatId("unpinAllForumTopicMessages", this, other),
            ensureMessageThreadId("unpinAllForumTopicMessages", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editGeneralForumTopic | ctx.api.editGeneralForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editgeneralforumtopic}
     * @param name New topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editGeneralForumTopic(
        name: string,
        other?: Partial<ApiParameters<"editGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.editGeneralForumTopic(
            ensureChatId("editGeneralForumTopic", this, other),
            name,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.closeGeneralForumTopic | ctx.api.closeGeneralForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closegeneralforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async closeGeneralForumTopic(
        other?: Partial<ApiParameters<"closeGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.closeGeneralForumTopic(
            ensureChatId("closeGeneralForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.reopenGeneralForumTopic | ctx.api.reopenGeneralForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically unhidden if it was hidden. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopengeneralforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async reopenGeneralForumTopic(
        other?: Partial<ApiParameters<"reopenGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.reopenGeneralForumTopic(
            ensureChatId("reopenGeneralForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.hideGeneralForumTopic | ctx.api.hideGeneralForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically closed if it was open. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#hidegeneralforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async hideGeneralForumTopic(
        other?: Partial<ApiParameters<"hideGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.hideGeneralForumTopic(
            ensureChatId("hideGeneralForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unhideGeneralForumTopic | ctx.api.unhideGeneralForumTopic}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unhidegeneralforumtopic}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unhideGeneralForumTopic(
        other?: Partial<ApiParameters<"unhideGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unhideGeneralForumTopic(
            ensureChatId("unhideGeneralForumTopic", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.unpinAllGeneralForumTopicMessages | ctx.api.unpinAllGeneralForumTopicMessages}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinAllGeneralForumTopicMessages(
        other?: Partial<ApiParameters<"unpinAllGeneralForumTopicMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinAllGeneralForumTopicMessages(
            ensureChatId("unpinAllGeneralForumTopicMessages", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.answerCallbackQuery | ctx.api.answerCallbackQuery}. The following parameters are pre-supplied based on the current update:
     *
     * - `callback_query_id` from `ctx.callbackQuery.id`
     *
     * Use this method to send answers to callback queries sent from {@link https://core.telegram.org/bots/features#inline-keyboards | inline keyboards}. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, _True_ is returned.
     *
     * > Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via {@link https://t.me/botfather | @BotFather} and accept the terms. Otherwise, you may use links like `t.me/your_bot?start=* X` that open your bot with a parameter.
     *
     * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerCallbackQuery(
        other?: Partial<ApiParameters<"answerCallbackQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerCallbackQuery(
            ensureCallbackQueryId("answerCallbackQuery", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getUserChatBoosts | ctx.api.getUserChatBoosts}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a {@link UserChatBoosts | UserChatBoosts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserchatboosts}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getUserChatBoosts(
        other?: Partial<ApiParameters<"getUserChatBoosts">>,
        signal?: AbortSignal,
    ): Promise<UserChatBoosts> {
        return await this.api.getUserChatBoosts(
            ensureChatId("getUserChatBoosts", this, other),
            ensureUserId("getUserChatBoosts", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getBusinessConnection | ctx.api.getBusinessConnection}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to get information about the connection of the bot with a business account. Returns a {@link BusinessConnection | BusinessConnection} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessconnection}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getBusinessConnection(
        other?: Partial<ApiParameters<"getBusinessConnection">>,
        signal?: AbortSignal,
    ): Promise<BusinessConnection> {
        return await this.api.getBusinessConnection(
            ensureBusinessConnectionId("getBusinessConnection", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.giftPremiumSubscription | ctx.api.giftPremiumSubscription}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Gifts a Telegram Premium subscription to the given user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#giftpremiumsubscription}
     * @param month_count Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12
     * @param star_count Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async giftPremiumSubscription(
        month_count: 3 | 6 | 12,
        star_count: 1000 | 1500 | 2500,
        other?: Partial<ApiParameters<"giftPremiumSubscription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.giftPremiumSubscription(
            ensureUserId("giftPremiumSubscription", this, other),
            month_count,
            star_count,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.verifyUser | ctx.api.verifyUser}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Verifies a user {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifyuser}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async verifyUser(
        other?: Partial<ApiParameters<"verifyUser">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.verifyUser(
            ensureUserId("verifyUser", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.verifyChat | ctx.api.verifyChat}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Verifies a chat {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifychat}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async verifyChat(
        other?: Partial<ApiParameters<"verifyChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.verifyChat(
            ensureChatId("verifyChat", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.removeUserVerification | ctx.api.removeUserVerification}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Removes verification from a user who is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removeuserverification}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async removeUserVerification(
        other?: Partial<ApiParameters<"removeUserVerification">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.removeUserVerification(
            ensureUserId("removeUserVerification", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.removeChatVerification | ctx.api.removeChatVerification}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Removes verification from a chat that is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removechatverification}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async removeChatVerification(
        other?: Partial<ApiParameters<"removeChatVerification">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.removeChatVerification(
            ensureChatId("removeChatVerification", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.readBusinessMessage | ctx.api.readBusinessMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Marks incoming message as read on behalf of a business account. Requires the _can_read_messages_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#readbusinessmessage}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async readBusinessMessage(
        other?: Partial<ApiParameters<"readBusinessMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.readBusinessMessage(
            ensureBusinessConnectionId("readBusinessMessage", this, other),
            ensureChatId("readBusinessMessage", this, other),
            ensureMessageId("readBusinessMessage", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteBusinessMessages | ctx.api.deleteBusinessMessages}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Delete messages on behalf of a business account. Requires the _can_delete_sent_messages_ business bot right to delete messages sent by the bot itself, or the _can_delete_all_messages_ business bot right to delete any message. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletebusinessmessages}
     * @param message_ids A list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteBusinessMessages(
        message_ids: number[],
        other?: Partial<ApiParameters<"deleteBusinessMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteBusinessMessages(
            ensureBusinessConnectionId("deleteBusinessMessages", this, other),
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setBusinessAccountName | ctx.api.setBusinessAccountName}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Changes the first and last name of a managed business account. Requires the _can_change_name_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountname}
     * @param first_name The new value of the first name for the business account; 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountName(
        first_name: string,
        other?: Partial<ApiParameters<"setBusinessAccountName">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountName(
            ensureBusinessConnectionId("setBusinessAccountName", this, other),
            first_name,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setBusinessAccountUsername | ctx.api.setBusinessAccountUsername}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Changes the username of a managed business account. Requires the _can_change_username_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountusername}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountUsername(
        other?: Partial<ApiParameters<"setBusinessAccountUsername">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountUsername(
            ensureBusinessConnectionId(
                "setBusinessAccountUsername",
                this,
                other,
            ),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setBusinessAccountBio | ctx.api.setBusinessAccountBio}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Changes the bio of a managed business account. Requires the _can_change_bio_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountbio}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountBio(
        other?: Partial<ApiParameters<"setBusinessAccountBio">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountBio(
            ensureBusinessConnectionId("setBusinessAccountBio", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setBusinessAccountProfilePhoto | ctx.api.setBusinessAccountProfilePhoto}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Changes the profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountprofilephoto}
     * @param photo The new profile photo to set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountProfilePhoto(
        photo: InputProfilePhoto,
        other?: Partial<ApiParameters<"setBusinessAccountProfilePhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountProfilePhoto(
            ensureBusinessConnectionId(
                "setBusinessAccountProfilePhoto",
                this,
                other,
            ),
            photo,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.removeBusinessAccountProfilePhoto | ctx.api.removeBusinessAccountProfilePhoto}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Removes the current profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removebusinessaccountprofilephoto}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async removeBusinessAccountProfilePhoto(
        other?: Partial<ApiParameters<"removeBusinessAccountProfilePhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.removeBusinessAccountProfilePhoto(
            ensureBusinessConnectionId(
                "removeBusinessAccountProfilePhoto",
                this,
                other,
            ),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setBusinessAccountGiftSettings | ctx.api.setBusinessAccountGiftSettings}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the _can_change_gift_settings_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountgiftsettings}
     * @param show_gift_button Pass _True_, if a button for sending a gift to the user or by the business account must always be shown in the input field
     * @param accepted_gift_types Types of gifts accepted by the business account
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountGiftSettings(
        show_gift_button: boolean,
        accepted_gift_types: AcceptedGiftTypes,
        other?: Partial<ApiParameters<"setBusinessAccountGiftSettings">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountGiftSettings(
            ensureBusinessConnectionId(
                "setBusinessAccountGiftSettings",
                this,
                other,
            ),
            show_gift_button,
            accepted_gift_types,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getBusinessAccountStarBalance | ctx.api.getBusinessAccountStarBalance}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Returns the amount of Telegram Stars owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link StarAmount | StarAmount} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountstarbalance}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getBusinessAccountStarBalance(
        other?: Partial<ApiParameters<"getBusinessAccountStarBalance">>,
        signal?: AbortSignal,
    ): Promise<StarAmount> {
        return await this.api.getBusinessAccountStarBalance(
            ensureBusinessConnectionId(
                "getBusinessAccountStarBalance",
                this,
                other,
            ),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.transferBusinessAccountStars | ctx.api.transferBusinessAccountStars}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the _can_transfer_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transferbusinessaccountstars}
     * @param star_count Number of Telegram Stars to transfer; 1-10000
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async transferBusinessAccountStars(
        star_count: number,
        other?: Partial<ApiParameters<"transferBusinessAccountStars">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.transferBusinessAccountStars(
            ensureBusinessConnectionId(
                "transferBusinessAccountStars",
                this,
                other,
            ),
            star_count,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getBusinessAccountGifts | ctx.api.getBusinessAccountGifts}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Returns the gifts received and owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link OwnedGifts | OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountgifts}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getBusinessAccountGifts(
        other?: Partial<ApiParameters<"getBusinessAccountGifts">>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.api.getBusinessAccountGifts(
            ensureBusinessConnectionId("getBusinessAccountGifts", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getUserGifts | ctx.api.getUserGifts}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Returns the gifts owned and hosted by a user. Returns {@link OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getusergifts}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getUserGifts(
        other?: Partial<ApiParameters<"getUserGifts">>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.api.getUserGifts(
            ensureUserId("getUserGifts", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getChatGifts | ctx.api.getChatGifts}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Returns the gifts owned by a chat. Returns {@link OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatgifts}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatGifts(
        other?: Partial<ApiParameters<"getChatGifts">>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.api.getChatGifts(
            ensureChatId("getChatGifts", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.convertGiftToStars | ctx.api.convertGiftToStars}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Converts a given regular gift to Telegram Stars. Requires the _can_convert_gifts_to_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#convertgifttostars}
     * @param owned_gift_id Unique identifier of the regular gift that should be converted to Telegram Stars
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async convertGiftToStars(
        owned_gift_id: string,
        other?: Partial<ApiParameters<"convertGiftToStars">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.convertGiftToStars(
            ensureBusinessConnectionId("convertGiftToStars", this, other),
            owned_gift_id,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.upgradeGift | ctx.api.upgradeGift}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Upgrades a given regular gift to a unique gift. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Additionally requires the _can_transfer_stars_ business bot right if the upgrade is paid. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#upgradegift}
     * @param owned_gift_id Unique identifier of the regular gift that should be upgraded to a unique one
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async upgradeGift(
        owned_gift_id: string,
        other?: Partial<ApiParameters<"upgradeGift">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.upgradeGift(
            ensureBusinessConnectionId("upgradeGift", this, other),
            owned_gift_id,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.transferGift | ctx.api.transferGift}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Transfers an owned unique gift to another user. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Requires _can_transfer_stars_ business bot right if the transfer is paid. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transfergift}
     * @param owned_gift_id Unique identifier of the regular gift that should be transferred
     * @param new_owner_chat_id Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async transferGift(
        owned_gift_id: string,
        new_owner_chat_id: number,
        other?: Partial<ApiParameters<"transferGift">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.transferGift(
            ensureBusinessConnectionId("transferGift", this, other),
            owned_gift_id,
            new_owner_chat_id,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.postStory | ctx.api.postStory}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Posts a story on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story | Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#poststory}
     * @param content Content of the story
     * @param active_period Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async postStory(
        content: InputStoryContent,
        active_period: 21600 | 43200 | 86400 | 172800,
        other?: Partial<ApiParameters<"postStory">>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.api.postStory(
            ensureBusinessConnectionId("postStory", this, other),
            content,
            active_period,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.repostStory | ctx.api.repostStory}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `from_chat_id` from `ctx.chatId`
     * - `from_story_id` from `ctx.msg.story.id`
     *
     * Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the _can_manage_stories_ business bot right for both business accounts. Returns {@link Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#repoststory}
     * @param active_period Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async repostStory(
        active_period: 21600 | 43200 | 86400 | 172800,
        other?: Partial<ApiParameters<"repostStory">>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.api.repostStory(
            ensureBusinessConnectionId("repostStory", this, other),
            ensureFromChatId("repostStory", this, other),
            ensureFromStoryId("repostStory", this, other),
            active_period,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editStory | ctx.api.editStory}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `story_id` from `ctx.msg.story.id`
     *
     * Edits a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story | Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editstory}
     * @param content Content of the story
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editStory(
        content: InputStoryContent,
        other?: Partial<ApiParameters<"editStory">>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.api.editStory(
            ensureBusinessConnectionId("editStory", this, other),
            ensureStoryId("editStory", this, other),
            content,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteStory | ctx.api.deleteStory}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `story_id` from `ctx.msg.story.id`
     *
     * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestory}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteStory(
        other?: Partial<ApiParameters<"deleteStory">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteStory(
            ensureBusinessConnectionId("deleteStory", this, other),
            ensureStoryId("deleteStory", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editMessageText | ctx.api.editMessageText}. The following parameters are pre-supplied based on the current update:
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to edit text and {@link https://core.telegram.org/bots/api#games | game} messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagetext}
     * @param text New text of the message, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editMessageText(
        text: string,
        other?: Partial<ApiParameters<"editMessageText">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.editMessageText(
            text,
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editMessageCaption | ctx.api.editMessageCaption}. The following parameters are pre-supplied based on the current update:
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editMessageCaption(
        other?: Partial<ApiParameters<"editMessageCaption">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.editMessageCaption(
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editMessageMedia | ctx.api.editMessageMedia}. The following parameters are pre-supplied based on the current update:
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagemedia}
     * @param media An object for a new media content of the message
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editMessageMedia(
        media: InputMedia,
        other?: Partial<ApiParameters<"editMessageMedia">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.editMessageMedia(
            media,
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editMessageLiveLocation | ctx.api.editMessageLiveLocation}. The following parameters are pre-supplied based on the current update:
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to edit live location messages. A location can be edited until its _live_period_ expires or editing is explicitly disabled by a call to {@link ApiMethods.stopMessageLiveLocation | stopMessageLiveLocation}. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagelivelocation}
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editMessageLiveLocation(
        latitude: number,
        longitude: number,
        other?: Partial<ApiParameters<"editMessageLiveLocation">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.editMessageLiveLocation(
            latitude,
            longitude,
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.stopMessageLiveLocation | ctx.api.stopMessageLiveLocation}. The following parameters are pre-supplied based on the current update:
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to stop updating a live location message before _live_period_ expires. On success, if the message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stopmessagelivelocation}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async stopMessageLiveLocation(
        other?: Partial<ApiParameters<"stopMessageLiveLocation">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.stopMessageLiveLocation(
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editMessageChecklist | ctx.api.editMessageChecklist}. The following parameters are pre-supplied based on the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to edit a checklist on behalf of a connected business account. On success, the edited {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagechecklist}
     * @param checklist An object for the new checklist
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editMessageChecklist(
        checklist: InputChecklist,
        other?: Partial<ApiParameters<"editMessageChecklist">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.editMessageChecklist(
            ensureBusinessConnectionId("editMessageChecklist", this, other),
            ensureChatId("editMessageChecklist", this, other),
            ensureMessageId("editMessageChecklist", this, other),
            checklist,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editMessageReplyMarkup | ctx.api.editMessageReplyMarkup}. The following parameters are pre-supplied based on the current update:
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editMessageReplyMarkup(
        other?: Partial<ApiParameters<"editMessageReplyMarkup">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.editMessageReplyMarkup(
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.stopPoll | ctx.api.stopPoll}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     *
     * Use this method to stop a poll which was sent by the bot. On success, the stopped {@link Poll | Poll} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stoppoll}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async stopPoll(
        other?: Partial<ApiParameters<"stopPoll">>,
        signal?: AbortSignal,
    ): Promise<Poll> {
        return await this.api.stopPoll(
            ensureChatId("stopPoll", this, other),
            ensureMessageId("stopPoll", this, other),
            fillConnection(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.approveSuggestedPost | ctx.api.approveSuggestedPost}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvesuggestedpost}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async approveSuggestedPost(
        other?: Partial<ApiParameters<"approveSuggestedPost">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.approveSuggestedPost(
            ensureChatId("approveSuggestedPost", this, other),
            ensureMessageId("approveSuggestedPost", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.declineSuggestedPost | ctx.api.declineSuggestedPost}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinesuggestedpost}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async declineSuggestedPost(
        other?: Partial<ApiParameters<"declineSuggestedPost">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.declineSuggestedPost(
            ensureChatId("declineSuggestedPost", this, other),
            ensureMessageId("declineSuggestedPost", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteMessage | ctx.api.deleteMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     * - `message_id` from `ctx.msgId`
     *
     * Use this method to delete a message, including service messages, with the following limitations:
     *
     * - A message can only be deleted if it was sent less than 48 hours ago.
     * - Service messages about a supergroup, channel, or forum topic creation can't be deleted.
     * - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
     * - Bots can delete outgoing messages in private chats, groups, and supergroups.
     * - Bots can delete incoming messages in private chats.
     * - Bots granted _can_post_messages_ permissions can delete outgoing messages in channels.
     * - If the bot is an administrator of a group, it can delete any message there.
     * - If the bot has _can_delete_messages_ administrator right in a supergroup or a channel, it can delete any message there.
     * - If the bot has _can_manage_direct_messages_ administrator right in a channel, it can delete any message in the corresponding direct messages chat.
     *
     * Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessage}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteMessage(
        other?: Partial<ApiParameters<"deleteMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteMessage(
            ensureChatId("deleteMessage", this, other),
            ensureMessageId("deleteMessage", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteMessages | ctx.api.deleteMessages}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessages}
     * @param message_ids A list of 1-100 identifiers of messages to delete. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteMessages(
        message_ids: number[],
        other?: Partial<ApiParameters<"deleteMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteMessages(
            ensureChatId("deleteMessages", this, other),
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendSticker | ctx.api.sendSticker}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send static .WEBP, {@link https://telegram.org/blog/animated-stickers | animated} .TGS, or {@link https://telegram.org/blog/video-stickers-better-reactions | video} .WEBM stickers. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendsticker}
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Video and animated stickers can't be sent via an HTTP URL.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendSticker(
        sticker: InputFile | string,
        other?: Partial<ApiParameters<"sendSticker">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendSticker(
            ensureChatId("sendSticker", this, other),
            sticker,
            fillConnectionThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getStickerSet | ctx.api.getStickerSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `name` from `ctx.msg.sticker.set_name`
     *
     * Use this method to get a sticker set. On success, a {@link StickerSet | StickerSet} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getstickerset}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getStickerSet(
        other?: Partial<ApiParameters<"getStickerSet">>,
        signal?: AbortSignal,
    ): Promise<StickerSet> {
        return await this.api.getStickerSet(
            ensureStickerSetName("getStickerSet", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.uploadStickerFile | ctx.api.uploadStickerFile}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to upload a file with a sticker for later use in the {@link ApiMethods.createNewStickerSet | createNewStickerSet}, {@link ApiMethods.addStickerToSet | addStickerToSet}, or {@link ApiMethods.replaceStickerInSet | replaceStickerInSet} methods (the file can be used multiple times). Returns the uploaded {@link File | File} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#uploadstickerfile}
     * @param sticker A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See {@link https://core.telegram.org/stickers | {@link https://core.telegram.org/stickers | https://core.telegram.org/stickers}} for technical requirements. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param sticker_format Format of the sticker, must be one of “static”, “animated”, “video”
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async uploadStickerFile(
        sticker: InputFile,
        sticker_format: "static" | "animated" | "video",
        other?: Partial<ApiParameters<"uploadStickerFile">>,
        signal?: AbortSignal,
    ): Promise<File> {
        return await this.api.uploadStickerFile(
            ensureUserId("uploadStickerFile", this, other),
            sticker,
            sticker_format,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.createNewStickerSet | ctx.api.createNewStickerSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#createnewstickerset}
     * @param name Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `"_by_<bot_username>"`. `<bot_username>` is case insensitive. 1-64 characters.
     * @param title Sticker set title, 1-64 characters
     * @param stickers A list of 1-50 initial stickers to be added to the sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createNewStickerSet(
        name: string,
        title: string,
        stickers: InputSticker[],
        other?: Partial<ApiParameters<"createNewStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.createNewStickerSet(
            ensureUserId("createNewStickerSet", this, other),
            name,
            title,
            stickers,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.addStickerToSet | ctx.api.addStickerToSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     * - `name` from `ctx.msg.sticker.set_name`
     *
     * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#addstickertoset}
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async addStickerToSet(
        sticker: InputSticker,
        other?: Partial<ApiParameters<"addStickerToSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.addStickerToSet(
            ensureUserId("addStickerToSet", this, other),
            ensureStickerSetName("addStickerToSet", this, other),
            sticker,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setStickerPositionInSet | ctx.api.setStickerPositionInSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `sticker` from `ctx.msg.sticker.file_id`
     *
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
     * @param position New sticker position in the set, zero-based
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerPositionInSet(
        position: number,
        other?: Partial<ApiParameters<"setStickerPositionInSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerPositionInSet(
            ensureSticker("setStickerPositionInSet", this, other),
            position,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteStickerFromSet | ctx.api.deleteStickerFromSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `sticker` from `ctx.msg.sticker.file_id`
     *
     * Use this method to delete a sticker from a set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteStickerFromSet(
        other?: Partial<ApiParameters<"deleteStickerFromSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteStickerFromSet(
            ensureSticker("deleteStickerFromSet", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.replaceStickerInSet | ctx.api.replaceStickerInSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     * - `name` from `ctx.msg.sticker.set_name`
     * - `old_sticker` from `ctx.msg.sticker.file_id`
     *
     * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling {@link ApiMethods.deleteStickerFromSet | deleteStickerFromSet}, then {@link ApiMethods.addStickerToSet | addStickerToSet}, then {@link ApiMethods.setStickerPositionInSet | setStickerPositionInSet}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#replacestickerinset}
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async replaceStickerInSet(
        sticker: InputSticker,
        other?: Partial<ApiParameters<"replaceStickerInSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.replaceStickerInSet(
            ensureUserId("replaceStickerInSet", this, other),
            ensureStickerSetName("replaceStickerInSet", this, other),
            ensureOldSticker("replaceStickerInSet", this, other),
            sticker,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setStickerEmojiList | ctx.api.setStickerEmojiList}. The following parameters are pre-supplied based on the current update:
     *
     * - `sticker` from `ctx.msg.sticker.file_id`
     *
     * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickeremojilist}
     * @param emoji_list A list of 1-20 emoji associated with the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerEmojiList(
        emoji_list: string[],
        other?: Partial<ApiParameters<"setStickerEmojiList">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerEmojiList(
            ensureSticker("setStickerEmojiList", this, other),
            emoji_list,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setStickerKeywords | ctx.api.setStickerKeywords}. The following parameters are pre-supplied based on the current update:
     *
     * - `sticker` from `ctx.msg.sticker.file_id`
     *
     * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerkeywords}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerKeywords(
        other?: Partial<ApiParameters<"setStickerKeywords">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerKeywords(
            ensureSticker("setStickerKeywords", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setStickerMaskPosition | ctx.api.setStickerMaskPosition}. The following parameters are pre-supplied based on the current update:
     *
     * - `sticker` from `ctx.msg.sticker.file_id`
     *
     * Use this method to change the {@link MaskPosition | mask position} of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickermaskposition}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerMaskPosition(
        other?: Partial<ApiParameters<"setStickerMaskPosition">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerMaskPosition(
            ensureSticker("setStickerMaskPosition", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setStickerSetTitle | ctx.api.setStickerSetTitle}. The following parameters are pre-supplied based on the current update:
     *
     * - `name` from `ctx.msg.sticker.set_name`
     *
     * Use this method to set the title of a created sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersettitle}
     * @param title Sticker set title, 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerSetTitle(
        title: string,
        other?: Partial<ApiParameters<"setStickerSetTitle">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerSetTitle(
            ensureStickerSetName("setStickerSetTitle", this, other),
            title,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setStickerSetThumbnail | ctx.api.setStickerSetThumbnail}. The following parameters are pre-supplied based on the current update:
     *
     * - `name` from `ctx.msg.sticker.set_name`
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersetthumbnail}
     * @param format Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerSetThumbnail(
        format: "static" | "animated" | "video",
        other?: Partial<ApiParameters<"setStickerSetThumbnail">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerSetThumbnail(
            ensureStickerSetName("setStickerSetThumbnail", this, other),
            ensureUserId("setStickerSetThumbnail", this, other),
            format,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setCustomEmojiStickerSetThumbnail | ctx.api.setCustomEmojiStickerSetThumbnail}. The following parameters are pre-supplied based on the current update:
     *
     * - `name` from `ctx.msg.sticker.set_name`
     *
     * Use this method to set the thumbnail of a custom emoji sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setCustomEmojiStickerSetThumbnail(
        other?: Partial<ApiParameters<"setCustomEmojiStickerSetThumbnail">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setCustomEmojiStickerSetThumbnail(
            ensureStickerSetName(
                "setCustomEmojiStickerSetThumbnail",
                this,
                other,
            ),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.deleteStickerSet | ctx.api.deleteStickerSet}. The following parameters are pre-supplied based on the current update:
     *
     * - `name` from `ctx.msg.sticker.set_name`
     *
     * Use this method to delete a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerset}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteStickerSet(
        other?: Partial<ApiParameters<"deleteStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteStickerSet(
            ensureStickerSetName("deleteStickerSet", this, other),
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.answerInlineQuery | ctx.api.answerInlineQuery}. The following parameters are pre-supplied based on the current update:
     *
     * - `inline_query_id` from `ctx.inlineQuery.id`
     *
     * Use this method to send answers to an inline query. On success, _True_ is returned.
     *
     * No more than **50** results per query are allowed.
     *
     * @see {@link https://core.telegram.org/bots/api#answerinlinequery}
     * @param results An array of results for the inline query
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerInlineQuery(
        results: InlineQueryResult[],
        other?: Partial<ApiParameters<"answerInlineQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerInlineQuery(
            ensureInlineQueryId("answerInlineQuery", this, other),
            results,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.savePreparedInlineMessage | ctx.api.savePreparedInlineMessage}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Stores a message that can be sent by a user of a Mini App. Returns a {@link preparedinlineMessage | PreparedInlineMessage} object.
     *
     * @see {@link https://core.telegram.org/bots/api#savepreparedinlinemessage}
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async savePreparedInlineMessage(
        result: InlineQueryResult,
        other?: Partial<ApiParameters<"savePreparedInlineMessage">>,
        signal?: AbortSignal,
    ): Promise<PreparedInlineMessage> {
        return await this.api.savePreparedInlineMessage(
            ensureUserId("savePreparedInlineMessage", this, other),
            result,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendInvoice | ctx.api.sendInvoice}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     * - `direct_messages_topic_id` from `ctx.msg.direct_messages_topic.topic_id`
     *
     * Use this method to send invoices. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendinvoice}
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
     * @param currency Three-letter ISO 4217 currency code, see {@link https://core.telegram.org/bots/payments#supported-currencies | more on currencies}. Pass “XTR” for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendInvoice(
        title: string,
        description: string,
        payload: string,
        currency: string,
        prices: LabeledPrice[],
        other?: Partial<ApiParameters<"sendInvoice">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendInvoice(
            ensureChatId("sendInvoice", this, other),
            title,
            description,
            payload,
            currency,
            prices,
            fillThreadTopic(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.answerShippingQuery | ctx.api.answerShippingQuery}. The following parameters are pre-supplied based on the current update:
     *
     * - `shipping_query_id` from `ctx.shippingQuery.id`
     *
     * If you sent an invoice requesting a shipping address and the parameter _is_flexible_ was specified, the Bot API will send an {@link Update | Update} with a _shipping_query_ field to the bot. Use this method to reply to shipping queries. On success, _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answershippingquery}
     * @param ok Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerShippingQuery(
        ok: boolean,
        other?: Partial<ApiParameters<"answerShippingQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerShippingQuery(
            ensureShippingQueryId("answerShippingQuery", this, other),
            ok,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.answerPreCheckoutQuery | ctx.api.answerPreCheckoutQuery}. The following parameters are pre-supplied based on the current update:
     *
     * - `pre_checkout_quey_id` from `ctx.preCheckoutQuery.id`
     *
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an {@link Update | Update} with the field _pre_checkout_query_. Use this method to respond to such pre-checkout queries. On success, _True_ is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
     * @param ok Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerPreCheckoutQuery(
        ok: boolean,
        other?: Partial<ApiParameters<"answerPreCheckoutQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerPreCheckoutQuery(
            ensurePreCheckoutQueryId("answerPreCheckoutQuery", this, other),
            ok,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.refundStarPayment | ctx.api.refundStarPayment}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Refunds a successful payment in {@link https://t.me/BotNews/90 | Telegram Stars}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#refundstarpayment}
     * @param telegram_payment_charge_id Telegram payment identifier
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async refundStarPayment(
        telegram_payment_charge_id: string,
        other?: Partial<ApiParameters<"refundStarPayment">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.refundStarPayment(
            ensureUserId("refundStarPayment", this, other),
            telegram_payment_charge_id,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.editUserStarSubscription | ctx.api.editUserStarSubscription}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#edituserstarsubscription}
     * @param telegram_payment_charge_id Telegram payment identifier for the subscription
     * @param is_canceled Pass _True_ to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass _False_ to allow the user to re-enable a subscription that was previously canceled by the bot.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editUserStarSubscription(
        telegram_payment_charge_id: string,
        is_canceled: boolean,
        other?: Partial<ApiParameters<"editUserStarSubscription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.editUserStarSubscription(
            ensureUserId("editUserStarSubscription", this, other),
            telegram_payment_charge_id,
            is_canceled,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setPassportDataErrors | ctx.api.setPassportDataErrors}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns _True_ on success.
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * @see {@link https://core.telegram.org/bots/api#setpassportdataerrors}
     * @param errors An array describing the errors
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setPassportDataErrors(
        errors: PassportElementError[],
        other?: Partial<ApiParameters<"setPassportDataErrors">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setPassportDataErrors(
            ensureUserId("setPassportDataErrors", this, other),
            errors,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.sendGame | ctx.api.sendGame}. The following parameters are pre-supplied based on the current update:
     *
     * - `chat_id` from `ctx.chatId`
     *
     * In addition, the following parameters are pre-supplied optionally if they exist in the current update:
     *
     * - `business_connection_id` from `ctx.businessConnectionId`
     * - `message_thread_id` from `ctx.msg.message_thread_id` (only if `ctx.msg.is_topic_message` is set)
     *
     * Use this method to send a game. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgame}
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via {@link https://t.me/botfather | @BotFather}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendGame(
        game_short_name: string,
        other?: Partial<ApiParameters<"sendGame">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendGame(
            ensureChatId("sendGame", this, other),
            game_short_name,
            fillConnectionThread(this, other),
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.setGameScore | ctx.api.setGameScore}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the {@link Message | Message} is returned, otherwise _True_ is returned. Returns an error, if the new score is not greater than the user's current score in the chat and _force_ is _False_.
     *
     * @see {@link https://core.telegram.org/bots/api#setgamescore}
     * @param score New score, must be non-negative
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setGameScore(
        score: number,
        other?: Partial<ApiParameters<"setGameScore">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.setGameScore(
            ensureUserId("setGameScore", this, other),
            score,
            other,
            signal,
        );
    }
    /**
     * Context-aware alias for {@link Api.getGameHighScores | ctx.api.getGameHighScores}. The following parameters are pre-supplied based on the current update:
     *
     * - `user_id` from `ctx.fromId`
     *
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of {@link GameHighScore | GameHighScore} objects.
     *
     * This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.
     *
     * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getGameHighScores(
        other?: Partial<ApiParameters<"getGameHighScores">>,
        signal?: AbortSignal,
    ): Promise<GameHighScore[]> {
        return await this.api.getGameHighScores(
            ensureUserId("getGameHighScores", this, other),
            other,
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
function ensureChatId<T extends number | string>(
    method: keyof ApiMethods,
    ctx: { chatId?: number },
    other?: { chat_id?: T },
): T | number {
    const chatId = other?.chat_id ?? ctx.chatId;
    if (chatId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not belong to a chat, so there is no known value for the parameter 'chat_id' to identify the target chat`,
        );
    }
    return chatId;
}
function ensureFromChatId<T extends number | string>(
    method: keyof ApiMethods,
    ctx: { chatId?: number },
    other?: { from_chat_id?: T },
): T | number {
    const fromChatId = other?.from_chat_id ?? ctx.chatId;
    if (fromChatId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not belong to a chat, so there is no known value for the parameter 'from_chat_id' to identify the origin chat`,
        );
    }
    return fromChatId;
}
function ensureMessageId(
    method: keyof ApiMethods,
    ctx: { msgId?: number },
    other?: { message_id?: number },
) {
    const messageId = other?.message_id ?? ctx.msgId;
    if (messageId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a message, so there is no known value for the parameter 'message_id' to identify the original message`,
        );
    }
    return messageId;
}
function ensureBusinessConnectionId(
    method: keyof ApiMethods,
    ctx: { businessConnectionId?: string },
    other?: { business_connection_id?: string },
) {
    const businessConnectionId = other?.business_connection_id ??
        ctx.businessConnectionId;
    if (businessConnectionId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a business connection, so there is no known value for the parameter 'business_connection_id'`,
        );
    }
    return businessConnectionId;
}
function ensureUserId(
    method: keyof ApiMethods,
    ctx: { fromId?: number },
    other?: { user_id?: number },
) {
    const userId = other?.user_id ?? ctx.fromId;
    if (userId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a user object, so there is no known value for the parameter 'user_id'`,
        );
    }
    return userId;
}
function ensureFileId(
    method: keyof ApiMethods,
    ctx: { msg?: Message },
    other?: { file_id?: string },
) {
    let m: Message | undefined;
    const fileId = other?.file_id ??
        ((m = ctx.msg) === undefined
            ? undefined
            : m.photo !== undefined
            ? m.photo[m.photo.length - 1]
            : m.animation ??
                m.audio ??
                m.document ??
                m.video ??
                m.video_note ??
                m.voice ??
                m.sticker)?.file_id;
    if (fileId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a file, so there is no known value for the parameter 'file_id'`,
        );
    }
    return fileId;
}
function ensureSenderChatId(
    method: keyof ApiMethods,
    ctx: { msg?: Message },
    other?: { sender_chat_id?: number },
) {
    const senderChatId = other?.sender_chat_id ?? ctx.msg?.sender_chat?.id;
    if (senderChatId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a sender chat, so there is no known value for the parameter 'sender_chat_id'`,
        );
    }
    return senderChatId;
}
function ensureMessageThreadId(
    method: keyof ApiMethods,
    ctx: { msg?: { message_thread_id?: number } },
    other?: { message_thread_id?: number },
) {
    const messageThreadId = other?.message_thread_id ??
        ctx.msg?.message_thread_id;
    if (messageThreadId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a message inside a thread, so there is no known value for the parameter 'message_thread_id'`,
        );
    }
    return messageThreadId;
}
function ensureCallbackQueryId(
    method: keyof ApiMethods,
    ctx: { callbackQuery?: { id?: string } },
    other?: { callback_query_id?: string },
) {
    const callbackQueryId = other?.callback_query_id ?? ctx.callbackQuery?.id;
    if (callbackQueryId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a callback query, so there is no known value for the parameter 'callback_query_id'`,
        );
    }
    return callbackQueryId;
}
function ensureStoryId(
    method: keyof ApiMethods,
    ctx: { msg?: { story?: { id: number } } },
    other?: { story_id?: number },
) {
    const storyId = other?.story_id ?? ctx.msg?.story?.id;
    if (storyId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a story message, so there is no known value for the parameter 'story_id'`,
        );
    }
    return storyId;
}
function ensureFromStoryId(
    method: keyof ApiMethods,
    ctx: { msg?: { story?: { id: number } } },
    other?: { from_story_id?: number },
) {
    const fromStoryId = other?.from_story_id ?? ctx.msg?.story?.id;
    if (fromStoryId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a story message, so there is no known value for the parameter 'from_story_id'`,
        );
    }
    return fromStoryId;
}
function ensureStickerSetName(
    method: keyof ApiMethods,
    ctx: { msg?: { sticker?: { set_name?: string } } },
    other?: { name?: string },
) {
    const name = other?.name ?? ctx.msg?.sticker?.set_name;
    if (name === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a sticker with a sticker set name, so there is no known value for the parameter 'name'`,
        );
    }
    return name;
}
function ensureSticker(
    method: keyof ApiMethods,
    ctx: { msg?: { sticker?: { file_id?: string } } },
    other?: { sticker?: string },
) {
    const sticker = other?.sticker ?? ctx.msg?.sticker?.file_id;
    if (sticker === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a sticker, so there is no known value for the parameter 'sticker'`,
        );
    }
    return sticker;
}
function ensureOldSticker(
    method: keyof ApiMethods,
    ctx: { msg?: { sticker?: { file_id?: string } } },
    other?: { old_sticker?: string },
) {
    const oldSticker = other?.old_sticker ?? ctx.msg?.sticker?.file_id;
    if (oldSticker === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a sticker, so there is no known value for the parameter 'old_sticker'`,
        );
    }
    return oldSticker;
}
function ensureInlineQueryId(
    method: keyof ApiMethods,
    ctx: { inlineQuery?: { id?: string } },
    other?: { inline_query_id?: string },
) {
    const inlineQueryId = other?.inline_query_id ?? ctx.inlineQuery?.id;
    if (inlineQueryId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain an inline query, so there is no known value for the parameter 'inline_query_id'`,
        );
    }
    return inlineQueryId;
}
function ensureShippingQueryId(
    method: keyof ApiMethods,
    ctx: { shippingQuery?: { id?: string } },
    other?: { shipping_query_id?: string },
) {
    const shippingQueryId = other?.shipping_query_id ?? ctx.shippingQuery?.id;
    if (shippingQueryId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a shipping query, so there is no known value for the parameter 'shipping_query_id'`,
        );
    }
    return shippingQueryId;
}
function ensurePreCheckoutQueryId(
    method: keyof ApiMethods,
    ctx: { preCheckoutQuery?: { id?: string } },
    other?: { pre_checkout_query_id?: string },
) {
    const preCheckoutQueryId = other?.pre_checkout_query_id ??
        ctx.preCheckoutQuery?.id;
    if (preCheckoutQueryId === undefined) {
        throw new Error(
            `Cannot call '${method}' because this update does not contain a pre-checkout query, so there is no known value for the parameter 'pre_checkout_query_id'`,
        );
    }
    return preCheckoutQueryId;
}

/** business_connection_id */
function fillConnection<T extends Record<string, unknown>>(
    ctx: Context,
    other?: T,
) {
    return {
        business_connection_id: ctx.businessConnectionId,
        ...other,
    };
}
/** message_thread_id */
function fillThread<T extends Record<string, unknown>>(
    ctx: Context,
    other?: T,
) {
    const msg = ctx.msg;
    return {
        ...(msg?.is_topic_message
            ? { message_thread_id: msg.message_thread_id }
            : {}),
        ...other,
    };
}
/** business_connection_id, message_thread_id */
function fillConnectionThread<T extends Record<string, unknown>>(
    ctx: Context,
    other?: T,
) {
    const msg = ctx.msg;
    return {
        business_connection_id: ctx.businessConnectionId,
        ...(msg?.is_topic_message
            ? { message_thread_id: msg.message_thread_id }
            : {}),
        ...other,
    };
}
/** message_thread_id, direct_messages_topic_id */
function fillThreadTopic<T extends Record<string, unknown>>(
    ctx: Context,
    other?: T,
) {
    const msg = ctx.msg;
    return {
        ...(msg?.is_topic_message
            ? { message_thread_id: msg.message_thread_id }
            : {}),
        direct_messages_topic_id: msg?.direct_messages_topic?.topic_id,
        ...other,
    };
}
/** business_connection_id, message_thread_id, direct_messages_topic_id */
function fillConnectionThreadTopic<T extends Record<string, unknown>>(
    ctx: Context,
    other?: T,
) {
    const msg = ctx.msg;
    return {
        business_connection_id: ctx.businessConnectionId,
        ...(msg?.is_topic_message
            ? { message_thread_id: msg.message_thread_id }
            : {}),
        direct_messages_topic_id: msg?.direct_messages_topic?.topic_id,
        ...other,
    };
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
