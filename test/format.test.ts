import { EntityString } from "../src/format.ts";
import type { MessageEntity, User } from "../src/types.ts";
import { assertEquals, describe, it } from "./deps.test.ts";

describe("EntityString", () => {
    const user: User = { id: 42, is_bot: false, first_name: "Ada" };

    it("should take initial text and entities", () => {
        const entities: MessageEntity[] = [
            { type: "bold", offset: 0, length: 4 },
        ];
        const text = new EntityString("text", entities);
        assertEquals(text.build(), { text: "text", entities });
    });

    it("should append text and entities", () => {
        const text = new EntityString("plain ").append(
            "italic",
            { type: "italic", offset: 0, length: 6 },
        );
        assertEquals(text.build(), {
            text: "plain italic",
            entities: [{ type: "italic", offset: 6, length: 6 }],
        });
    });

    it("should append entity strings", () => {
        const text = new EntityString("plain ").append(
            new EntityString().italic("italic"),
        );
        assertEquals(text.build(), {
            text: "plain italic",
            entities: [{ type: "italic", offset: 6, length: 6 }],
        });
    });

    it("should append plain text", () => {
        const text = new EntityString().plain("plain");
        assertEquals(text.build(), { text: "plain", entities: [] });
    });

    it("should append mentions", () => {
        const text = new EntityString().mention("@grammyjs");
        assertEquals(text.build(), {
            text: "@grammyjs",
            entities: [{ type: "mention", offset: 0, length: 9 }],
        });
    });

    it("should append hashtags", () => {
        const text = new EntityString().hashtag("#grammyjs");
        assertEquals(text.build(), {
            text: "#grammyjs",
            entities: [{ type: "hashtag", offset: 0, length: 9 }],
        });
    });

    it("should append cashtags", () => {
        const text = new EntityString().cashtag("$GRAMMY");
        assertEquals(text.build(), {
            text: "$GRAMMY",
            entities: [{ type: "cashtag", offset: 0, length: 7 }],
        });
    });

    it("should append bot commands", () => {
        const text = new EntityString().botCommand("/start");
        assertEquals(text.build(), {
            text: "/start",
            entities: [{ type: "bot_command", offset: 0, length: 6 }],
        });
    });

    it("should append URLs", () => {
        const text = new EntityString().url("https://grammy.dev");
        assertEquals(text.build(), {
            text: "https://grammy.dev",
            entities: [{ type: "url", offset: 0, length: 18 }],
        });
    });

    it("should append email addresses", () => {
        const text = new EntityString().email("me@example.com");
        assertEquals(text.build(), {
            text: "me@example.com",
            entities: [{ type: "email", offset: 0, length: 14 }],
        });
    });

    it("should append phone numbers", () => {
        const text = new EntityString().phoneNumber("+1-212-555-0123");
        assertEquals(text.build(), {
            text: "+1-212-555-0123",
            entities: [{ type: "phone_number", offset: 0, length: 15 }],
        });
    });

    it("should append bold text", () => {
        const text = new EntityString().bold("bold");
        assertEquals(text.build(), {
            text: "bold",
            entities: [{ type: "bold", offset: 0, length: 4 }],
        });
    });

    it("should append italic text", () => {
        const text = new EntityString().italic("italic");
        assertEquals(text.build(), {
            text: "italic",
            entities: [{ type: "italic", offset: 0, length: 6 }],
        });
    });

    it("should append underlined text", () => {
        const text = new EntityString().underline("underline");
        assertEquals(text.build(), {
            text: "underline",
            entities: [{ type: "underline", offset: 0, length: 9 }],
        });
    });

    it("should append strikethrough text", () => {
        const text = new EntityString().strikethrough("strikethrough");
        assertEquals(text.build(), {
            text: "strikethrough",
            entities: [{ type: "strikethrough", offset: 0, length: 13 }],
        });
    });

    it("should append spoilers", () => {
        const text = new EntityString().spoiler("spoiler");
        assertEquals(text.build(), {
            text: "spoiler",
            entities: [{ type: "spoiler", offset: 0, length: 7 }],
        });
    });

    it("should append block quotes", () => {
        const text = new EntityString().blockquote("quote");
        assertEquals(text.build(), {
            text: "quote",
            entities: [{ type: "blockquote", offset: 0, length: 5 }],
        });
    });

    it("should append expandable block quotes", () => {
        const text = new EntityString().expandableBlockquote("quote");
        assertEquals(text.build(), {
            text: "quote",
            entities: [{
                type: "expandable_blockquote",
                offset: 0,
                length: 5,
            }],
        });
    });

    it("should append code", () => {
        const text = new EntityString().code("const answer = 42;");
        assertEquals(text.build(), {
            text: "const answer = 42;",
            entities: [{ type: "code", offset: 0, length: 18 }],
        });
    });

    it("should append pre-formatted text", () => {
        const text = new EntityString().pre("const answer = 42;", "typescript");
        assertEquals(text.build(), {
            text: "const answer = 42;",
            entities: [{
                type: "pre",
                offset: 0,
                length: 18,
                language: "typescript",
            }],
        });
    });

    it("should append text links", () => {
        const text = new EntityString().textLink(
            "grammY",
            "https://grammy.dev",
        );
        assertEquals(text.build(), {
            text: "grammY",
            entities: [{
                type: "text_link",
                offset: 0,
                length: 6,
                url: "https://grammy.dev",
            }],
        });
    });

    it("should append text mentions", () => {
        const text = new EntityString().textMention("Ada", user);
        assertEquals(text.build(), {
            text: "Ada",
            entities: [{
                type: "text_mention",
                offset: 0,
                length: 3,
                user,
            }],
        });
    });

    it("should append custom emoji", () => {
        const text = new EntityString().customEmoji("👍", "emoji-id");
        assertEquals(text.build(), {
            text: "👍",
            entities: [{
                type: "custom_emoji",
                offset: 0,
                length: 2,
                custom_emoji_id: "emoji-id",
            }],
        });
    });

    it("should append date and time", () => {
        const text = new EntityString().dateTime("tomorrow", 1647531900, "wDT");
        assertEquals(text.build(), {
            text: "tomorrow",
            entities: [{
                type: "date_time",
                offset: 0,
                length: 8,
                unix_time: 1647531900,
                date_time_format: "wDT",
            }],
        });
    });

    it("should expose its UTF-16 length", () => {
        const text = new EntityString("👍");
        assertEquals(text.length, 2);
    });

    it("should build text and entities", () => {
        const text = new EntityString().bold("bold");
        assertEquals(text.build(), {
            text: "bold",
            entities: [{ type: "bold", offset: 0, length: 4 }],
        });
    });

    it("should build nested entities", () => {
        const text = new EntityString()
            .plain("Hello ")
            .bold(
                new EntityString()
                    .plain("bold ")
                    .underline(
                        new EntityString()
                            .plain("and ")
                            .italic("nested"),
                    )
                    .plain(" ")
                    .textLink(
                        new EntityString().strikethrough("link"),
                        "https://grammy.dev",
                    ),
            )
            .plain("\n")
            .blockquote(new EntityString().spoiler("quoted"))
            .plain(" ")
            .customEmoji("👍", "emoji-id")
            .plain(" ")
            .dateTime("tomorrow", 1647531900, "wDT");

        assertEquals(text.build(), {
            text: "Hello bold and nested link\nquoted 👍 tomorrow",
            entities: [
                { type: "bold", offset: 6, length: 20 },
                { type: "underline", offset: 11, length: 10 },
                { type: "italic", offset: 15, length: 6 },
                {
                    type: "text_link",
                    offset: 22,
                    length: 4,
                    url: "https://grammy.dev",
                },
                { type: "strikethrough", offset: 22, length: 4 },
                { type: "blockquote", offset: 27, length: 6 },
                { type: "spoiler", offset: 27, length: 6 },
                {
                    type: "custom_emoji",
                    offset: 34,
                    length: 2,
                    custom_emoji_id: "emoji-id",
                },
                {
                    type: "date_time",
                    offset: 37,
                    length: 8,
                    unix_time: 1647531900,
                    date_time_format: "wDT",
                },
            ],
        });
    });
});
