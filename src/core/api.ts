// deno-lint-ignore-file camelcase
import type { ApiMethods } from "../types.ts";
import {
    type ApiClientOptions,
    createRawApi,
    type RawApi,
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
export class Api<A extends ApiMethods = ApiMethods> {
    /**
     * Provides access to all methods of the Telegram Bot API exactly as
     * documented on the website (https://core.telegram.org/bots/api). No
     * arguments are pulled up in the function signature for convenience.
     *
     * If you suppress compiler warnings, this also allows for raw api calls to
     * undocumented methods with arbitrary parameters—use only if you know what
     * you are doing.
     */
    public readonly raw: RawApi<A>;

    /**
     * Allows to install an API request transformer function. A transformer
     * function has access to every API call before it is being performed.
     * This includes the method as string, the payload as object and the
     * upstream transformer function.
     */
    public readonly transform: TransformerConsumer<A>;

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
        const { raw, transform } = createRawApi<A>(
            token,
            options,
            webhookReplyEnvelope,
        );
        this.raw = raw;
        this.transform = transform;
    }
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
    getUpdates(
    ): Update[];
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
     */
    setWebhook(
        /**
         * HTTPS URL to send updates to. Use an empty string to remove webhook integration
         */
        url: string;
    ): true;
    /**
     * Use this method to remove webhook integration if you decide to switch back to {@link ApiMethods.getUpdates | getUpdates}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletewebhook}
     */
    deleteWebhook(
    ): true;
    /**
     * Use this method to get current webhook status. Requires no parameters. On success, returns a {@link WebhookInfo | WebhookInfo} object. If the bot is using {@link ApiMethods.getUpdates | getUpdates}, will return an object with the _url_ field empty.
     *
     * @see {@link https://core.telegram.org/bots/api#getwebhookinfo}
     */
    getWebhookInfo(): WebhookInfo;
    /**
     * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a {@link User | User} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getme}
     */
    getMe(): UserFromGetMe;
    /**
     * Use this method to log out from the cloud Bot API server before launching the bot locally. You **must** log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns _True_ on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#logout}
     */
    logOut(): true;
    /**
     * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns _True_ on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#close}
     */
    close(): true;
    /**
     * Use this method to send text messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessage}
     */
    sendMessage(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Text of the message to be sent, 1-4096 characters after entities parsing
         */
        text: string;
    ): Message;
    /**
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessage}
     */
    forwardMessage(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
         */
        from_chat_id: number | string;
        /**
         * Message identifier in the chat specified in _from_chat_id_
         */
        message_id: number;
    ): Message;
    /**
     * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of {@link MessageId | MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#forwardmessages}
     */
    forwardMessages(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)
         */
        from_chat_id: number | string;
        /**
         * A list of 1-100 identifiers of messages in the chat _from_chat_id_ to forward. The identifiers must be specified in a strictly increasing order.
         */
        message_ids: number[];
    ): MessageId[];
    /**
     * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method {@link ApiMethods.forwardMessage | forwardMessage}, but the copied message doesn't have a link to the original message. Returns the {@link MessageId | MessageId} of the sent message on success.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessage}
     */
    copyMessage(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
         */
        from_chat_id: number | string;
        /**
         * Message identifier in the chat specified in _from_chat_id_
         */
        message_id: number;
    ): MessageId;
    /**
     * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz {@link Poll | poll} can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method {@link ApiMethods.forwardMessages | forwardMessages}, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of {@link MessageId | MessageId} of the sent messages is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#copymessages}
     */
    copyMessages(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)
         */
        from_chat_id: number | string;
        /**
         * A list of 1-100 identifiers of messages in the chat _from_chat_id_ to copy. The identifiers must be specified in a strictly increasing order.
         */
        message_ids: number[];
    ): MessageId[];
    /**
     * Use this method to send photos. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendphoto}
     */
    sendPhoto(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
         */
        photo: InputFile | string;
    ): Message;
    /**
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent {@link Message | Message} is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * For sending voice messages, use the {@link ApiMethods.sendVoice | sendVoice} method instead.
     *
     * @see {@link https://core.telegram.org/bots/api#sendaudio}
     */
    sendAudio(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
         */
        audio: InputFile | string;
    ): Message;
    /**
     * Use this method to send general files. On success, the sent {@link Message | Message} is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#senddocument}
     */
    sendDocument(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
         */
        document: InputFile | string;
    ): Message;
    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideo}
     */
    sendVideo(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
         */
        video: InputFile | string;
    ): Message;
    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent {@link Message | Message} is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendanimation}
     */
    sendAnimation(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
         */
        animation: InputFile | string;
    ): Message;
    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as {@link Audio | Audio} or {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvoice}
     */
    sendVoice(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
         */
        voice: InputFile | string;
    ): Message;
    /**
     * As of {@link https://telegram.org/blog/video-messages-and-telescope | v.4.0}, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideonote}
     */
    sendVideoNote(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Sending video notes by a URL is currently unsupported
         */
        video_note: InputFile | string;
    ): Message;
    /**
     * Use this method to send paid media. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpaidmedia}
     */
    sendPaidMedia(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance.
         */
        chat_id: number | string;
        /**
         * The number of Telegram Stars that must be paid to buy access to the media; 1-10000
         */
        star_count: number;
        /**
         * An array describing the media to be sent; up to 10 items
         */
        media: InputPaidMedia[];
    ): Message;
    /**
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of {@link Message | Message} objects that were sent is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmediagroup}
     */
    sendMediaGroup(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * An array describing messages to be sent, must include 2-10 items
         */
        media: Array<
            | InputMediaAudio
            | InputMediaDocument
            | InputMediaPhoto
            | InputMediaVideo
        >;
    ): Message[];
    /**
     * Use this method to send point on the map. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendlocation}
     */
    sendLocation(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Latitude of the location
         */
        latitude: number;
        /**
         * Longitude of the location
         */
        longitude: number;
    ): Message;
    /**
     * Use this method to send information about a venue. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvenue}
     */
    sendVenue(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Latitude of the venue
         */
        latitude: number;
        /**
         * Longitude of the venue
         */
        longitude: number;
        /**
         * Name of the venue
         */
        title: string;
        /**
         * Address of the venue
         */
        address: string;
    ): Message;
    /**
     * Use this method to send phone contacts. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendcontact}
     */
    sendContact(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Contact's phone number
         */
        phone_number: string;
        /**
         * Contact's first name
         */
        first_name: string;
    ): Message;
    /**
     * Use this method to send a native poll. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpoll}
     */
    sendPoll(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Polls can't be sent to channel direct messages chats.
         */
        chat_id: number | string;
        /**
         * Poll question, 1-300 characters
         */
        question: string;
        /**
         * A list of 2-12 answer options
         */
        options: InputPollOption[];
    ): Message;
    /**
     * Use this method to send a checklist on behalf of a connected business account. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchecklist}
     */
    sendChecklist(
        /**
         * Unique identifier of the business connection on behalf of which the message will be sent
         */
        business_connection_id: string;
        /**
         * Unique identifier for the target chat
         */
        chat_id: number;
        /**
         * An object for the checklist to send
         */
        checklist: InputChecklist;
    ): Message;
    /**
     * Use this method to send an animated emoji that will display a random value. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#senddice}
     */
    sendDice(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): Message;
    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns _True_ on success.
     *
     * > Example: The {@link https://t.me/imagebot | ImageBot} needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use {@link ApiMethods.sendChatAction | sendChatAction} with _action_ = _upload_photo_. The user will see a “sending photo” status for the bot.
     *
     * We only recommend using this method when a response from the bot will take a **noticeable** amount of time to arrive.
     *
     * @see {@link https://core.telegram.org/bots/api#sendchataction}
     */
    sendChatAction(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren't supported.
         */
        chat_id: number | string;
        /**
         * Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for {@link ApiMethods.sendMessage | text messages}, _upload_photo_ for {@link ApiMethods.sendPhoto | photos}, _record_video_ or _upload_video_ for {@link ApiMethods.sendVideo | videos}, _record_voice_ or _upload_voice_ for {@link ApiMethods.sendVoice | voice notes}, _upload_document_ for {@link ApiMethods.sendDocument | general files}, _choose_sticker_ for {@link ApiMethods.sendSticker | stickers}, _find_location_ for {@link ApiMethods.sendLocation | location data}, _record_video_note_ or _upload_video_note_ for {@link ApiMethods.sendVideoNote | video notes}.
         */
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
            | "upload_video_note";
    ): true;
    /**
     * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmessagereaction}
     */
    setMessageReaction(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.
         */
        message_id: number;
    ): true;
    /**
     * Use this method to get a list of profile pictures for a user. Returns a {@link UserProfilePhotos | UserProfilePhotos} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
     */
    getUserProfilePhotos(
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): UserProfilePhotos;
    /**
     * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method {@link https://core.telegram.org/bots/webapps#initializing-mini-apps | requestEmojiStatusAccess}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setuseremojistatus}
     */
    setUserEmojiStatus(
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a {@link File | File} object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling {@link ApiMethods.getFile | getFile} again.
     *
     * **Note:** This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     *
     * @see {@link https://core.telegram.org/bots/api#getfile}
     */
    getFile(
        /**
         * File identifier to get information about
         */
        file_id: string;
    ): File;
    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless {@link ApiMethods.unbanChatMember | unbanned} first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatmember}
     */
    banChatMember(
        /**
         * Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter _only_if_banned_. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
     */
    unbanChatMember(
        /**
         * Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass _True_ for all permissions to lift restrictions from a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#restrictchatmember}
     */
    restrictChatMember(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
        /**
         * An object for new user permissions
         */
        permissions: ChatPermissions;
    ): true;
    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass _False_ for all boolean parameters to demote a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#promotechatmember}
     */
    promoteChatMember(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatadministratorcustomtitle}
     */
    setChatAdministratorCustomTitle(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
        /**
         * New custom title for the administrator; 0-16 characters, emoji are not allowed
         */
        custom_title: string;
    ): true;
    /**
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is {@link ApiMethods.unbanChatSenderChat | unbanned}, the owner of the banned chat won't be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatsenderchat}
     */
    banChatSenderChat(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target sender chat
         */
        sender_chat_id: number;
    ): true;
    /**
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatsenderchat}
     */
    unbanChatSenderChat(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target sender chat
         */
        sender_chat_id: number;
    ): true;
    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can_restrict_members_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatpermissions}
     */
    setChatPermissions(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * An object for new default chat permissions
         */
        permissions: ChatPermissions;
    ): true;
    /**
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as _String_ on success.
     *
     * > Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using {@link ApiMethods.exportChatInviteLink | exportChatInviteLink} or by calling the {@link ApiMethods.getChat | getChat} method. If your bot needs to generate a new primary invite link replacing its previous one, use {@link ApiMethods.exportChatInviteLink | exportChatInviteLink} again.
     *
     * @see {@link https://core.telegram.org/bots/api#exportchatinvitelink}
     */
    exportChatInviteLink(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): string;
    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method {@link ApiMethods.revokeChatInviteLink | revokeChatInviteLink}. Returns the new invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatinvitelink}
     */
    createChatInviteLink(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): ChatInviteLink;
    /**
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatinvitelink}
     */
    editChatInviteLink(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * The invite link to edit
         */
        invite_link: string;
    ): ChatInviteLink;
    /**
     * Use this method to create a {@link https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions | subscription invite link} for a channel chat. The bot must have the _can_invite_users_ administrator rights. The link can be edited using the method {@link ApiMethods.editChatSubscriptionInviteLink | editChatSubscriptionInviteLink} or revoked using the method {@link ApiMethods.revokeChatInviteLink | revokeChatInviteLink}. Returns the new invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatsubscriptioninvitelink}
     */
    createChatSubscriptionInviteLink(
        /**
         * Unique identifier for the target channel chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).
         */
        subscription_period: 2592000;
        /**
         * The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000
         */
        subscription_price: number;
    ): ChatInviteLink;
    /**
     * Use this method to edit a subscription invite link created by the bot. The bot must have the _can_invite_users_ administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatsubscriptioninvitelink}
     */
    editChatSubscriptionInviteLink(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * The invite link to edit
         */
        invite_link: string;
    ): ChatInviteLink;
    /**
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#revokechatinvitelink}
     */
    revokeChatInviteLink(
        /**
         * Unique identifier of the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * The invite link to revoke
         */
        invite_link: string;
    ): ChatInviteLink;
    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvechatjoinrequest}
     */
    approveChatJoinRequest(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinechatjoinrequest}
     */
    declineChatJoinRequest(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatphoto}
     */
    setChatPhoto(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * New chat photo, uploaded using multipart/form-data
         */
        photo: InputFile;
    ): true;
    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
     */
    deleteChatPhoto(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchattitle}
     */
    setChatTitle(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * New chat title, 1-128 characters
         */
        title: string;
    ): true;
    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatdescription}
     */
    setChatDescription(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
     */
    pinChatMessage(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Identifier of a message to pin
         */
        message_id: number;
    ): true;
    /**
     * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
     */
    unpinChatMessage(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallchatmessages}
     */
    unpinAllChatMessages(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method for your bot to leave a group, supergroup or channel. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#leavechat}
     */
    leaveChat(
        /**
         * Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`). Channel direct messages chats aren't supported; leave the corresponding channel instead.
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to get up-to-date information about the chat. Returns a {@link ChatFullInfo | ChatFullInfo} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchat}
     */
    getChat(
        /**
         * Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): ChatFullInfo;
    /**
     * Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of {@link ChatMember | ChatMember} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
     */
    getChatAdministrators(
        /**
         * Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): Array<ChatMemberOwner | ChatMemberAdministrator>;
    /**
     * Use this method to get the number of members in a chat. Returns _Int_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmembercount}
     */
    getChatMemberCount(
        /**
         * Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): number;
    /**
     * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a {@link ChatMember | ChatMember} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmember}
     */
    getChatMember(
        /**
         * Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): ChatMember;
    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatstickerset}
     */
    setChatStickerSet(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Name of the sticker set to be set as the group sticker set
         */
        sticker_set_name: string;
    ): true;
    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatstickerset}
     */
    deleteChatStickerSet(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of {@link Sticker | Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getforumtopiciconstickers}
     */
    getForumTopicIconStickers(): Sticker[];
    /**
     * Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns information about the created topic as a {@link ForumTopic | ForumTopic} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createforumtopic}
     */
    createForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Topic name, 1-128 characters
         */
        name: string;
    ): ForumTopic;
    /**
     * Use this method to edit name and icon of a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editforumtopic}
     */
    editForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the target message thread of the forum topic
         */
        message_thread_id: number;
    ): true;
    /**
     * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closeforumtopic}
     */
    closeForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the target message thread of the forum topic
         */
        message_thread_id: number;
    ): true;
    /**
     * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopenforumtopic}
     */
    reopenForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the target message thread of the forum topic
         */
        message_thread_id: number;
    ): true;
    /**
     * Use this method to delete a forum topic along with all its messages in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_delete_messages_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteforumtopic}
     */
    deleteForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the target message thread of the forum topic
         */
        message_thread_id: number;
    ): true;
    /**
     * Use this method to clear the list of pinned messages in a forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallforumtopicmessages}
     */
    unpinAllForumTopicMessages(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier for the target message thread of the forum topic
         */
        message_thread_id: number;
    ): true;
    /**
     * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editgeneralforumtopic}
     */
    editGeneralForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
        /**
         * New topic name, 1-128 characters
         */
        name: string;
    ): true;
    /**
     * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closegeneralforumtopic}
     */
    closeGeneralForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically unhidden if it was hidden. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopengeneralforumtopic}
     */
    reopenGeneralForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically closed if it was open. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#hidegeneralforumtopic}
     */
    hideGeneralForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unhidegeneralforumtopic}
     */
    unhideGeneralForumTopic(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages}
     */
    unpinAllGeneralForumTopicMessages(
        /**
         * Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Use this method to send answers to callback queries sent from {@link https://core.telegram.org/bots/features#inline-keyboards | inline keyboards}. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, _True_ is returned.
     *
     * > Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via {@link https://t.me/botfather | @BotFather} and accept the terms. Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter.
     *
     * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
     */
    answerCallbackQuery(
        /**
         * Unique identifier for the query to be answered
         */
        callback_query_id: string;
    ): true;
    /**
     * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a {@link UserChatBoosts | UserChatBoosts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserchatboosts}
     */
    getUserChatBoosts(
        /**
         * Unique identifier for the chat or username of the channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): UserChatBoosts;
    /**
     * Use this method to get information about the connection of the bot with a business account. Returns a {@link BusinessConnection | BusinessConnection} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessconnection}
     */
    getBusinessConnection(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
    ): BusinessConnection;
    /**
     * Use this method to change the list of the bot's commands. See {@link https://core.telegram.org/bots/features#commands | this manual} for more details about bot commands. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmycommands}
     */
    setMyCommands(
        /**
         * A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
         */
        commands: BotCommand[];
    ): true;
    /**
     * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, {@link https://core.telegram.org/bots/api#determining-list-of-commands | higher level commands} will be shown to affected users. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemycommands}
     */
    deleteMyCommands(
    ): true;
    /**
     * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of {@link BotCommand | BotCommand} objects. If commands aren't set, an empty list is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getmycommands}
     */
    getMyCommands(
    ): BotCommand[];
    /**
     * Use this method to change the bot's name. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyname}
     */
    setMyName(
    ): true;
    /**
     * Use this method to get the current bot name for the given user language. Returns {@link BotName | BotName} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyname}
     */
    getMyName(
    ): BotName;
    /**
     * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydescription}
     */
    setMyDescription(
    ): true;
    /**
     * Use this method to get the current bot description for the given user language. Returns {@link BotDescription | BotDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydescription}
     */
    getMyDescription(
    ): BotDescription;
    /**
     * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyshortdescription}
     */
    setMyShortDescription(
    ): true;
    /**
     * Use this method to get the current bot short description for the given user language. Returns {@link BotShortDescription | BotShortDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyshortdescription}
     */
    getMyShortDescription(
    ): BotShortDescription;
    /**
     * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatmenubutton}
     */
    setChatMenuButton(
    ): true;
    /**
     * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns {@link MenuButton | MenuButton} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmenubutton}
     */
    getChatMenuButton(
    ): MenuButton;
    /**
     * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydefaultadministratorrights}
     */
    setMyDefaultAdministratorRights(
    ): true;
    /**
     * Use this method to get the current default administrator rights of the bot. Returns {@link ChatAdministratorRights | ChatAdministratorRights} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydefaultadministratorrights}
     */
    getMyDefaultAdministratorRights(
    ): ChatAdministratorRights;
    /**
     * Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a {@link Gifts | Gifts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getavailablegifts}
     */
    getAvailableGifts(): Gifts;
    /**
     * Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgift}
     */
    sendGift(
        /**
         * Identifier of the gift
         */
        gift_id: string;
    ): true;
    /**
     * Gifts a Telegram Premium subscription to the given user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#giftpremiumsubscription}
     */
    giftPremiumSubscription(
        /**
         * Unique identifier of the target user who will receive a Telegram Premium subscription
         */
        user_id: number;
        /**
         * Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12
         */
        month_count: 3 | 6 | 12;
        /**
         * Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months
         */
        star_count: 1000 | 1500 | 2500;
    ): true;
    /**
     * Verifies a user {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifyuser}
     */
    verifyUser(
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Verifies a chat {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifychat}
     */
    verifyChat(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can't be verified.
         */
        chat_id: number | string;
    ): true;
    /**
     * Removes verification from a user who is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removeuserverification}
     */
    removeUserVerification(
        /**
         * Unique identifier of the target user
         */
        user_id: number;
    ): true;
    /**
     * Removes verification from a chat that is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removechatverification}
     */
    removeChatVerification(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
    ): true;
    /**
     * Marks incoming message as read on behalf of a business account. Requires the _can_read_messages_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#readbusinessmessage}
     */
    readBusinessMessage(
        /**
         * Unique identifier of the business connection on behalf of which to read the message
         */
        business_connection_id: string;
        /**
         * Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.
         */
        chat_id: number;
        /**
         * Unique identifier of the message to mark as read
         */
        message_id: number;
    ): true;
    /**
     * Delete messages on behalf of a business account. Requires the _can_delete_sent_messages_ business bot right to delete messages sent by the bot itself, or the _can_delete_all_messages_ business bot right to delete any message. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletebusinessmessages}
     */
    deleteBusinessMessages(
        /**
         * Unique identifier of the business connection on behalf of which to delete the messages
         */
        business_connection_id: string;
        /**
         * A list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
         */
        message_ids: number[];
    ): true;
    /**
     * Changes the first and last name of a managed business account. Requires the _can_change_name_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountname}
     */
    setBusinessAccountName(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * The new value of the first name for the business account; 1-64 characters
         */
        first_name: string;
    ): true;
    /**
     * Changes the username of a managed business account. Requires the _can_change_username_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountusername}
     */
    setBusinessAccountUsername(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
    ): true;
    /**
     * Changes the bio of a managed business account. Requires the _can_change_bio_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountbio}
     */
    setBusinessAccountBio(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
    ): true;
    /**
     * Changes the profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountprofilephoto}
     */
    setBusinessAccountProfilePhoto(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * The new profile photo to set
         */
        photo: InputProfilePhoto;
    ): true;
    /**
     * Removes the current profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removebusinessaccountprofilephoto}
     */
    removeBusinessAccountProfilePhoto(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
    ): true;
    /**
     * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the _can_change_gift_settings_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountgiftsettings}
     */
    setBusinessAccountGiftSettings(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Pass _True_, if a button for sending a gift to the user or by the business account must always be shown in the input field
         */
        show_gift_button: boolean;
        /**
         * Types of gifts accepted by the business account
         */
        accepted_gift_types: AcceptedGiftTypes;
    ): true;
    /**
     * Returns the amount of Telegram Stars owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link StarAmount | StarAmount} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountstarbalance}
     */
    getBusinessAccountStarBalance(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
    ): StarAmount;
    /**
     * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the _can_transfer_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transferbusinessaccountstars}
     */
    transferBusinessAccountStars(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Number of Telegram Stars to transfer; 1-10000
         */
        star_count: number;
    ): true;
    /**
     * Returns the gifts received and owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link OwnedGifts | OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountgifts}
     */
    getBusinessAccountGifts(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
    ): OwnedGifts;
    /**
     * Converts a given regular gift to Telegram Stars. Requires the _can_convert_gifts_to_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#convertgifttostars}
     */
    convertGiftToStars(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Unique identifier of the regular gift that should be converted to Telegram Stars
         */
        owned_gift_id: string;
    ): true;
    /**
     * Upgrades a given regular gift to a unique gift. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Additionally requires the _can_transfer_stars_ business bot right if the upgrade is paid. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#upgradegift}
     */
    upgradeGift(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Unique identifier of the regular gift that should be upgraded to a unique one
         */
        owned_gift_id: string;
    ): true;
    /**
     * Transfers an owned unique gift to another user. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Requires _can_transfer_stars_ business bot right if the transfer is paid. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transfergift}
     */
    transferGift(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Unique identifier of the regular gift that should be transferred
         */
        owned_gift_id: string;
        /**
         * Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.
         */
        new_owner_chat_id: number;
    ): true;
    /**
     * Posts a story on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story | Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#poststory}
     */
    postStory(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Content of the story
         */
        content: InputStoryContent;
        /**
         * Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`
         */
        active_period: 21600 | 43200 | 86400 | 172800;
    ): Story;
    /**
     * Edits a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns {@link Story | Story} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editstory}
     */
    editStory(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Unique identifier of the story to edit
         */
        story_id: number;
        /**
         * Content of the story
         */
        content: InputStoryContent;
    ): Story;
    /**
     * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestory}
     */
    deleteStory(
        /**
         * Unique identifier of the business connection
         */
        business_connection_id: string;
        /**
         * Unique identifier of the story to delete
         */
        story_id: number;
    ): true;
    /**
     * Use this method to edit text and {@link https://core.telegram.org/bots/api#games | game} messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagetext}
     */
    editMessageText(
        /**
         * New text of the message, 1-4096 characters after entities parsing
         */
        text: string;
    ): true | Message;
    /**
     * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
     */
    editMessageCaption(
    ): true | Message;
    /**
     * Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagemedia}
     */
    editMessageMedia(
        /**
         * An object for a new media content of the message
         */
        media: InputMedia;
    ): true | Message;
    /**
     * Use this method to edit live location messages. A location can be edited until its _live_period_ expires or editing is explicitly disabled by a call to {@link ApiMethods.stopMessageLiveLocation | stopMessageLiveLocation}. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagelivelocation}
     */
    editMessageLiveLocation(
        /**
         * Latitude of new location
         */
        latitude: number;
        /**
         * Longitude of new location
         */
        longitude: number;
    ): true | Message;
    /**
     * Use this method to stop updating a live location message before _live_period_ expires. On success, if the message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stopmessagelivelocation}
     */
    stopMessageLiveLocation(
    ): true | Message;
    /**
     * Use this method to edit a checklist on behalf of a connected business account. On success, the edited {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagechecklist}
     */
    editMessageChecklist(
        /**
         * Unique identifier of the business connection on behalf of which the message will be sent
         */
        business_connection_id: string;
        /**
         * Unique identifier for the target chat
         */
        chat_id: number;
        /**
         * Unique identifier for the target message
         */
        message_id: number;
        /**
         * An object for the new checklist
         */
        checklist: InputChecklist;
    ): Message;
    /**
     * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
     */
    editMessageReplyMarkup(
    ): true | Message;
    /**
     * Use this method to stop a poll which was sent by the bot. On success, the stopped {@link Poll | Poll} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stoppoll}
     */
    stopPoll(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Identifier of the original message with the poll
         */
        message_id: number;
    ): Poll;
    /**
     * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvesuggestedpost}
     */
    approveSuggestedPost(
        /**
         * Unique identifier for the target direct messages chat
         */
        chat_id: number;
        /**
         * Identifier of a suggested post message to approve
         */
        message_id: number;
    ): true;
    /**
     * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinesuggestedpost}
     */
    declineSuggestedPost(
        /**
         * Unique identifier for the target direct messages chat
         */
        chat_id: number;
        /**
         * Identifier of a suggested post message to decline
         */
        message_id: number;
    ): true;
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
     */
    deleteMessage(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Identifier of the message to delete
         */
        message_id: number;
    ): true;
    /**
     * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessages}
     */
    deleteMessages(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * A list of 1-100 identifiers of messages to delete. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
         */
        message_ids: number[];
    ): true;
    /**
     * Use this method to send static .WEBP, {@link https://telegram.org/blog/animated-stickers | animated} .TGS, or {@link https://telegram.org/blog/video-stickers-better-reactions | video} .WEBM stickers. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendsticker}
     */
    sendSticker(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Video and animated stickers can't be sent via an HTTP URL.
         */
        sticker: InputFile | string;
    ): Message;
    /**
     * Use this method to get a sticker set. On success, a {@link StickerSet | StickerSet} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getstickerset}
     */
    getStickerSet(
        /**
         * Name of the sticker set
         */
        name: string;
    ): StickerSet;
    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of {@link Sticker | Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getcustomemojistickers}
     */
    getCustomEmojiStickers(
        /**
         * A list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.
         */
        custom_emoji_ids: string[];
    ): Sticker[];
    /**
     * Use this method to upload a file with a sticker for later use in the {@link ApiMethods.createNewStickerSet | createNewStickerSet}, {@link ApiMethods.addStickerToSet | addStickerToSet}, or {@link ApiMethods.replaceStickerInSet | replaceStickerInSet} methods (the file can be used multiple times). Returns the uploaded {@link File | File} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#uploadstickerfile}
     */
    uploadStickerFile(
        /**
         * User identifier of sticker file owner
         */
        user_id: number;
        /**
         * A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See {@link https://core.telegram.org/stickers | {@link https://core.telegram.org/stickers | https://core.telegram.org/stickers}} for technical requirements. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
         */
        sticker: InputFile;
        /**
         * Format of the sticker, must be one of “static”, “animated”, “video”
         */
        sticker_format: "static" | "animated" | "video";
    ): File;
    /**
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#createnewstickerset}
     */
    createNewStickerSet(
        /**
         * User identifier of created sticker set owner
         */
        user_id: number;
        /**
         * Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `"_by_<bot_username>"`. `<bot_username>` is case insensitive. 1-64 characters.
         */
        name: string;
        /**
         * Sticker set title, 1-64 characters
         */
        title: string;
        /**
         * A list of 1-50 initial stickers to be added to the sticker set
         */
        stickers: InputSticker[];
    ): true;
    /**
     * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#addstickertoset}
     */
    addStickerToSet(
        /**
         * User identifier of sticker set owner
         */
        user_id: number;
        /**
         * Sticker set name
         */
        name: string;
        /**
         * An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.
         */
        sticker: InputSticker;
    ): true;
    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
     */
    setStickerPositionInSet(
        /**
         * File identifier of the sticker
         */
        sticker: string;
        /**
         * New sticker position in the set, zero-based
         */
        position: number;
    ): true;
    /**
     * Use this method to delete a sticker from a set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
     */
    deleteStickerFromSet(
        /**
         * File identifier of the sticker
         */
        sticker: string;
    ): true;
    /**
     * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling {@link ApiMethods.deleteStickerFromSet | deleteStickerFromSet}, then {@link ApiMethods.addStickerToSet | addStickerToSet}, then {@link ApiMethods.setStickerPositionInSet | setStickerPositionInSet}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#replacestickerinset}
     */
    replaceStickerInSet(
        /**
         * User identifier of the sticker set owner
         */
        user_id: number;
        /**
         * Sticker set name
         */
        name: string;
        /**
         * File identifier of the replaced sticker
         */
        old_sticker: string;
        /**
         * An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.
         */
        sticker: InputSticker;
    ): true;
    /**
     * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickeremojilist}
     */
    setStickerEmojiList(
        /**
         * File identifier of the sticker
         */
        sticker: string;
        /**
         * A list of 1-20 emoji associated with the sticker
         */
        emoji_list: string[];
    ): true;
    /**
     * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerkeywords}
     */
    setStickerKeywords(
        /**
         * File identifier of the sticker
         */
        sticker: string;
    ): true;
    /**
     * Use this method to change the {@link MaskPosition | mask position} of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickermaskposition}
     */
    setStickerMaskPosition(
        /**
         * File identifier of the sticker
         */
        sticker: string;
    ): true;
    /**
     * Use this method to set the title of a created sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersettitle}
     */
    setStickerSetTitle(
        /**
         * Sticker set name
         */
        name: string;
        /**
         * Sticker set title, 1-64 characters
         */
        title: string;
    ): true;
    /**
     * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersetthumbnail}
     */
    setStickerSetThumbnail(
        /**
         * Sticker set name
         */
        name: string;
        /**
         * User identifier of the sticker set owner
         */
        user_id: number;
        /**
         * Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video
         */
        format: "static" | "animated" | "video";
    ): true;
    /**
     * Use this method to set the thumbnail of a custom emoji sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail}
     */
    setCustomEmojiStickerSetThumbnail(
        /**
         * Sticker set name
         */
        name: string;
    ): true;
    /**
     * Use this method to delete a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerset}
     */
    deleteStickerSet(
        /**
         * Sticker set name
         */
        name: string;
    ): true;
    /**
     * Use this method to send answers to an inline query. On success, _True_ is returned.
     *
     * No more than **50** results per query are allowed.
     *
     * @see {@link https://core.telegram.org/bots/api#answerinlinequery}
     */
    answerInlineQuery(
        /**
         * Unique identifier for the answered query
         */
        inline_query_id: string;
        /**
         * An array of results for the inline query
         */
        results: InlineQueryResult[];
    ): true;
    /**
     * Use this method to set the result of an interaction with a {@link https://core.telegram.org/bots/webapps | Web App} and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a {@link sentwebappMessage | SentWebAppMessage} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answerwebappquery}
     */
    answerWebAppQuery(
        /**
         * Unique identifier for the query to be answered
         */
        web_app_query_id: string;
        /**
         * An object describing the message to be sent
         */
        result: InlineQueryResult;
    ): SentWebAppMessage;
    /**
     * Stores a message that can be sent by a user of a Mini App. Returns a {@link preparedinlineMessage | PreparedInlineMessage} object.
     *
     * @see {@link https://core.telegram.org/bots/api#savepreparedinlinemessage}
     */
    savePreparedInlineMessage(
        /**
         * Unique identifier of the target user that can use the prepared message
         */
        user_id: number;
        /**
         * An object describing the message to be sent
         */
        result: InlineQueryResult;
    ): PreparedInlineMessage;
    /**
     * Use this method to send invoices. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendinvoice}
     */
    sendInvoice(
        /**
         * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
         */
        chat_id: number | string;
        /**
         * Product name, 1-32 characters
         */
        title: string;
        /**
         * Product description, 1-255 characters
         */
        description: string;
        /**
         * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
         */
        payload: string;
        /**
         * Three-letter ISO 4217 currency code, see {@link https://core.telegram.org/bots/payments#supported-currencies | more on currencies}. Pass “XTR” for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
         */
        currency: string;
        /**
         * Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
         */
        prices: LabeledPrice[];
    ): Message;
    /**
     * Use this method to create a link for an invoice. Returns the created invoice link as _String_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#createinvoicelink}
     */
    createInvoiceLink(
        /**
         * Product name, 1-32 characters
         */
        title: string;
        /**
         * Product description, 1-255 characters
         */
        description: string;
        /**
         * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
         */
        payload: string;
        /**
         * Three-letter ISO 4217 currency code, see {@link https://core.telegram.org/bots/payments#supported-currencies | more on currencies}. Pass “XTR” for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
         */
        currency: string;
        /**
         * Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in {@link https://t.me/BotNews/90 | Telegram Stars}.
         */
        prices: LabeledPrice[];
    ): string;
    /**
     * If you sent an invoice requesting a shipping address and the parameter _is_flexible_ was specified, the Bot API will send an {@link Update | Update} with a _shipping_query_ field to the bot. Use this method to reply to shipping queries. On success, _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answershippingquery}
     */
    answerShippingQuery(
        /**
         * Unique identifier for the query to be answered
         */
        shipping_query_id: string;
        /**
         * Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible)
         */
        ok: boolean;
    ): true;
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an {@link Update | Update} with the field _pre_checkout_query_. Use this method to respond to such pre-checkout queries. On success, _True_ is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
     */
    answerPreCheckoutQuery(
        /**
         * Unique identifier for the query to be answered
         */
        pre_checkout_query_id: string;
        /**
         * Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems.
         */
        ok: boolean;
    ): true;
    /**
     * A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a {@link StarAmount | StarAmount} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getmystarbalance}
     */
    getMyStarBalance(): StarAmount;
    /**
     * Returns the bot's Telegram Star transactions in chronological order. On success, returns a {@link StarTransactions | StarTransactions} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getstartransactions}
     */
    getStarTransactions(
    ): StarTransactions;
    /**
     * Refunds a successful payment in {@link https://t.me/BotNews/90 | Telegram Stars}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#refundstarpayment}
     */
    refundStarPayment(
        /**
         * Identifier of the user whose payment will be refunded
         */
        user_id: number;
        /**
         * Telegram payment identifier
         */
        telegram_payment_charge_id: string;
    ): true;
    /**
     * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#edituserstarsubscription}
     */
    editUserStarSubscription(
        /**
         * Identifier of the user whose subscription will be edited
         */
        user_id: number;
        /**
         * Telegram payment identifier for the subscription
         */
        telegram_payment_charge_id: string;
        /**
         * Pass _True_ to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass _False_ to allow the user to re-enable a subscription that was previously canceled by the bot.
         */
        is_canceled: boolean;
    ): true;
    /**
     * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns _True_ on success.
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * @see {@link https://core.telegram.org/bots/api#setpassportdataerrors}
     */
    setPassportDataErrors(
        /**
         * User identifier
         */
        user_id: number;
        /**
         * An array describing the errors
         */
        errors: PassportElementError[];
    ): true;
    /**
     * Use this method to send a game. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgame}
     */
    sendGame(
        /**
         * Unique identifier for the target chat. Games can't be sent to channel direct messages chats and channel chats.
         */
        chat_id: number;
        /**
         * Short name of the game, serves as the unique identifier for the game. Set up your games via {@link https://t.me/botfather | @BotFather}.
         */
        game_short_name: string;
    ): Message;
    /**
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the {@link Message | Message} is returned, otherwise _True_ is returned. Returns an error, if the new score is not greater than the user's current score in the chat and _force_ is _False_.
     *
     * @see {@link https://core.telegram.org/bots/api#setgamescore}
     */
    setGameScore(
        /**
         * User identifier
         */
        user_id: number;
        /**
         * New score, must be non-negative
         */
        score: number;
    ): true | Message;
    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of {@link GameHighScore | GameHighScore} objects.
     *
     * This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.
     *
     * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
     */
    getGameHighScores(
        /**
         * Target user id
         */
        user_id: number;
    ): GameHighScore[];
}
