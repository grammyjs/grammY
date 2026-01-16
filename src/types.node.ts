// === Needed imports
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
    type InputProfilePhoto as InputProfilePhotoAnimatedF,
    type InputProfilePhoto as InputProfilePhotoF,
    type InputProfilePhoto as InputProfilePhotoStaticF,
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
