import { Api } from "../src/api.ts";
import type { ApiCallFn } from "../src/client.ts";
import { TransformerComposer } from "../src/transform.ts";
import type { TransformerObj } from "../src/transform.ts";
import type { UserFromGetMe } from "../src/types.ts";
import {
    assertEquals,
    assertSpyCalls,
    describe,
    it,
    stub,
} from "./deps.test.ts";

const me: UserFromGetMe = {
    id: 123456789,
    is_bot: true,
    first_name: "Test Bot",
    username: "test_bot",
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_guest_queries: false,
    supports_inline_queries: false,
    can_connect_to_business: false,
    has_main_web_app: false,
    has_topics_enabled: false,
    allows_users_to_create_topics: false,
    can_manage_bots: false,
    supports_join_request_queries: false,
};

/** Records the methods that reach the end of the transformer chain. */
function trackPrevious() {
    const calls: string[] = [];
    const previous: ApiCallFn = (data) => {
        calls.push(data.method);
        return Promise.resolve({ ok: true, result: undefined as never });
    };
    return { calls, previous };
}

describe("TransformerComposer", () => {
    it("should pass unscoped methods through an Api instance", async () => {
        using fetchStub = stub(
            globalThis,
            "fetch",
            () =>
                Promise.resolve(
                    new Response(JSON.stringify({ ok: true, result: me })),
                ),
        );
        const api = new Api("secret-token");
        const transformerComposer = new TransformerComposer();
        const scoped = transformerComposer.on("sendMessage");
        scoped.use((prev, data, signal) => prev(data, signal));
        api.transform(transformerComposer);

        const result = await api.getMe();

        assertEquals(result, me);
        assertSpyCalls(fetchStub, 1);
    });

    it("should pass methods not matched by .on to the previous transformer", async () => {
        const transformerComposer = new TransformerComposer();
        const scoped = transformerComposer.on("sendMessage");
        scoped.use((prev, data, signal) => prev(data, signal));

        let previousCalls = 0;
        const previous: ApiCallFn = () => {
            previousCalls++;
            return Promise.resolve({ ok: true, result: undefined as never });
        };

        await transformerComposer.transformer()(previous, {
            method: "getMe",
            payload: {},
        });

        assertEquals(previousCalls, 1);
    });

    it("should run a transformer scoped with .on for a matching method", async () => {
        const transformerComposer = new TransformerComposer();
        const scoped = transformerComposer.on("sendMessage");
        let scopedCalls = 0;
        scoped.use((prev, data, signal) => {
            scopedCalls++;
            return prev(data, signal);
        });

        const { calls, previous } = trackPrevious();
        await transformerComposer.transformer()(previous, {
            method: "sendMessage",
            payload: { chat_id: 1, text: "test" },
        });

        assertEquals(scopedCalls, 1);
        assertEquals(calls, ["sendMessage"]);
    });

    it("should pass data rejected by .filter to the previous transformer", async () => {
        const transformerComposer = new TransformerComposer();
        const scoped = transformerComposer.filter(() => false);
        let scopedCalls = 0;
        scoped.use((prev, data, signal) => {
            scopedCalls++;
            return prev(data, signal);
        });

        const { calls, previous } = trackPrevious();
        await transformerComposer.transformer()(previous, {
            method: "getMe",
            payload: {},
        });

        assertEquals(scopedCalls, 0);
        assertEquals(calls, ["getMe"]);
    });

    it("should pass dropped data to the previous transformer", async () => {
        const transformerComposer = new TransformerComposer();
        const scoped = transformerComposer.drop((data) =>
            data.method === "getMe"
        );
        let scopedCalls = 0;
        scoped.use((prev, data, signal) => {
            scopedCalls++;
            return prev(data, signal);
        });

        const { calls, previous } = trackPrevious();
        const transform = transformerComposer.transformer();
        await transform(previous, { method: "getMe", payload: {} });
        await transform(previous, {
            method: "sendMessage",
            payload: { chat_id: 1, text: "test" },
        });

        assertEquals(scopedCalls, 1);
        assertEquals(calls, ["getMe", "sendMessage"]);
    });

    it("should run the false transformer given to .branch", async () => {
        const transformerComposer = new TransformerComposer();
        let trueCalls = 0;
        let falseCalls = 0;
        transformerComposer.branch(
            (data) => data.method === "sendMessage",
            (prev, data, signal) => {
                trueCalls++;
                return prev(data, signal);
            },
            (prev, data, signal) => {
                falseCalls++;
                return prev(data, signal);
            },
        );

        const { calls, previous } = trackPrevious();
        const transform = transformerComposer.transformer();
        await transform(previous, { method: "getMe", payload: {} });
        await transform(previous, {
            method: "sendMessage",
            payload: { chat_id: 1, text: "test" },
        });

        assertEquals(trueCalls, 1);
        assertEquals(falseCalls, 1);
        assertEquals(calls, ["getMe", "sendMessage"]);
    });

    it("should return a composer for the false branch from .branch", async () => {
        const transformerComposer = new TransformerComposer();
        const otherwise = transformerComposer.branch(
            (data) => data.method === "sendMessage",
            (prev, data, signal) => prev(data, signal),
        );
        let otherwiseCalls = 0;
        otherwise.use((prev, data, signal) => {
            otherwiseCalls++;
            return prev(data, signal);
        });

        const { calls, previous } = trackPrevious();
        await transformerComposer.transformer()(previous, {
            method: "getMe",
            payload: {},
        });

        assertEquals(otherwiseCalls, 1);
        assertEquals(calls, ["getMe"]);
    });

    it("should accept a transformer object as the false branch", async () => {
        let objectCalls = 0;
        const counting: TransformerObj = {
            transformer: () => (prev, data, signal) => {
                objectCalls++;
                return prev(data, signal);
            },
        };
        const transformerComposer = new TransformerComposer();
        transformerComposer.branch(
            (data) => data.method === "sendMessage",
            (prev, data, signal) => prev(data, signal),
            counting,
        );

        const { calls, previous } = trackPrevious();
        await transformerComposer.transformer()(previous, {
            method: "getMe",
            payload: {},
        });

        assertEquals(objectCalls, 1);
        assertEquals(calls, ["getMe"]);
    });
});
