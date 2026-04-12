import { promisify } from "util";
import { gunzip as gunzipCallback, gzip as gzipCallback } from "zlib";

const gzipAsync = promisify(gzipCallback);
const gunzipAsync = promisify(gunzipCallback);

export function gzip(data: Uint8Array): Promise<Uint8Array> {
    return gzipAsync(data);
}

export function gunzip(data: Uint8Array): Promise<Uint8Array> {
    return gunzipAsync(data);
}
