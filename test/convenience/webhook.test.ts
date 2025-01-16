import type { Hono } from "jsr:@hono/hono";
import type {
    APIGatewayProxyEventV2,
    Context as LambdaContext,
} from "npm:@types/aws-lambda";
import type { NHttp } from "jsr:@nhttp/nhttp";
import type { Application } from "jsr:@oak/oak";
import type { createServer } from "node:http";
import type { Express } from "npm:@types/express";
import type bodyParser from "npm:@types/koa-bodyparser";
import type Koa from "npm:@types/koa";
import type { FastifyInstance } from "npm:fastify";
import type { NextApiRequest, NextApiResponse } from "npm:next";
import { Bot, BotError, webhookCallback } from "../../src/mod.ts";
import type { UserFromGetMe } from "../../src/types.ts";
import { assert, assertIsError, describe, it } from "../deps.test.ts";

describe("webhook", () => {
    const bot = new Bot("dummy", { me: {} as unknown as UserFromGetMe });

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

    it("bot should catch errors in webhoook handler", async () => {
        let called = false;

        bot.catch((err) => {
            assertIsError(err, BotError, "Test Error");
            called = true;
        });
        bot.on("message", () => {
            throw new Error("Test Error");
        });

        const handler = webhookCallback(bot, "std/http");
        const fakeReq = new Request("https://fake-api.com", {
            method: "POST",
            body: JSON.stringify({
                update_id: 9696,
                message: {},
            }),
        });

        await handler(fakeReq);

        assert(called);
    });
});
