// deno-lint-ignore-file camelcase
import { BotError, Composer, run } from "./composer.ts";
import { Context } from "./context.ts";
import { Api } from "./core/api.ts";
import {
    type ApiClientOptions,
    type WebhookReplyEnvelope,
} from "./core/client.ts";
import { GrammyError, HttpError } from "./core/error.ts";
import { debug as d } from "./platform.deno.ts";
import { type Update, type UserFromGetMe } from "./types.ts";
const debug = d("grammy:bot");
const debugErr = d("grammy:error");

/**
 * Options that can be specified when running the bot via simple long polling.
 */
export interface PollingOptions {
    /**
     * Limits the number of updates to be retrieved per `getUpdates` call.
     * Values between 1-100 are accepted. Defaults to 100.
     */
    limit?: number;
    /**
     * Timeout in seconds for long polling. grammY uses 30 seconds as a default
     * value.
     */
    timeout?: number;
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
    allowed_updates?: ReadonlyArray<Exclude<keyof Update, "update_id">>;
    /**
     * Pass True to drop all pending updates before starting the long polling.
     */
    drop_pending_updates?: boolean;
    /**
     * Pass False to prevent webhook deletion on the start of long polling.
     * Note that this will result in immediate error response from Telegram
     * server is webhook is set somewhere else.
     */
    delete_webhook_on_polling?: boolean;
    /**
     * A callback function that is useful for logging (or setting up middleware
     * if you did not do this before). It will be executed after the setup of
     * the bot has completed, and immediately before the first updates are being
     * fetched. The bot information `bot.botInfo` will be available when the
     * function is run. For convenience, the callback function receives the
     * value of `bot.botInfo` as an argument.
     */
    onStart?: (botInfo: UserFromGetMe) => void | Promise<void>;
}

export { BotError };
/**
 * Error handler that can be installed on a bot to catch error thrown by
 * middleware.
 */
export type ErrorHandler<C extends Context = Context> = (
    error: BotError<C>,
) => unknown;

/**
 * Options to pass to the bot when creating it.
 */
export interface BotConfig<C extends Context> {
    /**
     * You can specify a number of advanced options under the `client` property.
     * The options will be passed to the grammY client—this is the part of
     * grammY that actually connects to the Telegram Bot API server in the end
     * when making HTTP requests.
     */
    client?: ApiClientOptions;
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
    botInfo?: UserFromGetMe;
    /**
     * Pass the constructor of a custom context object that will be used when
     * creating the context for each incoming update.
     */
    ContextConstructor?: new (
        ...args: ConstructorParameters<typeof Context>
    ) => C;
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
export class Bot<
    C extends Context = Context,
    A extends Api = Api,
> extends Composer<C> {
    private pollingRunning = false;
    private pollingAbortController: AbortController | undefined;
    private lastTriedUpdateId = 0;
    private deleteWebhookOnPolling = true;

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
    public readonly api: A;

    private me: UserFromGetMe | undefined;
    private mePromise: Promise<UserFromGetMe> | undefined;
    private readonly clientConfig: ApiClientOptions | undefined;

    private readonly ContextConstructor: new (
        ...args: ConstructorParameters<typeof Context>
    ) => C;

    /**
     * Holds the bot's error handler that is invoked whenever middleware throws
     * (rejects). If you set your own error handler via `bot.catch`, all that
     * happens is that this variable is assigned.
     */
    public errorHandler: ErrorHandler<C> = async (err) => {
        console.error(
            "Error in middleware while handling update",
            err.ctx?.update?.update_id,
            err.error,
        );
        console.error("No error handler was set!");
        console.error("Set your own error handler with `bot.catch = ...`");
        if (this.pollingRunning) {
            console.error("Stopping bot");
            await this.stop();
        }
        throw err;
    };

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
        super();
        if (!token) throw new Error("Empty token!");
        this.me = config?.botInfo;
        this.clientConfig = config?.client;
        this.ContextConstructor = config?.ContextConstructor ??
            (Context as unknown as new (
                ...args: ConstructorParameters<typeof Context>
            ) => C);
        this.api = new Api(token, this.clientConfig) as A;
    }

    /**
     * Information about the bot itself as retrieved from `api.getMe()`. Only
     * available after the bot has been initialized via `await bot.init()`, or
     * after the value has been set manually.
     *
     * Starting the bot will always perform the initialization automatically,
     * unless a manual value is already set.
     *
     * Note that the recommended way to set a custom bot information object is
     * to pass it to the configuration object of the `new Bot()` instantiation,
     * rather than assigning this property.
     */
    public set botInfo(botInfo: UserFromGetMe) {
        this.me = botInfo;
    }
    public get botInfo(): UserFromGetMe {
        if (this.me === undefined) {
            throw new Error(
                "Bot information unavailable! Make sure to call `await bot.init()` before accessing `bot.botInfo`!",
            );
        }
        return this.me;
    }

    /**
     * Checks if the bot has been initialized. A bot is initialized if the bot
     * information is set. The bot information can either be set automatically
     * by calling `bot.init`, or manually through the bot constructor. Note that
     * usually, initialization is done automatically and you do not have to care
     * about this method.
     *
     * @returns true if the bot is initialized, and false otherwise
     */
    isInited() {
        return this.me !== undefined;
    }

    /**
     * Initializes the bot, i.e. fetches information about the bot itself. This
     * method is called automatically, you usually don't have to call it
     * manually.
     */
    async init() {
        if (!this.isInited()) {
            debug("Initializing bot");
            this.mePromise ??= withRetries(() => this.api.getMe());
            let me: UserFromGetMe;
            try {
                me = await this.mePromise;
            } finally {
                this.mePromise = undefined;
            }
            if (this.me === undefined) this.me = me;
            else debug("Bot info was set by now, will not overwrite");
        }
        debug(`I am ${this.me!.username}!`);
    }

    /**
     * Internal. Do not call. Handles an update batch sequentially by supplying
     * it one-by-one to the middleware. Handles middleware errors and stores the
     * last update identifier that was being tried to handle.
     *
     * @param updates An array of updates to handle
     */
    private async handleUpdates(updates: Update[]) {
        // handle updates sequentially (!)
        for (const update of updates) {
            this.lastTriedUpdateId = update.update_id;
            try {
                await this.handleUpdate(update);
            } catch (err) {
                // should always be true
                if (err instanceof BotError) {
                    await this.errorHandler(err);
                } else {
                    console.error("FATAL: grammY unable to handle:", err);
                    throw err;
                }
            }
        }
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
        webhookReplyEnvelope?: WebhookReplyEnvelope,
    ) {
        if (this.me === undefined) {
            throw new Error(
"Bot not initialized! Either call `await bot.init()`, \
or directly set the `botInfo` option in the `Bot` constructor to specify \
a known bot info object.",
            );
        }
        debug(`Processing update ${update.update_id}`);
        // create API object
        const api = new Api(
            this.token,
            this.clientConfig,
            webhookReplyEnvelope,
        );
        // configure it with the same transformers as bot.api
        const t = this.api.config.installedTransformers();
        if (t.length > 0) api.config.use(...t);
        // create context object
        const ctx = new this.ContextConstructor(update, api, this.me);
        try {
            // run middleware stack
            await run(this.middleware(), ctx);
        } catch (err) {
            debugErr(`Error in middleware for update ${update.update_id}`);
            throw new BotError<C>(err, ctx);
        }
    }

    /**
     * Starts your bot using long polling.
     *
     * > This method returns a `Promise` that will never resolve except if your
     * > bot is stopped. **You don't need to `await` the call to `bot.start`**,
     * > but remember to catch potential errors by calling `bot.catch`.
     * > Otherwise your bot will crash (and stop) if something goes wrong in
     * > your code.
     *
     * This method effectively enters a loop that will repeatedly call
     * `getUpdates` and run your middleware for every received update, allowing
     * your bot to respond to messages.
     *
     * If your bot is already running, this method does nothing.
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
        // Perform setup
        if (!this.isInited()) await this.init();
        if (this.pollingRunning) {
            debug("Simple long polling already running!");
            return;
        }

        if (options?.delete_webhook_on_polling === false) {
            await withRetries(() =>
                this.api.deleteWebhook({
                    drop_pending_updates: options?.drop_pending_updates,
                })
            );
        }
        else {
            debug("deleteWebhook is skipped");
        }

        // All async ops of setup complete, run callback
        await options?.onStart?.(this.botInfo);

        // Prevent common misuse that causes memory leak
        this.use = () => {
            throw new Error(`It looks like you are registering more listeners \
on your bot from within other listeners! This means that every time your bot \
handles a message like this one, new listeners will be added. This list grows until \
your machine crashes, so grammY throws this error to tell you that you should \
probably do things a bit differently. If you're unsure how to resolve this problem, \
you can ask in the group chat: https://telegram.me/grammyjs

On the other hand, if you actually know what you're doing and you do need to install \
further middleware while your bot is running, consider installing a composer \
instance on your bot, and in turn augment the composer after the fact. This way, \
you can circumvent this protection against memory leaks.`);
        };

        // Start polling
        debug("Starting simple long polling");
        await this.loop(options);
        debug("Middleware is done running");
    }

    /**
     * Stops the bot from long polling.
     *
     * All middleware that is currently being executed may complete, but no
     * further `getUpdates` calls will be performed. The current `getUpdates`
     * request will be cancelled.
     *
     * In addition, this method will _confirm_ the last received update to the
     * Telegram servers by calling `getUpdates` one last time with the latest
     * offset value. If any updates are received in this call, they are
     * discarded and will be fetched again when the bot starts up the next time.
     * Confer the official documentation on confirming updates if you want to
     * know more: https://core.telegram.org/bots/api#getupdates
     *
     * > Note that this method will not wait for the middleware stack to finish.
     * > If you need to run code after all middleware is done, consider waiting
     * > for the promise returned by `bot.start()` to resolve.
     */
    async stop() {
        if (this.pollingRunning) {
            debug("Stopping bot, saving update offset");
            this.pollingRunning = false;
            this.pollingAbortController?.abort();
            const offset = this.lastTriedUpdateId + 1;
            await this.api.getUpdates({ offset, limit: 1 });
            this.pollingAbortController = undefined;
        } else {
            debug("Bot is not running!");
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
        this.errorHandler = errorHandler;
    }

    /**
     * Internal. Do not call. Enters a loop that will perform long polling until
     * the bot is stopped.
     */
    private async loop(options?: PollingOptions) {
        this.pollingRunning = true;
        this.pollingAbortController = new AbortController();

        const limit = options?.limit;
        const timeout = options?.timeout ?? 30; // seconds
        let allowed_updates = options?.allowed_updates;

        while (this.pollingRunning) {
            // fetch updates
            const updates = await this.fetchUpdates(
                { limit, timeout, allowed_updates },
            );
            // check if polling stopped
            if (updates === undefined) break;
            // handle updates
            await this.handleUpdates(updates);
            // Telegram uses the last setting if `allowed_updates` is omitted so
            // we can save same traffic by only sending it in the first request
            allowed_updates = undefined;
        }
    }

    /**
     * Internal. Do not call. Reliably fetches an update batch via `getUpdates`.
     * Handles all known errors. Returns `undefined` if the bot is stopped and
     * the call gets cancelled.
     *
     * @param options Polling options
     * @returns An array of updates, or `undefined` if the bot is stopped.
     */
    private async fetchUpdates(
        { limit, timeout, allowed_updates }: PollingOptions,
    ) {
        const offset = this.lastTriedUpdateId + 1;
        let updates: Update[] | undefined = undefined;
        do {
            try {
                updates = await this.api.getUpdates(
                    { offset, limit, timeout, allowed_updates },
                    this.pollingAbortController?.signal,
                );
            } catch (error) {
                await this.handlePollingError(error);
            }
        } while (updates === undefined && this.pollingRunning);
        return updates;
    }

    /**
     * Internal. Do not call. Handles an error that occurred during long
     * polling.
     */
    private async handlePollingError(error: unknown) {
        if (!this.pollingRunning) {
            debug("Pending getUpdates request cancelled");
            return;
        }
        let sleepSeconds = 3;
        if (error instanceof GrammyError) {
            debugErr(error.message);
            if (error.error_code === 401) {
                debugErr(
                    "Make sure you are using the bot token you obtained from @BotFather (https://t.me/BotFather).",
                );
                throw error;
            } else if (error.error_code === 409) {
                debugErr(
                    "Consider revoking the bot token if you believe that no other instance is running.",
                );
                throw error;
            } else if (error.error_code === 429) {
                debugErr("Bot API server is closing.");
                sleepSeconds = error.parameters.retry_after ?? sleepSeconds;
            }
        } else debugErr(error);
        debugErr(
            `Call to getUpdates failed, retrying in ${sleepSeconds} seconds ...`,
        );
        await sleep(sleepSeconds);
    }
}

/**
 * Performs a network call task, retrying upon known errors until success.
 *
 * @param task Async task to perform
 */
async function withRetries<T>(task: () => Promise<T>): Promise<T> {
    let result: { ok: false } | { ok: true; value: T } = { ok: false };
    while (!result.ok) {
        try {
            result = { ok: true, value: await task() };
        } catch (error) {
            debugErr(error);
            if (error instanceof HttpError) continue;
            if (error instanceof GrammyError) {
                if (error.error_code >= 500) continue;
                if (error.error_code === 429) {
                    const retryAfter = error.parameters.retry_after;
                    if (retryAfter !== undefined) await sleep(retryAfter);
                    continue;
                }
            }
            throw error;
        }
    }
    return result.value;
}

/**
 * Returns a new promise that resolves after the specified number of seconds.
 */
function sleep(seconds: number) {
    return new Promise((r) => setTimeout(r, 1000 * seconds));
}
