// deno-lint-ignore-file no-explicit-any
import type { IncomingMessage, ServerResponse } from "http";

/** Node.js native 'http' and 'https' modules */
const http = (req: IncomingMessage, res: ServerResponse) => ({
    update: new Promise<any>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk)).once("end", () => {
            const raw = Buffer.concat(chunks).toString("utf-8");
            resolve(JSON.parse(raw));
        }).once("error", reject);
    }),
    end: () => res.end(),
    respond: (json: string) =>
        res.writeHead(200, { "Content-Type": "application/json" }).end(json),
});

/** express web framework */
const express = (req: any, res: any) => ({
    update: Promise.resolve(req.body),
    end: () => res.end(),
    respond: (json: string) => {
        res.set("Content-Type", "application/json");
        res.send(json);
    },
});

/** koa web framework */
const koa = (ctx: any) => ({
    update: Promise.resolve(ctx.request.body),
    end: () => {
        ctx.body = "";
    },
    respond: (json: string) => {
        ctx.set("Content-Type", "application/json");
        ctx.response.body = json;
    },
});

/** fastify web framework */
const fastify = (req: any, reply: any) => ({
    update: Promise.resolve(req.body),
    end: () => reply.status(200).send(),
    respond: (json: string) => reply.send(json),
});

/** worktop CloudFlare workers framework */
const worktop = (req: any, res: any) => ({
    update: Promise.resolve(req.body.json()),
    end: () => res.end(),
    respond: (json: string) => res.send(200, json),
});

/** AWS lambda serverless functions */
const awsLambda = (event: any, _context: any, callback: any) => ({
    update: JSON.parse(event.body),
    end: () => callback(null, { statusCode: 200 }),
    respond: (json: string) => callback(null, { statusCode: 200, body: json }),
});

// please open a PR if you want to add another
export const adapters = {
    http,
    https: http,
    express,
    koa,
    fastify,
    worktop,
    "aws-lambda": awsLambda,
};
export const defaultAdapter = "express";
