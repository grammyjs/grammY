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
    BotCommand,
    BotDescription,
    BotName,
    BotShortDescription,
    BusinessConnection,
    Chat,
    ChatAdministratorRights,
    ChatFullInfo,
    ChatInviteLink,
    ChatMember,
    ChatMemberAdministrator,
    ChatMemberOwner,
    ChatPermissions,
    File,
    ForumTopic,
    GameHighScore,
    Gifts,
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
    MenuButton,
    Message,
    MessageEntity,
    MessageId,
    OwnedGifts,
    PassportElementError,
    Poll,
    PreparedInlineMessage,
    ReactionType,
    ReactionTypeEmoji,
    SentWebAppMessage,
    StarAmount,
    StarTransactions,
    Sticker,
    StickerSet,
    Story,
    Update,
    User,
    UserChatBoosts,
    UserFromGetMe,
    UserProfilePhotos,
    WebhookInfo,
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
     * Use this method to receive incoming updates using long polling ({@link https://en.wikipedia.org/wiki/Push_technology#Long_polling | wiki}). Returns an Array of {@link Update | Update} objects.
     *
     * > **Notes**
     * >
     * > **1.** This method will not work if an outgoing webhook is set up.
     * >
     * > **2.** In order to avoid getting duplicate updates, recalculate _offset_ after each server response.
     *
     * @see {@link https://core.telegram.org/bots/api#getupdates}
     */
    async getUpdates(
        other?: Partial<ApiParameters<"getUpdates">>,
        signal?: AbortSignal,
    ): Promise<Update[]> {
        return await this.api.getUpdates(
            other,
            signal,
        );
    }
    /**
     * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized {@link Update | Update}. In case of an unsuccessful request (a request with response {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes | HTTP status code} different from `2XY`), we will repeat the request and give up after a reasonable amount of attempts. Returns _True_ on success.
     * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter _secret_token_. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.
     *
     * > **Notes**
     * >
     * > **1.** You will not be able to receive updates using {@link ApiMethods.getUpdates | getUpdates} for as long as an outgoing webhook is set up.
     * >
     * > **2.** To use a self-signed certificate, you need to upload your {@link https://core.telegram.org/bots/self-signed | public key certificate} using _certificate_ parameter. Please upload as InputFile, sending a String will not work.
     * >
     * > **3.** Ports currently supported _for webhooks_: **443, 80, 88, 8443**.
     * >
     * > If you're having any trouble setting up webhooks, please check out this {@link https://core.telegram.org/bots/webhooks | amazing guide to webhooks}.
     *
     * @see {@link https://core.telegram.org/bots/api#setwebhook}
     * @param url HTTPS URL to send updates to. Use an empty string to remove webhook integration
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setWebhook(
        url: string,
        other?: Partial<ApiParameters<"setWebhook">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setWebhook(
            url,
            other,
            signal,
        );
    }
    /**
     * Use this method to remove webhook integration if you decide to switch back to {@link ApiMethods.getUpdates | getUpdates}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletewebhook}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteWebhook(
        other?: Partial<ApiParameters<"deleteWebhook">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteWebhook(
            other,
            signal,
        );
    }
    /**
     * Use this method to get current webhook status. Requires no parameters. On success, returns a {@link WebhookInfo | WebhookInfo} object. If the bot is using {@link ApiMethods.getUpdates | getUpdates}, will return an object with the _url_ field empty.
     *
     * @see {@link https://core.telegram.org/bots/api#getwebhookinfo}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getWebhookInfo(
        other?: Partial<ApiParameters<"getWebhookInfo">>,
        signal?: AbortSignal,
    ): Promise<WebhookInfo> {
        return await this.api.getWebhookInfo(
            other,
            signal,
        );
    }
    /**
     * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a {@link User | User} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getme}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getMe(
        other?: Partial<ApiParameters<"getMe">>,
        signal?: AbortSignal,
    ): Promise<UserFromGetMe> {
        return await this.api.getMe(
            other,
            signal,
        );
    }
    /**
     * Use this method to log out from the cloud Bot API server before launching the bot locally. You **must** log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns _True_ on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#logout}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async logOut(
        other?: Partial<ApiParameters<"logOut">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.logOut(
            other,
            signal,
        );
    }
    /**
     * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns _True_ on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#close}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async close(
        other?: Partial<ApiParameters<"close">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.close(
            other,
            signal,
        );
    }
    /**
     * Use this method to send text messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendMessage(
        chat_id: number | string,
        text: string,
        other?: Partial<ApiParameters<"sendMessage">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendMessage(
            chat_id,
            text,
            other,
            signal,
        );
    }
    /**
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
     * @param message_id Message identifier in the chat specified in _from_chat_id_
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async forwardMessage(
        chat_id: number | string,
        from_chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"forwardMessage">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.forwardMessage(
            chat_id,
            from_chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of {@link MessageId | MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param from_chat_id Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)
     * @param message_ids A list of 1-100 identifiers of messages in the chat _from_chat_id_ to forward. The identifiers must be specified in a strictly increasing order.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async forwardMessages(
        chat_id: number | string,
        from_chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"forwardMessages">>,
        signal?: AbortSignal,
    ): Promise<MessageId[]> {
        return await this.api.forwardMessages(
            chat_id,
            from_chat_id,
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method {@link ApiMethods.forwardMessage | forwardMessage}, but the copied message doesn't have a link to the original message. Returns the {@link MessageId | MessageId} of the sent message on success.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
     * @param message_id Message identifier in the chat specified in _from_chat_id_
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async copyMessage(
        chat_id: number | string,
        from_chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"copyMessage">>,
        signal?: AbortSignal,
    ): Promise<MessageId> {
        return await this.api.copyMessage(
            chat_id,
            from_chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method {@link ApiMethods.forwardMessages | forwardMessages}, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of {@link MessageId | MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param from_chat_id Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)
     * @param message_ids A list of 1-100 identifiers of messages in the chat _from_chat_id_ to copy. The identifiers must be specified in a strictly increasing order.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async copyMessages(
        chat_id: number | string,
        from_chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"copyMessages">>,
        signal?: AbortSignal,
    ): Promise<MessageId[]> {
        return await this.api.copyMessages(
            chat_id,
            from_chat_id,
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Use this method to send photos. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendPhoto(
        chat_id: number | string,
        photo: InputFile | string,
        other?: Partial<ApiParameters<"sendPhoto">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendPhoto(
            chat_id,
            photo,
            other,
            signal,
        );
    }
    /**
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent {@link Message | Message} is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * For sending voice messages, use the {@link ApiMethods.sendVoice | sendVoice} method instead.
     *
     * @see {@link https://core.telegram.org/bots/api#sendaudio}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendAudio(
        chat_id: number | string,
        audio: InputFile | string,
        other?: Partial<ApiParameters<"sendAudio">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendAudio(
            chat_id,
            audio,
            other,
            signal,
        );
    }
    /**
     * Use this method to send general files. On success, the sent {@link Message | Message} is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#senddocument}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendDocument(
        chat_id: number | string,
        document: InputFile | string,
        other?: Partial<ApiParameters<"sendDocument">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendDocument(
            chat_id,
            document,
            other,
            signal,
        );
    }
    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideo}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVideo(
        chat_id: number | string,
        video: InputFile | string,
        other?: Partial<ApiParameters<"sendVideo">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVideo(
            chat_id,
            video,
            other,
            signal,
        );
    }
    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent {@link Message | Message} is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendanimation}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendAnimation(
        chat_id: number | string,
        animation: InputFile | string,
        other?: Partial<ApiParameters<"sendAnimation">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendAnimation(
            chat_id,
            animation,
            other,
            signal,
        );
    }
    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as {@link Audio | Audio} or {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvoice}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVoice(
        chat_id: number | string,
        voice: InputFile | string,
        other?: Partial<ApiParameters<"sendVoice">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVoice(
            chat_id,
            voice,
            other,
            signal,
        );
    }
    /**
     * As of {@link https://telegram.org/blog/video-messages-and-telescope | v.4.0}, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideonote}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param video_note Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Sending video notes by a URL is currently unsupported
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVideoNote(
        chat_id: number | string,
        video_note: InputFile | string,
        other?: Partial<ApiParameters<"sendVideoNote">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVideoNote(
            chat_id,
            video_note,
            other,
            signal,
        );
    }
    /**
     * Use this method to send paid media. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpaidmedia}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance.
     * @param star_count The number of Telegram Stars that must be paid to buy access to the media; 1-25000
     * @param media An array describing the media to be sent; up to 10 items
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendPaidMedia(
        chat_id: number | string,
        star_count: number,
        media: InputPaidMedia[],
        other?: Partial<ApiParameters<"sendPaidMedia">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendPaidMedia(
            chat_id,
            star_count,
            media,
            other,
            signal,
        );
    }
    /**
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of {@link Message | Message} objects that were sent is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmediagroup}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param media An array describing messages to be sent, must include 2-10 items
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendMediaGroup(
        chat_id: number | string,
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
            chat_id,
            media,
            other,
            signal,
        );
    }
    /**
     * Use this method to send point on the map. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendlocation}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendLocation(
        chat_id: number | string,
        latitude: number,
        longitude: number,
        other?: Partial<ApiParameters<"sendLocation">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendLocation(
            chat_id,
            latitude,
            longitude,
            other,
            signal,
        );
    }
    /**
     * Use this method to send information about a venue. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvenue}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param latitude Latitude of the venue
     * @param longitude Longitude of the venue
     * @param title Name of the venue
     * @param address Address of the venue
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendVenue(
        chat_id: number | string,
        latitude: number,
        longitude: number,
        title: string,
        address: string,
        other?: Partial<ApiParameters<"sendVenue">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendVenue(
            chat_id,
            latitude,
            longitude,
            title,
            address,
            other,
            signal,
        );
    }
    /**
     * Use this method to send phone contacts. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendcontact}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param phone_number Contact's phone number
     * @param first_name Contact's first name
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendContact(
        chat_id: number | string,
        phone_number: string,
        first_name: string,
        other?: Partial<ApiParameters<"sendContact">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendContact(
            chat_id,
            phone_number,
            first_name,
            other,
            signal,
        );
    }
    /**
     * Use this method to send a native poll. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpoll}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Polls can't be sent to channel direct messages chats.
     * @param question Poll question, 1-300 characters
     * @param options A list of 2-12 answer options
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendPoll(
        chat_id: number | string,
        question: string,
        options: InputPollOption[],
        other?: Partial<ApiParameters<"sendPoll">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendPoll(
            chat_id,
            question,
            options,
            other,
            signal,
        );
    }
    /**
     * Use this method to send a checklist on behalf of a connected business account. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchecklist}
     * @param business_connection_id Unique identifier of the business connection on behalf of which the message will be sent
     * @param chat_id Unique identifier for the target chat
     * @param checklist An object for the checklist to send
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendChecklist(
        business_connection_id: string,
        chat_id: number,
        checklist: InputChecklist,
        other?: Partial<ApiParameters<"sendChecklist">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendChecklist(
            business_connection_id,
            chat_id,
            checklist,
            other,
            signal,
        );
    }
    /**
     * Use this method to send an animated emoji that will display a random value. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#senddice}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendDice(
        chat_id: number | string,
        other?: Partial<ApiParameters<"sendDice">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendDice(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to stream a partial message to a user while the message is being generated; supported only for bots with forum topic mode enabled. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessagedraft}
     * @param chat_id Unique identifier for the target private chat
     * @param draft_id Unique identifier of the message draft; must be non-zero. Changes of drafts with the same identifier are animated
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendMessageDraft(
        chat_id: number,
        draft_id: number,
        text: string,
        other?: Partial<ApiParameters<"sendMessageDraft">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.sendMessageDraft(
            chat_id,
            draft_id,
            text,
            other,
            signal,
        );
    }
    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns _True_ on success.
     *
     * > Example: The {@link https://t.me/imagebot | ImageBot} needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use {@link ApiMethods.sendChatAction | sendChatAction} with _action_ = _upload_photo_. The user will see a “sending photo” status for the bot.
     *
     * We only recommend using this method when a response from the bot will take a **noticeable** amount of time to arrive.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchataction}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren't supported.
     * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for {@link ApiMethods.sendMessage | text messages}, _upload_photo_ for {@link ApiMethods.sendPhoto | photos}, _record_video_ or _upload_video_ for {@link ApiMethods.sendVideo | videos}, _record_voice_ or _upload_voice_ for {@link ApiMethods.sendVoice | voice notes}, _upload_document_ for {@link ApiMethods.sendDocument | general files}, _choose_sticker_ for {@link ApiMethods.sendSticker | stickers}, _find_location_ for {@link ApiMethods.sendLocation | location data}, _record_video_note_ or _upload_video_note_ for {@link ApiMethods.sendVideoNote | video notes}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendChatAction(
        chat_id: number | string,
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
            chat_id,
            action,
            other,
            signal,
        );
    }
    /**
     * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmessagereaction}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_id Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setMessageReaction(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"setMessageReaction">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setMessageReaction(
            chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get a list of profile pictures for a user. Returns a {@link UserProfilePhotos | UserProfilePhotos} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getUserProfilePhotos(
        user_id: number,
        other?: Partial<ApiParameters<"getUserProfilePhotos">>,
        signal?: AbortSignal,
    ): Promise<UserProfilePhotos> {
        return await this.api.getUserProfilePhotos(
            user_id,
            other,
            signal,
        );
    }
    /**
     * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method {@link https://core.telegram.org/bots/webapps#initializing-mini-apps | requestEmojiStatusAccess}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setuseremojistatus}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setUserEmojiStatus(
        user_id: number,
        other?: Partial<ApiParameters<"setUserEmojiStatus">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setUserEmojiStatus(
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a {@link File | File} object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling {@link ApiMethods.getFile | getFile} again.
     *
     * **Note:** This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     *
     * @see {@link https://core.telegram.org/bots/api#getfile}
     * @param file_id File identifier to get information about
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getFile(
        file_id: string,
        other?: Partial<ApiParameters<"getFile">>,
        signal?: AbortSignal,
    ): Promise<File> {
        return await this.api.getFile(
            file_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless {@link ApiMethods.unbanChatMember | unbanned} first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatmember}
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async banChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"banChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.banChatMember(
            chat_id,
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter _only_if_banned_. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unbanChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"unbanChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unbanChatMember(
            chat_id,
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass _True_ for all permissions to lift restrictions from a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#restrictchatmember}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param user_id Unique identifier of the target user
     * @param permissions An object for new user permissions
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async restrictChatMember(
        chat_id: number | string,
        user_id: number,
        permissions: ChatPermissions,
        other?: Partial<ApiParameters<"restrictChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.restrictChatMember(
            chat_id,
            user_id,
            permissions,
            other,
            signal,
        );
    }
    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass _False_ for all boolean parameters to demote a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#promotechatmember}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async promoteChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"promoteChatMember">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.promoteChatMember(
            chat_id,
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatadministratorcustomtitle}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param user_id Unique identifier of the target user
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatAdministratorCustomTitle(
        chat_id: number | string,
        user_id: number,
        custom_title: string,
        other?: Partial<ApiParameters<"setChatAdministratorCustomTitle">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatAdministratorCustomTitle(
            chat_id,
            user_id,
            custom_title,
            other,
            signal,
        );
    }
    /**
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is {@link ApiMethods.unbanChatSenderChat | unbanned}, the owner of the banned chat won't be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatsenderchat}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async banChatSenderChat(
        chat_id: number | string,
        sender_chat_id: number,
        other?: Partial<ApiParameters<"banChatSenderChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.banChatSenderChat(
            chat_id,
            sender_chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatsenderchat}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unbanChatSenderChat(
        chat_id: number | string,
        sender_chat_id: number,
        other?: Partial<ApiParameters<"unbanChatSenderChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unbanChatSenderChat(
            chat_id,
            sender_chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can_restrict_members_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatpermissions}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param permissions An object for new default chat permissions
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatPermissions(
        chat_id: number | string,
        permissions: ChatPermissions,
        other?: Partial<ApiParameters<"setChatPermissions">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatPermissions(
            chat_id,
            permissions,
            other,
            signal,
        );
    }
    /**
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as _String_ on success.
     *
     * > Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using {@link ApiMethods.exportChatInviteLink | exportChatInviteLink} or by calling the {@link ApiMethods.getChat | getChat} method. If your bot needs to generate a new primary invite link replacing its previous one, use {@link ApiMethods.exportChatInviteLink | exportChatInviteLink} again.
     *
     * @see {@link https://core.telegram.org/bots/api#exportchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async exportChatInviteLink(
        chat_id: number | string,
        other?: Partial<ApiParameters<"exportChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<string> {
        return await this.api.exportChatInviteLink(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method {@link ApiMethods.revokeChatInviteLink | revokeChatInviteLink}. Returns the new invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createChatInviteLink(
        chat_id: number | string,
        other?: Partial<ApiParameters<"createChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.createChatInviteLink(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editChatInviteLink(
        chat_id: number | string,
        invite_link: string,
        other?: Partial<ApiParameters<"editChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.editChatInviteLink(
            chat_id,
            invite_link,
            other,
            signal,
        );
    }
    /**
     * Use this method to create a {@link https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions | subscription invite link} for a channel chat. The bot must have the _can_invite_users_ administrator rights. The link can be edited using the method {@link ApiMethods.editChatSubscriptionInviteLink | editChatSubscriptionInviteLink} or revoked using the method {@link ApiMethods.revokeChatInviteLink | revokeChatInviteLink}. Returns the new invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatsubscriptioninvitelink}
     * @param chat_id Unique identifier for the target channel chat or username of the target channel (in the format `@channelusername`)
     * @param subscription_period The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).
     * @param subscription_price The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createChatSubscriptionInviteLink(
        chat_id: number | string,
        subscription_period: 2592000,
        subscription_price: number,
        other?: Partial<ApiParameters<"createChatSubscriptionInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.createChatSubscriptionInviteLink(
            chat_id,
            subscription_period,
            subscription_price,
            other,
            signal,
        );
    }
    /**
     * Use this method to edit a subscription invite link created by the bot. The bot must have the _can_invite_users_ administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatsubscriptioninvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editChatSubscriptionInviteLink(
        chat_id: number | string,
        invite_link: string,
        other?: Partial<ApiParameters<"editChatSubscriptionInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.editChatSubscriptionInviteLink(
            chat_id,
            invite_link,
            other,
            signal,
        );
    }
    /**
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#revokechatinvitelink}
     * @param chat_id Unique identifier of the target chat or username of the target channel (in the format `@channelusername`)
     * @param invite_link The invite link to revoke
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async revokeChatInviteLink(
        chat_id: number | string,
        invite_link: string,
        other?: Partial<ApiParameters<"revokeChatInviteLink">>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.api.revokeChatInviteLink(
            chat_id,
            invite_link,
            other,
            signal,
        );
    }
    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvechatjoinrequest}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async approveChatJoinRequest(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"approveChatJoinRequest">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.approveChatJoinRequest(
            chat_id,
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinechatjoinrequest}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async declineChatJoinRequest(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"declineChatJoinRequest">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.declineChatJoinRequest(
            chat_id,
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param photo New chat photo, uploaded using multipart/form-data
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatPhoto(
        chat_id: number | string,
        photo: InputFile,
        other?: Partial<ApiParameters<"setChatPhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatPhoto(
            chat_id,
            photo,
            other,
            signal,
        );
    }
    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteChatPhoto(
        chat_id: number | string,
        other?: Partial<ApiParameters<"deleteChatPhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteChatPhoto(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchattitle}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param title New chat title, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatTitle(
        chat_id: number | string,
        title: string,
        other?: Partial<ApiParameters<"setChatTitle">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatTitle(
            chat_id,
            title,
            other,
            signal,
        );
    }
    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatdescription}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatDescription(
        chat_id: number | string,
        other?: Partial<ApiParameters<"setChatDescription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatDescription(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_id Identifier of a message to pin
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async pinChatMessage(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"pinChatMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.pinChatMessage(
            chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinChatMessage(
        chat_id: number | string,
        other?: Partial<ApiParameters<"unpinChatMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinChatMessage(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallchatmessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinAllChatMessages(
        chat_id: number | string,
        other?: Partial<ApiParameters<"unpinAllChatMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinAllChatMessages(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method for your bot to leave a group, supergroup or channel. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#leavechat}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`). Channel direct messages chats aren't supported; leave the corresponding channel instead.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async leaveChat(
        chat_id: number | string,
        other?: Partial<ApiParameters<"leaveChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.leaveChat(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get up-to-date information about the chat. Returns a {@link ChatFullInfo | ChatFullInfo} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchat}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChat(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChat">>,
        signal?: AbortSignal,
    ): Promise<ChatFullInfo> {
        return await this.api.getChat(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of {@link ChatMember | ChatMember} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatAdministrators(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChatAdministrators">>,
        signal?: AbortSignal,
    ): Promise<Array<ChatMemberOwner | ChatMemberAdministrator>> {
        return await this.api.getChatAdministrators(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get the number of members in a chat. Returns _Int_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmembercount}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatMemberCount(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChatMemberCount">>,
        signal?: AbortSignal,
    ): Promise<number> {
        return await this.api.getChatMemberCount(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a {@link ChatMember | ChatMember} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmember}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"getChatMember">>,
        signal?: AbortSignal,
    ): Promise<ChatMember> {
        return await this.api.getChatMember(
            chat_id,
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatstickerset}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatStickerSet(
        chat_id: number | string,
        sticker_set_name: string,
        other?: Partial<ApiParameters<"setChatStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatStickerSet(
            chat_id,
            sticker_set_name,
            other,
            signal,
        );
    }
    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatstickerset}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteChatStickerSet(
        chat_id: number | string,
        other?: Partial<ApiParameters<"deleteChatStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteChatStickerSet(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of {@link Sticker | Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getforumtopiciconstickers}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getForumTopicIconStickers(
        other?: Partial<ApiParameters<"getForumTopicIconStickers">>,
        signal?: AbortSignal,
    ): Promise<Sticker[]> {
        return await this.api.getForumTopicIconStickers(
            other,
            signal,
        );
    }
    /**
     * Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns information about the created topic as a {@link ForumTopic | ForumTopic} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param name Topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createForumTopic(
        chat_id: number | string,
        name: string,
        other?: Partial<ApiParameters<"createForumTopic">>,
        signal?: AbortSignal,
    ): Promise<ForumTopic> {
        return await this.api.createForumTopic(
            chat_id,
            name,
            other,
            signal,
        );
    }
    /**
     * Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"editForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.editForumTopic(
            chat_id,
            message_thread_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closeforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async closeForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"closeForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.closeForumTopic(
            chat_id,
            message_thread_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopenforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async reopenForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"reopenForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.reopenForumTopic(
            chat_id,
            message_thread_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_delete_messages_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"deleteForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteForumTopic(
            chat_id,
            message_thread_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallforumtopicmessages}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinAllForumTopicMessages(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"unpinAllForumTopicMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinAllForumTopicMessages(
            chat_id,
            message_thread_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editgeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param name New topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editGeneralForumTopic(
        chat_id: number | string,
        name: string,
        other?: Partial<ApiParameters<"editGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.editGeneralForumTopic(
            chat_id,
            name,
            other,
            signal,
        );
    }
    /**
     * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async closeGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"closeGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.closeGeneralForumTopic(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically unhidden if it was hidden. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopengeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async reopenGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"reopenGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.reopenGeneralForumTopic(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically closed if it was open. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#hidegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async hideGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"hideGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.hideGeneralForumTopic(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unhidegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unhideGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"unhideGeneralForumTopic">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unhideGeneralForumTopic(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async unpinAllGeneralForumTopicMessages(
        chat_id: number | string,
        other?: Partial<ApiParameters<"unpinAllGeneralForumTopicMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.unpinAllGeneralForumTopicMessages(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to send answers to callback queries sent from {@link https://core.telegram.org/bots/features#inline-keyboards | inline keyboards}. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, _True_ is returned.
     *
     * > Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via {@link https://t.me/botfather | @BotFather} and accept the terms. Otherwise, you may use links like `t.me/your_bot?start=* X` that open your bot with a parameter.
     *
     * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
     * @param callback_query_id Unique identifier for the query to be answered
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerCallbackQuery(
        callback_query_id: string,
        other?: Partial<ApiParameters<"answerCallbackQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerCallbackQuery(
            callback_query_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a {@link UserChatBoosts | UserChatBoosts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserchatboosts}
     * @param chat_id Unique identifier for the chat or username of the channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getUserChatBoosts(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"getUserChatBoosts">>,
        signal?: AbortSignal,
    ): Promise<UserChatBoosts> {
        return await this.api.getUserChatBoosts(
            chat_id,
            user_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to get information about the connection of the bot with a business account. Returns a {@link BusinessConnection | BusinessConnection} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessconnection}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getBusinessConnection(
        business_connection_id: string,
        other?: Partial<ApiParameters<"getBusinessConnection">>,
        signal?: AbortSignal,
    ): Promise<BusinessConnection> {
        return await this.api.getBusinessConnection(
            business_connection_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to change the list of the bot's commands. See {@link https://core.telegram.org/bots/features#commands | this manual} for more details about bot commands. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmycommands}
     * @param commands A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setMyCommands(
        commands: BotCommand[],
        other?: Partial<ApiParameters<"setMyCommands">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setMyCommands(
            commands,
            other,
            signal,
        );
    }
    /**
     * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, {@link https://core.telegram.org/bots/api#determining-list-of-commands | higher level commands} will be shown to affected users. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemycommands}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteMyCommands(
        other?: Partial<ApiParameters<"deleteMyCommands">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteMyCommands(
            other,
            signal,
        );
    }
    /**
     * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of {@link BotCommand | BotCommand} objects. If commands aren't set, an empty list is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getmycommands}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getMyCommands(
        other?: Partial<ApiParameters<"getMyCommands">>,
        signal?: AbortSignal,
    ): Promise<BotCommand[]> {
        return await this.api.getMyCommands(
            other,
            signal,
        );
    }
    /**
     * Use this method to change the bot's name. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyname}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setMyName(
        other?: Partial<ApiParameters<"setMyName">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setMyName(
            other,
            signal,
        );
    }
    /**
     * Use this method to get the current bot name for the given user language. Returns {@link BotName | BotName} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyname}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getMyName(
        other?: Partial<ApiParameters<"getMyName">>,
        signal?: AbortSignal,
    ): Promise<BotName> {
        return await this.api.getMyName(
            other,
            signal,
        );
    }
    /**
     * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setMyDescription(
        other?: Partial<ApiParameters<"setMyDescription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setMyDescription(
            other,
            signal,
        );
    }
    /**
     * Use this method to get the current bot description for the given user language. Returns {@link BotDescription | BotDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getMyDescription(
        other?: Partial<ApiParameters<"getMyDescription">>,
        signal?: AbortSignal,
    ): Promise<BotDescription> {
        return await this.api.getMyDescription(
            other,
            signal,
        );
    }
    /**
     * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyshortdescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setMyShortDescription(
        other?: Partial<ApiParameters<"setMyShortDescription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setMyShortDescription(
            other,
            signal,
        );
    }
    /**
     * Use this method to get the current bot short description for the given user language. Returns {@link BotShortDescription | BotShortDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyshortdescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getMyShortDescription(
        other?: Partial<ApiParameters<"getMyShortDescription">>,
        signal?: AbortSignal,
    ): Promise<BotShortDescription> {
        return await this.api.getMyShortDescription(
            other,
            signal,
        );
    }
    /**
     * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatmenubutton}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setChatMenuButton(
        other?: Partial<ApiParameters<"setChatMenuButton">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setChatMenuButton(
            other,
            signal,
        );
    }
    /**
     * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns {@link MenuButton | MenuButton} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmenubutton}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatMenuButton(
        other?: Partial<ApiParameters<"getChatMenuButton">>,
        signal?: AbortSignal,
    ): Promise<MenuButton> {
        return await this.api.getChatMenuButton(
            other,
            signal,
        );
    }
    /**
     * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydefaultadministratorrights}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setMyDefaultAdministratorRights(
        other?: Partial<ApiParameters<"setMyDefaultAdministratorRights">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setMyDefaultAdministratorRights(
            other,
            signal,
        );
    }
    /**
     * Use this method to get the current default administrator rights of the bot. Returns {@link ChatAdministratorRights | ChatAdministratorRights} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydefaultadministratorrights}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getMyDefaultAdministratorRights(
        other?: Partial<ApiParameters<"getMyDefaultAdministratorRights">>,
        signal?: AbortSignal,
    ): Promise<ChatAdministratorRights> {
        return await this.api.getMyDefaultAdministratorRights(
            other,
            signal,
        );
    }
    /**
     * Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a {@link Gifts | Gifts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getavailablegifts}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getAvailableGifts(
        other?: Partial<ApiParameters<"getAvailableGifts">>,
        signal?: AbortSignal,
    ): Promise<Gifts> {
        return await this.api.getAvailableGifts(
            other,
            signal,
        );
    }
    /**
     * Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgift}
     * @param gift_id Identifier of the gift; limited gifts can't be sent to channel chats
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendGift(
        gift_id: string,
        other?: Partial<ApiParameters<"sendGift">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.sendGift(
            gift_id,
            other,
            signal,
        );
    }
    /**
     * Gifts a Telegram Premium subscription to the given user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#giftpremiumsubscription}
     * @param user_id Unique identifier of the target user who will receive a Telegram Premium subscription
     * @param month_count Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12
     * @param star_count Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async giftPremiumSubscription(
        user_id: number,
        month_count: 3 | 6 | 12,
        star_count: 1000 | 1500 | 2500,
        other?: Partial<ApiParameters<"giftPremiumSubscription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.giftPremiumSubscription(
            user_id,
            month_count,
            star_count,
            other,
            signal,
        );
    }
    /**
     * Verifies a user {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifyuser}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async verifyUser(
        user_id: number,
        other?: Partial<ApiParameters<"verifyUser">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.verifyUser(
            user_id,
            other,
            signal,
        );
    }
    /**
     * Verifies a chat {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifychat}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can't be verified.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async verifyChat(
        chat_id: number | string,
        other?: Partial<ApiParameters<"verifyChat">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.verifyChat(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Removes verification from a user who is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removeuserverification}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async removeUserVerification(
        user_id: number,
        other?: Partial<ApiParameters<"removeUserVerification">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.removeUserVerification(
            user_id,
            other,
            signal,
        );
    }
    /**
     * Removes verification from a chat that is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removechatverification}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async removeChatVerification(
        chat_id: number | string,
        other?: Partial<ApiParameters<"removeChatVerification">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.removeChatVerification(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Marks incoming message as read on behalf of a business account. Requires the _can_read_messages_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#readbusinessmessage}
     * @param business_connection_id Unique identifier of the business connection on behalf of which to read the message
     * @param chat_id Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.
     * @param message_id Unique identifier of the message to mark as read
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async readBusinessMessage(
        business_connection_id: string,
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"readBusinessMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.readBusinessMessage(
            business_connection_id,
            chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Delete messages on behalf of a business account. Requires the _can_delete_sent_messages_ business bot right to delete messages sent by the bot itself, or the _can_delete_all_messages_ business bot right to delete any message. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletebusinessmessages}
     * @param business_connection_id Unique identifier of the business connection on behalf of which to delete the messages
     * @param message_ids A list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteBusinessMessages(
        business_connection_id: string,
        message_ids: number[],
        other?: Partial<ApiParameters<"deleteBusinessMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteBusinessMessages(
            business_connection_id,
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Changes the first and last name of a managed business account. Requires the _can_change_name_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountname}
     * @param business_connection_id Unique identifier of the business connection
     * @param first_name The new value of the first name for the business account; 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountName(
        business_connection_id: string,
        first_name: string,
        other?: Partial<ApiParameters<"setBusinessAccountName">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountName(
            business_connection_id,
            first_name,
            other,
            signal,
        );
    }
    /**
     * Changes the username of a managed business account. Requires the _can_change_username_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountusername}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountUsername(
        business_connection_id: string,
        other?: Partial<ApiParameters<"setBusinessAccountUsername">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountUsername(
            business_connection_id,
            other,
            signal,
        );
    }
    /**
     * Changes the bio of a managed business account. Requires the _can_change_bio_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountbio}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountBio(
        business_connection_id: string,
        other?: Partial<ApiParameters<"setBusinessAccountBio">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountBio(
            business_connection_id,
            other,
            signal,
        );
    }
    /**
     * Changes the profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountprofilephoto}
     * @param business_connection_id Unique identifier of the business connection
     * @param photo The new profile photo to set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountProfilePhoto(
        business_connection_id: string,
        photo: InputProfilePhoto,
        other?: Partial<ApiParameters<"setBusinessAccountProfilePhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountProfilePhoto(
            business_connection_id,
            photo,
            other,
            signal,
        );
    }
    /**
     * Removes the current profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removebusinessaccountprofilephoto}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async removeBusinessAccountProfilePhoto(
        business_connection_id: string,
        other?: Partial<ApiParameters<"removeBusinessAccountProfilePhoto">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.removeBusinessAccountProfilePhoto(
            business_connection_id,
            other,
            signal,
        );
    }
    /**
     * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the _can_change_gift_settings_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountgiftsettings}
     * @param business_connection_id Unique identifier of the business connection
     * @param show_gift_button Pass _True_, if a button for sending a gift to the user or by the business account must always be shown in the input field
     * @param accepted_gift_types Types of gifts accepted by the business account
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setBusinessAccountGiftSettings(
        business_connection_id: string,
        show_gift_button: boolean,
        accepted_gift_types: AcceptedGiftTypes,
        other?: Partial<ApiParameters<"setBusinessAccountGiftSettings">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setBusinessAccountGiftSettings(
            business_connection_id,
            show_gift_button,
            accepted_gift_types,
            other,
            signal,
        );
    }
    /**
     * Returns the amount of Telegram Stars owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link StarAmount | StarAmount} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountstarbalance}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getBusinessAccountStarBalance(
        business_connection_id: string,
        other?: Partial<ApiParameters<"getBusinessAccountStarBalance">>,
        signal?: AbortSignal,
    ): Promise<StarAmount> {
        return await this.api.getBusinessAccountStarBalance(
            business_connection_id,
            other,
            signal,
        );
    }
    /**
     * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the _can_transfer_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transferbusinessaccountstars}
     * @param business_connection_id Unique identifier of the business connection
     * @param star_count Number of Telegram Stars to transfer; 1-10000
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async transferBusinessAccountStars(
        business_connection_id: string,
        star_count: number,
        other?: Partial<ApiParameters<"transferBusinessAccountStars">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.transferBusinessAccountStars(
            business_connection_id,
            star_count,
            other,
            signal,
        );
    }
    /**
     * Returns the gifts received and owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link OwnedGifts | OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountgifts}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getBusinessAccountGifts(
        business_connection_id: string,
        other?: Partial<ApiParameters<"getBusinessAccountGifts">>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.api.getBusinessAccountGifts(
            business_connection_id,
            other,
            signal,
        );
    }
    /**
     * Returns the gifts owned and hosted by a user. Returns {@link OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getusergifts}
     * @param user_id Unique identifier of the user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getUserGifts(
        user_id: number,
        other?: Partial<ApiParameters<"getUserGifts">>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.api.getUserGifts(
            user_id,
            other,
            signal,
        );
    }
    /**
     * Returns the gifts owned by a chat. Returns {@link OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatgifts}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getChatGifts(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChatGifts">>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.api.getChatGifts(
            chat_id,
            other,
            signal,
        );
    }
    /**
     * Converts a given regular gift to Telegram Stars. Requires the _can_convert_gifts_to_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#convertgifttostars}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be converted to Telegram Stars
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async convertGiftToStars(
        business_connection_id: string,
        owned_gift_id: string,
        other?: Partial<ApiParameters<"convertGiftToStars">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.convertGiftToStars(
            business_connection_id,
            owned_gift_id,
            other,
            signal,
        );
    }
    /**
     * Upgrades a given regular gift to a unique gift. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Additionally requires the _can_transfer_stars_ business bot right if the upgrade is paid. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#upgradegift}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be upgraded to a unique one
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async upgradeGift(
        business_connection_id: string,
        owned_gift_id: string,
        other?: Partial<ApiParameters<"upgradeGift">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.upgradeGift(
            business_connection_id,
            owned_gift_id,
            other,
            signal,
        );
    }
    /**
     * Transfers an owned unique gift to another user. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Requires _can_transfer_stars_ business bot right if the transfer is paid. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transfergift}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be transferred
     * @param new_owner_chat_id Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async transferGift(
        business_connection_id: string,
        owned_gift_id: string,
        new_owner_chat_id: number,
        other?: Partial<ApiParameters<"transferGift">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.transferGift(
            business_connection_id,
            owned_gift_id,
            new_owner_chat_id,
            other,
            signal,
        );
    }
    /**
     * Posts a story on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story | Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#poststory}
     * @param business_connection_id Unique identifier of the business connection
     * @param content Content of the story
     * @param active_period Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async postStory(
        business_connection_id: string,
        content: InputStoryContent,
        active_period: 21600 | 43200 | 86400 | 172800,
        other?: Partial<ApiParameters<"postStory">>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.api.postStory(
            business_connection_id,
            content,
            active_period,
            other,
            signal,
        );
    }
    /**
     * Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the _can_manage_stories_ business bot right for both business accounts. Returns {@link Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#repoststory}
     * @param business_connection_id Unique identifier of the business connection
     * @param from_chat_id Unique identifier of the chat which posted the story that should be reposted
     * @param from_story_id Unique identifier of the story that should be reposted
     * @param active_period Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async repostStory(
        business_connection_id: string,
        from_chat_id: number,
        from_story_id: number,
        active_period: 21600 | 43200 | 86400 | 172800,
        other?: Partial<ApiParameters<"repostStory">>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.api.repostStory(
            business_connection_id,
            from_chat_id,
            from_story_id,
            active_period,
            other,
            signal,
        );
    }
    /**
     * Edits a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story | Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editstory}
     * @param business_connection_id Unique identifier of the business connection
     * @param story_id Unique identifier of the story to edit
     * @param content Content of the story
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editStory(
        business_connection_id: string,
        story_id: number,
        content: InputStoryContent,
        other?: Partial<ApiParameters<"editStory">>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.api.editStory(
            business_connection_id,
            story_id,
            content,
            other,
            signal,
        );
    }
    /**
     * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestory}
     * @param business_connection_id Unique identifier of the business connection
     * @param story_id Unique identifier of the story to delete
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteStory(
        business_connection_id: string,
        story_id: number,
        other?: Partial<ApiParameters<"deleteStory">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteStory(
            business_connection_id,
            story_id,
            other,
            signal,
        );
    }
    /**
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
            other,
            signal,
        );
    }
    /**
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
            other,
            signal,
        );
    }
    /**
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
            other,
            signal,
        );
    }
    /**
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
            other,
            signal,
        );
    }
    /**
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
            other,
            signal,
        );
    }
    /**
     * Use this method to edit a checklist on behalf of a connected business account. On success, the edited {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagechecklist}
     * @param business_connection_id Unique identifier of the business connection on behalf of which the message will be sent
     * @param chat_id Unique identifier for the target chat
     * @param message_id Unique identifier for the target message
     * @param checklist An object for the new checklist
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editMessageChecklist(
        business_connection_id: string,
        chat_id: number,
        message_id: number,
        checklist: InputChecklist,
        other?: Partial<ApiParameters<"editMessageChecklist">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.editMessageChecklist(
            business_connection_id,
            chat_id,
            message_id,
            checklist,
            other,
            signal,
        );
    }
    /**
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
            other,
            signal,
        );
    }
    /**
     * Use this method to stop a poll which was sent by the bot. On success, the stopped {@link Poll | Poll} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stoppoll}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_id Identifier of the original message with the poll
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async stopPoll(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"stopPoll">>,
        signal?: AbortSignal,
    ): Promise<Poll> {
        return await this.api.stopPoll(
            chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvesuggestedpost}
     * @param chat_id Unique identifier for the target direct messages chat
     * @param message_id Identifier of a suggested post message to approve
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async approveSuggestedPost(
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"approveSuggestedPost">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.approveSuggestedPost(
            chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinesuggestedpost}
     * @param chat_id Unique identifier for the target direct messages chat
     * @param message_id Identifier of a suggested post message to decline
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async declineSuggestedPost(
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"declineSuggestedPost">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.declineSuggestedPost(
            chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
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
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_id Identifier of the message to delete
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteMessage(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"deleteMessage">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteMessage(
            chat_id,
            message_id,
            other,
            signal,
        );
    }
    /**
     * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_ids A list of 1-100 identifiers of messages to delete. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteMessages(
        chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"deleteMessages">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteMessages(
            chat_id,
            message_ids,
            other,
            signal,
        );
    }
    /**
     * Use this method to send static .WEBP, {@link https://telegram.org/blog/animated-stickers | animated} .TGS, or {@link https://telegram.org/blog/video-stickers-better-reactions | video} .WEBM stickers. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendsticker}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Video and animated stickers can't be sent via an HTTP URL.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendSticker(
        chat_id: number | string,
        sticker: InputFile | string,
        other?: Partial<ApiParameters<"sendSticker">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendSticker(
            chat_id,
            sticker,
            other,
            signal,
        );
    }
    /**
     * Use this method to get a sticker set. On success, a {@link StickerSet | StickerSet} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getstickerset}
     * @param name Name of the sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getStickerSet(
        name: string,
        other?: Partial<ApiParameters<"getStickerSet">>,
        signal?: AbortSignal,
    ): Promise<StickerSet> {
        return await this.api.getStickerSet(
            name,
            other,
            signal,
        );
    }
    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of {@link Sticker | Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getcustomemojistickers}
     * @param custom_emoji_ids A list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getCustomEmojiStickers(
        custom_emoji_ids: string[],
        other?: Partial<ApiParameters<"getCustomEmojiStickers">>,
        signal?: AbortSignal,
    ): Promise<Sticker[]> {
        return await this.api.getCustomEmojiStickers(
            custom_emoji_ids,
            other,
            signal,
        );
    }
    /**
     * Use this method to upload a file with a sticker for later use in the {@link ApiMethods.createNewStickerSet | createNewStickerSet}, {@link ApiMethods.addStickerToSet | addStickerToSet}, or {@link ApiMethods.replaceStickerInSet | replaceStickerInSet} methods (the file can be used multiple times). Returns the uploaded {@link File | File} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#uploadstickerfile}
     * @param user_id User identifier of sticker file owner
     * @param sticker A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See {@link https://core.telegram.org/stickers | {@link https://core.telegram.org/stickers | https://core.telegram.org/stickers}} for technical requirements. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param sticker_format Format of the sticker, must be one of “static”, “animated”, “video”
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async uploadStickerFile(
        user_id: number,
        sticker: InputFile,
        sticker_format: "static" | "animated" | "video",
        other?: Partial<ApiParameters<"uploadStickerFile">>,
        signal?: AbortSignal,
    ): Promise<File> {
        return await this.api.uploadStickerFile(
            user_id,
            sticker,
            sticker_format,
            other,
            signal,
        );
    }
    /**
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#createnewstickerset}
     * @param user_id User identifier of created sticker set owner
     * @param name Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `"_by_<bot_username>"`. `<bot_username>` is case insensitive. 1-64 characters.
     * @param title Sticker set title, 1-64 characters
     * @param stickers A list of 1-50 initial stickers to be added to the sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createNewStickerSet(
        user_id: number,
        name: string,
        title: string,
        stickers: InputSticker[],
        other?: Partial<ApiParameters<"createNewStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.createNewStickerSet(
            user_id,
            name,
            title,
            stickers,
            other,
            signal,
        );
    }
    /**
     * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#addstickertoset}
     * @param user_id User identifier of sticker set owner
     * @param name Sticker set name
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async addStickerToSet(
        user_id: number,
        name: string,
        sticker: InputSticker,
        other?: Partial<ApiParameters<"addStickerToSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.addStickerToSet(
            user_id,
            name,
            sticker,
            other,
            signal,
        );
    }
    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
     * @param sticker File identifier of the sticker
     * @param position New sticker position in the set, zero-based
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerPositionInSet(
        sticker: string,
        position: number,
        other?: Partial<ApiParameters<"setStickerPositionInSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerPositionInSet(
            sticker,
            position,
            other,
            signal,
        );
    }
    /**
     * Use this method to delete a sticker from a set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
     * @param sticker File identifier of the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteStickerFromSet(
        sticker: string,
        other?: Partial<ApiParameters<"deleteStickerFromSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteStickerFromSet(
            sticker,
            other,
            signal,
        );
    }
    /**
     * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling {@link ApiMethods.deleteStickerFromSet | deleteStickerFromSet}, then {@link ApiMethods.addStickerToSet | addStickerToSet}, then {@link ApiMethods.setStickerPositionInSet | setStickerPositionInSet}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#replacestickerinset}
     * @param user_id User identifier of the sticker set owner
     * @param name Sticker set name
     * @param old_sticker File identifier of the replaced sticker
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async replaceStickerInSet(
        user_id: number,
        name: string,
        old_sticker: string,
        sticker: InputSticker,
        other?: Partial<ApiParameters<"replaceStickerInSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.replaceStickerInSet(
            user_id,
            name,
            old_sticker,
            sticker,
            other,
            signal,
        );
    }
    /**
     * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickeremojilist}
     * @param sticker File identifier of the sticker
     * @param emoji_list A list of 1-20 emoji associated with the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerEmojiList(
        sticker: string,
        emoji_list: string[],
        other?: Partial<ApiParameters<"setStickerEmojiList">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerEmojiList(
            sticker,
            emoji_list,
            other,
            signal,
        );
    }
    /**
     * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerkeywords}
     * @param sticker File identifier of the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerKeywords(
        sticker: string,
        other?: Partial<ApiParameters<"setStickerKeywords">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerKeywords(
            sticker,
            other,
            signal,
        );
    }
    /**
     * Use this method to change the {@link MaskPosition | mask position} of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickermaskposition}
     * @param sticker File identifier of the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerMaskPosition(
        sticker: string,
        other?: Partial<ApiParameters<"setStickerMaskPosition">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerMaskPosition(
            sticker,
            other,
            signal,
        );
    }
    /**
     * Use this method to set the title of a created sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersettitle}
     * @param name Sticker set name
     * @param title Sticker set title, 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerSetTitle(
        name: string,
        title: string,
        other?: Partial<ApiParameters<"setStickerSetTitle">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerSetTitle(
            name,
            title,
            other,
            signal,
        );
    }
    /**
     * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersetthumbnail}
     * @param name Sticker set name
     * @param user_id User identifier of the sticker set owner
     * @param format Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setStickerSetThumbnail(
        name: string,
        user_id: number,
        format: "static" | "animated" | "video",
        other?: Partial<ApiParameters<"setStickerSetThumbnail">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setStickerSetThumbnail(
            name,
            user_id,
            format,
            other,
            signal,
        );
    }
    /**
     * Use this method to set the thumbnail of a custom emoji sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail}
     * @param name Sticker set name
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setCustomEmojiStickerSetThumbnail(
        name: string,
        other?: Partial<ApiParameters<"setCustomEmojiStickerSetThumbnail">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setCustomEmojiStickerSetThumbnail(
            name,
            other,
            signal,
        );
    }
    /**
     * Use this method to delete a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerset}
     * @param name Sticker set name
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async deleteStickerSet(
        name: string,
        other?: Partial<ApiParameters<"deleteStickerSet">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.deleteStickerSet(
            name,
            other,
            signal,
        );
    }
    /**
     * Use this method to send answers to an inline query. On success, _True_ is returned.
     *
     * No more than **50** results per query are allowed.
     *
     * @see {@link https://core.telegram.org/bots/api#answerinlinequery}
     * @param inline_query_id Unique identifier for the answered query
     * @param results An array of results for the inline query
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerInlineQuery(
        inline_query_id: string,
        results: InlineQueryResult[],
        other?: Partial<ApiParameters<"answerInlineQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerInlineQuery(
            inline_query_id,
            results,
            other,
            signal,
        );
    }
    /**
     * Use this method to set the result of an interaction with a {@link https://core.telegram.org/bots/webapps | Web App} and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a {@link sentwebappMessage | SentWebAppMessage} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answerwebappquery}
     * @param web_app_query_id Unique identifier for the query to be answered
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerWebAppQuery(
        web_app_query_id: string,
        result: InlineQueryResult,
        other?: Partial<ApiParameters<"answerWebAppQuery">>,
        signal?: AbortSignal,
    ): Promise<SentWebAppMessage> {
        return await this.api.answerWebAppQuery(
            web_app_query_id,
            result,
            other,
            signal,
        );
    }
    /**
     * Stores a message that can be sent by a user of a Mini App. Returns a {@link preparedinlineMessage | PreparedInlineMessage} object.
     *
     * @see {@link https://core.telegram.org/bots/api#savepreparedinlinemessage}
     * @param user_id Unique identifier of the target user that can use the prepared message
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async savePreparedInlineMessage(
        user_id: number,
        result: InlineQueryResult,
        other?: Partial<ApiParameters<"savePreparedInlineMessage">>,
        signal?: AbortSignal,
    ): Promise<PreparedInlineMessage> {
        return await this.api.savePreparedInlineMessage(
            user_id,
            result,
            other,
            signal,
        );
    }
    /**
     * Use this method to send invoices. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendinvoice}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
     * @param currency Three-letter ISO 4217 currency code, see {@link https://core.telegram.org/bots/payments#supported-currencies | more on currencies}. Pass “XTR” for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendInvoice(
        chat_id: number | string,
        title: string,
        description: string,
        payload: string,
        currency: string,
        prices: LabeledPrice[],
        other?: Partial<ApiParameters<"sendInvoice">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendInvoice(
            chat_id,
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
     * Use this method to create a link for an invoice. Returns the created invoice link as _String_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#createinvoicelink}
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
     * @param currency Three-letter ISO 4217 currency code, see {@link https://core.telegram.org/bots/payments#supported-currencies | more on currencies}. Pass “XTR” for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async createInvoiceLink(
        title: string,
        description: string,
        payload: string,
        currency: string,
        prices: LabeledPrice[],
        other?: Partial<ApiParameters<"createInvoiceLink">>,
        signal?: AbortSignal,
    ): Promise<string> {
        return await this.api.createInvoiceLink(
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
     * If you sent an invoice requesting a shipping address and the parameter _is_flexible_ was specified, the Bot API will send an {@link Update | Update} with a _shipping_query_ field to the bot. Use this method to reply to shipping queries. On success, _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answershippingquery}
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param ok Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerShippingQuery(
        shipping_query_id: string,
        ok: boolean,
        other?: Partial<ApiParameters<"answerShippingQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerShippingQuery(
            shipping_query_id,
            ok,
            other,
            signal,
        );
    }
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an {@link Update | Update} with the field _pre_checkout_query_. Use this method to respond to such pre-checkout queries. On success, _True_ is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
     * @param pre_checkout_query_id Unique identifier for the query to be answered
     * @param ok Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async answerPreCheckoutQuery(
        pre_checkout_query_id: string,
        ok: boolean,
        other?: Partial<ApiParameters<"answerPreCheckoutQuery">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.answerPreCheckoutQuery(
            pre_checkout_query_id,
            ok,
            other,
            signal,
        );
    }
    /**
     * A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a {@link StarAmount | StarAmount} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getmystarbalance}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getMyStarBalance(
        other?: Partial<ApiParameters<"getMyStarBalance">>,
        signal?: AbortSignal,
    ): Promise<StarAmount> {
        return await this.api.getMyStarBalance(
            other,
            signal,
        );
    }
    /**
     * Returns the bot's Telegram Star transactions in chronological order. On success, returns a {@link StarTransactions | StarTransactions} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getstartransactions}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getStarTransactions(
        other?: Partial<ApiParameters<"getStarTransactions">>,
        signal?: AbortSignal,
    ): Promise<StarTransactions> {
        return await this.api.getStarTransactions(
            other,
            signal,
        );
    }
    /**
     * Refunds a successful payment in {@link https://t.me/BotNews/90 | Telegram Stars}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#refundstarpayment}
     * @param user_id Identifier of the user whose payment will be refunded
     * @param telegram_payment_charge_id Telegram payment identifier
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async refundStarPayment(
        user_id: number,
        telegram_payment_charge_id: string,
        other?: Partial<ApiParameters<"refundStarPayment">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.refundStarPayment(
            user_id,
            telegram_payment_charge_id,
            other,
            signal,
        );
    }
    /**
     * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#edituserstarsubscription}
     * @param user_id Identifier of the user whose subscription will be edited
     * @param telegram_payment_charge_id Telegram payment identifier for the subscription
     * @param is_canceled Pass _True_ to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass _False_ to allow the user to re-enable a subscription that was previously canceled by the bot.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async editUserStarSubscription(
        user_id: number,
        telegram_payment_charge_id: string,
        is_canceled: boolean,
        other?: Partial<ApiParameters<"editUserStarSubscription">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.editUserStarSubscription(
            user_id,
            telegram_payment_charge_id,
            is_canceled,
            other,
            signal,
        );
    }
    /**
     * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns _True_ on success.
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * @see {@link https://core.telegram.org/bots/api#setpassportdataerrors}
     * @param user_id User identifier
     * @param errors An array describing the errors
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setPassportDataErrors(
        user_id: number,
        errors: PassportElementError[],
        other?: Partial<ApiParameters<"setPassportDataErrors">>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.api.setPassportDataErrors(
            user_id,
            errors,
            other,
            signal,
        );
    }
    /**
     * Use this method to send a game. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgame}
     * @param chat_id Unique identifier for the target chat. Games can't be sent to channel direct messages chats and channel chats.
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via {@link https://t.me/botfather | @BotFather}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async sendGame(
        chat_id: number,
        game_short_name: string,
        other?: Partial<ApiParameters<"sendGame">>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.api.sendGame(
            chat_id,
            game_short_name,
            other,
            signal,
        );
    }
    /**
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the {@link Message | Message} is returned, otherwise _True_ is returned. Returns an error, if the new score is not greater than the user's current score in the chat and _force_ is _False_.
     *
     * @see {@link https://core.telegram.org/bots/api#setgamescore}
     * @param user_id User identifier
     * @param score New score, must be non-negative
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async setGameScore(
        user_id: number,
        score: number,
        other?: Partial<ApiParameters<"setGameScore">>,
        signal?: AbortSignal,
    ): Promise<true | Message> {
        return await this.api.setGameScore(
            user_id,
            score,
            other,
            signal,
        );
    }
    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of {@link GameHighScore | GameHighScore} objects.
     *
     * This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.
     *
     * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
     * @param user_id Target user id
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    async getGameHighScores(
        user_id: number,
        other?: Partial<ApiParameters<"getGameHighScores">>,
        signal?: AbortSignal,
    ): Promise<GameHighScore[]> {
        return await this.api.getGameHighScores(
            user_id,
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
