// === Needed imports
import { Agent as HttpAgent } from "http";
import { Agent as HttpsAgent } from "https";
import { Readable } from "stream";

// === Export debug
import { debug as d } from "debug";
export { d as debug };

// === Export system-specific operations
// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) =>
    Readable.from(itr, { objectMode: false });

// === Base configuration for `fetch` calls
export function baseFetchConfig(apiRoot: string) {
    if (apiRoot.startsWith("https:")) {
        return { compress: true, agent: new HttpsAgent({ keepAlive: true }) };
    } else if (apiRoot.startsWith("http:")) {
        return { agent: new HttpAgent({ keepAlive: true }) };
    } else return {};
}

/** Something that looks like a URL. */
interface URLLike {
    /**
     * Identifier of the resource. Must be in a format that can be parsed by the
     * URL constructor.
     */
    url: string;
}

// === InputFile handling and File augmenting
// Accessor for file data in `InputFile` instances
export const toRaw = Symbol("InputFile data");
