// deno-lint-ignore-file no-explicit-any

export const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token";

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

/** std/http web server */
const stdHttp = (req: Request) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: req.json(),
        header: req.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse) {
                resolveResponse(new Response(null, { status: 200 }));
            }
        },
        respond: (json: string) => {
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
const oak = (ctx: any) => ({
    update: ctx.request.body({ type: "json" }).value,
    header: ctx.request.headers.get(SECRET_HEADER) || undefined,
    end: () => (ctx.response.status = 200),
    respond: (json: string) => {
        ctx.response.type = "json";
        ctx.response.body = json;
    },
    unauthorized: () => {
        ctx.response.status = 401;
    },
});

export const adapters = {
    express,
    koa,
    fastify,
    "std/http": stdHttp,
    oak,
};
