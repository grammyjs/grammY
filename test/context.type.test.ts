import { Composer, type Context } from "../src/mod.ts";
import { assertType, describe, type IsExact, it } from "./deps.test.ts";

describe("ctx.has* checks", () => {
    it("should narrow down types", () => {
        const c = new Composer<Context & { state: 1 }>();
        c.use((ctx) => {
            assertType<IsExact<typeof ctx.state, 1>>(true);
            if (ctx.has(":contact")) {
                assertType<
                    IsExact<typeof ctx.msg.contact.phone_number, string>
                >(true);
                assertType<IsExact<typeof ctx.state, 1>>(true);
            }
            if (ctx.hasText("123")) {
                assertType<IsExact<typeof ctx.payload, "123">>(true);
            }
            if (ctx.hasCommand("123")) {
                assertType<IsExact<typeof ctx.args, string>>(true);
            }
            if (ctx.hasChatType("private")) {
                assertType<IsExact<typeof ctx.chat.type, "private">>(true);
            }
            if (ctx.hasGameQuery("123")) {
                assertType<
                    IsExact<
                        typeof ctx.callbackQuery.game_short_name,
                        string
                    >
                >(true);
            }
            if (ctx.hasInlineQuery("123")) {
                assertType<IsExact<typeof ctx.inlineQuery.id, string>>(
                    true,
                );
            }
        });
        c.command("c", (ctx) => {
            assertType<IsExact<typeof ctx.args, string>>(true);
        });
    });
});
