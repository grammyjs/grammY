import { InputFileProxy } from "@grammyjs/types";
import { Agent } from "https";
import { basename } from "path";
import { Readable } from "stream";
import type { ReadStream } from "fs";

export * from "@grammyjs/types";
export { debug } from "debug";
// Turn a file path into an AsyncIterable<Uint8Array>
export { createReadStream as streamFile } from "fs";

// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) =>
  Readable.from(itr, { objectMode: false });

// Base configuration for `fetch` calls
export const baseFetchConfig = {
  compress: true,
  agent: new Agent({ keepAlive: true }),
};

// Accessor for file data in `InputFile` instances
export const inputFileData = Symbol("InputFile data");

/**
 * An `InputFile` wraps a number of different sources for [sending
 * files](https://grammy.dev/guide/files.html#uploading-your-own-file).
 *
 * It corresponds to the `InputFile` type in the [Telegram Bot API
 * Reference](https://core.telegram.org/bots/api#inputfile).
 */
export class InputFile {
  public readonly [inputFileData]: ConstructorParameters<typeof InputFile>[0];
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
    file: string | Uint8Array | ReadStream | AsyncGenerator<Uint8Array>,
    filename?: string
  ) {
    this[inputFileData] = file;
    if (filename === undefined && typeof file === "string")
      filename = basename(file);
    this.filename = filename;
  }
}

// CUSTOM INPUT FILE TYPES

type GrammyTypes = InputFileProxy<InputFile>;

/** Wrapper type to bundle all methods of the Telegram API */
export type Telegram = GrammyTypes["Telegram"];

/** Utility type providing the argument type for the given method name or `{}` if the method does not take any parameters */
export type Opts<
  M extends keyof GrammyTypes["Telegram"]
> = GrammyTypes["Opts"][M];

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
