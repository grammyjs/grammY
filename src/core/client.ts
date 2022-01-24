import {
    type ApiResponse,
    baseFetchConfig,
    debug as d,
    type Opts,
    type Telegram,
} from "../platform.deno.ts";
import { toGrammyError, toHttpError } from "./error.ts";
import {
    createFormDataPayload,
    createJsonPayload,
    requiresFormDataUpload,
} from "./payload.ts";
const debug = d("grammy:core");

export type Methods<R extends RawApi> = string & keyof R;

// Available under `bot.api.raw`
/**
 * Represents the raw Telegram Bot API with all methods specified 1:1 as
 * documented on the website (https://core.telegram.org/bots/api).
 *
 * Every method takes an optional `AbortSignal` object that allows to cancel the
 * API call if desired.
 */
export type RawApi = {
    [M in keyof Telegram]: Parameters<Telegram[M]>[0] extends undefined
        ? (signal?: AbortSignal) => Promise<ReturnType<Telegram[M]>>
        : (
            args: Opts<M>,
            signal?: AbortSignal,
        ) => Promise<ReturnType<Telegram[M]>>;
};

export type Payload<M extends Methods<R>, R extends RawApi> = M extends unknown
    ? R[M] extends (signal?: AbortSignal) => unknown // deno-lint-ignore ban-types
        ? {} // deno-lint-ignore no-explicit-any
    : R[M] extends (args: any, signal?: AbortSignal) => unknown
        ? Parameters<R[M]>[0]
    : never
    : never;

/**
 * Small utility interface that abstracts from webhook reply calls of different
 * web frameworks.
 */
export interface WebhookReplyEnvelope {
    send?: (payload: string) => void | Promise<void>;
}

/**
 * Type of a function that can perform an API call. Used for Transformers.
 */
export type ApiCallFn<R extends RawApi = RawApi> = <M extends Methods<R>>(
    method: M,
    payload: Payload<M, R>,
    signal?: AbortSignal,
) => Promise<ApiResponse<ApiCallResult<M, R>>>;

type ApiCallResult<M extends Methods<R>, R extends RawApi> = R[M] extends (
    ...args: unknown[]
) => unknown ? Await<ReturnType<R[M]>>
    : never;
type Await<T> = T extends PromiseLike<infer V> ? V : T;

/**
 * API call transformers are functions that can access and modify the method and
 * payload of an API call on the fly. This can be useful if you want to
 * implement rate limiting or other things against the Telegram Bot API.
 *
 * Confer the grammY
 * [documentation](https://grammy.dev/advanced/transformers.html) to read more
 * about how to use transformers.
 */
export type Transformer<R extends RawApi = RawApi> = <M extends Methods<R>>(
    prev: ApiCallFn<R>,
    method: M,
    payload: Payload<M, R>,
    signal?: AbortSignal,
) => Promise<ApiResponse<ApiCallResult<M, R>>>;
export type TransformerConsumer<R extends RawApi = RawApi> = TransformableApi<
    R
>["use"];
/**
 * A transformable API enhances the `RawApi` type by transformers.
 */
export interface TransformableApi<R extends RawApi = RawApi> {
    /**
     * Access to the raw API that the tranformers will be installed on.
     */
    raw: R;
    /**
     * Can be used to register any number of transformers on the API.
     */
    use: (...transformers: Transformer<R>[]) => this;
    /**
     * Returns a readonly list or the currently installed transformers. The list
     * is sorted by time of installation where index 0 represents the
     * transformer that was installed first.
     */
    installedTransformers: Transformer<R>[];
}

// Transformer base functions
function concatTransformer<R extends RawApi>(
    prev: ApiCallFn<R>,
    trans: Transformer<R>,
): ApiCallFn<R> {
    return (method, payload, signal) => trans(prev, method, payload, signal);
}

/**
 * Options to pass to the API client that eventually connects to the Telegram
 * Bot API server and makes the HTTP requests.
 */
export interface ApiClientOptions {
    /**
     * Root URL of the Telegram Bot API server. Default:
     * https://api.telegram.org
     */
    apiRoot?: string;
    /**
     * URL builder function for API calls. Can be used to modify which API
     * server should be called.
     *
     * @param root The URL that was passed in `apiRoot`, or its default value
     * @param token The bot's token that was passed when creating the bot
     * @param method The API method to be called, e.g. `getMe`
     * @returns The URL that will be fetched during the API call
     */
    buildUrl?: (
        root: string,
        token: string,
        method: string,
    ) => Parameters<typeof fetch>[0];
    /**
     * Maximum number of seconds that a request to the Bot API server may take.
     * If a request has not completed before this time has elapsed, grammY
     * aborts the request and errors. Without such a timeout, networking issues
     * may cause your bot to leave open a connection indefinitely, which may
     * effectively make your bot freeze.
     *
     * You probably do not have to care about this option. In rare cases, you
     * may want to adjust it if you are transferring large files via slow
     * connections to your own Bot API server.
     *
     * The default number of seconds is `500`, which corresponds to 8 minutes
     * and 20 seconds. Note that this is also the value that is hard-coded in
     * the official Bot API server, so you cannot perform any successful
     * requests that exceed this time frame (even if you would allow it in
     * grammY). Setting this option to higher than the default only makes sense
     * with a custom Bot API server.
     */
    timeoutSeconds?: number;
    /**
     * If the bot is running on webhooks, as soon as the bot receives an update
     * from Telegram, it is possible to make up to one API call in the response
     * to the webhook request. As a benefit, this saves your bot from making up
     * to one HTTP request per update. However, there are a number of drawbacks
     * to using this:
     * 1) You will not be able to handle potential errors of the respective API
     *    call. This includes rate limiting errors, so sent messages can be
     *    swallowed by the Bot API server and there is no way to detect if a
     *    message was actually sent or not.
     * 2) More importantly, you also won't have access to the response object,
     *    so e.g. calling `sendMessage` will not give you access to the message
     *    you sent.
     * 3) Furthermore, it is not possible to cancel the request. The
     *    `AbortSignal` will be disregarded.
     * 4) Note also that the types in grammY do not reflect the consequences of
     *    a performed webhook callback! For instance, they indicate that you
     *    always receive a response object, so it is your own responsibility to
     *    make sure you're not screwing up while using this minor performance
     *    optimization.
     *
     * With this warning out of the way, here is what you can do with the
     * `canUseWebhookReply` option: it can be used to pass a function that
     * determines whether to use webhook reply for the given method. It will
     * only be invoked if the payload can be sent as JSON. It will not be
     * invoked again for a given update after it returned `true`, indicating
     * that the API call should be performed as a webhook send. In other words,
     * subsequent API calls (during the same update) will always perform their
     * own HTTP requests.
     *
     * @param method The method to call
     */
    canUseWebhookReply?: (method: string) => boolean;
    /**
     * Base configuration for `fetch` calls. Specify any additional parameters
     * to use when fetching a method of the Telegram Bot API. Default: `{
     * compress: true }` (Node), `{}` (Deno)
     */
    baseFetchConfig?: Omit<
        NonNullable<Parameters<typeof fetch>[1]>,
        "method" | "headers" | "body"
    >;
    /**
     * When the network connection is unreliable and some API requests fail
     * because of that, grammY will throw errors that tell you exactly which
     * requests failed. However, the error messages do not disclose the fetched
     * URL as it contains your bot's token. Logging it may lead to token leaks.
     *
     * If you are sure that no logs are ever posted in Telegram chats, GitHub
     * issues, or otherwise shared, you can set this option to `true` in order
     * to obtain more detailed logs that may help you debug your bot. The
     * default value is `false`, meaning that the bot token is not logged.
     */
    sensitiveLogs?: boolean;
}

class ApiClient<R extends RawApi> {
    private readonly options: Required<ApiClientOptions>;

    private hasUsedWebhookReply = false;

    readonly installedTransformers: Transformer<R>[] = [];

    constructor(
        private readonly token: string,
        options: ApiClientOptions = {},
        private readonly webhookReplyEnvelope: WebhookReplyEnvelope = {},
    ) {
        const apiRoot = options.apiRoot ?? "https://api.telegram.org";
        this.options = {
            apiRoot,
            buildUrl: options.buildUrl ??
                ((root, token, method) => `${root}/bot${token}/${method}`),
            timeoutSeconds: options.timeoutSeconds ?? 500,
            baseFetchConfig: {
                ...baseFetchConfig(apiRoot),
                ...options.baseFetchConfig,
            },
            canUseWebhookReply: options.canUseWebhookReply ?? (() => false),
            sensitiveLogs: options.sensitiveLogs ?? false,
        };
        if (this.options.apiRoot.endsWith("/")) {
            throw new Error(
                `Remove the trailing '/' from the 'apiRoot' option (use '${
                    this.options.apiRoot.substring(
                        0,
                        this.options.apiRoot.length - 1,
                    )
                }' instead of '${this.options.apiRoot}')`,
            );
        }
    }

    private call: ApiCallFn<R> = async <M extends Methods<R>>(
        method: M,
        p: Payload<M, R>,
        s?: AbortSignal,
    ) => {
        const payload = p ?? {};
        debug("Calling", method);
        // General config
        const opts = this.options;
        const formDataRequired = requiresFormDataUpload(payload);
        // Short-circuit on webhook reply
        if (
            this.webhookReplyEnvelope.send !== undefined &&
            !this.hasUsedWebhookReply &&
            !formDataRequired &&
            opts.canUseWebhookReply(method)
        ) {
            this.hasUsedWebhookReply = true;
            const config = createJsonPayload({ ...payload, method });
            await this.webhookReplyEnvelope.send(config.body);
            return { ok: true, result: true as ApiCallResult<M, R> };
        }
        // Handle timeout errors
        const abortController = makeAbortable(s);
        let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            const timeoutSeconds = opts.timeoutSeconds;
            timeoutHandle = setTimeout(() => {
                const msg =
                    `Request to '${method}' timed out after ${timeoutSeconds} seconds`;
                reject(new Error(msg));
                abortController.abort();
            }, 1000 * timeoutSeconds);
        });
        // Handle errors in request stream
        let onStreamError: (err: unknown) => void;
        const streamErrorPromise = new Promise<never>((_, reject) => {
            onStreamError = (err: unknown) => {
                reject(err);
                abortController.abort();
            };
        });
        // Build request URL and config
        const url = opts.buildUrl(opts.apiRoot, this.token, method);
        const config = formDataRequired
            ? createFormDataPayload(payload, (err) => onStreamError(err))
            : createJsonPayload(payload);
        const signal = abortController.signal;
        const options = { ...opts.baseFetchConfig, signal, ...config };
        // Perform fetch call, and handle networking errors
        const successPromise = fetch(url, options)
            .catch(toHttpError(method, opts.sensitiveLogs));
        // Those are the three possible outcomes of the fetch call:
        const operations = [successPromise, streamErrorPromise, timeoutPromise];
        // Wait for result
        try {
            const res = await Promise.race(operations);
            return await res.json();
        } finally {
            if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
        }
    };

    use(...transformers: Transformer<R>[]) {
        this.call = transformers.reduce(concatTransformer, this.call);
        this.installedTransformers.push(...transformers);
        return this;
    }

    async callApi<M extends Methods<R>>(
        method: M,
        payload: Payload<M, R>,
        signal?: AbortSignal,
    ) {
        const data = await this.call(method, payload, signal);
        if (data.ok) return data.result;
        else throw toGrammyError(method, payload, data);
    }
}

/**
 * Creates a new transformable API, i.e. an object that lets you perform raw API
 * calls to the Telegram Bot API server but pass the calls through a stack of
 * transformers before. This will create a new API client instance under the
 * hood that will be used to connect to the Telegram servers. You therefore need
 * to pass the bot token. In addition, you may pass API client options as well
 * as a webhook reply envelope that allows the client to perform up to one HTTP
 * request in response to a webhook call if this is desired.
 *
 * @param token The bot's token
 * @param options A number of options to pass to the created API client
 * @param webhookReplyEnvelope The webhook reply envelope that will be used
 */
export function createRawApi<R extends RawApi>(
    token: string,
    options?: ApiClientOptions,
    webhookReplyEnvelope?: WebhookReplyEnvelope,
): TransformableApi<R> {
    const client = new ApiClient<R>(token, options, webhookReplyEnvelope);

    const proxyHandler: ProxyHandler<R> = {
        get(_, m: Methods<R> | "toJSON") {
            return m === "toJSON"
                ? "__internal"
                : client.callApi.bind(client, m);
        },
        ...proxyMethods,
    };
    const raw = new Proxy({} as R, proxyHandler);
    const installedTransformers = client.installedTransformers;
    const api: TransformableApi<R> = {
        raw,
        installedTransformers,
        use: (...t) => {
            client.use(...t);
            return api;
        },
    };

    return api;
}

const proxyMethods = {
    set() {
        return false;
    },
    defineProperty() {
        return false;
    },
    deleteProperty() {
        return false;
    },
    ownKeys() {
        return [];
    },
};

function makeAbortable(signal?: AbortSignal): AbortController {
    const abortController = new AbortController();
    if (signal === undefined) return abortController;
    const sig = signal;
    function abort() {
        abortController.abort();
        sig.removeEventListener("abort", abort);
    }
    if (sig.aborted) abort();
    else sig.addEventListener("abort", abort);
    return { abort, signal: abortController.signal };
}
