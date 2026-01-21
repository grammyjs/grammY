import type {
    InputFile,
    InputMediaAnimation,
    InputMediaAudio,
    InputMediaDocument,
    InputMediaPhoto,
    InputMediaVideo,
} from "../types.ts";

export type InputMediaOptions<T> = Omit<T, "type" | "media">;

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
export interface InputMediaBuilder {
    /**
     * Creates a new `InputMediaPhoto` object as specified by
     * https://core.telegram.org/bots/api#inputmediaphoto.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    photo(
        media: string | InputFile,
        options?: InputMediaOptions<InputMediaPhoto>,
    ): InputMediaPhoto;
    /**
     * Creates a new `InputMediaVideo` object as specified by
     * https://core.telegram.org/bots/api#inputmediavideo.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    video(
        media: string | InputFile,
        options?: InputMediaOptions<InputMediaVideo>,
    ): InputMediaVideo;
    /**
     * Creates a new `InputMediaAnimation` object as specified by
     * https://core.telegram.org/bots/api#inputmediaanimation.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    animation(
        media: string | InputFile,
        options?: InputMediaOptions<InputMediaAnimation>,
    ): InputMediaAnimation;
    /**
     * Creates a new `InputMediaAudio` object as specified by
     * https://core.telegram.org/bots/api#inputmediaaudio.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    audio(
        media: string | InputFile,
        options?: InputMediaOptions<InputMediaAudio>,
    ): InputMediaAudio;
    /**
     * Creates a new `InputMediaDocument` object as specified by
     * https://core.telegram.org/bots/api#inputmediadocument.
     *
     * @param media An `InputFile` instance or a file identifier
     * @param options Remaining optional options
     */
    document(
        media: string | InputFile,
        options?: InputMediaOptions<InputMediaDocument>,
    ): InputMediaDocument;
}
export const InputMediaBuilder: InputMediaBuilder = {
    photo(media, options = {}) {
        return { type: "photo", media, ...options };
    },
    video(media, options = {}) {
        return { type: "video", media, ...options };
    },
    animation(media, options = {}) {
        return { type: "animation", media, ...options };
    },
    audio(media, options = {}) {
        return { type: "audio", media, ...options };
    },
    document(media, options = {}) {
        return { type: "document", media, ...options };
    },
};
