// deno-lint-ignore-file no-explicit-any

/** std/http web server */
const stdHttp = (req: Request) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: req.json(),
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
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};

/** oak web framework */
const oak = (ctx: any) => ({
    update: ctx.request.body({ type: "json" }).value,
    end: () => (ctx.response.status = 200),
    respond: (json: string) => {
        ctx.response.type = "json";
        ctx.response.body = json;
    },
});

const serveHttp = (requestEvent: Deno.RequestEvent) => ({
    update: requestEvent.request.json(),
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
});

// please open a PR if you want to add another
export const adapters = {
    "std/http": stdHttp,
    oak,
    serveHttp,
};
export const defaultAdapter = "oak";
