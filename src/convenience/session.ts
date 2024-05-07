import { type MiddlewareFn } from "../composer.ts";
import { type Context } from "../context.ts";
import { debug as d } from "../platform.deno.ts";
const debug = d("grammy:session");

type MaybePromise<T> = Promise<T> | T;

// === Main session plugin
/**
 * A session flavor is a context flavor that holds session data under
 * `ctx.session`.
 *
 * Session middleware will load the session data of a specific chat from your
 * storage solution, and make it available to you on the context object. Check
 * out the
 * [documentation](https://doc.deno.land/https://deno.land/x/grammy/mod.ts/~/session)
 * on session middleware to know more, and read the section about sessions on
 * the [website](https://grammy.dev/plugins/session.html).
 */
export interface SessionFlavor<S> {
    /**
     * Session data on the context object.
     *
     * **WARNING:** You have to make sure that your session data is not
     * undefined by _providing an initial value to the session middleware_, or by
     * making sure that `ctx.session` is assigned if it is empty! The type
     * system does not include `| undefined` because this is really annoying to
     * work with.
     *
     *  Accessing `ctx.session` by reading or writing will throw if
     * `getSessionKey(ctx) === undefined` for the respective context object
     * `ctx`.
     */
    get session(): S;
    set session(session: S | null | undefined);
}
/**
 * A lazy session flavor is a context flavor that holds a promise of some
 * session data under `ctx.session`.
 *
 * Lazy session middleware will provide this promise lazily on the context
 * object. Once you access `ctx.session`, the storage will be queried and the
 * session data becomes available. If you access `ctx.session` again for the
 * same context object, the cached value will be used. Check out the
 * [documentation](https://doc.deno.land/https://deno.land/x/grammy/mod.ts/~/lazySession)
 * on lazy session middleware to know more, and read the section about lazy
 * sessions on the
 * [website](https://grammy.dev/plugins/session.html#lazy-sessions).
 */
export interface LazySessionFlavor<S> {
    /**
     * Session data on the context object, potentially a promise.
     *
     * **WARNING:** You have to make sure that your session data is not
     * undefined by _providing a default value to the session middleware_, or by
     * making sure that `ctx.session` is assigned if it is empty! The type
     * system does not include `| undefined` because this is really annoying to
     * work with.
     *
     * Accessing `ctx.session` by reading or writing will throw iff
     * `getSessionKey(ctx) === undefined` holds for the respective context
     * object `ctx`.
     */
    get session(): MaybePromise<S>;
    set session(session: MaybePromise<S | null | undefined>);
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
    read: (key: string) => MaybePromise<T | undefined>;
    /**
     * Writes a value for the given key to the storage.
     */
    write: (key: string, value: T) => MaybePromise<void>;
    /**
     * Deletes a value for the given key from the storage.
     */
    delete: (key: string) => MaybePromise<void>;
    /**
     * Checks whether a key exists in the storage.
     */
    has?: (key: string) => MaybePromise<boolean>;
    /**
     * Lists all keys.
     */
    readAllKeys?: () => Iterable<string> | AsyncIterable<string>;
    /**
     * Lists all values.
     */
    readAllValues?: () => Iterable<T> | AsyncIterable<T>;
    /**
     * Lists all keys with their values.
     */
    readAllEntries?: () =>
        | Iterable<[key: string, value: T]>
        | AsyncIterable<[key: string, value: T]>;
}

/**
 * Options for session middleware.
 */
export interface SessionOptions<S, C extends Context = Context> {
    type?: "single";
    /**
     * **Recommended to use.**
     *
     * A function that produces an initial value for `ctx.session`. This
     * function will be called every time the storage solution returns undefined
     * for a given session key. Make sure to create a new value every time, such
     * that different context objects do that accidentally share the same
     * session data.
     */
    initial?: () => S;
    /**
     * This option lets you generate your own session keys per context object.
     * The session key determines how to map the different session objects to
     * your chats and users. Check out the
     * [documentation](https://grammy.dev/plugins/session.html#how-to-use-sessions)
     * on the website about how to use session middleware to know how session
     * keys are used.
     *
     * The default implementation will store sessions per chat, as determined by
     * `ctx.chatId`.
     */
    getSessionKey?: (
        ctx: Omit<C, "session">,
    ) => MaybePromise<string | undefined>;
    /**
     * A storage adapter to your storage solution. Provides read, write, and
     * delete access to the session middleware.
     *
     * Consider using a [known storage
     * adapter](https://grammy.dev/plugins/session.html#known-storage-adapters)
     * instead of rolling your own implementation of this.
     *
     * The default implementation will store session in memory. The data will be
     * lost whenever your bot restarts.
     */
    storage?: StorageAdapter<S>;
}

/**
 * Options for session middleware if multi sessions are used. Specify `"type":
 * "multi"` in the options to use multi sessions.
 */
export type MultiSessionOptions<S, C extends Context> =
    // deno-lint-ignore no-explicit-any
    S extends Record<string, any> // unknown breaks extends
        ? { type: "multi" } & MultiSessionOptionsRecord<S, C>
        : never;
type MultiSessionOptionsRecord<
    S extends Record<string, unknown>,
    C extends Context,
> = {
    [K in keyof S]: SessionOptions<S[K], C>;
};

/**
 * Session middleware provides a persistent data storage for your bot. You can
 * use it to let your bot remember any data you want, for example the messages
 * it sent or received in the past. This is done by attaching _session data_ to
 * every chat. The stored data is then provided on the context object under
 * `ctx.session`.
 *
 * > **What is a session?** Simply put, the session of a chat is a little
 * > persistent storage that is attached to it. As an example, your bot can send
 * > a message to a chat and store the identifier of that message in the
 * > corresponding session. The next time your bot receives an update from that
 * > chat, the session will still contain that ID.
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
 * It is recommended to make use of the `initial` option in the configuration
 * object, which correctly initializes session objects for new chats.
 *
 * You can delete the session data by setting `ctx.session` to `null` or
 * `undefined`.
 *
 * Check out the [documentation](https://grammy.dev/plugins/session.html) on the
 * website to know more about how sessions work in grammY.
 *
 * @param options Optional configuration to pass to the session middleware
 */
export function session<S, C extends Context>(
    options: SessionOptions<S, C> | MultiSessionOptions<S, C> = {},
): MiddlewareFn<C & SessionFlavor<S>> {
    return options.type === "multi"
        ? strictMultiSession(options)
        : strictSingleSession(options);
}

function strictSingleSession<S, C extends Context>(
    options: SessionOptions<S, C>,
): MiddlewareFn<C & SessionFlavor<S>> {
    const { initial, storage, getSessionKey, custom } = fillDefaults(options);
    return async (ctx, next) => {
        const propSession = new PropertySession<SessionFlavor<S>, "session">(
            storage,
            ctx,
            "session",
            initial,
        );
        const key = await getSessionKey(ctx);
        await propSession.init(key, { custom, lazy: false });
        await next(); // no catch: do not write back if middleware throws
        await propSession.finish();
    };
}
function strictMultiSession<S, C extends Context>(
    options: MultiSessionOptions<S, C>,
): MiddlewareFn<C & SessionFlavor<S>> {
    const props = Object.keys(options).filter((k) => k !== "type");
    const defaults = Object.fromEntries(
        props.map((prop) => [prop, fillDefaults(options[prop])]),
    );
    return async (ctx, next) => {
        ctx.session = {} as S;
        const propSessions = await Promise.all(props.map(async (prop) => {
            const { initial, storage, getSessionKey, custom } = defaults[prop];
            const s = new PropertySession(
                // @ts-expect-error cannot express that the storage works for a concrete prop
                storage,
                ctx.session,
                prop,
                initial,
            );
            const key = await getSessionKey(ctx);
            await s.init(key, { custom, lazy: false });
            return s;
        }));
        await next(); // no catch: do not write back if middleware throws
        if (ctx.session == null) propSessions.forEach((s) => s.delete());
        await Promise.all(propSessions.map((s) => s.finish()));
    };
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
 * significantly reduce the database traffic (especially when your bot is added
 * to group chats), because it skips a read and a wrote operation for all
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
 * Check out the
 * [documentation](https://grammy.dev/plugins/session.html#lazy-sessions) on the
 * website to know more about how lazy sessions work in grammY.
 *
 * @param options Optional configuration to pass to the session middleware
 */
export function lazySession<S, C extends Context>(
    options: SessionOptions<S, C> = {},
): MiddlewareFn<C & LazySessionFlavor<S>> {
    if (options.type !== undefined && options.type !== "single") {
        throw new Error("Cannot use lazy multi sessions!");
    }
    const { initial, storage, getSessionKey, custom } = fillDefaults(options);
    return async (ctx, next) => {
        const propSession = new PropertySession(
            // @ts-expect-error suppress promise nature of values
            storage,
            ctx,
            "session",
            initial,
        );
        const key = await getSessionKey(ctx);
        await propSession.init(key, { custom, lazy: true });
        await next(); // no catch: do not write back if middleware throws
        await propSession.finish();
    };
}

/**
 * Internal class that manages a single property on the session. Can be used
 * both in a strict and a lazy way. Works by using `Object.defineProperty` to
 * install `O[P]`.
 */
// deno-lint-ignore ban-types
class PropertySession<O extends {}, P extends keyof O> {
    private key?: string;
    private value: O[P] | undefined;
    private promise: Promise<O[P] | undefined> | undefined;

    private fetching = false;
    private read = false;
    private wrote = false;

    constructor(
        private storage: StorageAdapter<O[P]>,
        private obj: O,
        private prop: P,
        private initial: (() => O[P]) | undefined,
    ) {}

    /** Performs a read op and stores the result in `this.value` */
    private load() {
        if (this.key === undefined) {
            // No session key provided, cannot load
            return;
        }
        if (this.wrote) {
            // Value was set, no need to load
            return;
        }
        // Perform read op if not cached
        if (this.promise === undefined) {
            this.fetching = true;
            this.promise = Promise.resolve(this.storage.read(this.key))
                .then((val?: O[P]) => {
                    this.fetching = false;
                    // Check for write op in the meantime
                    if (this.wrote) {
                        // Discard read op
                        return this.value;
                    }
                    // Store received value in `this.value`
                    if (val !== undefined) {
                        this.value = val;
                        return val;
                    }
                    // No value, need to initialize
                    val = this.initial?.();
                    if (val !== undefined) {
                        // Wrote initial value
                        this.wrote = true;
                        this.value = val;
                    }
                    return val;
                });
        }
        return this.promise;
    }

    async init(
        key: string | undefined,
        opts: { custom: boolean; lazy: boolean },
    ) {
        this.key = key;
        if (!opts.lazy) await this.load();
        Object.defineProperty(this.obj, this.prop, {
            enumerable: true,
            get: () => {
                if (key === undefined) {
                    const msg = undef("access", opts);
                    throw new Error(msg);
                }
                this.read = true;
                if (!opts.lazy || this.wrote) return this.value;
                this.load();
                return this.fetching ? this.promise : this.value;
            },
            set: (v) => {
                if (key === undefined) {
                    const msg = undef("assign", opts);
                    throw new Error(msg);
                }
                this.wrote = true;
                this.fetching = false;
                this.value = v;
            },
        });
    }

    delete() {
        Object.assign(this.obj, { [this.prop]: undefined });
    }

    async finish() {
        if (this.key !== undefined) {
            if (this.read) await this.load();
            if (this.read || this.wrote) {
                const value = await this.value;
                if (value == null) await this.storage.delete(this.key);
                else await this.storage.write(this.key, value);
            }
        }
    }
}

function fillDefaults<S, C extends Context>(opts: SessionOptions<S, C> = {}) {
    let { getSessionKey = defaultGetSessionKey, initial, storage } = opts;
    if (storage == null) {
        debug(
            "Storing session data in memory, all data will be lost when the bot restarts.",
        );
        storage = new MemorySessionStorage<S>();
    }
    const custom = getSessionKey !== defaultGetSessionKey;
    return { initial, storage, getSessionKey, custom };
}

/** Stores session data per chat by default */
function defaultGetSessionKey(ctx: Context): string | undefined {
    return ctx.chatId?.toString();
}

/** Returns a useful error message for when the session key is undefined */
function undef(
    op: "access" | "assign",
    opts: { custom: boolean; lazy?: boolean },
) {
    const { lazy = false, custom } = opts;
    const reason = custom
        ? "the custom `getSessionKey` function returned undefined for this update"
        : "this update does not belong to a chat, so the session key is undefined";
    return `Cannot ${op} ${lazy ? "lazy " : ""}session data because ${reason}!`;
}

// === Session migrations
/**
 * When enhancing a storage adapter, it needs to be able to store additional
 * information. It does this by wrapping the actual data inside an object, and
 * adding more properties to this wrapper.
 *
 * This interface defines the additional properties that need to be stored by a
 * storage adapter that supports enhanced sessions.
 */
export interface Enhance<T> {
    /** Version */
    v?: number;
    /** Data */
    __d: T;
    /** Expiry date */
    e?: number;
}
function isEnhance<T>(value?: T | Enhance<T>): value is Enhance<T> | undefined {
    return value === undefined ||
        typeof value === "object" && value !== null && "__d" in value;
}
/** Options for enhanced sessions */
export interface MigrationOptions<T> {
    /** The original storage adapter that will be enhanced */
    storage: StorageAdapter<Enhance<T>>;
    /**
     * A set of session migrations, defined as an object mapping from version
     * numbers to migration functions that transform data to the respective
     * version.
     */
    migrations?: Migrations;
    /**
     * Number of milliseconds after the last write operation until the session
     * data expires.
     */
    millisecondsToLive?: number;
}
/**
 * A mapping from version numbers to session migration functions. Each entry in
 * this object has a version number as a key, and a function as a value.
 *
 * For a key `n`, the respective value should be a function that takes the
 * previous session data and migrates it to conform with the data that is used
 * by version `n`. The previous session data is defined by the next key less
 * than `n`, such as `n-1`. Versions don't have to be integers, nor do all
 * versions have to be adjacent. For example, you can use `[1, 1.5, 4]` as
 * versions. If `n` is the lowest value in the set of keys, the function stored
 * for `n` can be used to migrate session data that was stored before migrations
 * were used.
 */
export interface Migrations {
    // deno-lint-ignore no-explicit-any
    [version: number]: (old: any) => any;
}

/**
 * You can use this function to transform an existing storage adapter, and add
 * more features to it. Currently, you can add session migrations and expiry
 * dates.
 *
 * You can use this function like so:
 * ```ts
 * const storage = ... // define your storage adapter
 * const enhanced = enhanceStorage({ storage, millisecondsToLive: 500 })
 * bot.use(session({ storage: enhanced }))
 * ```
 *
 * @param options Session enhancing options
 * @returns The enhanced storage adapter
 */
export function enhanceStorage<T>(
    options: MigrationOptions<T>,
): StorageAdapter<T> {
    let { storage, millisecondsToLive, migrations } = options;
    storage = compatStorage(storage);
    if (millisecondsToLive !== undefined) {
        storage = timeoutStorage(storage, millisecondsToLive);
    }
    if (migrations !== undefined) {
        storage = migrationStorage(storage, migrations);
    }
    return wrapStorage(storage);
}

function compatStorage<T>(
    storage: StorageAdapter<Enhance<T>>,
): StorageAdapter<Enhance<T>> {
    return {
        read: async (k) => {
            const v = await storage.read(k);
            return isEnhance(v) ? v : { __d: v };
        },
        write: (k, v) => storage.write(k, v),
        delete: (k) => storage.delete(k),
    };
}

function timeoutStorage<T>(
    storage: StorageAdapter<Enhance<T>>,
    millisecondsToLive: number,
): StorageAdapter<Enhance<T>> {
    const ttlStorage: StorageAdapter<Enhance<T>> = {
        read: async (k) => {
            const value = await storage.read(k);
            if (value === undefined) return undefined;
            if (value.e === undefined) {
                await ttlStorage.write(k, value);
                return value;
            }
            if (value.e < Date.now()) {
                await ttlStorage.delete(k);
                return undefined;
            }
            return value;
        },
        write: async (k, v) => {
            v.e = addExpiryDate(v, millisecondsToLive).expires;
            await storage.write(k, v);
        },
        delete: (k) => storage.delete(k),
    };
    return ttlStorage;
}
function migrationStorage<T>(
    storage: StorageAdapter<Enhance<T>>,
    migrations: Migrations,
): StorageAdapter<Enhance<T>> {
    const versions = Object.keys(migrations)
        .map((v) => parseInt(v))
        .sort((a, b) => a - b);
    const count = versions.length;
    if (count === 0) throw new Error("No migrations given!");
    const earliest = versions[0];
    const last = count - 1;
    const latest = versions[last];
    const index = new Map<number, number>();
    versions.forEach((v, i) => index.set(v, i)); // inverse array lookup
    function nextAfter(current: number) {
        // TODO: use `findLastIndex` with Node 18
        let i = last;
        while (current <= versions[i]) i--;
        return i;
        // return versions.findLastIndex((v) => v < current)
    }
    return {
        read: async (k) => {
            const val = await storage.read(k);
            if (val === undefined) return val;
            let { __d: value, v: current = earliest - 1 } = val;
            let i = 1 + (index.get(current) ?? nextAfter(current));
            for (; i < count; i++) value = migrations[versions[i]](value);
            return { ...val, v: latest, __d: value };
        },
        write: (k, v) => storage.write(k, { v: latest, ...v }),
        delete: (k) => storage.delete(k),
    };
}
function wrapStorage<T>(
    storage: StorageAdapter<Enhance<T>>,
): StorageAdapter<T> {
    return {
        read: (k) => Promise.resolve(storage.read(k)).then((v) => v?.__d),
        write: (k, v) => storage.write(k, { __d: v }),
        delete: (k) => storage.delete(k),
    };
}

// === Memory storage adapter
/**
 * The memory session storage is a built-in storage adapter that saves your
 * session data in RAM using a regular JavaScript `Map` object. If you use this
 * storage adapter, all sessions will be lost when your process terminates or
 * restarts. Hence, you should only use it for short-lived data that is not
 * important to persist.
 *
 * This class is used as default if you do not provide a storage adapter, e.g.
 * to your database.
 *
 * This storage adapter features expiring sessions. When instantiating this class
 * yourself, you can pass a time to live in milliseconds that will be used for
 * each session object. If a session for a user expired, the session data will
 * be discarded on its first read, and a fresh session object as returned by the
 * `initial` option (or undefined) will be put into place.
 */
export class MemorySessionStorage<S> implements StorageAdapter<S> {
    /**
     * Internally used `Map` instance that stores the session data
     */
    protected readonly storage = new Map<
        string,
        { session: S; expires?: number }
    >();

    /**
     * Constructs a new memory session storage with the given time to live. Note
     * that this storage adapter will not store your data permanently.
     *
     * @param timeToLive TTL in milliseconds, default is `Infinity`
     */
    constructor(private readonly timeToLive?: number) {}

    read(key: string) {
        const value = this.storage.get(key);
        if (value === undefined) return undefined;
        if (value.expires !== undefined && value.expires < Date.now()) {
            this.delete(key);
            return undefined;
        }
        return value.session;
    }

    /**
     * @deprecated Use {@link readAllValues} instead
     */
    readAll() {
        return this.readAllValues();
    }

    readAllKeys() {
        return Array.from(this.storage.keys());
    }

    readAllValues() {
        return Array
            .from(this.storage.keys())
            .map((key) => this.read(key))
            .filter((value): value is S => value !== undefined);
    }

    readAllEntries() {
        return Array.from(this.storage.keys())
            .map((key) => [key, this.read(key)])
            .filter((pair): pair is [string, S] => pair[1] !== undefined);
    }

    has(key: string) {
        return this.storage.has(key);
    }

    write(key: string, value: S) {
        this.storage.set(key, addExpiryDate(value, this.timeToLive));
    }

    delete(key: string) {
        this.storage.delete(key);
    }
}

function addExpiryDate<T>(value: T, ttl?: number) {
    if (ttl !== undefined && ttl < Infinity) {
        const now = Date.now();
        return { session: value, expires: now + ttl };
    } else {
        return { session: value };
    }
}
