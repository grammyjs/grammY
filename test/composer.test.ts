import { Composer, type MiddlewareFn } from "../src/composer.ts";
import { type Context } from "../src/context.ts";
import {
    assertEquals,
    assertRejects,
} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import { type Spy, spy } from "https://deno.land/std@0.148.0/testing/mock.ts";

import {
    beforeEach,
    describe,
    it,
} from "https://deno.land/std@0.148.0/testing/bdd.ts";

describe("Composer", () => {
    let composer: Composer<Context>;
    const ctx = { message: { text: "" } } as Context;
    const next = () => Promise.resolve();
    let middleware: Spy<MiddlewareFn<Context>>;

    beforeEach(() => {
        composer = new Composer();
        middleware = spy((_ctx) => {});
    });

    it("should call handlers", async () => {
        composer.use(middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should call constructor handlers", async () => {
        composer = new Composer(middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should call multiple handlers", async () => {
        composer.use((_, next) => next(), (_, next) => next(), middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should call multiple handlers in different calls", async () => {
        composer.use((_, next) => next(), (_, next) => next());
        composer.use((_, next) => next(), (_, next) => next());
        composer.use((_, next) => next(), (_, next) => next(), middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should call sub-trees", async () => {
        composer.use((_, next) => next())
            .use((_, next) => next(), middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });

    it("should allow errors to bubble up", () => {
        composer.use((_, next) => next())
            .use((_, next) => next(), () => {
                throw new Error("evil");
            });
        assertRejects(
            async () => await composer.middleware()(ctx, next),
            Error,
            "evil",
        );
    });
});

// TODO: add tests for the filtering logic in all remaining composer methods
