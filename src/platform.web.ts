import d from "https://cdn.skypack.dev/debug@4.3.4";
export { d as debug };

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromIterable as itrToStream } from "https://deno.land/std@0.192.0/streams/mod.ts";

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

export const defaultAdapter = "cloudflare";
