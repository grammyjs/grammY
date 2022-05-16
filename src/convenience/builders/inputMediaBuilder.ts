import { InputMedia, InputMediaAnimation, InputMediaAudio, InputMediaDocument, InputMediaPhoto, InputMediaVideo } from "../../platform.deno.ts";


export class InputMediaBuilder {
    /**
     * The nested array that holds the media.
     */
    public readonly media: InputMedia[] = []

    /**
     * Allows you to add a `InputMedia`.
     *
     * @param media The media to add
     */
    add(...media: InputMedia[]) {
        this.media.push(...media);
    }

    /**
     * Add a `InputMediaPhoto`.
     *
     * @param photo The photo to add
     */
    photo(photo: Omit<InputMediaPhoto, 'type'>) {
        this.media.push({ type: 'photo', ...photo });
    }

    /**
     * Add a `InputMediaVideo`.
     *
     * @param video The video to add
     */
    video(video: Omit<InputMediaVideo, 'type'>) {
        this.media.push({ type: 'video', ...video });
    }

    /**
     * Add a `InputMediaAnimation`.
     *
     * @param animation The animation to add
     */
    animation(animation: Omit<InputMediaAnimation, 'type'>) {
        this.media.push({ type: 'animation', ...animation });
    }

    /**
     * Add a `InputMediaAudio`.
     *
     * @param audio The audio to add
     */
    audio(audio: Omit<InputMediaAudio, 'type'>) {
        this.media.push({ type: 'audio', ...audio });
    }

    /**
     * Add a `InputMediaDocument`.
     *
     * @param document The document to add
     */
    document(document: Omit<InputMediaDocument, 'type'>) {
        this.media.push({ type: 'document', ...document });
    }

    /**
     * Return an array of `InputMedia` objects. You can use it
     * in `sendMediaGroup`.
     */
    build() {
        return this.media;
    }
}
