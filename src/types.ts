// === GETTING UPDATES ===
/**
 * <p>This <a href="#available-types">object</a> represents an incoming update.<br>At most **one** of the optional parameters can be present in any given update.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#update}
 */
export interface Update {
<tr>
<td>update_id</td>
<td>Integer</td>
<td>The update&#39;s unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you&#39;re using <a href="#setwebhook">webhooks</a>, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.</td>
</tr>
<tr>
<td>message?</td>
<td><a href="#message">Message</a></td>
<td>New incoming message of any kind - text, photo, sticker, etc.</td>
</tr>
<tr>
<td>edited_message?</td>
<td><a href="#message">Message</a></td>
<td>New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.</td>
</tr>
<tr>
<td>channel_post?</td>
<td><a href="#message">Message</a></td>
<td>New incoming channel post of any kind - text, photo, sticker, etc.</td>
</tr>
<tr>
<td>edited_channel_post?</td>
<td><a href="#message">Message</a></td>
<td>New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.</td>
</tr>
<tr>
<td>business_connection?</td>
<td><a href="#businessconnection">BusinessConnection</a></td>
<td>The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot</td>
</tr>
<tr>
<td>business_message?</td>
<td><a href="#message">Message</a></td>
<td>New message from a connected business account</td>
</tr>
<tr>
<td>edited_business_message?</td>
<td><a href="#message">Message</a></td>
<td>New version of a message from a connected business account</td>
</tr>
<tr>
<td>deleted_business_messages?</td>
<td><a href="#businessmessagesdeleted">BusinessMessagesDeleted</a></td>
<td>Messages were deleted from a connected business account</td>
</tr>
<tr>
<td>message_reaction?</td>
<td><a href="#messagereactionupdated">MessageReactionUpdated</a></td>
<td>A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify `&quot;message_reaction&quot;` in the list of _allowed_updates_ to receive these updates. The update isn&#39;t received for reactions set by bots.</td>
</tr>
<tr>
<td>message_reaction_count?</td>
<td><a href="#messagereactioncountupdated">MessageReactionCountUpdated</a></td>
<td>Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify `&quot;message_reaction_count&quot;` in the list of _allowed_updates_ to receive these updates. The updates are grouped and can be sent with delay up to a few minutes.</td>
</tr>
<tr>
<td>inline_query?</td>
<td><a href="#inlinequery">InlineQuery</a></td>
<td>New incoming <a href="#inline-mode">inline</a> query</td>
</tr>
<tr>
<td>chosen_inline_result?</td>
<td><a href="#choseninlineresult">ChosenInlineResult</a></td>
<td>The result of an <a href="#inline-mode">inline</a> query that was chosen by a user and sent to their chat partner. Please see our documentation on the <a href="/bots/inline#collecting-feedback">feedback collecting</a> for details on how to enable these updates for your bot.</td>
</tr>
<tr>
<td>callback_query?</td>
<td><a href="#callbackquery">CallbackQuery</a></td>
<td>New incoming callback query</td>
</tr>
<tr>
<td>shipping_query?</td>
<td><a href="#shippingquery">ShippingQuery</a></td>
<td>New incoming shipping query. Only for invoices with flexible price</td>
</tr>
<tr>
<td>pre_checkout_query?</td>
<td><a href="#precheckoutquery">PreCheckoutQuery</a></td>
<td>New incoming pre-checkout query. Contains full information about checkout</td>
</tr>
<tr>
<td>purchased_paid_media?</td>
<td><a href="#paidmediapurchased">PaidMediaPurchased</a></td>
<td>A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat</td>
</tr>
<tr>
<td>poll?</td>
<td><a href="#poll">Poll</a></td>
<td>New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot</td>
</tr>
<tr>
<td>poll_answer?</td>
<td><a href="#pollanswer">PollAnswer</a></td>
<td>A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself.</td>
</tr>
<tr>
<td>my_chat_member?</td>
<td><a href="#chatmemberupdated">ChatMemberUpdated</a></td>
<td>The bot&#39;s chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user.</td>
</tr>
<tr>
<td>chat_member?</td>
<td><a href="#chatmemberupdated">ChatMemberUpdated</a></td>
<td>A chat member&#39;s status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify `&quot;chat_member&quot;` in the list of _allowed_updates_ to receive these updates.</td>
</tr>
<tr>
<td>chat_join_request?</td>
<td><a href="#chatjoinrequest">ChatJoinRequest</a></td>
<td>A request to join the chat has been sent. The bot must have the _can_invite_users_ administrator right in the chat to receive these updates.</td>
</tr>
<tr>
<td>chat_boost?</td>
<td><a href="#chatboostupdated">ChatBoostUpdated</a></td>
<td>A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates.</td>
</tr>
<tr>
<td>removed_chat_boost?</td>
<td><a href="#chatboostremoved">ChatBoostRemoved</a></td>
<td>A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates.</td>
</tr>
}
export interface ApiMethods {
  /**
   * <p>Use this method to receive incoming updates using long polling (<a href="https://en.wikipedia.org/wiki/Push_technology#Long_polling">wiki</a>). Returns an Array of <a href="#update">Update</a> objects.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getupdates}
   */
  getUpdates({
<tr>
<td>offset?</td>
<td>Integer</td>
<td>Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as <a href="#getupdates">getUpdates</a> is called with an _offset_ higher than its _update_id_. The negative offset can be specified to retrieve updates starting from _-offset_ update from the end of the updates queue. All previous updates will be forgotten.</td>
</tr>
<tr>
<td>limit?</td>
<td>Integer</td>
<td>Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.</td>
</tr>
<tr>
<td>timeout?</td>
<td>Integer</td>
<td>Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.</td>
</tr>
<tr>
<td>allowed_updates?</td>
<td>Array of String</td>
<td>A JSON-serialized list of the update types you want your bot to receive. For example, specify `[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]` to only receive updates of these types. See <a href="#update">Update</a> for a complete list of available update types. Specify an empty list to receive all update types except _chat_member_, _message_reaction_, and _message_reaction_count_ (default). If not specified, the previous setting will be used.<br><br>Please note that this parameter doesn&#39;t affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time.</td>
</tr>
  }): Update[];
}
<blockquote>
<p>**Notes**<br>**1.** This method will not work if an outgoing webhook is set up.<br>**2.** In order to avoid getting duplicate updates, recalculate _offset_ after each server response.</p>
</blockquote>
export interface ApiMethods {
  /**
   * <p>Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized <a href="#update">Update</a>. In case of an unsuccessful request (a request with response <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes">HTTP status code</a> different from `2XY`), we will repeat the request and give up after a reasonable amount of attempts. Returns _True_ on success.</p>
   * <p>If you&#39;d like to make sure that the webhook was set by you, you can specify secret data in the parameter _secret_token_. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#setwebhook}
   */
  setWebhook({
<tr>
<td>url</td>
<td>String</td>
<td>HTTPS URL to send updates to. Use an empty string to remove webhook integration</td>
</tr>
<tr>
<td>certificate?</td>
<td><a href="#inputfile">InputFile</a></td>
<td>Upload your public key certificate so that the root certificate in use can be checked. See our <a href="/bots/self-signed">self-signed guide</a> for details.</td>
</tr>
<tr>
<td>ip_address?</td>
<td>String</td>
<td>The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS</td>
</tr>
<tr>
<td>max_connections?</td>
<td>Integer</td>
<td>The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to _40_. Use lower values to limit the load on your bot&#39;s server, and higher values to increase your bot&#39;s throughput.</td>
</tr>
<tr>
<td>allowed_updates?</td>
<td>Array of String</td>
<td>A JSON-serialized list of the update types you want your bot to receive. For example, specify `[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]` to only receive updates of these types. See <a href="#update">Update</a> for a complete list of available update types. Specify an empty list to receive all update types except _chat_member_, _message_reaction_, and _message_reaction_count_ (default). If not specified, the previous setting will be used.<br>Please note that this parameter doesn&#39;t affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.</td>
</tr>
<tr>
<td>drop_pending_updates?</td>
<td>Boolean</td>
<td>Pass _True_ to drop all pending updates</td>
</tr>
<tr>
<td>secret_token?</td>
<td>String</td>
<td>A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed. The header is useful to ensure that the request comes from a webhook set by you.</td>
</tr>
  }): true;
}
<blockquote>
<p>**Notes**<br>**1.** You will not be able to receive updates using <a href="#getupdates">getUpdates</a> for as long as an outgoing webhook is set up.<br>**2.** To use a self-signed certificate, you need to upload your <a href="/bots/self-signed">public key certificate</a> using _certificate_ parameter. Please upload as InputFile, sending a String will not work.<br>**3.** Ports currently supported _for webhooks_: **443, 80, 88, 8443**.</p>
<p>If you&#39;re having any trouble setting up webhooks, please check out this <a href="/bots/webhooks">amazing guide to webhooks</a>.</p>
</blockquote>
export interface ApiMethods {
  /**
   * <p>Use this method to remove webhook integration if you decide to switch back to <a href="#getupdates">getUpdates</a>. Returns _True_ on success.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#deletewebhook}
   */
  deleteWebhook({
<tr>
<td>drop_pending_updates?</td>
<td>Boolean</td>
<td>Pass _True_ to drop all pending updates</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
   * <p>Use this method to get current webhook status. Requires no parameters. On success, returns a <a href="#webhookinfo">WebhookInfo</a> object. If the bot is using <a href="#getupdates">getUpdates</a>, will return an object with the _url_ field empty.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getwebhookinfo}
   */
  getWebhookInfo(args: Empty): WebhookInfo;
}
/**
 * <p>Describes the current status of a webhook.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#webhookinfo}
 */
export interface WebhookInfo {
<tr>
<td>url</td>
<td>String</td>
<td>Webhook URL, may be empty if webhook is not set up</td>
</tr>
<tr>
<td>has_custom_certificate</td>
<td>Boolean</td>
<td>_True_, if a custom certificate was provided for webhook certificate checks</td>
</tr>
<tr>
<td>pending_update_count</td>
<td>Integer</td>
<td>Number of updates awaiting delivery</td>
</tr>
<tr>
<td>ip_address?</td>
<td>String</td>
<td>Currently used webhook IP address</td>
</tr>
<tr>
<td>last_error_date?</td>
<td>Integer</td>
<td>Unix time for the most recent error that happened when trying to deliver an update via webhook</td>
</tr>
<tr>
<td>last_error_message?</td>
<td>String</td>
<td>Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook</td>
</tr>
<tr>
<td>last_synchronization_error_date?</td>
<td>Integer</td>
<td>Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters</td>
</tr>
<tr>
<td>max_connections?</td>
<td>Integer</td>
<td>The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery</td>
</tr>
<tr>
<td>allowed_updates?</td>
<td>Array of String</td>
<td>A list of update types the bot is subscribed to. Defaults to all update types except _chat_member_</td>
</tr>
}

// === AVAILABLE TYPES ===
/**
 * <p>This object represents a Telegram user or bot.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#user}
 */
export interface User {
<tr>
<td>id</td>
<td>Integer</td>
<td>Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>is_bot</td>
<td>Boolean</td>
<td>_True_, if this user is a bot</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>User&#39;s or bot&#39;s first name</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>User&#39;s or bot&#39;s last name</td>
</tr>
<tr>
<td>username?</td>
<td>String</td>
<td>User&#39;s or bot&#39;s username</td>
</tr>
<tr>
<td>language_code?</td>
<td>String</td>
<td><a href="https://en.wikipedia.org/wiki/IETF_language_tag">IETF language tag</a> of the user&#39;s language</td>
</tr>
<tr>
<td>is_premium?</td>
<td>True</td>
<td>_True_, if this user is a Telegram Premium user</td>
</tr>
<tr>
<td>added_to_attachment_menu?</td>
<td>True</td>
<td>_True_, if this user added the bot to the attachment menu</td>
</tr>
<tr>
<td>can_join_groups?</td>
<td>Boolean</td>
<td>_True_, if the bot can be invited to groups. Returned only in <a href="#getme">getMe</a>.</td>
</tr>
<tr>
<td>can_read_all_group_messages?</td>
<td>Boolean</td>
<td>_True_, if <a href="/bots/features#privacy-mode">privacy mode</a> is disabled for the bot. Returned only in <a href="#getme">getMe</a>.</td>
</tr>
<tr>
<td>supports_inline_queries?</td>
<td>Boolean</td>
<td>_True_, if the bot supports inline queries. Returned only in <a href="#getme">getMe</a>.</td>
</tr>
<tr>
<td>can_connect_to_business?</td>
<td>Boolean</td>
<td>_True_, if the bot can be connected to a Telegram Business account to receive its messages. Returned only in <a href="#getme">getMe</a>.</td>
</tr>
<tr>
<td>has_main_web_app?</td>
<td>Boolean</td>
<td>_True_, if the bot has a main Web App. Returned only in <a href="#getme">getMe</a>.</td>
</tr>
}
/**
 * <p>This object represents a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chat}
 */
export interface Chat {
<tr>
<td>id</td>
<td>Integer</td>
<td>Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Type of the chat, can be either “private”, “group”, “supergroup” or “channel”</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title, for supergroups, channels and group chats</td>
</tr>
<tr>
<td>username?</td>
<td>String</td>
<td>Username, for private chats, supergroups and channels if available</td>
</tr>
<tr>
<td>first_name?</td>
<td>String</td>
<td>First name of the other party in a private chat</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>Last name of the other party in a private chat</td>
</tr>
<tr>
<td>is_forum?</td>
<td>True</td>
<td>_True_, if the supergroup chat is a forum (has <a href="https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups">topics</a> enabled)</td>
</tr>
<tr>
<td>is_direct_messages?</td>
<td>True</td>
<td>_True_, if the chat is the direct messages chat of a channel</td>
</tr>
}
/**
 * <p>This object contains full information about a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatfullinfo}
 */
export interface ChatFullInfo {
<tr>
<td>id</td>
<td>Integer</td>
<td>Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Type of the chat, can be either “private”, “group”, “supergroup” or “channel”</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title, for supergroups, channels and group chats</td>
</tr>
<tr>
<td>username?</td>
<td>String</td>
<td>Username, for private chats, supergroups and channels if available</td>
</tr>
<tr>
<td>first_name?</td>
<td>String</td>
<td>First name of the other party in a private chat</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>Last name of the other party in a private chat</td>
</tr>
<tr>
<td>is_forum?</td>
<td>True</td>
<td>_True_, if the supergroup chat is a forum (has <a href="https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups">topics</a> enabled)</td>
</tr>
<tr>
<td>is_direct_messages?</td>
<td>True</td>
<td>_True_, if the chat is the direct messages chat of a channel</td>
</tr>
<tr>
<td>accent_color_id</td>
<td>Integer</td>
<td>Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See <a href="#accent-colors">accent colors</a> for more details.</td>
</tr>
<tr>
<td>max_reaction_count</td>
<td>Integer</td>
<td>The maximum number of reactions that can be set on a message in the chat</td>
</tr>
<tr>
<td>photo?</td>
<td><a href="#chatphoto">ChatPhoto</a></td>
<td>Chat photo</td>
</tr>
<tr>
<td>active_usernames?</td>
<td>Array of String</td>
<td>If non-empty, the list of all <a href="https://telegram.org/blog/topics-in-groups-collectible-usernames#collectible-usernames">active chat usernames</a>; for private chats, supergroups and channels</td>
</tr>
<tr>
<td>birthdate?</td>
<td><a href="#birthdate">Birthdate</a></td>
<td>For private chats, the date of birth of the user</td>
</tr>
<tr>
<td>business_intro?</td>
<td><a href="#businessintro">BusinessIntro</a></td>
<td>For private chats with business accounts, the intro of the business</td>
</tr>
<tr>
<td>business_location?</td>
<td><a href="#businesslocation">BusinessLocation</a></td>
<td>For private chats with business accounts, the location of the business</td>
</tr>
<tr>
<td>business_opening_hours?</td>
<td><a href="#businessopeninghours">BusinessOpeningHours</a></td>
<td>For private chats with business accounts, the opening hours of the business</td>
</tr>
<tr>
<td>personal_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>For private chats, the personal channel of the user</td>
</tr>
<tr>
<td>parent_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>Information about the corresponding channel chat; for direct messages chats only</td>
</tr>
<tr>
<td>available_reactions?</td>
<td>Array of <a href="#reactiontype">ReactionType</a></td>
<td>List of available reactions allowed in the chat. If omitted, then all <a href="#reactiontypeemoji">emoji reactions</a> are allowed.</td>
</tr>
<tr>
<td>background_custom_emoji_id?</td>
<td>String</td>
<td>Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background</td>
</tr>
<tr>
<td>profile_accent_color_id?</td>
<td>Integer</td>
<td>Identifier of the accent color for the chat&#39;s profile background. See <a href="#profile-accent-colors">profile accent colors</a> for more details.</td>
</tr>
<tr>
<td>profile_background_custom_emoji_id?</td>
<td>String</td>
<td>Custom emoji identifier of the emoji chosen by the chat for its profile background</td>
</tr>
<tr>
<td>emoji_status_custom_emoji_id?</td>
<td>String</td>
<td>Custom emoji identifier of the emoji status of the chat or the other party in a private chat</td>
</tr>
<tr>
<td>emoji_status_expiration_date?</td>
<td>Integer</td>
<td>Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any</td>
</tr>
<tr>
<td>bio?</td>
<td>String</td>
<td>Bio of the other party in a private chat</td>
</tr>
<tr>
<td>has_private_forwards?</td>
<td>True</td>
<td>_True_, if privacy settings of the other party in the private chat allows to use `tg://user?id=&lt;user_id&gt;` links only in chats with the user</td>
</tr>
<tr>
<td>has_restricted_voice_and_video_messages?</td>
<td>True</td>
<td>_True_, if the privacy settings of the other party restrict sending voice and video note messages in the private chat</td>
</tr>
<tr>
<td>join_to_send_messages?</td>
<td>True</td>
<td>_True_, if users need to join the supergroup before they can send messages</td>
</tr>
<tr>
<td>join_by_request?</td>
<td>True</td>
<td>_True_, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Description, for groups, supergroups and channel chats</td>
</tr>
<tr>
<td>invite_link?</td>
<td>String</td>
<td>Primary invite link, for groups, supergroups and channel chats</td>
</tr>
<tr>
<td>pinned_message?</td>
<td><a href="#message">Message</a></td>
<td>The most recent pinned message (by sending date)</td>
</tr>
<tr>
<td>permissions?</td>
<td><a href="#chatpermissions">ChatPermissions</a></td>
<td>Default chat member permissions, for groups and supergroups</td>
</tr>
<tr>
<td>accepted_gift_types</td>
<td><a href="#acceptedgifttypes">AcceptedGiftTypes</a></td>
<td>Information about types of gifts that are accepted by the chat or by the corresponding user for private chats</td>
</tr>
<tr>
<td>can_send_paid_media?</td>
<td>True</td>
<td>_True_, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats.</td>
</tr>
<tr>
<td>slow_mode_delay?</td>
<td>Integer</td>
<td>For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds</td>
</tr>
<tr>
<td>unrestrict_boost_count?</td>
<td>Integer</td>
<td>For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions</td>
</tr>
<tr>
<td>message_auto_delete_time?</td>
<td>Integer</td>
<td>The time after which all messages sent to the chat will be automatically deleted; in seconds</td>
</tr>
<tr>
<td>has_aggressive_anti_spam_enabled?</td>
<td>True</td>
<td>_True_, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators.</td>
</tr>
<tr>
<td>has_hidden_members?</td>
<td>True</td>
<td>_True_, if non-administrators can only get the list of bots and administrators in the chat</td>
</tr>
<tr>
<td>has_protected_content?</td>
<td>True</td>
<td>_True_, if messages from the chat can&#39;t be forwarded to other chats</td>
</tr>
<tr>
<td>has_visible_history?</td>
<td>True</td>
<td>_True_, if new chat members will have access to old messages; available only to chat administrators</td>
</tr>
<tr>
<td>sticker_set_name?</td>
<td>String</td>
<td>For supergroups, name of the group sticker set</td>
</tr>
<tr>
<td>can_set_sticker_set?</td>
<td>True</td>
<td>_True_, if the bot can change the group sticker set</td>
</tr>
<tr>
<td>custom_emoji_sticker_set_name?</td>
<td>String</td>
<td>For supergroups, the name of the group&#39;s custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group.</td>
</tr>
<tr>
<td>linked_chat_id?</td>
<td>Integer</td>
<td>Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>location?</td>
<td><a href="#chatlocation">ChatLocation</a></td>
<td>For supergroups, the location to which the supergroup is connected</td>
</tr>
}
/**
 * <p>This object represents a message.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#message}
 */
export interface Message {
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique message identifier inside this chat. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier of a message thread to which the message belongs; for supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic?</td>
<td><a href="#directmessagestopic">DirectMessagesTopic</a></td>
<td>Information about the direct messages chat topic that contains the message</td>
</tr>
<tr>
<td>from?</td>
<td><a href="#user">User</a></td>
<td>Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats</td>
</tr>
<tr>
<td>sender_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel&#39;s discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field _from_ contains a fake sender user in non-channel chats.</td>
</tr>
<tr>
<td>sender_boost_count?</td>
<td>Integer</td>
<td>If the sender of the message boosted the chat, the number of boosts added by the user</td>
</tr>
<tr>
<td>sender_business_bot?</td>
<td><a href="#user">User</a></td>
<td>The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account.</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the message was sent in Unix time. It is always a positive number, representing a valid date.</td>
</tr>
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier.</td>
</tr>
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat the message belongs to</td>
</tr>
<tr>
<td>forward_origin?</td>
<td><a href="#messageorigin">MessageOrigin</a></td>
<td>Information about the original message for forwarded messages</td>
</tr>
<tr>
<td>is_topic_message?</td>
<td>True</td>
<td>_True_, if the message is sent to a forum topic</td>
</tr>
<tr>
<td>is_automatic_forward?</td>
<td>True</td>
<td>_True_, if the message is a channel post that was automatically forwarded to the connected discussion group</td>
</tr>
<tr>
<td>reply_to_message?</td>
<td><a href="#message">Message</a></td>
<td>For replies in the same chat and message thread, the original message. Note that the <a href="#message">Message</a> object in this field will not contain further _reply_to_message_ fields even if it itself is a reply.</td>
</tr>
<tr>
<td>external_reply?</td>
<td><a href="#externalreplyinfo">ExternalReplyInfo</a></td>
<td>Information about the message that is being replied to, which may come from another chat or forum topic</td>
</tr>
<tr>
<td>quote?</td>
<td><a href="#textquote">TextQuote</a></td>
<td>For replies that quote part of the original message, the quoted part of the message</td>
</tr>
<tr>
<td>reply_to_story?</td>
<td><a href="#story">Story</a></td>
<td>For replies to a story, the original story</td>
</tr>
<tr>
<td>reply_to_checklist_task_id?</td>
<td>Integer</td>
<td>Identifier of the specific checklist task that is being replied to</td>
</tr>
<tr>
<td>via_bot?</td>
<td><a href="#user">User</a></td>
<td>Bot through which the message was sent</td>
</tr>
<tr>
<td>edit_date?</td>
<td>Integer</td>
<td>Date the message was last edited in Unix time</td>
</tr>
<tr>
<td>has_protected_content?</td>
<td>True</td>
<td>_True_, if the message can&#39;t be forwarded</td>
</tr>
<tr>
<td>is_from_offline?</td>
<td>True</td>
<td>_True_, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message</td>
</tr>
<tr>
<td>is_paid_post?</td>
<td>True</td>
<td>_True_, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can&#39;t be edited.</td>
</tr>
<tr>
<td>media_group_id?</td>
<td>String</td>
<td>The unique identifier of a media message group this message belongs to</td>
</tr>
<tr>
<td>author_signature?</td>
<td>String</td>
<td>Signature of the post author for messages in channels, or the custom title of an anonymous group administrator</td>
</tr>
<tr>
<td>paid_star_count?</td>
<td>Integer</td>
<td>The number of Telegram Stars that were paid by the sender of the message to send it</td>
</tr>
<tr>
<td>text?</td>
<td>String</td>
<td>For text messages, the actual UTF-8 text of the message</td>
</tr>
<tr>
<td>entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text</td>
</tr>
<tr>
<td>link_preview_options?</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Options used for link preview generation for the message, if it is a text message and link preview options were changed</td>
</tr>
<tr>
<td>suggested_post_info?</td>
<td><a href="#suggestedpostinfo">SuggestedPostInfo</a></td>
<td>Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can&#39;t be edited.</td>
</tr>
<tr>
<td>effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect added to the message</td>
</tr>
<tr>
<td>animation?</td>
<td><a href="#animation">Animation</a></td>
<td>Message is an animation, information about the animation. For backward compatibility, when this field is set, the _document_ field will also be set</td>
</tr>
<tr>
<td>audio?</td>
<td><a href="#audio">Audio</a></td>
<td>Message is an audio file, information about the file</td>
</tr>
<tr>
<td>document?</td>
<td><a href="#document">Document</a></td>
<td>Message is a general file, information about the file</td>
</tr>
<tr>
<td>paid_media?</td>
<td><a href="#paidmediainfo">PaidMediaInfo</a></td>
<td>Message contains paid media; information about the paid media</td>
</tr>
<tr>
<td>photo?</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Message is a photo, available sizes of the photo</td>
</tr>
<tr>
<td>sticker?</td>
<td><a href="#sticker">Sticker</a></td>
<td>Message is a sticker, information about the sticker</td>
</tr>
<tr>
<td>story?</td>
<td><a href="#story">Story</a></td>
<td>Message is a forwarded story</td>
</tr>
<tr>
<td>video?</td>
<td><a href="#video">Video</a></td>
<td>Message is a video, information about the video</td>
</tr>
<tr>
<td>video_note?</td>
<td><a href="#videonote">VideoNote</a></td>
<td>Message is a <a href="https://telegram.org/blog/video-messages-and-telescope">video note</a>, information about the video message</td>
</tr>
<tr>
<td>voice?</td>
<td><a href="#voice">Voice</a></td>
<td>Message is a voice message, information about the file</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption for the animation, audio, document, paid media, photo, video or voice</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>True</td>
<td>_True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_media_spoiler?</td>
<td>True</td>
<td>_True_, if the message media is covered by a spoiler animation</td>
</tr>
<tr>
<td>checklist?</td>
<td><a href="#checklist">Checklist</a></td>
<td>Message is a checklist</td>
</tr>
<tr>
<td>contact?</td>
<td><a href="#contact">Contact</a></td>
<td>Message is a shared contact, information about the contact</td>
</tr>
<tr>
<td>dice?</td>
<td><a href="#dice">Dice</a></td>
<td>Message is a dice with random value</td>
</tr>
<tr>
<td>game?</td>
<td><a href="#game">Game</a></td>
<td>Message is a game, information about the game. <a href="#games">More about games »</a></td>
</tr>
<tr>
<td>poll?</td>
<td><a href="#poll">Poll</a></td>
<td>Message is a native poll, information about the poll</td>
</tr>
<tr>
<td>venue?</td>
<td><a href="#venue">Venue</a></td>
<td>Message is a venue, information about the venue. For backward compatibility, when this field is set, the _location_ field will also be set</td>
</tr>
<tr>
<td>location?</td>
<td><a href="#location">Location</a></td>
<td>Message is a shared location, information about the location</td>
</tr>
<tr>
<td>new_chat_members?</td>
<td>Array of <a href="#user">User</a></td>
<td>New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)</td>
</tr>
<tr>
<td>left_chat_member?</td>
<td><a href="#user">User</a></td>
<td>A member was removed from the group, information about them (this member may be the bot itself)</td>
</tr>
<tr>
<td>new_chat_title?</td>
<td>String</td>
<td>A chat title was changed to this value</td>
</tr>
<tr>
<td>new_chat_photo?</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>A chat photo was change to this value</td>
</tr>
<tr>
<td>delete_chat_photo?</td>
<td>True</td>
<td>Service message: the chat photo was deleted</td>
</tr>
<tr>
<td>group_chat_created?</td>
<td>True</td>
<td>Service message: the group has been created</td>
</tr>
<tr>
<td>supergroup_chat_created?</td>
<td>True</td>
<td>Service message: the supergroup has been created. This field can&#39;t be received in a message coming through updates, because bot can&#39;t be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.</td>
</tr>
<tr>
<td>channel_chat_created?</td>
<td>True</td>
<td>Service message: the channel has been created. This field can&#39;t be received in a message coming through updates, because bot can&#39;t be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.</td>
</tr>
<tr>
<td>message_auto_delete_timer_changed?</td>
<td><a href="#messageautodeletetimerchanged">MessageAutoDeleteTimerChanged</a></td>
<td>Service message: auto-delete timer settings changed in the chat</td>
</tr>
<tr>
<td>migrate_to_chat_id?</td>
<td>Integer</td>
<td>The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>migrate_from_chat_id?</td>
<td>Integer</td>
<td>The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>pinned_message?</td>
<td><a href="#maybeinaccessiblemessage">MaybeInaccessibleMessage</a></td>
<td>Specified message was pinned. Note that the <a href="#message">Message</a> object in this field will not contain further _reply_to_message_ fields even if it itself is a reply.</td>
</tr>
<tr>
<td>invoice?</td>
<td><a href="#invoice">Invoice</a></td>
<td>Message is an invoice for a <a href="#payments">payment</a>, information about the invoice. <a href="#payments">More about payments »</a></td>
</tr>
<tr>
<td>successful_payment?</td>
<td><a href="#successfulpayment">SuccessfulPayment</a></td>
<td>Message is a service message about a successful payment, information about the payment. <a href="#payments">More about payments »</a></td>
</tr>
<tr>
<td>refunded_payment?</td>
<td><a href="#refundedpayment">RefundedPayment</a></td>
<td>Message is a service message about a refunded payment, information about the payment. <a href="#payments">More about payments »</a></td>
</tr>
<tr>
<td>users_shared?</td>
<td><a href="#usersshared">UsersShared</a></td>
<td>Service message: users were shared with the bot</td>
</tr>
<tr>
<td>chat_shared?</td>
<td><a href="#chatshared">ChatShared</a></td>
<td>Service message: a chat was shared with the bot</td>
</tr>
<tr>
<td>gift?</td>
<td><a href="#giftinfo">GiftInfo</a></td>
<td>Service message: a regular gift was sent or received</td>
</tr>
<tr>
<td>unique_gift?</td>
<td><a href="#uniquegiftinfo">UniqueGiftInfo</a></td>
<td>Service message: a unique gift was sent or received</td>
</tr>
<tr>
<td>connected_website?</td>
<td>String</td>
<td>The domain name of the website on which the user has logged in. <a href="/widgets/login">More about Telegram Login »</a></td>
</tr>
<tr>
<td>write_access_allowed?</td>
<td><a href="#writeaccessallowed">WriteAccessAllowed</a></td>
<td>Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method <a href="/bots/webapps#initializing-mini-apps">requestWriteAccess</a></td>
</tr>
<tr>
<td>passport_data?</td>
<td><a href="#passportdata">PassportData</a></td>
<td>Telegram Passport data</td>
</tr>
<tr>
<td>proximity_alert_triggered?</td>
<td><a href="#proximityalerttriggered">ProximityAlertTriggered</a></td>
<td>Service message. A user in the chat triggered another user&#39;s proximity alert while sharing Live Location.</td>
</tr>
<tr>
<td>boost_added?</td>
<td><a href="#chatboostadded">ChatBoostAdded</a></td>
<td>Service message: user boosted the chat</td>
</tr>
<tr>
<td>chat_background_set?</td>
<td><a href="#chatbackground">ChatBackground</a></td>
<td>Service message: chat background set</td>
</tr>
<tr>
<td>checklist_tasks_done?</td>
<td><a href="#checklisttasksdone">ChecklistTasksDone</a></td>
<td>Service message: some tasks in a checklist were marked as done or not done</td>
</tr>
<tr>
<td>checklist_tasks_added?</td>
<td><a href="#checklisttasksadded">ChecklistTasksAdded</a></td>
<td>Service message: tasks were added to a checklist</td>
</tr>
<tr>
<td>direct_message_price_changed?</td>
<td><a href="#directmessagepricechanged">DirectMessagePriceChanged</a></td>
<td>Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed</td>
</tr>
<tr>
<td>forum_topic_created?</td>
<td><a href="#forumtopiccreated">ForumTopicCreated</a></td>
<td>Service message: forum topic created</td>
</tr>
<tr>
<td>forum_topic_edited?</td>
<td><a href="#forumtopicedited">ForumTopicEdited</a></td>
<td>Service message: forum topic edited</td>
</tr>
<tr>
<td>forum_topic_closed?</td>
<td><a href="#forumtopicclosed">ForumTopicClosed</a></td>
<td>Service message: forum topic closed</td>
</tr>
<tr>
<td>forum_topic_reopened?</td>
<td><a href="#forumtopicreopened">ForumTopicReopened</a></td>
<td>Service message: forum topic reopened</td>
</tr>
<tr>
<td>general_forum_topic_hidden?</td>
<td><a href="#generalforumtopichidden">GeneralForumTopicHidden</a></td>
<td>Service message: the &#39;General&#39; forum topic hidden</td>
</tr>
<tr>
<td>general_forum_topic_unhidden?</td>
<td><a href="#generalforumtopicunhidden">GeneralForumTopicUnhidden</a></td>
<td>Service message: the &#39;General&#39; forum topic unhidden</td>
</tr>
<tr>
<td>giveaway_created?</td>
<td><a href="#giveawaycreated">GiveawayCreated</a></td>
<td>Service message: a scheduled giveaway was created</td>
</tr>
<tr>
<td>giveaway?</td>
<td><a href="#giveaway">Giveaway</a></td>
<td>The message is a scheduled giveaway message</td>
</tr>
<tr>
<td>giveaway_winners?</td>
<td><a href="#giveawaywinners">GiveawayWinners</a></td>
<td>A giveaway with public winners was completed</td>
</tr>
<tr>
<td>giveaway_completed?</td>
<td><a href="#giveawaycompleted">GiveawayCompleted</a></td>
<td>Service message: a giveaway without public winners was completed</td>
</tr>
<tr>
<td>paid_message_price_changed?</td>
<td><a href="#paidmessagepricechanged">PaidMessagePriceChanged</a></td>
<td>Service message: the price for paid messages has changed in the chat</td>
</tr>
<tr>
<td>suggested_post_approved?</td>
<td><a href="#suggestedpostapproved">SuggestedPostApproved</a></td>
<td>Service message: a suggested post was approved</td>
</tr>
<tr>
<td>suggested_post_approval_failed?</td>
<td><a href="#suggestedpostapprovalfailed">SuggestedPostApprovalFailed</a></td>
<td>Service message: approval of a suggested post has failed</td>
</tr>
<tr>
<td>suggested_post_declined?</td>
<td><a href="#suggestedpostdeclined">SuggestedPostDeclined</a></td>
<td>Service message: a suggested post was declined</td>
</tr>
<tr>
<td>suggested_post_paid?</td>
<td><a href="#suggestedpostpaid">SuggestedPostPaid</a></td>
<td>Service message: payment for a suggested post was received</td>
</tr>
<tr>
<td>suggested_post_refunded?</td>
<td><a href="#suggestedpostrefunded">SuggestedPostRefunded</a></td>
<td>Service message: payment for a suggested post was refunded</td>
</tr>
<tr>
<td>video_chat_scheduled?</td>
<td><a href="#videochatscheduled">VideoChatScheduled</a></td>
<td>Service message: video chat scheduled</td>
</tr>
<tr>
<td>video_chat_started?</td>
<td><a href="#videochatstarted">VideoChatStarted</a></td>
<td>Service message: video chat started</td>
</tr>
<tr>
<td>video_chat_ended?</td>
<td><a href="#videochatended">VideoChatEnded</a></td>
<td>Service message: video chat ended</td>
</tr>
<tr>
<td>video_chat_participants_invited?</td>
<td><a href="#videochatparticipantsinvited">VideoChatParticipantsInvited</a></td>
<td>Service message: new participants invited to a video chat</td>
</tr>
<tr>
<td>web_app_data?</td>
<td><a href="#webappdata">WebAppData</a></td>
<td>Service message: data sent by a Web App</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Inline keyboard attached to the message. `login_url` buttons are represented as ordinary `url` buttons.</td>
</tr>
}
/**
  * <p>This object represents a unique message identifier.</p>

  * @see {@link https://core.telegram.org/bots/api#messageid}
  */
export interface MessageId {
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent</td>
</tr>
}
/**
  * <p>This object describes a message that was deleted or is otherwise inaccessible to the bot.</p>

  * @see {@link https://core.telegram.org/bots/api#inaccessiblemessage}
  */
export interface InaccessibleMessage {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat the message belonged to</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique message identifier inside the chat</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Always 0. The field can be used to differentiate regular and inaccessible messages.</td>
</tr>
}
/**
 * <p>This object describes a message that can be inaccessible to the bot. It can be one of</p>
 * - Message
 * - InaccessibleMessage
 *
 * @see {@link https://core.telegram.org/bots/api#maybeinaccessiblemessage}
 */
export type MaybeInaccessibleMessage =
 | Message
 | InaccessibleMessage
 /**
  * <p>This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.</p>

  * @see {@link https://core.telegram.org/bots/api#messageentity}
  */
export interface MessageEntity {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the entity. Currently, can be “mention” (`@username`), “hashtag” (`#hashtag` or `#hashtag@chatusername`), “cashtag” (`$USD` or `$USD@chatusername`), “bot_command” (`/start@jobs_bot`), “url” (`https://telegram.org`), “email” (`do-not-reply@telegram.org`), “phone_number” (`+1-212-555-0123`), “bold” (**bold text**), “italic” (_italic text_), “underline” (underlined text), “strikethrough” (strikethrough text), “spoiler” (spoiler message), “blockquote” (block quotation), “expandable_blockquote” (collapsed-by-default block quotation), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users <a href="https://telegram.org/blog/edit#new-mentions">without usernames</a>), “custom_emoji” (for inline custom emoji stickers)</td>
</tr>
<tr>
<td>offset</td>
<td>Integer</td>
<td>Offset in <a href="/api/entities#entity-length">UTF-16 code units</a> to the start of the entity</td>
</tr>
<tr>
<td>length</td>
<td>Integer</td>
<td>Length of the entity in <a href="/api/entities#entity-length">UTF-16 code units</a></td>
</tr>
<tr>
<td>url?</td>
<td>String</td>
<td>For “text_link” only, URL that will be opened after user taps on the text</td>
</tr>
<tr>
<td>user?</td>
<td><a href="#user">User</a></td>
<td>For “text_mention” only, the mentioned user</td>
</tr>
<tr>
<td>language?</td>
<td>String</td>
<td>For “pre” only, the programming language of the entity text</td>
</tr>
<tr>
<td>custom_emoji_id?</td>
<td>String</td>
<td>For “custom_emoji” only, unique identifier of the custom emoji. Use <a href="#getcustomemojistickers">getCustomEmojiStickers</a> to get full information about the sticker</td>
</tr>
}
/**
 * <p>This object contains information about the quoted part of a message that is replied to by the given message.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#textquote}
 */
export interface TextQuote {
<tr>
<td>text</td>
<td>String</td>
<td>Text of the quoted part of a message that is replied to by the given message</td>
</tr>
<tr>
<td>entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in the quote. Currently, only _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom_emoji_ entities are kept in quotes.</td>
</tr>
<tr>
<td>position</td>
<td>Integer</td>
<td>Approximate quote position in the original message in UTF-16 code units as specified by the sender</td>
</tr>
<tr>
<td>is_manual?</td>
<td>True</td>
<td>_True_, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server.</td>
</tr>
}
/**
 * <p>This object contains information about a message that is being replied to, which may come from another chat or forum topic.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#externalreplyinfo}
 */
export interface ExternalReplyInfo {
<tr>
<td>origin</td>
<td><a href="#messageorigin">MessageOrigin</a></td>
<td>Origin of the message replied to by the given message</td>
</tr>
<tr>
<td>chat?</td>
<td><a href="#chat">Chat</a></td>
<td>Chat the original message belongs to. Available only if the chat is a supergroup or a channel.</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel.</td>
</tr>
<tr>
<td>link_preview_options?</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Options used for link preview generation for the original message, if it is a text message</td>
</tr>
<tr>
<td>animation?</td>
<td><a href="#animation">Animation</a></td>
<td>Message is an animation, information about the animation</td>
</tr>
<tr>
<td>audio?</td>
<td><a href="#audio">Audio</a></td>
<td>Message is an audio file, information about the file</td>
</tr>
<tr>
<td>document?</td>
<td><a href="#document">Document</a></td>
<td>Message is a general file, information about the file</td>
</tr>
<tr>
<td>paid_media?</td>
<td><a href="#paidmediainfo">PaidMediaInfo</a></td>
<td>Message contains paid media; information about the paid media</td>
</tr>
<tr>
<td>photo?</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Message is a photo, available sizes of the photo</td>
</tr>
<tr>
<td>sticker?</td>
<td><a href="#sticker">Sticker</a></td>
<td>Message is a sticker, information about the sticker</td>
</tr>
<tr>
<td>story?</td>
<td><a href="#story">Story</a></td>
<td>Message is a forwarded story</td>
</tr>
<tr>
<td>video?</td>
<td><a href="#video">Video</a></td>
<td>Message is a video, information about the video</td>
</tr>
<tr>
<td>video_note?</td>
<td><a href="#videonote">VideoNote</a></td>
<td>Message is a <a href="https://telegram.org/blog/video-messages-and-telescope">video note</a>, information about the video message</td>
</tr>
<tr>
<td>voice?</td>
<td><a href="#voice">Voice</a></td>
<td>Message is a voice message, information about the file</td>
</tr>
<tr>
<td>has_media_spoiler?</td>
<td>True</td>
<td>_True_, if the message media is covered by a spoiler animation</td>
</tr>
<tr>
<td>checklist?</td>
<td><a href="#checklist">Checklist</a></td>
<td>Message is a checklist</td>
</tr>
<tr>
<td>contact?</td>
<td><a href="#contact">Contact</a></td>
<td>Message is a shared contact, information about the contact</td>
</tr>
<tr>
<td>dice?</td>
<td><a href="#dice">Dice</a></td>
<td>Message is a dice with random value</td>
</tr>
<tr>
<td>game?</td>
<td><a href="#game">Game</a></td>
<td>Message is a game, information about the game. <a href="#games">More about games »</a></td>
</tr>
<tr>
<td>giveaway?</td>
<td><a href="#giveaway">Giveaway</a></td>
<td>Message is a scheduled giveaway, information about the giveaway</td>
</tr>
<tr>
<td>giveaway_winners?</td>
<td><a href="#giveawaywinners">GiveawayWinners</a></td>
<td>A giveaway with public winners was completed</td>
</tr>
<tr>
<td>invoice?</td>
<td><a href="#invoice">Invoice</a></td>
<td>Message is an invoice for a <a href="#payments">payment</a>, information about the invoice. <a href="#payments">More about payments »</a></td>
</tr>
<tr>
<td>location?</td>
<td><a href="#location">Location</a></td>
<td>Message is a shared location, information about the location</td>
</tr>
<tr>
<td>poll?</td>
<td><a href="#poll">Poll</a></td>
<td>Message is a native poll, information about the poll</td>
</tr>
<tr>
<td>venue?</td>
<td><a href="#venue">Venue</a></td>
<td>Message is a venue, information about the venue</td>
</tr>
}
/**
 * <p>Describes reply parameters for the message that is being sent.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#replyparameters}
 */
export interface ReplyParameters {
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Identifier of the message that will be replied to in the current chat, or in the chat _chat_id_ if it is specified</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>If the message to be replied to is from a different chat, unique identifier for the chat or username of the channel (in the format `@channelusername`). Not supported for messages sent on behalf of a business account and messages from channel direct messages chats.</td>
</tr>
<tr>
<td>allow_sending_without_reply?</td>
<td>Boolean</td>
<td>Pass _True_ if the message should be sent even if the specified message to be replied to is not found. Always _False_ for replies in another chat or forum topic. Always _True_ for messages sent on behalf of a business account.</td>
</tr>
<tr>
<td>quote?</td>
<td>String</td>
<td>Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom_emoji_ entities. The message will fail to send if the quote isn&#39;t found in the original message.</td>
</tr>
<tr>
<td>quote_parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the quote. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>quote_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the quote. It can be specified instead of _quote_parse_mode_.</td>
</tr>
<tr>
<td>quote_position?</td>
<td>Integer</td>
<td>Position of the quote in the original message in UTF-16 code units</td>
</tr>
<tr>
<td>checklist_task_id?</td>
<td>Integer</td>
<td>Identifier of the specific checklist task to be replied to</td>
</tr>
}
/**
 * <p>This object describes the origin of a message. It can be one of</p>
 * - MessageOriginUser
 * - MessageOriginHiddenUser
 * - MessageOriginChat
 * - MessageOriginChannel
 *
 * @see {@link https://core.telegram.org/bots/api#messageorigin}
 */
export type MessageOrigin =
 | MessageOriginUser
 | MessageOriginHiddenUser
 | MessageOriginChat
 | MessageOriginChannel
 /**
  * <p>The message was originally sent by a known user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#messageoriginuser}
 */
export interface MessageOriginUser {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the message origin, always “user”</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the message was sent originally in Unix time</td>
</tr>
<tr>
<td>sender_user</td>
<td><a href="#user">User</a></td>
<td>User that sent the message originally</td>
</tr>
}
/**
 * <p>The message was originally sent by an unknown user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#messageoriginhiddenuser}
 */
export interface MessageOriginHiddenUser {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the message origin, always “hidden_user”</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the message was sent originally in Unix time</td>
</tr>
<tr>
<td>sender_user_name</td>
<td>String</td>
<td>Name of the user that sent the message originally</td>
</tr>
}
/**
 * <p>The message was originally sent on behalf of a chat to a group chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#messageoriginchat}
 */
export interface MessageOriginChat {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the message origin, always “chat”</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the message was sent originally in Unix time</td>
</tr>
<tr>
<td>sender_chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat that sent the message originally</td>
</tr>
<tr>
<td>author_signature?</td>
<td>String</td>
<td>For messages originally sent by an anonymous chat administrator, original message author signature</td>
</tr>
}
/**
 * <p>The message was originally sent to a channel chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#messageoriginchannel}
 */
export interface MessageOriginChannel {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the message origin, always “channel”</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the message was sent originally in Unix time</td>
</tr>
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Channel chat to which the message was originally sent</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique message identifier inside the chat</td>
</tr>
<tr>
<td>author_signature?</td>
<td>String</td>
<td>Signature of the original post author</td>
</tr>
}
/**
 * <p>This object represents one size of a photo or a <a href="#document">file</a> / <a href="#sticker">sticker</a> thumbnail.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#photosize}
 */
export interface PhotoSize {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>width</td>
<td>Integer</td>
<td>Photo width</td>
</tr>
<tr>
<td>height</td>
<td>Integer</td>
<td>Photo height</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes</td>
</tr>
}
/**
 * <p>This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound).</p>
 *
 * @see {@link https://core.telegram.org/bots/api#animation}
 */
export interface Animation {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>width</td>
<td>Integer</td>
<td>Video width as defined by the sender</td>
</tr>
<tr>
<td>height</td>
<td>Integer</td>
<td>Video height as defined by the sender</td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Duration of the video in seconds as defined by the sender</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#photosize">PhotoSize</a></td>
<td>Animation thumbnail as defined by the sender</td>
</tr>
<tr>
<td>file_name?</td>
<td>String</td>
<td>Original animation filename as defined by the sender</td>
</tr>
<tr>
<td>mime_type?</td>
<td>String</td>
<td>MIME type of the file as defined by the sender</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.</td>
</tr>
}
/**
 * <p>This object represents an audio file to be treated as music by the Telegram clients.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#audio}
 */
export interface Audio {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Duration of the audio in seconds as defined by the sender</td>
</tr>
<tr>
<td>performer?</td>
<td>String</td>
<td>Performer of the audio as defined by the sender or by audio tags</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title of the audio as defined by the sender or by audio tags</td>
</tr>
<tr>
<td>file_name?</td>
<td>String</td>
<td>Original filename as defined by the sender</td>
</tr>
<tr>
<td>mime_type?</td>
<td>String</td>
<td>MIME type of the file as defined by the sender</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#photosize">PhotoSize</a></td>
<td>Thumbnail of the album cover to which the music file belongs</td>
</tr>
}
/**
 * <p>This object represents a general file (as opposed to <a href="#photosize">photos</a>, <a href="#voice">voice messages</a> and <a href="#audio">audio files</a>).</p>
 *
 * @see {@link https://core.telegram.org/bots/api#document}
 */
export interface Document {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#photosize">PhotoSize</a></td>
<td>Document thumbnail as defined by the sender</td>
</tr>
<tr>
<td>file_name?</td>
<td>String</td>
<td>Original filename as defined by the sender</td>
</tr>
<tr>
<td>mime_type?</td>
<td>String</td>
<td>MIME type of the file as defined by the sender</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.</td>
</tr>
}
/**
 * <p>This object represents a story.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#story}
 */
export interface Story {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat that posted the story</td>
</tr>
<tr>
<td>id</td>
<td>Integer</td>
<td>Unique identifier for the story in the chat</td>
</tr>
}
/**
 * <p>This object represents a video file.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#video}
 */
export interface Video {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>width</td>
<td>Integer</td>
<td>Video width as defined by the sender</td>
</tr>
<tr>
<td>height</td>
<td>Integer</td>
<td>Video height as defined by the sender</td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Duration of the video in seconds as defined by the sender</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#photosize">PhotoSize</a></td>
<td>Video thumbnail</td>
</tr>
<tr>
<td>cover?</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Available sizes of the cover of the video in the message</td>
</tr>
<tr>
<td>start_timestamp?</td>
<td>Integer</td>
<td>Timestamp in seconds from which the video will play in the message</td>
</tr>
<tr>
<td>file_name?</td>
<td>String</td>
<td>Original filename as defined by the sender</td>
</tr>
<tr>
<td>mime_type?</td>
<td>String</td>
<td>MIME type of the file as defined by the sender</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.</td>
</tr>
}
/**
 * <p>This object represents a <a href="https://telegram.org/blog/video-messages-and-telescope">video message</a> (available in Telegram apps as of <a href="https://telegram.org/blog/video-messages-and-telescope">v.4.0</a>).</p>
 *
 * @see {@link https://core.telegram.org/bots/api#videonote}
 */
export interface VideoNote {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>length</td>
<td>Integer</td>
<td>Video width and height (diameter of the video message) as defined by the sender</td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Duration of the video in seconds as defined by the sender</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#photosize">PhotoSize</a></td>
<td>Video thumbnail</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes</td>
</tr>
}
/**
 * <p>This object represents a voice note.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#voice}
 */
export interface Voice {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Duration of the audio in seconds as defined by the sender</td>
</tr>
<tr>
<td>mime_type?</td>
<td>String</td>
<td>MIME type of the file as defined by the sender</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.</td>
</tr>
}
/**
 * <p>Describes the paid media added to a message.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#paidmediainfo}
 */
export interface PaidMediaInfo {
<tr>
<td>star_count</td>
<td>Integer</td>
<td>The number of Telegram Stars that must be paid to buy access to the media</td>
</tr>
<tr>
<td>paid_media</td>
<td>Array of <a href="#paidmedia">PaidMedia</a></td>
<td>Information about the paid media</td>
</tr>
}
/**
 * <p>This object describes paid media. Currently, it can be one of</p>
 * - PaidMediaPreview
 * - PaidMediaPhoto
 * - PaidMediaVideo
 *
 * @see {@link https://core.telegram.org/bots/api#paidmedia}
 */
export type PaidMedia =
 | PaidMediaPreview
 | PaidMediaPhoto
 | PaidMediaVideo
 /**
  * <p>The paid media isn&#39;t available before the payment.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#paidmediapreview}
 */
export interface PaidMediaPreview {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the paid media, always “preview”</td>
</tr>
<tr>
<td>width?</td>
<td>Integer</td>
<td>Media width as defined by the sender</td>
</tr>
<tr>
<td>height?</td>
<td>Integer</td>
<td>Media height as defined by the sender</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Duration of the media in seconds as defined by the sender</td>
</tr>
}
/**
 * <p>The paid media is a photo.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#paidmediaphoto}
 */
export interface PaidMediaPhoto {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the paid media, always “photo”</td>
</tr>
<tr>
<td>photo</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>The photo</td>
</tr>
}
/**
 * <p>The paid media is a video.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#paidmediavideo}
 */
export interface PaidMediaVideo {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the paid media, always “video”</td>
</tr>
<tr>
<td>video</td>
<td><a href="#video">Video</a></td>
<td>The video</td>
</tr>
}
/**
 * <p>This object represents a phone contact.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#contact}
 */
export interface Contact {
<tr>
<td>phone_number</td>
<td>String</td>
<td>Contact&#39;s phone number</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>Contact&#39;s first name</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>Contact&#39;s last name</td>
</tr>
<tr>
<td>user_id?</td>
<td>Integer</td>
<td>Contact&#39;s user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>vcard?</td>
<td>String</td>
<td>Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a></td>
</tr>
}
/**
 * <p>This object represents an animated emoji that displays a random value.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#dice}
 */
export interface Dice {
<tr>
<td>emoji</td>
<td>String</td>
<td>Emoji on which the dice throw animation is based</td>
</tr>
<tr>
<td>value</td>
<td>Integer</td>
<td>Value of the dice, 1-6 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EAF.png" width="20" height="20" alt="🎯" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB3.png" width="20" height="20" alt="🎳" />” base emoji, 1-5 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F80.png" width="20" height="20" alt="🏀" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/E29ABD.png" width="20" height="20" alt="⚽" />” base emoji, 1-64 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB0.png" width="20" height="20" alt="🎰" />” base emoji</td>
</tr>
}
/**
 * <p>This object contains information about one answer option in a poll.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#polloption}
 */
export interface PollOption {
<tr>
<td>text</td>
<td>String</td>
<td>Option text, 1-100 characters</td>
</tr>
<tr>
<td>text_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in the option _text_. Currently, only custom emoji entities are allowed in poll option texts</td>
</tr>
<tr>
<td>voter_count</td>
<td>Integer</td>
<td>Number of users that voted for this option</td>
</tr>
}
/**
 * <p>This object contains information about one answer option in a poll to be sent.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputpolloption}
 */
export interface InputPollOption {
<tr>
<td>text</td>
<td>String</td>
<td>Option text, 1-100 characters</td>
</tr>
<tr>
<td>text_parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the text. See <a href="#formatting-options">formatting options</a> for more details. Currently, only custom emoji entities are allowed</td>
</tr>
<tr>
<td>text_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the poll option text. It can be specified instead of _text_parse_mode_</td>
</tr>
}
/**
 * <p>This object represents an answer of a user in a non-anonymous poll.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#pollanswer}
 */
export interface PollAnswer {
<tr>
<td>poll_id</td>
<td>String</td>
<td>Unique poll identifier</td>
</tr>
<tr>
<td>voter_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>The chat that changed the answer to the poll, if the voter is anonymous</td>
</tr>
<tr>
<td>user?</td>
<td><a href="#user">User</a></td>
<td>The user that changed the answer to the poll, if the voter isn&#39;t anonymous</td>
</tr>
<tr>
<td>option_ids</td>
<td>Array of Integer</td>
<td>0-based identifiers of chosen answer options. May be empty if the vote was retracted.</td>
</tr>
}
/**
 * <p>This object contains information about a poll.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#poll}
 */
export interface Poll {
<tr>
<td>id</td>
<td>String</td>
<td>Unique poll identifier</td>
</tr>
<tr>
<td>question</td>
<td>String</td>
<td>Poll question, 1-300 characters</td>
</tr>
<tr>
<td>question_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in the _question_. Currently, only custom emoji entities are allowed in poll questions</td>
</tr>
<tr>
<td>options</td>
<td>Array of <a href="#polloption">PollOption</a></td>
<td>List of poll options</td>
</tr>
<tr>
<td>total_voter_count</td>
<td>Integer</td>
<td>Total number of users that voted in the poll</td>
</tr>
<tr>
<td>is_closed</td>
<td>Boolean</td>
<td>_True_, if the poll is closed</td>
</tr>
<tr>
<td>is_anonymous</td>
<td>Boolean</td>
<td>_True_, if the poll is anonymous</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Poll type, currently can be “regular” or “quiz”</td>
</tr>
<tr>
<td>allows_multiple_answers</td>
<td>Boolean</td>
<td>_True_, if the poll allows multiple answers</td>
</tr>
<tr>
<td>correct_option_id?</td>
<td>Integer</td>
<td>0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot.</td>
</tr>
<tr>
<td>explanation?</td>
<td>String</td>
<td>Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters</td>
</tr>
<tr>
<td>explanation_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities like usernames, URLs, bot commands, etc. that appear in the _explanation_</td>
</tr>
<tr>
<td>open_period?</td>
<td>Integer</td>
<td>Amount of time in seconds the poll will be active after creation</td>
</tr>
<tr>
<td>close_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the poll will be automatically closed</td>
</tr>
}
/**
 * <p>Describes a task in a checklist.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#checklisttask}
 */
export interface ChecklistTask {
<tr>
<td>id</td>
<td>Integer</td>
<td>Unique identifier of the task</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Text of the task</td>
</tr>
<tr>
<td>text_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in the task text</td>
</tr>
<tr>
<td>completed_by_user?</td>
<td><a href="#user">User</a></td>
<td>User that completed the task; omitted if the task wasn&#39;t completed</td>
</tr>
<tr>
<td>completion_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the task was completed; 0 if the task wasn&#39;t completed</td>
</tr>
}
/**
 * <p>Describes a checklist.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#checklist}
 */
export interface Checklist {
<tr>
<td>title</td>
<td>String</td>
<td>Title of the checklist</td>
</tr>
<tr>
<td>title_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in the checklist title</td>
</tr>
<tr>
<td>tasks</td>
<td>Array of <a href="#checklisttask">ChecklistTask</a></td>
<td>List of tasks in the checklist</td>
</tr>
<tr>
<td>others_can_add_tasks?</td>
<td>True</td>
<td>_True_, if users other than the creator of the list can add tasks to the list</td>
</tr>
<tr>
<td>others_can_mark_tasks_as_done?</td>
<td>True</td>
<td>_True_, if users other than the creator of the list can mark tasks as done or not done</td>
</tr>
}
/**
 * <p>Describes a task to add to a checklist.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputchecklisttask}
 */
export interface InputChecklistTask {
<tr>
<td>id</td>
<td>Integer</td>
<td>Unique identifier of the task; must be positive and unique among all task identifiers currently present in the checklist</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Text of the task; 1-100 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional. Mode for parsing entities in the text. See <a href="https://core.telegram.org/bots/api#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>text_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the text, which can be specified instead of parse_mode. Currently, only _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom_emoji_ entities are allowed.</td>
</tr>
}
/**
 * <p>Describes a checklist to create.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputchecklist}
 */
export interface InputChecklist {
<tr>
<td>title</td>
<td>String</td>
<td>Title of the checklist; 1-255 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional. Mode for parsing entities in the title. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>title_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the title, which can be specified instead of parse_mode. Currently, only _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom_emoji_ entities are allowed.</td>
</tr>
<tr>
<td>tasks</td>
<td>Array of <a href="#inputchecklisttask">InputChecklistTask</a></td>
<td>List of 1-30 tasks in the checklist</td>
</tr>
<tr>
<td>others_can_add_tasks?</td>
<td>Boolean</td>
<td>Pass _True_ if other users can add tasks to the checklist</td>
</tr>
<tr>
<td>others_can_mark_tasks_as_done?</td>
<td>Boolean</td>
<td>Pass _True_ if other users can mark tasks as done or not done in the checklist</td>
</tr>
}
/**
 * <p>Describes a service message about checklist tasks marked as done or not done.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#checklisttasksdone}
 */
export interface ChecklistTasksDone {
<tr>
<td>checklist_message?</td>
<td><a href="#message">Message</a></td>
<td>Message containing the checklist whose tasks were marked as done or not done. Note that the <a href="#message">Message</a> object in this field will not contain the _reply_to_message_ field even if it itself is a reply.</td>
</tr>
<tr>
<td>marked_as_done_task_ids?</td>
<td>Array of Integer</td>
<td>Identifiers of the tasks that were marked as done</td>
</tr>
<tr>
<td>marked_as_not_done_task_ids?</td>
<td>Array of Integer</td>
<td>Identifiers of the tasks that were marked as not done</td>
</tr>
}
/**
 * <p>Describes a service message about tasks added to a checklist.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#checklisttasksadded}
 */
export interface ChecklistTasksAdded {
<tr>
<td>checklist_message?</td>
<td><a href="#message">Message</a></td>
<td>Message containing the checklist to which the tasks were added. Note that the <a href="#message">Message</a> object in this field will not contain the _reply_to_message_ field even if it itself is a reply.</td>
</tr>
<tr>
<td>tasks</td>
<td>Array of <a href="#checklisttask">ChecklistTask</a></td>
<td>List of tasks added to the checklist</td>
</tr>
}
/**
 * <p>This object represents a point on the map.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#location}
 */
export interface Location {
<tr>
<td>latitude</td>
<td>Float</td>
<td>Latitude as defined by the sender</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Longitude as defined by the sender</td>
</tr>
<tr>
<td>horizontal_accuracy?</td>
<td>Float</td>
<td>The radius of uncertainty for the location, measured in meters; 0-1500</td>
</tr>
<tr>
<td>live_period?</td>
<td>Integer</td>
<td>Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.</td>
</tr>
<tr>
<td>heading?</td>
<td>Integer</td>
<td>The direction in which user is moving, in degrees; 1-360. For active live locations only.</td>
</tr>
<tr>
<td>proximity_alert_radius?</td>
<td>Integer</td>
<td>The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.</td>
</tr>
}
/**
 * <p>This object represents a venue.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#venue}
 */
export interface Venue {
<tr>
<td>location</td>
<td><a href="#location">Location</a></td>
<td>Venue location. Can&#39;t be a live location</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Name of the venue</td>
</tr>
<tr>
<td>address</td>
<td>String</td>
<td>Address of the venue</td>
</tr>
<tr>
<td>foursquare_id?</td>
<td>String</td>
<td>Foursquare identifier of the venue</td>
</tr>
<tr>
<td>foursquare_type?</td>
<td>String</td>
<td>Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)</td>
</tr>
<tr>
<td>google_place_id?</td>
<td>String</td>
<td>Google Places identifier of the venue</td>
</tr>
<tr>
<td>google_place_type?</td>
<td>String</td>
<td>Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)</td>
</tr>
}
/**
 * <p>Describes data sent from a <a href="/bots/webapps">Web App</a> to the bot.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#webappdata}
 */
export interface WebAppData {
<tr>
<td>data</td>
<td>String</td>
<td>The data. Be aware that a bad client can send arbitrary data in this field.</td>
</tr>
<tr>
<td>button_text</td>
<td>String</td>
<td>Text of the _web_app_ keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field.</td>
</tr>
}
/**
 * <p>This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#proximityalerttriggered}
 */
export interface ProximityAlertTriggered {
<tr>
<td>traveler</td>
<td><a href="#user">User</a></td>
<td>User that triggered the alert</td>
</tr>
<tr>
<td>watcher</td>
<td><a href="#user">User</a></td>
<td>User that set the alert</td>
</tr>
<tr>
<td>distance</td>
<td>Integer</td>
<td>The distance between the users</td>
</tr>
}
/**
 * <p>This object represents a service message about a change in auto-delete timer settings.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#messageautodeletetimerchanged}
 */
export interface MessageAutoDeleteTimerChanged {
<tr>
<td>message_auto_delete_time</td>
<td>Integer</td>
<td>New auto-delete time for messages in the chat; in seconds</td>
</tr>
}
/**
 * <p>This object represents a service message about a user boosting a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatboostadded}
 */
export interface ChatBoostAdded {
<tr>
<td>boost_count</td>
<td>Integer</td>
<td>Number of boosts added by the user</td>
</tr>
}
/**
 * <p>This object describes the way a background is filled based on the selected colors. Currently, it can be one of</p>
 * - BackgroundFillSolid
 * - BackgroundFillGradient
 * - BackgroundFillFreeformGradient
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundfill}
 */
export type BackgroundFill =
 | BackgroundFillSolid
 | BackgroundFillGradient
 | BackgroundFillFreeformGradient
 /**
  * <p>The background is filled using the selected color.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundfillsolid}
 */
export interface BackgroundFillSolid {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the background fill, always “solid”</td>
</tr>
<tr>
<td>color</td>
<td>Integer</td>
<td>The color of the background fill in the RGB24 format</td>
</tr>
}
/**
 * <p>The background is a gradient fill.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundfillgradient}
 */
export interface BackgroundFillGradient {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the background fill, always “gradient”</td>
</tr>
<tr>
<td>top_color</td>
<td>Integer</td>
<td>Top color of the gradient in the RGB24 format</td>
</tr>
<tr>
<td>bottom_color</td>
<td>Integer</td>
<td>Bottom color of the gradient in the RGB24 format</td>
</tr>
<tr>
<td>rotation_angle</td>
<td>Integer</td>
<td>Clockwise rotation angle of the background fill in degrees; 0-359</td>
</tr>
}
/**
 * <p>The background is a freeform gradient that rotates after every message in the chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundfillfreeformgradient}
 */
export interface BackgroundFillFreeformGradient {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the background fill, always “freeform_gradient”</td>
</tr>
<tr>
<td>colors</td>
<td>Array of Integer</td>
<td>A list of the 3 or 4 base colors that are used to generate the freeform gradient in the RGB24 format</td>
</tr>
}
/**
 * <p>This object describes the type of a background. Currently, it can be one of</p>
 * - BackgroundTypeFill
 * - BackgroundTypeWallpaper
 * - BackgroundTypePattern
 * - BackgroundTypeChatTheme
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundtype}
 */
export type BackgroundType =
 | BackgroundTypeFill
 | BackgroundTypeWallpaper
 | BackgroundTypePattern
 | BackgroundTypeChatTheme
 /**
  * <p>The background is automatically filled based on the selected colors.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundtypefill}
 */
export interface BackgroundTypeFill {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the background, always “fill”</td>
</tr>
<tr>
<td>fill</td>
<td><a href="#backgroundfill">BackgroundFill</a></td>
<td>The background fill</td>
</tr>
<tr>
<td>dark_theme_dimming</td>
<td>Integer</td>
<td>Dimming of the background in dark themes, as a percentage; 0-100</td>
</tr>
}
/**
 * <p>The background is a wallpaper in the JPEG format.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundtypewallpaper}
 */
export interface BackgroundTypeWallpaper {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the background, always “wallpaper”</td>
</tr>
<tr>
<td>document</td>
<td><a href="#document">Document</a></td>
<td>Document with the wallpaper</td>
</tr>
<tr>
<td>dark_theme_dimming</td>
<td>Integer</td>
<td>Dimming of the background in dark themes, as a percentage; 0-100</td>
</tr>
<tr>
<td>is_blurred?</td>
<td>True</td>
<td>_True_, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12</td>
</tr>
<tr>
<td>is_moving?</td>
<td>True</td>
<td>_True_, if the background moves slightly when the device is tilted</td>
</tr>
}
/**
 * <p>The background is a .PNG or .TGV (gzipped subset of SVG with MIME type “application/x-tgwallpattern”) pattern to be combined with the background fill chosen by the user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundtypepattern}
 */
export interface BackgroundTypePattern {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the background, always “pattern”</td>
</tr>
<tr>
<td>document</td>
<td><a href="#document">Document</a></td>
<td>Document with the pattern</td>
</tr>
<tr>
<td>fill</td>
<td><a href="#backgroundfill">BackgroundFill</a></td>
<td>The background fill that is combined with the pattern</td>
</tr>
<tr>
<td>intensity</td>
<td>Integer</td>
<td>Intensity of the pattern when it is shown above the filled background; 0-100</td>
</tr>
<tr>
<td>is_inverted?</td>
<td>True</td>
<td>_True_, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only</td>
</tr>
<tr>
<td>is_moving?</td>
<td>True</td>
<td>_True_, if the background moves slightly when the device is tilted</td>
</tr>
}
/**
 * <p>The background is taken directly from a built-in chat theme.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#backgroundtypechattheme}
 */
export interface BackgroundTypeChatTheme {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the background, always “chat_theme”</td>
</tr>
<tr>
<td>theme_name</td>
<td>String</td>
<td>Name of the chat theme, which is usually an emoji</td>
</tr>
}
/**
 * <p>This object represents a chat background.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatbackground}
 */
export interface ChatBackground {
<tr>
<td>type</td>
<td><a href="#backgroundtype">BackgroundType</a></td>
<td>Type of the background</td>
</tr>
}
/**
 * <p>This object represents a service message about a new forum topic created in the chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#forumtopiccreated}
 */
export interface ForumTopicCreated {
<tr>
<td>name</td>
<td>String</td>
<td>Name of the topic</td>
</tr>
<tr>
<td>icon_color</td>
<td>Integer</td>
<td>Color of the topic icon in RGB format</td>
</tr>
<tr>
<td>icon_custom_emoji_id?</td>
<td>String</td>
<td>Unique identifier of the custom emoji shown as the topic icon</td>
</tr>
}
/**
 * <p>This object represents a service message about a forum topic closed in the chat. Currently holds no information.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#forumtopicclosed}
 */
export type ForumTopicClosed = Empty;
/**
 * <p>This object represents a service message about an edited forum topic.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#forumtopicedited}
 */
export interface ForumTopicEdited {
<tr>
<td>name?</td>
<td>String</td>
<td>New name of the topic, if it was edited</td>
</tr>
<tr>
<td>icon_custom_emoji_id?</td>
<td>String</td>
<td>New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed</td>
</tr>
}
/**
 * <p>This object represents a service message about a forum topic reopened in the chat. Currently holds no information.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#forumtopicreopened}
 */
export type ForumTopicReopened = Empty;
/**
 * <p>This object represents a service message about General forum topic hidden in the chat. Currently holds no information.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#generalforumtopichidden}
 */
export type GeneralForumTopicHidden = Empty;
/**
 * <p>This object represents a service message about General forum topic unhidden in the chat. Currently holds no information.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#generalforumtopicunhidden}
 */
export type GeneralForumTopicUnhidden = Empty;
/**
 * <p>This object contains information about a user that was shared with the bot using a <a href="#keyboardbuttonrequestusers">KeyboardButtonRequestUsers</a> button.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#shareduser}
 */
export interface SharedUser {
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Identifier of the shared user. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so 64-bit integers or double-precision float types are safe for storing these identifiers. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means.</td>
</tr>
<tr>
<td>first_name?</td>
<td>String</td>
<td>First name of the user, if the name was requested by the bot</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>Last name of the user, if the name was requested by the bot</td>
</tr>
<tr>
<td>username?</td>
<td>String</td>
<td>Username of the user, if the username was requested by the bot</td>
</tr>
<tr>
<td>photo?</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Available sizes of the chat photo, if the photo was requested by the bot</td>
</tr>
}
/**
 * <p>This object contains information about the users whose identifiers were shared with the bot using a <a href="#keyboardbuttonrequestusers">KeyboardButtonRequestUsers</a> button.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#usersshared}
 */
export interface UsersShared {
<tr>
<td>request_id</td>
<td>Integer</td>
<td>Identifier of the request</td>
</tr>
<tr>
<td>users</td>
<td>Array of <a href="#shareduser">SharedUser</a></td>
<td>Information about users shared with the bot.</td>
</tr>
}
/**
 * <p>This object contains information about a chat that was shared with the bot using a <a href="#keyboardbuttonrequestchat">KeyboardButtonRequestChat</a> button.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatshared}
 */
export interface ChatShared {
<tr>
<td>request_id</td>
<td>Integer</td>
<td>Identifier of the request</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means.</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title of the chat, if the title was requested by the bot.</td>
</tr>
<tr>
<td>username?</td>
<td>String</td>
<td>Username of the chat, if the username was requested by the bot and available.</td>
</tr>
<tr>
<td>photo?</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Available sizes of the chat photo, if the photo was requested by the bot</td>
</tr>
}
/**
 * <p>This object represents a service message about a user allowing a bot to write messages after adding it to the attachment menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method <a href="/bots/webapps#initializing-mini-apps">requestWriteAccess</a>.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#writeaccessallowed}
 */
export interface WriteAccessAllowed {
<tr>
<td>from_request?</td>
<td>Boolean</td>
<td>_True_, if the access was granted after the user accepted an explicit request from a Web App sent by the method <a href="/bots/webapps#initializing-mini-apps">requestWriteAccess</a></td>
</tr>
<tr>
<td>web_app_name?</td>
<td>String</td>
<td>Name of the Web App, if the access was granted when the Web App was launched from a link</td>
</tr>
<tr>
<td>from_attachment_menu?</td>
<td>Boolean</td>
<td>_True_, if the access was granted when the bot was added to the attachment or side menu</td>
</tr>
}
/**
 * <p>This object represents a service message about a video chat scheduled in the chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#videochatscheduled}
 */
export interface VideoChatScheduled {
<tr>
<td>start_date</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator</td>
</tr>
}
/**
 * <p>This object represents a service message about a video chat started in the chat. Currently holds no information.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#videochatstarted}
 */
export type VideoChatStarted = Empty;
/**
 * <p>This object represents a service message about a video chat ended in the chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#videochatended}
 */
export interface VideoChatEnded {
<tr>
<td>duration</td>
<td>Integer</td>
<td>Video chat duration in seconds</td>
</tr>
}
/**
 * <p>This object represents a service message about new members invited to a video chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#videochatparticipantsinvited}
 */
export interface VideoChatParticipantsInvited {
<tr>
<td>users</td>
<td>Array of <a href="#user">User</a></td>
<td>New members that were invited to the video chat</td>
</tr>
}
/**
 * <p>Describes a service message about a change in the price of paid messages within a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#paidmessagepricechanged}
 */
export interface PaidMessagePriceChanged {
<tr>
<td>paid_message_star_count</td>
<td>Integer</td>
<td>The new number of Telegram Stars that must be paid by non-administrator users of the supergroup chat for each sent message</td>
</tr>
}
/**
 * <p>Describes a service message about a change in the price of direct messages sent to a channel chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#directmessagepricechanged}
 */
export interface DirectMessagePriceChanged {
<tr>
<td>are_direct_messages_enabled</td>
<td>Boolean</td>
<td>_True_, if direct messages are enabled for the channel chat; false otherwise</td>
</tr>
<tr>
<td>direct_message_star_count?</td>
<td>Integer</td>
<td>The new number of Telegram Stars that must be paid by users for each direct message sent to the channel. Does not apply to users who have been exempted by administrators. Defaults to 0.</td>
</tr>
}
/**
 * <p>Describes a service message about the approval of a suggested post.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostapproved}
 */
export interface SuggestedPostApproved {
<tr>
<td>suggested_post_message?</td>
<td><a href="#message">Message</a></td>
<td>Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the _reply_to_message_ field even if it itself is a reply.</td>
</tr>
<tr>
<td>price?</td>
<td><a href="#suggestedpostprice">SuggestedPostPrice</a></td>
<td>Amount paid for the post</td>
</tr>
<tr>
<td>send_date</td>
<td>Integer</td>
<td>Date when the post will be published</td>
</tr>
}
/**
 * <p>Describes a service message about the failed approval of a suggested post. Currently, only caused by insufficient user funds at the time of approval.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostapprovalfailed}
 */
export interface SuggestedPostApprovalFailed {
<tr>
<td>suggested_post_message?</td>
<td><a href="#message">Message</a></td>
<td>Message containing the suggested post whose approval has failed. Note that the <a href="#message">Message</a> object in this field will not contain the _reply_to_message_ field even if it itself is a reply.</td>
</tr>
<tr>
<td>price</td>
<td><a href="#suggestedpostprice">SuggestedPostPrice</a></td>
<td>Expected price of the post</td>
</tr>
}
/**
 * <p>Describes a service message about the rejection of a suggested post.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostdeclined}
 */
export interface SuggestedPostDeclined {
<tr>
<td>suggested_post_message?</td>
<td><a href="#message">Message</a></td>
<td>Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the _reply_to_message_ field even if it itself is a reply.</td>
</tr>
<tr>
<td>comment?</td>
<td>String</td>
<td>Comment with which the post was declined</td>
</tr>
}
/**
 * <p>Describes a service message about a successful payment for a suggested post.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostpaid}
 */
export interface SuggestedPostPaid {
<tr>
<td>suggested_post_message?</td>
<td><a href="#message">Message</a></td>
<td>Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the _reply_to_message_ field even if it itself is a reply.</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Currency in which the payment was made. Currently, one of “XTR” for Telegram Stars or “TON” for toncoins</td>
</tr>
<tr>
<td>amount?</td>
<td>Integer</td>
<td>The amount of the currency that was received by the channel in nanotoncoins; for payments in toncoins only</td>
</tr>
<tr>
<td>star_amount?</td>
<td><a href="#staramount">StarAmount</a></td>
<td>The amount of Telegram Stars that was received by the channel; for payments in Telegram Stars only</td>
</tr>
}
/**
 * <p>Describes a service message about a payment refund for a suggested post.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostrefunded}
 */
export interface SuggestedPostRefunded {
<tr>
<td>suggested_post_message?</td>
<td><a href="#message">Message</a></td>
<td>Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the _reply_to_message_ field even if it itself is a reply.</td>
</tr>
<tr>
<td>reason</td>
<td>String</td>
<td>Reason for the refund. Currently, one of “post_deleted” if the post was deleted within 24 hours of being posted or removed from scheduled messages without being posted, or “payment_refunded” if the payer refunded their payment.</td>
</tr>
}
/**
 * <p>This object represents a service message about the creation of a scheduled giveaway.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#giveawaycreated}
 */
export interface GiveawayCreated {
<tr>
<td>prize_star_count?</td>
<td>Integer</td>
<td>The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only</td>
</tr>
}
/**
 * <p>This object represents a message about a scheduled giveaway.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#giveaway}
 */
export interface Giveaway {
<tr>
<td>chats</td>
<td>Array of <a href="#chat">Chat</a></td>
<td>The list of chats which the user must join to participate in the giveaway</td>
</tr>
<tr>
<td>winners_selection_date</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when winners of the giveaway will be selected</td>
</tr>
<tr>
<td>winner_count</td>
<td>Integer</td>
<td>The number of users which are supposed to be selected as winners of the giveaway</td>
</tr>
<tr>
<td>only_new_members?</td>
<td>True</td>
<td>_True_, if only users who join the chats after the giveaway started should be eligible to win</td>
</tr>
<tr>
<td>has_public_winners?</td>
<td>True</td>
<td>_True_, if the list of giveaway winners will be visible to everyone</td>
</tr>
<tr>
<td>prize_description?</td>
<td>String</td>
<td>Description of additional giveaway prize</td>
</tr>
<tr>
<td>country_codes?</td>
<td>Array of String</td>
<td>A list of two-letter <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a> country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways.</td>
</tr>
<tr>
<td>prize_star_count?</td>
<td>Integer</td>
<td>The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only</td>
</tr>
<tr>
<td>premium_subscription_month_count?</td>
<td>Integer</td>
<td>The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only</td>
</tr>
}
/**
 * <p>This object represents a message about the completion of a giveaway with public winners.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#giveawaywinners}
 */
export interface GiveawayWinners {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>The chat that created the giveaway</td>
</tr>
<tr>
<td>giveaway_message_id</td>
<td>Integer</td>
<td>Identifier of the message with the giveaway in the chat</td>
</tr>
<tr>
<td>winners_selection_date</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when winners of the giveaway were selected</td>
</tr>
<tr>
<td>winner_count</td>
<td>Integer</td>
<td>Total number of winners in the giveaway</td>
</tr>
<tr>
<td>winners</td>
<td>Array of <a href="#user">User</a></td>
<td>List of up to 100 winners of the giveaway</td>
</tr>
<tr>
<td>additional_chat_count?</td>
<td>Integer</td>
<td>The number of other chats the user had to join in order to be eligible for the giveaway</td>
</tr>
<tr>
<td>prize_star_count?</td>
<td>Integer</td>
<td>The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only</td>
</tr>
<tr>
<td>premium_subscription_month_count?</td>
<td>Integer</td>
<td>The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only</td>
</tr>
<tr>
<td>unclaimed_prize_count?</td>
<td>Integer</td>
<td>Number of undistributed prizes</td>
</tr>
<tr>
<td>only_new_members?</td>
<td>True</td>
<td>_True_, if only users who had joined the chats after the giveaway started were eligible to win</td>
</tr>
<tr>
<td>was_refunded?</td>
<td>True</td>
<td>_True_, if the giveaway was canceled because the payment for it was refunded</td>
</tr>
<tr>
<td>prize_description?</td>
<td>String</td>
<td>Description of additional giveaway prize</td>
</tr>
}
/**
 * <p>This object represents a service message about the completion of a giveaway without public winners.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#giveawaycompleted}
 */
export interface GiveawayCompleted {
<tr>
<td>winner_count</td>
<td>Integer</td>
<td>Number of winners in the giveaway</td>
</tr>
<tr>
<td>unclaimed_prize_count?</td>
<td>Integer</td>
<td>Number of undistributed prizes</td>
</tr>
<tr>
<td>giveaway_message?</td>
<td><a href="#message">Message</a></td>
<td>Message with the giveaway that was completed, if it wasn&#39;t deleted</td>
</tr>
<tr>
<td>is_star_giveaway?</td>
<td>True</td>
<td>_True_, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway.</td>
</tr>
}
/**
 * <p>Describes the options used for link preview generation.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#linkpreviewoptions}
 */
export interface LinkPreviewOptions {
<tr>
<td>is_disabled?</td>
<td>Boolean</td>
<td>_True_, if the link preview is disabled</td>
</tr>
<tr>
<td>url?</td>
<td>String</td>
<td>URL to use for the link preview. If empty, then the first URL found in the message text will be used</td>
</tr>
<tr>
<td>prefer_small_media?</td>
<td>Boolean</td>
<td>_True_, if the media in the link preview is supposed to be shrunk; ignored if the URL isn&#39;t explicitly specified or media size change isn&#39;t supported for the preview</td>
</tr>
<tr>
<td>prefer_large_media?</td>
<td>Boolean</td>
<td>_True_, if the media in the link preview is supposed to be enlarged; ignored if the URL isn&#39;t explicitly specified or media size change isn&#39;t supported for the preview</td>
</tr>
<tr>
<td>show_above_text?</td>
<td>Boolean</td>
<td>_True_, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text</td>
</tr>
}
/**
 * <p>Describes the price of a suggested post.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostprice}
 */
export interface SuggestedPostPrice {
<tr>
<td>currency</td>
<td>String</td>
<td>Currency in which the post will be paid. Currently, must be one of “XTR” for Telegram Stars or “TON” for toncoins</td>
</tr>
<tr>
<td>amount</td>
<td>Integer</td>
<td>The amount of the currency that will be paid for the post in the _smallest units_ of the currency, i.e. Telegram Stars or nanotoncoins. Currently, price in Telegram Stars must be between 5 and 100000, and price in nanotoncoins must be between 10000000 and 10000000000000.</td>
</tr>
}
/**
 * <p>Contains information about a suggested post.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostinfo}
 */
export interface SuggestedPostInfo {
<tr>
<td>state</td>
<td>String</td>
<td>State of the suggested post. Currently, it can be one of “pending”, “approved”, “declined”.</td>
</tr>
<tr>
<td>price?</td>
<td><a href="#suggestedpostprice">SuggestedPostPrice</a></td>
<td>Proposed price of the post. If the field is omitted, then the post is unpaid.</td>
</tr>
<tr>
<td>send_date?</td>
<td>Integer</td>
<td>Proposed send date of the post. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user or administrator who approves it.</td>
</tr>
}
/**
 * <p>Contains parameters of a post that is being suggested by the bot.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#suggestedpostparameters}
 */
export interface SuggestedPostParameters {
<tr>
<td>price?</td>
<td><a href="#suggestedpostprice">SuggestedPostPrice</a></td>
<td>Proposed price for the post. If the field is omitted, then the post is unpaid.</td>
</tr>
<tr>
<td>send_date?</td>
<td>Integer</td>
<td>Proposed send date of the post. If specified, then the date must be between 300 second and 2678400 seconds (30 days) in the future. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user who approves it.</td>
</tr>
}
/**
 * <p>Describes a topic of a direct messages chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#directmessagestopic}
 */
export interface DirectMessagesTopic {
<tr>
<td>topic_id</td>
<td>Integer</td>
<td>Unique identifier of the topic. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>user?</td>
<td><a href="#user">User</a></td>
<td>Information about the user that created the topic. Currently, it is always present</td>
</tr>
}
/**
 * <p>This object represent a user&#39;s profile pictures.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#userprofilephotos}
 */
export interface UserProfilePhotos {
<tr>
<td>total_count</td>
<td>Integer</td>
<td>Total number of profile pictures the target user has</td>
</tr>
<tr>
<td>photos</td>
<td>Array of Array of <a href="#photosize">PhotoSize</a></td>
<td>Requested profile pictures (in up to 4 sizes each)</td>
</tr>
}
/**
 * <p>This object represents a file ready to be downloaded. The file can be downloaded via the link `https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;`. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling <a href="#getfile">getFile</a>.</p>
 * <blockquote>
 * <p>The maximum file size to download is 20 MB</p>
 * </blockquote>
 *
 * @see {@link https://core.telegram.org/bots/api#file}
 */
export interface File {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.</td>
</tr>
<tr>
<td>file_path?</td>
<td>String</td>
<td>File path. Use `https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;` to get the file.</td>
</tr>
}
/**
 * <p>Describes a <a href="/bots/webapps">Web App</a>.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#webappinfo}
 */
export interface WebAppInfo {
<tr>
<td>url</td>
<td>String</td>
<td>An HTTPS URL of a Web App to be opened with additional data as specified in <a href="/bots/webapps#initializing-mini-apps">Initializing Web Apps</a></td>
</tr>
}
/**
 * <p>This object represents a <a href="/bots/features#keyboards">custom keyboard</a> with reply options (see <a href="/bots/features#keyboards">Introduction to bots</a> for details and examples). Not supported in channels and for messages sent on behalf of a Telegram Business account.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#replykeyboardmarkup}
 */
export interface ReplyKeyboardMarkup {
<tr>
<td>keyboard</td>
<td>Array of Array of <a href="#keyboardbutton">KeyboardButton</a></td>
<td>Array of button rows, each represented by an Array of <a href="#keyboardbutton">KeyboardButton</a> objects</td>
</tr>
<tr>
<td>is_persistent?</td>
<td>Boolean</td>
<td>Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to _false_, in which case the custom keyboard can be hidden and opened with a keyboard icon.</td>
</tr>
<tr>
<td>resize_keyboard?</td>
<td>Boolean</td>
<td>Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to _false_, in which case the custom keyboard is always of the same height as the app&#39;s standard keyboard.</td>
</tr>
<tr>
<td>one_time_keyboard?</td>
<td>Boolean</td>
<td>Requests clients to hide the keyboard as soon as it&#39;s been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to _false_.</td>
</tr>
<tr>
<td>input_field_placeholder?</td>
<td>String</td>
<td>The placeholder to be shown in the input field when the keyboard is active; 1-64 characters</td>
</tr>
<tr>
<td>selective?</td>
<td>Boolean</td>
<td>Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the _text_ of the <a href="#message">Message</a> object; 2) if the bot&#39;s message is a reply to a message in the same chat and forum topic, sender of the original message.<br><br>_Example:_ A user requests to change the bot&#39;s language, bot replies to the request with a keyboard to select the new language. Other users in the group don&#39;t see the keyboard.</td>
</tr>
}
/**
 * <p>This object represents one button of the reply keyboard. At most one of the optional fields must be used to specify type of the button. For simple text buttons, _String_ can be used instead of this object to specify the button text.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#keyboardbutton}
 */
export interface KeyboardButton {
<tr>
<td>text</td>
<td>String</td>
<td>Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed</td>
</tr>
<tr>
<td>request_users</td>
<td><a href="#keyboardbuttonrequestusers">KeyboardButtonRequestUsers</a></td>
<td>_Optional._ If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a “users_shared” service message. Available in private chats only.</td>
</tr>
<tr>
<td>request_chat</td>
<td><a href="#keyboardbuttonrequestchat">KeyboardButtonRequestChat</a></td>
<td>_Optional._ If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a “chat_shared” service message. Available in private chats only.</td>
</tr>
<tr>
<td>request_contact?</td>
<td>Boolean</td>
<td>If _True_, the user&#39;s phone number will be sent as a contact when the button is pressed. Available in private chats only.</td>
</tr>
<tr>
<td>request_location?</td>
<td>Boolean</td>
<td>If _True_, the user&#39;s current location will be sent when the button is pressed. Available in private chats only.</td>
</tr>
<tr>
<td>request_poll?</td>
<td><a href="#keyboardbuttonpolltype">KeyboardButtonPollType</a></td>
<td>If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only.</td>
</tr>
<tr>
<td>web_app?</td>
<td><a href="#webappinfo">WebAppInfo</a></td>
<td>If specified, the described <a href="/bots/webapps">Web App</a> will be launched when the button is pressed. The Web App will be able to send a “web_app_data” service message. Available in private chats only.</td>
</tr>
}
<p>**Note:** _request_users_ and _request_chat_ options will only work in Telegram versions released after 3 February, 2023. Older clients will display _unsupported message_.</p>
/**
 * <p>This object defines the criteria used to request suitable users. Information about the selected users will be shared with the bot when the corresponding button is pressed. <a href="/bots/features#chat-and-user-selection">More about requesting users »</a></p>
 *
 * @see {@link https://core.telegram.org/bots/api#keyboardbuttonrequestusers}
 */
export interface KeyboardButtonRequestUsers {
<tr>
<td>request_id</td>
<td>Integer</td>
<td>Signed 32-bit identifier of the request that will be received back in the <a href="#usersshared">UsersShared</a> object. Must be unique within the message</td>
</tr>
<tr>
<td>user_is_bot?</td>
<td>Boolean</td>
<td>Pass _True_ to request bots, pass _False_ to request regular users. If not specified, no additional restrictions are applied.</td>
</tr>
<tr>
<td>user_is_premium?</td>
<td>Boolean</td>
<td>Pass _True_ to request premium users, pass _False_ to request non-premium users. If not specified, no additional restrictions are applied.</td>
</tr>
<tr>
<td>max_quantity?</td>
<td>Integer</td>
<td>The maximum number of users to be selected; 1-10. Defaults to 1.</td>
</tr>
<tr>
<td>request_name?</td>
<td>Boolean</td>
<td>Pass _True_ to request the users&#39; first and last names</td>
</tr>
<tr>
<td>request_username?</td>
<td>Boolean</td>
<td>Pass _True_ to request the users&#39; usernames</td>
</tr>
<tr>
<td>request_photo?</td>
<td>Boolean</td>
<td>Pass _True_ to request the users&#39; photos</td>
</tr>
}
/**
 * <p>This object defines the criteria used to request a suitable chat. Information about the selected chat will be shared with the bot when the corresponding button is pressed. The bot will be granted requested rights in the chat if appropriate. <a href="/bots/features#chat-and-user-selection">More about requesting chats »</a>.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#keyboardbuttonrequestchat}
 */
export interface KeyboardButtonRequestChat {
<tr>
<td>request_id</td>
<td>Integer</td>
<td>Signed 32-bit identifier of the request, which will be received back in the <a href="#chatshared">ChatShared</a> object. Must be unique within the message</td>
</tr>
<tr>
<td>chat_is_channel</td>
<td>Boolean</td>
<td>Pass _True_ to request a channel chat, pass _False_ to request a group or a supergroup chat.</td>
</tr>
<tr>
<td>chat_is_forum?</td>
<td>Boolean</td>
<td>Pass _True_ to request a forum supergroup, pass _False_ to request a non-forum chat. If not specified, no additional restrictions are applied.</td>
</tr>
<tr>
<td>chat_has_username?</td>
<td>Boolean</td>
<td>Pass _True_ to request a supergroup or a channel with a username, pass _False_ to request a chat without a username. If not specified, no additional restrictions are applied.</td>
</tr>
<tr>
<td>chat_is_created?</td>
<td>Boolean</td>
<td>Pass _True_ to request a chat owned by the user. Otherwise, no additional restrictions are applied.</td>
</tr>
<tr>
<td>user_administrator_rights?</td>
<td><a href="#chatadministratorrights">ChatAdministratorRights</a></td>
<td>A JSON-serialized object listing the required administrator rights of the user in the chat. The rights must be a superset of _bot_administrator_rights_. If not specified, no additional restrictions are applied.</td>
</tr>
<tr>
<td>bot_administrator_rights?</td>
<td><a href="#chatadministratorrights">ChatAdministratorRights</a></td>
<td>A JSON-serialized object listing the required administrator rights of the bot in the chat. The rights must be a subset of _user_administrator_rights_. If not specified, no additional restrictions are applied.</td>
</tr>
<tr>
<td>bot_is_member?</td>
<td>Boolean</td>
<td>Pass _True_ to request a chat with the bot as a member. Otherwise, no additional restrictions are applied.</td>
</tr>
<tr>
<td>request_title?</td>
<td>Boolean</td>
<td>Pass _True_ to request the chat&#39;s title</td>
</tr>
<tr>
<td>request_username?</td>
<td>Boolean</td>
<td>Pass _True_ to request the chat&#39;s username</td>
</tr>
<tr>
<td>request_photo?</td>
<td>Boolean</td>
<td>Pass _True_ to request the chat&#39;s photo</td>
</tr>
}
/**
 * <p>This object represents type of a poll, which is allowed to be created and sent when the corresponding button is pressed.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#keyboardbuttonpolltype}
 */
export interface KeyboardButtonPollType {
<tr>
<td>type?</td>
<td>String</td>
<td>If _quiz_ is passed, the user will be allowed to create only polls in the quiz mode. If _regular_ is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type.</td>
</tr>
}
/**
 * <p>Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a>). Not supported in channels and for messages sent on behalf of a Telegram Business account.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#replykeyboardremove}
 */
export interface ReplyKeyboardRemove {
<tr>
<td>remove_keyboard</td>
<td>True</td>
<td>Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use _one_time_keyboard_ in <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a>)</td>
</tr>
<tr>
<td>selective?</td>
<td>Boolean</td>
<td>Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the _text_ of the <a href="#message">Message</a> object; 2) if the bot&#39;s message is a reply to a message in the same chat and forum topic, sender of the original message.<br><br>_Example:_ A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven&#39;t voted yet.</td>
</tr>
}
/**
 * <p>This object represents an <a href="/bots/features#inline-keyboards">inline keyboard</a> that appears right next to the message it belongs to.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}
 */
export interface InlineKeyboardMarkup {
<tr>
<td>inline_keyboard</td>
<td>Array of Array of <a href="#inlinekeyboardbutton">InlineKeyboardButton</a></td>
<td>Array of button rows, each represented by an Array of <a href="#inlinekeyboardbutton">InlineKeyboardButton</a> objects</td>
</tr>
}
/**
 * <p>This object represents one button of an inline keyboard. Exactly one of the optional fields must be used to specify type of the button.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinekeyboardbutton}
 */
export interface InlineKeyboardButton {
<tr>
<td>text</td>
<td>String</td>
<td>Label text on the button</td>
</tr>
<tr>
<td>url?</td>
<td>String</td>
<td>HTTP or tg:// URL to be opened when the button is pressed. Links `tg://user?id=&lt;user_id&gt;` can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.</td>
</tr>
<tr>
<td>callback_data?</td>
<td>String</td>
<td>Data to be sent in a <a href="#callbackquery">callback query</a> to the bot when the button is pressed, 1-64 bytes</td>
</tr>
<tr>
<td>web_app?</td>
<td><a href="#webappinfo">WebAppInfo</a></td>
<td>Description of the <a href="/bots/webapps">Web App</a> that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method <a href="#answerwebappquery">answerWebAppQuery</a>. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a Telegram Business account.</td>
</tr>
<tr>
<td>login_url?</td>
<td><a href="#loginurl">LoginUrl</a></td>
<td>An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the <a href="/widgets/login">Telegram Login Widget</a>.</td>
</tr>
<tr>
<td>switch_inline_query?</td>
<td>String</td>
<td>If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot&#39;s username and the specified inline query in the input field. May be empty, in which case just the bot&#39;s username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a Telegram Business account.</td>
</tr>
<tr>
<td>switch_inline_query_current_chat?</td>
<td>String</td>
<td>If set, pressing the button will insert the bot&#39;s username and the specified inline query in the current chat&#39;s input field. May be empty, in which case only the bot&#39;s username will be inserted.<br><br>This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a Telegram Business account.</td>
</tr>
<tr>
<td>switch_inline_query_chosen_chat?</td>
<td><a href="#switchinlinequerychosenchat">SwitchInlineQueryChosenChat</a></td>
<td>If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot&#39;s username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a Telegram Business account.</td>
</tr>
<tr>
<td>copy_text?</td>
<td><a href="#copytextbutton">CopyTextButton</a></td>
<td>Description of the button that copies the specified text to the clipboard.</td>
</tr>
<tr>
<td>callback_game?</td>
<td><a href="#callbackgame">CallbackGame</a></td>
<td>Description of the game that will be launched when the user presses the button.<br><br>**NOTE:** This type of button **must** always be the first button in the first row.</td>
</tr>
<tr>
<td>pay?</td>
<td>Boolean</td>
<td>Specify _True_, to send a <a href="#payments">Pay button</a>. Substrings “<img class="emoji" src="//telegram.org/img/emoji/40/E2AD90.png" width="20" height="20" alt="⭐" />” and “XTR” in the buttons&#39;s text will be replaced with a Telegram Star icon.<br><br>**NOTE:** This type of button **must** always be the first button in the first row and can only be used in invoice messages.</td>
</tr>
}
/**
 * <p>This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the <a href="/widgets/login">Telegram Login Widget</a> when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:</p>
 * <div class="blog_image_wrap">
 *   <a href="/file/811140015/1734/8VZFkwWXalM.97872/6127fa62d8a0bf2b3c" target="_blank"><img src="/file/811140909/1631/20k1Z53eiyY.23995/c541e89b74253623d9" title="TITLE" alt="TITLE" srcset="/file/811140015/1734/8VZFkwWXalM.97872/6127fa62d8a0bf2b3c , 2x" /></a>
 * </div>
 *
 * <p>Telegram apps support these buttons as of <a href="https://telegram.org/blog/privacy-discussions-web-bots#meet-seamless-web-bots">version 5.7</a>.</p>
 * <blockquote>
 * <p>Sample bot: <a href="https://t.me/discussbot">@discussbot</a></p>
 * </blockquote>
 *
 * @see {@link https://core.telegram.org/bots/api#loginurl}
 */
export interface LoginUrl {
<tr>
<td>url</td>
<td>String</td>
<td>An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in <a href="/widgets/login#receiving-authorization-data">Receiving authorization data</a>.<br><br>**NOTE:** You **must** always check the hash of the received data to verify the authentication and the integrity of the data as described in <a href="/widgets/login#checking-authorization">Checking authorization</a>.</td>
</tr>
<tr>
<td>forward_text?</td>
<td>String</td>
<td>New text of the button in forwarded messages.</td>
</tr>
<tr>
<td>bot_username?</td>
<td>String</td>
<td>Username of a bot, which will be used for user authorization. See <a href="/widgets/login#setting-up-a-bot">Setting up a bot</a> for more details. If not specified, the current bot&#39;s username will be assumed. The _url_&#39;s domain must be the same as the domain linked with the bot. See <a href="/widgets/login#linking-your-domain-to-the-bot">Linking your domain to the bot</a> for more details.</td>
</tr>
<tr>
<td>request_write_access?</td>
<td>Boolean</td>
<td>Pass _True_ to request the permission for your bot to send messages to the user.</td>
</tr>
}
/**
 * <p>This object represents an inline button that switches the current user to inline mode in a chosen chat, with an optional default inline query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#switchinlinequerychosenchat}
 */
export interface SwitchInlineQueryChosenChat {
<tr>
<td>query?</td>
<td>String</td>
<td>The default inline query to be inserted in the input field. If left empty, only the bot&#39;s username will be inserted</td>
</tr>
<tr>
<td>allow_user_chats?</td>
<td>Boolean</td>
<td>_True_, if private chats with users can be chosen</td>
</tr>
<tr>
<td>allow_bot_chats?</td>
<td>Boolean</td>
<td>_True_, if private chats with bots can be chosen</td>
</tr>
<tr>
<td>allow_group_chats?</td>
<td>Boolean</td>
<td>_True_, if group and supergroup chats can be chosen</td>
</tr>
<tr>
<td>allow_channel_chats?</td>
<td>Boolean</td>
<td>_True_, if channel chats can be chosen</td>
</tr>
}
/**
 * <p>This object represents an inline keyboard button that copies specified text to the clipboard.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#copytextbutton}
 */
export interface CopyTextButton {
<tr>
<td>text</td>
<td>String</td>
<td>The text to be copied to the clipboard; 1-256 characters</td>
</tr>
}
/**
 * <p>This object represents an incoming callback query from a callback button in an <a href="/bots/features#inline-keyboards">inline keyboard</a>. If the button that originated the query was attached to a message sent by the bot, the field _message_ will be present. If the button was attached to a message sent via the bot (in <a href="#inline-mode">inline mode</a>), the field _inline_message_id_ will be present. Exactly one of the fields _data_ or _game_short_name_ will be present.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#callbackquery}
 */
export interface CallbackQuery {
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this query</td>
</tr>
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>Sender</td>
</tr>
<tr>
<td>message?</td>
<td><a href="#maybeinaccessiblemessage">MaybeInaccessibleMessage</a></td>
<td>Message sent by the bot with the callback button that originated the query</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Identifier of the message sent via the bot in inline mode, that originated the query.</td>
</tr>
<tr>
<td>chat_instance</td>
<td>String</td>
<td>Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in <a href="#games">games</a>.</td>
</tr>
<tr>
<td>data?</td>
<td>String</td>
<td>Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data.</td>
</tr>
<tr>
<td>game_short_name?</td>
<td>String</td>
<td>Short name of a <a href="#games">Game</a> to be returned, serves as the unique identifier for the game</td>
</tr>
}
<blockquote>
<p>**NOTE:** After the user presses a callback button, Telegram clients will display a progress bar until you call <a href="#answercallbackquery">answerCallbackQuery</a>. It is, therefore, necessary to react by calling <a href="#answercallbackquery">answerCallbackQuery</a> even if no notification to the user is needed (e.g., without specifying any of the optional parameters).</p>
</blockquote>
/**
 * <p>Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot&#39;s message and tapped &#39;Reply&#39;). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice <a href="/bots/features#privacy-mode">privacy mode</a>. Not supported in channels and for messages sent on behalf of a Telegram Business account.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#forcereply}
 */
export interface ForceReply {
<tr>
<td>force_reply</td>
<td>True</td>
<td>Shows reply interface to the user, as if they manually selected the bot&#39;s message and tapped &#39;Reply&#39;</td>
</tr>
<tr>
<td>input_field_placeholder?</td>
<td>String</td>
<td>The placeholder to be shown in the input field when the reply is active; 1-64 characters</td>
</tr>
<tr>
<td>selective?</td>
<td>Boolean</td>
<td>Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the _text_ of the <a href="#message">Message</a> object; 2) if the bot&#39;s message is a reply to a message in the same chat and forum topic, sender of the original message.</td>
</tr>
}
<blockquote>
<p>**Example:** A <a href="https://t.me/PollBot">poll bot</a> for groups runs in privacy mode (only receives commands, replies to its messages and mentions). There could be two ways to create a new poll:</p>
<ul>
<li>Explain the user how to send a command with parameters (e.g. /newpoll question answer1 answer2). May be appealing for hardcore users but lacks modern day polish.</li>
<li>Guide the user through a step-by-step process. &#39;Please send me your question&#39;, &#39;Cool, now let&#39;s add the first answer option&#39;, &#39;Great. Keep adding answer options, then send /done when you&#39;re ready&#39;.</li>
</ul>
<p>The last option is definitely more attractive. And if you use <a href="#forcereply">ForceReply</a> in your bot&#39;s questions, it will receive the user&#39;s answers even if it only receives replies, commands and mentions - without any extra work for the user.</p>
</blockquote>
/**
 * <p>This object represents a chat photo.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatphoto}
 */
export interface ChatPhoto {
<tr>
<td>small_file_id</td>
<td>String</td>
<td>File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.</td>
</tr>
<tr>
<td>small_file_unique_id</td>
<td>String</td>
<td>Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>big_file_id</td>
<td>String</td>
<td>File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.</td>
</tr>
<tr>
<td>big_file_unique_id</td>
<td>String</td>
<td>Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
}
/**
 * <p>Represents an invite link for a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatinvitelink}
 */
export interface ChatInviteLink {
<tr>
<td>invite_link</td>
<td>String</td>
<td>The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”.</td>
</tr>
<tr>
<td>creator</td>
<td><a href="#user">User</a></td>
<td>Creator of the link</td>
</tr>
<tr>
<td>creates_join_request</td>
<td>Boolean</td>
<td>_True_, if users joining the chat via the link need to be approved by chat administrators</td>
</tr>
<tr>
<td>is_primary</td>
<td>Boolean</td>
<td>_True_, if the link is primary</td>
</tr>
<tr>
<td>is_revoked</td>
<td>Boolean</td>
<td>_True_, if the link is revoked</td>
</tr>
<tr>
<td>name?</td>
<td>String</td>
<td>Invite link name</td>
</tr>
<tr>
<td>expire_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the link will expire or has been expired</td>
</tr>
<tr>
<td>member_limit?</td>
<td>Integer</td>
<td>The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999</td>
</tr>
<tr>
<td>pending_join_request_count?</td>
<td>Integer</td>
<td>Number of pending join requests created using this link</td>
</tr>
<tr>
<td>subscription_period?</td>
<td>Integer</td>
<td>The number of seconds the subscription will be active for before the next payment</td>
</tr>
<tr>
<td>subscription_price?</td>
<td>Integer</td>
<td>The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link</td>
</tr>
}
/**
 * <p>Represents the rights of an administrator in a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatadministratorrights}
 */
export interface ChatAdministratorRights {
<tr>
<td>is_anonymous</td>
<td>Boolean</td>
<td>_True_, if the user&#39;s presence in the chat is hidden</td>
</tr>
<tr>
<td>can_manage_chat</td>
<td>Boolean</td>
<td>_True_, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.</td>
</tr>
<tr>
<td>can_delete_messages</td>
<td>Boolean</td>
<td>_True_, if the administrator can delete messages of other users</td>
</tr>
<tr>
<td>can_manage_video_chats</td>
<td>Boolean</td>
<td>_True_, if the administrator can manage video chats</td>
</tr>
<tr>
<td>can_restrict_members</td>
<td>Boolean</td>
<td>_True_, if the administrator can restrict, ban or unban chat members, or access supergroup statistics</td>
</tr>
<tr>
<td>can_promote_members</td>
<td>Boolean</td>
<td>_True_, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)</td>
</tr>
<tr>
<td>can_change_info</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to change the chat title, photo and other settings</td>
</tr>
<tr>
<td>can_invite_users</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to invite new users to the chat</td>
</tr>
<tr>
<td>can_post_stories</td>
<td>Boolean</td>
<td>_True_, if the administrator can post stories to the chat</td>
</tr>
<tr>
<td>can_edit_stories</td>
<td>Boolean</td>
<td>_True_, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat&#39;s story archive</td>
</tr>
<tr>
<td>can_delete_stories</td>
<td>Boolean</td>
<td>_True_, if the administrator can delete stories posted by other users</td>
</tr>
<tr>
<td>can_post_messages?</td>
<td>Boolean</td>
<td>_True_, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only</td>
</tr>
<tr>
<td>can_edit_messages?</td>
<td>Boolean</td>
<td>_True_, if the administrator can edit messages of other users and can pin messages; for channels only</td>
</tr>
<tr>
<td>can_pin_messages?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to pin messages; for groups and supergroups only</td>
</tr>
<tr>
<td>can_manage_topics?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only</td>
</tr>
<tr>
<td>can_manage_direct_messages?</td>
<td>Boolean</td>
<td>_True_, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only</td>
</tr>
}
/**
 * <p>This object represents changes in the status of a chat member.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatmemberupdated}
 */
export interface ChatMemberUpdated {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat the user belongs to</td>
</tr>
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>Performer of the action, which resulted in the change</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the change was done in Unix time</td>
</tr>
<tr>
<td>old_chat_member</td>
<td><a href="#chatmember">ChatMember</a></td>
<td>Previous information about the chat member</td>
</tr>
<tr>
<td>new_chat_member</td>
<td><a href="#chatmember">ChatMember</a></td>
<td>New information about the chat member</td>
</tr>
<tr>
<td>invite_link?</td>
<td><a href="#chatinvitelink">ChatInviteLink</a></td>
<td>Chat invite link, which was used by the user to join the chat; for joining by invite link events only.</td>
</tr>
<tr>
<td>via_join_request?</td>
<td>Boolean</td>
<td>_True_, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator</td>
</tr>
<tr>
<td>via_chat_folder_invite_link?</td>
<td>Boolean</td>
<td>_True_, if the user joined the chat via a chat folder invite link</td>
</tr>
}
/**
 * <p>This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:</p>
 * - ChatMemberOwner
 * - ChatMemberAdministrator
 * - ChatMemberMember
 * - ChatMemberRestricted
 * - ChatMemberLeft
 * - ChatMemberBanned
 *
 * @see {@link https://core.telegram.org/bots/api#chatmember}
 */
export type ChatMember =
 | ChatMemberOwner
 | ChatMemberAdministrator
 | ChatMemberMember
 | ChatMemberRestricted
 | ChatMemberLeft
 | ChatMemberBanned
 /**
  * <p>Represents a <a href="#chatmember">chat member</a> that owns the chat and has all administrator privileges.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatmemberowner}
 */
export interface ChatMemberOwner {
<tr>
<td>status</td>
<td>String</td>
<td>The member&#39;s status in the chat, always “creator”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Information about the user</td>
</tr>
<tr>
<td>is_anonymous</td>
<td>Boolean</td>
<td>_True_, if the user&#39;s presence in the chat is hidden</td>
</tr>
<tr>
<td>custom_title?</td>
<td>String</td>
<td>Custom title for this user</td>
</tr>
}
/**
 * <p>Represents a <a href="#chatmember">chat member</a> that has some additional privileges.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatmemberadministrator}
 */
export interface ChatMemberAdministrator {
<tr>
<td>status</td>
<td>String</td>
<td>The member&#39;s status in the chat, always “administrator”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Information about the user</td>
</tr>
<tr>
<td>can_be_edited</td>
<td>Boolean</td>
<td>_True_, if the bot is allowed to edit administrator privileges of that user</td>
</tr>
<tr>
<td>is_anonymous</td>
<td>Boolean</td>
<td>_True_, if the user&#39;s presence in the chat is hidden</td>
</tr>
<tr>
<td>can_manage_chat</td>
<td>Boolean</td>
<td>_True_, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.</td>
</tr>
<tr>
<td>can_delete_messages</td>
<td>Boolean</td>
<td>_True_, if the administrator can delete messages of other users</td>
</tr>
<tr>
<td>can_manage_video_chats</td>
<td>Boolean</td>
<td>_True_, if the administrator can manage video chats</td>
</tr>
<tr>
<td>can_restrict_members</td>
<td>Boolean</td>
<td>_True_, if the administrator can restrict, ban or unban chat members, or access supergroup statistics</td>
</tr>
<tr>
<td>can_promote_members</td>
<td>Boolean</td>
<td>_True_, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)</td>
</tr>
<tr>
<td>can_change_info</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to change the chat title, photo and other settings</td>
</tr>
<tr>
<td>can_invite_users</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to invite new users to the chat</td>
</tr>
<tr>
<td>can_post_stories</td>
<td>Boolean</td>
<td>_True_, if the administrator can post stories to the chat</td>
</tr>
<tr>
<td>can_edit_stories</td>
<td>Boolean</td>
<td>_True_, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat&#39;s story archive</td>
</tr>
<tr>
<td>can_delete_stories</td>
<td>Boolean</td>
<td>_True_, if the administrator can delete stories posted by other users</td>
</tr>
<tr>
<td>can_post_messages?</td>
<td>Boolean</td>
<td>_True_, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only</td>
</tr>
<tr>
<td>can_edit_messages?</td>
<td>Boolean</td>
<td>_True_, if the administrator can edit messages of other users and can pin messages; for channels only</td>
</tr>
<tr>
<td>can_pin_messages?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to pin messages; for groups and supergroups only</td>
</tr>
<tr>
<td>can_manage_topics?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only</td>
</tr>
<tr>
<td>can_manage_direct_messages?</td>
<td>Boolean</td>
<td>_True_, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only</td>
</tr>
<tr>
<td>custom_title?</td>
<td>String</td>
<td>Custom title for this user</td>
</tr>
}
/**
 * <p>Represents a <a href="#chatmember">chat member</a> that has no additional privileges or restrictions.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatmembermember}
 */
export interface ChatMemberMember {
<tr>
<td>status</td>
<td>String</td>
<td>The member&#39;s status in the chat, always “member”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Information about the user</td>
</tr>
<tr>
<td>until_date?</td>
<td>Integer</td>
<td>Date when the user&#39;s subscription will expire; Unix time</td>
</tr>
}
/**
 * <p>Represents a <a href="#chatmember">chat member</a> that is under certain restrictions in the chat. Supergroups only.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatmemberrestricted}
 */
export interface ChatMemberRestricted {
<tr>
<td>status</td>
<td>String</td>
<td>The member&#39;s status in the chat, always “restricted”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Information about the user</td>
</tr>
<tr>
<td>is_member</td>
<td>Boolean</td>
<td>_True_, if the user is a member of the chat at the moment of the request</td>
</tr>
<tr>
<td>can_send_messages</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send text messages, contacts, giveaways, giveaway winners, invoices, locations and venues</td>
</tr>
<tr>
<td>can_send_audios</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send audios</td>
</tr>
<tr>
<td>can_send_documents</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send documents</td>
</tr>
<tr>
<td>can_send_photos</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send photos</td>
</tr>
<tr>
<td>can_send_videos</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send videos</td>
</tr>
<tr>
<td>can_send_video_notes</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send video notes</td>
</tr>
<tr>
<td>can_send_voice_notes</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send voice notes</td>
</tr>
<tr>
<td>can_send_polls</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send polls and checklists</td>
</tr>
<tr>
<td>can_send_other_messages</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send animations, games, stickers and use inline bots</td>
</tr>
<tr>
<td>can_add_web_page_previews</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to add web page previews to their messages</td>
</tr>
<tr>
<td>can_change_info</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to change the chat title, photo and other settings</td>
</tr>
<tr>
<td>can_invite_users</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to invite new users to the chat</td>
</tr>
<tr>
<td>can_pin_messages</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to pin messages</td>
</tr>
<tr>
<td>can_manage_topics</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to create forum topics</td>
</tr>
<tr>
<td>until_date</td>
<td>Integer</td>
<td>Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever</td>
</tr>
}
/**
 * <p>Represents a <a href="#chatmember">chat member</a> that isn&#39;t currently a member of the chat, but may join it themselves.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatmemberleft}
 */
export interface ChatMemberLeft {
<tr>
<td>status</td>
<td>String</td>
<td>The member&#39;s status in the chat, always “left”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Information about the user</td>
</tr>
}
/**
 * <p>Represents a <a href="#chatmember">chat member</a> that was banned in the chat and can&#39;t return to the chat or view chat messages.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatmemberbanned}
 */
export interface ChatMemberBanned {
<tr>
<td>status</td>
<td>String</td>
<td>The member&#39;s status in the chat, always “kicked”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Information about the user</td>
</tr>
<tr>
<td>until_date</td>
<td>Integer</td>
<td>Date when restrictions will be lifted for this user; Unix time. If 0, then the user is banned forever</td>
</tr>
}
/**
 * <p>Represents a join request sent to a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatjoinrequest}
 */
export interface ChatJoinRequest {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat to which the request was sent</td>
</tr>
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>User that sent the join request</td>
</tr>
<tr>
<td>user_chat_id</td>
<td>Integer</td>
<td>Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user.</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the request was sent in Unix time</td>
</tr>
<tr>
<td>bio?</td>
<td>String</td>
<td>Bio of the user.</td>
</tr>
<tr>
<td>invite_link?</td>
<td><a href="#chatinvitelink">ChatInviteLink</a></td>
<td>Chat invite link that was used by the user to send the join request</td>
</tr>
}
/**
 * <p>Describes actions that a non-administrator user is allowed to take in a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatpermissions}
 */
export interface ChatPermissions {
<tr>
<td>can_send_messages?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send text messages, contacts, giveaways, giveaway winners, invoices, locations and venues</td>
</tr>
<tr>
<td>can_send_audios?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send audios</td>
</tr>
<tr>
<td>can_send_documents?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send documents</td>
</tr>
<tr>
<td>can_send_photos?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send photos</td>
</tr>
<tr>
<td>can_send_videos?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send videos</td>
</tr>
<tr>
<td>can_send_video_notes?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send video notes</td>
</tr>
<tr>
<td>can_send_voice_notes?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send voice notes</td>
</tr>
<tr>
<td>can_send_polls?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send polls and checklists</td>
</tr>
<tr>
<td>can_send_other_messages?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to send animations, games, stickers and use inline bots</td>
</tr>
<tr>
<td>can_add_web_page_previews?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to add web page previews to their messages</td>
</tr>
<tr>
<td>can_change_info?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups</td>
</tr>
<tr>
<td>can_invite_users?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to invite new users to the chat</td>
</tr>
<tr>
<td>can_pin_messages?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to pin messages. Ignored in public supergroups</td>
</tr>
<tr>
<td>can_manage_topics?</td>
<td>Boolean</td>
<td>_True_, if the user is allowed to create forum topics. If omitted defaults to the value of can_pin_messages</td>
</tr>
}
/**
 * <p>Describes the birthdate of a user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#birthdate}
 */
export interface Birthdate {
<tr>
<td>day</td>
<td>Integer</td>
<td>Day of the user&#39;s birth; 1-31</td>
</tr>
<tr>
<td>month</td>
<td>Integer</td>
<td>Month of the user&#39;s birth; 1-12</td>
</tr>
<tr>
<td>year?</td>
<td>Integer</td>
<td>Year of the user&#39;s birth</td>
</tr>
}
/**
 * <p>Contains information about the start page settings of a Telegram Business account.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#businessintro}
 */
export interface BusinessIntro {
<tr>
<td>title?</td>
<td>String</td>
<td>Title text of the business intro</td>
</tr>
<tr>
<td>message?</td>
<td>String</td>
<td>Message text of the business intro</td>
</tr>
<tr>
<td>sticker?</td>
<td><a href="#sticker">Sticker</a></td>
<td>Sticker of the business intro</td>
</tr>
}
/**
 * <p>Contains information about the location of a Telegram Business account.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#businesslocation}
 */
export interface BusinessLocation {
<tr>
<td>address</td>
<td>String</td>
<td>Address of the business</td>
</tr>
<tr>
<td>location?</td>
<td><a href="#location">Location</a></td>
<td>Location of the business</td>
</tr>
}
/**
 * <p>Describes an interval of time during which a business is open.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#businessopeninghoursinterval}
 */
export interface BusinessOpeningHoursInterval {
<tr>
<td>opening_minute</td>
<td>Integer</td>
<td>The minute&#39;s sequence number in a week, starting on Monday, marking the start of the time interval during which the business is open; 0 - 7 * 24 * 60</td>
</tr>
<tr>
<td>closing_minute</td>
<td>Integer</td>
<td>The minute&#39;s sequence number in a week, starting on Monday, marking the end of the time interval during which the business is open; 0 - 8 * 24 * 60</td>
</tr>
}
/**
 * <p>Describes the opening hours of a business.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#businessopeninghours}
 */
export interface BusinessOpeningHours {
<tr>
<td>time_zone_name</td>
<td>String</td>
<td>Unique name of the time zone for which the opening hours are defined</td>
</tr>
<tr>
<td>opening_hours</td>
<td>Array of <a href="#businessopeninghoursinterval">BusinessOpeningHoursInterval</a></td>
<td>List of time intervals describing business opening hours</td>
</tr>
}
/**
 * <p>Describes the position of a clickable area within a story.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#storyareaposition}
 */
export interface StoryAreaPosition {
<tr>
<td>x_percentage</td>
<td>Float</td>
<td>The abscissa of the area&#39;s center, as a percentage of the media width</td>
</tr>
<tr>
<td>y_percentage</td>
<td>Float</td>
<td>The ordinate of the area&#39;s center, as a percentage of the media height</td>
</tr>
<tr>
<td>width_percentage</td>
<td>Float</td>
<td>The width of the area&#39;s rectangle, as a percentage of the media width</td>
</tr>
<tr>
<td>height_percentage</td>
<td>Float</td>
<td>The height of the area&#39;s rectangle, as a percentage of the media height</td>
</tr>
<tr>
<td>rotation_angle</td>
<td>Float</td>
<td>The clockwise rotation angle of the rectangle, in degrees; 0-360</td>
</tr>
<tr>
<td>corner_radius_percentage</td>
<td>Float</td>
<td>The radius of the rectangle corner rounding, as a percentage of the media width</td>
</tr>
}
/**
 * <p>Describes the physical address of a location.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#locationaddress}
 */
export interface LocationAddress {
<tr>
<td>country_code</td>
<td>String</td>
<td>The two-letter ISO 3166-1 alpha-2 country code of the country where the location is located</td>
</tr>
<tr>
<td>state?</td>
<td>String</td>
<td>State of the location</td>
</tr>
<tr>
<td>city?</td>
<td>String</td>
<td>City of the location</td>
</tr>
<tr>
<td>street?</td>
<td>String</td>
<td>Street address of the location</td>
</tr>
}
/**
 * <p>Describes the type of a clickable area on a story. Currently, it can be one of</p>
 * - StoryAreaTypeLocation
 * - StoryAreaTypeSuggestedReaction
 * - StoryAreaTypeLink
 * - StoryAreaTypeWeather
 * - StoryAreaTypeUniqueGift
 *
 * @see {@link https://core.telegram.org/bots/api#storyareatype}
 */
export type StoryAreaType =
 | StoryAreaTypeLocation
 | StoryAreaTypeSuggestedReaction
 | StoryAreaTypeLink
 | StoryAreaTypeWeather
 | StoryAreaTypeUniqueGift
 /**
  * <p>Describes a story area pointing to a location. Currently, a story can have up to 10 location areas.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#storyareatypelocation}
 */
export interface StoryAreaTypeLocation {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the area, always “location”</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Location latitude in degrees</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Location longitude in degrees</td>
</tr>
<tr>
<td>address?</td>
<td><a href="#locationaddress">LocationAddress</a></td>
<td>Address of the location</td>
</tr>
}
/**
 * <p>Describes a story area pointing to a suggested reaction. Currently, a story can have up to 5 suggested reaction areas.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#storyareatypesuggestedreaction}
 */
export interface StoryAreaTypeSuggestedReaction {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the area, always “suggested_reaction”</td>
</tr>
<tr>
<td>reaction_type</td>
<td><a href="#reactiontype">ReactionType</a></td>
<td>Type of the reaction</td>
</tr>
<tr>
<td>is_dark?</td>
<td>Boolean</td>
<td>Pass _True_ if the reaction area has a dark background</td>
</tr>
<tr>
<td>is_flipped?</td>
<td>Boolean</td>
<td>Pass _True_ if reaction area corner is flipped</td>
</tr>
}
/**
 * <p>Describes a story area pointing to an HTTP or tg:// link. Currently, a story can have up to 3 link areas.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#storyareatypelink}
 */
export interface StoryAreaTypeLink {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the area, always “link”</td>
</tr>
<tr>
<td>url</td>
<td>String</td>
<td>HTTP or tg:// URL to be opened when the area is clicked</td>
</tr>
}
/**
 * <p>Describes a story area containing weather information. Currently, a story can have up to 3 weather areas.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#storyareatypeweather}
 */
export interface StoryAreaTypeWeather {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the area, always “weather”</td>
</tr>
<tr>
<td>temperature</td>
<td>Float</td>
<td>Temperature, in degree Celsius</td>
</tr>
<tr>
<td>emoji</td>
<td>String</td>
<td>Emoji representing the weather</td>
</tr>
<tr>
<td>background_color</td>
<td>Integer</td>
<td>A color of the area background in the ARGB format</td>
</tr>
}
/**
 * <p>Describes a story area pointing to a unique gift. Currently, a story can have at most 1 unique gift area.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#storyareatypeuniquegift}
 */
export interface StoryAreaTypeUniqueGift {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the area, always “unique_gift”</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Unique name of the gift</td>
</tr>
}
/**
 * <p>Describes a clickable area on a story media.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#storyarea}
 */
export interface StoryArea {
<tr>
<td>position</td>
<td><a href="#storyareaposition">StoryAreaPosition</a></td>
<td>Position of the area</td>
</tr>
<tr>
<td>type</td>
<td><a href="#storyareatype">StoryAreaType</a></td>
<td>Type of the area</td>
</tr>
}
/**
 * <p>Represents a location to which a chat is connected.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatlocation}
 */
export interface ChatLocation {
<tr>
<td>location</td>
<td><a href="#location">Location</a></td>
<td>The location to which the supergroup is connected. Can&#39;t be a live location.</td>
</tr>
<tr>
<td>address</td>
<td>String</td>
<td>Location address; 1-64 characters, as defined by the chat owner</td>
</tr>
}
/**
 * <p>This object describes the type of a reaction. Currently, it can be one of</p>
 * - ReactionTypeEmoji
 * - ReactionTypeCustomEmoji
 * - ReactionTypePaid
 *
 * @see {@link https://core.telegram.org/bots/api#reactiontype}
 */
export type ReactionType =
 | ReactionTypeEmoji
 | ReactionTypeCustomEmoji
 | ReactionTypePaid
 /**
  * <p>The reaction is based on an emoji.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#reactiontypeemoji}
 */
export interface ReactionTypeEmoji {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the reaction, always “emoji”</td>
</tr>
<tr>
<td>emoji</td>
<td>String</td>
<td>Reaction emoji. Currently, it can be one of &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29DA4.png" width="20" height="20" alt="❤" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918E.png" width="20" height="20" alt="👎" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F94A5.png" width="20" height="20" alt="🔥" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA5B0.png" width="20" height="20" alt="🥰" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918F.png" width="20" height="20" alt="👏" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9881.png" width="20" height="20" alt="😁" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA494.png" width="20" height="20" alt="🤔" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AF.png" width="20" height="20" alt="🤯" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98B1.png" width="20" height="20" alt="😱" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AC.png" width="20" height="20" alt="🤬" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98A2.png" width="20" height="20" alt="😢" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E89.png" width="20" height="20" alt="🎉" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A9.png" width="20" height="20" alt="🤩" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AE.png" width="20" height="20" alt="🤮" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F92A9.png" width="20" height="20" alt="💩" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F998F.png" width="20" height="20" alt="🙏" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918C.png" width="20" height="20" alt="👌" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F958A.png" width="20" height="20" alt="🕊" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A1.png" width="20" height="20" alt="🤡" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA5B1.png" width="20" height="20" alt="🥱" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA5B4.png" width="20" height="20" alt="🥴" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F988D.png" width="20" height="20" alt="😍" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F90B3.png" width="20" height="20" alt="🐳" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29DA4E2808DF09F94A5.png" width="20" height="20" alt="❤‍🔥" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8C9A.png" width="20" height="20" alt="🌚" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8CAD.png" width="20" height="20" alt="🌭" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F92AF.png" width="20" height="20" alt="💯" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A3.png" width="20" height="20" alt="🤣" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29AA1.png" width="20" height="20" alt="⚡" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8D8C.png" width="20" height="20" alt="🍌" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F86.png" width="20" height="20" alt="🏆" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9294.png" width="20" height="20" alt="💔" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A8.png" width="20" height="20" alt="🤨" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9890.png" width="20" height="20" alt="😐" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8D93.png" width="20" height="20" alt="🍓" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8DBE.png" width="20" height="20" alt="🍾" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F928B.png" width="20" height="20" alt="💋" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9695.png" width="20" height="20" alt="🖕" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9888.png" width="20" height="20" alt="😈" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98B4.png" width="20" height="20" alt="😴" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98AD.png" width="20" height="20" alt="😭" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA493.png" width="20" height="20" alt="🤓" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F91BB.png" width="20" height="20" alt="👻" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F91A8E2808DF09F92BB.png" width="20" height="20" alt="👨‍💻" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9180.png" width="20" height="20" alt="👀" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E83.png" width="20" height="20" alt="🎃" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9988.png" width="20" height="20" alt="🙈" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9887.png" width="20" height="20" alt="😇" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98A8.png" width="20" height="20" alt="😨" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA49D.png" width="20" height="20" alt="🤝" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29C8D.png" width="20" height="20" alt="✍" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA497.png" width="20" height="20" alt="🤗" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FABA1.png" width="20" height="20" alt="🫡" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E85.png" width="20" height="20" alt="🎅" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E84.png" width="20" height="20" alt="🎄" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29883.png" width="20" height="20" alt="☃" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9285.png" width="20" height="20" alt="💅" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AA.png" width="20" height="20" alt="🤪" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F97BF.png" width="20" height="20" alt="🗿" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8692.png" width="20" height="20" alt="🆒" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9298.png" width="20" height="20" alt="💘" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9989.png" width="20" height="20" alt="🙉" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA684.png" width="20" height="20" alt="🦄" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9898.png" width="20" height="20" alt="😘" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F928A.png" width="20" height="20" alt="💊" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F998A.png" width="20" height="20" alt="🙊" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F988E.png" width="20" height="20" alt="😎" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F91BE.png" width="20" height="20" alt="👾" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4B7E2808DE29982.png" width="20" height="20" alt="🤷‍♂" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4B7.png" width="20" height="20" alt="🤷" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4B7E2808DE29980.png" width="20" height="20" alt="🤷‍♀" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98A1.png" width="20" height="20" alt="😡" />&quot;</td>
</tr>
}
/**
 * <p>The reaction is based on a custom emoji.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#reactiontypecustomemoji}
 */
export interface ReactionTypeCustomEmoji {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the reaction, always “custom_emoji”</td>
</tr>
<tr>
<td>custom_emoji_id</td>
<td>String</td>
<td>Custom emoji identifier</td>
</tr>
}
/**
 * <p>The reaction is paid.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#reactiontypepaid}
 */
export interface ReactionTypePaid {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the reaction, always “paid”</td>
</tr>
}
/**
 * <p>Represents a reaction added to a message along with the number of times it was added.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#reactioncount}
 */
export interface ReactionCount {
<tr>
<td>type</td>
<td><a href="#reactiontype">ReactionType</a></td>
<td>Type of the reaction</td>
</tr>
<tr>
<td>total_count</td>
<td>Integer</td>
<td>Number of times the reaction was added</td>
</tr>
}
/**
 * <p>This object represents a change of a reaction on a message performed by a user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#messagereactionupdated}
 */
export interface MessageReactionUpdated {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>The chat containing the message the user reacted to</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique identifier of the message inside the chat</td>
</tr>
<tr>
<td>user?</td>
<td><a href="#user">User</a></td>
<td>The user that changed the reaction, if the user isn&#39;t anonymous</td>
</tr>
<tr>
<td>actor_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>The chat on behalf of which the reaction was changed, if the user is anonymous</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date of the change in Unix time</td>
</tr>
<tr>
<td>old_reaction</td>
<td>Array of <a href="#reactiontype">ReactionType</a></td>
<td>Previous list of reaction types that were set by the user</td>
</tr>
<tr>
<td>new_reaction</td>
<td>Array of <a href="#reactiontype">ReactionType</a></td>
<td>New list of reaction types that have been set by the user</td>
</tr>
}
/**
 * <p>This object represents reaction changes on a message with anonymous reactions.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#messagereactioncountupdated}
 */
export interface MessageReactionCountUpdated {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>The chat containing the message</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique message identifier inside the chat</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date of the change in Unix time</td>
</tr>
<tr>
<td>reactions</td>
<td>Array of <a href="#reactioncount">ReactionCount</a></td>
<td>List of reactions that are present on the message</td>
</tr>
}
/**
 * <p>This object represents a forum topic.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#forumtopic}
 */
export interface ForumTopic {
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Unique identifier of the forum topic</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Name of the topic</td>
</tr>
<tr>
<td>icon_color</td>
<td>Integer</td>
<td>Color of the topic icon in RGB format</td>
</tr>
<tr>
<td>icon_custom_emoji_id?</td>
<td>String</td>
<td>Unique identifier of the custom emoji shown as the topic icon</td>
</tr>
}
/**
 * <p>This object represents a gift that can be sent by the bot.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#gift}
 */
export interface Gift {
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier of the gift</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#sticker">Sticker</a></td>
<td>The sticker that represents the gift</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>The number of Telegram Stars that must be paid to send the sticker</td>
</tr>
<tr>
<td>upgrade_star_count?</td>
<td>Integer</td>
<td>The number of Telegram Stars that must be paid to upgrade the gift to a unique one</td>
</tr>
<tr>
<td>total_count?</td>
<td>Integer</td>
<td>The total number of the gifts of this type that can be sent; for limited gifts only</td>
</tr>
<tr>
<td>remaining_count?</td>
<td>Integer</td>
<td>The number of remaining gifts of this type that can be sent; for limited gifts only</td>
</tr>
<tr>
<td>publisher_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>Information about the chat that published the gift</td>
</tr>
}
/**
 * <p>This object represent a list of gifts.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#gifts}
 */
export interface Gifts {
<tr>
<td>gifts</td>
<td>Array of <a href="#gift">Gift</a></td>
<td>The list of gifts</td>
</tr>
}
/**
 * <p>This object describes the model of a unique gift.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#uniquegiftmodel}
 */
export interface UniqueGiftModel {
<tr>
<td>name</td>
<td>String</td>
<td>Name of the model</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#sticker">Sticker</a></td>
<td>The sticker that represents the unique gift</td>
</tr>
<tr>
<td>rarity_per_mille</td>
<td>Integer</td>
<td>The number of unique gifts that receive this model for every 1000 gifts upgraded</td>
</tr>
}
/**
 * <p>This object describes the symbol shown on the pattern of a unique gift.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#uniquegiftsymbol}
 */
export interface UniqueGiftSymbol {
<tr>
<td>name</td>
<td>String</td>
<td>Name of the symbol</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#sticker">Sticker</a></td>
<td>The sticker that represents the unique gift</td>
</tr>
<tr>
<td>rarity_per_mille</td>
<td>Integer</td>
<td>The number of unique gifts that receive this model for every 1000 gifts upgraded</td>
</tr>
}
/**
 * <p>This object describes the colors of the backdrop of a unique gift.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#uniquegiftbackdropcolors}
 */
export interface UniqueGiftBackdropColors {
<tr>
<td>center_color</td>
<td>Integer</td>
<td>The color in the center of the backdrop in RGB format</td>
</tr>
<tr>
<td>edge_color</td>
<td>Integer</td>
<td>The color on the edges of the backdrop in RGB format</td>
</tr>
<tr>
<td>symbol_color</td>
<td>Integer</td>
<td>The color to be applied to the symbol in RGB format</td>
</tr>
<tr>
<td>text_color</td>
<td>Integer</td>
<td>The color for the text on the backdrop in RGB format</td>
</tr>
}
/**
 * <p>This object describes the backdrop of a unique gift.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#uniquegiftbackdrop}
 */
export interface UniqueGiftBackdrop {
<tr>
<td>name</td>
<td>String</td>
<td>Name of the backdrop</td>
</tr>
<tr>
<td>colors</td>
<td><a href="#uniquegiftbackdropcolors">UniqueGiftBackdropColors</a></td>
<td>Colors of the backdrop</td>
</tr>
<tr>
<td>rarity_per_mille</td>
<td>Integer</td>
<td>The number of unique gifts that receive this backdrop for every 1000 gifts upgraded</td>
</tr>
}
/**
 * <p>This object describes a unique gift that was upgraded from a regular gift.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#uniquegift}
 */
export interface UniqueGift {
<tr>
<td>base_name</td>
<td>String</td>
<td>Human-readable name of the regular gift from which this unique gift was upgraded</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Unique name of the gift. This name can be used in `https://t.me/nft/...` links and story areas</td>
</tr>
<tr>
<td>number</td>
<td>Integer</td>
<td>Unique number of the upgraded gift among gifts upgraded from the same regular gift</td>
</tr>
<tr>
<td>model</td>
<td><a href="#uniquegiftmodel">UniqueGiftModel</a></td>
<td>Model of the gift</td>
</tr>
<tr>
<td>symbol</td>
<td><a href="#uniquegiftsymbol">UniqueGiftSymbol</a></td>
<td>Symbol of the gift</td>
</tr>
<tr>
<td>backdrop</td>
<td><a href="#uniquegiftbackdrop">UniqueGiftBackdrop</a></td>
<td>Backdrop of the gift</td>
</tr>
<tr>
<td>publisher_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>Information about the chat that published the gift</td>
</tr>
}
/**
 * <p>Describes a service message about a regular gift that was sent or received.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#giftinfo}
 */
export interface GiftInfo {
<tr>
<td>gift</td>
<td><a href="#gift">Gift</a></td>
<td>Information about the gift</td>
</tr>
<tr>
<td>owned_gift_id?</td>
<td>String</td>
<td>Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts</td>
</tr>
<tr>
<td>convert_star_count?</td>
<td>Integer</td>
<td>Number of Telegram Stars that can be claimed by the receiver by converting the gift; omitted if conversion to Telegram Stars is impossible</td>
</tr>
<tr>
<td>prepaid_upgrade_star_count?</td>
<td>Integer</td>
<td>Number of Telegram Stars that were prepaid by the sender for the ability to upgrade the gift</td>
</tr>
<tr>
<td>can_be_upgraded?</td>
<td>True</td>
<td>_True_, if the gift can be upgraded to a unique gift</td>
</tr>
<tr>
<td>text?</td>
<td>String</td>
<td>Text of the message that was added to the gift</td>
</tr>
<tr>
<td>entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in the text</td>
</tr>
<tr>
<td>is_private?</td>
<td>True</td>
<td>_True_, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them</td>
</tr>
}
/**
 * <p>Describes a service message about a unique gift that was sent or received.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#uniquegiftinfo}
 */
export interface UniqueGiftInfo {
<tr>
<td>gift</td>
<td><a href="#uniquegift">UniqueGift</a></td>
<td>Information about the gift</td>
</tr>
<tr>
<td>origin</td>
<td>String</td>
<td>Origin of the gift. Currently, either “upgrade” for gifts upgraded from regular gifts, “transfer” for gifts transferred from other users or channels, or “resale” for gifts bought from other users</td>
</tr>
<tr>
<td>last_resale_star_count?</td>
<td>Integer</td>
<td>For gifts bought from other users, the price paid for the gift</td>
</tr>
<tr>
<td>owned_gift_id?</td>
<td>String</td>
<td>Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts</td>
</tr>
<tr>
<td>transfer_star_count?</td>
<td>Integer</td>
<td>Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift</td>
</tr>
<tr>
<td>next_transfer_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now</td>
</tr>
}
/**
 * <p>This object describes a gift received and owned by a user or a chat. Currently, it can be one of</p>
 * - OwnedGiftRegular
 * - OwnedGiftUnique
 *
 * @see {@link https://core.telegram.org/bots/api#ownedgift}
 */
export type OwnedGift =
 | OwnedGiftRegular
 | OwnedGiftUnique
 /**
  * <p>Describes a regular gift owned by a user or a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#ownedgiftregular}
 */
export interface OwnedGiftRegular {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the gift, always “regular”</td>
</tr>
<tr>
<td>gift</td>
<td><a href="#gift">Gift</a></td>
<td>Information about the regular gift</td>
</tr>
<tr>
<td>owned_gift_id?</td>
<td>String</td>
<td>Unique identifier of the gift for the bot; for gifts received on behalf of business accounts only</td>
</tr>
<tr>
<td>sender_user?</td>
<td><a href="#user">User</a></td>
<td>Sender of the gift if it is a known user</td>
</tr>
<tr>
<td>send_date</td>
<td>Integer</td>
<td>Date the gift was sent in Unix time</td>
</tr>
<tr>
<td>text?</td>
<td>String</td>
<td>Text of the message that was added to the gift</td>
</tr>
<tr>
<td>entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in the text</td>
</tr>
<tr>
<td>is_private?</td>
<td>True</td>
<td>_True_, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them</td>
</tr>
<tr>
<td>is_saved?</td>
<td>True</td>
<td>_True_, if the gift is displayed on the account&#39;s profile page; for gifts received on behalf of business accounts only</td>
</tr>
<tr>
<td>can_be_upgraded?</td>
<td>True</td>
<td>_True_, if the gift can be upgraded to a unique gift; for gifts received on behalf of business accounts only</td>
</tr>
<tr>
<td>was_refunded?</td>
<td>True</td>
<td>_True_, if the gift was refunded and isn&#39;t available anymore</td>
</tr>
<tr>
<td>convert_star_count?</td>
<td>Integer</td>
<td>Number of Telegram Stars that can be claimed by the receiver instead of the gift; omitted if the gift cannot be converted to Telegram Stars</td>
</tr>
<tr>
<td>prepaid_upgrade_star_count?</td>
<td>Integer</td>
<td>Number of Telegram Stars that were paid by the sender for the ability to upgrade the gift</td>
</tr>
}
/**
 * <p>Describes a unique gift received and owned by a user or a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#ownedgiftunique}
 */
export interface OwnedGiftUnique {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the gift, always “unique”</td>
</tr>
<tr>
<td>gift</td>
<td><a href="#uniquegift">UniqueGift</a></td>
<td>Information about the unique gift</td>
</tr>
<tr>
<td>owned_gift_id?</td>
<td>String</td>
<td>Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only</td>
</tr>
<tr>
<td>sender_user?</td>
<td><a href="#user">User</a></td>
<td>Sender of the gift if it is a known user</td>
</tr>
<tr>
<td>send_date</td>
<td>Integer</td>
<td>Date the gift was sent in Unix time</td>
</tr>
<tr>
<td>is_saved?</td>
<td>True</td>
<td>_True_, if the gift is displayed on the account&#39;s profile page; for gifts received on behalf of business accounts only</td>
</tr>
<tr>
<td>can_be_transferred?</td>
<td>True</td>
<td>_True_, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only</td>
</tr>
<tr>
<td>transfer_star_count?</td>
<td>Integer</td>
<td>Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift</td>
</tr>
<tr>
<td>next_transfer_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now</td>
</tr>
}
/**
 * <p>Contains the list of gifts received and owned by a user or a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#ownedgifts}
 */
export interface OwnedGifts {
<tr>
<td>total_count</td>
<td>Integer</td>
<td>The total number of gifts owned by the user or the chat</td>
</tr>
<tr>
<td>gifts</td>
<td>Array of <a href="#ownedgift">OwnedGift</a></td>
<td>The list of gifts</td>
</tr>
<tr>
<td>next_offset?</td>
<td>String</td>
<td>Offset for the next request. If empty, then there are no more results</td>
</tr>
}
/**
 * <p>This object describes the types of gifts that can be gifted to a user or a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#acceptedgifttypes}
 */
export interface AcceptedGiftTypes {
<tr>
<td>unlimited_gifts</td>
<td>Boolean</td>
<td>_True_, if unlimited regular gifts are accepted</td>
</tr>
<tr>
<td>limited_gifts</td>
<td>Boolean</td>
<td>_True_, if limited regular gifts are accepted</td>
</tr>
<tr>
<td>unique_gifts</td>
<td>Boolean</td>
<td>_True_, if unique gifts or gifts that can be upgraded to unique for free are accepted</td>
</tr>
<tr>
<td>premium_subscription</td>
<td>Boolean</td>
<td>_True_, if a Telegram Premium subscription is accepted</td>
</tr>
}
/**
 * <p>Describes an amount of Telegram Stars.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#staramount}
 */
export interface StarAmount {
<tr>
<td>amount</td>
<td>Integer</td>
<td>Integer amount of Telegram Stars, rounded to 0; can be negative</td>
</tr>
<tr>
<td>nanostar_amount?</td>
<td>Integer</td>
<td>The number of 1/1000000000 shares of Telegram Stars; from -999999999 to 999999999; can be negative if and only if _amount_ is non-positive</td>
</tr>
}
/**
 * <p>This object represents a bot command.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommand}
 */
export interface BotCommand {
<tr>
<td>command</td>
<td>String</td>
<td>Text of the command; 1-32 characters. Can contain only lowercase English letters, digits and underscores.</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Description of the command; 1-256 characters.</td>
</tr>
}
/**
 * <p>This object represents the scope to which bot commands are applied. Currently, the following 7 scopes are supported:</p>
 * - BotCommandScopeDefault
 * - BotCommandScopeAllPrivateChats
 * - BotCommandScopeAllGroupChats
 * - BotCommandScopeAllChatAdministrators
 * - BotCommandScopeChat
 * - BotCommandScopeChatAdministrators
 * - BotCommandScopeChatMember
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscope}
 */
export type BotCommandScope =
 | BotCommandScopeDefault
 | BotCommandScopeAllPrivateChats
 | BotCommandScopeAllGroupChats
 | BotCommandScopeAllChatAdministrators
 | BotCommandScopeChat
 | BotCommandScopeChatAdministrators
 | BotCommandScopeChatMember
 /**
  * <p>Represents the default <a href="#botcommandscope">scope</a> of bot commands. Default commands are used if no commands with a <a href="#determining-list-of-commands">narrower scope</a> are specified for the user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscopedefault}
 */
export interface BotCommandScopeDefault {
<tr>
<td>type</td>
<td>String</td>
<td>Scope type, must be _default_</td>
</tr>
}
/**
 * <p>Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all private chats.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscopeallprivatechats}
 */
export interface BotCommandScopeAllPrivateChats {
<tr>
<td>type</td>
<td>String</td>
<td>Scope type, must be _all_private_chats_</td>
</tr>
}
/**
 * <p>Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all group and supergroup chats.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscopeallgroupchats}
 */
export interface BotCommandScopeAllGroupChats {
<tr>
<td>type</td>
<td>String</td>
<td>Scope type, must be _all_group_chats_</td>
</tr>
}
/**
 * <p>Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all group and supergroup chat administrators.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscopeallchatadministrators}
 */
export interface BotCommandScopeAllChatAdministrators {
<tr>
<td>type</td>
<td>String</td>
<td>Scope type, must be _all_chat_administrators_</td>
</tr>
}
/**
 * <p>Represents the <a href="#botcommandscope">scope</a> of bot commands, covering a specific chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscopechat}
 */
export interface BotCommandScopeChat {
<tr>
<td>type</td>
<td>String</td>
<td>Scope type, must be _chat_</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel direct messages chats and channel chats aren&#39;t supported.</td>
</tr>
}
/**
 * <p>Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all administrators of a specific group or supergroup chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscopechatadministrators}
 */
export interface BotCommandScopeChatAdministrators {
<tr>
<td>type</td>
<td>String</td>
<td>Scope type, must be _chat_administrators_</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel direct messages chats and channel chats aren&#39;t supported.</td>
</tr>
}
/**
 * <p>Represents the <a href="#botcommandscope">scope</a> of bot commands, covering a specific member of a group or supergroup chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botcommandscopechatmember}
 */
export interface BotCommandScopeChatMember {
<tr>
<td>type</td>
<td>String</td>
<td>Scope type, must be _chat_member_</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel direct messages chats and channel chats aren&#39;t supported.</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
}
/**
 * <p>This object represents the bot&#39;s name.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botname}
 */
export interface BotName {
<tr>
<td>name</td>
<td>String</td>
<td>The bot&#39;s name</td>
</tr>
}
/**
 * <p>This object represents the bot&#39;s description.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botdescription}
 */
export interface BotDescription {
<tr>
<td>description</td>
<td>String</td>
<td>The bot&#39;s description</td>
</tr>
}
/**
 * <p>This object represents the bot&#39;s short description.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#botshortdescription}
 */
export interface BotShortDescription {
<tr>
<td>short_description</td>
<td>String</td>
<td>The bot&#39;s short description</td>
</tr>
}
/**
 * <p>This object describes the bot&#39;s menu button in a private chat. It should be one of</p>
 * - MenuButtonCommands
 * - MenuButtonWebApp
 * - MenuButtonDefault
 *
 * @see {@link https://core.telegram.org/bots/api#menubutton}
 */
export type MenuButton =
 | MenuButtonCommands
 | MenuButtonWebApp
 | MenuButtonDefault
<p>If a menu button other than <a href="#menubuttondefault">MenuButtonDefault</a> is set for a private chat, then it is applied in the chat. Otherwise the default menu button is applied. By default, the menu button opens the list of bot commands.</p>
  /**
   * <p>Represents a menu button, which opens the bot&#39;s list of commands.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#menubuttoncommands}
 */
export interface MenuButtonCommands {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the button, must be _commands_</td>
</tr>
}
/**
 * <p>Represents a menu button, which launches a <a href="/bots/webapps">Web App</a>.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#menubuttonwebapp}
 */
export interface MenuButtonWebApp {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the button, must be _web_app_</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Text on the button</td>
</tr>
<tr>
<td>web_app</td>
<td><a href="#webappinfo">WebAppInfo</a></td>
<td>Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method <a href="#answerwebappquery">answerWebAppQuery</a>. Alternatively, a `t.me` link to a Web App of the bot can be specified in the object instead of the Web App&#39;s URL, in which case the Web App will be opened as if the user pressed the link.</td>
</tr>
}
/**
 * <p>Describes that no specific value for the menu button was set.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#menubuttondefault}
 */
export interface MenuButtonDefault {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the button, must be _default_</td>
</tr>
}
/**
 * <p>This object describes the source of a chat boost. It can be one of</p>
 * - ChatBoostSourcePremium
 * - ChatBoostSourceGiftCode
 * - ChatBoostSourceGiveaway
 *
 * @see {@link https://core.telegram.org/bots/api#chatboostsource}
 */
export type ChatBoostSource =
 | ChatBoostSourcePremium
 | ChatBoostSourceGiftCode
 | ChatBoostSourceGiveaway
 /**
  * <p>The boost was obtained by subscribing to Telegram Premium or by gifting a Telegram Premium subscription to another user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatboostsourcepremium}
 */
export interface ChatBoostSourcePremium {
<tr>
<td>source</td>
<td>String</td>
<td>Source of the boost, always “premium”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>User that boosted the chat</td>
</tr>
}
/**
 * <p>The boost was obtained by the creation of Telegram Premium gift codes to boost a chat. Each such code boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatboostsourcegiftcode}
 */
export interface ChatBoostSourceGiftCode {
<tr>
<td>source</td>
<td>String</td>
<td>Source of the boost, always “gift_code”</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>User for which the gift code was created</td>
</tr>
}
/**
 * <p>The boost was obtained by the creation of a Telegram Premium or a Telegram Star giveaway. This boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription for Telegram Premium giveaways and _prize_star_count_ / 500 times for one year for Telegram Star giveaways.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatboostsourcegiveaway}
 */
export interface ChatBoostSourceGiveaway {
<tr>
<td>source</td>
<td>String</td>
<td>Source of the boost, always “giveaway”</td>
</tr>
<tr>
<td>giveaway_message_id</td>
<td>Integer</td>
<td>Identifier of a message in the chat with the giveaway; the message could have been deleted already. May be 0 if the message isn&#39;t sent yet.</td>
</tr>
<tr>
<td>user?</td>
<td><a href="#user">User</a></td>
<td>User that won the prize in the giveaway if any; for Telegram Premium giveaways only</td>
</tr>
<tr>
<td>prize_star_count?</td>
<td>Integer</td>
<td>The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only</td>
</tr>
<tr>
<td>is_unclaimed?</td>
<td>True</td>
<td>_True_, if the giveaway was completed, but there was no user to win the prize</td>
</tr>
}
/**
 * <p>This object contains information about a chat boost.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatboost}
 */
export interface ChatBoost {
<tr>
<td>boost_id</td>
<td>String</td>
<td>Unique identifier of the boost</td>
</tr>
<tr>
<td>add_date</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the chat was boosted</td>
</tr>
<tr>
<td>expiration_date</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the boost will automatically expire, unless the booster&#39;s Telegram Premium subscription is prolonged</td>
</tr>
<tr>
<td>source</td>
<td><a href="#chatboostsource">ChatBoostSource</a></td>
<td>Source of the added boost</td>
</tr>
}
/**
 * <p>This object represents a boost added to a chat or changed.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatboostupdated}
 */
export interface ChatBoostUpdated {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat which was boosted</td>
</tr>
<tr>
<td>boost</td>
<td><a href="#chatboost">ChatBoost</a></td>
<td>Information about the chat boost</td>
</tr>
}
/**
 * <p>This object represents a boost removed from a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#chatboostremoved}
 */
export interface ChatBoostRemoved {
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Chat which was boosted</td>
</tr>
<tr>
<td>boost_id</td>
<td>String</td>
<td>Unique identifier of the boost</td>
</tr>
<tr>
<td>remove_date</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the boost was removed</td>
</tr>
<tr>
<td>source</td>
<td><a href="#chatboostsource">ChatBoostSource</a></td>
<td>Source of the removed boost</td>
</tr>
}
/**
 * <p>This object represents a list of boosts added to a chat by a user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#userchatboosts}
 */
export interface UserChatBoosts {
<tr>
<td>boosts</td>
<td>Array of <a href="#chatboost">ChatBoost</a></td>
<td>The list of boosts added to the chat by the user</td>
</tr>
}
/**
 * <p>Represents the rights of a business bot.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#businessbotrights}
 */
export interface BusinessBotRights {
<tr>
<td>can_reply?</td>
<td>True</td>
<td>_True_, if the bot can send and edit messages in the private chats that had incoming messages in the last 24 hours</td>
</tr>
<tr>
<td>can_read_messages?</td>
<td>True</td>
<td>_True_, if the bot can mark incoming private messages as read</td>
</tr>
<tr>
<td>can_delete_sent_messages?</td>
<td>True</td>
<td>_True_, if the bot can delete messages sent by the bot</td>
</tr>
<tr>
<td>can_delete_all_messages?</td>
<td>True</td>
<td>_True_, if the bot can delete all private messages in managed chats</td>
</tr>
<tr>
<td>can_edit_name?</td>
<td>True</td>
<td>_True_, if the bot can edit the first and last name of the business account</td>
</tr>
<tr>
<td>can_edit_bio?</td>
<td>True</td>
<td>_True_, if the bot can edit the bio of the business account</td>
</tr>
<tr>
<td>can_edit_profile_photo?</td>
<td>True</td>
<td>_True_, if the bot can edit the profile photo of the business account</td>
</tr>
<tr>
<td>can_edit_username?</td>
<td>True</td>
<td>_True_, if the bot can edit the username of the business account</td>
</tr>
<tr>
<td>can_change_gift_settings?</td>
<td>True</td>
<td>_True_, if the bot can change the privacy settings pertaining to gifts for the business account</td>
</tr>
<tr>
<td>can_view_gifts_and_stars?</td>
<td>True</td>
<td>_True_, if the bot can view gifts and the amount of Telegram Stars owned by the business account</td>
</tr>
<tr>
<td>can_convert_gifts_to_stars?</td>
<td>True</td>
<td>_True_, if the bot can convert regular gifts owned by the business account to Telegram Stars</td>
</tr>
<tr>
<td>can_transfer_and_upgrade_gifts?</td>
<td>True</td>
<td>_True_, if the bot can transfer and upgrade gifts owned by the business account</td>
</tr>
<tr>
<td>can_transfer_stars?</td>
<td>True</td>
<td>_True_, if the bot can transfer Telegram Stars received by the business account to its own account, or use them to upgrade and transfer gifts</td>
</tr>
<tr>
<td>can_manage_stories?</td>
<td>True</td>
<td>_True_, if the bot can post, edit and delete stories on behalf of the business account</td>
</tr>
}
/**
 * <p>Describes the connection of the bot with a business account.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#businessconnection}
 */
export interface BusinessConnection {
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Business account user that created the business connection</td>
</tr>
<tr>
<td>user_chat_id</td>
<td>Integer</td>
<td>Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the connection was established in Unix time</td>
</tr>
<tr>
<td>rights?</td>
<td><a href="#businessbotrights">BusinessBotRights</a></td>
<td>Rights of the business bot</td>
</tr>
<tr>
<td>is_enabled</td>
<td>Boolean</td>
<td>_True_, if the connection is active</td>
</tr>
}
/**
 * <p>This object is received when messages are deleted from a connected business account.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#businessmessagesdeleted}
 */
export interface BusinessMessagesDeleted {
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Information about a chat in the business account. The bot may not have access to the chat or the corresponding user.</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>The list of identifiers of deleted messages in the chat of the business account</td>
</tr>
}
/**
 * <p>Describes why a request was unsuccessful.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#responseparameters}
 */
export interface ResponseParameters {
<tr>
<td>migrate_to_chat_id?</td>
<td>Integer</td>
<td>The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.</td>
</tr>
<tr>
<td>retry_after?</td>
<td>Integer</td>
<td>In case of exceeding flood control, the number of seconds left to wait before the request can be repeated</td>
</tr>
}
/**
 * <p>This object represents the content of a media message to be sent. It should be one of</p>
 * - InputMediaAnimation
 * - InputMediaDocument
 * - InputMediaAudio
 * - InputMediaPhoto
 * - InputMediaVideo
 *
 * @see {@link https://core.telegram.org/bots/api#inputmedia}
 */
export type InputMedia =
 | InputMediaAnimation
 | InputMediaDocument
 | InputMediaAudio
 | InputMediaPhoto
 | InputMediaVideo
 /**
  * <p>Represents a photo to be sent.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputmediaphoto}
 */
export interface InputMediaPhoto {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _photo_</td>
</tr>
<tr>
<td>media</td>
<td>String</td>
<td>File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the photo to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler?</td>
<td>Boolean</td>
<td>Pass _True_ if the photo needs to be covered with a spoiler animation</td>
</tr>
}
/**
 * <p>Represents a video to be sent.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputmediavideo}
 */
export interface InputMediaVideo {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _video_</td>
</tr>
<tr>
<td>media</td>
<td>String</td>
<td>File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>thumbnail?</td>
<td>String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>cover?</td>
<td>String</td>
<td>Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>start_timestamp?</td>
<td>Integer</td>
<td>Start timestamp for the video in the message</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the video to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>width?</td>
<td>Integer</td>
<td>Video width</td>
</tr>
<tr>
<td>height?</td>
<td>Integer</td>
<td>Video height</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Video duration in seconds</td>
</tr>
<tr>
<td>supports_streaming?</td>
<td>Boolean</td>
<td>Pass _True_ if the uploaded video is suitable for streaming</td>
</tr>
<tr>
<td>has_spoiler?</td>
<td>Boolean</td>
<td>Pass _True_ if the video needs to be covered with a spoiler animation</td>
</tr>
}
/**
 * <p>Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputmediaanimation}
 */
export interface InputMediaAnimation {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _animation_</td>
</tr>
<tr>
<td>media</td>
<td>String</td>
<td>File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>thumbnail?</td>
<td>String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the animation to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the animation caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>width?</td>
<td>Integer</td>
<td>Animation width</td>
</tr>
<tr>
<td>height?</td>
<td>Integer</td>
<td>Animation height</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Animation duration in seconds</td>
</tr>
<tr>
<td>has_spoiler?</td>
<td>Boolean</td>
<td>Pass _True_ if the animation needs to be covered with a spoiler animation</td>
</tr>
}
/**
 * <p>Represents an audio file to be treated as music to be sent.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputmediaaudio}
 */
export interface InputMediaAudio {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _audio_</td>
</tr>
<tr>
<td>media</td>
<td>String</td>
<td>File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>thumbnail?</td>
<td>String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the audio to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Duration of the audio in seconds</td>
</tr>
<tr>
<td>performer?</td>
<td>String</td>
<td>Performer of the audio</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title of the audio</td>
</tr>
}
/**
 * <p>Represents a general file to be sent.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputmediadocument}
 */
export interface InputMediaDocument {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _document_</td>
</tr>
<tr>
<td>media</td>
<td>String</td>
<td>File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>thumbnail?</td>
<td>String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the document to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>disable_content_type_detection?</td>
<td>Boolean</td>
<td>Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always _True_, if the document is sent as part of an album.</td>
</tr>
}
/**
 * <p>This object represents the contents of a file to be uploaded.</p>
 * 
 * @see {@link https://core.telegram.org/bots/api#inputfile}
 */
export class InputFile {}
/**
 * <p>This object describes the paid media to be sent. Currently, it can be one of</p>
 * - InputPaidMediaPhoto
 * - InputPaidMediaVideo
 *
 * @see {@link https://core.telegram.org/bots/api#inputpaidmedia}
 */
export type InputPaidMedia =
 | InputPaidMediaPhoto
 | InputPaidMediaVideo
 /**
  * <p>The paid media to send is a photo.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputpaidmediaphoto}
 */
export interface InputPaidMediaPhoto {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the media, must be _photo_</td>
</tr>
<tr>
<td>media</td>
<td>String</td>
<td>File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
}
/**
 * <p>The paid media to send is a video.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputpaidmediavideo}
 */
export interface InputPaidMediaVideo {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the media, must be _video_</td>
</tr>
<tr>
<td>media</td>
<td>String</td>
<td>File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>thumbnail?</td>
<td>String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>cover?</td>
<td>String</td>
<td>Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>start_timestamp?</td>
<td>Integer</td>
<td>Start timestamp for the video in the message</td>
</tr>
<tr>
<td>width?</td>
<td>Integer</td>
<td>Video width</td>
</tr>
<tr>
<td>height?</td>
<td>Integer</td>
<td>Video height</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Video duration in seconds</td>
</tr>
<tr>
<td>supports_streaming?</td>
<td>Boolean</td>
<td>Pass _True_ if the uploaded video is suitable for streaming</td>
</tr>
}
/**
 * <p>This object describes a profile photo to set. Currently, it can be one of</p>
 * - InputProfilePhotoStatic
 * - InputProfilePhotoAnimated
 *
 * @see {@link https://core.telegram.org/bots/api#inputprofilephoto}
 */
export type InputProfilePhoto =
 | InputProfilePhotoStatic
 | InputProfilePhotoAnimated
 /**
  * <p>A static profile photo in the .JPG format.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputprofilephotostatic}
 */
export interface InputProfilePhotoStatic {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the profile photo, must be _static_</td>
</tr>
<tr>
<td>photo</td>
<td>String</td>
<td>The static profile photo. Profile photos can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the photo was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
}
/**
 * <p>An animated profile photo in the MPEG4 format.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputprofilephotoanimated}
 */
export interface InputProfilePhotoAnimated {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the profile photo, must be _animated_</td>
</tr>
<tr>
<td>animation</td>
<td>String</td>
<td>The animated profile photo. Profile photos can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the photo was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>main_frame_timestamp?</td>
<td>Float</td>
<td>Timestamp in seconds of the frame that will be used as the static profile photo. Defaults to 0.0.</td>
</tr>
}
/**
 * <p>This object describes the content of a story to post. Currently, it can be one of</p>
 * - InputStoryContentPhoto
 * - InputStoryContentVideo
 *
 * @see {@link https://core.telegram.org/bots/api#inputstorycontent}
 */
export type InputStoryContent =
 | InputStoryContentPhoto
 | InputStoryContentVideo
 /**
  * <p>Describes a photo to post as a story.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputstorycontentphoto}
 */
export interface InputStoryContentPhoto {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the content, must be _photo_</td>
</tr>
<tr>
<td>photo</td>
<td>String</td>
<td>The photo to post as a story. The photo must be of the size 1080x1920 and must not exceed 10 MB. The photo can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the photo was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
}
/**
 * <p>Describes a video to post as a story.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputstorycontentvideo}
 */
export interface InputStoryContentVideo {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the content, must be _video_</td>
</tr>
<tr>
<td>video</td>
<td>String</td>
<td>The video to post as a story. The video must be of the size 720x1280, streamable, encoded with H.265 codec, with key frames added each second in the MPEG4 format, and must not exceed 30 MB. The video can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the video was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>duration?</td>
<td>Float</td>
<td>Precise duration of the video in seconds; 0-60</td>
</tr>
<tr>
<td>cover_frame_timestamp?</td>
<td>Float</td>
<td>Timestamp in seconds of the frame that will be used as the static cover for the story. Defaults to 0.0.</td>
</tr>
<tr>
<td>is_animation?</td>
<td>Boolean</td>
<td>Pass _True_ if the video has no sound</td>
</tr>
}

// === AVAILABLE METHODS ===
  /**
   * <p>A simple method for testing your bot&#39;s authentication token. Requires no parameters. Returns basic information about the bot in form of a <a href="#user">User</a> object.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getme}
   */
  getMe(args: Empty): User;
  /**
   * <p>Use this method to log out from the cloud Bot API server before launching the bot locally. You **must** log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns _True_ on success. Requires no parameters.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#logout}
   */
  logOut(args: Empty): true;
  /**
   * <p>Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn&#39;t launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns _True_ on success. Requires no parameters.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#close}
   */
  close(args: Empty): true;
export interface ApiMethods {
  /**
   * <p>Use this method to send text messages. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendmessage}
   */
  sendMessage({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Text of the message to be sent, 1-4096 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in message text, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>link_preview_options?</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Link preview generation options for the message</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
/**
 * <p>The Bot API supports basic formatting for messages. You can use bold, italic, underlined, strikethrough, spoiler text, block quotations as well as inline links and pre-formatted code in your bots&#39; messages. Telegram clients will render them accordingly. You can specify text entities directly, or use markdown-style or HTML-style formatting.</p>
 * <p>Note that Telegram clients will display an **alert** to the user before opening an inline link (&#39;Open this link?&#39; together with the full URL).</p>
 * <p>Message entities can be nested, providing following restrictions are met:<br>- If two entities have common characters, then one of them is fully contained inside another.<br>- _bold_, _italic_, _underline_, _strikethrough_, and _spoiler_ entities can contain and can be part of any other entities, except _pre_ and _code_.<br>- _blockquote_ and _expandable_blockquote_ entities can&#39;t be nested.<br>- All other entities can&#39;t contain each other.</p>
 * <p>Links `tg://user?id=&lt;user_id&gt;` can be used to mention a user by their identifier without using a username. Please note:</p>
 * <ul>
 * <li>These links will work **only** if they are used inside an inline link or in an inline keyboard button. For example, they will not work, when used in a message text.</li>
 * <li>Unless the user is a member of the chat where they were mentioned, these mentions are only guaranteed to work if the user has contacted the bot in private in the past or has sent a callback query to the bot via an inline button and doesn&#39;t have Forwarded Messages privacy enabled for the bot.</li>
 * </ul>
 * <p>You can find the list of programming and markup languages for which syntax highlighting is supported at <a href="https://github.com/TelegramMessenger/libprisma#supported-languages">libprisma#supported-languages</a>.</p>
 * <h6><a class="anchor" name="markdownv2-style" href="#markdownv2-style"><i class="anchor-icon"></i></a>MarkdownV2 style</h6>
 * <p>To use this mode, pass _MarkdownV2_ in the _parse_mode_ field. Use the following syntax in your message:</p>
 * <pre>`*bold \*text*
 * _italic \*text_
 * __underline__
 * ~strikethrough~
 * ||spoiler||
 * *bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
 * [inline URL](http://www.example.com/)
 * [inline mention of a user](tg://user?id=123456789)
 * ![<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />](tg://emoji?id=5368324170671202286)
 * `inline fixed-width code`
 * ```
 * pre-formatted fixed-width code block
 * ```
 * ```python
 * pre-formatted fixed-width code block written in the Python programming language
 * ```
 * &gt;Block quotation started
 * &gt;Block quotation continued
 * &gt;Block quotation continued
 * &gt;Block quotation continued
 * &gt;The last line of the block quotation
 * **&gt;The expandable block quotation started right after the previous block quotation
 * &gt;It is separated from the previous block quotation by an empty bold entity
 * &gt;Expandable block quotation continued
 * &gt;Hidden by default part of the expandable block quotation started
 * &gt;Expandable block quotation continued
 * &gt;The last line of the expandable block quotation with the expandability mark||`</pre>
 * <p>Please note:</p>
 * <ul>
 * <li>Any character with code between 1 and 126 inclusively can be escaped anywhere with a preceding &#39;\&#39; character, in which case it is treated as an ordinary character and not a part of the markup. This implies that &#39;\&#39; character usually must be escaped with a preceding &#39;\&#39; character.</li>
 * <li>Inside `pre` and `code` entities, all &#39;`&#39; and &#39;\&#39; characters must be escaped with a preceding &#39;\&#39; character.</li>
 * <li>Inside the `(...)` part of the inline link and custom emoji definition, all &#39;)&#39; and &#39;\&#39; must be escaped with a preceding &#39;\&#39; character.</li>
 * <li>In all other places characters &#39;_&#39;, &#39;*&#39;, &#39;[&#39;, &#39;]&#39;, &#39;(&#39;, &#39;)&#39;, &#39;~&#39;, &#39;`&#39;, &#39;&gt;&#39;, &#39;#&#39;, &#39;+&#39;, &#39;-&#39;, &#39;=&#39;, &#39;|&#39;, &#39;{&#39;, &#39;}&#39;, &#39;.&#39;, &#39;!&#39; must be escaped with the preceding character &#39;\&#39;.</li>
 * <li>In case of ambiguity between `italic` and `underline` entities `__` is always greadily treated from left to right as beginning or end of an `underline` entity, so instead of `___italic underline___` use `___italic underline_**__`, adding an empty bold entity as a separator.</li>
 * <li>A valid emoji must be provided as an alternative value for the custom emoji. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the **emoji** field of the custom emoji <a href="#sticker">sticker</a>.</li>
 * <li>Custom emoji entities can only be used by bots that purchased additional usernames on <a href="https://fragment.com">Fragment</a>.</li>
 * </ul>
 * <h6><a class="anchor" name="html-style" href="#html-style"><i class="anchor-icon"></i></a>HTML style</h6>
 * <p>To use this mode, pass _HTML_ in the _parse_mode_ field. The following tags are currently supported:</p>
 * <pre>`&lt;b&gt;bold&lt;/b&gt;, &lt;strong&gt;bold&lt;/strong&gt;
 * &lt;i&gt;italic&lt;/i&gt;, &lt;em&gt;italic&lt;/em&gt;
 * &lt;u&gt;underline&lt;/u&gt;, &lt;ins&gt;underline&lt;/ins&gt;
 * &lt;s&gt;strikethrough&lt;/s&gt;, &lt;strike&gt;strikethrough&lt;/strike&gt;, &lt;del&gt;strikethrough&lt;/del&gt;
 * &lt;span class=&quot;tg-spoiler&quot;&gt;spoiler&lt;/span&gt;, &lt;tg-spoiler&gt;spoiler&lt;/tg-spoiler&gt;
 * &lt;b&gt;bold &lt;i&gt;italic bold &lt;s&gt;italic bold strikethrough &lt;span class=&quot;tg-spoiler&quot;&gt;italic bold strikethrough spoiler&lt;/span&gt;&lt;/s&gt; &lt;u&gt;underline italic bold&lt;/u&gt;&lt;/i&gt; bold&lt;/b&gt;
 * &lt;a href=&quot;http://www.example.com/&quot;&gt;inline URL&lt;/a&gt;
 * &lt;a href=&quot;tg://user?id=123456789&quot;&gt;inline mention of a user&lt;/a&gt;
 * &lt;tg-emoji emoji-id=&quot;5368324170671202286&quot;&gt;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />&lt;/tg-emoji&gt;
 * &lt;code&gt;inline fixed-width code&lt;/code&gt;
 * &lt;pre&gt;pre-formatted fixed-width code block&lt;/pre&gt;
 * &lt;pre&gt;&lt;code class=&quot;language-python&quot;&gt;pre-formatted fixed-width code block written in the Python programming language&lt;/code&gt;&lt;/pre&gt;
 * &lt;blockquote&gt;Block quotation started\nBlock quotation continued\nThe last line of the block quotation&lt;/blockquote&gt;
 * &lt;blockquote expandable&gt;Expandable block quotation started\nExpandable block quotation continued\nExpandable block quotation continued\nHidden by default part of the block quotation started\nExpandable block quotation continued\nThe last line of the block quotation&lt;/blockquote&gt;`</pre>
 * <p>Please note:</p>
 * <ul>
 * <li>Only the tags mentioned above are currently supported.</li>
 * <li>All `&lt;`, `&gt;` and `&amp;` symbols that are not a part of a tag or an HTML entity must be replaced with the corresponding HTML entities (`&lt;` with `&amp;lt;`, `&gt;` with `&amp;gt;` and `&amp;` with `&amp;amp;`).</li>
 * <li>All numerical HTML entities are supported.</li>
 * <li>The API currently supports only the following named HTML entities: `&amp;lt;`, `&amp;gt;`, `&amp;amp;` and `&amp;quot;`.</li>
 * <li>Use nested `pre` and `code` tags, to define programming language for `pre` entity.</li>
 * <li>Programming language can&#39;t be specified for standalone `code` tags.</li>
 * <li>A valid emoji must be used as the content of the `tg-emoji` tag. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the **emoji** field of the custom emoji <a href="#sticker">sticker</a>.</li>
 * <li>Custom emoji entities can only be used by bots that purchased additional usernames on <a href="https://fragment.com">Fragment</a>.</li>
 * </ul>
 * <h6><a class="anchor" name="markdown-style" href="#markdown-style"><i class="anchor-icon"></i></a>Markdown style</h6>
 * <p>This is a legacy mode, retained for backward compatibility. To use this mode, pass _Markdown_ in the _parse_mode_ field. Use the following syntax in your message:</p>
 * <pre>`*bold text*
 * _italic text_
 * [inline URL](http://www.example.com/)
 * [inline mention of a user](tg://user?id=123456789)
 * `inline fixed-width code`
 * ```
 * pre-formatted fixed-width code block
 * ```
 * ```python
 * pre-formatted fixed-width code block written in the Python programming language
 * ````</pre>
 * <p>Please note:</p>
 * <ul>
 * <li>Entities must not be nested, use parse mode <a href="#markdownv2-style">MarkdownV2</a> instead.</li>
 * <li>There is no way to specify “underline”, “strikethrough”, “spoiler”, “blockquote”, “expandable_blockquote” and “custom_emoji” entities, use parse mode <a href="#markdownv2-style">MarkdownV2</a> instead.</li>
 * <li>To escape characters &#39;_&#39;, &#39;*&#39;, &#39;`&#39;, &#39;[&#39; outside of an entity, prepend the characters &#39;\&#39; before them.</li>
 * <li>Escaping inside entities is not allowed, so entity must be closed first and reopened again: use `_snake_\__case_` for italic `snake_case` and `*2*\**2=4*` for bold `2*2=4`.</li>
 * </ul>
 *
 * @see {@link https://core.telegram.org/bots/api#formatting-options}
 */
type ParseMode = "MarkdownV2" | "HTML" | "Markdown";
export interface ApiMethods {
  /**
   * <p>Use this method to forward messages of any kind. Service messages and messages with protected content can&#39;t be forwarded. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#forwardmessage}
   */
  forwardMessage({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)</td>
</tr>
<tr>
<td>video_start_timestamp?</td>
<td>Integer</td>
<td>New start timestamp for the forwarded video in the message</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the forwarded message from forwarding and saving</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Message identifier in the chat specified in _from_chat_id_</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to forward multiple messages of any kind. If some of the specified messages can&#39;t be found or forwarded, they are skipped. Service messages and messages with protected content can&#39;t be forwarded. Album grouping is kept for forwarded messages. On success, an array of <a href="#messageid">MessageId</a> of the sent messages is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#forwardmessages}
   */
  forwardMessages({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>A JSON-serialized list of 1-100 identifiers of messages in the chat _from_chat_id_ to forward. The identifiers must be specified in a strictly increasing order.</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the messages <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the forwarded messages from forwarding and saving</td>
</tr>
  }): MessageId;
}
export interface ApiMethods {
  /**
   * <p>Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can&#39;t be copied. A quiz <a href="#poll">poll</a> can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method <a href="#forwardmessage">forwardMessage</a>, but the copied message doesn&#39;t have a link to the original message. Returns the <a href="#messageid">MessageId</a> of the sent message on success.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#copymessage}
   */
  copyMessage({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Message identifier in the chat specified in _from_chat_id_</td>
</tr>
<tr>
<td>video_start_timestamp?</td>
<td>Integer</td>
<td>New start timestamp for the copied video in the message</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the new caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media. Ignored if a new caption isn&#39;t specified.</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): MessageId;
}
export interface ApiMethods {
  /**
   * <p>Use this method to copy messages of any kind. If some of the specified messages can&#39;t be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can&#39;t be copied. A quiz <a href="#poll">poll</a> can be copied only if the value of the field _correct_option_id_ is known to the bot. The method is analogous to the method <a href="#forwardmessages">forwardMessages</a>, but the copied messages don&#39;t have a link to the original message. Album grouping is kept for copied messages. On success, an array of <a href="#messageid">MessageId</a> of the sent messages is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#copymessages}
   */
  copyMessages({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>A JSON-serialized list of 1-100 identifiers of messages in the chat _from_chat_id_ to copy. The identifiers must be specified in a strictly increasing order.</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the messages <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent messages from forwarding and saving</td>
</tr>
<tr>
<td>remove_caption?</td>
<td>Boolean</td>
<td>Pass _True_ to copy the messages without their captions</td>
</tr>
  }): MessageId[];
}
export interface ApiMethods {
  /**
   * <p>Use this method to send photos. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendphoto}
   */
  sendPhoto({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>photo</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo&#39;s width and height must not exceed 10000 in total. Width and height ratio must be at most 20. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Photo caption (may also be used when resending photos by _file_id_), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler?</td>
<td>Boolean</td>
<td>Pass _True_ if the photo needs to be covered with a spoiler animation</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent <a href="#message">Message</a> is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.</p>
   * <p>For sending voice messages, use the <a href="#sendvoice">sendVoice</a> method instead.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendaudio}
   */
  sendAudio({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>audio</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Audio caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Duration of the audio in seconds</td>
</tr>
<tr>
<td>performer?</td>
<td>String</td>
<td>Performer</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Track name</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send general files. On success, the sent <a href="#message">Message</a> is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#senddocument}
   */
  sendDocument({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>document</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Document caption (may also be used when resending documents by _file_id_), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>disable_content_type_detection?</td>
<td>Boolean</td>
<td>Disables automatic server-side content type detection for files uploaded using multipart/form-data</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as <a href="#document">Document</a>). On success, the sent <a href="#message">Message</a> is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendvideo}
   */
  sendVideo({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>video</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Duration of sent video in seconds</td>
</tr>
<tr>
<td>width?</td>
<td>Integer</td>
<td>Video width</td>
</tr>
<tr>
<td>height?</td>
<td>Integer</td>
<td>Video height</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>cover?</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>start_timestamp?</td>
<td>Integer</td>
<td>Start timestamp for the video in the message</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Video caption (may also be used when resending videos by _file_id_), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler?</td>
<td>Boolean</td>
<td>Pass _True_ if the video needs to be covered with a spoiler animation</td>
</tr>
<tr>
<td>supports_streaming?</td>
<td>Boolean</td>
<td>Pass _True_ if the uploaded video is suitable for streaming</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent <a href="#message">Message</a> is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendanimation}
   */
  sendAnimation({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>animation</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Duration of sent animation in seconds</td>
</tr>
<tr>
<td>width?</td>
<td>Integer</td>
<td>Animation width</td>
</tr>
<tr>
<td>height?</td>
<td>Integer</td>
<td>Animation height</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Animation caption (may also be used when resending animation by _file_id_), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the animation caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler?</td>
<td>Boolean</td>
<td>Pass _True_ if the animation needs to be covered with a spoiler animation</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as <a href="#audio">Audio</a> or <a href="#document">Document</a>). On success, the sent <a href="#message">Message</a> is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendvoice}
   */
  sendVoice({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>voice</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Voice message caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the voice message caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Duration of the voice message in seconds</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>As of <a href="https://telegram.org/blog/video-messages-and-telescope">v.4.0</a>, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendvideonote}
   */
  sendVideoNote({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>video_note</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Sending video notes by a URL is currently unsupported</td>
</tr>
<tr>
<td>duration?</td>
<td>Integer</td>
<td>Duration of sent video in seconds</td>
</tr>
<tr>
<td>length?</td>
<td>Integer</td>
<td>Video width and height, i.e. diameter of the video message</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send paid media. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendpaidmedia}
   */
  sendPaidMedia({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat&#39;s balance. Otherwise, they will be credited to the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>The number of Telegram Stars that must be paid to buy access to the media; 1-10000</td>
</tr>
<tr>
<td>media</td>
<td>Array of <a href="#inputpaidmedia">InputPaidMedia</a></td>
<td>A JSON-serialized array describing the media to be sent; up to 10 items</td>
</tr>
<tr>
<td>payload?</td>
<td>String</td>
<td>Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes.</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Media caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the media caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of <a href="#message">Message</a> objects that were sent is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendmediagroup}
   */
  sendMediaGroup({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat</td>
</tr>
<tr>
<td>media</td>
<td>Array of <a href="#inputmediaaudio">InputMediaAudio</a>, <a href="#inputmediadocument">InputMediaDocument</a>, <a href="#inputmediaphoto">InputMediaPhoto</a> and <a href="#inputmediavideo">InputMediaVideo</a></td>
<td>A JSON-serialized array describing messages to be sent, must include 2-10 items</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends messages <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent messages from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
  }): Message[];
}
export interface ApiMethods {
  /**
   * <p>Use this method to send point on the map. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendlocation}
   */
  sendLocation({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Latitude of the location</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Longitude of the location</td>
</tr>
<tr>
<td>horizontal_accuracy?</td>
<td>Float</td>
<td>The radius of uncertainty for the location, measured in meters; 0-1500</td>
</tr>
<tr>
<td>live_period?</td>
<td>Integer</td>
<td>Period in seconds during which the location will be updated (see <a href="https://telegram.org/blog/live-locations">Live Locations</a>, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely.</td>
</tr>
<tr>
<td>heading?</td>
<td>Integer</td>
<td>For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.</td>
</tr>
<tr>
<td>proximity_alert_radius?</td>
<td>Integer</td>
<td>For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send information about a venue. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendvenue}
   */
  sendVenue({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Latitude of the venue</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Longitude of the venue</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Name of the venue</td>
</tr>
<tr>
<td>address</td>
<td>String</td>
<td>Address of the venue</td>
</tr>
<tr>
<td>foursquare_id?</td>
<td>String</td>
<td>Foursquare identifier of the venue</td>
</tr>
<tr>
<td>foursquare_type?</td>
<td>String</td>
<td>Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)</td>
</tr>
<tr>
<td>google_place_id?</td>
<td>String</td>
<td>Google Places identifier of the venue</td>
</tr>
<tr>
<td>google_place_type?</td>
<td>String</td>
<td>Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send phone contacts. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendcontact}
   */
  sendContact({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>phone_number</td>
<td>String</td>
<td>Contact&#39;s phone number</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>Contact&#39;s first name</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>Contact&#39;s last name</td>
</tr>
<tr>
<td>vcard?</td>
<td>String</td>
<td>Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a>, 0-2048 bytes</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send a native poll. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendpoll}
   */
  sendPoll({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Polls can&#39;t be sent to channel direct messages chats.</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>question</td>
<td>String</td>
<td>Poll question, 1-300 characters</td>
</tr>
<tr>
<td>question_parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the question. See <a href="#formatting-options">formatting options</a> for more details. Currently, only custom emoji entities are allowed</td>
</tr>
<tr>
<td>question_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of _question_parse_mode_</td>
</tr>
<tr>
<td>options</td>
<td>Array of <a href="#inputpolloption">InputPollOption</a></td>
<td>A JSON-serialized list of 2-12 answer options</td>
</tr>
<tr>
<td>is_anonymous?</td>
<td>Boolean</td>
<td>_True_, if the poll needs to be anonymous, defaults to _True_</td>
</tr>
<tr>
<td>type?</td>
<td>String</td>
<td>Poll type, “quiz” or “regular”, defaults to “regular”</td>
</tr>
<tr>
<td>allows_multiple_answers?</td>
<td>Boolean</td>
<td>_True_, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to _False_</td>
</tr>
<tr>
<td>correct_option_id?</td>
<td>Integer</td>
<td>0-based identifier of the correct answer option, required for polls in quiz mode</td>
</tr>
<tr>
<td>explanation?</td>
<td>String</td>
<td>Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing</td>
</tr>
<tr>
<td>explanation_parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the explanation. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>explanation_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of _explanation_parse_mode_</td>
</tr>
<tr>
<td>open_period?</td>
<td>Integer</td>
<td>Amount of time in seconds the poll will be active after creation, 5-600. Can&#39;t be used together with _close_date_.</td>
</tr>
<tr>
<td>close_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can&#39;t be used together with _open_period_.</td>
</tr>
<tr>
<td>is_closed?</td>
<td>Boolean</td>
<td>Pass _True_ if the poll needs to be immediately closed. This can be useful for poll preview.</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send a checklist on behalf of a connected business account. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendchecklist}
   */
  sendChecklist({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Unique identifier for the target chat</td>
</tr>
<tr>
<td>checklist</td>
<td><a href="#inputchecklist">InputChecklist</a></td>
<td>A JSON-serialized object for the checklist to send</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message silently. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>A JSON-serialized object for description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for an inline keyboard</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to send an animated emoji that will display a random value. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#senddice}
   */
  sendDice({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>emoji?</td>
<td>String</td>
<td>Emoji on which the dice throw animation is based. Currently, must be one of “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EAF.png" width="20" height="20" alt="🎯" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F80.png" width="20" height="20" alt="🏀" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/E29ABD.png" width="20" height="20" alt="⚽" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB3.png" width="20" height="20" alt="🎳" />”, or “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB0.png" width="20" height="20" alt="🎰" />”. Dice can have values 1-6 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EAF.png" width="20" height="20" alt="🎯" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB3.png" width="20" height="20" alt="🎳" />”, values 1-5 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F80.png" width="20" height="20" alt="🏀" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/E29ABD.png" width="20" height="20" alt="⚽" />”, and values 1-64 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB0.png" width="20" height="20" alt="🎰" />”. Defaults to “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method when you need to tell the user that something is happening on the bot&#39;s side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns _True_ on success.</p>
   * <blockquote>
   * <p>Example: The <a href="https://t.me/imagebot">ImageBot</a> needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use <a href="#sendchataction">sendChatAction</a> with _action_ = _upload_photo_. The user will see a “sending photo” status for the bot.</p>
   * </blockquote>
   * <p>We only recommend using this method when a response from the bot will take a **noticeable** amount of time to arrive.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendchataction}
   */
  sendChatAction({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the action will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren&#39;t supported.</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread; for supergroups only</td>
</tr>
<tr>
<td>action</td>
<td>String</td>
<td>Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for <a href="#sendmessage">text messages</a>, _upload_photo_ for <a href="#sendphoto">photos</a>, _record_video_ or _upload_video_ for <a href="#sendvideo">videos</a>, _record_voice_ or _upload_voice_ for <a href="#sendvoice">voice notes</a>, _upload_document_ for <a href="#senddocument">general files</a>, _choose_sticker_ for <a href="#sendsticker">stickers</a>, _find_location_ for <a href="#sendlocation">location data</a>, _record_video_note_ or _upload_video_note_ for <a href="#sendvideonote">video notes</a>.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
   * <p>Use this method to change the chosen reactions on a message. Service messages of some types can&#39;t be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can&#39;t use paid reactions. Returns _True_ on success.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#setmessagereaction}
   */
  setMessageReaction({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.</td>
</tr>
<tr>
<td>reaction?</td>
<td>Array of <a href="#reactiontype">ReactionType</a></td>
<td>A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can&#39;t be used by bots.</td>
</tr>
<tr>
<td>is_big?</td>
<td>Boolean</td>
<td>Pass _True_ to set the reaction with a big animation</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
   * <p>Use this method to get a list of profile pictures for a user. Returns a <a href="#userprofilephotos">UserProfilePhotos</a> object.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
   */
  getUserProfilePhotos({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>offset?</td>
<td>Integer</td>
<td>Sequential number of the first photo to be returned. By default, all photos are returned.</td>
</tr>
<tr>
<td>limit?</td>
<td>Integer</td>
<td>Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.</td>
</tr>
  }): UserProfilePhotos;
}
export interface ApiMethods {
  /**
   * <p>Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method <a href="/bots/webapps#initializing-mini-apps">requestEmojiStatusAccess</a>. Returns _True_ on success.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#setuseremojistatus}
   */
  setUserEmojiStatus({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>emoji_status_custom_emoji_id?</td>
<td>String</td>
<td>Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status.</td>
</tr>
<tr>
<td>emoji_status_expiration_date?</td>
<td>Integer</td>
<td>Expiration date of the emoji status, if any</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
   * <p>Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a <a href="#file">File</a> object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;`, where `&lt;file_path&gt;` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling <a href="#getfile">getFile</a> again.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getfile}
   */
  getFile({
<tr>
<td>file_id</td>
<td>String</td>
<td>File identifier to get information about</td>
</tr>
  }): File;
}
<p>**Note:** This function may not preserve the original file name and MIME type. You should save the file&#39;s MIME type and name (if available) when the File object is received.</p>
export interface ApiMethods {
  /**
    * <p>Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless <a href="#unbanchatmember">unbanned</a> first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#banchatmember}
    */
  banChatMember({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>until_date?</td>
<td>Integer</td>
<td>Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.</td>
</tr>
<tr>
<td>revoke_messages?</td>
<td>Boolean</td>
<td>Pass _True_ to delete all messages from the chat for the user that is being removed. If _False_, the user will be able to see messages in the group that were sent before the user was removed. Always _True_ for supergroups and channels.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don&#39;t want this, use the parameter _only_if_banned_. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
    */
  unbanChatMember({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>only_if_banned?</td>
<td>Boolean</td>
<td>Do nothing if the user is not banned</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass _True_ for all permissions to lift restrictions from a user. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#restrictchatmember}
    */
  restrictChatMember({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>permissions</td>
<td><a href="#chatpermissions">ChatPermissions</a></td>
<td>A JSON-serialized object for new user permissions</td>
</tr>
<tr>
<td>use_independent_chat_permissions?</td>
<td>Boolean</td>
<td>Pass _True_ if chat permissions are set independently. Otherwise, the _can_send_other_messages_ and _can_add_web_page_previews_ permissions will imply the _can_send_messages_, _can_send_audios_, _can_send_documents_, _can_send_photos_, _can_send_videos_, _can_send_video_notes_, and _can_send_voice_notes_ permissions; the _can_send_polls_ permission will imply the _can_send_messages_ permission.</td>
</tr>
<tr>
<td>until_date?</td>
<td>Integer</td>
<td>Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass _False_ for all boolean parameters to demote a user. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#promotechatmember}
    */
  promoteChatMember({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>is_anonymous?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator&#39;s presence in the chat is hidden</td>
</tr>
<tr>
<td>can_manage_chat?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.</td>
</tr>
<tr>
<td>can_delete_messages?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can delete messages of other users</td>
</tr>
<tr>
<td>can_manage_video_chats?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can manage video chats</td>
</tr>
<tr>
<td>can_restrict_members?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can restrict, ban or unban chat members, or access supergroup statistics</td>
</tr>
<tr>
<td>can_promote_members?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)</td>
</tr>
<tr>
<td>can_change_info?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can change chat title, photo and other settings</td>
</tr>
<tr>
<td>can_invite_users?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can invite new users to the chat</td>
</tr>
<tr>
<td>can_post_stories?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can post stories to the chat</td>
</tr>
<tr>
<td>can_edit_stories?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat&#39;s story archive</td>
</tr>
<tr>
<td>can_delete_stories?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can delete stories posted by other users</td>
</tr>
<tr>
<td>can_post_messages?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only</td>
</tr>
<tr>
<td>can_edit_messages?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can edit messages of other users and can pin messages; for channels only</td>
</tr>
<tr>
<td>can_pin_messages?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can pin messages; for supergroups only</td>
</tr>
<tr>
<td>can_manage_topics?</td>
<td>Boolean</td>
<td>Pass _True_ if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only</td>
</tr>
<tr>
<td>can_manage_direct_messages?</td>
<td>Boolean</td>
<td>Pass _True_ if the administrator can manage direct messages within the channel and decline suggested posts; for channels only</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setchatadministratorcustomtitle}
    */
  setChatAdministratorCustomTitle({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>custom_title</td>
<td>String</td>
<td>New custom title for the administrator; 0-16 characters, emoji are not allowed</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to ban a channel chat in a supergroup or a channel. Until the chat is <a href="#unbanchatsenderchat">unbanned</a>, the owner of the banned chat won&#39;t be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#banchatsenderchat}
    */
  banChatSenderChat({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>sender_chat_id</td>
<td>Integer</td>
<td>Unique identifier of the target sender chat</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#unbanchatsenderchat}
    */
  unbanChatSenderChat({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>sender_chat_id</td>
<td>Integer</td>
<td>Unique identifier of the target sender chat</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can_restrict_members_ administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setchatpermissions}
    */
  setChatPermissions({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>permissions</td>
<td><a href="#chatpermissions">ChatPermissions</a></td>
<td>A JSON-serialized object for new default chat permissions</td>
</tr>
<tr>
<td>use_independent_chat_permissions?</td>
<td>Boolean</td>
<td>Pass _True_ if chat permissions are set independently. Otherwise, the _can_send_other_messages_ and _can_add_web_page_previews_ permissions will imply the _can_send_messages_, _can_send_audios_, _can_send_documents_, _can_send_photos_, _can_send_videos_, _can_send_video_notes_, and _can_send_voice_notes_ permissions; the _can_send_polls_ permission will imply the _can_send_messages_ permission.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as _String_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#exportchatinvitelink}
    */
  exportChatInviteLink({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
  }): string;
}
<blockquote>
<p>Note: Each administrator in a chat generates their own invite links. Bots can&#39;t use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using <a href="#exportchatinvitelink">exportChatInviteLink</a> or by calling the <a href="#getchat">getChat</a> method. If your bot needs to generate a new primary invite link replacing its previous one, use <a href="#exportchatinvitelink">exportChatInviteLink</a> again.</p>
</blockquote>
export interface ApiMethods {
  /**
    * <p>Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method <a href="#revokechatinvitelink">revokeChatInviteLink</a>. Returns the new invite link as <a href="#chatinvitelink">ChatInviteLink</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#createchatinvitelink}
    */
  createChatInviteLink({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>name?</td>
<td>String</td>
<td>Invite link name; 0-32 characters</td>
</tr>
<tr>
<td>expire_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the link will expire</td>
</tr>
<tr>
<td>member_limit?</td>
<td>Integer</td>
<td>The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999</td>
</tr>
<tr>
<td>creates_join_request?</td>
<td>Boolean</td>
<td>_True_, if users joining the chat via the link need to be approved by chat administrators. If _True_, _member_limit_ can&#39;t be specified</td>
</tr>
  }): ChatInviteLink;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a <a href="#chatinvitelink">ChatInviteLink</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editchatinvitelink}
    */
  editChatInviteLink({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>invite_link</td>
<td>String</td>
<td>The invite link to edit</td>
</tr>
<tr>
<td>name?</td>
<td>String</td>
<td>Invite link name; 0-32 characters</td>
</tr>
<tr>
<td>expire_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the link will expire</td>
</tr>
<tr>
<td>member_limit?</td>
<td>Integer</td>
<td>The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999</td>
</tr>
<tr>
<td>creates_join_request?</td>
<td>Boolean</td>
<td>_True_, if users joining the chat via the link need to be approved by chat administrators. If _True_, _member_limit_ can&#39;t be specified</td>
</tr>
  }): ChatInviteLink;
}
export interface ApiMethods {
  /**
    * <p>Use this method to create a <a href="https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions">subscription invite link</a> for a channel chat. The bot must have the _can_invite_users_ administrator rights. The link can be edited using the method <a href="#editchatsubscriptioninvitelink">editChatSubscriptionInviteLink</a> or revoked using the method <a href="#revokechatinvitelink">revokeChatInviteLink</a>. Returns the new invite link as a <a href="#chatinvitelink">ChatInviteLink</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#createchatsubscriptioninvitelink}
    */
  createChatSubscriptionInviteLink({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target channel chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>name?</td>
<td>String</td>
<td>Invite link name; 0-32 characters</td>
</tr>
<tr>
<td>subscription_period</td>
<td>Integer</td>
<td>The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).</td>
</tr>
<tr>
<td>subscription_price</td>
<td>Integer</td>
<td>The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000</td>
</tr>
  }): ChatInviteLink;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit a subscription invite link created by the bot. The bot must have the _can_invite_users_ administrator rights. Returns the edited invite link as a <a href="#chatinvitelink">ChatInviteLink</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editchatsubscriptioninvitelink}
    */
  editChatSubscriptionInviteLink({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>invite_link</td>
<td>String</td>
<td>The invite link to edit</td>
</tr>
<tr>
<td>name?</td>
<td>String</td>
<td>Invite link name; 0-32 characters</td>
</tr>
  }): ChatInviteLink;
}
export interface ApiMethods {
  /**
    * <p>Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as <a href="#chatinvitelink">ChatInviteLink</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#revokechatinvitelink}
    */
  revokeChatInviteLink({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier of the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>invite_link</td>
<td>String</td>
<td>The invite link to revoke</td>
</tr>
  }): ChatInviteLink;
}
export interface ApiMethods {
  /**
    * <p>Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#approvechatjoinrequest}
    */
  approveChatJoinRequest({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can_invite_users_ administrator right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#declinechatjoinrequest}
    */
  declineChatJoinRequest({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to set a new profile photo for the chat. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setchatphoto}
    */
  setChatPhoto({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>photo</td>
<td><a href="#inputfile">InputFile</a></td>
<td>New chat photo, uploaded using multipart/form-data</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete a chat photo. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
    */
  deleteChatPhoto({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the title of a chat. Titles can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setchattitle}
    */
  setChatTitle({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>New chat title, 1-128 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setchatdescription}
    */
  setChatDescription({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>New chat description, 0-255 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the &#39;can_pin_messages&#39; right or the &#39;can_edit_messages&#39; right to pin messages in groups and channels respectively. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
    */
  pinChatMessage({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be pinned</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Identifier of a message to pin</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Pass _True_ if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the &#39;can_pin_messages&#39; right or the &#39;can_edit_messages&#39; right to unpin messages in groups and channels respectively. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
    */
  unpinChatMessage({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be unpinned</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Identifier of the message to unpin. Required if _business_connection_id_ is specified. If not specified, the most recent pinned message (by sending date) will be unpinned.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the &#39;can_pin_messages&#39; right or the &#39;can_edit_messages&#39; right to unpin all pinned messages in groups and channels respectively. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#unpinallchatmessages}
    */
  unpinAllChatMessages({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method for your bot to leave a group, supergroup or channel. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#leavechat}
    */
  leaveChat({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`). Channel direct messages chats aren&#39;t supported; leave the corresponding channel instead.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get up-to-date information about the chat. Returns a <a href="#chatfullinfo">ChatFullInfo</a> object on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getchat}
    */
  getChat({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)</td>
</tr>
  }): ChatFullInfo;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get a list of administrators in a chat, which aren&#39;t bots. Returns an Array of <a href="#chatmember">ChatMember</a> objects.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
    */
  getChatAdministrators({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)</td>
</tr>
  }): ChatMember;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the number of members in a chat. Returns _Int_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getchatmembercount}
    */
  getChatMemberCount({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)</td>
</tr>
  }): number;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a <a href="#chatmember">ChatMember</a> object on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getchatmember}
    */
  getChatMember({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
  }): ChatMember;
}
export interface ApiMethods {
  /**
    * <p>Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in <a href="#getchat">getChat</a> requests to check if the bot can use this method. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setchatstickerset}
    */
  setChatStickerSet({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>sticker_set_name</td>
<td>String</td>
<td>Name of the sticker set to be set as the group sticker set</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can_set_sticker_set_ optionally returned in <a href="#getchat">getChat</a> requests to check if the bot can use this method. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletechatstickerset}
    */
  deleteChatStickerSet({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
  }): true;
}
  /**
   * <p>Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of <a href="#sticker">Sticker</a> objects.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getforumtopiciconstickers}
   */
  getForumTopicIconStickers(args: Empty): Sticker[];
export interface ApiMethods {
  /**
    * <p>Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns information about the created topic as a <a href="#forumtopic">ForumTopic</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#createforumtopic}
    */
  createForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Topic name, 1-128 characters</td>
</tr>
<tr>
<td>icon_color?</td>
<td>Integer</td>
<td>Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F)</td>
</tr>
<tr>
<td>icon_custom_emoji_id?</td>
<td>String</td>
<td>Unique identifier of the custom emoji shown as the topic icon. Use <a href="#getforumtopiciconstickers">getForumTopicIconStickers</a> to get all allowed custom emoji identifiers.</td>
</tr>
  }): ForumTopic;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit name and icon of a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editforumtopic}
    */
  editForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
<tr>
<td>name?</td>
<td>String</td>
<td>New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept</td>
</tr>
<tr>
<td>icon_custom_emoji_id?</td>
<td>String</td>
<td>New unique identifier of the custom emoji shown as the topic icon. Use <a href="#getforumtopiciconstickers">getForumTopicIconStickers</a> to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#closeforumtopic}
    */
  closeForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#reopenforumtopic}
    */
  reopenForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete a forum topic along with all its messages in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_delete_messages_ administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deleteforumtopic}
    */
  deleteForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to clear the list of pinned messages in a forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#unpinallforumtopicmessages}
    */
  unpinAllForumTopicMessages({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit the name of the &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editgeneralforumtopic}
    */
  editGeneralForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>New topic name, 1-128 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to close an open &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#closegeneralforumtopic}
    */
  closeGeneralForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to reopen a closed &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically unhidden if it was hidden. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#reopengeneralforumtopic}
    */
  reopenGeneralForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to hide the &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. The topic will be automatically closed if it was open. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#hidegeneralforumtopic}
    */
  hideGeneralForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to unhide the &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can_manage_topics_ administrator rights. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#unhidegeneralforumtopic}
    */
  unhideGeneralForumTopic({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the _can_pin_messages_ administrator right in the supergroup. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages}
    */
  unpinAllGeneralForumTopicMessages({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to send answers to callback queries sent from <a href="/bots/features#inline-keyboards">inline keyboards</a>. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, _True_ is returned.</p>
<blockquote>
<p>Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via <a href="https://t.me/botfather">@BotFather</a> and accept the terms. Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter.</p>
</blockquote>
    *
    * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
    */
  answerCallbackQuery({
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>text?</td>
<td>String</td>
<td>Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters</td>
</tr>
<tr>
<td>show_alert?</td>
<td>Boolean</td>
<td>If _True_, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to _false_.</td>
</tr>
<tr>
<td>url?</td>
<td>String</td>
<td>URL that will be opened by the user&#39;s client. If you have created a <a href="#game">Game</a> and accepted the conditions via <a href="https://t.me/botfather">@BotFather</a>, specify the URL that opens your game - note that this will only work if the query comes from a <a href="#inlinekeyboardbutton">_callback_game_</a> button.<br><br>Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter.</td>
</tr>
<tr>
<td>cache_time?</td>
<td>Integer</td>
<td>The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a <a href="#userchatboosts">UserChatBoosts</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getuserchatboosts}
    */
  getUserChatBoosts({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the chat or username of the channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
  }): UserChatBoosts;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get information about the connection of the bot with a business account. Returns a <a href="#businessconnection">BusinessConnection</a> object on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getbusinessconnection}
    */
  getBusinessConnection({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
  }): BusinessConnection;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the list of the bot&#39;s commands. See <a href="/bots/features#commands">this manual</a> for more details about bot commands. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setmycommands}
    */
  setMyCommands({
<tr>
<td>commands</td>
<td>Array of <a href="#botcommand">BotCommand</a></td>
<td>A JSON-serialized list of bot commands to be set as the list of the bot&#39;s commands. At most 100 commands can be specified.</td>
</tr>
<tr>
<td>scope?</td>
<td><a href="#botcommandscope">BotCommandScope</a></td>
<td>A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to <a href="#botcommandscopedefault">BotCommandScopeDefault</a>.</td>
</tr>
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete the list of the bot&#39;s commands for the given scope and user language. After deletion, <a href="#determining-list-of-commands">higher level commands</a> will be shown to affected users. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletemycommands}
    */
  deleteMyCommands({
<tr>
<td>scope?</td>
<td><a href="#botcommandscope">BotCommandScope</a></td>
<td>A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to <a href="#botcommandscopedefault">BotCommandScopeDefault</a>.</td>
</tr>
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the current list of the bot&#39;s commands for the given scope and user language. Returns an Array of <a href="#botcommand">BotCommand</a> objects. If commands aren&#39;t set, an empty list is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getmycommands}
    */
  getMyCommands({
<tr>
<td>scope?</td>
<td><a href="#botcommandscope">BotCommandScope</a></td>
<td>A JSON-serialized object, describing scope of users. Defaults to <a href="#botcommandscopedefault">BotCommandScopeDefault</a>.</td>
</tr>
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
  }): BotCommand[];
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the bot&#39;s name. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setmyname}
    */
  setMyName({
<tr>
<td>name?</td>
<td>String</td>
<td>New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.</td>
</tr>
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the current bot name for the given user language. Returns <a href="#botname">BotName</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getmyname}
    */
  getMyName({
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
  }): BotName;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the bot&#39;s description, which is shown in the chat with the bot if the chat is empty. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setmydescription}
    */
  setMyDescription({
<tr>
<td>description?</td>
<td>String</td>
<td>New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.</td>
</tr>
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the current bot description for the given user language. Returns <a href="#botdescription">BotDescription</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getmydescription}
    */
  getMyDescription({
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
  }): BotDescription;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the bot&#39;s short description, which is shown on the bot&#39;s profile page and is sent together with the link when users share the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setmyshortdescription}
    */
  setMyShortDescription({
<tr>
<td>short_description?</td>
<td>String</td>
<td>New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.</td>
</tr>
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the current bot short description for the given user language. Returns <a href="#botshortdescription">BotShortDescription</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getmyshortdescription}
    */
  getMyShortDescription({
<tr>
<td>language_code?</td>
<td>String</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
  }): BotShortDescription;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the bot&#39;s menu button in a private chat, or the default menu button. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setchatmenubutton}
    */
  setChatMenuButton({
<tr>
<td>chat_id?</td>
<td>Integer</td>
<td>Unique identifier for the target private chat. If not specified, default bot&#39;s menu button will be changed</td>
</tr>
<tr>
<td>menu_button?</td>
<td><a href="#menubutton">MenuButton</a></td>
<td>A JSON-serialized object for the bot&#39;s new menu button. Defaults to <a href="#menubuttondefault">MenuButtonDefault</a></td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the current value of the bot&#39;s menu button in a private chat, or the default menu button. Returns <a href="#menubutton">MenuButton</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getchatmenubutton}
    */
  getChatMenuButton({
<tr>
<td>chat_id?</td>
<td>Integer</td>
<td>Unique identifier for the target private chat. If not specified, default bot&#39;s menu button will be returned</td>
</tr>
  }): MenuButton;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the default administrator rights requested by the bot when it&#39;s added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setmydefaultadministratorrights}
    */
  setMyDefaultAdministratorRights({
<tr>
<td>rights?</td>
<td><a href="#chatadministratorrights">ChatAdministratorRights</a></td>
<td>A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared.</td>
</tr>
<tr>
<td>for_channels?</td>
<td>Boolean</td>
<td>Pass _True_ to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get the current default administrator rights of the bot. Returns <a href="#chatadministratorrights">ChatAdministratorRights</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getmydefaultadministratorrights}
    */
  getMyDefaultAdministratorRights({
<tr>
<td>for_channels?</td>
<td>Boolean</td>
<td>Pass _True_ to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned.</td>
</tr>
  }): ChatAdministratorRights;
}
  /**
   * <p>Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a <a href="#gifts">Gifts</a> object.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getavailablegifts}
   */
  getAvailableGifts(args: Empty): Gifts;
export interface ApiMethods {
  /**
    * <p>Sends a gift to the given user or channel chat. The gift can&#39;t be converted to Telegram Stars by the receiver. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#sendgift}
    */
  sendGift({
<tr>
<td>user_id?</td>
<td>Integer</td>
<td>Required if _chat_id_ is not specified. Unique identifier of the target user who will receive the gift.</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>Required if _user_id_ is not specified. Unique identifier for the chat or username of the channel (in the format `@channelusername`) that will receive the gift.</td>
</tr>
<tr>
<td>gift_id</td>
<td>String</td>
<td>Identifier of the gift</td>
</tr>
<tr>
<td>pay_for_upgrade?</td>
<td>Boolean</td>
<td>Pass _True_ to pay for the gift upgrade from the bot&#39;s balance, thereby making the upgrade free for the receiver</td>
</tr>
<tr>
<td>text?</td>
<td>String</td>
<td>Text that will be shown along with the gift; 0-128 characters</td>
</tr>
<tr>
<td>text_parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the text. See <a href="#formatting-options">formatting options</a> for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored.</td>
</tr>
<tr>
<td>text_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of _text_parse_mode_. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Gifts a Telegram Premium subscription to the given user. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#giftpremiumsubscription}
    */
  giftPremiumSubscription({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user who will receive a Telegram Premium subscription</td>
</tr>
<tr>
<td>month_count</td>
<td>Integer</td>
<td>Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months</td>
</tr>
<tr>
<td>text?</td>
<td>String</td>
<td>Text that will be shown along with the service message about the subscription; 0-128 characters</td>
</tr>
<tr>
<td>text_parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the text. See <a href="#formatting-options">formatting options</a> for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored.</td>
</tr>
<tr>
<td>text_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of _text_parse_mode_. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Verifies a user <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> which is represented by the bot. Returns _True_ on success.</p>
     *
     * @see {@link https://core.telegram.org/bots/api#verifyuser}
    */
  verifyUser({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>custom_description?</td>
<td>String</td>
<td>Custom description for the verification; 0-70 characters. Must be empty if the organization isn&#39;t allowed to provide a custom verification description.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Verifies a chat <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> which is represented by the bot. Returns _True_ on success.</p>
     *
     * @see {@link https://core.telegram.org/bots/api#verifychat}
    */
  verifyChat({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can&#39;t be verified.</td>
</tr>
<tr>
<td>custom_description?</td>
<td>String</td>
<td>Custom description for the verification; 0-70 characters. Must be empty if the organization isn&#39;t allowed to provide a custom verification description.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Removes verification from a user who is currently verified <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> represented by the bot. Returns _True_ on success.</p>
     *
     * @see {@link https://core.telegram.org/bots/api#removeuserverification}
    */
  removeUserVerification({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Removes verification from a chat that is currently verified <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> represented by the bot. Returns _True_ on success.</p>
     *
     * @see {@link https://core.telegram.org/bots/api#removechatverification}
    */
  removeChatVerification({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Marks incoming message as read on behalf of a business account. Requires the _can_read_messages_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#readbusinessmessage}
    */
  readBusinessMessage({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which to read the message</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique identifier of the message to mark as read</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Delete messages on behalf of a business account. Requires the _can_delete_sent_messages_ business bot right to delete messages sent by the bot itself, or the _can_delete_all_messages_ business bot right to delete any message. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletebusinessmessages}
    */
  deleteBusinessMessages({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which to delete the messages</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See <a href="#deletemessage">deleteMessage</a> for limitations on which messages can be deleted</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Changes the first and last name of a managed business account. Requires the _can_change_name_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountname}
    */
  setBusinessAccountName({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>The new value of the first name for the business account; 1-64 characters</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>The new value of the last name for the business account; 0-64 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Changes the username of a managed business account. Requires the _can_change_username_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountusername}
    */
  setBusinessAccountUsername({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>username?</td>
<td>String</td>
<td>The new value of the username for the business account; 0-32 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Changes the bio of a managed business account. Requires the _can_change_bio_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountbio}
    */
  setBusinessAccountBio({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>bio?</td>
<td>String</td>
<td>The new value of the bio for the business account; 0-140 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Changes the profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountprofilephoto}
    */
  setBusinessAccountProfilePhoto({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>photo</td>
<td><a href="#inputprofilephoto">InputProfilePhoto</a></td>
<td>The new profile photo to set</td>
</tr>
<tr>
<td>is_public?</td>
<td>Boolean</td>
<td>Pass _True_ to set the public photo, which will be visible even if the main photo is hidden by the business account&#39;s privacy settings. An account can have only one public photo.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Removes the current profile photo of a managed business account. Requires the _can_edit_profile_photo_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#removebusinessaccountprofilephoto}
    */
  removeBusinessAccountProfilePhoto({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>is_public?</td>
<td>Boolean</td>
<td>Pass _True_ to remove the public photo, which is visible even if the main photo is hidden by the business account&#39;s privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the _can_change_gift_settings_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setbusinessaccountgiftsettings}
    */
  setBusinessAccountGiftSettings({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>show_gift_button</td>
<td>Boolean</td>
<td>Pass _True_, if a button for sending a gift to the user or by the business account must always be shown in the input field</td>
</tr>
<tr>
<td>accepted_gift_types</td>
<td><a href="#acceptedgifttypes">AcceptedGiftTypes</a></td>
<td>Types of gifts accepted by the business account</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Returns the amount of Telegram Stars owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns <a href="#staramount">StarAmount</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountstarbalance}
    */
  getBusinessAccountStarBalance({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
  }): StarAmount;
}
export interface ApiMethods {
  /**
    * <p>Transfers Telegram Stars from the business account balance to the bot&#39;s balance. Requires the _can_transfer_stars_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#transferbusinessaccountstars}
    */
  transferBusinessAccountStars({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>Number of Telegram Stars to transfer; 1-10000</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Returns the gifts received and owned by a managed business account. Requires the _can_view_gifts_and_stars_ business bot right. Returns <a href="#ownedgifts">OwnedGifts</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getbusinessaccountgifts}
    */
  getBusinessAccountGifts({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>exclude_unsaved?</td>
<td>Boolean</td>
<td>Pass _True_ to exclude gifts that aren&#39;t saved to the account&#39;s profile page</td>
</tr>
<tr>
<td>exclude_saved?</td>
<td>Boolean</td>
<td>Pass _True_ to exclude gifts that are saved to the account&#39;s profile page</td>
</tr>
<tr>
<td>exclude_unlimited?</td>
<td>Boolean</td>
<td>Pass _True_ to exclude gifts that can be purchased an unlimited number of times</td>
</tr>
<tr>
<td>exclude_limited?</td>
<td>Boolean</td>
<td>Pass _True_ to exclude gifts that can be purchased a limited number of times</td>
</tr>
<tr>
<td>exclude_unique?</td>
<td>Boolean</td>
<td>Pass _True_ to exclude unique gifts</td>
</tr>
<tr>
<td>sort_by_price?</td>
<td>Boolean</td>
<td>Pass _True_ to sort results by gift price instead of send date. Sorting is applied before pagination.</td>
</tr>
<tr>
<td>offset?</td>
<td>String</td>
<td>Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results</td>
</tr>
<tr>
<td>limit?</td>
<td>Integer</td>
<td>The maximum number of gifts to be returned; 1-100. Defaults to 100</td>
</tr>
  }): OwnedGifts;
}
export interface ApiMethods {
  /**
    * <p>Converts a given regular gift to Telegram Stars. Requires the _can_convert_gifts_to_stars_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#convertgifttostars}
    */
  convertGiftToStars({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>owned_gift_id</td>
<td>String</td>
<td>Unique identifier of the regular gift that should be converted to Telegram Stars</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Upgrades a given regular gift to a unique gift. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Additionally requires the _can_transfer_stars_ business bot right if the upgrade is paid. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#upgradegift}
    */
  upgradeGift({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>owned_gift_id</td>
<td>String</td>
<td>Unique identifier of the regular gift that should be upgraded to a unique one</td>
</tr>
<tr>
<td>keep_original_details?</td>
<td>Boolean</td>
<td>Pass _True_ to keep the original gift text, sender and receiver in the upgraded gift</td>
</tr>
<tr>
<td>star_count?</td>
<td>Integer</td>
<td>The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If `gift.prepaid_upgrade_star_count &gt; 0`, then pass 0, otherwise, the _can_transfer_stars_ business bot right is required and `gift.upgrade_star_count` must be passed.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Transfers an owned unique gift to another user. Requires the _can_transfer_and_upgrade_gifts_ business bot right. Requires _can_transfer_stars_ business bot right if the transfer is paid. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#transfergift}
    */
  transferGift({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>owned_gift_id</td>
<td>String</td>
<td>Unique identifier of the regular gift that should be transferred</td>
</tr>
<tr>
<td>new_owner_chat_id</td>
<td>Integer</td>
<td>Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.</td>
</tr>
<tr>
<td>star_count?</td>
<td>Integer</td>
<td>The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the _can_transfer_stars_ business bot right is required.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Posts a story on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns <a href="#story">Story</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#poststory}
    */
  postStory({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>content</td>
<td><a href="#inputstorycontent">InputStoryContent</a></td>
<td>Content of the story</td>
</tr>
<tr>
<td>active_period</td>
<td>Integer</td>
<td>Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the story, 0-2048 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the story caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>areas?</td>
<td>Array of <a href="#storyarea">StoryArea</a></td>
<td>A JSON-serialized list of clickable areas to be shown on the story</td>
</tr>
<tr>
<td>post_to_chat_page?</td>
<td>Boolean</td>
<td>Pass _True_ to keep the story accessible after it expires</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Pass _True_ if the content of the story must be protected from forwarding and screenshotting</td>
</tr>
  }): Story;
}
export interface ApiMethods {
  /**
    * <p>Edits a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns <a href="#story">Story</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editstory}
    */
  editStory({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>story_id</td>
<td>Integer</td>
<td>Unique identifier of the story to edit</td>
</tr>
<tr>
<td>content</td>
<td><a href="#inputstorycontent">InputStoryContent</a></td>
<td>Content of the story</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the story, 0-2048 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the story caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>areas?</td>
<td>Array of <a href="#storyarea">StoryArea</a></td>
<td>A JSON-serialized list of clickable areas to be shown on the story</td>
</tr>
  }): Story;
}
export interface ApiMethods {
  /**
    * <p>Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can_manage_stories_ business bot right. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletestory}
    */
  deleteStory({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>story_id</td>
<td>Integer</td>
<td>Unique identifier of the story to delete</td>
</tr>
  }): true;
}

// === UPDATING MESSAGES ===
export interface ApiMethods {
  /**
    * <p>Use this method to edit text and <a href="#games">game</a> messages. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editmessagetext}
    */
  editMessageText({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the message to edit</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>New text of the message, 1-4096 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in message text, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>link_preview_options?</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Link preview generation options for the message</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>.</td>
</tr>
  }): true | Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
    */
  editMessageCaption({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the message to edit</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>New caption of the message, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the message caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media. Supported only for animation, photo and video messages.</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>.</td>
</tr>
  }): true | Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can&#39;t be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editmessagemedia}
    */
  editMessageMedia({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the message to edit</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
<tr>
<td>media</td>
<td><a href="#inputmedia">InputMedia</a></td>
<td>A JSON-serialized object for a new media content of the message</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for a new <a href="/bots/features#inline-keyboards">inline keyboard</a>.</td>
</tr>
  }): true | Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit live location messages. A location can be edited until its _live_period_ expires or editing is explicitly disabled by a call to <a href="#stopmessagelivelocation">stopMessageLiveLocation</a>. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise _True_ is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editmessagelivelocation}
    */
  editMessageLiveLocation({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the message to edit</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Latitude of new location</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Longitude of new location</td>
</tr>
<tr>
<td>live_period?</td>
<td>Integer</td>
<td>New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current _live_period_ by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then _live_period_ remains unchanged</td>
</tr>
<tr>
<td>horizontal_accuracy?</td>
<td>Float</td>
<td>The radius of uncertainty for the location, measured in meters; 0-1500</td>
</tr>
<tr>
<td>heading?</td>
<td>Integer</td>
<td>Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.</td>
</tr>
<tr>
<td>proximity_alert_radius?</td>
<td>Integer</td>
<td>The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for a new <a href="/bots/features#inline-keyboards">inline keyboard</a>.</td>
</tr>
  }): true | Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to stop updating a live location message before _live_period_ expires. On success, if the message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise _True_ is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#stopmessagelivelocation}
    */
  stopMessageLiveLocation({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the message with live location to stop</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for a new <a href="/bots/features#inline-keyboards">inline keyboard</a>.</td>
</tr>
  }): true | Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit a checklist on behalf of a connected business account. On success, the edited <a href="#message">Message</a> is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editmessagechecklist}
    */
  editMessageChecklist({
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Unique identifier for the target chat</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Unique identifier for the target message</td>
</tr>
<tr>
<td>checklist</td>
<td><a href="#inputchecklist">InputChecklist</a></td>
<td>A JSON-serialized object for the new checklist</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for the new inline keyboard for the message</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
    */
  editMessageReplyMarkup({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer or String</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the message to edit</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>.</td>
</tr>
  }): true | Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to stop a poll which was sent by the bot. On success, the stopped <a href="#poll">Poll</a> is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#stoppoll}
    */
  stopPoll({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Identifier of the original message with the poll</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for a new message <a href="/bots/features#inline-keyboards">inline keyboard</a>.</td>
</tr>
  }): Poll;
}
export interface ApiMethods {
  /**
    * <p>Use this method to approve a suggested post in a direct messages chat. The bot must have the &#39;can_post_messages&#39; administrator right in the corresponding channel chat. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#approvesuggestedpost}
    */
  approveSuggestedPost({
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Unique identifier for the target direct messages chat</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Identifier of a suggested post message to approve</td>
</tr>
<tr>
<td>send_date?</td>
<td>Integer</td>
<td>Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to decline a suggested post in a direct messages chat. The bot must have the &#39;can_manage_direct_messages&#39; administrator right in the corresponding channel chat. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#declinesuggestedpost}
    */
  declineSuggestedPost({
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Unique identifier for the target direct messages chat</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Identifier of a suggested post message to decline</td>
</tr>
<tr>
<td>comment?</td>
<td>String</td>
<td>Comment for the creator of the suggested post; 0-128 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete a message, including service messages, with the following limitations:<br>- A message can only be deleted if it was sent less than 48 hours ago.<br>- Service messages about a supergroup, channel, or forum topic creation can&#39;t be deleted.<br>- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.<br>- Bots can delete outgoing messages in private chats, groups, and supergroups.<br>- Bots can delete incoming messages in private chats.<br>- Bots granted _can_post_messages_ permissions can delete outgoing messages in channels.<br>- If the bot is an administrator of a group, it can delete any message there.<br>- If the bot has _can_delete_messages_ administrator right in a supergroup or a channel, it can delete any message there.<br>- If the bot has _can_manage_direct_messages_ administrator right in a channel, it can delete any message in the corresponding direct messages chat.<br>Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletemessage}
    */
  deleteMessage({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Identifier of the message to delete</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete multiple messages simultaneously. If some of the specified messages can&#39;t be found, they are skipped. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletemessages}
    */
  deleteMessages({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>A JSON-serialized list of 1-100 identifiers of messages to delete. See <a href="#deletemessage">deleteMessage</a> for limitations on which messages can be deleted</td>
</tr>
  }): true;
}

// === STICKERS ===
/**
 * <p>This object represents a sticker.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#sticker}
 */
export interface Sticker {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Type of the sticker, currently one of “regular”, “mask”, “custom_emoji”. The type of the sticker is independent from its format, which is determined by the fields _is_animated_ and _is_video_.</td>
</tr>
<tr>
<td>width</td>
<td>Integer</td>
<td>Sticker width</td>
</tr>
<tr>
<td>height</td>
<td>Integer</td>
<td>Sticker height</td>
</tr>
<tr>
<td>is_animated</td>
<td>Boolean</td>
<td>_True_, if the sticker is <a href="https://telegram.org/blog/animated-stickers">animated</a></td>
</tr>
<tr>
<td>is_video</td>
<td>Boolean</td>
<td>_True_, if the sticker is a <a href="https://telegram.org/blog/video-stickers-better-reactions">video sticker</a></td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#photosize">PhotoSize</a></td>
<td>Sticker thumbnail in the .WEBP or .JPG format</td>
</tr>
<tr>
<td>emoji?</td>
<td>String</td>
<td>Emoji associated with the sticker</td>
</tr>
<tr>
<td>set_name?</td>
<td>String</td>
<td>Name of the sticker set to which the sticker belongs</td>
</tr>
<tr>
<td>premium_animation?</td>
<td><a href="#file">File</a></td>
<td>For premium regular stickers, premium animation for the sticker</td>
</tr>
<tr>
<td>mask_position?</td>
<td><a href="#maskposition">MaskPosition</a></td>
<td>For mask stickers, the position where the mask should be placed</td>
</tr>
<tr>
<td>custom_emoji_id?</td>
<td>String</td>
<td>For custom emoji stickers, unique identifier of the custom emoji</td>
</tr>
<tr>
<td>needs_repainting?</td>
<td>True</td>
<td>_True_, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places</td>
</tr>
<tr>
<td>file_size?</td>
<td>Integer</td>
<td>File size in bytes</td>
</tr>
}
/**
 * <p>This object represents a sticker set.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#stickerset}
 */
export interface StickerSet {
<tr>
<td>name</td>
<td>String</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Sticker set title</td>
</tr>
<tr>
<td>sticker_type</td>
<td>String</td>
<td>Type of stickers in the set, currently one of “regular”, “mask”, “custom_emoji”</td>
</tr>
<tr>
<td>stickers</td>
<td>Array of <a href="#sticker">Sticker</a></td>
<td>List of all set stickers</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#photosize">PhotoSize</a></td>
<td>Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format</td>
</tr>
}
/**
 * <p>This object describes the position on faces where a mask should be placed by default.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#maskposition}
 */
export interface MaskPosition {
<tr>
<td>point</td>
<td>String</td>
<td>The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”.</td>
</tr>
<tr>
<td>x_shift</td>
<td>Float</td>
<td>Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position.</td>
</tr>
<tr>
<td>y_shift</td>
<td>Float</td>
<td>Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position.</td>
</tr>
<tr>
<td>scale</td>
<td>Float</td>
<td>Mask scaling coefficient. For example, 2.0 means double size.</td>
</tr>
}
/**
 * <p>This object describes a sticker to be added to a sticker set.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputsticker}
 */
export interface InputSticker {
<tr>
<td>sticker</td>
<td>String</td>
<td>The added sticker. Pass a _file_id_ as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new file using multipart/form-data under &lt;file_attach_name&gt; name. Animated and video stickers can&#39;t be uploaded via HTTP URL. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>format</td>
<td>String</td>
<td>Format of the added sticker, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, “video” for a **.WEBM** video</td>
</tr>
<tr>
<td>emoji_list</td>
<td>Array of String</td>
<td>List of 1-20 emoji associated with the sticker</td>
</tr>
<tr>
<td>mask_position?</td>
<td><a href="#maskposition">MaskPosition</a></td>
<td>Position where the mask should be placed on faces. For “mask” stickers only.</td>
</tr>
<tr>
<td>keywords?</td>
<td>Array of String</td>
<td>List of 0-20 search keywords for the sticker with total length of up to 64 characters. For “regular” and “custom_emoji” stickers only.</td>
</tr>
}
export interface ApiMethods {
  /**
    * <p>Use this method to send static .WEBP, <a href="https://telegram.org/blog/animated-stickers">animated</a> .TGS, or <a href="https://telegram.org/blog/video-stickers-better-reactions">video</a> .WEBM stickers. On success, the sent <a href="#message">Message</a> is returned.</p>
     *
     * @see {@link https://core.telegram.org/bots/api#sendsticker}
    */
  sendSticker({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Video and animated stickers can&#39;t be sent via an HTTP URL.</td>
</tr>
<tr>
<td>emoji?</td>
<td>String</td>
<td>Emoji associated with the sticker; only for just uploaded stickers</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get a sticker set. On success, a <a href="#stickerset">StickerSet</a> object is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getstickerset}
    */
  getStickerSet({
<tr>
<td>name</td>
<td>String</td>
<td>Name of the sticker set</td>
</tr>
  }): StickerSet;
}
export interface ApiMethods {
  /**
    * <p>Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of <a href="#sticker">Sticker</a> objects.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getcustomemojistickers}
    */
  getCustomEmojiStickers({
<tr>
<td>custom_emoji_ids</td>
<td>Array of String</td>
<td>A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.</td>
</tr>
  }): Sticker[];
}
export interface ApiMethods {
  /**
    * <p>Use this method to upload a file with a sticker for later use in the <a href="#createnewstickerset">createNewStickerSet</a>, <a href="#addstickertoset">addStickerToSet</a>, or <a href="#replacestickerinset">replaceStickerInSet</a> methods (the file can be used multiple times). Returns the uploaded <a href="#file">File</a> on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#uploadstickerfile}
    */
  uploadStickerFile({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>User identifier of sticker file owner</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputfile">InputFile</a></td>
<td>A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See <a href="/stickers"><a href="https://core.telegram.org/stickers">https://core.telegram.org/stickers</a></a> for technical requirements. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>sticker_format</td>
<td>String</td>
<td>Format of the sticker, must be one of “static”, “animated”, “video”</td>
</tr>
  }): File;
}
export interface ApiMethods {
  /**
    * <p>Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#createnewstickerset}
    */
  createNewStickerSet({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>User identifier of created sticker set owner</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can&#39;t contain consecutive underscores and must end in `&quot;_by_&lt;bot_username&gt;&quot;`. `&lt;bot_username&gt;` is case insensitive. 1-64 characters.</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Sticker set title, 1-64 characters</td>
</tr>
<tr>
<td>stickers</td>
<td>Array of <a href="#inputsticker">InputSticker</a></td>
<td>A JSON-serialized list of 1-50 initial stickers to be added to the sticker set</td>
</tr>
<tr>
<td>sticker_type?</td>
<td>String</td>
<td>Type of stickers in the set, pass “regular”, “mask”, or “custom_emoji”. By default, a regular sticker set is created.</td>
</tr>
<tr>
<td>needs_repainting?</td>
<td>Boolean</td>
<td>Pass _True_ if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#addstickertoset}
    */
  addStickerToSet({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>User identifier of sticker set owner</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputsticker">InputSticker</a></td>
<td>A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn&#39;t changed.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to move a sticker in a set created by the bot to a specific position. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
    */
  setStickerPositionInSet({
<tr>
<td>sticker</td>
<td>String</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>position</td>
<td>Integer</td>
<td>New sticker position in the set, zero-based</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete a sticker from a set created by the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
    */
  deleteStickerFromSet({
<tr>
<td>sticker</td>
<td>String</td>
<td>File identifier of the sticker</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling <a href="#deletestickerfromset">deleteStickerFromSet</a>, then <a href="#addstickertoset">addStickerToSet</a>, then <a href="#setstickerpositioninset">setStickerPositionInSet</a>. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#replacestickerinset}
    */
  replaceStickerInSet({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>User identifier of the sticker set owner</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>old_sticker</td>
<td>String</td>
<td>File identifier of the replaced sticker</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputsticker">InputSticker</a></td>
<td>A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setstickeremojilist}
    */
  setStickerEmojiList({
<tr>
<td>sticker</td>
<td>String</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>emoji_list</td>
<td>Array of String</td>
<td>A JSON-serialized list of 1-20 emoji associated with the sticker</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setstickerkeywords}
    */
  setStickerKeywords({
<tr>
<td>sticker</td>
<td>String</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>keywords?</td>
<td>Array of String</td>
<td>A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to change the <a href="#maskposition">mask position</a> of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setstickermaskposition}
    */
  setStickerMaskPosition({
<tr>
<td>sticker</td>
<td>String</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>mask_position?</td>
<td><a href="#maskposition">MaskPosition</a></td>
<td>A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to set the title of a created sticker set. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setstickersettitle}
    */
  setStickerSetTitle({
<tr>
<td>name</td>
<td>String</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Sticker set title, 1-64 characters</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setstickersetthumbnail}
    */
  setStickerSetThumbnail({
<tr>
<td>name</td>
<td>String</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>User identifier of the sticker set owner</td>
</tr>
<tr>
<td>thumbnail?</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>A **.WEBP** or **.PNG** image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a **.TGS** animation with a thumbnail up to 32 kilobytes in size (see <a href="/stickers#animation-requirements"><a href="https://core.telegram.org/stickers#animation-requirements">https://core.telegram.org/stickers#animation-requirements</a></a> for animated sticker technical requirements), or a **.WEBM** video with the thumbnail up to 32 kilobytes in size; see <a href="/stickers#video-requirements"><a href="https://core.telegram.org/stickers#video-requirements">https://core.telegram.org/stickers#video-requirements</a></a> for video sticker technical requirements. Pass a _file_id_ as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Animated and video sticker set thumbnails can&#39;t be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail.</td>
</tr>
<tr>
<td>format</td>
<td>String</td>
<td>Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to set the thumbnail of a custom emoji sticker set. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail}
    */
  setCustomEmojiStickerSetThumbnail({
<tr>
<td>name</td>
<td>String</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>custom_emoji_id?</td>
<td>String</td>
<td>Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Use this method to delete a sticker set that was created by the bot. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#deletestickerset}
    */
  deleteStickerSet({
<tr>
<td>name</td>
<td>String</td>
<td>Sticker set name</td>
</tr>
  }): true;
}

// === INLINE MODE ===
/**
 * <p>This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequery}
 */
export interface InlineQuery {
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this query</td>
</tr>
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>Sender</td>
</tr>
<tr>
<td>query</td>
<td>String</td>
<td>Text of the query (up to 256 characters)</td>
</tr>
<tr>
<td>offset</td>
<td>String</td>
<td>Offset of the results to be returned, can be controlled by the bot</td>
</tr>
<tr>
<td>chat_type?</td>
<td>String</td>
<td>Type of the chat from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat</td>
</tr>
<tr>
<td>location?</td>
<td><a href="#location">Location</a></td>
<td>Sender location, only for bots that request user location</td>
</tr>
}
export interface ApiMethods {
  /**
    * <p>Use this method to send answers to an inline query. On success, _True_ is returned.<br>No more than **50** results per query are allowed.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#answerinlinequery}
    */
  answerInlineQuery({
<tr>
<td>inline_query_id</td>
<td>String</td>
<td>Unique identifier for the answered query</td>
</tr>
<tr>
<td>results</td>
<td>Array of <a href="#inlinequeryresult">InlineQueryResult</a></td>
<td>A JSON-serialized array of results for the inline query</td>
</tr>
<tr>
<td>cache_time?</td>
<td>Integer</td>
<td>The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.</td>
</tr>
<tr>
<td>is_personal?</td>
<td>Boolean</td>
<td>Pass _True_ if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.</td>
</tr>
<tr>
<td>next_offset?</td>
<td>String</td>
<td>Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don&#39;t support pagination. Offset length can&#39;t exceed 64 bytes.</td>
</tr>
<tr>
<td>button?</td>
<td><a href="#inlinequeryresultsbutton">InlineQueryResultsButton</a></td>
<td>A JSON-serialized object describing a button to be shown above inline query results</td>
</tr>
  }): true;
}
/**
 * <p>This object represents a button to be shown above inline query results. You **must** use exactly one of the optional fields.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultsbutton}
 */
export interface InlineQueryResultsButton {
<tr>
<td>text</td>
<td>String</td>
<td>Label text on the button</td>
</tr>
<tr>
<td>web_app?</td>
<td><a href="#webappinfo">WebAppInfo</a></td>
<td>Description of the <a href="/bots/webapps">Web App</a> that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method <a href="/bots/webapps#initializing-mini-apps">switchInlineQuery</a> inside the Web App.</td>
</tr>
<tr>
<td>start_parameter?</td>
<td>String</td>
<td><a href="/bots/features#deep-linking">Deep-linking</a> parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed.<br><br>_Example:_ An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a &#39;Connect your YouTube account&#39; button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a <a href="#inlinekeyboardmarkup">_switch_inline_</a> button so that the user can easily return to the chat where they wanted to use the bot&#39;s inline capabilities.</td>
</tr>
}
/**
 * <p>This object represents one result of an inline query. Telegram clients currently support results of the following 20 types:</p>
 * - InlineQueryResultCachedAudio
 * - InlineQueryResultCachedDocument
 * - InlineQueryResultCachedGif
 * - InlineQueryResultCachedMpeg4Gif
 * - InlineQueryResultCachedPhoto
 * - InlineQueryResultCachedSticker
 * - InlineQueryResultCachedVideo
 * - InlineQueryResultCachedVoice
 * - InlineQueryResultArticle
 * - InlineQueryResultAudio
 * - InlineQueryResultContact
 * - InlineQueryResultGame
 * - InlineQueryResultDocument
 * - InlineQueryResultGif
 * - InlineQueryResultLocation
 * - InlineQueryResultMpeg4Gif
 * - InlineQueryResultPhoto
 * - InlineQueryResultVenue
 * - InlineQueryResultVideo
 * - InlineQueryResultVoice
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresult}
 */
export type InlineQueryResult =
 | InlineQueryResultCachedAudio
 | InlineQueryResultCachedDocument
 | InlineQueryResultCachedGif
 | InlineQueryResultCachedMpeg4Gif
 | InlineQueryResultCachedPhoto
 | InlineQueryResultCachedSticker
 | InlineQueryResultCachedVideo
 | InlineQueryResultCachedVoice
 | InlineQueryResultArticle
 | InlineQueryResultAudio
 | InlineQueryResultContact
 | InlineQueryResultGame
 | InlineQueryResultDocument
 | InlineQueryResultGif
 | InlineQueryResultLocation
 | InlineQueryResultMpeg4Gif
 | InlineQueryResultPhoto
 | InlineQueryResultVenue
 | InlineQueryResultVideo
 | InlineQueryResultVoice
<p>**Note:** All URLs passed in inline query results will be available to end users and therefore must be assumed to be **public**.</p>
/**
 * <p>Represents a link to an article or web page.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultarticle}
 */
export interface InlineQueryResultArticle {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _article_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 Bytes</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Title of the result</td>
</tr>
<tr>
<td>input_message_content</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>url?</td>
<td>String</td>
<td>URL of the result</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Short description of the result</td>
</tr>
<tr>
<td>thumbnail_url?</td>
<td>String</td>
<td>Url of the thumbnail for the result</td>
</tr>
<tr>
<td>thumbnail_width?</td>
<td>Integer</td>
<td>Thumbnail width</td>
</tr>
<tr>
<td>thumbnail_height?</td>
<td>Integer</td>
<td>Thumbnail height</td>
</tr>
}
/**
 * <p>Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the photo.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultphoto}
 */
export interface InlineQueryResultPhoto {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _photo_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>photo_url</td>
<td>String</td>
<td>A valid URL of the photo. Photo must be in **JPEG** format. Photo size must not exceed 5MB</td>
</tr>
<tr>
<td>thumbnail_url</td>
<td>String</td>
<td>URL of the thumbnail for the photo</td>
</tr>
<tr>
<td>photo_width?</td>
<td>Integer</td>
<td>Width of the photo</td>
</tr>
<tr>
<td>photo_height?</td>
<td>Integer</td>
<td>Height of the photo</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Short description of the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the photo to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the photo</td>
</tr>
}
/**
 * <p>Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the animation.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultgif}
 */
export interface InlineQueryResultGif {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _gif_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>gif_url</td>
<td>String</td>
<td>A valid URL for the GIF file</td>
</tr>
<tr>
<td>gif_width?</td>
<td>Integer</td>
<td>Width of the GIF</td>
</tr>
<tr>
<td>gif_height?</td>
<td>Integer</td>
<td>Height of the GIF</td>
</tr>
<tr>
<td>gif_duration?</td>
<td>Integer</td>
<td>Duration of the GIF in seconds</td>
</tr>
<tr>
<td>thumbnail_url</td>
<td>String</td>
<td>URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result</td>
</tr>
<tr>
<td>thumbnail_mime_type?</td>
<td>String</td>
<td>MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the GIF file to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the GIF animation</td>
</tr>
}
/**
 * <p>Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the animation.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultmpeg4gif}
 */
export interface InlineQueryResultMpeg4Gif {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _mpeg4_gif_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>mpeg4_url</td>
<td>String</td>
<td>A valid URL for the MPEG4 file</td>
</tr>
<tr>
<td>mpeg4_width?</td>
<td>Integer</td>
<td>Video width</td>
</tr>
<tr>
<td>mpeg4_height?</td>
<td>Integer</td>
<td>Video height</td>
</tr>
<tr>
<td>mpeg4_duration?</td>
<td>Integer</td>
<td>Video duration in seconds</td>
</tr>
<tr>
<td>thumbnail_url</td>
<td>String</td>
<td>URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result</td>
</tr>
<tr>
<td>thumbnail_mime_type?</td>
<td>String</td>
<td>MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the video animation</td>
</tr>
}
/**
 * <p>Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the video.</p>
 * <blockquote>
 * <p>If an InlineQueryResultVideo message contains an embedded video (e.g., YouTube), you **must** replace its content using _input_message_content_.</p>
 * </blockquote>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultvideo}
 */
export interface InlineQueryResultVideo {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _video_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>video_url</td>
<td>String</td>
<td>A valid URL for the embedded video player or video file</td>
</tr>
<tr>
<td>mime_type</td>
<td>String</td>
<td>MIME type of the content of the video URL, “text/html” or “video/mp4”</td>
</tr>
<tr>
<td>thumbnail_url</td>
<td>String</td>
<td>URL of the thumbnail (JPEG only) for the video</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the video to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>video_width?</td>
<td>Integer</td>
<td>Video width</td>
</tr>
<tr>
<td>video_height?</td>
<td>Integer</td>
<td>Video height</td>
</tr>
<tr>
<td>video_duration?</td>
<td>Integer</td>
<td>Video duration in seconds</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Short description of the result</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the video. This field is **required** if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video).</td>
</tr>
}
/**
 * <p>Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the audio.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultaudio}
 */
export interface InlineQueryResultAudio {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _audio_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>audio_url</td>
<td>String</td>
<td>A valid URL for the audio file</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Title</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>performer?</td>
<td>String</td>
<td>Performer</td>
</tr>
<tr>
<td>audio_duration?</td>
<td>Integer</td>
<td>Audio duration in seconds</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the audio</td>
</tr>
}
/**
 * <p>Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the the voice message.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultvoice}
 */
export interface InlineQueryResultVoice {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _voice_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>voice_url</td>
<td>String</td>
<td>A valid URL for the voice recording</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Recording title</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the voice message caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>voice_duration?</td>
<td>Integer</td>
<td>Recording duration in seconds</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the voice recording</td>
</tr>
}
/**
 * <p>Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the file. Currently, only **.PDF** and **.ZIP** files can be sent using this method.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultdocument}
 */
export interface InlineQueryResultDocument {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _document_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the document to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>document_url</td>
<td>String</td>
<td>A valid URL for the file</td>
</tr>
<tr>
<td>mime_type</td>
<td>String</td>
<td>MIME type of the content of the file, either “application/pdf” or “application/zip”</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Short description of the result</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Inline keyboard attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the file</td>
</tr>
<tr>
<td>thumbnail_url?</td>
<td>String</td>
<td>URL of the thumbnail (JPEG only) for the file</td>
</tr>
<tr>
<td>thumbnail_width?</td>
<td>Integer</td>
<td>Thumbnail width</td>
</tr>
<tr>
<td>thumbnail_height?</td>
<td>Integer</td>
<td>Thumbnail height</td>
</tr>
}
/**
 * <p>Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the location.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultlocation}
 */
export interface InlineQueryResultLocation {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _location_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 Bytes</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Location latitude in degrees</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Location longitude in degrees</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Location title</td>
</tr>
<tr>
<td>horizontal_accuracy?</td>
<td>Float</td>
<td>The radius of uncertainty for the location, measured in meters; 0-1500</td>
</tr>
<tr>
<td>live_period?</td>
<td>Integer</td>
<td>Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely.</td>
</tr>
<tr>
<td>heading?</td>
<td>Integer</td>
<td>For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.</td>
</tr>
<tr>
<td>proximity_alert_radius?</td>
<td>Integer</td>
<td>For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the location</td>
</tr>
<tr>
<td>thumbnail_url?</td>
<td>String</td>
<td>Url of the thumbnail for the result</td>
</tr>
<tr>
<td>thumbnail_width?</td>
<td>Integer</td>
<td>Thumbnail width</td>
</tr>
<tr>
<td>thumbnail_height?</td>
<td>Integer</td>
<td>Thumbnail height</td>
</tr>
}
/**
 * <p>Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the venue.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultvenue}
 */
export interface InlineQueryResultVenue {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _venue_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 Bytes</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Latitude of the venue location in degrees</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Longitude of the venue location in degrees</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Title of the venue</td>
</tr>
<tr>
<td>address</td>
<td>String</td>
<td>Address of the venue</td>
</tr>
<tr>
<td>foursquare_id?</td>
<td>String</td>
<td>Foursquare identifier of the venue if known</td>
</tr>
<tr>
<td>foursquare_type?</td>
<td>String</td>
<td>Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)</td>
</tr>
<tr>
<td>google_place_id?</td>
<td>String</td>
<td>Google Places identifier of the venue</td>
</tr>
<tr>
<td>google_place_type?</td>
<td>String</td>
<td>Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the venue</td>
</tr>
<tr>
<td>thumbnail_url?</td>
<td>String</td>
<td>Url of the thumbnail for the result</td>
</tr>
<tr>
<td>thumbnail_width?</td>
<td>Integer</td>
<td>Thumbnail width</td>
</tr>
<tr>
<td>thumbnail_height?</td>
<td>Integer</td>
<td>Thumbnail height</td>
</tr>
}
/**
 * <p>Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the contact.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcontact}
 */
export interface InlineQueryResultContact {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _contact_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 Bytes</td>
</tr>
<tr>
<td>phone_number</td>
<td>String</td>
<td>Contact&#39;s phone number</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>Contact&#39;s first name</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>Contact&#39;s last name</td>
</tr>
<tr>
<td>vcard?</td>
<td>String</td>
<td>Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a>, 0-2048 bytes</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the contact</td>
</tr>
<tr>
<td>thumbnail_url?</td>
<td>String</td>
<td>Url of the thumbnail for the result</td>
</tr>
<tr>
<td>thumbnail_width?</td>
<td>Integer</td>
<td>Thumbnail width</td>
</tr>
<tr>
<td>thumbnail_height?</td>
<td>Integer</td>
<td>Thumbnail height</td>
</tr>
}
/**
 * <p>Represents a <a href="#games">Game</a>.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultgame}
 */
export interface InlineQueryResultGame {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _game_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>game_short_name</td>
<td>String</td>
<td>Short name of the game</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
}
/**
 * <p>Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the photo.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcachedphoto}
 */
export interface InlineQueryResultCachedPhoto {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _photo_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>photo_file_id</td>
<td>String</td>
<td>A valid file identifier of the photo</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Short description of the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the photo to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the photo</td>
</tr>
}
/**
 * <p>Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use _input_message_content_ to send a message with specified content instead of the animation.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcachedgif}
 */
export interface InlineQueryResultCachedGif {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _gif_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>gif_file_id</td>
<td>String</td>
<td>A valid file identifier for the GIF file</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the GIF file to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the GIF animation</td>
</tr>
}
/**
 * <p>Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the animation.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcachedmpeg4gif}
 */
export interface InlineQueryResultCachedMpeg4Gif {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _mpeg4_gif_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>mpeg4_file_id</td>
<td>String</td>
<td>A valid file identifier for the MPEG4 file</td>
</tr>
<tr>
<td>title?</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the video animation</td>
</tr>
}
/**
 * <p>Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the sticker.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcachedsticker}
 */
export interface InlineQueryResultCachedSticker {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _sticker_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>sticker_file_id</td>
<td>String</td>
<td>A valid file identifier of the sticker</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the sticker</td>
</tr>
}
/**
 * <p>Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the file.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcacheddocument}
 */
export interface InlineQueryResultCachedDocument {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _document_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>document_file_id</td>
<td>String</td>
<td>A valid file identifier for the file</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Short description of the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the document to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the file</td>
</tr>
}
/**
 * <p>Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the video.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcachedvideo}
 */
export interface InlineQueryResultCachedVideo {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _video_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>video_file_id</td>
<td>String</td>
<td>A valid file identifier for the video file</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Title for the result</td>
</tr>
<tr>
<td>description?</td>
<td>String</td>
<td>Short description of the result</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption of the video to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>show_caption_above_media?</td>
<td>Boolean</td>
<td>Pass _True_, if the caption must be shown above the message media</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the video</td>
</tr>
}
/**
 * <p>Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the voice message.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcachedvoice}
 */
export interface InlineQueryResultCachedVoice {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _voice_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>voice_file_id</td>
<td>String</td>
<td>A valid file identifier for the voice message</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Voice message title</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the voice message caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the voice message</td>
</tr>
}
/**
 * <p>Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use _input_message_content_ to send a message with the specified content instead of the audio.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inlinequeryresultcachedaudio}
 */
export interface InlineQueryResultCachedAudio {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the result, must be _audio_</td>
</tr>
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier for this result, 1-64 bytes</td>
</tr>
<tr>
<td>audio_file_id</td>
<td>String</td>
<td>A valid file identifier for the audio file</td>
</tr>
<tr>
<td>caption?</td>
<td>String</td>
<td>Caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in the caption, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td><a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message</td>
</tr>
<tr>
<td>input_message_content?</td>
<td><a href="#inputmessagecontent">InputMessageContent</a></td>
<td>Content of the message to be sent instead of the audio</td>
</tr>
}
/**
 * <p>This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following 5 types:</p>
 * - InputTextMessageContent
 * - InputLocationMessageContent
 * - InputVenueMessageContent
 * - InputContactMessageContent
 * - InputInvoiceMessageContent
 *
 * @see {@link https://core.telegram.org/bots/api#inputmessagecontent}
 */
export type InputMessageContent =
 | InputTextMessageContent
 | InputLocationMessageContent
 | InputVenueMessageContent
 | InputContactMessageContent
 | InputInvoiceMessageContent
 /**
  * <p>Represents the <a href="#inputmessagecontent">content</a> of a text message to be sent as the result of an inline query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputtextmessagecontent}
 */
export interface InputTextMessageContent {
<tr>
<td>message_text</td>
<td>String</td>
<td>Text of the message to be sent, 1-4096 characters</td>
</tr>
<tr>
<td>parse_mode?</td>
<td>String</td>
<td>Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>List of special entities that appear in message text, which can be specified instead of _parse_mode_</td>
</tr>
<tr>
<td>link_preview_options?</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Link preview generation options for the message</td>
</tr>
}
/**
 * <p>Represents the <a href="#inputmessagecontent">content</a> of a location message to be sent as the result of an inline query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputlocationmessagecontent}
 */
export interface InputLocationMessageContent {
<tr>
<td>latitude</td>
<td>Float</td>
<td>Latitude of the location in degrees</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Longitude of the location in degrees</td>
</tr>
<tr>
<td>horizontal_accuracy?</td>
<td>Float</td>
<td>The radius of uncertainty for the location, measured in meters; 0-1500</td>
</tr>
<tr>
<td>live_period?</td>
<td>Integer</td>
<td>Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely.</td>
</tr>
<tr>
<td>heading?</td>
<td>Integer</td>
<td>For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.</td>
</tr>
<tr>
<td>proximity_alert_radius?</td>
<td>Integer</td>
<td>For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.</td>
</tr>
}
/**
 * <p>Represents the <a href="#inputmessagecontent">content</a> of a venue message to be sent as the result of an inline query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputvenuemessagecontent}
 */
export interface InputVenueMessageContent {
<tr>
<td>latitude</td>
<td>Float</td>
<td>Latitude of the venue in degrees</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Longitude of the venue in degrees</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Name of the venue</td>
</tr>
<tr>
<td>address</td>
<td>String</td>
<td>Address of the venue</td>
</tr>
<tr>
<td>foursquare_id?</td>
<td>String</td>
<td>Foursquare identifier of the venue, if known</td>
</tr>
<tr>
<td>foursquare_type?</td>
<td>String</td>
<td>Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)</td>
</tr>
<tr>
<td>google_place_id?</td>
<td>String</td>
<td>Google Places identifier of the venue</td>
</tr>
<tr>
<td>google_place_type?</td>
<td>String</td>
<td>Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)</td>
</tr>
}
/**
 * <p>Represents the <a href="#inputmessagecontent">content</a> of a contact message to be sent as the result of an inline query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputcontactmessagecontent}
 */
export interface InputContactMessageContent {
<tr>
<td>phone_number</td>
<td>String</td>
<td>Contact&#39;s phone number</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>Contact&#39;s first name</td>
</tr>
<tr>
<td>last_name?</td>
<td>String</td>
<td>Contact&#39;s last name</td>
</tr>
<tr>
<td>vcard?</td>
<td>String</td>
<td>Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a>, 0-2048 bytes</td>
</tr>
}
/**
 * <p>Represents the <a href="#inputmessagecontent">content</a> of an invoice message to be sent as the result of an inline query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#inputinvoicemessagecontent}
 */
export interface InputInvoiceMessageContent {
<tr>
<td>title</td>
<td>String</td>
<td>Product name, 1-32 characters</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Product description, 1-255 characters</td>
</tr>
<tr>
<td>payload</td>
<td>String</td>
<td>Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.</td>
</tr>
<tr>
<td>provider_token?</td>
<td>String</td>
<td>Payment provider token, obtained via <a href="https://t.me/botfather">@BotFather</a>. Pass an empty string for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Three-letter ISO 4217 currency code, see <a href="/bots/payments#supported-currencies">more on currencies</a>. Pass “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>max_tip_amount?</td>
<td>Integer</td>
<td>The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>suggested_tip_amounts?</td>
<td>Array of Integer</td>
<td>A JSON-serialized array of suggested amounts of tip in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max_tip_amount_.</td>
</tr>
<tr>
<td>provider_data?</td>
<td>String</td>
<td>A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider.</td>
</tr>
<tr>
<td>photo_url?</td>
<td>String</td>
<td>URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.</td>
</tr>
<tr>
<td>photo_size?</td>
<td>Integer</td>
<td>Photo size in bytes</td>
</tr>
<tr>
<td>photo_width?</td>
<td>Integer</td>
<td>Photo width</td>
</tr>
<tr>
<td>photo_height?</td>
<td>Integer</td>
<td>Photo height</td>
</tr>
<tr>
<td>need_name?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s full name to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_phone_number?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s phone number to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_email?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s email address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_shipping_address?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s shipping address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_phone_number_to_provider?</td>
<td>Boolean</td>
<td>Pass _True_ if the user&#39;s phone number should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_email_to_provider?</td>
<td>Boolean</td>
<td>Pass _True_ if the user&#39;s email address should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>is_flexible?</td>
<td>Boolean</td>
<td>Pass _True_ if the final price depends on the shipping method. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
}
/**
 * <p>Represents a <a href="#inlinequeryresult">result</a> of an inline query that was chosen by the user and sent to their chat partner.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#choseninlineresult}
 */
export interface ChosenInlineResult {
<tr>
<td>result_id</td>
<td>String</td>
<td>The unique identifier for the result that was chosen</td>
</tr>
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>The user that chose the result</td>
</tr>
<tr>
<td>location?</td>
<td><a href="#location">Location</a></td>
<td>Sender location, only for bots that require user location</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Identifier of the sent inline message. Available only if there is an <a href="#inlinekeyboardmarkup">inline keyboard</a> attached to the message. Will be also received in <a href="#callbackquery">callback queries</a> and can be used to <a href="#updating-messages">edit</a> the message.</td>
</tr>
<tr>
<td>query</td>
<td>String</td>
<td>The query that was used to obtain the result</td>
</tr>
}
<p>**Note:** It is necessary to enable <a href="/bots/inline#collecting-feedback">inline feedback</a> via <a href="https://t.me/botfather">@BotFather</a> in order to receive these objects in updates.</p>
export interface ApiMethods {
  /**
    * <p>Use this method to set the result of an interaction with a <a href="/bots/webapps">Web App</a> and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a <a href="#sentwebappmessage">SentWebAppMessage</a> object is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#answerwebappquery}
    */
  answerWebAppQuery({
<tr>
<td>web_app_query_id</td>
<td>String</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>result</td>
<td><a href="#inlinequeryresult">InlineQueryResult</a></td>
<td>A JSON-serialized object describing the message to be sent</td>
</tr>
  }): SentWebAppMessage;
}
/**
 * <p>Describes an inline message sent by a <a href="/bots/webapps">Web App</a> on behalf of a user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#sentwebappmessage}
 */
export interface SentWebAppMessage {
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Identifier of the sent inline message. Available only if there is an <a href="#inlinekeyboardmarkup">inline keyboard</a> attached to the message.</td>
</tr>
}
export interface ApiMethods {
  /**
    * <p>Stores a message that can be sent by a user of a Mini App. Returns a <a href="#preparedinlinemessage">PreparedInlineMessage</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#savepreparedinlinemessage}
    */
  savePreparedInlineMessage({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Unique identifier of the target user that can use the prepared message</td>
</tr>
<tr>
<td>result</td>
<td><a href="#inlinequeryresult">InlineQueryResult</a></td>
<td>A JSON-serialized object describing the message to be sent</td>
</tr>
<tr>
<td>allow_user_chats?</td>
<td>Boolean</td>
<td>Pass _True_ if the message can be sent to private chats with users</td>
</tr>
<tr>
<td>allow_bot_chats?</td>
<td>Boolean</td>
<td>Pass _True_ if the message can be sent to private chats with bots</td>
</tr>
<tr>
<td>allow_group_chats?</td>
<td>Boolean</td>
<td>Pass _True_ if the message can be sent to group and supergroup chats</td>
</tr>
<tr>
<td>allow_channel_chats?</td>
<td>Boolean</td>
<td>Pass _True_ if the message can be sent to channel chats</td>
</tr>
  }): PreparedInlineMessage;
}
/**
 * <p>Describes an inline message to be sent by a user of a Mini App.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#preparedinlinemessage}
 */
export interface PreparedInlineMessage {
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier of the prepared message</td>
</tr>
<tr>
<td>expiration_date</td>
<td>Integer</td>
<td>Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used</td>
</tr>
}

// === PAYMENTS ===
export interface ApiMethods {
  /**
    * <p>Use this method to send invoices. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#sendinvoice}
    */
  sendInvoice({
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>direct_messages_topic_id?</td>
<td>Integer</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Product name, 1-32 characters</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Product description, 1-255 characters</td>
</tr>
<tr>
<td>payload</td>
<td>String</td>
<td>Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.</td>
</tr>
<tr>
<td>provider_token?</td>
<td>String</td>
<td>Payment provider token, obtained via <a href="https://t.me/botfather">@BotFather</a>. Pass an empty string for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Three-letter ISO 4217 currency code, see <a href="/bots/payments#supported-currencies">more on currencies</a>. Pass “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>max_tip_amount?</td>
<td>Integer</td>
<td>The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>suggested_tip_amounts?</td>
<td>Array of Integer</td>
<td>A JSON-serialized array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max_tip_amount_.</td>
</tr>
<tr>
<td>start_parameter?</td>
<td>String</td>
<td>Unique deep-linking parameter. If left empty, **forwarded copies** of the sent message will have a _Pay_ button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a _URL_ button with a deep link to the bot (instead of a _Pay_ button), with the value used as the start parameter</td>
</tr>
<tr>
<td>provider_data?</td>
<td>String</td>
<td>JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.</td>
</tr>
<tr>
<td>photo_url?</td>
<td>String</td>
<td>URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.</td>
</tr>
<tr>
<td>photo_size?</td>
<td>Integer</td>
<td>Photo size in bytes</td>
</tr>
<tr>
<td>photo_width?</td>
<td>Integer</td>
<td>Photo width</td>
</tr>
<tr>
<td>photo_height?</td>
<td>Integer</td>
<td>Photo height</td>
</tr>
<tr>
<td>need_name?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s full name to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_phone_number?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s phone number to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_email?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s email address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_shipping_address?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s shipping address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_phone_number_to_provider?</td>
<td>Boolean</td>
<td>Pass _True_ if the user&#39;s phone number should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_email_to_provider?</td>
<td>Boolean</td>
<td>Pass _True_ if the user&#39;s email address should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>is_flexible?</td>
<td>Boolean</td>
<td>Pass _True_ if the final price depends on the shipping method. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters?</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>. If empty, one &#39;Pay `total price`&#39; button will be shown. If not empty, the first button must be a Pay button.</td>
</tr>
  }): Message;
}
export interface ApiMethods {
  /**
    * <p>Use this method to create a link for an invoice. Returns the created invoice link as _String_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#createinvoicelink}
    */
  createInvoiceLink({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the link will be created. For payments in <a href="https://t.me/BotNews/90">Telegram Stars</a> only.</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Product name, 1-32 characters</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Product description, 1-255 characters</td>
</tr>
<tr>
<td>payload</td>
<td>String</td>
<td>Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.</td>
</tr>
<tr>
<td>provider_token?</td>
<td>String</td>
<td>Payment provider token, obtained via <a href="https://t.me/botfather">@BotFather</a>. Pass an empty string for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Three-letter ISO 4217 currency code, see <a href="/bots/payments#supported-currencies">more on currencies</a>. Pass “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>subscription_period?</td>
<td>Integer</td>
<td>The number of seconds the subscription will be active for before the next payment. The currency must be set to “XTR” (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars.</td>
</tr>
<tr>
<td>max_tip_amount?</td>
<td>Integer</td>
<td>The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>suggested_tip_amounts?</td>
<td>Array of Integer</td>
<td>A JSON-serialized array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max_tip_amount_.</td>
</tr>
<tr>
<td>provider_data?</td>
<td>String</td>
<td>JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.</td>
</tr>
<tr>
<td>photo_url?</td>
<td>String</td>
<td>URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.</td>
</tr>
<tr>
<td>photo_size?</td>
<td>Integer</td>
<td>Photo size in bytes</td>
</tr>
<tr>
<td>photo_width?</td>
<td>Integer</td>
<td>Photo width</td>
</tr>
<tr>
<td>photo_height?</td>
<td>Integer</td>
<td>Photo height</td>
</tr>
<tr>
<td>need_name?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s full name to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_phone_number?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s phone number to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_email?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s email address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_shipping_address?</td>
<td>Boolean</td>
<td>Pass _True_ if you require the user&#39;s shipping address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_phone_number_to_provider?</td>
<td>Boolean</td>
<td>Pass _True_ if the user&#39;s phone number should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_email_to_provider?</td>
<td>Boolean</td>
<td>Pass _True_ if the user&#39;s email address should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>is_flexible?</td>
<td>Boolean</td>
<td>Pass _True_ if the final price depends on the shipping method. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
    }): string;
}
export interface ApiMethods {
  /**
    * <p>If you sent an invoice requesting a shipping address and the parameter _is_flexible_ was specified, the Bot API will send an <a href="#update">Update</a> with a _shipping_query_ field to the bot. Use this method to reply to shipping queries. On success, _True_ is returned.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#answershippingquery}
    */
  answerShippingQuery({
<tr>
<td>shipping_query_id</td>
<td>String</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>ok</td>
<td>Boolean</td>
<td>Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible)</td>
</tr>
<tr>
<td>shipping_options?</td>
<td>Array of <a href="#shippingoption">ShippingOption</a></td>
<td>Required if _ok_ is _True_. A JSON-serialized array of available shipping options.</td>
</tr>
<tr>
<td>error_message?</td>
<td>String</td>
<td>Required if _ok_ is _False_. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user.</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an <a href="#update">Update</a> with the field _pre_checkout_query_. Use this method to respond to such pre-checkout queries. On success, _True_ is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
    */
  answerPreCheckoutQuery({
<tr>
<td>pre_checkout_query_id</td>
<td>String</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>ok</td>
<td>Boolean</td>
<td>Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems.</td>
</tr>
<tr>
<td>error_message?</td>
<td>String</td>
<td>Required if _ok_ is _False_. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. &quot;Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!&quot;). Telegram will display this message to the user.</td>
</tr>
  }): true;
}
  /**
   * <p>A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a <a href="#staramount">StarAmount</a> object.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#getmystarbalance}
   */
  getMyStarBalance(args: Empty): StarAmount;
export interface ApiMethods {
  /**
    * <p>Returns the bot&#39;s Telegram Star transactions in chronological order. On success, returns a <a href="#startransactions">StarTransactions</a> object.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#getstartransactions}
    */
  getStarTransactions({
<tr>
<td>offset?</td>
<td>Integer</td>
<td>Number of transactions to skip in the response</td>
</tr>
<tr>
<td>limit?</td>
<td>Integer</td>
<td>The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100.</td>
</tr>
  }): StarTransactions;
}
export interface ApiMethods {
  /**
    * <p>Refunds a successful payment in <a href="https://t.me/BotNews/90">Telegram Stars</a>. Returns _True_ on success.</p>
     *
     * @see {@link https://core.telegram.org/bots/api#refundstarpayment}
    */
  refundStarPayment({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Identifier of the user whose payment will be refunded</td>
</tr>
<tr>
<td>telegram_payment_charge_id</td>
<td>String</td>
<td>Telegram payment identifier</td>
</tr>
  }): true;
}
export interface ApiMethods {
  /**
    * <p>Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns _True_ on success.</p>
   *
     * @see {@link https://core.telegram.org/bots/api#edituserstarsubscription}
    */
  editUserStarSubscription({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Identifier of the user whose subscription will be edited</td>
</tr>
<tr>
<td>telegram_payment_charge_id</td>
<td>String</td>
<td>Telegram payment identifier for the subscription</td>
</tr>
<tr>
<td>is_canceled</td>
<td>Boolean</td>
<td>Pass _True_ to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass _False_ to allow the user to re-enable a subscription that was previously canceled by the bot.</td>
</tr>
  }): true;
}
/**
 * <p>This object represents a portion of the price for goods or services.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#labeledprice}
 */
export interface LabeledPrice {
<tr>
<td>label</td>
<td>String</td>
<td>Portion label</td>
</tr>
<tr>
<td>amount</td>
<td>Integer</td>
<td>Price of the product in the _smallest units_ of the <a href="/bots/payments#supported-currencies">currency</a> (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).</td>
</tr>
}
/**
 * <p>This object contains basic information about an invoice.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#invoice}
 */
export interface Invoice {
<tr>
<td>title</td>
<td>String</td>
<td>Product name</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Product description</td>
</tr>
<tr>
<td>start_parameter</td>
<td>String</td>
<td>Unique bot deep-linking parameter that can be used to generate this invoice</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a></td>
</tr>
<tr>
<td>total_amount</td>
<td>Integer</td>
<td>Total price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).</td>
</tr>
}
/**
 * <p>This object represents a shipping address.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#shippingaddress}
 */
export interface ShippingAddress {
<tr>
<td>country_code</td>
<td>String</td>
<td>Two-letter <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a> country code</td>
</tr>
<tr>
<td>state</td>
<td>String</td>
<td>State, if applicable</td>
</tr>
<tr>
<td>city</td>
<td>String</td>
<td>City</td>
</tr>
<tr>
<td>street_line1</td>
<td>String</td>
<td>First line for the address</td>
</tr>
<tr>
<td>street_line2</td>
<td>String</td>
<td>Second line for the address</td>
</tr>
<tr>
<td>post_code</td>
<td>String</td>
<td>Address post code</td>
</tr>
}
/**
 * <p>This object represents information about an order.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#orderinfo}
 */
export interface OrderInfo {
<tr>
<td>name?</td>
<td>String</td>
<td>User name</td>
</tr>
<tr>
<td>phone_number?</td>
<td>String</td>
<td>User&#39;s phone number</td>
</tr>
<tr>
<td>email?</td>
<td>String</td>
<td>User email</td>
</tr>
<tr>
<td>shipping_address?</td>
<td><a href="#shippingaddress">ShippingAddress</a></td>
<td>User shipping address</td>
</tr>
}
/**
 * <p>This object represents one shipping option.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#shippingoption}
 */
export interface ShippingOption {
<tr>
<td>id</td>
<td>String</td>
<td>Shipping option identifier</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Option title</td>
</tr>
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>List of price portions</td>
</tr>
}
/**
 * <p>This object contains basic information about a successful payment. Note that if the buyer initiates a chargeback with the relevant payment provider following this transaction, the funds may be debited from your balance. This is outside of Telegram&#39;s control.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#successfulpayment}
 */
export interface SuccessfulPayment {
<tr>
<td>currency</td>
<td>String</td>
<td>Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a></td>
</tr>
<tr>
<td>total_amount</td>
<td>Integer</td>
<td>Total price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).</td>
</tr>
<tr>
<td>invoice_payload</td>
<td>String</td>
<td>Bot-specified invoice payload</td>
</tr>
<tr>
<td>subscription_expiration_date?</td>
<td>Integer</td>
<td>Expiration date of the subscription, in Unix time; for recurring payments only</td>
</tr>
<tr>
<td>is_recurring?</td>
<td>True</td>
<td>_True_, if the payment is a recurring payment for a subscription</td>
</tr>
<tr>
<td>is_first_recurring?</td>
<td>True</td>
<td>_True_, if the payment is the first payment for a subscription</td>
</tr>
<tr>
<td>shipping_option_id?</td>
<td>String</td>
<td>Identifier of the shipping option chosen by the user</td>
</tr>
<tr>
<td>order_info?</td>
<td><a href="#orderinfo">OrderInfo</a></td>
<td>Order information provided by the user</td>
</tr>
<tr>
<td>telegram_payment_charge_id</td>
<td>String</td>
<td>Telegram payment identifier</td>
</tr>
<tr>
<td>provider_payment_charge_id</td>
<td>String</td>
<td>Provider payment identifier</td>
</tr>
}
/**
 * <p>This object contains basic information about a refunded payment.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#refundedpayment}
 */
export interface RefundedPayment {
<tr>
<td>currency</td>
<td>String</td>
<td>Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>. Currently, always “XTR”</td>
</tr>
<tr>
<td>total_amount</td>
<td>Integer</td>
<td>Total refunded price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45`, `total_amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).</td>
</tr>
<tr>
<td>invoice_payload</td>
<td>String</td>
<td>Bot-specified invoice payload</td>
</tr>
<tr>
<td>telegram_payment_charge_id</td>
<td>String</td>
<td>Telegram payment identifier</td>
</tr>
<tr>
<td>provider_payment_charge_id?</td>
<td>String</td>
<td>Provider payment identifier</td>
</tr>
}
/**
 * <p>This object contains information about an incoming shipping query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#shippingquery}
 */
export interface ShippingQuery {
<tr>
<td>id</td>
<td>String</td>
<td>Unique query identifier</td>
</tr>
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>User who sent the query</td>
</tr>
<tr>
<td>invoice_payload</td>
<td>String</td>
<td>Bot-specified invoice payload</td>
</tr>
<tr>
<td>shipping_address</td>
<td><a href="#shippingaddress">ShippingAddress</a></td>
<td>User specified shipping address</td>
</tr>
}
/**
 * <p>This object contains information about an incoming pre-checkout query.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#precheckoutquery}
 */
export interface PreCheckoutQuery {
<tr>
<td>id</td>
<td>String</td>
<td>Unique query identifier</td>
</tr>
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>User who sent the query</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a></td>
</tr>
<tr>
<td>total_amount</td>
<td>Integer</td>
<td>Total price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).</td>
</tr>
<tr>
<td>invoice_payload</td>
<td>String</td>
<td>Bot-specified invoice payload</td>
</tr>
<tr>
<td>shipping_option_id?</td>
<td>String</td>
<td>Identifier of the shipping option chosen by the user</td>
</tr>
<tr>
<td>order_info?</td>
<td><a href="#orderinfo">OrderInfo</a></td>
<td>Order information provided by the user</td>
</tr>
}
/**
 * <p>This object contains information about a paid media purchase.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#paidmediapurchased}
 */
export interface PaidMediaPurchased {
<tr>
<td>from</td>
<td><a href="#user">User</a></td>
<td>User who purchased the media</td>
</tr>
<tr>
<td>paid_media_payload</td>
<td>String</td>
<td>Bot-specified paid media payload</td>
</tr>
}
/**
 * <p>This object describes the state of a revenue withdrawal operation. Currently, it can be one of</p>
 * - RevenueWithdrawalStatePending
 * - RevenueWithdrawalStateSucceeded
 * - RevenueWithdrawalStateFailed
 *
 * @see {@link https://core.telegram.org/bots/api#revenuewithdrawalstate}
 */
export type RevenueWithdrawalState =
 | RevenueWithdrawalStatePending
 | RevenueWithdrawalStateSucceeded
 | RevenueWithdrawalStateFailed
 /**
  * <p>The withdrawal is in progress.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#revenuewithdrawalstatepending}
 */
export interface RevenueWithdrawalStatePending {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the state, always “pending”</td>
</tr>
}
/**
 * <p>The withdrawal succeeded.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#revenuewithdrawalstatesucceeded}
 */
export interface RevenueWithdrawalStateSucceeded {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the state, always “succeeded”</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the withdrawal was completed in Unix time</td>
</tr>
<tr>
<td>url</td>
<td>String</td>
<td>An HTTPS URL that can be used to see transaction details</td>
</tr>
}
/**
 * <p>The withdrawal failed and the transaction was refunded.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#revenuewithdrawalstatefailed}
 */
export interface RevenueWithdrawalStateFailed {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the state, always “failed”</td>
</tr>
}
/**
 * <p>Contains information about the affiliate that received a commission via this transaction.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#affiliateinfo}
 */
export interface AffiliateInfo {
<tr>
<td>affiliate_user?</td>
<td><a href="#user">User</a></td>
<td>The bot or the user that received an affiliate commission if it was received by a bot or a user</td>
</tr>
<tr>
<td>affiliate_chat?</td>
<td><a href="#chat">Chat</a></td>
<td>The chat that received an affiliate commission if it was received by a chat</td>
</tr>
<tr>
<td>commission_per_mille</td>
<td>Integer</td>
<td>The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users</td>
</tr>
<tr>
<td>amount</td>
<td>Integer</td>
<td>Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds</td>
</tr>
<tr>
<td>nanostar_amount?</td>
<td>Integer</td>
<td>The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds</td>
</tr>
}
/**
 * <p>This object describes the source of a transaction, or its recipient for outgoing transactions. Currently, it can be one of</p>
 * - TransactionPartnerUser
 * - TransactionPartnerChat
 * - TransactionPartnerAffiliateProgram
 * - TransactionPartnerFragment
 * - TransactionPartnerTelegramAds
 * - TransactionPartnerTelegramApi
 * - TransactionPartnerOther
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartner}
 */
export type TransactionPartner =
 | TransactionPartnerUser
 | TransactionPartnerChat
 | TransactionPartnerAffiliateProgram
 | TransactionPartnerFragment
 | TransactionPartnerTelegramAds
 | TransactionPartnerTelegramApi
 | TransactionPartnerOther
 /**
  * <p>Describes a transaction with a user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartneruser}
 */
export interface TransactionPartnerUser {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the transaction partner, always “user”</td>
</tr>
<tr>
<td>transaction_type</td>
<td>String</td>
<td>Type of the transaction, currently one of “invoice_payment” for payments via invoices, “paid_media_payment” for payments for paid media, “gift_purchase” for gifts sent by the bot, “premium_purchase” for Telegram Premium subscriptions gifted by the bot, “business_account_transfer” for direct transfers from managed business accounts</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>Information about the user</td>
</tr>
<tr>
<td>affiliate?</td>
<td><a href="#affiliateinfo">AffiliateInfo</a></td>
<td>Information about the affiliate that received a commission via this transaction. Can be available only for “invoice_payment” and “paid_media_payment” transactions.</td>
</tr>
<tr>
<td>invoice_payload?</td>
<td>String</td>
<td>Bot-specified invoice payload. Can be available only for “invoice_payment” transactions.</td>
</tr>
<tr>
<td>subscription_period?</td>
<td>Integer</td>
<td>The duration of the paid subscription. Can be available only for “invoice_payment” transactions.</td>
</tr>
<tr>
<td>paid_media?</td>
<td>Array of <a href="#paidmedia">PaidMedia</a></td>
<td>Information about the paid media bought by the user; for “paid_media_payment” transactions only</td>
</tr>
<tr>
<td>paid_media_payload?</td>
<td>String</td>
<td>Bot-specified paid media payload. Can be available only for “paid_media_payment” transactions.</td>
</tr>
<tr>
<td>gift?</td>
<td><a href="#gift">Gift</a></td>
<td>The gift sent to the user by the bot; for “gift_purchase” transactions only</td>
</tr>
<tr>
<td>premium_subscription_duration?</td>
<td>Integer</td>
<td>Number of months the gifted Telegram Premium subscription will be active for; for “premium_purchase” transactions only</td>
</tr>
}
/**
 * <p>Describes a transaction with a chat.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartnerchat}
 */
export interface TransactionPartnerChat {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the transaction partner, always “chat”</td>
</tr>
<tr>
<td>chat</td>
<td><a href="#chat">Chat</a></td>
<td>Information about the chat</td>
</tr>
<tr>
<td>gift?</td>
<td><a href="#gift">Gift</a></td>
<td>The gift sent to the chat by the bot</td>
</tr>
}
/**
 * <p>Describes the affiliate program that issued the affiliate commission received via this transaction.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartneraffiliateprogram}
 */
export interface TransactionPartnerAffiliateProgram {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the transaction partner, always “affiliate_program”</td>
</tr>
<tr>
<td>sponsor_user?</td>
<td><a href="#user">User</a></td>
<td>Information about the bot that sponsored the affiliate program</td>
</tr>
<tr>
<td>commission_per_mille</td>
<td>Integer</td>
<td>The number of Telegram Stars received by the bot for each 1000 Telegram Stars received by the affiliate program sponsor from referred users</td>
</tr>
}
/**
 * <p>Describes a withdrawal transaction with Fragment.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartnerfragment}
 */
export interface TransactionPartnerFragment {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the transaction partner, always “fragment”</td>
</tr>
<tr>
<td>withdrawal_state?</td>
<td><a href="#revenuewithdrawalstate">RevenueWithdrawalState</a></td>
<td>State of the transaction if the transaction is outgoing</td>
</tr>
}
/**
 * <p>Describes a withdrawal transaction to the Telegram Ads platform.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartnertelegramads}
 */
export interface TransactionPartnerTelegramAds {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the transaction partner, always “telegram_ads”</td>
</tr>
}
/**
 * <p>Describes a transaction with payment for <a href="#paid-broadcasts">paid broadcasting</a>.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartnertelegramapi}
 */
export interface TransactionPartnerTelegramApi {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the transaction partner, always “telegram_api”</td>
</tr>
<tr>
<td>request_count</td>
<td>Integer</td>
<td>The number of successful requests that exceeded regular limits and were therefore billed</td>
</tr>
}
/**
 * <p>Describes a transaction with an unknown source or recipient.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#transactionpartnerother}
 */
export interface TransactionPartnerOther {
<tr>
<td>type</td>
<td>String</td>
<td>Type of the transaction partner, always “other”</td>
</tr>
}
/**
 * <p>Describes a Telegram Star transaction. Note that if the buyer initiates a chargeback with the payment provider from whom they acquired Stars (e.g., Apple, Google) following this transaction, the refunded Stars will be deducted from the bot&#39;s balance. This is outside of Telegram&#39;s control.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#startransaction}
 */
export interface StarTransaction {
<tr>
<td>id</td>
<td>String</td>
<td>Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with _SuccessfulPayment.telegram_payment_charge_id_ for successful incoming payments from users.</td>
</tr>
<tr>
<td>amount</td>
<td>Integer</td>
<td>Integer amount of Telegram Stars transferred by the transaction</td>
</tr>
<tr>
<td>nanostar_amount?</td>
<td>Integer</td>
<td>The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999</td>
</tr>
<tr>
<td>date</td>
<td>Integer</td>
<td>Date the transaction was created in Unix time</td>
</tr>
<tr>
<td>source?</td>
<td><a href="#transactionpartner">TransactionPartner</a></td>
<td>Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions</td>
</tr>
<tr>
<td>receiver?</td>
<td><a href="#transactionpartner">TransactionPartner</a></td>
<td>Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions</td>
</tr>
}
/**
 * <p>Contains a list of Telegram Star transactions.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#startransactions}
 */
export interface StarTransactions {
<tr>
<td>transactions</td>
<td>Array of <a href="#startransaction">StarTransaction</a></td>
<td>The list of transactions</td>
</tr>
}

// === TELEGRAM PASSPORT ===
/**
 * <p>Describes Telegram Passport data shared with the bot by the user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportdata}
 */
export interface PassportData {
<tr>
<td>data</td>
<td>Array of <a href="#encryptedpassportelement">EncryptedPassportElement</a></td>
<td>Array with information about documents and other Telegram Passport elements that was shared with the bot</td>
</tr>
<tr>
<td>credentials</td>
<td><a href="#encryptedcredentials">EncryptedCredentials</a></td>
<td>Encrypted credentials required to decrypt the data</td>
</tr>
}
/**
 * <p>This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don&#39;t exceed 10MB.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportfile}
 */
export interface PassportFile {
<tr>
<td>file_id</td>
<td>String</td>
<td>Identifier for this file, which can be used to download or reuse the file</td>
</tr>
<tr>
<td>file_unique_id</td>
<td>String</td>
<td>Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.</td>
</tr>
<tr>
<td>file_size</td>
<td>Integer</td>
<td>File size in bytes</td>
</tr>
<tr>
<td>file_date</td>
<td>Integer</td>
<td>Unix time when the file was uploaded</td>
</tr>
}
/**
 * <p>Describes documents or other Telegram Passport elements shared with the bot by the user.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#encryptedpassportelement}
 */
export interface EncryptedPassportElement {
<tr>
<td>type</td>
<td>String</td>
<td>Element type. One of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”, “phone_number”, “email”.</td>
</tr>
<tr>
<td>data?</td>
<td>String</td>
<td>Base64-encoded encrypted Telegram Passport element data provided by the user; available only for “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport” and “address” types. Can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.</td>
</tr>
<tr>
<td>phone_number?</td>
<td>String</td>
<td>User&#39;s verified phone number; available only for “phone_number” type</td>
</tr>
<tr>
<td>email?</td>
<td>String</td>
<td>User&#39;s verified email address; available only for “email” type</td>
</tr>
<tr>
<td>files?</td>
<td>Array of <a href="#passportfile">PassportFile</a></td>
<td>Array of encrypted files with documents provided by the user; available only for “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.</td>
</tr>
<tr>
<td>front_side?</td>
<td><a href="#passportfile">PassportFile</a></td>
<td>Encrypted file with the front side of the document, provided by the user; available only for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.</td>
</tr>
<tr>
<td>reverse_side?</td>
<td><a href="#passportfile">PassportFile</a></td>
<td>Encrypted file with the reverse side of the document, provided by the user; available only for “driver_license” and “identity_card”. The file can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.</td>
</tr>
<tr>
<td>selfie?</td>
<td><a href="#passportfile">PassportFile</a></td>
<td>Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.</td>
</tr>
<tr>
<td>translation?</td>
<td>Array of <a href="#passportfile">PassportFile</a></td>
<td>Array of encrypted files with translated versions of documents provided by the user; available if requested for “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.</td>
</tr>
<tr>
<td>hash</td>
<td>String</td>
<td>Base64-encoded element hash for using in <a href="#passportelementerrorunspecified">PassportElementErrorUnspecified</a></td>
</tr>
}
/**
 * <p>Describes data required for decrypting and authenticating <a href="#encryptedpassportelement">EncryptedPassportElement</a>. See the <a href="/passport#receiving-information">Telegram Passport Documentation</a> for a complete description of the data decryption and authentication processes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#encryptedcredentials}
 */
export interface EncryptedCredentials {
<tr>
<td>data</td>
<td>String</td>
<td>Base64-encoded encrypted JSON-serialized data with unique user&#39;s payload, data hashes and secrets required for <a href="#encryptedpassportelement">EncryptedPassportElement</a> decryption and authentication</td>
</tr>
<tr>
<td>hash</td>
<td>String</td>
<td>Base64-encoded data hash for data authentication</td>
</tr>
<tr>
<td>secret</td>
<td>String</td>
<td>Base64-encoded secret, encrypted with the bot&#39;s public RSA key, required for data decryption</td>
</tr>
}
export interface ApiMethods {
  /**
   * <p>Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns _True_ on success.</p>
   * <p>Use this if the data submitted by the user doesn&#39;t satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#setpassportdataerrors}
   */
  setPassportDataErrors({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>User identifier</td>
</tr>
<tr>
<td>errors</td>
<td>Array of <a href="#passportelementerror">PassportElementError</a></td>
<td>A JSON-serialized array describing the errors</td>
</tr>
  }): true;
}
/**
 * <p>This object represents an error in the Telegram Passport element which was submitted that should be resolved by the user. It should be one of:</p>
 * - PassportElementErrorDataField
 * - PassportElementErrorFrontSide
 * - PassportElementErrorReverseSide
 * - PassportElementErrorSelfie
 * - PassportElementErrorFile
 * - PassportElementErrorFiles
 * - PassportElementErrorTranslationFile
 * - PassportElementErrorTranslationFiles
 * - PassportElementErrorUnspecified
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerror}
 */
export type PassportElementError =
 | PassportElementErrorDataField
 | PassportElementErrorFrontSide
 | PassportElementErrorReverseSide
 | PassportElementErrorSelfie
 | PassportElementErrorFile
 | PassportElementErrorFiles
 | PassportElementErrorTranslationFile
 | PassportElementErrorTranslationFiles
 | PassportElementErrorUnspecified
 /**
  * <p>Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field&#39;s value changes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrordatafield}
 */
export interface PassportElementErrorDataField {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _data_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>The section of the user&#39;s Telegram Passport which has the error, one of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”</td>
</tr>
<tr>
<td>field_name</td>
<td>String</td>
<td>Name of the data field which has the error</td>
</tr>
<tr>
<td>data_hash</td>
<td>String</td>
<td>Base64-encoded data hash</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrorfrontside}
 */
export interface PassportElementErrorFrontSide {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _front_side_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>The section of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”</td>
</tr>
<tr>
<td>file_hash</td>
<td>String</td>
<td>Base64-encoded hash of the file with the front side of the document</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrorreverseside}
 */
export interface PassportElementErrorReverseSide {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _reverse_side_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>The section of the user&#39;s Telegram Passport which has the issue, one of “driver_license”, “identity_card”</td>
</tr>
<tr>
<td>file_hash</td>
<td>String</td>
<td>Base64-encoded hash of the file with the reverse side of the document</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrorselfie}
 */
export interface PassportElementErrorSelfie {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _selfie_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>The section of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”</td>
</tr>
<tr>
<td>file_hash</td>
<td>String</td>
<td>Base64-encoded hash of the file with the selfie</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrorfile}
 */
export interface PassportElementErrorFile {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _file_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>The section of the user&#39;s Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”</td>
</tr>
<tr>
<td>file_hash</td>
<td>String</td>
<td>Base64-encoded file hash</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrorfiles}
 */
export interface PassportElementErrorFiles {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _files_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>The section of the user&#39;s Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”</td>
</tr>
<tr>
<td>file_hashes</td>
<td>Array of String</td>
<td>List of base64-encoded file hashes</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrortranslationfile}
 */
export interface PassportElementErrorTranslationFile {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _translation_file_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Type of element of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”</td>
</tr>
<tr>
<td>file_hash</td>
<td>String</td>
<td>Base64-encoded file hash</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrortranslationfiles}
 */
export interface PassportElementErrorTranslationFiles {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _translation_files_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Type of element of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”</td>
</tr>
<tr>
<td>file_hashes</td>
<td>Array of String</td>
<td>List of base64-encoded file hashes</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}
/**
 * <p>Represents an issue in an unspecified place. The error is considered resolved when new data is added.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#passportelementerrorunspecified}
 */
export interface PassportElementErrorUnspecified {
<tr>
<td>source</td>
<td>String</td>
<td>Error source, must be _unspecified_</td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Type of element of the user&#39;s Telegram Passport which has the issue</td>
</tr>
<tr>
<td>element_hash</td>
<td>String</td>
<td>Base64-encoded element hash</td>
</tr>
<tr>
<td>message</td>
<td>String</td>
<td>Error message</td>
</tr>
}

// === GAMES ===
export interface ApiMethods {
  /**
   * <p>Use this method to send a game. On success, the sent <a href="#message">Message</a> is returned.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#sendgame}
   */
  sendGame({
<tr>
<td>business_connection_id?</td>
<td>String</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Unique identifier for the target chat. Games can&#39;t be sent to channel direct messages chats and channel chats.</td>
</tr>
<tr>
<td>message_thread_id?</td>
<td>Integer</td>
<td>Unique identifier for the target message thread (topic) of the forum; for forum supergroups only</td>
</tr>
<tr>
<td>game_short_name</td>
<td>String</td>
<td>Short name of the game, serves as the unique identifier for the game. Set up your games via <a href="https://t.me/botfather">@BotFather</a>.</td>
</tr>
<tr>
<td>disable_notification?</td>
<td>Boolean</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content?</td>
<td>Boolean</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast?</td>
<td>Boolean</td>
<td>Pass _True_ to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance</td>
</tr>
<tr>
<td>message_effect_id?</td>
<td>String</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>reply_parameters?</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup?</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>. If empty, one &#39;Play game_title&#39; button will be shown. If not empty, the first button must launch the game.</td>
</tr>
  }): Message;
}
/**
 * <p>This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#game}
 */
export interface Game {
<tr>
<td>title</td>
<td>String</td>
<td>Title of the game</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Description of the game</td>
</tr>
<tr>
<td>photo</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Photo that will be displayed in the game message in chats.</td>
</tr>
<tr>
<td>text?</td>
<td>String</td>
<td>Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls <a href="#setgamescore">setGameScore</a>, or manually edited using <a href="#editmessagetext">editMessageText</a>. 0-4096 characters.</td>
</tr>
<tr>
<td>text_entities?</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Special entities that appear in _text_, such as usernames, URLs, bot commands, etc.</td>
</tr>
<tr>
<td>animation?</td>
<td><a href="#animation">Animation</a></td>
<td>Animation that will be displayed in the game message in chats. Upload via <a href="https://t.me/botfather">BotFather</a></td>
</tr>
}
/**
 * <p>A placeholder, currently holds no information. Use <a href="https://t.me/botfather">BotFather</a> to set up your game.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#callbackgame}
 */
export type CallbackGame = Empty;
export interface ApiMethods {
  /**
   * <p>Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the <a href="#message">Message</a> is returned, otherwise _True_ is returned. Returns an error, if the new score is not greater than the user&#39;s current score in the chat and _force_ is _False_.</p>
   *
   * @see {@link https://core.telegram.org/bots/api#setgamescore}
   */
  setGameScore({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>User identifier</td>
</tr>
<tr>
<td>score</td>
<td>Integer</td>
<td>New score, must be non-negative</td>
</tr>
<tr>
<td>force?</td>
<td>Boolean</td>
<td>Pass _True_ if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters</td>
</tr>
<tr>
<td>disable_edit_message?</td>
<td>Boolean</td>
<td>Pass _True_ if the game message should not be automatically edited to include the current scoreboard</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the sent message</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
  }): true | Message;
}
export interface ApiMethods {
  /**
   * <p>Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of <a href="#gamehighscore">GameHighScore</a> objects.</p>
   * <blockquote>
   * <p>This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.</p>
   * </blockquote>
   *
   * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
   */
  getGameHighScores({
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Target user id</td>
</tr>
<tr>
<td>chat_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Unique identifier for the target chat</td>
</tr>
<tr>
<td>message_id?</td>
<td>Integer</td>
<td>Required if _inline_message_id_ is not specified. Identifier of the sent message</td>
</tr>
<tr>
<td>inline_message_id?</td>
<td>String</td>
<td>Required if _chat_id_ and _message_id_ are not specified. Identifier of the inline message</td>
</tr>
  }): GameHighScore[];
}
/**
 * <p>This object represents one row of the high scores table for a game.</p>
 *
 * @see {@link https://core.telegram.org/bots/api#gamehighscore}
 */
export interface GameHighScore {
<tr>
<td>position</td>
<td>Integer</td>
<td>Position in high score table for the game</td>
</tr>
<tr>
<td>user</td>
<td><a href="#user">User</a></td>
<td>User</td>
</tr>
<tr>
<td>score</td>
<td>Integer</td>
<td>Score</td>
</tr>
}
