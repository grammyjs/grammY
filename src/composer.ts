import {
    type CallbackQueryContext,
    type ChatTypeContext,
    type ChosenInlineResultContext,
    type CommandContext,
    Context,
    type GameQueryContext,
    type HearsContext,
    type InlineQueryContext,
    type MaybeArray,
    type PreCheckoutQueryContext,
    type ReactionContext,
    type ShippingQueryContext,
    type StringWithCommandSuggestions,
} from "./context.ts";
import { type Filter, type FilterQuery } from "./filter.ts";
import {
    type Chat,
    type ReactionType,
    type ReactionTypeEmoji,
} from "./types.ts";

type MaybePromise<T> = T | Promise<T>;

// === Middleware types
/**
 * A function of this type is passed as the second parameter to all middleware.
 * Invoke it to call the downstream middleware and pass on the control flow.
 *
 * In other words, if your middleware is done handling the context object, and
 * other middleware should take over, this function should be called and
 * `await`ed.
 *
 * Once the `Promise` returned by this function resolves, the downstream
 * middleware is done executing, hence returning the control.
 */
export type NextFunction = () => Promise<void>;

/**
 * Middleware in the form of a function.
 */
export type MiddlewareFn<C extends Context = Context> = (
    ctx: C,
    next: NextFunction,
) => MaybePromise<unknown>;
/**
 * Middleware in the form of a container for a function.
 */
export interface MiddlewareObj<C extends Context = Context> {
    /**
     * Returns the contained middleware.
     */
    middleware: () => MiddlewareFn<C>;
}
/**
 * Middleware for grammY, either as a function or as a container for a function.
 *
 * Simply put, middleware is just a fancy term for a _listener_. You can
 * register middleware on a bot to listen for updates. Example:
 *
 * ```ts
 * bot.on('message', ctx => ctx.reply('I got your message!'))
 * //                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * //                ^
 * //                |
 * //               This is middleware!
 * ```
 *
 * Middleware receives one object that we call the _context object_. This is
 * another fancy term for a simple object that holds information about the
 * update you're processing. For instance, the context object gives you access
 * to the message that was sent to your bot (`ctx.message`), including the text
 * (or photo or whatever message the user has sent). The context object is
 * commonly named `ctx`.
 *
 * It also provides you with the `ctx.api` object that you also find on
 * `bot.api`. As a result, you can call `ctx.api.sendMessage` instead of
 * `bot.api.sendMessage`. This prevents you from having to pass around your
 * `bot` instance all over your code.
 *
 * Most importantly, the context object gives you a handful of really useful
 * shortcuts, such as a `reply` method (see above). This method is nothing else
 * than a wrapper around `ctx.api.sendMessage`—but with some arguments
 * pre-filled for you. As you can see above, you no longer have to specify a
 * `chat_id` or anything; the context object knows which chat it belongs to, so
 * when you call `reply`, the context will call `sendMessage` with the correct
 * `chat_id`, namely the one for the same chat that the incoming message
 * originates from. This makes it very convenient to reply to a message.
 *
 * Middleware is an extremely powerful concept and this short explanation only
 * scratched the surface of what is possible with grammY. If you want to know
 * more advanced things about middleware, check out the
 * [documentation](https://grammy.dev/guide/middleware.html) on the website.
 */
export type Middleware<C extends Context = Context> =
    | MiddlewareFn<C>
    | MiddlewareObj<C>;

// === Middleware errors
/**
 * This error is thrown when middleware throws. It simply wraps the original
 * error (accessible via the `error` property), but also provides access to the
 * respective context object that was processed while the error occurred.
 */
export class BotError<C extends Context = Context> extends Error {
    constructor(public readonly error: unknown, public readonly ctx: C) {
        super(generateBotErrorMessage(error));
        this.name = "BotError";
        if (error instanceof Error) this.stack = error.stack;
    }
}
function generateBotErrorMessage(error: unknown) {
    let msg: string;
    if (error instanceof Error) {
        msg = `${error.name} in middleware: ${error.message}`;
    } else {
        const type = typeof error;
        msg = `Non-error value of type ${type} thrown in middleware`;
        switch (type) {
            case "bigint":
            case "boolean":
            case "number":
            case "symbol":
                msg += `: ${error}`;
                break;
            case "string":
                msg += `: ${String(error).substring(0, 50)}`;
                break;
            default:
                msg += "!";
                break;
        }
    }
    return msg;
}

// === Middleware base functions
function flatten<C extends Context>(mw: Middleware<C>): MiddlewareFn<C> {
    return typeof mw === "function"
        ? mw
        : (ctx, next) => mw.middleware()(ctx, next);
}
function concat<C extends Context>(
    first: MiddlewareFn<C>,
    andThen: MiddlewareFn<C>,
): MiddlewareFn<C> {
    return async (ctx, next) => {
        let nextCalled = false;
        await first(ctx, async () => {
            if (nextCalled) throw new Error("`next` already called before!");
            else nextCalled = true;
            await andThen(ctx, next);
        });
    };
}
function pass<C extends Context>(_ctx: C, next: NextFunction) {
    return next();
}

const leaf: NextFunction = () => Promise.resolve();
/**
 * Runs some given middleware function with a given context object.
 *
 * @param middleware The middleware to run
 * @param ctx The context to use
 */
export async function run<C extends Context>(
    middleware: MiddlewareFn<C>,
    ctx: C,
) {
    await middleware(ctx, leaf);
}

// === Composer
/**
 * The composer is the heart of the middleware system in grammY. It is also the
 * superclass of `Bot`. Whenever you call `use` or `on` or some of the other
 * methods on your bot, you are in fact using the underlying composer instance
 * to register your middleware.
 *
 * If you're just getting started, you do not need to worry about what
 * middleware is, or about how to use a composer.
 *
 * On the other hand, if you want to dig deeper into how grammY implements
 * middleware, check out the
 * [documentation](https://grammy.dev/advanced/middleware.html) on the website.
 */
export class Composer<C extends Context> implements MiddlewareObj<C> {
    private handler: MiddlewareFn<C>;

    /**
     * Constructs a new composer based on the provided middleware. If no
     * middleware is given, the composer instance will simply make all context
     * objects pass through without touching them.
     *
     * @param middleware The middleware to compose
     */
    constructor(...middleware: Array<Middleware<C>>) {
        this.handler = middleware.length === 0
            ? pass
            : middleware.map(flatten).reduce(concat);
    }

    middleware() {
        return this.handler;
    }

    /**
     * Registers some middleware that receives all updates. It is installed by
     * concatenating it to the end of all previously installed middleware.
     *
     * Often, this method is used to install middleware that behaves like a
     * plugin, for example session middleware.
     * ```ts
     * bot.use(session())
     * ```
     *
     * This method returns a new instance of composer. The returned instance can
     * be further extended, and all changes will be regarded here. Confer the
     * [documentation](https://grammy.dev/advanced/middleware.html) on the
     * website if you want to know more about how the middleware system in
     * grammY works, especially when it comes to chaining the method calls
     * (`use( ... ).use( ... ).use( ... )`).
     *
     * @param middleware The middleware to register
     */
    use(...middleware: Array<Middleware<C>>) {
        const composer = new Composer(...middleware);
        this.handler = concat(this.handler, flatten(composer));
        return composer;
    }

    /**
     * Registers some middleware that will only be executed for some specific
     * updates, namely those matching the provided filter query. Filter queries
     * are a concise way to specify which updates you are interested in.
     *
     * Here are some examples of valid filter queries:
     * ```ts
     * // All kinds of message updates
     * bot.on('message', ctx => { ... })
     *
     * // Only text messages
     * bot.on('message:text', ctx => { ... })
     *
     * // Only text messages with URL
     * bot.on('message:entities:url', ctx => { ... })
     *
     * // Text messages and text channel posts
     * bot.on(':text', ctx => { ... })
     *
     * // Messages with URL in text or caption (i.e. entities or caption entities)
     * bot.on('message::url', ctx => { ... })
     *
     * // Messages or channel posts with URL in text or caption
     * bot.on('::url', ctx => { ... })
     * ```
     *
     * You can use autocomplete in VS Code to see all available filter queries.
     * Check out the
     * [documentation](https://grammy.dev/guide/filter-queries.html) on the
     * website to learn more about filter queries in grammY.
     *
     * It is possible to pass multiple filter queries in an array, i.e.
     * ```ts
     * // Matches all text messages and edited text messages that contain a URL
     * bot.on(['message:entities:url', 'edited_message:entities:url'], ctx => { ... })
     * ```
     *
     * Your middleware will be executed if _any of the provided filter queries_
     * matches (logical OR).
     *
     * If you instead want to match _all of the provided filter queries_
     * (logical AND), you can chain the `.on` calls:
     * ```ts
     * // Matches all messages and channel posts that both a) contain a URL and b) are forwards
     * bot.on('::url').on(':forward_origin', ctx => { ... })
     * ```
     *
     * @param filter The filter query to use, may also be an array of queries
     * @param middleware The middleware to register behind the given filter
     */
    on<Q extends FilterQuery>(
        filter: Q | Q[],
        ...middleware: Array<Middleware<Filter<C, Q>>>
    ): Composer<Filter<C, Q>> {
        return this.filter(Context.has.filterQuery(filter), ...middleware);
    }

    /**
     * Registers some middleware that will only be executed when the message
     * contains some text. Is it possible to pass a regular expression to match:
     * ```ts
     * // Match some text (exact match)
     * bot.hears('I love grammY', ctx => ctx.reply('And grammY loves you! <3'))
     * // Match a regular expression
     * bot.hears(/\/echo (.+)/, ctx => ctx.reply(ctx.match[1]))
     * ```
     * Note how `ctx.match` will contain the result of the regular expression.
     * Here it is a `RegExpMatchArray` object, so `ctx.match[1]` refers to the
     * part of the regex that was matched by `(.+)`, i.e. the text that comes
     * after “/echo”.
     *
     * You can pass an array of triggers. Your middleware will be executed if at
     * least one of them matches.
     *
     * Both text and captions of the received messages will be scanned. For
     * example, when a photo is sent to the chat and its caption matches the
     * trigger, your middleware will be executed.
     *
     * If you only want to match text messages and not captions, you can do
     * this:
     * ```ts
     * // Only matches text messages (and channel posts) for the regex
     * bot.on(':text').hears(/\/echo (.+)/, ctx => { ... })
     * ```
     *
     * @param trigger The text to look for
     * @param middleware The middleware to register
     */
    hears(
        trigger: MaybeArray<string | RegExp>,
        ...middleware: Array<HearsMiddleware<C>>
    ): Composer<HearsContext<C>> {
        return this.filter(Context.has.text(trigger), ...middleware);
    }

    /**
     * Registers some middleware that will only be executed when a certain
     * command is found.
     * ```ts
     * // Reacts to /start commands
     * bot.command('start', ctx => { ... })
     * // Reacts to /help commands
     * bot.command('help', ctx => { ... })
     * ```
     *
     * The rest of the message (excluding the command, and trimmed) is provided
     * via `ctx.match`.
     *
     * > **Did you know?** You can use deep linking
     * > (https://core.telegram.org/bots/features#deep-linking) to let users
     * > start your bot with a custom payload. As an example, send someone the
     * > link https://t.me/name-of-your-bot?start=custom-payload and register a
     * > start command handler on your bot with grammY. As soon as the user
     * > starts your bot, you will receive `custom-payload` in the `ctx.match`
     * > property!
     * > ```ts
     * > bot.command('start', ctx => {
     * >   const payload = ctx.match // will be 'custom-payload'
     * > })
     * > ```
     *
     * Note that commands are not matched in captions or in the middle of the
     * text.
     * ```ts
     * bot.command('start', ctx => { ... })
     * // ... does not match:
     * // A message saying: “some text /start some more text”
     * // A photo message with the caption “/start”
     * ```
     *
     * By default, commands are detected in channel posts, too. This means that
     * `ctx.message` is potentially `undefined`, so you should use `ctx.msg`
     * instead to grab both messages and channel posts. Alternatively, if you
     * want to limit your bot to finding commands only in private and group
     * chats, you can use `bot.on('message').command('start', ctx => { ... })`,
     * or even store a message-only version of your bot in a variable like so:
     * ```ts
     * const m = bot.on('message')
     *
     * m.command('start', ctx => { ... })
     * m.command('help', ctx => { ... })
     * // etc
     * ```
     *
     * If you need more freedom matching your commands, check out the `commands`
     * plugin.
     *
     * @param command The command to look for
     * @param middleware The middleware to register
     */
    command(
        command: MaybeArray<StringWithCommandSuggestions>,
        ...middleware: Array<CommandMiddleware<C>>
    ): Composer<CommandContext<C>> {
        return this.filter(Context.has.command(command), ...middleware);
    }

    /**
     * Registers some middleware that will only be added when a new reaction of
     * the given type is added to a message.
     * ```ts
     * // Reacts to new '👍' reactions
     * bot.reaction('👍', ctx => { ... })
     * // Reacts to new '👍' or '👎' reactions
     * bot.reaction(['👍', '👎'], ctx => { ... })
     * ```
     *
     * > Note that you have to enable `message_reaction` updates in
     * `allowed_updates` if you want your bot to receive updates about message
     * reactions.
     *
     * `bot.reaction` will trigger if:
     * - a new emoji reaction is added to a message
     * - a new custom emoji reaction is added a message
     *
     * `bot.reaction` will not trigger if:
     * - a reaction is removed
     * - an anonymous reaction count is updated, such as on channel posts
     * - `message_reaction` updates are not enabled for your bot
     *
     * @param reaction The reaction to look for
     * @param middleware The middleware to register
     */
    reaction(
        reaction: MaybeArray<ReactionTypeEmoji["emoji"] | ReactionType>,
        ...middleware: Array<ReactionMiddleware<C>>
    ): Composer<ReactionContext<C>> {
        return this.filter(Context.has.reaction(reaction), ...middleware);
    }

    /**
     * Registers some middleware for certain chat types only. For example, you
     * can use this method to only receive updates from private chats. The four
     * chat types are `"channel"`, `"supergroup"`, `"group"`, and `"private"`.
     * This is especially useful when combined with other filtering logic. For
     * example, this is how can you respond to `/start` commands only from
     * private chats:
     * ```ts
     * bot.chatType("private").command("start", ctx => { ... })
     * ```
     *
     * Naturally, you can also use this method on its own.
     * ```ts
     * // Private chats only
     * bot.chatType("private", ctx => { ... });
     * // Channels only
     * bot.chatType("channel", ctx => { ... });
     * ```
     *
     * You can pass an array of chat types if you want your middleware to run
     * for any of several provided chat types.
     * ```ts
     * // Groups and supergroups only
     * bot.chatType(["group", "supergroup"], ctx => { ... });
     * ```
     * [Remember](https://grammy.dev/guide/context.html#shortcuts) also that you
     * can access the chat type via `ctx.chat.type`.
     *
     * @param chatType The chat type
     * @param middleware The middleware to register
     */
    chatType<T extends Chat["type"]>(
        chatType: MaybeArray<T>,
        ...middleware: Array<Middleware<ChatTypeContext<C, T>>>
    ): Composer<ChatTypeContext<C, T>> {
        return this.filter(Context.has.chatType(chatType), ...middleware);
    }

    /**
     * Registers some middleware for callback queries, i.e. the updates that
     * Telegram delivers to your bot when a user clicks an inline button (that
     * is a button under a message).
     *
     * This method is essentially the same as calling
     * ```ts
     * bot.on('callback_query:data', ctx => { ... })
     * ```
     * but it also allows you to match the query data against a given text or
     * regular expression.
     *
     * ```ts
     * // Create an inline keyboard
     * const keyboard = new InlineKeyboard().text('Go!', 'button-payload')
     * // Send a message with the keyboard
     * await bot.api.sendMessage(chat_id, 'Press a button!', {
     *   reply_markup: keyboard
     * })
     * // Listen to users pressing buttons with that specific payload
     * bot.callbackQuery('button-payload', ctx => { ... })
     *
     * // Listen to users pressing any button your bot ever sent
     * bot.on('callback_query:data', ctx => { ... })
     * ```
     *
     * Always remember to call `answerCallbackQuery`—even if you don't perform
     * any action: https://core.telegram.org/bots/api#answercallbackquery
     * ```ts
     * bot.on('callback_query:data', async ctx => {
     *   await ctx.answerCallbackQuery()
     * })
     * ```
     *
     * You can pass an array of triggers. Your middleware will be executed if at
     * least one of them matches.
     *
     * @param trigger The string to look for in the payload
     * @param middleware The middleware to register
     */
    callbackQuery(
        trigger: MaybeArray<string | RegExp>,
        ...middleware: Array<CallbackQueryMiddleware<C>>
    ): Composer<CallbackQueryContext<C>> {
        return this.filter(Context.has.callbackQuery(trigger), ...middleware);
    }

    /**
     * Registers some middleware for game queries, i.e. the updates that
     * Telegram delivers to your bot when a user clicks an inline button for the
     * HTML5 games platform on Telegram.
     *
     * This method is essentially the same as calling
     * ```ts
     * bot.on('callback_query:game_short_name', ctx => { ... })
     * ```
     * but it also allows you to match the query data against a given text or
     * regular expression.
     *
     * You can pass an array of triggers. Your middleware will be executed if at
     * least one of them matches.
     *
     * @param trigger The string to look for in the payload
     * @param middleware The middleware to register
     */
    gameQuery(
        trigger: MaybeArray<string | RegExp>,
        ...middleware: Array<GameQueryMiddleware<C>>
    ): Composer<GameQueryContext<C>> {
        return this.filter(Context.has.gameQuery(trigger), ...middleware);
    }

    /**
     * Registers middleware for inline queries. Telegram sends an inline query
     * to your bot whenever a user types “@your_bot_name ...” into a text field
     * in Telegram. You bot will then receive the entered search query and can
     * respond with a number of results (text, images, etc) that the user can
     * pick from to send a message _via_ your bot to the respective chat. Check
     * out https://core.telegram.org/bots/inline to read more about inline bots.
     *
     * > Note that you have to enable inline mode for you bot by contacting
     * > @BotFather first.
     *
     * ```ts
     * // Listen for users typing “@your_bot_name query”
     * bot.inlineQuery('query', async ctx => {
     *   // Answer the inline query, confer https://core.telegram.org/bots/api#answerinlinequery
     *   await ctx.answerInlineQuery( ... )
     * })
     * ```
     *
     * @param trigger The inline query text to match
     * @param middleware The middleware to register
     */
    inlineQuery(
        trigger: MaybeArray<string | RegExp>,
        ...middleware: Array<InlineQueryMiddleware<C>>
    ): Composer<InlineQueryContext<C>> {
        return this.filter(Context.has.inlineQuery(trigger), ...middleware);
    }

    /**
     * Registers middleware for the ChosenInlineResult by the given id or ids.
     * ChosenInlineResult represents a result of an inline query that was chosen
     * by the user and sent to their chat partner. Check out
     * https://core.telegram.org/bots/api#choseninlineresult to read more about
     * chosen inline results.
     *
     * ```ts
     * bot.chosenInlineResult('id', async ctx => {
     *   const id = ctx.result_id;
     *   // Your code
     * })
     * ```
     *
     * @param resultId An id or array of ids
     * @param middleware The middleware to register
     */
    chosenInlineResult(
        resultId: MaybeArray<string | RegExp>,
        ...middleware: Array<ChosenInlineResultMiddleware<C>>
    ): Composer<ChosenInlineResultContext<C>> {
        return this.filter(
            Context.has.chosenInlineResult(resultId),
            ...middleware,
        );
    }

    /**
     * Registers middleware for pre-checkout queries. Telegram sends a
     * pre-checkout query to your bot whenever a user has confirmed their
     * payment and shipping details. You bot will then receive all information
     * about the order and has to respond within 10 seconds with a confirmation
     * of whether everything is alright (goods are available, etc.) and the bot
     * is ready to proceed with the order. Check out
     * https://core.telegram.org/bots/api#precheckoutquery to read more about
     * pre-checkout queries.
     *
     * ```ts
     * bot.preCheckoutQuery('invoice_payload', async ctx => {
     *   // Answer the pre-checkout query, confer https://core.telegram.org/bots/api#answerprecheckoutquery
     *   await ctx.answerPreCheckoutQuery( ... )
     * })
     * ```
     *
     * @param trigger The string to look for in the invoice payload
     * @param middleware The middleware to register
     */
    preCheckoutQuery(
        trigger: MaybeArray<string | RegExp>,
        ...middleware: Array<PreCheckoutQueryMiddleware<C>>
    ): Composer<PreCheckoutQueryContext<C>> {
        return this.filter(
            Context.has.preCheckoutQuery(trigger),
            ...middleware,
        );
    }

    /**
     * Registers middleware for shipping queries. If you sent an invoice
     * requesting a shipping address and the parameter _is_flexible_ was
     * specified, Telegram will send a shipping query to your bot whenever a
     * user has confirmed their shipping details. You bot will then receive the
     * shipping information and can respond with a confirmation of whether
     * delivery to the specified address is possible. Check out
     * https://core.telegram.org/bots/api#shippingquery to read more about
     * shipping queries.
     *
     * ```ts
     * bot.shippingQuery('invoice_payload', async ctx => {
     *   // Answer the shipping query, confer https://core.telegram.org/bots/api#answershippingquery
     *   await ctx.answerShippingQuery( ... )
     * })
     * ```
     *
     * @param trigger The string to look for in the invoice payload
     * @param middleware The middleware to register
     */
    shippingQuery(
        trigger: MaybeArray<string | RegExp>,
        ...middleware: Array<ShippingQueryMiddleware<C>>
    ): Composer<ShippingQueryContext<C>> {
        return this.filter(Context.has.shippingQuery(trigger), ...middleware);
    }

    /**
     * > This is an advanced method of grammY.
     *
     * Registers middleware behind a custom filter function that operates on the
     * context object and decides whether or not to execute the middleware. In
     * other words, the middleware will only be executed if the given predicate
     * returns `true` for the given context object. Otherwise, it will be
     * skipped and the next middleware will be executed.
     *
     * This method has two signatures. The first one is straightforward, it is
     * the one described above. Note that the predicate may be asynchronous,
     * i.e. it can return a Promise of a boolean.
     *
     * Alternatively, you can pass a function that has a type predicate as
     * return type. This will allow you to narrow down the context object. The
     * installed middleware is then able to operate on this constrained context
     * object.
     * ```ts
     * // NORMAL USAGE
     * // Only process every second update
     * bot.filter(ctx => ctx.update.update_id % 2 === 0, ctx => { ... })
     *
     * // TYPE PREDICATE USAGE
     * function predicate(ctx): ctx is Context & { message: undefined } {
     *   return ctx.message === undefined
     * }
     * // Only process updates where `message` is `undefined`
     * bot.filter(predicate, ctx => {
     *   const m = ctx.message // inferred as always undefined!
     *   const m2 = ctx.update.message // also inferred as always undefined!
     * })
     * ```
     *
     * @param predicate The predicate to check
     * @param middleware The middleware to register
     */
    filter<D extends C>(
        predicate: (ctx: C) => ctx is D,
        ...middleware: Array<Middleware<D>>
    ): Composer<D>;
    filter(
        predicate: (ctx: C) => MaybePromise<boolean>,
        ...middleware: Array<Middleware<C>>
    ): Composer<C>;
    filter(
        predicate: (ctx: C) => MaybePromise<boolean>,
        ...middleware: Array<Middleware<C>>
    ) {
        const composer = new Composer(...middleware);
        this.branch(predicate, composer, pass);
        return composer;
    }

    /**
     * > This is an advanced method of grammY.
     *
     * Registers middleware behind a custom filter function that operates on the
     * context object and decides whether or not to execute the middleware. In
     * other words, the middleware will only be executed if the given predicate
     * returns `false` for the given context object. Otherwise, it will be
     * skipped and the next middleware will be executed. Note that the predicate
     * may be asynchronous, i.e. it can return a Promise of a boolean.
     *
     * This method is the same using `filter` (normal usage) with a negated
     * predicate.
     *
     * @param predicate The predicate to check
     * @param middleware The middleware to register
     */
    drop(
        predicate: (ctx: C) => MaybePromise<boolean>,
        ...middleware: Array<Middleware<C>>
    ) {
        return this.filter(
            async (ctx: C) => !(await predicate(ctx)),
            ...middleware,
        );
    }

    /**
     * > This is an advanced method of grammY.
     *
     * Registers some middleware that runs concurrently to the executing
     * middleware stack.
     * ```ts
     * bot.use( ... ) // will run first
     * bot.fork( ... ) // will be started second, but run concurrently
     * bot.use( ... ) // will also be run second
     * ```
     * In the first middleware, as soon as `next`'s Promise resolves, both forks
     * have completed.
     *
     * Both the fork and the downstream middleware are awaited with
     * `Promise.all`, so you will only be to catch up to one error (the one that
     * is thrown first).
     *
     * In opposite to the other middleware methods on composer, `fork` does not
     * return simply return the composer connected to the main middleware stack.
     * Instead, it returns the created composer _of the fork_ connected to the
     * middleware stack. This allows for the following pattern.
     * ```ts
     * // Middleware will be run concurrently!
     * bot.fork().on('message', ctx => { ... })
     * ```
     *
     * @param middleware The middleware to run concurrently
     */
    fork(...middleware: Array<Middleware<C>>) {
        const composer = new Composer(...middleware);
        const fork = flatten(composer);
        this.use((ctx, next) => Promise.all([next(), run(fork, ctx)]));
        return composer;
    }

    /**
     * > This is an advanced method of grammY.
     *
     * Executes some middleware that can be generated on the fly for each
     * context. Pass a factory function that creates some middleware (or a
     * middleware array even). The factory function will be called once per
     * context, and its result will be executed with the context object.
     * ```ts
     * // The middleware returned by `createMyMiddleware` will be used only once
     * bot.lazy(ctx => createMyMiddleware(ctx))
     * ```
     *
     * You may generate this middleware in an `async` fashion.
     *
     * You can decide to return an empty array (`[]`) if you don't want to run
     * any middleware for a given context object. This is equivalent to
     * returning an empty instance of `Composer`.
     *
     * @param middlewareFactory The factory function creating the middleware
     */
    lazy(
        middlewareFactory: (ctx: C) => MaybePromise<MaybeArray<Middleware<C>>>,
    ): Composer<C> {
        return this.use(async (ctx, next) => {
            const middleware = await middlewareFactory(ctx);
            const arr = Array.isArray(middleware) ? middleware : [middleware];
            await flatten(new Composer(...arr))(ctx, next);
        });
    }

    /**
     * > This is an advanced method of grammY.
     *
     * _Not to be confused with the `router` plugin._
     *
     * This method is an alternative to the `router` plugin. It allows you to
     * branch between different middleware per context object. You can pass two
     * things to it:
     * 1. A routing function
     * 2. Different middleware identified by key
     *
     * The routing function decides based on the context object which middleware
     * to run. Each middleware is identified by a key, so the routing function
     * simply returns the key of that middleware.
     * ```ts
     * // Define different route handlers
     * const routeHandlers = {
     *   evenUpdates: (ctx: Context) => { ... }
     *   oddUpdates: (ctx: Context) => { ... }
     * }
     * // Decide for a context object which one to pick
     * const router = (ctx: Context) => ctx.update.update_id % 2 === 0
     *   ? 'evenUpdates'
     *   : 'oddUpdates'
     * // Route it!
     * bot.route(router, routeHandlers)
     * ```
     *
     * Optionally, you can pass a third option that is used as fallback
     * middleware if your route function returns `undefined`, or if the key
     * returned by your router has no middleware associated with it.
     *
     * This method may need less setup than first instantiating a `Router`, but
     * for more complex setups, having a `Router` may be more readable.
     *
     * @param router The routing function to use
     * @param routeHandlers Handlers for every route
     * @param fallback Optional fallback middleware if no route matches
     */
    route<R extends Record<PropertyKey, Middleware<C>>>(
        router: (ctx: C) => MaybePromise<undefined | keyof R>,
        routeHandlers: R,
        fallback: Middleware<C> = pass,
    ): Composer<C> {
        return this.lazy(async (ctx) => {
            const route = await router(ctx);
            return (route === undefined || !routeHandlers[route]
                ? fallback
                : routeHandlers[route]) ?? [];
        });
    }

    /**
     * > This is an advanced method of grammY.
     *
     * Allows you to branch between two cases for a given context object.
     *
     * This method takes a predicate function that is tested once per context
     * object. If it returns `true`, the first supplied middleware is executed.
     * If it returns `false`, the second supplied middleware is executed. Note
     * that the predicate may be asynchronous, i.e. it can return a Promise of a
     * boolean.
     *
     * @param predicate The predicate to check
     * @param trueMiddleware The middleware for the `true` case
     * @param falseMiddleware The middleware for the `false` case
     */
    branch(
        predicate: (ctx: C) => MaybePromise<boolean>,
        trueMiddleware: MaybeArray<Middleware<C>>,
        falseMiddleware: MaybeArray<Middleware<C>>,
    ) {
        return this.lazy(async (ctx) =>
            (await predicate(ctx)) ? trueMiddleware : falseMiddleware
        );
    }

    /**
     * > This is an advanced function of grammY.
     *
     * Installs an error boundary that catches errors that happen only inside
     * the given middleware. This allows you to install custom error handlers
     * that protect some parts of your bot. Errors will not be able to bubble
     * out of this part of your middleware system, unless the supplied error
     * handler rethrows them, in which case the next surrounding error boundary
     * will catch the error.
     *
     * Example usage:
     * ```ts
     * function errHandler(err: BotError) {
     *   console.error('Error boundary caught error!', err)
     * }
     *
     * const safe =
     *   // All passed middleware will be protected by the error boundary.
     *   bot.errorBoundary(errHandler, middleware0, middleware1, middleware2)
     *
     * // Those will also be protected!
     * safe.on('message', middleware3)
     *
     * // No error from `middleware4` will reach the `errHandler` from above,
     * // as errors are suppressed.
     *
     * // do nothing on error (suppress error), and run outside middleware
     * const suppress = (_err: BotError, next: NextFunction) => { return next() }
     * safe.errorBoundary(suppress).on('edited_message', middleware4)
     * ```
     *
     * Check out the
     * [documentation](https://grammy.dev/guide/errors.html#error-boundaries) on
     * the website to learn more about error boundaries.
     *
     * @param errorHandler The error handler to use
     * @param middleware The middleware to protect
     */
    errorBoundary(
        errorHandler: (
            error: BotError<C>,
            next: NextFunction,
        ) => MaybePromise<unknown>,
        ...middleware: Array<Middleware<C>>
    ) {
        const composer = new Composer<C>(...middleware);
        const bound = flatten(composer);
        this.use(async (ctx, next) => {
            let nextCalled = false;
            const cont = () => ((nextCalled = true), Promise.resolve());
            try {
                await bound(ctx, cont);
            } catch (err) {
                nextCalled = false;
                await errorHandler(new BotError<C>(err, ctx), cont);
            }
            if (nextCalled) await next();
        });
        return composer;
    }
}

// === Filtered context middleware types
/**
 * Type of the middleware that can be passed to `bot.hears`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.hears` in a different place. For instance, this allows for more modular
 * code where handlers are defined in separate files.
 */
export type HearsMiddleware<C extends Context> = Middleware<
    HearsContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.command`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.command` in a different place. For instance, this allows for more
 * modular code where handlers are defined in separate files.
 */
export type CommandMiddleware<C extends Context> = Middleware<
    CommandContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.reaction`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.reaction` in a different place. For instance, this allows for more
 * modular code where handlers are defined in separate files.
 */
export type ReactionMiddleware<C extends Context> = Middleware<
    ReactionContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.callbackQuery`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.callbackQuery` in a different place. For instance, this allows for more
 * modular code where handlers are defined in separate files.
 */
export type CallbackQueryMiddleware<C extends Context> = Middleware<
    CallbackQueryContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.gameQuery`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.gameQuery` in a different place. For instance, this allows for more
 * modular code where handlers are defined in separate files.
 */
export type GameQueryMiddleware<C extends Context> = Middleware<
    GameQueryContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.inlineQuery`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.inlineQuery` in a different place. For instance, this allows for more
 * modular code where handlers are defined in separate files.
 */
export type InlineQueryMiddleware<C extends Context> = Middleware<
    InlineQueryContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.chosenInlineResult`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.chosenInlineResult` in a different place. For instance, this allows for
 * more modular code where handlers are defined in separate files.
 */
export type ChosenInlineResultMiddleware<C extends Context> = Middleware<
    ChosenInlineResultContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.preCheckoutQuery`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.preCheckoutQuery` in a different place. For instance, this allows for
 * more modular code where handlers are defined in separate files.
 */
export type PreCheckoutQueryMiddleware<C extends Context> = Middleware<
    PreCheckoutQueryContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.shippingQuery`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.shippingQuery` in a different place. For instance, this allows for more
 * modular code where handlers are defined in separate files.
 */
export type ShippingQueryMiddleware<C extends Context> = Middleware<
    ShippingQueryContext<C>
>;
/**
 * Type of the middleware that can be passed to `bot.chatType`.
 *
 * This helper type can be used to annotate middleware functions that are
 * defined in one place, so that they have the correct type when passed to
 * `bot.chatType` in a different place. For instance, this allows for more
 * modular code where handlers are defined in separate files.
 */
export type ChatTypeMiddleware<C extends Context, T extends Chat["type"]> =
    Middleware<ChatTypeContext<C, T>>;
