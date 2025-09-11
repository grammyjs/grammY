// deno-lint-ignore-file camelcase
import type { ApiMethods, ApiParameters } from "../types.ts";
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
     * @param url HTTPS URL to send updates to. Use an empty string to remove webhook integration
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setWebhook( url: string,
        other?: Partial<ApiParameters<"setWebhook", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to remove webhook integration if you decide to switch back to {@link ApiMethods.getUpdates | getUpdates}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletewebhook}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteWebhook(
    other?: Partial<ApiParameters<"deleteWebhook", A>>, signal?: AbortSignal,): true;
    /**
     * Use this method to get current webhook status. Requires no parameters. On success, returns a {@link WebhookInfo | WebhookInfo} object. If the bot is using {@link ApiMethods.getUpdates | getUpdates}, will return an object with the _url_ field empty.
     *
     * @see {@link https://core.telegram.org/bots/api#getwebhookinfo}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
     getWebhookInfo(other?: Partial<ApiParameters<"getWebhookInfo", A>>,
    signal?: AbortSignal,   ): WebhookInfo;
    /**
     * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a {@link User | User} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getme}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMe(other?: Partial<ApiParameters<"getMe", A>>,
    signal?: AbortSignal,   ): UserFromGetMe;
    /**
     * Use this method to log out from the cloud Bot API server before launching the bot locally. You **must** log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns _True_ on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#logout}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    logOut(other?: Partial<ApiParameters<"logOut", A>>,
    signal?: AbortSignal,   ): true;
    /**
     * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns _True_ on success. Requires no parameters.
     *
     * @see {@link https://core.telegram.org/bots/api#close}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    close(other?: Partial<ApiParameters<"close", A>>,
    signal?: AbortSignal,   ): true;
    /**
     * Use this method to send text messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendMessage( chat_id: number | string, text: string,
    other?: Partial<ApiParameters<"sendMessage", A>>, signal?: AbortSignal): Message;
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
    forwardMessage( chat_id: number | string, from_chat_id: number | string, message_id: number,
    other?: Partial<ApiParameters<"forwardMessage", A>>, signal?: AbortSignal): Message;
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
    forwardMessages( chat_id: number | string, from_chat_id: number | string, message_ids: number[],
    other?: Partial<ApiParameters<"forwardMessages", A>>, signal?: AbortSignal): MessageId[];
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
    copyMessage( chat_id: number | string, from_chat_id: number | string, message_id: number,
    other?: Partial<ApiParameters<"copyMessage", A>>, signal?: AbortSignal): MessageId;
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
    copyMessages( chat_id: number | string, from_chat_id: number | string, message_ids: number[],
    other?: Partial<ApiParameters<"copyMessages", A>>, signal?: AbortSignal): MessageId[];
    /**
     * Use this method to send photos. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendPhoto( chat_id: number | string, photo: InputFile | string,
    other?: Partial<ApiParameters<"sendPhoto", A>>, signal?: AbortSignal): Message;
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
    sendAudio( chat_id: number | string, audio: InputFile | string,
    other?: Partial<ApiParameters<"sendAudio", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to send general files. On success, the sent {@link Message | Message} is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#senddocument}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendDocument( chat_id: number | string, document: InputFile | string,
    other?: Partial<ApiParameters<"sendDocument", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideo}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendVideo( chat_id: number | string, video: InputFile | string,
    other?: Partial<ApiParameters<"sendVideo", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent {@link Message | Message} is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendanimation}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendAnimation( chat_id: number | string, animation: InputFile | string,
    other?: Partial<ApiParameters<"sendAnimation", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as {@link Audio | Audio} or {@link Document | Document}). On success, the sent {@link Message | Message} is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvoice}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendVoice( chat_id: number | string, voice: InputFile | string,
    other?: Partial<ApiParameters<"sendVoice", A>>, signal?: AbortSignal): Message;
    /**
     * As of {@link https://telegram.org/blog/video-messages-and-telescope | v.4.0}, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendvideonote}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param video_note Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Sending video notes by a URL is currently unsupported
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendVideoNote( chat_id: number | string, video_note: InputFile | string,
    other?: Partial<ApiParameters<"sendVideoNote", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to send paid media. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendpaidmedia}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance.
     * @param star_count The number of Telegram Stars that must be paid to buy access to the media; 1-10000
     * @param media An array describing the media to be sent; up to 10 items
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendPaidMedia( chat_id: number | string, star_count: number, media: InputPaidMedia[],
    other?: Partial<ApiParameters<"sendPaidMedia", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of {@link Message | Message} objects that were sent is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendmediagroup}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param media An array describing messages to be sent, must include 2-10 items
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendMediaGroup( chat_id: number | string, media: Array< | InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo >,
    other?: Partial<ApiParameters<"sendMediaGroup", A>>, signal?: AbortSignal): Message[];
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
    sendLocation( chat_id: number | string, latitude: number, longitude: number,
    other?: Partial<ApiParameters<"sendLocation", A>>, signal?: AbortSignal): Message;
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
    sendVenue( chat_id: number | string, latitude: number, longitude: number, title: string, address: string,
    other?: Partial<ApiParameters<"sendVenue", A>>, signal?: AbortSignal): Message;
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
    sendContact( chat_id: number | string, phone_number: string, first_name: string,
    other?: Partial<ApiParameters<"sendContact", A>>, signal?: AbortSignal): Message;
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
    sendPoll( chat_id: number | string, question: string, options: InputPollOption[],
    other?: Partial<ApiParameters<"sendPoll", A>>, signal?: AbortSignal): Message;
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
    sendChecklist( business_connection_id: string, chat_id: number, checklist: InputChecklist,
    other?: Partial<ApiParameters<"sendChecklist", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to send an animated emoji that will display a random value. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#senddice}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendDice( chat_id: number | string,
    other?: Partial<ApiParameters<"sendDice", A>>, signal?: AbortSignal): Message;
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
    sendChatAction( chat_id: number | string, action: | "typing" | "upload_photo" | "record_video" | "upload_video" | "record_voice" | "upload_voice" | "upload_document" | "choose_sticker" | "find_location" | "record_video_note" | "upload_video_note",
    other?: Partial<ApiParameters<"sendChatAction", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmessagereaction}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_id Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setMessageReaction( chat_id: number | string, message_id: number,
    other?: Partial<ApiParameters<"setMessageReaction", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get a list of profile pictures for a user. Returns a {@link UserProfilePhotos | UserProfilePhotos} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getUserProfilePhotos( user_id: number,
    other?: Partial<ApiParameters<"getUserProfilePhotos", A>>, signal?: AbortSignal): UserProfilePhotos;
    /**
     * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method {@link https://core.telegram.org/bots/webapps#initializing-mini-apps | requestEmojiStatusAccess}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setuseremojistatus}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setUserEmojiStatus( user_id: number,
    other?: Partial<ApiParameters<"setUserEmojiStatus", A>>, signal?: AbortSignal): true;
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
    getFile( file_id: string,
    other?: Partial<ApiParameters<"getFile", A>>, signal?: AbortSignal): File;
    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless {@link ApiMethods.unbanChatMember | unbanned} first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatmember}
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    banChatMember( chat_id: number | string, user_id: number,
    other?: Partial<ApiParameters<"banChatMember", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter _only_if_banned_. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    unbanChatMember( chat_id: number | string, user_id: number,
    other?: Partial<ApiParameters<"unbanChatMember", A>>, signal?: AbortSignal): true;
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
    restrictChatMember( chat_id: number | string, user_id: number, permissions: ChatPermissions,
    other?: Partial<ApiParameters<"restrictChatMember", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass _False_ for all boolean parameters to demote a user. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#promotechatmember}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    promoteChatMember( chat_id: number | string, user_id: number,
    other?: Partial<ApiParameters<"promoteChatMember", A>>, signal?: AbortSignal): true;
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
    setChatAdministratorCustomTitle( chat_id: number | string, user_id: number, custom_title: string,
    other?: Partial<ApiParameters<"setChatAdministratorCustomTitle", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is {@link ApiMethods.unbanChatSenderChat | unbanned}, the owner of the banned chat won't be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#banchatsenderchat}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    banChatSenderChat( chat_id: number | string, sender_chat_id: number,
    other?: Partial<ApiParameters<"banChatSenderChat", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unbanchatsenderchat}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    unbanChatSenderChat( chat_id: number | string, sender_chat_id: number,
    other?: Partial<ApiParameters<"unbanChatSenderChat", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can_restrict_members_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatpermissions}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param permissions An object for new default chat permissions
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setChatPermissions( chat_id: number | string, permissions: ChatPermissions,
    other?: Partial<ApiParameters<"setChatPermissions", A>>, signal?: AbortSignal): true;
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
    exportChatInviteLink( chat_id: number | string,
    other?: Partial<ApiParameters<"exportChatInviteLink", A>>, signal?: AbortSignal): string;
    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method {@link ApiMethods.revokeChatInviteLink | revokeChatInviteLink}. Returns the new invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    createChatInviteLink( chat_id: number | string,
    other?: Partial<ApiParameters<"createChatInviteLink", A>>, signal?: AbortSignal): ChatInviteLink;
    /**
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatinvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editChatInviteLink( chat_id: number | string, invite_link: string,
    other?: Partial<ApiParameters<"editChatInviteLink", A>>, signal?: AbortSignal): ChatInviteLink;
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
    createChatSubscriptionInviteLink( chat_id: number | string, subscription_period: 2592000, subscription_price: number,
    other?: Partial<ApiParameters<"createChatSubscriptionInviteLink", A>>, signal?: AbortSignal): ChatInviteLink;
    /**
     * Use this method to edit a subscription invite link created by the bot. The bot must have the _can_invite_users_ administrator rights. Returns the edited invite link as a {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#editchatsubscriptioninvitelink}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param invite_link The invite link to edit
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editChatSubscriptionInviteLink( chat_id: number | string, invite_link: string,
    other?: Partial<ApiParameters<"editChatSubscriptionInviteLink", A>>, signal?: AbortSignal): ChatInviteLink;
    /**
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as {@link ChatInviteLink | ChatInviteLink} object.
     *
     * @see {@link https://core.telegram.org/bots/api#revokechatinvitelink}
     * @param chat_id Unique identifier of the target chat or username of the target channel (in the format `@channelusername`)
     * @param invite_link The invite link to revoke
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    revokeChatInviteLink( chat_id: number | string, invite_link: string,
    other?: Partial<ApiParameters<"revokeChatInviteLink", A>>, signal?: AbortSignal): ChatInviteLink;
    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvechatjoinrequest}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    approveChatJoinRequest( chat_id: number | string, user_id: number,
    other?: Partial<ApiParameters<"approveChatJoinRequest", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinechatjoinrequest}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    declineChatJoinRequest( chat_id: number | string, user_id: number,
    other?: Partial<ApiParameters<"declineChatJoinRequest", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param photo New chat photo, uploaded using multipart/form-data
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setChatPhoto( chat_id: number | string, photo: InputFile,
    other?: Partial<ApiParameters<"setChatPhoto", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteChatPhoto( chat_id: number | string,
    other?: Partial<ApiParameters<"deleteChatPhoto", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchattitle}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param title New chat title, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setChatTitle( chat_id: number | string, title: string,
    other?: Partial<ApiParameters<"setChatTitle", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatdescription}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setChatDescription( chat_id: number | string,
    other?: Partial<ApiParameters<"setChatDescription", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_id Identifier of a message to pin
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    pinChatMessage( chat_id: number | string, message_id: number,
    other?: Partial<ApiParameters<"pinChatMessage", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    unpinChatMessage( chat_id: number | string,
    other?: Partial<ApiParameters<"unpinChatMessage", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallchatmessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    unpinAllChatMessages( chat_id: number | string,
    other?: Partial<ApiParameters<"unpinAllChatMessages", A>>, signal?: AbortSignal): true;
    /**
     * Use this method for your bot to leave a group, supergroup or channel. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#leavechat}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`). Channel direct messages chats aren't supported; leave the corresponding channel instead.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    leaveChat( chat_id: number | string,
    other?: Partial<ApiParameters<"leaveChat", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get up-to-date information about the chat. Returns a {@link ChatFullInfo | ChatFullInfo} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchat}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getChat( chat_id: number | string,
    other?: Partial<ApiParameters<"getChat", A>>, signal?: AbortSignal): ChatFullInfo;
    /**
     * Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of {@link ChatMember | ChatMember} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getChatAdministrators( chat_id: number | string,
    other?: Partial<ApiParameters<"getChatAdministrators", A>>, signal?: AbortSignal): Array<ChatMemberOwner | ChatMemberAdministrator>;
    /**
     * Use this method to get the number of members in a chat. Returns _Int_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmembercount}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getChatMemberCount( chat_id: number | string,
    other?: Partial<ApiParameters<"getChatMemberCount", A>>, signal?: AbortSignal): number;
    /**
     * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a {@link ChatMember | ChatMember} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmember}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getChatMember( chat_id: number | string, user_id: number,
    other?: Partial<ApiParameters<"getChatMember", A>>, signal?: AbortSignal): ChatMember;
    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatstickerset}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setChatStickerSet( chat_id: number | string, sticker_set_name: string,
    other?: Partial<ApiParameters<"setChatStickerSet", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in {@link ApiMethods.getChat | getChat} requests to check if the bot can use this method. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletechatstickerset}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteChatStickerSet( chat_id: number | string,
    other?: Partial<ApiParameters<"deleteChatStickerSet", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of {@link Sticker | Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getforumtopiciconstickers}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getForumTopicIconStickers(
    other?: Partial<ApiParameters<"getForumTopicIconStickers", A>>, signal?: AbortSignal): Sticker[];
    /**
     * Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns information about the created topic as a {@link ForumTopic | ForumTopic} object.
     *
     * @see {@link https://core.telegram.org/bots/api#createforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param name Topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    createForumTopic( chat_id: number | string, name: string,
    other?: Partial<ApiParameters<"createForumTopic", A>>, signal?: AbortSignal): ForumTopic;
    /**
     * Use this method to edit name and icon of a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editForumTopic( chat_id: number | string, message_thread_id: number,
    other?: Partial<ApiParameters<"editForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closeforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    closeForumTopic( chat_id: number | string, message_thread_id: number,
    other?: Partial<ApiParameters<"closeForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopenforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    reopenForumTopic( chat_id: number | string, message_thread_id: number,
    other?: Partial<ApiParameters<"reopenForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to delete a forum topic along with all its messages in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_delete_messages_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deleteforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteForumTopic( chat_id: number | string, message_thread_id: number,
    other?: Partial<ApiParameters<"deleteForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to clear the list of pinned messages in a forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallforumtopicmessages}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    unpinAllForumTopicMessages( chat_id: number | string, message_thread_id: number,
    other?: Partial<ApiParameters<"unpinAllForumTopicMessages", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#editgeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param name New topic name, 1-128 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editGeneralForumTopic( chat_id: number | string, name: string,
    other?: Partial<ApiParameters<"editGeneralForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#closegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    closeGeneralForumTopic( chat_id: number | string,
    other?: Partial<ApiParameters<"closeGeneralForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically unhidden if it was hidden. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#reopengeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    reopenGeneralForumTopic( chat_id: number | string,
    other?: Partial<ApiParameters<"reopenGeneralForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically closed if it was open. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#hidegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    hideGeneralForumTopic( chat_id: number | string,
    other?: Partial<ApiParameters<"hideGeneralForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unhidegeneralforumtopic}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    unhideGeneralForumTopic( chat_id: number | string,
    other?: Partial<ApiParameters<"unhideGeneralForumTopic", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages}
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    unpinAllGeneralForumTopicMessages( chat_id: number | string,
    other?: Partial<ApiParameters<"unpinAllGeneralForumTopicMessages", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to send answers to callback queries sent from {@link https://core.telegram.org/bots/features#inline-keyboards | inline keyboards}. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, _True_ is returned.
     *
     * > Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via {@link https://t.me/botfather | @BotFather} and accept the terms. Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter.
     *
     * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
     * @param callback_query_id Unique identifier for the query to be answered
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    answerCallbackQuery( callback_query_id: string,
    other?: Partial<ApiParameters<"answerCallbackQuery", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a {@link UserChatBoosts | UserChatBoosts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getuserchatboosts}
     * @param chat_id Unique identifier for the chat or username of the channel (in the format `@channelusername`)
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getUserChatBoosts( chat_id: number | string, user_id: number,
    other?: Partial<ApiParameters<"getUserChatBoosts", A>>, signal?: AbortSignal): UserChatBoosts;
    /**
     * Use this method to get information about the connection of the bot with a business account. Returns a {@link BusinessConnection | BusinessConnection} object on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessconnection}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getBusinessConnection( business_connection_id: string,
    other?: Partial<ApiParameters<"getBusinessConnection", A>>, signal?: AbortSignal): BusinessConnection;
    /**
     * Use this method to change the list of the bot's commands. See {@link https://core.telegram.org/bots/features#commands | this manual} for more details about bot commands. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmycommands}
     * @param commands A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setMyCommands( commands: BotCommand[],
    other?: Partial<ApiParameters<"setMyCommands", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, {@link https://core.telegram.org/bots/api#determining-list-of-commands | higher level commands} will be shown to affected users. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemycommands}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteMyCommands(
    other?: Partial<ApiParameters<"deleteMyCommands", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of {@link BotCommand | BotCommand} objects. If commands aren't set, an empty list is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getmycommands}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyCommands(
    other?: Partial<ApiParameters<"getMyCommands", A>>, signal?: AbortSignal): BotCommand[];
    /**
     * Use this method to change the bot's name. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyname}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setMyName(
    other?: Partial<ApiParameters<"setMyName", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get the current bot name for the given user language. Returns {@link BotName | BotName} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyname}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyName(
    other?: Partial<ApiParameters<"getMyName", A>>, signal?: AbortSignal): BotName;
    /**
     * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setMyDescription(
    other?: Partial<ApiParameters<"setMyDescription", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get the current bot description for the given user language. Returns {@link BotDescription | BotDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyDescription(
    other?: Partial<ApiParameters<"getMyDescription", A>>, signal?: AbortSignal): BotDescription;
    /**
     * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmyshortdescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setMyShortDescription(
    other?: Partial<ApiParameters<"setMyShortDescription", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get the current bot short description for the given user language. Returns {@link BotShortDescription | BotShortDescription} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmyshortdescription}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyShortDescription(
    other?: Partial<ApiParameters<"getMyShortDescription", A>>, signal?: AbortSignal): BotShortDescription;
    /**
     * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setchatmenubutton}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setChatMenuButton(
    other?: Partial<ApiParameters<"setChatMenuButton", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns {@link MenuButton | MenuButton} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getchatmenubutton}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getChatMenuButton(
    other?: Partial<ApiParameters<"getChatMenuButton", A>>, signal?: AbortSignal): MenuButton;
    /**
     * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setmydefaultadministratorrights}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setMyDefaultAdministratorRights(
    other?: Partial<ApiParameters<"setMyDefaultAdministratorRights", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to get the current default administrator rights of the bot. Returns {@link ChatAdministratorRights | ChatAdministratorRights} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getmydefaultadministratorrights}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyDefaultAdministratorRights(
    other?: Partial<ApiParameters<"getMyDefaultAdministratorRights", A>>, signal?: AbortSignal): ChatAdministratorRights;
    /**
     * Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a {@link Gifts | Gifts} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getavailablegifts}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getAvailableGifts(
    other?: Partial<ApiParameters<"getAvailableGifts", A>>, signal?: AbortSignal): Gifts;
    /**
     * Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgift}
     * @param gift_id Identifier of the gift
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendGift( gift_id: string,
    other?: Partial<ApiParameters<"sendGift", A>>, signal?: AbortSignal): true;
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
    giftPremiumSubscription( user_id: number, month_count: 3 | 6 | 12, star_count: 1000 | 1500 | 2500,
    other?: Partial<ApiParameters<"giftPremiumSubscription", A>>, signal?: AbortSignal): true;
    /**
     * Verifies a user {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifyuser}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    verifyUser( user_id: number,
    other?: Partial<ApiParameters<"verifyUser", A>>, signal?: AbortSignal): true;
    /**
     * Verifies a chat {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} which is represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#verifychat}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can't be verified.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    verifyChat( chat_id: number | string,
    other?: Partial<ApiParameters<"verifyChat", A>>, signal?: AbortSignal): true;
    /**
     * Removes verification from a user who is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removeuserverification}
     * @param user_id Unique identifier of the target user
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    removeUserVerification( user_id: number,
    other?: Partial<ApiParameters<"removeUserVerification", A>>, signal?: AbortSignal): true;
    /**
     * Removes verification from a chat that is currently verified {@link https://telegram.org/verify#third-party-verification | on behalf of the organization} represented by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removechatverification}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    removeChatVerification( chat_id: number | string,
    other?: Partial<ApiParameters<"removeChatVerification", A>>, signal?: AbortSignal): true;
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
    readBusinessMessage( business_connection_id: string, chat_id: number, message_id: number,
    other?: Partial<ApiParameters<"readBusinessMessage", A>>, signal?: AbortSignal): true;
    /**
     * Delete messages on behalf of a business account. Requires the _can_delete_sent_messages_ business bot right to delete messages sent by the bot itself, or the _can_delete_all_messages_ business bot right to delete any message. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletebusinessmessages}
     * @param business_connection_id Unique identifier of the business connection on behalf of which to delete the messages
     * @param message_ids A list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteBusinessMessages( business_connection_id: string, message_ids: number[],
    other?: Partial<ApiParameters<"deleteBusinessMessages", A>>, signal?: AbortSignal): true;
    /**
     * Changes the first and last name of a managed business account. Requires the _can_change_name_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountname}
     * @param business_connection_id Unique identifier of the business connection
     * @param first_name The new value of the first name for the business account; 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setBusinessAccountName( business_connection_id: string, first_name: string,
    other?: Partial<ApiParameters<"setBusinessAccountName", A>>, signal?: AbortSignal): true;
    /**
     * Changes the username of a managed business account. Requires the _can_change_username_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountusername}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setBusinessAccountUsername( business_connection_id: string,
    other?: Partial<ApiParameters<"setBusinessAccountUsername", A>>, signal?: AbortSignal): true;
    /**
     * Changes the bio of a managed business account. Requires the _can_change_bio_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountbio}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setBusinessAccountBio( business_connection_id: string,
    other?: Partial<ApiParameters<"setBusinessAccountBio", A>>, signal?: AbortSignal): true;
    /**
     * Changes the profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountprofilephoto}
     * @param business_connection_id Unique identifier of the business connection
     * @param photo The new profile photo to set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setBusinessAccountProfilePhoto( business_connection_id: string, photo: InputProfilePhoto,
    other?: Partial<ApiParameters<"setBusinessAccountProfilePhoto", A>>, signal?: AbortSignal): true;
    /**
     * Removes the current profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#removebusinessaccountprofilephoto}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    removeBusinessAccountProfilePhoto( business_connection_id: string,
    other?: Partial<ApiParameters<"removeBusinessAccountProfilePhoto", A>>, signal?: AbortSignal): true;
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
    setBusinessAccountGiftSettings( business_connection_id: string, show_gift_button: boolean, accepted_gift_types: AcceptedGiftTypes,
    other?: Partial<ApiParameters<"setBusinessAccountGiftSettings", A>>, signal?: AbortSignal): true;
    /**
     * Returns the amount of Telegram Stars owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link StarAmount | StarAmount} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountstarbalance}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getBusinessAccountStarBalance( business_connection_id: string,
    other?: Partial<ApiParameters<"getBusinessAccountStarBalance", A>>, signal?: AbortSignal): StarAmount;
    /**
     * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the _can_transfer_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#transferbusinessaccountstars}
     * @param business_connection_id Unique identifier of the business connection
     * @param star_count Number of Telegram Stars to transfer; 1-10000
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    transferBusinessAccountStars( business_connection_id: string, star_count: number,
    other?: Partial<ApiParameters<"transferBusinessAccountStars", A>>, signal?: AbortSignal): true;
    /**
     * Returns the gifts received and owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns {@link OwnedGifts | OwnedGifts} on success.
     *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountgifts}
     * @param business_connection_id Unique identifier of the business connection
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getBusinessAccountGifts( business_connection_id: string,
    other?: Partial<ApiParameters<"getBusinessAccountGifts", A>>, signal?: AbortSignal): OwnedGifts;
    /**
     * Converts a given regular gift to Telegram Stars. Requires the _can_convert_gifts_to_stars_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#convertgifttostars}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be converted to Telegram Stars
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    convertGiftToStars( business_connection_id: string, owned_gift_id: string,
    other?: Partial<ApiParameters<"convertGiftToStars", A>>, signal?: AbortSignal): true;
    /**
     * Upgrades a given regular gift to a unique gift. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Additionally requires the _can_transfer_stars_ business bot right if the upgrade is paid. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#upgradegift}
     * @param business_connection_id Unique identifier of the business connection
     * @param owned_gift_id Unique identifier of the regular gift that should be upgraded to a unique one
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    upgradeGift( business_connection_id: string, owned_gift_id: string,
    other?: Partial<ApiParameters<"upgradeGift", A>>, signal?: AbortSignal): true;
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
    transferGift( business_connection_id: string, owned_gift_id: string, new_owner_chat_id: number,
    other?: Partial<ApiParameters<"transferGift", A>>, signal?: AbortSignal): true;
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
    postStory( business_connection_id: string, content: InputStoryContent, active_period: 21600 | 43200 | 86400 | 172800,
    other?: Partial<ApiParameters<"postStory", A>>, signal?: AbortSignal): Story;
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
    editStory( business_connection_id: string, story_id: number, content: InputStoryContent,
    other?: Partial<ApiParameters<"editStory", A>>, signal?: AbortSignal): Story;
    /**
     * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestory}
     * @param business_connection_id Unique identifier of the business connection
     * @param story_id Unique identifier of the story to delete
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteStory( business_connection_id: string, story_id: number,
    other?: Partial<ApiParameters<"deleteStory", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to edit text and {@link https://core.telegram.org/bots/api#games | game} messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagetext}
     * @param text New text of the message, 1-4096 characters after entities parsing
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editMessageText( text: string,
    other?: Partial<ApiParameters<"editMessageText", A>>, signal?: AbortSignal): true | Message;
    /**
     * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editMessageCaption(
    other?: Partial<ApiParameters<"editMessageCaption", A>>, signal?: AbortSignal): true | Message;
    /**
     * Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagemedia}
     * @param media An object for a new media content of the message
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editMessageMedia( media: InputMedia,
    other?: Partial<ApiParameters<"editMessageMedia", A>>, signal?: AbortSignal): true | Message;
    /**
     * Use this method to edit live location messages. A location can be edited until its _live_period_ expires or editing is explicitly disabled by a call to {@link ApiMethods.stopMessageLiveLocation | stopMessageLiveLocation}. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagelivelocation}
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editMessageLiveLocation( latitude: number, longitude: number,
    other?: Partial<ApiParameters<"editMessageLiveLocation", A>>, signal?: AbortSignal): true | Message;
    /**
     * Use this method to stop updating a live location message before _live_period_ expires. On success, if the message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stopmessagelivelocation}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    stopMessageLiveLocation(
    other?: Partial<ApiParameters<"stopMessageLiveLocation", A>>, signal?: AbortSignal): true | Message;
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
    editMessageChecklist( business_connection_id: string, chat_id: number, message_id: number, checklist: InputChecklist,
    other?: Partial<ApiParameters<"editMessageChecklist", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited {@link Message | Message} is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.
     *
     * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    editMessageReplyMarkup(
    other?: Partial<ApiParameters<"editMessageReplyMarkup", A>>, signal?: AbortSignal): true | Message;
    /**
     * Use this method to stop a poll which was sent by the bot. On success, the stopped {@link Poll | Poll} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#stoppoll}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_id Identifier of the original message with the poll
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    stopPoll( chat_id: number | string, message_id: number,
    other?: Partial<ApiParameters<"stopPoll", A>>, signal?: AbortSignal): Poll;
    /**
     * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#approvesuggestedpost}
     * @param chat_id Unique identifier for the target direct messages chat
     * @param message_id Identifier of a suggested post message to approve
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    approveSuggestedPost( chat_id: number, message_id: number,
    other?: Partial<ApiParameters<"approveSuggestedPost", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#declinesuggestedpost}
     * @param chat_id Unique identifier for the target direct messages chat
     * @param message_id Identifier of a suggested post message to decline
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    declineSuggestedPost( chat_id: number, message_id: number,
    other?: Partial<ApiParameters<"declineSuggestedPost", A>>, signal?: AbortSignal): true;
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
    deleteMessage( chat_id: number | string, message_id: number,
    other?: Partial<ApiParameters<"deleteMessage", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletemessages}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param message_ids A list of 1-100 identifiers of messages to delete. See {@link ApiMethods.deleteMessage | deleteMessage} for limitations on which messages can be deleted
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteMessages( chat_id: number | string, message_ids: number[],
    other?: Partial<ApiParameters<"deleteMessages", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to send static .WEBP, {@link https://telegram.org/blog/animated-stickers | animated} .TGS, or {@link https://telegram.org/blog/video-stickers-better-reactions | video} .WEBM stickers. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendsticker}
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. {@link https://core.telegram.org/bots/api#sending-files | More information on Sending Files »}. Video and animated stickers can't be sent via an HTTP URL.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendSticker( chat_id: number | string, sticker: InputFile | string,
    other?: Partial<ApiParameters<"sendSticker", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to get a sticker set. On success, a {@link StickerSet | StickerSet} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#getstickerset}
     * @param name Name of the sticker set
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getStickerSet( name: string,
    other?: Partial<ApiParameters<"getStickerSet", A>>, signal?: AbortSignal): StickerSet;
    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of {@link Sticker | Sticker} objects.
     *
     * @see {@link https://core.telegram.org/bots/api#getcustomemojistickers}
     * @param custom_emoji_ids A list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getCustomEmojiStickers( custom_emoji_ids: string[],
    other?: Partial<ApiParameters<"getCustomEmojiStickers", A>>, signal?: AbortSignal): Sticker[];
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
    uploadStickerFile( user_id: number, sticker: InputFile, sticker_format: "static" | "animated" | "video",
    other?: Partial<ApiParameters<"uploadStickerFile", A>>, signal?: AbortSignal): File;
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
    createNewStickerSet( user_id: number, name: string, title: string, stickers: InputSticker[],
    other?: Partial<ApiParameters<"createNewStickerSet", A>>, signal?: AbortSignal): true;
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
    addStickerToSet( user_id: number, name: string, sticker: InputSticker,
    other?: Partial<ApiParameters<"addStickerToSet", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
     * @param sticker File identifier of the sticker
     * @param position New sticker position in the set, zero-based
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setStickerPositionInSet( sticker: string, position: number,
    other?: Partial<ApiParameters<"setStickerPositionInSet", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to delete a sticker from a set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
     * @param sticker File identifier of the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteStickerFromSet( sticker: string,
    other?: Partial<ApiParameters<"deleteStickerFromSet", A>>, signal?: AbortSignal): true;
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
    replaceStickerInSet( user_id: number, name: string, old_sticker: string, sticker: InputSticker,
    other?: Partial<ApiParameters<"replaceStickerInSet", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickeremojilist}
     * @param sticker File identifier of the sticker
     * @param emoji_list A list of 1-20 emoji associated with the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setStickerEmojiList( sticker: string, emoji_list: string[],
    other?: Partial<ApiParameters<"setStickerEmojiList", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickerkeywords}
     * @param sticker File identifier of the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setStickerKeywords( sticker: string,
    other?: Partial<ApiParameters<"setStickerKeywords", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to change the {@link MaskPosition | mask position} of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickermaskposition}
     * @param sticker File identifier of the sticker
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setStickerMaskPosition( sticker: string,
    other?: Partial<ApiParameters<"setStickerMaskPosition", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to set the title of a created sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setstickersettitle}
     * @param name Sticker set name
     * @param title Sticker set title, 1-64 characters
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setStickerSetTitle( name: string, title: string,
    other?: Partial<ApiParameters<"setStickerSetTitle", A>>, signal?: AbortSignal): true;
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
    setStickerSetThumbnail( name: string, user_id: number, format: "static" | "animated" | "video",
    other?: Partial<ApiParameters<"setStickerSetThumbnail", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to set the thumbnail of a custom emoji sticker set. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail}
     * @param name Sticker set name
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setCustomEmojiStickerSetThumbnail( name: string,
    other?: Partial<ApiParameters<"setCustomEmojiStickerSetThumbnail", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to delete a sticker set that was created by the bot. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#deletestickerset}
     * @param name Sticker set name
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    deleteStickerSet( name: string,
    other?: Partial<ApiParameters<"deleteStickerSet", A>>, signal?: AbortSignal): true;
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
    answerInlineQuery( inline_query_id: string, results: InlineQueryResult[],
    other?: Partial<ApiParameters<"answerInlineQuery", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to set the result of an interaction with a {@link https://core.telegram.org/bots/webapps | Web App} and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a {@link sentwebappMessage | SentWebAppMessage} object is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answerwebappquery}
     * @param web_app_query_id Unique identifier for the query to be answered
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    answerWebAppQuery( web_app_query_id: string, result: InlineQueryResult,
    other?: Partial<ApiParameters<"answerWebAppQuery", A>>, signal?: AbortSignal): SentWebAppMessage;
    /**
     * Stores a message that can be sent by a user of a Mini App. Returns a {@link preparedinlineMessage | PreparedInlineMessage} object.
     *
     * @see {@link https://core.telegram.org/bots/api#savepreparedinlinemessage}
     * @param user_id Unique identifier of the target user that can use the prepared message
     * @param result An object describing the message to be sent
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    savePreparedInlineMessage( user_id: number, result: InlineQueryResult,
    other?: Partial<ApiParameters<"savePreparedInlineMessage", A>>, signal?: AbortSignal): PreparedInlineMessage;
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
    sendInvoice( chat_id: number | string, title: string, description: string, payload: string, currency: string, prices: LabeledPrice[],
    other?: Partial<ApiParameters<"sendInvoice", A>>, signal?: AbortSignal): Message;
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
    createInvoiceLink( title: string, description: string, payload: string, currency: string, prices: LabeledPrice[],
    other?: Partial<ApiParameters<"createInvoiceLink", A>>, signal?: AbortSignal): string;
    /**
     * If you sent an invoice requesting a shipping address and the parameter _is_flexible_ was specified, the Bot API will send an {@link Update | Update} with a _shipping_query_ field to the bot. Use this method to reply to shipping queries. On success, _True_ is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#answershippingquery}
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param ok Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible)
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    answerShippingQuery( shipping_query_id: string, ok: boolean,
    other?: Partial<ApiParameters<"answerShippingQuery", A>>, signal?: AbortSignal): true;
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an {@link Update | Update} with the field _pre_checkout_query_. Use this method to respond to such pre-checkout queries. On success, _True_ is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
     * @param pre_checkout_query_id Unique identifier for the query to be answered
     * @param ok Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    answerPreCheckoutQuery( pre_checkout_query_id: string, ok: boolean,
    other?: Partial<ApiParameters<"answerPreCheckoutQuery", A>>, signal?: AbortSignal): true;
    /**
     * A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a {@link StarAmount | StarAmount} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getmystarbalance}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyStarBalance(
    other?: Partial<ApiParameters<"getMyStarBalance", A>>, signal?: AbortSignal): StarAmount;
    /**
     * Returns the bot's Telegram Star transactions in chronological order. On success, returns a {@link StarTransactions | StarTransactions} object.
     *
     * @see {@link https://core.telegram.org/bots/api#getstartransactions}
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getStarTransactions(
    other?: Partial<ApiParameters<"getStarTransactions", A>>, signal?: AbortSignal): StarTransactions;
    /**
     * Refunds a successful payment in {@link https://t.me/BotNews/90 | Telegram Stars}. Returns _True_ on success.
     *
     * @see {@link https://core.telegram.org/bots/api#refundstarpayment}
     * @param user_id Identifier of the user whose payment will be refunded
     * @param telegram_payment_charge_id Telegram payment identifier
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    refundStarPayment( user_id: number, telegram_payment_charge_id: string,
    other?: Partial<ApiParameters<"refundStarPayment", A>>, signal?: AbortSignal): true;
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
    editUserStarSubscription( user_id: number, telegram_payment_charge_id: string, is_canceled: boolean,
    other?: Partial<ApiParameters<"editUserStarSubscription", A>>, signal?: AbortSignal): true;
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
    setPassportDataErrors( user_id: number, errors: PassportElementError[],
    other?: Partial<ApiParameters<"setPassportDataErrors", A>>, signal?: AbortSignal): true;
    /**
     * Use this method to send a game. On success, the sent {@link Message | Message} is returned.
     *
     * @see {@link https://core.telegram.org/bots/api#sendgame}
     * @param chat_id Unique identifier for the target chat. Games can't be sent to channel direct messages chats and channel chats.
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via {@link https://t.me/botfather | @BotFather}.
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    sendGame( chat_id: number, game_short_name: string,
    other?: Partial<ApiParameters<"sendGame", A>>, signal?: AbortSignal): Message;
    /**
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the {@link Message | Message} is returned, otherwise _True_ is returned. Returns an error, if the new score is not greater than the user's current score in the chat and _force_ is _False_.
     *
     * @see {@link https://core.telegram.org/bots/api#setgamescore}
     * @param user_id User identifier
     * @param score New score, must be non-negative
     * @param other Options object with all optional parameters
     * @param signal Optional `AbortSignal` to cancel the request
     */
    setGameScore( user_id: number, score: number,
    other?: Partial<ApiParameters<"setGameScore", A>>, signal?: AbortSignal): true | Message;
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
    getGameHighScores( user_id: number,
    other?: Partial<ApiParameters<"getGameHighScores", A>>, signal?: AbortSignal): GameHighScore[];
}
