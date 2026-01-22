import { Composer, type Context } from "../src/mod.ts";
import {
    assertType,
    describe,
    type IsExact,
    type IsNullable,
    it,
} from "./deps.test.ts";

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
    it("should narrow down types in combination with middleware narrowing", () => {
        const c = new Composer<Context & { state: 1 }>();
        c.on(["deleted_business_messages", "callback_query"])
            .callbackQuery("dummy", (ctx) => {
                if (ctx.hasChatType("private")) {
                    const update = ctx.update;
                    const upCbqueryChatType = ctx.update.callback_query.message
                        ?.chat.type;
                    const chatType = ctx.chat.type;
                    const chatId = ctx.chatId;
                    const from = ctx.from.id;
                    const fromId = ctx.fromId;
                    const msgChatType = ctx.msg?.chat.type;
                    const cbqueryChatType = ctx.callbackQuery.message?.chat
                        .type;
                    assertType<IsNullable<typeof update>>(false);
                    assertType<
                        IsExact<typeof upCbqueryChatType, "private" | undefined>
                    >(true);
                    assertType<IsExact<typeof chatType, "private">>(true);
                    assertType<IsExact<typeof chatId, number>>(true);
                    assertType<IsExact<typeof from, number>>(true);
                    assertType<IsExact<typeof fromId, number>>(true);
                    assertType<
                        IsExact<typeof msgChatType, "private" | undefined>
                    >(true);
                    assertType<
                        IsExact<typeof cbqueryChatType, "private" | undefined>
                    >(true);
                }
            });
    });
});
