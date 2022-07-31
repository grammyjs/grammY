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

export const adapters = {
    express,
    koa,
    fastify,
};
