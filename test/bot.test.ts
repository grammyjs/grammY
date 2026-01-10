import { Bot } from "../src/bot.ts";
import { BotError } from "../src/composer.ts";
import { Context } from "../src/context.ts";
import { GrammyError } from "../src/core/error.ts";
import type { Message, Update, UserFromGetMe } from "../src/types.ts";
import {
    afterEach,
    assertEquals,
    assertRejects,
    assertThrows,
    beforeEach,
    describe,
    FakeTime,
    it,
    spy,
    type Stub,
    stub,
} from "./deps.test.ts";

const token = "test-token";
const botInfo: UserFromGetMe = {
    id: 123456789,
    is_bot: true,
    first_name: "Test Bot",
    username: "test_bot",
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false,
    can_connect_to_business: false,
    has_main_web_app: false,
};

const testUpdate: Update = {
    update_id: 1,
    message: {
        message_id: 1,
        date: Date.now(),
        chat: { id: 1, type: "private", first_name: "Test" },
        from: { id: 1, is_bot: false, first_name: "Test" },
        text: "test",
    },
};

describe("Bot constructor", () => {
    it("should create a bot with a valid token", () => {
        const bot = new Bot("fake-token");
        assertEquals(bot.token, "fake-token");
        assertEquals(bot.isInited(), false);
    });

    it("should reject empty or undefined tokens", () => {
        assertThrows(() => new Bot(""), Error, "Empty token!");
        assertThrows(
            () => new Bot(undefined as unknown as string),
            Error,
            "Empty token!",
        );
    });
});

describe("Bot initialization", () => {
    it("should initialize bot with getMe call", async () => {
        const bot = new Bot(token);
        const getMeStub = stub(
            bot.api,
            "getMe",
            () => Promise.resolve(botInfo),
        );

        try {
            assertEquals(bot.isInited(), false);
            await bot.init();
            assertEquals(bot.isInited(), true);
            assertEquals(bot.botInfo.username, "test_bot");
            assertEquals(getMeStub.calls.length, 1);
        } finally {
            getMeStub.restore();
        }
    });

    it("should not call getMe if botInfo is provided", async () => {
        const bot = new Bot(token, { botInfo });
        const getMeStub = stub(
            bot.api,
            "getMe",
            () => Promise.resolve(botInfo),
        );

        try {
            assertEquals(bot.isInited(), true);
            await bot.init();
            assertEquals(getMeStub.calls.length, 0);
        } finally {
            getMeStub.restore();
        }
    });

    it("should throw error when accessing botInfo before init", () => {
        const bot = new Bot(token);
        assertThrows(
            () => bot.botInfo,
            Error,
            "Bot information unavailable",
        );
    });

    it("should handle concurrent inits with controlled resolution", async () => {
        const bot = new Bot(token);
        const resolvers: Array<(value: UserFromGetMe) => void> = [];

        const getMeStub = stub(bot.api, "getMe", () => {
            const { promise, resolve } = Promise.withResolvers<UserFromGetMe>();
            resolvers.push(resolve);
            return promise;
        });

        try {
            // Start three concurrent inits
            const init1 = bot.init();
            const init2 = bot.init();
            const init3 = bot.init();

            // Resolve the single getMe call
            resolvers[0](botInfo);

            await Promise.all([init1, init2, init3]);
            assertEquals(bot.isInited(), true);
            // Should only call getMe once (deduplication)
            assertEquals(getMeStub.calls.length, 1);
        } finally {
            getMeStub.restore();
        }
    });

    it("should handle init error with pending concurrent calls", async () => {
        const bot = new Bot(token);
        const { promise, reject } = Promise.withResolvers<UserFromGetMe>();
        const getMeStub = stub(bot.api, "getMe", () => promise);

        try {
            // Start multiple concurrent inits
            const init1 = bot.init();
            const init2 = bot.init();

            // Reject with plain Error (won't trigger retries, only HttpError/GrammyError do)
            // This keeps the test focused on concurrent init behavior without retry complexity
            reject(new Error("Network error"));

            // All should fail
            await assertRejects(() => init1);
            await assertRejects(() => init2);
            assertEquals(bot.isInited(), false);
            // Should only call getMe once (deduplication even on error)
            assertEquals(getMeStub.calls.length, 1);
        } finally {
            getMeStub.restore();
        }
    });
});

describe("Bot handleUpdate", () => {
    it("should process updates", async () => {
        const bot = new Bot(token, { botInfo });
        const middlewareSpy = spy(() => {});
        bot.use(middlewareSpy);

        await bot.handleUpdate(testUpdate);
        assertEquals(middlewareSpy.calls.length, 1);
    });

    it("should throw if bot not initialized", async () => {
        const bot = new Bot(token);
        await assertRejects(
            () => bot.handleUpdate(testUpdate),
            Error,
            "Bot not initialized",
        );
    });

    it("should wrap middleware errors in BotError", async () => {
        const bot = new Bot(token, { botInfo });
        bot.use(() => {
            throw new Error("Middleware error");
        });

        await assertRejects(
            () => bot.handleUpdate(testUpdate),
            BotError,
        );
    });

    it("should apply transformers to update API", async () => {
        const bot = new Bot(token, { botInfo });

        let capturedMethod = "";
        let capturedPayload: unknown = null;

        bot.api.config.use((_prev, method, payload, _signal) => {
            capturedMethod = method;
            capturedPayload = payload;
            const mockMessage: Message = {
                message_id: 1,
                date: Math.floor(Date.now() / 1000),
                chat: { id: 123, type: "private" },
            } as Message;
            return Promise.resolve({
                ok: true,
                result: mockMessage,
            }) as ReturnType<typeof _prev>;
        });

        bot.use(async (ctx) => {
            await ctx.api.sendMessage(123, "test");
        });

        await bot.handleUpdate(testUpdate);

        assertEquals(capturedMethod, "sendMessage");
        const payload = capturedPayload as Record<string, unknown>;
        assertEquals(payload.chat_id, 123);
        assertEquals(payload.text, "test");
    });

    it("should handle concurrent handleUpdate calls", async () => {
        const bot = new Bot(token, { botInfo });
        const { promise: middleware1, resolve: resolve1 } = Promise
            .withResolvers<void>();
        const { promise: middleware2, resolve: resolve2 } = Promise
            .withResolvers<void>();

        let callCount = 0;
        bot.use(async () => {
            callCount++;
            if (callCount === 1) await middleware1;
            if (callCount === 2) await middleware2;
        });

        // Start both updates
        const update1 = bot.handleUpdate({ ...testUpdate, update_id: 1 });
        const update2 = bot.handleUpdate({ ...testUpdate, update_id: 2 });

        // Resolve in reverse order
        resolve2();
        resolve1();

        await Promise.all([update1, update2]);
        assertEquals(callCount, 2);
    });

    it("should handle error in one update while other succeeds", async () => {
        const bot = new Bot(token, { botInfo });
        const { promise: controlledPromise, resolve: allowToContinue } = Promise
            .withResolvers<void>();

        const middlewareSpy = spy();

        bot.use(async (ctx) => {
            if (ctx.update.update_id === 1) {
                // This update will fail immediately
                throw new Error("Update 1 failed");
            } else {
                // This update waits for manual resolution
                await controlledPromise;
                middlewareSpy(ctx.update.update_id);
            }
        });

        // Start both updates concurrently
        const update1Promise = bot.handleUpdate({
            ...testUpdate,
            update_id: 1,
        });
        const update2Promise = bot.handleUpdate({
            ...testUpdate,
            update_id: 2,
        });

        // Allow update 2 to complete
        allowToContinue();

        // Verify update1 fails with BotError
        await assertRejects(() => update1Promise, BotError, "Update 1 failed");
        await update2Promise;

        // Verify update 2's middleware actually ran
        assertEquals(middlewareSpy.calls.length, 1);
        assertEquals(middlewareSpy.calls[0].args[0], 2);
    });
});

describe("Bot error handling", () => {
    it("should wrap middleware errors in BotError", async () => {
        const bot = new Bot(token, { botInfo });
        bot.use(() => {
            throw new Error("Test error");
        });

        await assertRejects(
            () => bot.handleUpdate(testUpdate),
            BotError,
            "Test error",
        );
    });

    describe("During polling", () => {
        let bot: Bot;

        beforeEach(() => {
            bot = new Bot(token);
            stub(bot.api, "getMe", () => Promise.resolve(botInfo));
            stub(bot.api, "deleteWebhook", () => Promise.resolve(true));
        });

        it("should handle 401 errors by stopping", async () => {
            stub(bot.api, "getUpdates", () =>
                Promise.reject(
                    new GrammyError(
                        "Unauthorized",
                        {
                            ok: false,
                            error_code: 401,
                            description: "Unauthorized",
                        },
                        "getUpdates",
                        {},
                    ),
                ));

            await assertRejects(() => bot.start(), GrammyError);
            assertEquals(bot.isRunning(), false);
        });

        it("should handle 409 conflict errors by stopping", async () => {
            stub(bot.api, "getUpdates", () =>
                Promise.reject(
                    new GrammyError(
                        "Conflict",
                        {
                            ok: false,
                            error_code: 409,
                            description: "Conflict",
                        },
                        "getUpdates",
                        {},
                    ),
                ));

            await assertRejects(() => bot.start(), GrammyError);
            assertEquals(bot.isRunning(), false);
        });

        it("should retry on 429 errors", async () => {
            using time = new FakeTime();

            let callCount = 0;
            const getUpdatesStub = stub(
                bot.api,
                "getUpdates",
                (_params, signal?: AbortSignal) => {
                    // Check for confirmation call first (no signal)
                    if (!signal) {
                        return Promise.resolve([]);
                    }
                    callCount++;
                    if (callCount === 1) {
                        // First call: return 429 error
                        return Promise.reject(
                            new GrammyError(
                                "Too Many Requests",
                                {
                                    ok: false,
                                    error_code: 429,
                                    description: "Too Many Requests",
                                    parameters: { retry_after: 0.05 },
                                },
                                "getUpdates",
                                {},
                            ),
                        );
                    }
                    // Second call: wait for abort
                    if (callCount === 2) {
                        return new Promise((_, reject) => {
                            signal.addEventListener(
                                "abort",
                                () => reject(new Error("Aborted")),
                            );
                        });
                    }
                    // Subsequent calls
                    return Promise.resolve([]);
                },
            );

            const startPromise = bot.start();
            // Wait for initial 429 error and retry (retry_after is 0.05s = 50ms)
            await time.tickAsync(50);
            await time.nextAsync(); // Allow retry promise to resolve
            await bot.stop();
            await startPromise;

            // Should be exactly 3: initial 429, retry, stop confirmation
            assertEquals(getUpdatesStub.calls.length, 3);
        });

        it("should call custom error handler for middleware errors", async () => {
            using time = new FakeTime();

            const errorHandlerSpy = spy(() => {});
            bot.catch(errorHandlerSpy);

            bot.use(() => {
                throw new Error("Middleware error");
            });

            const { promise: getUpdatesPromise, resolve: resolveGetUpdates } =
                Promise.withResolvers<Update[]>();

            let callCount = 0;
            const { promise: secondCall, resolve: resolveSecondCall } = Promise
                .withResolvers<Update[]>();

            stub(bot.api, "getUpdates", (_params, signal?: AbortSignal) => {
                callCount++;
                // If no signal, this is the confirmation call - resolve immediately
                if (!signal) {
                    return Promise.resolve([]);
                }
                if (callCount === 1) {
                    // First call: return the update with error
                    const promise = getUpdatesPromise;
                    signal.addEventListener(
                        "abort",
                        () => resolveGetUpdates([]),
                    );
                    return promise;
                }
                // Second call: wait for manual resolution or abort
                signal.addEventListener("abort", () => resolveSecondCall([]));
                return secondCall;
            });

            // Start polling
            const startPromise = bot.start();

            // Give one update that will cause middleware error
            resolveGetUpdates([testUpdate]);

            // Wait for error to be processed
            await time.tickAsync(50);

            // Stop polling
            await bot.stop();
            await startPromise;

            // Verify error handler was called
            assertEquals(errorHandlerSpy.calls.length, 1);
            const firstCall = errorHandlerSpy.calls[0] as unknown as {
                args: [BotError];
            };
            assertEquals(firstCall.args[0] instanceof BotError, true);
        });
    });
});

describe("Bot polling lifecycle", () => {
    let bot: Bot;
    let deleteWebhookStub: Stub;

    beforeEach(() => {
        bot = new Bot(token, { botInfo });
        deleteWebhookStub = stub(
            bot.api,
            "deleteWebhook",
            () => Promise.resolve(true as const),
        );
    });

    afterEach(() => {
        deleteWebhookStub.restore();
    });

    it("should report running state during start and stop", async () => {
        let firstCall = true;
        const getUpdatesStub = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                // If no signal, this is the confirmation call - resolve immediately
                if (!signal) {
                    return Promise.resolve([]);
                }
                if (firstCall) {
                    firstCall = false;
                    // First call: wait for abort
                    return new Promise((_, reject) => {
                        signal.addEventListener(
                            "abort",
                            () => reject(new Error("Aborted")),
                        );
                    });
                }
                // Subsequent calls with signal: resolve immediately
                return Promise.resolve([]);
            },
        );

        try {
            const startPromise = bot.start();
            assertEquals(bot.isRunning(), true);
            await bot.stop();
            await startPromise;
            assertEquals(bot.isRunning(), false);
        } finally {
            getUpdatesStub.restore();
        }
    });

    it("should call onStart callback", async () => {
        using time = new FakeTime();

        let callCount = 0;
        stub(bot.api, "getUpdates", (_params, signal?: AbortSignal) => {
            callCount++;
            // If no signal, this is the confirmation call - resolve immediately
            if (!signal) {
                return Promise.resolve([]);
            }
            if (callCount === 1) {
                // First call with signal: wait for abort
                return new Promise((_, reject) => {
                    signal.addEventListener(
                        "abort",
                        () => reject(new Error("Aborted")),
                    );
                });
            }
            // Subsequent calls with signal: resolve immediately
            return Promise.resolve([]);
        });

        const onStartSpy = spy((_botInfo: UserFromGetMe) => {});

        const startPromise = bot.start({ onStart: onStartSpy });
        await time.tickAsync(10);
        await bot.stop();
        await startPromise;

        assertEquals(onStartSpy.calls.length, 1);
        assertEquals(onStartSpy.calls[0].args[0], botInfo);
    });

    it("should handle stop when not running", async () => {
        assertEquals(bot.isRunning(), false);
        await bot.stop(); // Should not throw
        assertEquals(bot.isRunning(), false);
    });

    it("should not start twice concurrently", async () => {
        using time = new FakeTime();

        let getUpdatesCount = 0;
        const getUpdatesStub = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                getUpdatesCount++;
                // If no signal, this is the confirmation call - resolve immediately
                if (!signal) {
                    return Promise.resolve([]);
                }
                if (getUpdatesCount === 1) {
                    // First call with signal: wait for abort
                    return new Promise((_, reject) => {
                        signal.addEventListener(
                            "abort",
                            () => reject(new Error("Aborted")),
                        );
                    });
                }
                // Subsequent calls with signal: resolve immediately
                return Promise.resolve([]);
            },
        );

        try {
            const startPromise1 = bot.start();
            await time.tickAsync(10);

            // Verify first start called setup methods
            assertEquals(deleteWebhookStub.calls.length, 1);
            assertEquals(getUpdatesCount, 1);

            // Second start should be a no-op
            await bot.start();

            // Verify NO additional calls were made
            assertEquals(deleteWebhookStub.calls.length, 1);
            assertEquals(getUpdatesCount, 1);

            await bot.stop();
            await startPromise1;
        } finally {
            getUpdatesStub.restore();
        }
    });

    it("should delete webhook on start", async () => {
        using time = new FakeTime();

        stub(bot.api, "getUpdates", (_params, signal?: AbortSignal) => {
            // If no signal, this is the confirmation call - resolve immediately
            if (!signal) {
                return Promise.resolve([]);
            }
            // With signal: wait for abort
            return new Promise((_, reject) => {
                signal.addEventListener(
                    "abort",
                    () => reject(new Error("Aborted")),
                );
            });
        });

        const startPromise = bot.start();

        await time.tickAsync(10);
        await bot.stop();
        await startPromise;

        assertEquals(deleteWebhookStub.calls.length, 1);
    });

    it("should process updates from polling", async () => {
        using time = new FakeTime();

        const updates = [
            { ...testUpdate, update_id: 1 },
            { ...testUpdate, update_id: 2 },
        ];

        // Override bot for this test needing initialization
        bot = new Bot(token);
        stub(bot.api, "getMe", () => Promise.resolve(botInfo));
        stub(bot.api, "deleteWebhook", () => Promise.resolve(true));

        let getUpdatesCallCount = 0;
        stub(bot.api, "getUpdates", (_params, signal?: AbortSignal) => {
            getUpdatesCallCount++;
            // If no signal, this is the confirmation call - resolve immediately
            if (!signal) {
                return Promise.resolve([]);
            }
            if (getUpdatesCallCount === 1) {
                return Promise.resolve(updates);
            }
            // Second call with signal - wait for abort
            if (getUpdatesCallCount === 2) {
                return new Promise((_, reject) => {
                    signal.addEventListener(
                        "abort",
                        () => reject(new Error("Aborted")),
                    );
                });
            }
            // Subsequent calls with signal
            return Promise.resolve([]);
        });

        const middlewareSpy = spy((_ctx: Context) => {});
        bot.use(middlewareSpy);

        const startPromise = bot.start();
        await time.tickAsync(50);
        await bot.stop();
        await startPromise;

        // Should have processed both updates in order
        assertEquals(middlewareSpy.calls.length, 2);
        assertEquals(middlewareSpy.calls[0].args[0].update.update_id, 1);
        assertEquals(middlewareSpy.calls[1].args[0].update.update_id, 2);
    });

    it("should prevent middleware registration after start", async () => {
        using time = new FakeTime();

        let callCount = 0;
        stub(bot.api, "getUpdates", (_params, signal?: AbortSignal) => {
            callCount++;
            if (callCount === 1) {
                return new Promise((_, reject) => {
                    signal?.addEventListener(
                        "abort",
                        () => reject(new Error("Aborted")),
                    );
                });
            }
            return Promise.resolve([]);
        });

        const startPromise = bot.start();

        await time.tickAsync(10);

        // After start, bot.use is replaced with noUseFunction to prevent memory leaks
        assertEquals(bot.use.name, "noUseFunction");
        // Verify it actually throws when called
        assertThrows(() => bot.use(() => {}), Error);

        await bot.stop();
        await startPromise;
    });
});
