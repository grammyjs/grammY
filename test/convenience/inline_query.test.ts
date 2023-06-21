import { assertObjectMatch } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
    InlineQueryResultBuilder,
} from "../../src/convenience/inline_query.ts";

import { assertEquals, describe, it } from "../deps.test.ts";

describe("InlineQueryResultBuilder", () => {
    describe("article", () => {
        it("should build an InlineQueryResultArticle from string", () => {
            const article = InlineQueryResultBuilder.article(
                "id",
                "title",
                { description: "description" },
            ).text("text");
            assertObjectMatch(article, {
                type: "article",
                id: "id",
                title: "title",
                input_message_content: { message_text: "text" },
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
            assertObjectMatch(audio, {
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
            assertObjectMatch(audio, {
                type: "audio",
                id: "id",
                title: "title",
                audio_url: "https://grammy.dev/",
                caption: "cap",
            });
        });

        describe("with text", () => {
            it("should build an InlineQueryResultAudio with location in message content", () => {
                const audio = InlineQueryResultBuilder.audio(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "cap" },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(audio, {
                    type: "audio",
                    id: "id",
                    title: "title",
                    audio_url: "https://grammy.dev/",
                    caption: "cap",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultAudio with location in message content", () => {
                const audio = InlineQueryResultBuilder.audio(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "cap" },
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(audio, {
                    type: "audio",
                    id: "id",
                    title: "title",
                    audio_url: "https://grammy.dev/",
                    caption: "cap",
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultAudio with venue in message content", () => {
                const audio = InlineQueryResultBuilder.audio(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "cap" },
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(audio, {
                    type: "audio",
                    id: "id",
                    title: "title",
                    audio_url: "https://grammy.dev/",
                    caption: "cap",
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultAudio with contact in message content", () => {
                const audio = InlineQueryResultBuilder.audio(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "cap" },
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(audio, {
                    type: "audio",
                    id: "id",
                    title: "title",
                    audio_url: "https://grammy.dev/",
                    caption: "cap",
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultAudio with invoice in message content", () => {
                const audio = InlineQueryResultBuilder.audio(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "cap" },
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(audio, {
                    type: "audio",
                    id: "id",
                    title: "title",
                    audio_url: "https://grammy.dev/",
                    caption: "cap",
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
            });
        });

        describe("cached", () => {
            it("should build an InlineQueryResultCachedAudio", () => {
                const audio = InlineQueryResultBuilder.audioCached(
                    "id",
                    "file_id",
                    { caption: "my cached audio" },
                );
                assertObjectMatch(audio, {
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
            assertObjectMatch(contact, {
                type: "contact",
                id: "id",
                phone_number: "phone",
                first_name: "first",
                last_name: "last",
            });
        });

        describe("with text", () => {
            it("should build an InlineQueryResultContact with location in message content", () => {
                const contact = InlineQueryResultBuilder.contact(
                    "id",
                    "phone",
                    "first",
                    { last_name: "last" },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(contact, {
                    type: "contact",
                    id: "id",
                    phone_number: "phone",
                    first_name: "first",
                    last_name: "last",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultAudio with location in message content", () => {
                const contact = InlineQueryResultBuilder.contact(
                    "id",
                    "phone",
                    "first",
                    { last_name: "last" },
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(contact, {
                    type: "contact",
                    id: "id",
                    phone_number: "phone",
                    first_name: "first",
                    last_name: "last",
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultAudio with venue in message content", () => {
                const contact = InlineQueryResultBuilder.contact(
                    "id",
                    "phone",
                    "first",
                    { last_name: "last" },
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(contact, {
                    type: "contact",
                    id: "id",
                    phone_number: "phone",
                    first_name: "first",
                    last_name: "last",
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultAudio with contact in message content", () => {
                const contact = InlineQueryResultBuilder.contact(
                    "id",
                    "phone",
                    "first",
                    { last_name: "last" },
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(contact, {
                    type: "contact",
                    id: "id",
                    phone_number: "phone",
                    first_name: "first",
                    last_name: "last",
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultAudio with invoice in message content", () => {
                const contact = InlineQueryResultBuilder.contact(
                    "id",
                    "phone",
                    "first",
                    { last_name: "last" },
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(contact, {
                    type: "contact",
                    id: "id",
                    phone_number: "phone",
                    first_name: "first",
                    last_name: "last",
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
            });
        });
    });

    describe("document", () => {
        describe("pdfs", () => {
            it("should build a PDF InlineQueryResultDocument from a string", () => {
                const document = InlineQueryResultBuilder.documentPdf(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "captain" },
                );
                assertObjectMatch(document, {
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
                assertObjectMatch(document, {
                    type: "document",
                    mime_type: "application/pdf",
                    id: "id",
                    title: "title",
                    document_url: "https://grammy.dev/",
                    caption: "morgan",
                });
            });

            describe("with text", () => {
                it("should build an PDF InlineQueryResultDocument with location in message content", () => {
                    const document = InlineQueryResultBuilder.documentPdf(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).text("#Text", { parse_mode: "Markdown" });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/pdf",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            message_text: "#Text",
                            parse_mode: "Markdown",
                        },
                    });
                });
            });

            describe("with location", () => {
                it("should build an PDF InlineQueryResultDocument with location in message content", () => {
                    const document = InlineQueryResultBuilder.documentPdf(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).location(83, 136, { heading: 1 });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/pdf",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            latitude: 83,
                            longitude: 136,
                            heading: 1,
                        },
                    });
                });
            });

            describe("with venue", () => {
                it("should build an PDF InlineQueryResultDocument with venue in message content", () => {
                    const document = InlineQueryResultBuilder.documentPdf(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                        foursquare_id: "grammy-foursquare-id",
                    });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/pdf",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            title: "Grammy Venue",
                            latitude: 83,
                            longitude: 136,
                            address: "1 Grammy Venue",
                            foursquare_id: "grammy-foursquare-id",
                        },
                    });
                });
            });

            describe("with contact", () => {
                it("should build an PDF InlineQueryResultDocument with contact in message content", () => {
                    const document = InlineQueryResultBuilder.documentPdf(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).contact("John", "498963648018", { last_name: "Doe" });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/pdf",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            first_name: "John",
                            last_name: "Doe",
                            phone_number: "498963648018",
                        },
                    });
                });
            });

            describe("with invoice", () => {
                it("should build an PDF InlineQueryResultDocument with invoice in message content", () => {
                    const document = InlineQueryResultBuilder.documentPdf(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).invoice(
                        "Invoice",
                        "Invoice Description",
                        "Payload",
                        "Token",
                        "Currency",
                        [{ amount: 10, label: "Item 0" }],
                        { need_name: true },
                    );

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/pdf",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            title: "Invoice",
                            description: "Invoice Description",
                            payload: "Payload",
                            provider_token: "Token",
                            currency: "Currency",
                            prices: [{ amount: 10, label: "Item 0" }],
                            need_name: true,
                        },
                    });
                });
            });
        });
        describe("zip", () => {
            it("should build a ZIP InlineQueryResultDocument from a string", () => {
                const document = InlineQueryResultBuilder.documentZip(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "captain" },
                );
                assertObjectMatch(document, {
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
                assertObjectMatch(document, {
                    type: "document",
                    mime_type: "application/zip",
                    id: "id",
                    title: "title",
                    document_url: "https://grammy.dev/",
                    caption: "morgan",
                });
            });

            describe("with text", () => {
                it("should build an ZIP InlineQueryResultDocument with location in message content", () => {
                    const document = InlineQueryResultBuilder.documentZip(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).text("#Text", { parse_mode: "Markdown" });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/zip",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            message_text: "#Text",
                            parse_mode: "Markdown",
                        },
                    });
                });
            });

            describe("with location", () => {
                it("should build an ZIP InlineQueryResultDocument with location in message content", () => {
                    const document = InlineQueryResultBuilder.documentZip(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).location(83, 136, { heading: 1 });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/zip",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            latitude: 83,
                            longitude: 136,
                            heading: 1,
                        },
                    });
                });
            });

            describe("with venue", () => {
                it("should build an ZIP InlineQueryResultDocument with venue in message content", () => {
                    const document = InlineQueryResultBuilder.documentZip(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                        foursquare_id: "grammy-foursquare-id",
                    });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/zip",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            title: "Grammy Venue",
                            latitude: 83,
                            longitude: 136,
                            address: "1 Grammy Venue",
                            foursquare_id: "grammy-foursquare-id",
                        },
                    });
                });
            });

            describe("with contact", () => {
                it("should build an ZIP InlineQueryResultDocument with contact in message content", () => {
                    const document = InlineQueryResultBuilder.documentZip(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).contact("John", "498963648018", { last_name: "Doe" });

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/zip",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            first_name: "John",
                            last_name: "Doe",
                            phone_number: "498963648018",
                        },
                    });
                });
            });

            describe("with invoice", () => {
                it("should build an ZIP InlineQueryResultDocument with invoice in message content", () => {
                    const document = InlineQueryResultBuilder.documentZip(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        { caption: "captain" },
                    ).invoice(
                        "Invoice",
                        "Invoice Description",
                        "Payload",
                        "Token",
                        "Currency",
                        [{ amount: 10, label: "Item 0" }],
                        { need_name: true },
                    );

                    assertObjectMatch(document, {
                        type: "document",
                        mime_type: "application/zip",
                        id: "id",
                        title: "title",
                        document_url: "https://grammy.dev/",
                        caption: "captain",
                        input_message_content: {
                            title: "Invoice",
                            description: "Invoice Description",
                            payload: "Payload",
                            provider_token: "Token",
                            currency: "Currency",
                            prices: [{ amount: 10, label: "Item 0" }],
                            need_name: true,
                        },
                    });
                });
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
                assertObjectMatch(document, {
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
            assertObjectMatch(gif, {
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
            assertObjectMatch(gif, {
                type: "gif",
                id: "id",
                gif_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "It's pronounced GIF.",
            });
        });
        describe("with text", () => {
            it("should build an InlineQueryResultGif with location in message content", () => {
                const gif = InlineQueryResultBuilder.gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "It's pronounced GIF." },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(gif, {
                    type: "gif",
                    id: "id",
                    gif_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "It's pronounced GIF.",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultGif with location in message content", () => {
                const gif = InlineQueryResultBuilder.gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "It's pronounced GIF." },
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(gif, {
                    type: "gif",
                    id: "id",
                    gif_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "It's pronounced GIF.",
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultGif with venue in message content", () => {
                const gif = InlineQueryResultBuilder.gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "It's pronounced GIF." },
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(gif, {
                    type: "gif",
                    id: "id",
                    gif_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "It's pronounced GIF.",
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultGif with contact in message content", () => {
                const gif = InlineQueryResultBuilder.gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "It's pronounced GIF." },
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(gif, {
                    type: "gif",
                    id: "id",
                    gif_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "It's pronounced GIF.",
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultGif with invoice in message content", () => {
                const gif = InlineQueryResultBuilder.gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "It's pronounced GIF." },
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(gif, {
                    type: "gif",
                    id: "id",
                    gif_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "It's pronounced GIF.",
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedGif", () => {
                const gif = InlineQueryResultBuilder.gifCached(
                    "id",
                    "file_id",
                    { caption: "cappy" },
                );
                assertObjectMatch(gif, {
                    type: "gif",
                    id: "id",
                    gif_file_id: "file_id",
                    caption: "cappy",
                });
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
            assertObjectMatch(location, {
                type: "location",
                id: "id",
                title: "title",
                latitude: 54,
                longitude: 10,
                horizontal_accuracy: 3,
            });
        });
        describe("with text", () => {
            it("should build an InlineQueryResultLocation with location in message content", () => {
                const location = InlineQueryResultBuilder.location(
                    "id",
                    "title",
                    54,
                    10,
                    { horizontal_accuracy: 3 },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(location, {
                    type: "location",
                    id: "id",
                    title: "title",
                    latitude: 54,
                    longitude: 10,
                    horizontal_accuracy: 3,
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultLocation with location in message content", () => {
                const location = InlineQueryResultBuilder.location(
                    "id",
                    "title",
                    54,
                    10,
                    { horizontal_accuracy: 3 },
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(location, {
                    type: "location",
                    id: "id",
                    title: "title",
                    latitude: 54,
                    longitude: 10,
                    horizontal_accuracy: 3,
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultLocation with venue in message content", () => {
                const location = InlineQueryResultBuilder.location(
                    "id",
                    "title",
                    54,
                    10,
                    { horizontal_accuracy: 3 },
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(location, {
                    type: "location",
                    id: "id",
                    title: "title",
                    latitude: 54,
                    longitude: 10,
                    horizontal_accuracy: 3,
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultLocation with contact in message content", () => {
                const location = InlineQueryResultBuilder.location(
                    "id",
                    "title",
                    54,
                    10,
                    { horizontal_accuracy: 3 },
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(location, {
                    type: "location",
                    id: "id",
                    title: "title",
                    latitude: 54,
                    longitude: 10,
                    horizontal_accuracy: 3,
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultLocation with invoice in message content", () => {
                const location = InlineQueryResultBuilder.location(
                    "id",
                    "title",
                    54,
                    10,
                    { horizontal_accuracy: 3 },
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(location, {
                    type: "location",
                    id: "id",
                    title: "title",
                    latitude: 54,
                    longitude: 10,
                    horizontal_accuracy: 3,
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
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
            assertObjectMatch(mpeg, {
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
            assertObjectMatch(mpeg, {
                type: "mpeg4_gif",
                id: "id",
                mpeg4_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/thumb",
                caption: "cap",
            });
        });
        describe("with text", () => {
            it("should build an InlineQueryResultMpeg4Gif with location in message content", () => {
                const mpeg = InlineQueryResultBuilder.mpeg4gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "cap" },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(mpeg, {
                    type: "mpeg4_gif",
                    id: "id",
                    mpeg4_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultMpeg4Gif with location in message content", () => {
                const mpeg = InlineQueryResultBuilder.mpeg4gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "cap" },
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(mpeg, {
                    type: "mpeg4_gif",
                    id: "id",
                    mpeg4_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultMpeg4Gif with venue in message content", () => {
                const mpeg = InlineQueryResultBuilder.mpeg4gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "cap" },
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(mpeg, {
                    type: "mpeg4_gif",
                    id: "id",
                    mpeg4_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultMpeg4Gif with contact in message content", () => {
                const mpeg = InlineQueryResultBuilder.mpeg4gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "cap" },
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(mpeg, {
                    type: "mpeg4_gif",
                    id: "id",
                    mpeg4_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultMpeg4Gif with invoice in message content", () => {
                const mpeg = InlineQueryResultBuilder.mpeg4gif(
                    "id",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "cap" },
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(mpeg, {
                    type: "mpeg4_gif",
                    id: "id",
                    mpeg4_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
            });
        });
        describe("cached", () => {
            it("should build an InlineQueryResultCachedMpeg4Gif", () => {
                const mpeg = InlineQueryResultBuilder.mpeg4gifCached(
                    "id",
                    "file_id",
                    { title: "title" },
                );
                assertObjectMatch(mpeg, {
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
            const photo = InlineQueryResultBuilder.photo(
                "id",
                "https://grammy.dev/",
            );
            assertObjectMatch(photo, {
                type: "photo",
                id: "id",
                photo_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/",
            });
        });
        it("should build an InlineQueryResultPhoto from URLs", () => {
            const photo = InlineQueryResultBuilder.photo(
                "id",
                new URL("https://grammy.dev/"),
            );
            assertObjectMatch(photo, {
                type: "photo",
                id: "id",
                photo_url: "https://grammy.dev/",
                thumbnail_url: "https://grammy.dev/",
            });
        });

        describe("with text", () => {
            it("should build an InlineQueryResultPhoto with location in message content", () => {
                const photo = InlineQueryResultBuilder.photo(
                    "id",
                    "https://grammy.dev/",
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(photo, {
                    type: "photo",
                    id: "id",
                    photo_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultPhoto with location in message content", () => {
                const photo = InlineQueryResultBuilder.photo(
                    "id",
                    "https://grammy.dev/",
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(photo, {
                    type: "photo",
                    id: "id",
                    photo_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/",
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultPhoto with venue in message content", () => {
                const photo = InlineQueryResultBuilder.photo(
                    "id",
                    "https://grammy.dev/",
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(photo, {
                    type: "photo",
                    id: "id",
                    photo_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/",
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultPhoto with contact in message content", () => {
                const photo = InlineQueryResultBuilder.photo(
                    "id",
                    "https://grammy.dev/",
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(photo, {
                    type: "photo",
                    id: "id",
                    photo_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/",
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultPhoto with invoice in message content", () => {
                const photo = InlineQueryResultBuilder.photo(
                    "id",
                    "https://grammy.dev/",
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(photo, {
                    type: "photo",
                    id: "id",
                    photo_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/",
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
            });
        });

        describe("cached", () => {
            it("should build an InlineQueryResultCachedPhoto", () => {
                const mpeg = InlineQueryResultBuilder.photoCached(
                    "id",
                    "file_id",
                    { caption: "#pic" },
                );
                assertObjectMatch(mpeg, {
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
                const sticker = InlineQueryResultBuilder.stickerCached(
                    "id",
                    "file_id",
                    { reply_markup: { inline_keyboard: [] } },
                );
                assertObjectMatch(sticker, {
                    type: "sticker",
                    id: "id",
                    sticker_file_id: "file_id",
                    reply_markup: { inline_keyboard: [] },
                });
            });

            describe("with text", () => {
                it("should build an InlineQueryResultCachedSticker with location in message content", () => {
                    const sticker = InlineQueryResultBuilder.stickerCached(
                        "id",
                        "file_id",
                        { reply_markup: { inline_keyboard: [] } },
                    ).text("#Text", { parse_mode: "Markdown" });

                    assertObjectMatch(sticker, {
                        type: "sticker",
                        id: "id",
                        sticker_file_id: "file_id",
                        reply_markup: { inline_keyboard: [] },
                        input_message_content: {
                            message_text: "#Text",
                            parse_mode: "Markdown",
                        },
                    });
                });
            });

            describe("with location", () => {
                it("should build an InlineQueryResultCachedSticker with location in message content", () => {
                    const sticker = InlineQueryResultBuilder.stickerCached(
                        "id",
                        "file_id",
                        { reply_markup: { inline_keyboard: [] } },
                    ).location(83, 136, { heading: 1 });

                    assertObjectMatch(sticker, {
                        type: "sticker",
                        id: "id",
                        sticker_file_id: "file_id",
                        reply_markup: { inline_keyboard: [] },
                        input_message_content: {
                            latitude: 83,
                            longitude: 136,
                            heading: 1,
                        },
                    });
                });
            });

            describe("with venue", () => {
                it("should build an InlineQueryResultCachedSticker with venue in message content", () => {
                    const sticker = InlineQueryResultBuilder.stickerCached(
                        "id",
                        "file_id",
                        { reply_markup: { inline_keyboard: [] } },
                    ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                        foursquare_id: "grammy-foursquare-id",
                    });

                    assertObjectMatch(sticker, {
                        type: "sticker",
                        id: "id",
                        sticker_file_id: "file_id",
                        reply_markup: { inline_keyboard: [] },
                        input_message_content: {
                            title: "Grammy Venue",
                            latitude: 83,
                            longitude: 136,
                            address: "1 Grammy Venue",
                            foursquare_id: "grammy-foursquare-id",
                        },
                    });
                });
            });

            describe("with contact", () => {
                it("should build an InlineQueryResultCachedSticker with contact in message content", () => {
                    const sticker = InlineQueryResultBuilder.stickerCached(
                        "id",
                        "file_id",
                        { reply_markup: { inline_keyboard: [] } },
                    ).contact("John", "498963648018", { last_name: "Doe" });

                    assertObjectMatch(sticker, {
                        type: "sticker",
                        id: "id",
                        sticker_file_id: "file_id",
                        reply_markup: { inline_keyboard: [] },
                        input_message_content: {
                            first_name: "John",
                            last_name: "Doe",
                            phone_number: "498963648018",
                        },
                    });
                });
            });

            describe("with invoice", () => {
                it("should build an InlineQueryResultCachedSticker with invoice in message content", () => {
                    const sticker = InlineQueryResultBuilder.stickerCached(
                        "id",
                        "file_id",
                        { reply_markup: { inline_keyboard: [] } },
                    ).invoice(
                        "Invoice",
                        "Invoice Description",
                        "Payload",
                        "Token",
                        "Currency",
                        [{ amount: 10, label: "Item 0" }],
                        { need_name: true },
                    );

                    assertObjectMatch(sticker, {
                        type: "sticker",
                        id: "id",
                        sticker_file_id: "file_id",
                        reply_markup: { inline_keyboard: [] },
                        input_message_content: {
                            title: "Invoice",
                            description: "Invoice Description",
                            payload: "Payload",
                            provider_token: "Token",
                            currency: "Currency",
                            prices: [{ amount: 10, label: "Item 0" }],
                            need_name: true,
                        },
                    });
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
            assertObjectMatch(venue, {
                type: "venue",
                id: "id",
                title: "grammY HQ",
                latitude: 54,
                longitude: 10,
                address: "grammY Street 1",
                reply_markup: { inline_keyboard: [] },
            });
        });

        describe("with text", () => {
            it("should build an InlineQueryResultVenue with location in message content", () => {
                const venue = InlineQueryResultBuilder.venue(
                    "id",
                    "grammY HQ",
                    54,
                    10,
                    "grammY Street 1",
                    { reply_markup: { inline_keyboard: [] } },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(venue, {
                    type: "venue",
                    id: "id",
                    title: "grammY HQ",
                    latitude: 54,
                    longitude: 10,
                    address: "grammY Street 1",
                    reply_markup: { inline_keyboard: [] },
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultVenue with location in message content", () => {
                const venue = InlineQueryResultBuilder.venue(
                    "id",
                    "grammY HQ",
                    54,
                    10,
                    "grammY Street 1",
                    { reply_markup: { inline_keyboard: [] } },
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(venue, {
                    type: "venue",
                    id: "id",
                    title: "grammY HQ",
                    latitude: 54,
                    longitude: 10,
                    address: "grammY Street 1",
                    reply_markup: { inline_keyboard: [] },
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultVenue with venue in message content", () => {
                const venue = InlineQueryResultBuilder.venue(
                    "id",
                    "grammY HQ",
                    54,
                    10,
                    "grammY Street 1",
                    { reply_markup: { inline_keyboard: [] } },
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(venue, {
                    type: "venue",
                    id: "id",
                    title: "grammY HQ",
                    latitude: 54,
                    longitude: 10,
                    address: "grammY Street 1",
                    reply_markup: { inline_keyboard: [] },
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultVenue with contact in message content", () => {
                const venue = InlineQueryResultBuilder.venue(
                    "id",
                    "grammY HQ",
                    54,
                    10,
                    "grammY Street 1",
                    { reply_markup: { inline_keyboard: [] } },
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(venue, {
                    type: "venue",
                    id: "id",
                    title: "grammY HQ",
                    latitude: 54,
                    longitude: 10,
                    address: "grammY Street 1",
                    reply_markup: { inline_keyboard: [] },
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultVenue with invoice in message content", () => {
                const venue = InlineQueryResultBuilder.venue(
                    "id",
                    "grammY HQ",
                    54,
                    10,
                    "grammY Street 1",
                    { reply_markup: { inline_keyboard: [] } },
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(venue, {
                    type: "venue",
                    id: "id",
                    title: "grammY HQ",
                    latitude: 54,
                    longitude: 10,
                    address: "grammY Street 1",
                    reply_markup: { inline_keyboard: [] },
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
            });
        });
    });

    describe("video", () => {
        describe("html", () => {
            it("should build an HTML InlineQueryResultVideo from strings", () => {
                const video = InlineQueryResultBuilder.videoHtml(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "cap" },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(video, {
                    type: "video",
                    mime_type: "text/html",
                    id: "id",
                    title: "title",
                    video_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
            it("should build an HTML InlineQueryResultVideo from URLs", () => {
                const video = InlineQueryResultBuilder.videoHtml(
                    "id",
                    "title",
                    new URL("https://grammy.dev/"),
                    new URL("https://grammy.dev/thumb"),
                    { caption: "cap" },
                ).text("#Text", { parse_mode: "Markdown" });
                assertObjectMatch(video, {
                    type: "video",
                    mime_type: "text/html",
                    id: "id",
                    title: "title",
                    video_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });

            describe("with location", () => {
                it("should build an HTML InlineQueryResultVideo with location in message content", () => {
                    const video = InlineQueryResultBuilder.videoHtml(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).location(83, 136, { heading: 1 });

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "text/html",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            latitude: 83,
                            longitude: 136,
                            heading: 1,
                        },
                    });
                });
            });

            describe("with venue", () => {
                it("should build an HTML InlineQueryResultVideo with venue in message content", () => {
                    const video = InlineQueryResultBuilder.videoHtml(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                        foursquare_id: "grammy-foursquare-id",
                    });

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "text/html",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            title: "Grammy Venue",
                            latitude: 83,
                            longitude: 136,
                            address: "1 Grammy Venue",
                            foursquare_id: "grammy-foursquare-id",
                        },
                    });
                });
            });

            describe("with contact", () => {
                it("should build an HTML InlineQueryResultVideo with contact in message content", () => {
                    const video = InlineQueryResultBuilder.videoHtml(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).contact("John", "498963648018", { last_name: "Doe" });

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "text/html",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            first_name: "John",
                            last_name: "Doe",
                            phone_number: "498963648018",
                        },
                    });
                });
            });

            describe("with invoice", () => {
                it("should build an HTML InlineQueryResultVideo with invoice in message content", () => {
                    const video = InlineQueryResultBuilder.videoHtml(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).invoice(
                        "Invoice",
                        "Invoice Description",
                        "Payload",
                        "Token",
                        "Currency",
                        [{ amount: 10, label: "Item 0" }],
                        { need_name: true },
                    );

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "text/html",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            title: "Invoice",
                            description: "Invoice Description",
                            payload: "Payload",
                            provider_token: "Token",
                            currency: "Currency",
                            prices: [{ amount: 10, label: "Item 0" }],
                            need_name: true,
                        },
                    });
                });
            });
        });

        describe("mp4", () => {
            it("should build an MP4 InlineQueryResultVideo from strings", () => {
                const video = InlineQueryResultBuilder.videoMp4(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    "https://grammy.dev/thumb",
                    { caption: "cap" },
                );
                assertObjectMatch(video, {
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
                assertObjectMatch(video, {
                    type: "video",
                    mime_type: "video/mp4",
                    id: "id",
                    title: "title",
                    video_url: "https://grammy.dev/",
                    thumbnail_url: "https://grammy.dev/thumb",
                    caption: "cap",
                });
            });

            describe("with text", () => {
                it("should build an MP4 InlineQueryResultVideo with location in message content", () => {
                    const video = InlineQueryResultBuilder.videoMp4(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).text("#Text", { parse_mode: "Markdown" });

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "video/mp4",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            message_text: "#Text",
                            parse_mode: "Markdown",
                        },
                    });
                });
            });

            describe("with location", () => {
                it("should build an MP4 InlineQueryResultVideo with location in message content", () => {
                    const video = InlineQueryResultBuilder.videoMp4(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).location(83, 136, { heading: 1 });

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "video/mp4",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            latitude: 83,
                            longitude: 136,
                            heading: 1,
                        },
                    });
                });
            });

            describe("with venue", () => {
                it("should build an MP4 InlineQueryResultVideo with venue in message content", () => {
                    const video = InlineQueryResultBuilder.videoMp4(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                        foursquare_id: "grammy-foursquare-id",
                    });

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "video/mp4",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            title: "Grammy Venue",
                            latitude: 83,
                            longitude: 136,
                            address: "1 Grammy Venue",
                            foursquare_id: "grammy-foursquare-id",
                        },
                    });
                });
            });

            describe("with contact", () => {
                it("should build an MP4 InlineQueryResultVideo with contact in message content", () => {
                    const video = InlineQueryResultBuilder.videoMp4(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).contact("John", "498963648018", { last_name: "Doe" });

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "video/mp4",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            first_name: "John",
                            last_name: "Doe",
                            phone_number: "498963648018",
                        },
                    });
                });
            });

            describe("with invoice", () => {
                it("should build an MP4 InlineQueryResultVideo with invoice in message content", () => {
                    const video = InlineQueryResultBuilder.videoMp4(
                        "id",
                        "title",
                        "https://grammy.dev/",
                        "https://grammy.dev/thumb",
                        { caption: "cap" },
                    ).invoice(
                        "Invoice",
                        "Invoice Description",
                        "Payload",
                        "Token",
                        "Currency",
                        [{ amount: 10, label: "Item 0" }],
                        { need_name: true },
                    );

                    assertObjectMatch(video, {
                        type: "video",
                        mime_type: "video/mp4",
                        id: "id",
                        title: "title",
                        video_url: "https://grammy.dev/",
                        thumbnail_url: "https://grammy.dev/thumb",
                        caption: "cap",
                        input_message_content: {
                            title: "Invoice",
                            description: "Invoice Description",
                            payload: "Payload",
                            provider_token: "Token",
                            currency: "Currency",
                            prices: [{ amount: 10, label: "Item 0" }],
                            need_name: true,
                        },
                    });
                });
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
                assertObjectMatch(video, {
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
            assertObjectMatch(voice, {
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
            assertObjectMatch(voice, {
                type: "voice",
                id: "id",
                title: "title",
                voice_url: "https://grammy.dev/",
                caption: "voice caption? wtf",
            });
        });

        describe("with text", () => {
            it("should build an InlineQueryResultVoice with location in message content", () => {
                const voice = InlineQueryResultBuilder.voice(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "voice caption? wtf" },
                ).text("#Text", { parse_mode: "Markdown" });

                assertObjectMatch(voice, {
                    type: "voice",
                    id: "id",
                    title: "title",
                    voice_url: "https://grammy.dev/",
                    caption: "voice caption? wtf",
                    input_message_content: {
                        message_text: "#Text",
                        parse_mode: "Markdown",
                    },
                });
            });
        });

        describe("with location", () => {
            it("should build an InlineQueryResultVoice with location in message content", () => {
                const voice = InlineQueryResultBuilder.voice(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "voice caption? wtf" },
                ).location(83, 136, { heading: 1 });

                assertObjectMatch(voice, {
                    type: "voice",
                    id: "id",
                    title: "title",
                    voice_url: "https://grammy.dev/",
                    caption: "voice caption? wtf",
                    input_message_content: {
                        latitude: 83,
                        longitude: 136,
                        heading: 1,
                    },
                });
            });
        });

        describe("with venue", () => {
            it("should build an InlineQueryResultVoice with venue in message content", () => {
                const voice = InlineQueryResultBuilder.voice(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "voice caption? wtf" },
                ).venue("Grammy Venue", 83, 136, "1 Grammy Venue", {
                    foursquare_id: "grammy-foursquare-id",
                });

                assertObjectMatch(voice, {
                    type: "voice",
                    id: "id",
                    title: "title",
                    voice_url: "https://grammy.dev/",
                    caption: "voice caption? wtf",
                    input_message_content: {
                        title: "Grammy Venue",
                        latitude: 83,
                        longitude: 136,
                        address: "1 Grammy Venue",
                        foursquare_id: "grammy-foursquare-id",
                    },
                });
            });
        });

        describe("with contact", () => {
            it("should build an InlineQueryResultVoice with contact in message content", () => {
                const voice = InlineQueryResultBuilder.voice(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "voice caption? wtf" },
                ).contact("John", "498963648018", { last_name: "Doe" });

                assertObjectMatch(voice, {
                    type: "voice",
                    id: "id",
                    title: "title",
                    voice_url: "https://grammy.dev/",
                    caption: "voice caption? wtf",
                    input_message_content: {
                        first_name: "John",
                        last_name: "Doe",
                        phone_number: "498963648018",
                    },
                });
            });
        });

        describe("with invoice", () => {
            it("should build an InlineQueryResultVoice with invoice in message content", () => {
                const voice = InlineQueryResultBuilder.voice(
                    "id",
                    "title",
                    "https://grammy.dev/",
                    { caption: "voice caption? wtf" },
                ).invoice(
                    "Invoice",
                    "Invoice Description",
                    "Payload",
                    "Token",
                    "Currency",
                    [{ amount: 10, label: "Item 0" }],
                    { need_name: true },
                );

                assertObjectMatch(voice, {
                    type: "voice",
                    id: "id",
                    title: "title",
                    voice_url: "https://grammy.dev/",
                    caption: "voice caption? wtf",
                    input_message_content: {
                        title: "Invoice",
                        description: "Invoice Description",
                        payload: "Payload",
                        provider_token: "Token",
                        currency: "Currency",
                        prices: [{ amount: 10, label: "Item 0" }],
                        need_name: true,
                    },
                });
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
                assertObjectMatch(video, {
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
