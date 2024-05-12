import { type Update } from "../types.ts";

const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token";
const SECRET_HEADER_LOWERCASE = SECRET_HEADER.toLowerCase();
const WRONG_TOKEN_ERROR = "secret token is wrong";

const ok = () => new Response(null, { status: 200 });
const okJson = (json: string) =>
    new Response(json, {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
const unauthorized = () =>
    new Response('"unauthorized"', {
        status: 401,
        statusText: WRONG_TOKEN_ERROR,
    });

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */
export type SupportedFrameworks = keyof typeof adapters;

/**
 * Abstraction over a request-response cycle, providing access to the update, as
 * well as a mechanism for responding to the request and to end it.
 */
export interface ReqResHandler<T = undefined> {
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
    handlerReturn: T;
}

/**
 * Middleware for a web framework. Creates a request-response handler for a
 * request. The handler will be used to integrate with the compatible framework.
 */
// deno-lint-ignore no-explicit-any
export type FrameworkAdapter = (...args: any[]) => ReqResHandler<any>;

export type LambdaAdapter = (
    event: {
        body?: string;
        headers: Record<string, string | undefined>;
    },
    _context: unknown,
    callback: (
        arg0: unknown,
        arg1: Record<string, unknown>,
    ) => Promise<unknown>,
) => ReqResHandler;

export type LambdaAsyncAdapter = (
    event: {
        body?: string;
        headers: Record<string, string | undefined>;
    },
    _context: unknown,
) => ReqResHandler<Promise<undefined>>;

export type AzureAdapter = (context: {
    res: {
        status: number;
        body: string;
        headers?: Record<string, string>;
        set?: (key: string, value: string) => void;
        send?: {
            (body: unknown): void;
            (status: number, body: unknown): void;
        };
    };
}, request: {
    body: Update;
}) => ReqResHandler;

export type CloudflareAdapter = (event: {
    request: Request;
    respondWith: (response: Promise<Response>) => void;
}) => ReqResHandler;

export type CloudflareModuleAdapter = (
    request: Request,
) => ReqResHandler<Promise<Response>>;

export type ExpressAdapter = (req: {
    body: Update;
    header: (header: string) => string | undefined;
}, res: {
    end: (cb?: () => void) => typeof res;
    set: (field: string, value?: string | string[]) => typeof res;
    send: (json: string) => typeof res;
    status: (code: number) => typeof res;
}) => ReqResHandler;

export type FastifyAdapter = (request: {
    body: Update;
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
}) => ReqResHandler;

export type HonoAdapter = (c: {
    req: {
        json: <T>() => Promise<T>;
        header: (header: string) => string | undefined;
    };
    // deno-lint-ignore no-explicit-any
    body: (...args: any) => Response;
    // deno-lint-ignore no-explicit-any
    status: (status: any) => void;
    json: (json: string) => Response;
}) => ReqResHandler<Promise<Response>>;

export type HttpAdapter = (req: {
    headers: Record<string, string>;
    on: (event: string, listener: (chunk: unknown) => void) => typeof req;
    once: (event: string, listener: () => void) => typeof req;
    json: () => Promise<Update>;
}, res: {
    writeHead: {
        (status: number): typeof res;
        (status: number, headers: Record<string, string>): typeof res;
    };
    end: (json?: string) => void;
}) => ReqResHandler;

export type KoaAdapter = (ctx: {
    get: (header: string) => string | undefined;
    set: (key: string, value: string) => void;
    body: string;
    status: number;
    response: {
        body: unknown;
        status: number;
    };
    request: {
        body: Update;
    };
}) => ReqResHandler;

export type NextAdapter = (request: {
    body: Update;
    headers: Record<string, string>;
}, response: {
    end: () => void;
    status: (code: number) => typeof response;
    json: (json: string) => typeof response;
    send: (json: string) => typeof response;
}) => ReqResHandler;

export type NHttpAdapter = (rev: {
    // deno-lint-ignore no-explicit-any
    body: any;
    headers: {
        get: (header: string) => string | null;
    };
    response: {
        sendStatus: (status: number) => void;
        status: (status: number) => {
            send: (json: string) => void;
        };
    };
}) => ReqResHandler;

export type OakAdapter = (ctx: {
    request: {
        body: {
            json: () => Promise<Update>;
        };
        headers: {
            get: (header: string) => string | null;
        };
    };
    response: {
        status: number;
        type: string | undefined;
        body: unknown;
    };
}) => ReqResHandler;

export type ServeHttpAdapter = (requestEvent: {
    request: Request;
    respondWith: (response: Response) => void;
}) => ReqResHandler;

export type StdHttpAdapter = (
    req: Request,
) => ReqResHandler<Promise<unknown>>;

export type SveltekitAdapter = (
    { request }: { request: Request },
) => ReqResHandler<Promise<unknown>>;

export type WorktopAdapter = (req: {
    body: {
        json: () => Promise<Update>;
    };
    headers: {
        get: (header: string) => string | undefined;
    };
}, res: {
    end: () => void;
    send: (status: number, json: string) => void;
}) => ReqResHandler;

/** AWS lambda serverless functions */
const awsLambda: LambdaAdapter = (event, _context, callback) => ({
    update: JSON.parse(event.body ?? "{}"),
    header: event.headers[SECRET_HEADER],
    end: () => callback(null, { statusCode: 200 }),
    respond: (json) =>
        callback(null, {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: json,
        }),
    unauthorized: () => callback(null, { statusCode: 401 }),
    handlerReturn: undefined,
});

/** AWS lambda async/await serverless functions */
const awsLambdaAsync: LambdaAsyncAdapter = (event, _context) => {
    // deno-lint-ignore no-explicit-any
    let resolveResponse: (response: any) => void;

    return {
        update: JSON.parse(event.body ?? "{}"),
        header: event.headers[SECRET_HEADER],
        end: () => resolveResponse({ statusCode: 200 }),
        respond: (json) =>
            resolveResponse({
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: json,
            }),
        unauthorized: () => resolveResponse({ statusCode: 401 }),
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** Azure Functions */
const azure: AzureAdapter = (context, request) => ({
    update: Promise.resolve(request.body),
    header: context.res.headers?.[SECRET_HEADER],
    end: () => (context.res = {
        status: 200,
        body: "",
    }),
    respond: (json) => {
        context.res.set?.("Content-Type", "application/json");
        context.res.send?.(json);
    },
    unauthorized: () => {
        context.res.send?.(401, WRONG_TOKEN_ERROR);
    },
    handlerReturn: undefined,
});

/** Native CloudFlare workers (service worker) */
const cloudflare: CloudflareAdapter = (event) => {
    let resolveResponse: (response: Response) => void;
    event.respondWith(
        new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        }),
    );
    return {
        update: event.request.json(),
        header: event.request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(ok());
        },
        respond: (json) => {
            resolveResponse(okJson(json));
        },
        unauthorized: () => {
            resolveResponse(unauthorized());
        },
        handlerReturn: undefined,
    };
};

/** Native CloudFlare workers (module worker) */
const cloudflareModule: CloudflareModuleAdapter = (request) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: request.json(),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(ok());
        },
        respond: (json) => {
            resolveResponse(okJson(json));
        },
        unauthorized: () => {
            resolveResponse(unauthorized());
        },
        handlerReturn: new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** express web framework */
const express: ExpressAdapter = (req, res) => ({
    update: Promise.resolve(req.body),
    header: req.header(SECRET_HEADER),
    end: () => res.end(),
    respond: (json) => {
        res.set("Content-Type", "application/json");
        res.send(json);
    },
    unauthorized: () => {
        res.status(401).send(WRONG_TOKEN_ERROR);
    },
    handlerReturn: undefined,
});

/** fastify web framework */
const fastify: FastifyAdapter = (request, reply) => ({
    update: Promise.resolve(request.body),
    header: request.headers[SECRET_HEADER_LOWERCASE],
    end: () => reply.status(200).send(),
    respond: (json) =>
        reply.headers({ "Content-Type": "application/json" }).send(json),
    unauthorized: () => reply.code(401).send(WRONG_TOKEN_ERROR),
    handlerReturn: undefined,
});

/** hono web framework */
const hono: HonoAdapter = (c) => {
    let resolveResponse: (response: Response) => void;
    return {
        update: c.req.json(),
        header: c.req.header(SECRET_HEADER),
        end: () => {
            resolveResponse(c.body());
        },
        respond: (json) => {
            resolveResponse(c.json(json));
        },
        unauthorized: () => {
            c.status(401);
            resolveResponse(c.body());
        },
        handlerReturn: new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** Node.js native 'http' and 'https' modules */
const http: HttpAdapter = (req, res) => {
    const secretHeaderFromRequest = req.headers[SECRET_HEADER_LOWERCASE];
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
        unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
        handlerReturn: undefined,
    };
};

/** koa web framework */
const koa: KoaAdapter = (ctx) => ({
    update: Promise.resolve(ctx.request.body),
    header: ctx.get(SECRET_HEADER) || undefined,
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
    handlerReturn: undefined,
});

/** Next.js Serverless Functions */
const nextJs: NextAdapter = (request, response) => ({
    update: Promise.resolve(request.body),
    header: request.headers[SECRET_HEADER_LOWERCASE],
    end: () => response.end(),
    respond: (json) => response.status(200).json(json),
    unauthorized: () => response.status(401).send(WRONG_TOKEN_ERROR),
    handlerReturn: undefined,
});

/** nhttp web framework */
const nhttp: NHttpAdapter = (rev) => ({
    update: Promise.resolve(rev.body),
    header: rev.headers.get(SECRET_HEADER) || undefined,
    end: () => rev.response.sendStatus(200),
    respond: (json) => rev.response.status(200).send(json),
    unauthorized: () => rev.response.status(401).send(WRONG_TOKEN_ERROR),
    handlerReturn: undefined,
});

/** oak web framework */
const oak: OakAdapter = (ctx) => ({
    update: ctx.request.body.json(),
    header: ctx.request.headers.get(SECRET_HEADER) || undefined,
    end: () => {
        ctx.response.status = 200;
    },
    respond: (json) => {
        ctx.response.type = "json";
        ctx.response.body = json;
    },
    unauthorized: () => {
        ctx.response.status = 401;
    },
    handlerReturn: undefined,
});

/** Deno.serve */
const serveHttp: ServeHttpAdapter = (requestEvent) => ({
    update: requestEvent.request.json(),
    header: requestEvent.request.headers.get(SECRET_HEADER) || undefined,
    end: () => requestEvent.respondWith(ok()),
    respond: (json) => requestEvent.respondWith(okJson(json)),
    unauthorized: () => requestEvent.respondWith(unauthorized()),
    handlerReturn: undefined,
});

/** std/http web server */
const stdHttp: StdHttpAdapter = (req) => {
    let resolveResponse: (response: Response) => void;
    return {
        update: req.json(),
        header: req.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse) resolveResponse(ok());
        },
        respond: (json) => {
            if (resolveResponse) resolveResponse(okJson(json));
        },
        unauthorized: () => {
            if (resolveResponse) resolveResponse(unauthorized());
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** Sveltekit Serverless Functions */
const sveltekit: SveltekitAdapter = ({ request }) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: Promise.resolve(request.json()),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse) resolveResponse(ok());
        },
        respond: (json) => {
            if (resolveResponse) resolveResponse(okJson(json));
        },
        unauthorized: () => {
            if (resolveResponse) resolveResponse(unauthorized());
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** worktop CloudFlare workers framework */
const worktop: WorktopAdapter = (req, res) => ({
    update: Promise.resolve(req.body.json()),
    header: req.headers.get(SECRET_HEADER),
    end: () => res.end(),
    respond: (json) => res.send(200, json),
    unauthorized: () => res.send(401, WRONG_TOKEN_ERROR),
    handlerReturn: undefined,
});

// Please open a pull request if you want to add another adapter
export const adapters = {
    "aws-lambda": awsLambda,
    "aws-lambda-async": awsLambdaAsync,
    azure,
    cloudflare,
    "cloudflare-mod": cloudflareModule,
    express,
    fastify,
    hono,
    http,
    https: http,
    koa,
    "next-js": nextJs,
    nhttp,
    oak,
    serveHttp,
    "std/http": stdHttp,
    sveltekit,
    worktop,
};
