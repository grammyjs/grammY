// === Needed imports
import {
    type ApiMethods as ApiMethodsF,
    type InlineQueryResult as InlineQueryResultF,
    type InlineQueryResultArticle as InlineQueryResultArticleF,
    type InlineQueryResultAudio as InlineQueryResultAudioF,
    type InlineQueryResultCachedAudio as InlineQueryResultCachedAudioF,
    type InlineQueryResultCachedDocument as InlineQueryResultCachedDocumentF,
    type InlineQueryResultCachedGif as InlineQueryResultCachedGifF,
    type InlineQueryResultCachedMpeg4Gif as InlineQueryResultCachedMpeg4GifF,
    type InlineQueryResultCachedPhoto as InlineQueryResultCachedPhotoF,
    type InlineQueryResultCachedSticker as InlineQueryResultCachedStickerF,
    type InlineQueryResultCachedVideo as InlineQueryResultCachedVideoF,
    type InlineQueryResultCachedVoice as InlineQueryResultCachedVoiceF,
    type InlineQueryResultContact as InlineQueryResultContactF,
    type InlineQueryResultDocument as InlineQueryResultDocumentF,
    type InlineQueryResultGame as InlineQueryResultGameF,
    type InlineQueryResultGif as InlineQueryResultGifF,
    type InlineQueryResultLocation as InlineQueryResultLocationF,
    type InlineQueryResultMpeg4Gif as InlineQueryResultMpeg4GifF,
    type InlineQueryResultPhoto as InlineQueryResultPhotoF,
    type InlineQueryResultVenue as InlineQueryResultVenueF,
    type InlineQueryResultVideo as InlineQueryResultVideoF,
    type InlineQueryResultVoice as InlineQueryResultVoiceF,
    type InputMedia as InputMediaF,
    type InputMediaAnimation as InputMediaAnimationF,
    type InputMediaAudio as InputMediaAudioF,
    type InputMediaDocument as InputMediaDocumentF,
    type InputMediaLivePhoto as InputMediaLivePhotoF,
    type InputMediaPhoto as InputMediaPhotoF,
    type InputMediaSticker as InputMediaStickerF,
    type InputMediaVideo as InputMediaVideoF,
    type InputMediaVoiceNote as InputMediaVoiceNoteF,
    type InputMessageContent as InputMessageContentF,
    type InputPaidMedia as InputPaidMediaF,
    type InputPaidMediaLivePhoto as InputPaidMediaLivePhotoF,
    type InputPaidMediaPhoto as InputPaidMediaPhotoF,
    type InputPaidMediaVideo as InputPaidMediaVideoF,
    type InputPollMedia as InputPollMediaF,
    type InputPollOption as InputPollOptionF,
    type InputPollOptionMedia as InputPollOptionMediaF,
    type InputProfilePhoto as InputProfilePhotoAnimatedF,
    type InputProfilePhoto as InputProfilePhotoF,
    type InputProfilePhoto as InputProfilePhotoStaticF,
    type InputRichBlock as InputRichBlockF,
    type InputRichBlockAnimation as InputRichBlockAnimationF,
    type InputRichBlockAudio as InputRichBlockAudioF,
    type InputRichBlockBlockQuotation as InputRichBlockBlockQuotationF,
    type InputRichBlockCollage as InputRichBlockCollageF,
    type InputRichBlockDetails as InputRichBlockDetailsF,
    type InputRichBlockList as InputRichBlockListF,
    type InputRichBlockListItem as InputRichBlockListItemF,
    type InputRichBlockPhoto as InputRichBlockPhotoF,
    type InputRichBlockSlideshow as InputRichBlockSlideshowF,
    type InputRichBlockVideo as InputRichBlockVideoF,
    type InputRichBlockVoiceNote as InputRichBlockVoiceNoteF,
    type InputRichMessage as InputRichMessageF,
    type InputRichMessageContent as InputRichMessageContentF,
    type InputRichMessageMedia as InputRichMessageMediaF,
    type InputSticker as InputStickerF,
    type InputStoryContent as InputStoryContentF,
    type InputStoryContentPhoto as InputStoryContentPhotoF,
    type InputStoryContentVideo as InputStoryContentVideoF,
    type Opts as OptsF,
} from "@grammyjs/types";
import { createReadStream, type ReadStream } from "fs";
import fetch from "node-fetch";
import { basename } from "path";
import { debug as d } from "./platform.node";

const debug = d("grammy:warn");

// === Export all API types
export * from "@grammyjs/types";

/** A value, or a potentially async function supplying that value */
type MaybeSupplier<T> = T | (() => T | Promise<T>);
/** Something that looks like a URL. */
interface URLLike {
    /**
     * Identifier of the resource. Must be in a format that can be parsed by the
     * URL constructor.
     */
    url: string;
}

// === InputFile handling and File augmenting
/**
 * An `InputFile` wraps a number of different sources for [sending
 * files](https://grammy.dev/guide/files#uploading-your-own-files).
 *
 * It corresponds to the `InputFile` type in the [Telegram Bot API
 * Reference](https://core.telegram.org/bots/api#inputfile).
 */
export class InputFile {
    private consumed = false;
    private readonly fileData: ConstructorParameters<typeof InputFile>[0];
    /**
     * Optional name of the constructed `InputFile` instance.
     *
     * Check out the
     * [documentation](https://grammy.dev/guide/files#uploading-your-own-files)
     * on sending files with `InputFile`.
     */
    public readonly filename?: string;
    /**
     * Constructs an `InputFile` that can be used in the API to send files.
     *
     * @param file A path to a local file or a `Buffer` or a `fs.ReadStream` that specifies the file data
     * @param filename Optional name of the file
     */
    constructor(
        file: MaybeSupplier<
            | string
            | URL
            | URLLike
            | Uint8Array
            | ReadStream
            | Iterable<Uint8Array>
            | AsyncIterable<Uint8Array>
        >,
        filename?: string,
    ) {
        this.fileData = file;
        filename ??= this.guessFilename(file);
        this.filename = filename;
        if (
            typeof file === "string" &&
            (file.startsWith("http:") || file.startsWith("https:"))
        ) {
            debug(
                `InputFile received the local file path '${file}' that looks like a URL. Is this a mistake?`,
            );
        }
    }
    private guessFilename(
        file: ConstructorParameters<typeof InputFile>[0],
    ): string | undefined {
        if (typeof file === "string") return basename(file);
        if ("url" in file) return basename(file.url);
        if (!(file instanceof URL)) return undefined;
        if (file.pathname !== "/") {
            const filename = basename(file.pathname);
            if (filename) return filename;
        }
        return basename(file.hostname);
    }
    /**
     * Internal method. Do not use.
     *
     * Converts this instance into a binary representation that can be sent to
     * the Bot API server in the request body.
     */
    async toRaw(): Promise<
        Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array>
    > {
        if (this.consumed) {
            throw new Error("Cannot reuse InputFile data source!");
        }
        const data = this.fileData;
        // Handle local files
        if (typeof data === "string") return createReadStream(data);
        // Handle URLs and URLLike objects
        if (data instanceof URL) {
            return data.protocol === "file" // node-fetch does not support file URLs
                ? createReadStream(data.pathname)
                : fetchFile(data);
        }
        if ("url" in data) return fetchFile(data.url);
        // Return buffers as-is
        if (data instanceof Uint8Array) return data;
        // Unwrap supplier functions
        if (typeof data === "function") {
            return new InputFile(await data()).toRaw();
        }
        // Mark streams and iterators as consumed and return them as-is
        this.consumed = true;
        return data;
    }
    toJSON() {
        throw new Error("InputFile instances must be sent via grammY");
    }
}

async function* fetchFile(url: string | URL): AsyncIterable<Uint8Array> {
    const { body } = await fetch(url);
    for await (const chunk of body) {
        if (typeof chunk === "string") {
            throw new Error(
                `Could not transfer file, received string data instead of bytes from '${url}'`,
            );
        }
        yield chunk;
    }
}

// === Export InputFile types
/** Wrapper type to bundle all methods of the Telegram API */
export type ApiMethods = ApiMethodsF<InputFile>;

/** Utility type providing the argument type for the given method name or `{}` if the method does not take any parameters */
export type Opts<M extends keyof ApiMethods> = OptsF<InputFile>[M];

/** This object describes a sticker to be added to a sticker set. */
export type InputSticker = InputStickerF<InputFile>;

/** This object represents the content of a media message to be sent. It should be one of

  - InputMediaAnimation
  - InputMediaAudio
  - InputMediaDocument
  - InputMediaLivePhoto
  - InputMediaPhoto
  - InputMediaVideo */
export type InputMedia = InputMediaF<InputFile>;
/** This object represents the content of a media message to be sent. It should be one of

  - InputMediaAnimation
  - InputMediaAudio
  - InputMediaDocument
  - InputMediaLivePhoto
  - InputMediaPhoto
  - InputMediaVideo */
export type InputMediaWithoutUpload = InputMediaF<never>;
/** Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent. */
export type InputMediaAnimation = InputMediaAnimationF<InputFile>;
/** Represents an audio file to be treated as music to be sent. */
export type InputMediaAudio = InputMediaAudioF<InputFile>;
/** Represents a general file to be sent. */
export type InputMediaDocument = InputMediaDocumentF<InputFile>;
/** Represents a live photo to be sent. */
export type InputMediaLivePhoto = InputMediaLivePhotoF<InputFile>;
/** Represents a photo to be sent. */
export type InputMediaPhoto = InputMediaPhotoF<InputFile>;
/** Represents a sticker file to be sent. */
export type InputMediaSticker = InputMediaStickerF<InputFile>;
/** Represents a video to be sent. */
export type InputMediaVideo = InputMediaVideoF<InputFile>;
/** Represents a voice message file to be sent. */
export type InputMediaVoiceNote = InputMediaVoiceNoteF<InputFile>;
/** This object contains information about one answer option in a poll to send. */
export type InputPollOption = InputPollOptionF<InputFile>;
/** This object represents the content of a poll description or a quiz explanation to be sent. It should be one of

- InputMediaAnimation
- InputMediaAudio
- InputMediaDocument
- InputMediaLivePhoto
- InputMediaLocation
- InputMediaPhoto
- InputMediaVenue
- InputMediaVideo */
export type InputPollMedia = InputPollMediaF<InputFile>;
/** This object represents the content of a poll option to be sent. It should be one of

 - InputMediaAnimation
 - InputMediaLivePhoto
 - InputMediaLocation
 - InputMediaPhoto
 - InputMediaSticker
 - InputMediaVenue
 - InputMediaVideo */
export type InputPollOptionMedia = InputPollOptionMediaF<InputFile>;
/** This object describes the paid media to be sent. Currently, it can be one of

- InputPaidMediaPhoto
- InputPaidMediaVideo */
export type InputPaidMedia = InputPaidMediaF<InputFile>;
/** The paid media to send is a live photo. */
export type InputPaidMediaLivePhoto = InputPaidMediaLivePhotoF<InputFile>;
/** The paid media to send is a photo. */
export type InputPaidMediaPhoto = InputPaidMediaPhotoF<InputFile>;
/** The paid media to send is a video. */
export type InputPaidMediaVideo = InputPaidMediaVideoF<InputFile>;
/** This object describes a profile photo to set. Currently, it can be one of

- InputProfilePhotoStatic
- InputProfilePhotoAnimated */
export type InputProfilePhoto = InputProfilePhotoF<InputFile>;
/** A static profile photo in the .JPG format. */
export type InputProfilePhotoStatic = InputProfilePhotoStaticF<InputFile>;
/** An animated profile photo in the MPEG4 format. */
export type InputProfilePhotoAnimated = InputProfilePhotoAnimatedF<InputFile>;
/** This object describes the content of a story to post. Currently, it can be one of

- InputStoryContentPhoto
- InputStoryContentVideo */
export type InputStoryContent = InputStoryContentF<InputFile>;
/** Describes a photo to post as a story. */
export type InputStoryContentPhoto = InputStoryContentPhotoF<InputFile>;
/** Describes a video to post as a story. */
export type InputStoryContentVideo = InputStoryContentVideoF<InputFile>;

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
export type InlineQueryResult = InlineQueryResultF<InputFile>;
/** Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio. */
export type InlineQueryResultCachedAudio = InlineQueryResultCachedAudioF<
    InputFile
>;
/** Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. */
export type InlineQueryResultCachedDocument = InlineQueryResultCachedDocumentF<
    InputFile
>;
/** Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with specified content instead of the animation. */
export type InlineQueryResultCachedGif = InlineQueryResultCachedGifF<InputFile>;
/** Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export type InlineQueryResultCachedMpeg4Gif = InlineQueryResultCachedMpeg4GifF<
    InputFile
>;
/** Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo. */
export type InlineQueryResultCachedPhoto = InlineQueryResultCachedPhotoF<
    InputFile
>;
/** Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the sticker. */
export type InlineQueryResultCachedSticker = InlineQueryResultCachedStickerF<
    InputFile
>;
/** Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video. */
export type InlineQueryResultCachedVideo = InlineQueryResultCachedVideoF<
    InputFile
>;
/** Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the voice message. */
export type InlineQueryResultCachedVoice = InlineQueryResultCachedVoiceF<
    InputFile
>;
/** Represents a link to an article or web page. */
export type InlineQueryResultArticle = InlineQueryResultArticleF<InputFile>;
/** Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio. */
export type InlineQueryResultAudio = InlineQueryResultAudioF<InputFile>;
/** Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the contact. */
export type InlineQueryResultContact = InlineQueryResultContactF<InputFile>;
/** Represents a Game. */
export type InlineQueryResultGame = InlineQueryResultGameF;
/** Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. Currently, only .PDF and .ZIP files can be sent using this method. */
export type InlineQueryResultDocument = InlineQueryResultDocumentF<InputFile>;
/** Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export type InlineQueryResultGif = InlineQueryResultGifF<InputFile>;
/** Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the location. */
export type InlineQueryResultLocation = InlineQueryResultLocationF<InputFile>;
/** Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export type InlineQueryResultMpeg4Gif = InlineQueryResultMpeg4GifF<InputFile>;
/** Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo. */
export type InlineQueryResultPhoto = InlineQueryResultPhotoF<InputFile>;
/** Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the venue. */
export type InlineQueryResultVenue = InlineQueryResultVenueF<InputFile>;
/** Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.

> If an InlineQueryResultVideo<F> message contains an embedded video (e.g., YouTube), you must replace its content using input_message_content. */
export type InlineQueryResultVideo = InlineQueryResultVideoF<InputFile>;
/** Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the the voice message. */
export type InlineQueryResultVoice = InlineQueryResultVoiceF<InputFile>;

/** This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following types:

- InputTextMessageContent
- InputRichMessageContent
- InputLocationMessageContent
- InputVenueMessageContent
- InputContactMessageContent
- InputInvoiceMessageContent */
export type InputMessageContent = InputMessageContentF<InputFile>;
/** Describes a rich message to be sent. Exactly one of the fields html, markdown, or blocks must be used. */
export type InputRichMessage = InputRichMessageF<InputFile>;
/** Describes a rich message to be sent. Exactly one of the fields html, markdown, or blocks must be used. */
export type InputRichMessageWithoutUpload = InputRichMessageF<never>;
/** Represents the content of a rich message to be sent as the result of an inline query. */
export type InputRichMessageContent = InputRichMessageContentF<InputFile>;
/** Describes a media element embedded in an outgoing rich message. */
export type InputRichMessageMedia = InputRichMessageMediaF<InputFile>;
/** An item of a list to be sent. */
export type InputRichBlockListItem = InputRichBlockListItemF<InputFile>;
/** This object represents a block in a rich formatted message to be sent. Currently, it can be any of the following types:

- InputRichBlockParagraph
- InputRichBlockSectionHeading
- InputRichBlockPreformatted
- InputRichBlockFooter
- InputRichBlockDivider
- InputRichBlockMathematicalExpression
- InputRichBlockAnchor
- InputRichBlockList
- InputRichBlockBlockQuotation
- InputRichBlockPullQuotation
- InputRichBlockCollage
- InputRichBlockSlideshow
- InputRichBlockTable
- InputRichBlockDetails
- InputRichBlockMap
- InputRichBlockAnimation
- InputRichBlockAudio
- InputRichBlockPhoto
- InputRichBlockVideo
- InputRichBlockVoiceNote
- InputRichBlockThinking */
export type InputRichBlock = InputRichBlockF<InputFile>;
/** A list of blocks, corresponding to the HTML tag \<ul> or \<ol> with multiple nested tags \<li>. */
export type InputRichBlockList = InputRichBlockListF<InputFile>;
/** A block quotation, corresponding to the HTML tag \<blockquote>. */
export type InputRichBlockBlockQuotation = InputRichBlockBlockQuotationF<
    InputFile
>;
/** A collage, corresponding to the custom HTML tag \<tg-collage>. */
export type InputRichBlockCollage = InputRichBlockCollageF<InputFile>;
/** A slideshow, corresponding to the custom HTML tag \<tg-slideshow>. */
export type InputRichBlockSlideshow = InputRichBlockSlideshowF<InputFile>;
/** An expandable block for details disclosure, corresponding to the HTML tag \<details>. */
export type InputRichBlockDetails = InputRichBlockDetailsF<InputFile>;
/** A block with an animation, corresponding to the HTML tag \<video>. */
export type InputRichBlockAnimation = InputRichBlockAnimationF<InputFile>;
/** A block with a music file, corresponding to the HTML tag \<audio>. */
export type InputRichBlockAudio = InputRichBlockAudioF<InputFile>;
/** A block with a photo, corresponding to the HTML tag \<img>. */
export type InputRichBlockPhoto = InputRichBlockPhotoF<InputFile>;
/** A block with a video, corresponding to the HTML tag \<video>. */
export type InputRichBlockVideo = InputRichBlockVideoF<InputFile>;
/** A block with a voice note, corresponding to the HTML tag \<audio>. */
export type InputRichBlockVoiceNote = InputRichBlockVoiceNoteF<InputFile>;
