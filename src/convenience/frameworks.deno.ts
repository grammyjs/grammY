// deno-lint-ignore-file no-explicit-any
import { AdapterFactory } from "./webhook.ts";

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */

export const stdHttp: AdapterFactory<{ secretPath: string }> = (
    { secretPath },
) => (req: Request) => {
    let resolveResponse: (res: Response) => void;
    const reqUrl = new URL(req.url);
    return {
        update: (req.method !== "POST" || reqUrl.pathname !== secretPath)
            ? Promise.resolve(undefined)
            : req.json(),
        end: () => {
            if (resolveResponse) resolveResponse(new Response());
        },
        respond: (json) => {
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

export const oak = () =>
    (ctx: any) => ({
        update: ctx.request.body({ type: "json" }).value,
        end: () => (ctx.response.status = 200),
        respond: (json: string) => {
            ctx.response.type = "json";
            ctx.response.body = json;
        },
    });

// please open a PR if you want to add another

export const defaultAdapter = oak;
