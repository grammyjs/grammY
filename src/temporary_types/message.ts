// deno-lint-ignore-file no-irregular-whitespace no-empty-interface
import type { Chat, User } from "./manage.ts";
import type { InlineKeyboardMarkup } from "./markup.ts";
import type { PassportData } from "./passport.ts";
import type { Invoice, RefundedPayment, SuccessfulPayment } from "./payment.ts";

type MsgWith<P extends keyof Message> = Record<P, NonNullable<Message[P]>>;

export declare namespace Message {
    interface ServiceMessage {
        /** Unique message identifier inside this chat. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent */
        message_id: number;
        /** Unique identifier of a message thread or a forum topic to which the message belongs; for supergroups only */
        message_thread_id?: number;
        /** Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats */
        from?: User;
        /** Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field from contains a fake sender user in non-channel chats. */
        sender_chat?: Chat;
        /** Date the message was sent in Unix time. It is always a positive number, representing a valid date. */
        date: number;
        /** Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier. */
        business_connection_id?: string;
        /** Chat the message belongs to */
        chat: Chat;
        /** True, if the message is sent to a forum topic */
        is_topic_message?: boolean;
    }
    export interface CommonMessage extends ServiceMessage {
        /** If the sender of the message boosted the chat, the number of boosts added by the user */
        sender_boost_count?: number;
        /** The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account. */
        sender_business_bot?: User;
        /** Information about the original message for forwarded messages */
        forward_origin?: MessageOrigin;
        /** True, if the message is a channel post that was automatically forwarded to the connected discussion group */
        is_automatic_forward?: true;
        /** For replies in the same chat and message thread, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. */
        reply_to_message?: ReplyMessage;
        /** Information about the message that is being replied to, which may come from another chat or forum topic */
        external_reply?: ExternalReplyInfo;
        /** For replies that quote part of the original message, the quoted part of the message */
        quote?: TextQuote;
        /** For replies to a story, the original message */
        reply_to_story?: Story;
        /** Bot through which the message was sent */
        via_bot?: User;
        /** Date the message was last edited in Unix time */
        edit_date?: number;
        /** True, if the message can't be forwarded */
        has_protected_content?: true;
        /** True, if the caption must be shown above the message media */
        show_caption_above_media?: true;
        /** True, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message */
        is_from_offline?: true;
        /** Signature of the post author for messages in channels, or the custom title of an anonymous group administrator */
        author_signature?: string;
        /** Options used for link preview generation for the message, if it is a text message and link preview options were changed */
        link_preview_options?: LinkPreviewOptions;
        /** Unique identifier of the message effect added to the message */
        effect_id?: string;
        /** Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons. */
        reply_markup?: InlineKeyboardMarkup;
    }
    export interface CaptionableMessage extends CommonMessage {
        /** Caption for the animation, audio, document, photo, video or voice */
        caption?: string;
        /** For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption */
        caption_entities?: MessageEntity[];
    }
    export interface MediaMessage extends CaptionableMessage {
        /** The unique identifier of a media message group this message belongs to */
        media_group_id?: string;
        /** True, if the message media is covered by a spoiler animation */
        has_media_spoiler?: true;
    }

    export type TextMessage = CommonMessage & MsgWith<"text">;
    export type AudioMessage = CaptionableMessage & MsgWith<"audio">;
    export type DocumentMessage = CaptionableMessage & MsgWith<"document">;
    export type AnimationMessage = DocumentMessage & MsgWith<"animation">;
    export type PhotoMessage = MediaMessage & MsgWith<"photo">;
    export type StickerMessage = CommonMessage & MsgWith<"sticker">;
    export type StoryMessage = CommonMessage & MsgWith<"story">;
    export type VideoMessage = MediaMessage & MsgWith<"video">;
    export type VideoNoteMessage = CommonMessage & MsgWith<"video_note">;
    export type VoiceMessage = CaptionableMessage & MsgWith<"voice">;
    export type ContactMessage = CommonMessage & MsgWith<"contact">;
    export type DiceMessage = CommonMessage & MsgWith<"dice">;
    export type GameMessage = CommonMessage & MsgWith<"game">;
    export type PollMessage = CommonMessage & MsgWith<"poll">;
    export type VenueMessage = LocationMessage & MsgWith<"venue">;
    export type LocationMessage = CommonMessage & MsgWith<"location">;
    export type PaidMediaMessage = CommonMessage & MsgWith<"paid_media">;
    export type NewChatMembersMessage =
        & ServiceMessage
        & MsgWith<"new_chat_members">;
    export type LeftChatMemberMessage =
        & ServiceMessage
        & MsgWith<"left_chat_member">;
    export type NewChatTitleMessage =
        & ServiceMessage
        & MsgWith<"new_chat_title">;
    export type NewChatPhotoMessage =
        & ServiceMessage
        & MsgWith<"new_chat_photo">;
    export type DeleteChatPhotoMessage =
        & ServiceMessage
        & MsgWith<"delete_chat_photo">;
    export type GroupChatCreatedMessage =
        & ServiceMessage
        & MsgWith<"group_chat_created">;
    export type SupergroupChatCreated =
        & ServiceMessage
        & MsgWith<"supergroup_chat_created">;
    export type ChannelChatCreatedMessage =
        & ServiceMessage
        & MsgWith<"channel_chat_created">;
    export type MessageAutoDeleteTimerChangedMessage =
        & ServiceMessage
        & MsgWith<"message_auto_delete_timer_changed">;
    export type MigrateToChatIdMessage =
        & ServiceMessage
        & MsgWith<"migrate_to_chat_id">;
    export type MigrateFromChatIdMessage =
        & ServiceMessage
        & MsgWith<"migrate_from_chat_id">;
    export type PinnedMessageMessage =
        & ServiceMessage
        & MsgWith<"pinned_message">;
    export type InvoiceMessage = ServiceMessage & MsgWith<"invoice">;
    export type SuccessfulPaymentMessage =
        & ServiceMessage
        & MsgWith<"successful_payment">;
    export type RefundedPaymentMessage =
        & ServiceMessage
        & MsgWith<"refunded_payment">;
    export type UsersSharedMessage = ServiceMessage & MsgWith<"users_shared">;
    export type ChatSharedMessage = ServiceMessage & MsgWith<"chat_shared">;
    export type ConnectedWebsiteMessage =
        & ServiceMessage
        & MsgWith<"connected_website">;
    export type WriteAccessAllowedMessage =
        & ServiceMessage
        & MsgWith<"write_access_allowed">;
    export type PassportDataMessage = ServiceMessage & MsgWith<"passport_data">;
    export type ProximityAlertTriggeredMessage =
        & ServiceMessage
        & MsgWith<"proximity_alert_triggered">;
    export type BoostAddedMessage =
        & ServiceMessage
        & MsgWith<"boost_added">;
    export type ChatBackgroundSetMessage =
        & ServiceMessage
        & MsgWith<"chat_background_set">;
    export type ForumTopicCreatedMessage =
        & ServiceMessage
        & MsgWith<"forum_topic_created">;
    export type ForumTopicEditedMessage =
        & ServiceMessage
        & MsgWith<"forum_topic_edited">;
    export type ForumTopicClosedMessage =
        & ServiceMessage
        & MsgWith<"forum_topic_closed">;
    export type ForumTopicReopenedMessage =
        & ServiceMessage
        & MsgWith<"forum_topic_reopened">;
    export type GeneralForumTopicHiddenMessage =
        & ServiceMessage
        & MsgWith<"general_forum_topic_hidden">;
    export type GeneralForumTopicUnhiddenMessage =
        & ServiceMessage
        & MsgWith<"general_forum_topic_unhidden">;
    export type GiveawayCreatedMessage =
        & ServiceMessage
        & MsgWith<"giveaway_created">;
    export type GiveawayMessage = ServiceMessage & MsgWith<"giveaway">;
    export type GiveawayWinnersMessage =
        & ServiceMessage
        & MsgWith<"giveaway_winners">;
    export type GiveawayCompletedMessage =
        & ServiceMessage
        & MsgWith<"giveaway_completed">;
    export type VideoChatScheduledMessage =
        & ServiceMessage
        & MsgWith<"video_chat_scheduled">;
    export type VideoChatStartedMessage =
        & ServiceMessage
        & MsgWith<"video_chat_started">;
    export type VideoChatEndedMessage =
        & ServiceMessage
        & MsgWith<"video_chat_ended">;
    export type VideoChatParticipantsInvitedMessage =
        & ServiceMessage
        & MsgWith<"video_chat_participants_invited">;
    export type WebAppDataMessage = ServiceMessage & MsgWith<"web_app_data">;
}

type ReplyMessage = Message & { reply_to_message: undefined };

/** This object represents a message. */
export interface Message extends Message.MediaMessage {
    /** For text messages, the actual UTF-8 text of the message */
    text?: string;
    /** For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text */
    entities?: MessageEntity[];
    /** Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set */
    animation?: Animation;
    /** Message is an audio file, information about the file */
    audio?: Audio;
    /** Message is a general file, information about the file */
    document?: Document;
    /** Message is a photo, available sizes of the photo */
    photo?: PhotoSize[];
    /** Message is a sticker, information about the sticker */
    sticker?: Sticker;
    /** Message is a forwarded story */
    story?: Story;
    /** Message is a video, information about the video */
    video?: Video;
    /** Message is a video note, information about the video message */
    video_note?: VideoNote;
    /** Message is a voice message, information about the file */
    voice?: Voice;
    /** Message is a shared contact, information about the contact */
    contact?: Contact;
    /** Message is a dice with random value */
    dice?: Dice;
    /** Message is a game, information about the game. More about games » */
    game?: Game;
    /** Message is a native poll, information about the poll */
    poll?: Poll;
    /** Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set */
    venue?: Venue;
    /** Message is a shared location, information about the location */
    location?: Location;
    /** Message contains paid media; information about the paid media */
    paid_media?: PaidMediaInfo;
    /** New members that were added to the group or supergroup and information about them (the bot itself may be one of these members) */
    new_chat_members?: User[];
    /** A member was removed from the group, information about them (this member may be the bot itself) */
    left_chat_member?: User;
    /** A chat title was changed to this value */
    new_chat_title?: string;
    /** A chat photo was change to this value */
    new_chat_photo?: PhotoSize[];
    /** Service message: the chat photo was deleted */
    delete_chat_photo?: true;
    /** Service message: the group has been created */
    group_chat_created?: true;
    /** Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup. */
    supergroup_chat_created?: true;
    /** Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel. */
    channel_chat_created?: true;
    /** Service message: auto-delete timer settings changed in the chat */
    message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
    /** The group has been migrated to a supergroup with the specified identifier. */
    migrate_to_chat_id?: number;
    /** The supergroup has been migrated from a group with the specified identifier. */
    migrate_from_chat_id?: number;
    /** Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. */
    pinned_message?: MaybeInaccessibleMessage;
    /** Message is an invoice for a payment, information about the invoice. More about payments » */
    invoice?: Invoice;
    /** Message is a service message about a successful payment, information about the payment. More about payments » */
    successful_payment?: SuccessfulPayment;
    /** Message is a service message about a refunded payment, information about the payment. More about payments » */
    refunded_payment?: RefundedPayment;
    /** Service message: users were shared with the bot */
    users_shared?: UsersShared;
    /** Service message: a chat was shared with the bot */
    chat_shared?: ChatShared;
    /** The domain name of the website on which the user has logged in. More about Telegram Login » */
    connected_website?: string;
    /** Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess */
    write_access_allowed?: WriteAccessAllowed;
    /** Telegram Passport data */
    passport_data?: PassportData;
    /** Service message. A user in the chat triggered another user's proximity alert while sharing Live Location. */
    proximity_alert_triggered?: ProximityAlertTriggered;
    /** Service message: user boosted the chat */
    boost_added?: ChatBoostAdded;
    /* Service message: chat background set */
    chat_background_set?: ChatBackground;
    /** Service message: forum topic created */
    forum_topic_created?: ForumTopicCreated;
    /** Service message: forum topic edited */
    forum_topic_edited?: ForumTopicEdited;
    /** Service message: forum topic closed */
    forum_topic_closed?: ForumTopicClosed;
    /** Service message: forum topic reopened */
    forum_topic_reopened?: ForumTopicReopened;
    /** Service message: the 'General' forum topic hidden */
    general_forum_topic_hidden?: GeneralForumTopicHidden;
    /** Service message: the 'General' forum topic unhidden */
    general_forum_topic_unhidden?: GeneralForumTopicUnhidden;
    /** Service message: a scheduled giveaway was created */
    giveaway_created?: GiveawayCreated;
    /** The message is a scheduled giveaway message */
    giveaway?: Giveaway;
    /** A giveaway with public winners was completed */
    giveaway_winners?: GiveawayWinners;
    /** Service message: a giveaway without public winners was completed */
    giveaway_completed?: GiveawayCompleted;
    /** Service message: video chat scheduled */
    video_chat_scheduled?: VideoChatScheduled;
    /** Service message: video chat started */
    video_chat_started?: VideoChatStarted;
    /** Service message: video chat ended */
    video_chat_ended?: VideoChatEnded;
    /** Service message: new participants invited to a video chat */
    video_chat_participants_invited?: VideoChatParticipantsInvited;
    /** Service message: data sent by a Web App */
    web_app_data?: WebAppData;
}

/** This object represents a unique message identifier. */
export interface MessageId {
    /** Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent */
    message_id: number;
}

/** Describes an inline message sent by a Web App on behalf of a user. */
export interface SentWebAppMessage {
    /** Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. */
    inline_message_id: string;
}

/** This object describes a message that was deleted or is otherwise inaccessible to the bot. */
export interface InaccessibleMessage extends
    Omit<
        // TypeScript cannot discriminate union types based on `0` and `number` so
        // we work around this by including all other properties here. This mostly
        // negates the benefit of having this interface in the first place, but not
        // extending Message is not very ergonomic to use. If you have a better idea
        // how to model this, please let us know!
        Message,
        "chat" | "message_id" | "date"
    > {
    /** Chat the message belonged to */
    chat: Chat;
    /** Unique message identifier inside the chat */
    message_id: number;
    /** Always 0. The field can be used to differentiate regular and inaccessible messages. */
    date: 0;
}

/** This object describes a message that can be inaccessible to the bot. It can be one of

- Message
- InaccessibleMessage */
export type MaybeInaccessibleMessage = Message | InaccessibleMessage;

/** The Bot API supports basic formatting for messages. You can use bold, italic, underlined, strikethrough, spoiler text, block quotations as well as inline links and pre-formatted code in your bots' messages. Telegram clients will render them accordingly. You can specify text entities directly, or use markdown-style or HTML-style formatting.

Note that Telegram clients will display an **alert** to the user before opening an inline link ('Open this link?' together with the full URL).

Message entities can be nested, providing following restrictions are met:
- If two entities have common characters, then one of them is fully contained inside another.
- bold, italic, underline, strikethrough, and spoiler entities can contain and can be part of any other entities, except pre and code.
- blockquote and expandable_blockquote entities can't be nested.
- All other entities can't contain each other.

Links `tg://user?id=<user_id>` can be used to mention a user by their identifier without using a username. Please note:

- These links will work only if they are used inside an inline link or in an inline keyboard button. For example, they will not work, when used in a message text.
- Unless the user is a member of the chat where they were mentioned, these mentions are only guaranteed to work if the user has contacted the bot in private in the past or has sent a callback query to the bot via an inline button and doesn't have Forwarded Messages privacy enabled for the bot.

You can find the list of programming and markup languages for which syntax highlighting is supported at [libprisma#supported-languages](https://github.com/TelegramMessenger/libprisma#supported-languages).

#### MarkdownV2 style
To use this mode, pass *MarkdownV2* in the *parse_mode* field. Use the following syntax in your message:

```
*bold \*text*
_italic \*text_
__underline__
~strikethrough~
||spoiler||
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
![👍](tg://emoji?id=5368324170671202286)
`inline fixed-width code`
`​`​`
pre-formatted fixed-width code block
`​`​`
`​`​`python
pre-formatted fixed-width code block written in the Python programming language
`​`​`
>Block quotation started
>Block quotation continued
>Block quotation continued
>Block quotation continued
>The last line of the block quotation
***>The second expandable block quotation started right after the previous
>It is separated from the previous block quotation by an empty bold entity
>Expandable block quotation continued
>Hidden by default part of the expandable block quotation started
>Expandable block quotation continued
>The last line of the expandable block quotation with the expandability mark||
```
Please note:

- Any character with code between 1 and 126 inclusively can be escaped anywhere with a preceding '\' character, in which case it is treated as an ordinary character and not a part of the markup. This implies that '\' character usually must be escaped with a preceding '\' character.
- Inside `pre` and `code` entities, all '`' and '\' characters must be escaped with a preceding '\' character.
- Inside the `(...)` part of the inline link and custom emoji definition, all ')' and '\' must be escaped with a preceding '\' character.
- In all other places characters '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!' must be escaped with the preceding character '\'.
- In case of ambiguity between `italic` and `underline` entities `__` is always greadily treated from left to right as beginning or end of an `underline` entity, so instead of `___italic underline___` use `___italic underline_**__`, adding an empty bold entity as a separator.
- A valid emoji must be provided as an alternative value for the custom emoji. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the emoji field of the custom emoji sticker.
- Custom emoji entities can only be used by bots that purchased additional usernames on Fragment.

#### HTML style
To use this mode, pass *HTML* in the *parse_mode* field. The following tags are currently supported:

```html
<b>bold</b>, <strong>bold</strong>
<i>italic</i>, <em>italic</em>
<u>underline</u>, <ins>underline</ins>
<s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
<span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
<b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
<a href="http://www.example.com/">inline URL</a>
<a href="tg://user?id=123456789">inline mention of a user</a>
<tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>
<code>inline fixed-width code</code>
<pre>pre-formatted fixed-width code block</pre>
<pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>
<blockquote>Block quotation started\nBlock quotation continued\nThe last line of the block quotation</blockquote>
<blockquote expandable>Expandable block quotation started\nExpandable block quotation continued\nExpandable block quotation continued\nHidden by default part of the block quotation started\nExpandable block quotation continued\nThe last line of the block quotation</blockquote>
```
Please note:

- Only the tags mentioned above are currently supported.
- All `<`, `>` and `&` symbols that are not a part of a tag or an HTML entity must be replaced with the corresponding HTML entities (`<` with `&lt;`, `>` with `&gt;` and `&` with `&amp;`).
- All numerical HTML entities are supported.
- The API currently supports only the following named HTML entities: `&lt;`, `&gt;`, `&amp;` and `&quot;`.
- Use nested `pre` and `code` tags, to define programming language for pre entity.
- Programming language can't be specified for standalone `code` tags.
- A valid emoji must be used as the content of the tg-emoji tag. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the emoji field of the custom emoji sticker.
- Custom emoji entities can only be used by bots that purchased additional usernames on Fragment.

#### Markdown style
This is a legacy mode, retained for backward compatibility. To use this mode, pass *Markdown* in the *parse_mode* field. Use the following syntax in your message:

```
*bold text*
_italic text_
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
`inline fixed-width code`
`​`​`
pre-formatted fixed-width code block
`​`​`
`​`​`python
pre-formatted fixed-width code block written in the Python programming language
`​`​`
```
Please note:

- Entities must not be nested, use parse mode MarkdownV2 instead.
- There is no way to specify “underline”, “strikethrough”, “spoiler”, “blockquote”, “expandable_blockquote” and “custom_emoji” entities, use parse mode MarkdownV2 instead.
- To escape characters '_', '*', '`', '[' outside of an entity, prepend the characters '\' before them.
- Escaping inside entities is not allowed, so entity must be closed first and reopened again: use `_snake_\__case_` for italic `snake_case` and `*2*\**2=4*` for bold `2*2=4`. */
export type ParseMode = "Markdown" | "MarkdownV2" | "HTML";

export declare namespace MessageEntity {
    interface AbstractMessageEntity {
        /** Type of the entity. Currently, can be “mention” (@username), “hashtag” (#hashtag or #hashtag@chatusername), “cashtag” ($USD or $USD@chatusername), “bot_command” (/start@jobs_bot), “url” (https://telegram.org), “email” (do-not-reply@telegram.org), “phone_number” (+1-212-555-0123), “bold” (bold text), “italic” (italic text), “underline” (underlined text), “strikethrough” (strikethrough text), “spoiler” (spoiler message), “blockquote” (block quotation), “expandable_blockquote” (collapsed-by-default block quotation), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users without usernames), “custom_emoji” (for inline custom emoji stickers) */
        type: string;
        /** Offset in UTF-16 code units to the start of the entity */
        offset: number;
        /** Length of the entity in UTF-16 code units */
        length: number;
    }
    export interface CommonMessageEntity extends AbstractMessageEntity {
        type:
            | "mention"
            | "hashtag"
            | "cashtag"
            | "bot_command"
            | "url"
            | "email"
            | "phone_number"
            | "bold"
            | "italic"
            | "underline"
            | "strikethrough"
            | "spoiler"
            | "blockquote"
            | "expandable_blockquote"
            | "code";
    }
    export interface PreMessageEntity extends AbstractMessageEntity {
        type: "pre";
        /** For “pre” only, the programming language of the entity text */
        language?: string;
    }
    export interface TextLinkMessageEntity extends AbstractMessageEntity {
        type: "text_link";
        /** For “text_link” only, URL that will be opened after user taps on the text */
        url: string;
    }
    export interface TextMentionMessageEntity extends AbstractMessageEntity {
        type: "text_mention";
        /** For “text_mention” only, the mentioned user */
        user: User;
    }
    export interface CustomEmojiMessageEntity extends AbstractMessageEntity {
        type: "custom_emoji";
        /** For “custom_emoji” only, unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker */
        custom_emoji_id: string;
    }
}

/** This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc. */
export type MessageEntity =
    | MessageEntity.CommonMessageEntity
    | MessageEntity.CustomEmojiMessageEntity
    | MessageEntity.PreMessageEntity
    | MessageEntity.TextLinkMessageEntity
    | MessageEntity.TextMentionMessageEntity;

/** This object contains information about the quoted part of a message that is replied to by the given message. */
export interface TextQuote {
    /** Text of the quoted part of a message that is replied to by the given message */
    text: string;
    /** Special entities that appear in the quote. Currently, only bold, italic, underline, strikethrough, spoiler, and custom_emoji entities are kept in quotes. */
    entities?: MessageEntity[];
    /** Approximate quote position in the original message in UTF-16 code units as specified by the sender */
    position: number;
    /** True, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server. */
    is_manual?: true;
}

/** This object contains information about a message that is being replied to, which may come from another chat or forum topic. */
export interface ExternalReplyInfo {
    /** Origin of the message replied to by the given message */
    origin: MessageOrigin;
    /** Chat the original message belongs to. Available only if the chat is a supergroup or a channel. */
    chat?: Chat;
    /** Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel. */
    message_id?: number;
    /** Options used for link preview generation for the original message, if it is a text message */
    link_preview_options?: LinkPreviewOptions;
    /** Message is an animation, information about the animation */
    animation?: Animation;
    /** Message is an audio file, information about the file */
    audio?: Audio;
    /** Message is a general file, information about the file */
    document?: Document;
    /** Message is a photo, available sizes of the photo */
    photo?: PhotoSize[];
    /** Message is a sticker, information about the sticker */
    sticker?: Sticker;
    /** Message is a forwarded story */
    story?: Story;
    /** Message is a video, information about the video */
    video?: Video;
    /** Message is a video note, information about the video message */
    video_note?: VideoNote;
    /** Message is a voice message, information about the file */
    voice?: Voice;
    /** True, if the message media is covered by a spoiler animation */
    has_media_spoiler?: true;
    /** Message is a shared contact, information about the contact */
    contact?: Contact;
    /** Message is a dice with random value */
    dice?: Dice;
    /** Message is a game, information about the game. More about games » */
    game?: Game;
    /** Message is a scheduled giveaway, information about the giveaway */
    giveaway?: Giveaway;
    /** A giveaway with public winners was completed */
    giveaway_winners?: GiveawayWinners;
    /** Message is an invoice for a payment, information about the invoice. More about payments » */
    invoice?: Invoice;
    /** Message is a shared location, information about the location */
    location?: Location;
    /** Message contains paid media; information about the paid media */
    paid_media?: PaidMediaInfo;
    /** Message is a native poll, information about the poll */
    poll?: Poll;
    /** Message is a venue, information about the venue */
    venue?: Venue;
}

/** Describes reply parameters for the message that is being sent. */
export interface ReplyParameters {
    /** Identifier of the message that will be replied to in the current chat, or in the chat chat_id if it is specified */
    message_id: number;
    /** If the message to be replied to is from a different chat, unique identifier for the chat or username of the channel (in the format @channelusername). Not supported for messages sent on behalf of a business account. */
    chat_id?: number | string;
    /** Pass True if the message should be sent even if the specified message to be replied to is not found; can be used only for replies in the same chat and forum topic. Always True for messages sent on behalf of a business account. */
    allow_sending_without_reply?: boolean;
    /** Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including bold, italic, underline, strikethrough, spoiler, and custom_emoji entities. The message will fail to send if the quote isn't found in the original message. */
    quote?: string;
    /** Mode for parsing entities in the quote. See formatting options for more details. */
    quote_parse_mode?: string;
    /** A JSON-serialized list of special entities that appear in the quote. It can be specified instead of quote_parse_mode. */
    quote_entities?: MessageEntity[];
    /** Position of the quote in the original message in UTF-16 code units */
    quote_position?: number;
}

/** This object describes the origin of a message. It can be one of

- MessageOriginUser
- MessageOriginHiddenUser
- MessageOriginChat
- MessageOriginChannel */
export type MessageOrigin =
    | MessageOriginUser
    | MessageOriginHiddenUser
    | MessageOriginChat
    | MessageOriginChannel;

/** The message was originally sent by a known user. */
export interface MessageOriginUser {
    /** Type of the message origin, always “user” */
    type: "user";
    /** Date the message was sent originally in Unix time */
    date: number;
    /** User that sent the message originally */
    sender_user: User;
}

/** The message was originally sent by an unknown user. */
export interface MessageOriginHiddenUser {
    /** Type of the message origin, always “hidden_user” */
    type: "hidden_user";
    /** Date the message was sent originally in Unix time */
    date: number;
    /** Name of the user that sent the message originally */
    sender_user_name: string;
}

/** The message was originally sent on behalf of a chat to a group chat. */
export interface MessageOriginChat {
    /** Type of the message origin, always “chat” */
    type: "chat";
    /** Date the message was sent originally in Unix time */
    date: number;
    /** Chat that sent the message originally */
    sender_chat: Chat;
    /** For messages originally sent by an anonymous chat administrator, original message author signature */
    author_signature?: string;
}

/** The message was originally sent to a channel chat. */
export interface MessageOriginChannel {
    /** Type of the message origin, always “channel” */
    type: "channel";
    /** Date the message was sent originally in Unix time */
    date: number;
    /** Channel chat to which the message was originally sent */
    chat: Chat.ChannelChat;
    /** Unique message identifier inside the chat */
    message_id: number;
    /** Signature of the original post author */
    author_signature?: string;
}

/** This object represents one size of a photo or a file / sticker thumbnail. */
export interface PhotoSize {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Photo width */
    width: number;
    /** Photo height */
    height: number;
    /** File size in bytes */
    file_size?: number;
}

/** This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound). */
export interface Animation {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Video width as defined by sender */
    width: number;
    /** Video height as defined by sender */
    height: number;
    /** Duration of the video in seconds as defined by sender */
    duration: number;
    /** Animation thumbnail as defined by sender */
    thumbnail?: PhotoSize;
    /** Original animation filename as defined by sender */
    file_name?: string;
    /** MIME type of the file as defined by sender */
    mime_type?: string;
    /** File size in bytes */
    file_size?: number;
}

/** This object represents an audio file to be treated as music by the Telegram clients. */
export interface Audio {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Duration of the audio in seconds as defined by sender */
    duration: number;
    /** Performer of the audio as defined by sender or by audio tags */
    performer?: string;
    /** Title of the audio as defined by sender or by audio tags */
    title?: string;
    /** Original filename as defined by sender */
    file_name?: string;
    /** MIME type of the file as defined by sender */
    mime_type?: string;
    /** File size in bytes */
    file_size?: number;
    /** Thumbnail of the album cover to which the music file belongs */
    thumbnail?: PhotoSize;
}

/** This object represents a general file (as opposed to photos, voice messages and audio files). */
export interface Document {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Document thumbnail as defined by sender */
    thumbnail?: PhotoSize;
    /** Original filename as defined by sender */
    file_name?: string;
    /** MIME type of the file as defined by sender */
    mime_type?: string;
    /** File size in bytes */
    file_size?: number;
}

/** This object represents a story. */
export interface Story {
    /** Chat that posted the story */
    chat: Chat;
    /** Unique identifier for the story in the chat */
    id: number;
}

/** This object represents a video file. */
export interface Video {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Video width as defined by sender */
    width: number;
    /** Video height as defined by sender */
    height: number;
    /** Duration of the video in seconds as defined by sender */
    duration: number;
    /** Video thumbnail */
    thumbnail?: PhotoSize;
    /** Original filename as defined by sender */
    file_name?: string;
    /** MIME type of the file as defined by sender */
    mime_type?: string;
    /** File size in bytes */
    file_size?: number;
}

/** This object represents a video message (available in Telegram apps as of v.4.0). */
export interface VideoNote {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Video width and height (diameter of the video message) as defined by sender */
    length: number;
    /** Duration of the video in seconds as defined by sender */
    duration: number;
    /** Video thumbnail */
    thumbnail?: PhotoSize;
    /** File size in bytes */
    file_size?: number;
}

/** This object represents a voice note. */
export interface Voice {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Duration of the audio in seconds as defined by sender */
    duration: number;
    /** MIME type of the file as defined by sender */
    mime_type?: string;
    /** File size in bytes */
    file_size?: number;
}

/** This object represents a phone contact. */
export interface Contact {
    /** Contact's phone number */
    phone_number: string;
    /** Contact's first name */
    first_name: string;
    /** Contact's last name */
    last_name?: string;
    /** Contact's user identifier in Telegram. */
    user_id?: number;
    /** Additional data about the contact in the form of a vCard */
    vcard?: string;
}

/** This object represents an animated emoji that displays a random value. */
export interface Dice {
    /** Emoji on which the dice throw animation is based */
    emoji: string;
    /** Value of the dice, 1-6 for "🎲", "🎯" and "🎳" base emoji, 1-5 for "🏀" and "⚽" base emoji, 1-64 for "🎰" base emoji */
    value: number;
}

/** This object contains information about one answer option in a poll. */
export interface PollOption {
    /** Option text, 1-100 characters */
    text: string;
    /** Special entities that appear in the option text. Currently, only custom emoji entities are allowed in poll option texts */
    text_entities?: MessageEntity[];
    /** Number of users that voted for this option */
    voter_count: number;
}

/** This object contains information about one answer option in a poll to send. */
export interface InputPollOption {
    /** Option text, 1-100 characters */
    text: string;
    /** Mode for parsing entities in the text. See formatting options for more details. Currently, only custom emoji entities are allowed */
    text_parse_mode?: string;
    /** A list of special entities that appear in the poll option text. It can be specified instead of text_parse_mode */
    text_entities?: MessageEntity[];
}

/** This object represents an answer of a user in a non-anonymous poll. */
export interface PollAnswer {
    /** Unique poll identifier */
    poll_id: string;
    /** The chat that changed the answer to the poll, if the voter is anonymous */
    voter_chat?: Chat;
    /** The user that changed the answer to the poll, if the voter isn't anonymous */
    user?: User;
    /** 0-based identifiers of chosen answer options. May be empty if the vote was retracted. */
    option_ids: number[];
}

/** This object contains information about a poll. */
export interface Poll {
    /** Unique poll identifier */
    id: string;
    /** Poll question, 1-300 characters */
    question: string;
    /** Special entities that appear in the question. Currently, only custom emoji entities are allowed in poll questions */
    question_entities?: MessageEntity[];
    /** List of poll options */
    options: PollOption[];
    /** Total number of users that voted in the poll */
    total_voter_count: number;
    /** True, if the poll is closed */
    is_closed: boolean;
    /** True, if the poll is anonymous */
    is_anonymous: boolean;
    /** Poll type, currently can be “regular” or “quiz” */
    type: "regular" | "quiz";
    /** True, if the poll allows multiple answers */
    allows_multiple_answers: boolean;
    /** 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot. */
    correct_option_id?: number;
    /** Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters */
    explanation?: string;
    /** Special entities like usernames, URLs, bot commands, etc. that appear in the explanation */
    explanation_entities?: MessageEntity[];
    /** Amount of time in seconds the poll will be active after creation */
    open_period?: number;
    /** Point in time (Unix timestamp) when the poll will be automatically closed */
    close_date?: number;
}

/** This object represents a point on the map. */
export interface Location {
    /** Latitude as defined by sender */
    latitude: number;
    /** Longitude as defined by sender */
    longitude: number;
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number;
    /** Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only. */
    live_period?: number;
    /** The direction in which user is moving, in degrees; 1-360. For active live locations only. */
    heading?: number;
    /** The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only. */
    proximity_alert_radius?: number;
}

/** Describes the paid media added to a message. */
export interface PaidMediaInfo {
    /** The number of Telegram Stars that must be paid to buy access to the media */
    star_count: number;
    /** Information about the paid media */
    paid_media: PaidMedia[];
}

/** This object describes paid media. Currently, it can be one of

- PaidMediaPreview
- PaidMediaPhoto
- PaidMediaVideo */
export type PaidMedia =
    | PaidMediaPreview
    | PaidMediaPhoto
    | PaidMediaVideo;

/** The paid media isn't available before the payment. */
export interface PaidMediaPreview {
    /** Type of the paid media, always “preview” */
    type: "preview";
    /** Media width as defined by the sender */
    width?: number;
    /** Media height as defined by the sender */
    height?: number;
    /** Duration of the media in seconds as defined by the sender */
    duration?: number;
}

/** The paid media is a photo. */
export interface PaidMediaPhoto {
    /** Type of the paid media, always “photo” */
    type: "photo";
    /** The photo */
    photo: PhotoSize[];
}

/** The paid media is a video. */
export interface PaidMediaVideo {
    /** Type of the paid media, always “video” */
    type: "video";
    /** The video */
    video: Video;
}

/** This object represents a venue. */
export interface Venue {
    /** Venue location. Can't be a live location */
    location: Location;
    /** Name of the venue */
    title: string;
    /** Address of the venue */
    address: string;
    /** Foursquare identifier of the venue */
    foursquare_id?: string;
    /** Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string;
    /** Google Places identifier of the venue */
    google_place_id?: string;
    /** Google Places type of the venue. (See supported types.) */
    google_place_type?: string;
}

/** Describes data sent from a Web App to the bot. */
export interface WebAppData {
    /** The data. Be aware that a bad client can send arbitrary data in this field. */
    data: string;
    /** Text of the web_app keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field. */
    button_text: string;
}

/** This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user. */
export interface ProximityAlertTriggered {
    /** User that triggered the alert */
    traveler: User;
    /** User that set the alert */
    watcher: User;
    /** The distance between the users */
    distance: number;
}

/** This object represents a service message about a change in auto-delete timer settings. */
export interface MessageAutoDeleteTimerChanged {
    /** New auto-delete time for messages in the chat; in seconds */
    message_auto_delete_time: number;
}

/** This object represents a service message about a user boosting a chat. */
export interface ChatBoostAdded {
    /** Number of boosts added by the user */
    boost_count: number;
}

/** This object describes the way a background is filled based on the selected colors. Currently, it can be one of

- BackgroundFillSolid
- BackgroundFillGradient
- BackgroundFillFreeformGradient */
export type BackgroundFill =
    | BackgroundFillSolid
    | BackgroundFillGradient
    | BackgroundFillFreeformGradient;

/** The background is filled using the selected color. */
export interface BackgroundFillSolid {
    /** Type of the background fill, always “solid” */
    type: "solid";
    /** The color of the background fill in the RGB24 format */
    color: number;
}

/** The background is a gradient fill. */
export interface BackgroundFillGradient {
    /** Type of the background fill, always “gradient” */
    type: "gradient";
    /** Top color of the gradient in the RGB24 format */
    top_color: number;
    /** Bottom color of the gradient in the RGB24 format */
    bottom_color: number;
    /** Clockwise rotation angle of the background fill in degrees; 0-359 */
    rotation_angle: number;
}

/** The background is a freeform gradient that rotates  after every message in the chat. */
export interface BackgroundFillFreeformGradient {
    /** Type of the background fill, always “freeform_gradient” */
    type: "freeform_gradient";
    /** A list of the 3 or 4 base colors that are used to generate the freeform gradient in the RGB24 format */
    colors: number[];
}

/** This object describes the type of a background. Currently, it can be one of

- BackgroundTypeFill
- BackgroundTypeWallpaper
- BackgroundTypePattern
- BackgroundTypeChatTheme
- BackgroundTypeFill */
export type BackgroundType =
    | BackgroundTypeFill
    | BackgroundTypeWallpaper
    | BackgroundTypePattern
    | BackgroundTypeChatTheme;

/** The background is automatically filled based on the selected colors. */
export interface BackgroundTypeFill {
    /** Type of the background, always “fill” */
    type: "fill";
    /** The background fill */
    fill: BackgroundFill;
    /** Dimming of the background in dark themes, as a percentage; 0-100 */
    dark_theme_dimming: number;
}

/** The background is a wallpaper in the JPEG format. */
export interface BackgroundTypeWallpaper {
    /** Type of the background, always “wallpaper” */
    type: "wallpaper";
    /** Document with the wallpaper */
    document: Document;
    /** Dimming of the background in dark themes, as a percentage; 0-100 */
    dark_theme_dimming: number;
    /** True, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12 */
    is_blurred?: true;
    /** True, if the background moves slightly when the device is tilted */
    is_moving?: true;
}

/** The background is a PNG or TGV (gzipped subset of SVG with MIME type “application/x-tgwallpattern”) pattern to be combined with the background fill chosen by the user. */
export interface BackgroundTypePattern {
    /** Type of the background, always “pattern” */
    type: "pattern";
    /** Document with the pattern */
    document: Document;
    /** The background fill that is combined with the pattern */
    fill: BackgroundFill;
    /** Intensity of the pattern when it is shown above the filled background; 0-100 */
    intensity: number;
    /** True, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only */
    is_inverted?: true;
    /** True, if the background moves slightly when the device is tilted */
    is_moving?: true;
}

/** The background is taken directly from a built-in chat  theme. */
export interface BackgroundTypeChatTheme {
    /** Type of the background, always “chat_theme” */
    type: "chat_theme";
    /** Name of the chat theme, which is usually an emoji */
    theme_name: string;
}

/** This object represents a chat background. */
export interface ChatBackground {
    /** Type of the background*/
    type: BackgroundType;
}

/** This object represents a service message about a new forum topic created in the chat. */
export interface ForumTopicCreated {
    /** Name of the topic */
    name: string;
    /** Color of the topic icon in RGB format */
    icon_color: number;
    /** Unique identifier of the custom emoji shown as the topic icon */
    icon_custom_emoji_id?: string;
}

/** This object represents a service message about an edited forum topic. */
export interface ForumTopicEdited {
    /** New name of the topic, if it was edited */
    name?: string;
    /** New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed */
    icon_custom_emoji_id?: string;
}

/** This object represents a service message about a forum topic closed in the chat. Currently holds no information. */
export interface ForumTopicClosed {}

/** This object represents a service message about a forum topic reopened in the chat. Currently holds no information. */
export interface ForumTopicReopened {}

/** This object represents a service message about General forum topic hidden in the chat. Currently holds no information. */
export interface GeneralForumTopicHidden {}

/** This object represents a service message about General forum topic unhidden in the chat. Currently holds no information. */
export interface GeneralForumTopicUnhidden {}

/** This object contains information about a user that was shared with the bot using a KeyboardButtonRequestUsers button. */
export interface SharedUser {
    /** Identifier of the shared user. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means. */
    user_id: number;
    /** First name of the user, if the name was requested by the bot */
    first_name?: string;
    /** Last name of the user, if the name was requested by the bot */
    last_name?: string;
    /** Username of the user, if the username was requested by the bot */
    username?: string;
    /** Available sizes of the chat photo, if the photo was requested by the bot */
    photo?: PhotoSize[];
}

/** This object contains information about the user whose identifier was shared with the bot using a KeyboardButtonRequestUsers button. */
export interface UsersShared {
    /** Identifier of the request */
    request_id: number;
    /** Information about users shared with the bot. */
    users: SharedUser[];
}

/** This object contains information about a chat that was shared with the bot using a KeyboardButtonRequestChat button. */
export interface ChatShared {
    /** Identifier of the request */
    request_id: number;
    /** Identifier of the shared chat. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means. */
    chat_id: number;
    /** Title of the chat, if the title was requested by the bot. */
    title?: string;
    /** Username of the chat, if the username was requested by the bot and available. */
    username?: string;
    /** Available sizes of the chat photo, if the photo was requested by the bot */
    photo?: PhotoSize[];
}

/** This object represents a service message about a user allowing a bot to write messages after adding it to the attachment menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess. */
export interface WriteAccessAllowed {
    /** True, if the access was granted after the user accepted an explicit request from a Web App sent by the method requestWriteAccess */
    from_request?: boolean;
    /** Name of the Web App, if the access was granted when the Web App was launched from a link */
    web_app_name?: string;
    /** True, if the access was granted when the bot was added to the attachment or side menu */
    from_attachment_menu?: boolean;
}

/** This object represents a service message about a video chat scheduled in the chat. */
export interface VideoChatScheduled {
    /** Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator */
    start_date: number;
}

/** This object represents a service message about a video chat started in the chat. Currently holds no information. */
export interface VideoChatStarted {}

/** This object represents a service message about a video chat ended in the chat. */
export interface VideoChatEnded {
    /** Video chat duration in seconds */
    duration: number;
}

/** This object represents a service message about new members invited to a video chat. */
export interface VideoChatParticipantsInvited {
    /** New members that were invited to the video chat */
    users: User[];
}

/** This object represents a service message about the creation of a scheduled giveaway. */
export interface GiveawayCreated {
    /** The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only */
    prize_star_count?: number;
}

/** This object represents a message about a scheduled giveaway. */
export interface Giveaway {
    /** The list of chats which the user must join to participate in the giveaway */
    chats: Chat[];
    /** Point in time (Unix timestamp) when winners of the giveaway will be selected */
    winners_selection_date: number;
    /** The number of users which are supposed to be selected as winners of the giveaway */
    winner_count: number;
    /** True, if only users who join the chats after the giveaway started should be eligible to win */
    only_new_members?: true;
    /** True, if the list of giveaway winners will be visible to everyone */
    has_public_winners?: true;
    /** Description of additional giveaway prize */
    prize_description?: string;
    /** A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways. */
    country_codes?: string[];
    /** The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only */
    prize_star_count?: number;
    /** The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only */
    premium_subscription_month_count?: number;
}

/** This object represents a message about the completion of a giveaway with public winners. */
export interface GiveawayWinners {
    /** The chat that created the giveaway */
    chat: Chat;
    /** Identifier of the message with the giveaway in the chat */
    giveaway_message_id: number;
    /** Point in time (Unix timestamp) when winners of the giveaway were selected */
    winners_selection_date: number;
    /** Total number of winners in the giveaway */
    winner_count: number;
    /** List of up to 100 winners of the giveaway */
    winners: User[];
    /** The number of other chats the user had to join in order to be eligible for the giveaway */
    additional_chat_count?: number;
    /** The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only */
    prize_star_count?: number;
    /** The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only */
    premium_subscription_month_count?: number;
    /** Number of undistributed prizes */
    unclaimed_prize_count?: number;
    /** True, if only users who had joined the chats after the giveaway started were eligible to win */
    only_new_members?: true;
    /** True, if the giveaway was canceled because the payment for it was refunded */
    was_refunded?: true;
    /** Description of additional giveaway prize */
    prize_description?: string;
}

/** This object represents a service message about the completion of a giveaway without public winners. */
export interface GiveawayCompleted {
    /** Number of winners in the giveaway */
    winner_count: number;
    /** Number of undistributed prizes */
    unclaimed_prize_count?: number;
    /** Message with the giveaway that was completed, if it wasn't deleted */
    giveaway_message?: Message;
    /** True, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway. */
    is_star_giveaway?: true;
}

/** Describes the options used for link preview generation. */
export interface LinkPreviewOptions {
    /** True, if the link preview is disabled */
    is_disabled?: boolean;
    /** URL to use for the link preview. If empty, then the first URL found in the message text will be used */
    url?: string;
    /** True, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview */
    prefer_small_media?: boolean;
    /** True, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview */
    prefer_large_media?: boolean;
    /** True, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text */
    show_above_text?: boolean;
}

/** This object represents a sticker. */
export interface Sticker {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** Type of the sticker, currently one of “regular”, “mask”, “custom_emoji”. The type of the sticker is independent from its format, which is determined by the fields is_animated and is_video. */
    type: "regular" | "mask" | "custom_emoji";
    /** Sticker width */
    width: number;
    /** Sticker height */
    height: number;
    /** True, if the sticker is animated */
    is_animated: boolean;
    /** True, if the sticker is a video sticker */
    is_video: boolean;
    /** Sticker thumbnail in the .WEBP or .JPG format */
    thumbnail?: PhotoSize;
    /** Emoji associated with the sticker */
    emoji?: string;
    /** Name of the sticker set to which the sticker belongs */
    set_name?: string;
    /** For premium regular stickers, premium animation for the sticker */
    premium_animation?: File;
    /** For mask stickers, the position where the mask should be placed */
    mask_position?: MaskPosition;
    /** For custom emoji stickers, unique identifier of the custom emoji */
    custom_emoji_id?: string;
    /** File size in bytes */
    file_size?: number;
}

/** This object represents a sticker set. */
export interface StickerSet {
    /** Sticker set name */
    name: string;
    /** Sticker set title */
    title: string;
    /** Type of stickers in the set, currently one of “regular”, “mask”, “custom_emoji” */
    sticker_type: "regular" | "mask" | "custom_emoji";
    /** List of all set stickers */
    stickers: Sticker[];
    /** Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format */
    thumbnail?: PhotoSize;
}

/** This object describes the position on faces where a mask should be placed by default. */
export interface MaskPosition {
    /** The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”. */
    point: "forehead" | "eyes" | "mouth" | "chin";
    /** Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position. */
    x_shift: number;
    /** Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position. */
    y_shift: number;
    /** Mask scaling coefficient. For example, 2.0 means double size. */
    scale: number;
}

/** This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers. */
export interface Game {
    /** Title of the game */
    title: string;
    /** Description of the game */
    description: string;
    /** Photo that will be displayed in the game message in chats. */
    photo: PhotoSize[];
    /** Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls setGameScore, or manually edited using editMessageText. 0-4096 characters. */
    text: string;
    /** Special entities that appear in text, such as usernames, URLs, bot commands, etc. */
    text_entities: MessageEntity[];
    /** Animation that will be displayed in the game message in chats. Upload via BotFather */
    animation: Animation;
}

/** This object represents one row of the high scores table for a game. */
export interface GameHighScore {
    /** Position in high score table for the game */
    position: number;
    /** User */
    user: User;
    /** Score */
    score: number;
}

/** This object represents a file ready to be downloaded. The file can be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile. */
export interface File {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** File size in bytes */
    file_size?: number;
    /** File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file. */
    file_path?: string;
}

/** This object describes the type of a reaction. Currently, it can be one of

- ReactionTypeEmoji
- ReactionTypeCustomEmoji
- ReactionTypePaid */
export type ReactionType =
    | ReactionTypeEmoji
    | ReactionTypeCustomEmoji
    | ReactionTypePaid;

/** The reaction is based on an emoji. */
export interface ReactionTypeEmoji {
    /** Type of the reaction, always “emoji” */
    type: "emoji";
    /** Reaction emoji. Currently, it can be one of "👍", "👎", "❤", "🔥", "🥰", "👏", "😁", "🤔", "🤯", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏", "👌", "🕊", "🤡", "🥱", "🥴", "😍", "🐳", "❤‍🔥", "🌚", "🌭", "💯", "🤣", "⚡", "🍌", "🏆", "💔", "🤨", "😐", "🍓", "🍾", "💋", "🖕", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", "🎃", "🙈", "😇", "😨", "🤝", "✍", "🤗", "🫡", "🎅", "🎄", "☃", "💅", "🤪", "🗿", "🆒", "💘", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷‍♂", "🤷", "🤷‍♀", "😡" */
    emoji:
        | "👍"
        | "👎"
        | "❤"
        | "🔥"
        | "🥰"
        | "👏"
        | "😁"
        | "🤔"
        | "🤯"
        | "😱"
        | "🤬"
        | "😢"
        | "🎉"
        | "🤩"
        | "🤮"
        | "💩"
        | "🙏"
        | "👌"
        | "🕊"
        | "🤡"
        | "🥱"
        | "🥴"
        | "😍"
        | "🐳"
        | "❤‍🔥"
        | "🌚"
        | "🌭"
        | "💯"
        | "🤣"
        | "⚡"
        | "🍌"
        | "🏆"
        | "💔"
        | "🤨"
        | "😐"
        | "🍓"
        | "🍾"
        | "💋"
        | "🖕"
        | "😈"
        | "😴"
        | "😭"
        | "🤓"
        | "👻"
        | "👨‍💻"
        | "👀"
        | "🎃"
        | "🙈"
        | "😇"
        | "😨"
        | "🤝"
        | "✍"
        | "🤗"
        | "🫡"
        | "🎅"
        | "🎄"
        | "☃"
        | "💅"
        | "🤪"
        | "🗿"
        | "🆒"
        | "💘"
        | "🙉"
        | "🦄"
        | "😘"
        | "💊"
        | "🙊"
        | "😎"
        | "👾"
        | "🤷‍♂"
        | "🤷"
        | "🤷‍♀"
        | "😡";
}

/** The reaction is based on a custom emoji. */
export interface ReactionTypeCustomEmoji {
    /** Type of the reaction, always “custom_emoji” */
    type: "custom_emoji";
    /** Custom emoji identifier */
    custom_emoji_id: string;
}

/** The reaction is paid. */
export interface ReactionTypePaid {
    /** Type of the reaction, always “paid” */
    type: "paid";
}

/** Represents a reaction added to a message along with the number of times it was added. */
export interface ReactionCount {
    /** Type of the reaction */
    type: ReactionType;
    /** Number of times the reaction was added */
    total_count: number;
}

/** This object represents a change of a reaction on a message performed by a user. */
export interface MessageReactionUpdated {
    /** The chat containing the message the user reacted to */
    chat: Chat;
    /** Unique identifier of the message inside the chat */
    message_id: number;
    /** The user that changed the reaction, if the user isn't anonymous */
    user?: User;
    /** The chat on behalf of which the reaction was changed, if the user is anonymous */
    actor_chat?: Chat;
    /** Date of the change in Unix time */
    date: number;
    /** Previous list of reaction types that were set by the user */
    old_reaction: ReactionType[];
    /** New list of reaction types that have been set by the user */
    new_reaction: ReactionType[];
}

/** This object represents reaction changes on a message with anonymous reactions. */
export interface MessageReactionCountUpdated {
    /** The chat containing the message */
    chat: Chat;
    /** Unique message identifier inside the chat */
    message_id: number;
    /** Date of the change in Unix time */
    date: number;
    /** List of reactions that are present on the message */
    reactions: ReactionCount[];
}

/** Describes an inline message to be sent by a user of a Mini App. */
export interface PreparedInlineMessage {
    /** Unique identifier of the prepared message */
    id: string;
    /** Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used */
    expiration_date: number;
}
