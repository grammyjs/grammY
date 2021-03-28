import { InputFileProxy } from 'https://cdn.skypack.dev/@grammyjs/types@v1.0.2?dts'
import { basename } from 'https://deno.land/std@0.87.0/path/mod.ts'

export { debug } from 'https://deno.land/x/debug@0.2.0/mod.ts'
export * from 'https://cdn.skypack.dev/@grammyjs/types@v1.0.2?dts'

// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromAsyncIterator as itrToStream } from 'https://deno.land/std@0.87.0/io/streams.ts'
// Turn a file path into an AsyncIterable<Uint8Array>
export const streamFile = (path: string) => Deno.open(path).then(Deno.iter)

// Base configuration for `fetch` calls
export const baseFetchConfig = {}

/** This object represents the contents of a file to be uploaded. Must be posted using multipart/form-data in the usual way that files are uploaded via the browser. */
export class InputFile {
    public readonly filename?: string
    /**
     * Constructs an `InputFile` that can be used in the API to send files.
     *
     * @param file a path to a local file or a `Buffer` or a `ReadableStream` that specifies the file data
     * @param filename optional name of the file
     */
    constructor(
        public readonly file:
            | string
            | Uint8Array
            | ReadableStream
            | AsyncGenerator<Uint8Array>,
        filename?: string
    ) {
        if (filename === undefined && typeof file === 'string')
            filename = basename(file)
        this.filename = filename
    }
}

// CUSTOM TYPEGRAM TYPES

type GrammyTypes = InputFileProxy<InputFile>

/** Wrapper type to bundle all methods of the Telegram API */
export type Telegram = GrammyTypes['Telegram']

/** Utility type providing the argument type for the given method name or `{}` if the method does not take any parameters */
export type Opts<
    M extends keyof GrammyTypes['Telegram']
> = GrammyTypes['Opts'][M]

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
