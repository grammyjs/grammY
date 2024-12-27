import type { Chat, User } from "./manage.ts";
import type { InlineKeyboardMarkup, WebAppInfo } from "./markup.ts";
import type {
    LinkPreviewOptions,
    Location,
    MessageEntity,
    ParseMode,
} from "./message.ts";
import type { LabeledPrice } from "./payment.ts";

/** This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results. */
export interface InlineQuery {
    /** Unique identifier for this query */
    id: string;
    /** Sender */
    from: User;
    /** Text of the query (up to 256 characters) */
    query: string;
    /** Offset of the results to be returned, can be controlled by the bot */
    offset: string;
    /** Type of the chat from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat */
    chat_type?: "sender" | Chat["type"];
    /** Sender location, only for bots that request user location */
    location?: Location;
}

/** This object represents one result of an inline query. Telegram clients currently support results of the following 20 types:
- InlineQueryResultCachedAudio
- InlineQueryResultCachedDocument
- InlineQueryResultCachedGif
- InlineQueryResultCachedMpeg4Gif
- InlineQueryResultCachedPhoto
- InlineQueryResultCachedSticker
- InlineQueryResultCachedVideo
- InlineQueryResultCachedVoice
- InlineQueryResultArticle
- InlineQueryResultAudio
- InlineQueryResultContact
- InlineQueryResultGame
- InlineQueryResultDocument
- InlineQueryResultGif
- InlineQueryResultLocation
- InlineQueryResultMpeg4Gif
- InlineQueryResultPhoto
- InlineQueryResultVenue
- InlineQueryResultVideo
- InlineQueryResultVoice

Note: All URLs passed in inline query results will be available to end users and therefore must be assumed to be public. */
export type InlineQueryResult =
    | InlineQueryResultCachedAudio
    | InlineQueryResultCachedDocument
    | InlineQueryResultCachedGif
    | InlineQueryResultCachedMpeg4Gif
    | InlineQueryResultCachedPhoto
    | InlineQueryResultCachedSticker
    | InlineQueryResultCachedVideo
    | InlineQueryResultCachedVoice
    | InlineQueryResultArticle
    | InlineQueryResultAudio
    | InlineQueryResultContact
    | InlineQueryResultGame
    | InlineQueryResultDocument
    | InlineQueryResultGif
    | InlineQueryResultLocation
    | InlineQueryResultMpeg4Gif
    | InlineQueryResultPhoto
    | InlineQueryResultVenue
    | InlineQueryResultVideo
    | InlineQueryResultVoice;

/** Represents a link to an article or web page. */
export interface InlineQueryResultArticle {
    /** Type of the result, must be article */
    type: "article";
    /** Unique identifier for this result, 1-64 Bytes */
    id: string;
    /** Title of the result */
    title: string;
    /** Content of the message to be sent */
    input_message_content: InputMessageContent;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** URL of the result */
    url?: string;
    /** Pass True if you don't want the URL to be shown in the message */
    hide_url?: boolean;
    /** Short description of the result */
    description?: string;
    /** Url of the thumbnail for the result */
    thumbnail_url?: string;
    /** Thumbnail width */
    thumbnail_width?: number;
    /** Thumbnail height */
    thumbnail_height?: number;
}

/** Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo. */
export interface InlineQueryResultPhoto {
    /** Type of the result, must be photo */
    type: "photo";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB */
    photo_url: string;
    /** URL of the thumbnail for the photo */
    thumbnail_url: string;
    /** Width of the photo */
    photo_width?: number;
    /** Height of the photo */
    photo_height?: number;
    /** Title for the result */
    title?: string;
    /** Short description of the result */
    description?: string;
    /** Caption of the photo to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the photo caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the photo */
    input_message_content?: InputMessageContent;
}

/** Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export interface InlineQueryResultGif {
    /** Type of the result, must be gif */
    type: "gif";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid URL for the GIF file. File size must not exceed 1MB */
    gif_url: string;
    /** Width of the GIF */
    gif_width?: number;
    /** Height of the GIF */
    gif_height?: number;
    /** Duration of the GIF in seconds */
    gif_duration?: number;
    /** URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result */
    thumbnail_url: string;
    /** MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg” */
    thumbnail_mime_type?: "image/jpeg" | "image/gif" | "video/mp4";
    /** Title for the result */
    title?: string;
    /** Caption of the GIF file to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the GIF animation */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export interface InlineQueryResultMpeg4Gif {
    /** Type of the result, must be mpeg4_gif */
    type: "mpeg4_gif";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid URL for the MPEG4 file. File size must not exceed 1MB */
    mpeg4_url: string;
    /** Video width */
    mpeg4_width?: number;
    /** Video height */
    mpeg4_height?: number;
    /** Video duration in seconds */
    mpeg4_duration?: number;
    /** URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result */
    thumbnail_url: string;
    /** MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg” */
    thumbnail_mime_type?: "image/jpeg" | "image/gif" | "video/mp4";
    /** Title for the result */
    title?: string;
    /** Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the video animation */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.

> If an InlineQueryResultVideo message contains an embedded video (e.g., YouTube), you must replace its content using input_message_content. */
export interface InlineQueryResultVideo {
    /** Type of the result, must be video */
    type: "video";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid URL for the embedded video player or video file */
    video_url: string;
    /** MIME type of the content of the video URL, “text/html” or “video/mp4” */
    mime_type: "text/html" | "video/mp4";
    /** URL of the thumbnail (JPEG only) for the video */
    thumbnail_url: string;
    /** Title for the result */
    title: string;
    /** Caption of the video to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the video caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Video width */
    video_width?: number;
    /** Video height */
    video_height?: number;
    /** Video duration in seconds */
    video_duration?: number;
    /** Short description of the result */
    description?: string;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the video. This field is required if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video). */
    input_message_content?: InputMessageContent;
}

/** Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio. */
export interface InlineQueryResultAudio {
    /** Type of the result, must be audio */
    type: "audio";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid URL for the audio file */
    audio_url: string;
    /** Title */
    title: string;
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the audio caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Performer */
    performer?: string;
    /** Audio duration in seconds */
    audio_duration?: number;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the audio */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the the voice message. */
export interface InlineQueryResultVoice {
    /** Type of the result, must be voice */
    type: "voice";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid URL for the voice recording */
    voice_url: string;
    /** Recording title */
    title: string;
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the voice message caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Recording duration in seconds */
    voice_duration?: number;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the voice recording */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. Currently, only .PDF and .ZIP files can be sent using this method. */
export interface InlineQueryResultDocument {
    /** Type of the result, must be document */
    type: "document";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** Title for the result */
    title: string;
    /** Caption of the document to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the document caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** A valid URL for the file */
    document_url: string;
    /** MIME type of the content of the file, either “application/pdf” or “application/zip” */
    mime_type: "application/pdf" | "application/zip";
    /** Short description of the result */
    description?: string;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the file */
    input_message_content?: InputMessageContent;
    /** URL of the thumbnail (JPEG only) for the file */
    thumbnail_url?: string;
    /** Thumbnail width */
    thumbnail_width?: number;
    /** Thumbnail height */
    thumbnail_height?: number;
}

/** Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the location. */
export interface InlineQueryResultLocation {
    /** Type of the result, must be location */
    type: "location";
    /** Unique identifier for this result, 1-64 Bytes */
    id: string;
    /** Location latitude in degrees */
    latitude: number;
    /** Location longitude in degrees */
    longitude: number;
    /** Location title */
    title: string;
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number;
    /** Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. */
    live_period?: number;
    /** For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number;
    /** For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the location */
    input_message_content?: InputMessageContent;
    /** Url of the thumbnail for the result */
    thumbnail_url?: string;
    /** Thumbnail width */
    thumbnail_width?: number;
    /** Thumbnail height */
    thumbnail_height?: number;
}

/** Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the venue. */
export interface InlineQueryResultVenue {
    /** Type of the result, must be venue */
    type: "venue";
    /** Unique identifier for this result, 1-64 Bytes */
    id: string;
    /** Latitude of the venue location in degrees */
    latitude: number;
    /** Longitude of the venue location in degrees */
    longitude: number;
    /** Title of the venue */
    title: string;
    /** Address of the venue */
    address: string;
    /** Foursquare identifier of the venue if known */
    foursquare_id?: string;
    /** Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string;
    /** Google Places identifier of the venue */
    google_place_id?: string;
    /** Google Places type of the venue. (See supported types.) */
    google_place_type?: string;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the venue */
    input_message_content?: InputMessageContent;
    /** Url of the thumbnail for the result */
    thumbnail_url?: string;
    /** Thumbnail width */
    thumbnail_width?: number;
    /** Thumbnail height */
    thumbnail_height?: number;
}

/** Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the contact. */
export interface InlineQueryResultContact {
    /** Type of the result, must be contact */
    type: "contact";
    /** Unique identifier for this result, 1-64 Bytes */
    id: string;
    /** Contact's phone number */
    phone_number: string;
    /** Contact's first name */
    first_name: string;
    /** Contact's last name */
    last_name?: string;
    /** Additional data about the contact in the form of a vCard, 0-2048 bytes */
    vcard?: string;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the contact */
    input_message_content?: InputMessageContent;
    /** Url of the thumbnail for the result */
    thumbnail_url?: string;
    /** Thumbnail width */
    thumbnail_width?: number;
    /** Thumbnail height */
    thumbnail_height?: number;
}

/** Represents a Game. */
export interface InlineQueryResultGame {
    /** Type of the result, must be game */
    type: "game";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** Short name of the game */
    game_short_name: string;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
}

/** Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo. */
export interface InlineQueryResultCachedPhoto {
    /** Type of the result, must be photo */
    type: "photo";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid file identifier of the photo */
    photo_file_id: string;
    /** Title for the result */
    title?: string;
    /** Short description of the result */
    description?: string;
    /** Caption of the photo to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the photo caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the photo */
    input_message_content?: InputMessageContent;
}

/** Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with specified content instead of the animation. */
export interface InlineQueryResultCachedGif {
    /** Type of the result, must be gif */
    type: "gif";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid file identifier for the GIF file */
    gif_file_id: string;
    /** Title for the result */
    title?: string;
    /** Caption of the GIF file to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the GIF animation */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export interface InlineQueryResultCachedMpeg4Gif {
    /** Type of the result, must be mpeg4_gif */
    type: "mpeg4_gif";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid file identifier for the MPEG4 file */
    mpeg4_file_id: string;
    /** Title for the result */
    title?: string;
    /** Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the video animation */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the sticker. */
export interface InlineQueryResultCachedSticker {
    /** Type of the result, must be sticker */
    type: "sticker";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid file identifier of the sticker */
    sticker_file_id: string;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the sticker */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. */
export interface InlineQueryResultCachedDocument {
    /** Type of the result, must be document */
    type: "document";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** Title for the result */
    title: string;
    /** A valid file identifier for the file */
    document_file_id: string;
    /** Short description of the result */
    description?: string;
    /** Caption of the document to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the document caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the file */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video. */
export interface InlineQueryResultCachedVideo {
    /** Type of the result, must be video */
    type: "video";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid file identifier for the video file */
    video_file_id: string;
    /** Title for the result */
    title: string;
    /** Short description of the result */
    description?: string;
    /** Caption of the video to be sent, 0-1024 characters after entities parsing */
    caption?: string;
    /** Pass True, if the caption must be shown above the message media */
    show_caption_above_media?: boolean;
    /** Mode for parsing entities in the video caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the video */
    input_message_content?: InputMessageContent;
}

/** Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the voice message. */
export interface InlineQueryResultCachedVoice {
    /** Type of the result, must be voice */
    type: "voice";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid file identifier for the voice message */
    voice_file_id: string;
    /** Voice message title */
    title: string;
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the voice message caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the voice message */
    input_message_content?: InputMessageContent;
}

/** Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio. */
export interface InlineQueryResultCachedAudio {
    /** Type of the result, must be audio */
    type: "audio";
    /** Unique identifier for this result, 1-64 bytes */
    id: string;
    /** A valid file identifier for the audio file */
    audio_file_id: string;
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the audio caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** Content of the message to be sent instead of the audio */
    input_message_content?: InputMessageContent;
}

/** This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following 5 types:

- InputTextMessageContent
- InputLocationMessageContent
- InputVenueMessageContent
- InputContactMessageContent
- InputInvoiceMessageContent */
export type InputMessageContent =
    | InputTextMessageContent
    | InputLocationMessageContent
    | InputVenueMessageContent
    | InputContactMessageContent
    | InputInvoiceMessageContent;

/** Represents the content of a text message to be sent as the result of an inline query. */
export interface InputTextMessageContent {
    /** Text of the message to be sent, 1-4096 characters */
    message_text: string;
    /** Mode for parsing entities in the message text. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** List of special entities that appear in message text, which can be specified instead of parse_mode */
    entities?: MessageEntity[];
    /** Link preview generation options for the message */
    link_preview_options?: LinkPreviewOptions;
}

/** Represents the content of a location message to be sent as the result of an inline query. */
export interface InputLocationMessageContent {
    /** Latitude of the location in degrees */
    latitude: number;
    /** Longitude of the location in degrees */
    longitude: number;
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number;
    /** Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. */
    live_period?: number;
    /** For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number;
    /** For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number;
}

/** Represents the content of a venue message to be sent as the result of an inline query. */
export interface InputVenueMessageContent {
    /** Latitude of the venue in degrees */
    latitude: number;
    /** Longitude of the venue in degrees */
    longitude: number;
    /** Name of the venue */
    title: string;
    /** Address of the venue */
    address: string;
    /** Foursquare identifier of the venue, if known */
    foursquare_id?: string;
    /** Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string;
    /** Google Places identifier of the venue */
    google_place_id?: string;
    /** Google Places type of the venue. (See supported types.) */
    google_place_type?: string;
}

/** Represents the content of a contact message to be sent as the result of an inline query. */
export interface InputContactMessageContent {
    /** Contact's phone number */
    phone_number: string;
    /** Contact's first name */
    first_name: string;
    /** Contact's last name */
    last_name?: string;
    /** Additional data about the contact in the form of a vCard, 0-2048 bytes */
    vcard?: string;
}

/** Represents the content of an invoice message to be sent as the result of an inline query. */
export interface InputInvoiceMessageContent {
    /** Product name, 1-32 characters */
    title: string;
    /** Product description, 1-255 characters */
    description: string;
    /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. */
    payload: string;
    /** Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars. */
    provider_token?: string;
    /** Three-letter ISO 4217 currency code, see more on currencies. Pass “XTR” for payments in Telegram Stars. */
    currency: string;
    /** Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars. */
    prices: LabeledPrice[];
    /** The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars. */
    max_tip_amount?: number;
    /** An array of suggested amounts of tip in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. */
    suggested_tip_amounts?: number[];
    /** Data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider. */
    provider_data?: string;
    /** URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. */
    photo_url?: string;
    /** Photo size in bytes */
    photo_size?: number;
    /** Photo width */
    photo_width?: number;
    /** Photo height */
    photo_height?: number;
    /** Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars. */
    need_name?: boolean;
    /** Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars. */
    need_phone_number?: boolean;
    /** Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars. */
    need_email?: boolean;
    /** Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars. */
    need_shipping_address?: boolean;
    /** Pass True if the user's phone number should be sent to provider. Ignored for payments in Telegram Stars. */
    send_phone_number_to_provider?: boolean;
    /** Pass True if the user's email address should be sent to provider. Ignored for payments in Telegram Stars. */
    send_email_to_provider?: boolean;
    /** Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars. */
    is_flexible?: boolean;
}

/** Represents a result of an inline query that was chosen by the user and sent to their chat partner.

Note: It is necessary to enable inline feedback via @BotFather in order to receive these objects in updates. */
export interface ChosenInlineResult {
    /** The unique identifier for the result that was chosen */
    result_id: string;
    /** The user that chose the result */
    from: User;
    /** Sender location, only for bots that require user location */
    location?: Location;
    /** Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message. */
    inline_message_id?: string;
    /** The query that was used to obtain the result */
    query: string;
}

/** This object represents a button to be shown above inline query results. You must use exactly one of the optional fields.

Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities. */
export interface InlineQueryResultsButton {
    /** Label text on the button */
    text: string;
    /** Description of the Web App that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method web_app_switch_inline_query inside the Web App. */
    web_app?: WebAppInfo;
    /** Deep-linking parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed. */
    start_parameter?: string;
}
