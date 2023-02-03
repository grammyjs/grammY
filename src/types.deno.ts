// === Needed imports
import { basename } from "https://deno.land/std@0.176.0/path/mod.ts";
import { iterateReader } from "https://deno.land/std@0.176.0/streams/mod.ts";
import { type InputFileProxy } from "https://esm.sh/@grammyjs/types@2.12.0";
import { debug as d, isDeno, toRaw } from "./platform.deno.ts";

const debug = d("grammy:warn");

// === Export all API types
export * from "https://esm.sh/@grammyjs/types@2.12.0";

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
        file:
            | string
            | Blob
            | Deno.FsFile
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
        if (typeof file !== "object") return undefined;
        if ("url" in file) return basename(file.url);
        if (!(file instanceof URL)) return undefined;
        return basename(file.pathname) || basename(file.hostname);
    }
    async [toRaw](): Promise<
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
            return iterateReader(file);
        }
        if (data instanceof Blob) return data.stream();
        if (isDenoFile(data)) return iterateReader(data);
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
function isDenoFile(data: unknown): data is Deno.FsFile {
    return isDeno && data instanceof Deno.FsFile;
}

// === Export InputFile types
type GrammyTypes = InputFileProxy<InputFile>;

/** Wrapper type to bundle all methods of the Telegram API */
export type ApiMethods = GrammyTypes["Telegram"];

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
