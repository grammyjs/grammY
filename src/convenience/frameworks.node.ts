// deno-lint-ignore-file no-explicit-any
import { type IncomingMessage, type ServerResponse } from "http";
import {
    adapters as sharedAdapters,
    SECRET_HEADER,
} from "./frameworks.shared.ts";

/** Node.js native 'http' and 'https' modules */
const http = (req: IncomingMessage, res: ServerResponse) => {
    const secretHeaderFromRequest = req.headers[SECRET_HEADER.toLowerCase()];

    return {
        update: new Promise<any>((resolve, reject) => {
            const chunks: Buffer[] = [];
            req.on("data", (chunk) => chunks.push(chunk))
                .once("end", () => {
                    const raw = Buffer.concat(chunks).toString("utf-8");
                    resolve(JSON.parse(raw));
                })
                .once("error", reject);
        }),
        header: Array.isArray(secretHeaderFromRequest)
            ? secretHeaderFromRequest[0]
            : secretHeaderFromRequest,
        end: () => res.end(),
        respond: (json: string) =>
            res
                .writeHead(200, { "Content-Type": "application/json" })
                .end(json),
        unauthorized: () => res.writeHead(401).end("secret token is wrong"),
    };
};

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

/** Azure Functions */
const azure = (context: any, req: any) => ({
    update: Promise.resolve(req.body),
    header: context.res.headers[SECRET_HEADER],
    end: () => (context.res = {
        status: 200,
        body: "",
    }),
    respond: (json: string) => {
        context.res.set("Content-Type", "application/json");
        context.res.send(json);
    },
    unauthorized: () => {
        context.res.send(401, "secret token is wrong");
    },
});

/** Next.js Serverless Functions */
const nextJs = (req: any, res: any) => ({
    update: Promise.resolve(req.body),
    header: req.headers[SECRET_HEADER],
    end: () => res.end(),
    respond: (json: string) => res.status(200).json(json),
    unauthorized: () => res.status(401).send("secret token is wrong"),
});

// please open a PR if you want to add another
export const adapters = {
    http,
    https: http,
    worktop,
    "aws-lambda": awsLambda,
    azure,
    "next-js": nextJs,
    ...sharedAdapters,
};
export const defaultAdapter = "express";
