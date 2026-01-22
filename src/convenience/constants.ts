/**
 * List of update types a bot receives by default. Useful if you want to
 * receive all update types but `chat_member`, `message_reaction`, and
 * `message_reaction_count`.
 *
 * ```ts
 * // Built-in polling:
 * bot.start({ allowed_updates: DEFAULT_UPDATE_TYPES });
 * // grammY runner:
 * run(bot, { runner: { fetch: { allowed_updates: DEFAULT_UPDATE_TYPES } } });
 * // Webhooks:
 * await bot.api.setWebhook(url, { allowed_updates: DEFAULT_UPDATE_TYPES });
 * ```
 *
 * See the [Bot API reference](https://core.telegram.org/bots/api#update)
 * for more information.
 */
export const DEFAULT_UPDATE_TYPES = [
    "message",
    "edited_message",
    "channel_post",
    "edited_channel_post",
    "business_connection",
    "business_message",
    "edited_business_message",
    "deleted_business_messages",
    "inline_query",
    "chosen_inline_result",
    "callback_query",
    "shipping_query",
    "pre_checkout_query",
    "purchased_paid_media",
    "poll",
    "poll_answer",
    "my_chat_member",
    "chat_join_request",
    "chat_boost",
    "removed_chat_boost",
] as const;

/**
 * List of all available update types. Useful if you want to receive all
 * updates from the Bot API, rather than just those that are delivered by
 * default.
 *
 * The main use case for this is when you want to receive `chat_member`,
 * `message_reaction`, and `message_reaction_count` updates, as they need to
 * be enabled first. Use it like so:
 *
 * ```ts
 * // Built-in polling:
 * bot.start({ allowed_updates: ALL_UPDATE_TYPES });
 * // grammY runner:
 * run(bot, { runner: { fetch: { allowed_updates: ALL_UPDATE_TYPES } } });
 * // Webhooks:
 * await bot.api.setWebhook(url, { allowed_updates: ALL_UPDATE_TYPES });
 * ```
 *
 * See the [Bot API reference](https://core.telegram.org/bots/api#update)
 * for more information.
 */
export const ALL_UPDATE_TYPES = [
    "message",
    "edited_message",
    "channel_post",
    "edited_channel_post",
    "business_connection",
    "business_message",
    "edited_business_message",
    "deleted_business_messages",
    "inline_query",
    "chosen_inline_result",
    "callback_query",
    "shipping_query",
    "pre_checkout_query",
    "purchased_paid_media",
    "poll",
    "poll_answer",
    "my_chat_member",
    "chat_join_request",
    "chat_boost",
    "removed_chat_boost",
    // ...DEFAULT_UPDATE_TYPES,
    // https://github.com/jsr-io/jsr/issues/1258
    "chat_member",
    "message_reaction",
    "message_reaction_count",
] as const;
/**
 * An object containing all available chat permissions. Useful if you want
 * to lift restrictions from a user, as this action requires you to pass
 * `true` for all permissions. Use it like so:
 *
 * ```ts
 * // On `Bot`:
 * await bot.api.restrictChatMember(chat_id, user_id, ALL_CHAT_PERMISSIONS);
 * // On `Api`:
 * await ctx.api.restrictChatMember(chat_id, user_id, ALL_CHAT_PERMISSIONS);
 * // On `Context`:
 * await ctx.restrictChatMember(user_id, ALL_CHAT_PERMISSIONS);
 * await ctx.restrictAuthor(ALL_CHAT_PERMISSIONS);
 * ```
 *
 * See the [Bot API reference](https://core.telegram.org/bots/api#update)
 * for more information.
 */
export const ALL_CHAT_PERMISSIONS = {
    is_anonymous: true,
    can_manage_chat: true,
    can_delete_messages: true,
    can_manage_video_chats: true,
    can_restrict_members: true,
    can_promote_members: true,
    can_change_info: true,
    can_invite_users: true,
    can_post_stories: true,
    can_edit_stories: true,
    can_delete_stories: true,
    can_post_messages: true,
    can_edit_messages: true,
    can_pin_messages: true,
    can_manage_topics: true,
} as const;
