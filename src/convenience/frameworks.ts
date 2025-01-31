import type { Update } from "../types.ts";

const ERROR = {
    BAD_REQUEST: "unable to parse request body",
    WRONG_TOKEN: "secret token is wrong",
    NOT_FOUND: "path not found",
} as const;

const ok = () => new Response(null, { status: 200 });
const okJson = (json: string) =>
    new Response(json, {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
const badRequest = () => new Response(ERROR.BAD_REQUEST, { status: 400 });
const unauthorized = () => new Response(ERROR.WRONG_TOKEN, { status: 401 });
const notFound = () => new Response(ERROR.NOT_FOUND, { status: 404 });

// deno-lint-ignore no-explicit-any
export interface WebhookRequestData<F extends (...args: any[]) => any> {
    path(): string;
    header(name: string): string | null | undefined;
    update(): Promise<Update>;
    extra?(...args: Parameters<F>): Promise<unknown>;
}

// deno-lint-ignore no-explicit-any
export interface FrameworkAdapter<F extends (...args: any[]) => any> {
    receive(...args: Parameters<F>): WebhookRequestData<F>;
    ok(...args: Parameters<F>): ReturnType<F>;
    badRequest(...args: Parameters<F>): ReturnType<F>;
    unauthorized(...args: Parameters<F>): ReturnType<F>;
    notFound(...args: Parameters<F>): ReturnType<F>;
    success(json: string, ...args: Parameters<F>): ReturnType<F>;
}

// TODO: not tested
/** AWS lambda serverless functions */
export type LambdaAdapter = (
    event: {
        body?: string;
        headers: Record<string, string | undefined>;
        path: string;
    },
    _context: unknown,
    callback: (
        arg0: unknown,
        arg1: Record<string, unknown>,
    ) => Promise<unknown>,
) => void;
const awsLambda: FrameworkAdapter<LambdaAdapter> = {
    receive(event, _context, _callback) {
        return {
            path: () => event.path,
            header: (name) => event.headers[name],
            update: () => Promise.resolve(JSON.parse(event.body ?? "{}")),
        };
    },
    ok: (_event, _context, callback) => callback(null, { statusCode: 200 }),
    success: (json, _event, _context, callback) =>
        callback(null, {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: json,
        }),
    badRequest: (_event, _context, callback) =>
        callback(null, { statusCode: 400, body: ERROR.BAD_REQUEST }),
    unauthorized: (_event, _context, callback) =>
        callback(null, { statusCode: 401, body: ERROR.WRONG_TOKEN }),
    notFound: (_event, _context, callback) =>
        callback(null, { statusCode: 404, body: ERROR.NOT_FOUND }),
};

// TODO: not tested
/** AWS lambda async/await serverless functions */
export type LambdaAsyncAdapter = (
    event: {
        body?: string;
        headers: Record<string, string | undefined>;
        rawPath: string;
    },
    _context: unknown,
) => unknown;
const awsLambdaAsync: FrameworkAdapter<LambdaAsyncAdapter> = {
    receive(event, _context) {
        return {
            path: () => event.rawPath,
            header: (name) => event.headers[name],
            update: () => Promise.resolve(JSON.parse(event.body ?? "{}")),
        };
    },
    ok: (_event, _context) => ({ statusCode: 200 }),
    success: (json, _event, _context) => ({
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: json,
    }),
    badRequest: (_event, _context) => ({
        statusCode: 400,
        body: ERROR.BAD_REQUEST,
    }),
    unauthorized: (_event, _context) => ({
        statusCode: 401,
        body: ERROR.WRONG_TOKEN,
    }),
    notFound: (_event, _context) => ({
        statusCode: 404,
        body: ERROR.NOT_FOUND,
    }),
};

// TODO: not tested
/** Azure Functions */
export type AzureAdapterV3 = (request: {
    body?: unknown;
    url: string;
}, context: {
    res?: {
        status: number;
        body: string;
        headers?: Record<string, string>;
        set?: (key: string, value: string) => void;
        send?: {
            (body: unknown): void;
            (status: number, body: unknown): void;
        };
    };
}) => void;
const azure: FrameworkAdapter<AzureAdapterV3> = {
    receive(request, { res }) {
        return {
            path: () => new URL(request.url).pathname,
            header: (name) => res?.headers?.[name],
            update: () => Promise.resolve(request.body as Update),
        };
    },
    ok: (_request, context) => {
        context.res = { status: 200, body: "" };
    },
    success: (json, _request, { res }) => {
        res?.set?.("Content-Type", "application/json");
        res?.send?.(json);
    },
    badRequest: (_request, { res }) => {
        res?.send?.(400, ERROR.BAD_REQUEST);
    },
    unauthorized: (_request, { res }) => {
        res?.send?.(401, ERROR.WRONG_TOKEN);
    },
    notFound: (_request, { res }) => {
        res?.send?.(404, ERROR.NOT_FOUND);
    },
};

// TODO: not tested
// /** Bun.serve */
export type BunAdapter = (request: Request) => Response;
const bun: FrameworkAdapter<BunAdapter> = {
    receive(request) {
        return {
            path: () => new URL(request.url).pathname,
            header: (name) => request.headers.get(name),
            update: request.json,
        };
    },
    ok,
    success: okJson,
    badRequest,
    unauthorized,
    notFound,
};

// TODO: not tested
// /** Native CloudFlare workers (service worker) */
export type CloudflareAdapter = (event: {
    request: Request;
    respondWith: (response: Response | Promise<Response>) => void;
}) => void;
const cloudflare: FrameworkAdapter<CloudflareAdapter> = {
    receive({ request }) {
        return {
            path: () => new URL(request.url).pathname,
            header: (name) => request.headers.get(name),
            update: request.json,
        };
    },
    ok: ({ respondWith }) => respondWith(ok()),
    success: (json: string, { respondWith }) => respondWith(okJson(json)),
    badRequest: ({ respondWith }) => respondWith(badRequest()),
    unauthorized: ({ respondWith }) => respondWith(unauthorized()),
    notFound: ({ respondWith }) => respondWith(notFound()),
};

// TODO: not tested
/** Native CloudFlare workers (module worker) */
export type CloudflareModuleAdapter = (req: Request) => Response;
const cloudflareModule: FrameworkAdapter<CloudflareModuleAdapter> = {
    receive(req) {
        return {
            path: () => new URL(req.url).pathname,
            header: (name) => req.headers.get(name),
            update: req.json,
        };
    },
    ok,
    success: okJson,
    badRequest,
    unauthorized,
    notFound,
};

// TODO: not tested
// /** express web framework */
export type ExpressAdapter = (req: {
    body: Update;
    header: (header: string) => string | undefined;
    path: string;
}, res: {
    end: (cb?: () => void) => typeof res;
    set: (field: string, value?: string | string[]) => typeof res;
    send: (json: string) => typeof res;
    status: (code: number) => typeof res;
}) => void;
const express: FrameworkAdapter<ExpressAdapter> = {
    receive: (req, _res) => {
        return {
            path: () => req.path,
            header: (name) => req.header(name),
            update: () => Promise.resolve(req.body),
        };
    },
    ok: (_req, res) => res.end(),
    success: (json, _req, res) => {
        res.set("Content-Type", "application/json");
        res.send(json);
    },
    badRequest: (_req, res) => res.status(400).send(ERROR.BAD_REQUEST),
    unauthorized: (_req, res) => res.status(401).send(ERROR.WRONG_TOKEN),
    notFound: (_req, res) => res.status(404).send(ERROR.NOT_FOUND),
};

// TODO: not tested
/** fastify web framework */
export type FastifyAdapter = (request: {
    body: unknown;
    // deno-lint-ignore no-explicit-any
    headers: any;
}, reply: {
    status: (code: number) => typeof reply;
    headers: (headers: Record<string, string>) => typeof reply;
    code: (code: number) => typeof reply;
    send: {
        (): typeof reply;
        (json: string): typeof reply;
    };
}) => void;
const fastify: FrameworkAdapter<FastifyAdapter> = {
    receive(request, _reply) {
        return {
            path: () => request.headers.path,
            header: (name) => request.headers[name],
            update: () => Promise.resolve(request.body as Update),
        };
    },
    ok: (_req, reply) => reply.status(200).send(),
    success: (json, _req, reply) =>
        reply.headers({ "Content-Type": "application/json" }).send(json),
    badRequest: (_req, reply) => reply.status(400).send(ERROR.BAD_REQUEST),
    unauthorized: (_req, reply) => reply.status(401).send(ERROR.WRONG_TOKEN),
    notFound: (_req, reply) => reply.status(404).send(ERROR.NOT_FOUND),
};

// TODO: not tested
/** hono web framework */
export type HonoAdapter = (c: {
    req: {
        json: <T>() => Promise<T>;
        header: (header: string) => string | undefined;
        url: string;
    };
    body(data: string): Response;
    body(data: null, status: 204): Response;
    // deno-lint-ignore no-explicit-any
    status: (status: any) => void;
    json: (json: string) => Response;
}) => Response;
const hono: FrameworkAdapter<HonoAdapter> = {
    receive(c) {
        return {
            path: () => new URL(c.req.url).pathname,
            header: (name) => c.req.header(name),
            update: c.req.json<Update>,
        };
    },
    ok: (c) => c.body(""),
    success: (json: string, c) => c.json(json),
    badRequest: (c) => {
        c.status(400);
        return c.body(ERROR.BAD_REQUEST);
    },
    unauthorized: (c) => {
        c.status(401);
        return c.body(ERROR.WRONG_TOKEN);
    },
    notFound: (c) => {
        c.status(404);
        return c.body(ERROR.NOT_FOUND);
    },
};

// TODO: not tested
/** Node.js native 'http' and 'https' modules */
export type HttpAdapter = (req: {
    headers: Record<string, string | string[] | undefined>;
    on: (event: string, listener: (chunk: unknown) => void) => typeof req;
    once: (event: string, listener: () => void) => typeof req;
    url: string;
}, res: {
    writeHead: {
        (status: number): typeof res;
        (status: number, headers: Record<string, string>): typeof res;
    };
    end: (json?: string) => void;
}) => void;
const http: FrameworkAdapter<HttpAdapter> = {
    receive(req, _res) {
        return {
            path: () => new URL(req.url).pathname,
            header: (name) =>
                Array.isArray(req.headers[name])
                    ? req.headers[name][0]
                    : req.headers[name],
            update: () =>
                new Promise<Update>((resolve, reject) => {
                    // deno-lint-ignore no-explicit-any
                    type Chunk = any;
                    const chunks: Chunk[] = [];
                    req.on("data", (chunk: Chunk) => chunks.push(chunk))
                        .once("end", () => {
                            // @ts-ignore `Buffer` is Node-only
                            // deno-lint-ignore no-node-globals
                            const raw = Buffer.concat(chunks).toString("utf-8");
                            resolve(JSON.parse(raw));
                        })
                        .once("error", reject);
                }),
        };
    },
    ok: (_req, res) => res.writeHead(200).end(),
    success: (json, _req, res) =>
        res
            .writeHead(200, { "Content-Type": "application/json" })
            .end(json),
    badRequest: (_req, res) => res.writeHead(400).end(ERROR.BAD_REQUEST),
    unauthorized: (_req, res) => res.writeHead(401).end(ERROR.WRONG_TOKEN),
    notFound: (_req, res) => res.writeHead(404).end(ERROR.NOT_FOUND),
};

// TODO: not tested
/** koa web framework */
export type KoaAdapter = (ctx: {
    get: (header: string) => string | undefined;
    set: (key: string, value: string) => void;
    status: number;
    body: string;
    url: string;
    request: {
        body?: unknown;
        url: string;
    };
    response: {
        body: unknown;
        status: number;
    };
}) => unknown;
const koa: FrameworkAdapter<KoaAdapter> = {
    receive(ctx) {
        return {
            path: () => new URL(ctx.url).pathname,
            header: (name) => ctx.get(name),
            update: () => Promise.resolve(ctx.request.body as Update),
        };
    },
    ok: (ctx) => {
        ctx.body = "";
    },
    success: (json, ctx) => {
        ctx.set("Content-Type", "application/json");
        ctx.body = json;
    },
    badRequest: (ctx) => {
        ctx.status = 400;
        ctx.body = ERROR.BAD_REQUEST;
    },
    unauthorized: (ctx) => {
        ctx.status = 401;
        ctx.body = ERROR.WRONG_TOKEN;
    },
    notFound: (ctx) => {
        ctx.status = 404;
        ctx.body = ERROR.NOT_FOUND;
    },
};

// TODO: not tested
/** Next.js Serverless Functions */
export type NextAdapter = (req: {
    body: Update;
    headers: Record<string, string | string[] | undefined>;
    url?: string; // optional bacause of IncomingMessage from node http
}, res: {
    end: (cb?: () => void) => typeof res;
    status: (code: number) => typeof res;
    // deno-lint-ignore no-explicit-any
    json: (json: string) => any;
    // deno-lint-ignore no-explicit-any
    send: (json: string) => any;
}) => void;
const nextJs: FrameworkAdapter<NextAdapter> = {
    receive(req, _res) {
        return {
            path: () => new URL(req.url ?? "").pathname,
            header: (name) => req.headers[name]?.at(0),
            update: () => Promise.resolve(req.body),
        };
    },
    ok: (_req, res) => res.end(),
    success: (json, _req, res) => res.status(200).json(json),
    badRequest: (_req, res) => res.status(400).send(ERROR.BAD_REQUEST),
    unauthorized: (_req, res) => res.status(401).send(ERROR.WRONG_TOKEN),
    notFound: (_req, res) => res.status(404).send(ERROR.NOT_FOUND),
};

// TODO: not tested
/** nhttp web framework */
export type NHttpAdapter = (rev: {
    body: unknown;
    headers: {
        get: (header: string) => string | null;
    };
    path: string;
    response: {
        sendStatus: (status: number) => void;
        status: (status: number) => {
            send: (json: string) => void;
        };
    };
}) => void;
const nhttp: FrameworkAdapter<NHttpAdapter> = {
    receive(rev) {
        return {
            path: () => rev.path,
            header: (name) => rev.headers.get(name),
            update: () => Promise.resolve(rev.body as Update),
        };
    },
    ok: ({ response }) => response.sendStatus(200),
    success: (json, { response }) => response.status(200).send(json),
    badRequest: ({ response }) => response.status(400).send(ERROR.BAD_REQUEST),
    unauthorized: ({ response }) =>
        response.status(401).send(ERROR.BAD_REQUEST),
    notFound: ({ response }) => response.status(404).send(ERROR.BAD_REQUEST),
};

// TODO: not tested
// /** oak web framework */
export type OakAdapter = (ctx: {
    request: {
        body: {
            json: () => Promise<Update>;
        };
        headers: {
            get: (header: string) => string | null;
        };
        url: URL;
    };
    response: {
        status: number;
        type: string | undefined;
        body: unknown;
    };
}) => unknown;
const oak: FrameworkAdapter<OakAdapter> = {
    receive({ request }) {
        return {
            path: () => request.url.pathname,
            header: request.headers.get,
            update: request.body.json,
        };
    },
    ok: ({ response }) => response.status = 200,
    success: (json, { response }) => {
        response.status = 200;
        response.type = "json";
        response.body = json;
    },
    badRequest: ({ response }) => {
        response.status = 400;
        response.body = ERROR.BAD_REQUEST;
    },
    unauthorized: ({ response }) => {
        response.status = 401;
        response.body = ERROR.WRONG_TOKEN;
    },
    notFound: ({ response }) => {
        response.status = 404;
        response.body = ERROR.NOT_FOUND;
    },
};

// TODO: not tested
// /** Deno.serve */
export type ServeHttpAdapter = (
    requestEvent: {
        request: Request;
        respondWith: (response: Response) => void;
    },
) => void;
const serveHttp: FrameworkAdapter<ServeHttpAdapter> = {
    receive({ request }) {
        return {
            path: () => new URL(request.url).pathname,
            header: (name) => request.headers.get(name),
            update: request.json,
        };
    },
    ok: ({ respondWith }) => respondWith(ok()),
    success: (json: string, { respondWith }) => respondWith(okJson(json)),
    badRequest: ({ respondWith }) => respondWith(badRequest()),
    unauthorized: ({ respondWith }) => respondWith(unauthorized()),
    notFound: ({ respondWith }) => respondWith(notFound()),
};

// });

// TODO: not tested
/** std/http web server */
export type StdHttpAdapter = (req: Request) => Response;
const stdHttp: FrameworkAdapter<StdHttpAdapter> = {
    receive(req) {
        return {
            path: () => new URL(req.url).pathname,
            header: (name) => req.headers.get(name),
            update: req.json,
        };
    },
    ok,
    success: okJson,
    badRequest,
    unauthorized,
    notFound,
};

// TODO: not tested
/** Sveltekit Serverless Functions */
export type SveltekitAdapter = (
    { request }: { request: Request },
) => Response;
const sveltekit: FrameworkAdapter<SveltekitAdapter> = {
    receive({ request }) {
        return {
            path: () => new URL(request.url).pathname,
            header: (name) => request.headers.get(name),
            update: request.json,
        };
    },
    ok,
    success: okJson,
    badRequest,
    unauthorized,
    notFound,
};

// TODO: not tested
/** worktop Cloudflare workers framework */
export type WorktopAdapter = (req: {
    json: () => Promise<Update>;
    headers: {
        get: (header: string) => string | null;
    };
    path: string;
}, res: {
    end: (data: BodyInit | null) => void;
    send: (status: number, json: string) => void;
}) => void;
const worktop: FrameworkAdapter<WorktopAdapter> = {
    receive(req, _res) {
        return {
            path: () => req.path,
            header: req.headers.get,
            update: req.json,
        };
    },
    ok: (_req, res) => res.end(null),
    success: (json, _req, res) => res.send(200, json),
    badRequest: (_req, res) => res.send(400, ERROR.BAD_REQUEST),
    unauthorized: (_req, res) => res.send(401, ERROR.WRONG_TOKEN),
    notFound: (_req, res) => res.send(404, ERROR.NOT_FOUND),
};

// Please open a pull request if you want to add another adapter
export const adapters = {
    awsLambda,
    awsLambdaAsync,
    azure,
    bun,
    cloudflare,
    cloudflareModule,
    express,
    fastify,
    hono,
    http,
    https: http,
    koa,
    nextJs,
    nhttp,
    oak,
    serveHttp,
    stdHttp,
    sveltekit,
    worktop,
};
