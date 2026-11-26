// === Needed imports
import { Agent as HttpAgent } from "http";
import { Agent as HttpsAgent } from "https";
import { Readable } from "stream";
import { promisify } from "util";
import { gunzip as gunzipNode, gzip as gzipNode } from "zlib";

// === Export debug
export { debug } from "debug";

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) =>
    Readable.from(itr, { objectMode: false });

// === Base configuration for `fetch` calls
const httpAgents = new Map<string, HttpAgent>();
const httpsAgents = new Map<string, HttpsAgent>();
function getCached<K, V>(map: Map<K, V>, key: K, otherwise: () => V) {
    let value = map.get(key);
    if (value === undefined) {
        value = otherwise();
        map.set(key, value);
    }
    return value;
}
export function baseFetchConfig(apiRoot: string) {
    if (apiRoot.startsWith("https:")) {
        return {
            compress: true,
            agent: getCached(
                httpsAgents,
                apiRoot,
                () => new HttpsAgent({ keepAlive: true }),
            ),
            duplex: "half",
        };
    } else if (apiRoot.startsWith("http:")) {
        return {
            agent: getCached(
                httpAgents,
                apiRoot,
                () => new HttpAgent({ keepAlive: true }),
            ),
            duplex: "half",
        };
    } else return { duplex: "half" };
}

// === Default webhook adapter
export const defaultAdapter = "express";

// === Compression
const gzipAsync = promisify(gzipNode);
const gunzipAsync = promisify(gunzipNode);
// convert `Buffer` to `Uint8Array` because the types are incompatible in
// older versions of `@types/node`
const toBytes = (buffer: Buffer): Uint8Array =>
    new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

export const gzip = (data: Uint8Array): Promise<Uint8Array> =>
    gzipAsync(data).then(toBytes);
export const gunzip = (data: Uint8Array): Promise<Uint8Array> =>
    gunzipAsync(data).then(toBytes);
