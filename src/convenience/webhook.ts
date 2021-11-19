import { Bot } from "../bot.ts";
import { debug as d, Update } from "../platform.deno.ts";
import { WebhookReplyEnvelope } from "../core/client.ts";
import { Context } from "../context.ts";
import { defaultAdapter } from "./frameworks.deno.ts";
export * as adapters from "./frameworks.deno.ts";
const debugErr = d("grammy:error");

import * as adapters from "./frameworks.node";

/**
 * Abstraction over a request-response cycle, provding access to the update, as
 * well as a mechanism for responding to the request and to end it.
 */
interface ReqResHandler {
    /**
     * The update object sent from Telegram, usually resolves the request's JSON
     * body. In case it is rejected, i.e. if the adapter dropped that request
     * because of url pathname mismatch, then it won't be processed
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
export type AdapterFactory<O = never> = [O] extends [never]
    ? () => FrameworkAdapter
    : (opts: O) => FrameworkAdapter;
type CommonAdapterOptions = {
    onTimeout?: "throw" | "return" | ((...args: any[]) => unknown);
    timeoutMilliseconds?: number;
};
type WebhookCbReturn<A extends FrameworkAdapter> = (
    ...args: Parameters<A>
) => any;

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
 * @param adapterOptions Additional options for adapter behavior
 * @param adapterOptions.onTimeout An optional strategy to handle timeouts (default: 'throw')
 * @param adapterOptions.timeoutMilliseconds An optional number of timeout milliseconds (default: 10_000)
 */
export function webhookCallback<
    A extends FrameworkAdapter,
    C extends Context = Context,
>(
    bot: Bot<C>,
    adapter?: A | keyof typeof adapters, // TODO: remove union before next maj. release
    adapterOptions: CommonAdapterOptions = {},
): WebhookCbReturn<A> {
    const { onTimeout = "throw", timeoutMilliseconds = 10_000 } =
        adapterOptions;
    let firstUpdate = true;
    let initialized = false;
    let initCall: Promise<void> | undefined;
    const server: FrameworkAdapter = typeof adapter === "string" // TODO: remove check before next maj. release
        ? (adapters[adapter] as AdapterFactory)()
        : adapter ?? defaultAdapter();
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
            send: async (json) => {
                usedWebhookReply = true;
                await respond(json);
            },
        };
        try {
            await timeoutIfNecessary(
                bot.handleUpdate(await update, webhookReplyEnvelope),
                typeof onTimeout === "function"
                    ? () => onTimeout(...args)
                    : onTimeout,
                timeoutMilliseconds,
            );
            if (end !== undefined && !usedWebhookReply) end();
        } catch {
            // Adapter rejected processing an update
        }
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
