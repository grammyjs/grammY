/** Are we running on Deno or in a web browser? */
const isDeno = typeof Deno !== "undefined";

// === Needed imports
import { InputFileProxy } from "https://cdn.skypack.dev/@grammyjs/types@v2.3.1?dts";
import { basename } from "https://deno.land/std@0.113.0/path/mod.ts";
import { iterateReader } from "https://deno.land/std@0.113.0/streams/mod.ts";

// === Export all API types
export * from "https://cdn.skypack.dev/@grammyjs/types@v2.3.1?dts";

// === Export debug
import debug from "https://cdn.skypack.dev/debug@^4.3.2";
export { debug };
if (isDeno) {
    debug.useColors = () => !Deno.noColor;
    try {
        const val = Deno.env.get("DEBUG");
        if (val) debug.enable(val);
    } catch {
        // cannot access env var, treat as if it is not set
    }
}

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromIterable as itrToStream } from "https://deno.land/std@0.113.0/streams/mod.ts";

// === Base configuration for `fetch` calls
export const baseFetchConfig = {};

/** Something that looks like a URL. */
interface URLLike {
    /**
     * Identifier of the resouce. Must be in a format that can be parsed by the
     * URL constructor.
     */
    url: string;
}

// === InputFile handling and File augmenting
// Accessor for file data in `InputFile` instances
export const toRaw = Symbol("InputFile data");
type MaybePromise<T> = T | Promise<T>;

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
     * @param file A path to a local file or a `Buffer` or a `ReadableStream` that specifies the file data
     * @param filename Optional name of the file
     */
    constructor(
        file: MaybePromise<
            | string
            | Blob
            | URL
            | URLLike
            | Uint8Array
            | ReadableStream<Uint8Array>
            | AsyncIterable<Uint8Array>
        >,
        filename?: string,
    ) {
        this.fileData = file;
        if (filename === undefined && typeof file === "string") {
            filename = basename(file);
        }
        this.filename = filename;
    }
    async [toRaw](): Promise<Uint8Array | AsyncIterable<Uint8Array>> {
        if (this.consumed) {
            throw new Error("Cannot reuse InputFile data source!");
        }
        const data = await this.fileData;
        // Handle local files
        if (typeof data === "string") {
            if (!isDeno) {
                throw new Error(
                    "Reading files by path requires a Deno environment",
                );
            }
            const file = await Deno.open(data);
            return iterateReader(file);
        }
        if (data instanceof Blob) return data.stream();
        // Handle URL and URLLike
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
        throw new Error(
            `Download failed, no response body from '${url}'`,
        );
    }
    yield* body;
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
