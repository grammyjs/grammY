import { Composer } from "../src/composer.ts";
import { Context } from "../src/mod.ts";
import type { MaybeInaccessibleMessage } from "../src/types.ts";
import {
    assertType,
    beforeEach,
    describe,
    type IsExact,
    it,
} from "./deps.test.ts";

// Compile-time type tests. No run-time assertion will actually run. Either compile fails or test passes.
describe("Composer types", () => {
    let composer: Composer<Context>;

    beforeEach(() => {
        composer = new Composer();
    });

    describe(".hears", () => {
        it("should have correct type for properties", () => {
            composer.hears("test", (ctx) => {
                const msgCaption = ctx.msg.caption;
                const msgText = ctx.msg.text;
                const messageCaption = ctx.message?.caption;
                const messageText = ctx.message?.text;
                const channelPostCaption = ctx.channelPost?.caption;
                const channelPostText = ctx.channelPost?.text;
                const match = ctx.match;
                assertType<IsExact<typeof msgCaption, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof msgText, string | undefined>>(true);
                assertType<IsExact<typeof messageCaption, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof messageText, string | undefined>>(
                    true,
                );
                assertType<
                    IsExact<typeof channelPostCaption, string | undefined>
                >(
                    true,
                );
                assertType<IsExact<typeof channelPostText, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof match, string | RegExpMatchArray>>(
                    true,
                );
            });
        });
    });

    describe(".callbackQuery", () => {
        it("should have correct type for properties", () => {
            composer.callbackQuery("test", (ctx) => {
                const msg = ctx.msg;
                const message = ctx.message;
                const callbackQueryMessage = ctx.callbackQuery.message;
                const callbackQueryData = ctx.callbackQuery.data;
                const match = ctx.match;
                assertType<
                    IsExact<typeof msg, MaybeInaccessibleMessage | undefined>
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof message,
                        undefined // This is ctx.update.message, but not ctx.update.callback_query.message
                    >
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof callbackQueryMessage,
                        MaybeInaccessibleMessage | undefined
                    >
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof callbackQueryData,
                        string
                    >
                >(
                    true,
                );
                assertType<IsExact<typeof match, string | RegExpMatchArray>>(
                    true,
                );
            });
        });
    });

    describe(".command", () => {
        it("should have correct type for properties", () => {
            composer.command("test", (ctx) => {
                const msgText = ctx.msg.text;
                const messageCaption = ctx.message?.caption;
                const messageText = ctx.message?.text;
                const channelPostCaption = ctx.channelPost?.caption;
                const channelPostText = ctx.channelPost?.text;
                const match = ctx.match;
                assertType<IsExact<typeof msgText, string>>(true);
                assertType<IsExact<typeof messageCaption, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof messageText, string | undefined>>(
                    true,
                );
                assertType<
                    IsExact<typeof channelPostCaption, string | undefined>
                >(true);
                assertType<IsExact<typeof channelPostText, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof match, string>>(true);
            });
        });
    });

    /*
    describe(".chatType", () => {
        const c = new Context(
            // deno-lint-ignore no-explicit-any
            { message: { chat: { type: "group" } } } as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
        );
        it("should check for chat types", async () => {
            composer.chatType("private", middleware);
            composer.chatType(["group", "supergroup"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
        it("should allow chaining chat type checks", async () => {
            composer.chatType(["channel"])
                .chatType(["group", "supergroup"], middleware); // nope
            composer.chatType(["channel", "group"])
                .chatType(["supergroup"], middleware); // nope
            composer.chatType(["channel", "group"])
                .chatType(["group", "supergroup"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
    });

    describe(".gameQuery", () => {
        const c = new Context(
            // deno-lint-ignore no-explicit-any
            { callback_query: { game_short_name: "test" } } as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
        );
        it("should check for game query data", async () => {
            composer.gameQuery("no-data", middleware);
            composer.gameQuery(["nope", "test"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
        it("should allow chaining game query data checks", async () => {
            composer.gameQuery(["nope"])
                .gameQuery(["test", "nei"], middleware); // nope
            composer.gameQuery(["nope", "test"])
                .gameQuery(["nei"], middleware); // nope
            composer.gameQuery(["nope", /test/])
                .gameQuery(["test", "nei"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
    });

    describe(".inlineQuery", () => {
        const c = new Context(
            // deno-lint-ignore no-explicit-any
            { inline_query: { query: "test" } } as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
        );
        it("should check for inline query data", async () => {
            composer.inlineQuery("no-data", middleware);
            composer.inlineQuery(["nope", "test"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
        it("should allow chaining inline query data checks", async () => {
            composer.inlineQuery(["nope"])
                .inlineQuery(["test", "nei"], middleware); // nope
            composer.inlineQuery(["nope", "test"])
                .inlineQuery(["nei"], middleware); // nope
            composer.inlineQuery(["nope", /test/])
                .inlineQuery(["test", "nei"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
    });

    describe(".filter", () => {
        const t = () => true;
        const f = () => false;
        it("should check filters", async () => {
            composer.filter(f, middleware);
            composer.filter(t, middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
        it("should allow chaining filters", async () => {
            composer.filter(t).filter(f, middleware); // nope
            composer.filter(f).filter(t, middleware); // nope
            composer.filter(t).filter(t, middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
    });

    describe(".drop", () => {
        const t = () => true;
        const f = () => false;
        it("should allow to drop", async () => {
            composer.drop(t, middleware);
            composer.drop(f, middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
        it("should allow chaining drop calls", async () => {
            composer.drop(t).drop(f, middleware); // nope
            composer.drop(f).drop(t, middleware); // nope
            composer.drop(f).drop(f, middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
    });

    describe(".fork", () => {
        it("should call downstream and passed middleware", async () => {
            composer.fork(middleware);
            composer.use(middleware);
            await exec();
            assertEquals(middleware.calls.length, 2);
        });
        it("should call middleware concurrently", async () => {
            let seq = "";
            const tick = () => new Promise((r) => setTimeout(r));
            composer.fork(async (_ctx, next) => {
                seq += "0"; // 2
                await tick();
                seq += "1"; // 4
                await next();
            }).use(async () => {
                seq += "2"; // 5
                await tick();
                seq += "3"; // 7
            });
            composer.use(async () => {
                seq += "a"; // 1
                await tick();
                seq += "b"; // 3
                await tick();
                seq += "c"; // 6
                await tick();
                seq += "d"; // 8
            });
            await exec();
            assertEquals(seq, "a0b12c3d");
        });
    });

    describe(".lazy", () => {
        it("should run lazily created middleware", async () => {
            composer.lazy((c) => {
                assertEquals(c, ctx);
                return middleware;
            });
            await exec();
            assertEquals(middleware.calls.length, 1);
        });
        it("should run lazily created middleware arrays", async () => {
            composer.lazy(
                () => [new Composer(), new Composer().middleware(), middleware],
            );
            await exec();
            assertEquals(middleware.calls.length, 1);
        });
    });

    describe(".route", () => {
        const nope = () => {
            throw new Error("nope");
        };
        const base = { a: nope, b: nope };
        it("should route context objects", async () => {
            composer.route((c) => {
                assertEquals(c, ctx);
                return "key";
            }, { ...base, key: middleware });
            await exec();
            assertEquals(middleware.calls.length, 1);
        });
        it("should support a fallback route", async () => {
            composer.route(() => "nope" as "a", base, middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
        });
    });

    describe(".branch", () => {
        it("should branch based on a predicate", async () => {
            let count = 0;
            let l = 0;
            let r = 0;
            composer.branch(
                (c) => {
                    assertEquals(c, ctx);
                    return count++ % 2 === 0;
                },
                () => l++,
                () => r++,
            );
            for (let i = 0; i < 8; i++) await exec();
            assertEquals(l, 4);
            assertEquals(r, 4);
        });
    });

    describe(".errorBoundary", () => {
        it("should catch errors from passed middleware", async () => {
            const err = new Error("damn");
            const handler = spy((e: BotError<Context>) => {
                assertInstanceOf(e, BotError);
                assertEquals(e.error, err);
                assertStringIncludes(e.message, err.message);
            });
            composer.errorBoundary(handler, () => {
                throw err;
            });
            await exec();
            assertEquals(handler.calls.length, 1);
        });
        it("should catch errors from child middleware", async () => {
            const err = new Error("damn");
            const handler = spy((e: BotError<Context>) => {
                assertInstanceOf(e, BotError);
                assertEquals(e.error, err);
                assertStringIncludes(e.message, err.message);
            });
            composer.errorBoundary(handler).use(() => {
                throw err;
            });
            await exec();
            assertEquals(handler.calls.length, 1);
        });
        it("should not touch downstream errors", async () => {
            const err = new Error("yay");
            const handler = spy(() => {});
            composer.errorBoundary(handler);
            composer.use(() => {
                throw err;
            });
            await assertRejects(async () => {
                await exec();
            }, "yay");
            assertEquals(handler.calls.length, 0);
        });
        it("should support passing on the control flow via next", async () => {
            const err = new Error("damn");
            composer.errorBoundary((_e, next) => next()).use(() => {
                throw err;
            });
            composer.use(middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
    });
    */
});
