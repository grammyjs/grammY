import { type Update } from "../types.ts";

// deno-lint-ignore-file no-explicit-any
export const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token";

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */
export type SupportedFrameworks = keyof typeof adapters;

/**
 * Abstraction over a request-response cycle, providing access to the update, as
 * well as a mechanism for responding to the request and to end it.
 */
export interface ReqResHandler {
    /**
     * The update object sent from Telegram, usually resolves the request's JSON
     * body
     */
    update: Promise<Update>;
    /**
     * X-Telegram-Bot-Api-Secret-Token header of the request, or undefined if
     * not present
     */
    header?: string;
    /**
     * Ends the request immediately without body, called after every request
     * unless a webhook reply was performed
     */
    end?: () => void;
    /**
     * Sends the specified JSON as a payload in the body, used for webhook
     * replies
     */
    respond: (json: string) => unknown | Promise<unknown>;
    /**
     * Responds that the request is unauthorized due to mismatching
     * X-Telegram-Bot-Api-Secret-Token headers
     */
    unauthorized: () => unknown | Promise<unknown>;
    /**
     * Some frameworks (e.g. Deno's std/http `listenAndServe`) assume that
     * handler returns something
     */
    // deno-lint-ignore no-explicit-any
    handlerReturn?: any;
}
/**
 * Middleware for a web framework. Creates a request-response handler for a
 * request. The handler will be used to integrate with the compatible framework.
 */
// deno-lint-ignore no-explicit-any
export type FrameworkAdapter = (...args: any[]) => ReqResHandler;

/** express web framework */
const express: FrameworkAdapter = (req, res) => ({
    update: Promise.resolve(req.body),
    header: req.header(SECRET_HEADER),
    end: () => res.end(),
    respond: (json) => {
        res.set("Content-Type", "application/json");
        res.send(json);
    },
    unauthorized: () => {
        res.send(401, "secret token is wrong");
    },
});

/** koa web framework */
const koa: FrameworkAdapter = (ctx) => ({
    update: Promise.resolve(ctx.request.body),
    header: ctx.get(SECRET_HEADER),
    end: () => {
        ctx.body = "";
    },
    respond: (json) => {
        ctx.set("Content-Type", "application/json");
        ctx.response.body = json;
    },
    unauthorized: () => {
        ctx.status = 401;
    },
});

/** fastify web framework */
const fastify: FrameworkAdapter = (req, reply) => ({
    update: Promise.resolve(req.body),
    header: req.headers[SECRET_HEADER.toLowerCase()],
    end: () => reply.status(200).send(),
    respond: (json) => reply.send(json),
    unauthorized: () => reply.code(401).send("secret token is wrong"),
});

const serveHttp: FrameworkAdapter = (requestEvent) => ({
    update: requestEvent.request.json(),
    header: requestEvent.request.headers.get(SECRET_HEADER) || undefined,
    end: () => requestEvent.respondWith(new Response(null, { status: 200 })),
    respond: (json) =>
        requestEvent.respondWith(
            new Response(json, {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        ),
    unauthorized: () =>
        requestEvent.respondWith(
            new Response('"unauthorized"', {
                status: 401,
                statusText: "secret token is wrong",
            }),
        ),
});

/** std/http web server */
const stdHttp: FrameworkAdapter = (req: Request) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: req.json(),
        header: req.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse) {
                resolveResponse(new Response(null, { status: 200 }));
            }
        },
        respond: (json) => {
            if (resolveResponse) {
                const res = new Response(json, {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
                resolveResponse(res);
            }
        },
        unauthorized: () => {
            if (resolveResponse) {
                const res = new Response('"unauthorized"', {
                    status: 401,
                    statusText: "secret token is wrong",
                });
                resolveResponse(res);
            }
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** oak web framework */
const oak: FrameworkAdapter = (ctx) => ({
    update: ctx.request.body({ type: "json" }).value,
    header: ctx.request.headers.get(SECRET_HEADER) || undefined,
    end: () => (ctx.response.status = 200),
    respond: (json) => {
        ctx.response.type = "json";
        ctx.response.body = json;
    },
    unauthorized: () => {
        ctx.response.status = 401;
    },
});

/** Node.js native 'http' and 'https' modules */
const http: FrameworkAdapter = (req, res) => {
    const secretHeaderFromRequest = req.headers[SECRET_HEADER.toLowerCase()];
    return {
        update: new Promise((resolve, reject) => {
            // deno-lint-ignore no-explicit-any
            type Chunk = any;
            const chunks: Chunk[] = [];
            req.on("data", (chunk: Chunk) => chunks.push(chunk))
                .once("end", () => {
                    // @ts-ignore `Buffer` is Node-only
                    const raw = Buffer.concat(chunks).toString("utf-8");
                    resolve(JSON.parse(raw));
                })
                .once("error", reject);
        }),
        header: Array.isArray(secretHeaderFromRequest)
            ? secretHeaderFromRequest[0]
            : secretHeaderFromRequest,
        end: () => res.end(),
        respond: (json) =>
            res
                .writeHead(200, { "Content-Type": "application/json" })
                .end(json),
        unauthorized: () => res.writeHead(401).end("secret token is wrong"),
    };
};

/** AWS lambda serverless functions */
const awsLambda: FrameworkAdapter = (event, _context, callback) => ({
    update: JSON.parse(event.body),
    header: event.headers[SECRET_HEADER],
    end: () => callback(null, { statusCode: 200 }),
    respond: (json) => callback(null, { statusCode: 200, body: json }),
    unauthorized: () => callback(null, { statusCode: 401 }),
});

/** Azure Functions */
const azure: FrameworkAdapter = (context, req) => ({
    update: Promise.resolve(req.body),
    header: context.res.headers[SECRET_HEADER],
    end: () => (context.res = {
        status: 200,
        body: "",
    }),
    respond: (json) => {
        context.res.set("Content-Type", "application/json");
        context.res.send(json);
    },
    unauthorized: () => {
        context.res.send(401, "secret token is wrong");
    },
});

/** Next.js Serverless Functions */
const nextJs: FrameworkAdapter = (req, res) => ({
    update: Promise.resolve(req.body),
    header: req.headers[SECRET_HEADER],
    end: () => res.end(),
    respond: (json) => res.status(200).json(json),
    unauthorized: () => res.status(401).send("secret token is wrong"),
});

/** Sveltekit Serverless Functions */
const sveltekit: FrameworkAdapter = ({ request }: { request: Request }) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: Promise.resolve(request.json()),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse) {
                resolveResponse(new Response(null, { status: 200 }));
            }
        },
        respond: (json) => {
            if (resolveResponse) {
                const res = new Response(json, {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
                resolveResponse(res);
            }
        },
        unauthorized: () => {
            if (resolveResponse) {
                const res = new Response('"unauthorized"', {
                    status: 401,
                    statusText: "secret token is wrong",
                });
                resolveResponse(res);
            }
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** Native CloudFlare workers (service worker) */
const cloudflare: FrameworkAdapter = (event: {
    request: Request;
    respondWith: (res: Promise<Response>) => void;
}) => {
    let resolveResponse: (res: Response) => void;
    event.respondWith(
        new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        }),
    );
    return {
        update: event.request.json(),
        header: event.request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(new Response(null, { status: 200 }));
        },
        respond: (json) => {
            const res = new Response(json, {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
            resolveResponse(res);
        },
        unauthorized: () => {
            const res = new Response('"unauthorized"', {
                status: 401,
                statusText: "secret token is wrong",
            });
            resolveResponse(res);
        },
    };
};

/** Native CloudFlare workers (module worker) */
const cloudflareModule: FrameworkAdapter = (request: Request) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: request.json(),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(new Response(null, { status: 200 }));
        },
        respond: (json) => {
            const res = new Response(json, {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
            resolveResponse(res);
        },
        unauthorized: () => {
            const res = new Response('"unauthorized"', {
                status: 401,
                statusText: "secret token is wrong",
            });
            resolveResponse(res);
        },
        handlerReturn: new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** hono web framework */
const hono: FrameworkAdapter = (ctx) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: ctx.req.json(),
        header: ctx.req.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(ctx.body());
        },
        respond: (json) => {
            ctx.header('Content-Type", "application/json');
            resolveResponse(ctx.body(json));
        },
        unauthorized: () => {
            ctx.status(401);
            ctx.statusText("secret token is wrong");
            resolveResponse(ctx.body());
        },
        handlerReturn: new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** worktop CloudFlare workers framework */
const worktop: FrameworkAdapter = (req, res) => ({
    update: Promise.resolve(req.body.json()),
    header: req.headers.get(SECRET_HEADER),
    end: () => res.end(),
    respond: (json) => res.send(200, json),
    unauthorized: () => res.send(401, "secret token is wrong"),
});

// Please open a PR if you want to add another adapter
export const adapters = {
    express,
    koa,
    fastify,
    serveHttp,
    "std/http": stdHttp,
    oak,
    http,
    https: http,
    "aws-lambda": awsLambda,
    azure,
    "next-js": nextJs,
    sveltekit,
    cloudflare,
    "cloudflare-mod": cloudflareModule,
    hono,
    worktop,
};
