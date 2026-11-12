import {
    Api,
    API_CONSTANTS,
    Context,
    InlineQueryResultBuilder,
    matchFilter,
} from "../src/mod.ts";
import type {
    EphemeralMessageParameters,
    Message,
    Update,
    User,
    UserFromGetMe,
    WidgetQuery,
    WidgetQueryType,
} from "../src/types.ts";
import {
    assert,
    assertEquals,
    assertRejects,
    assertThrows,
    describe,
    it,
} from "./deps.test.ts";

const user: User = { id: 42, is_bot: false, first_name: "Test" };
const chat = { id: 42, type: "private", first_name: "Test" } as const;
const me: UserFromGetMe = {
    id: 1,
    is_bot: true,
    first_name: "Bot",
    username: "bot",
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: true,
    can_connect_to_business: false,
    has_main_web_app: false,
    has_topics_enabled: false,
    allows_users_to_create_topics: false,
    can_manage_bots: false,
    supports_join_request_queries: false,
};
const query: WidgetQuery = {
    id: "query",
    from: user,
    chat,
    message_id: 7,
    chat_instance: "chat",
    type: { type: "data" },
    data: "query-data",
    widget_id: "widget",
};

function fixture(update: Partial<Update> = {}) {
    const calls: Array<{
        method: string;
        payload: object;
        signal?: AbortSignal;
    }> = [];
    const api = new Api("test-token", {
        fetch: () => Promise.resolve(Response.json({ ok: true, result: true })),
    });
    api.config.use((prev, method, payload, signal) => {
        calls.push({ method, payload, signal });
        return prev(method, payload, signal);
    });
    return {
        api,
        calls,
        ctx: new Context({ update_id: 1, ...update }, api, me),
    };
}

describe("Bot API 10.4 methods", () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const cases: Array<{
        method: string;
        invoke: (api: Api) => Promise<unknown>;
        payload: object;
    }> = [
        {
            method: "sendWidget",
            invoke: (api) =>
                api.sendWidget(42, "<p>Widget</p>", {
                    public_data: "",
                    chat_data: "data",
                    allow_queries: true,
                    is_shared: true,
                }, signal),
            payload: {
                chat_id: 42,
                html: "<p>Widget</p>",
                public_data: "",
                chat_data: "data",
                allow_queries: true,
                is_shared: true,
            },
        },
        {
            method: "sendSharedWidget",
            invoke: (api) =>
                api.sendSharedWidget(42, "widget", {
                    chat_data: "",
                }, signal),
            payload: { chat_id: 42, widget_id: "widget", chat_data: "" },
        },
        {
            method: "answerWidgetQuery",
            invoke: (api) =>
                api.answerWidgetQuery("query", { data: "" }, signal),
            payload: { widget_query_id: "query", data: "" },
        },
        {
            method: "editMessageWidgetData",
            invoke: (api) =>
                api.editMessageWidgetData(42, 7, {
                    public_data: "",
                    chat_data: "",
                }, signal),
            payload: {
                chat_id: 42,
                message_id: 7,
                public_data: "",
                chat_data: "",
            },
        },
        {
            method: "editMessageWidgetData",
            invoke: (api) =>
                api.editMessageWidgetDataInline("inline", {
                    chat_data: "",
                }, signal),
            payload: { inline_message_id: "inline", chat_data: "" },
        },
        {
            method: "editSharedWidgetData",
            invoke: (api) =>
                api.editSharedWidgetData("widget", "", {
                    cache_time: 5,
                }, signal),
            payload: { widget_id: "widget", public_data: "", cache_time: 5 },
        },
        {
            method: "getChatShareThemeBackdrops",
            invoke: (api) => api.getChatShareThemeBackdrops(signal),
            payload: {},
        },
        {
            method: "getUniqueGift",
            invoke: (api) => api.getUniqueGift("Gift-1", signal),
            payload: { name: "Gift-1" },
        },
        {
            method: "deleteBusinessAccountGift",
            invoke: (api) =>
                api.deleteBusinessAccountGift("business", "gift", signal),
            payload: {
                business_connection_id: "business",
                owned_gift_id: "gift",
            },
        },
    ];

    for (const test of cases) {
        it(`should pass ${test.method} through transformers`, async () => {
            const { api, calls } = fixture();
            await test.invoke(api);
            assertEquals(calls, [{
                method: test.method,
                payload: test.payload,
                signal,
            }]);
        });
    }

    it("should handle raw calls without parameters", async () => {
        const { api, calls } = fixture();
        await api.raw.getChatShareThemeBackdrops();
        await api.raw.getChatShareThemeBackdrops(signal);
        assertEquals(calls, [
            {
                method: "getChatShareThemeBackdrops",
                payload: {},
                signal: undefined,
            },
            { method: "getChatShareThemeBackdrops", payload: {}, signal },
        ]);
    });

    it("should honor cancellation before sending a request", async () => {
        let aborted = false;
        const api = new Api("test-token", {
            fetch: (_input, options) => {
                aborted = options?.signal?.aborted === true;
                return Promise.reject(
                    new DOMException("Aborted", "AbortError"),
                );
            },
        });
        const controller = new AbortController();
        controller.abort();
        await assertRejects(() =>
            api.raw.getChatShareThemeBackdrops(controller.signal)
        );
        assert(aborted);
    });
});

describe("widget contexts", () => {
    const queryTypes: WidgetQueryType[] = [
        { type: "data" },
        {
            type: "sign_data",
            wallet: { address: "address", amount: "1" },
            sign_data: "signed",
        },
        {
            type: "sent_transaction",
            wallet: { address: "address", amount: "1" },
            msg_hash: "hash",
        },
    ];
    for (const type of queryTypes) {
        it(`should filter ${type.type} for both query kinds`, () => {
            for (
                const update of [
                    { widget_query: { ...query, type } },
                    {
                        shared_widget_query: {
                            id: query.id,
                            from: query.from,
                            type,
                            data: query.data,
                            widget_id: "widget",
                        },
                    },
                ]
            ) {
                const { ctx } = fixture(update);
                assert(
                    matchFilter([
                        `widget_query:type:${type.type}`,
                        `shared_widget_query:type:${type.type}`,
                    ])(ctx),
                );
                for (
                    const other of queryTypes.filter((candidate) =>
                        candidate.type !== type.type
                    )
                ) {
                    assert(
                        !matchFilter([
                            `widget_query:type:${other.type}`,
                            `shared_widget_query:type:${other.type}`,
                        ])(ctx),
                    );
                }
            }
        });
    }

    it("should aggregate query information without inventing a message", () => {
        const { ctx } = fixture({ widget_query: query });
        assertEquals(ctx.widgetQuery, query);
        assertEquals(ctx.from, user);
        assertEquals(ctx.chat, chat);
        assertEquals(ctx.chatId, 42);
        assertEquals(ctx.msgId, 7);
        assertEquals(ctx.msg, undefined);
        assertEquals(ctx.inlineMessageId, undefined);
        assert(ctx.has("widget_query"));
        assert(ctx.has("widget_query:from"));
    });

    it("should handle inline queries without a chat", async () => {
        const { chat: _chat, message_id: _messageId, ...inline } = query;
        const { ctx, calls } = fixture({
            widget_query: { ...inline, inline_message_id: "inline" },
        });
        assertEquals(ctx.chat, undefined);
        assertEquals(ctx.chatId, undefined);
        assertEquals(ctx.msgId, undefined);
        assertEquals(ctx.inlineMessageId, "inline");
        await ctx.editMessageWidgetData({ chat_data: "" });
        assertEquals(calls[0]?.payload, {
            inline_message_id: "inline",
            chat_data: "",
        });
    });

    it("should resolve message identifiers for existing message actions", async () => {
        const { ctx, calls } = fixture({ widget_query: query });
        await ctx.editMessageWidgetData({ public_data: "" });
        await ctx.editMessageCaption({ caption: "caption" });
        await ctx.editMessageReplyMarkup({
            reply_markup: { inline_keyboard: [] },
        });
        await ctx.deleteMessage();
        for (const call of calls) {
            assertEquals((call.payload as { chat_id: number }).chat_id, 42);
            assertEquals(
                (call.payload as { message_id: number }).message_id,
                7,
            );
        }
    });

    it("should answer both query kinds and edit shared data", async () => {
        const shared = {
            id: query.id,
            from: query.from,
            type: query.type,
            data: query.data,
            widget_id: "widget",
        };
        for (
            const update of [{ widget_query: query }, {
                shared_widget_query: shared,
            }]
        ) {
            const { ctx, calls } = fixture(update);
            await ctx.answerWidgetQuery("");
            await ctx.editSharedWidgetData("", { cache_time: 5 });
            assertEquals(calls[0]?.payload, {
                widget_query_id: "query",
                data: "",
            });
            assertEquals(calls[1]?.payload, {
                widget_id: "widget",
                public_data: "",
                cache_time: 5,
            });
            assertEquals(ctx.from, user);
        }
        const { ctx } = fixture({ shared_widget_query: shared });
        assertEquals(ctx.chat, undefined);
        assertEquals(ctx.msg, undefined);
        assertEquals(ctx.msgId, undefined);
        assertEquals(ctx.inlineMessageId, undefined);
    });

    it("should resolve a shared widget from a message", async () => {
        const { ctx, calls } = fixture({
            message: {
                message_id: 7,
                date: 1,
                chat,
                from: user,
                widget: { id: "widget", html: "<p>Widget</p>" },
            },
        });
        await ctx.editSharedWidgetData("");
        assertEquals(calls[0]?.payload, {
            widget_id: "widget",
            public_data: "",
        });
    });

    it("should preserve the message topic when replying with widgets", async () => {
        const { ctx, calls } = fixture({
            message: {
                message_id: 7,
                date: 1,
                chat,
                from: user,
                is_topic_message: true,
                message_thread_id: 8,
            },
        });
        await ctx.replyWithWidget("<p>Widget</p>");
        await ctx.replyWithSharedWidget("widget");
        assertEquals(calls[0]?.payload, {
            chat_id: 42,
            html: "<p>Widget</p>",
            message_thread_id: 8,
        });
        assertEquals(calls[1]?.payload, {
            chat_id: 42,
            widget_id: "widget",
            message_thread_id: 8,
        });
    });

    it("should reject calls without required context", () => {
        const { ctx } = fixture();
        assertThrows(
            () => ctx.answerWidgetQuery(),
            Error,
            "Missing information",
        );
        assertThrows(
            () => ctx.editMessageWidgetData(),
            Error,
            "Missing information",
        );
        assertThrows(
            () => ctx.editSharedWidgetData(""),
            Error,
            "Missing information",
        );
        assertThrows(
            () => ctx.deleteBusinessAccountGift("gift"),
            Error,
            "Missing information",
        );
    });

    it("should use the business connection for gift deletion", async () => {
        const { ctx, calls } = fixture({
            business_connection: {
                id: "business",
                user,
                user_chat_id: 42,
                date: 1,
                is_enabled: true,
            },
        });
        await ctx.deleteBusinessAccountGift("gift");
        assertEquals(calls[0]?.payload, {
            business_connection_id: "business",
            owned_gift_id: "gift",
        });
    });

    it("should include both query kinds in the default update types", () => {
        assert(API_CONSTANTS.DEFAULT_UPDATE_TYPES.includes("widget_query"));
        assert(API_CONSTANTS.ALL_UPDATE_TYPES.includes("shared_widget_query"));
    });

    it("should build inline widget content", () => {
        const widget = InlineQueryResultBuilder.article("id", "Widget").widget(
            "<p>Widget</p>",
            { public_data: "" },
        );
        assertEquals(widget.input_message_content, {
            html: "<p>Widget</p>",
            public_data: "",
        });
        const shared = InlineQueryResultBuilder.article("id", "Widget")
            .sharedWidget("widget", { chat_data: "" });
        assertEquals(shared.input_message_content, {
            widget_id: "widget",
            chat_data: "",
        });
    });

    it("should match new message fields and entity types", () => {
        const message: Message = {
            message_id: 7,
            date: 1,
            chat,
            widget: { html: "<p>Widget</p>" },
            paid_messages_waived: {},
            ton_wallet_transfer: {
                transaction_id: "tx",
                peer_address: "address",
                amount: "-1",
            },
            text: "address 1234",
            entities: [
                { type: "ton_address", offset: 0, length: 7 },
                { type: "bank_card_number", offset: 8, length: 4 },
            ],
        };
        const { ctx } = fixture({ message: { ...message, chat, from: user } });
        assert(matchFilter("message:widget")(ctx));
        assert(matchFilter("message:paid_messages_waived")(ctx));
        assert(matchFilter("message:ton_wallet_transfer")(ctx));
        assert(matchFilter("message:entities:ton_address")(ctx));
        assert(matchFilter("message:entities:bank_card_number")(ctx));
    });
});

type SendOptions = {
    ephemeral_message_parameters?: EphemeralMessageParameters;
};
type SendingCase = {
    method: string;
    send: (
        api: Api,
        chatId: number | undefined,
        other: SendOptions,
        signal: AbortSignal,
    ) => Promise<unknown>;
    reply: (
        ctx: Context,
        other: SendOptions,
        signal: AbortSignal,
    ) => Promise<unknown>;
};

const sends: SendingCase[] = [
    {
        method: "sendMessage",
        send: (api, chatId, other, signal) =>
            api.sendMessage(chatId, "text", other, signal),
        reply: (ctx, other, signal) => ctx.reply("text", other, signal),
    },
    {
        method: "sendRichMessage",
        send: (api, chatId, other, signal) =>
            api.sendRichMessage(chatId, { html: "<p>text</p>" }, other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithRichMessage({ html: "<p>text</p>" }, other, signal),
    },
    {
        method: "sendAnimation",
        send: (api, chatId, other, signal) =>
            api.sendAnimation(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithAnimation("file", other, signal),
    },
    {
        method: "sendAudio",
        send: (api, chatId, other, signal) =>
            api.sendAudio(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithAudio("file", other, signal),
    },
    {
        method: "sendContact",
        send: (api, chatId, other, signal) =>
            api.sendContact(chatId, "123", "Test", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithContact("123", "Test", other, signal),
    },
    {
        method: "sendDocument",
        send: (api, chatId, other, signal) =>
            api.sendDocument(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithDocument("file", other, signal),
    },
    {
        method: "sendLivePhoto",
        send: (api, chatId, other, signal) =>
            api.sendLivePhoto(chatId, "video", "photo", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithLivePhoto("video", "photo", other, signal),
    },
    {
        method: "sendLocation",
        send: (api, chatId, other, signal) =>
            api.sendLocation(chatId, 1, 2, other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithLocation(1, 2, other, signal),
    },
    {
        method: "sendPhoto",
        send: (api, chatId, other, signal) =>
            api.sendPhoto(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithPhoto("file", other, signal),
    },
    {
        method: "sendSticker",
        send: (api, chatId, other, signal) =>
            api.sendSticker(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithSticker("file", other, signal),
    },
    {
        method: "sendVenue",
        send: (api, chatId, other, signal) =>
            api.sendVenue(chatId, 1, 2, "Venue", "Address", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithVenue(1, 2, "Venue", "Address", other, signal),
    },
    {
        method: "sendVideo",
        send: (api, chatId, other, signal) =>
            api.sendVideo(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithVideo("file", other, signal),
    },
    {
        method: "sendVideoNote",
        send: (api, chatId, other, signal) =>
            api.sendVideoNote(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithVideoNote("file", other, signal),
    },
    {
        method: "sendVoice",
        send: (api, chatId, other, signal) =>
            api.sendVoice(chatId, "file", other, signal),
        reply: (ctx, other, signal) =>
            ctx.replyWithVoice("file", other, signal),
    },
];

describe("ephemeral callback replies", () => {
    const other: SendOptions = {
        ephemeral_message_parameters: { callback_query_id: "callback" },
    };
    const signal = new AbortController().signal;
    const callback = {
        id: "callback",
        from: user,
        chat_instance: "chat",
        inline_message_id: "inline",
        data: "data",
    };
    for (const test of sends) {
        it(`should allow ${test.method} without chat_id`, async () => {
            const { api, calls } = fixture();
            await test.send(api, undefined, other, signal);
            assertEquals(calls[0]?.method, test.method);
            assertEquals(calls[0]?.signal, signal);
            assertEquals(
                (calls[0]?.payload as { chat_id?: number }).chat_id,
                undefined,
            );
            assertEquals(
                (calls[0]?.payload as SendOptions).ephemeral_message_parameters,
                other.ephemeral_message_parameters,
            );
        });
        it(`should preserve chat_id for ordinary ${test.method}`, async () => {
            const { api, calls } = fixture();
            await test.send(api, 42, {}, signal);
            assertEquals(
                (calls[0]?.payload as { chat_id: number }).chat_id,
                42,
            );
            assertEquals(calls[0]?.signal, signal);
        });
        it(`should allow contextual ${test.method} on an inline callback`, async () => {
            const { ctx, calls } = fixture({ callback_query: callback });
            await test.reply(ctx, other, signal);
            assertEquals(calls[0]?.method, test.method);
            assertEquals(calls[0]?.signal, signal);
            assertEquals(
                (calls[0]?.payload as { chat_id?: number }).chat_id,
                undefined,
            );
            assertEquals(
                (calls[0]?.payload as SendOptions).ephemeral_message_parameters,
                other.ephemeral_message_parameters,
            );
        });
        it(`should keep contextual ${test.method} chat and topic`, async () => {
            const { ctx, calls } = fixture({
                message: {
                    message_id: 7,
                    date: 1,
                    chat,
                    from: user,
                    is_topic_message: true,
                    message_thread_id: 8,
                },
            });
            await test.reply(ctx, {}, signal);
            assertEquals(
                (calls[0]?.payload as { chat_id: number }).chat_id,
                42,
            );
            assertEquals(
                (calls[0]?.payload as { message_thread_id: number })
                    .message_thread_id,
                8,
            );
        });
        it(`should reject contextual ${test.method} without a target`, () => {
            const { ctx } = fixture({ callback_query: callback });
            assertThrows(
                () => test.reply(ctx, {}, signal),
                Error,
                "Missing information",
            );
            assertThrows(
                () =>
                    test.reply(ctx, {
                        ephemeral_message_parameters: { receiver_user_id: 42 },
                    }, signal),
                Error,
                "Missing information",
            );
            assertThrows(
                () =>
                    test.reply(ctx, {
                        ephemeral_message_parameters: {
                            callback_query_id: "callback",
                            receiver_user_id: 42,
                        },
                    }, signal),
                Error,
                "Missing information",
            );
        });
    }
});
