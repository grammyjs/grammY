import { Api } from "../src/api.ts";
import type { ApiCallFn } from "../src/client.ts";
import { TransformerComposer } from "../src/transform.ts";
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

        await transformerComposer.transformer()(
            previous,
            { method: "getMe", payload: {} },
        );

        assertEquals(previousCalls, 1);
    });
});
