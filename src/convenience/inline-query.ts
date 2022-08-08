import {
    type InlineQueryResult,
    type InlineQueryResultArticle,
    type InlineQueryResultAudio,
    type InlineQueryResultCachedAudio,
    type InlineQueryResultCachedDocument,
    type InlineQueryResultCachedGif,
    type InlineQueryResultCachedMpeg4Gif,
    type InlineQueryResultCachedPhoto,
    type InlineQueryResultCachedSticker,
    type InlineQueryResultCachedVideo,
    type InlineQueryResultCachedVoice,
    type InlineQueryResultContact,
    type InlineQueryResultDocument,
    type InlineQueryResultGame,
    type InlineQueryResultGif,
    type InlineQueryResultLocation,
    type InlineQueryResultMpeg4Gif,
    type InlineQueryResultPhoto,
    type InlineQueryResultVenue,
    type InlineQueryResultVideo,
    type InlineQueryResultVoice,
} from "../platform.deno.ts";

export type WithoutType<T extends InlineQueryResult> = Omit<T, "type">;

/**
 * Use this class to simply building as single inline query result object.
 *
 * ```ts
 * const article = InlineQueryResultBuilder.article({ id: 'id' });
 * ```
 *
 * Be sure to check the [documentation](https://core.telegram.org/bots/api#inlinequeryresult) on inline query result in grammY.
 */
export class InlineQueryResultBuilder {
    private static build<T extends InlineQueryResult = InlineQueryResult>(
        options: T
    ): T {
        return options;
    }

    static article(options: WithoutType<InlineQueryResultArticle>) {
        return this.build<InlineQueryResultArticle>({
            type: "article",
            ...options,
        });
    }

    static audio(options: WithoutType<InlineQueryResultAudio>) {
        return this.build<InlineQueryResultAudio>({
            type: "audio",
            ...options,
        });
    }

    static audioCache(options: WithoutType<InlineQueryResultCachedAudio>) {
        return this.build<InlineQueryResultCachedAudio>({
            type: "audio",
            ...options,
        });
    }

    static contact(options: WithoutType<InlineQueryResultContact>) {
        return this.build<InlineQueryResultContact>({
            type: "contact",
            ...options,
        });
    }

    static document(options: WithoutType<InlineQueryResultDocument>) {
        return this.build<InlineQueryResultDocument>({
            type: "document",
            ...options,
        });
    }

    static documentCache(
        options: WithoutType<InlineQueryResultCachedDocument>
    ) {
        return this.build<InlineQueryResultCachedDocument>({
            type: "document",
            ...options,
        });
    }

    static game(options: WithoutType<InlineQueryResultGame>) {
        return this.build<InlineQueryResultGame>({
            type: "game",
            ...options,
        });
    }

    static gif(options: WithoutType<InlineQueryResultGif>) {
        return this.build<InlineQueryResultGif>({
            type: "gif",
            ...options,
        });
    }

    static gifCache(options: WithoutType<InlineQueryResultCachedGif>) {
        return this.build<InlineQueryResultCachedGif>({
            type: "gif",
            ...options,
        });
    }

    static location(options: WithoutType<InlineQueryResultLocation>) {
        return this.build<InlineQueryResultLocation>({
            type: "location",
            ...options,
        });
    }

    static mpeg4gif(options: WithoutType<InlineQueryResultMpeg4Gif>) {
        return this.build<InlineQueryResultMpeg4Gif>({
            type: "mpeg4_gif",
            ...options,
        });
    }

    static mpeg4gifCache(
        options: WithoutType<InlineQueryResultCachedMpeg4Gif>
    ) {
        return this.build<InlineQueryResultCachedMpeg4Gif>({
            type: "mpeg4_gif",
            ...options,
        });
    }

    static photo(options: WithoutType<InlineQueryResultPhoto>) {
        return this.build<InlineQueryResultPhoto>({
            type: "photo",
            ...options,
        });
    }

    static photoCache(options: WithoutType<InlineQueryResultCachedPhoto>) {
        return this.build<InlineQueryResultCachedPhoto>({
            type: "photo",
            ...options,
        });
    }

    static venue(options: WithoutType<InlineQueryResultVenue>) {
        return this.build<InlineQueryResultVenue>({
            type: "venue",
            ...options,
        });
    }

    static video(options: WithoutType<InlineQueryResultVideo>) {
        return this.build<InlineQueryResultVideo>({
            type: "video",
            ...options,
        });
    }

    static videoCache(options: WithoutType<InlineQueryResultCachedVideo>) {
        return this.build<InlineQueryResultCachedVideo>({
            type: "video",
            ...options,
        });
    }

    static stickerCache(options: WithoutType<InlineQueryResultCachedSticker>) {
        return this.build<InlineQueryResultCachedSticker>({
            type: "sticker",
            ...options,
        });
    }

    static voice(options: WithoutType<InlineQueryResultVoice>) {
        return this.build<InlineQueryResultVoice>({
            type: "voice",
            ...options,
        });
    }

    static voiceCache(options: WithoutType<InlineQueryResultCachedVoice>) {
        return this.build<InlineQueryResultCachedVoice>({
            type: "voice",
            ...options,
        });
    }
}
