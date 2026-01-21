import { Bot } from "../src/bot.ts";
import { BotError } from "../src/composer.ts";
import { Context } from "../src/context.ts";
import { GrammyError, HttpError } from "../src/error.ts";
import type { Update, UserFromGetMe } from "../src/types.ts";
import {
    afterEach,
    assertEquals,
    assertFalse,
    assertInstanceOf,
    assertRejects,
    assertSpyCalls,
    assertStringIncludes,
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
const me: UserFromGetMe = {
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
        date: Date.now() / 1000,
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
        using getMeStub = stub(
            bot.api,
            "getMe",
            () => Promise.resolve(me),
        );

        assertEquals(bot.isInited(), false);
        await bot.init();
        assertEquals(bot.isInited(), true);
        assertEquals(bot.me.username, "test_bot");
        assertEquals(getMeStub.calls.length, 1);
    });

    it("should not call getMe if .me is provided", async () => {
        const bot = new Bot(token, { me });
        using getMeStub = stub(
            bot.api,
            "getMe",
            () => Promise.resolve(me),
        );

        assertEquals(bot.isInited(), true);
        await bot.init();
        assertEquals(getMeStub.calls.length, 0);
    });

    it("should throw error when accessing .me before init", () => {
        const bot = new Bot(token);
        assertThrows(
            () => bot.me,
            Error,
            "Bot information unavailable",
        );
    });

    it("should handle concurrent inits with controlled resolution", async () => {
        const bot = new Bot(token);
        const resolvers: Array<(value: UserFromGetMe) => void> = [];

        using getMeStub = stub(bot.api, "getMe", () => {
            const { promise, resolve } = Promise.withResolvers<UserFromGetMe>();
            resolvers.push(resolve);
            return promise;
        });

        // Start three concurrent inits
        const init1 = bot.init();
        const init2 = bot.init();
        const init3 = bot.init();

        // Verify deduplication: only one getMe call made
        assertEquals(resolvers.length, 1);

        // Resolve the single getMe call
        resolvers[0](me);

        await Promise.all([init1, init2, init3]);
        assertEquals(bot.isInited(), true);
        // Verify stub was only called once
        assertEquals(getMeStub.calls.length, 1);
    });

    it("should handle init error with pending concurrent calls", async () => {
        const bot = new Bot(token);
        const { promise, reject } = Promise.withResolvers<UserFromGetMe>();
        using getMeStub = stub(bot.api, "getMe", () => promise);

        const init1 = bot.init();
        const init2 = bot.init();

        // Reject with plain Error (won't trigger retries, only HttpError/GrammyError do)
        reject(new Error("Network error"));

        await assertRejects(() => init1);
        await assertRejects(() => init2);
        assertEquals(bot.isInited(), false);
        // Should only call getMe once (deduplication even on error)
        assertEquals(getMeStub.calls.length, 1);
    });

    it("should retry on HttpError during initialization", async () => {
        const bot = new Bot(token);
        let callCount = 0;
        using _ = stub(bot.api, "getMe", () => {
            callCount++;
            if (callCount === 1) {
                throw new HttpError("Network error", { error: "ECONNREFUSED" });
            }
            return Promise.resolve(me);
        });

        await bot.init();
        assertEquals(bot.isInited(), true);
        // Initial attempt + 1 retry
        assertEquals(callCount, 2);
    });

    it("should retry on 5xx errors during initialization", async () => {
        const bot = new Bot(token);
        let callCount = 0;
        using _ = stub(bot.api, "getMe", () => {
            callCount++;
            if (callCount === 1) {
                throw new GrammyError(
                    "Bad Gateway",
                    {
                        ok: false,
                        error_code: 502,
                        description: "Bad Gateway",
                    },
                    "getMe",
                    {},
                );
            }
            return Promise.resolve(me);
        });

        await bot.init();
        assertEquals(bot.isInited(), true);
        // Initial attempt + 1 retry
        assertEquals(callCount, 2);
    });

    it("should handle 429 without retry_after parameter", async () => {
        const bot = new Bot(token);
        let callCount = 0;
        using _ = stub(bot.api, "getMe", () => {
            callCount++;
            if (callCount === 1) {
                throw new GrammyError(
                    "Too Many Requests",
                    {
                        ok: false,
                        error_code: 429,
                        description: "Too Many Requests",
                        parameters: {},
                    },
                    "getMe",
                    {},
                );
            }
            return Promise.resolve(me);
        });

        const initPromise = bot.init();
        await initPromise;
        assertEquals(bot.isInited(), true);
        // Initial attempt + 1 retry
        assertEquals(callCount, 2);
    });
});

describe("Bot handleUpdate", () => {
    it("should process updates", async () => {
        const bot = new Bot(token, { me });
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

    it("should handle concurrent handleUpdate calls", async () => {
        const bot = new Bot(token, { me });
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

        const update1 = bot.handleUpdate({ ...testUpdate, update_id: 1 });
        const update2 = bot.handleUpdate({ ...testUpdate, update_id: 2 });

        resolve2();
        resolve1();

        await Promise.all([update1, update2]);
        assertEquals(callCount, 2);
    });

    it("should handle error in one update while other succeeds", async () => {
        const bot = new Bot(token, { me });
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
        const bot = new Bot(token, { me });
        const originalError = new Error("Test error");
        bot.use(() => {
            throw originalError;
        });

        const error = await assertRejects(
            () => bot.handleUpdate(testUpdate),
            BotError,
            "Test error",
        );

        assertEquals(error.error, originalError);
    });

    describe("during polling", () => {
        let bot: Bot;
        let getMeStub: Stub;
        let deleteWebhookStub: Stub;

        beforeEach(() => {
            bot = new Bot(token);
            getMeStub = stub(bot.api, "getMe", () => Promise.resolve(me));
            deleteWebhookStub = stub(
                bot.api,
                "deleteWebhook",
                () => Promise.resolve(true as const),
            );
        });

        afterEach(() => {
            getMeStub.restore();
            deleteWebhookStub.restore();
        });

        it("should handle 401 errors by stopping", async () => {
            using consoleError = stub(console, "error");
            using _ = stub(bot.api, "getUpdates", () =>
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
            const stopped = Promise.withResolvers<void>();
            await bot.start({ onStop: () => stopped.resolve() });
            await stopped.promise;
            assertFalse(bot.isRunning());
            assertSpyCalls(consoleError, 1);
            assertStringIncludes(
                consoleError.calls[0].args[0],
                "long polling crashed",
            );
            assertInstanceOf(consoleError.calls[0].args[1], GrammyError);
        });

        it("should handle 409 conflict errors by stopping", async () => {
            using consoleError = stub(console, "error");
            using _ = stub(bot.api, "getUpdates", () =>
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

            const stopped = Promise.withResolvers<void>();
            await bot.start({ onStop: () => stopped.resolve() });
            await stopped.promise;
            assertFalse(bot.isRunning());
            assertSpyCalls(consoleError, 1);
            assertStringIncludes(
                consoleError.calls[0].args[0],
                "long polling crashed",
            );
            assertInstanceOf(consoleError.calls[0].args[1], GrammyError);
        });

        it("should retry on 429 errors", async () => {
            using time = new FakeTime();

            let callCount = 0;
            const { promise: retryPromise, resolve: resolveRetry } = Promise
                .withResolvers<Update[]>();

            using getUpdatesStub = stub(
                bot.api,
                "getUpdates",
                (_params, signal?: AbortSignal) => {
                    callCount++;
                    switch (callCount) {
                        case 1:
                            // First call: return 429 error
                            return Promise.reject(
                                new GrammyError(
                                    "Too Many Requests",
                                    {
                                        ok: false,
                                        error_code: 429,
                                        description: "Too Many Requests",
                                        parameters: { retry_after: 30 },
                                    },
                                    "getUpdates",
                                    {},
                                ),
                            );
                        case 2:
                            // Second call (retry): return controlled promise
                            signal!.addEventListener(
                                "abort",
                                () => resolveRetry([]),
                            );
                            return retryPromise;
                        default:
                            // Confirmation call
                            return Promise.resolve([]);
                    }
                },
            );

            const startPromise = bot.start();
            // Advance time past retry_after (30s)
            await time.tickAsync(30000);
            // Process retry callback (second getUpdates call)
            await time.nextAsync();
            // Stop triggers abort, resolving retryPromise
            await bot.stop();
            await startPromise;

            // initial 429, retry, stop confirmation
            assertEquals(getUpdatesStub.calls.length, 3);
        });

        it("should call custom error handler for middleware errors", async () => {
            const { promise: errorHandled, resolve: notifyErrorHandled } =
                Promise.withResolvers<void>();
            const { promise: secondCallStarted, resolve: notifySecondCall } =
                Promise.withResolvers<void>();

            const errorHandlerSpy = spy((_err: BotError) => {
                notifyErrorHandled();
            });
            bot.catch(errorHandlerSpy);

            bot.use(() => {
                throw new Error("Middleware error");
            });

            const { promise: getUpdatesPromise, resolve: resolveGetUpdates } =
                Promise.withResolvers<Update[]>();

            let callCount = 0;
            const { promise: secondCall, resolve: resolveSecondCall } = Promise
                .withResolvers<Update[]>();

            using _ = stub(
                bot.api,
                "getUpdates",
                (_params, signal?: AbortSignal) => {
                    callCount++;
                    switch (callCount) {
                        case 1:
                            // First call: return update that triggers middleware error
                            signal!.addEventListener(
                                "abort",
                                () => resolveGetUpdates([]),
                            );
                            return getUpdatesPromise;
                        case 2:
                            // Second call: next polling iteration
                            notifySecondCall();
                            signal!.addEventListener(
                                "abort",
                                () => resolveSecondCall([]),
                            );
                            return secondCall;
                        default:
                            // Confirmation call
                            return Promise.resolve([]);
                    }
                },
            );

            // Start polling
            const startPromise = bot.start();

            // Give one update that will cause middleware error
            resolveGetUpdates([testUpdate]);

            // Wait for error handler to be called and second polling loop to start
            await errorHandled;
            await secondCallStarted;

            // Stop polling
            await bot.stop();
            await startPromise;

            // Verify error handler was called
            assertEquals(errorHandlerSpy.calls.length, 1);
            assertEquals(
                errorHandlerSpy.calls[0].args[0] instanceof BotError,
                true,
            );
        });
    });
});

describe("Bot polling lifecycle", () => {
    let bot: Bot;
    let deleteWebhookStub: Stub;

    beforeEach(() => {
        bot = new Bot(token, { me });
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
        let callCount = 0;
        const { promise: firstCallStarted, resolve: notifyFirstCall } = Promise
            .withResolvers<void>();

        using _ = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                callCount++;
                switch (callCount) {
                    case 1:
                        notifyFirstCall();
                        return new Promise((_, reject) => {
                            signal!.addEventListener(
                                "abort",
                                () => reject(new Error("Aborted")),
                            );
                        });
                    default:
                        // Subsequent calls (including confirmation)
                        return Promise.resolve([]);
                }
            },
        );

        const startPromise = bot.start();
        // Wait for polling to actually start
        await firstCallStarted;
        assertEquals(bot.isRunning(), true);
        await bot.stop();
        await startPromise;
        assertEquals(bot.isRunning(), false);
    });

    it("should call onStart callback", async () => {
        let callCount = 0;
        const { promise: firstCallStarted, resolve: notifyFirstCall } = Promise
            .withResolvers<void>();

        using _ = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                callCount++;
                switch (callCount) {
                    case 1:
                        notifyFirstCall();
                        return new Promise((_, reject) => {
                            signal!.addEventListener(
                                "abort",
                                () => reject(new Error("Aborted")),
                            );
                        });
                    default:
                        // Subsequent calls
                        return Promise.resolve([]);
                }
            },
        );

        const onStartSpy = spy((_me: UserFromGetMe) => {});

        const startPromise = bot.start({ onStart: onStartSpy });
        // Wait for polling to actually start
        await firstCallStarted;
        await bot.stop();
        await startPromise;

        assertEquals(onStartSpy.calls.length, 1);
        assertEquals(onStartSpy.calls[0].args[0], me);
    });

    it("should handle stop when not running", async () => {
        assertEquals(bot.isRunning(), false);
        await bot.stop(); // Should not throw
        assertEquals(bot.isRunning(), false);
    });

    it("should not start twice concurrently", async () => {
        let getUpdatesCount = 0;
        const { promise: firstCallStarted, resolve: notifyFirstCall } = Promise
            .withResolvers<void>();

        using _ = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                getUpdatesCount++;
                switch (getUpdatesCount) {
                    case 1:
                        notifyFirstCall();
                        return new Promise((_, reject) => {
                            signal!.addEventListener(
                                "abort",
                                () => reject(new Error("Aborted")),
                            );
                        });
                    default:
                        // Subsequent calls
                        return Promise.resolve([]);
                }
            },
        );

        const startPromise1 = bot.start();
        // Wait for polling to actually start
        await firstCallStarted;

        // Verify first start called setup methods
        assertEquals(deleteWebhookStub.calls.length, 1);
        assertEquals(getUpdatesCount, 1);

        // Second start should be a no-op
        await bot.start();

        // Verify no additional calls were made
        assertEquals(deleteWebhookStub.calls.length, 1);
        assertEquals(getUpdatesCount, 1);

        await bot.stop();
        await startPromise1;
    });

    it("should delete webhook on start", async () => {
        let callCount = 0;
        const { promise: firstCallStarted, resolve: notifyFirstCall } = Promise
            .withResolvers<void>();

        using _ = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                callCount++;
                switch (callCount) {
                    case 1:
                        notifyFirstCall();
                        return new Promise((_, reject) => {
                            signal!.addEventListener(
                                "abort",
                                () => reject(new Error("Aborted")),
                            );
                        });
                    default:
                        // Confirmation call
                        return Promise.resolve([]);
                }
            },
        );

        const startPromise = bot.start();
        // Wait for polling to actually start
        await firstCallStarted;

        await bot.stop();
        await startPromise;

        assertEquals(deleteWebhookStub.calls.length, 1);
    });

    it("should process updates from polling", async () => {
        const updates = [
            { ...testUpdate, update_id: 1 },
            { ...testUpdate, update_id: 2 },
        ];

        // Override bot for this test needing initialization
        bot = new Bot(token);
        using _getMe = stub(bot.api, "getMe", () => Promise.resolve(me));
        using _deleteWebhook = stub(
            bot.api,
            "deleteWebhook",
            () => Promise.resolve(true),
        );

        let getUpdatesCallCount = 0;
        const { promise: secondCallStarted, resolve: notifySecondCall } =
            Promise.withResolvers<void>();

        using _getUpdates = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                getUpdatesCallCount++;
                switch (getUpdatesCallCount) {
                    case 1:
                        // First call: return updates
                        return Promise.resolve(updates);
                    case 2:
                        notifySecondCall();
                        return new Promise((_, reject) => {
                            signal!.addEventListener(
                                "abort",
                                () => reject(new Error("Aborted")),
                            );
                        });
                    default:
                        // Confirmation call
                        return Promise.resolve([]);
                }
            },
        );

        const middlewareSpy = spy((_ctx: Context) => {});
        bot.use(middlewareSpy);

        const startPromise = bot.start();
        // Wait for updates to be processed and second polling call to start
        await secondCallStarted;
        await bot.stop();
        await startPromise;

        // Should have processed both updates in order
        assertEquals(middlewareSpy.calls.length, 2);
        assertEquals(middlewareSpy.calls[0].args[0].update.update_id, 1);
        assertEquals(middlewareSpy.calls[1].args[0].update.update_id, 2);
    });

    it("should prevent middleware registration after start", async () => {
        let callCount = 0;
        const { promise: firstCallStarted, resolve: notifyFirstCall } = Promise
            .withResolvers<void>();

        using _ = stub(
            bot.api,
            "getUpdates",
            (_params, signal?: AbortSignal) => {
                callCount++;
                switch (callCount) {
                    case 1:
                        notifyFirstCall();
                        return new Promise((_, reject) => {
                            signal!.addEventListener(
                                "abort",
                                () => reject(new Error("Aborted")),
                            );
                        });
                    default:
                        // Subsequent calls
                        return Promise.resolve([]);
                }
            },
        );

        const startPromise = bot.start();
        // Wait for polling to actually start
        await firstCallStarted;

        // After start, bot.use is replaced with noUseFunction to prevent memory leaks
        assertEquals(bot.use.name, "noUseFunction");
        // Verify it actually throws when called
        assertThrows(() => bot.use(() => {}), Error);

        await bot.stop();
        await startPromise;
    });
});
