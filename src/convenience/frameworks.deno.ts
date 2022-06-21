// deno-lint-ignore-file no-explicit-any

const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token";

/** std/http web server */
const stdHttp = (req: Request) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: req.json(),
        header: req.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse) resolveResponse(new Response());
        },
        respond: (json: string) => {
            if (resolveResponse) {
                const res = new Response(json, {
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

const serveHttp = (requestEvent: Deno.RequestEvent) => ({
    update: requestEvent.request.json(),
    header: requestEvent.request.headers.get(SECRET_HEADER) || undefined,
    end: () =>
        requestEvent.respondWith(
            new Response(undefined, {
                status: 200,
            }),
        ),
    respond: (json: string) =>
        requestEvent.respondWith(
            new Response(JSON.stringify(json), { status: 200 }),
        ),
    unauthorized: () =>
        requestEvent.respondWith(
            new Response('"unauthorized"', {
                status: 401,
                statusText: "secret token is wrong",
            }),
        ),
});

// please open a PR if you want to add another
export const adapters = {
    "std/http": stdHttp,
    oak,
    serveHttp,
};
export const defaultAdapter = "oak";
