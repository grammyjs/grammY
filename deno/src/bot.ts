// deno-lint-ignore-file camelcase
import { BotError, Composer, run } from './composer.ts'
import { Context } from './context.ts'
import { Api } from './core/api.ts'
import { ApiClientOptions, WebhookReplyEnvelope } from './core/client.ts'
import { Update, debug as d, UserFromGetMe } from './platform.ts'
const debug = d('grammy:bot')
const debugErr = d('grammy:error')

/**
 * Options that can be specified when running the bot via simple long polling.
 */
export interface PollingOptions {
    /**
     * Limits the number of updates to be retrieved per `getUpdates` call.
     * Values between 1-100 are accepted. Defaults to 100.
     */
    limit?: number
    /**
     * Timeout in seconds for long polling. grammY uses 30 seconds as a default
     * value.
     */
    timeout?: number
    /**
     * A list of the update types you want your bot to receive. For example,
     * specify [“message”, “edited_channel_post”, “callback_query”] to only
     * receive updates of these types. See Update for a complete list of
     * available update types. Specify an empty list to receive all update types
     * except chat_member (default). If not specified, the previous setting will
     * be used.
     *
     * Please note that this parameter doesn't affect updates created before the
     * call to the getUpdates, so unwanted updates may be received for a short
     * period of time.
     */
    allowed_updates?: ReadonlyArray<Exclude<keyof Update, 'update_id'>>
    /**
     * Pass True to drop all pending updates before starting the long polling.
     */
    drop_pending_updates?: boolean
}

export { BotError }
/**
 * Error handler that can be installed on a bot to catch error thrown by
 * middleware.
 */
export type ErrorHandler<C extends Context = Context> = (
    error: BotError<C>
) => unknown

/**
 * Options to pass the bot when creating it.
 */
export interface BotConfig<C extends Context> {
    /**
     * You can specify a number of advanced options under the `client` property.
     * The options will be passed to the grammY client—this is the part of
     * grammY that actually connects to the Telegram Bot API server in the end
     * when making HTTP requests.
     */
    client?: ApiClientOptions
    /**
     * grammY automatically calls `getMe` when starting up to make sure that
     * your bot has access to the bot's own information. If you restart your bot
     * often, for example because it is running in a serverless environment,
     * then you may want to skip this initial API call.
     *
     * Set this property of the options to pre-initialize the bot with cached
     * values. If you use this option, grammY will not attempt to make a `getMe`
     * call but use the provided data instead.
     */
    botInfo?: UserFromGetMe
    /**
     * Pass the constructor of a custom context object that will be used when
     * creating the context for each incoming update.
     */
    ContextConstructor?: new (
        ...args: ConstructorParameters<typeof Context>
    ) => C
}

/**
 * This is the single most important class of grammY. It represents your bot.
 *
 * First, you must create a bot by talking to @BotFather, check out
 * https://t.me/BotFather. Once it is ready, you obtain a secret token for your
 * bot. grammY will use that token to identify as your bot when talking to the
 * Telegram servers. Got the token? You are now ready to write some code and run
 * your bot!
 *
 * You should do three things to run your bot:
 * ```ts
 * // 1. Create a bot instance
 * const bot = new Bot('<secret-token>')
 * // 2. Listen for updates
 * bot.on('message:text', ctx => ctx.reply('You wrote: ' + ctx.message.text))
 * // 3. Launch it!
 * bot.start()
 * ```
 */
export class Bot<C extends Context = Context> extends Composer<C> {
    private pollingRunning = false
    private pollingAbortController: AbortController | undefined
    private lastTriedUpdateId = 0

    /**
     * Gives you full access to the Telegram Bot API.
     * ```ts
     * // This is how to call the Bot API methods:
     * bot.api.sendMessage(chat_id, 'Hello, grammY!')
     * ```
     *
     * Use this only outside of your middleware. If you have access to `ctx`,
     * then using `ctx.api` instead of `bot.api` is preferred.
     */
    public readonly api: Api

    private botInfo: UserFromGetMe | undefined
    private readonly clientConfig: ApiClientOptions | undefined

    private readonly ContextConstructor: new (
        ...args: ConstructorParameters<typeof Context>
    ) => C

    /**
     * Holds the bot's error handler that is invoked whenever middleware throws
     * (rejects). If you set your own error handler via `bot.catch`, all that
     * happens is that this variable is assigned.
     */
    errorHandler: ErrorHandler<C> = async err => {
        console.error(
            'Error in middleware while handling update',
            err.ctx?.update?.update_id,
            err.error
        )
        console.error('No error handler was set!')
        console.error('Set your own error handler with `bot.catch = ...`')
        if (this.pollingRunning) {
            console.error('Stopping bot')
            await this.stop()
        }
        throw err
    }

    /**
     * Creates a new Bot with the given token.
     *
     * Remember that you can listen for messages by calling
     * ```ts
     * bot.on('message', ctx => { ... })
     * ```
     * or similar methods.
     *
     * The simplest way to start your bot is via simple long polling:
     * ```ts
     * bot.start()
     * ```
     *
     * @param token The bot's token as acquired from https://t.me/BotFather
     * @param config Optional configuration properties for the bot
     */
    constructor(public readonly token: string, config?: BotConfig<C>) {
        super()
        if (token.length === 0) throw new Error('Empty token!')
        this.botInfo = config?.botInfo
        this.clientConfig = config?.client
        this.ContextConstructor =
            config?.ContextConstructor ??
            (Context as new (
                ...args: ConstructorParameters<typeof Context>
            ) => C)
        this.api = new Api(token, this.clientConfig)
    }

    /**
     * Initializes the bot, i.e. fetches information about the bot itself. This
     * method is called automatically, you don't have to call it manually.
     */
    async init() {
        if (this.botInfo === undefined) {
            debug('Initializing bot')
            this.botInfo = await this.api.getMe()
        } else {
            debug('Bot already initialized!')
        }
        debug(`I am ${this.botInfo.username}!`)
    }

    /**
     * This is an internal method that you probably will not ever need to call.
     * It is used whenever a new update arrives from the Telegram servers that
     * your bot will handle.
     *
     * If you're writing a library on top of grammY, check out the
     * [documentation](https://grammy.dev/plugins/runner.html) of the runner
     * plugin for an example that uses this method.
     *
     * @param update An update from the Telegram Bot API
     * @param webhookReplyEnvelope An optional webhook reply envelope
     */
    async handleUpdate(
        update: Update,
        webhookReplyEnvelope?: WebhookReplyEnvelope
    ) {
        if (this.botInfo === undefined) throw new Error('Bot not initialized!')
        debug(`Processing update ${update.update_id}`)
        // create API object
        const api = new Api(this.token, this.clientConfig, webhookReplyEnvelope)
        // configure it with the same transformers as bot.api
        const t = this.api.config.installedTransformers()
        if (t.length > 0) api.config.use(...t)
        // create context object
        const ctx = new this.ContextConstructor(update, api, this.botInfo)
        try {
            // run middleware stack
            await run(this.middleware(), ctx)
        } catch (err) {
            debugErr(`Error in middleware for update ${update.update_id}`)
            throw new BotError<C>(err, ctx)
        }
    }

    /**
     * Starts your bot using long polling.
     *
     * This method effectively enters a loop that will repeatedly call
     * `getUpdates` and run your middleware for every received update, allowing
     * your bot to respond to messages.
     *
     * If your bot is already running, this method does nothing.
     *
     * This method returns a `Promise` that will never resolve except if your
     * bot is stopped. Remember to catch potential errors by calling
     * `bot.catch`, otherwise your bot will crash (and stop) if something goes
     * wrong in your code.
     *
     * **Note that this starts your bot using a very simple long polling
     * implementation.** `bot.start` should only be used for small bots. While
     * the rest of grammY was built to perform well even under extreme loads,
     * simple long polling is not capable of scaling up in a similar fashion.
     * You should switch over to using `@grammyjs/runner` if you are running a
     * bot with high load.
     *
     * What exactly _high load_ means differs from bot to bot, but as a rule of
     * thumb, simple long polling should not be processing more than ~5K
     * messages every hour. Also, if your bot has long-running operations such
     * as large file transfers that block the middleware from completing, this
     * will impact the responsiveness negatively, so it makes sense to use the
     * `@grammyjs/runner` package even if you receive much fewer messages. If
     * you worry about how much load your bot can handle, check out the grammY
     * [documentation](https://grammy.dev/advanced/scaling.html) about scaling
     * up.
     *
     * @param options Options to use for simple long polling
     */
    async start(options?: PollingOptions) {
        await this.init()
        if (this.pollingRunning) {
            debug('Simple long polling already running!')
            return
        }
        await this.api.deleteWebhook({
            drop_pending_updates: options?.drop_pending_updates,
        })
        debug('Starting simple long polling')
        this.pollingRunning = true
        this.pollingAbortController = new AbortController()

        const limit = options?.limit
        const timeout = options?.timeout ?? 30 // seconds
        let allowed_updates = options?.allowed_updates

        while (this.pollingRunning) {
            // fetch updates
            const offset = this.lastTriedUpdateId + 1
            let updates: Update[] | undefined = undefined
            do {
                try {
                    updates = await this.api.getUpdates(
                        { offset, limit, timeout, allowed_updates },
                        this.pollingAbortController.signal
                    )
                } catch (error) {
                    if (this.pollingRunning) {
                        debugErr(
                            'Call to `getUpdates` failed, retrying in 3 seconds ...'
                        )
                        await new Promise(r => setTimeout(r, 3000))
                    } else {
                        throw error
                    }
                }
            } while (updates === undefined && this.pollingRunning)
            if (updates === undefined) break
            // handle them sequentially (!)
            for (const update of updates) {
                this.lastTriedUpdateId = update.update_id
                try {
                    await this.handleUpdate(update)
                } catch (err) {
                    // should always be true
                    if (err instanceof BotError) {
                        await this.errorHandler(err)
                    } else {
                        console.error('FATAL: grammY unable to handle:', err)
                        throw err
                    }
                }
            }
            // Telegram uses the last setting if `allowed_updates` is omitted so
            // we can save same traffic by only sending it in the first request
            allowed_updates = undefined
        }
    }

    /**
     * Stops the bot from long polling.
     *
     * All middleware that is currently being executed may complete, but no
     * further `getUpdates` calls will be performed. The current `getUpdates`
     * request will be cancelled (unless you know what Deno is and you're using
     * it, there cancelling requests is not supported yet).
     *
     * In addition, this method will _confirm_ the last received update to the
     * Telegram servers by calling `getUpdates` one last time with the latest
     * offset value. If any updates are received in this call, they are
     * discarded and will be fetched again when the bot starts up the next time.
     * Confer the official documentation on confirming updates if you want to
     * know more: https://core.telegram.org/bots/api#getupdates
     */
    async stop() {
        if (this.pollingRunning) {
            debug('Stopping bot, saving update offset')
            this.pollingRunning = false
            this.pollingAbortController?.abort()
            const offset = this.lastTriedUpdateId + 1
            await this.api.getUpdates({ offset, limit: 1 })
            this.pollingAbortController = undefined
        } else {
            debug('Bot is not running!')
        }
    }

    /**
     * Sets the bots error handler that is used during long polling.
     *
     * You should call this method to set an error handler if you are using long
     * polling, no matter whether you use `bot.start` or the `@grammyjs/runner`
     * package to run your bot.
     *
     * Calling `bot.catch` when using other means of running your bot (or
     * webhooks) has no effect.
     *
     * @param errorHandler A function that handles potential middleware errors
     */
    catch(errorHandler: ErrorHandler<C>) {
        this.errorHandler = errorHandler
    }
}
