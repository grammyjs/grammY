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

/** AWS lambda serverless functions */
const awsLambda: FrameworkAdapter = (event, _context, callback) => ({
    update: JSON.parse(event.body),
    header: event.headers[SECRET_HEADER],
    end: () => callback(null, { statusCode: 200 }),
    respond: (json) =>
        callback(null, {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: json,
        }),
    unauthorized: () => callback(null, { statusCode: 401 }),
});

/** AWS lambda async/await serverless functions */
const awsLambdaAsync: FrameworkAdapter = (event, _context) => {
    let resolveResponse: (response: unknown) => void;

    return {
        update: JSON.parse(event.body),
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
        context.res.send(401, WRONG_TOKEN_ERROR);
    },
});

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
            resolveResponse(ok());
        },
        respond: (json) => {
            resolveResponse(okJson(json));
        },
        unauthorized: () => {
            resolveResponse(unauthorized());
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
const express: FrameworkAdapter = (req, res) => ({
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
});

/** fastify web framework */
const fastify: FrameworkAdapter = (req, reply) => ({
    update: Promise.resolve(req.body),
    header: req.headers[SECRET_HEADER_LOWERCASE],
    end: () => reply.status(200).send(),
    respond: (json) => reply.send(json),
    unauthorized: () => reply.code(401).send(WRONG_TOKEN_ERROR),
});

/** hono web framework */
const hono: FrameworkAdapter = (ctx) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: ctx.req.json(),
        header: ctx.req.header(SECRET_HEADER),
        end: () => {
            resolveResponse(ctx.body());
        },
        respond: (json) => {
            resolveResponse(ctx.json(json));
        },
        unauthorized: () => {
            ctx.status(401);
            ctx.statusText(WRONG_TOKEN_ERROR);
            resolveResponse(ctx.body());
        },
        handlerReturn: new Promise<Response>((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** Node.js native 'http' and 'https' modules */
const http: FrameworkAdapter = (req, res) => {
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
    };
};

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

/** Next.js Serverless Functions */
const nextJs: FrameworkAdapter = (req, res) => ({
    update: Promise.resolve(req.body),
    header: req.headers[SECRET_HEADER_LOWERCASE],
    end: () => res.end(),
    respond: (json) => res.status(200).json(json),
    unauthorized: () => res.status(401).send(WRONG_TOKEN_ERROR),
});

/** nhttp web framework */
const nhttp: FrameworkAdapter = (rev) => ({
    update: rev.body,
    header: rev.headers.get(SECRET_HEADER) || undefined,
    end: () => rev.response.sendStatus(200),
    respond: (json) => rev.response.status(200).send(json),
    unauthorized: () => rev.response.status(401).send(WRONG_TOKEN_ERROR),
});

/** oak web framework */
const oak: FrameworkAdapter = (ctx) => ({
    update: ctx.request.body({ type: "json" }).value,
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
});

/** Deno.serve */
const serveHttp: FrameworkAdapter = (requestEvent) => ({
    update: requestEvent.request.json(),
    header: requestEvent.request.headers.get(SECRET_HEADER) || undefined,
    end: () => requestEvent.respondWith(ok()),
    respond: (json) => requestEvent.respondWith(okJson(json)),
    unauthorized: () => requestEvent.respondWith(unauthorized()),
});

/** std/http web server */
const stdHttp: FrameworkAdapter = (req: Request) => {
    let resolveResponse: (res: Response) => void;
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
const sveltekit: FrameworkAdapter = ({ request }: { request: Request }) => {
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
const worktop: FrameworkAdapter = (req, res) => ({
    update: Promise.resolve(req.body.json()),
    header: req.headers.get(SECRET_HEADER),
    end: () => res.end(),
    respond: (json) => res.send(200, json),
    unauthorized: () => res.send(401, WRONG_TOKEN_ERROR),
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
