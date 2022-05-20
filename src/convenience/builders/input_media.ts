import {
    type InputMedia,
    type InputMediaAnimation,
    type InputMediaAudio,
    type InputMediaDocument,
    type InputMediaPhoto,
    type InputMediaVideo,
} from "../../platform.deno.ts";

class GenericInputMediaBuilder<T extends InputMedia = InputMedia> {
    /**
     * Initialize a new `InputMediaBuilder` with optional `InputMedia` array.
     *
     * @param media The media to initialize the builder with
     */
    constructor(public readonly media: T[] = []) {
    }
    /**
     * Allows you to add a `InputMedia`.
     *
     * @param media The media to add
     */
    add(...media: T[]) {
        this.media.push(...media);
        return this;
    }
    /**
     * Return an array of `InputMedia` objects. You can use it
     * in `sendMediaGroup`.
     */
    build() {
        return this.media;
    }
}

export class InputMediaBuilder extends GenericInputMediaBuilder {
    /**
     * Add a `InputMediaPhoto`.
     *
     * @param photo The photo to add
     */
    photo(photo: Omit<InputMediaPhoto, "type">) {
        return this.add({ type: "photo", ...photo });
    }
    /**
     * Add a `InputMediaVideo`.
     *
     * @param video The video to add
     */
    video(video: Omit<InputMediaVideo, "type">) {
        return this.add({ type: "video", ...video });
    }
    /**
     * Add a `InputMediaAnimation`.
     *
     * @param animation The animation to add
     */
    animation(animation: Omit<InputMediaAnimation, "type">) {
        return this.add({ type: "animation", ...animation });
    }
    /**
     * Add a `InputMediaAudio`.
     *
     * @param audio The audio to add
     */
    audio(audio: Omit<InputMediaAudio, "type">) {
        return this.add({ type: "audio", ...audio });
    }
    /**
     * Add a `InputMediaDocument`.
     *
     * @param document The document to add
     */
    document(document: Omit<InputMediaDocument, "type">) {
        return this.add({ type: "document", ...document });
    }
    /**
     * Staic method to create an `InputMediaBuilder`.
     *
     * @param media The media to add
     */
    static from(media: InputMedia[]) {
        return new InputMediaBuilder(media);
    }
    /**
     * Static method to create an `InputMediaBuilder` from a `type`.
     *
     * @param media The media to add
     * @param type The type of media
     */
    static fromType<T extends InputMedia = InputMedia>(media: Omit<T, "type">[], type: T["type"]) {
        return new GenericInputMediaBuilder<T>(media.map((m) => ({ ...m, type } as T)));
    }
}
