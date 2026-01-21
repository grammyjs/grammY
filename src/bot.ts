// deno-lint-ignore-file camelcase
import { createDebug } from "@grammyjs/debug";
import {
    BotError,
    Composer,
    type Middleware,
    type ReactionMiddleware,
    run,
} from "./composer.ts";
import { Context, type MaybeArray, type ReactionContext } from "./context.ts";
import { Api } from "./api.ts";
import type { ApiClientOptions, WebhookReplyEnvelope } from "./client.ts";
import { GrammyError, HttpError } from "./error.ts";
import {
    type FilterQuery,
    type FilterQueryContext,
    parse,
    preprocess,
} from "./filter.ts";
import type {
    ReactionType,
    ReactionTypeEmoji,
    Update,
    UserFromGetMe,
} from "./types.ts";
const debug = createDebug("grammy:bot");
const debugWarn = createDebug("grammy:warn");
const debugErr = createDebug("grammy:error");

export const DEFAULT_UPDATE_TYPES = [
    "message",
    "edited_message",
    "channel_post",
    "edited_channel_post",
    "business_connection",
    "business_message",
    "edited_business_message",
    "deleted_business_messages",
    "inline_query",
    "chosen_inline_result",
    "callback_query",
    "shipping_query",
    "pre_checkout_query",
    "purchased_paid_media",
    "poll",
    "poll_answer",
    "my_chat_member",
    "chat_join_request",
    "chat_boost",
    "removed_chat_boost",
] as const;

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
     * specify ["message", "edited_channel_post", "callback_query"] to only
     * receive updates of these types. See Update for a complete list of
     * available update types. Specify an empty list to receive all update types
     * except chat_member, message_reaction, and message_reaction_count
     * (default). If not specified, the previous setting will be used.
     *
     * Please note that this parameter doesn't affect updates created before the
     * call to the getUpdates, so unwanted updates may be received for a short
     * period of time.
     */
    allowed_updates?: Array<Exclude<keyof Update, "update_id">>;
    /**
     * Pass True to drop all pending updates before starting the long polling.
     */
    drop_pending_updates?: boolean;
    /**
     * A callback function that is useful for logging (or setting up middleware
     * if you did not do this before). It will be executed after the setup of
     * the bot has completed, and immediately before the first updates are being
     * fetched. The bot information `bot.me` will be available when the function
     * is run. For convenience, the callback function receives the value of
     * `bot.me` as an argument.
     *
     * When this function is invoked, the bot already signals that it is
     * running. In other words, `bot.isRunning()` already returns true.
     */
    onStart?: (me: UserFromGetMe) => void | Promise<void>;
    onStop?: () => void | Promise<void>;
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
    me?: UserFromGetMe;
}

/**
 * This is the single most important class of grammY. It represents your bot.
 *
 * First, you must create a bot by talking to \@BotFather, check out
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
 * bot.on('message:text', ctx => ctx.send('You wrote: ' + ctx.message.text))
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

    private botInfo: UserFromGetMe | undefined;
    private mePromise: Promise<UserFromGetMe> | undefined;
    private readonly clientConfig: ApiClientOptions | undefined;

    /** Used to log a warning if some update types are not in allowed_updates */
    private observedUpdateTypes = new Set<string>();

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
        this.botInfo = config?.me;
        this.clientConfig = config?.client;
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
    public set me(me: UserFromGetMe) {
        this.botInfo = me;
    }
    public get me(): UserFromGetMe {
        if (this.botInfo === undefined) {
            throw new Error(
                "Bot information unavailable! Make sure to call `await bot.init()` before accessing `bot.me`!",
            );
        }
        return this.botInfo;
    }

    /**
     * @inheritdoc
     */
    override on<Q extends FilterQuery>(
        filter: Q | Q[],
        ...middleware: Array<Middleware<FilterQueryContext<C, Q>>>
    ): Composer<FilterQueryContext<C, Q>> {
        for (const [u] of parse(filter).flatMap(preprocess)) {
            this.observedUpdateTypes.add(u);
        }
        return super.on(filter, ...middleware);
    }
    /**
     * @inheritdoc
     */
    override reaction(
        reaction: MaybeArray<ReactionTypeEmoji["emoji"] | ReactionType>,
        ...middleware: Array<ReactionMiddleware<C>>
    ): Composer<ReactionContext<C>> {
        this.observedUpdateTypes.add("message_reaction");
        return super.reaction(reaction, ...middleware);
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
        return this.botInfo !== undefined;
    }

    /**
     * Initializes the bot, i.e. fetches information about the bot itself. This
     * method is called automatically, you usually don't have to call it
     * manually.
     *
     * @param signal Optional `AbortSignal` to cancel the initialization
     */
    async init(signal?: AbortSignal) {
        if (!this.isInited()) {
            debug("Initializing bot");
            this.mePromise ??= withRetries(
                () => this.api.getMe(undefined, signal),
                signal,
            );
            let me: UserFromGetMe;
            try {
                me = await this.mePromise;
            } finally {
                this.mePromise = undefined;
            }
            if (this.botInfo === undefined) this.botInfo = me;
            else debug("Bot info was set by now, will not overwrite");
        }
        debug(`I am ${this.botInfo!.username}!`);
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
            await this.handleUpdate(update);
        }
    }

    /**
     * This is an internal method that you probably will not ever need to call.
     * It is used whenever a new update arrives from the Telegram servers that
     * your bot will handle.
     *
     * If you're writing a library on top of grammY, check out the
     * [documentation](https://grammy.dev/plugins/runner) of the runner
     * plugin for an example that uses this method.
     *
     * @param update An update from the Telegram Bot API
     * @param webhookReplyEnvelope An optional webhook reply envelope
     */
    async handleUpdate(
        update: Update,
        webhookReplyEnvelope?: WebhookReplyEnvelope,
    ) {
        if (this.botInfo === undefined) {
            throw new Error(
                "Bot not initialized! Either call `await bot.init()`, \
or directly set the `me` option in the `Bot` constructor to specify \
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
        // create context object
        const ctx = new Context(update, api, this.botInfo) as C;
        try {
            // run middleware stack
            await run(this.middleware(), ctx);
        } catch (err) {
            debugErr(`Error in middleware for update ${update.update_id}`);
            await this.errorHandler(new BotError<C>(err, ctx));
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
     * @param options Options to use for simple long polling
     */
    async start(options?: PollingOptions) {
        // Perform setup
        const setup: Promise<void>[] = [];
        if (!this.isInited()) {
            setup.push(this.init(this.pollingAbortController?.signal));
        }
        if (this.pollingRunning) {
            await Promise.all(setup);
            debug("Simple long polling already running!");
            return;
        }

        this.pollingRunning = true;
        this.pollingAbortController = new AbortController();
        try {
            setup.push(withRetries(async () => {
                await this.api.deleteWebhook({
                    drop_pending_updates: options?.drop_pending_updates,
                }, this.pollingAbortController?.signal);
            }, this.pollingAbortController?.signal));
            await Promise.all(setup);

            // All async ops of setup complete, run callback
            await options?.onStart?.(this.me);
        } catch (err) {
            this.pollingRunning = false;
            this.pollingAbortController = undefined;
            throw err;
        }

        // Bot was stopped during `onStart`
        if (!this.pollingRunning) return;

        // Prevent common misuse that leads to missing updates
        validateAllowedUpdates(
            this.observedUpdateTypes,
            options?.allowed_updates,
        );
        // Prevent common misuse that causes memory leak
        this.use = noUseFunction;

        // Start polling
        debug("Starting simple long polling");
        void this.loop(options)
            .catch((err) => {
                console.error("Simple long polling crashed unexpectedly:", err);
            }).finally(() => options?.onStop?.());
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
     */
    async stop() {
        if (this.pollingRunning) {
            debug("Stopping bot, saving update offset");
            this.pollingRunning = false;
            this.pollingAbortController?.abort();
            const offset = this.lastTriedUpdateId + 1;
            await this.api.getUpdates({ offset, limit: 1 })
                .finally(() => this.pollingAbortController = undefined);
        } else {
            debug("Bot is not running!");
        }
    }

    /**
     * Returns true if the bot is currently running via built-in long polling,
     * and false otherwise.
     *
     * If this method returns true, it means that `bot.start()` has been called,
     * and that the bot has neither crashed nor was it stopped via a call to
     * `bot.stop()`. This also means that you cannot use this method to check if
     * a webhook server is running, or if grammY runner was started.
     *
     * Note that this method will already begin to return true even before the
     * call to `bot.start()` has completed its initialization phase (and hence
     * before `bot.isInited()` returns true). By extension, this method
     * returns true before `onStart` callback of `bot.start()` is invoked.
     */
    isRunning() {
        return this.pollingRunning;
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
        const limit = options?.limit;
        const timeout = options?.timeout ?? 30; // seconds
        let allowed_updates: PollingOptions["allowed_updates"] =
            options?.allowed_updates ?? []; // reset to default if unspecified

        try {
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
                // we can save some traffic by only sending it in the first request
                allowed_updates = undefined;
            }
        } finally {
            this.pollingRunning = false;
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
            // rethrow upon unauthorized or conflict
            if (error.error_code === 401 || error.error_code === 409) {
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
 * If the task errors and a retry_after value can be used, a subsequent retry
 * will be delayed by the specified period of time.
 *
 * Otherwise, if the first attempt at running the task fails, the task is
 * retried immediately. If second attempt fails, too, waits for 100 ms, and then
 * doubles this delay for every subsequent attempt. Never waits longer than 1
 * hour before retrying.
 *
 * @param task Async task to perform
 * @param signal Optional `AbortSignal` to prevent further retries
 */
async function withRetries<T>(
    task: () => Promise<T>,
    signal?: AbortSignal,
): Promise<T> {
    // Set up delays between retries
    const INITIAL_DELAY = 50; // ms
    let lastDelay = INITIAL_DELAY;

    // Define error handler
    /**
     * Determines the error handling strategy based on various error types.
     * Sleeps if necessary, and returns whether to retry or rethrow an error.
     */
    async function handleError(error: unknown) {
        let delay = false;
        let strategy: "retry" | "rethrow" = "rethrow";

        if (error instanceof HttpError) {
            delay = true;
            strategy = "retry";
        } else if (error instanceof GrammyError) {
            if (error.error_code >= 500) {
                delay = true;
                strategy = "retry";
            } else if (error.error_code === 429) {
                const retryAfter = error.parameters.retry_after;
                if (typeof retryAfter === "number") {
                    // ignore the backoff for sleep, then reset it
                    await sleep(retryAfter, signal);
                    lastDelay = INITIAL_DELAY;
                } else {
                    delay = true;
                }
                strategy = "retry";
            }
        }

        if (delay) {
            // Do not sleep for the first retry
            if (lastDelay !== INITIAL_DELAY) {
                await sleep(lastDelay, signal);
            }
            const TWENTY_MINUTES = 20 * 60 * 1000; // ms
            lastDelay = Math.min(TWENTY_MINUTES, 2 * lastDelay);
        }

        return strategy;
    }

    // Perform the actual task with retries
    let result: { ok: false } | { ok: true; value: T } = { ok: false };
    while (!result.ok) {
        try {
            result = { ok: true, value: await task() };
        } catch (error) {
            debugErr(error);
            const strategy = await handleError(error);
            switch (strategy) {
                case "retry":
                    continue;
                case "rethrow":
                    throw error;
            }
        }
    }
    return result.value;
}

/**
 * Returns a new promise that resolves after the specified number of seconds, or
 * rejects as soon as the given signal is aborted.
 */
async function sleep(seconds: number, signal?: AbortSignal) {
    let handle: number | undefined;
    let reject: ((err: Error) => void) | undefined;
    function abort() {
        reject?.(new Error("Aborted delay"));
        if (handle !== undefined) clearTimeout(handle);
    }
    try {
        await new Promise<void>((res, rej) => {
            reject = rej;
            if (signal?.aborted) {
                abort();
                return;
            }
            signal?.addEventListener("abort", abort);
            handle = setTimeout(res, 1000 * seconds);
        });
    } finally {
        signal?.removeEventListener("abort", abort);
    }
}

/**
 * Takes a set of observed update types and a list of allowed updates and logs a
 * warning in debug mode if some update types were observed that have not been
 * allowed.
 */
function validateAllowedUpdates(
    updates: Set<string>,
    allowed: readonly string[] = DEFAULT_UPDATE_TYPES,
) {
    const impossible = Array.from(updates).filter((u) => !allowed.includes(u));
    if (impossible.length > 0) {
        debugWarn(
            `You registered listeners for the following update types, \
but you did not specify them in \`allowed_updates\` \
so they may not be received: ${impossible.map((u) => `'${u}'`).join(", ")}`,
        );
    }
}
function noUseFunction(): never {
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
}
