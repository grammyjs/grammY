// deno-lint-ignore-file no-import-prefix

import d from "https://cdn.skypack.dev/debug@4.4.3";
export { d as debug };

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) => {
    // do not assume ReadableStream.from to exist yet
    const it = itr[Symbol.asyncIterator]();
    return new ReadableStream({
        async pull(controller) {
            const chunk = await it.next();
            if (chunk.done) controller.close();
            else controller.enqueue(chunk.value);
        },
    });
};

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

export const defaultAdapter = "cloudflare";
