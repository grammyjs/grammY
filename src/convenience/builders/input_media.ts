import {
    InputMedia,
    InputMediaAnimation,
    InputMediaAudio,
    InputMediaDocument,
    InputMediaPhoto,
    InputMediaVideo,
} from "../../platform.deno.ts";

export class InputMediaBuilder {
    /**
     * The nested array that holds the media.
     */
    public readonly media: InputMedia[] = [];
    /**
     * Allows you to add a `InputMedia`.
     *
     * @param media The media to add
     */
    add(...media: InputMedia[]) {
        this.media.push(...media);
        return this;
    }
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
     * Return an array of `InputMedia` objects. You can use it
     * in `sendMediaGroup`.
     */
    build() {
        return this.media;
    }
    /**
     * Staic method to create an `InputMediaBuilder`.
     *
     * @param media The media to add
     */
    static from(media: InputMedia[]) {
        const builder = new InputMediaBuilder();
        builder.add(...media);
        return builder;
    }
}
