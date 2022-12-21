import {
    adapters as sharedAdapters,
    SECRET_HEADER,
} from "./frameworks.shared.ts";

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
    serveHttp,
    ...sharedAdapters,
};
export const defaultAdapter = "oak";
