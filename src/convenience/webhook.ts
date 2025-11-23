// deno-lint-ignore-file no-explicit-any
import { createDebug } from "@grammyjs/debug";
import type { Bot } from "../bot.ts";
import type { Context } from "../context.ts";
import type { WebhookReplyEnvelope } from "../client.ts";
import { type FrameworkAdapter, makeAdapters } from "./frameworks.ts";
const debugErr = createDebug("grammy:error");

export interface WebhookOptions {
    /** An optional strategy to handle timeouts (default: 'throw') */
    onTimeout?: "throw" | "ignore" | ((...args: any[]) => unknown);
    /** An optional number of timeout milliseconds (default: 10_000) */
    timeoutMilliseconds?: number;
    /** An optional string to compare to X-Telegram-Bot-Api-Secret-Token */
    secretToken?: string;
}

type Adapters = ReturnType<typeof makeAdapters>;
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
};

let adapters: Adapters | undefined;
function createWebhookAdapter<
    C extends Context = Context,
    A extends AdapterNames = AdapterNames,
>(adapterName: A): WebhookAdapter<C, Adapters[A]> {
    adapters ??= makeAdapters();
    const adapter = adapters[adapterName];
    return (bot: Bot<C>, options?: WebhookOptions) =>
        webhookCallback(bot, adapter, options);
}

// TODO: add docs examples for each adapter
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
    get callback() {
        return createWebhookAdapter("callback");
    },
    get awsLambda() {
        return createWebhookAdapter("awsLambda");
    },
    get awsLambdaAsync() {
        return createWebhookAdapter("awsLambdaAsync");
    },
    get azure() {
        return createWebhookAdapter("azure");
    },
    get bun() {
        return createWebhookAdapter("bun");
    },
    get cloudflare() {
        return createWebhookAdapter("cloudflare");
    },
    get cloudflareModule() {
        return createWebhookAdapter("cloudflareModule");
    },
    get elysia() {
        return createWebhookAdapter("elysia");
    },
    get express() {
        return createWebhookAdapter("express");
    },
    get fastify() {
        return createWebhookAdapter("fastify");
    },
    get hono() {
        return createWebhookAdapter("hono");
    },
    get http() {
        return createWebhookAdapter("http");
    },
    get https() {
        return createWebhookAdapter("http");
    },
    get koa() {
        return createWebhookAdapter("koa");
    },
    get nextJs() {
        return createWebhookAdapter("nextJs");
    },
    get nhttp() {
        return createWebhookAdapter("nhttp");
    },
    get oak() {
        return createWebhookAdapter("oak");
    },
    get serveHttp() {
        return createWebhookAdapter("serveHttp");
    },
    get stdHttp() {
        return createWebhookAdapter("stdHttp");
    },
    get sveltekit() {
        return createWebhookAdapter("sveltekit");
    },
    get worktop() {
        return createWebhookAdapter("worktop");
    },
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
    adapter: FrameworkAdapter,
    options?: WebhookOptions,
) {
    const {
        onTimeout = "throw",
        timeoutMilliseconds = 10_000,
        secretToken,
    } = options ?? {};

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

    return async (...args: any[]) => {
        const handler = adapter(...args);
        if (!initialized) {
            // Will dedupe concurrently incoming calls from several updates
            await bot.init();
            initialized = true;
        }
        if (handler.header !== secretToken) {
            await handler.unauthorized();
            return handler.handlerReturn;
        }
        const updateData = await handler.update();
        if (updateData?.update_id === undefined || updateData.update_id <= 0) {
            await handler.badRequest();
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
            bot.handleUpdate(updateData, webhookReplyEnvelope),
            typeof onTimeout === "function"
                ? () => onTimeout(...args)
                : onTimeout,
            timeoutMilliseconds,
        );
        if (!usedWebhookReply) handler.end?.();
        return handler.handlerReturn;
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
