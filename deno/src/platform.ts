const isDeno = typeof Deno !== 'undefined'

// === Needed imports
import { InputFileProxy } from 'https://cdn.skypack.dev/@grammyjs/types@v2.2.2?dts'
import { basename } from 'https://deno.land/std@0.100.0/path/mod.ts'
import {
    iter,
    readerFromIterable,
} from 'https://deno.land/std@0.100.0/io/mod.ts'

// === Export all API types
export * from 'https://cdn.skypack.dev/@grammyjs/types@v2.2.2?dts'

// === Export debug
import debug from 'https://cdn.skypack.dev/debug@^4.3.1'
export { debug }
if (isDeno) {
    debug.useColors = () => !Deno.noColor
    try {
        const val = Deno.env.get('DEBUG')
        if (val) debug.enable(val)
    } catch {
        // cannot access env var, treat as if it is not set
    }
}

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromIterable as itrToStream } from 'https://deno.land/std@0.100.0/io/mod.ts'
// Turn a file path into an AsyncIterable<Uint8Array>
export const streamFile = isDeno
    ? (path: string) => Deno.open(path).then(iter)
    : () => {
          throw new Error('Reading files by path requires a Deno environment')
      }
export {
    // Determine whether a file path is absolute
    isAbsolute as isAbsolutePath,
    // Turn a file path into a URL object
    toFileUrl as pathToUrl,
} from 'https://deno.land/std@0.100.0/path/mod.ts'
// Turn a link into a URL object
export const linkToUrl = (link: string) => new URL(link)
// Define URL type
export type URL = globalThis.URL
// Create a temporary file
export const createTempFile = () => Deno.makeTempFile()
// Copy a file from a URL to a file path
export const transferFile = async (url: URL, dest: string) => {
    if (url.protocol === 'file') {
        const src = url.pathname
        await Deno.copyFile(src, dest)
    } else {
        const { body } = await fetch(url)
        if (body === null) throw new Error('Download failed, no response body!')
        const reader = readerFromIterable(body)
        const writer = await Deno.open(dest, { write: true })
        try {
            await Deno.copy(reader, writer)
        } finally {
            writer.close()
        }
    }
}

// === Base configuration for `fetch` calls
export const baseFetchConfig = {}

// === InputFile handling and File augmenting
// Accessor for file data in `InputFile` instances
export const inputFileData = Symbol('InputFile data')

/**
 * An `InputFile` wraps a number of different sources for [sending
 * files](https://grammy.dev/guide/files.html#uploading-your-own-file).
 *
 * It corresponds to the `InputFile` type in the [Telegram Bot API
 * Reference](https://core.telegram.org/bots/api#inputfile).
 */
export class InputFile {
    public readonly [inputFileData]: ConstructorParameters<typeof InputFile>[0]
    /**
     * Optional name of the constructed `InputFile` instance.
     *
     * Check out the
     * [documenation](https://grammy.dev/guide/files.html#uploading-your-own-file)
     * on sending files with `InputFile`.
     */
    public readonly filename?: string
    /**
     * Constructs an `InputFile` that can be used in the API to send files.
     *
     * @param file A path to a local file or a `Buffer` or a `ReadableStream` that specifies the file data
     * @param filename Optional name of the file
     */
    constructor(
        file:
            | string
            | Uint8Array
            | ReadableStream<Uint8Array>
            | AsyncIterable<Uint8Array>,
        filename?: string
    ) {
        this[inputFileData] = file
        if (filename === undefined && typeof file === 'string')
            filename = basename(file)
        this.filename = filename
    }
}

// === Export InputFile types
type GrammyTypes = InputFileProxy<InputFile>

/** Wrapper type to bundle all methods of the Telegram API */
export type Telegram = GrammyTypes['Telegram']

/** Utility type providing the argument type for the given method name or `{}` if the method does not take any parameters */
export type Opts<M extends keyof GrammyTypes['Telegram']> =
    GrammyTypes['Opts'][M]

/** This object represents the content of a media message to be sent. It should be one of
- InputMediaAnimation
- InputMediaDocument
- InputMediaAudio
- InputMediaPhoto
- InputMediaVideo */
export type InputMedia = GrammyTypes['InputMedia']
/** Represents a photo to be sent. */
export type InputMediaPhoto = GrammyTypes['InputMediaPhoto']
/** Represents a video to be sent. */
export type InputMediaVideo = GrammyTypes['InputMediaVideo']
/** Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent. */
export type InputMediaAnimation = GrammyTypes['InputMediaAnimation']
/** Represents an audio file to be treated as music to be sent. */
export type InputMediaAudio = GrammyTypes['InputMediaAudio']
/** Represents a general file to be sent. */
export type InputMediaDocument = GrammyTypes['InputMediaDocument']
