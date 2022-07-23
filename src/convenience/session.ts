import { type Context } from "../context.ts";
import { type MiddlewareFn } from "../composer.ts";
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
// deno-lint-ignore no-explicit-any
export type LazyMultiSessionFlavor<S> = S extends Record<string, any> // unknown breaks extends
    ? LazySessionRecord<S>
    : never;
interface LazySessionRecord<S extends Record<string, unknown>> {
    get session(): { [K in keyof S]: MaybePromise<S[K]> };
    set session(
        session: { [K in keyof S]: MaybePromise<S[K]> } | null | undefined,
    );
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
}

/**
 * Options for session middleware.
 */
export interface SessionOptions<S> {
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
     * `ctx.chat?.id`.
     */
    getSessionKey?: (ctx: Context) => MaybePromise<string | undefined>;
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

// deno-lint-ignore no-explicit-any
export type MultiSessionOptions<S> = S extends Record<string, any> // unknown breaks extends
    ? { type: "multi" } & MultiSessionOptionsRecord<S>
    : never;
type MultiSessionOptionsRecord<S extends Record<string, unknown>> = {
    [K in keyof S]: SessionOptions<S[K]>;
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
 * It is recommended to make use of the `inital` option in the configuration
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
    options: SessionOptions<S> | MultiSessionOptions<S> = {},
): MiddlewareFn<C & SessionFlavor<S>> {
    return options.type === "multi"
        ? strictMultiSession(options)
        : strictSingleSession(options);
}

function strictSingleSession<S, C extends Context>(
    options: SessionOptions<S>,
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
    options: MultiSessionOptions<S>,
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
                // @ts-ignore cannot express that the storage works for a concrete prop
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
    options?: SessionOptions<S>,
): MiddlewareFn<C & LazySessionFlavor<S>>;
export function lazySession<S, C extends Context>(
    options?: MultiSessionOptions<S>,
): MiddlewareFn<C & LazyMultiSessionFlavor<S>>;
export function lazySession<S>(
    options: SessionOptions<S> | MultiSessionOptions<S> = {},
) {
    return options.type === "multi"
        ? lazyMultiSession(options)
        : lazySingleSession(options);
}

function lazySingleSession<S, C extends Context>(
    options: SessionOptions<S>,
): MiddlewareFn<C & LazySessionFlavor<S>> {
    const { initial, storage, getSessionKey, custom } = fillDefaults(options);
    return async (ctx, next) => {
        const propSession = new PropertySession(
            // @ts-ignore suppress promise nature of values
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

function lazyMultiSession<S, C extends Context>(
    options: MultiSessionOptions<S>,
): MiddlewareFn<C & LazyMultiSessionFlavor<S>> {
    const props = Object.keys(options).filter((k) => k !== "type");
    const defaults = Object.fromEntries(
        props.map((prop) => [prop, fillDefaults(options[prop])]),
    );
    return async (ctx, next) => {
        ctx.session = {} as S;
        const propSessions = await Promise.all(props.map(async (prop) => {
            const { initial, storage, getSessionKey, custom } = defaults[prop];
            const s = new PropertySession(
                // @ts-ignore cannot express that the storage works for a concrete prop
                storage,
                ctx.session,
                prop,
                initial,
            );
            const key = await getSessionKey(ctx);
            await s.init(key, { custom, lazy: true });
            return s;
        }));
        await next(); // no catch: do not write back if middleware throws
        if (ctx.session == null) propSessions.forEach((s) => s.delete());
        await Promise.all(propSessions.map((s) => s.finish()));
    };
}

class PropertySession<O, P extends keyof O> {
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
                .then((val) => {
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

function fillDefaults<S>(opts: SessionOptions<S> = {}) {
    let { getSessionKey = defaultGetSessionKey, initial, storage } = opts;
    if (storage == null) {
        debug(
            "Storing session data in memory, all data will be lost when the bot restarts.",
        );
        storage = new MemorySessionStorage();
    }
    const custom = getSessionKey !== defaultGetSessionKey;
    return { initial, storage, getSessionKey, custom };
}

/** Stores session data per chat by default */
function defaultGetSessionKey(ctx: Context): string | undefined {
    return ctx.chat?.id.toString();
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
export interface Enhance<T> {
    __v?: number;
    __d: T;
}
export interface MigrationOptions<T> {
    migrations?: Migrations;
    storage: StorageAdapter<Enhance<T>>;
}
export interface Migrations {
    // deno-lint-ignore no-explicit-any
    [version: number]: (old: any) => any;
}

export function enhanceStorage<T>(
    options: MigrationOptions<T>,
): StorageAdapter<T> {
    const { migrations: m, storage } = options;
    if (m === undefined) {
        return {
            read: (k) => Promise.resolve(storage.read(k)).then((v) => v?.__d),
            write: (k, v) => storage.write(k, { __d: v }),
            delete: (k) => storage.delete(k),
        };
    }
    const migrations = m;
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
    function migrate(old: T | Enhance<T>): T {
        let { __d: value, __v: current = earliest - 1 } =
            typeof old === "object" && old !== null && "__d" in old
                ? old
                : { __d: old };
        let i = 1 + (index.get(current) ?? nextAfter(current));
        for (; i < count; i++) value = migrations[versions[i]](value);
        return value;
    }
    return {
        read: async (k) => {
            const value = await storage.read(k);
            return value === undefined ? undefined : migrate(value);
        },
        write: (k, v) => storage.write(k, { __v: latest, __d: v }),
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
 * This storage adapter features expiring sessions. When instatiating this class
 * yourself, you can pass a time to live in milliseconds that will be used for
 * each session object. If a session for a user expired, the session data will
 * be discarded on its first read, and a fresh session object as returned by the
 * `inital` option (or undefined) will be put into place.
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
    constructor(private readonly timeToLive = Infinity) {}

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
     * Reads the values for all keys of the session storage, and returns them as
     * an array.
     */
    readAll() {
        return Array
            .from(this.storage.keys())
            .map((key) => this.read(key))
            .filter((value): value is S => value !== undefined);
    }

    write(key: string, value: S) {
        this.storage.set(key, this.addExpiryDate(value));
    }

    private addExpiryDate(value: S) {
        const ttl = this.timeToLive;
        if (ttl !== undefined && ttl < Infinity) {
            const now = Date.now();
            return { session: value, expires: now + ttl };
        } else {
            return { session: value };
        }
    }

    delete(key: string) {
        this.storage.delete(key);
    }
}
