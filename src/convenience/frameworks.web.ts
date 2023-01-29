// deno-lint-ignore-file no-explicit-any
import { SECRET_HEADER } from "./frameworks.shared.ts";

/** Native CloudFlare workers (service worker) */
const cloudflare = (
    event: { request: Request; respondWith: (res: Promise<Response>) => void },
) => {
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
        respond: (json: string) => {
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
const cloudflare_module = (
    request: Request
) => {
    let resolveResponse: (res: Response) => void;
    return {
        update: request.json(),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(new Response(null, { status: 200 }));
        },
        respond: (json: string) => {
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
        })
    };
};

/** worktop CloudFlare workers framework */
const worktop = (req: any, res: any) => ({
    update: Promise.resolve(req.body.json()),
    header: req.headers.get(SECRET_HEADER),
    end: () => res.end(),
    respond: (json: string) => res.send(200, json),
    unauthorized: () => res.send(401, "secret token is wrong"),
});

export const adapters = { cloudflare, "cloudflare-mod": cloudflare_module, worktop };
