import type { ApiCallFn } from "../src/client.ts";
import { TransformerComposer } from "../src/transform.ts";
import { assertEquals, describe, it } from "./deps.test.ts";

describe("TransformerComposer", () => {
    it("should pass methods not matched by .on to the previous transformer", async () => {
        const composer = new TransformerComposer();
        const scoped = composer.on("sendMessage");
        scoped.use((prev, data, signal) => prev(data, signal));

        let previousCalls = 0;
        const previous: ApiCallFn = () => {
            previousCalls++;
            return Promise.resolve({ ok: true, result: undefined as never });
        };

        await composer.transformer()(previous, {
            method: "getMe",
            payload: {},
        });

        assertEquals(previousCalls, 1);
    });

    it("should run scoped transformers for matching methods", async () => {
        const composer = new TransformerComposer();
        const scoped = composer.on("sendMessage");
        let scopedCalls = 0;
        scoped.use((prev, data, signal) => {
            scopedCalls++;
            return prev(data, signal);
        });

        let previousCalls = 0;
        const previous: ApiCallFn = () => {
            previousCalls++;
            return Promise.resolve({ ok: true, result: undefined as never });
        };

        await composer.transformer()(previous, {
            method: "sendMessage",
            payload: { chat_id: 1, text: "test" },
        });

        assertEquals(scopedCalls, 1);
        assertEquals(previousCalls, 1);
    });
});
