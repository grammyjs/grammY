// deno-lint-ignore-file camelcase
import {
    type BotCommand,
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
    type InputSticker,
    type LabeledPrice,
    type MaskPosition,
    type PassportElementError,
    type ReactionType,
} from "../types.ts";
import {
    type ApiClientOptions,
    createRawApi,
    type Methods,
    type Payload,
    type RawApi,
    type Transformer,
    type TransformerConsumer,
    type WebhookReplyEnvelope,
} from "./client.ts";

/**
 * Helper type to derive remaining properties of a given API method call M,
 * given that some properties X have already been specified.
 */
export type Other<
    R extends RawApi,
    M extends Methods<R>,
    X extends string = never,
> = Omit<Payload<M, R>, X>;
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
 * servers. Confer the `config` property for this.
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
     * Configuration object for the API instance, used as a namespace to
     * separate those API operations that are related to grammY from methods of
     * the Telegram Bot API. Contains advanced options!
     */
    public readonly config: {
        /**
         * Allows to install an API request transformer function. A transformer
         * function has access to every API call before it is being performed.
         * This includes the method as string, the payload as object and the
         * upstream transformer function.
         *
         * _Note that using transformer functions is an advanced feature of
         * grammY that most bots will not need to make use of._
         */
        readonly use: TransformerConsumer<R>;
        /**
         * Provides read access to all currently installed transformers (those
         * that have previously been passed to `config.use`).
         *
         * _Note that using transformer functions is an advanced feature of
         * grammY that most bots will not need to make use of._
         */
        readonly installedTransformers: () => Transformer<R>[];
    };

    /**
     * Constructs a new instance of `Api`. It is independent from all other
     * instances of this class. For example, this lets you install a custom set
     * if transformers.
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
        const { raw, use, installedTransformers } = createRawApi<R>(
            token,
            options,
            webhookReplyEnvelope,
        );
        this.raw = raw;
        this.config = {
            use,
            installedTransformers: () => installedTransformers.slice(),
        };
    }

    /**
     * Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.
     *
     * Notes
     * 1. This method will not work if an outgoing webhook is set up.
     * 2. In order to avoid getting duplicate updates, recalculate offset after each server response.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getupdates
     */
    getUpdates(other?: Other<R, "getUpdates">, signal?: AbortSignal) {
        return this.raw.getUpdates({ ...other }, signal);
    }

    /**
     * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts. Returns True on success.
     *
     * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.
     *
     * Notes
     * 1. You will not be able to receive updates using getUpdates for as long as an outgoing webhook is set up.
     * 2. To use a self-signed certificate, you need to upload your public key certificate using certificate parameter. Please upload as InputFile, sending a String will not work.
     * 3. Ports currently supported for Webhooks: 443, 80, 88, 8443.
     *
     * If you're having any trouble setting up webhooks, please check out this amazing guide to webhooks.
     *
     * @param url HTTPS url to send updates to. Use an empty string to remove webhook integration
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setwebhook
     */
    setWebhook(
        url: string,
        other?: Other<R, "setWebhook", "url">,
        signal?: AbortSignal,
    ) {
        return this.raw.setWebhook({ url, ...other }, signal);
    }

    /**
     * Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletewebhook
     */
    deleteWebhook(other?: Other<R, "deleteWebhook">, signal?: AbortSignal) {
        return this.raw.deleteWebhook({ ...other }, signal);
    }

    /**
     * Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getwebhookinfo
     */
    getWebhookInfo(signal?: AbortSignal) {
        return this.raw.getWebhookInfo(signal);
    }

    /**
     * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getme
     */
    getMe(signal?: AbortSignal) {
        return this.raw.getMe(signal);
    }

    /**
     * Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#logout
     */
    logOut(signal?: AbortSignal) {
        return this.raw.logOut(signal);
    }

    /**
     * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#close
     */
    close(signal?: AbortSignal) {
        return this.raw.close(signal);
    }

    /**
     * Use this method to send text messages. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendmessage
     */
    sendMessage(
        chat_id: number | string,
        text: string,
        other?: Other<R, "sendMessage", "chat_id" | "text">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendMessage({ chat_id, text, ...other }, signal);
    }

    /**
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     * @param message_id Message identifier in the chat specified in from_chat_id
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#forwardmessage
     */
    forwardMessage(
        chat_id: number | string,
        from_chat_id: number | string,
        message_id: number,
        other?: Other<
            R,
            "forwardMessage",
            "chat_id" | "from_chat_id" | "message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.forwardMessage(
            { chat_id, from_chat_id, message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of MessageId of the sent messages is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param from_chat_id Unique identifier for the chat where the original messages were sent (or channel username in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#forwardmessages
     */
    forwardMessages(
        chat_id: number | string,
        from_chat_id: number | string,
        message_ids: number[],
        other?: Other<
            R,
            "forwardMessages",
            "chat_id" | "from_chat_id" | "message_ids"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.forwardMessages({
            chat_id,
            from_chat_id,
            message_ids,
            ...other,
        }, signal);
    }

    /**
     * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     * @param message_id Message identifier in the chat specified in from_chat_id
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#copymessage
     */
    copyMessage(
        chat_id: number | string,
        from_chat_id: number | string,
        message_id: number,
        other?: Other<
            R,
            "copyMessage",
            "chat_id" | "from_chat_id" | "message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.copyMessage(
            { chat_id, from_chat_id, message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of MessageId of the sent messages is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param from_chat_id Unique identifier for the chat where the original messages were sent (or channel username in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#copymessages
     */
    copyMessages(
        chat_id: number | string,
        from_chat_id: number | string,
        message_ids: number[],
        other?: Other<
            R,
            "copyMessages",
            "chat_id" | "from_chat_id" | "message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.copyMessages({
            chat_id,
            from_chat_id,
            message_ids,
            ...other,
        }, signal);
    }

    /**
     * Use this method to send photos. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendphoto
     */
    sendPhoto(
        chat_id: number | string,
        photo: InputFile | string,
        other?: Other<R, "sendPhoto", "chat_id" | "photo">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendPhoto({ chat_id, photo, ...other }, signal);
    }

    /**
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     *
     * For sending voice messages, use the sendVoice method instead.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendaudio
     */
    sendAudio(
        chat_id: number | string,
        audio: InputFile | string,
        other?: Other<R, "sendAudio", "chat_id" | "audio">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendAudio({ chat_id, audio, ...other }, signal);
    }

    /**
     * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#senddocument
     */
    sendDocument(
        chat_id: number | string,
        document: InputFile | string,
        other?: Other<R, "sendDocument", "chat_id" | "document">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendDocument({ chat_id, document, ...other }, signal);
    }

    /**
     * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvideo
     */
    sendVideo(
        chat_id: number | string,
        video: InputFile | string,
        other?: Other<R, "sendVideo", "chat_id" | "video">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendVideo({ chat_id, video, ...other }, signal);
    }

    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendanimation
     */
    sendAnimation(
        chat_id: number | string,
        animation: InputFile | string,
        other?: Other<R, "sendAnimation", "chat_id" | "animation">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendAnimation({ chat_id, animation, ...other }, signal);
    }

    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvoice
     */
    sendVoice(
        chat_id: number | string,
        voice: InputFile | string,
        other?: Other<R, "sendVoice", "chat_id" | "voice">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendVoice({ chat_id, voice, ...other }, signal);
    }

    /**
     * Use this method to send video messages. On success, the sent Message is returned.
     * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param video_note Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data.. Sending video notes by a URL is currently unsupported
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvideonote
     */
    sendVideoNote(
        chat_id: number | string,
        video_note: InputFile | string,
        other?: Other<R, "sendVideoNote", "chat_id" | "video_note">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendVideoNote(
            { chat_id, video_note, ...other },
            signal,
        );
    }

    /**
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of Messages that were sent is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param media An array describing messages to be sent, must include 2-10 items
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendmediagroup
     */
    sendMediaGroup(
        chat_id: number | string,
        media: ReadonlyArray<
            | InputMediaAudio
            | InputMediaDocument
            | InputMediaPhoto
            | InputMediaVideo
        >,
        other?: Other<R, "sendMediaGroup", "chat_id" | "media">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendMediaGroup({ chat_id, media, ...other }, signal);
    }

    /**
     * Use this method to send point on the map. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendlocation
     */
    sendLocation(
        chat_id: number | string,
        latitude: number,
        longitude: number,
        other?: Other<R, "sendLocation", "chat_id" | "latitude" | "longitude">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendLocation(
            { chat_id, latitude, longitude, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message to edit
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagelivelocation
     */
    editMessageLiveLocation(
        chat_id: number | string,
        message_id: number,
        latitude: number,
        longitude: number,
        other?: Other<
            R,
            "editMessageLiveLocation",
            | "chat_id"
            | "message_id"
            | "inline_message_id"
            | "latitude"
            | "longitude"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageLiveLocation(
            { chat_id, message_id, latitude, longitude, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit live location inline messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param inline_message_id Identifier of the inline message
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagelivelocation
     */
    editMessageLiveLocationInline(
        inline_message_id: string,
        latitude: number,
        longitude: number,
        other?: Other<
            R,
            "editMessageLiveLocation",
            | "chat_id"
            | "message_id"
            | "inline_message_id"
            | "latitude"
            | "longitude"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageLiveLocation(
            { inline_message_id, latitude, longitude, ...other },
            signal,
        );
    }

    /**
     * Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message with live location to stop
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#stopmessagelivelocation
     */
    stopMessageLiveLocation(
        chat_id: number | string,
        message_id: number,
        other?: Other<
            R,
            "stopMessageLiveLocation",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.stopMessageLiveLocation(
            { chat_id, message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param inline_message_id Identifier of the inline message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#stopmessagelivelocation
     */
    stopMessageLiveLocationInline(
        inline_message_id: string,
        other?: Other<
            R,
            "stopMessageLiveLocation",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.stopMessageLiveLocation(
            { inline_message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to send paid media to channel chats. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param star_count The number of Telegram Stars that must be paid to buy access to the media
     * @param media An array describing the media to be sent; up to 10 items
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendpaidmedia
     */
    sendPaidMedia(
        chat_id: number | string,
        star_count: number,
        media: InputPaidMedia[],
        other?: Other<R, "sendPaidMedia", "chat_id" | "star_count" | "media">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendPaidMedia(
            { chat_id, star_count, media, ...other },
            signal,
        );
    }

    /**
     * Use this method to send information about a venue. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param latitude Latitude of the venue
     * @param longitude Longitude of the venue
     * @param title Name of the venue
     * @param address Address of the venue
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvenue
     */
    sendVenue(
        chat_id: number | string,
        latitude: number,
        longitude: number,
        title: string,
        address: string,
        other?: Other<
            R,
            "sendVenue",
            "chat_id" | "latitude" | "longitude" | "title" | "address"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.sendVenue(
            { chat_id, latitude, longitude, title, address, ...other },
            signal,
        );
    }

    /**
     * Use this method to send phone contacts. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param phone_number Contact's phone number
     * @param first_name Contact's first name
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendcontact
     */
    sendContact(
        chat_id: number | string,
        phone_number: string,
        first_name: string,
        other?: Other<
            R,
            "sendContact",
            "chat_id" | "phone_number" | "first_name"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.sendContact(
            { chat_id, phone_number, first_name, ...other },
            signal,
        );
    }

    /**
     * Use this method to send a native poll. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param question Poll question, 1-300 characters
     * @param options A list of answer options, 2-10 strings 1-100 characters each
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendpoll
     */
    sendPoll(
        chat_id: number | string,
        question: string,
        options: InputPollOption[],
        other?: Other<R, "sendPoll", "chat_id" | "question" | "options">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendPoll(
            { chat_id, question, options, ...other },
            signal,
        );
    }

    /**
     * Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param emoji Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, “🏀”, “⚽”, or “🎰”. Dice can have values 1-6 for “🎲” and “🎯”, values 1-5 for “🏀” and “⚽”, and values 1-64 for “🎰”. Defaults to “🎲”
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#senddice
     */
    sendDice(
        chat_id: number | string,
        emoji: string,
        other?: Other<R, "sendDice", "chat_id" | "emoji">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendDice({ chat_id, emoji, ...other }, signal);
    }

    /**
     * Use this method to change the chosen reactions on a message. Service messages can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. In albums, bots must react to the first message. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the target message
     * @param reaction A list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#senddice
     */
    setMessageReaction(
        chat_id: number | string,
        message_id: number,
        reaction: ReactionType[],
        other?: Other<
            R,
            "setMessageReaction",
            "chat_id" | "message_id" | "reaction"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.setMessageReaction({
            chat_id,
            message_id,
            reaction,
            ...other,
        }, signal);
    }

    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
     *
     * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
     *
     * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendchataction
     */
    sendChatAction(
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
        other?: Other<R, "sendChatAction", "chat_id" | "action">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendChatAction({ chat_id, action, ...other }, signal);
    }

    /**
     * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getuserprofilephotos
     */
    getUserProfilePhotos(
        user_id: number,
        other?: Other<R, "getUserProfilePhotos", "user_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.getUserProfilePhotos({ user_id, ...other }, signal);
    }

    /**
     * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.
     *
     * @param chat_id Unique identifier for the chat or username of the channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getuserchatboosts
     */
    getUserChatBoosts(
        chat_id: number | string,
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.getUserChatBoosts({ chat_id, user_id }, signal);
    }

    /**
     * Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.
     *
     * @param business_connection_id Unique identifier of the business connection
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getbusinessconnection
     */
    getBusinessConnection(
        business_connection_id: string,
        signal?: AbortSignal,
    ) {
        return this.raw.getBusinessConnection(
            { business_connection_id },
            signal,
        );
    }

    /**
     * Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
     *
     * Note: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     *
     * @param file_id File identifier to get info about
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getfile
     */
    getFile(file_id: string, signal?: AbortSignal) {
        return this.raw.getFile({ file_id }, signal);
    }

    /** @deprecated Use `banChatMember` instead. */
    kickChatMember(...args: Parameters<Api["banChatMember"]>) {
        return this.banChatMember(...args);
    }

    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatmember
     */
    banChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Other<R, "banChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.banChatMember({ chat_id, user_id, ...other }, signal);
    }

    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     *
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format @username)
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unbanchatmember
     */
    unbanChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Other<R, "unbanChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.unbanChatMember({ chat_id, user_id, ...other }, signal);
    }

    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param user_id Unique identifier of the target user
     * @param permissions An object for new user permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#restrictchatmember
     */
    restrictChatMember(
        chat_id: number | string,
        user_id: number,
        permissions: ChatPermissions,
        other?: Other<
            R,
            "restrictChatMember",
            "chat_id" | "user_id" | "permissions"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.restrictChatMember(
            { chat_id, user_id, permissions, ...other },
            signal,
        );
    }

    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#promotechatmember
     */
    promoteChatMember(
        chat_id: number | string,
        user_id: number,
        other?: Other<R, "promoteChatMember", "chat_id" | "user_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.promoteChatMember(
            { chat_id, user_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param user_id Unique identifier of the target user
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatadministratorcustomtitle
     */
    setChatAdministratorCustomTitle(
        chat_id: number | string,
        user_id: number,
        custom_title: string,
        signal?: AbortSignal,
    ) {
        return this.raw.setChatAdministratorCustomTitle(
            { chat_id, user_id, custom_title },
            signal,
        );
    }

    /**
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatsenderchat
     */
    banChatSenderChat(
        chat_id: number | string,
        sender_chat_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.banChatSenderChat({ chat_id, sender_chat_id }, signal);
    }

    /**
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unbanchatsenderchat
     */
    unbanChatSenderChat(
        chat_id: number | string,
        sender_chat_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.unbanChatSenderChat(
            { chat_id, sender_chat_id },
            signal,
        );
    }

    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param permissions New default chat permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatpermissions
     */
    setChatPermissions(
        chat_id: number | string,
        permissions: ChatPermissions,
        other?: Other<R, "setChatPermissions", "chat_id" | "permissions">,
        signal?: AbortSignal,
    ) {
        return this.raw.setChatPermissions(
            { chat_id, permissions, ...other },
            signal,
        );
    }

    /**
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
     *
     * Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink or by calling the getChat method. If your bot needs to generate a new primary invite link replacing its previous one, use exportChatInviteLink again.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#exportchatinvitelink
     */
    exportChatInviteLink(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.exportChatInviteLink({ chat_id }, signal);
    }

    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createchatinvitelink
     */
    createChatInviteLink(
        chat_id: number | string,
        other?: Other<R, "createChatInviteLink", "chat_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.createChatInviteLink({ chat_id, ...other }, signal);
    }

    /**
     *  Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param invite_link The invite link to edit
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editchatinvitelink
     */
    editChatInviteLink(
        chat_id: number | string,
        invite_link: string,
        other?: Other<R, "editChatInviteLink", "chat_id" | "invite_link">,
        signal?: AbortSignal,
    ) {
        return this.raw.editChatInviteLink(
            { chat_id, invite_link, ...other },
            signal,
        );
    }

    /**
     *  Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
     *
     * @param chat_id Unique identifier of the target chat or username of the target channel (in the format @channelusername)
     * @param invite_link The invite link to revoke
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#revokechatinvitelink
     */
    revokeChatInviteLink(
        chat_id: number | string,
        invite_link: string,
        signal?: AbortSignal,
    ) {
        return this.raw.revokeChatInviteLink({ chat_id, invite_link }, signal);
    }

    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#approvechatjoinrequest
     */
    approveChatJoinRequest(
        chat_id: number | string,
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.approveChatJoinRequest({ chat_id, user_id }, signal);
    }

    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#declinechatjoinrequest
     */
    declineChatJoinRequest(
        chat_id: number | string,
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.declineChatJoinRequest({ chat_id, user_id }, signal);
    }

    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param photo New chat photo, uploaded using multipart/form-data
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatphoto
     */
    setChatPhoto(
        chat_id: number | string,
        photo: InputFile,
        signal?: AbortSignal,
    ) {
        return this.raw.setChatPhoto({ chat_id, photo }, signal);
    }

    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletechatphoto
     */
    deleteChatPhoto(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.deleteChatPhoto({ chat_id }, signal);
    }

    /**
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param title New chat title, 1-255 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchattitle
     */
    setChatTitle(
        chat_id: number | string,
        title: string,
        signal?: AbortSignal,
    ) {
        return this.raw.setChatTitle({ chat_id, title }, signal);
    }

    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param description New chat description, 0-255 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatdescription
     */
    setChatDescription(
        chat_id: number | string,
        description?: string,
        signal?: AbortSignal,
    ) {
        return this.raw.setChatDescription({ chat_id, description }, signal);
    }

    /**
     * Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of a message to pin
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#pinchatmessage
     */
    pinChatMessage(
        chat_id: number | string,
        message_id: number,
        other?: Other<R, "pinChatMessage", "chat_id" | "message_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.pinChatMessage(
            { chat_id, message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to remove a message from the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of a message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinchatmessage
     */
    unpinChatMessage(
        chat_id: number | string,
        message_id?: number,
        signal?: AbortSignal,
    ) {
        return this.raw.unpinChatMessage({ chat_id, message_id }, signal);
    }

    /**
     * Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallchatmessages
     */
    unpinAllChatMessages(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.unpinAllChatMessages({ chat_id }, signal);
    }

    /**
     * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#leavechat
     */
    leaveChat(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.leaveChat({ chat_id }, signal);
    }

    /**
     * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchat
     */
    getChat(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.getChat({ chat_id }, signal);
    }

    /**
     * Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of ChatMember objects.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatadministrators
     */
    getChatAdministrators(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.getChatAdministrators({ chat_id }, signal);
    }

    /** @deprecated Use `getChatMemberCount` instead. */
    getChatMembersCount(...args: Parameters<Api["getChatMemberCount"]>) {
        return this.getChatMemberCount(...args);
    }

    /**
     * Use this method to get the number of members in a chat. Returns Int on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmembercount
     */
    getChatMemberCount(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.getChatMemberCount({ chat_id }, signal);
    }

    /**
     * Use this method to get information about a member of a chat. The method is guaranteed to work only if the bot is an administrator in the chat. Returns a ChatMember object on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmember
     */
    getChatMember(
        chat_id: number | string,
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.getChatMember({ chat_id, user_id }, signal);
    }

    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatstickerset
     */
    setChatStickerSet(
        chat_id: number | string,
        sticker_set_name: string,
        signal?: AbortSignal,
    ) {
        return this.raw.setChatStickerSet(
            { chat_id, sticker_set_name },
            signal,
        );
    }

    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletechatstickerset
     */
    deleteChatStickerSet(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.deleteChatStickerSet({ chat_id }, signal);
    }

    /**
     * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of Sticker objects.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getforumtopiciconstickers
     */
    getForumTopicIconStickers(signal?: AbortSignal) {
        return this.raw.getForumTopicIconStickers(signal);
    }

    /**
     * Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns information about the created topic as a ForumTopic object.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param name Topic name, 1-128 characters
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createforumtopic
     */
    createForumTopic(
        chat_id: number | string,
        name: string,
        other?: Other<R, "createForumTopic", "chat_id" | "name">,
        signal?: AbortSignal,
    ) {
        return this.raw.createForumTopic({ chat_id, name, ...other }, signal);
    }

    /**
     * Use this method to edit name and icon of a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editforumtopic
     */
    editForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        other?: Other<R, "editForumTopic", "chat_id" | "message_thread_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.editForumTopic(
            { chat_id, message_thread_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#closeforumtopic
     */
    closeForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.closeForumTopic({ chat_id, message_thread_id }, signal);
    }

    /**
     * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#reopenforumtopic
     */
    reopenForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.reopenForumTopic(
            { chat_id, message_thread_id },
            signal,
        );
    }

    /**
     * Use this method to delete a forum topic along with all its messages in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deleteforumtopic
     */
    deleteForumTopic(
        chat_id: number | string,
        message_thread_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.deleteForumTopic(
            { chat_id, message_thread_id },
            signal,
        );
    }

    /**
     * Use this method to clear the list of pinned messages in a forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param message_thread_id Unique identifier for the target message thread of the forum topic
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallforumtopicmessages
     */
    unpinAllForumTopicMessages(
        chat_id: number | string,
        message_thread_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.unpinAllForumTopicMessages(
            { chat_id, message_thread_id },
            signal,
        );
    }

    /**
     * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have can_manage_topics administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param name New topic name, 1-128 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editgeneralforumtopic
     */
    editGeneralForumTopic(
        chat_id: number | string,
        name: string,
        signal?: AbortSignal,
    ) {
        return this.raw.editGeneralForumTopic({ chat_id, name }, signal);
    }

    /**
     * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#closegeneralforumtopic
     */
    closeGeneralForumTopic(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.closeGeneralForumTopic({ chat_id }, signal);
    }

    /**
     * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.     *
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#reopengeneralforumtopic
     */
    reopenGeneralForumTopic(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.reopenGeneralForumTopic({ chat_id }, signal);
    }

    /**
     * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#hidegeneralforumtopic
     */
    hideGeneralForumTopic(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.hideGeneralForumTopic({ chat_id }, signal);
    }

    /**
     * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unhidegeneralforumtopic
     */
    unhideGeneralForumTopic(chat_id: number | string, signal?: AbortSignal) {
        return this.raw.unhideGeneralForumTopic({ chat_id }, signal);
    }

    /**
     * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages
     */
    unpinAllGeneralForumTopicMessages(
        chat_id: number | string,
        signal?: AbortSignal,
    ) {
        return this.raw.unpinAllGeneralForumTopicMessages({ chat_id }, signal);
    }

    /**
     * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     *
     * Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via @BotFather and accept the terms. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
     *
     * @param callback_query_id Unique identifier for the query to be answered
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answercallbackquery
     */
    answerCallbackQuery(
        callback_query_id: string,
        other?: Other<R, "answerCallbackQuery", "callback_query_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.answerCallbackQuery(
            { callback_query_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to change the bot's name. Returns True on success.
     *
     * @param name New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmyname
     */
    setMyName(
        name: string,
        other?: Other<R, "setMyName", "name">,
        signal?: AbortSignal,
    ) {
        return this.raw.setMyName({ name, ...other }, signal);
    }

    /**
     * Use this method to get the current bot name for the given user language. Returns BotName on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getmyname
     */
    getMyName(other?: Other<R, "getMyName">, signal?: AbortSignal) {
        return this.raw.getMyName(other ?? {}, signal);
    }

    /**
     * Use this method to change the list of the bot's commands. See https://core.telegram.org/bots/features#commands for more details about bot commands. Returns True on success.
     *
     * @param commands A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmycommands
     */
    setMyCommands(
        commands: readonly BotCommand[],
        other?: Other<R, "setMyCommands", "commands">,
        signal?: AbortSignal,
    ) {
        return this.raw.setMyCommands({ commands, ...other }, signal);
    }

    /**
     * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletemycommands
     */
    deleteMyCommands(
        other?: Other<R, "deleteMyCommands">,
        signal?: AbortSignal,
    ) {
        return this.raw.deleteMyCommands({ ...other }, signal);
    }

    /**
     * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getmycommands
     */
    getMyCommands(other?: Other<R, "getMyCommands">, signal?: AbortSignal) {
        return this.raw.getMyCommands({ ...other }, signal);
    }

    /**
     * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success.
     *
     * @param description New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.
     * @param other Optional remaining paramters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmydescription
     */
    setMyDescription(
        description: string,
        other?: Other<R, "setMyDescription", "description">,
        signal?: AbortSignal,
    ) {
        return this.raw.setMyDescription({ description, ...other }, signal);
    }

    /**
     * Use this method to get the current bot description for the given user language. Returns BotDescription on success.
     *
     * @param other Optional remaining paramters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getmydescription
     */
    getMyDescription(
        other?: Other<R, "getMyDescription">,
        signal?: AbortSignal,
    ) {
        return this.raw.getMyDescription({ ...other }, signal);
    }

    /**
     * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success.
     *
     * @param short_description New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.
     * @param other Optional remaining paramters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmyshortdescription
     */
    setMyShortDescription(
        short_description: string,
        other?: Other<R, "setMyShortDescription", "short_description">,
        signal?: AbortSignal,
    ) {
        return this.raw.setMyShortDescription(
            { short_description, ...other },
            signal,
        );
    }

    /**
     * Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success.
     *
     * @param other Optional remaining paramters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getmyshortdescription
     */
    getMyShortDescription(
        other?: Other<R, "getMyShortDescription">,
        signal?: AbortSignal,
    ) {
        return this.raw.getMyShortDescription({ ...other }, signal);
    }

    /**
     * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatmenubutton
     */
    setChatMenuButton(
        other?: Other<R, "setChatMenuButton">,
        signal?: AbortSignal,
    ) {
        return this.raw.setChatMenuButton({ ...other }, signal);
    }

    /**
     * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmenubutton
     */
    getChatMenuButton(
        other?: Other<R, "getChatMenuButton">,
        signal?: AbortSignal,
    ) {
        return this.raw.getChatMenuButton({ ...other }, signal);
    }

    /**
     * Use this method to the change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are are free to modify the list before adding the bot. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmydefaultadministratorrights
     */
    setMyDefaultAdministratorRights(
        other?: Other<R, "setMyDefaultAdministratorRights">,
        signal?: AbortSignal,
    ) {
        return this.raw.setMyDefaultAdministratorRights({ ...other }, signal);
    }

    /**
     * Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getmydefaultadministratorrights
     */
    getMyDefaultAdministratorRights(
        other?: Other<R, "getMyDefaultAdministratorRights">,
        signal?: AbortSignal,
    ) {
        return this.raw.getMyDefaultAdministratorRights({ ...other }, signal);
    }

    /**
     * Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message to edit
     * @param text New text of the message, 1-4096 characters after entities parsing
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagetext
     */
    editMessageText(
        chat_id: number | string,
        message_id: number,
        text: string,
        other?: Other<
            R,
            "editMessageText",
            "chat_id" | "message_id" | "inline_message_id" | "text"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageText(
            { chat_id, message_id, text, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit text and game inline messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param inline_message_id Identifier of the inline message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagetext
     */
    editMessageTextInline(
        inline_message_id: string,
        text: string,
        other?: Other<
            R,
            "editMessageText",
            "chat_id" | "message_id" | "inline_message_id" | "text"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageText(
            { inline_message_id, text, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message to edit
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagecaption
     */
    editMessageCaption(
        chat_id: number | string,
        message_id: number,
        other?: Other<
            R,
            "editMessageCaption",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageCaption(
            { chat_id, message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit captions of inline messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param inline_message_id Identifier of the inline message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagecaption
     */
    editMessageCaptionInline(
        inline_message_id: string,
        other?: Other<
            R,
            "editMessageCaption",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageCaption(
            { inline_message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message to edit
     * @param media An object for a new media content of the message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagemedia
     */
    editMessageMedia(
        chat_id: number | string,
        message_id: number,
        media: InputMedia,
        other?: Other<
            R,
            "editMessageMedia",
            "chat_id" | "message_id" | "inline_message_id" | "media"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageMedia(
            { chat_id, message_id, media, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit animation, audio, document, photo, or video inline messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param inline_message_id Identifier of the inline message
     * @param media An object for a new media content of the message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagemedia
     */
    editMessageMediaInline(
        inline_message_id: string,
        media: InputMedia,
        other?: Other<
            R,
            "editMessageMedia",
            "chat_id" | "message_id" | "inline_message_id" | "media"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageMedia(
            { inline_message_id, media, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message to edit
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagereplymarkup
     */
    editMessageReplyMarkup(
        chat_id: number | string,
        message_id: number,
        other?: Other<
            R,
            "editMessageReplyMarkup",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageReplyMarkup(
            { chat_id, message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to edit only the reply markup of inline messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param inline_message_id Identifier of the inline message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagereplymarkup
     */
    editMessageReplyMarkupInline(
        inline_message_id: string,
        other?: Other<
            R,
            "editMessageReplyMarkup",
            "chat_id" | "message_id" | "inline_message_id"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.editMessageReplyMarkup(
            { inline_message_id, ...other },
            signal,
        );
    }

    /**
     * Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the original message with the poll
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#stoppoll
     */
    stopPoll(
        chat_id: number | string,
        message_id: number,
        other?: Other<R, "stopPoll", "chat_id" | "message_id">,
        signal?: AbortSignal,
    ) {
        return this.raw.stopPoll({ chat_id, message_id, ...other }, signal);
    }

    /**
     * Use this method to delete a message, including service messages, with the following limitations:
     * - A message can only be deleted if it was sent less than 48 hours ago.
     * - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
     * - Bots can delete outgoing messages in private chats, groups, and supergroups.
     * - Bots can delete incoming messages in private chats.
     * - Bots granted can_post_messages permissions can delete outgoing messages in channels.
     * - If the bot is an administrator of a group, it can delete any message there.
     * - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
     * Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message to delete
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletemessage
     */
    deleteMessage(
        chat_id: number | string,
        message_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.deleteMessage({ chat_id, message_id }, signal);
    }

    /**
     * Use this method to delete multiple messages simultaneously. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletemessages
     */
    deleteMessages(
        chat_id: number | string,
        message_ids: number[],
        signal?: AbortSignal,
    ) {
        return this.raw.deleteMessages({ chat_id, message_ids }, signal);
    }

    /**
     * Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. Video and animated stickers can't be sent via an HTTP URL.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendsticker
     */
    sendSticker(
        chat_id: number | string,
        sticker: InputFile | string,
        other?: Other<R, "sendSticker", "chat_id" | "sticker">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendSticker({ chat_id, sticker, ...other }, signal);
    }

    /**
     * Use this method to get a sticker set. On success, a StickerSet object is returned.
     *
     * @param name Name of the sticker set
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getstickerset
     */
    getStickerSet(name: string, signal?: AbortSignal) {
        return this.raw.getStickerSet({ name }, signal);
    }

    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
     *
     * @param custom_emoji_ids A list of custom emoji identifiers
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getcustomemojistickers
     */
    getCustomEmojiStickers(custom_emoji_ids: string[], signal?: AbortSignal) {
        return this.raw.getCustomEmojiStickers({ custom_emoji_ids }, signal);
    }

    /**
     * Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success.
     *
     * @param user_id User identifier of sticker file owner
     * @param sticker_format Format of the sticker, must be one of “static”, “animated”, “video”
     * @param sticker A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#uploadstickerfile
     */
    uploadStickerFile(
        user_id: number,
        sticker_format: "static" | "animated" | "video",
        sticker: InputFile,
        signal?: AbortSignal,
    ) {
        return this.raw.uploadStickerFile(
            { user_id, sticker_format, sticker },
            signal,
        );
    }

    /**
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success.
     *
     * @param user_id User identifier of created sticker set owner
     * @param name Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `_by_<bot_username>`. `<bot_username>` is case insensitive. 1-64 characters.
     * @param title Sticker set title, 1-64 characters
     * @param stickers A list of 1-50 initial stickers to be added to the sticker set
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createnewstickerset
     */
    createNewStickerSet(
        user_id: number,
        name: string,
        title: string,
        stickers: InputSticker[],
        other?: Other<
            R,
            "createNewStickerSet",
            | "user_id"
            | "name"
            | "title"
            | "sticker_format"
            | "stickers"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.createNewStickerSet(
            { user_id, name, title, stickers, ...other },
            signal,
        );
    }

    /**
     * Use this method to add a new sticker to a set created by the bot. The format of the added sticker must match the format of the other stickers in the set. Emoji sticker sets can have up to 200 stickers. Animated and video sticker sets can have up to 50 stickers. Static sticker sets can have up to 120 stickers. Returns True on success.
     *
     * @param user_id User identifier of sticker set owner
     * @param name Sticker set name
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#addstickertoset
     */
    addStickerToSet(
        user_id: number,
        name: string,
        sticker: InputSticker,
        signal?: AbortSignal,
    ) {
        return this.raw.addStickerToSet(
            { user_id, name, sticker },
            signal,
        );
    }

    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.
     *
     * @param sticker File identifier of the sticker
     * @param position New sticker position in the set, zero-based
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setstickerpositioninset
     */
    setStickerPositionInSet(
        sticker: string,
        position: number,
        signal?: AbortSignal,
    ) {
        return this.raw.setStickerPositionInSet({ sticker, position }, signal);
    }

    /**
     * Use this method to delete a sticker from a set created by the bot. Returns True on success.
     *
     * @param sticker File identifier of the sticker
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletestickerfromset
     */
    deleteStickerFromSet(sticker: string, signal?: AbortSignal) {
        return this.raw.deleteStickerFromSet({ sticker }, signal);
    }

    /**
     * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success.
     *
     * @param user_id User identifier of the sticker set owner
     * @param name Sticker set name
     * @param old_sticker File identifier of the replaced sticker
     * @param sticker An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.:x
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#replacestickerinset
     */
    replaceStickerInSet(
        user_id: number,
        name: string,
        old_sticker: string,
        sticker: InputSticker,
        signal?: AbortSignal,
    ) {
        return this.raw.replaceStickerInSet(
            { user_id, name, old_sticker, sticker },
            signal,
        );
    }

    /**
     * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
     *
     * @param sticker File identifier of the sticker
     * @param emoji_list A list of 1-20 emoji associated with the sticker
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setstickeremojilist
     */
    setStickerEmojiList(
        sticker: string,
        emoji_list: string[],
        signal?: AbortSignal,
    ) {
        return this.raw.setStickerEmojiList({ sticker, emoji_list }, signal);
    }

    /**
     * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
     *
     * @param sticker File identifier of the sticker
     * @param keywords A list of 0-20 search keywords for the sticker with total length of up to 64 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setstickerkeywords
     */
    setStickerKeywords(
        sticker: string,
        keywords: string[],
        signal?: AbortSignal,
    ) {
        return this.raw.setStickerKeywords({ sticker, keywords }, signal);
    }

    /**
     * Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success.
     *
     * @param sticker File identifier of the sticker
     * @param mask_position An object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setstickermaskposition
     */
    setStickerMaskPosition(
        sticker: string,
        mask_position?: MaskPosition,
        signal?: AbortSignal,
    ) {
        return this.raw.setStickerMaskPosition(
            { sticker, mask_position },
            signal,
        );
    }

    /**
     * Use this method to set the title of a created sticker set. Returns True on success.
     *
     * @param name Sticker set name
     * @param title Sticker set title, 1-64 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setstickersettitle
     */
    setStickerSetTitle(name: string, title: string, signal?: AbortSignal) {
        return this.raw.setStickerSetTitle({ name, title }, signal);
    }

    /**
     * Use this method to delete a sticker set that was created by the bot. Returns True on success.
     *
     * @param name Sticker set name
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletestickerset
     */
    deleteStickerSet(name: string, signal?: AbortSignal) {
        return this.raw.deleteStickerSet({ name }, signal);
    }

    /**
     * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success.
     *
     * @param name Sticker set name
     * @param user_id User identifier of the sticker set owner
     * @param thumbnail A .WEBP or .PNG image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a .TGS animation with a thumbnail up to 32 kilobytes in size (see https://core.telegram.org/stickers#animated-sticker-requirements for animated sticker technical requirements), or a WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-sticker-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files ». Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail.
     * @param format Format of the thumbnail, must be one of “static” for a .WEBP or .PNG image, “animated” for a .TGS animation, or “video” for a WEBM video
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setstickersetthumbnail
     */
    setStickerSetThumbnail(
        name: string,
        user_id: number,
        thumbnail: InputFile | string | undefined,
        format: "static" | "animated" | "video",
        signal?: AbortSignal,
    ) {
        return this.raw.setStickerSetThumbnail(
            { name, user_id, thumbnail, format },
            signal,
        );
    }

    /**
     * Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success.
     *
     * @param name Sticker set name
     * @param custom_emoji_id Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail
     */
    setCustomEmojiStickerSetThumbnail(
        name: string,
        custom_emoji_id: string,
        signal?: AbortSignal,
    ) {
        return this.raw.setCustomEmojiStickerSetThumbnail({
            name,
            custom_emoji_id,
        }, signal);
    }

    /**
     * Use this method to send answers to an inline query. On success, True is returned.
     * No more than 50 results per query are allowed.
     *
     * Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.
     *
     * @param inline_query_id Unique identifier for the answered query
     * @param results An array of results for the inline query
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answerinlinequery
     */
    answerInlineQuery(
        inline_query_id: string,
        results: readonly InlineQueryResult[],
        other?: Other<R, "answerInlineQuery", "inline_query_id" | "results">,
        signal?: AbortSignal,
    ) {
        return this.raw.answerInlineQuery(
            { inline_query_id, results, ...other },
            signal,
        );
    }

    /**
     * Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.
     *
     * @param web_app_query_id Unique identifier for the query to be answered
     * @param result An object describing the message to be sent
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answerwebappquery
     */
    answerWebAppQuery(
        web_app_query_id: string,
        result: InlineQueryResult,
        signal?: AbortSignal,
    ) {
        return this.raw.answerWebAppQuery({ web_app_query_id, result }, signal);
    }

    /**
     * Use this method to send invoices. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
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
    sendInvoice(
        chat_id: number | string,
        title: string,
        description: string,
        payload: string,
        currency: string,
        prices: readonly LabeledPrice[],
        other?: Other<
            R,
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
        return this.raw.sendInvoice({
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
     * Use this method to create a link for an invoice. Returns the created invoice link as String on success.
     *
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     * @param provider_token Payment provider token, obtained via BotFather
     * @param currency Three-letter ISO 4217 currency code, see more on currencies
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createinvoicelink
     */
    createInvoiceLink(
        title: string,
        description: string,
        payload: string,
        provider_token: string,
        currency: string,
        prices: LabeledPrice[],
        other?: Other<
            R,
            "createInvoiceLink",
            | "title"
            | "description"
            | "payload"
            | "provider_token"
            | "currency"
            | "prices"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.createInvoiceLink({
            title,
            description,
            payload,
            provider_token,
            currency,
            prices,
            ...other,
        }, signal);
    }

    /**
     * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
     *
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param ok Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answershippingquery
     */
    answerShippingQuery(
        shipping_query_id: string,
        ok: boolean,
        other?: Other<R, "answerShippingQuery", "shipping_query_id" | "ok">,
        signal?: AbortSignal,
    ) {
        return this.raw.answerShippingQuery(
            { shipping_query_id, ok, ...other },
            signal,
        );
    }

    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @param pre_checkout_query_id Unique identifier for the query to be answered
     * @param ok Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answerprecheckoutquery
     */
    answerPreCheckoutQuery(
        pre_checkout_query_id: string,
        ok: boolean,
        other?: Other<
            R,
            "answerPreCheckoutQuery",
            "pre_checkout_query_id" | "ok"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.answerPreCheckoutQuery(
            { pre_checkout_query_id, ok, ...other },
            signal,
        );
    }

    /**
     * Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getstartransactions
     */
    getStarTransactions(
        other?: Other<R, "getStarTransactions">,
        signal?: AbortSignal,
    ) {
        return this.raw.getStarTransactions({ ...other }, signal);
    }

    /**
     * Refunds a successful payment in Telegram Stars.
     *
     * @param user_id Identifier of the user whose payment will be refunded
     * @param telegram_payment_charge_id Telegram payment identifier
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#refundstarpayment
     */
    refundStarPayment(
        user_id: number,
        telegram_payment_charge_id: string,
        signal?: AbortSignal,
    ) {
        return this.raw.refundStarPayment(
            { user_id, telegram_payment_charge_id },
            signal,
        );
    }

    /**
     * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.
     *
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * @param user_id User identifier
     * @param errors An array describing the errors
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setpassportdataerrors
     */
    setPassportDataErrors(
        user_id: number,
        errors: readonly PassportElementError[],
        signal?: AbortSignal,
    ) {
        return this.raw.setPassportDataErrors({ user_id, errors }, signal);
    }

    /**
     * Use this method to send a game. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via BotFather.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendgame
     */
    sendGame(
        chat_id: number,
        game_short_name: string,
        other?: Other<R, "sendGame", "chat_id" | "game_short_name">,
        signal?: AbortSignal,
    ) {
        return this.raw.sendGame(
            { chat_id, game_short_name, ...other },
            signal,
        );
    }

    /**
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
     *
     * @param chat_id Unique identifier for the target chat
     * @param message_id Identifier of the sent message
     * @param user_id User identifier
     * @param score New score, must be non-negative
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setgamescore
     */
    setGameScore(
        chat_id: number,
        message_id: number,
        user_id: number,
        score: number,
        other?: Other<
            R,
            "setGameScore",
            "chat_id" | "message_id" | "inline_message_id" | "user_id" | "score"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.setGameScore(
            { chat_id, message_id, user_id, score, ...other },
            signal,
        );
    }

    /**
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
     *
     * @param inline_message_id Identifier of the inline message
     * @param user_id User identifier
     * @param score New score, must be non-negative
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setgamescore
     */
    setGameScoreInline(
        inline_message_id: string,
        user_id: number,
        score: number,
        other?: Other<
            R,
            "setGameScore",
            "chat_id" | "message_id" | "inline_message_id" | "user_id" | "score"
        >,
        signal?: AbortSignal,
    ) {
        return this.raw.setGameScore(
            { inline_message_id, user_id, score, ...other },
            signal,
        );
    }

    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects.
     *
     * This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and his neighbors are not among them. Please note that this behavior is subject to change.
     *
     * @param chat_id Unique identifier for the target chat
     * @param message_id Identifier of the sent message
     * @param user_id Target user id
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getgamehighscores
     */
    getGameHighScores(
        chat_id: number,
        message_id: number,
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.getGameHighScores(
            { chat_id, message_id, user_id },
            signal,
        );
    }

    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in an inline game. On success, returns an Array of GameHighScore objects.
     *
     * This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and his neighbors are not among them. Please note that this behavior is subject to change.
     *
     * @param inline_message_id Identifier of the inline message
     * @param user_id Target user id
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getgamehighscores
     */
    getGameHighScoresInline(
        inline_message_id: string,
        user_id: number,
        signal?: AbortSignal,
    ) {
        return this.raw.getGameHighScores(
            { inline_message_id, user_id },
            signal,
        );
    }
}
