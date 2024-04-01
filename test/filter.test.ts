import { Context, type FilterQuery, matchFilter } from "../src/mod.ts";
import {
    assert,
    assertEquals,
    assertThrows,
    describe,
    it,
} from "./deps.test.ts";

describe("matchFilter", () => {
    it("should reject empty filters", () => {
        assertThrows(() => matchFilter("" as FilterQuery));
        assertThrows(() => matchFilter(":" as FilterQuery));
        assertThrows(() => matchFilter("::" as FilterQuery));
        assertThrows(() => matchFilter("  " as FilterQuery));
    });

    it("should reject invalid default omissions", () => {
        assertThrows(() => matchFilter("message:" as FilterQuery));
        assertThrows(() => matchFilter("::me" as FilterQuery));
    });

    it("should perform L1 filtering", () => {
        const ctx = { update: { message: {} } } as Context;
        assert(matchFilter("message")(ctx));
        assert(!matchFilter("edited_message")(ctx));
    });

    it("should perform L2 filtering", () => {
        const ctx = { update: { message: { text: "" } } } as Context;
        assert(matchFilter("message:text")(ctx));
        assert(!matchFilter("edited_message")(ctx));
        assert(!matchFilter("edited_message:text")(ctx));
    });

    it("should fill in L1 defaults", () => {
        const ctx = { update: { message: { text: "" } } } as Context;
        assert(matchFilter(":text")(ctx));
        assert(!matchFilter(":entities")(ctx));
        assert(!matchFilter(":caption")(ctx));
        assert(!matchFilter("edited_message")(ctx));
    });

    it("should fill in L2 defaults", () => {
        const ctx = {
            update: { message: { text: "", entities: [{ type: "url" }] } },
        } as Context;
        assert(matchFilter("message::url")(ctx));
        assert(matchFilter("::url")(ctx));
        assert(!matchFilter("edited_message")(ctx));
    });

    it("should expand L1 shortcuts", () => {
        const ctxNew = { update: { message: { text: "" } } } as Context;
        assert(matchFilter("msg")(ctxNew));
        assert(matchFilter("msg:text")(ctxNew));
        assert(!matchFilter("msg:entities")(ctxNew));
        assert(matchFilter("message")(ctxNew));
        assert(matchFilter(":text")(ctxNew));
        assert(!matchFilter(":audio")(ctxNew));

        const ctxEdited = {
            update: { edited_message: { text: "" } },
        } as Context;
        assert(!matchFilter(":text")(ctxEdited));
        assert(matchFilter("edit")(ctxEdited));
        assert(matchFilter("edit:text")(ctxEdited));
        assert(!matchFilter("edit:entities")(ctxEdited));
        assert(matchFilter("edited_message")(ctxEdited));
    });

    it("should expand L2 shortcuts", () => {
        const ctx = {
            update: { edited_message: { photo: {}, caption: "" } },
        } as Context;
        assert(matchFilter("edit")(ctx));
        assert(matchFilter("edit:photo")(ctx));
        assert(!matchFilter(":photo")(ctx));
        assert(matchFilter("edited_message:media")(ctx));
        assert(matchFilter("edit:caption")(ctx));
        assert(matchFilter("edited_message:file")(ctx));
        assert(matchFilter("edit:file")(ctx));
        assert(!matchFilter(":media")(ctx));
        assert(!matchFilter(":file")(ctx));
    });

    it("should perform L3 filtering", () => {
        let ctx = {
            update: { message: { text: "", entities: [{ type: "url" }] } },
        } as Context;
        assert(matchFilter("message:entities:url")(ctx));

        ctx = {
            me: { id: 42 },
            update: { message: { left_chat_member: { id: 42, is_bot: true } } },
        } as Context;
        assert(matchFilter(":left_chat_member:me")(ctx));
        assert(matchFilter(":left_chat_member:is_bot")(ctx));
    });

    it("should match multiple filters", () => {
        const entitiy = { type: "" };
        const ctx = {
            update: {
                message: { text: "", entities: [{ type: "italic" }, entitiy] },
            },
        } as Context;
        for (const t of ["url", "bold", "bot_command", "cashtag", "code"]) {
            entitiy.type = t;
            assert(
                matchFilter([
                    "::url",
                    "::bold",
                    "::bot_command",
                    "::cashtag",
                    "::code",
                ])(ctx),
            );
        }
    });

    it("should work with correct type-inference", () => {
        const text = "I <3 grammY";
        const ctx = new Context(
            // deno-lint-ignore no-explicit-any
            { message: { text } } as any,
            // deno-lint-ignore no-explicit-any
            undefined as any,
            // deno-lint-ignore no-explicit-any
            undefined as any,
        );
        const pred = matchFilter([":text", "callback_query:data"]);
        if (pred(ctx)) {
            if (ctx.callbackQuery) {
                const s: string = ctx.update.callback_query.data;
                assert(s);
                throw "never";
            } else {
                const t: string = (ctx.channelPost ?? ctx.message).text;
                assertEquals(t, text);
            }
        } else {
            throw "never";
        }
    });
});
