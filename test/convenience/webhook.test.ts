/// <reference types="npm:@types/node" />

import { Hono } from "https://deno.land/x/hono/mod.ts";
import type {
    APIGatewayProxyEventV2,
    Context as LambdaContext,
} from "https://deno.land/x/lambda/mod.ts";
import { createServer } from "node:http";
import Fastify from "npm:fastify";
import { Bot, webhookCallback } from "../../src/mod.ts";
import { describe, it } from "../deps.test.ts";

// @deno-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
// @deno-types="npm:@types/koa@^2.15"
import Koa from "npm:koa@^2.15";

describe("webhook", () => {
    it("AWS Lambda should be compatible with grammY adapter", () => {
        ((
            event: APIGatewayProxyEventV2,
            context: LambdaContext,
        ) => {
            return webhookCallback(new Bot(""), "aws-lambda-async")(
                event,
                context,
            );
        });
    });

    it("Cloudflare Workers should be compatible with grammY adapter", () => {
        ((
            request: Request,
        ): Promise<Response> => {
            return webhookCallback(new Bot(""), "cloudflare-mod")(request);
        });
    });

    it("Express should be compatible with grammY adapter", () => {
        express().post("/", (req, res) => {
            return webhookCallback(new Bot(""), "express")(req, res);
        });
    });

    it("Fastify should be compatible with grammY adapter", () => {
        Fastify().post("/", (request, reply) => {
            return webhookCallback(new Bot(""), "fastify")(request, reply);
        });
    });

    it("Hono should be compatible with grammY adapter", () => {
        new Hono().post("/", (c) => {
            return webhookCallback(new Bot(""), "hono")(c);
        });
    });

    it("http/https should be compatible with grammY adapter", () => {
        createServer((req, res) => {
            return webhookCallback(new Bot(""), "http")(req, res);
        });
    });

    it("Koa should be compatible with grammY adapter", () => {
        new Koa().use((ctx) => {
            return webhookCallback(new Bot(""), "koa")(ctx);
        });
    });

    it("std/http should be compatible with grammY adapter", () => {
        try {
            Deno.serve(
                (req) => {
                    return webhookCallback(new Bot(""), "std/http")(req);
                },
            );
        } catch (error) {
            if (error instanceof Deno.errors.PermissionDenied) return;
            throw error;
        }
    });
});