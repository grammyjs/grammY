import { Context } from '../context.ts'
import { MiddlewareFn } from '../composer.ts'

type MaybePromise<T> = Promise<T> | T

/**
 * A session context is a context that can hold session data under
 * `ctx.session`.
 *
 * Session middleware will load the session data of a specific chat from your
 * storage solution, and make it available to you on the context object. Check
 * out the documentation on session middleware to know more.
 */
export interface SessionContext<S> extends Context {
    session: S | undefined
}
/**
 * A lazy session context is a context that can hold a promise of some session
 * data under `ctx.session`.
 *
 * Lazy session middleware will provide this promise lazily on the context
 * object. Once you access `ctx.session`, the storage will be queried and the
 * session data becomes available. If you access `ctx.session` again for the
 * same context object, the cached value will be used. Check out the
 * documentation on lazy session middleware to know more.
 */
export interface LazySessionContext<S> extends Context {
    session: Promise<S | undefined> | S | undefined
}

/**
 * A storage adapter is an abstraction that provides read, write, and delete
 * access to a storage solution of any kind. Storage adapters are used to keep
 * session middleware independent of your database provider, and they allow you
 * to pass your own storage solution.
 */
export interface StorageAdapter<T> {
    /**
     * Reads a value for the given key from the storage. May return the value or
     * undefined, or a promise of either.
     */
    read: (key: string) => MaybePromise<T | undefined>
    /**
     * Writes a value for the given key to the storage.
     */
    write: (key: string, value: T) => MaybePromise<void>
    /**
     * Deletes a value for the given key from the storage.
     */
    delete: (key: string) => MaybePromise<void>
}

/**
 * Options for session middleware.
 */
interface SessionOptions<S> {
    /**
     * This option lets you generate your own session keys per context object.
     * The session key determines how to map the different session objects to
     * your chats and users. Check out the documentation on the website about
     * session middleware to know how session keys are used.
     *
     * The default implementation will store sessions per user-chat combination.
     */
    getSessionKey?: (ctx: Context) => Promise<string | undefined>
    /**
     * A storage adapter to your storage solution. Provides read, write, and
     * delete access to the session middleware.
     *
     * Consider using third-party session middleware instead of rolling your own
     * implementation of this.
     *
     * The default implementation will store session in memory. The data will be
     * lost whenever your bot restarts.
     */
    storage?: StorageAdapter<S>
}
/**
 * Session middleware provides a persistent data storage for your bot. You can
 * use it to let your bot remember any data you want, for example the messages
 * it sent or received in the past. This is done by attaching _session data_ to
 * every chat. The stored data is then provided on the context object under
 * `ctx.session`.
 *
 * > **What is a session?** Simply put, the session of a chat is a little
 * > persistent storage that is attached to it. As an example, your bot can send
 * > a message to a chat and store the ID of that message in the corresponding
 * > session. The next time your bot receives an update from that chat, the
 * > session will still contain that ID.
 * >
 * > Session data can be stored in a database, in a file, or simply in memory.
 * > grammY only supports memory sessions out of the box, but you can use
 * > third-party session middleware to connect to other storage solutions. Note
 * > that memory sessions will be lost when you stop your bot and the process
 * > exits, so they are usually not useful in production.
 *
 * Whenever your bot receives an update, the first thing the session middleware
 * will do is to load the correct session from your storage solution. This
 * object is then provided on `ctx.session` while your other middleware is
 * running. As soon as your bot is done handling the update, the middleware
 * takes over again and writes back the session object to your storage. This
 * allows you to modify the session object arbitrarily in your middleware, and
 * to stop worrying about the database.
 *
 * ```ts
 * bot.use(session())
 *
 * bot.on('message', ctx => {
 *   // The session object is persisted across updates!
 *   const session = ctx.session
 * })
 * ```
 *
 * Check out the documentation on the website to know more about how sessions
 * work in grammY.
 *
 * @param options Optional configuration to pass to the session middleware
 */
export function session<S>(
    options?: SessionOptions<S>
): MiddlewareFn<SessionContext<S>> {
    const getSessionKey = options?.getSessionKey ?? defaultGetSessionKey
    const storage = options?.storage ?? new MemorySessionStorage()
    return async (ctx, next) => {
        const key = await getSessionKey(ctx)
        ctx.session = key === undefined ? undefined : await storage.read(key)
        await next()
        if (key !== undefined)
            if (!ctx.session) await storage.delete(key)
            else await storage.write(key, ctx.session)
    }
}

/**
 * > This is an advanced function of grammY.
 *
 * Generally speaking, lazy sessions work just like normal sessions—just they
 * are loaded on demand. Except for a few `async`s and `await`s here and there,
 * their usage looks 100 % identical.
 *
 * Instead of directly querying the storage every time an update arrives, lazy
 * sessions quickly do this _once you access_ `ctx.session`. This can
 * significantly reduce the database traffic (especially when your bot can be
 * added to group chats), because it skips a read and a write operation for all
 * updates that the bot does not react to.
 *
 * ```ts
 * // The options are identical
 * bot.use(lazySession({ storage: ... }))
 *
 * bot.on('message', async ctx => {
 *   // The session object is persisted across updates!
 *   const session = await ctx.session
 *   //                        ^
 *   //                        |
 *   //                       This plain property access (no function call) will trigger the database query!
 * })
 * ```
 *
 * Check out the documentation on the website to know more about how lazy
 * sessions work in grammY.
 *
 * @param options Optional configuration to pass to the session middleware
 */
export function lazySession<S>(
    options?: SessionOptions<S>
): MiddlewareFn<LazySessionContext<S>> {
    const getSessionKey = options?.getSessionKey ?? defaultGetSessionKey
    const storage = options?.storage ?? new MemorySessionStorage()
    return async (ctx, next) => {
        const key = await getSessionKey(ctx)
        let session: Promise<S | undefined> | S | undefined = undefined
        let promise: Promise<S | undefined> | undefined = undefined
        let read = false
        let write = false
        Object.defineProperty(ctx, 'session', {
            get() {
                read = true
                return (promise ??= Promise.resolve(
                    key === undefined ? undefined : storage.read(key)
                ).then(s => (session = s)))
            },
            set(newValue) {
                write = true
                session = newValue
            },
        })
        await next()
        if (key !== undefined) {
            if (read) await promise
            if (read || write) {
                session = await session
                if (session) await storage.write(key, session)
                else await storage.delete(key)
            }
        }
    }
}

function defaultGetSessionKey(ctx: Context): Promise<string | undefined> {
    const userId = ctx.from?.id
    if (userId === undefined) return Promise.resolve(undefined)
    const chatId = ctx.chat?.id
    if (chatId === undefined) return Promise.resolve(undefined)
    return Promise.resolve(`${userId}:${chatId}`)
}

class MemorySessionStorage<S> implements StorageAdapter<S> {
    private readonly storage = new Map<
        string,
        { session: S; expires?: number }
    >()

    constructor(private readonly timeToLive = Infinity) {}

    read(key: string) {
        const value = this.storage.get(key)
        if (value === undefined) return undefined
        if (value.expires !== undefined && value.expires < Date.now()) {
            this.delete(key)
            return undefined
        }
        return value.session
    }

    write(key: string, value: S) {
        this.storage.set(key, this.addExpiryDate(value))
    }

    private addExpiryDate(value: S) {
        const ttl = this.timeToLive
        if (ttl !== undefined && ttl < Infinity) {
            const now = Date.now()
            return { session: value, expires: now + ttl }
        } else {
            return { session: value }
        }
    }

    delete(key: string) {
        this.storage.delete(key)
    }
}
