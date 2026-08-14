import type { ApiCallFn } from "../src/client.ts";
import { TransformerComposer } from "../src/transform.ts";
import {
    assertEquals,
    assertSpyCalls,
    describe,
    it,
    spy,
} from "./deps.test.ts";

describe("TransformerComposer", () => {
    it("should pass methods not matched by .on to the previous transformer", async () => {
        const composer = new TransformerComposer();
        const scoped = composer.on("sendMessage");
        scoped.use((prev, data, signal) => prev(data, signal));

        const previous = spy<ApiCallFn>(() =>
            Promise.resolve({ ok: true, result: undefined as never })
        );

        const result = await composer.transformer()(
            previous,
            { method: "getMe", payload: {} },
        );

        assertEquals(result, { ok: true, result: undefined });
        assertSpyCalls(previous, 1);
    });
});
