import type { ApiCallFn, ApiCallResult, CallData, RawApi } from "./client.ts";
import type { ApiResponse } from "./types.ts";

/**
 * API call transformers are functions that can access and modify the method and
 * payload of an API call on the fly. This can be useful if you want to
 * implement rate limiting or other things against the Telegram Bot API.
 *
 * Confer the grammY
 * [documentation](https://grammy.dev/advanced/transformers) to read more
 * about how to use transformers.
 */
export type TransformerFn<R extends RawApi = RawApi> = <D extends CallData<R>>(
    prev: ApiCallFn<R>,
    data: D,
    signal?: AbortSignal,
) => Promise<ApiResponse<ApiCallResult<D["method"], R>>>;
export interface TransformerObj<R extends RawApi = RawApi> {
    transformer(): TransformerFn<R>;
}
export type Transformer<R extends RawApi = RawApi> =
    | TransformerFn<R>
    | TransformerObj<R>;

function pass<R extends RawApi>(
    prev: ApiCallFn<R>,
    data: CallData<R>,
    signal?: AbortSignal,
) {
    return prev(data, signal);
}
function flatten<R extends RawApi = RawApi>(
    tf: Transformer<R>,
): TransformerFn<R> {
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

export class TransformerComposer<R extends RawApi>
    implements TransformerObj<R> {
    private handler: TransformerFn<R>;

    constructor(...transformers: Array<Transformer<R>>) {
        this.handler = transformers.length === 0
            ? pass
            : transformers.map(flatten).reduce(concat);
    }

    transformer(): TransformerFn<R> {
        return this.handler;
    }

    use(...transformers: Array<Transformer<R>>): TransformerComposer<R> {
        const composer = new TransformerComposer(...transformers);
        this.handler = concat(this.handler, flatten(composer));
        return composer;
    }
}
