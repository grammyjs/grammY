import type { CallData, RawApi } from "../src/client.ts";
import { TransformerComposer } from "../src/transform.ts";
import { assertType, describe, type IsExact, it } from "./deps.test.ts";

// Compile-time type tests. No run-time assertion will actually run. Either compile fails or test passes.
describe("TransformerComposer types", () => {
    it("should accept a single method in .on", () => {
        const composer = new TransformerComposer();
        const scoped = composer.on("sendMessage");
        assertType<
            IsExact<
                typeof scoped,
                TransformerComposer<
                    RawApi,
                    Extract<CallData<RawApi>, { method: "sendMessage" }>
                >
            >
        >(true);
    });

    it("should accept an array of methods in .on", () => {
        const composer = new TransformerComposer();
        const scoped = composer.on(["sendMessage", "getMe"]);
        scoped.use((prev, data, signal) => prev(data, signal));
        assertType<
            IsExact<
                typeof scoped,
                TransformerComposer<
                    RawApi,
                    Extract<
                        CallData<RawApi>,
                        { method: "sendMessage" | "getMe" }
                    >
                >
            >
        >(true);
    });
});
