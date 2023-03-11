import { itrToStream } from "../platform.deno.ts";
import { InputFile } from "../types.ts";

// === Payload types (JSON vs. form data)
/**
 * Determines for a given payload if it may be sent as JSON, or if it has to be
 * uploaded via multipart/form-data. Returns `true` in the latter case and
 * `false` in the former.
 *
 * @param payload The payload to analyze
 */
export function requiresFormDataUpload(payload: unknown): boolean {
    return payload instanceof InputFile || (
        typeof payload === "object" &&
        payload !== null &&
        Object.values(payload).some((v) =>
            Array.isArray(v)
                ? v.some(requiresFormDataUpload)
                : v instanceof InputFile || requiresFormDataUpload(v)
        )
    );
}
/**
 * Calls `JSON.stringify` but removes `null` values from objects before
 * serialization
 *
 * @param value value
 * @returns stringified value
 */
function str(value: unknown) {
    return JSON.stringify(value, (_, v) => v ?? undefined);
}
/**
 * Turns a payload into an options object that can be passed to a `fetch` call
 * by setting the necessary headers and method. May only be called for payloads
 * `P` that let `requiresFormDataUpload(P)` return `false`.
 *
 * @param payload The payload to wrap
 */
export function createJsonPayload(payload: Record<string, unknown>) {
    return {
        method: "POST",
        headers: {
            "content-type": "application/json",
            connection: "keep-alive",
        },
        body: str(payload),
    };
}
async function* protectItr<T>(
    itr: AsyncIterableIterator<T>,
    onError: (err: unknown) => void,
) {
    try {
        yield* itr;
    } catch (err) {
        onError(err);
    }
}
/**
 * Turns a payload into an options object that can be passed to a `fetch` call
 * by setting the necessary headers and method. Note that this method creates a
 * multipart/form-data stream under the hood. If possible, a JSON payload should
 * be created instead for performance reasons.
 *
 * @param payload The payload to wrap
 */
export function createFormDataPayload(
    payload: Record<string, unknown>,
    onError: (err: unknown) => void,
) {
    const boundary = createBoundary();
    const itr = payloadToMultipartItr(payload, boundary);
    const safeItr = protectItr(itr, onError);
    const stream = itrToStream(safeItr);
    return {
        method: "POST",
        headers: {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            connection: "keep-alive",
        },
        body: stream,
    };
}

// === Form data creation
function createBoundary() {
    // Taken from Deno std lib
    return "----------" + randomId(32);
}
function randomId(length = 16) {
    return Array.from(Array(length))
        .map(() => Math.random().toString(36)[2] || 0)
        .join("");
}

const enc = new TextEncoder();
/**
 * Takes a payload object and produces a valid multipart/form-data stream. The
 * stream is an iterator of `Uint8Array` objects. You also need to specify the
 * boundary string that was used in the Content-Type header of the HTTP request.
 *
 * @param payload a payload object
 * @param boundary the boundary string to use between the parts
 */
async function* payloadToMultipartItr(
    payload: Record<string, unknown>,
    boundary: string,
): AsyncIterableIterator<Uint8Array> {
    const files = extractFiles(payload);
    // Start multipart/form-data protocol
    yield enc.encode(`--${boundary}\r\n`);
    // Send all payload fields
    const separator = enc.encode(`\r\n--${boundary}\r\n`);
    let first = true;
    for (const [key, value] of Object.entries(payload)) {
        if (value == null) continue;
        if (!first) yield separator;
        yield valuePart(key, typeof value === "object" ? str(value) : value);
        first = false;
    }
    // Send all files
    for (const { id, origin, file } of files) {
        if (!first) yield separator;
        yield* filePart(id, origin, file);
        first = false;
    }
    // End multipart/form-data protocol
    yield enc.encode(`\r\n--${boundary}--\r\n`);
}

/** Information about a file extracted from a payload */
type ExtractedFile = {
    /** To be used in the attach:// string */
    id: string;
    /** Hints about where the file came from, useful for filename guessing */
    origin: string;
    /** The extracted file */
    file: InputFile;
};
/**
 * Replaces all instances of `InputFile` in a given payload by attach://
 * strings. This alters the passed object. After calling this method, the
 * payload object can be stringified.
 *
 * Returns a list of `InputFile` instances along with the random identifiers
 * that were used in the corresponding attach:// strings, as well as the origin
 * keys of the original payload object.
 *
 * @param value a payload object, or a part of it
 * @param key the origin key of the payload object, if a part of it is passed
 * @returns the cleaned payload object
 */
function extractFiles(value: unknown): ExtractedFile[] {
    if (typeof value !== "object" || value === null) return [];
    return Object.entries(value).flatMap(([k, v]) => {
        if (Array.isArray(v)) return v.flatMap((p) => extractFiles(p));
        else if (v instanceof InputFile) {
            const id = randomId();
            // Overwrite `InputFile` instance with attach:// string
            Object.assign(value, { [k]: `attach://${id}` });
            const origin = k === "media" &&
                    "type" in value && typeof value.type === "string"
                ? value.type // use `type` for `InputMedia*`
                : k; // use property key otherwise
            return { id, origin, file: v };
        } else return extractFiles(v);
    });
}

/** Turns a regular value into a `Uint8Array` */
function valuePart(key: string, value: unknown): Uint8Array {
    return enc.encode(
        `content-disposition:form-data;name="${key}"\r\n\r\n${value}`,
    );
}
/** Turns an InputFile into a generator of `Uint8Array`s */
async function* filePart(
    id: string,
    origin: string,
    input: InputFile,
): AsyncIterableIterator<Uint8Array> {
    const filename = input.filename || `${origin}.${getExt(origin)}`;
    if (filename.includes("\r") || filename.includes("\n")) {
        throw new Error(
            `File paths cannot contain carriage-return (\\r) \
or newline (\\n) characters! Filename for property '${origin}' was:
"""
${filename}
"""`,
        );
    }
    yield enc.encode(
        `content-disposition:form-data;name="${id}";filename=${filename}\r\ncontent-type:application/octet-stream\r\n\r\n`,
    );
    const data = await input.toRaw();
    if (data instanceof Uint8Array) yield data;
    else yield* data;
}
/** Returns the default file extension for an API property name */
function getExt(key: string) {
    switch (key) {
        case "certificate":
            return "pem";
        case "photo":
        case "thumbnail":
            return "jpg";
        case "voice":
            return "ogg";
        case "audio":
            return "mp3";
        case "animation":
        case "video":
        case "video_note":
            return "mp4";
        case "sticker":
            return "webp";
        default:
            return "dat";
    }
}
