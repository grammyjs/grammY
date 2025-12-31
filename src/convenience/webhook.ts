// deno-lint-ignore-file no-explicit-any
import { type Bot } from "../bot.ts";
import { type Context } from "../context.ts";
import { type WebhookReplyEnvelope } from "../core/client.ts";
import { debug as d, defaultAdapter } from "../platform.deno.ts";
import { type Update } from "../types.ts";
import {
    adapters as nativeAdapters,
    type FrameworkAdapter,
} from "./frameworks.ts";
const debugErr = d("grammy:error");

const callbackAdapter: FrameworkAdapter = (
    update: Update,
    callback: (json: string) => unknown,
    header: string,
    unauthorized = () => callback('"unauthorized"'),
) => ({
    update: Promise.resolve(update),
    respond: callback,
    header,
    unauthorized,
});
const adapters = { ...nativeAdapters, callback: callbackAdapter };

/**
 * Performs a constant-time comparison of two strings to prevent timing attacks.
 * This function always compares all bytes regardless of early differences,
 * ensuring the comparison time does not leak information about the secret.
 *
 * @param header The header value from the request (X-Telegram-Bot-Api-Secret-Token)
 * @param token The expected secret token configured for the webhook
 * @returns true if strings are equal, false otherwise
 */
function compareSecretToken(
    header: string | undefined,
    token: string | undefined,
): boolean {
    // If no token is configured, accept all requests
    if (token === undefined) {
        return true;
    }
    // If token is configured but no header provided, reject
    if (header === undefined) {
        return false;
    }

    // Convert strings to Uint8Array for byte-by-byte comparison
    const encoder = new TextEncoder();
    const headerBytes = encoder.encode(header);
    const tokenBytes = encoder.encode(token);

    // If lengths differ, reject
    if (headerBytes.length !== tokenBytes.length) {
      return false;
    }

    let hasDifference = 0;
    // Always iterate exactly tokenBytes.length times to prevent timing attacks
    // that could reveal the secret token's length. The loop time is constant
    // relative to the secret token length, not the attacker's input length.
    for (let i = 0; i < tokenBytes.length; i++) {
        // If header is shorter than token, pad with 0 for comparison
        const headerByte = i < headerBytes.length ? headerBytes[i] : 0;
        const tokenByte = tokenBytes[i];

        // If bytes differ, mark that we found a difference
        // Using bitwise OR to maintain constant-time (no short-circuit evaluation)
        hasDifference |= headerByte ^ tokenByte;
    }

    // Return true only if no differences were found
    return hasDifference === 0;
}

export interface WebhookOptions {
    /** An optional strategy to handle timeouts (default: 'throw') */
    onTimeout?: "throw" | "return" | ((...args: any[]) => unknown);
    /** An optional number of timeout milliseconds (default: 10_000) */
    timeoutMilliseconds?: number;
    /** An optional string to compare to X-Telegram-Bot-Api-Secret-Token */
    secretToken?: string;
}

type Adapters = typeof adapters;
type AdapterNames = keyof Adapters;
type ResolveName<A extends FrameworkAdapter | AdapterNames> = A extends
    AdapterNames ? Adapters[A] : A;

/**
 * Creates a callback function that you can pass to a web framework (such as
 * express) if you want to run your bot via webhooks. Use it like this:
 * ```ts
 * const app = express() // or whatever you're using
 * const bot = new Bot('<token>')
 *
 * app.use(webhookCallback(bot, 'express'))
 * ```
 *
 * Confer the grammY
 * [documentation](https://grammy.dev/guide/deployment-types) to read more
 * about how to run your bot with webhooks.
 *
 * @param bot The bot for which to create a callback
 * @param adapter An optional string identifying the framework (default: 'express')
 * @param webhookOptions Further options for the webhook setup
 */
export function webhookCallback<
    C extends Context = Context,
    A extends FrameworkAdapter | AdapterNames = FrameworkAdapter | AdapterNames,
>(
    bot: Bot<C>,
    adapter: A,
    webhookOptions?: WebhookOptions,
): (
    ...args: Parameters<ResolveName<A>>
) => ReturnType<ResolveName<A>>["handlerReturn"] extends undefined
    ? Promise<void>
    : NonNullable<ReturnType<ResolveName<A>>["handlerReturn"]>;
export function webhookCallback<
    C extends Context = Context,
    A extends FrameworkAdapter | AdapterNames = FrameworkAdapter | AdapterNames,
>(
    bot: Bot<C>,
    adapter: A,
    onTimeout?: WebhookOptions["onTimeout"],
    timeoutMilliseconds?: WebhookOptions["timeoutMilliseconds"],
    secretToken?: WebhookOptions["secretToken"],
): (
    ...args: Parameters<ResolveName<A>>
) => ReturnType<ResolveName<A>>["handlerReturn"] extends undefined
    ? Promise<void>
    : NonNullable<ReturnType<ResolveName<A>>["handlerReturn"]>;
export function webhookCallback<C extends Context = Context>(
    bot: Bot<C>,
    adapter: FrameworkAdapter | AdapterNames = defaultAdapter,
    onTimeout?:
        | WebhookOptions
        | WebhookOptions["onTimeout"],
    timeoutMilliseconds?: WebhookOptions["timeoutMilliseconds"],
    secretToken?: WebhookOptions["secretToken"],
) {
    if (bot.isRunning()) {
        throw new Error(
            "Bot is already running via long polling, the webhook setup won't receive any updates!",
        );
    } else {
        bot.start = () => {
            throw new Error(
                "You already started the bot via webhooks, calling `bot.start()` starts the bot with long polling and this will prevent your webhook setup from receiving any updates!",
            );
        };
    }
    const {
        onTimeout: timeout = "throw",
        timeoutMilliseconds: ms = 10_000,
        secretToken: token,
    } = typeof onTimeout === "object"
        ? onTimeout
        : { onTimeout, timeoutMilliseconds, secretToken };
    let initialized = false;
    const server: FrameworkAdapter = typeof adapter === "string"
        ? adapters[adapter]
        : adapter;
    return async (...args: any[]) => {
        const handler = server(...args);
        if (!initialized) {
            // Will dedupe concurrently incoming calls from several updates
            await bot.init();
            initialized = true;
        }
        if (!compareSecretToken(handler.header, token)) {
            await handler.unauthorized();
            return handler.handlerReturn;
        }
        let usedWebhookReply = false;
        const webhookReplyEnvelope: WebhookReplyEnvelope = {
            async send(json) {
                usedWebhookReply = true;
                await handler.respond(json);
            },
        };
        await timeoutIfNecessary(
            bot.handleUpdate(await handler.update, webhookReplyEnvelope),
            typeof timeout === "function" ? () => timeout(...args) : timeout,
            ms,
        );
        if (!usedWebhookReply) handler.end?.();
        return handler.handlerReturn;
    };
}

function timeoutIfNecessary(
    task: Promise<void>,
    onTimeout: "throw" | "return" | (() => unknown),
    timeout: number,
): Promise<void> {
    if (timeout === Infinity) return task;
    return new Promise((resolve, reject) => {
        const handle = setTimeout(() => {
            debugErr(`Request timed out after ${timeout} ms`);
            if (onTimeout === "throw") {
                reject(new Error(`Request timed out after ${timeout} ms`));
            } else {
                if (typeof onTimeout === "function") onTimeout();
                resolve();
            }
            const now = Date.now();
            task.finally(() => {
                const diff = Date.now() - now;
                debugErr(`Request completed ${diff} ms after timeout!`);
            });
        }, timeout);
        task.then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(handle));
    });
}
