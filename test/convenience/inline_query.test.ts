import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.192.0/testing/bdd.ts";
import {
    InlineQueryResultBuilder,
} from "../../src/convenience/inline_query.ts";
import { InputInvoiceMessageContent } from "../../src/types.deno.ts";

describe("InlineQueryResultBuilder", () => {
    describe("article", () => {
        it("should build an InlineQueryResultArticle from string", () => {
            const article = InlineQueryResultBuilder.article(
                "id",
                "title",
                "text",
                { description: "description" },
            );
            assertEquals(article, {
                type: "article",
                id: "id",
                title: "title",
                input_message_content: { message_text: "text" },
                description: "description",
            });
        });
        it("should build an InlineQueryResultArticle from InputTextMessageContent", () => {
            const article = InlineQueryResultBuilder.article(
                "id",
                "title",
                { message_text: "text", parse_mode: "HTML" },
                { description: "description" },
            );
            assertEquals(article, {
                type: "article",
                id: "id",
                title: "title",
                input_message_content: {
                    message_text: "text",
                    parse_mode: "HTML",
                },
                description: "description",
            });
        });
    });

    describe("audio", () => {
        it("should build an InlineQueryResultAudio from a string", () => {
            const audio = InlineQueryResultBuilder.audio(
                "id",
                "title",
                "https://grammy.dev/",
                { caption: "cap" },
            );
            assertEquals(audio, {
                type: "audio",
                id: "id",
                title: "title",
                audio_url: "https://grammy.dev/",
                caption: "cap",
            });
        });
        it("should build an InlineQueryResultAudio from a URL", () => {
            const audio = InlineQueryResultBuilder.audio(
                "id",
                "title",
                new URL("https://grammy.dev/"),
                { caption: "cap" },
            );
            assertEquals(audio, {
                type: "audio",
                id: "id",
                title: "title",
                audio_url: "https://grammy.dev/",
                caption: "cap",
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedAudio", () => {
                const audio = InlineQueryResultBuilder.audioCached(
                    "id",
                    "file_id",
                    { caption: "my cached audio" },
                );
                assertEquals(audio, {
                    type: "audio",
                    id: "id",
                    audio_file_id: "file_id",
                    caption: "my cached audio",
                });
            });
        });
    });

    describe("contact", () => {
        it("should build an InlineQueryResultContact", () => {
            const contact = InlineQueryResultBuilder.contact(
                "id",
                "phone",
                "first",
                { last_name: "last" },
            );
            assertEquals(contact, {
                type: "contact",
                id: "id",
                phone_number: "phone",
                first_name: "first",
                last_name: "last",
            });
        });
    });

    describe("document", () => {
        it("should build a PDF InlineQueryResultDocument from a string", () => {
            const document = InlineQueryResultBuilder.documentPdf(
                "id",
                "title",
                "https://grammy.dev/",
                { caption: "captain" },
            );
            assertEquals(document, {
                type: "document",
                mime_type: "application/pdf",
                id: "id",
                title: "title",
                document_url: "https://grammy.dev/",
                caption: "captain",
            });
        });
        it("should build a PDF InlineQueryResultDocument from a URL", () => {
            const document = InlineQueryResultBuilder.documentPdf(
                "id",
                "title",
                new URL("https://grammy.dev/"),
                { caption: "morgan" },
            );
            assertEquals(document, {
                type: "document",
                mime_type: "application/pdf",
                id: "id",
                title: "title",
                document_url: "https://grammy.dev/",
                caption: "morgan",
            });
        });
        it("should build a ZIP InlineQueryResultDocument from a string", () => {
            const document = InlineQueryResultBuilder.documentZip(
                "id",
                "title",
                "https://grammy.dev/",
                { caption: "captain" },
            );
            assertEquals(document, {
                type: "document",
                mime_type: "application/zip",
                id: "id",
                title: "title",
                document_url: "https://grammy.dev/",
                caption: "captain",
            });
        });
        it("should build a ZIP InlineQueryResultDocument from a URL", () => {
            const document = InlineQueryResultBuilder.documentZip(
                "id",
                "title",
                new URL("https://grammy.dev/"),
                { caption: "morgan" },
            );
            assertEquals(document, {
                type: "document",
                mime_type: "application/zip",
                id: "id",
                title: "title",
                document_url: "https://grammy.dev/",
                caption: "morgan",
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedDocument", () => {
                const document = InlineQueryResultBuilder.documentCached(
                    "id",
                    "title",
                    "file_id",
                    { caption: "c" },
                );
                assertEquals(document, {
                    type: "document",
                    id: "id",
                    title: "title",
                    document_file_id: "file_id",
                    caption: "c",
                });
            });
        });
    });

    describe("game", () => {
        it("should build an InlineQueryResultGame", () => {
            const game = InlineQueryResultBuilder.game("id", "game", {
                reply_markup: { inline_keyboard: [] },
            });
            assertEquals(game, {
                type: "game",
                id: "id",
                game_short_name: "game",
                reply_markup: { inline_keyboard: [] },
            });
        });
    });

    describe("gif", () => {
        it("should build an InlineQueryResultGif from strings", () => {
            const gif = InlineQueryResultBuilder.gif(
                "id",
                "https://grammy.dev/",
                "https://grammy.dev/thumb",
                { caption: "It's pronounced GIF." },
            );
            assertEquals(gif, {
                type: "gif",
                id: "id",
                gif_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "It's pronounced GIF.",
            });
        });
        it("should build an InlineQueryResultGif from URLs", () => {
            const gif = InlineQueryResultBuilder.gif(
                "id",
                new URL("https://grammy.dev/"),
                new URL("https://grammy.dev/thumb"),
                { caption: "It's pronounced GIF." },
            );
            assertEquals(gif, {
                type: "gif",
                id: "id",
                gif_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "It's pronounced GIF.",
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedGif", () => {
                const gif = InlineQueryResultBuilder.gifCached(
                    "id",
                    "file_id",
                    { caption: "cappy" },
                );
                assertEquals(gif, {
                    type: "gif",
                    id: "id",
                    gif_file_id: "file_id",
                    caption: "cappy",
                });
            });
        });
    });

    describe("invoice", () => {
        it("should build an InlineQueryResultArticle", () => {
            const invoiceData: InputInvoiceMessageContent = {
                title: "grammY merch",
                description: "Climb the coolness scale",
                payload: "YYY",
                provider_token: "asdf",
                currency: "EUR",
                prices: [{ label: "sticker pack", amount: 1000 }],
            };
            const invoice = InlineQueryResultBuilder.invoice(
                "id",
                "grammY merch",
                invoiceData,
                { description: "Buy it now!" },
            );
            assertEquals(invoice, {
                type: "article",
                id: "id",
                title: "grammY merch",
                input_message_content: invoiceData,
                description: "Buy it now!",
            });
        });
    });

    describe("location", () => {
        it("should build an InlineQueryResultLocation", () => {
            const location = InlineQueryResultBuilder.location(
                "id",
                "title",
                54,
                10,
                { horizontal_accuracy: 3 },
            );
            assertEquals(location, {
                type: "location",
                id: "id",
                title: "title",
                latitude: 54,
                longitude: 10,
                horizontal_accuracy: 3,
            });
        });
    });

    describe("mpeg4gif", () => {
        it("should build an InlineQueryResultMpeg4Gif from strings", () => {
            const mpeg = InlineQueryResultBuilder.mpeg4gif(
                "id",
                "https://grammy.dev/",
                "https://grammy.dev/thumb",
                { caption: "cap" },
            );
            assertEquals(mpeg, {
                type: "mpeg4_gif",
                id: "id",
                mpeg4_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "cap",
            });
        });
        it("should build an InlineQueryResultMpeg4Gif from URLs", () => {
            const mpeg = InlineQueryResultBuilder.mpeg4gif(
                "id",
                new URL("https://grammy.dev/"),
                new URL("https://grammy.dev/thumb"),
                { caption: "cap" },
            );
            assertEquals(mpeg, {
                type: "mpeg4_gif",
                id: "id",
                mpeg4_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "cap",
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedMpeg4Gif", () => {
                const mpeg = InlineQueryResultBuilder.mpeg4gifCached(
                    "id",
                    "file_id",
                    { title: "title" },
                );
                assertEquals(mpeg, {
                    type: "mpeg4_gif",
                    id: "id",
                    mpeg4_file_id: "file_id",
                    title: "title",
                });
            });
        });
    });

    describe("photo", () => {
        it("should build an InlineQueryResultPhoto from strings", () => {
            const mpeg = InlineQueryResultBuilder.photo(
                "id",
                "https://grammy.dev/",
                "https://grammy.dev/thumb",
                { title: "pic" },
            );
            assertEquals(mpeg, {
                type: "photo",
                id: "id",
                photo_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                title: "pic",
            });
        });
        it("should build an InlineQueryResultPhoto from URLs", () => {
            const mpeg = InlineQueryResultBuilder.photo(
                "id",
                new URL("https://grammy.dev/"),
                new URL("https://grammy.dev/thumb"),
                { title: "pic" },
            );
            assertEquals(mpeg, {
                type: "photo",
                id: "id",
                photo_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                title: "pic",
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedPhoto", () => {
                const mpeg = InlineQueryResultBuilder.photoCached(
                    "id",
                    "file_id",
                    { caption: "#pic" },
                );
                assertEquals(mpeg, {
                    type: "photo",
                    id: "id",
                    photo_file_id: "file_id",
                    caption: "#pic",
                });
            });
        });
    });

    describe("sticker", () => {
        describe("cached", () => {
            it("should build an InlineQueryResultCachedSticker", () => {
                const video = InlineQueryResultBuilder.stickerCached(
                    "id",
                    "file_id",
                    { reply_markup: { inline_keyboard: [] } },
                );
                assertEquals(video, {
                    type: "sticker",
                    id: "id",
                    sticker_file_id: "file_id",
                    reply_markup: { inline_keyboard: [] },
                });
            });
        });
    });

    describe("venue", () => {
        it("should build an InlineQueryResultVenue", () => {
            const venue = InlineQueryResultBuilder.venue(
                "id",
                "grammY HQ",
                54,
                10,
                "grammY Street 1",
                { reply_markup: { inline_keyboard: [] } },
            );
            assertEquals(venue, {
                type: "venue",
                id: "id",
                title: "grammY HQ",
                latitude: 54,
                longitude: 10,
                address: "grammY Street 1",
                reply_markup: { inline_keyboard: [] },
            });
        });
    });

    describe("video", () => {
        it("should build an HTML InlineQueryResultVideo from strings", () => {
            const video = InlineQueryResultBuilder.videoHtml(
                "id",
                "title",
                "https://grammy.dev/",
                "https://grammy.dev/thumb",
                "grammY vids",
                { caption: "cap" },
            );
            assertEquals(video, {
                type: "video",
                mime_type: "text/html",
                id: "id",
                title: "title",
                video_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                input_message_content: { message_text: "grammY vids" },
                caption: "cap",
            });
        });
        it("should build an HTML InlineQueryResultVideo from URLs", () => {
            const video = InlineQueryResultBuilder.videoHtml(
                "id",
                "title",
                new URL("https://grammy.dev/"),
                new URL("https://grammy.dev/thumb"),
                { message_text: "grammY vids" },
                { caption: "cap" },
            );
            assertEquals(video, {
                type: "video",
                mime_type: "text/html",
                id: "id",
                title: "title",
                video_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                input_message_content: { message_text: "grammY vids" },
                caption: "cap",
            });
        });
        it("should build an MP4 InlineQueryResultVideo from strings", () => {
            const video = InlineQueryResultBuilder.videoMp4(
                "id",
                "title",
                "https://grammy.dev/",
                "https://grammy.dev/thumb",
                { caption: "cap" },
            );
            assertEquals(video, {
                type: "video",
                mime_type: "video/mp4",
                id: "id",
                title: "title",
                video_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "cap",
            });
        });
        it("should build an MP4 InlineQueryResultVideo from URLs", () => {
            const video = InlineQueryResultBuilder.videoMp4(
                "id",
                "title",
                new URL("https://grammy.dev/"),
                new URL("https://grammy.dev/thumb"),
                { caption: "cap" },
            );
            assertEquals(video, {
                type: "video",
                mime_type: "video/mp4",
                id: "id",
                title: "title",
                video_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "cap",
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedVideo", () => {
                const video = InlineQueryResultBuilder.videoCached(
                    "id",
                    "title",
                    "file_id",
                    { caption: "c" },
                );
                assertEquals(video, {
                    type: "video",
                    id: "id",
                    title: "title",
                    video_file_id: "file_id",
                    caption: "c",
                });
            });
        });
    });

    describe("voice", () => {
        it("should build an InlineQueryResultVoice from a string", () => {
            const voice = InlineQueryResultBuilder.voice(
                "id",
                "title",
                "https://grammy.dev/",
                { caption: "voice caption? wtf" },
            );
            assertEquals(voice, {
                type: "voice",
                id: "id",
                title: "title",
                voice_url: "https://grammy.dev/",
                caption: "voice caption? wtf",
            });
        });
        it("should build an InlineQueryResultVoice from a URL", () => {
            const voice = InlineQueryResultBuilder.voice(
                "id",
                "title",
                new URL("https://grammy.dev/"),
                { caption: "voice caption? wtf" },
            );
            assertEquals(voice, {
                type: "voice",
                id: "id",
                title: "title",
                voice_url: "https://grammy.dev/",
                caption: "voice caption? wtf",
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedVideo", () => {
                const video = InlineQueryResultBuilder.voiceCached(
                    "id",
                    "title",
                    "file_id",
                    { caption: "capped" },
                );
                assertEquals(video, {
                    type: "voice",
                    id: "id",
                    title: "title",
                    voice_file_id: "file_id",
                    caption: "capped",
                });
            });
        });
    });
});
