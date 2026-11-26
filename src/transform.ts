import type { ApiCallFn, ApiCallResult, CallData, RawApi } from "./client.ts";
import type { ApiResponse, MaybeArray, MaybePromise } from "./types.ts";

/**
 * API call transformers are functions that can access and modify the method and
 * payload of an API call on the fly. This can be useful if you want to
 * implement rate limiting or other things against the Telegram Bot API.
 *
 * Confer the grammY
 * [documentation](https://grammy.dev/advanced/transformers) to read more
 * about how to use transformers.
 */
export type TransformerFn<
    R extends RawApi = RawApi,
    D extends CallData<R> = CallData<R>,
> = <E extends D>(
    prev: ApiCallFn<R>,
    data: E,
    signal?: AbortSignal,
) => Promise<ApiResponse<ApiCallResult<E["method"], R>>>;
export interface TransformerObj<
    R extends RawApi = RawApi,
    D extends CallData<R> = CallData<R>,
> {
    transformer(): TransformerFn<R, D>;
}
export type Transformer<
    R extends RawApi = RawApi,
    D extends CallData<R> = CallData<R>,
> =
    | TransformerFn<R, D>
    | TransformerObj<R, D>;

function pass<R extends RawApi>(
    prev: ApiCallFn<R>,
    data: CallData<R>,
    signal?: AbortSignal,
) {
    return prev(data, signal);
}
function flatten<R extends RawApi>(tf: Transformer<R>): TransformerFn<R> {
    return typeof tf === "function"
        ? tf
        : (prev, data, signal) => tf.transformer()(prev, data, signal);
}
function concat<R extends RawApi>(
    last: TransformerFn<R>,
    andBefore: TransformerFn<R>,
): TransformerFn<R> {
    return last === pass
        ? andBefore
        : (prev, data, signal) =>
            last((d, s) => andBefore(prev, d, s), data, signal);
}

export class TransformerComposer<
    R extends RawApi = RawApi,
    D extends CallData<R> = CallData<R>,
> implements TransformerObj<R, D> {
    private handler: TransformerFn<R, D>;

    constructor(...transformers: Array<Transformer<R, D>>) {
        this.handler = transformers.length === 0
            ? pass
            : transformers.map(flatten).reduce(concat);
    }

    transformer(): TransformerFn<R, D> {
        return this.handler;
    }

    use(...transformers: Array<Transformer<R, D>>): TransformerComposer<R, D> {
        const composer = new TransformerComposer(...transformers);
        this.handler = concat(this.handler, flatten(composer));
        return composer;
    }

    on<M extends D["method"]>(
        method: MaybeArray<M>,
        ...transformers: Array<Transformer<R, Extract<D, { method: M }>>>
    ): TransformerComposer<R, Extract<D, { method: M }>> {
        const methods: Array<D["method"]> = Array.isArray(method)
            ? method
            : [method];

        return this.filter(
            (data): data is Extract<D, { method: M }> =>
                methods.includes(data.method),
            ...transformers,
        );
    }

    filter<E extends D>(
        predicate: (data: D, signal?: AbortSignal) => data is E,
        ...transformers: Array<Transformer<R, E>>
    ): TransformerComposer<R, E>;
    filter<E extends D>(
        predicate: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<(data: D) => data is E>,
        ...middleware: Array<Transformer<R, E>>
    ): TransformerComposer<R, E>;
    filter(
        predicate: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<boolean | ((data: D) => boolean)>,
        ...transformers: Array<Transformer<R, D>>
    ): TransformerComposer<R, D>;
    filter(
        predicate: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<boolean | ((data: D) => boolean)>,
        ...transformers: Array<Transformer<R, D>>
    ) {
        const composer = new TransformerComposer(...transformers);
        this.branch(predicate, composer);
        return composer;
    }

    drop(
        predicate: (data: D, signal?: AbortSignal) => MaybePromise<boolean>,
        ...transformers: Array<Transformer<R, D>>
    ): TransformerComposer<R, D> {
        return this.filter(
            async (data: D, signal?: AbortSignal) =>
                !(await predicate(data, signal)),
            ...transformers,
        );
    }

    lazy(
        transformerFactory: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<MaybeArray<Transformer<R, D>>>,
    ): TransformerComposer<R, D> {
        return this.use(async (prev, data, signal) => {
            const transformer = await transformerFactory(data, signal);
            const composer = Array.isArray(transformer)
                ? new TransformerComposer(...transformer)
                : new TransformerComposer(transformer);
            return await flatten(composer)(prev, data, signal);
        });
    }

    route<T extends Record<PropertyKey, Transformer<R, D>>>(
        router: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<undefined | keyof T>,
        routeHandlers: T,
        fallback: Transformer<R, D> = pass,
    ): TransformerComposer<R, D> {
        return this.lazy(async (data, signal) => {
            const route = await router(data, signal);
            return (route === undefined || !routeHandlers[route]
                ? fallback
                : routeHandlers[route]) ?? [];
        });
    }

    branch<E extends D>(
        predicate: (data: D, signal?: AbortSignal) => data is E,
        trueTransformer: MaybeArray<Transformer<R, E>>,
        falseTransformer?: MaybeArray<Transformer<R, D>>,
    ): TransformerComposer<R, D>;
    branch<E extends D>(
        predicate: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<(data: D, signal?: AbortSignal) => data is E>,
        trueTransformer: MaybeArray<Transformer<R, E>>,
        falseTransformer?: MaybeArray<Transformer<R, D>>,
    ): TransformerComposer<R, D>;
    branch(
        predicate: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<
            boolean | ((data: D, signal?: AbortSignal) => boolean)
        >,
        trueTransformer: MaybeArray<Transformer<R, D>>,
        falseTransformer?: MaybeArray<Transformer<R, D>>,
    ): TransformerComposer<R, D>;
    branch(
        predicate: (
            data: D,
            signal?: AbortSignal,
        ) => MaybePromise<
            boolean | ((data: D, signal?: AbortSignal) => boolean)
        >,
        trueTransformer: MaybeArray<Transformer<R, D>>,
        falseTransformer: MaybeArray<Transformer<R, D>> = [],
    ) {
        const then = Array.isArray(trueTransformer)
            ? new TransformerComposer(...trueTransformer)
            : new TransformerComposer(trueTransformer);
        const otherwise = Array.isArray(falseTransformer)
            ? new TransformerComposer(...falseTransformer)
            : new TransformerComposer(falseTransformer);
        this.lazy(async (data, signal) => {
            const condition = await predicate(data, signal);
            const satisfied = typeof condition === "function"
                ? condition(data, signal)
                : condition;
            return satisfied ? then : otherwise;
        });
        return otherwise;
    }
}
