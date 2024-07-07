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
} from "https://deno.land/x/grammy_types@v3.11.0/mod.ts";
import { debug as d, isDeno } from "./platform.deno.ts";

const debug = d("grammy:warn");

// === Export all API types
export * from "https://deno.land/x/grammy_types@v3.11.0/mod.ts";

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
 * files](https://grammy.dev/guide/files.html#uploading-your-own-file).
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
     * [documentation](https://grammy.dev/guide/files.html#uploading-your-own-file)
     * on sending files with `InputFile`.
     */
    public readonly filename?: string;
    /**
     * Constructs an `InputFile` that can be used in the API to send files.
     *
     * @param file A path to a local file or a `Buffer` or a `ReadableStream` that specifies the file data
     * @param filename Optional name of the file
     */
    constructor(
        file: MaybeSupplier<
            | string
            | Blob
            | Deno.FsFile
            | Response
            | URL
            | URLLike
            | Uint8Array
            | ReadableStream<Uint8Array>
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
        if (typeof data === "string") {
            if (!isDeno) {
                throw new Error(
                    "Reading files by path requires a Deno environment",
                );
            }
            const file = await Deno.open(data);
            return file.readable[Symbol.asyncIterator]();
        }
        if (data instanceof Blob) return data.stream();
        if (isDenoFile(data)) return data.readable[Symbol.asyncIterator]();
        // Handle Response objects
        if (data instanceof Response) {
            if (data.body === null) throw new Error(`No response body!`);
            return data.body;
        }
        // Handle URL and URLLike objects
        if (data instanceof URL) return await fetchFile(data);
        if ("url" in data) return await fetchFile(data.url);
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
}

async function fetchFile(
    url: string | URL,
): Promise<AsyncIterable<Uint8Array>> {
    const { body } = await fetch(url);
    if (body === null) {
        throw new Error(`Download failed, no response body from '${url}'`);
    }
    return body[Symbol.asyncIterator]();
}
function isDenoFile(data: unknown): data is Deno.FsFile {
    return isDeno && data instanceof Deno.FsFile;
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
