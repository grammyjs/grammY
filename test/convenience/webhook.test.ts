// deno-lint-ignore-file no-unversioned-import no-import-prefix
import type { Hono } from "jsr:@hono/hono";
import type { NHttp } from "jsr:@nhttp/nhttp";
import type { Application } from "jsr:@oak/oak";
import type { createServer } from "node:http";
import type {
    APIGatewayProxyEventV2,
    Context as LambdaContext,
} from "npm:@types/aws-lambda";
import type { Express } from "npm:@types/express";
import type Koa from "npm:@types/koa";
import type bodyParser from "npm:@types/koa-bodyparser";
import type { Elysia } from "npm:elysia";
import type { FastifyInstance } from "npm:fastify";
import type { NextApiRequest, NextApiResponse } from "npm:next";
import { webhookAdapters } from "../../src/convenience/webhook.ts";
import type { Update, UserFromGetMe } from "../../src/types.ts";
import {
    assert,
    assertEquals,
    assertIsError,
    assertRejects,
    assertThrows,
    describe,
    FakeTime,
    it,
    spy,
    stub,
} from "../deps.test.ts";
import { Bot, BotError } from "../../src/bot.ts";

describe("webhook", () => {
    const bot = new Bot("dummy", { me: {} as unknown as UserFromGetMe });

    it("AWS Lambda should be compatible with grammY adapter", () => {
        ((event: APIGatewayProxyEventV2, context: LambdaContext) =>
            webhookAdapters.awsLambdaAsync(bot)(
                event,
                context,
            ));
    });

    it("Bun.serve should be compatible with grammY adapter", () => {
        type BunServe = (
            options: {
                fetch: (request: Request) => Response | Promise<Response>;
            },
        ) => object;

        const handler = webhookAdapters.bun(bot);
        const serve = (() => {}) as unknown as BunServe;
        serve({
            fetch: (request) => {
                return handler(request);
            },
        });
    });

    it("Cloudflare Workers should be compatible with grammY adapter", async () => {
        const req = new Request("https://grammy.dev", {
            method: "POST",
            body: JSON.stringify({ update_id: 0 }),
        });
        const handler = webhookAdapters.cloudflareModule(bot);
        const _res: Response = await handler(req);
    });

    it("Elysia should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Elysia;

        app.post("/", webhookAdapters.elysia(bot));
    });

    it("Express should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Express;
        const handler = webhookAdapters.express(bot);
        app.post("/", (req, res) => {
            return handler(req, res);
        });
    });

    it("Fastify should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as FastifyInstance;
        const handler = webhookAdapters.fastify(bot);
        app.post("/", (request, reply) => {
            return handler(request, reply);
        });
    });

    it("Hono should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Hono;
        const handler = webhookAdapters.hono(bot);
        app.post("/", (c) => {
            return handler(c);
        });
    });

    it("http/https should be compatible with grammY adapter", () => {
        const create = (() => {}) as unknown as typeof createServer;
        const handler = webhookAdapters.http(bot);
        create((req, res) => {
            return handler(req, res);
        });
    });

    it("Koa should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Koa;
        const parser = (() => {}) as unknown as typeof bodyParser;
        const handler = webhookAdapters.koa(bot);
        app.use(parser());
        app.use((ctx) => {
            return handler(ctx);
        });
    });

    it("Next serverless functions should be compatible with grammY adapter", async () => {
        const req = {
            headers: {},
            body: { update: {} },
        } as unknown as NextApiRequest;
        const res = {
            end: () => {},
            status: (_code) => ({
                send: (_data) => {},
            }),
        } as NextApiResponse;
        const handler = webhookAdapters.nextJs(bot);
        await handler(req, res);
    });

    it("NHttp should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as NHttp;
        const handler = webhookAdapters.nhttp(bot);
        app.post("/", (rev) => {
            return handler(rev);
        });
    });

    it("Oak should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Application;
        const handler = webhookAdapters.oak(bot);
        app.use((ctx) => {
            return handler(ctx);
        });
    });

    it("serveHttp should be compatible with grammY adapter", async () => {
        const event = {
            request: new Request("https://grammy.dev", {
                method: "POST",
                body: JSON.stringify({ update_id: 0 }),
            }),
            respondWith: () => {},
        };
        const handler = webhookAdapters.serveHttp(bot);
        await handler(event);
    });

    it("std/http should be compatible with grammY adapter", () => {
        const serve = (() => {}) as unknown as typeof Deno.serve;
        const handler = webhookAdapters.stdHttp(bot);
        serve((req) => {
            return handler(req);
        });
    });

    it("bot should catch errors in webhoook handler", async () => {
        let called = false;

        bot.catch((err) => {
            assertIsError(err, BotError, "Test Error");
            called = true;
        });
        bot.on("message", () => {
            throw new Error("Test Error");
        });

        const handler = webhookAdapters.stdHttp(bot);

        await handler(
            new Request("https://fake-api.com", {
                method: "POST",
                body: JSON.stringify({ update_id: 9696, message: {} }),
            }),
        );

        assert(called);
    });

    describe("server webhook errors", () => {
        it("should response with 401 unauthorized status", async () => {
            const handler = webhookAdapters.stdHttp(bot, {
                secretToken: "wrong-token",
            });

            const res = await handler(
                new Request("https://fake-api.com", {
                    method: "POST",
                    body: JSON.stringify({ update_id: 9696 }),
                }),
            );

            assertEquals(res.status, 401);
        });

        it("should response with 400 bad request status", async () => {
            const handler = webhookAdapters.stdHttp(bot);

            const res = await handler(
                new Request("https://fake-api.com", {
                    method: "POST",
                }),
            );

            assertEquals(res.status, 400);
        });
    });
});

describe("webhook functionality", () => {
    const createTestBot = () =>
        new Bot("test-token", { me: {} as unknown as UserFromGetMe });
    const testUpdate: Update = {
        update_id: 1,
        message: {
            message_id: 1,
            date: Math.floor(Date.now() / 1000),
            chat: { id: 1, type: "private", first_name: "Test" },
            from: { id: 1, is_bot: false, first_name: "Test" },
            text: "test",
        },
    };

    describe("error handling", () => {
        it("should throw when bot is already running", () => {
            const bot = createTestBot();
            // Mock isRunning to return true
            const isRunningStub = stub(bot, "isRunning", () => true);
            try {
                assertThrows(
                    () => webhookAdapters.callback(bot),
                    Error,
                    "Bot is already running via long polling",
                );
            } finally {
                // Restore original method even if test fails
                isRunningStub.restore();
            }
        });

        it("should prevent bot.start() after webhook setup", () => {
            const bot = createTestBot();
            webhookAdapters.callback(bot);

            assertThrows(
                () => bot.start(),
                Error,
                "You already started the bot via webhooks",
            );
        });
    });

    describe("secret token validation", () => {
        it("should reject requests with wrong secret token", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookAdapters.callback(bot, {
                secretToken: "correct-token",
            });

            const unauthorizedSpy = spy(() => {});
            await handler(testUpdate, () => {}, { header: "wrong-token" }, {
                unauthorized: unauthorizedSpy,
            });

            // Verify unauthorized was called
            assertEquals(unauthorizedSpy.calls.length, 1);
            // Verify handleUpdate was NOT called
            assertEquals(
                (bot.handleUpdate as ReturnType<typeof spy>).calls.length,
                0,
            );
        });

        it("should accept requests with correct secret token", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookAdapters.callback(bot, {
                secretToken: "correct-token",
            });

            await handler(testUpdate, () => {}, { header: "correct-token" });

            // Verify handleUpdate was called
            assertEquals(
                (bot.handleUpdate as ReturnType<typeof spy>).calls.length,
                1,
            );
        });

        it("should accept requests when no secret token is configured", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookAdapters.callback(bot);

            await handler(testUpdate, () => {});

            // Verify handleUpdate was called
            assertEquals(
                (bot.handleUpdate as ReturnType<typeof spy>).calls.length,
                1,
            );
        });
    });

    describe("bot initialization", () => {
        it("should initialize bot on first request", async () => {
            const bot = createTestBot();
            let initCalled = false;
            bot.init = spy(() => {
                initCalled = true;
                return Promise.resolve();
            });
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookAdapters.callback(bot);
            await handler(testUpdate, () => {});

            assert(initCalled, "Bot init should be called");
            assertEquals((bot.init as ReturnType<typeof spy>).calls.length, 1);
        });

        it("should not re-initialize on subsequent requests", async () => {
            const bot = createTestBot();
            bot.init = spy(() => Promise.resolve());
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookAdapters.callback(bot);

            // First request
            await handler(testUpdate, () => {});
            // Second request
            await handler(testUpdate, () => {});
            // Third request
            await handler(testUpdate, () => {});

            // Init should only be called once
            assertEquals((bot.init as ReturnType<typeof spy>).calls.length, 1);
        });
    });

    describe("basic functionality", () => {
        it("should process updates successfully", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookAdapters.callback(bot);
            await handler(testUpdate, () => {});

            assertEquals(
                (bot.handleUpdate as ReturnType<typeof spy>).calls.length,
                1,
            );
        });
    });

    describe("timeout handling", () => {
        it("should throw error on timeout with 'throw' strategy", async () => {
            using time = new FakeTime();
            const bot = createTestBot();
            bot.handleUpdate = spy(async () => {
                // Simulate slow update processing
                await new Promise((resolve) => setTimeout(resolve, 200));
            });

            const handler = webhookAdapters.callback(bot, {
                onTimeout: "throw",
                timeoutMilliseconds: 50,
            });

            const promise = handler(testUpdate, () => {});
            await time.nextAsync();
            await assertRejects(
                () => promise,
                Error,
                "Request timed out after 50 ms",
            );
            await time.runAllAsync();
        });

        it("should call custom function on timeout", async () => {
            using time = new FakeTime();
            const bot = createTestBot();
            bot.handleUpdate = spy(async () => {
                await new Promise((resolve) => setTimeout(resolve, 200));
            });

            let customTimeoutCalled = false;
            const handler = webhookAdapters.callback(bot, {
                onTimeout: () => {
                    customTimeoutCalled = true;
                },
                timeoutMilliseconds: 50,
            });

            const promise = handler(testUpdate, () => {});
            await time.nextAsync();
            await promise;
            assert(
                customTimeoutCalled,
                "Custom timeout handler should be called",
            );
            await time.runAllAsync();
        });
    });

    describe("webhook reply handling", () => {
        it("should call respond when webhook reply is used", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(async (_update, envelope) => {
                // Use webhook reply
                await envelope?.send?.('{"ok": true}');
            });

            const handler = webhookAdapters.callback(bot);

            const respondSpy = spy(() => {});
            await handler(testUpdate, respondSpy);

            // respond should be called when webhook reply is used
            assertEquals(respondSpy.calls.length, 1);
            assertEquals(
                (respondSpy.calls[0] as { args: unknown[] }).args[0],
                '{"ok": true}',
            );
        });

        it("should not call respond when webhook reply is not used", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookAdapters.callback(bot);

            const respondSpy = spy(() => {});
            await handler(testUpdate, respondSpy);

            // respond should NOT be called when webhook reply is not used
            assertEquals(respondSpy.calls.length, 0);
        });
    });

    describe("race conditions and ordering", () => {
        it("should handle webhook reply after timeout", async () => {
            using time = new FakeTime();
            const bot = createTestBot();
            let webhookReplySent = false;
            bot.handleUpdate = spy(async (_update, envelope) => {
                await new Promise((resolve) => setTimeout(resolve, 150));
                await envelope?.send?.('{"ok": true}');
                webhookReplySent = true;
            });

            const handler = webhookAdapters.callback(bot, {
                onTimeout: "ignore",
                timeoutMilliseconds: 50,
            });

            const respondSpy = spy(() => {});
            const promise = handler(testUpdate, respondSpy);

            await time.nextAsync();
            await promise;

            // Wait for webhook reply to be sent in background
            await time.nextAsync();
            await time.runMicrotasks();
            assert(
                webhookReplySent,
                "Webhook reply should be sent even after timeout",
            );
        });

        it("should handle update error before timeout", async () => {
            using time = new FakeTime();
            const bot = createTestBot();
            bot.handleUpdate = spy(async () => {
                await new Promise((resolve) => setTimeout(resolve, 20));
                throw new Error("Update processing failed");
            });

            const handler = webhookAdapters.callback(bot, {
                onTimeout: "throw",
                timeoutMilliseconds: 200,
            });

            const promise = handler(testUpdate, () => {});
            await time.nextAsync();

            // Should propagate the error
            await assertRejects(
                () => promise,
                Error,
                "Update processing failed",
            );
            await time.runAllAsync();
        });

        it("should handle multiple concurrent updates with different outcomes", async () => {
            using time = new FakeTime(0);
            const bot = createTestBot();
            const results: string[] = [];

            bot.handleUpdate = spy(async (update) => {
                const id = update.update_id;
                if (id === 1) {
                    // Fast update
                    await new Promise((resolve) => setTimeout(resolve, 30));
                    results.push("update-1-completed");
                } else if (id === 2) {
                    // Slow update (will timeout)
                    await new Promise((resolve) => setTimeout(resolve, 150));
                    results.push("update-2-completed");
                } else if (id === 3) {
                    // Error update
                    await new Promise((resolve) => setTimeout(resolve, 20));
                    throw new Error("Update 3 failed");
                }
            });

            const handler = webhookAdapters.callback(bot, {
                onTimeout: "ignore",
                timeoutMilliseconds: 100,
            });

            // Send three concurrent updates with different behaviors
            const p1 = handler({ ...testUpdate, update_id: 1 }, () => {});
            const p2 = handler({ ...testUpdate, update_id: 2 }, () => {});
            const p3 = handler({ ...testUpdate, update_id: 3 }, () => {});

            const allSettledPromise = Promise.allSettled([p1, p2, p3]);

            await time.tickAsync(20); // Update 3 fails
            await time.tickAsync(10); // Update 1 completes (30 total)
            await time.tickAsync(70); // Timeout for Update 2 (100 total)

            const [result1, result2, result3] = await allSettledPromise;

            // Update 1 should succeed
            assertEquals(result1.status, "fulfilled");
            // Update 2 should succeed (timeout returns early)
            assertEquals(result2.status, "fulfilled");
            // Update 3 should fail
            assert(result3.status === "rejected");
            assertEquals(result3.reason.message, "Update 3 failed");

            // Wait for background operations
            await time.runAllAsync(); // Update 2 completes (150 total)
            assertEquals(time.now, 150);

            // Verify all updates were processed
            assert(results.includes("update-1-completed"));
            assert(results.includes("update-2-completed"));
        });
    });
});
