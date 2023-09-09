import { BotError, Composer, type MiddlewareFn, run } from "../src/composer.ts";
import { Context } from "../src/mod.ts";
import {
    assertEquals,
    assertFalse,
    assertInstanceOf,
    assertRejects,
    assertStringIncludes,
    beforeEach,
    describe,
    it,
    type Spy,
    spy,
} from "./deps.test.ts";

describe("BotError", () => {
    // @ts-expect-error this message is missing many properties
    const ctx = new Context({ message: { text: "test" } }, 0, 0);
    it("should copy stack and message", () => {
        const e = new Error("nope");
        const err = new BotError(e, ctx);
        assertStringIncludes(err.message, e.message);
        assertEquals(err.stack, e.stack);
    });
    it("should find good error message for non-error objects", () => {
        const e = (value: unknown) => new BotError(value, ctx).message;
        assertStringIncludes(e("test"), "test");
        assertStringIncludes(e("test"), "of type string");
        assertFalse(e(Array(50).fill("a").join("") + "bbb").includes("b")); // cut long strings
        assertStringIncludes(e(42), "42");
        assertStringIncludes(e(42), "of type number");
        assertStringIncludes(e(() => {}), "of type function");
    });
});

describe("Composer", () => {
    let composer: Composer<Context>;
    const ctx = new Context(
        // deno-lint-ignore no-explicit-any
        { message: { text: "test" } } as any,
        // deno-lint-ignore no-explicit-any
        0 as any,
        // deno-lint-ignore no-explicit-any
        0 as any,
    );
    const next = () => Promise.resolve();
    let middleware: Spy<MiddlewareFn<Context>>;
    const exec = (c = ctx) => composer.middleware()(c, next);

    beforeEach(() => {
        composer = new Composer();
        middleware = spy((_ctx) => {});
    });

    it("should call handlers", async () => {
        composer.use(middleware);
        await exec();
        assertEquals(middleware.calls[0].args[0], ctx);
    });
    it("should call constructor handlers", async () => {
        composer = new Composer(middleware);
        await exec();
        assertEquals(middleware.calls[0].args[0], ctx);
    });
    it("should prevent next from being called more than once", async () => {
        let first = true;
        const com = new Composer();
        com.use(async (_, next) => {
            await next();
            await assertRejects(() => next(), "already called");
        }, () => {
            if (first) first = false;
            else throw new Error("failed!");
        });
        composer.use(com);
        await exec();
    });

    describe(".use", () => {
        it("should work with multiple handlers", async () => {
            composer.use((_, next) => next(), (_, next) => next(), middleware);
            await exec();
            assertEquals(middleware.calls[0].args[0], ctx);
        });
        it("should with multiple handlers in different calls", async () => {
            composer.use((_, next) => next(), (_, next) => next());
            composer.use((_, next) => next(), (_, next) => next());
            composer.use((_, next) => next(), (_, next) => next(), middleware);
            await exec();
            assertEquals(middleware.calls[0].args[0], ctx);
        });
        it("should call sub-trees", async () => {
            const sub = composer.use((_, next) => next());
            assertInstanceOf(sub, Composer);
            sub.use((_, next) => next());
            sub.use((_, next) => next(), middleware);
            await exec();
            assertEquals(middleware.calls[0].args[0], ctx);
        });
        it("should allow errors to bubble up", async () => {
            composer.use((_, next) => next())
                .use((_, next) => next(), () => {
                    throw new Error("evil");
                });
            await assertRejects(
                async () => await composer.middleware()(ctx, next),
                Error,
                "evil",
            );
        });
    });

    describe(".on", () => {
        it("should run filter queries", async () => {
            composer.on("::bot_command", middleware); // nope
            composer.on(["::code", "message:text"], middleware);
            await exec(ctx);
            await exec({ update: { channel_post: { text: "" } } } as Context); // nope
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
        it("should allow chaining filter queries", async () => {
            composer.on([":text"]).on("message").use(middleware);
            await exec();
            await exec({ update: { channel_post: { text: "" } } } as Context);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
    });

    describe(".hears", () => {
        it("should check for text", async () => {
            composer.hears("test", middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
        it("should allow chaining hears", async () => {
            composer.hears(/^x.*/).hears(/.*st$/, middleware); // nope
            composer.hears(/^x.*/).hears(/.*x$/, middleware); // nope
            composer.hears(/^te.*/).hears(/.*st$/, middleware);
            await exec();
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], ctx);
        });
    });

    describe(".command", () => {
        const c = new Context(
            {
                message: {
                    text: "/start",
                    entities: [{ type: "bot_command", offset: 0, length: 6 }],
                },
                // deno-lint-ignore no-explicit-any
            } as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
        );
        it("should check for commands", async () => {
            composer.command("start", middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
        it("should allow chaining commands", async () => {
            composer.command(["help"])
                .command(["start", "settings"], middleware); // nope
            composer.command(["help", "start"])
                .command(["settings"], middleware); // nope
            composer.command(["help", "start"])
                .command(["start", "settings"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
    });

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

    describe(".callbackQuery", () => {
        const c = new Context(
            // deno-lint-ignore no-explicit-any
            { callback_query: { data: "test" } } as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
            // deno-lint-ignore no-explicit-any
            0 as any,
        );
        it("should check for callback query data", async () => {
            composer.callbackQuery("no-data", middleware);
            composer.callbackQuery(["nope", "test"], middleware);
            await exec(c);
            assertEquals(middleware.calls.length, 1);
            assertEquals(middleware.calls[0].args[0], c);
        });
        it("should allow chaining callback query data checks", async () => {
            composer.callbackQuery(["nope"])
                .callbackQuery(["test", "nei"], middleware); // nope
            composer.callbackQuery(["nope", "test"])
                .callbackQuery(["nei"], middleware); // nope
            composer.callbackQuery(["nope", /test/])
                .callbackQuery(["test", "nei"], middleware);
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
});

describe("run", () => {
    it("should run middleware", async () => {
        const ctx = { update: { message: { text: "" } } } as Context;
        const middleware: Spy<MiddlewareFn<Context>> = spy((_ctx) => {});
        await run(middleware, ctx);
        assertEquals(middleware.calls.length, 1);
        assertEquals(middleware.calls[0].args[0], ctx);
    });
});
