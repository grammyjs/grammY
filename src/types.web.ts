// === Needed imports
import { basename } from "https://deno.land/std@0.211.0/path/basename.ts";
import {
    type ApiMethods as ApiMethodsF,
    type InputMedia as InputMediaF,
    type InputMediaAnimation as InputMediaAnimationF,
    type InputMediaAudio as InputMediaAudioF,
    type InputMediaDocument as InputMediaDocumentF,
    type InputMediaPhoto as InputMediaPhotoF,
    type InputMediaVideo as InputMediaVideoF,
    type InputPaidMedia as InputPaidMediaF,
    type InputPaidMediaPhoto as InputPaidMediaPhotoF,
    type InputPaidMediaVideo as InputPaidMediaVideoF,
    type InputSticker as InputStickerF,
    type Opts as OptsF,
} from "https://deno.land/x/grammy_types@v3.20.0/mod.ts";

// === Export all API types
export * from "https://deno.land/x/grammy_types@v3.20.0/mod.ts";

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
     * @param file A URL to a file or a `Blob` or other forms of file data
     * @param filename Optional name of the file
     */
    constructor(
        file:
            | Blob
            | URL
            | URLLike
            | Uint8Array
            | ReadableStream<Uint8Array>
            | Iterable<Uint8Array>
            | AsyncIterable<Uint8Array>,
        filename?: string,
    ) {
        this.fileData = file;
        filename ??= this.guessFilename(file);
        this.filename = filename;
    }
    private guessFilename(
        file: ConstructorParameters<typeof InputFile>[0],
    ): string | undefined {
        if (typeof file === "string") return basename(file);
        if (typeof file !== "object") return undefined;
        if ("url" in file) return basename(file.url);
        if (!(file instanceof URL)) return undefined;
        return basename(file.pathname) || basename(file.hostname);
    }
    /**
     * Internal method. Do not use.
     *
     * Converts this instance into a binary representation that can be sent to
     * the Bot API server in the request body.
     */
    toRaw(): Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array> {
        if (this.consumed) {
            throw new Error("Cannot reuse InputFile data source!");
        }
        const data = this.fileData;
        // Handle local files
        if (data instanceof Blob) return data.stream();
        // Handle URL and URLLike objects
        if (data instanceof URL) return fetchFile(data);
        if ("url" in data) return fetchFile(data.url);
        // Mark streams and iterators as consumed
        if (!(data instanceof Uint8Array)) this.consumed = true;
        // Return buffers and byte streams as-is
        return data;
    }
}

async function* fetchFile(url: string | URL): AsyncIterable<Uint8Array> {
    const { body } = await fetch(url);
    if (body === null) {
        throw new Error(`Download failed, no response body from '${url}'`);
    }
    yield* body;
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
- InputMediaDocument
- InputMediaAudio
- InputMediaPhoto
- InputMediaVideo */
export type InputMedia = InputMediaF<InputFile>;
/** Represents a photo to be sent. */
export type InputMediaPhoto = InputMediaPhotoF<InputFile>;
/** Represents a video to be sent. */
export type InputMediaVideo = InputMediaVideoF<InputFile>;
/** Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent. */
export type InputMediaAnimation = InputMediaAnimationF<InputFile>;
/** Represents an audio file to be treated as music to be sent. */
export type InputMediaAudio = InputMediaAudioF<InputFile>;
/** Represents a general file to be sent. */
export type InputMediaDocument = InputMediaDocumentF<InputFile>;
/** This object describes the paid media to be sent. Currently, it can be one of
- InputPaidMediaPhoto
- InputPaidMediaVideo */
export type InputPaidMedia = InputPaidMediaF<InputFile>;
/** The paid media to send is a photo. */
export type InputPaidMediaPhoto = InputPaidMediaPhotoF<InputFile>;
/** The paid media to send is a video. */
export type InputPaidMediaVideo = InputPaidMediaVideoF<InputFile>;
