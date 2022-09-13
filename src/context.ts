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
    type LabeledPrice,
    type Message,
    type MessageEntity,
    type PassportElementError,
    type Update,
    type User,
    type UserFromGetMe,
} from "./types.ts";

// === Util types
export type MaybeArray<T> = T | T[];
// deno-lint-ignore ban-types
export type StringWithSuggestions<S extends string> = (string & {}) | S; // permits `string` but gives hints

type Other<M extends Methods<RawApi>, X extends string = never> = OtherApi<
    RawApi,
    M,
    X
>;
type SnakeToCamelCase<S extends string> = S extends `${infer L}_${infer R}`
    ? `${L}${Capitalize<SnakeToCamelCase<R>>}`
    : S;
export type AliasProps<U> = {
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
    command<S extends string>(
        command: MaybeArray<
            StringWithSuggestions<S | "start" | "help" | "settings">
        >,
    ): <C extends Context>(ctx: C) => ctx is CommandContext<C>;
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
            const set = cmd.indexOf("@") === -1 ? noAtCommands : atCommands;
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
                const atTarget = cmd.substring(index + 1);
                if (atTarget !== ctx.me.username) return false;
                const atCommand = cmd.substring(0, index);
                if (noAtCommands.has(atCommand)) {
                    ctx.match = txt.substring(cmd.length + 1).trimStart();
                    return true;
                }
                return false;
            });
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

    // AGGREGATION SHORTCUTS

    /**
     * Get message object from wherever possible. Alias for `ctx.message ??
     * ctx.editedMessage ?? ctx.callbackQuery?.message ?? ctx.channelPost ??
     * ctx.editedChannelPost`
     */
    get msg(): Message | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.message ??
                this.editedMessage ??
                this.callbackQuery?.message ??
                this.channelPost ??
                this.editedChannelPost
        );
    }
    /**
     * Get chat object from wherever possible. Alias for `(ctx.msg ??
     * ctx.myChatMember ?? ctx.chatMember ?? ctx.chatJoinRequest)?.chat`
     */
    get chat(): Chat | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.msg ??
                this.myChatMember ??
                this.chatMember ??
                this.chatJoinRequest
        )?.chat;
    }
    /**
     * Get sender chat object from wherever possible. Alias for
     * `ctx.msg?.sender_chat`.
     */
    get senderChat(): Chat | undefined {
        return this.msg?.sender_chat;
    }
    /**
     * Get message author from wherever possible. Alias for
     * `(ctx.callbackQuery?? ctx.inlineQuery ?? ctx.shippingQuery ??
     * ctx.preCheckoutQuery ?? ctx.chosenInlineResult ?? ctx.msg ??
     * ctx.myChatMember ?? ctx.chatMember ?? ctx.chatJoinRequest)?.from`
     */
    get from(): User | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.callbackQuery ??
                this.inlineQuery ??
                this.shippingQuery ??
                this.preCheckoutQuery ??
                this.chosenInlineResult ??
                this.msg ??
                this.myChatMember ??
                this.chatMember ??
                this.chatJoinRequest
        )?.from;
    }
    /**
     * Get inline message ID from wherever possible. Alias for
     * `(ctx.callbackQuery ?? ctx.chosenInlineResult)?.inline_message_id`
     */
    get inlineMessageId(): string | undefined {
        return (
            this.callbackQuery?.inline_message_id ??
                this.chosenInlineResult?.inline_message_id
        );
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
    hasCommand<S extends string>(
        command: MaybeArray<
            StringWithSuggestions<S | "start" | "help" | "settings">
        >,
    ): this is CommandContextCore {
        return Context.has.command(command)(this);
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
            orThrow(this.chat, "sendMessage").id,
            text,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.forwardMessage`. Use this method to forward messages of any kind. Service messages can't be forwarded. On success, the sent Message is returned.
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
            orThrow(this.chat, "forwardMessage").id,
            orThrow(this.msg, "forwardMessage").message_id,
            other,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.copyMessage`. Use this method to copy messages of any kind. Service messages and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
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
            orThrow(this.chat, "copyMessage").id,
            orThrow(this.msg, "copyMessage").message_id,
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
            orThrow(this.chat, "sendPhoto").id,
            photo,
            other,
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
            orThrow(this.chat, "sendAudio").id,
            audio,
            other,
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
            orThrow(this.chat, "sendDocument").id,
            document,
            other,
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
            orThrow(this.chat, "sendVideo").id,
            video,
            other,
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
            orThrow(this.chat, "sendAnimation").id,
            animation,
            other,
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
            orThrow(this.chat, "sendVoice").id,
            voice,
            other,
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
            orThrow(this.chat, "sendVideoNote").id,
            video_note,
            other,
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
            orThrow(this.chat, "sendMediaGroup").id,
            media,
            other,
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
            orThrow(this.chat, "sendLocation").id,
            latitude,
            longitude,
            other,
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
                orThrow(this.chat, "editMessageLiveLocation").id,
                orThrow(this.msg, "editMessageLiveLocation").message_id,
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
                orThrow(this.chat, "stopMessageLiveLocation").id,
                orThrow(this.msg, "stopMessageLiveLocation").message_id,
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
            orThrow(this.chat, "sendVenue").id,
            latitude,
            longitude,
            title,
            address,
            other,
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
            orThrow(this.chat, "sendContact").id,
            phone_number,
            first_name,
            other,
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
        options: readonly string[],
        other?: Other<"sendPoll", "chat_id" | "question" | "options">,
        signal?: AbortSignal,
    ) {
        return this.api.sendPoll(
            orThrow(this.chat, "sendPoll").id,
            question,
            options,
            other,
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
            orThrow(this.chat, "sendDice").id,
            emoji,
            other,
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
            | "find_location"
            | "record_video_note"
            | "upload_video_note",
        signal?: AbortSignal,
    ) {
        return this.api.sendChatAction(
            orThrow(this.chat, "sendChatAction").id,
            action,
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
     */ banAuthor(
        other?: Other<"banChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.api.banChatMember(
            orThrow(this.chat, "banAuthor").id,
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
            orThrow(this.chat, "banChatMember").id,
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
            orThrow(this.chat, "unbanChatMember").id,
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
            orThrow(this.chat, "restrictAuthor").id,
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
            orThrow(this.chat, "restrictChatMember").id,
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
            orThrow(this.chat, "promoteAuthor").id,
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
            orThrow(this.chat, "promoteChatMember").id,
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
            orThrow(this.chat, "setChatAdministratorAuthorCustomTitle").id,
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
            orThrow(this.chat, "setChatAdministratorCustomTitle").id,
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
            orThrow(this.chat, "banChatSenderChat").id,
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
            orThrow(this.chat, "unbanChatSenderChat").id,
            sender_chat_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.setChatPermissions`. Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
     *
     * @param permissions New default chat permissions
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatpermissions
     */
    setChatPermissions(permissions: ChatPermissions, signal?: AbortSignal) {
        return this.api.setChatPermissions(
            orThrow(this.chat, "setChatPermissions").id,
            permissions,
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
            orThrow(this.chat, "exportChatInviteLink").id,
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
            orThrow(this.chat, "createChatInviteLink").id,
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
            orThrow(this.chat, "editChatInviteLink").id,
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
            orThrow(this.chat, "editChatInviteLink").id,
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
            orThrow(this.chat, "approveChatJoinRequest").id,
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
            orThrow(this.chat, "declineChatJoinRequest").id,
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
            orThrow(this.chat, "setChatPhoto").id,
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
            orThrow(this.chat, "deleteChatPhoto").id,
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
            orThrow(this.chat, "setChatTitle").id,
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
            orThrow(this.chat, "setChatDescription").id,
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
            orThrow(this.chat, "pinChatMessage").id,
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
            orThrow(this.chat, "unpinChatMessage").id,
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
            orThrow(this.chat, "unpinAllChatMessages").id,
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
        return this.api.leaveChat(orThrow(this.chat, "leaveChat").id, signal);
    }

    /**
     * Context-aware alias for `api.getChat`. Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchat
     */
    getChat(signal?: AbortSignal) {
        return this.api.getChat(orThrow(this.chat, "getChat").id, signal);
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
            orThrow(this.chat, "getChatAdministrators").id,
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
            orThrow(this.chat, "getChatMemberCount").id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.getChatMember`. Use this method to get information about a member of a chat. Returns a ChatMember object on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmember
     */
    getAuthor(signal?: AbortSignal) {
        return this.api.getChatMember(
            orThrow(this.chat, "getAuthor").id,
            orThrow(this.from, "getAuthor").id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.getChatMember`. Use this method to get information about a member of a chat. Returns a ChatMember object on success.
     *
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmember
     */
    getChatMember(user_id: number, signal?: AbortSignal) {
        return this.api.getChatMember(
            orThrow(this.chat, "getChatMember").id,
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
            orThrow(this.chat, "setChatStickerSet").id,
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
            orThrow(this.chat, "deleteChatStickerSet").id,
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
     * Context-aware alias for `api.editMessageText`. Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
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
                orThrow(this.chat, "editMessageText").id,
                orThrow(this.msg, "editMessageText").message_id,
                text,
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.editMessageCaption`. Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
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
                orThrow(this.chat, "editMessageCaption").id,
                orThrow(this.msg, "editMessageCaption").message_id,
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.editMessageMedia`. Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
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
                orThrow(this.chat, "editMessageMedia").id,
                orThrow(this.msg, "editMessageMedia").message_id,
                media,
                other,
                signal,
            );
    }

    /**
     * Context-aware alias for `api.editMessageReplyMarkup`. Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
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
                orThrow(this.chat, "editMessageReplyMarkup").id,
                orThrow(this.msg, "editMessageReplyMarkup").message_id,
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
            orThrow(this.chat, "stopPoll").id,
            orThrow(this.msg, "stopPoll").message_id,
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
            orThrow(this.chat, "deleteMessage").id,
            orThrow(this.msg, "deleteMessage").message_id,
            signal,
        );
    }

    /**
     * Context-aware alias for `api.sendSticker`. Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
     *
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP file from the Internet, or upload a new one using multipart/form-data.
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
            orThrow(this.chat, "sendSticker").id,
            sticker,
            other,
            signal,
        );
    }

    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
     *
     * @param custom_emoji_ids List of custom emoji identifiers
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
     * @param provider_token Payments provider token, obtained via BotFather
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
        provider_token: string,
        currency: string,
        prices: readonly LabeledPrice[],
        other?: Other<
            "sendInvoice",
            | "chat_id"
            | "title"
            | "description"
            | "payload"
            | "provider_token"
            | "currency"
            | "prices"
        >,
        signal?: AbortSignal,
    ) {
        return this.api.sendInvoice(
            orThrow(this.chat, "sendInvoice").id,
            title,
            description,
            payload,
            provider_token,
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
            orThrow(this.chat, "sendGame").id,
            game_short_name,
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
    C,
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
    C,
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
    C,
    "inline_query"
>;

type ChatTypeContextCore<T extends Chat["type"]> =
    & Record<"update", ChatTypeUpdate<T>> // ctx.update
    & ChatType<T> // ctx.chat
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
    & C
    & ChatTypeContextCore<T>;
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
