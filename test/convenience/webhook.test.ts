import type { Hono } from "https://deno.land/x/hono/mod.ts";
import type {
    APIGatewayProxyEventV2,
    Context as LambdaContext,
} from "https://deno.land/x/lambda/mod.ts";
import type { NHttp } from "https://deno.land/x/nhttp/mod.ts";
import type { Application } from "https://deno.land/x/oak/mod.ts";
import type { createServer } from "node:http";
import type { FastifyInstance } from "npm:fastify";
import type { NextApiRequest, NextApiResponse } from "npm:next";
import { Bot, webhookCallback } from "../../src/mod.ts";
import { describe, it } from "../deps.test.ts";

import type { Express } from "npm:@types/express@^4.17";
import type Koa from "npm:@types/koa@^2.15";
import type { UserFromGetMe } from "../../src/types.ts";

describe("webhook", () => {
    const bot = new Bot("dummy", { botInfo: {} as unknown as UserFromGetMe });

    it("AWS Lambda should be compatible with grammY adapter", () => {
        ((
            event: APIGatewayProxyEventV2,
            context: LambdaContext,
        ) => {
            return webhookCallback(bot, "aws-lambda-async")(
                event,
                context,
            );
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
        app.post("/", webhookCallback(bot, "express"));
    });

    it("Fastify should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as FastifyInstance;
        app.post("/", webhookCallback(bot, "fastify"));
    });

    it("Hono should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Hono;
        app.post("/", webhookCallback(bot, "hono"));
    });

    it("http/https should be compatible with grammY adapter", () => {
        const create = (() => {}) as unknown as typeof createServer;
        create(webhookCallback(bot, "http"));
    });

    it("Koa should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Koa;
        app.use(webhookCallback(bot, "koa"));
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
        app.post("/", webhookCallback(bot, "nhttp"));
    });

    it("Oak should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Application;
        app.use(webhookCallback(bot, "oak"));
    });

    it("serveHttp should be compatible with grammY adapter", async () => {
        const event = {
            request: {
                json: () => ({ update_id: 0 }),
                headers: { get: () => {} },
            },
            respondWith: () => {},
        } as unknown as Deno.RequestEvent;
        const handler = webhookCallback(bot, "serveHttp");
        await handler(event);
    });

    it("std/http should be compatible with grammY adapter", () => {
        const serve = (() => {}) as unknown as typeof Deno.serve;
        serve(webhookCallback(bot, "std/http"));
    });
});
