import { type ApiError, type ResponseParameters } from "../types.ts";
import { debug as d } from "../platform.deno.ts";
const debug = d("grammy:warn");

/**
 * This class represents errors that are thrown by grammY because the Telegram
 * Bot API responded with an error.
 *
 * Instances of this class hold the information that the Telegram backend
 * returned.
 *
 * If this error is thrown, grammY could successfully communicate with the
 * Telegram Bot API servers, however, an error code was returned for the
 * respective method call.
 */
export class GrammyError extends Error implements ApiError {
    /** Flag that this request was unsuccessful. Always `false`. */
    public readonly ok: false = false;
    /** An integer holding Telegram's error code. Subject to change. */
    public readonly error_code: number;
    /** A human-readable description of the error. */
    public readonly description: string;
    /** Further parameters that may help to automatically handle the error. */
    public readonly parameters: ResponseParameters;
    constructor(
        message: string,
        err: ApiError,
        /** The called method name which caused this error to be thrown. */
        public readonly method: string,
        /** The payload that was passed when calling the method. */
        public readonly payload: Record<string, unknown>,
    ) {
        super(`${message} (${err.error_code}: ${err.description})`);
        this.name = "GrammyError";
        this.error_code = err.error_code;
        this.description = err.description;
        this.parameters = err.parameters ?? {};
    }
}
export function toGrammyError(
    err: ApiError,
    method: string,
    payload: Record<string, unknown>,
) {
    switch (err.error_code) {
        case 401:
            debug(
                "Error 401 means that your bot token is wrong, talk to https://t.me/BotFather to check it.",
            );
            break;
        case 409:
            debug(
                "Error 409 means that you are running your bot several times on long polling. Consider revoking the bot token if you believe that no other instance is running.",
            );
            break;
    }
    return new GrammyError(
        `Call to '${method}' failed!`,
        err,
        method,
        payload,
    );
}

/**
 * This class represents errors that are thrown by grammY because an HTTP call
 * to the Telegram Bot API failed.
 *
 * Instances of this class hold the error object that was created because the
 * fetch call failed. It can be inspected to determine why exactly the network
 * request failed.
 *
 * If an [API transformer
 * function](https://grammy.dev/advanced/transformers.html) throws an error,
 * grammY will regard this as if the network request failed. The contained error
 * will then be the error that was thrown by the transformer function.
 */
export class HttpError extends Error {
    constructor(
        message: string,
        /** The thrown error object. */
        public readonly error: unknown,
    ) {
        super(message);
        this.name = "HttpError";
    }
}

function isTelegramError(
    err: unknown,
): err is { status: string; statusText: string } {
    return (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        "statusText" in err
    );
}
export function toHttpError(method: string, sensitiveLogs: boolean) {
    return (err: unknown) => {
        let msg = `Network request for '${method}' failed!`;
        if (isTelegramError(err)) msg += ` (${err.status}: ${err.statusText})`;
        if (sensitiveLogs && err instanceof Error) msg += ` ${err.message}`;
        throw new HttpError(msg, err);
    };
}
