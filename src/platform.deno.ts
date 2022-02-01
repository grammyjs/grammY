/** Are we running on Deno or in a web browser? */
export const isDeno = typeof Deno !== "undefined";

// === Export debug
import d from "https://cdn.skypack.dev/debug@^4.3.3";
export { d as debug };
if (isDeno) {
    d.useColors = () => !Deno.noColor;
    try {
        const val = Deno.env.get("DEBUG");
        if (val) d.enable(val);
    } catch {
        // cannot access env var, treat as if it is not set
    }
}

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromIterable as itrToStream } from "https://deno.land/std@0.123.0/streams/mod.ts";

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

// === InputFile handling and File augmenting
// Accessor for file data in `InputFile` instances
export const toRaw = Symbol("InputFile data");
