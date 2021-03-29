import {
    ApiResponse,
    debug as d,
    Opts,
    Telegram,
    baseFetchConfig,
} from '../platform.ts'
import { GrammyError } from './error.ts'
import {
    requiresFormDataUpload,
    transformPayload,
    createJsonPayload,
    createFormDataPayload,
} from './payload.ts'
const debug = d('grammy:core')

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
              signal?: AbortSignal
          ) => Promise<ReturnType<Telegram[M]>>
}

/**
 * Small utility interface that abstracts from webhook reply calls of different
 * web frameworks.
 */
export interface WebhookReplyEnvelope {
    send?: (payload: string) => void | Promise<void>
}

/**
 * Type of a function that can perform an API call. Used for Tranfromers.
 */
export type ApiCallFn = <M extends keyof RawApi>(
    method: M,
    payload: Opts<M>,
    signal?: AbortSignal
) => Promise<ApiResponse<ReturnType<Telegram[M]>>>

/**
 * API call transformers are functions that can access and modify the method and
 * payload of an API call on the fly. This can be useful if you want to
 * implement rate limiting or other things against the Telegram Bot API.
 *
 * Confer the grammY documentation to read more about how to use transformers.
 */
export type Transformer = <M extends keyof RawApi>(
    prev: ApiCallFn,
    method: M,
    payload: Opts<M>,
    signal?: AbortSignal
) => Promise<ApiResponse<ReturnType<Telegram[M]>>>
export type TransformerConsumer = TransformableApi['use']
/**
 * A transformable API enhances the `RawApi` type by transformers.
 */
export interface TransformableApi {
    /**
     * Access to the raw API that the tranformers will be installed on.
     */
    raw: RawApi
    /**
     * Can be used to register any number of transformers on the API.
     */
    use: (...transformers: Transformer[]) => this
    /**
     * Returns a readonly list or the currently installed transformers. The list
     * is sorted by time of installation where index 0 represents the
     * transformer that was installed first.
     */
    installedTransformers: Transformer[]
}

// Transformer base functions
const concatTransformer = (prev: ApiCallFn, trans: Transformer): ApiCallFn => (
    method,
    payload,
    signal
) => trans(prev, method, payload, signal)

/**
 * Options to pass to the API client that eventually connects to the Telegram
 * Bot API server and makes the HTTP requests.
 */
export interface ApiClientOptions {
    /**
     * Root URL of the Telegram Bot API server. Default: https://api.telegram.org
     */
    apiRoot?: string
    /**
     * URL builder function for API calls. Can be used to modify which API server
     * should be called.
     *
     * @param root The root URL that was passed in `apiRoot`, or its default value
     * @param token The bot's token that was passed when creating the bot
     * @param method The API method to be called, e.g. `getMe`
     * @returns The url that will be fetched during the API call
     */
    buildUrl?: (
        root: string,
        token: string,
        method: string
    ) => Parameters<typeof fetch>[0]
    /**
     * If the bot is running on webhooks, as soon as the bot receives an update
     * from Telegram, it is possible to make up to one API call in the response
     * to the webhook request. As a benefit, this saves your bot from making up
     * to one HTTP request per update. However, there are a number of drawbacks
     * to using this:
     * 1) You will not be able to handle potential errors of the respective API
     *    call.
     * 2) More importantly, you also won't have access to the response object,
     *    so e.g. calling `sendMessage` will not give you access to the message
     *    you send.
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
    canUseWebhookReply?: (method: keyof RawApi) => boolean
    /**
     * Base configuration for `fetch` calls. Specify any additional parameters to
     * use when fetching a method of the Telegram Bot API. Default: `{ compress:
     * true }` (Node), `{}` (Deno)
     */
    baseFetchConfig?: Omit<
        Exclude<Parameters<typeof fetch>[1], undefined>,
        'method' | 'headers' | 'body'
    >
}

const DEFAULT_OPTIONS: Required<ApiClientOptions> = {
    apiRoot: 'https://api.telegram.org',
    buildUrl: (root, token, method) => `${root}/bot${token}/${method}`,
    baseFetchConfig,
    canUseWebhookReply: () => false,
}

class ApiClient {
    private readonly options: Required<ApiClientOptions>

    private hasUsedWebhookReply = false

    readonly installedTransformers: Transformer[] = []

    constructor(
        private readonly token: string,
        options?: ApiClientOptions,
        private readonly webhookReplyEnvelope: WebhookReplyEnvelope = {}
    ) {
        this.options = { ...DEFAULT_OPTIONS, ...options }
    }

    private call: ApiCallFn = async (method, payload, signal) => {
        debug('Calling', method)
        const url = this.options.buildUrl(
            this.options.apiRoot,
            this.token,
            method
        )
        const transformed = transformPayload(method, payload ?? {})
        const config = requiresFormDataUpload(transformed)
            ? createFormDataPayload(transformed)
            : createJsonPayload(transformed)
        if (
            this.webhookReplyEnvelope.send !== undefined &&
            !this.hasUsedWebhookReply &&
            typeof config.body === 'string' &&
            this.options.canUseWebhookReply(method)
        ) {
            this.hasUsedWebhookReply = true
            await this.webhookReplyEnvelope.send(config.body)
            return { ok: true, result: true }
        } else {
            const res = await fetch(url, {
                ...this.options.baseFetchConfig,
                signal,
                ...config,
            })
            return await res.json()
        }
    }

    use(...transformers: Transformer[]) {
        this.call = transformers.reduce(concatTransformer, this.call)
        this.installedTransformers.push(...transformers)
        return this
    }

    async callApi<M extends keyof RawApi>(
        method: M,
        payload: Opts<M>,
        signal?: AbortSignal
    ) {
        const data = await this.call(method, payload, signal)
        if (data.ok) return data.result
        else throw new GrammyError(`Call to ${method} failed!`, data, payload)
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
export function createRawApi(
    token: string,
    options?: ApiClientOptions,
    webhookReplyEnvelope?: WebhookReplyEnvelope
): TransformableApi {
    const client = new ApiClient(token, options, webhookReplyEnvelope)

    const proxyHandler: ProxyHandler<RawApi> = {
        get(_, m: keyof RawApi) {
            return client.callApi.bind(client, m)
        },
        ...proxyMethods,
    }
    const raw = new Proxy({} as RawApi, proxyHandler)
    const installedTransformers = client.installedTransformers
    const api: TransformableApi = {
        raw,
        installedTransformers,
        use: (...t) => {
            client.use(...t)
            return api
        },
    }

    return api
}

const proxyMethods = {
    set() {
        return false
    },
    defineProperty() {
        return false
    },
    deleteProperty() {
        return false
    },
    ownKeys() {
        return []
    },
}
