// deno-lint-ignore-file no-explicit-any
import { type Bot } from "../bot.ts";
import { debug as d, type Update } from "../platform.deno.ts";
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
) => ({
    update: Promise.resolve(update),
    respond: callback,
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
     * Ends the request immediately without body, called after every request
     * unless a webhook reply was performed
     */
    end?: () => void;
    /**
     * Sends the specified JSON as a payload in the body, used for webhook
     * replies
     */
    respond: (json: string) => unknown;
    /**
     * Some frameworks (e.g. Deno's std/http `listenAndServe`) assume
     * that handler returns something
     */
    handlerReturn?: any;
}
/**
 * Middleware for a web framework. Creates a request-response handler for a
 * request. The handler will be used to integrate with the compatible framework.
 */
export type FrameworkAdapter = (...args: any[]) => ReqResHandler;

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
 * @param framework An optional string identifying the framework (default: 'express')
 * @param onTimeout An optional strategy to handle timeouts (default: 'throw')
 * @param timeoutMilliseconds An optional number of timeout milliseconds (default: 10_000)
 */
export function webhookCallback<C extends Context = Context>(
    bot: Bot<C>,
    adapter: SupportedFrameworks | FrameworkAdapter = defaultAdapter,
    onTimeout: "throw" | "return" | ((...args: any[]) => unknown) = "throw",
    timeoutMilliseconds = 10_000,
) {
    let firstUpdate = true;
    let initialized = false;
    let initCall: Promise<void> | undefined;
    const server: FrameworkAdapter = typeof adapter === "string"
        ? adapters[adapter]
        : adapter;
    return async (...args: any[]) => {
        if (!initialized) {
            if (firstUpdate) {
                initCall = bot.init();
                firstUpdate = false;
            }
            await initCall;
            initialized = true;
        }
        const { update, respond, end, handlerReturn } = server(...args);
        let usedWebhookReply = false;
        const webhookReplyEnvelope: WebhookReplyEnvelope = {
            async send(json) {
                usedWebhookReply = true;
                await respond(json);
            },
        };
        await timeoutIfNecessary(
            bot.handleUpdate(await update, webhookReplyEnvelope),
            typeof onTimeout === "function"
                ? () => onTimeout(...args)
                : onTimeout,
            timeoutMilliseconds,
        );
        if (end !== undefined && !usedWebhookReply) end();
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
