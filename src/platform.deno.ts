/** Are we running on Deno or in a web browser? */
export const isDeno = typeof Deno !== "undefined";

// === Export debug
export { createDebug } from "@grammyjs/debug";

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) =>
    ReadableStream.from(itr);

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});
