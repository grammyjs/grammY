import { session, type SessionFlavor } from "../../src/convenience/session.ts";
import { Composer, type Context, type MiddlewareFn } from "../../src/mod.ts";
import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { type Spy, spy } from "https://deno.land/std@0.147.0/testing/mock.ts";
import {
    beforeEach,
    describe,
    it,
} from "https://deno.land/std@0.147.0/testing/bdd.ts";

describe("session", () => {
    type C = Context & SessionFlavor<string>;
    let composer: Composer<C>;
    const ctx = { message: { text: "" }, session: "" } as C;
    const next = () => Promise.resolve();
    let middleware: Spy<MiddlewareFn<Context>>;

    beforeEach(() => {
        composer = new Composer();
        middleware = spy((_ctx) => {});
    });

    it("should pass through updates", async () => {
        composer.use(session(), middleware);
        await composer.middleware()(ctx, next);
        assertEquals(middleware.calls[0].args[0], ctx);
    });
});

// TODO: add tests:
// - for reads of objects
// - for reads of primitives
// - for writes of objects
// - for writes of primitives
// - for read-after-write
// - for all of the above with a JSON serialization adapter
// - for all of the above with lazy sessions
// - for different concurrent situations with lazy sessions
// - for the specifics of the memory session storage, such TTL
