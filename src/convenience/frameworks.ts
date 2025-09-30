import type { Update } from "../types.ts";

type MaybePromise<T> = T | Promise<T>;

/**
 * Abstraction over a request-response cycle, providing access to the update, as
 * well as a mechanism for responding to the request and to end it.
 */
export interface ReqResHandler<T = void> {
    /**
     * The update object sent from Telegram, usually resolves the request's JSON
     * body
     */
    update(): MaybePromise<Update>;
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
     * Responds that the request is bad due to the body payload not being
     * parsable or valid Update object
     */
    badRequest: () => unknown | Promise<unknown>;
    /**
     * Some frameworks (e.g. Deno's std/http `listenAndServe`) assume that
     * handler returns something
     */
    handlerReturn?: Promise<T>;
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
) => ReqResHandler;

export type AzureAdapter = (context: {
    res?: {
        // deno-lint-ignore no-explicit-any
        [key: string]: any;
    };
}, request: { body?: unknown }) => ReqResHandler;
export type AzureAdapterV4 = (
    request: {
        headers: { get(name: string): string | null };
        json(): Promise<unknown>;
    },
) => ReqResHandler<{ status: number; body?: string } | { jsonBody: string }>;

export type BunAdapter = (request: {
    headers: Headers;
    json: () => Promise<Update>;
}) => ReqResHandler<Response>;

export type CloudflareAdapter = (event: {
    request: Request;
    respondWith: (response: Promise<Response>) => void;
}) => ReqResHandler;

export type CloudflareModuleAdapter = (
    request: Request,
) => ReqResHandler<Response>;

export type ElysiaAdapter = (ctx: {
    body: Update;
    headers: Record<string, string | undefined>;
    set: {
        headers: Record<string, string>;
        status: number;
    };
}) => ReqResHandler<string>;

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
}) => ReqResHandler;

export type HonoAdapter = (c: {
    req: {
        json: <T>() => Promise<T>;
        header: (header: string) => string | undefined;
    };
    body(data: string): Response;
    body(data: null, status: 204): Response;
    // deno-lint-ignore no-explicit-any
    status: (status: any) => void;
    json: (json: string) => Response;
}) => ReqResHandler<Response>;

export type HttpAdapter = (req: {
    headers: Record<string, string | string[] | undefined>;
    on: (event: string, listener: (chunk: unknown) => void) => typeof req;
    once: (event: string, listener: () => void) => typeof req;
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
    status: number;
    body: string;
    request: {
        body?: unknown;
    };
    response: {
        body: unknown;
        status: number;
    };
}) => ReqResHandler;

export type NextAdapter = (req: {
    body: Update;
    headers: Record<string, string | string[] | undefined>;
}, res: {
    end: (cb?: () => void) => typeof res;
    status: (code: number) => typeof res;
    // deno-lint-ignore no-explicit-any
    json: (json: string) => any;
    // deno-lint-ignore no-explicit-any
    send: (json: string) => any;
}) => ReqResHandler;

export type NHttpAdapter = (rev: {
    body: unknown;
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

export type ServeHttpAdapter = (
    requestEvent: {
        request: Request;
        respondWith: (response: Response) => void;
    },
) => ReqResHandler;

export type StdHttpAdapter = (
    req: Request,
) => ReqResHandler<Response>;

export type SveltekitAdapter = (
    { request }: { request: Request },
) => ReqResHandler<unknown>;

export type WorktopAdapter = (req: {
    json: () => Promise<Update>;
    headers: {
        get: (header: string) => string | null;
    };
}, res: {
    end: (data: BodyInit | null) => void;
    send: (status: number, json: string) => void;
}) => ReqResHandler;

export function makeAdapters() {
    const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token";
    const SECRET_HEADER_LOWERCASE = SECRET_HEADER.toLowerCase();
    const WRONG_TOKEN_ERROR = "secret token is wrong";
    const BAD_REQUEST_ERROR = "unable to parse request body";

    const ok = () => new Response(null, { status: 200 });
    const okJson = (json: string) =>
        new Response(json, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    const unauthorized = () => new Response(WRONG_TOKEN_ERROR, { status: 401 });
    const badRequest = () => new Response(BAD_REQUEST_ERROR, { status: 400 });
    const empty = () => ({} as Update);

    const callback: FrameworkAdapter = (
        update: Update,
        callback: (json: string) => unknown,
        header: string,
        unauthorized = () => callback(WRONG_TOKEN_ERROR),
        badRequest = () => callback(BAD_REQUEST_ERROR),
    ) => ({
        update: () => update,
        respond: callback,
        header,
        unauthorized,
        badRequest,
    });

    /** AWS lambda serverless functions */
    const awsLambda: LambdaAdapter = (event, _context, callback) => ({
        // TODO: add safe parse workaround
        update: () => JSON.parse(event.body ?? "{}"),
        header: event.headers[SECRET_HEADER],
        end: () => callback(null, { statusCode: 200 }),
        respond: (json) =>
            callback(null, {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: json,
            }),
        unauthorized: () => callback(null, { statusCode: 401 }),
        badRequest: () => callback(null, { statusCode: 400 }),
    });

    /** AWS lambda async/await serverless functions */
    const awsLambdaAsync: LambdaAsyncAdapter = (event, _context) => {
        // deno-lint-ignore no-explicit-any
        let resolveResponse: (response: any) => void;

        return {
            // TODO: add safe parse workaround
            update: () => JSON.parse(event.body ?? "{}"),
            header: event.headers[SECRET_HEADER],
            end: () => resolveResponse({ statusCode: 200 }),
            respond: (json) =>
                resolveResponse({
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: json,
                }),
            unauthorized: () => resolveResponse({ statusCode: 401 }),
            badRequest: () => resolveResponse({ statusCode: 400 }),
            handlerReturn: new Promise<void>((res) => resolveResponse = res),
        };
    };

    /** Azure Functions v3 and v4 */
    const azure: AzureAdapter = (context, request) => ({
        update: () => request.body as Update,
        header: context.res?.headers?.[SECRET_HEADER],
        end: () => (context.res = {
            status: 200,
            body: "",
        }),
        respond: (json) => {
            context.res?.set?.("Content-Type", "application/json");
            context.res?.send?.(json);
        },
        unauthorized: () => {
            context.res?.send?.(401, WRONG_TOKEN_ERROR);
        },
        badRequest: () => {
            context.res?.send?.(400, BAD_REQUEST_ERROR);
        },
    });
    const azureV4: AzureAdapterV4 = (request) => {
        type Res = NonNullable<
            Awaited<ReturnType<AzureAdapterV4>["handlerReturn"]>
        >;
        let resolveResponse: (response: Res) => void;
        return {
            update: () => request.json() as Promise<Update>,
            header: request.headers.get(SECRET_HEADER) || undefined,
            end: () => resolveResponse({ status: 204 }),
            respond: (json) => resolveResponse({ jsonBody: json }),
            unauthorized: () =>
                resolveResponse({ status: 401, body: WRONG_TOKEN_ERROR }),
            badRequest: () =>
                resolveResponse({ status: 400, body: BAD_REQUEST_ERROR }),
            handlerReturn: new Promise<Res>((resolve) =>
                resolveResponse = resolve
            ),
        };
    };

    /** Bun.serve */
    const bun: BunAdapter = (request) => {
        let resolveResponse: (response: Response) => void;
        return {
            update: () => request.json().catch(empty) as Promise<Update>,
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
            badRequest: () => {
                resolveResponse(badRequest());
            },
            handlerReturn: new Promise<Response>((res) =>
                resolveResponse = res
            ),
        };
    };

    /** Native CloudFlare workers (service worker) */
    const cloudflare: CloudflareAdapter = (event) => {
        let resolveResponse: (response: Response) => void;
        event.respondWith(
            new Promise<Response>((resolve) => {
                resolveResponse = resolve;
            }),
        );
        return {
            update: () => event.request.json().catch(empty) as Promise<Update>,
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
            badRequest: () => {
                resolveResponse(badRequest());
            },
        };
    };

    /** Native CloudFlare workers (module worker) */
    const cloudflareModule: CloudflareModuleAdapter = (request) => {
        let resolveResponse: (res: Response) => void;
        return {
            update: () => request.json().catch(empty) as Promise<Update>,
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
            badRequest: () => {
                resolveResponse(badRequest());
            },
            handlerReturn: new Promise<Response>((res) =>
                resolveResponse = res
            ),
        };
    };

    /** express web framework */
    const express: ExpressAdapter = (req, res) => ({
        update: () => req.body as Update,
        header: req.header(SECRET_HEADER),
        end: () => res.end(),
        respond: (json) => {
            res.set("Content-Type", "application/json");
            res.send(json);
        },
        unauthorized: () => {
            res.status(401).send(WRONG_TOKEN_ERROR);
        },
        badRequest: () => {
            res.status(400).send(BAD_REQUEST_ERROR);
        },
    });

    /** fastify web framework */
    const fastify: FastifyAdapter = (request, reply) => ({
        update: () => request.body as Update,
        header: request.headers[SECRET_HEADER_LOWERCASE],
        end: () => reply.send(""),
        respond: (json) =>
            reply.headers({ "Content-Type": "application/json" }).send(json),
        unauthorized: () => reply.code(401).send(WRONG_TOKEN_ERROR),
        badRequest: () => reply.code(400).send(BAD_REQUEST_ERROR),
    });

    /** hono web framework */
    const hono: HonoAdapter = (c) => {
        let resolveResponse: (response: Response) => void;
        return {
            update: () => c.req.json<Update>().catch(empty),
            header: c.req.header(SECRET_HEADER),
            end: () => {
                resolveResponse(c.body(""));
            },
            respond: (json) => {
                resolveResponse(c.json(json));
            },
            unauthorized: () => {
                c.status(401);
                resolveResponse(c.body(WRONG_TOKEN_ERROR));
            },
            badRequest: () => {
                c.status(400);
                resolveResponse(c.body(BAD_REQUEST_ERROR));
            },
            handlerReturn: new Promise<Response>((res) =>
                resolveResponse = res
            ),
        };
    };

    /** Node.js native 'http' and 'https' modules */
    const http: HttpAdapter = (req, res) => {
        const secretHeaderFromRequest = req.headers[SECRET_HEADER_LOWERCASE];
        return {
            update: () =>
                new Promise((resolve, reject) => {
                    // deno-lint-ignore no-explicit-any
                    type Chunk = any;
                    const chunks: Chunk[] = [];
                    req.on("data", (chunk: Chunk) => chunks.push(chunk))
                        .once("end", () => {
                            const raw = globalThis.process.getBuiltinModule(
                                "node:buffer",
                            ).Buffer.concat(chunks).toString("utf-8");
                            resolve(JSON.parse(raw));
                        })
                        .once("error", reject);
                }).catch(empty) as Promise<Update>,
            header: Array.isArray(secretHeaderFromRequest)
                ? secretHeaderFromRequest[0]
                : secretHeaderFromRequest,
            end: () => res.end(),
            respond: (json) =>
                res
                    .writeHead(200, { "Content-Type": "application/json" })
                    .end(json),
            unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
            badRequest: () => res.writeHead(400).end(BAD_REQUEST_ERROR),
        };
    };

    /** koa web framework */
    const koa: KoaAdapter = (ctx) => ({
        update: () => ctx.request.body as Update,
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
        badRequest: () => {
            ctx.status = 400;
        },
    });

    /** Next.js Serverless Functions */
    const nextJs: NextAdapter = (request, response) => ({
        update: () => request.body as Update,
        header: request.headers[SECRET_HEADER_LOWERCASE] as string,
        end: () => response.end(),
        respond: (json) => response.status(200).json(json),
        unauthorized: () => response.status(401).send(WRONG_TOKEN_ERROR),
        badRequest: () => response.status(400).send(BAD_REQUEST_ERROR),
    });

    /** nhttp web framework */
    const nhttp: NHttpAdapter = (rev) => ({
        update: () => rev.body as Update,
        header: rev.headers.get(SECRET_HEADER) || undefined,
        end: () => rev.response.sendStatus(200),
        respond: (json) => rev.response.status(200).send(json),
        unauthorized: () => rev.response.status(401).send(WRONG_TOKEN_ERROR),
        badRequest: () => rev.response.status(400).send(BAD_REQUEST_ERROR),
    });

    /** oak web framework */
    const oak: OakAdapter = (ctx) => ({
        update: () => ctx.request.body.json().catch(empty) as Promise<Update>,
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
        badRequest: () => {
            ctx.response.status = 400;
        },
    });

    /** Deno.serve */
    const serveHttp: ServeHttpAdapter = (requestEvent) => ({
        update: () =>
            requestEvent.request.json().catch(empty) as Promise<Update>,
        header: requestEvent.request.headers.get(SECRET_HEADER) || undefined,
        end: () => requestEvent.respondWith(ok()),
        respond: (json) => requestEvent.respondWith(okJson(json)),
        unauthorized: () => requestEvent.respondWith(unauthorized()),
        badRequest: () => requestEvent.respondWith(badRequest()),
    });

    /** std/http web server */
    const stdHttp: StdHttpAdapter = (req) => {
        let resolveResponse: (response: Response) => void;
        return {
            update: () => req.json().catch(empty) as Promise<Update>,
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
            badRequest: () => {
                if (resolveResponse) resolveResponse(badRequest());
            },
            handlerReturn: new Promise<Response>((res) =>
                resolveResponse = res
            ),
        };
    };

    /** Sveltekit Serverless Functions */
    const sveltekit: SveltekitAdapter = ({ request }) => {
        let resolveResponse: (res: Response) => void;
        return {
            update: () => request.json().catch(empty) as Promise<Update>,
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
            badRequest: () => {
                if (resolveResponse) resolveResponse(badRequest());
            },
            handlerReturn: new Promise<Response>((res) =>
                resolveResponse = res
            ),
        };
    };

    /** worktop Cloudflare workers framework */
    const worktop: WorktopAdapter = (req, res) => ({
        update: () => req.json().catch(empty) as Promise<Update>,
        header: req.headers.get(SECRET_HEADER) ?? undefined,
        end: () => res.end(null),
        respond: (json) => res.send(200, json),
        unauthorized: () => res.send(401, WRONG_TOKEN_ERROR),
        badRequest: () => res.send(400, BAD_REQUEST_ERROR),
    });

    const elysia: ElysiaAdapter = (ctx) => {
        // @note upgrade target to use modern code?
        // const { promise, resolve } = Promise.withResolvers<string>();

        let resolveResponse: (result: string) => void;

        return {
            // @note technically the type shouldn't be limited to Promise, because it's fine to await plain values as well
            update: () => ctx.body as Update,
            header: ctx.headers[SECRET_HEADER_LOWERCASE],
            end() {
                resolveResponse("");
            },
            respond(json) {
                // @note since json is passed as string here, we gotta define proper content-type
                ctx.set.headers["content-type"] = "application/json";
                resolveResponse(json);
            },
            unauthorized() {
                ctx.set.status = 401;
                resolveResponse(WRONG_TOKEN_ERROR);
            },
            badRequest() {
                ctx.set.status = 400;
                resolveResponse(BAD_REQUEST_ERROR);
            },
            handlerReturn: new Promise<string>((res) => resolveResponse = res),
        };
    };

    // Please open a pull request if you want to add another adapter
    return {
        callback,

        awsLambda,
        awsLambdaAsync,
        azure,
        azureV4,
        bun,
        cloudflare,
        cloudflareModule,
        elysia,
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
}
