// deno-lint-ignore-file no-explicit-any
import { createDebug } from "@grammyjs/debug";
import type { Bot } from "../bot.ts";
import type { Context } from "../context.ts";
import type { WebhookReplyEnvelope } from "../core/client.ts";
import type { Update } from "../types.ts";
import { adapters, type FrameworkAdapter } from "./frameworks.ts";

const debugErr = createDebug("grammy:error");

const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token" as const;

// const callbackAdapter: FrameworkAdapter = (
//     update: Update,
//     callback: (json: string) => unknown,
//     header: string,
//     unauthorized = () => callback(WRONG_TOKEN_ERROR),
//     badRequest = () => callback(BAD_REQUEST_ERROR),
// ) => ({
//     update: Promise.resolve(update),
//     respond: callback,
//     header,
//     unauthorized,
//     badRequest,
// });
// const adapters = { ...nativeAdapters, callback: callbackAdapter };

export interface WebhookOptions {
    /** An optional strategy to handle timeouts (default: 'throw') */
    onTimeout?: "throw" | ((...args: any[]) => unknown);
    /** An optional number of timeout milliseconds (default: 10_000) */
    timeoutMilliseconds?: number;
    /** An optional string to compare to X-Telegram-Bot-Api-Secret-Token */
    secretToken?: string;
    /** An optional path to check against request path */
    path?: string;
}

type Adapters = typeof adapters[keyof typeof adapters];

// assume that ok is typical handler signature
type WebhookAdapter<
    A extends Adapters,
    T extends A["ok"],
    C extends Context = Context,
> = {
    (
        bot: Bot<C>,
        webhookOptions?: WebhookOptions,
    ): (...args: Parameters<T>) => Promise<ReturnType<T>>;
};

function createWebhookAdapter<
    A extends Adapters,
    T extends A["ok"],
    C extends Context = Context,
>(adapter: FrameworkAdapter<T>): WebhookAdapter<A, T, C> {
    return (
        bot: Bot<C>,
        options?: WebhookOptions,
    ) => webhookCallback(bot, adapter, options);
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
    get awsLambda() {
        return createWebhookAdapter(adapters.awsLambda);
    },
    get awsLambdaAsync() {
        return createWebhookAdapter(adapters.awsLambdaAsync);
    },
    get azure() {
        return createWebhookAdapter(adapters.azure);
    },
    get bun() {
        return createWebhookAdapter(adapters.bun);
    },
    get cloudflare() {
        return createWebhookAdapter(adapters.cloudflare);
    },
    get cloudflareModule() {
        return createWebhookAdapter(adapters.cloudflareModule);
    },
    get express() {
        return createWebhookAdapter(adapters.express);
    },
    get fastify() {
        return createWebhookAdapter(adapters.fastify);
    },
    get hono() {
        return createWebhookAdapter(adapters.hono);
    },
    get http() {
        return createWebhookAdapter(adapters.http);
    },
    get https() {
        return createWebhookAdapter(adapters.http);
    },
    get koa() {
        return createWebhookAdapter(adapters.koa);
    },
    get nextJs() {
        return createWebhookAdapter(adapters.nextJs);
    },
    get nhttp() {
        return createWebhookAdapter(adapters.nhttp);
    },
    get oak() {
        return createWebhookAdapter(adapters.oak);
    },
    get serveHttp() {
        return createWebhookAdapter(adapters.serveHttp);
    },
    get stdHttp() {
        return createWebhookAdapter(adapters.stdHttp);
    },
    get sveltekit() {
        return createWebhookAdapter(adapters.sveltekit);
    },
    get worktop() {
        return createWebhookAdapter(adapters.worktop);
    },
    // get callback() {
    //     return createWebhookAdapter(adapters.callback);
    // },
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
function webhookCallback<
    A extends Adapters,
    T extends A["ok"],
    C extends Context = Context,
>(
    bot: Bot<C>,
    handler: FrameworkAdapter<T>,
    options?: WebhookOptions,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
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

    return async (...args: Parameters<T>) => {
        const {
            receive,
            ok,
            success,
            badRequest,
            unauthorized,
            notFound,
        } = handler;
        const {
            path,
            header,
            update,
            extra,
        } = receive(...args);

        if (!initialized) {
            // Will dedupe concurrently incoming calls from several updates
            await bot.init();
            initialized = true;
        }
        if (
            secretToken !== undefined && header(SECRET_HEADER) !== secretToken
        ) {
            return unauthorized(...args);
        }
        if (options?.path !== undefined && options.path !== path()) {
            return notFound(...args);
        }
        if (extra) {
            await extra(...args);
        }
        const updateData = await update().catch(() => ({} as Update));
        if (
            updateData?.update_id === undefined || updateData.update_id <= 0
        ) {
            return badRequest(...args);
        }

        let usedWebhookReply = false;
        const webhookReplyEnvelope: WebhookReplyEnvelope = {
            send(json) {
                usedWebhookReply = true;
                success(json, ...args);
            },
        };
        await timeoutIfNecessary(
            bot.handleUpdate(updateData, webhookReplyEnvelope),
            typeof onTimeout === "function"
                ? () => onTimeout(...args)
                : onTimeout,
            timeoutMilliseconds,
        );

        if (!usedWebhookReply) return ok(...args);

        // TODO: what we should return?
        return success("Ok", ...args);
    };
}

function timeoutIfNecessary(
    task: Promise<void>,
    onTimeout: "throw" | (() => unknown), // need async?
    timeout: number,
): Promise<void> {
    if (timeout === Infinity) return task;
    const { promise, resolve, reject } = Promise.withResolvers<void>();

    const handle = setTimeout(() => {
        debugErr(`Request timed out after ${timeout} ms`);
        if (onTimeout === "throw") {
            reject(new Error(`Request timed out after ${timeout} ms`));
        } else {
            onTimeout();
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

    return promise;
}
