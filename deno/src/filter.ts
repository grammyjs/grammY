// deno-lint-ignore-file camelcase no-explicit-any
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
 * Check out the
 * [documentation](https://doc.deno.land/https/deno.land/x/grammy/mod.ts#Composer)
 * of `bot.on` for examples. In addition, the
 * [website](https://grammy.dev/guide/filter-queries.html) contains more
 * information about how filter queries work in grammY.
 *
 * @param filter A filter query or an array of filter queries
 */
export function matchFilter<C extends Context, Q extends FilterQuery>(
    filter: Q | Q[]
): FilterFunction<C, Filter<C, Q>> {
    if (Array.isArray(filter)) {
        // Must annotate with less strict types to accelerate compilation
        // deno-lint-ignore ban-types
        const toPred: (q: FilterQuery) => Function = matchSingleFilter
        const predicates = filter.map(toPred)
        return (ctx: C): ctx is Filter<C, Q> =>
            predicates.some(pred => pred(ctx))
    } else {
        const pred = matchSingleFilter(filter)
        return (ctx: C): ctx is Filter<C, Q> => pred(ctx)
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
            ? ctx => {
                  const elem = L1_DEFAULTS.find(p => p in ctx.update)
                  if (elem === undefined) return undefined
                  return ctx.update[elem]
              }
            : ctx => (ctx.update as any)[l1]

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
            ? ctx => {
                  const l1o = l1Obj(ctx)
                  if (l1o === undefined) return undefined
                  const elem = L2_DEFAULTS.find(p => p in l1o)
                  if (elem === undefined) return undefined
                  return l1o[elem]
              }
            : ctx => {
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
    animation: {},
    audio: {},
    document: {},
    photo: {},
    sticker: {},
    video: {},
    video_note: {},
    voice: {},
    contact: {},
    dice: {},
    game: {},
    poll: {},
    venue: {},
    location: {},
    new_chat_members: USER_KEYS,
    left_chat_member: USER_KEYS,
    new_chat_title: {},
    new_chat_photo: {},
    delete_chat_photo: {},
    group_chat_created: {},
    supergroup_chat_created: {},
    channel_chat_created: {},
    message_auto_delete_timer_changed: {},
    migrate_to_chat_id: {},
    migrate_from_chat_id: {},
    pinned_message: {},
    invoice: {},
    successful_payment: {},
    connected_website: {},
    passport_data: {},
    proximity_alert_triggered: {},
    voice_chat_scheduled: {},
    voice_chat_started: {},
    voice_chat_ended: {},
    voice_chat_participants_invited: {},

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

// E.g. 'message'
type L1 = KeyOf<S>
// E.g. 'message:entities'
type L2<K extends L1 = L1> = K extends unknown ? `${K}:${KeyOf<S[K]>}` : never
// E.g. 'message:entities:url'
type L3<K0 extends L1 = L1> = K0 extends unknown ? L3_<K0> : never
type L3_<K0 extends L1, K1 extends KeyOf<S[K0]> = KeyOf<S[K0]>> =
    K1 extends unknown ? `${K0}:${K1}:${KeyOf<S[K0][K1]>}` : never
// All three combined
type L123 = L1 | L2 | L3
// E.g. 'message::url'
type PermitL2Defaults<Q extends string = L123> =
    Q extends `${infer R}:${L2Defaults}:${infer S}` ? Q | `${R}::${S}` : Q
// E.g. '::url'
type PermitL1Defaults<Q extends string = PermitL2Defaults> =
    Q extends `${L1Defaults}:${infer R}` ? Q | `:${R}` : Q
// All queries
type AllValidFilterQueries = PermitL1Defaults

/**
 * Represents a filter query that can be passed to `bot.on`. There are three
 * different kinds of filter queries: Level 1, Level 2, and Level 3. Check out
 * the [website](https://grammy.dev/guide/filter-queries.html) to read about how
 * filter queries work in grammY, and how to use them.
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
export type FilterQuery = AllValidFilterQueries

// === Infer the present/absent properties on a context object based on a query
// Note: L3 filters are not represented in types

/**
 * Any kind of value that appears in the Telegram Bot API. When intersected with
 * an optional field, it effectively removes `| undefined`.
 */
// deno-lint-ignore ban-types
type SomeObject = object
type NotUndefined = string | number | boolean | SomeObject

/**
 * Given a FilterQuery, returns an object that, when intersected with an Update,
 * marks those properties as required that are guaranteed to exist.
 */
type RunQuery<Q extends string> = L1Combinations<Q, L1Parts<Q>>

// build up all combinations of all L1 fields
type L1Combinations<Q extends string, L1 extends string> = Combine<
    L1Fields<Q, L1>,
    L1
>
// maps each L1 part of the filter query to an object
type L1Fields<Q extends string, L1 extends string> = L1 extends unknown
    ? Record<L1, L2Combinations<L2Parts<Q, L1>>>
    : never

// build up all combinations of all L2 fields
type L2Combinations<L2 extends string> = [L2] extends [never]
    ? NotUndefined // short-circuit L1 queries (L2 is never)
    : Combine<L2Fields<L2>, L2>
// maps each L2 part of the filter query to an object and handles siblings
type L2Fields<L2 extends string> = L2 extends unknown
    ? Record<L2 | Twins<L2>, NotUndefined>
    : never

// define additional fields on U with value `undefined`
type Combine<U, K extends string> = U extends unknown
    ? U & Partial<Record<Exclude<K, keyof U>, undefined>>
    : never

// gets all L1 query snippets
type L1Parts<Q extends string> = Q extends `${infer U}:${string}` ? U : Q
// gets all L2 query snippets for the given L1 part, or `never`
type L2Parts<Q extends string, P extends string> =
    Q extends `${P}:${infer U}:${string}`
        ? U
        : Q extends `${P}:${infer U}`
        ? U
        : never

/**
 * This type infers which properties will be present on the given context object
 * provided it matches given filter query. If the filter query is a union type,
 * the produced context object will be a union of possible combinations, hence
 * allowing you to narrow down manually which of the properties are present.
 *
 * In some sense, this type computes `matchFilter` on the type level.
 */
export type Filter<C extends Context, Q extends FilterQuery> = PerformQuery<
    C,
    RunQuery<FillDefaults<Q>>
>
// apply a query result by intersecting it with Update, and then injecting into C
type PerformQuery<C extends Context, U extends SomeObject> = U extends unknown
    ? FilteredContext<C, Update & U>
    : never
// set the given update into a given context object, and adjust the aliases
type FilteredContext<C extends Context, U extends Update> = C &
    Record<'update', U> &
    AliasProps<Omit<U, 'update_id'>> &
    Shortcuts<U>

// helper type to infer shortcuts on context object based on present properties, must be in sync with shortcut impl!
interface Shortcuts<U extends Update> {
    msg: [U['callback_query']] extends [SomeObject]
        ? unknown // 'message' is optional on CallbackQuery
        : [U['message']] extends [SomeObject]
        ? U['message']
        : [U['edited_message']] extends [SomeObject]
        ? U['edited_message']
        : [U['channel_post']] extends [SomeObject]
        ? U['channel_post']
        : [U['edited_channel_post']] extends [SomeObject]
        ? U['edited_channel_post']
        : undefined
    chat: Shortcuts<U>['msg'] // 'chat' is required on 'Message'
    // senderChat: disregarded here because always optional on 'Message'
    from: [U['callback_query']] extends [SomeObject]
        ? U['callback_query']['from']
        : [U['inline_query']] extends [SomeObject]
        ? U['inline_query']['from']
        : [U['shipping_query']] extends [SomeObject]
        ? U['shipping_query']['from']
        : [U['pre_checkout_query']] extends [SomeObject]
        ? U['pre_checkout_query']['from']
        : [U['chosen_inline_result']] extends [SomeObject]
        ? U['chosen_inline_result']['from']
        : [U['message']] extends [SomeObject]
        ? Exclude<U['message']['from'], undefined>
        : [U['edited_message']] extends [SomeObject]
        ? Exclude<U['edited_message'], undefined>
        : undefined
    // inlineMessageId: disregarded here because always optional on both types
}

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

// === Define some helpers for when one property implies the existence of others
type Twins<V extends string> = V extends KeyOf<Equivalents> ? Equivalents[V] : V
type Equivalents = {
    entities: TextMessages
    caption: CaptionMessages
    caption_entities: CaptionMessages
}
type TextMessages = 'text'
type CaptionMessages =
    | 'animation'
    | 'audio'
    | 'document'
    | 'photo'
    | 'video'
    | 'voice'
