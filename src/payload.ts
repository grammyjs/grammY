import { EntityString } from "./format.ts";
import { InputFile } from "./types.ts";

// === Payload types (JSON vs. form data)
/**
 * Rewrites all instances of {@link EntityString} and collects all instances of
 * {@link InputFile} in a given payload.
 *
 * @param payload The payload to prepare
 */
export function preparePayload(payload: unknown):
    | { requiresFormDataUpload: false }
    | { requiresFormDataUpload: true; files: CollectedFile[] } {
    const files = applyEntitiesAndCollectFiles(payload, "file");
    return files.length === 0
        ? { requiresFormDataUpload: false }
        : { requiresFormDataUpload: true, files };
}
/**
 * Turns a payload into an options object that can be passed to a `fetch` call
 * by setting the necessary headers and method. May only be called after
 * {@link preparePayload} returned `requiresFormDataUpload: false`.
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
        body: createJsonPayloadBody(payload),
    };
}
/**
 * Turns a payload into a string that can be passes as a body to a `fetch` call.
 * May only be called after {@link preparePayload} returned
 * `requiresFormDataUpload: false`.
 *
 * @param payload The payload to stringify
 */
export function createJsonPayloadBody(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
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
 * @param files Files collected by {@link preparePayload}
 * @param onError Error handler to call if file access fails
 */
export function createFormDataPayload(
    payload: Record<string, unknown>,
    files: CollectedFile[],
    onError: (err: unknown) => void,
) {
    const boundary = createBoundary();
    const itr = payloadToMultipartItr(payload, files, boundary);
    const safeItr = protectItr(itr, onError);
    const stream = ReadableStream.from(safeItr);
    return {
        method: "POST",
        headers: {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            connection: "keep-alive",
        },
        body: stream,
        duplex: "half" as const,
    };
}

// === Form data creation
function createBoundary() {
    return "----------" + crypto.getRandomValues(new Uint8Array(16)).toHex();
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
    files: CollectedFile[],
    boundary: string,
): AsyncIterableIterator<Uint8Array> {
    // Start multipart/form-data protocol
    yield enc.encode(`--${boundary}\r\n`);
    // Send all payload fields
    const separator = enc.encode(`\r\n--${boundary}\r\n`);
    let first = true;
    for (const [key, value] of Object.entries(payload)) {
        if (value == null) continue;
        if (!first) yield separator;
        yield valuePart(
            key,
            value instanceof InputFile
                ? value.toJSON()
                : typeof value === "object"
                ? JSON.stringify(value)
                : value,
        );
        first = false;
    }
    // Send all files
    for (const { origin, file } of files) {
        if (!first) yield separator;
        yield* filePart(origin, file);
        first = false;
    }
    // End multipart/form-data protocol
    yield enc.encode(`\r\n--${boundary}--\r\n`);
}

/** Information about a file extracted from a payload */
type CollectedFile = {
    /** Hints about where the file came from, useful for filename guessing */
    origin: string;
    /** The extracted file */
    file: InputFile;
};
/**
 * Rewrites all instances of {@link EntityString} and recursively collects all
 * instances of {@link InputFile} in a given payload.
 *
 * @param value a payload object, or a part of it
 *
 * @returns the discovered `InputFile` instances alongside their origins
 */
function applyEntitiesAndCollectFiles(
    value: unknown,
    origin = "file",
    isNested = false,
): CollectedFile[] {
    if (value instanceof InputFile) return [{ origin, file: value }];
    if (value instanceof EntityString) return [];
    if (Array.isArray(value)) {
        return value.flatMap((item) =>
            applyEntitiesAndCollectFiles(item, origin, true)
        );
    }
    if (typeof value !== "object" || value === null) return [];

    const record = value as Record<string, unknown>;
    return Object.entries(record).flatMap(([k, v]) => {
        if (v instanceof EntityString) {
            const entityKey = getEntitiesKey(k, isNested);
            const { text, entities } = v.build();
            record[k] = text;
            if (record[entityKey] === undefined) record[entityKey] = entities;
            return [];
        }
        const origin = isNested &&
                k === "media" && typeof record.type === "string"
            ? record.type // use `type` for `InputMedia*`
            : k; // use property key otherwise
        return applyEntitiesAndCollectFiles(v, origin, true);
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
    origin: string,
    input: InputFile,
): AsyncIterableIterator<Uint8Array> {
    const filename = input.name || `${origin}.${getExt(origin)}`;
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
        `content-disposition:form-data;name="${input._id}";filename=${filename}\r\ncontent-type:application/octet-stream\r\n\r\n`,
    );
    yield* input;
}
/** Returns the property name of the entities for a text property name */
function getEntitiesKey(key: string, isNested: boolean) {
    switch (key) {
        case "text":
            return isNested ? "text_entities" : "entities";
        case "message_text":
            return "entities";
        default:
            return key + "_entities";
    }
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
