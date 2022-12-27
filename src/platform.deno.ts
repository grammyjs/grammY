/** Are we running on Deno or in a web browser? */
export const isDeno = typeof Deno !== "undefined"; // TODO: remove for next major

// === Export debug
import d from "https://cdn.skypack.dev/debug@4.3.4";
export { d as debug };
const DEBUG = "DEBUG";
if (isDeno) {
    d.useColors = () => !Deno.noColor;
    const env = { name: "env", variable: DEBUG } as const;
    const res = await Deno.permissions.query(env);
    if (res.state === "granted") {
        const val = Deno.env.get(DEBUG);
        if (val) d.enable(val);
    }
}

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromIterable as itrToStream } from "https://deno.land/std@0.170.0/streams/mod.ts";

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

// === InputFile handling and File augmenting
// Accessor for file data in `InputFile` instances
export const toRaw = Symbol("InputFile data");
