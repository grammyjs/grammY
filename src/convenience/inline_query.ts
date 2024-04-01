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
    type InputContactMessageContent,
    type InputInvoiceMessageContent,
    type InputLocationMessageContent,
    type InputTextMessageContent,
    type InputVenueMessageContent,
    type LabeledPrice,
} from "../types.ts";

type InlineQueryResultOptions<T, K extends keyof T> = Omit<
    T,
    "type" | "id" | "input_message_content" | K
>;

type OptionalKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never };
type OptionalFields<T> = Pick<T, OptionalKeys<T>[keyof T]>;

function inputMessage<R extends InlineQueryResult>(queryTemplate: R) {
    return {
        ...queryTemplate,
        ...inputMessageMethods<R>(queryTemplate),
    };
}
function inputMessageMethods<R extends InlineQueryResult>(
    queryTemplate: Omit<R, "input_message_content">,
) {
    return {
        text(
            message_text: string,
            options: OptionalFields<InputTextMessageContent> = {},
        ) {
            const content: InputTextMessageContent = {
                message_text,
                ...options,
            };
            return { ...queryTemplate, input_message_content: content } as R;
        },
        location(
            latitude: number,
            longitude: number,
            options: OptionalFields<InputLocationMessageContent> = {},
        ) {
            const content: InputLocationMessageContent = {
                latitude,
                longitude,
                ...options,
            };
            return { ...queryTemplate, input_message_content: content } as R;
        },
        venue(
            title: string,
            latitude: number,
            longitude: number,
            address: string,
            options: OptionalFields<InputVenueMessageContent>,
        ) {
            const content: InputVenueMessageContent = {
                title,
                latitude,
                longitude,
                address,
                ...options,
            };
            return { ...queryTemplate, input_message_content: content } as R;
        },
        contact(
            first_name: string,
            phone_number: string,
            options: OptionalFields<InputContactMessageContent> = {},
        ) {
            const content: InputContactMessageContent = {
                first_name,
                phone_number,
                ...options,
            };
            return { ...queryTemplate, input_message_content: content } as R;
        },
        invoice(
            title: string,
            description: string,
            payload: string,
            provider_token: string,
            currency: string,
            prices: LabeledPrice[],
            options: OptionalFields<InputInvoiceMessageContent> = {},
        ) {
            const content: InputInvoiceMessageContent = {
                title,
                description,
                payload,
                provider_token,
                currency,
                prices,
                ...options,
            };
            return { ...queryTemplate, input_message_content: content } as R;
        },
    };
}

/**
 * Holds a number of helper methods for building `InlineQueryResult*` objects.
 *
 * For example, letting the user pick one out of three photos can be done like
 * this.
 *
 * ```ts
 * const results = [
 *     InlineQueryResultBuilder.photo('id0', 'https://grammy.dev/images/Y.png'),
 *     InlineQueryResultBuilder.photo('id1', 'https://grammy.dev/images/Y.png'),
 *     InlineQueryResultBuilder.photo('id2', 'https://grammy.dev/images/Y.png'),
 * ];
 * await ctx.answerInlineQuery(results)
 * ```
 *
 * If you want the message content to be different from the content in the
 * inline query result, you can perform another method call on the resulting
 * objects.
 *
 * ```ts
 * const results = [
 *     InlineQueryResultBuilder.photo("id0", "https://grammy.dev/images/Y.png")
 *         .text("Picked photo 0!"),
 *     InlineQueryResultBuilder.photo("id1", "https://grammy.dev/images/Y.png")
 *         .text("Picked photo 1!"),
 *     InlineQueryResultBuilder.photo("id2", "https://grammy.dev/images/Y.png")
 *         .text("Picked photo 2!"),
 * ];
 * await ctx.answerInlineQuery(results)
 * ```
 *
 * Be sure to check the
 * [documentation](https://core.telegram.org/bots/api#inline-mode) on inline
 * mode.
 */
export const InlineQueryResultBuilder = {
    /**
     * Builds an InlineQueryResultArticle object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultarticle. Requires you
     * to specify the actual message content by calling another function on the
     * object returned from this method.
     *
     * @param id Unique identifier for this result, 1-64 Bytes
     * @param title Title of the result
     * @param options Remaining options
     */
    article(
        id: string,
        title: string,
        options: InlineQueryResultOptions<
            InlineQueryResultArticle,
            "title"
        > = {},
    ) {
        return inputMessageMethods<InlineQueryResultArticle>(
            { type: "article", id, title, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultAudio object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultaudio.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Title
     * @param audio_url A valid URL for the audio file
     * @param options Remaining options
     */
    audio(
        id: string,
        title: string,
        audio_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultAudio,
            "title" | "audio_url"
        > = {},
    ) {
        return inputMessage<InlineQueryResultAudio>({
            type: "audio",
            id,
            title,
            audio_url: typeof audio_url === "string"
                ? audio_url
                : audio_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultCachedAudio object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcachedaudio.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param audio_file_id A valid file identifier for the audio file
     * @param options Remaining options
     */
    audioCached(
        id: string,
        audio_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedAudio,
            "audio_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedAudio>(
            { type: "audio", id, audio_file_id, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultContact object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcontact.
     *
     * @param id Unique identifier for this result, 1-64 Bytes
     * @param phone_number Contact's phone number
     * @param first_name Contact's first name
     * @param options Remaining options
     */
    contact(
        id: string,
        phone_number: string,
        first_name: string,
        options: InlineQueryResultOptions<
            InlineQueryResultContact,
            "phone_number" | "first_name"
        > = {},
    ) {
        return inputMessage<InlineQueryResultContact>(
            { type: "contact", id, phone_number, first_name, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultDocument object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultdocument with
     * mime_type set to "application/pdf".
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Title for the result
     * @param document_url A valid URL for the file
     * @param options Remaining options
     */
    documentPdf(
        id: string,
        title: string,
        document_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultDocument,
            "mime_type" | "title" | "document_url"
        > = {},
    ) {
        return inputMessage<InlineQueryResultDocument>({
            type: "document",
            mime_type: "application/pdf",
            id,
            title,
            document_url: typeof document_url === "string"
                ? document_url
                : document_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultDocument object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultdocument with
     * mime_type set to "application/zip".
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Title for the result
     * @param document_url A valid URL for the file
     * @param options Remaining options
     */
    documentZip(
        id: string,
        title: string,
        document_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultDocument,
            "mime_type" | "title" | "document_url"
        > = {},
    ) {
        return inputMessage<InlineQueryResultDocument>({
            type: "document",
            mime_type: "application/zip",
            id,
            title,
            document_url: typeof document_url === "string"
                ? document_url
                : document_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultCachedDocument object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcacheddocument.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Title for the result
     * @param document_file_id A valid file identifier for the file
     * @param options Remaining options
     */
    documentCached(
        id: string,
        title: string,
        document_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedDocument,
            "title" | "document_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedDocument>(
            { type: "document", id, title, document_file_id, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultGame object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultgame.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param game_short_name Short name of the game
     * @param options Remaining options
     */
    game(
        id: string,
        game_short_name: string,
        options: InlineQueryResultOptions<
            InlineQueryResultGame,
            "game_short_name"
        > = {},
    ) {
        return { type: "game", id, game_short_name, ...options };
    },
    /**
     * Builds an InlineQueryResultGif object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultgif.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param gif_url A valid URL for the GIF file. File size must not exceed 1MB
     * @param thumbnail_url URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
     * @param options Remaining options
     */
    gif(
        id: string,
        gif_url: string | URL,
        thumbnail_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultGif,
            "gif_url" | "thumbnail_url"
        > = {},
    ) {
        return inputMessage<InlineQueryResultGif>({
            type: "gif",
            id,
            gif_url: typeof gif_url === "string" ? gif_url : gif_url.href,
            thumbnail_url: typeof thumbnail_url === "string"
                ? thumbnail_url
                : thumbnail_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultCachedGif object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcachedgif.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param gif_file_id A valid file identifier for the GIF file
     * @param options Remaining options
     */
    gifCached(
        id: string,
        gif_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedGif,
            "gif_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedGif>(
            { type: "gif", id, gif_file_id, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultLocation object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultlocation.
     *
     * @param id Unique identifier for this result, 1-64 Bytes
     * @param title Location title
     * @param latitude Location latitude in degrees
     * @param longitude Location longitude in degrees
     * @param options Remaining options
     */
    location(
        id: string,
        title: string,
        latitude: number,
        longitude: number,
        options: InlineQueryResultOptions<
            InlineQueryResultLocation,
            "title" | "latitude" | "longitude"
        > = {},
    ) {
        return inputMessage<InlineQueryResultLocation>(
            { type: "location", id, title, latitude, longitude, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultMpeg4Gif object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultmpeg4gif.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param mpeg4_url A valid URL for the MPEG4 file. File size must not exceed 1MB
     * @param thumbnail_url URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
     * @param options Remaining options
     */
    mpeg4gif(
        id: string,
        mpeg4_url: string | URL,
        thumbnail_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultMpeg4Gif,
            "mpeg4_url" | "thumbnail_url"
        > = {},
    ) {
        return inputMessage<InlineQueryResultMpeg4Gif>({
            type: "mpeg4_gif",
            id,
            mpeg4_url: typeof mpeg4_url === "string"
                ? mpeg4_url
                : mpeg4_url.href,
            thumbnail_url: typeof thumbnail_url === "string"
                ? thumbnail_url
                : thumbnail_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultCachedMpeg4Gif object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcachedmpeg4gif.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param mpeg4_file_id A valid file identifier for the MPEG4 file
     * @param options Remaining options
     */
    mpeg4gifCached(
        id: string,
        mpeg4_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedMpeg4Gif,
            "mpeg4_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedMpeg4Gif>(
            { type: "mpeg4_gif", id, mpeg4_file_id, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultPhoto object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultphoto with the
     * thumbnail defaulting to the photo itself.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param photo_url A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB
     * @param options Remaining options
     */
    photo(
        id: string,
        photo_url: string | URL,
        options: InlineQueryResultOptions<InlineQueryResultPhoto, "photo_url"> =
            { // do not require thumbnail, default to the photo itself
                thumbnail_url: typeof photo_url === "string"
                    ? photo_url
                    : photo_url.href,
            },
    ) {
        return inputMessage<InlineQueryResultPhoto>({
            type: "photo",
            id,
            photo_url: typeof photo_url === "string"
                ? photo_url
                : photo_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultCachedPhoto object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcachedphoto.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param photo_file_id A valid file identifier of the photo
     * @param options Remaining options
     */
    photoCached(
        id: string,
        photo_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedPhoto,
            "photo_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedPhoto>(
            { type: "photo", id, photo_file_id, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultCachedSticker object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcachedsticker.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param sticker_file_id A valid file identifier of the sticker
     * @param options Remaining options
     */
    stickerCached(
        id: string,
        sticker_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedSticker,
            "sticker_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedSticker>(
            { type: "sticker", id, sticker_file_id, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultVenue object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultvenue.
     *
     * @param id Unique identifier for this result, 1-64 Bytes
     * @param title Title of the venue
     * @param latitude Latitude of the venue location in degrees
     * @param longitude Longitude of the venue location in degrees
     * @param address Address of the venue
     * @param options Remaining options
     */
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
    ) {
        return inputMessage<InlineQueryResultVenue>({
            type: "venue",
            id,
            title,
            latitude,
            longitude,
            address,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultVideo object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultvideo with mime_type
     * set to "text/html". This will send an embedded video player. Requires you
     * to specify the actual message content by calling another function on the
     * object returned from this method.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Title for the result
     * @param video_url A valid URL for the embedded video player
     * @param thumbnail_url URL of the thumbnail (JPEG only) for the video
     * @param options Remaining options
     */
    videoHtml(
        id: string,
        title: string,
        video_url: string | URL,
        thumbnail_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultVideo,
            "mime_type" | "title" | "video_url" | "thumbnail_url"
        > = {},
    ) {
        // require input message content by only returning methods
        return inputMessageMethods<InlineQueryResultVideo>({
            type: "video",
            mime_type: "text/html",
            id,
            title,
            video_url: typeof video_url === "string"
                ? video_url
                : video_url.href,
            thumbnail_url: typeof thumbnail_url === "string"
                ? thumbnail_url
                : thumbnail_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultVideo object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultvideo with mime_type
     * set to "video/mp4".
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Title for the result
     * @param video_url A valid URL for the video file
     * @param thumbnail_url URL of the thumbnail (JPEG only) for the video
     * @param options Remaining options
     */
    videoMp4(
        id: string,
        title: string,
        video_url: string | URL,
        thumbnail_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultVideo,
            "mime_type" | "title" | "video_url" | "thumbnail_url"
        > = {},
    ) {
        return inputMessage<InlineQueryResultVideo>({
            type: "video",
            mime_type: "video/mp4",
            id,
            title,
            video_url: typeof video_url === "string"
                ? video_url
                : video_url.href,
            thumbnail_url: typeof thumbnail_url === "string"
                ? thumbnail_url
                : thumbnail_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultCachedVideo object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcachedvideo.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Title for the result
     * @param video_file_id A valid file identifier for the video file
     * @param options Remaining options
     */
    videoCached(
        id: string,
        title: string,
        video_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedVideo,
            "title" | "video_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedVideo>(
            { type: "video", id, title, video_file_id, ...options },
        );
    },
    /**
     * Builds an InlineQueryResultVoice object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultvoice.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Voice message title
     * @param voice_url A valid URL for the voice recording
     * @param options Remaining options
     */
    voice(
        id: string,
        title: string,
        voice_url: string | URL,
        options: InlineQueryResultOptions<
            InlineQueryResultVoice,
            "title" | "voice_url"
        > = {},
    ) {
        return inputMessage<InlineQueryResultVoice>({
            type: "voice",
            id,
            title,
            voice_url: typeof voice_url === "string"
                ? voice_url
                : voice_url.href,
            ...options,
        });
    },
    /**
     * Builds an InlineQueryResultCachedVoice object as specified by
     * https://core.telegram.org/bots/api#inlinequeryresultcachedvoice.
     *
     * @param id Unique identifier for this result, 1-64 bytes
     * @param title Voice message title
     * @param voice_file_id A valid file identifier for the voice message
     * @param options Remaining options
     */
    voiceCached(
        id: string,
        title: string,
        voice_file_id: string,
        options: InlineQueryResultOptions<
            InlineQueryResultCachedVoice,
            "title" | "voice_file_id"
        > = {},
    ) {
        return inputMessage<InlineQueryResultCachedVoice>(
            { type: "voice", id, title, voice_file_id, ...options },
        );
    },
};
