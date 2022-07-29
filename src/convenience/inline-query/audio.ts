import {
    InlineKeyboardMarkup,
    InlineQueryResult,
    InlineQueryResultAudio,
    InlineQueryResultCachedAudio,
    InputMessageContent,
    MessageEntity,
    ParseMode,
} from "../../platform.deno.ts";
import { BaseInlineQueryResultBuilder, NewObj } from "./base.ts";

type Audio<
    Prev extends BaseAudioType,
    Key extends keyof InlineQueryResultAudio
> = InlineQueryResultAudioBuilder<NewObj<Prev, InlineQueryResultAudio, Key>>;

type BaseAudioType = Pick<InlineQueryResultAudio, "type">;

abstract class BaseInlineQueryResultAudioBuilder<
    TObj extends BaseAudioType = BaseAudioType
> extends BaseInlineQueryResultBuilder<TObj> {
    protected caption(caption: string) {
        return this.add("caption", caption);
    }

    public parseMode(mode: ParseMode) {
        return this.add("parse_mode", mode);
    }

    public replyMarkup(replyMarkup: InlineKeyboardMarkup) {
        return this.add("reply_markup", replyMarkup) as Audio<
            TObj,
            "reply_markup"
        >;
    }

    public captionEntities(...captionEntities: Array<MessageEntity>) {
        return this.add("caption_entities", captionEntities) as Audio<
            TObj,
            "caption_entities"
        >;
    }

    public inputMessageContent(inputMessageContent: InputMessageContent) {
        return this.add("input_message_content", inputMessageContent) as Audio<
            TObj,
            "input_message_content"
        >;
    }
}

export class InlineQueryResultAudioBuilder<
    TObj extends BaseAudioType = BaseAudioType
> extends BaseInlineQueryResultAudioBuilder<TObj> {
    constructor() {
        super({ type: "audio" });
    }

    public audioDuration(audioDuration: number) {
        return this.add("audio_duration", audioDuration) as Audio<
            TObj,
            "audio_duration"
        >;
    }

    public id(id: string): Audio<TObj, "id"> {
        return super.id(id) as Audio<TObj, "id">;
    }

    public url(url: string) {
        return this.add("audio_url", url) as Audio<TObj, "audio_url">;
    }

    public title(title: string) {
        return this.add("title", title) as Audio<TObj, "title">;
    }

    public cached() {
        return new CachedInlineQueryResultAudioBuilder(this.build());
    }

    public performer(performer: string) {
        return this.add("performer", performer) as Audio<TObj, "performer">;
    }
}

type CachedAudio<
    Prev extends BaseAudioType,
    Key extends keyof InlineQueryResultCachedAudio
> = InlineQueryResultAudioBuilder<
    NewObj<Prev, InlineQueryResultCachedAudio, Key>
>;

class CachedInlineQueryResultAudioBuilder<
    TObj extends BaseAudioType = BaseAudioType
> extends BaseInlineQueryResultAudioBuilder<TObj> {
    constructor(values: TObj) {
        super(values);
    }

    public audioFileId(audioFileId: string) {
        return this.add("audio_file_id", audioFileId) as CachedAudio<
            TObj,
            "audio_file_id"
        >;
    }
}
