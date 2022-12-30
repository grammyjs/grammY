import {
    type Enhance,
    enhanceStorage,
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
    assertThrows,
} from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { spy } from "https://deno.land/std@0.170.0/testing/mock.ts";
import { describe, it } from "https://deno.land/std@0.170.0/testing/bdd.ts";

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
        let composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(session(), () => ctx.session);
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });

        composer = new Composer<C>();
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
        let composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(
            session({ type: "multi", prop: {} }),
            () => ctx.session.prop,
        );
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });

        composer = new Composer<C>();
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

    it("should throw when used with multi sessions", () => {
        assertThrows(
            () => lazySession({ type: "multi" as unknown as "single" }),
            "Cannot use lazy multi sessions",
        );
    });

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
        let composer = new Composer<C>();
        const ctx = {} as C;
        composer.use(lazySession(), () => ctx.session);
        await assertRejects(async () => {
            await composer.middleware()(ctx, next);
        });

        composer = new Composer<C>();
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

describe("enhanceStorage", () => {
    it("should support reading and writing __d", async () => {
        const storage = {
            read: spy((_key: string) => ({ __d: { __d: 42 } })),
            write: spy((_key: string, _value: { __d: { __d: number } }) => {}),
            delete: spy((_key: string) => {}),
        };
        const enhanced = enhanceStorage({ storage });
        assertEquals(await enhanced.read("key"), { __d: 42 });
        assertEquals(storage.read.calls[0].args, ["key"]);
        await enhanced.write("key", { __d: 42 });
        assertEquals(
            storage.write.calls[0].args,
            ["key", { __d: { __d: 42 } }],
        );
        await enhanced.delete("key");
        assertEquals(storage.delete.calls[0].args, ["key"]);
    });

    it("should support timeouts", async () => {
        const store = enhanceStorage({
            storage: new MemorySessionStorage<Enhance<number>>(),
            millisecondsToLive: TICK_MS,
        });
        await store.write("k", 42);
        assertEquals(await store.read("k"), 42);
        await tick(2);
        assertEquals(await store.read("k"), undefined);
        store.write("k", 42);
        assertEquals(await store.read("k"), 42);
    });

    it("should require migrations", () => {
        const storage = {
            read: spy((_key: string) => ({ __d: { __d: 42 } })),
            write: spy((_key: string, _value: { __d: { __d: number } }) => {}),
            delete: spy((_key: string) => {}),
        };
        assertThrows(
            () => enhanceStorage({ storage, migrations: {} }),
            Error,
            "No migrations given!",
        );
    });

    it("should not migrate undefined values", async () => {
        const storage = {
            read: spy((_key: string) => undefined),
            write: spy((_key: string, _value: { __d: number }) => {}),
            delete: spy((_key: string) => {}),
        };
        const enhanced = enhanceStorage({
            storage,
            migrations: {
                1: () => {
                    throw new Error("nope");
                },
            },
        });
        assertEquals(await enhanced.read("key"), undefined);
    });

    it("should not modify write and delete calls", async () => {
        const storage = {
            read: spy((_key: string) => undefined),
            write: spy(
                (_key: string, _value: { __d: number; v?: number }) => {},
            ),
            delete: spy((_key: string) => {}),
        };
        const enhanced = enhanceStorage({
            storage,
            migrations: {
                1: () => {
                    throw new Error("nope");
                },
            },
        });
        await enhanced.write("key", 42);
        assertEquals(storage.write.calls[0].args, ["key", { __d: 42, v: 1 }]);
        await enhanced.delete("key");
        assertEquals(storage.delete.calls[0].args, ["key"]);
    });

    it("should run migration functions from the start", async () => {
        const storage = {
            read: spy((_key: string) => 0 as unknown as { __d: number }),
            write: spy((_key: string, _value: { __d: number }) => {}),
            delete: spy((_key: string) => {}),
        };
        const enhanced = enhanceStorage({
            storage,
            migrations: {
                3: (old: number) => old *= 2,
                12: (old: number) => old **= 2,
                1: (old: number) => old += 10,
            },
        });
        assertEquals(await enhanced.read("key"), 400);
    });

    it("should run migration functions from the middle", async () => {
        const storage = {
            read: spy((_key: string) => ({ __d: 5, v: 3 })),
            write: spy((_key: string, _value: { __d: number }) => {}),
            delete: spy((_key: string) => {}),
        };
        const enhanced = enhanceStorage({
            storage,
            migrations: {
                3: (old: number) => old *= 2,
                12: (old: number) => old **= 2,
                1: (old: number) => old += 10,
            },
        });
        assertEquals(await enhanced.read("key"), 25);
    });

    it("should not migrate up-to-date values", async () => {
        const storage = {
            read: spy((_key: string) => ({ __d: 42, v: 12 })),
            write: spy((_key: string, _value: { __d: number }) => {}),
            delete: spy((_key: string) => {}),
        };
        const enhanced = enhanceStorage({
            storage,
            migrations: {
                3: (old: number) => old *= 2,
                12: (old: number) => old **= 2,
                1: (old: number) => old += 10,
            },
        });
        assertEquals(await enhanced.read("key"), 42);
    });

    it("should handle missing migrations", async () => {
        const storage = {
            read: spy((_key: string) => ({ __d: 5, v: 8 })),
            write: spy((_key: string, _value: { __d: number }) => {}),
            delete: spy((_key: string) => {}),
        };
        const enhanced = enhanceStorage({
            storage,
            migrations: {
                3: (old: number) => old *= 2,
                12: (old: number) => old **= 2,
                1: (old: number) => old += 10,
            },
        });
        assertEquals(await enhanced.read("key"), 25);
    });

    it("should be able to combine timeouts and migrations", async () => {
        const storage = new MemorySessionStorage<Enhance<number>>();
        const enhanced = enhanceStorage({
            storage,
            millisecondsToLive: TICK_MS,
            migrations: {
                3: (old: number) => old *= 2,
                12: (old: number) => old **= 2,
                1: (old: number) => old += 10,
            },
        });
        storage.write("k", 0 as unknown as Enhance<number>);
        assertEquals(await enhanced.read("k"), 400);
        await tick(2);
        assertEquals(await enhanced.read("k"), undefined);
        enhanced.write("k", 42);
        assertEquals(await enhanced.read("k"), 42);
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
