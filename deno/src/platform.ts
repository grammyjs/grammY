import { InputFileProxy } from 'https://cdn.skypack.dev/@grammyjs/types@v2.1.3?dts'
import { basename } from 'https://deno.land/std@0.87.0/path/mod.ts'

export * from 'https://cdn.skypack.dev/@grammyjs/types@v2.1.3?dts'

import debug from 'https://cdn.skypack.dev/debug@^4.3.1'
export { debug }

const isDeno = typeof Deno !== 'undefined'

if (isDeno) {
    debug.useColors = () => !Deno.noColor
    const env = { name: 'env', variable: 'DEBUG' } as const
    let res = await Deno.permissions.query(env)
    if (res.state === 'prompt') res = await Deno.permissions.request(env)
    if (res.state === 'granted') {
        const val = Deno.env.get(env.variable)
        if (val) debug.enable(val)
    }
}

// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromAsyncIterator as itrToStream } from 'https://deno.land/std@0.87.0/io/streams.ts'
// Turn a file path into an AsyncIterable<Uint8Array>
export const streamFile = isDeno
    ? (path: string) => Deno.open(path).then(Deno.iter)
    : () => {
          throw new Error('Reading files by path requires a Deno environment')
      }

// Base configuration for `fetch` calls
export const baseFetchConfig = {}

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

// CUSTOM INPUT FILE TYPES

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
