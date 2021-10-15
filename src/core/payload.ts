import {
    InputFile,
    inputFileData,
    InputMedia,
    itrToStream,
    streamFile,
} from "../platform.deno.ts";

// === Payload types (JSON vs. form data)
/**
 * Turns a payload into an options object that can be passed to a `fetch` call.
 * Automatically switches between JSON payloads and form-data payloads as
 * needed.
 *
 * @param payload The payload to use
 */
export function createRequestConfig(payload: Record<string, unknown>) {
    return requiresFormDataUpload(payload)
        ? createFormDataPayload(payload)
        : createJsonPayload(payload);
}
/**
 * Determines for a given payload if it may be sent as JSON, or if it has to be
 * uploaded via multipart/form-data. Returns `true` in the latter case and
 * `false` in the former.
 *
 * @param payload The payload to analyse
 */
function requiresFormDataUpload(payload: unknown): boolean {
    return (
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
 * Turns a payload into an options object that can be passed to a `fetch` call
 * by setting the necessary headers and method. May only be called for payloads
 * `P` that let `requiresFormDataUpload(P)` return `false`.
 *
 * @param payload The payload to wrap
 */
function createJsonPayload(payload: Record<string, unknown>) {
    return {
        method: "POST",
        headers: {
            "content-type": "application/json",
            connection: "keep-alive",
        },
        body: JSON.stringify(payload, (_, v) => v ?? undefined),
    };
}
/**
 * Turns a payload into an options object that can be passed to a `fetch` call
 * by setting the necessary headers and method. Note that this method creates a
 * multipart/form-data stream under the hood. If possible, a JSON payload should
 * be created instead for performance reasons.
 *
 * @param payload The payload to wrap
 */
function createFormDataPayload(payload: Record<string, unknown>) {
    const boundary = createBoundary();

    return {
        method: "POST",
        headers: {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            connection: "keep-alive",
        },
        body: itrToStream(payloadToMultipartItr(payload, boundary)),
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
async function* payloadToMultipartItr(
    payload: Record<string, unknown>,
    boundary = createBoundary(),
): AsyncIterableIterator<Uint8Array> {
    yield enc.encode(`--${boundary}\r\n`);

    const separator = enc.encode(`\r\n--${boundary}\r\n`);
    let first = true;
    for (const [key, value] of Object.entries(payload)) {
        if (!first) yield separator;
        if (value instanceof InputFile) {
            // InputFile in payload
            if (mustAttachIndirectly(key)) {
                const id = randomId();
                yield* filePart(id, key, value);
                yield separator;
                yield valuePart(key, `attach://${id}`);
            } else {
                yield* filePart(key, key, value);
            }
        } else if (isInputMedia(value)) {
            // InputMedia* in payload
            if (value.media instanceof InputFile) {
                const id = randomId();
                yield* filePart(id, key, value.media);
                yield separator;
                value.media = `attach://${id}`;
            }
            yield valuePart(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
            // Array in payload (elements might be InputMedia*)
            for (const elem of value) {
                if (isInputMedia(elem) && elem.media instanceof InputFile) {
                    const id = randomId();
                    yield* filePart(id, key, elem.media);
                    yield separator;
                    elem.media = `attach://${id}`;
                }
            }
            yield valuePart(key, JSON.stringify(value));
        } else {
            // other value in payload
            yield valuePart(
                key,
                typeof value === "object" ? JSON.stringify(value) : value,
            );
        }
        first = false;
    }

    yield enc.encode(`\r\n--${boundary}--`);
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
    key: string,
    input: InputFile,
): AsyncIterableIterator<Uint8Array> {
    const filename = input.filename ?? `${key}.${getExt(key)}`;
    if (filename.includes("\r") || filename.includes("\n")) {
        throw new Error(
            `File paths cannot contain carriage-return (\\r) \
or newline (\\n) characters! Filename for property '${key}' was:
"""
${filename}
"""`,
        );
    }
    yield enc.encode(
        `content-disposition:form-data;name="${id}";filename=${filename}\r\n\r\n`,
    );
    const fileData = input[inputFileData];
    // handle buffers, file paths, and streams:
    if (fileData instanceof Uint8Array) yield fileData;
    else if (typeof fileData === "string") yield* await streamFile(fileData);
    else yield* fileData;
}
/** Returns the default file extension for an API property name */
function getExt(key: string) {
    switch (key) {
        case "photo":
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

// === Helper functions
/** Fields that require a multipart/form-data upload via ID instead of via the property itself */
const indirectAttachmentFields = new Set(["thumb"]);
/** Determines if a file behind a given key should be send via `attach://<id>` instead of the key itself */
function mustAttachIndirectly(key: string) {
    return indirectAttachmentFields.has(key);
}
function has<K extends readonly string[]>(
    obj: unknown,
    props: K,
): obj is Record<K[number], unknown> {
    return typeof obj === "object" && obj !== null &&
        props.every((p) => p in obj);
}
const inputMediaProps = ["type", "media"] as const;
/** Determines if a value is an `InputMedia` object */
function isInputMedia(value: unknown): value is InputMedia {
    return (
        has(value, inputMediaProps) &&
        typeof value.type === "string" &&
        (typeof value.media === "string" || value.media instanceof InputFile)
    );
}
