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
        ((event: APIGatewayProxyEventV2, context: LambdaContext) =>
            webhookCallback(bot, "aws-lambda-async")(
                event,
                context,
            ));
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
        app.post("/", (req, res) => handler(req, res));
    });

    it("Fastify should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as FastifyInstance;
        const handler = webhookCallback(bot, "fastify");
        app.post("/", (request, reply) => handler(request, reply));
    });

    it("Hono should be compatible with grammY adapter", () => {
        const app = { post: () => {} } as unknown as Hono;
        const handler = webhookCallback(bot, "hono");
        app.post("/", (c) => handler(c));
    });

    it("http/https should be compatible with grammY adapter", () => {
        const create = (() => {}) as unknown as typeof createServer;
        const handler = webhookCallback(bot, "http");
        create((req, res) => handler(req, res));
    });

    it("Koa should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Koa;
        const handler = webhookCallback(bot, "koa");
        app.use((ctx) => handler(ctx));
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
        app.post("/", (rev) => handler(rev));
    });

    it("Oak should be compatible with grammY adapter", () => {
        const app = { use: () => {} } as unknown as Application;
        const handler = webhookCallback(bot, "oak");
        app.use((ctx) => handler(ctx));
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
        const handler = webhookCallback(bot, "std/http");
        serve((req) => handler(req));
    });
});
