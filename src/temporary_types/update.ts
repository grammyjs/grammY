import type { ChosenInlineResult, InlineQuery } from "./inline.ts";
import type {
    BusinessConnection,
    BusinessMessagesDeleted,
    Chat,
    ChatBoostRemoved,
    ChatBoostUpdated,
    ChatJoinRequest,
    ChatMemberUpdated,
    User,
} from "./manage.ts";
import type { CallbackQuery } from "./markup.ts";
import type {
    Message,
    MessageReactionCountUpdated,
    MessageReactionUpdated,
    Poll,
    PollAnswer,
} from "./message.ts";
import type {
    PaidMediaPurchased,
    PreCheckoutQuery,
    ShippingQuery,
} from "./payment.ts";

/** Internal namespace used to make some message types more accurate */
export declare namespace Update {
    /** Internal type holding properties that message updates in private chats share. */
    export interface Private {
        chat: Chat.PrivateChat;
    }
    /** Internal type holding properties that message updates in channels share. */
    export interface Channel {
        chat: Chat.ChannelChat;
    }
    /** Internal type holding properties that message updates outside of channels share. */
    export interface NonChannel {
        chat: Exclude<Chat, Chat.ChannelChat>;
        from: User;
    }
    /** Internal type holding properties that updates about edited messages share. */
    export interface Edited {
        /** Date the message was last edited in Unix time */
        edit_date: number;
    }
}

/** This object represents an incoming update.
At most one of the optional parameters can be present in any given update. */
export interface Update {
    /** The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you're using webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially. */
    update_id: number;
    /** New incoming message of any kind - text, photo, sticker, etc. */
    message?: Message & Update.NonChannel;
    /** New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot. */
    edited_message?: Message & Update.Edited & Update.NonChannel;
    /** New incoming channel post of any kind - text, photo, sticker, etc. */
    channel_post?: Message & Update.Channel;
    /** New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot. */
    edited_channel_post?: Message & Update.Edited & Update.Channel;
    /** The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot */
    business_connection?: BusinessConnection;
    /** New message from a connected business account */
    business_message?: Message & Update.Private;
    /** New version of a message from a connected business account */
    edited_business_message?: Message & Update.Edited & Update.Private;
    /** Messages were deleted from a connected business account */
    deleted_business_messages?: BusinessMessagesDeleted;
    /** A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify "message_reaction" in the list of allowed_updates to receive these updates. The update isn't received for reactions set by bots. */
    message_reaction?: MessageReactionUpdated;
    /** Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify "message_reaction_count" in the list of allowed_updates to receive these updates. The updates are grouped and can be sent with delay up to a few minutes. */
    message_reaction_count?: MessageReactionCountUpdated;
    /** New incoming inline query */
    inline_query?: InlineQuery;
    /** The result of an inline query that was chosen by a user and sent to their chat partner. Please see our documentation on the feedback collecting for details on how to enable these updates for your bot. */
    chosen_inline_result?: ChosenInlineResult;
    /** New incoming callback query */
    callback_query?: CallbackQuery;
    /** New incoming shipping query. Only for invoices with flexible price */
    shipping_query?: ShippingQuery;
    /** New incoming pre-checkout query. Contains full information about checkout */
    pre_checkout_query?: PreCheckoutQuery;
    /** New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot */
    poll?: Poll;
    /** A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself. */
    poll_answer?: PollAnswer;
    /** The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user. */
    my_chat_member?: ChatMemberUpdated;
    /** A chat member's status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify “chat_member” in the list of allowed_updates to receive these updates. */
    chat_member?: ChatMemberUpdated;
    /** A request to join the chat has been sent. The bot must have the can_invite_users administrator right in the chat to receive these updates. */
    chat_join_request?: ChatJoinRequest;
    /** A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates. */
    chat_boost?: ChatBoostUpdated;
    /** A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates. */
    removed_chat_boost?: ChatBoostRemoved;
    /** A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat */
    purchased_paid_media?: PaidMediaPurchased;
}
