// deno-lint-ignore-file camelcase
import type {
    AcceptedGiftTypes,
    // deno-lint-ignore no-unused-vars
    Audio, // used in TSDoc strings
    BotAccessSettings,
    BotCommand,
    BotDescription,
    BotName,
    BotShortDescription,
    BusinessConnection,
    ChatAdministratorRights,
    ChatFullInfo,
    ChatInviteLink,
    ChatMember,
    ChatMemberAdministrator,
    ChatMemberOwner,
    ChatPermissions,
    // deno-lint-ignore no-unused-vars
    Document, // used in TSDoc strings
    File,
    ForumTopic,
    GameHighScore,
    Gifts,
    InlineKeyboardMarkup,
    InlineQueryResult,
    InputChecklist,
    InputFile,
    InputMedia,
    InputMediaAudio,
    InputMediaDocument,
    InputMediaLivePhoto,
    InputMediaPhoto,
    InputMediaVideo,
    InputPaidMedia,
    InputPollOption,
    InputProfilePhoto,
    InputRichMessage,
    InputSticker,
    InputStoryContent,
    KeyboardButton,
    LabeledPrice,
    MaskPosition,
    MenuButton,
    // deno-lint-ignore no-unused-vars
    MenuButtonDefault, // used in TSDoc strings
    Message,
    MessageId,
    OwnedGifts,
    PassportElementError,
    Poll,
    PreparedInlineMessage,
    PreparedKeyboardButton,
    ReactionType,
    ReactionTypeEmoji,
    SentGuestMessage,
    SentWebAppMessage,
    ShippingOption,
    StarAmount,
    StarTransactions,
    Sticker,
    StickerSet,
    Story,
    Update,
    // deno-lint-ignore no-unused-vars
    User, // used in TSDoc strings
    UserChatBoosts,
    UserFromGetMe,
    UserProfileAudios,
    UserProfilePhotos,
    WebhookInfo,
} from "./types.ts";
import {
    type ApiCallResult,
    type ApiClientOptions,
    type ApiParameters,
    type CallData,
    createRawApi,
    type EditData,
    type RawApi,
    type SendData,
    type TransformerConsumer,
    type WebhookReplyEnvelope,
} from "./client.ts";

/**
 * This class provides access to the full Telegram Bot API. All methods of the
 * API have an equivalent on this class, with the most important parameters
 * pulled up into the function signature, and the other parameters captured by
 * an object.
 *
 * In addition, this class has a property `raw` that provides raw access to the
 * complete Telegram API, with the method signatures 1:1 represented as
 * documented on the website (https://core.telegram.org/bots/api).
 *
 * Every method takes an optional `AbortSignal` object that allows you to cancel
 * the request if desired.
 *
 * In advanced use cases, this class allows to install transformers that can
 * modify the method and payload on the fly before sending it to the Telegram
 * servers. Confer the `transform` property for this.
 */
export class Api<R extends RawApi = RawApi> {
    /**
     * Provides access to all methods of the Telegram Bot API exactly as
     * documented on the website (https://core.telegram.org/bots/api). No
     * arguments are pulled up in the function signature for convenience.
     *
     * If you suppress compiler warnings, this also allows for raw api calls to
     * undocumented methods with arbitrary parameters—use only if you know what
     * you are doing.
     */
    public readonly raw: R;

    /**
     * Allows to install an API request transformer function. A transformer
     * function has access to every API call before it is being performed.
     * This includes the method as string, the payload as object and the
     * upstream transformer function.
     */
    public readonly transform: TransformerConsumer<R>;

    /**
     * Constructs a new instance of `Api`. It is independent from all other
     * instances of this class. For example, this lets you install a custom set
     * of transformers.
     *
     * @param token Bot API token obtained from [@BotFather](https://t.me/BotFather)
     * @param options Optional API client options for the underlying client instance
     * @param webhookReplyEnvelope Optional envelope to handle webhook replies
     */
    constructor(
        public readonly token: string,
        public readonly options?: ApiClientOptions,
        webhookReplyEnvelope?: WebhookReplyEnvelope,
    ) {
        const { raw, transform } = createRawApi<R>(
            token,
            options,
            webhookReplyEnvelope,
        );
        this.raw = raw;
        this.transform = transform;
    }

    async send(
        chat_id: number | string,
        data: SendData<R>,
        signal?: AbortSignal,
    ): Promise<Message> {
        const d = data as SendData<RawApi>;
        const payload = typeof d === "string" ? { text: d } : d;
        if ("text" in payload) {
            return await this.raw.sendMessage({ chat_id, ...payload }, signal);
        }
        if ("live_photo" in payload) {
            return await this.raw.sendLivePhoto(
                { chat_id, ...payload } as ApiParameters<"sendLivePhoto">,
                signal,
            );
        }
        if ("photo" in payload) {
            return await this.raw.sendPhoto({ chat_id, ...payload }, signal);
        }
        if ("audio" in payload) {
            return await this.raw.sendAudio({ chat_id, ...payload }, signal);
        }
        if ("document" in payload) {
            return await this.raw.sendDocument({ chat_id, ...payload }, signal);
        }
        if ("video" in payload) {
            return await this.raw.sendVideo({ chat_id, ...payload }, signal);
        }
        if ("animation" in payload) {
            return await this.raw.sendAnimation(
                { chat_id, ...payload },
                signal,
            );
        }
        if ("voice" in payload) {
            return await this.raw.sendVoice({ chat_id, ...payload }, signal);
        }
        if ("video_note" in payload) {
            return await this.raw.sendVideoNote(
                { chat_id, ...payload },
                signal,
            );
        }
        if ("address" in payload) {
            return await this.raw.sendVenue({ chat_id, ...payload }, signal);
        }
        if ("latitude" in payload) {
            return await this.raw.sendLocation({ chat_id, ...payload }, signal);
        }
        if ("phone_number" in payload) {
            return await this.raw.sendContact({ chat_id, ...payload }, signal);
        }
        if ("question" in payload) {
            return await this.raw.sendPoll({ chat_id, ...payload }, signal);
        }
        if ("media" in payload) { // must come after polls which may also have media
            return await this.raw.sendPaidMedia(
                { chat_id, ...payload },
                signal,
            );
        }
        if ("sticker" in payload) {
            return await this.raw.sendSticker({ chat_id, ...payload }, signal);
        }
        if ("emoji" in payload) {
            return await this.raw.sendDice({ chat_id, ...payload }, signal);
        }
        if ("rich_message" in payload) {
            return await this.raw.sendRichMessage(
                { chat_id, ...payload },
                signal,
            );
        }
        if ("currency" in payload) {
            return await this.raw.sendInvoice({ chat_id, ...payload }, signal);
        }
        payload satisfies never;
        throw new Error("Cannot send unknown data!");
    }

    async edit(
        chat_id: number | string,
        message_id: number,
        data: EditData<R>,
        signal?: AbortSignal,
    ): Promise<Message> {
        const d = data as EditData<RawApi>;
        const payload = typeof d === "string" ? { text: d } : d;
        if ("text" in payload || "rich_message" in payload) {
            return (await this.raw.editMessageText(
                { chat_id, message_id, ...payload },
                signal,
            )) as Message;
        }
        if ("caption" in payload) {
            return (await this.raw.editMessageCaption(
                { chat_id, message_id, ...payload },
                signal,
            )) as Message;
        }
        if ("media" in payload) {
            return (await this.raw.editMessageMedia(
                { chat_id, message_id, ...payload },
                signal,
            )) as Message;
        }
        if ("latitude" in payload) {
            return (await this.raw.editMessageLiveLocation(
                { chat_id, message_id, ...payload },
                signal,
            )) as Message;
        }
        if ("reply_markup" in payload) {
            return (await this.raw.editMessageReplyMarkup(
                { chat_id, message_id, ...payload },
                signal,
            )) as Message;
        }
        payload satisfies never;
        throw new Error("Cannot edit unknown data!");
    }

    async editInline(
        inline_message_id: string,
        data: EditData<R>,
        signal?: AbortSignal,
    ): Promise<true> {
        const d = data as EditData<RawApi>;
        const payload = typeof d === "string" ? { text: d } : d;
        if ("text" in payload || "rich_message" in payload) {
            return (await this.raw.editMessageText(
                { inline_message_id, ...payload },
                signal,
            )) as true;
        }
        if ("caption" in payload) {
            return (await this.raw.editMessageCaption(
                { inline_message_id, ...payload },
                signal,
            )) as true;
        }
        if ("media" in payload) {
            return (await this.raw.editMessageMedia(
                { inline_message_id, ...payload },
                signal,
            )) as true;
        }
        if ("latitude" in payload) {
            return (await this.raw.editMessageLiveLocation(
                { inline_message_id, ...payload },
                signal,
            )) as true;
        }
        if ("reply_markup" in payload) {
            return (await this.raw.editMessageReplyMarkup(
                { inline_message_id, ...payload },
                signal,
            )) as true;
        }
        payload satisfies never;
        throw new Error("Cannot send unknown data!");
    }

    async call<D extends CallData<R>>(
        data: D,
    ): Promise<ApiCallResult<D["method"], R>> {
        type Method = (
            payload: D["payload"],
        ) => Promise<ApiCallResult<D["method"], R>>;
        return await (this.raw[data.method] as Method)(data.payload);
    }
    /**
     * Use this method to receive incoming updates using long polling ({@link https://en.wikipedia.org/wiki/Push_technology#Long_polling | wiki}). Returns an Array of {@link Update} objects.
     *
     * > **Notes**
     * >
     * > 1. This method will not work if an outgoing webhook is set up.
     * > 2. In order to avoid getting duplicate updates, recalculate _offset_ after each server response.
     *
     * @see {@link https://core.telegram.org/bots/api#getupdates}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getUpdates(
        other?: Partial<ApiParameters<"getUpdates", R>>,
        signal?: AbortSignal,
    ): Promise<Update[]> {
        return await this.raw.getUpdates({
            ...other,
        }, signal);
    }
    /**
     * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized {@link Update}. In case of an unsuccessful request (a request with response {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes | HTTP status code} different from `2XY`), we will repeat the request and give up after a reasonable amount of attempts. Returns `true` on success.
     *
     * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter _secret_token_. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.
     *
     * > **Notes**
     * >
     * > 1. You will not be able to receive updates using {@link getUpdates} for as long as an outgoing webhook is set up.
     * > 2. To use a self-signed certificate, you need to upload your {@link https://core.telegram.org/bots/self-signed | public key certificate} using _certificate_ parameter. Please upload as InputFile, sending a String will not work.
     * > 3. Ports currently supported _for webhooks_: **443, 80, 88, 8443**.
     *
     * > If you're having any trouble setting up webhooks, please check out this {@link https://core.telegram.org/bots/webhooks | amazing guide to webhooks}.
     *
     * @see {@link https://core.telegram.org/bots/api#setwebhook}
     * @param url HTTPS URL to send updates to. Use an empty string to remove webhook integration.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setWebhook(
        url: string,
        other?: Partial<ApiParameters<"setWebhook", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setWebhook({
            url,
            ...other,
        }, signal);
    }
    /**
     * Use this method to remove webhook integration if you decide to switch back to {@link getUpdates}. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletewebhook}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteWebhook(
        other?: Partial<ApiParameters<"deleteWebhook", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteWebhook({
            ...other,
        }, signal);
    }
    /**
     * Use this method to get current webhook status. Requires no parameters. On success, returns a {@link WebhookInfo} object. If the bot is using {@link getUpdates}, will return an object with the _url_ field empty.
     *
     * @see {@link https://core.telegram.org/bots/api#getwebhookinfo}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getWebhookInfo(
        other?: Partial<ApiParameters<"getWebhookInfo", R>>,
        signal?: AbortSignal,
    ): Promise<WebhookInfo> {
        return await this.raw.getWebhookInfo({
            ...other,
        }, signal);
    }
    /**
     * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a {@link User} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getme}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getMe(
        other?: Partial<ApiParameters<"getMe", R>>,
        signal?: AbortSignal,
    ): Promise<UserFromGetMe> {
        return await this.raw.getMe({
            ...other,
        }, signal);
    }
    /**
     * Use this method to log out from the cloud Bot API server before launching the bot locally. You **must** log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns `true` on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#logout}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async logOut(
        other?: Partial<ApiParameters<"logOut", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.logOut({
            ...other,
        }, signal);
    }
    /**
     * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns `true` on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#close}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async close(
        other?: Partial<ApiParameters<"close", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.close({
            ...other,
        }, signal);
    }
    /**
     * Use this method to send text messages. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessage}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendMessage(
        chat_id: number | string,
        text: string,
        other?: Partial<ApiParameters<"sendMessage", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendMessage({
            chat_id,
            text,
            ...other,
        }, signal);
    }
    /**
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessage}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format `@username`)
     * @param message_id Message identifier in the chat specified in _from_chat_id_
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async forwardMessage(
        chat_id: number | string,
        from_chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"forwardMessage", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.forwardMessage({
            chat_id,
            from_chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of {@link MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessages}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param from_chat_id Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format `@username`)
     * @param message_ids A list of 1-100 identifiers of messages in the chat _from_chat_id_ to forward. The identifiers must be specified in a strictly increasing order.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async forwardMessages(
        chat_id: number | string,
        from_chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"forwardMessages", R>>,
        signal?: AbortSignal,
    ): Promise<MessageId[]> {
        return await this.raw.forwardMessages({
            chat_id,
            from_chat_id,
            message_ids,
            ...other,
        }, signal);
    }
    /**
     * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_ids_ is known to the bot. The method is analogous to the method {@link forwardMessage}, but the copied message doesn't have a link to the original message. Returns the {@link MessageId} of the sent message on success.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessage}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format `@username`)
     * @param message_id Message identifier in the chat specified in _from_chat_id_
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async copyMessage(
        chat_id: number | string,
        from_chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"copyMessage", R>>,
        signal?: AbortSignal,
    ): Promise<MessageId> {
        return await this.raw.copyMessage({
            chat_id,
            from_chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_ids_ is known to the bot. The method is analogous to the method {@link forwardMessages}, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of {@link MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessages}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param from_chat_id Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format `@username`)
     * @param message_ids A list of 1-100 identifiers of messages in the chat _from_chat_id_ to copy. The identifiers must be specified in a strictly increasing order.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async copyMessages(
        chat_id: number | string,
        from_chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"copyMessages", R>>,
        signal?: AbortSignal,
    ): Promise<MessageId[]> {
        return await this.raw.copyMessages({
            chat_id,
            from_chat_id,
            message_ids,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send photos. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendphoto}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendPhoto(
        chat_id: number | string,
        photo: InputFile | string,
        other?: Partial<ApiParameters<"sendPhoto", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendPhoto({
            chat_id,
            photo,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send live photos. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendlivephoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param live_photo Live photo video to send. The video must be no longer than 10 seconds and must not exceed 10 MB in size. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Sending live photos by a URL is currently unsupported.
     * @param photo The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Sending live photos by a URL is currently unsupported.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendLivePhoto(
        chat_id: number | string,
        live_photo: InputFile | string,
        photo: InputFile | string,
        other?: Partial<ApiParameters<"sendLivePhoto", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendLivePhoto({
            chat_id,
            live_photo,
            photo,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent {@link Message} is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     *
     * For sending voice messages, use the {@link sendVoice} method instead.
     *
     * @see {@link https://core.telegram.org/bots/api#sendaudio}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendAudio(
        chat_id: number | string,
        audio: InputFile | string,
        other?: Partial<ApiParameters<"sendAudio", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendAudio({
            chat_id,
            audio,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send general files. On success, the sent {@link Message} is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#senddocument}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendDocument(
        chat_id: number | string,
        document: InputFile | string,
        other?: Partial<ApiParameters<"sendDocument", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendDocument({
            chat_id,
            document,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as {@link Document}). On success, the sent {@link Message} is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideo}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendVideo(
        chat_id: number | string,
        video: InputFile | string,
        other?: Partial<ApiParameters<"sendVideo", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendVideo({
            chat_id,
            video,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent {@link Message} is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendanimation}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendAnimation(
        chat_id: number | string,
        animation: InputFile | string,
        other?: Partial<ApiParameters<"sendAnimation", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendAnimation({
            chat_id,
            animation,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as {@link Audio} or {@link Document}). On success, the sent {@link Message} is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvoice}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendVoice(
        chat_id: number | string,
        voice: InputFile | string,
        other?: Partial<ApiParameters<"sendVoice", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendVoice({
            chat_id,
            voice,
            ...other,
        }, signal);
    }
    /**
     * As of {@link https://telegram.org/blog/video-messages-and-telescope | v.4.0}, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideonote}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param video_note Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Sending video notes by a URL is currently unsupported.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendVideoNote(
        chat_id: number | string,
        video_note: InputFile | string,
        other?: Partial<ApiParameters<"sendVideoNote", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendVideoNote({
            chat_id,
            video_note,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send paid media. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpaidmedia}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance.
     * @param star_count The number of Telegram Stars that must be paid to buy access to the media; 1-25000
     * @param media An Array describing the media to be sent; up to 10 items
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendPaidMedia(
        chat_id: number | string,
        star_count: number,
        media: InputPaidMedia[],
        other?: Partial<ApiParameters<"sendPaidMedia", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendPaidMedia({
            chat_id,
            star_count,
            media,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of {@link Message} objects that were sent is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmediagroup}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param media An Array describing messages to be sent, must include 2-10 items
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendMediaGroup(
        chat_id: number | string,
        media:
            | Array<InputMediaAudio>
            | Array<InputMediaDocument>
            | Array<InputMediaLivePhoto | InputMediaPhoto | InputMediaVideo>,
        other?: Partial<ApiParameters<"sendMediaGroup", R>>,
        signal?: AbortSignal,
    ): Promise<Message[]> {
        return await this.raw.sendMediaGroup({
            chat_id,
            media,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send point on the map. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendlocation}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendLocation(
        chat_id: number | string,
        latitude: number,
        longitude: number,
        other?: Partial<ApiParameters<"sendLocation", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendLocation({
            chat_id,
            latitude,
            longitude,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send information about a venue. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvenue}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param latitude Latitude of the venue
     * @param longitude Longitude of the venue
     * @param title Name of the venue
     * @param address Address of the venue
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendVenue(
        chat_id: number | string,
        latitude: number,
        longitude: number,
        title: string,
        address: string,
        other?: Partial<ApiParameters<"sendVenue", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendVenue({
            chat_id,
            latitude,
            longitude,
            title,
            address,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send phone contacts. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendcontact}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param phone_number Contact's phone number
     * @param first_name Contact's first name
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendContact(
        chat_id: number | string,
        phone_number: string,
        first_name: string,
        other?: Partial<ApiParameters<"sendContact", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendContact({
            chat_id,
            phone_number,
            first_name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send a native poll. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpoll}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`. Polls can't be sent to channel direct messages chats.
     * @param question Poll question, 1-300 characters
     * @param options A list of 1-12 answer options
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendPoll(
        chat_id: number | string,
        question: string,
        options: InputPollOption[],
        other?: Partial<ApiParameters<"sendPoll", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendPoll({
            chat_id,
            question,
            options,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send a checklist on behalf of a connected business account. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchecklist}
     * @param business_connection_id Unique identifier of the business connection on behalf of which the message will be sent
     * @param chat_id Unique identifier for the target chat or username of the target bot in the format `@username`
     * @param checklist An object for the checklist to send
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendChecklist(
        business_connection_id: string,
        chat_id: number | string,
        checklist: InputChecklist,
        other?: Partial<ApiParameters<"sendChecklist", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendChecklist({
            business_connection_id,
            chat_id,
            checklist,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send an animated emoji that will display a random value. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#senddice}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param emoji Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, “🏀”, “⚽”, “🎳”, or “🎰”. Dice can have values 1-6 for “🎲”, “🎯” and “🎳”, values 1-5 for “🏀” and “⚽”, and values 1-64 for “🎰”. Defaults to “🎲”.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendDice(
        chat_id: number | string,
        emoji: "🎲" | "🎯" | "🏀" | "⚽" | "🎳" | "🎰" | undefined,
        other?: Partial<ApiParameters<"sendDice", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendDice({
            chat_id,
            emoji,
            ...other,
        }, signal);
    }
    /**
     * Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you **must** call {@link sendMessage} with the complete message to persist it in the user's chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessagedraft}
     * @param chat_id Unique identifier for the target private chat
     * @param draft_id Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated.
     * @param text Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a “Thinking…” placeholder.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendMessageDraft(
        chat_id: number,
        draft_id: number,
        text: string | undefined,
        other?: Partial<ApiParameters<"sendMessageDraft", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.sendMessageDraft({
            chat_id,
            draft_id,
            text,
            ...other,
        }, signal);
    }
    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns `true` on success.
     *
     * > Example: The {@link https://t.me/imagebot | ImageBot} needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use {@link sendChatAction} with _action_ = _upload_photo_. The user will see a “sending photo” status for the bot.
     *
     * We only recommend using this method when a response from the bot will take a **noticeable** amount of time to arrive.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchataction}
     * @param chat_id Unique identifier for the target chat or username of the target bot or supergroup in the format `@username`. Channel chats and channel direct messages chats aren't supported.
     * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for {@link sendMessage | text messages}, _upload_photo_ for {@link sendPhoto | photos}, _record_video_ or _upload_video_ for {@link sendVideo | videos}, _record_voice_ or _upload_voice_ for {@link sendVoice | voice notes}, _upload_document_ for {@link sendDocument | general files}, _choose_sticker_ for {@link sendSticker | stickers}, _find_location_ for {@link sendLocation | location data}, _record_video_note_ or _upload_video_note_ for {@link sendVideoNote | video notes}.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
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
        other?: Partial<ApiParameters<"sendChatAction", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.sendChatAction({
            chat_id,
            action,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmessagereaction}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.
     * @param reaction A list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setMessageReaction(
        chat_id: number | string,
        message_id: number,
        reaction:
            | (ReactionTypeEmoji["emoji"] | ReactionType)
            | Array<ReactionTypeEmoji["emoji"] | ReactionType>
            | undefined,
        other?: Partial<ApiParameters<"setMessageReaction", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setMessageReaction({
            chat_id,
            message_id,
            reaction: reaction === undefined
                ? undefined
                : (Array.isArray(reaction) ? reaction : [reaction])
                    .map((emoji): ReactionType =>
                        typeof emoji === "string"
                            ? ({ type: "emoji", emoji })
                            : emoji
                    ),
            ...other,
        }, signal);
    }
    /**
     * Use this method to get a list of profile pictures for a user. Returns a {@link UserProfilePhotos} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getUserProfilePhotos(
        user_id: number,
        other?: Partial<ApiParameters<"getUserProfilePhotos", R>>,
        signal?: AbortSignal,
    ): Promise<UserProfilePhotos> {
        return await this.raw.getUserProfilePhotos({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get a list of profile audios for a user. Returns a {@link UserProfileAudios} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserprofileaudios}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getUserProfileAudios(
        user_id: number,
        other?: Partial<ApiParameters<"getUserProfileAudios", R>>,
        signal?: AbortSignal,
    ): Promise<UserProfileAudios> {
        return await this.raw.getUserProfileAudios({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method {@link https://core.telegram.org/bots/webapps#initializing-mini-apps | requestEmojiStatusAccess}. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setuseremojistatus}
     * @param user_id Unique identifier of the target user
     * @param emoji_status_custom_emoji_id Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setUserEmojiStatus(
        user_id: number,
        emoji_status_custom_emoji_id: string | undefined,
        other?: Partial<ApiParameters<"setUserEmojiStatus", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setUserEmojiStatus({
            user_id,
            emoji_status_custom_emoji_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a {@link File} object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling {@link getFile} again.
     *
     * **Note:** This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     *
     * @see {@link https://core.telegram.org/bots/api#getfile}
     * @param file_id File identifier to get information about
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getFile(
        file_id: string,
        other?: Partial<ApiParameters<"getFile", R>>,
        signal?: AbortSignal,
    ): Promise<File> {
        return await this.raw.getFile({
            file_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless {@link unbanChatMember | unbanned} first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatmember}
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async banChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"banChatMember", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.banChatMember({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter _only_if_banned_. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async unbanChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"unbanChatMember", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.unbanChatMember({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass `true` for all permissions to lift restrictions from a user. Returns `true` on success.
     *
     * > grammY sets `use_independent_chat_permissions: true` for this method, so you can specify all chat permissions in {@link ChatPermissions} independently by default.
     *
     * @see {@link https://core.telegram.org/bots/api#restrictchatmember}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param permissions An object for new user permissions
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async restrictChatMember(
        chat_id: number | string,
        user_id: number,
        permissions: ChatPermissions,
        other?: Partial<ApiParameters<"restrictChatMember", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.restrictChatMember({
            chat_id,
            user_id,
            permissions,
            use_independent_chat_permissions: true,
            ...other,
        }, signal);
    }
    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass `false` for all boolean parameters to demote a user. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#promotechatmember}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async promoteChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"promoteChatMember", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.promoteChatMember({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatadministratorcustomtitle}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatAdministratorCustomTitle(
        chat_id: number | string,
        user_id: number,
        custom_title: string,
        other?: Partial<ApiParameters<"setChatAdministratorCustomTitle", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatAdministratorCustomTitle({
            chat_id,
            user_id,
            custom_title,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the _can_manage_tags_ administrator right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatmembertag}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param tag New tag for the member; 0-16 characters, emoji are not allowed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatMemberTag(
        chat_id: number | string,
        user_id: number,
        tag: string | undefined,
        other?: Partial<ApiParameters<"setChatMemberTag", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatMemberTag({
            chat_id,
            user_id,
            tag,
            ...other,
        }, signal);
    }
    /**
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is {@link unbanChatSenderChat | unbanned}, the owner of the banned chat won't be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatsenderchat}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async banChatSenderChat(
        chat_id: number | string,
        sender_chat_id: number,
        other?: Partial<ApiParameters<"banChatSenderChat", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.banChatSenderChat({
            chat_id,
            sender_chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatsenderchat}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async unbanChatSenderChat(
        chat_id: number | string,
        sender_chat_id: number,
        other?: Partial<ApiParameters<"unbanChatSenderChat", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.unbanChatSenderChat({
            chat_id,
            sender_chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can_restrict_members_ administrator rights. Returns `true` on success.
     *
     * > grammY sets `use_independent_chat_permissions: true` for this method, so you can specify all chat permissions in {@link ChatPermissions} independently by default.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatpermissions}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param permissions An object for new default chat permissions
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatPermissions(
        chat_id: number | string,
        permissions: ChatPermissions,
        other?: Partial<ApiParameters<"setChatPermissions", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatPermissions({
            chat_id,
            permissions,
            use_independent_chat_permissions: true,
            ...other,
        }, signal);
    }
    /**
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as `string` on success.
     *
     * > Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using {@link exportChatInviteLink} or by calling the {@link getChat} method. If your bot needs to generate a new primary invite link replacing its previous one, use {@link exportChatInviteLink} again.
     *
     * @see {@link https://core.telegram.org/bots/api#exportchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async exportChatInviteLink(
        chat_id: number | string,
        other?: Partial<ApiParameters<"exportChatInviteLink", R>>,
        signal?: AbortSignal,
    ): Promise<string> {
        return await this.raw.exportChatInviteLink({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method {@link revokeChatInviteLink}. Returns the new invite link as {@link ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async createChatInviteLink(
        chat_id: number | string,
        other?: Partial<ApiParameters<"createChatInviteLink", R>>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.raw.createChatInviteLink({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a {@link ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editChatInviteLink(
        chat_id: number | string,
        invite_link: string,
        other?: Partial<ApiParameters<"editChatInviteLink", R>>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.raw.editChatInviteLink({
            chat_id,
            invite_link,
            ...other,
        }, signal);
    }
    /**
     * Use this method to create a {@link https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions | subscription invite link} for a channel chat. The bot must have the _can_invite_users_ administrator rights. The link can be edited using the method {@link editChatSubscriptionInviteLink} or revoked using the method {@link revokeChatInviteLink}. Returns the new invite link as a {@link ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatsubscriptioninvitelink}
     * @param chat_id Unique identifier for the target channel chat or username of the target channel in the format `@username`
     * @param subscription_period The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).
     * @param subscription_price The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async createChatSubscriptionInviteLink(
        chat_id: number | string,
        subscription_period: 2592000,
        subscription_price: number,
        other?: Partial<ApiParameters<"createChatSubscriptionInviteLink", R>>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.raw.createChatSubscriptionInviteLink({
            chat_id,
            subscription_period,
            subscription_price,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit a subscription invite link created by the bot. The bot must have the _can_invite_users_ administrator rights. Returns the edited invite link as a {@link ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatsubscriptioninvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editChatSubscriptionInviteLink(
        chat_id: number | string,
        invite_link: string,
        other?: Partial<ApiParameters<"editChatSubscriptionInviteLink", R>>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.raw.editChatSubscriptionInviteLink({
            chat_id,
            invite_link,
            ...other,
        }, signal);
    }
    /**
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as {@link ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#revokechatinvitelink}
     * @param chat_id Unique identifier of the target chat or username of the target channel in the format `@username`
     * @param invite_link The invite link to revoke
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async revokeChatInviteLink(
        chat_id: number | string,
        invite_link: string,
        other?: Partial<ApiParameters<"revokeChatInviteLink", R>>,
        signal?: AbortSignal,
    ): Promise<ChatInviteLink> {
        return await this.raw.revokeChatInviteLink({
            chat_id,
            invite_link,
            ...other,
        }, signal);
    }
    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvechatjoinrequest}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async approveChatJoinRequest(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"approveChatJoinRequest", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.approveChatJoinRequest({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinechatjoinrequest}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async declineChatJoinRequest(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"declineChatJoinRequest", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.declineChatJoinRequest({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to process a received chat join request query. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#answerchatjoinrequestquery}
     * @param chat_join_request_query_id Unique identifier of the join request query
     * @param result Result of the query. Must be either “approve” to allow the user to join the chat, “decline” to disallow the user to join the chat, or “queue” to leave the decision to other administrators.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerChatJoinRequestQuery(
        chat_join_request_query_id: string,
        result: "approve" | "decline" | "queue",
        other?: Partial<ApiParameters<"answerChatJoinRequestQuery", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.answerChatJoinRequestQuery({
            chat_join_request_query_id,
            result,
            ...other,
        }, signal);
    }
    /**
     * Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call {@link answerChatJoinRequestQuery} to resolve the join request query based on the user interaction with the Mini App. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchatjoinrequestwebapp}
     * @param chat_join_request_query_id Unique identifier of the join request query
     * @param web_app_url An HTTPS URL of a Web App to be opened with additional data as specified in {@link https://core.telegram.org/bots/webapps#initializing-mini-apps | Initializing Web Apps}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendChatJoinRequestWebApp(
        chat_join_request_query_id: string,
        web_app_url: string,
        other?: Partial<ApiParameters<"sendChatJoinRequestWebApp", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.sendChatJoinRequestWebApp({
            chat_join_request_query_id,
            web_app_url,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param photo New chat photo, uploaded using multipart/form-data
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatPhoto(
        chat_id: number | string,
        photo: InputFile,
        other?: Partial<ApiParameters<"setChatPhoto", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatPhoto({
            chat_id,
            photo,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteChatPhoto(
        chat_id: number | string,
        other?: Partial<ApiParameters<"deleteChatPhoto", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteChatPhoto({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchattitle}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param title New chat title, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatTitle(
        chat_id: number | string,
        title: string,
        other?: Partial<ApiParameters<"setChatTitle", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatTitle({
            chat_id,
            title,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatdescription}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param description New chat description, 0-255 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatDescription(
        chat_id: number | string,
        description: string | undefined,
        other?: Partial<ApiParameters<"setChatDescription", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatDescription({
            chat_id,
            description,
            ...other,
        }, signal);
    }
    /**
     * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param message_id Identifier of a message to pin
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async pinChatMessage(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"pinChatMessage", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.pinChatMessage({
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param message_id Identifier of the message to unpin. Required if _business_connection_id_ is specified. If not specified, the most recent pinned message (by sending date) will be unpinned.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async unpinChatMessage(
        chat_id: number | string,
        message_id: number | undefined,
        other?: Partial<ApiParameters<"unpinChatMessage", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.unpinChatMessage({
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallchatmessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async unpinAllChatMessages(
        chat_id: number | string,
        other?: Partial<ApiParameters<"unpinAllChatMessages", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.unpinAllChatMessages({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method for your bot to leave a group, supergroup or channel. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#leavechat}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel in the format `@username`. Channel direct messages chats aren't supported; leave the corresponding channel instead.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async leaveChat(
        chat_id: number | string,
        other?: Partial<ApiParameters<"leaveChat", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.leaveChat({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get up-to-date information about the chat. Returns a {@link ChatFullInfo} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchat}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getChat(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChat", R>>,
        signal?: AbortSignal,
    ): Promise<ChatFullInfo> {
        return await this.raw.getChat({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get a list of administrators in a chat. Returns an Array of {@link ChatMember} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getChatAdministrators(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChatAdministrators", R>>,
        signal?: AbortSignal,
    ): Promise<Array<ChatMemberOwner | ChatMemberAdministrator>> {
        return await this.raw.getChatAdministrators({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the number of members in a chat. Returns `number` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmembercount}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getChatMemberCount(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChatMemberCount", R>>,
        signal?: AbortSignal,
    ): Promise<number> {
        return await this.raw.getChatMemberCount({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a {@link ChatMember} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmember}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"getChatMember", R>>,
        signal?: AbortSignal,
    ): Promise<ChatMember> {
        return await this.raw.getChatMember({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of {@link Message} objects is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserpersonalchatmessages}
     * @param user_id Unique identifier for the target user
     * @param limit The maximum number of messages to return; 1-20
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getUserPersonalChatMessages(
        user_id: number,
        limit: number,
        other?: Partial<ApiParameters<"getUserPersonalChatMessages", R>>,
        signal?: AbortSignal,
    ): Promise<Message[]> {
        return await this.raw.getUserPersonalChatMessages({
            user_id,
            limit,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link getChat} requests to check if the bot can use this method. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatstickerset}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatStickerSet(
        chat_id: number | string,
        sticker_set_name: string,
        other?: Partial<ApiParameters<"setChatStickerSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatStickerSet({
            chat_id,
            sticker_set_name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link getChat} requests to check if the bot can use this method. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatstickerset}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteChatStickerSet(
        chat_id: number | string,
        other?: Partial<ApiParameters<"deleteChatStickerSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteChatStickerSet({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of {@link Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getforumtopiciconstickers}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getForumTopicIconStickers(
        other?: Partial<ApiParameters<"getForumTopicIconStickers", R>>,
        signal?: AbortSignal,
    ): Promise<Sticker[]> {
        return await this.raw.getForumTopicIconStickers({
            ...other,
        }, signal);
    }
    /**
     * Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator right. Returns information about the created topic as a {@link ForumTopic} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param name Topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async createForumTopic(
        chat_id: number | string,
        name: string,
        other?: Partial<ApiParameters<"createForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<ForumTopic> {
        return await this.raw.createForumTopic({
            chat_id,
            name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"editForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editForumTopic({
            chat_id,
            message_thread_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closeforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async closeForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"closeForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.closeForumTopic({
            chat_id,
            message_thread_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopenforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async reopenForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"reopenForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.reopenForumTopic({
            chat_id,
            message_thread_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_delete_messages_ administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"deleteForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteForumTopic({
            chat_id,
            message_thread_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallforumtopicmessages}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async unpinAllForumTopicMessages(
        chat_id: number | string,
        message_thread_id: number,
        other?: Partial<ApiParameters<"unpinAllForumTopicMessages", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.unpinAllForumTopicMessages({
            chat_id,
            message_thread_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editgeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param name New topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editGeneralForumTopic(
        chat_id: number | string,
        name: string,
        other?: Partial<ApiParameters<"editGeneralForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editGeneralForumTopic({
            chat_id,
            name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async closeGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"closeGeneralForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.closeGeneralForumTopic({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically unhidden if it was hidden. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopengeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async reopenGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"reopenGeneralForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.reopenGeneralForumTopic({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically closed if it was open. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#hidegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async hideGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"hideGeneralForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.hideGeneralForumTopic({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unhidegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async unhideGeneralForumTopic(
        chat_id: number | string,
        other?: Partial<ApiParameters<"unhideGeneralForumTopic", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.unhideGeneralForumTopic({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async unpinAllGeneralForumTopicMessages(
        chat_id: number | string,
        other?: Partial<ApiParameters<"unpinAllGeneralForumTopicMessages", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.unpinAllGeneralForumTopicMessages({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send answers to callback queries sent from {@link https://core.telegram.org/bots/features#inline-keyboards | inline keyboards}. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, `true` is returned.
     *
     * > Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via {@link https://t.me/botfather | \@BotFather} and accept the terms. Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter.
     *
     * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
     * @param callback_query_id Unique identifier for the query to be answered
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerCallbackQuery(
        callback_query_id: string,
        other?: Partial<ApiParameters<"answerCallbackQuery", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.answerCallbackQuery({
            callback_query_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to reply to a received guest message. On success, a {@link SentGuestMessage} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answerguestquery}
     * @param guest_query_id Unique identifier for the query to be answered
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerGuestQuery(
        guest_query_id: string,
        result: InlineQueryResult,
        other?: Partial<ApiParameters<"answerGuestQuery", R>>,
        signal?: AbortSignal,
    ): Promise<SentGuestMessage> {
        return await this.raw.answerGuestQuery({
            guest_query_id,
            result,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a {@link UserChatBoosts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserchatboosts}
     * @param chat_id Unique identifier for the chat or username of the channel in the format `@username`
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getUserChatBoosts(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"getUserChatBoosts", R>>,
        signal?: AbortSignal,
    ): Promise<UserChatBoosts> {
        return await this.raw.getUserChatBoosts({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get information about the connection of the bot with a business account. Returns a {@link BusinessConnection} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessconnection}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getBusinessConnection(
        business_connection_id: string,
        other?: Partial<ApiParameters<"getBusinessConnection", R>>,
        signal?: AbortSignal,
    ): Promise<BusinessConnection> {
        return await this.raw.getBusinessConnection({
            business_connection_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the token of a managed bot. Returns the token as `string` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmanagedbottoken}
     * @param user_id User identifier of the managed bot whose token will be returned
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getManagedBotToken(
        user_id: number,
        other?: Partial<ApiParameters<"getManagedBotToken", R>>,
        signal?: AbortSignal,
    ): Promise<string> {
        return await this.raw.getManagedBotToken({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as `string` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#replacemanagedbottoken}
     * @param user_id User identifier of the managed bot whose token will be replaced
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async replaceManagedBotToken(
        user_id: number,
        other?: Partial<ApiParameters<"replaceManagedBotToken", R>>,
        signal?: AbortSignal,
    ): Promise<string> {
        return await this.raw.replaceManagedBotToken({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the access settings of a managed bot. Returns a {@link BotAccessSettings} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmanagedbotaccesssettings}
     * @param user_id User identifier of the managed bot whose access settings will be returned
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getManagedBotAccessSettings(
        user_id: number,
        other?: Partial<ApiParameters<"getManagedBotAccessSettings", R>>,
        signal?: AbortSignal,
    ): Promise<BotAccessSettings> {
        return await this.raw.getManagedBotAccessSettings({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the access settings of a managed bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmanagedbotaccesssettings}
     * @param user_id User identifier of the managed bot whose access settings will be changed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setManagedBotAccessSettingsRestricted(
        user_id: number,
        other?: Partial<ApiParameters<"setManagedBotAccessSettings", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setManagedBotAccessSettings({
            user_id,
            is_access_restricted: true,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the access settings of a managed bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmanagedbotaccesssettings}
     * @param user_id User identifier of the managed bot whose access settings will be changed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setManagedBotAccessSettingsUnrestricted(
        user_id: number,
        other?: Partial<ApiParameters<"setManagedBotAccessSettings", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setManagedBotAccessSettings({
            user_id,
            is_access_restricted: false,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the list of the bot's commands. See {@link https://core.telegram.org/bots/features#commands | this manual} for more details about bot commands. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmycommands}
     * @param commands A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setMyCommands(
        commands: BotCommand[],
        other?: Partial<ApiParameters<"setMyCommands", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setMyCommands({
            commands,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, {@link https://core.telegram.org/bots/api#determining-list-of-commands | higher level commands} will be shown to affected users. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemycommands}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteMyCommands(
        other?: Partial<ApiParameters<"deleteMyCommands", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteMyCommands({
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of {@link BotCommand} objects. If commands aren't set, an empty list is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getmycommands}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getMyCommands(
        other?: Partial<ApiParameters<"getMyCommands", R>>,
        signal?: AbortSignal,
    ): Promise<BotCommand[]> {
        return await this.raw.getMyCommands({
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the bot's name. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyname}
     * @param name New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setMyName(
        name: string | undefined,
        other?: Partial<ApiParameters<"setMyName", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setMyName({
            name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the current bot name for the given user language. Returns {@link BotName} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyname}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getMyName(
        other?: Partial<ApiParameters<"getMyName", R>>,
        signal?: AbortSignal,
    ): Promise<BotName> {
        return await this.raw.getMyName({
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydescription}
     * @param description New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setMyDescription(
        description: string | undefined,
        other?: Partial<ApiParameters<"setMyDescription", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setMyDescription({
            description,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the current bot description for the given user language. Returns {@link BotDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydescription}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getMyDescription(
        other?: Partial<ApiParameters<"getMyDescription", R>>,
        signal?: AbortSignal,
    ): Promise<BotDescription> {
        return await this.raw.getMyDescription({
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyshortdescription}
     * @param short_description New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setMyShortDescription(
        short_description: string | undefined,
        other?: Partial<ApiParameters<"setMyShortDescription", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setMyShortDescription({
            short_description,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the current bot short description for the given user language. Returns {@link BotShortDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyshortdescription}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getMyShortDescription(
        other?: Partial<ApiParameters<"getMyShortDescription", R>>,
        signal?: AbortSignal,
    ): Promise<BotShortDescription> {
        return await this.raw.getMyShortDescription({
            ...other,
        }, signal);
    }
    /**
     * Changes the profile photo of the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyprofilephoto}
     * @param photo The new profile photo to set
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setMyProfilePhoto(
        photo: InputProfilePhoto,
        other?: Partial<ApiParameters<"setMyProfilePhoto", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setMyProfilePhoto({
            photo,
            ...other,
        }, signal);
    }
    /**
     * Removes the profile photo of the bot. Requires no parameters. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removemyprofilephoto}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async removeMyProfilePhoto(
        other?: Partial<ApiParameters<"removeMyProfilePhoto", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.removeMyProfilePhoto({
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatmenubutton}
     * @param menu_button An object for the bot's new menu button. Defaults to {@link MenuButtonDefault}.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setChatMenuButton(
        menu_button: MenuButton | undefined,
        other?: Partial<ApiParameters<"setChatMenuButton", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setChatMenuButton({
            menu_button,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns {@link MenuButton} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmenubutton}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getChatMenuButton(
        other?: Partial<ApiParameters<"getChatMenuButton", R>>,
        signal?: AbortSignal,
    ): Promise<MenuButton> {
        return await this.raw.getChatMenuButton({
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydefaultadministratorrights}
     * @param rights An object describing new default administrator rights. If not specified, the default administrator rights will be cleared.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setMyDefaultAdministratorRights(
        rights: ChatAdministratorRights | undefined,
        other?: Partial<ApiParameters<"setMyDefaultAdministratorRights", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setMyDefaultAdministratorRights({
            rights,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get the current default administrator rights of the bot. Returns {@link ChatAdministratorRights} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydefaultadministratorrights}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getMyDefaultAdministratorRights(
        other?: Partial<ApiParameters<"getMyDefaultAdministratorRights", R>>,
        signal?: AbortSignal,
    ): Promise<ChatAdministratorRights> {
        return await this.raw.getMyDefaultAdministratorRights({
            ...other,
        }, signal);
    }
    /**
     * Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a {@link Gifts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getavailablegifts}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getAvailableGifts(
        other?: Partial<ApiParameters<"getAvailableGifts", R>>,
        signal?: AbortSignal,
    ): Promise<Gifts> {
        return await this.raw.getAvailableGifts({
            ...other,
        }, signal);
    }
    /**
     * Sends a gift to the given user. The gift can't be converted to Telegram Stars by the receiver. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgift}
     * @param user_id Unique identifier of the target user who will receive the gift
     * @param gift_id Identifier of the gift; limited gifts can't be sent to channel chats
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendGiftToUser(
        user_id: number,
        gift_id: string,
        other?: Partial<ApiParameters<"sendGift", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.sendGift({
            user_id,
            gift_id,
            ...other,
        }, signal);
    }
    /**
     * Sends a gift to the given channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgift}
     * @param chat_id Unique identifier for the chat or username of the channel (in the format `@username`) that will receive the gift
     * @param gift_id Identifier of the gift; limited gifts can't be sent to channel chats
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendGiftToChat(
        chat_id: number | string,
        gift_id: string,
        other?: Partial<ApiParameters<"sendGift", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.sendGift({
            chat_id,
            gift_id,
            ...other,
        }, signal);
    }
    /**
     * Gifts a Telegram Premium subscription to the given user. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#giftpremiumsubscription}
     * @param user_id Unique identifier of the target user who will receive a Telegram Premium subscription
     * @param month_count Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12
     * @param star_count Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async giftPremiumSubscription(
        user_id: number,
        month_count: 3 | 6 | 12,
        star_count: 1000 | 1500 | 2500,
        other?: Partial<ApiParameters<"giftPremiumSubscription", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.giftPremiumSubscription({
            user_id,
            month_count,
            star_count,
            ...other,
        }, signal);
    }
    /**
     * Verifies a user {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifyuser}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async verifyUser(
        user_id: number,
        other?: Partial<ApiParameters<"verifyUser", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.verifyUser({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Verifies a chat {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifychat}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`. Channel direct messages chats can't be verified.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async verifyChat(
        chat_id: number | string,
        other?: Partial<ApiParameters<"verifyChat", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.verifyChat({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Removes verification from a user who is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removeuserverification}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async removeUserVerification(
        user_id: number,
        other?: Partial<ApiParameters<"removeUserVerification", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.removeUserVerification({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Removes verification from a chat that is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removechatverification}
     * @param chat_id Unique identifier for the target chat or username of the target bot or channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async removeChatVerification(
        chat_id: number | string,
        other?: Partial<ApiParameters<"removeChatVerification", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.removeChatVerification({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Marks incoming message as read on behalf of a business account. Requires the _can_read_messages_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#readbusinessmessage}
     * @param business_connection_id Unique identifier of the business connection on behalf of which to read the message
     * @param chat_id Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.
     * @param message_id Unique identifier of the message to mark as read
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async readBusinessMessage(
        business_connection_id: string,
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"readBusinessMessage", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.readBusinessMessage({
            business_connection_id,
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Delete messages on behalf of a business account. Requires the _can_delete_sent_messages_ business bot right to delete messages sent by the bot itself, or the _can_delete_all_messages_ business bot right to delete any message. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletebusinessmessages}
     * @param business_connection_id Unique identifier of the business connection on behalf of which to delete the messages
     * @param message_ids A list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See {@link deleteMessage} for limitations on which messages can be deleted.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteBusinessMessages(
        business_connection_id: string,
        message_ids: number[],
        other?: Partial<ApiParameters<"deleteBusinessMessages", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteBusinessMessages({
            business_connection_id,
            message_ids,
            ...other,
        }, signal);
    }
    /**
     * Changes the first and last name of a managed business account. Requires the _can_change_name_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountname}
     * @param business_connection_id Unique identifier of the business connection
     * @param first_name The new value of the first name for the business account; 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setBusinessAccountName(
        business_connection_id: string,
        first_name: string,
        other?: Partial<ApiParameters<"setBusinessAccountName", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setBusinessAccountName({
            business_connection_id,
            first_name,
            ...other,
        }, signal);
    }
    /**
     * Changes the username of a managed business account. Requires the _can_change_username_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountusername}
     * @param business_connection_id Unique identifier of the business connection
     * @param username The new value of the username for the business account; 0-32 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setBusinessAccountUsername(
        business_connection_id: string,
        username: string | undefined,
        other?: Partial<ApiParameters<"setBusinessAccountUsername", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setBusinessAccountUsername({
            business_connection_id,
            username,
            ...other,
        }, signal);
    }
    /**
     * Changes the bio of a managed business account. Requires the _can_change_bio_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountbio}
     * @param business_connection_id Unique identifier of the business connection
     * @param bio The new value of the bio for the business account; 0-140 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setBusinessAccountBio(
        business_connection_id: string,
        bio: string | undefined,
        other?: Partial<ApiParameters<"setBusinessAccountBio", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setBusinessAccountBio({
            business_connection_id,
            bio,
            ...other,
        }, signal);
    }
    /**
     * Changes the profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountprofilephoto}
     * @param business_connection_id Unique identifier of the business connection
     * @param photo The new profile photo to set
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setBusinessAccountProfilePhoto(
        business_connection_id: string,
        photo: InputProfilePhoto,
        other?: Partial<ApiParameters<"setBusinessAccountProfilePhoto", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setBusinessAccountProfilePhoto({
            business_connection_id,
            photo,
            ...other,
        }, signal);
    }
    /**
     * Removes the current profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removebusinessaccountprofilephoto}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async removeBusinessAccountProfilePhoto(
        business_connection_id: string,
        other?: Partial<ApiParameters<"removeBusinessAccountProfilePhoto", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.removeBusinessAccountProfilePhoto({
            business_connection_id,
            ...other,
        }, signal);
    }
    /**
     * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the _can_change_gift_settings_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountgiftsettings}
     * @param business_connection_id Unique identifier of the business connection
     * @param show_gift_button Pass `true` if a button for sending a gift to the user or by the business account must always be shown in the input field
     * @param accepted_gift_types Types of gifts accepted by the business account
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setBusinessAccountGiftSettings(
        business_connection_id: string,
        show_gift_button: boolean,
        accepted_gift_types: AcceptedGiftTypes,
        other?: Partial<ApiParameters<"setBusinessAccountGiftSettings", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setBusinessAccountGiftSettings({
            business_connection_id,
            show_gift_button,
            accepted_gift_types,
            ...other,
        }, signal);
    }
    /**
     * Returns the amount of Telegram Stars owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link StarAmount} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountstarbalance}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getBusinessAccountStarBalance(
        business_connection_id: string,
        other?: Partial<ApiParameters<"getBusinessAccountStarBalance", R>>,
        signal?: AbortSignal,
    ): Promise<StarAmount> {
        return await this.raw.getBusinessAccountStarBalance({
            business_connection_id,
            ...other,
        }, signal);
    }
    /**
     * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the _can_transfer_stars_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transferbusinessaccountstars}
     * @param business_connection_id Unique identifier of the business connection
     * @param star_count Number of Telegram Stars to transfer; 1-10000
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async transferBusinessAccountStars(
        business_connection_id: string,
        star_count: number,
        other?: Partial<ApiParameters<"transferBusinessAccountStars", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.transferBusinessAccountStars({
            business_connection_id,
            star_count,
            ...other,
        }, signal);
    }
    /**
     * Returns the gifts received and owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountgifts}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getBusinessAccountGifts(
        business_connection_id: string,
        other?: Partial<ApiParameters<"getBusinessAccountGifts", R>>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.raw.getBusinessAccountGifts({
            business_connection_id,
            ...other,
        }, signal);
    }
    /**
     * Returns the gifts owned and hosted by a user. Returns {@link OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getusergifts}
     * @param user_id Unique identifier of the user
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getUserGifts(
        user_id: number,
        other?: Partial<ApiParameters<"getUserGifts", R>>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.raw.getUserGifts({
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Returns the gifts owned by a chat. Returns {@link OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatgifts}
     * @param chat_id Unique identifier for the target chat or username of the target channel in the format `@username`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getChatGifts(
        chat_id: number | string,
        other?: Partial<ApiParameters<"getChatGifts", R>>,
        signal?: AbortSignal,
    ): Promise<OwnedGifts> {
        return await this.raw.getChatGifts({
            chat_id,
            ...other,
        }, signal);
    }
    /**
     * Converts a given regular gift to Telegram Stars. Requires the _can_convert_gifts_to_stars_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#convertgifttostars}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be converted to Telegram Stars
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async convertGiftToStars(
        business_connection_id: string,
        owned_gift_id: string,
        other?: Partial<ApiParameters<"convertGiftToStars", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.convertGiftToStars({
            business_connection_id,
            owned_gift_id,
            ...other,
        }, signal);
    }
    /**
     * Upgrades a given regular gift to a unique gift. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Additionally requires the _can_transfer_stars_ business bot right if the upgrade is paid. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#upgradegift}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be upgraded to a unique one
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async upgradeGift(
        business_connection_id: string,
        owned_gift_id: string,
        other?: Partial<ApiParameters<"upgradeGift", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.upgradeGift({
            business_connection_id,
            owned_gift_id,
            ...other,
        }, signal);
    }
    /**
     * Transfers an owned unique gift to another user. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Requires _can_transfer_stars_ business bot right if the transfer is paid. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transfergift}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be transferred
     * @param new_owner_chat_id Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async transferGift(
        business_connection_id: string,
        owned_gift_id: string,
        new_owner_chat_id: number,
        other?: Partial<ApiParameters<"transferGift", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.transferGift({
            business_connection_id,
            owned_gift_id,
            new_owner_chat_id,
            ...other,
        }, signal);
    }
    /**
     * Posts a story on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#poststory}
     * @param business_connection_id Unique identifier of the business connection
     * @param content Content of the story
     * @param active_period Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async postStory(
        business_connection_id: string,
        content: InputStoryContent,
        active_period: 21600 | 43200 | 86400 | 172800,
        other?: Partial<ApiParameters<"postStory", R>>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.raw.postStory({
            business_connection_id,
            content,
            active_period,
            ...other,
        }, signal);
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
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async repostStory(
        business_connection_id: string,
        from_chat_id: number,
        from_story_id: number,
        active_period: 21600 | 43200 | 86400 | 172800,
        other?: Partial<ApiParameters<"repostStory", R>>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.raw.repostStory({
            business_connection_id,
            from_chat_id,
            from_story_id,
            active_period,
            ...other,
        }, signal);
    }
    /**
     * Edits a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editstory}
     * @param business_connection_id Unique identifier of the business connection
     * @param story_id Unique identifier of the story to edit
     * @param content Content of the story
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editStory(
        business_connection_id: string,
        story_id: number,
        content: InputStoryContent,
        other?: Partial<ApiParameters<"editStory", R>>,
        signal?: AbortSignal,
    ): Promise<Story> {
        return await this.raw.editStory({
            business_connection_id,
            story_id,
            content,
            ...other,
        }, signal);
    }
    /**
     * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestory}
     * @param business_connection_id Unique identifier of the business connection
     * @param story_id Unique identifier of the story to delete
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteStory(
        business_connection_id: string,
        story_id: number,
        other?: Partial<ApiParameters<"deleteStory", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteStory({
            business_connection_id,
            story_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set the result of an interaction with a {@link https://core.telegram.org/bots/webapps | Web App} and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a {@link SentWebAppMessage} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answerwebappquery}
     * @param web_app_query_id Unique identifier for the query to be answered
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerWebAppQuery(
        web_app_query_id: string,
        result: InlineQueryResult,
        other?: Partial<ApiParameters<"answerWebAppQuery", R>>,
        signal?: AbortSignal,
    ): Promise<SentWebAppMessage> {
        return await this.raw.answerWebAppQuery({
            web_app_query_id,
            result,
            ...other,
        }, signal);
    }
    /**
     * Stores a message that can be sent by a user of a Mini App. Returns a {@link PreparedInlineMessage} object.
     *
     * @see {@link https://core.telegram.org/bots/api#savepreparedinlinemessage}
     * @param user_id Unique identifier of the target user that can use the prepared message
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async savePreparedInlineMessage(
        user_id: number,
        result: InlineQueryResult,
        other?: Partial<ApiParameters<"savePreparedInlineMessage", R>>,
        signal?: AbortSignal,
    ): Promise<PreparedInlineMessage> {
        return await this.raw.savePreparedInlineMessage({
            user_id,
            result,
            ...other,
        }, signal);
    }
    /**
     * Stores a keyboard button that can be used by a user within a Mini App. Returns a {@link PreparedKeyboardButton} object.
     *
     * @see {@link https://core.telegram.org/bots/api#savepreparedkeyboardbutton}
     * @param user_id Unique identifier of the target user that can use the button
     * @param button An object describing the button to be saved. The button must be of the type _request_users_, _request_chat_, or _request_managed_bot_.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async savePreparedKeyboardButton(
        user_id: number,
        button: KeyboardButton,
        other?: Partial<ApiParameters<"savePreparedKeyboardButton", R>>,
        signal?: AbortSignal,
    ): Promise<PreparedKeyboardButton> {
        return await this.raw.savePreparedKeyboardButton({
            user_id,
            button,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit text, rich and {@link https://core.telegram.org/bots/api#games | game} messages. On success, the edited {@link Message} is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagetext}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the message to edit
     * @param text_or_rich_message New text of the message, 1-4096 characters after entity parsing; or new rich content of the message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageText(
        chat_id: number | string,
        message_id: number,
        text_or_rich_message: string | InputRichMessage,
        other?: Partial<ApiParameters<"editMessageText", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.editMessageText({
            chat_id,
            message_id,
            ...(typeof text_or_rich_message === "string"
                ? { text: text_or_rich_message }
                : { rich_message: text_or_rich_message }),
            ...other,
        }, signal) as Message;
    }
    /**
     * Use this method to edit text, rich and {@link https://core.telegram.org/bots/api#games | game} inline messages. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagetext}
     * @param inline_message_id Identifier of the inline message
     * @param text_or_rich_message New text of the message, 1-4096 characters after entity parsing; or new rich content of the message. Direct upload of new files isn't supported.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageTextInline(
        inline_message_id: string,
        text_or_rich_message: string | InputRichMessage,
        other?: Partial<ApiParameters<"editMessageText", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editMessageText({
            inline_message_id,
            ...(typeof text_or_rich_message === "string"
                ? { text: text_or_rich_message }
                : { rich_message: text_or_rich_message }),
            ...other,
        }, signal) as true;
    }
    /**
     * Use this method to edit captions of messages. On success, the edited {@link Message} is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the message to edit
     * @param caption New caption of the message, 0-1024 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageCaption(
        chat_id: number | string,
        message_id: number,
        caption: string | undefined,
        other?: Partial<ApiParameters<"editMessageCaption", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.editMessageCaption({
            chat_id,
            message_id,
            caption,
            ...other,
        }, signal) as Message;
    }
    /**
     * Use this method to edit captions of inline messages. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
     * @param inline_message_id Identifier of the inline message
     * @param caption New caption of the message, 0-1024 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageCaptionInline(
        inline_message_id: string,
        caption: string | undefined,
        other?: Partial<ApiParameters<"editMessageCaption", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editMessageCaption({
            inline_message_id,
            caption,
            ...other,
        }, signal) as true;
    }
    /**
     * Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. On success, the edited {@link Message} is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagemedia}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the message to edit
     * @param media An object for the new media content of the message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageMedia(
        chat_id: number | string,
        message_id: number,
        media: InputMedia,
        other?: Partial<ApiParameters<"editMessageMedia", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.editMessageMedia({
            chat_id,
            message_id,
            media,
            ...other,
        }, signal) as Message;
    }
    /**
     * Use this method to edit animation, audio, document, live photo, photo, or video inline messages, or to replace a text or a rich inline message with a media. A new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagemedia}
     * @param inline_message_id Identifier of the inline message
     * @param media An object for the new media content of the message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageMediaInline(
        inline_message_id: string,
        media: InputMedia,
        other?: Partial<ApiParameters<"editMessageMedia", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editMessageMedia({
            inline_message_id,
            media,
            ...other,
        }, signal) as true;
    }
    /**
     * Use this method to edit live location messages. A location can be edited until its _live_period_ expires or editing is explicitly disabled by a call to {@link stopMessageLiveLocation}. On success, the edited {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagelivelocation}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the message to edit
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageLiveLocation(
        chat_id: number | string,
        message_id: number,
        latitude: number,
        longitude: number,
        other?: Partial<ApiParameters<"editMessageLiveLocation", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw
            .editMessageLiveLocation({
                chat_id,
                message_id,
                latitude,
                longitude,
                ...other,
            }, signal) as Message;
    }
    /**
     * Use this method to edit live location inline messages. A location can be edited until its _live_period_ expires or editing is explicitly disabled by a call to {@link stopMessageLiveLocationInline}. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagelivelocation}
     * @param inline_message_id Identifier of the inline message
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageLiveLocationInline(
        inline_message_id: string,
        latitude: number,
        longitude: number,
        other?: Partial<ApiParameters<"editMessageLiveLocation", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw
            .editMessageLiveLocation({
                inline_message_id,
                latitude,
                longitude,
                ...other,
            }, signal) as true;
    }
    /**
     * Use this method to stop updating a live location message before _live_period_ expires. On success, the edited {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stopmessagelivelocation}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the message with live location to stop
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async stopMessageLiveLocation(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"stopMessageLiveLocation", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.stopMessageLiveLocation({
            chat_id,
            message_id,
            ...other,
        }, signal) as Message;
    }
    /**
     * Use this method to stop updating a live location inline message before _live_period_ expires. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stopmessagelivelocation}
     * @param inline_message_id Identifier of the inline message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async stopMessageLiveLocationInline(
        inline_message_id: string,
        other?: Partial<ApiParameters<"stopMessageLiveLocation", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.stopMessageLiveLocation({
            inline_message_id,
            ...other,
        }, signal) as true;
    }
    /**
     * Use this method to edit a checklist on behalf of a connected business account. On success, the edited {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagechecklist}
     * @param business_connection_id Unique identifier of the business connection on behalf of which the message will be sent
     * @param chat_id Unique identifier for the target chat or username of the target bot in the format `@username`
     * @param message_id Unique identifier for the target message
     * @param checklist An object for the new checklist
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageChecklist(
        business_connection_id: string,
        chat_id: number | string,
        message_id: number,
        checklist: InputChecklist,
        other?: Partial<ApiParameters<"editMessageChecklist", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.editMessageChecklist({
            business_connection_id,
            chat_id,
            message_id,
            checklist,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit only the reply markup of messages. On success, the edited {@link Message} is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the message to edit
     * @param reply_markup An object for an {@link https://core.telegram.org/bots/features#inline-keyboards | inline keyboard}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageReplyMarkup(
        chat_id: number | string,
        message_id: number,
        reply_markup: InlineKeyboardMarkup | undefined,
        other?: Partial<ApiParameters<"editMessageReplyMarkup", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.editMessageReplyMarkup({
            chat_id,
            message_id,
            reply_markup,
            ...other,
        }, signal) as Message;
    }
    /**
     * Use this method to edit only the reply markup of inline messages. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
     * @param inline_message_id Identifier of the inline message
     * @param reply_markup An object for an {@link https://core.telegram.org/bots/features#inline-keyboards | inline keyboard}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editMessageReplyMarkupInline(
        inline_message_id: string,
        reply_markup: InlineKeyboardMarkup | undefined,
        other?: Partial<ApiParameters<"editMessageReplyMarkup", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editMessageReplyMarkup({
            inline_message_id,
            reply_markup,
            ...other,
        }, signal) as true;
    }
    /**
     * Use this method to stop a poll which was sent by the bot. On success, the stopped {@link Poll} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stoppoll}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the original message with the poll
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async stopPoll(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"stopPoll", R>>,
        signal?: AbortSignal,
    ): Promise<Poll> {
        return await this.raw.stopPoll({
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit an ephemeral text message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editephemeralmessagetext}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param receiver_user_id Identifier of the user who received the message
     * @param ephemeral_message_id Identifier of the ephemeral message to edit
     * @param text New text of the message, 1-4096 characters after entity parsing
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editEphemeralMessageText(
        chat_id: number | string,
        receiver_user_id: number,
        ephemeral_message_id: number,
        text: string,
        other?: Partial<ApiParameters<"editEphemeralMessageText", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editEphemeralMessageText({
            chat_id,
            receiver_user_id,
            ephemeral_message_id,
            text,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editephemeralmessagemedia}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param receiver_user_id Identifier of the user who received the message
     * @param ephemeral_message_id Identifier of the ephemeral message to edit
     * @param media An object for the new media content of the message. A new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editEphemeralMessageMedia(
        chat_id: number | string,
        receiver_user_id: number,
        ephemeral_message_id: number,
        media: InputMedia,
        other?: Partial<ApiParameters<"editEphemeralMessageMedia", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editEphemeralMessageMedia({
            chat_id,
            receiver_user_id,
            ephemeral_message_id,
            media,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editephemeralmessagecaption}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param receiver_user_id Identifier of the user who received the message
     * @param ephemeral_message_id Identifier of the ephemeral message to edit
     * @param caption New caption of the message, 0-1024 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editEphemeralMessageCaption(
        chat_id: number | string,
        receiver_user_id: number,
        ephemeral_message_id: number,
        caption: string | undefined,
        other?: Partial<ApiParameters<"editEphemeralMessageCaption", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editEphemeralMessageCaption({
            chat_id,
            receiver_user_id,
            ephemeral_message_id,
            caption,
            ...other,
        }, signal);
    }
    /**
     * Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editephemeralmessagereplymarkup}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param receiver_user_id Identifier of the user who received the message
     * @param ephemeral_message_id Identifier of the ephemeral message to edit
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editEphemeralMessageReplyMarkup(
        chat_id: number | string,
        receiver_user_id: number,
        ephemeral_message_id: number,
        other?: Partial<ApiParameters<"editEphemeralMessageReplyMarkup", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editEphemeralMessageReplyMarkup({
            chat_id,
            receiver_user_id,
            ephemeral_message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvesuggestedpost}
     * @param chat_id Unique identifier for the target direct messages chat
     * @param message_id Identifier of a suggested post message to approve
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async approveSuggestedPost(
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"approveSuggestedPost", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.approveSuggestedPost({
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinesuggestedpost}
     * @param chat_id Unique identifier for the target direct messages chat
     * @param message_id Identifier of a suggested post message to decline
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async declineSuggestedPost(
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"declineSuggestedPost", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.declineSuggestedPost({
            chat_id,
            message_id,
            ...other,
        }, signal);
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
     * Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessage}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_id Identifier of the message to delete
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteMessage(
        chat_id: number | string,
        message_id: number,
        other?: Partial<ApiParameters<"deleteMessage", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteMessage({
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessages}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param message_ids A list of 1-100 identifiers of messages to delete. See {@link deleteMessage} for limitations on which messages can be deleted.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteMessages(
        chat_id: number | string,
        message_ids: number[],
        other?: Partial<ApiParameters<"deleteMessages", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteMessages({
            chat_id,
            message_ids,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteephemeralmessage}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param receiver_user_id Identifier of the user who received the message
     * @param ephemeral_message_id Identifier of the ephemeral message to delete
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteEphemeralMessage(
        chat_id: number | string,
        receiver_user_id: number,
        ephemeral_message_id: number,
        other?: Partial<ApiParameters<"deleteEphemeralMessage", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteEphemeralMessage({
            chat_id,
            receiver_user_id,
            ephemeral_message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessagereaction}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param message_id Identifier of the target message
     * @param user_id Identifier of the user whose reaction will be removed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteMessageReactionByUser(
        chat_id: number | string,
        message_id: number,
        user_id: number,
        other?: Partial<ApiParameters<"deleteMessageReaction", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteMessageReaction({
            chat_id,
            message_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessagereaction}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param message_id Identifier of the target message
     * @param actor_chat_id Identifier of the chat whose reaction will be removed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteMessageReactionByChat(
        chat_id: number | string,
        message_id: number,
        actor_chat_id: number,
        other?: Partial<ApiParameters<"deleteMessageReaction", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteMessageReaction({
            chat_id,
            message_id,
            actor_chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user. The bot must have the 'can_delete_messages' administrator right in the chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteallmessagereactions}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param user_id Identifier of the user whose reactions will be removed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteAllMessageReactionsByUser(
        chat_id: number | string,
        user_id: number,
        other?: Partial<ApiParameters<"deleteAllMessageReactions", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteAllMessageReactions({
            chat_id,
            user_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteallmessagereactions}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup in the format `@username`
     * @param actor_chat_id Identifier of the chat whose reactions will be removed
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteAllMessageReactionsByChat(
        chat_id: number | string,
        actor_chat_id: number,
        other?: Partial<ApiParameters<"deleteAllMessageReactions", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteAllMessageReactions({
            chat_id,
            actor_chat_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send static .WEBP, {@link https://telegram.org/blog/animated-stickers | animated} .TGS, or {@link https://telegram.org/blog/video-stickers-better-reactions | video} .WEBM stickers. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendsticker}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Video and animated stickers can't be sent via an HTTP URL.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendSticker(
        chat_id: number | string,
        sticker: InputFile | string,
        other?: Partial<ApiParameters<"sendSticker", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendSticker({
            chat_id,
            sticker,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get a sticker set. On success, a {@link StickerSet} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getstickerset}
     * @param name Name of the sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getStickerSet(
        name: string,
        other?: Partial<ApiParameters<"getStickerSet", R>>,
        signal?: AbortSignal,
    ): Promise<StickerSet> {
        return await this.raw.getStickerSet({
            name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of {@link Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getcustomemojistickers}
     * @param custom_emoji_ids A list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getCustomEmojiStickers(
        custom_emoji_ids: string[],
        other?: Partial<ApiParameters<"getCustomEmojiStickers", R>>,
        signal?: AbortSignal,
    ): Promise<Sticker[]> {
        return await this.raw.getCustomEmojiStickers({
            custom_emoji_ids,
            ...other,
        }, signal);
    }
    /**
     * Use this method to upload a file with a sticker for later use in the {@link createNewStickerSet}, {@link addStickerToSet}, or {@link replaceStickerInSet} methods (the file can be used multiple times). Returns the uploaded {@link File} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#uploadstickerfile}
     * @param user_id User identifier of sticker file owner
     * @param sticker A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See {@link https://core.telegram.org/stickers | https://core.telegram.org/stickers} for technical requirements. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param sticker_format Format of the sticker, must be one of “static”, “animated”, “video”
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async uploadStickerFile(
        user_id: number,
        sticker: InputFile,
        sticker_format: "static" | "animated" | "video",
        other?: Partial<ApiParameters<"uploadStickerFile", R>>,
        signal?: AbortSignal,
    ): Promise<File> {
        return await this.raw.uploadStickerFile({
            user_id,
            sticker,
            sticker_format,
            ...other,
        }, signal);
    }
    /**
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#createnewstickerset}
     * @param user_id User identifier of created sticker set owner
     * @param name Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `"_by_<bot_username>"`. `<bot_username>` is case insensitive. 1-64 characters.
     * @param title Sticker set title, 1-64 characters
     * @param stickers A list of 1-50 initial stickers to be added to the sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async createNewStickerSet(
        user_id: number,
        name: string,
        title: string,
        stickers: InputSticker[],
        other?: Partial<ApiParameters<"createNewStickerSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.createNewStickerSet({
            user_id,
            name,
            title,
            stickers,
            ...other,
        }, signal);
    }
    /**
     * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#addstickertoset}
     * @param user_id User identifier of sticker set owner
     * @param name Sticker set name
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async addStickerToSet(
        user_id: number,
        name: string,
        sticker: InputSticker,
        other?: Partial<ApiParameters<"addStickerToSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.addStickerToSet({
            user_id,
            name,
            sticker,
            ...other,
        }, signal);
    }
    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
     * @param sticker File identifier of the sticker
     * @param position New sticker position in the set, zero-based
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setStickerPositionInSet(
        sticker: string,
        position: number,
        other?: Partial<ApiParameters<"setStickerPositionInSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setStickerPositionInSet({
            sticker,
            position,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete a sticker from a set created by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
     * @param sticker File identifier of the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteStickerFromSet(
        sticker: string,
        other?: Partial<ApiParameters<"deleteStickerFromSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteStickerFromSet({
            sticker,
            ...other,
        }, signal);
    }
    /**
     * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling {@link deleteStickerFromSet}, then {@link addStickerToSet}, then {@link setStickerPositionInSet}. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#replacestickerinset}
     * @param user_id User identifier of the sticker set owner
     * @param name Sticker set name
     * @param old_sticker File identifier of the replaced sticker
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async replaceStickerInSet(
        user_id: number,
        name: string,
        old_sticker: string,
        sticker: InputSticker,
        other?: Partial<ApiParameters<"replaceStickerInSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.replaceStickerInSet({
            user_id,
            name,
            old_sticker,
            sticker,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickeremojilist}
     * @param sticker File identifier of the sticker
     * @param emoji_list A list of 1-20 emoji associated with the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setStickerEmojiList(
        sticker: string,
        emoji_list: string[],
        other?: Partial<ApiParameters<"setStickerEmojiList", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setStickerEmojiList({
            sticker,
            emoji_list,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerkeywords}
     * @param sticker File identifier of the sticker
     * @param keywords A list of 0-20 search keywords for the sticker with total length of up to 64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setStickerKeywords(
        sticker: string,
        keywords: string[] | undefined,
        other?: Partial<ApiParameters<"setStickerKeywords", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setStickerKeywords({
            sticker,
            keywords,
            ...other,
        }, signal);
    }
    /**
     * Use this method to change the {@link MaskPosition | mask position} of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickermaskposition}
     * @param sticker File identifier of the sticker
     * @param mask_position An object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setStickerMaskPosition(
        sticker: string,
        mask_position: MaskPosition | undefined,
        other?: Partial<ApiParameters<"setStickerMaskPosition", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setStickerMaskPosition({
            sticker,
            mask_position,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set the title of a created sticker set. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersettitle}
     * @param name Sticker set name
     * @param title Sticker set title, 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setStickerSetTitle(
        name: string,
        title: string,
        other?: Partial<ApiParameters<"setStickerSetTitle", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setStickerSetTitle({
            name,
            title,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersetthumbnail}
     * @param name Sticker set name
     * @param user_id User identifier of the sticker set owner
     * @param thumbnail A **.WEBP** or **.PNG** image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a **.TGS** animation with a thumbnail up to 32 kilobytes in size (see {@link https://core.telegram.org/stickers#animation-requirements | https://core.telegram.org/stickers#animation-requirements} for animated sticker technical requirements), or a **.WEBM** video with the thumbnail up to 32 kilobytes in size; see {@link https://core.telegram.org/stickers#video-requirements | https://core.telegram.org/stickers#video-requirements} for video sticker technical requirements. Pass a _file_id_ as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail.
     * @param format Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setStickerSetThumbnail(
        name: string,
        user_id: number,
        thumbnail: InputFile | string | undefined,
        format: "static" | "animated" | "video",
        other?: Partial<ApiParameters<"setStickerSetThumbnail", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setStickerSetThumbnail({
            name,
            user_id,
            thumbnail,
            format,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set the thumbnail of a custom emoji sticker set. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail}
     * @param name Sticker set name
     * @param custom_emoji_id Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setCustomEmojiStickerSetThumbnail(
        name: string,
        custom_emoji_id: string | undefined,
        other?: Partial<ApiParameters<"setCustomEmojiStickerSetThumbnail", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setCustomEmojiStickerSetThumbnail({
            name,
            custom_emoji_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to delete a sticker set that was created by the bot. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerset}
     * @param name Sticker set name
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async deleteStickerSet(
        name: string,
        other?: Partial<ApiParameters<"deleteStickerSet", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.deleteStickerSet({
            name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendrichmessage}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param rich_message The message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendRichMessage(
        chat_id: number | string,
        rich_message: InputRichMessage,
        other?: Partial<ApiParameters<"sendRichMessage", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendRichMessage({
            chat_id,
            rich_message,
            ...other,
        }, signal);
    }
    /**
     * Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you **must** call {@link sendRichMessage} with the complete message to persist it in the user's chat. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendrichmessagedraft}
     * @param chat_id Unique identifier for the target private chat
     * @param draft_id Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated.
     * @param rich_message The partial message to be streamed. Direct upload of new files isn't supported.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendRichMessageDraft(
        chat_id: number,
        draft_id: number,
        rich_message: InputRichMessage,
        other?: Partial<ApiParameters<"sendRichMessageDraft", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.sendRichMessageDraft({
            chat_id,
            draft_id,
            rich_message,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send answers to an inline query. On success, `true` is returned.
     *
     * No more than **50** results per query are allowed.
     *
     * @see {@link https://core.telegram.org/bots/api#answerinlinequery}
     * @param inline_query_id Unique identifier for the answered query
     * @param results An Array of results for the inline query
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerInlineQuery(
        inline_query_id: string,
        results: InlineQueryResult[],
        other?: Partial<ApiParameters<"answerInlineQuery", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.answerInlineQuery({
            inline_query_id,
            results,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send invoices. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendinvoice}
     * @param chat_id Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
     * @param currency Three-letter ISO 4217 currency code, see {@link https://core.telegram.org/bots/payments#supported-currencies | more on currencies}. Pass “XTR” for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendInvoice(
        chat_id: number | string,
        title: string,
        description: string,
        payload: string,
        currency: string,
        prices: LabeledPrice[],
        other?: Partial<ApiParameters<"sendInvoice", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendInvoice({
            chat_id,
            title,
            description,
            payload,
            currency,
            prices,
            ...other,
        }, signal);
    }
    /**
     * Use this method to create a link for an invoice. Returns the created invoice link as `string` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#createinvoicelink}
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
     * @param currency Three-letter ISO 4217 currency code, see {@link https://core.telegram.org/bots/payments#supported-currencies | more on currencies}. Pass “XTR” for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async createInvoiceLink(
        title: string,
        description: string,
        payload: string,
        currency: string,
        prices: LabeledPrice[],
        other?: Partial<ApiParameters<"createInvoiceLink", R>>,
        signal?: AbortSignal,
    ): Promise<string> {
        return await this.raw.createInvoiceLink({
            title,
            description,
            payload,
            currency,
            prices,
            ...other,
        }, signal);
    }
    /**
     * If you sent an invoice requesting a shipping address and the parameter _is_flexible_ was specified, the Bot API will send an {@link Update} with a _shipping_query_ field to the bot. Use this method to reply to shipping queries. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answershippingquery}
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param shipping_options An Array of available shipping options
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerShippingQueryOk(
        shipping_query_id: string,
        shipping_options: ShippingOption[],
        other?: Partial<ApiParameters<"answerShippingQuery", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.answerShippingQuery({
            shipping_query_id,
            ok: true,
            shipping_options,
            ...other,
        }, signal);
    }
    /**
     * If you sent an invoice requesting a shipping address and the parameter _is_flexible_ was specified, the Bot API will send an {@link Update} with a _shipping_query_ field to the bot. Use this method to reply to shipping queries. On success, `true` is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answershippingquery}
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param error_message Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerShippingQueryError(
        shipping_query_id: string,
        error_message: string,
        other?: Partial<ApiParameters<"answerShippingQuery", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.answerShippingQuery({
            shipping_query_id,
            ok: false,
            error_message,
            ...other,
        }, signal);
    }
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an {@link Update} with the field _pre_checkout_query_. Use this method to respond to such pre-checkout queries. On success, `true` is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
     * @param pre_checkout_query_id Unique identifier for the query to be answered
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerPreCheckoutQueryOk(
        pre_checkout_query_id: string,
        other?: Partial<ApiParameters<"answerPreCheckoutQuery", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.answerPreCheckoutQuery({
            pre_checkout_query_id,
            ok: true,
            ...other,
        }, signal);
    }
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an {@link Update} with the field _pre_checkout_query_. Use this method to respond to such pre-checkout queries. On success, `true` is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
     * @param pre_checkout_query_id Unique identifier for the query to be answered
     * @param error_message Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async answerPreCheckoutQueryError(
        pre_checkout_query_id: string,
        error_message: string,
        other?: Partial<ApiParameters<"answerPreCheckoutQuery", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.answerPreCheckoutQuery({
            pre_checkout_query_id,
            ok: false,
            error_message,
            ...other,
        }, signal);
    }
    /**
     * A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a {@link StarAmount} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getmystarbalance}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getMyStarBalance(
        other?: Partial<ApiParameters<"getMyStarBalance", R>>,
        signal?: AbortSignal,
    ): Promise<StarAmount> {
        return await this.raw.getMyStarBalance({
            ...other,
        }, signal);
    }
    /**
     * Returns the bot's Telegram Star transactions in chronological order. On success, returns a {@link StarTransactions} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getstartransactions}
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getStarTransactions(
        other?: Partial<ApiParameters<"getStarTransactions", R>>,
        signal?: AbortSignal,
    ): Promise<StarTransactions> {
        return await this.raw.getStarTransactions({
            ...other,
        }, signal);
    }
    /**
     * Refunds a successful payment in {@link https://t.me/BotNews/90 | Telegram Stars}. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#refundstarpayment}
     * @param user_id Identifier of the user whose payment will be refunded
     * @param telegram_payment_charge_id Telegram payment identifier
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async refundStarPayment(
        user_id: number,
        telegram_payment_charge_id: string,
        other?: Partial<ApiParameters<"refundStarPayment", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.refundStarPayment({
            user_id,
            telegram_payment_charge_id,
            ...other,
        }, signal);
    }
    /**
     * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns `true` on success.
     *
     * @see {@link https://core.telegram.org/bots/api#edituserstarsubscription}
     * @param user_id Identifier of the user whose subscription will be edited
     * @param telegram_payment_charge_id Telegram payment identifier for the subscription
     * @param is_canceled Pass `true` to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass `false` to allow the user to re-enable a subscription that was previously canceled by the bot.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async editUserStarSubscription(
        user_id: number,
        telegram_payment_charge_id: string,
        is_canceled: boolean,
        other?: Partial<ApiParameters<"editUserStarSubscription", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.editUserStarSubscription({
            user_id,
            telegram_payment_charge_id,
            is_canceled,
            ...other,
        }, signal);
    }
    /**
     * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns `true` on success.
     *
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * @see {@link https://core.telegram.org/bots/api#setpassportdataerrors}
     * @param user_id User identifier
     * @param errors An Array describing the errors
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setPassportDataErrors(
        user_id: number,
        errors: PassportElementError[],
        other?: Partial<ApiParameters<"setPassportDataErrors", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setPassportDataErrors({
            user_id,
            errors,
            ...other,
        }, signal);
    }
    /**
     * Use this method to send a game. On success, the sent {@link Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgame}
     * @param chat_id Unique identifier for the target chat or username of the target bot in the format `@username`. Games can't be sent to channel direct messages chats and channel chats.
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via {@link https://t.me/botfather | \@BotFather}.
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async sendGame(
        chat_id: number | string,
        game_short_name: string,
        other?: Partial<ApiParameters<"sendGame", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.sendGame({
            chat_id,
            game_short_name,
            ...other,
        }, signal);
    }
    /**
     * Use this method to set the score of the specified user in a game message. On success, the {@link Message} is returned. Returns an error, if the new score is not greater than the user's current score in the chat and _force_ is `false`.
     *
     * @see {@link https://core.telegram.org/bots/api#setgamescore}
     * @param user_id User identifier
     * @param score New score, must be non-negative
     * @param chat_id Unique identifier for the target chat
     * @param message_id Identifier of the sent message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setGameScore(
        user_id: number,
        score: number,
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"setGameScore", R>>,
        signal?: AbortSignal,
    ): Promise<Message> {
        return await this.raw.setGameScore({
            user_id,
            score,
            chat_id,
            message_id,
            ...other,
        }, signal) as Message;
    }
    /**
     * Use this method to set the score of the specified user in a game inline message. On success, `true` is returned. Returns an error, if the new score is not greater than the user's current score in the chat and _force_ is `false`.
     *
     * @see {@link https://core.telegram.org/bots/api#setgamescore}
     * @param user_id User identifier
     * @param score New score, must be non-negative
     * @param inline_message_id Identifier of the inline message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async setGameScoreInline(
        user_id: number,
        score: number,
        inline_message_id: string,
        other?: Partial<ApiParameters<"setGameScore", R>>,
        signal?: AbortSignal,
    ): Promise<true> {
        return await this.raw.setGameScore({
            user_id,
            score,
            inline_message_id,
            ...other,
        }, signal) as true;
    }
    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of {@link GameHighScore} objects.
     *
     * > This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.
     *
     * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
     * @param user_id Target user id
     * @param chat_id Unique identifier for the target chat
     * @param message_id Identifier of the sent message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getGameHighScores(
        user_id: number,
        chat_id: number,
        message_id: number,
        other?: Partial<ApiParameters<"getGameHighScores", R>>,
        signal?: AbortSignal,
    ): Promise<GameHighScore[]> {
        return await this.raw.getGameHighScores({
            user_id,
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of {@link GameHighScore} objects.
     *
     * > This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.
     *
     * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
     * @param user_id Target user id
     * @param inline_message_id Identifier of the inline message
     * @param other Options object with all optional parameters
     * @param signal Optional {@link AbortSignal} to cancel the request
     */
    async getGameHighScoresInline(
        user_id: number,
        inline_message_id: string,
        other?: Partial<ApiParameters<"getGameHighScores", R>>,
        signal?: AbortSignal,
    ): Promise<GameHighScore[]> {
        return await this.raw.getGameHighScores({
            user_id,
            inline_message_id,
            ...other,
        }, signal);
    }
}
