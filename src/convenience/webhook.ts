// deno-lint-ignore-file no-explicit-any
import { type Bot } from "../bot.ts";
import { type Context } from "../context.ts";
import { type WebhookReplyEnvelope } from "../core/client.ts";
import { debug as d, defaultAdapter } from "../platform.deno.ts";
import { type Update } from "../types.ts";
import {
    adapters as nativeAdapters,
    type AzureAdapter,
    type CloudflareAdapter,
    type CloudflareModuleAdapter,
    type ExpressAdapter,
    type FastifyAdapter,
    type FrameworkAdapter,
    type HonoAdapter,
    type HttpAdapter,
    type KoaAdapter,
    type LambdaAdapter,
    type LambdaAsyncAdapter,
    type NextAdapter,
    type NHttpAdapter,
    type OakAdapter,
    type ServeHttpAdapter,
    type StdHttpAdapter,
    type SupportedFrameworks,
    type SveltekitAdapter,
    type WorktopAdapter,
} from "./frameworks.ts";
const debugErr = d("grammy:error");

type Handler<A extends (...args: any[]) => { handlerReturn?: unknown }> = (
    ...args: Parameters<A>
) => ReturnType<A>["handlerReturn"];

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
 * @deprecated This function will be removed in the next major version
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

export function webhookCallback<
    C extends Context = Context,
    A extends LambdaAdapter = LambdaAdapter,
>(
    bot: Bot<C>,
    adapter?: "aws-lambda",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends LambdaAsyncAdapter = LambdaAsyncAdapter,
>(
    bot: Bot<C>,
    adapter?: "aws-lambda-async",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends AzureAdapter = AzureAdapter,
>(
    bot: Bot<C>,
    adapter?: "azure",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends CloudflareAdapter = CloudflareAdapter,
>(
    bot: Bot<C>,
    adapter?: "cloudflare",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends CloudflareModuleAdapter = CloudflareModuleAdapter,
>(
    bot: Bot<C>,
    adapter?: "cloudflare-mod",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends ExpressAdapter = ExpressAdapter,
>(
    bot: Bot<C>,
    adapter?: "express",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends FastifyAdapter = FastifyAdapter,
>(
    bot: Bot<C>,
    adapter?: "fastify",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends HonoAdapter = HonoAdapter,
>(
    bot: Bot<C>,
    adapter?: "hono",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends HttpAdapter = HttpAdapter,
>(
    bot: Bot<C>,
    adapter?: "http" | "https",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends KoaAdapter = KoaAdapter,
>(
    bot: Bot<C>,
    adapter?: "koa",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends NextAdapter = NextAdapter,
>(
    bot: Bot<C>,
    adapter?: "next-js",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends NHttpAdapter = NHttpAdapter,
>(
    bot: Bot<C>,
    adapter?: "nhttp",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends OakAdapter = OakAdapter,
>(
    bot: Bot<C>,
    adapter?: "oak",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends ServeHttpAdapter = ServeHttpAdapter,
>(
    bot: Bot<C>,
    adapter?: "serveHttp",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends StdHttpAdapter = StdHttpAdapter,
>(
    bot: Bot<C>,
    adapter?: "std/http",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends SveltekitAdapter = SveltekitAdapter,
>(
    bot: Bot<C>,
    adapter?: "sveltekit",
    webhookOptions?: WebhookOptions,
): Handler<A>;

export function webhookCallback<
    C extends Context = Context,
    A extends WorktopAdapter = WorktopAdapter,
>(
    bot: Bot<C>,
    adapter?: "worktop",
    webhookOptions?: WebhookOptions,
): Handler<A>;

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
        const { update, respond, unauthorized, end, handlerReturn, header } =
            server(...args);
        if (!initialized) {
            // Will dedupe concurrently incoming calls from several updates
            await bot.init();
            initialized = true;
        }
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
