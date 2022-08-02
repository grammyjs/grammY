// deno-lint-ignore-file no-explicit-any
import { type Bot } from "../bot.ts";
import { debug as d } from "../platform.deno.ts";
import { type Update } from "../types.ts";
import { type WebhookReplyEnvelope } from "../core/client.ts";
import { type Context } from "../context.ts";
import {
    adapters as nativeAdapters,
    defaultAdapter,
} from "./frameworks.deno.ts";
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
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */
type SupportedFrameworks = keyof typeof adapters;

/**
 * Abstraction over a request-response cycle, provding access to the update, as
 * well as a mechanism for responding to the request and to end it.
 */
interface ReqResHandler {
    /**
     * The update object sent from Telegram, usually resolves the request's JSON
     * body
     */
    update: Promise<Update>;
    /**
     * X-Telegram-Bot-Api-Secret-Token header of the request, or undefined if
     * not present
     */
    header?: string;
    /**
     * Ends the request immediately without body, called after every request
     * unless a webhook reply was performed
     */
    end?: () => void;
    /**
     * Sends the specified JSON as a payload in the body, used for webhook
     * replies
     */
    respond: (json: string) => unknown | Promise<unknown>;
    /**
     * Responds that the request is unauthorized due to mismatching
     * X-Telegram-Bot-Api-Secret-Token headers
     */
    unauthorized: () => unknown | Promise<unknown>;
    /**
     * Some frameworks (e.g. Deno's std/http `listenAndServe`) assume that
     * handler returns something
     */
    handlerReturn?: any;
}
/**
 * Middleware for a web framework. Creates a request-response handler for a
 * request. The handler will be used to integrate with the compatible framework.
 */
export type FrameworkAdapter = (...args: any[]) => ReqResHandler;

export interface WebhookOptions {
    /** An optional strategy to handle timeouts (default: 'throw') */
    onTimeout?: "throw" | "return" | ((...args: any[]) => unknown);
    /** An optional number of timeout milliseconds (default: 10_000) */
    timeoutMilliseconds?: number;
    /** An optional string to compare to X-Telegram-Bot-Api-Secret-Token */
    secretToken?: string;
}

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
 * [documentation](https://grammy.dev/guide/deployment-types.html) to read more
 * about how to run your bot with webhooks.
 *
 * @param bot The bot for which to create a callback
 * @param adapter An optional string identifying the framework (default: 'express')
 * @param onTimeout An optional strategy to handle timeouts (default: 'throw')
 * @param timeoutMilliseconds An optional number of timeout milliseconds (default: 10_000)
 */
export function webhookCallback<C extends Context = Context>(
    bot: Bot<C>,
    adapter?: SupportedFrameworks | FrameworkAdapter,
    onTimeout?: WebhookOptions["onTimeout"],
    timeoutMilliseconds?: WebhookOptions["timeoutMilliseconds"],
    secretToken?: WebhookOptions["secretToken"],
): (...args: any[]) => any;
export function webhookCallback<C extends Context = Context>(
    bot: Bot<C>,
    adapter?: SupportedFrameworks | FrameworkAdapter,
    webhookOptions?: WebhookOptions,
): (...args: any[]) => any;
export function webhookCallback<C extends Context = Context>(
    bot: Bot<C>,
    adapter: SupportedFrameworks | FrameworkAdapter = defaultAdapter,
    onTimeout:
        | WebhookOptions
        | WebhookOptions["onTimeout"] = "throw",
    timeoutMilliseconds: WebhookOptions["timeoutMilliseconds"] = 10_000,
    secretToken?: WebhookOptions["secretToken"],
) {
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
        if (!initialized) {
            // Will dedupe concurrently incoming calls from several updates
            await bot.init();
            initialized = true;
        }
        const { update, respond, unauthorized, end, handlerReturn, header } =
            server(...args);
        if (header !== token) {
            await unauthorized();
            // TODO: investigate deno bug that happens when this console logging is removed
            console.log(handlerReturn);
            return handlerReturn;
        }
        let usedWebhookReply = false;
        const webhookReplyEnvelope: WebhookReplyEnvelope = {
            async send(json) {
                usedWebhookReply = true;
                await respond(json);
            },
        };
        await timeoutIfNecessary(
            bot.handleUpdate(await update, webhookReplyEnvelope),
            typeof timeout === "function" ? () => timeout(...args) : timeout,
            ms,
        );
        if (!usedWebhookReply) end?.();
        return handlerReturn;
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
