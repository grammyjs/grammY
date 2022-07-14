// deno-lint-ignore-file no-explicit-any
import { type IncomingMessage, type ServerResponse } from "http";

const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token";

/** Node.js native 'http' and 'https' modules */
const http = (req: IncomingMessage, res: ServerResponse) => ({
    update: new Promise<any>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk)).once("end", () => {
            const raw = Buffer.concat(chunks).toString("utf-8");
            resolve(JSON.parse(raw));
        }).once("error", reject);
    }),
    header: String(req.headers[SECRET_HEADER.toLowerCase()]),
    end: () => res.end(),
    respond: (json: string) =>
        res.writeHead(200, { "Content-Type": "application/json" }).end(json),
    unauthorized: () => res.writeHead(401).end("secret token is wrong"),
});

/** express web framework */
const express = (req: any, res: any) => ({
    update: Promise.resolve(req.body),
    header: req.header(SECRET_HEADER),
    end: () => res.end(),
    respond: (json: string) => {
        res.set("Content-Type", "application/json");
        res.send(json);
    },
    unauthorized: () => {
        res.send(401, "secret token is wrong");
    },
});

/** koa web framework */
const koa = (ctx: any) => ({
    update: Promise.resolve(ctx.request.body),
    header: ctx.get(SECRET_HEADER),
    end: () => {
        ctx.body = "";
    },
    respond: (json: string) => {
        ctx.set("Content-Type", "application/json");
        ctx.response.body = json;
    },
    unauthorized: () => {
        ctx.status = 401;
    },
});

/** fastify web framework */
const fastify = (req: any, reply: any) => ({
    update: Promise.resolve(req.body),
    header: req.headers[SECRET_HEADER.toLowerCase()],
    end: () => reply.status(200).send(),
    respond: (json: string) => reply.send(json),
    unauthorized: () => reply.code(401).send("secret token is wrong"),
});

/** worktop CloudFlare workers framework */
const worktop = (req: any, res: any) => ({
    update: Promise.resolve(req.body.json()),
    header: req.headers.get(SECRET_HEADER),
    end: () => res.end(),
    respond: (json: string) => res.send(200, json),
    unauthorized: () => res.send(401, "secret token is wrong"),
});

/** AWS lambda serverless functions */
const awsLambda = (event: any, _context: any, callback: any) => ({
    update: JSON.parse(event.body),
    header: event.headers[SECRET_HEADER],
    end: () => callback(null, { statusCode: 200 }),
    respond: (json: string) => callback(null, { statusCode: 200, body: json }),
    unauthorized: () => callback(null, { statusCode: 401 }),
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
