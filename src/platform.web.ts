import d from "https://cdn.skypack.dev/debug@4.3.4";
export { d as debug };

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export { readableStreamFromIterable as itrToStream } from "https://deno.land/std@0.198.0/streams/readable_stream_from_iterable.ts";

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

export const defaultAdapter = "cloudflare";
