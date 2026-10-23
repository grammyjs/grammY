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
export const baseFetchConfig = (_apiRoot: string) => ({ duplex: "half" });

export const defaultAdapter = "cloudflare";

// === Compression

function transform(
    data: Uint8Array,
    stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
    // copy the data into a fresh `Uint8Array<ArrayBuffer>` because `data`
    // may be backed by a `SharedArrayBuffer`, which cannot be turned into a
    // `Blob`
    const bytes = new Uint8Array(data.byteLength);
    bytes.set(data);
    return new Response(new Blob([bytes]).stream().pipeThrough(stream))
        .arrayBuffer()
        .then((buffer) => new Uint8Array(buffer));
}

export const gzip = (data: Uint8Array): Promise<Uint8Array> =>
    transform(data, new CompressionStream("gzip"));

export const gunzip = (data: Uint8Array): Promise<Uint8Array> =>
    transform(data, new DecompressionStream("gzip"));
