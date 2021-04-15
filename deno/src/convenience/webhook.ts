// deno-lint-ignore-file no-explicit-any
import { Bot } from '../bot.ts'
import { debug as d, Update } from '../platform.ts'
import { WebhookReplyEnvelope } from '../core/client.ts'
const debugErr = d('grammy:error')

/**
 * HTTP Web frameworks for which grammY provides compatible callback out of the
 * box.
 */
type SupportedFrameworks =
    | 'express'
    | 'http'
    | 'https'
    | 'koa'
    | 'oak'
    | 'fastify'
type FrameworkAdapter = (
    ...args: any[]
) => {
    update: Update
    respond: (json: string) => unknown
}

const standard: FrameworkAdapter = (req, res) => ({
    update: req.body,
    respond: json => res.send(json),
})
const withCtx: FrameworkAdapter = ctx => ({
    update: ctx.req.body,
    respond: json => (ctx.response.body = json),
})

const frameworkAdapters: Record<SupportedFrameworks, FrameworkAdapter> = {
    express: standard,
    http: standard,
    https: standard,
    koa: withCtx,
    oak: withCtx,
    fastify: standard,
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
 * [documentation](https://grammy.netlify.app/guide/deployment-types.html) to
 * read more about how to run your bot with webhooks.
 *
 * @param bot The bot for which to create a callback
 * @param framework An optional string identifying the framework (default:
 * 'express')
 * @param onTimeout An optional strategy to handle timeouts (default: 'throw')
 * @param timeoutMilliseconds An optional number of timeout milliseconds
 * (default: 10_000)
 */
export function webhookCallback(
    bot: Bot,
    framework: SupportedFrameworks = 'express',
    onTimeout: 'throw' | 'return' | ((...args: any[]) => unknown) = 'throw',
    timeoutMilliseconds = 10_000
) {
    const server = frameworkAdapters[framework] ?? standard
    let firstUpdate = true
    let initialized = false
    let initCall: Promise<void> | undefined
    return async (...args: any[]) => {
        const { update, respond } = server(...args)
        const webhookReplyEnvelope: WebhookReplyEnvelope = {
            send: async json => {
                await respond(json)
            },
        }
        if (!initialized) {
            if (firstUpdate) {
                initCall = bot.init()
                firstUpdate = false
            }
            await initCall
            initialized = true
        }
        await timeoutIfNecessary(
            bot.handleUpdate(update, webhookReplyEnvelope),
            typeof onTimeout === 'function'
                ? () => onTimeout(...args)
                : onTimeout,
            timeoutMilliseconds
        )
    }
}

function timeoutIfNecessary(
    task: Promise<void>,
    onTimeout: 'throw' | 'return' | (() => unknown),
    timeout: number
): Promise<void> {
    if (timeout === Infinity) return task
    return new Promise((resolve, reject) => {
        const handle = setTimeout(() => {
            if (onTimeout === 'throw') {
                reject(new Error(`Request timed out after ${timeout} ms`))
            } else {
                if (typeof onTimeout === 'function') onTimeout()
                resolve()
            }
            const now = Date.now()
            task.finally(() => {
                const diff = Date.now() - now
                debugErr(`Request completed ${diff} ms after timeout!`)
            })
        }, timeout)
        task.then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(handle))
    })
}
