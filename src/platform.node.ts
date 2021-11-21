// === Needed imports
import { InputFileProxy } from "@grammyjs/types";
import { Agent } from "https";
import { basename } from "path";
import { Readable } from "stream";
import type { ReadStream } from "fs";
import { URL } from "url";
import { createReadStream } from "fs";

// === Export all API types
export * from "@grammyjs/types";

// === Export debug
export { debug } from "debug";

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) =>
    Readable.from(itr, { objectMode: false });

// === Base configuration for `fetch` calls
export const baseFetchConfig = {
    compress: true,
    agent: new Agent({ keepAlive: true }),
};

/** Something that looks like a URL. */
interface URLLike {
    /**
     * Identifier of the resouce. Must be in a format that can be parsed by the
     * URL constructor.
     */
    url: string;
}

/** Something that looks like a local file path. */
interface PathLike {
    /**
     * Identifier of the resouce. Must be a local file path.
     */
    path: string;
}

// === InputFile handling and File augmenting
// Accessor for file data in `InputFile` instances
export const toRaw = Symbol("InputFile data");

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
     * [documenation](https://grammy.dev/guide/files.html#uploading-your-own-file)
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
        file:
            | string
            | URL
            | URLLike
            | PathLike
            | Uint8Array
            | ReadStream
            | AsyncIterable<Uint8Array>,
        filename?: string,
    ) {
        this.fileData = file;
        if (filename === undefined) {
            if (typeof file === "string") filename = basename(file);
            else if (typeof file === "object") {
                if ("url" in file) filename = basename(file.url);
                else if ("path" in file) filename = basename(file.path);
                else if (file instanceof URL) {
                    filename = basename(file.pathname) ||
                        basename(file.hostname);
                }
            }
        }
        this.filename = filename;
    }
    [toRaw](): Uint8Array | AsyncIterable<Uint8Array> {
        if (this.consumed) {
            throw new Error("Cannot reuse InputFile data source!");
        }
        let data = this.fileData;
        // Guess local file path or URL from string
        if (typeof data === "string") data = guessPathOrUrl(data);
        // Handle URL and URLLike
        if (data instanceof URL) return fetchFile(data);
        if ("url" in data) return fetchFile(data.url);
        // Handle local file paths
        if ("path" in data) return createReadStream(data);
        // Mark streams and iterators as consumed
        if (!(data instanceof Uint8Array)) this.consumed = true;
        // Return buffers and byte streams as-is
        return data;
    }
}

function guessPathOrUrl(path: string): URL | PathLike {
    try {
        const url = new URL(path);
        return url.protocol === "file:" ? { path } : url;
    } catch {
        return { path };
    }
}

async function* fetchFile(url: string | URL): AsyncIterable<Uint8Array> {
    const { body } = await fetch(url);
    if (body === null) {
        throw new Error(
            `Download failed, no response body from '${url}'`,
        );
    }
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
type GrammyTypes = InputFileProxy<InputFile>;

/** Wrapper type to bundle all methods of the Telegram API */
export type Telegram = GrammyTypes["Telegram"];

/** Utility type providing the argument type for the given method name or `{}` if the method does not take any parameters */
export type Opts<M extends keyof GrammyTypes["Telegram"]> =
    GrammyTypes["Opts"][M];

/** This object represents the content of a media message to be sent. It should be one of
- InputMediaAnimation
- InputMediaDocument
- InputMediaAudio
- InputMediaPhoto
- InputMediaVideo */
export type InputMedia = GrammyTypes["InputMedia"];
/** Represents a photo to be sent. */
export type InputMediaPhoto = GrammyTypes["InputMediaPhoto"];
/** Represents a video to be sent. */
export type InputMediaVideo = GrammyTypes["InputMediaVideo"];
/** Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent. */
export type InputMediaAnimation = GrammyTypes["InputMediaAnimation"];
/** Represents an audio file to be treated as music to be sent. */
export type InputMediaAudio = GrammyTypes["InputMediaAudio"];
/** Represents a general file to be sent. */
export type InputMediaDocument = GrammyTypes["InputMediaDocument"];
