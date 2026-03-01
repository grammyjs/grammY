import { createRawApi, type TransformableApi } from "../../src/core/client.ts";
import { HttpError } from "../../src/core/error.ts";
import { GrammyError } from "../../src/mod.ts";
import { type ApiResponse } from "../../src/types.ts";
import {
    afterEach,
    assertEquals,
    assertRejects,
    beforeEach,
    describe,
    it,
    spy,
    type Stub,
    stub,
} from "../deps.test.ts";

const token = "secret-token";

describe("API client", () => {
    let api: TransformableApi;
    let canUseWebhookReply: boolean;
    let response: ApiResponse<{ testValue: number }>;
    let fetchStub: Stub<typeof globalThis>;

    beforeEach(() => {
        fetchStub = stub(
            globalThis,
            "fetch",
            () => Promise.resolve(new Response(JSON.stringify(response))),
        );
        canUseWebhookReply = false;
        api = createRawApi(token, {
            apiRoot: "my-api-root",
            buildUrl: spy((root, token, method) => `${root}${token}${method}`),
            canUseWebhookReply: () => canUseWebhookReply,
            timeoutSeconds: 1,
        }, {
            send: spy(() => {}),
        });
    });

    afterEach(() => {
        fetchStub.restore();
    });

    it("should return payloads", async () => {
        response = { ok: true, result: { testValue: 0 } };
        const me = await api.raw.getMe();
        assertEquals<unknown>(me, response.result);
    });

    it("should throw errors", async () => {
        response = { ok: false, error_code: 42, description: "evil" };
        await assertRejects(
            () => api.raw.getMe(),
            GrammyError,
            "Call to 'getMe' failed! (42: evil)",
        );
    });

    it("should throw HttpError when response body reading fails", async () => {
        const networkError = new TypeError("terminated");
        fetchStub.restore();
        fetchStub = stub(
            globalThis,
            "fetch",
            () =>
                Promise.resolve({
                    json: () => Promise.reject(networkError),
                } as unknown as Response),
        );
        // Recreate api so it captures the new fetch stub
        api = createRawApi(token, {
            apiRoot: "my-api-root",
            buildUrl: spy((root, token, method) => `${root}${token}${method}`),
            canUseWebhookReply: () => canUseWebhookReply,
            timeoutSeconds: 1,
        }, {
            send: spy(() => {}),
        });
        const err = await assertRejects(
            () => api.raw.getMe(),
            HttpError,
            "Network request for 'getMe' failed!",
        );
        assertEquals(err.error, networkError);
    });
});

// TODO: add tests:
// - for all config options
// - for webhook reply
// - for api transformers
// - for networking errors
// - for networking timeouts
