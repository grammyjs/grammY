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

// export type WebhookResponseData<T = void> =
//     | { type: "end" }
//     | { type: "bad-request" }
//     | { type: "unauthorized" }
//     | { type: "success"; json?: string };

// deno-lint-ignore no-explicit-any
// export type FrameworkAdapter<F extends (...args: any[]) => any> = (
//     ...args: Parameters<F>
// ) => ReqResHandler<F>;

// deno-lint-ignore no-explicit-any
export interface WebhookRequestData<F extends (...args: any[]) => any> {
    path(): string;
    header(name: string): string | null;
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
    success(json?: string, ...args: Parameters<F>): ReturnType<F>;
}

const demo: FrameworkAdapter<(req: Request) => Response> = {
    receive(req) {
        return {
            path: () => new URL(req.url).pathname,
            header: (name) => req.headers.get(name),
            update: () => req.json(),
        };
    },
    ok,
    success: okJson,
    badRequest,
    unauthorized,
    notFound,
};

// TODO: refactor the ones below

// /** AWS lambda serverless functions */
// export type LambdaAdapter = (
//     event: {
//         body?: string;
//         headers: Record<string, string | undefined>;
//     },
//     _context: unknown,
//     callback: (
//         arg0: unknown,
//         arg1: Record<string, unknown>,
//     ) => Promise<unknown>,
// ) => ReqResHandler;
// const awsLambda: LambdaAdapter = (event, _context, callback) => ({
//     // TODO: add safe parse workaround
//     update: JSON.parse(event.body ?? "{}"),
//     header: event.headers[SECRET_HEADER],
//     end: () => callback(null, { statusCode: 200 }),
//     respond: (json) =>
//         callback(null, {
//             statusCode: 200,
//             headers: { "Content-Type": "application/json" },
//             body: json,
//         }),
//     unauthorized: () => callback(null, { statusCode: 401 }),
//     badRequest: () => callback(null, { statusCode: 400 }),
// });

// /** AWS lambda async/await serverless functions */
// export type LambdaAsyncAdapter = (
//     event: {
//         body?: string;
//         headers: Record<string, string | undefined>;
//     },
//     _context: unknown,
// ) => ReqResHandler;
// const awsLambdaAsync: LambdaAsyncAdapter = (event, _context) => {
//     // deno-lint-ignore no-explicit-any
//     let resolveResponse: (response: any) => void;

//     return {
//         // TODO: add safe parse workaround
//         update: JSON.parse(event.body ?? "{}"),
//         header: event.headers[SECRET_HEADER],
//         end: () => resolveResponse({ statusCode: 200 }),
//         respond: (json) =>
//             resolveResponse({
//                 statusCode: 200,
//                 headers: { "Content-Type": "application/json" },
//                 body: json,
//             }),
//         unauthorized: () => resolveResponse({ statusCode: 401 }),
//         badRequest: () => resolveResponse({ statusCode: 400 }),
//         handlerReturn: new Promise((resolve) => {
//             resolveResponse = resolve;
//         }),
//     };
// };

// /** Azure Functions */
// export type AzureAdapter = (request: {
//     body?: unknown;
// }, context: {
//     res?: {
//         status: number;
//         body: string;
//         headers?: Record<string, string>;
//         set?: (key: string, value: string) => void;
//         send?: {
//             (body: unknown): void;
//             (status: number, body: unknown): void;
//         };
//     };
// }) => ReqResHandler;
// const azure: AzureAdapter = (request, context) => ({
//     update: Promise.resolve(request.body as Update),
//     header: context.res?.headers?.[SECRET_HEADER],
//     end: () => (context.res = {
//         status: 200,
//         body: "",
//     }),
//     respond: (json) => {
//         context.res?.set?.("Content-Type", "application/json");
//         context.res?.send?.(json);
//     },
//     unauthorized: () => {
//         context.res?.send?.(401, WRONG_TOKEN_ERROR);
//     },
//     badRequest: () => {
//         context.res?.send?.(400, BAD_REQUEST_ERROR);
//     },
// });

// /** Bun.serve */
// export type BunAdapter = (request: {
//     headers: Headers;
//     json: () => Promise<Update>;
// }) => ReqResHandler<Response>;
// const bun: BunAdapter = (request) => {
//     let resolveResponse: (response: Response) => void;
//     return {
//         update: request.json().catch(empty),
//         header: request.headers.get(SECRET_HEADER) || undefined,
//         end: () => {
//             resolveResponse(ok());
//         },
//         respond: (json) => {
//             resolveResponse(okJson(json));
//         },
//         unauthorized: () => {
//             resolveResponse(unauthorized());
//         },
//         badRequest: () => {
//             resolveResponse(badRequest());
//         },
//         handlerReturn: new Promise<Response>((resolve) => {
//             resolveResponse = resolve;
//         }),
//     };
// };

// /** Native CloudFlare workers (service worker) */
// export type CloudflareAdapter = (event: {
//     request: Request;
//     respondWith: (response: Promise<Response>) => void;
// }) => ReqResHandler;

// const cloudflare: CloudflareAdapter = (event) => {
//     let resolveResponse: (response: Response) => void;
//     event.respondWith(
//         new Promise<Response>((resolve) => {
//             resolveResponse = resolve;
//         }),
//     );
//     return {
//         update: event.request.json().catch(empty),
//         header: event.request.headers.get(SECRET_HEADER) || undefined,
//         end: () => {
//             resolveResponse(ok());
//         },
//         respond: (json) => {
//             resolveResponse(okJson(json));
//         },
//         unauthorized: () => {
//             resolveResponse(unauthorized());
//         },
//         badRequest: () => {
//             resolveResponse(badRequest());
//         },
//     };
// };

// /** Native CloudFlare workers (module worker) */
// export type CloudflareModuleAdapter = (
//     request: Request,
// ) => ReqResHandler<Response>;
// const cloudflareModule: CloudflareModuleAdapter = (request) => {
//     let resolveResponse: (res: Response) => void;
//     return {
//         update: request.json().catch(empty),
//         header: request.headers.get(SECRET_HEADER) || undefined,
//         end: () => {
//             resolveResponse(ok());
//         },
//         respond: (json) => {
//             resolveResponse(okJson(json));
//         },
//         unauthorized: () => {
//             resolveResponse(unauthorized());
//         },
//         badRequest: () => {
//             resolveResponse(badRequest());
//         },
//         handlerReturn: new Promise<Response>((resolve) => {
//             resolveResponse = resolve;
//         }),
//     };
// };

// /** express web framework */
// export type ExpressAdapter = (req: {
//     body: Update;
//     header: (header: string) => string | undefined;
// }, res: {
//     end: (cb?: () => void) => typeof res;
//     set: (field: string, value?: string | string[]) => typeof res;
//     send: (json: string) => typeof res;
//     status: (code: number) => typeof res;
// }) => ReqResHandler;
// const express: ExpressAdapter = (req, res) => ({
//     update: Promise.resolve(req.body),
//     header: req.header(SECRET_HEADER),
//     end: () => res.end(),
//     respond: (json) => {
//         res.set("Content-Type", "application/json");
//         res.send(json);
//     },
//     unauthorized: () => {
//         res.status(401).send(WRONG_TOKEN_ERROR);
//     },
//     badRequest: () => {
//         res.status(400).send(BAD_REQUEST_ERROR);
//     },
// });

// /** fastify web framework */
// export type FastifyAdapter = (request: {
//     body: unknown;
//     // deno-lint-ignore no-explicit-any
//     headers: any;
// }, reply: {
//     status: (code: number) => typeof reply;
//     headers: (headers: Record<string, string>) => typeof reply;
//     code: (code: number) => typeof reply;
//     send: {
//         (): typeof reply;
//         (json: string): typeof reply;
//     };
// }) => ReqResHandler;
// const fastify: FastifyAdapter = (request, reply) => ({
//     update: Promise.resolve(request.body as Update),
//     header: request.headers[SECRET_HEADER_LOWERCASE],
//     end: () => reply.status(200).send(),
//     respond: (json) =>
//         reply.headers({ "Content-Type": "application/json" }).send(json),
//     unauthorized: () => reply.code(401).send(WRONG_TOKEN_ERROR),
//     badRequest: () => reply.code(400).send(BAD_REQUEST_ERROR),
// });

// /** hono web framework */
// export type HonoAdapter = (c: {
//     req: {
//         json: <T>() => Promise<T>;
//         header: (header: string) => string | undefined;
//     };
//     body(data: string): Response;
//     body(data: null, status: 204): Response;
//     // deno-lint-ignore no-explicit-any
//     status: (status: any) => void;
//     json: (json: string) => Response;
// }) => ReqResHandler<Response>;
// const hono: HonoAdapter = (c) => {
//     let resolveResponse: (response: Response) => void;
//     return {
//         update: c.req.json<Update>().catch(empty),
//         header: c.req.header(SECRET_HEADER),
//         end: () => {
//             resolveResponse(c.body(""));
//         },
//         respond: (json) => {
//             resolveResponse(c.json(json));
//         },
//         unauthorized: () => {
//             c.status(401);
//             resolveResponse(c.body(WRONG_TOKEN_ERROR));
//         },
//         badRequest: () => {
//             c.status(400);
//             resolveResponse(c.body(BAD_REQUEST_ERROR));
//         },
//         handlerReturn: new Promise<Response>((resolve) => {
//             resolveResponse = resolve;
//         }),
//     };
// };

// /** Node.js native 'http' and 'https' modules */
// export type HttpAdapter = (req: {
//     headers: Record<string, string | string[] | undefined>;
//     on: (event: string, listener: (chunk: unknown) => void) => typeof req;
//     once: (event: string, listener: () => void) => typeof req;
// }, res: {
//     writeHead: {
//         (status: number): typeof res;
//         (status: number, headers: Record<string, string>): typeof res;
//     };
//     end: (json?: string) => void;
// }) => ReqResHandler;
// const http: HttpAdapter = (req, res) => {
//     const secretHeaderFromRequest = req.headers[SECRET_HEADER_LOWERCASE];
//     return {
//         update: new Promise<Update>((resolve, reject) => {
//             // deno-lint-ignore no-explicit-any
//             type Chunk = any;
//             const chunks: Chunk[] = [];
//             req.on("data", (chunk: Chunk) => chunks.push(chunk))
//                 .once("end", () => {
//                     // @ts-ignore `Buffer` is Node-only
//                     // deno-lint-ignore no-node-globals
//                     const raw = Buffer.concat(chunks).toString("utf-8");
//                     resolve(JSON.parse(raw));
//                 })
//                 .once("error", reject);
//         }).catch(empty),
//         header: Array.isArray(secretHeaderFromRequest)
//             ? secretHeaderFromRequest[0]
//             : secretHeaderFromRequest,
//         end: () => res.end(),
//         respond: (json) =>
//             res
//                 .writeHead(200, { "Content-Type": "application/json" })
//                 .end(json),
//         unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
//         badRequest: () => res.writeHead(400).end(BAD_REQUEST_ERROR),
//     };
// };

// /** koa web framework */
// export type KoaAdapter = (ctx: {
//     get: (header: string) => string | undefined;
//     set: (key: string, value: string) => void;
//     status: number;
//     body: string;
//     request: {
//         body?: unknown;
//     };
//     response: {
//         body: unknown;
//         status: number;
//     };
// }) => ReqResHandler;
// const koa: KoaAdapter = (ctx) => ({
//     update: Promise.resolve(ctx.request.body as Update),
//     header: ctx.get(SECRET_HEADER) || undefined,
//     end: () => {
//         ctx.body = "";
//     },
//     respond: (json) => {
//         ctx.set("Content-Type", "application/json");
//         ctx.response.body = json;
//     },
//     unauthorized: () => {
//         ctx.status = 401;
//     },
//     badRequest: () => {
//         ctx.status = 400;
//     },
// });

// /** Next.js Serverless Functions */
// export type NextAdapter = (req: {
//     body: Update;
//     headers: Record<string, string | string[] | undefined>;
// }, res: {
//     end: (cb?: () => void) => typeof res;
//     status: (code: number) => typeof res;
//     // deno-lint-ignore no-explicit-any
//     json: (json: string) => any;
//     // deno-lint-ignore no-explicit-any
//     send: (json: string) => any;
// }) => ReqResHandler;
// const nextJs: NextAdapter = (request, response) => ({
//     update: Promise.resolve(request.body),
//     header: request.headers[SECRET_HEADER_LOWERCASE] as string,
//     end: () => response.end(),
//     respond: (json) => response.status(200).json(json),
//     unauthorized: () => response.status(401).send(WRONG_TOKEN_ERROR),
//     badRequest: () => response.status(400).send(BAD_REQUEST_ERROR),
// });

// /** nhttp web framework */
// export type NHttpAdapter = (rev: {
//     body: unknown;
//     headers: {
//         get: (header: string) => string | null;
//     };
//     response: {
//         sendStatus: (status: number) => void;
//         status: (status: number) => {
//             send: (json: string) => void;
//         };
//     };
// }) => ReqResHandler;
// const nhttp: NHttpAdapter = (rev) => ({
//     update: Promise.resolve(rev.body as Update),
//     header: rev.headers.get(SECRET_HEADER) || undefined,
//     end: () => rev.response.sendStatus(200),
//     respond: (json) => rev.response.status(200).send(json),
//     unauthorized: () => rev.response.status(401).send(WRONG_TOKEN_ERROR),
//     badRequest: () => rev.response.status(400).send(BAD_REQUEST_ERROR),
// });

// /** oak web framework */
// export type OakAdapter = (ctx: {
//     request: {
//         body: {
//             json: () => Promise<Update>;
//         };
//         headers: {
//             get: (header: string) => string | null;
//         };
//     };
//     response: {
//         status: number;
//         type: string | undefined;
//         body: unknown;
//     };
// }) => ReqResHandler;
// const oak: OakAdapter = (ctx) => ({
//     update: ctx.request.body.json().catch(empty),
//     header: ctx.request.headers.get(SECRET_HEADER) || undefined,
//     end: () => {
//         ctx.response.status = 200;
//     },
//     respond: (json) => {
//         ctx.response.type = "json";
//         ctx.response.body = json;
//     },
//     unauthorized: () => {
//         ctx.response.status = 401;
//     },
//     badRequest: () => {
//         ctx.response.status = 400;
//     },
// });

// /** Deno.serve */
// export type ServeHttpAdapter = (
//     requestEvent: {
//         request: Request;
//         respondWith: (response: Response) => void;
//     },
// ) => ReqResHandler;
// const serveHttp: ServeHttpAdapter = (requestEvent) => ({
//     update: requestEvent.request.json().catch(empty),
//     header: requestEvent.request.headers.get(SECRET_HEADER) || undefined,
//     end: () => requestEvent.respondWith(ok()),
//     respond: (json) => requestEvent.respondWith(okJson(json)),
//     unauthorized: () => requestEvent.respondWith(unauthorized()),
//     badRequest: () => requestEvent.respondWith(badRequest()),
// });

/** std/http web server */
export type StdHttpAdapter = (
    req: Request,
) => Response;

const stdHttp: FrameworkAdapter<StdHttpAdapter> = {
    receive(req) {
        return {
            path: () => new URL(req.url).pathname,
            header: (name) => req.headers.get(name),
            update: () => req.json(),
        };
    },
    ok,
    success: okJson,
    badRequest,
    unauthorized,
    notFound,
};

// /** Sveltekit Serverless Functions */
// export type SveltekitAdapter = (
//     { request }: { request: Request },
// ) => ReqResHandler<unknown>;
// const sveltekit: SveltekitAdapter = ({ request }) => {
//     let resolveResponse: (res: Response) => void;
//     return {
//         update: request.json().catch(empty),
//         header: request.headers.get(SECRET_HEADER) || undefined,
//         end: () => {
//             if (resolveResponse) resolveResponse(ok());
//         },
//         respond: (json) => {
//             if (resolveResponse) resolveResponse(okJson(json));
//         },
//         unauthorized: () => {
//             if (resolveResponse) resolveResponse(unauthorized());
//         },
//         badRequest: () => {
//             if (resolveResponse) resolveResponse(badRequest());
//         },
//         handlerReturn: new Promise((resolve) => {
//             resolveResponse = resolve;
//         }),
//     };
// };

// /** worktop Cloudflare workers framework */
// export type WorktopAdapter = (req: {
//     json: () => Promise<Update>;
//     headers: {
//         get: (header: string) => string | null;
//     };
// }, res: {
//     end: (data: BodyInit | null) => void;
//     send: (status: number, json: string) => void;
// }) => ReqResHandler;
// const worktop: WorktopAdapter = (req, res) => ({
//     update: req.json().catch(empty),
//     header: req.headers.get(SECRET_HEADER) ?? undefined,
//     end: () => res.end(null),
//     respond: (json) => res.send(200, json),
//     unauthorized: () => res.send(401, WRONG_TOKEN_ERROR),
//     badRequest: () => res.send(400, BAD_REQUEST_ERROR),
// });

// Please open a pull request if you want to add another adapter
export const adapters = {
    demo,
    // awsLambda,
    // awsLambdaAsync,
    // azure,
    // bun,
    // cloudflare,
    // cloudflareModule,
    // express,
    // fastify,
    // hono,
    // http,
    // https: http,
    // koa,
    // nextJs,
    // nhttp,
    // oak,
    // serveHttp,
    stdHttp,
    // sveltekit,
    // worktop,
};
