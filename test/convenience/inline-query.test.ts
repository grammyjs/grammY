import {
    type InlineQueryResultArticle,
    type InlineQueryResultAudio,
    type InlineQueryResultCachedAudio,
    type InlineQueryResultCachedGif,
    type InlineQueryResultCachedMpeg4Gif,
    type InlineQueryResultCachedPhoto,
    type InlineQueryResultCachedSticker,
    type InlineQueryResultCachedVideo,
    type InlineQueryResultCachedVoice,
    type InlineQueryResultContact,
    type InlineQueryResultDocument,
    type InlineQueryResultGif,
    type InlineQueryResultLocation,
    type InlineQueryResultMpeg4Gif,
    type InlineQueryResultPhoto,
    type InlineQueryResultVenue,
    type InlineQueryResultVideo,
    type InlineQueryResultVoice,
} from "../../src/types.ts";
import { assertEquals } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";
import {
    InlineQueryResultBuilder,
    WithoutType,
} from "../../src/convenience/inline-query.ts";

describe("Inline Query Result Builder", () => {
    describe("Article", () => {
        it("should have returned an InlineQueryResultArticle", () => {
            const articleOptions: WithoutType<InlineQueryResultArticle> = {
                id: "id",
                input_message_content: {
                    message_text: "Text message content",
                },
                title: "Article Title",
                description: "Article Description",
                hide_url: false,
                reply_markup: {
                    inline_keyboard: [],
                },
                thumbnail_height: 4,
                thumbnail_url: "Article thumbnail url",
                thumbnail_width: 4,
                url: "https://www.example.com/article",
            };

            const article = InlineQueryResultBuilder.article(articleOptions);

            assertEquals(article, { type: "article", ...articleOptions });
        });
    });

    describe("Audio", () => {
        it("should have returned an InlineQueryResultAudio", () => {
            const audioOptions: WithoutType<InlineQueryResultAudio> = {
                id: "id",
                audio_url: "Audio url",
                title: "Audio Title",
                audio_duration: 20,
                caption: "Audio caption",
                input_message_content: {
                    message_text: "Text message content",
                },
                performer: "Audio performer",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const audio = InlineQueryResultBuilder.audio(audioOptions);

            assertEquals(audio, { type: "audio", ...audioOptions });
        });

        describe("Cached", () => {
            it("should have returned an InlineQueryResultCachedAudio", () => {
                const audioOptions: WithoutType<InlineQueryResultCachedAudio> =
                    {
                        id: "id",
                        audio_file_id: "Audio-file-id",
                        caption: "Audio caption",
                        input_message_content: {
                            message_text: "Text message content",
                        },
                        reply_markup: {
                            inline_keyboard: [],
                        },
                    };

                const audio = InlineQueryResultBuilder.audioCache(audioOptions);

                assertEquals(audio, { type: "audio", ...audioOptions });
            });
        });
    });

    describe("Contact", () => {
        it("should return an InlineQueryResultContact", () => {
            const contactOptions: WithoutType<InlineQueryResultContact> = {
                id: "id",
                phone_number: "+1-888-888-8888",
                first_name: "Contact first name",
                last_name: "Contact last name",
                vcard: "Contact vcard data",
                input_message_content: {
                    message_text: "Text message content",
                },
                reply_markup: {
                    inline_keyboard: [],
                },
                thumbnail_url: "https://via.placeholder.com/60",
                thumbnail_width: 60,
                thumbnail_height: 60,
            };

            const contact = InlineQueryResultBuilder.contact(contactOptions);

            assertEquals(contact, { type: "contact", ...contactOptions });
        });
    });

    describe("Document", () => {
        it("should return an InlineQueryResultDocument", () => {
            const documentOptions: WithoutType<InlineQueryResultDocument> = {
                id: "id",
                title: "Document Title",
                document_url: "https://www.example.com/document",
                mime_type: "application/pdf",
                caption: "Document caption",
                input_message_content: {
                    message_text: "Text message content",
                },
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const document = InlineQueryResultBuilder.document(documentOptions);

            assertEquals(document, { type: "document", ...documentOptions });
        });

        describe("Cached", () => {
            it("should return an InlineQueryResultCachedDocument", () => {
                const documentOptions = {
                    id: "id",
                    title: "Document Title",
                    document_file_id: "document-file-id",
                    caption: "Document caption",
                    input_message_content: {
                        message_text: "Text message content",
                    },
                    reply_markup: {
                        inline_keyboard: [],
                    },
                };

                const document = InlineQueryResultBuilder.documentCache(
                    documentOptions,
                );

                assertEquals(document, {
                    type: "document",
                    ...documentOptions,
                });
            });
        });
    });

    describe("Game", () => {
        it("should return an InlineQueryResultGame", () => {
            const gameOptions = {
                id: "id",
                game_short_name: "Game short name",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const game = InlineQueryResultBuilder.game(gameOptions);

            assertEquals(game, { type: "game", ...gameOptions });
        });
    });

    describe("Gif", () => {
        it("should return an InlineQueryResultGif", () => {
            const gifOptions: WithoutType<InlineQueryResultGif> = {
                id: "id",
                gif_url: "https://www.example.com/gif",
                gif_width: 200,
                gif_height: 200,
                gif_duration: 20,
                thumbnail_url: "https://www.example.com/thumbnail",
                thumbnail_mime_type: "image/gif",
                title: "Gif title",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const gif = InlineQueryResultBuilder.gif(gifOptions);

            assertEquals(gif, { type: "gif", ...gifOptions });
        });

        describe("Cached", () => {
            it("should return an InlineQueryResultCachedGif", () => {
                const gifOptions: WithoutType<InlineQueryResultCachedGif> = {
                    id: "id",
                    gif_file_id: "gif-file-id",
                    title: "Gif title",
                    reply_markup: {
                        inline_keyboard: [],
                    },
                };

                const gif = InlineQueryResultBuilder.gifCache(gifOptions);

                assertEquals(gif, { type: "gif", ...gifOptions });
            });
        });
    });

    describe("Location", () => {
        it("should return an InlineQueryResultLocation", () => {
            const locationOptions: WithoutType<InlineQueryResultLocation> = {
                id: "id",
                latitude: 30,
                longitude: 50,
                title: "Location title",
                horizontal_accuracy: 1500,
                live_period: 60,
                heading: 360,
                proximity_alert_radius: 1,
                thumbnail_url: "https://www.example.com/thumbnail",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const location = InlineQueryResultBuilder.location(locationOptions);

            assertEquals(location, { type: "location", ...locationOptions });
        });
    });

    describe("Mpeg4Gif", () => {
        it("should return an InlineQueryResultMpeg4Gif", () => {
            const mpegOptions: WithoutType<InlineQueryResultMpeg4Gif> = {
                id: "id",
                mpeg4_url: "https://www.example.com/mpeg4",
                mpeg4_width: 100,
                mpeg4_height: 100,
                mpeg4_duration: 30,
                thumbnail_url: "https://www.example.com/thumbnail",
                title: "Mpeg4Gif title",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const mpeg = InlineQueryResultBuilder.mpeg4gif(mpegOptions);

            assertEquals(mpeg, { type: "mpeg4_gif", ...mpegOptions });
        });

        describe("Cached", () => {
            it("should return an InlineQueryResultCachedMpeg4Gif", () => {
                const mpegOptions: WithoutType<
                    InlineQueryResultCachedMpeg4Gif
                > = {
                    id: "id",
                    mpeg4_file_id: "mpeg4-file-id",
                    title: "Mpeg4Gif title",
                    reply_markup: {
                        inline_keyboard: [],
                    },
                };

                const mpeg = InlineQueryResultBuilder.mpeg4gifCache(
                    mpegOptions,
                );
                assertEquals(mpeg, { type: "mpeg4_gif", ...mpegOptions });
            });
        });
    });

    describe("Photo", () => {
        it("should return an InlineQueryResultPhoto", () => {
            const photoOptions: WithoutType<InlineQueryResultPhoto> = {
                id: "id",
                description: "Photo description text",
                photo_url: "https://www.example.com/photo",
                photo_width: 100,
                photo_height: 100,
                thumbnail_url: "https://www.example.com/thumbnail",
                title: "Photo title",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const mpeg = InlineQueryResultBuilder.photo(photoOptions);
            assertEquals(mpeg, { type: "photo", ...photoOptions });
        });

        describe("Cached", () => {
            it("should return an InlineQueryResultCachedPhoto", () => {
                const photoOptions: WithoutType<InlineQueryResultCachedPhoto> =
                    {
                        id: "id",
                        description: "Photo description text",
                        photo_file_id: "https://www.example.com/photo",
                        title: "Photo title",
                        reply_markup: {
                            inline_keyboard: [],
                        },
                    };

                const mpeg = InlineQueryResultBuilder.photoCache(photoOptions);
                assertEquals(mpeg, { type: "photo", ...photoOptions });
            });
        });
    });

    describe("Venue", () => {
        it("should return an InlineQueryResultVenue", () => {
            const venueOptions: WithoutType<InlineQueryResultVenue> = {
                id: "id",
                latitude: 60,
                longitude: 100,
                address: "123 Example Street",
                foursquare_id: "foursquare_id",
                google_place_id: "google_place_id",
                title: "Venue title",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const venue = InlineQueryResultBuilder.venue(venueOptions);
            assertEquals(venue, { type: "venue", ...venueOptions });
        });
    });

    describe("Video", () => {
        it("should return an InlineQueryResultVideo", () => {
            const videoOptions: WithoutType<InlineQueryResultVideo> = {
                id: "id",
                description: "Photo description text",
                video_url: "https://www.example.com/video",
                mime_type: "video/mp4",
                thumbnail_url: "https://www.example.com/thumbnail",
                title: "Video title",
                video_width: 100,
                video_height: 150,
                video_duration: 30,
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const video = InlineQueryResultBuilder.video(videoOptions);
            assertEquals(video, { type: "video", ...videoOptions });
        });

        describe("Cached", () => {
            it("should return an InlineQueryResultCachedVideo", () => {
                const videoOptions: WithoutType<InlineQueryResultCachedVideo> =
                    {
                        id: "id",
                        description: "Video description text",
                        video_file_id: "https://www.example.com/video",
                        title: "Video title",
                        reply_markup: {
                            inline_keyboard: [],
                        },
                    };

                const video = InlineQueryResultBuilder.videoCache(videoOptions);
                assertEquals(video, { type: "video", ...videoOptions });
            });
        });
    });

    describe("Sticker Cached", () => {
        it("should return an InlineQueryResultCachedSticker", () => {
            const stickerOptions: WithoutType<InlineQueryResultCachedSticker> =
                {
                    id: "id",
                    sticker_file_id: "sticker_file_id",
                    reply_markup: {
                        inline_keyboard: [],
                    },
                };

            const video = InlineQueryResultBuilder.stickerCache(stickerOptions);
            assertEquals(video, { type: "sticker", ...stickerOptions });
        });
    });

    describe("Voice", () => {
        it("should return an InlineQueryResultVoice", () => {
            const voiceOptions: WithoutType<InlineQueryResultVoice> = {
                id: "id",
                voice_url: "https://www.example.com/voice",
                title: "Voice title",
                voice_duration: 30,
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const voice = InlineQueryResultBuilder.voice(voiceOptions);
            assertEquals(voice, { type: "voice", ...voiceOptions });
        });

        it("should return an InlineQueryResultCachedVideo", () => {
            const voiceOptions: WithoutType<InlineQueryResultCachedVoice> = {
                id: "id",
                voice_file_id: "voice-file-id",
                title: "Voice title",
                reply_markup: {
                    inline_keyboard: [],
                },
            };

            const video = InlineQueryResultBuilder.voiceCache(voiceOptions);
            assertEquals(video, { type: "voice", ...voiceOptions });
        });
    });
});
