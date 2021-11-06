// deno-lint-ignore-file no-explicit-any

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */
export type SupportedFrameworks =
    | "express"
    | "http"
    | "https"
    | "koa"
    | "fastify"
    | "worktop"
    | "callback"
    | "aws-lambda";

export const defaultFramework: SupportedFrameworks = "express";

export const frameworkAdapters = {
    express: (req: any, res: any) => ({
        update: Promise.resolve(req.body),
        end: () => res.end(),
        respond: (json: string) => {
            res.set("Content-Type", "application/json");
            res.send(json);
        },
    }),
    http: (req: any, res: any) => ({
        update: new Promise<any>((resolve) => {
            const chunks: Buffer[] = [];
            req
                .on("data", (chunk: Buffer) => chunks.push(chunk))
                .on("end", () => {
                    const raw = Buffer.concat(chunks).toString("utf-8");
                    resolve(JSON.parse(raw));
                });
        }),
        end: () => res.end(),
        respond: (json: string) => {
            return res
                .writeHead(200, { "Content-Type": "application/json" })
                .end(json);
        },
    }),
    https: (req: any, res: any) => ({
        update: new Promise<any>((resolve) => {
            const chunks: Buffer[] = [];
            req
                .on("data", (chunk: Buffer) => chunks.push(chunk))
                .on("end", () => {
                    const raw = Buffer.concat(chunks).toString("utf-8");
                    resolve(JSON.parse(raw));
                });
        }),
        end: () => res.end(),
        respond: (json: string) => {
            return res
                .writeHead(200, { "Content-Type": "application/json" })
                .end(json);
        },
    }),
    koa: (ctx: any) => ({
        update: Promise.resolve(ctx.request.body),
        end: () => (ctx.body = ""),
        respond: (json: string) => {
            ctx.set("Content-Type", "application/json");
            ctx.response.body = json;
        },
    }),
    fastify: (req: any, reply: any) => ({
        update: Promise.resolve(req.body),
        end: () => reply.send({}),
        respond: (json: string) => reply.send(json),
    }),
    worktop: (req: any, res: any) => ({
        update: Promise.resolve(req.body.json()),
        end: () => res.end(),
        respond: (json: string) => res.send(200, json),
    }),
    "aws-lambda": (event: any, _context: any, callback: any) => ({
        update: JSON.parse(event.body),
        end: () => callback(null, { statusCode: 200 }),
        respond: (json: string) =>
            callback(null, {
                statusCode: 200,
                body: json,
            }),
    }),
    // please open a PR if you want to add another
};
