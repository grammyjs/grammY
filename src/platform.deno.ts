// deno-lint-ignore-file no-import-prefix

/** Are we running on Deno or in a web browser? */
export const isDeno = typeof Deno !== "undefined";

// === Export debug
import debug from "https://cdn.skypack.dev/debug@4.4.3";
export { debug };
const DEBUG = "DEBUG";
if (isDeno) {
    debug.useColors = () => !Deno.noColor;
    const env = { name: "env", variable: DEBUG } as const;
    const res = await Deno.permissions.query(env);
    let namespace: string | undefined = undefined;
    if (res.state === "granted") namespace = Deno.env.get(DEBUG);
    if (namespace) debug.enable(namespace);
    else debug.disable();
}

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) =>
    ReadableStream.from(itr);

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({ duplex: "half" });

// === Default webhook adapter
export const defaultAdapter = "oak";

// === Compression

function transform(
    data: Uint8Array,
    stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
    // Blob rejects views backed by shared or resizable buffers.
    const { buffer, byteOffset, byteLength } = data;
    const bytes = buffer instanceof ArrayBuffer && !buffer.resizable
        ? new Uint8Array(buffer, byteOffset, byteLength)
        : new Uint8Array(data);
    return new Response(new Blob([bytes]).stream().pipeThrough(stream))
        .arrayBuffer()
        .then((buffer) => new Uint8Array(buffer));
}

export const gzip = (data: Uint8Array): Promise<Uint8Array> =>
    transform(data, new CompressionStream("gzip"));

export const gunzip = (data: Uint8Array): Promise<Uint8Array> =>
    transform(data, new DecompressionStream("gzip"));
