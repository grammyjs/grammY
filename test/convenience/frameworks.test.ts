import { adapters } from "../../src/convenience/frameworks.ts";
import type { Update } from "../../src/types.ts";
import { assertRejects, describe, it } from "../deps.test.ts";

describe("framework adapters", () => {
    it("http should reject malformed JSON bodies", async () => {
        class MockRequest {
            headers: Record<string, string | string[] | undefined> = {};
            dataListeners: Array<(chunk: unknown) => void> = [];
            endListeners: Array<() => void> = [];
            errorListeners: Array<() => void> = [];

            on(event: string, listener: (chunk: unknown) => void) {
                if (event === "data") this.dataListeners.push(listener);
                return this;
            }

            once(event: string, listener: () => void) {
                if (event === "end") this.endListeners.push(listener);
                if (event === "error") this.errorListeners.push(listener);
                return this;
            }
        }

        class MockResponse {
            writeHead(_status: number, _headers?: Record<string, string>) {
                return this;
            }
            end(_json?: string) {}
        }

        const req = new MockRequest();
        const res = new MockResponse();
        const updatePromise = adapters.http(req, res).update as Promise<Update>;

        req.dataListeners.forEach((listener) =>
            listener(new TextEncoder().encode("{"))
        );
        req.endListeners.forEach((listener) => listener());

        await assertRejects(() => updatePromise, SyntaxError);
    });
});
