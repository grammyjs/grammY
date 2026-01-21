// === Needed imports
import { Agent as HttpAgent } from "http";
import { Agent as HttpsAgent } from "https";
import { Readable } from "stream";

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
        };
    } else if (apiRoot.startsWith("http:")) {
        return {
            agent: getCached(
                httpAgents,
                apiRoot,
                () => new HttpAgent({ keepAlive: true }),
            ),
        };
    } else return {};
}

// === Default webhook adapter
export const defaultAdapter = "express";
