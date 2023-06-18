import {
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
    type InputInvoiceMessageContent,
    type InputMessageContent,
    type InputTextMessageContent,
} from "../types.ts";

type InlineQueryResultOptions<T, K extends keyof T> = Omit<
    T,
    "type" | "id" | "input_message_content" | K
>;

/**
 * Use this class to simply building as single inline query result object.
 *
 * ```ts
 * const article = InlineQueryResultBuilder.article('id', 'title', 'text');
 * ```
 *
 * Be sure to check the
 * [documentation](https://core.telegram.org/bots/api#inlinequeryresult) on
 * inline query result in grammY.
 */
export const InlineQueryResultBuilder = {
    article(
        id: string,
        title: string,
        message_text: string | InputTextMessageContent,
        options: InlineQueryResultOptions<
            InlineQueryResultArticle,
            "title"
        >,
    ): InlineQueryResultArticle {
        return {
            type: "article",
            id,
            title,
            input_message_content: typeof message_text === "string"
                ? { message_text }
                : message_text,
            ...options,
        };
    },
    audio(
        id: string,
        title: string,
        audio_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultAudio,
            "title" | "audio_url"
        > = {},
    ): InlineQueryResultAudio {
        return {
            type: "audio",
            id,
            title,
            audio_url,
            ...options,
        };
    },
    audioCached(
        id: string,
        audio_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedAudio,
            "audio_file_id"
        > = {},
    ): InlineQueryResultCachedAudio {
        return {
            type: "audio",
            id,
            audio_file_id,
            ...options,
        };
    },
    contact(
        id: string,
        phone_number: string,
        first_name: string,
        options: InlineQueryResultOptions<
            InlineQueryResultContact,
            "phone_number" | "first_name"
        > = {},
    ): InlineQueryResultContact {
        return {
            type: "contact",
            id,
            phone_number,
            first_name,
            ...options,
        };
    },
    documentPdf(
        id: string,
        title: string,
        document_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultDocument,
            "mime_type" | "title" | "document_url"
        > = {},
    ): InlineQueryResultDocument {
        return {
            type: "document",
            mime_type: "application/pdf",
            id,
            title,
            document_url,
            ...options,
        };
    },
    documentZip(
        id: string,
        title: string,
        document_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultDocument,
            "mime_type" | "title" | "document_url"
        > = {},
    ): InlineQueryResultDocument {
        return {
            type: "document",
            mime_type: "application/zip",
            id,
            title,
            document_url,
            ...options,
        };
    },
    documentCached(
        id: string,
        title: string,
        document_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedDocument,
            "title" | "document_file_id"
        > = {},
    ): InlineQueryResultCachedDocument {
        return {
            type: "document",
            id,
            title,
            document_file_id,
            ...options,
        };
    },
    game(
        id: string,
        game_short_name: string,
        options: InlineQueryResultOptions<
            InlineQueryResultGame,
            "game_short_name"
        > = {},
    ): InlineQueryResultGame {
        return {
            type: "game",
            id,
            game_short_name,
            ...options,
        };
    },
    gif(
        id: string,
        gif_url: string,
        thumbnail_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultGif,
            "gif_url" | "thumbnail_url"
        > = {},
    ): InlineQueryResultGif {
        return {
            type: "gif",
            id,
            gif_url,
            thumbnail_url,
            ...options,
        };
    },
    gifCached(
        id: string,
        gif_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedGif,
            "gif_file_id"
        > = {},
    ): InlineQueryResultCachedGif {
        return {
            type: "gif",
            id,
            gif_file_id,
            ...options,
        };
    },
    invoice(
        id: string,
        title: string,
        input_message_content: InputInvoiceMessageContent,
        options: InlineQueryResultOptions<
            InlineQueryResultArticle,
            "title"
        > = {},
    ): InlineQueryResultArticle {
        return {
            type: "article",
            id,
            title,
            input_message_content,
            ...options,
        };
    },
    location(
        id: string,
        title: string,
        latitude: number,
        longitude: number,
        options: InlineQueryResultOptions<
            InlineQueryResultLocation,
            "title" | "latitude" | "longitude"
        > = {},
    ): InlineQueryResultLocation {
        return {
            type: "location",
            id,
            title,
            latitude,
            longitude,
            ...options,
        };
    },
    mpeg4gif(
        id: string,
        mpeg4_url: string,
        thumbnail_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultMpeg4Gif,
            "mpeg4_url" | "thumbnail_url"
        > = {},
    ): InlineQueryResultMpeg4Gif {
        return {
            type: "mpeg4_gif",
            id,
            mpeg4_url,
            thumbnail_url,
            ...options,
        };
    },
    mpeg4gifCached(
        id: string,
        mpeg4_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedMpeg4Gif,
            "mpeg4_file_id"
        > = {},
    ): InlineQueryResultCachedMpeg4Gif {
        return {
            type: "mpeg4_gif",
            id,
            mpeg4_file_id,
            ...options,
        };
    },
    photo(
        id: string,
        photo_url: string,
        thumbnail_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultPhoto,
            "photo_url" | "thumbnail_url"
        > = {},
    ): InlineQueryResultPhoto {
        return {
            type: "photo",
            id,
            photo_url,
            thumbnail_url,
            ...options,
        };
    },
    photoCached(
        id: string,
        photo_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedPhoto,
            "photo_file_id"
        > = {},
    ): InlineQueryResultCachedPhoto {
        return {
            type: "photo",
            id,
            photo_file_id,
            ...options,
        };
    },
    stickerCached(
        id: string,
        sticker_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedSticker,
            "sticker_file_id"
        > = {},
    ): InlineQueryResultCachedSticker {
        return {
            type: "sticker",
            id,
            sticker_file_id,
            ...options,
        };
    },
    venue(
        id: string,
        title: string,
        latitude: number,
        longitude: number,
        address: string,
        options: InlineQueryResultOptions<
            InlineQueryResultVenue,
            "title" | "latitude" | "longitude" | "address"
        > = {},
    ): InlineQueryResultVenue {
        return {
            type: "venue",
            id,
            title,
            latitude,
            longitude,
            address,
            ...options,
        };
    },
    videoHtml(
        id: string,
        title: string,
        video_url: string,
        thumbnail_url: string,
        input_message_content: InputMessageContent,
        options: InlineQueryResultOptions<
            InlineQueryResultVideo,
            "mime_type" | "title" | "video_url" | "thumbnail_url"
        > = {},
    ): InlineQueryResultVideo {
        return {
            type: "video",
            mime_type: "text/html",
            id,
            title,
            video_url,
            thumbnail_url,
            input_message_content,
            ...options,
        };
    },
    videoMp4(
        id: string,
        title: string,
        video_url: string,
        thumbnail_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultVideo,
            "mime_type" | "title" | "video_url" | "thumbnail_url"
        > = {},
    ): InlineQueryResultVideo {
        return {
            type: "video",
            mime_type: "video/mp4",
            id,
            title,
            video_url,
            thumbnail_url,
            ...options,
        };
    },
    videoCached(
        id: string,
        title: string,
        video_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedVideo,
            "title" | "video_file_id"
        > = {},
    ): InlineQueryResultCachedVideo {
        return {
            type: "video",
            id,
            title,
            video_file_id,
            ...options,
        };
    },
    voice(
        id: string,
        title: string,
        voice_url: string,
        options: InlineQueryResultOptions<
            InlineQueryResultVoice,
            "title" | "voice_url"
        > = {},
    ): InlineQueryResultVoice {
        return {
            type: "voice",
            id,
            title,
            voice_url,
            ...options,
        };
    },
    voiceCached(
        id: string,
        title: string,
        voice_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedVoice,
            "title" | "voice_file_id"
        > = {},
    ): InlineQueryResultCachedVoice {
        return {
            type: "voice",
            id,
            title,
            voice_file_id,
            ...options,
        };
    },
};
