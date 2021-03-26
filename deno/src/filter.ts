import { AliasProps, Context } from './context.ts'
import { Update } from './platform.ts'

type FilterFunction<C extends Context, D extends C> = (ctx: C) => ctx is D

// === Obtain O(1) filter function from query
/**
 * > This is an advanced function of grammY.
 *
 * Takes a filter query and turns it into a predicate function that can check in
 * constant time whether a given context object satisfies the query. The created
 * predicate can be passed to `bot.filter` and will narrow down the context
 * accordingly.
 *
 * This function is used internally by `bot.on` but exposed for advanced usage
 * like the following.
 * ```ts
 * // Listens for all messages and channel posts except forwards
 * `bot.drop(matchFilter(':forward_date'), ctx => { ... })
 * ```
 *
 * Check out the documentation of `bot.on` for examples. In addition, the
 * website contains more information about how filter queries work in grammY.
 *
 * @param filter a filter query or an array of filter queries
 */
export function matchFilter<C extends Context, Q extends FilterQuery>(
    filter: Q | Q[]
): FilterFunction<C, Filter<C, Q>> {
    if (Array.isArray(filter)) {
        // @ts-ignore too complex to represent
        const predicates = filter.map(matchSingleFilter)
        return (ctx: C): ctx is Filter<C, Q> =>
            predicates.some((p: any) => p(ctx))
    } else {
        const p = matchSingleFilter(filter)
        return (ctx: C): ctx is Filter<C, Q> => p(ctx)
    }
}

function matchSingleFilter<C extends Context, Q extends FilterQuery>(
    filter: Q
): FilterFunction<C, Filter<C, Q>> {
    const [l1, l2, l3] = filter.split(':')

    // check L1 syntax
    if (l1 === undefined) throw new Error('Empty filter query given')
    if (!((l2 !== undefined && l1 === '') || l1 in UPDATE_KEYS)) {
        const permitted = Object.keys(UPDATE_KEYS)
        throw new Error(
            `Invalid L1 filter '${l1}' given in '${filter}'. Permitted values are: ${permitted
                .map(k => `'${k}'`)
                .join(', ')}`
        )
    }

    // pick L1 object selector function
    const l1Obj: (ctx: C) => any =
        l1 === ''
            ? (ctx: C) => {
                  const elem = L1_DEFAULTS.find(p => p in ctx.update)
                  if (elem === undefined) return undefined
                  return ctx.update[elem]
              }
            : (ctx: C) => (ctx.update as any)[l1]

    // immediately return if L2 is not given
    if (l2 === undefined)
        return (ctx: C): ctx is Filter<C, Q> => l1Obj(ctx) !== undefined

    // check L2 syntax
    const l1ValidationObjs =
        l1 === ''
            ? L1_DEFAULTS.reduce(
                  (agg, p) => ({ ...agg, ...UPDATE_KEYS[p] }),
                  {}
              )
            : (UPDATE_KEYS as any)[l1]
    if (!((l3 !== undefined && l2 === '') || l2 in l1ValidationObjs)) {
        const permitted = Object.keys(l1ValidationObjs)
        throw new Error(
            `Invalid L2 filter '${l2}' given in '${filter}'. Permitted values are: ${permitted
                .map(k => `'${k}'`)
                .join(', ')}`
        )
    }

    // pick L2 object selector function
    const l2Obj: (ctx: C) => any =
        l2 === ''
            ? (ctx: C) => {
                  const l1o = l1Obj(ctx)
                  if (l1o === undefined) return undefined
                  const elem = L2_DEFAULTS.find(p => p in l1o)
                  if (elem === undefined) return undefined
                  return l1o[elem]
              }
            : (ctx: C) => {
                  const l1o = l1Obj(ctx)
                  return l1o === undefined ? undefined : l1o[l2]
              }

    // immediately return if L3 is not given
    if (l3 === undefined)
        return (ctx: C): ctx is Filter<C, Q> => l2Obj(ctx) !== undefined

    // check L3 syntax
    const l2ValidationObjs =
        l2 === ''
            ? L2_DEFAULTS.reduce(
                  (agg, p) => ({ ...agg, ...l1ValidationObjs[p] }),
                  {}
              )
            : l1ValidationObjs[l2]
    if (!(l3 in l2ValidationObjs)) {
        const permitted = Object.keys(l2ValidationObjs)
        if (permitted.length === 0)
            throw new Error(
                `Invalid L3 filter '${l3}' given in '${filter}'. No further filtering is possible after '${l1}:${l2}'.`
            )
        else
            throw new Error(
                `Invalid L3 filter '${l3}' given in '${filter}'. Permitted values are: ${permitted
                    .map(k => `'${k}'`)
                    .join(', ')}`
            )
    }

    // final filtering function for L3 filter
    return l3 === 'me' // special handling for `me` shortcut
        ? (ctx: C): ctx is Filter<C, Q> => {
              const me = ctx.me.id
              return testMaybeArray(l2Obj(ctx), u => u.id === me)
          }
        : (ctx: C): ctx is Filter<C, Q> =>
              testMaybeArray(l2Obj(ctx), e => e[l3] || e.type === l3)
}

function testMaybeArray<T>(t: T | T[], pred: (t: T) => boolean): boolean {
    const p = (x: T) => !!x && pred(x)
    return Array.isArray(t) ? t.some(p) : p(t)
}

// === Define a structure to validate the queries
const ENTITY_KEYS = {
    mention: {},
    hashtag: {},
    cashtag: {},
    bot_command: {},
    url: {},
    email: {},
    phone_number: {},
    bold: {},
    italic: {},
    underline: {},
    strikethrough: {},
    code: {},
} as const
const USER_KEYS = {
    me: {},
    is_bot: {},
} as const

const MESSAGE_KEYS = {
    text: {},
    audio: {},
    document: {},
    animation: {},
    photo: {},
    sticker: {},
    video: {},
    video_note: {},
    voice: {},
    contact: {},
    dice: {},
    game: {},
    poll: {},
    location: {},
    venue: {},
    new_chat_members: USER_KEYS,
    left_chat_member: USER_KEYS,
    new_chat_title: {},
    new_chat_photo: {},
    delete_chat_photo: {},
    group_chat_created: {},
    supergroup_chat_created: {},
    channel_chat_created: {},
    migrate_to_chat_id: {},
    migrate_from_chat_id: {},
    pinned_message: {},
    invoice: {},
    successful_payment: {},
    connected_website: {},
    passport_data: {},
    proximity_alert_triggered: {},

    entities: ENTITY_KEYS,
    caption_entities: ENTITY_KEYS,

    forward_date: {},
    caption: {},
} as const
const CALLBACK_QUERY_KEYS = { data: {}, game_short_name: {} } as const
const CHAT_MEMBER_UPDATED_KEYS = {
    chat: {},
    from: USER_KEYS,
    old_chat_member: {},
    new_chat_member: {},
} as const
const UPDATE_KEYS = {
    message: MESSAGE_KEYS,
    edited_message: MESSAGE_KEYS,
    channel_post: MESSAGE_KEYS,
    edited_channel_post: MESSAGE_KEYS,
    inline_query: {},
    chosen_inline_result: {},
    callback_query: CALLBACK_QUERY_KEYS,
    shipping_query: {},
    pre_checkout_query: {},
    poll: {},
    poll_answer: {},
    my_chat_member: CHAT_MEMBER_UPDATED_KEYS,
    chat_member: CHAT_MEMBER_UPDATED_KEYS,
} as const

// === Build up all possible filter queries from the above validation structure
type KeyOf<T> = string & keyof T // Emulate `keyofStringsOnly`

type S = typeof UPDATE_KEYS

// Includes e.g. `message`
type L1 = KeyOf<S>
// Includes e.g. `message:text` and `:text`
type L2 = L2Full | L2WithDefault
type L2Full<L extends L1 = L1> = L extends unknown
    ? `${L}:${KeyOf<S[L]>}`
    : never
type L2WithDefault = `:${KeyOf<S[L1Defaults]>}`
// Allows e.g. `message:entities:url` and `::url`
type L3 = `${'' | L1Defaults | `edited_${L1Defaults}`}:`

/**
 * Represents a filter query that can be passed to `bot.on`. There are three
 * different kinds of filter queries: Level 1, Level 2, and Level 3. Check out
 * the website to read about how filter queries work in grammY, and how to use
 * them.
 *
 * Here are three brief examples:
 * ```ts
 * // Listen for messages of any type (Level 1)
 * bot.on('message', ctx => { ... })
 * // Listen for audio messages only (Level 2)
 * bot.on('message:audio', ctx => { ... })
 * // Listen for text messages that have a URL entity (Level 3)
 * bot.on('message:entities:url', ctx => { ... })
 * ```
 */
export type FilterQuery = L1 | L2 | L3 | (`${L2 | L3}${string}` & {})
// confer the following link to understand why we intersect the last part with {}:
// https://github.com/microsoft/TypeScript/issues/29729#issuecomment-505826972

// === Infer the present/absent properties on a context object based on a query
// Note: L3 filters are not represented in types
type RunQuery<Q extends string> = Q extends `${infer U}:${infer V}:${string}` // L3 level filter, e.g. 'message:entities:url'
    ? RunL2Query<U, V>
    : Q extends `${infer U}:${infer V}` // L2 level filter, e.g. 'message:text'
    ? RunL2Query<U, V>
    : RunL1Query<Q> // L1 level filter, e.g. 'message'

type Value = string | number | boolean | object

type RunL1Query<Q extends string> = Extract<Update, Record<Q, Value>>

// Constrain types to valid property names
type RunL2Query<U extends string, V extends string> = U extends KeyOf<Update>
    ? V extends KeyOf<Exclude<Update[U], undefined>>
        ? RunL1Query<U> & // Carve out L1 query part
              Record<
                  U,
                  Extract<Update[U], Record<Residue<V>, Value>> // Rename L2 property to make it discriminatory and then extract update type
                  // TODO: optimize memory usage, the following line causes `tsc` to reach ~7 GiB
                  // & Record<V, Value> // Make original properties required, i.e. caption etc
              >
        : never
    : never

type FilteredContext<C extends Context, U extends Update> = U extends unknown
    ? C & Record<'update', U> & AliasProps<U>
    : never
export type Filter<C extends Context, Q extends FilterQuery> = Q extends unknown
    ? FilteredContext<C, RunQuery<FillDefaults<Q>>>
    : never

// === Define some helpers for handling default values, e.g. in '::url'
const L1_DEFAULTS = ['message', 'channel_post'] as const
const L2_DEFAULTS = ['entities', 'caption_entities'] as const
type L1Defaults = typeof L1_DEFAULTS[number]
type L2Defaults = typeof L2_DEFAULTS[number]

type FillDefaults<Q extends string> = FillL1Default<FillL2Default<Q>>
type FillL1Default<Q extends string> = Q extends `:${infer R}`
    ? `${L1Defaults}:${R}`
    : Q
type FillL2Default<Q extends string> = Q extends `${infer U}::${infer V}`
    ? `${U}:${L2Defaults}:${V}`
    : Q

// === Define some helpers for renaming optional properties to their discriminatory siblings
type Residue<V extends string> = V extends KeyOf<ClassesL2> ? ClassesL2[V] : V
interface ClassesL2 {
    entities: 'text'
    caption: CaptionMessages
    caption_entities: CaptionMessages
}
type CaptionMessages =
    | 'animation'
    | 'audio'
    | 'document'
    | 'photo'
    | 'video'
    | 'voice'
