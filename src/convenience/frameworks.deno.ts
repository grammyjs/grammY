// deno-lint-ignore-file no-explicit-any

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */
export type SupportedFrameworks =
    | "oak"
    | "callback";

export const defaultFramework: SupportedFrameworks = "oak";

export const frameworkAdapters = {
    oak: (ctx: any) => ({
        update: ctx.request.body({ type: "json" }).value,
        end: () => (ctx.response.status = 200),
        respond: (json: string) => {
            ctx.response.type = "json";
            ctx.response.body = json;
        },
    }),
    // please open a PR if you want to add another
};
