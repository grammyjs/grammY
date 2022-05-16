import { InputMedia, InputMediaAnimation, InputMediaAudio, InputMediaDocument, InputMediaPhoto, InputMediaVideo } from "../../platform.deno.ts";


export class InputMediaBuilder {
    public readonly media: InputMedia[] = []

    add(...media: InputMedia[]) {
        this.media.push(...media);
    }

    photo(photo: Omit<InputMediaPhoto, 'type'>) {
        this.media.push({ type: 'photo', ...photo });
    }

    video(video: Omit<InputMediaVideo, 'type'>) {
        this.media.push({ type: 'video', ...video });
    }

    animation(animation: Omit<InputMediaAnimation, 'type'>) {
        this.media.push({ type: 'animation', ...animation });
    }

    audio(audio: Omit<InputMediaAudio, 'type'>) {
        this.media.push({ type: 'audio', ...audio });
    }

    document(document: Omit<InputMediaDocument, 'type'>) {
        this.media.push({ type: 'document', ...document });
    }

    build() {
        return this.media;
    }
}
