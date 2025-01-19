// deno-lint-ignore-file no-explicit-any
import { createDebug } from "@grammyjs/debug";
import type { Bot } from "../bot.ts";
import type { Context } from "../context.ts";
import type { WebhookReplyEnvelope } from "../core/client.ts";
import type { Update } from "../types.ts";
import {
    adapters as nativeAdapters,
    type FrameworkAdapter,
} from "./frameworks.ts";
const debugErr = createDebug("grammy:error");

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

export interface WebhookOptions {
    /** An optional strategy to handle timeouts (default: 'throw') */
    onTimeout?: "throw" | "ignore" | ((...args: any[]) => unknown);
    /** An optional number of timeout milliseconds (default: 10_000) */
    timeoutMilliseconds?: number;
    /** An optional string to compare to X-Telegram-Bot-Api-Secret-Token */
    secretToken?: string;
}

type Adapters = typeof adapters;
type AdapterNames = keyof Adapters;
type Adapter<A extends Adapters[AdapterNames]> = (
    ...args: Parameters<A>
) => ReturnType<A>["handlerReturn"] extends undefined ? Promise<void>
    : NonNullable<ReturnType<A>["handlerReturn"]>;
type WebhookAdapter<
    C extends Context = Context,
    A extends Adapters[AdapterNames] = Adapters[AdapterNames],
> = {
    (
        bot: Bot<C>,
        webhookOptions?: WebhookOptions,
    ): Adapter<A>;
    (
        bot: Bot<C>,
        onTimeout?: WebhookOptions["onTimeout"],
        timeoutMilliseconds?: WebhookOptions["timeoutMilliseconds"],
        secretToken?: WebhookOptions["secretToken"],
    ): Adapter<A>;
};

function createWebhookAdapter<
    C extends Context = Context,
    A extends Adapters[AdapterNames] = Adapters[AdapterNames],
>(adapter: A): WebhookAdapter<C, A> {
    return (
        bot: Bot<C>,
        onTimeout?:
            | WebhookOptions
            | WebhookOptions["onTimeout"],
        timeoutMilliseconds?: WebhookOptions["timeoutMilliseconds"],
        secretToken?: WebhookOptions["secretToken"],
    ) => {
        const {
            onTimeout: timeout = "throw",
            timeoutMilliseconds: ms = 10_000,
            secretToken: token,
        } = typeof onTimeout === "object"
            ? onTimeout
            : { onTimeout, timeoutMilliseconds, secretToken };

        return webhookCallback(bot, adapter, timeout, ms, token);
    };
}
// TODO: add docs examples for each adapter?
/**
 * Contains factories of callback function that you can pass to a web framework
 * (such as express) if you want to run your bot via webhooks. Use it like this:
 * ```ts
 * const app = express() // or whatever you're using
 * const bot = new Bot('<token>')
 *
 * app.use(webhookAdapters.express(bot))
 * ```
 *
 * Confer the grammY
 * [documentation](https://grammy.dev/guide/deployment-types) to read more
 * about how to run your bot with webhooks.
 *
 * @param bot The bot for which to create a callback
 * @param webhookOptions Further options for the webhook setup
 */
export const webhookAdapters = {
    awsLambda: createWebhookAdapter(adapters.awsLambda),
    awsLambdaAsync: createWebhookAdapter(adapters.awsLambdaAsync),
    azure: createWebhookAdapter(adapters.azure),
    bun: createWebhookAdapter(adapters.bun),
    cloudflare: createWebhookAdapter(adapters.cloudflare),
    cloudflareModule: createWebhookAdapter(adapters.cloudflareModule),
    express: createWebhookAdapter(adapters.express),
    fastify: createWebhookAdapter(adapters.fastify),
    hono: createWebhookAdapter(adapters.hono),
    http: createWebhookAdapter(adapters.http),
    https: createWebhookAdapter(adapters.http),
    koa: createWebhookAdapter(adapters.koa),
    nextJs: createWebhookAdapter(adapters.nextJs),
    nhttp: createWebhookAdapter(adapters.nhttp),
    oak: createWebhookAdapter(adapters.oak),
    serveHttp: createWebhookAdapter(adapters.serveHttp),
    stdHttp: createWebhookAdapter(adapters.stdHttp),
    sveltekit: createWebhookAdapter(adapters.sveltekit),
    worktop: createWebhookAdapter(adapters.worktop),
    callback: createWebhookAdapter(adapters.callback),
};

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
function webhookCallback<C extends Context = Context>(
    bot: Bot<C>,
    adapter: FrameworkAdapter | AdapterNames,
    onTimeout: Exclude<WebhookOptions["onTimeout"], undefined>,
    timeoutMilliseconds: Exclude<
        WebhookOptions["timeoutMilliseconds"],
        undefined
    >,
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

    let initialized = false;
    const server: FrameworkAdapter = typeof adapter === "string"
        ? adapters[adapter]
        : adapter;
    return async (...args: any[]) => {
        const { update, respond, unauthorized, end, handlerReturn, header } =
            server(...args);
        if (!initialized) {
            // Will dedupe concurrently incoming calls from several updates
            await bot.init();
            initialized = true;
        }
        if (header !== secretToken) {
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
            typeof onTimeout === "function"
                ? () => onTimeout(...args)
                : onTimeout,
            timeoutMilliseconds,
        );
        if (!usedWebhookReply) end?.();
        return handlerReturn;
    };
}

function timeoutIfNecessary(
    task: Promise<void>,
    onTimeout: "throw" | "ignore" | (() => unknown),
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
