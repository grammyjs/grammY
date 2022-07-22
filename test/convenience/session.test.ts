import {
    LazyMultiSessionFlavor,
    lazySession,
    type LazySessionFlavor,
    MemorySessionStorage,
    session,
    type SessionFlavor,
} from "../../src/convenience/session.ts";
import { Composer, type Context, type MiddlewareFn } from "../../src/mod.ts";
import {
    assert,
    assertEquals,
    assertRejects,
} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { spy } from "https://deno.land/std@0.147.0/testing/mock.ts";
import { describe, it } from "https://deno.land/std@0.147.0/testing/bdd.ts";

const TICK_MS = 50;
const tick = (n = 1) => new Promise((r) => setTimeout(r, n * TICK_MS));

describe("session", () => {
    const next = () => Promise.resolve();

    it("should pass through updates", async () => {
        type C = Context & SessionFlavor<never>;
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        const middleware = spy((_ctx) => {});
        composer.use(session(), middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should throw when reading from empty session key", async () => {
        type C = Context & SessionFlavor<number>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            session({ getSessionKey: () => undefined }),
            () => ctx.session,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should throw when writing to empty session key", async () => {
        type C = Context & SessionFlavor<number>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            session({ getSessionKey: () => undefined }),
            () => ctx.session = 0,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should skip write upon error", async () => {
        type C = Context & SessionFlavor<number>;
        const storage = {
            read: spy((_key: string) => 0),
            write: spy((_key: string, _value: number) => {}),
            delete: spy((_key: string) => {}),
        };
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        composer.use(session({ storage }))
            .use(() => {
                ctx.session = 0;
                throw new Error("err");
            });
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
        assertEquals(storage.read.calls.length, 1);
        assertEquals(storage.read.calls[0].args, ["42"]);
        assertEquals(storage.write.calls.length, 0);
        assertEquals(storage.delete.calls.length, 0);
    });

    it("should do IO with primitives", async () => {
        let val: number | undefined = 0;
        const storage = {
            read: spy((_key: string) => val),
            write: spy((_key: string, value: number) => {
                val = value;
            }),
            delete: spy((_key: string) => {
                val = undefined;
            }),
        };
        type C = Context & SessionFlavor<number>;
        const composer = new Composer<C>();
        let ctx = { chat: { id: 42 } } as C;
        composer.use(session({ storage }))
            .use((ctx) => {
                if (ctx.session === 0) ctx.session = 1;
                else ctx.session = null;
            });

        await composer.middleware()(ctx, next);
        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);

        assertEquals(storage.read.calls.length, 2);
        assertEquals(storage.read.calls[0].args, ["42"]);
        assertEquals(storage.read.calls[1].args, ["42"]);
        assertEquals(storage.read.calls[0].returned, 0);
        assertEquals(storage.read.calls[1].returned, 1);

        assertEquals(storage.write.calls.length, 1);
        assertEquals(storage.write.calls[0].args, ["42", 1]);

        assertEquals(storage.delete.calls.length, 1);
        assertEquals(storage.delete.calls[0].args, ["42"]);
    });

    it("should do IO with objects", async () => {
        let val: Record<string, number> | undefined;
        const storage = {
            read: spy((_key: string) => val),
            write: spy((_key: string, value: Record<string, number>) => {
                val = value;
            }),
            delete: spy((_key: string) => {
                val = undefined;
            }),
        };
        const initial = spy(() => ({}));
        type C = Context & SessionFlavor<Record<string, number>>;
        const composer = new Composer<C>();
        let ctx = { chat: { id: 42 } } as C;
        composer
            .use(session({ storage, initial }))
            .use((ctx) => {
                const idx = storage.read.calls.length - 1;
                switch (Object.keys(ctx.session).length) {
                    case 0:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            undefined,
                        );
                        ctx.session.foo = 0;
                        break;
                    case 1:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            { foo: 0 },
                        );
                        ctx.session.foo++;
                        ctx.session.bar = 0;
                        break;
                    case 2:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            { foo: 1, bar: 0 },
                        );
                        ctx.session.bar++;
                        ctx.session.baz = 0;
                        break;
                    case 3:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            { foo: 1, bar: 1, baz: 0 },
                        );
                        ctx.session = undefined;
                        break;
                }
            });

        await composer.middleware()(ctx, next);
        assertEquals(storage.write.calls[0].args, ["42", { foo: 0 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage.write.calls[1].args, ["42", { foo: 1, bar: 0 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(
            storage.write.calls[2].args,
            ["42", { foo: 1, bar: 1, baz: 0 }],
        );

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage.delete.calls[0].args, ["42"]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage.write.calls[3].args, ["42", { foo: 0 }]);

        assertEquals(initial.calls.length, 2);
        assertEquals(storage.read.calls.length, 5);
        assertEquals(storage.write.calls.length, 4);
        assertEquals(storage.delete.calls.length, 1);
    });
});

type X = { a: string } extends Record<string, unknown> ? true : false;

describe("multi session", () => {
    const next = () => Promise.resolve();

    it("should pass through updates", async () => {
        type C = Context & SessionFlavor<Record<never, never>>;
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        const middleware = spy((_ctx) => {});
        composer.use(session({ type: "multi" }), middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should throw when reading from empty session key", async () => {
        type C = Context & SessionFlavor<{ prop: number }>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            session({
                type: "multi",
                prop: { getSessionKey: () => undefined },
            }),
            () => ctx.session.prop,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should throw when writing to empty session key", async () => {
        type C = Context & SessionFlavor<{ prop: number }>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            session({
                type: "multi",
                prop: { getSessionKey: () => undefined },
            }),
            () => ctx.session.prop = 0,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should skip write upon error", async () => {
        type C = Context & SessionFlavor<{ prop: number }>;
        const storage = {
            read: spy((_key: string) => 0),
            write: spy((_key: string, _value: number) => {}),
            delete: spy((_key: string) => {}),
        };
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        composer.use(session({ type: "multi", prop: { storage } }))
            .use(() => {
                ctx.session.prop = 0;
                throw new Error("err");
            });
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
        assertEquals(storage.read.calls.length, 1);
        assertEquals(storage.read.calls[0].args, ["42"]);
        assertEquals(storage.write.calls.length, 0);
        assertEquals(storage.delete.calls.length, 0);
    });

    it("should do IO with objects", async () => {
        let val0: Record<string, number> | undefined;
        let val1: Record<string, number> | undefined;
        const storage0 = {
            read: spy((_key: string) => val0),
            write: spy((_key: string, value: Record<string, number>) => {
                val0 = value;
            }),
            delete: spy((_key: string) => {
                val0 = undefined;
            }),
        };
        const storage1 = {
            read: spy((_key: string) => val1),
            write: spy((_key: string, value: Record<string, number>) => {
                val1 = value;
            }),
            delete: spy((_key: string) => {
                val1 = undefined;
            }),
        };
        const initial0 = spy(() => ({}));
        const initial1 = spy(() => ({}));
        interface SessionData {
            prop0: Record<string, number>;
            prop1: Record<string, number>;
        }
        type C = Context & SessionFlavor<SessionData>;
        const composer = new Composer<C>();
        let ctx = { chat: { id: 42 } } as C;
        composer
            .use(
                session({
                    type: "multi",
                    prop0: { storage: storage0, initial: initial0 },
                    prop1: { storage: storage1, initial: initial1 },
                }),
            )
            .use((ctx) => {
                const idx0 = storage0.read.calls.length - 1;
                const idx1 = storage1.read.calls.length - 1;
                switch (Object.keys(ctx.session.prop0).length) {
                    case 0:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            undefined,
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            undefined,
                        );
                        ctx.session.prop0.foo = 0;
                        ctx.session.prop1.foo = 0;
                        break;
                    case 1:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            { foo: 0 },
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            { foo: 0 },
                        );
                        ctx.session.prop0.foo++;
                        ctx.session.prop0.bar = 0;
                        ctx.session.prop1.foo++;
                        break;
                    case 2:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            { foo: 1, bar: 0 },
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            { foo: 1 },
                        );
                        ctx.session.prop0.bar++;
                        ctx.session.prop0.baz = 0;
                        ctx.session.prop1.foo++;
                        break;
                    case 3:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            { foo: 1, bar: 1, baz: 0 },
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            { foo: 2 },
                        );
                        ctx.session = undefined;
                        break;
                }
            });

        await composer.middleware()(ctx, next);
        assertEquals(storage0.write.calls[0].args, ["42", { foo: 0 }]);
        assertEquals(storage1.write.calls[0].args, ["42", { foo: 0 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage0.write.calls[1].args, ["42", { foo: 1, bar: 0 }]);
        assertEquals(storage1.write.calls[1].args, ["42", { foo: 1 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(
            storage0.write.calls[2].args,
            ["42", { foo: 1, bar: 1, baz: 0 }],
        );
        assertEquals(storage1.write.calls[2].args, ["42", { foo: 2 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage0.delete.calls[0].args, ["42"]);
        assertEquals(storage1.delete.calls[0].args, ["42"]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage0.write.calls[3].args, ["42", { foo: 0 }]);
        assertEquals(storage1.write.calls[3].args, ["42", { foo: 0 }]);

        assertEquals(initial0.calls.length, 2);
        assertEquals(storage0.read.calls.length, 5);
        assertEquals(storage0.write.calls.length, 4);
        assertEquals(storage0.delete.calls.length, 1);

        assertEquals(initial1.calls.length, 2);
        assertEquals(storage1.read.calls.length, 5);
        assertEquals(storage1.write.calls.length, 4);
        assertEquals(storage1.delete.calls.length, 1);
    });
});

describe("lazy session", () => {
    const next = () => Promise.resolve();

    it("should pass through updates", async () => {
        type C = Context & SessionFlavor<never>;
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        const middleware = spy((_ctx) => {});
        composer.use(lazySession(), middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should throw when reading from empty session key", async () => {
        type C = Context & LazySessionFlavor<number>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            lazySession({ getSessionKey: () => undefined }),
            () => ctx.session,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should throw when writing to empty session key", async () => {
        type C = Context & LazySessionFlavor<number>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            lazySession({ getSessionKey: () => undefined }),
            () => ctx.session = 0,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should skip write upon error", async () => {
        type C = Context & LazySessionFlavor<number>;
        const storage = {
            read: spy((_key: string) => 0),
            write: spy((_key: string, _value: number) => {}),
            delete: spy((_key: string) => {}),
        };
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        composer.use(lazySession({ storage }))
            .use(async () => {
                const old = await ctx.session;
                ctx.session = old + 1;
                throw new Error("err");
            });
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
        assertEquals(storage.read.calls.length, 1);
        assertEquals(storage.read.calls[0].args, ["42"]);
        assertEquals(storage.write.calls.length, 0);
        assertEquals(storage.delete.calls.length, 0);
    });

    it("should do IO with primitives", async () => {
        let val: number | undefined = 0;
        const storage = {
            read: spy((_key: string) => val),
            write: spy((_key: string, value: number) => {
                val = value;
            }),
            delete: spy((_key: string) => {
                val = undefined;
            }),
        };
        type C = Context & LazySessionFlavor<number>;
        const composer = new Composer<C>();
        let ctx = { chat: { id: 42 } } as C;
        composer.use(lazySession({ storage }))
            .use(async (ctx) => {
                if (await ctx.session === 0) ctx.session = 1;
                else ctx.session = null;
            });

        await composer.middleware()(ctx, next);
        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);

        assertEquals(storage.read.calls.length, 2);
        assertEquals(storage.read.calls[0].args, ["42"]);
        assertEquals(storage.read.calls[1].args, ["42"]);
        assertEquals(storage.read.calls[0].returned, 0);
        assertEquals(storage.read.calls[1].returned, 1);

        assertEquals(storage.write.calls.length, 1);
        assertEquals(storage.write.calls[0].args, ["42", 1]);

        assertEquals(storage.delete.calls.length, 1);
        assertEquals(storage.delete.calls[0].args, ["42"]);
    });

    it("should do IO with objects", async () => {
        let val: Record<string, number> | undefined;
        const storage = {
            read: spy((_key: string) => val),
            write: spy((_key: string, value: Record<string, number>) => {
                val = value;
            }),
            delete: spy((_key: string) => {
                val = undefined;
            }),
        };
        const initial = spy(() => ({}));
        type C = Context & LazySessionFlavor<Record<string, number>>;
        const composer = new Composer<C>();
        let ctx = { chat: { id: 42 } } as C;
        composer
            .use(lazySession({ storage, initial }))
            .use(async (ctx) => {
                let idx = storage.read.calls.length - 1;
                await ctx.session;
                assertEquals(++idx, storage.read.calls.length - 1);
                switch (Object.keys(await ctx.session).length) {
                    case 0:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            undefined,
                        );
                        (await ctx.session).foo = 0;
                        break;
                    case 1:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            { foo: 0 },
                        );
                        (await ctx.session).foo++;
                        (await ctx.session).bar = 0;
                        break;
                    case 2:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            { foo: 1, bar: 0 },
                        );
                        (await ctx.session).bar++;
                        (await ctx.session).baz = 0;
                        break;
                    case 3:
                        assertEquals(storage.read.calls[idx].args, ["42"]);
                        assertEquals(
                            storage.read.calls[idx].returned,
                            { foo: 1, bar: 1, baz: 0 },
                        );
                        ctx.session = undefined;
                        break;
                }
            });

        await composer.middleware()(ctx, next);
        assertEquals(storage.write.calls[0].args, ["42", { foo: 0 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage.write.calls[1].args, ["42", { foo: 1, bar: 0 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(
            storage.write.calls[2].args,
            ["42", { foo: 1, bar: 1, baz: 0 }],
        );

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage.delete.calls[0].args, ["42"]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage.write.calls[3].args, ["42", { foo: 0 }]);

        assertEquals(initial.calls.length, 2);
        assertEquals(storage.read.calls.length, 5);
        assertEquals(storage.write.calls.length, 4);
        assertEquals(storage.delete.calls.length, 1);
    });

    let val: number | undefined;
    let storage = {
        read: spy((_key: string) => tick(2).then(() => val)),
        write: spy((_key: string, value: number) => {
            val = value;
        }),
        delete: spy((_key: string) => {
            val = undefined;
        }),
    };
    type C = Context & LazySessionFlavor<number>;
    let composer: Composer<C>;
    let ctx: C;

    function reset() {
        val = 0;
        storage = {
            read: spy((_key: string) => tick(2).then(() => val)),
            write: spy((_key: string, value: number) => {
                val = value;
            }),
            delete: spy((_key: string) => {
                val = undefined;
            }),
        };
        composer = new Composer<C>();
        ctx = { chat: { id: 42 } } as C;
    }
    async function run(mw: MiddlewareFn<C>) {
        reset();
        composer.use(lazySession({ storage, initial: () => 0 }), mw);
        await composer.middleware()(ctx, next);
    }

    it("should not read after write", async () => {
        await run(async (ctx) => {
            ctx.session = 0;
            await ctx.session;
        });
        assertEquals(storage.read.calls.length, 0);
        assertEquals(storage.write.calls.length, 1);
    });

    it("should not write if nothing was read", async () => {
        await run(() => {});
        assertEquals(storage.read.calls.length, 0);
        assertEquals(storage.write.calls.length, 0);
    });

    it("should discard read if it completes after manual write", async () => {
        await run(async (ctx) => {
            const p = Promise.resolve(ctx.session)
                .then(async () => {
                    assertEquals(await ctx.session, 42);
                });
            await tick();
            ctx.session = 42;
            await p;
        });
    });

    it("should await written promises", async () => {
        await run((ctx) => {
            ctx.session = tick().then(() => 42);
        });
        assertEquals(storage.write.calls.length, 1);
        assertEquals(storage.write.calls[0].args, ["42", 42]);
    });

    it("should wait for read ops to complete", async () => {
        let p: Promise<void> | undefined;
        let done = false;
        await run((ctx) => {
            p = Promise.resolve(ctx.session).then(() => {
                done = true;
            });
        });
        assertEquals(storage.read.calls.length, 1);
        assertEquals(storage.read.calls[0].args, ["42"]);
        assertEquals(storage.write.calls.length, 1);
        assertEquals(storage.write.calls[0].args, ["42", 0]);
        assert(done);
        await p;
    });
});
describe("lazy multi session", () => {
    const next = () => Promise.resolve();

    it("should pass through updates", async () => {
        interface SessionData {
            prop: number;
        }
        type C = Context & LazyMultiSessionFlavor<SessionData>;
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        const middleware = spy((_ctx) => {});
        composer.use(lazySession<SessionData, C>({ type: "multi" }))
            .use(middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should throw when reading from empty session key", async () => {
        interface SessionData {
            prop: number;
        }
        type C = Context & LazyMultiSessionFlavor<SessionData>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            lazySession<SessionData, C>({
                type: "multi",
                prop: { getSessionKey: () => undefined },
            }),
            () => ctx.session.prop,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should throw when writing to empty session key", async () => {
        interface SessionData {
            prop: number;
        }
        type C = Context & LazyMultiSessionFlavor<SessionData>;
        const composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            lazySession<SessionData, C>({
                type: "multi",
                prop: { getSessionKey: () => undefined },
            }),
            () => ctx.session.prop = 0,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
    });

    it("should skip write upon error", async () => {
        interface SessionData {
            prop: number;
        }
        type C = Context & LazyMultiSessionFlavor<SessionData>;
        const storage = {
            read: spy((_key: string) => 0),
            write: spy((_key: string, _value: number) => {}),
            delete: spy((_key: string) => {}),
        };
        const composer = new Composer<C>();
        const ctx = { chat: { id: 42 } } as C;
        composer.use(
            lazySession<SessionData, C>({
                type: "multi",
                prop: { storage },
            }),
            async () => {
                const old = await ctx.session.prop;
                ctx.session.prop = old + 1;
                throw new Error("err");
            },
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });
        assertEquals(storage.read.calls.length, 1);
        assertEquals(storage.read.calls[0].args, ["42"]);
        assertEquals(storage.write.calls.length, 0);
        assertEquals(storage.delete.calls.length, 0);
    });

    it("should do IO with objects", async () => {
        let val0: Record<string, number> | undefined;
        let val1: Record<string, number> | undefined;
        const storage0 = {
            read: spy((_key: string) => val0),
            write: spy((_key: string, value: Record<string, number>) => {
                val0 = value;
            }),
            delete: spy((_key: string) => {
                val0 = undefined;
            }),
        };
        const storage1 = {
            read: spy((_key: string) => val1),
            write: spy((_key: string, value: Record<string, number>) => {
                val1 = value;
            }),
            delete: spy((_key: string) => {
                val1 = undefined;
            }),
        };
        const initial0 = spy(() => ({}));
        const initial1 = spy(() => ({}));
        interface SessionData {
            prop0: Record<string, number>;
            prop1: Record<string, number>;
        }
        type C = Context & LazyMultiSessionFlavor<SessionData>;
        const composer = new Composer<C>();
        let ctx = { chat: { id: 42 } } as C;
        composer
            .use(
                lazySession<SessionData, C>({
                    type: "multi",
                    prop0: { storage: storage0, initial: initial0 },
                    prop1: { storage: storage1, initial: initial1 },
                }),
            )
            .use(async (ctx) => {
                let idx0 = storage0.read.calls.length - 1;
                let idx1 = storage1.read.calls.length - 1;
                await Promise.all([ctx.session.prop0, ctx.session.prop1]);
                assertEquals(++idx0, storage0.read.calls.length - 1);
                assertEquals(++idx1, storage1.read.calls.length - 1);
                switch (Object.keys(await ctx.session.prop0).length) {
                    case 0:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            undefined,
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            undefined,
                        );
                        (await ctx.session.prop0).foo = 0;
                        (await ctx.session.prop1).foo = 0;
                        break;
                    case 1:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            { foo: 0 },
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            { foo: 0 },
                        );
                        (await ctx.session.prop0).foo++;
                        (await ctx.session.prop0).bar = 0;
                        (await ctx.session.prop1).foo++;
                        break;
                    case 2:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            { foo: 1, bar: 0 },
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            { foo: 1 },
                        );
                        (await ctx.session.prop0).bar++;
                        (await ctx.session.prop0).baz = 0;
                        (await ctx.session.prop1).foo++;
                        break;
                    case 3:
                        assertEquals(storage0.read.calls[idx0].args, ["42"]);
                        assertEquals(
                            storage0.read.calls[idx0].returned,
                            { foo: 1, bar: 1, baz: 0 },
                        );
                        assertEquals(storage1.read.calls[idx1].args, ["42"]);
                        assertEquals(
                            storage1.read.calls[idx1].returned,
                            { foo: 2 },
                        );
                        ctx.session = undefined;
                        break;
                }
            });

        await composer.middleware()(ctx, next);
        assertEquals(storage0.write.calls[0].args, ["42", { foo: 0 }]);
        assertEquals(storage1.write.calls[0].args, ["42", { foo: 0 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage0.write.calls[1].args, ["42", { foo: 1, bar: 0 }]);
        assertEquals(storage1.write.calls[1].args, ["42", { foo: 1 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(
            storage0.write.calls[2].args,
            ["42", { foo: 1, bar: 1, baz: 0 }],
        );
        assertEquals(storage1.write.calls[2].args, ["42", { foo: 2 }]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage0.delete.calls[0].args, ["42"]);
        assertEquals(storage1.delete.calls[0].args, ["42"]);

        ctx = { chat: { id: 42 } } as C;
        await composer.middleware()(ctx, next);
        assertEquals(storage0.write.calls[3].args, ["42", { foo: 0 }]);
        assertEquals(storage1.write.calls[3].args, ["42", { foo: 0 }]);

        assertEquals(initial0.calls.length, 2);
        assertEquals(storage0.read.calls.length, 5);
        assertEquals(storage0.write.calls.length, 4);
        assertEquals(storage0.delete.calls.length, 1);

        assertEquals(initial1.calls.length, 2);
        assertEquals(storage1.read.calls.length, 5);
        assertEquals(storage1.write.calls.length, 4);
        assertEquals(storage1.delete.calls.length, 1);
    });

    let val0: number | undefined;
    let val1: number | undefined;
    let storage0 = {
        read: spy((_key: string) => tick(2).then(() => val0)),
        write: spy((_key: string, value: number) => {
            val0 = value;
        }),
        delete: spy((_key: string) => {
            val0 = undefined;
        }),
    };
    let storage1: typeof storage0;
    interface SessionData {
        prop0: number;
        prop1: number;
    }
    type C = Context & LazyMultiSessionFlavor<SessionData>;
    let composer: Composer<C>;
    let ctx: C;

    function reset() {
        val0 = val1 = 0;
        storage0 = {
            read: spy((_key: string) => tick(2).then(() => val0)),
            write: spy((_key: string, value: number) => {
                val0 = value;
            }),
            delete: spy((_key: string) => {
                val0 = undefined;
            }),
        };
        storage1 = {
            read: spy((_key: string) => tick(2).then(() => val1)),
            write: spy((_key: string, value: number) => {
                val1 = value;
            }),
            delete: spy((_key: string) => {
                val1 = undefined;
            }),
        };
        composer = new Composer<C>();
        ctx = { chat: { id: 42 } } as C;
    }
    async function run(mw: MiddlewareFn<C>) {
        reset();
        composer.use(
            lazySession<SessionData, C>({
                type: "multi",
                prop0: { storage: storage0, initial: () => 0 },
                prop1: { storage: storage1, initial: () => 0 },
            }),
            mw,
        );
        await composer.middleware()(ctx, next);
    }

    it("should not read after write", async () => {
        await run(async (ctx) => {
            ctx.session.prop0 = 0;
            ctx.session.prop0;
            await ctx.session.prop1;
        });
        assertEquals(storage0.read.calls.length, 0);
        assertEquals(storage0.write.calls.length, 1);
        assertEquals(storage1.read.calls.length, 1);
        assertEquals(storage1.write.calls.length, 1);
    });

    it("should not write if nothing was read", async () => {
        await run(async () => {
            await ctx.session.prop1;
        });
        assertEquals(storage0.read.calls.length, 0);
        assertEquals(storage0.write.calls.length, 0);
        assertEquals(storage1.read.calls.length, 1);
        assertEquals(storage1.write.calls.length, 1);
    });

    it("should discard read if it completes after manual write", async () => {
        await run(async (ctx) => {
            const p0 = Promise.resolve(ctx.session.prop0)
                .then(async () => {
                    assertEquals(await ctx.session.prop0, 42);
                    assertEquals(await ctx.session.prop1, 0);
                });
            const p1 = ctx.session.prop1;
            await tick();
            ctx.session.prop0 = 42;
            await Promise.all([p0, p1]);
        });
    });

    it("should await written promises", async () => {
        await run((ctx) => {
            ctx.session.prop0 = tick().then(() => 42);
            ctx.session.prop1 = 0;
        });
        assertEquals(storage0.write.calls.length, 1);
        assertEquals(storage0.write.calls[0].args, ["42", 42]);
        assertEquals(storage1.write.calls.length, 1);
        assertEquals(storage1.write.calls[0].args, ["42", 0]);
    });

    it("should wait for read ops to complete", async () => {
        let p: Promise<void> | undefined;
        let done = false;
        await run((ctx) => {
            p = Promise.resolve(ctx.session.prop0).then(() => {
                done = true;
            });
            ctx.session.prop1;
        });
        assertEquals(storage0.read.calls.length, 1);
        assertEquals(storage0.read.calls[0].args, ["42"]);
        assertEquals(storage0.write.calls.length, 1);
        assertEquals(storage0.write.calls[0].args, ["42", 0]);
        assert(done);
        assertEquals(storage1.read.calls.length, 1);
        assertEquals(storage1.read.calls[0].args, ["42"]);
        assertEquals(storage1.write.calls.length, 1);
        assertEquals(storage1.write.calls[0].args, ["42", 0]);
        await p;
    });
});

describe("MemorySessionStorage", () => {
    it("should support read, write, and delete operations", () => {
        const store = new MemorySessionStorage<number>();
        assertEquals(store.read("k"), undefined);
        store.write("k", 42);
        assertEquals(store.read("k"), 42);
        store.delete("k");
        assertEquals(store.read("k"), undefined);
    });
    it("should support enumerating all keys", () => {
        const store = new MemorySessionStorage<number>();
        store.write("k0", 42);
        store.write("k1", 43);
        store.write("k2", 44);
        assertEquals(store.readAll(), [42, 43, 44]);
    });
    it("should support timeouts", async () => {
        const store = new MemorySessionStorage<number>(TICK_MS);
        store.write("k", 42);
        assertEquals(store.read("k"), 42);
        await tick(2);
        assertEquals(store.read("k"), undefined);
        store.write("k", 42);
        assertEquals(store.read("k"), 42);
    });
});
