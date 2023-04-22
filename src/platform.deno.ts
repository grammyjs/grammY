/** Are we running on Deno or in a web browser? */
export const isDeno = typeof Deno !== "undefined";

// === Export debug
import d from "https://cdn.skypack.dev/debug@4.3.4";
export { d as debug };
const DEBUG = "DEBUG";
if (isDeno) {
    d.useColors = () => !Deno.noColor;
    const env = { name: "env", variable: DEBUG } as const;
    const res = await Deno.permissions.query(env);
    let namespace: string | undefined = undefined;
    if (res.state === "granted") namespace = Deno.env.get(DEBUG);
    if (namespace) d.enable(namespace);
    else d.disable();
}

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromIterable as itrToStream } from "https://deno.land/std@0.184.0/streams/mod.ts";

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

// === Default webhook adapter
export const defaultAdapter = "oak";
