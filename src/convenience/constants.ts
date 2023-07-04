import { DEFAULT_UPDATE_TYPES } from "../bot.ts";

const ALL_UPDATE_TYPES = [...DEFAULT_UPDATE_TYPES, "chat_member"] as const;
const ALL_CHAT_PERMISSIONS = {
    can_send_messages: true,
    can_send_audios: true,
    can_send_documents: true,
    can_send_photos: true,
    can_send_videos: true,
    can_send_video_notes: true,
    can_send_voice_notes: true,
    can_send_polls: true,
    can_send_other_messages: true,
    can_add_web_page_previews: true,
    can_change_info: true,
    can_invite_users: true,
    can_pin_messages: true,
    can_manage_topics: true,
} as const;

/**
 * Contains utility types for the available update types and chat permissions
 */
export interface ApiConstants {
    DefaultUpdateTypes: typeof DEFAULT_UPDATE_TYPES[number];
    AllUpdateTypes: typeof ALL_UPDATE_TYPES[number];
    AllChatPermissions: keyof typeof ALL_CHAT_PERMISSIONS;
}

interface API_CONSTANTS {
    /**
     * List of update types a bot receives by default. Useful if you want to
     * receive all update types but `chat_member`.
     *
     * ```ts
     * // Built-in polling:
     * bot.start({ allowed_updates: DEFAULT_UPDATE_TYPES });
     * // grammY runner:
     * run(bot, { runner: { fetch: { allowed_updates: DEFAULT_UPDATE_TYPES } } });
     * // Webhooks:
     * await bot.api.setWebhook(url, { allowed_updates: DEFAULT_UPDATE_TYPES });
     * ```
     */
    DEFAULT_UPDATE_TYPES: typeof DEFAULT_UPDATE_TYPES;
    /**
     * List of all available update types. Useful if you want to receive all
     * updates from the Bot API, rather than just those that are delivered by
     * default.
     *
     * The main use case for this is when you want to receive `chat_member`
     * updates, as they need to be enabled first. Use it like so:
     *
     * ```ts
     * // Built-in polling:
     * bot.start({ allowed_updates: ALL_UPDATE_TYPES });
     * // grammY runner:
     * run(bot, { runner: { fetch: { allowed_updates: ALL_UPDATE_TYPES } } });
     * // Webhooks:
     * await bot.api.setWebhook(url, { allowed_updates: ALL_UPDATE_TYPES });
     * ```
     */
    ALL_UPDATE_TYPES: typeof ALL_UPDATE_TYPES;
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
     */
    ALL_CHAT_PERMISSIONS: typeof ALL_CHAT_PERMISSIONS;
}

/**
 * Contains lists of constants which are useful when working with the Bot API.
 */
export const API_CONSTANTS: API_CONSTANTS = {
    DEFAULT_UPDATE_TYPES,
    ALL_UPDATE_TYPES,
    ALL_CHAT_PERMISSIONS,
} as const;

Object.freeze(API_CONSTANTS);
