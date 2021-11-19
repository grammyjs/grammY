// deno-lint-ignore-file no-explicit-any
import type { IncomingMessage, ServerResponse } from "http";
import { AdapterFactory } from "./webhook";
import { safeStringCompare } from "../platform.deno.ts";

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */

export const http: AdapterFactory<{ secretPath: string }> = ({ secretPath }) =>
    (req: IncomingMessage, res: ServerResponse) => ({
        update: new Promise((resolve, reject) => {
            if (
                req.method !== "POST" ||
                !safeStringCompare(secretPath, req.url ?? "")
            ) {
                reject();
                return;
            }
            const chunks: Buffer[] = [];
            req
                .on("data", (chunk) => chunks.push(chunk))
                .once("end", () => {
                    const raw = Buffer.concat(chunks).toString("utf-8");
                    resolve(JSON.parse(raw));
                })
                .once("error", (e) => reject(e));
        }),
        end: () => res.end(),
        respond: (json) =>
            res
                .writeHead(200, { "Content-Type": "application/json" })
                .end(json),
    });

export const https = http;

export const express: AdapterFactory = () =>
    (req: any, res: any) => ({
        update: Promise.resolve(req.body),
        end: () => res.end(),
        respond: (json: string) => {
            res.set("Content-Type", "application/json");
            res.send(json);
        },
    });

export const koa: AdapterFactory = () =>
    (ctx: any) => ({
        update: Promise.resolve(ctx.request.body),
        end: () => {
            ctx.body = "";
        },
        respond: (json: string) => {
            ctx.set("Content-Type", "application/json");
            ctx.response.body = json;
        },
    });

export const fastify: AdapterFactory = () =>
    (req: any, reply: any) => ({
        update: Promise.resolve(req.body),
        end: () => reply.status(200).send(),
        respond: (json: string) => reply.send(json),
    });

export const worktop: AdapterFactory = () =>
    (req: any, res: any) => ({
        update: Promise.resolve(req.body.json()),
        end: () => res.end(),
        respond: (json: string) => res.send(200, json),
    });

export const awsLambda: AdapterFactory = () =>
    (event: any, _context: any, callback: any) => ({
        update: JSON.parse(event.body),
        end: () => callback(null, { statusCode: 200 }),
        respond: (json: string) =>
            callback(null, {
                statusCode: 200,
                body: json,
            }),
    });

// please open a PR if you want to add another

export const defaultAdapter = express;
