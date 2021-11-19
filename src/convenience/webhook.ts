// deno-lint-ignore-file no-explicit-any
import { Bot } from "../bot.ts";
import { debug as d, Update } from "../platform.deno.ts";
import { WebhookReplyEnvelope } from "../core/client.ts";
import { Context } from "../context.ts";
const debugErr = d("grammy:error");

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */
type SupportedFrameworks =
    | "express"
    | "http"
    | "https"
    | "koa"
    | "oak"
    | "fastify"
    | "worktop"
    | "callback"
    | "aws-lambda"
    | "serveHttp";

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
}
/**
 * Middleware for a web framework. Creates a request-response handler for a
 * request. The handler will be used to integrate with the compatible framework.
 */
type FrameworkAdapter = (...args: any[]) => ReqResHandler;

const standard: FrameworkAdapter = (req, res) => ({
    update: Promise.resolve(req.body),
    end: () => res.end(),
    respond: (json) => {
        res.set("Content-Type", "application/json");
        res.send(json);
    },
});

// Integrations with popular frameworks
const frameworkAdapters: Record<SupportedFrameworks, FrameworkAdapter> = {
    express: standard,
    http: standard,
    https: standard,
    koa: (ctx) => ({
        update: Promise.resolve(ctx.request.body),
        end: () => (ctx.body = ""),
        respond: (json) => {
            ctx.set("Content-Type", "application/json");
            ctx.response.body = json;
        },
    }),
    oak: (ctx) => ({
        update: ctx.request.body({ type: "json" }).value,
        end: () => (ctx.response.status = 200),
        respond: (json) => {
            ctx.response.type = "json";
            ctx.response.body = json;
        },
    }),
    fastify: (req, reply) => ({
        update: Promise.resolve(req.body),
        end: () => reply.send({}),
        respond: (json) => reply.send(json),
    }),
    worktop: (req, res) => ({
        update: Promise.resolve(req.body.json()),
        end: () => res.end(),
        respond: (json) => res.send(200, json),
    }),
    callback: (update, callback) => ({
        update: update,
        respond: callback,
    }),
    "aws-lambda": (event, _context, callback) => ({
        update: JSON.parse(event.body),
        end: () => callback(null, { statusCode: 200 }),
        respond: (json) =>
            callback(null, {
                statusCode: 200,
                body: json,
            }),
    }),
    "serveHttp": (requestEvent) => ({
        update: Promise.resolve(requestEvent.request.json()),
        end: () =>
            requestEvent.respondWith(
                new Response(undefined, {
                    status: 200,
                }),
            ),
        respond: (json) =>
            requestEvent.respondWith(
                new Response(JSON.stringify(json), { status: 200 }),
            ),
    }),
    // please open a PR if you want to add another
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
    framework: SupportedFrameworks = "express",
    onTimeout: "throw" | "return" | ((...args: any[]) => unknown) = "throw",
    timeoutMilliseconds = 10_000,
) {
    const server = frameworkAdapters[framework] ?? standard;
    let firstUpdate = true;
    let initialized = false;
    let initCall: Promise<void> | undefined;
    return async (...args: any[]) => {
        const { update, respond, end } = server(...args);
        let usedWebhookReply = false;
        const webhookReplyEnvelope: WebhookReplyEnvelope = {
            send: async (json) => {
                usedWebhookReply = true;
                await respond(json);
            },
        };
        if (!initialized) {
            if (firstUpdate) {
                initCall = bot.init();
                firstUpdate = false;
            }
            await initCall;
            initialized = true;
        }
        await timeoutIfNecessary(
            bot.handleUpdate(await update, webhookReplyEnvelope),
            typeof onTimeout === "function"
                ? () => onTimeout(...args)
                : onTimeout,
            timeoutMilliseconds,
        );
        if (end !== undefined && !usedWebhookReply) end();
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
