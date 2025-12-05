// deno-lint-ignore-file no-unversioned-import no-import-prefix

import type { Hono } from "jsr:@hono/hono";
import type {
    APIGatewayProxyEventV2,
    Context as LambdaContext,
} from "npm:@types/aws-lambda";
import type { NHttp } from "jsr:@nhttp/nhttp";
import type { Application } from "jsr:@oak/oak";
import type { createServer } from "node:http";
import type { Elysia } from "npm:elysia";
import type { Express } from "npm:@types/express";
import type bodyParser from "npm:@types/koa-bodyparser";
import type Koa from "npm:@types/koa";
import type { FastifyInstance } from "npm:fastify";
import type { NextApiRequest, NextApiResponse } from "npm:next";
import { Bot, webhookCallback } from "../../src/mod.ts";
import type { Update, UserFromGetMe } from "../../src/types.ts";
import {
    assert,
    assertEquals,
    assertRejects,
    assertThrows,
    describe,
    it,
    spy,
} from "../deps.test.ts";

describe("webhook", () => {
    const bot = new Bot("dummy", { botInfo: {} as unknown as UserFromGetMe });

    it("AWS Lambda should be compatible with grammY adapter", () => {
        ((event: APIGatewayProxyEventV2, context: LambdaContext) =>
            webhookCallback(bot, "aws-lambda-async")(
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

        const handler = webhookCallback(bot, "bun");
        const serve = (() => {}) as unknown as BunServe;
        serve({
            fetch: (request) => {
                return handler(request);
            },
        });
    });

    it("Cloudflare Workers should be compatible with grammY adapter", async () => {
        const req = {
            json: () => ({}),
            headers: { get: () => "" },
        } as unknown as Request;
        const handler = webhookCallback(bot, "cloudflare-mod");
        const _res: Response = await handler(req);
    });

    it("Elysia should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Elysia;

        app.post("/", webhookCallback(bot, "elysia"));
    });

    it("Express should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Express;
        const handler = webhookCallback(bot, "express");
        app.post("/", (req, res) => {
            return handler(req, res);
        });
    });

    it("Fastify should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as FastifyInstance;
        const handler = webhookCallback(bot, "fastify");
        app.post("/", (request, reply) => {
            return handler(request, reply);
        });
    });

    it("Hono should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Hono;
        const handler = webhookCallback(bot, "hono");
        app.post("/", (c) => {
            return handler(c);
        });
    });

    it("http/https should be compatible with grammY adapter", () => {
        const create = (() => {}) as unknown as typeof createServer;
        const handler = webhookCallback(bot, "http");
        create((req, res) => {
            return handler(req, res);
        });
    });

    it("Koa should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Koa;
        const parser = (() => {}) as unknown as typeof bodyParser;
        const handler = webhookCallback(bot, "koa");
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
        const res = { end: () => {} } as NextApiResponse;
        const handler = webhookCallback(bot, "next-js");
        await handler(req, res);
    });

    it("NHttp should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as NHttp;
        const handler = webhookCallback(bot, "nhttp");
        app.post("/", (rev) => {
            return handler(rev);
        });
    });

    it("Oak should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Application;
        const handler = webhookCallback(bot, "oak");
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
        const handler = webhookCallback(bot, "serveHttp");
        await handler(event);
    });

    it("std/http should be compatible with grammY adapter", () => {
        const serve = (() => {}) as unknown as typeof Deno.serve;
        const handler = webhookCallback(bot, "std/http");
        serve((req) => {
            return handler(req);
        });
    });
});

describe("webhook functionality", () => {
    const createTestBot = () =>
        new Bot("test-token", { botInfo: {} as unknown as UserFromGetMe });
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
            const originalIsRunning = bot.isRunning.bind(bot);
            bot.isRunning = () => true;

            assertThrows(
                () => webhookCallback(bot, "callback"),
                Error,
                "Bot is already running via long polling",
            );

            // Restore original method
            bot.isRunning = originalIsRunning;
        });

        it("should prevent bot.start() after webhook setup", () => {
            const bot = createTestBot();
            webhookCallback(bot, "callback");

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

            const handler = webhookCallback(bot, "callback", {
                secretToken: "correct-token",
            });

            const unauthorizedSpy = spy(() => {});
            await handler(testUpdate, () => {}, "wrong-token", unauthorizedSpy);

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

            const handler = webhookCallback(bot, "callback", {
                secretToken: "correct-token",
            });

            await handler(testUpdate, () => {}, "correct-token");

            // Verify handleUpdate was called
            assertEquals(
                (bot.handleUpdate as ReturnType<typeof spy>).calls.length,
                1,
            );
        });

        it("should accept requests when no secret token is configured", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookCallback(bot, "callback");

            await handler(testUpdate, () => {}, undefined);

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

            const handler = webhookCallback(bot, "callback");
            await handler(testUpdate, () => {}, undefined);

            assert(initCalled, "Bot init should be called");
            assertEquals((bot.init as ReturnType<typeof spy>).calls.length, 1);
        });

        it("should not re-initialize on subsequent requests", async () => {
            const bot = createTestBot();
            bot.init = spy(() => Promise.resolve());
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookCallback(bot, "callback");

            // First request
            await handler(testUpdate, () => {}, undefined);
            // Second request
            await handler(testUpdate, () => {}, undefined);
            // Third request
            await handler(testUpdate, () => {}, undefined);

            // Init should only be called once
            assertEquals((bot.init as ReturnType<typeof spy>).calls.length, 1);
        });
    });

    describe("basic functionality", () => {
        it("should process updates successfully", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(() => Promise.resolve());

            const handler = webhookCallback(bot, "callback");
            await handler(testUpdate, () => {}, undefined);

            assertEquals(
                (bot.handleUpdate as ReturnType<typeof spy>).calls.length,
                1,
            );
        });
    });

    describe("timeout handling", () => {
        it("should throw error on timeout with 'throw' strategy", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(async () => {
                // Simulate slow update processing
                await new Promise((resolve) => setTimeout(resolve, 200));
            });

            const handler = webhookCallback(bot, "callback", {
                onTimeout: "throw",
                timeoutMilliseconds: 50,
            });

            await assertRejects(
                () => handler(testUpdate, () => {}, undefined),
                Error,
                "Request timed out after 50 ms",
            );
        });

        it("should call custom function on timeout", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(async () => {
                await new Promise((resolve) => setTimeout(resolve, 200));
            });

            let customTimeoutCalled = false;
            const handler = webhookCallback(bot, "callback", {
                onTimeout: () => {
                    customTimeoutCalled = true;
                },
                timeoutMilliseconds: 50,
            });

            await handler(testUpdate, () => {}, undefined);

            assert(
                customTimeoutCalled,
                "Custom timeout handler should be called",
            );
        });
    });

    describe("webhook reply handling", () => {
        it("should call respond when webhook reply is used", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(async (_update, envelope) => {
                // Use webhook reply
                await envelope?.send?.('{"ok": true}');
            });

            const handler = webhookCallback(bot, "callback");

            const respondSpy = spy(() => {});
            await handler(testUpdate, respondSpy, undefined);

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

            const handler = webhookCallback(bot, "callback");

            const respondSpy = spy(() => {});
            await handler(testUpdate, respondSpy, undefined);

            // respond should NOT be called when webhook reply is not used
            assertEquals(respondSpy.calls.length, 0);
        });
    });

    describe("race conditions and ordering", () => {
        it("should handle webhook reply after timeout", async () => {
            const bot = createTestBot();
            let webhookReplySent = false;
            bot.handleUpdate = spy(async (_update, envelope) => {
                await new Promise((resolve) => setTimeout(resolve, 150));
                await envelope?.send?.('{"ok": true}');
                webhookReplySent = true;
            });

            const handler = webhookCallback(bot, "callback", {
                onTimeout: "return",
                timeoutMilliseconds: 50,
            });

            const respondSpy = spy(() => {});
            await handler(testUpdate, respondSpy, undefined);

            // Wait for webhook reply to be sent in background
            await new Promise((resolve) => setTimeout(resolve, 200));

            assert(
                webhookReplySent,
                "Webhook reply should be sent even after timeout",
            );
        });

        it("should handle update error before timeout", async () => {
            const bot = createTestBot();
            bot.handleUpdate = spy(async () => {
                await new Promise((resolve) => setTimeout(resolve, 20));
                throw new Error("Update processing failed");
            });

            const handler = webhookCallback(bot, "callback", {
                onTimeout: "throw",
                timeoutMilliseconds: 200,
            });

            // Should propagate the error
            await assertRejects(
                () => handler(testUpdate, () => {}, undefined),
                Error,
                "Update processing failed",
            );
        });

        it("should handle multiple concurrent updates with different outcomes", async () => {
            const bot = createTestBot();
            const results: string[] = [];

            bot.handleUpdate = spy(async (update) => {
                const id = (update as Update).update_id;
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

            const handler = webhookCallback(bot, "callback", {
                onTimeout: "return",
                timeoutMilliseconds: 100,
            });

            // Send three concurrent updates with different behaviors
            const [result1, result2, result3] = await Promise.allSettled([
                handler({ ...testUpdate, update_id: 1 }, () => {}, undefined),
                handler({ ...testUpdate, update_id: 2 }, () => {}, undefined),
                handler({ ...testUpdate, update_id: 3 }, () => {}, undefined),
            ]);

            // Update 1 should succeed
            assertEquals(result1.status, "fulfilled");
            // Update 2 should succeed (timeout returns early)
            assertEquals(result2.status, "fulfilled");
            // Update 3 should fail
            assertEquals(result3.status, "rejected");
            assertEquals(
                (result3 as PromiseRejectedResult).reason.message,
                "Update 3 failed",
            );

            // Wait for background operations
            await new Promise((resolve) => setTimeout(resolve, 200));

            // Verify all updates were processed
            assert(results.includes("update-1-completed"));
            assert(results.includes("update-2-completed"));
        });
    });
});
