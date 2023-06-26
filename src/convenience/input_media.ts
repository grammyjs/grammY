import {
    type InputFile,
    type InputMediaAnimation,
    type InputMediaAudio,
    type InputMediaDocument,
    type InputMediaPhoto,
    type InputMediaVideo,
} from "../types.ts";

type InputMediaOptions<T> = Omit<T, "type" | "media">;

/**
 * Holds a number of helper methods for building `InputMedia*` objects. They are
 * useful when sending media groups and when editing media messages.
 *
 * For example, media groups can be sent like this.
 *
 * ```ts
 * const paths = [
 *     '/tmp/pic0.jpg',
 *     '/tmp/pic1.jpg',
 *     '/tmp/pic2.jpg',
 * ]
 * const files = paths.map((path) => new InputFile(path))
 * const media = files.map((file) => InputMediaBuilder.photo(file))
 * await bot.api.sendMediaGroup(chatId, media)
 * ```
 *
 * Media can be edited like this.
 *
 * ```ts
 * const file = new InputFile('/tmp/pic0.jpg')
 * const media = InputMediaBuilder.photo(file, {
 *     caption: 'new caption'
 * })
 * await bot.api.editMessageMedia(chatId, messageId, media)
 * ```
 */
export const InputMediaBuilder = {
    /**
     * Creates a new `InputMediaPhoto` object as specified by
     * https://core.telegram.org/bots/api#inputmediaphoto.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    photo(
        media: string | InputFile,
        options: InputMediaOptions<InputMediaPhoto> = {},
    ): InputMediaPhoto {
        return { type: "photo", media, ...options };
    },
    /**
     * Creates a new `InputMediaVideo` object as specified by
     * https://core.telegram.org/bots/api#inputmediavideo.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    video(
        media: string | InputFile,
        options: InputMediaOptions<InputMediaVideo> = {},
    ): InputMediaVideo {
        return { type: "video", media, ...options };
    },
    /**
     * Creates a new `InputMediaAnimation` object as specified by
     * https://core.telegram.org/bots/api#inputmediaanimation.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    animation(
        media: string | InputFile,
        options: InputMediaOptions<InputMediaAnimation> = {},
    ): InputMediaAnimation {
        return { type: "animation", media, ...options };
    },
    /**
     * Creates a new `InputMediaAudio` object as specified by
     * https://core.telegram.org/bots/api#inputmediaaudio.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    audio(
        media: string | InputFile,
        options: InputMediaOptions<InputMediaAudio> = {},
    ): InputMediaAudio {
        return { type: "audio", media, ...options };
    },
    /**
     * Creates a new `InputMediaDocument` object as specified by
     * https://core.telegram.org/bots/api#inputmediadocument.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    document(
        media: string | InputFile,
        options: InputMediaOptions<InputMediaDocument> = {},
    ): InputMediaDocument {
        return { type: "document", media, ...options };
    },
};
