// === MAKING REQUESTS
/**
 * Structure of an HTTP response body from the Bot API.
 * 
 * The response contains a JSON object, which always has a Boolean field &#39;ok&#39; and may have an optional String field &#39;description&#39; with a human-readable description of the result. If &#39;ok&#39; equals <em>True</em>, the request was successful and the result of the query can be found in the &#39;result&#39; field. In case of an unsuccessful request, &#39;ok&#39; equals <em>False</em> and the error is explained in the &#39;description&#39;. An Integer &#39;error_code&#39; field is also returned, but its contents are subject to change in the future. Some errors may also have an optional field &#39;parameters&#39; of the type <a href="#responseparameters">ResponseParameters</a>, which can help to automatically handle the error.
 */
export type ApiResponse<T> = ApiError | ApiSuccess<T>
/**
 * Structure of an HTTP response body from the Bot API for a failed request
 */
export interface ApiError {
    /**
     * Indicates that the request has failed
     */
    ok: false;
    /**
     * Error code of the failing request, subject to change
     */
    error_code: number;
    /**
     * A human-readable explanation of the error
     */
    description: string;
    /**
     * Parameters which can help to automatically handle the error
     */
    parameters?: ResponseParameters;
}
/**
 * Structure of an HTTP response body from the Bot API for a successful request
 */
export interface ApiSuccess<T> {
    /**
     * Indicates that the request has succeeded
     */
    ok: true;
    /**
     * Result of the query
     */
    result: T;
}
// === GETTING UPDATES
/**
 * This <a href="#available-types">object</a> represents an incoming update.<br>At most <strong>one</strong> of the optional fields can be present in any given update.
 */
export interface Update {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The update&#39;s unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you&#39;re using <a href="#setwebhook">webhooks</a>, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.
   */
  update_id: number;
  /**
   * New incoming message of any kind - text, photo, sticker, etc.
   */
  message?: Message;
  /**
   * New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.
   */
  edited_message?: Message;
  /**
   * New incoming channel post of any kind - text, photo, sticker, etc.
   */
  channel_post?: Message;
  /**
   * New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.
   */
  edited_channel_post?: Message;
  /**
   * The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot
   */
  business_connection?: BusinessConnection;
  /**
   * New message from a connected business account
   */
  business_message?: Message;
  /**
   * New version of a message from a connected business account
   */
  edited_business_message?: Message;
  /**
   * Messages were deleted from a connected business account
   */
  deleted_business_messages?: BusinessMessagesDeleted;
  /**
   * New guest message. The bot can use the field <em>Message.guest_query_id</em> and the method <a href="#answerguestquery">answerGuestQuery</a> to send a message in response.
   */
  guest_message?: Message;
  /**
   * A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify <code>&quot;message_reaction&quot;</code> in the list of <em>allowed_updates</em> to receive these updates. The update isn&#39;t received for reactions set by bots.
   */
  message_reaction?: MessageReactionUpdated;
  /**
   * Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify <code>&quot;message_reaction_count&quot;</code> in the list of <em>allowed_updates</em> to receive these updates. The updates are grouped and can be sent with delay up to a few minutes.
   */
  message_reaction_count?: MessageReactionCountUpdated;
  /**
   * New incoming <a href="#inline-mode">inline</a> query
   */
  inline_query?: InlineQuery;
  /**
   * The result of an <a href="#inline-mode">inline</a> query that was chosen by a user and sent to their chat partner. Please see our documentation on the <a href="/bots/inline#collecting-feedback">feedback collecting</a> for details on how to enable these updates for your bot.
   */
  chosen_inline_result?: ChosenInlineResult;
  /**
   * New incoming callback query
   */
  callback_query?: CallbackQuery;
  /**
   * New incoming shipping query. Only for invoices with flexible price.
   */
  shipping_query?: ShippingQuery;
  /**
   * New incoming pre-checkout query. Contains full information about checkout.
   */
  pre_checkout_query?: PreCheckoutQuery;
  /**
   * A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat
   */
  purchased_paid_media?: PaidMediaPurchased;
  /**
   * New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot.
   */
  poll?: Poll;
  /**
   * A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself.
   */
  poll_answer?: PollAnswer;
  /**
   * The bot&#39;s chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user.
   */
  my_chat_member?: ChatMemberUpdated;
  /**
   * A chat member&#39;s status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify <code>&quot;chat_member&quot;</code> in the list of <em>allowed_updates</em> to receive these updates.
   */
  chat_member?: ChatMemberUpdated;
  /**
   * A request to join the chat has been sent. The bot must have the <em>can_invite_users</em> administrator right in the chat to receive these updates.
   */
  chat_join_request?: ChatJoinRequest;
  /**
   * A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates.
   */
  chat_boost?: ChatBoostUpdated;
  /**
   * A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates.
   */
  removed_chat_boost?: ChatBoostRemoved;
  /**
   * A new bot was created to be managed by the bot, or token or owner of a managed bot was changed
   */
  managed_bot?: ManagedBotUpdated;
  /**
   * User payment subscription has changed
   */
  subscription?: BotSubscriptionUpdated;
</tbody>
</table>
}
export interface ApiMethods {
  /**
   * Use this method to receive incoming updates using long polling (<a href="https://en.wikipedia.org/wiki/Push_technology#Long_polling">wiki</a>). Returns an Array of <a href="#update">Update</a> objects.
   * 
   * > <strong>Notes</strong><br><strong>1.</strong> This method will not work if an outgoing webhook is set up.<br><strong>2.</strong> In order to avoid getting duplicate updates, recalculate <em>offset</em> after each server response.
   */
  getUpdates(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>offset</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as <a href="#getupdates">getUpdates</a> is called with an <em>offset</em> higher than its <em>update_id</em>. The negative offset can be specified to retrieve updates starting from <em>-offset</em> update from the end of the updates queue. All previous updates will be forgotten.</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Optional</td>
<td>Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.</td>
</tr>
<tr>
<td>timeout</td>
<td>Integer</td>
<td>Optional</td>
<td>Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.</td>
</tr>
<tr>
<td>allowed_updates</td>
<td>Array of String</td>
<td>Optional</td>
<td>A JSON-serialized list of the update types you want your bot to receive. For example, specify <code>[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]</code> to only receive updates of these types. See <a href="#update">Update</a> for a complete list of available update types. Specify an empty list to receive all update types except <em>chat_member</em>, <em>message_reaction</em>, and <em>message_reaction_count</em> (default). If not specified, the previous setting will be used.<br><br>Please note that this parameter doesn&#39;t affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized <a href="#update">Update</a>. In case of an unsuccessful request (a request with response <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes">HTTP status code</a> different from <code>2XY</code>), we will repeat the request and give up after a reasonable amount of attempts. Returns <em>True</em> on success.
   *
   * If you&#39;d like to make sure that the webhook was set by you, you can specify secret data in the parameter <em>secret_token</em>. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.
   * 
   * > <strong>Notes</strong><br><strong>1.</strong> You will not be able to receive updates using <a href="#getupdates">getUpdates</a> for as long as an outgoing webhook is set up.<br><strong>2.</strong> To use a self-signed certificate, you need to upload your <a href="/bots/self-signed">public key certificate</a> using <em>certificate</em> parameter. Please upload as InputFile, sending a String will not work.<br><strong>3.</strong> Ports currently supported <em>for webhooks</em>: <strong>443, 80, 88, 8443</strong>.
   *
   * > If you&#39;re having any trouble setting up webhooks, please check out this <a href="/bots/webhooks">amazing guide to webhooks</a>.
   */
  setWebhook(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>url</td>
<td>String</td>
<td>Yes</td>
<td>HTTPS URL to send updates to. Use an empty string to remove webhook integration.</td>
</tr>
<tr>
<td>certificate</td>
<td><a href="#inputfile">InputFile</a></td>
<td>Optional</td>
<td>Upload your public key certificate so that the root certificate in use can be checked. See our <a href="/bots/self-signed">self-signed guide</a> for details.</td>
</tr>
<tr>
<td>ip_address</td>
<td>String</td>
<td>Optional</td>
<td>The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS</td>
</tr>
<tr>
<td>max_connections</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to <em>40</em>. Use lower values to limit the load on your bot&#39;s server, and higher values to increase your bot&#39;s throughput.</td>
</tr>
<tr>
<td>allowed_updates</td>
<td>Array of String</td>
<td>Optional</td>
<td>A JSON-serialized list of the update types you want your bot to receive. For example, specify <code>[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]</code> to only receive updates of these types. See <a href="#update">Update</a> for a complete list of available update types. Specify an empty list to receive all update types except <em>chat_member</em>, <em>message_reaction</em>, and <em>message_reaction_count</em> (default). If not specified, the previous setting will be used.<br>Please note that this parameter doesn&#39;t affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.</td>
</tr>
<tr>
<td>drop_pending_updates</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to drop all pending updates</td>
</tr>
<tr>
<td>secret_token</td>
<td>String</td>
<td>Optional</td>
<td>A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>_</code> and <code>-</code> are allowed. The header is useful to ensure that the request comes from a webhook set by you.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to remove webhook integration if you decide to switch back to <a href="#getupdates">getUpdates</a>. Returns <em>True</em> on success.
   */
  deleteWebhook(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>drop_pending_updates</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to drop all pending updates</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get current webhook status. Requires no parameters. On success, returns a <a href="#webhookinfo">WebhookInfo</a> object. If the bot is using <a href="#getupdates">getUpdates</a>, will return an object with the <em>url</em> field empty.
   */
  getWebhookInfo(args: {}): never;
}
/**
 * Describes the current status of a webhook.
 */
export interface WebhookInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Webhook URL, may be empty if webhook is not set up
   */
  url: string;
  /**
   * <em>True</em>, if a custom certificate was provided for webhook certificate checks
   */
  has_custom_certificate: boolean;
  /**
   * Number of updates awaiting delivery
   */
  pending_update_count: number;
  /**
   * Currently used webhook IP address
   */
  ip_address?: string;
  /**
   * Unix time for the most recent error that happened when trying to deliver an update via webhook
   */
  last_error_date?: number;
  /**
   * Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook
   */
  last_error_message?: string;
  /**
   * Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters
   */
  last_synchronization_error_date?: number;
  /**
   * The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
   */
  max_connections?: number;
  /**
   * A list of update types the bot is subscribed to. Defaults to all update types except <em>chat_member</em>, <em>message_reaction</em>, and <em>message_reaction_count</em>.
   */
  allowed_updates?: string[];
</tbody>
</table>
}
// === AVAILABLE TYPES
<p>All types used in the Bot API responses are represented as JSON-objects.</p>
<p>It is safe to use 32-bit signed integers for storing all <strong>Integer</strong> fields unless otherwise noted.</p>
<blockquote>
<p><strong>Optional</strong> fields may be not returned when irrelevant.</p>
</blockquote>
/**
 * This object represents a Telegram user or bot.
 */
export interface User {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  id: number;
  /**
   * <em>True</em>, if this user is a bot
   */
  is_bot: boolean;
  /**
   * User&#39;s or bot&#39;s first name
   */
  first_name: string;
  /**
   * User&#39;s or bot&#39;s last name
   */
  last_name?: string;
  /**
   * User&#39;s or bot&#39;s username
   */
  username?: string;
  /**
   * <a href="https://en.wikipedia.org/wiki/IETF_language_tag">IETF language tag</a> of the user&#39;s language
   */
  language_code?: string;
  /**
   * <em>True</em>, if this user is a Telegram Premium user
   */
  is_premium?: true;
  /**
   * <em>True</em>, if this user added the bot to the attachment menu
   */
  added_to_attachment_menu?: true;
  /**
   * <em>True</em>, if the bot can be invited to groups. Returned only in <a href="#getme">getMe</a>.
   */
  can_join_groups?: boolean;
  /**
   * <em>True</em>, if <a href="/bots/features#privacy-mode">privacy mode</a> is disabled for the bot. Returned only in <a href="#getme">getMe</a>.
   */
  can_read_all_group_messages?: boolean;
  /**
   * <em>True</em>, if the bot supports guest queries from chats it is not a member of. Returned only in <a href="#getme">getMe</a>.
   */
  supports_guest_queries?: boolean;
  /**
   * <em>True</em>, if the bot supports inline queries. Returned only in <a href="#getme">getMe</a>.
   */
  supports_inline_queries?: boolean;
  /**
   * <em>True</em>, if the bot can be connected to a user account to manage it. Returned only in <a href="#getme">getMe</a>.
   */
  can_connect_to_business?: boolean;
  /**
   * <em>True</em>, if the bot has a main Web App. Returned only in <a href="#getme">getMe</a>.
   */
  has_main_web_app?: boolean;
  /**
   * <em>True</em>, if the bot has forum topic mode enabled in private chats. Returned only in <a href="#getme">getMe</a>.
   */
  has_topics_enabled?: boolean;
  /**
   * <em>True</em>, if the bot allows users to create and delete topics in private chats. Returned only in <a href="#getme">getMe</a>.
   */
  allows_users_to_create_topics?: boolean;
  /**
   * <em>True</em>, if other bots can be created to be controlled by the bot. Returned only in <a href="#getme">getMe</a>.
   */
  can_manage_bots?: boolean;
  /**
   * <em>True</em>, if the bot supports join request queries and can be assigned to process them. Returned only in <a href="#getme">getMe</a>.
   */
  supports_join_request_queries?: boolean;
</tbody>
</table>
}
/**
 * This object represents a chat.
 */
export interface Chat {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  id: number;
  /**
   * Type of the chat, can be either “private”, “group”, “supergroup” or “channel”
   */
  type: string;
  /**
   * Title, for supergroups, channels and group chats
   */
  title?: string;
  /**
   * Username, for private chats, supergroups and channels if available
   */
  username?: string;
  /**
   * First name of the other party in a private chat
   */
  first_name?: string;
  /**
   * Last name of the other party in a private chat
   */
  last_name?: string;
  /**
   * <em>True</em>, if the supergroup chat is a forum (has <a href="https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups">topics</a> enabled)
   */
  is_forum?: true;
  /**
   * <em>True</em>, if the chat is the direct messages chat of a channel
   */
  is_direct_messages?: true;
</tbody>
</table>
}
/**
 * This object contains full information about a chat.
 */
export interface ChatFullInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  id: number;
  /**
   * Type of the chat, can be either “private”, “group”, “supergroup” or “channel”
   */
  type: string;
  /**
   * Title, for supergroups, channels and group chats
   */
  title?: string;
  /**
   * Username, for private chats, supergroups and channels if available
   */
  username?: string;
  /**
   * First name of the other party in a private chat
   */
  first_name?: string;
  /**
   * Last name of the other party in a private chat
   */
  last_name?: string;
  /**
   * <em>True</em>, if the supergroup chat is a forum (has <a href="https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups">topics</a> enabled)
   */
  is_forum?: true;
  /**
   * <em>True</em>, if the chat is the direct messages chat of a channel
   */
  is_direct_messages?: true;
  /**
   * Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See <a href="#accent-colors">accent colors</a> for more details.
   */
  accent_color_id: number;
  /**
   * The maximum number of reactions that can be set on a message in the chat
   */
  max_reaction_count: number;
  /**
   * Chat photo
   */
  photo?: ChatPhoto;
  /**
   * If non-empty, the list of all <a href="https://telegram.org/blog/topics-in-groups-collectible-usernames#collectible-usernames">active chat usernames</a>; for private chats, supergroups and channels
   */
  active_usernames?: string[];
  /**
   * For private chats, the date of birth of the user
   */
  birthdate?: Birthdate;
  /**
   * For private chats with business accounts, the intro of the business
   */
  business_intro?: BusinessIntro;
  /**
   * For private chats with business accounts, the location of the business
   */
  business_location?: BusinessLocation;
  /**
   * For private chats with business accounts, the opening hours of the business
   */
  business_opening_hours?: BusinessOpeningHours;
  /**
   * For private chats, the personal channel of the user
   */
  personal_chat?: Chat;
  /**
   * Information about the corresponding channel chat; for direct messages chats only
   */
  parent_chat?: Chat;
  /**
   * List of available reactions allowed in the chat. If omitted, then all <a href="#reactiontypeemoji">emoji reactions</a> are allowed.
   */
  available_reactions?: ReactionType[];
  /**
   * Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background
   */
  background_custom_emoji_id?: string;
  /**
   * Identifier of the accent color for the chat&#39;s profile background. See <a href="#profile-accent-colors">profile accent colors</a> for more details.
   */
  profile_accent_color_id?: number;
  /**
   * Custom emoji identifier of the emoji chosen by the chat for its profile background
   */
  profile_background_custom_emoji_id?: string;
  /**
   * Custom emoji identifier of the emoji status of the chat or the other party in a private chat
   */
  emoji_status_custom_emoji_id?: string;
  /**
   * Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any
   */
  emoji_status_expiration_date?: number;
  /**
   * Bio of the other party in a private chat
   */
  bio?: string;
  /**
   * <em>True</em>, if privacy settings of the other party in the private chat allows to use <code>tg://user?id=&lt;user_id&gt;</code> links only in chats with the user
   */
  has_private_forwards?: true;
  /**
   * <em>True</em>, if the privacy settings of the other party restrict sending voice and video note messages in the private chat
   */
  has_restricted_voice_and_video_messages?: true;
  /**
   * <em>True</em>, if users need to join the supergroup before they can send messages
   */
  join_to_send_messages?: true;
  /**
   * <em>True</em>, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators
   */
  join_by_request?: true;
  /**
   * Description, for groups, supergroups and channel chats
   */
  description?: string;
  /**
   * Primary invite link, for groups, supergroups and channel chats
   */
  invite_link?: string;
  /**
   * The most recent pinned message (by sending date)
   */
  pinned_message?: Message;
  /**
   * Default chat member permissions, for groups and supergroups
   */
  permissions?: ChatPermissions;
  /**
   * Information about types of gifts that are accepted by the chat or by the corresponding user for private chats
   */
  accepted_gift_types: AcceptedGiftTypes;
  /**
   * <em>True</em>, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats.
   */
  can_send_paid_media?: true;
  /**
   * For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds
   */
  slow_mode_delay?: number;
  /**
   * For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions
   */
  unrestrict_boost_count?: number;
  /**
   * The time after which all messages sent to the chat will be automatically deleted; in seconds
   */
  message_auto_delete_time?: number;
  /**
   * <em>True</em>, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators.
   */
  has_aggressive_anti_spam_enabled?: true;
  /**
   * <em>True</em>, if non-administrators can only get the list of bots and administrators in the chat
   */
  has_hidden_members?: true;
  /**
   * <em>True</em>, if messages from the chat can&#39;t be forwarded to other chats
   */
  has_protected_content?: true;
  /**
   * <em>True</em>, if new chat members will have access to old messages; available only to chat administrators
   */
  has_visible_history?: true;
  /**
   * For supergroups, name of the group sticker set
   */
  sticker_set_name?: string;
  /**
   * <em>True</em>, if the bot can change the group sticker set
   */
  can_set_sticker_set?: true;
  /**
   * For supergroups, the name of the group&#39;s custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group.
   */
  custom_emoji_sticker_set_name?: string;
  /**
   * Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
   */
  linked_chat_id?: number;
  /**
   * For supergroups, the location to which the supergroup is connected
   */
  location?: ChatLocation;
  /**
   * For private chats, the rating of the user if any
   */
  rating?: UserRating;
  /**
   * For private chats, the first audio added to the profile of the user
   */
  first_profile_audio?: Audio;
  /**
   * The color scheme based on a unique gift that must be used for the chat&#39;s name, message replies and link previews
   */
  unique_gift_colors?: UniqueGiftColors;
  /**
   * The number of Telegram Stars a general user has to pay to send a message to the chat
   */
  paid_message_star_count?: number;
  /**
   * The bot that processes join request queries in the chat. The field is only available to chat administrators.
   */
  guard_bot?: User;
  /**
   * The <a href="#community">Community</a> to which the chat belongs
   */
  community?: Community;
</tbody>
</table>
}
/**
 * This object represents a message.
 */
export interface Message {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique message identifier inside this chat; 0 for ephemeral messages. In specific instances (e.g., a message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
   */
  message_id: number;
  /**
   * Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only
   */
  message_thread_id?: number;
  /**
   * Information about the direct messages chat topic that contains the message
   */
  direct_messages_topic?: DirectMessagesTopic;
  /**
   * Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats.
   */
  from?: User;
  /**
   * Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel&#39;s discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field <em>from</em> contains a fake sender user in non-channel chats.
   */
  sender_chat?: Chat;
  /**
   * If the sender of the message boosted the chat, the number of boosts added by the user
   */
  sender_boost_count?: number;
  /**
   * The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account.
   */
  sender_business_bot?: User;
  /**
   * Tag or custom title of the sender of the message; for supergroups only
   */
  sender_tag?: string;
  /**
   * For ephemeral messages, the user who received the message
   */
  receiver_user?: User;
  /**
   * For ephemeral messages, identifier of the ephemeral message inside this chat. The identifier may be reused for another ephemeral message after the message is deleted or expires.
   */
  ephemeral_message_id?: number;
  /**
   * Date the message was sent in Unix time. It is always a positive number, representing a valid date.
   */
  date: number;
  /**
   * The unique identifier for the guest query. Use this identifier with the method <a href="#answerguestquery">answerGuestQuery</a> to send a response message. If non-empty, the message belongs to the chat where the guest bot was summoned, which may not coincide with other existing bot chats sharing the same identifier.
   */
  guest_query_id?: string;
  /**
   * Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier.
   */
  business_connection_id?: string;
  /**
   * Chat the message belongs to
   */
  chat: Chat;
  /**
   * Information about the original message for forwarded messages
   */
  forward_origin?: MessageOrigin;
  /**
   * <em>True</em>, if the message is sent to a topic in a forum supergroup or a private chat with the bot
   */
  is_topic_message?: true;
  /**
   * <em>True</em>, if the message is a channel post that was automatically forwarded to the connected discussion group
   */
  is_automatic_forward?: true;
  /**
   * For replies in the same chat and message thread, the original message. Note that the <a href="#message">Message</a> object in this field will not contain further <em>reply_to_message</em> fields even if it itself is a reply. If the message is a reply to an ephemeral message, then this field may be omitted.
   */
  reply_to_message?: Message;
  /**
   * Information about the message that is being replied to, which may come from another chat or forum topic
   */
  external_reply?: ExternalReplyInfo;
  /**
   * For replies that quote part of the original message, the quoted part of the message
   */
  quote?: TextQuote;
  /**
   * For replies to a story, the original story
   */
  reply_to_story?: Story;
  /**
   * Identifier of the specific checklist task that is being replied to
   */
  reply_to_checklist_task_id?: number;
  /**
   * Persistent identifier of the specific poll option that is being replied to
   */
  reply_to_poll_option_id?: string;
  /**
   * Bot through which the message was sent
   */
  via_bot?: User;
  /**
   * For a message sent by a guest bot, this is the user whose original message triggered the bot&#39;s response
   */
  guest_bot_caller_user?: User;
  /**
   * For a message sent by a guest bot, this is the chat whose original message triggered the bot&#39;s response
   */
  guest_bot_caller_chat?: Chat;
  /**
   * Date the message was last edited in Unix time
   */
  edit_date?: number;
  /**
   * <em>True</em>, if the message can&#39;t be forwarded
   */
  has_protected_content?: true;
  /**
   * <em>True</em>, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message
   */
  is_from_offline?: true;
  /**
   * <em>True</em>, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can&#39;t be edited.
   */
  is_paid_post?: true;
  /**
   * The unique identifier inside this chat of a media message group this message belongs to
   */
  media_group_id?: string;
  /**
   * Signature of the post author for messages in channels, or the custom title of an anonymous group administrator
   */
  author_signature?: string;
  /**
   * The number of Telegram Stars that were paid by the sender of the message to send it
   */
  paid_star_count?: number;
  /**
   * For text messages, the actual UTF-8 text of the message
   */
  text?: string;
  /**
   * For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
   */
  entities?: MessageEntity[];
  /**
   * Options used for link preview generation for the message, if it is a text message and link preview options were changed
   */
  link_preview_options?: LinkPreviewOptions;
  /**
   * Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can&#39;t be edited.
   */
  suggested_post_info?: SuggestedPostInfo;
  /**
   * Unique identifier of the message effect added to the message
   */
  effect_id?: string;
  /**
   * Message is a rich formatted message
   */
  rich_message?: RichMessage;
  /**
   * Message is an animation, information about the animation. For backward compatibility, when this field is set, the <em>document</em> field will also be set.
   */
  animation?: Animation;
  /**
   * Message is an audio file, information about the file
   */
  audio?: Audio;
  /**
   * Message is a general file, information about the file
   */
  document?: Document;
  /**
   * Message is a live photo, information about the live photo. For backward compatibility, when this field is set, the <em>photo</em> field will also be set.
   */
  live_photo?: LivePhoto;
  /**
   * Message contains paid media; information about the paid media
   */
  paid_media?: PaidMediaInfo;
  /**
   * Message is a photo, available sizes of the photo
   */
  photo?: PhotoSize[];
  /**
   * Message is a sticker, information about the sticker
   */
  sticker?: Sticker;
  /**
   * Message is a forwarded story
   */
  story?: Story;
  /**
   * Message is a video, information about the video
   */
  video?: Video;
  /**
   * Message is a <a href="https://telegram.org/blog/video-messages-and-telescope">video note</a>, information about the video message
   */
  video_note?: VideoNote;
  /**
   * Message is a voice message, information about the file
   */
  voice?: Voice;
  /**
   * Caption for the animation, audio, document, paid media, photo, video or voice
   */
  caption?: string;
  /**
   * For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
   */
  caption_entities?: MessageEntity[];
  /**
   * <em>True</em>, if the caption must be shown above the message media
   */
  show_caption_above_media?: true;
  /**
   * <em>True</em>, if the message media is covered by a spoiler animation
   */
  has_media_spoiler?: true;
  /**
   * Message is a checklist
   */
  checklist?: Checklist;
  /**
   * Message is a shared contact, information about the contact
   */
  contact?: Contact;
  /**
   * Message is a dice with random value
   */
  dice?: Dice;
  /**
   * Message is a game, information about the game. <a href="#games">More about games »</a>
   */
  game?: Game;
  /**
   * Message is a native poll, information about the poll
   */
  poll?: Poll;
  /**
   * Message is a venue, information about the venue. For backward compatibility, when this field is set, the <em>location</em> field will also be set.
   */
  venue?: Venue;
  /**
   * Message is a shared location, information about the location
   */
  location?: Location;
  /**
   * New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)
   */
  new_chat_members?: User[];
  /**
   * A member was removed from the group, information about them (this member may be the bot itself)
   */
  left_chat_member?: User;
  /**
   * Service message: chat owner has left
   */
  chat_owner_left?: ChatOwnerLeft;
  /**
   * Service message: chat owner has changed
   */
  chat_owner_changed?: ChatOwnerChanged;
  /**
   * A chat title was changed to this value
   */
  new_chat_title?: string;
  /**
   * A chat photo was change to this value
   */
  new_chat_photo?: PhotoSize[];
  /**
   * Service message: the chat photo was deleted
   */
  delete_chat_photo?: true;
  /**
   * Service message: the group has been created
   */
  group_chat_created?: true;
  /**
   * Service message: the supergroup has been created. This field can&#39;t be received in a message coming through updates, because bot can&#39;t be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.
   */
  supergroup_chat_created?: true;
  /**
   * Service message: the channel has been created. This field can&#39;t be received in a message coming through updates, because bot can&#39;t be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.
   */
  channel_chat_created?: true;
  /**
   * Service message: auto-delete timer settings changed in the chat
   */
  message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
  /**
   * The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  migrate_to_chat_id?: number;
  /**
   * The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  migrate_from_chat_id?: number;
  /**
   * Specified message was pinned. Note that the <a href="#message">Message</a> object in this field will not contain further <em>reply_to_message</em> fields even if it itself is a reply.
   */
  pinned_message?: MaybeInaccessibleMessage;
  /**
   * Message is an invoice for a <a href="#payments">payment</a>, information about the invoice. <a href="#payments">More about payments »</a>
   */
  invoice?: Invoice;
  /**
   * Message is a service message about a successful payment, information about the payment. <a href="#payments">More about payments »</a>
   */
  successful_payment?: SuccessfulPayment;
  /**
   * Message is a service message about a refunded payment, information about the payment. <a href="#payments">More about payments »</a>
   */
  refunded_payment?: RefundedPayment;
  /**
   * Service message: users were shared with the bot
   */
  users_shared?: UsersShared;
  /**
   * Service message: a chat was shared with the bot
   */
  chat_shared?: ChatShared;
  /**
   * Service message: a regular gift was sent or received
   */
  gift?: GiftInfo;
  /**
   * Service message: a unique gift was sent or received
   */
  unique_gift?: UniqueGiftInfo;
  /**
   * Service message: upgrade of a gift was purchased after the gift was sent
   */
  gift_upgrade_sent?: GiftInfo;
  /**
   * The domain name of the website on which the user has logged in. <a href="/widgets/login">More about Telegram Login »</a>
   */
  connected_website?: string;
  /**
   * Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method <a href="/bots/webapps#initializing-mini-apps">requestWriteAccess</a>
   */
  write_access_allowed?: WriteAccessAllowed;
  /**
   * Telegram Passport data
   */
  passport_data?: PassportData;
  /**
   * Service message: a user in the chat triggered another user&#39;s proximity alert while sharing Live Location
   */
  proximity_alert_triggered?: ProximityAlertTriggered;
  /**
   * Service message: user boosted the chat
   */
  boost_added?: ChatBoostAdded;
  /**
   * Service message: chat background set
   */
  chat_background_set?: ChatBackground;
  /**
   * Service message: some tasks in a checklist were marked as done or not done
   */
  checklist_tasks_done?: ChecklistTasksDone;
  /**
   * Service message: tasks were added to a checklist
   */
  checklist_tasks_added?: ChecklistTasksAdded;
  /**
   * Service message: chat added to a <a href="#community">Community</a>
   */
  community_chat_added?: CommunityChatAdded;
  /**
   * Service message: chat removed from a <a href="#community">Community</a>
   */
  community_chat_removed?: CommunityChatRemoved;
  /**
   * Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed
   */
  direct_message_price_changed?: DirectMessagePriceChanged;
  /**
   * Service message: forum topic created
   */
  forum_topic_created?: ForumTopicCreated;
  /**
   * Service message: forum topic edited
   */
  forum_topic_edited?: ForumTopicEdited;
  /**
   * Service message: forum topic closed
   */
  forum_topic_closed?: ForumTopicClosed;
  /**
   * Service message: forum topic reopened
   */
  forum_topic_reopened?: ForumTopicReopened;
  /**
   * Service message: the &#39;General&#39; forum topic hidden
   */
  general_forum_topic_hidden?: GeneralForumTopicHidden;
  /**
   * Service message: the &#39;General&#39; forum topic unhidden
   */
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden;
  /**
   * Service message: a scheduled giveaway was created
   */
  giveaway_created?: GiveawayCreated;
  /**
   * The message is a scheduled giveaway message
   */
  giveaway?: Giveaway;
  /**
   * A giveaway with public winners was completed
   */
  giveaway_winners?: GiveawayWinners;
  /**
   * Service message: a giveaway without public winners was completed
   */
  giveaway_completed?: GiveawayCompleted;
  /**
   * Service message: user created a bot that will be managed by the current bot
   */
  managed_bot_created?: ManagedBotCreated;
  /**
   * Service message: the price for paid messages has changed in the chat
   */
  paid_message_price_changed?: PaidMessagePriceChanged;
  /**
   * Service message: answer option was added to a poll
   */
  poll_option_added?: PollOptionAdded;
  /**
   * Service message: answer option was deleted from a poll
   */
  poll_option_deleted?: PollOptionDeleted;
  /**
   * Service message: a suggested post was approved
   */
  suggested_post_approved?: SuggestedPostApproved;
  /**
   * Service message: approval of a suggested post has failed
   */
  suggested_post_approval_failed?: SuggestedPostApprovalFailed;
  /**
   * Service message: a suggested post was declined
   */
  suggested_post_declined?: SuggestedPostDeclined;
  /**
   * Service message: payment for a suggested post was received
   */
  suggested_post_paid?: SuggestedPostPaid;
  /**
   * Service message: payment for a suggested post was refunded
   */
  suggested_post_refunded?: SuggestedPostRefunded;
  /**
   * Service message: video chat scheduled
   */
  video_chat_scheduled?: VideoChatScheduled;
  /**
   * Service message: video chat started
   */
  video_chat_started?: VideoChatStarted;
  /**
   * Service message: video chat ended
   */
  video_chat_ended?: VideoChatEnded;
  /**
   * Service message: new participants invited to a video chat
   */
  video_chat_participants_invited?: VideoChatParticipantsInvited;
  /**
   * Service message: data sent by a Web App
   */
  web_app_data?: WebAppData;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message. <code>login_url</code> buttons are represented as ordinary <code>url</code> buttons.
   */
  reply_markup?: InlineKeyboardMarkup;
</tbody>
</table>
}
/**
 * This object represents a unique message identifier.
 */
export interface MessageId {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
   */
  message_id: number;
</tbody>
</table>
}
/**
 * This object describes a message that was deleted or is otherwise inaccessible to the bot.
 */
export interface InaccessibleMessage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Chat the message belonged to
   */
  chat: Chat;
  /**
   * Unique message identifier inside the chat
   */
  message_id: number;
  /**
   * Always 0. The field can be used to differentiate regular and inaccessible messages.
   */
  date: number;
</tbody>
</table>
}
/**
 * This object describes a message that can be inaccessible to the bot. It can be one of
 *
 * - <a href="#message">Message</a>
 * - <a href="#inaccessiblemessage">InaccessibleMessage</a>
 */
export type MaybeInaccessibleMessage =
 | <a href="#message">Message</a>
 | <a href="#inaccessiblemessage">InaccessibleMessage</a>
/**
 * This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.
 */
export interface MessageEntity {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the entity. Currently, can be “mention” (<code>@username</code>), “hashtag” (<code>#hashtag</code> or <code>#hashtag@chatusername</code>), “cashtag” (<code>$USD</code> or <code>$USD@chatusername</code>), “bot_command” (<code>/start@jobs_bot</code>), “url” (<code>https://telegram.org</code>), “email” (<code>do-not-reply@telegram.org</code>), “phone_number” (<code>+1-212-555-0123</code>), “bold” (<strong>bold text</strong>), “italic” (<em>italic text</em>), “underline” (underlined text), “strikethrough” (strikethrough text), “spoiler” (spoiler message), “blockquote” (block quotation), “expandable_blockquote” (collapsed-by-default block quotation), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users <a href="https://telegram.org/blog/edit#new-mentions">without usernames</a>), “custom_emoji” (for inline custom emoji stickers), or “date_time” (for formatted date and time).
   */
  type: string;
  /**
   * Offset in <a href="/api/entities#entity-length">UTF-16 code units</a> to the start of the entity
   */
  offset: number;
  /**
   * Length of the entity in <a href="/api/entities#entity-length">UTF-16 code units</a>
   */
  length: number;
  /**
   * For “text_link” only, URL that will be opened after user taps on the text
   */
  url?: string;
  /**
   * For “text_mention” only, the mentioned user
   */
  user?: User;
  /**
   * For “pre” only, the programming language of the entity text
   */
  language?: string;
  /**
   * For “custom_emoji” only, unique identifier of the custom emoji. Use <a href="#getcustomemojistickers">getCustomEmojiStickers</a> to get full information about the sticker.
   */
  custom_emoji_id?: string;
  /**
   * For “date_time” only, the Unix time associated with the entity
   */
  unix_time?: number;
  /**
   * For “date_time” only, the string that defines the formatting of the date and time. See <a href="#date-time-entity-formatting">date-time entity formatting</a> for more details.
   */
  date_time_format?: string;
</tbody>
</table>
}
/**
 * This object contains information about the quoted part of a message that is replied to by the given message.
 */
export interface TextQuote {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Text of the quoted part of a message that is replied to by the given message
   */
  text: string;
  /**
   * Special entities that appear in the quote. Currently, only <em>bold</em>, <em>italic</em>, <em>underline</em>, <em>strikethrough</em>, <em>spoiler</em>, <em>custom_emoji</em>, and <em>date_time</em> entities are kept in quotes.
   */
  entities?: MessageEntity[];
  /**
   * Approximate quote position in the original message in UTF-16 code units as specified by the sender
   */
  position: number;
  /**
   * <em>True</em>, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server.
   */
  is_manual?: true;
</tbody>
</table>
}
/**
 * This object contains information about a message that is being replied to, which may come from another chat or forum topic.
 */
export interface ExternalReplyInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Origin of the message replied to by the given message
   */
  origin: MessageOrigin;
  /**
   * Chat the original message belongs to. Available only if the chat is a supergroup or a channel.
   */
  chat?: Chat;
  /**
   * Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel.
   */
  message_id?: number;
  /**
   * Options used for link preview generation for the original message, if it is a text message
   */
  link_preview_options?: LinkPreviewOptions;
  /**
   * Message is an animation, information about the animation
   */
  animation?: Animation;
  /**
   * Message is an audio file, information about the file
   */
  audio?: Audio;
  /**
   * Message is a general file, information about the file
   */
  document?: Document;
  /**
   * Message is a live photo, information about the live photo
   */
  live_photo?: LivePhoto;
  /**
   * Message contains paid media; information about the paid media
   */
  paid_media?: PaidMediaInfo;
  /**
   * Message is a photo, available sizes of the photo
   */
  photo?: PhotoSize[];
  /**
   * Message is a sticker, information about the sticker
   */
  sticker?: Sticker;
  /**
   * Message is a forwarded story
   */
  story?: Story;
  /**
   * Message is a video, information about the video
   */
  video?: Video;
  /**
   * Message is a <a href="https://telegram.org/blog/video-messages-and-telescope">video note</a>, information about the video message
   */
  video_note?: VideoNote;
  /**
   * Message is a voice message, information about the file
   */
  voice?: Voice;
  /**
   * <em>True</em>, if the message media is covered by a spoiler animation
   */
  has_media_spoiler?: true;
  /**
   * Message is a checklist
   */
  checklist?: Checklist;
  /**
   * Message is a shared contact, information about the contact
   */
  contact?: Contact;
  /**
   * Message is a dice with random value
   */
  dice?: Dice;
  /**
   * Message is a game, information about the game. <a href="#games">More about games »</a>
   */
  game?: Game;
  /**
   * Message is a scheduled giveaway, information about the giveaway
   */
  giveaway?: Giveaway;
  /**
   * A giveaway with public winners was completed
   */
  giveaway_winners?: GiveawayWinners;
  /**
   * Message is an invoice for a <a href="#payments">payment</a>, information about the invoice. <a href="#payments">More about payments »</a>
   */
  invoice?: Invoice;
  /**
   * Message is a shared location, information about the location
   */
  location?: Location;
  /**
   * Message is a native poll, information about the poll
   */
  poll?: Poll;
  /**
   * Message is a venue, information about the venue
   */
  venue?: Venue;
</tbody>
</table>
}
/**
 * Describes reply parameters for the message that is being sent.
 */
export interface ReplyParameters {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier of the message that will be replied to in the current chat, or in the chat <em>chat_id</em> if it is specified. Required if <em>ephemeral_message_id</em> isn&#39;t specified.
   */
  message_id?: number;
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td><em>Optional</em>. If the message to be replied to is from a different chat, unique identifier for the chat or username of the bot, supergroup or channel in the format <code>@username</code>. Not supported for messages sent on behalf of a business account, messages from channel direct messages chats and ephemeral messages.</td>
</tr>
  /**
   * Identifier of the incoming ephemeral message that will be replied to in the current chat. A reply to an ephemeral message must itself be an ephemeral message. An ephemeral message may only be replied to within 15 seconds of being sent. Required if <em>message_id</em> isn&#39;t specified.
   */
  ephemeral_message_id?: number;
  /**
   * Pass <em>True</em> if the message should be sent even if the specified message to be replied to is not found. Always <em>False</em> for replies in another chat or forum topic, and sent ephemeral messages. Always <em>True</em> for messages sent on behalf of a business account.
   */
  allow_sending_without_reply?: boolean;
  /**
   * Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including <em>bold</em>, <em>italic</em>, <em>underline</em>, <em>strikethrough</em>, <em>spoiler</em>, <em>custom_emoji</em>, and <em>date_time</em> entities. The message will fail to send if the quote isn&#39;t found in the original message. Ignored for ephemeral messages.
   */
  quote?: string;
  /**
   * Mode for parsing entities in the quote. See <a href="#formatting-options">formatting options</a> for more details.
   */
  quote_parse_mode?: string;
  /**
   * A JSON-serialized list of special entities that appear in the quote. It can be specified instead of <em>quote_parse_mode</em>.
   */
  quote_entities?: MessageEntity[];
  /**
   * Position of the quote in the original message in UTF-16 code units
   */
  quote_position?: number;
  /**
   * Identifier of the specific checklist task to be replied to
   */
  checklist_task_id?: number;
  /**
   * Persistent identifier of the specific poll option to be replied to
   */
  poll_option_id?: string;
</tbody>
</table>
}
/**
 * This object describes the origin of a message. It can be one of
 *
 * - <a href="#messageoriginuser">MessageOriginUser</a>
 * - <a href="#messageoriginhiddenuser">MessageOriginHiddenUser</a>
 * - <a href="#messageoriginchat">MessageOriginChat</a>
 * - <a href="#messageoriginchannel">MessageOriginChannel</a>
 */
export type MessageOrigin =
 | <a href="#messageoriginuser">MessageOriginUser</a>
 | <a href="#messageoriginhiddenuser">MessageOriginHiddenUser</a>
 | <a href="#messageoriginchat">MessageOriginChat</a>
 | <a href="#messageoriginchannel">MessageOriginChannel</a>
/**
 * The message was originally sent by a known user.
 */
export interface MessageOriginUser {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the message origin, always “user”
   */
  type: string;
  /**
   * Date the message was sent originally in Unix time
   */
  date: number;
  /**
   * User that sent the message originally
   */
  sender_user: User;
</tbody>
</table>
}
/**
 * The message was originally sent by an unknown user.
 */
export interface MessageOriginHiddenUser {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the message origin, always “hidden_user”
   */
  type: string;
  /**
   * Date the message was sent originally in Unix time
   */
  date: number;
  /**
   * Name of the user that sent the message originally
   */
  sender_user_name: string;
</tbody>
</table>
}
/**
 * The message was originally sent on behalf of a chat to a group chat.
 */
export interface MessageOriginChat {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the message origin, always “chat”
   */
  type: string;
  /**
   * Date the message was sent originally in Unix time
   */
  date: number;
  /**
   * Chat that sent the message originally
   */
  sender_chat: Chat;
  /**
   * For messages originally sent by an anonymous chat administrator, original message author signature
   */
  author_signature?: string;
</tbody>
</table>
}
/**
 * The message was originally sent to a channel chat.
 */
export interface MessageOriginChannel {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the message origin, always “channel”
   */
  type: string;
  /**
   * Date the message was sent originally in Unix time
   */
  date: number;
  /**
   * Channel chat to which the message was originally sent
   */
  chat: Chat;
  /**
   * Unique message identifier inside the chat
   */
  message_id: number;
  /**
   * Signature of the original post author
   */
  author_signature?: string;
</tbody>
</table>
}
/**
 * This object represents one size of a photo or a <a href="#document">file</a> / <a href="#sticker">sticker</a> thumbnail.
 */
export interface PhotoSize {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Photo width
   */
  width: number;
  /**
   * Photo height
   */
  height: number;
  /**
   * File size in bytes
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound).
 */
export interface Animation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Video width as defined by the sender
   */
  width: number;
  /**
   * Video height as defined by the sender
   */
  height: number;
  /**
   * Duration of the video in seconds as defined by the sender
   */
  duration: number;
  /**
   * Animation thumbnail as defined by the sender
   */
  thumbnail?: PhotoSize;
  /**
   * Original animation filename as defined by the sender
   */
  file_name?: string;
  /**
   * MIME type of the file as defined by the sender
   */
  mime_type?: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents an audio file to be treated as music by the Telegram clients.
 */
export interface Audio {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Duration of the audio in seconds as defined by the sender
   */
  duration: number;
  /**
   * Performer of the audio as defined by the sender or by audio tags
   */
  performer?: string;
  /**
   * Title of the audio as defined by the sender or by audio tags
   */
  title?: string;
  /**
   * Original filename as defined by the sender
   */
  file_name?: string;
  /**
   * MIME type of the file as defined by the sender
   */
  mime_type?: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
  /**
   * Thumbnail of the album cover to which the music file belongs
   */
  thumbnail?: PhotoSize;
</tbody>
</table>
}
/**
 * This object represents a general file (as opposed to <a href="#photosize">photos</a>, <a href="#voice">voice messages</a> and <a href="#audio">audio files</a>).
 */
export interface Document {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Document thumbnail as defined by the sender
   */
  thumbnail?: PhotoSize;
  /**
   * Original filename as defined by the sender
   */
  file_name?: string;
  /**
   * MIME type of the file as defined by the sender
   */
  mime_type?: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents a live photo.
 */
export interface LivePhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Available sizes of the corresponding static photo
   */
  photo?: PhotoSize[];
  /**
   * Identifier for the video file which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for the video file which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Video width as defined by the sender
   */
  width: number;
  /**
   * Video height as defined by the sender
   */
  height: number;
  /**
   * Duration of the video in seconds as defined by the sender
   */
  duration: number;
  /**
   * MIME type of the file as defined by the sender
   */
  mime_type?: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents a story.
 */
export interface Story {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Chat that posted the story
   */
  chat: Chat;
  /**
   * Unique identifier for the story in the chat
   */
  id: number;
</tbody>
</table>
}
/**
 * This object represents a video file of a specific quality.
 */
export interface VideoQuality {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Video width
   */
  width: number;
  /**
   * Video height
   */
  height: number;
  /**
   * Codec that was used to encode the video, for example, “h264”, “h265”, or “av01”
   */
  codec: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents a video file.
 */
export interface Video {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Video width as defined by the sender
   */
  width: number;
  /**
   * Video height as defined by the sender
   */
  height: number;
  /**
   * Duration of the video in seconds as defined by the sender
   */
  duration: number;
  /**
   * Video thumbnail
   */
  thumbnail?: PhotoSize;
  /**
   * Available sizes of the cover of the video in the message
   */
  cover?: PhotoSize[];
  /**
   * Timestamp in seconds from which the video will play in the message
   */
  start_timestamp?: number;
  /**
   * List of available qualities of the video
   */
  qualities?: VideoQuality[];
  /**
   * Original filename as defined by the sender
   */
  file_name?: string;
  /**
   * MIME type of the file as defined by the sender
   */
  mime_type?: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents a <a href="https://telegram.org/blog/video-messages-and-telescope">video message</a> (available in Telegram apps as of <a href="https://telegram.org/blog/video-messages-and-telescope">v.4.0</a>).
 */
export interface VideoNote {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Video width and height (diameter of the video message) as defined by the sender
   */
  length: number;
  /**
   * Duration of the video in seconds as defined by the sender
   */
  duration: number;
  /**
   * Video thumbnail
   */
  thumbnail?: PhotoSize;
  /**
   * File size in bytes
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents a voice note.
 */
export interface Voice {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Duration of the audio in seconds as defined by the sender
   */
  duration: number;
  /**
   * MIME type of the file as defined by the sender
   */
  mime_type?: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * Describes the paid media added to a message.
 */
export interface PaidMediaInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The number of Telegram Stars that must be paid to buy access to the media
   */
  star_count: number;
<tr>
<td>paid_media</td>
<td>Array of <a href="#paidmedia">PaidMedia</a></td>
<td>Information about the paid media</td>
</tr>
</tbody>
</table>
}
/**
 * This object describes paid media. Currently, it can be one of
 *
 * - <a href="#paidmedialivephoto">PaidMediaLivePhoto</a>
 * - <a href="#paidmediaphoto">PaidMediaPhoto</a>
 * - <a href="#paidmediapreview">PaidMediaPreview</a>
 * - <a href="#paidmediavideo">PaidMediaVideo</a>
 */
export type PaidMedia =
 | <a href="#paidmedialivephoto">PaidMediaLivePhoto</a>
 | <a href="#paidmediaphoto">PaidMediaPhoto</a>
 | <a href="#paidmediapreview">PaidMediaPreview</a>
 | <a href="#paidmediavideo">PaidMediaVideo</a>
/**
 * The paid media is a <a href="#livephoto">live photo</a>.
 */
export interface PaidMediaLivePhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the paid media, always “live_photo”
   */
  type: string;
  /**
   * The photo
   */
  live_photo: LivePhoto;
</tbody>
</table>
}
/**
 * The paid media is a photo.
 */
export interface PaidMediaPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the paid media, always “photo”
   */
  type: string;
<tr>
<td>photo</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>The photo</td>
</tr>
</tbody>
</table>
}
/**
 * The paid media isn&#39;t available before the payment.
 */
export interface PaidMediaPreview {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the paid media, always “preview”
   */
  type: string;
  /**
   * Media width as defined by the sender
   */
  width?: number;
  /**
   * Media height as defined by the sender
   */
  height?: number;
  /**
   * Duration of the media in seconds as defined by the sender
   */
  duration?: number;
</tbody>
</table>
}
/**
 * The paid media is a video.
 */
export interface PaidMediaVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the paid media, always “video”
   */
  type: string;
  /**
   * The video
   */
  video: Video;
</tbody>
</table>
}
/**
 * This object represents a phone contact.
 */
export interface Contact {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Contact&#39;s phone number
   */
  phone_number: string;
  /**
   * Contact&#39;s first name
   */
  first_name: string;
  /**
   * Contact&#39;s last name
   */
  last_name?: string;
  /**
   * Contact&#39;s user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  user_id?: number;
  /**
   * Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a>
   */
  vcard?: string;
</tbody>
</table>
}
/**
 * This object represents an animated emoji that displays a random value.
 */
export interface Dice {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Emoji on which the dice throw animation is based
   */
  emoji: string;
  /**
   * Value of the dice, 1-6 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EAF.png" width="20" height="20" alt="🎯" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB3.png" width="20" height="20" alt="🎳" />” base emoji, 1-5 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F80.png" width="20" height="20" alt="🏀" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/E29ABD.png" width="20" height="20" alt="⚽" />” base emoji, 1-64 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB0.png" width="20" height="20" alt="🎰" />” base emoji
   */
  value: number;
</tbody>
</table>
}
/**
 * Represents an HTTP link.
 */
export interface Link {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * URL of the link
   */
  url: string;
</tbody>
</table>
}
/**
 * At most <strong>one</strong> of the optional fields can be present in any given object.
 */
export interface PollMedia {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Media is an animation, information about the animation
   */
  animation?: Animation;
  /**
   * Media is an audio file, information about the file; currently, can&#39;t be received in a poll option
   */
  audio?: Audio;
  /**
   * Media is a general file, information about the file; currently, can&#39;t be received in a poll option
   */
  document?: Document;
  /**
   * The HTTP link attached to the poll option
   */
  link?: Link;
  /**
   * Media is a live photo, information about the live photo
   */
  live_photo?: LivePhoto;
  /**
   * Media is a shared location, information about the location
   */
  location?: Location;
  /**
   * Media is a photo, available sizes of the photo
   */
  photo?: PhotoSize[];
  /**
   * Media is a sticker, information about the sticker; currently, for poll options only
   */
  sticker?: Sticker;
  /**
   * Media is a venue, information about the venue
   */
  venue?: Venue;
  /**
   * Media is a video, information about the video
   */
  video?: Video;
</tbody>
</table>
}
/**
 * This object represents the content of a poll description or a quiz explanation to be sent. It should be one of
 *
 * - <a href="#inputmediaanimation">InputMediaAnimation</a>
 * - <a href="#inputmediaaudio">InputMediaAudio</a>
 * - <a href="#inputmediadocument">InputMediaDocument</a>
 * - <a href="#inputmedialivephoto">InputMediaLivePhoto</a>
 * - <a href="#inputmedialocation">InputMediaLocation</a>
 * - <a href="#inputmediaphoto">InputMediaPhoto</a>
 * - <a href="#inputmediavenue">InputMediaVenue</a>
 * - <a href="#inputmediavideo">InputMediaVideo</a>
 */
export type InputPollMedia =
 | <a href="#inputmediaanimation">InputMediaAnimation</a>
 | <a href="#inputmediaaudio">InputMediaAudio</a>
 | <a href="#inputmediadocument">InputMediaDocument</a>
 | <a href="#inputmedialivephoto">InputMediaLivePhoto</a>
 | <a href="#inputmedialocation">InputMediaLocation</a>
 | <a href="#inputmediaphoto">InputMediaPhoto</a>
 | <a href="#inputmediavenue">InputMediaVenue</a>
 | <a href="#inputmediavideo">InputMediaVideo</a>
/**
 * This object represents the content of a poll option to be sent. It should be one of
 *
 * - <a href="#inputmediaanimation">InputMediaAnimation</a>
 * - <a href="#inputmedialink">InputMediaLink</a>
 * - <a href="#inputmedialivephoto">InputMediaLivePhoto</a>
 * - <a href="#inputmedialocation">InputMediaLocation</a>
 * - <a href="#inputmediaphoto">InputMediaPhoto</a>
 * - <a href="#inputmediasticker">InputMediaSticker</a>
 * - <a href="#inputmediavenue">InputMediaVenue</a>
 * - <a href="#inputmediavideo">InputMediaVideo</a>
 */
export type InputPollOptionMedia =
 | <a href="#inputmediaanimation">InputMediaAnimation</a>
 | <a href="#inputmedialink">InputMediaLink</a>
 | <a href="#inputmedialivephoto">InputMediaLivePhoto</a>
 | <a href="#inputmedialocation">InputMediaLocation</a>
 | <a href="#inputmediaphoto">InputMediaPhoto</a>
 | <a href="#inputmediasticker">InputMediaSticker</a>
 | <a href="#inputmediavenue">InputMediaVenue</a>
 | <a href="#inputmediavideo">InputMediaVideo</a>
/**
 * This object contains information about one answer option in a poll.
 */
export interface PollOption {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the option, persistent on option addition and deletion
   */
  persistent_id: string;
  /**
   * Option text, 1-100 characters
   */
  text: string;
  /**
   * Special entities that appear in the option <em>text</em>. Currently, only custom emoji entities are allowed in poll option texts
   */
  text_entities?: MessageEntity[];
  /**
   * Media added to the poll option
   */
  media?: PollMedia;
  /**
   * Number of users who voted for this option; may be 0 if unknown
   */
  voter_count: number;
  /**
   * User who added the option; omitted if the option wasn&#39;t added by a user after poll creation
   */
  added_by_user?: User;
  /**
   * Chat that added the option; omitted if the option wasn&#39;t added by a chat after poll creation
   */
  added_by_chat?: Chat;
  /**
   * Point in time (Unix timestamp) when the option was added; omitted if the option existed in the original poll
   */
  addition_date?: number;
</tbody>
</table>
}
/**
 * This object contains information about one answer option in a poll to be sent.
 */
export interface InputPollOption {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Option text, 1-100 characters
   */
  text: string;
  /**
   * Mode for parsing entities in the text. See <a href="#formatting-options">formatting options</a> for more details. Currently, only custom emoji entities are allowed.
   */
  text_parse_mode?: string;
  /**
   * A JSON-serialized list of special entities that appear in the poll option text. It can be specified instead of <em>text_parse_mode</em>.
   */
  text_entities?: MessageEntity[];
  /**
   * Media added to the poll option
   */
  media?: InputPollOptionMedia;
</tbody>
</table>
}
/**
 * This object represents an answer of a user in a non-anonymous poll.
 */
export interface PollAnswer {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique poll identifier
   */
  poll_id: string;
  /**
   * The chat that changed the answer to the poll, if the voter is anonymous
   */
  voter_chat?: Chat;
  /**
   * The user that changed the answer to the poll, if the voter isn&#39;t anonymous
   */
  user?: User;
  /**
   * 0-based identifiers of chosen answer options. May be empty if the vote was retracted.
   */
  option_ids: number[];
  /**
   * Persistent identifiers of the chosen answer options. May be empty if the vote was retracted.
   */
  option_persistent_ids: string[];
</tbody>
</table>
}
/**
 * This object contains information about a poll.
 */
export interface Poll {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique poll identifier
   */
  id: string;
  /**
   * Poll question, 1-300 characters
   */
  question: string;
  /**
   * Special entities that appear in the <em>question</em>. Currently, only custom emoji entities are allowed in poll questions
   */
  question_entities?: MessageEntity[];
<tr>
<td>options</td>
<td>Array of <a href="#polloption">PollOption</a></td>
<td>List of poll options</td>
</tr>
  /**
   * Total number of users that voted in the poll
   */
  total_voter_count: number;
  /**
   * <em>True</em>, if the poll is closed
   */
  is_closed: boolean;
  /**
   * <em>True</em>, if the poll is anonymous
   */
  is_anonymous: boolean;
  /**
   * Poll type, currently can be “regular” or “quiz”
   */
  type: string;
  /**
   * <em>True</em>, if the poll allows multiple answers
   */
  allows_multiple_answers: boolean;
  /**
   * <em>True</em>, if the poll allows to change the chosen answer options
   */
  allows_revoting: boolean;
  /**
   * <em>True</em> if voting is limited to users who have been members of the chat where the poll was originally sent for more than 24 hours
   */
  members_only: boolean;
  /**
   * A list of two-letter <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a> country codes indicating the countries from which users can vote in the poll. The country code “FT” is used for users with anonymous numbers. If omitted, then users from any country can participate in the poll.
   */
  country_codes?: string[];
  /**
   * Array of 0-based identifiers of the correct answer options. Available only for polls in quiz mode which are closed or were sent (not forwarded) by the bot or to the private chat with the bot.
   */
  correct_option_ids?: number[];
  /**
   * Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters
   */
  explanation?: string;
  /**
   * Special entities like usernames, URLs, bot commands, etc. that appear in the <em>explanation</em>
   */
  explanation_entities?: MessageEntity[];
  /**
   * Media added to the quiz explanation
   */
  explanation_media?: PollMedia;
  /**
   * Amount of time in seconds the poll will be active after creation
   */
  open_period?: number;
  /**
   * Point in time (Unix timestamp) when the poll will be automatically closed
   */
  close_date?: number;
  /**
   * Description of the poll; for polls inside the <a href="#message">Message</a> object only
   */
  description?: string;
  /**
   * Special entities like usernames, URLs, bot commands, etc. that appear in the description
   */
  description_entities?: MessageEntity[];
  /**
   * Media added to the poll description; for polls inside the <a href="#message">Message</a> object only
   */
  media?: PollMedia;
</tbody>
</table>
}
/**
 * Describes a task in a checklist.
 */
export interface ChecklistTask {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the task
   */
  id: number;
  /**
   * Text of the task
   */
  text: string;
  /**
   * Special entities that appear in the task text
   */
  text_entities?: MessageEntity[];
  /**
   * User that completed the task; omitted if the task wasn&#39;t completed by a user
   */
  completed_by_user?: User;
  /**
   * Chat that completed the task; omitted if the task wasn&#39;t completed by a chat
   */
  completed_by_chat?: Chat;
  /**
   * Point in time (Unix timestamp) when the task was completed; 0 if the task wasn&#39;t completed
   */
  completion_date?: number;
</tbody>
</table>
}
/**
 * Describes a checklist.
 */
export interface Checklist {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Title of the checklist
   */
  title: string;
  /**
   * Special entities that appear in the checklist title
   */
  title_entities?: MessageEntity[];
<tr>
<td>tasks</td>
<td>Array of <a href="#checklisttask">ChecklistTask</a></td>
<td>List of tasks in the checklist</td>
</tr>
  /**
   * <em>True</em>, if users other than the creator of the list can add tasks to the list
   */
  others_can_add_tasks?: true;
  /**
   * <em>True</em>, if users other than the creator of the list can mark tasks as done or not done
   */
  others_can_mark_tasks_as_done?: true;
</tbody>
</table>
}
/**
 * Describes a task to add to a checklist.
 */
export interface InputChecklistTask {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the task; must be positive and unique among all task identifiers currently present in the checklist
   */
  id: number;
  /**
   * Text of the task; 1-100 characters after entities parsing
   */
  text: string;
  /**
   * Mode for parsing entities in the text. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the text, which can be specified instead of parse_mode. Currently, only <em>bold</em>, <em>italic</em>, <em>underline</em>, <em>strikethrough</em>, <em>spoiler</em>, <em>custom_emoji</em>, and <em>date_time</em> entities are allowed.
   */
  text_entities?: MessageEntity[];
</tbody>
</table>
}
/**
 * Describes a checklist to create.
 */
export interface InputChecklist {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Title of the checklist; 1-255 characters after entities parsing
   */
  title: string;
  /**
   * Mode for parsing entities in the title. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the title, which can be specified instead of parse_mode. Currently, only <em>bold</em>, <em>italic</em>, <em>underline</em>, <em>strikethrough</em>, <em>spoiler</em>, <em>custom_emoji</em>, and <em>date_time</em> entities are allowed.
   */
  title_entities?: MessageEntity[];
<tr>
<td>tasks</td>
<td>Array of <a href="#inputchecklisttask">InputChecklistTask</a></td>
<td>List of 1-30 tasks in the checklist</td>
</tr>
  /**
   * Pass <em>True</em> if other users can add tasks to the checklist
   */
  others_can_add_tasks?: boolean;
  /**
   * Pass <em>True</em> if other users can mark tasks as done or not done in the checklist
   */
  others_can_mark_tasks_as_done?: boolean;
</tbody>
</table>
}
/**
 * This object represents a point on the map.
 */
export interface Location {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Latitude as defined by the sender
   */
  latitude: number;
  /**
   * Longitude as defined by the sender
   */
  longitude: number;
  /**
   * The radius of uncertainty for the location, measured in meters; 0-1500
   */
  horizontal_accuracy?: number;
  /**
   * Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.
   */
  live_period?: number;
  /**
   * The direction in which user is moving, in degrees; 1-360. For active live locations only.
   */
  heading?: number;
  /**
   * The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.
   */
  proximity_alert_radius?: number;
</tbody>
</table>
}
/**
 * This object represents a venue.
 */
export interface Venue {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Venue location. Can&#39;t be a live location.
   */
  location: Location;
  /**
   * Name of the venue
   */
  title: string;
  /**
   * Address of the venue
   */
  address: string;
  /**
   * Foursquare identifier of the venue
   */
  foursquare_id?: string;
  /**
   * Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
   */
  foursquare_type?: string;
  /**
   * Google Places identifier of the venue
   */
  google_place_id?: string;
  /**
   * Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)
   */
  google_place_type?: string;
</tbody>
</table>
}
/**
 * Describes data sent from a <a href="/bots/webapps">Web App</a> to the bot.
 */
export interface WebAppData {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The data. Be aware that a bad client can send arbitrary data in this field.
   */
  data: string;
  /**
   * Text of the <em>web_app</em> keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field.
   */
  button_text: string;
</tbody>
</table>
}
/**
 * This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user.
 */
export interface ProximityAlertTriggered {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * User that triggered the alert
   */
  traveler: User;
  /**
   * User that set the alert
   */
  watcher: User;
  /**
   * The distance between the users
   */
  distance: number;
</tbody>
</table>
}
/**
 * This object represents a service message about a change in auto-delete timer settings.
 */
export interface MessageAutoDeleteTimerChanged {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * New auto-delete time for messages in the chat; in seconds
   */
  message_auto_delete_time: number;
</tbody>
</table>
}
/**
 * This object contains information about the bot that was created to be managed by the current bot.
 */
export interface ManagedBotCreated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Information about the bot. The bot&#39;s token can be fetched using the method <a href="#getmanagedbottoken">getManagedBotToken</a>.
   */
  bot: User;
</tbody>
</table>
}
/**
 * This object contains information about the creation, token update, or owner update of a bot that is managed by the current bot.
 */
export interface ManagedBotUpdated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * User that created the bot
   */
  user: User;
  /**
   * Information about the bot. Token of the bot can be fetched using the method <a href="#getmanagedbottoken">getManagedBotToken</a>.
   */
  bot: User;
</tbody>
</table>
}
/**
 * This object contains information about changes to a user payment subscription toward the current bot.
 */
export interface BotSubscriptionUpdated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * User who subscribed for payments toward the bot
   */
  user: User;
  /**
   * Bot-specified invoice payload
   */
  invoice_payload: string;
  /**
   * The new state of the subscription. Currently, it can be one of “canceled” if the user canceled the subscription, “active” if the user re-enabled a previously canceled subscription, or “failed” if payment for the subscription failed.
   */
  state: string;
</tbody>
</table>
}
/**
 * Describes a service message about an option added to a poll.
 */
export interface PollOptionAdded {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the poll to which the option was added, if known. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  poll_message?: MaybeInaccessibleMessage;
  /**
   * Unique identifier of the added option
   */
  option_persistent_id: string;
  /**
   * Option text
   */
  option_text: string;
  /**
   * Special entities that appear in the <em>option_text</em>
   */
  option_text_entities?: MessageEntity[];
</tbody>
</table>
}
/**
 * Describes a service message about an option deleted from a poll.
 */
export interface PollOptionDeleted {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the poll from which the option was deleted, if known. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  poll_message?: MaybeInaccessibleMessage;
  /**
   * Unique identifier of the deleted option
   */
  option_persistent_id: string;
  /**
   * Option text
   */
  option_text: string;
  /**
   * Special entities that appear in the <em>option_text</em>
   */
  option_text_entities?: MessageEntity[];
</tbody>
</table>
}
/**
 * This object represents a service message about a user boosting a chat.
 */
export interface ChatBoostAdded {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Number of boosts added by the user
   */
  boost_count: number;
</tbody>
</table>
}
/**
 * This object describes the way a background is filled based on the selected colors. Currently, it can be one of
 *
 * - <a href="#backgroundfillsolid">BackgroundFillSolid</a>
 * - <a href="#backgroundfillgradient">BackgroundFillGradient</a>
 * - <a href="#backgroundfillfreeformgradient">BackgroundFillFreeformGradient</a>
 */
export type BackgroundFill =
 | <a href="#backgroundfillsolid">BackgroundFillSolid</a>
 | <a href="#backgroundfillgradient">BackgroundFillGradient</a>
 | <a href="#backgroundfillfreeformgradient">BackgroundFillFreeformGradient</a>
/**
 * The background is filled using the selected color.
 */
export interface BackgroundFillSolid {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background fill, always “solid”
   */
  type: string;
  /**
   * The color of the background fill in the RGB24 format
   */
  color: number;
</tbody>
</table>
}
/**
 * The background is a gradient fill.
 */
export interface BackgroundFillGradient {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background fill, always “gradient”
   */
  type: string;
  /**
   * Top color of the gradient in the RGB24 format
   */
  top_color: number;
  /**
   * Bottom color of the gradient in the RGB24 format
   */
  bottom_color: number;
  /**
   * Clockwise rotation angle of the background fill in degrees; 0-359
   */
  rotation_angle: number;
</tbody>
</table>
}
/**
 * The background is a freeform gradient that rotates after every message in the chat.
 */
export interface BackgroundFillFreeformGradient {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background fill, always “freeform_gradient”
   */
  type: string;
  /**
   * A list of the 3 or 4 base colors that are used to generate the freeform gradient in the RGB24 format
   */
  colors: number[];
</tbody>
</table>
}
/**
 * This object describes the type of a background. Currently, it can be one of
 *
 * - <a href="#backgroundtypefill">BackgroundTypeFill</a>
 * - <a href="#backgroundtypewallpaper">BackgroundTypeWallpaper</a>
 * - <a href="#backgroundtypepattern">BackgroundTypePattern</a>
 * - <a href="#backgroundtypechattheme">BackgroundTypeChatTheme</a>
 */
export type BackgroundType =
 | <a href="#backgroundtypefill">BackgroundTypeFill</a>
 | <a href="#backgroundtypewallpaper">BackgroundTypeWallpaper</a>
 | <a href="#backgroundtypepattern">BackgroundTypePattern</a>
 | <a href="#backgroundtypechattheme">BackgroundTypeChatTheme</a>
/**
 * The background is automatically filled based on the selected colors.
 */
export interface BackgroundTypeFill {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background, always “fill”
   */
  type: string;
  /**
   * The background fill
   */
  fill: BackgroundFill;
  /**
   * Dimming of the background in dark themes, as a percentage; 0-100
   */
  dark_theme_dimming: number;
</tbody>
</table>
}
/**
 * The background is a wallpaper in the JPEG format.
 */
export interface BackgroundTypeWallpaper {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background, always “wallpaper”
   */
  type: string;
  /**
   * Document with the wallpaper
   */
  document: Document;
  /**
   * Dimming of the background in dark themes, as a percentage; 0-100
   */
  dark_theme_dimming: number;
  /**
   * <em>True</em>, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12
   */
  is_blurred?: true;
  /**
   * <em>True</em>, if the background moves slightly when the device is tilted
   */
  is_moving?: true;
</tbody>
</table>
}
/**
 * The background is a .PNG or .TGV (gzipped subset of SVG with MIME type “application/x-tgwallpattern”) pattern to be combined with the background fill chosen by the user.
 */
export interface BackgroundTypePattern {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background, always “pattern”
   */
  type: string;
  /**
   * Document with the pattern
   */
  document: Document;
  /**
   * The background fill that is combined with the pattern
   */
  fill: BackgroundFill;
  /**
   * Intensity of the pattern when it is shown above the filled background; 0-100
   */
  intensity: number;
  /**
   * <em>True</em>, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only.
   */
  is_inverted?: true;
  /**
   * <em>True</em>, if the background moves slightly when the device is tilted
   */
  is_moving?: true;
</tbody>
</table>
}
/**
 * The background is taken directly from a built-in chat theme.
 */
export interface BackgroundTypeChatTheme {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background, always “chat_theme”
   */
  type: string;
  /**
   * Name of the chat theme, which is usually an emoji
   */
  theme_name: string;
</tbody>
</table>
}
/**
 * This object represents a chat background.
 */
export interface ChatBackground {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the background
   */
  type: BackgroundType;
</tbody>
</table>
}
/**
 * Describes a service message about checklist tasks marked as done or not done.
 */
export interface ChecklistTasksDone {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the checklist whose tasks were marked as done or not done. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  checklist_message?: Message;
  /**
   * Identifiers of the tasks that were marked as done
   */
  marked_as_done_task_ids?: number[];
  /**
   * Identifiers of the tasks that were marked as not done
   */
  marked_as_not_done_task_ids?: number[];
</tbody>
</table>
}
/**
 * Describes a service message about tasks added to a checklist.
 */
export interface ChecklistTasksAdded {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the checklist to which the tasks were added. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  checklist_message?: Message;
<tr>
<td>tasks</td>
<td>Array of <a href="#checklisttask">ChecklistTask</a></td>
<td>List of tasks added to the checklist</td>
</tr>
</tbody>
</table>
}
/**
 * Describes a service message about a chat being added to a community.
 */
export interface CommunityChatAdded {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The new community to which the chat belongs
   */
  community: Community;
</tbody>
</table>
}
/**
 * Describes a service message about a chat being removed from a community. Currently holds no information.
 */
export interface CommunityChatRemoved {}
/**
 * This object represents a service message about a new forum topic created in the chat.
 */
export interface ForumTopicCreated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Name of the topic
   */
  name: string;
  /**
   * Color of the topic icon in RGB format
   */
  icon_color: number;
  /**
   * Unique identifier of the custom emoji shown as the topic icon
   */
  icon_custom_emoji_id?: string;
  /**
   * <em>True</em>, if the name of the topic wasn&#39;t specified explicitly by its creator and likely needs to be changed by the bot
   */
  is_name_implicit?: true;
</tbody>
</table>
}
/**
 * This object represents a service message about a forum topic closed in the chat. Currently holds no information.
 */
export interface ForumTopicClosed {}
/**
 * This object represents a service message about an edited forum topic.
 */
export interface ForumTopicEdited {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * New name of the topic, if it was edited
   */
  name?: string;
  /**
   * New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed
   */
  icon_custom_emoji_id?: string;
</tbody>
</table>
}
/**
 * This object represents a service message about a forum topic reopened in the chat. Currently holds no information.
 */
export interface ForumTopicReopened {}
/**
 * This object represents a service message about General forum topic hidden in the chat. Currently holds no information.
 */
export interface GeneralForumTopicHidden {}
/**
 * This object represents a service message about General forum topic unhidden in the chat. Currently holds no information.
 */
export interface GeneralForumTopicUnhidden {}
/**
 * This object contains information about a user that was shared with the bot using a <a href="#keyboardbuttonrequestusers">KeyboardButtonRequestUsers</a> button.
 */
export interface SharedUser {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier of the shared user. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so 64-bit integers or double-precision float types are safe for storing these identifiers. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means.
   */
  user_id: number;
  /**
   * First name of the user, if the name was requested by the bot
   */
  first_name?: string;
  /**
   * Last name of the user, if the name was requested by the bot
   */
  last_name?: string;
  /**
   * Username of the user, if the username was requested by the bot
   */
  username?: string;
  /**
   * Available sizes of the chat photo, if the photo was requested by the bot
   */
  photo?: PhotoSize[];
</tbody>
</table>
}
/**
 * This object contains information about the users whose identifiers were shared with the bot using a <a href="#keyboardbuttonrequestusers">KeyboardButtonRequestUsers</a> button.
 */
export interface UsersShared {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier of the request
   */
  request_id: number;
<tr>
<td>users</td>
<td>Array of <a href="#shareduser">SharedUser</a></td>
<td>Information about users shared with the bot</td>
</tr>
</tbody>
</table>
}
/**
 * This object contains information about a chat that was shared with the bot using a <a href="#keyboardbuttonrequestchat">KeyboardButtonRequestChat</a> button.
 */
export interface ChatShared {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier of the request
   */
  request_id: number;
  /**
   * Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means.
   */
  chat_id: number;
  /**
   * Title of the chat, if the title was requested by the bot
   */
  title?: string;
  /**
   * Username of the chat, if the username was requested by the bot and available
   */
  username?: string;
  /**
   * Available sizes of the chat photo, if the photo was requested by the bot
   */
  photo?: PhotoSize[];
</tbody>
</table>
}
/**
 * This object represents a service message about a user allowing a bot to write messages after adding it to the attachment menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method <a href="/bots/webapps#initializing-mini-apps">requestWriteAccess</a>.
 */
export interface WriteAccessAllowed {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if the access was granted after the user accepted an explicit request from a Web App sent by the method <a href="/bots/webapps#initializing-mini-apps">requestWriteAccess</a>
   */
  from_request?: boolean;
  /**
   * Name of the Web App, if the access was granted when the Web App was launched from a link
   */
  web_app_name?: string;
  /**
   * <em>True</em>, if the access was granted when the bot was added to the attachment or side menu
   */
  from_attachment_menu?: boolean;
</tbody>
</table>
}
/**
 * This object represents a service message about a video chat scheduled in the chat.
 */
export interface VideoChatScheduled {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator
   */
  start_date: number;
</tbody>
</table>
}
/**
 * This object represents a service message about a video chat started in the chat. Currently holds no information.
 */
export interface VideoChatStarted {}
/**
 * This object represents a service message about a video chat ended in the chat.
 */
export interface VideoChatEnded {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Video chat duration in seconds
   */
  duration: number;
</tbody>
</table>
}
/**
 * This object represents a service message about new members invited to a video chat.
 */
export interface VideoChatParticipantsInvited {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>users</td>
<td>Array of <a href="#user">User</a></td>
<td>New members that were invited to the video chat</td>
</tr>
</tbody>
</table>
}
/**
 * Describes a service message about a change in the price of paid messages within a chat.
 */
export interface PaidMessagePriceChanged {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The new number of Telegram Stars that must be paid by non-administrator users of the supergroup chat for each sent message
   */
  paid_message_star_count: number;
</tbody>
</table>
}
/**
 * Describes a service message about a change in the price of direct messages sent to a channel chat.
 */
export interface DirectMessagePriceChanged {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if direct messages are enabled for the channel chat; <em>False</em> otherwise
   */
  are_direct_messages_enabled: boolean;
  /**
   * The new number of Telegram Stars that must be paid by users for each direct message sent to the channel. Does not apply to users who have been exempted by administrators. Defaults to 0.
   */
  direct_message_star_count?: number;
</tbody>
</table>
}
/**
 * Describes a service message about the approval of a suggested post.
 */
export interface SuggestedPostApproved {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  suggested_post_message?: Message;
  /**
   * Amount paid for the post
   */
  price?: SuggestedPostPrice;
  /**
   * Date when the post will be published
   */
  send_date: number;
</tbody>
</table>
}
/**
 * Describes a service message about the failed approval of a suggested post. Currently, only caused by insufficient user funds at the time of approval.
 */
export interface SuggestedPostApprovalFailed {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the suggested post whose approval has failed. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  suggested_post_message?: Message;
  /**
   * Expected price of the post
   */
  price: SuggestedPostPrice;
</tbody>
</table>
}
/**
 * Describes a service message about the rejection of a suggested post.
 */
export interface SuggestedPostDeclined {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  suggested_post_message?: Message;
  /**
   * Comment with which the post was declined
   */
  comment?: string;
</tbody>
</table>
}
/**
 * Describes a service message about a successful payment for a suggested post.
 */
export interface SuggestedPostPaid {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  suggested_post_message?: Message;
  /**
   * Currency in which the payment was made. Currently, one of “XTR” for Telegram Stars or “TON” for TON grams.
   */
  currency: string;
  /**
   * The amount of the currency that was received by the channel in nanograms; for payments in TON grams only
   */
  amount?: number;
  /**
   * The amount of Telegram Stars that was received by the channel; for payments in Telegram Stars only
   */
  star_amount?: StarAmount;
</tbody>
</table>
}
/**
 * Describes a service message about a payment refund for a suggested post.
 */
export interface SuggestedPostRefunded {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Message containing the suggested post. Note that the <a href="#message">Message</a> object in this field will not contain the <em>reply_to_message</em> field even if it itself is a reply.
   */
  suggested_post_message?: Message;
  /**
   * Reason for the refund. Currently, one of “post_deleted” if the post was deleted within 24 hours of being posted or removed from scheduled messages without being posted, or “payment_refunded” if the payer refunded their payment.
   */
  reason: string;
</tbody>
</table>
}
/**
 * This object represents a service message about the creation of a scheduled giveaway.
 */
export interface GiveawayCreated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only
   */
  prize_star_count?: number;
</tbody>
</table>
}
/**
 * This object represents a message about a scheduled giveaway.
 */
export interface Giveaway {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chats</td>
<td>Array of <a href="#chat">Chat</a></td>
<td>The list of chats which the user must join to participate in the giveaway</td>
</tr>
  /**
   * Point in time (Unix timestamp) when winners of the giveaway will be selected
   */
  winners_selection_date: number;
  /**
   * The number of users which are supposed to be selected as winners of the giveaway
   */
  winner_count: number;
  /**
   * <em>True</em>, if only users who join the chats after the giveaway started should be eligible to win
   */
  only_new_members?: true;
  /**
   * <em>True</em>, if the list of giveaway winners will be visible to everyone
   */
  has_public_winners?: true;
  /**
   * Description of additional giveaway prize
   */
  prize_description?: string;
  /**
   * A list of two-letter <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a> country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways.
   */
  country_codes?: string[];
  /**
   * The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only
   */
  prize_star_count?: number;
  /**
   * The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only
   */
  premium_subscription_month_count?: number;
</tbody>
</table>
}
/**
 * This object represents a message about the completion of a giveaway with public winners.
 */
export interface GiveawayWinners {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The chat that created the giveaway
   */
  chat: Chat;
  /**
   * Identifier of the message with the giveaway in the chat
   */
  giveaway_message_id: number;
  /**
   * Point in time (Unix timestamp) when winners of the giveaway were selected
   */
  winners_selection_date: number;
  /**
   * Total number of winners in the giveaway
   */
  winner_count: number;
<tr>
<td>winners</td>
<td>Array of <a href="#user">User</a></td>
<td>List of up to 100 winners of the giveaway</td>
</tr>
  /**
   * The number of other chats the user had to join in order to be eligible for the giveaway
   */
  additional_chat_count?: number;
  /**
   * The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only
   */
  prize_star_count?: number;
  /**
   * The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only
   */
  premium_subscription_month_count?: number;
  /**
   * Number of undistributed prizes
   */
  unclaimed_prize_count?: number;
  /**
   * <em>True</em>, if only users who had joined the chats after the giveaway started were eligible to win
   */
  only_new_members?: true;
  /**
   * <em>True</em>, if the giveaway was canceled because the payment for it was refunded
   */
  was_refunded?: true;
  /**
   * Description of additional giveaway prize
   */
  prize_description?: string;
</tbody>
</table>
}
/**
 * This object represents a service message about the completion of a giveaway without public winners.
 */
export interface GiveawayCompleted {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Number of winners in the giveaway
   */
  winner_count: number;
  /**
   * Number of undistributed prizes
   */
  unclaimed_prize_count?: number;
  /**
   * Message with the giveaway that was completed, if it wasn&#39;t deleted
   */
  giveaway_message?: Message;
  /**
   * <em>True</em>, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway.
   */
  is_star_giveaway?: true;
</tbody>
</table>
}
/**
 * Describes the options used for link preview generation.
 */
export interface LinkPreviewOptions {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if the link preview is disabled
   */
  is_disabled?: boolean;
  /**
   * URL to use for the link preview. If empty, then the first URL found in the message text will be used.
   */
  url?: string;
  /**
   * <em>True</em>, if the media in the link preview is supposed to be shrunk; ignored if the URL isn&#39;t explicitly specified or media size change isn&#39;t supported for the preview
   */
  prefer_small_media?: boolean;
  /**
   * <em>True</em>, if the media in the link preview is supposed to be enlarged; ignored if the URL isn&#39;t explicitly specified or media size change isn&#39;t supported for the preview
   */
  prefer_large_media?: boolean;
  /**
   * <em>True</em>, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text
   */
  show_above_text?: boolean;
</tbody>
</table>
}
/**
 * Describes the price of a suggested post.
 */
export interface SuggestedPostPrice {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Currency in which the post will be paid. Currently, must be one of “XTR” for Telegram Stars or “TON” for TON grams.
   */
  currency: string;
  /**
   * The amount of the currency that will be paid for the post in the <em>smallest units</em> of the currency, i.e. Telegram Stars or nanograms. Currently, price in Telegram Stars must be between 5 and 100000, and price in nanograms must be between 10000000 and 10000000000000.
   */
  amount: number;
</tbody>
</table>
}
/**
 * Contains information about a suggested post.
 */
export interface SuggestedPostInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * State of the suggested post. Currently, it can be one of “pending”, “approved”, “declined”.
   */
  state: string;
  /**
   * Proposed price of the post. If the field is omitted, then the post is unpaid.
   */
  price?: SuggestedPostPrice;
  /**
   * Proposed send date of the post. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user or administrator who approves it.
   */
  send_date?: number;
</tbody>
</table>
}
/**
 * Contains parameters of a post that is being suggested by the bot.
 */
export interface SuggestedPostParameters {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Proposed price for the post. If the field is omitted, then the post is unpaid.
   */
  price?: SuggestedPostPrice;
  /**
   * Proposed send date of the post. If specified, then the date must be between 300 second and 2678400 seconds (30 days) in the future. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user who approves it.
   */
  send_date?: number;
</tbody>
</table>
}
/**
 * Describes a topic of a direct messages chat.
 */
export interface DirectMessagesTopic {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the topic. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  topic_id: number;
  /**
   * Information about the user that created the topic. Currently, it is always present.
   */
  user?: User;
</tbody>
</table>
}
/**
 * This object represent a user&#39;s profile pictures.
 */
export interface UserProfilePhotos {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Total number of profile pictures the target user has
   */
  total_count: number;
<tr>
<td>photos</td>
<td>Array of Array of <a href="#photosize">PhotoSize</a></td>
<td>Requested profile pictures (in up to 4 sizes each)</td>
</tr>
</tbody>
</table>
}
/**
 * This object represents the audios displayed on a user&#39;s profile.
 */
export interface UserProfileAudios {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Total number of profile audios for the target user
   */
  total_count: number;
<tr>
<td>audios</td>
<td>Array of <a href="#audio">Audio</a></td>
<td>Requested profile audios</td>
</tr>
</tbody>
</table>
}
/**
 * This object represents a file ready to be downloaded. The file can be downloaded via the link <code>https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;</code>. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling <a href="#getfile">getFile</a>.
 *
 * > The maximum file size to download is 20 MB
 */
export interface File {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
   */
  file_size?: number;
  /**
   * File path. Use <code>https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;</code> to get the file.
   */
  file_path?: string;
</tbody>
</table>
}
/**
 * Describes a <a href="/bots/webapps">Web App</a>.
 */
export interface WebAppInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * An HTTPS URL of a Web App to be opened with additional data as specified in <a href="/bots/webapps#initializing-mini-apps">Initializing Web Apps</a>
   */
  url: string;
</tbody>
</table>
}
/**
 * This object represents a <a href="/bots/features#keyboards">custom keyboard</a> with reply options (see <a href="/bots/features#keyboards">Introduction to bots</a> for details and examples). Not supported in channels and for messages sent on behalf of a business account.
 */
export interface ReplyKeyboardMarkup {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>keyboard</td>
<td>Array of Array of <a href="#keyboardbutton">KeyboardButton</a></td>
<td>Array of button rows, each represented by an Array of <a href="#keyboardbutton">KeyboardButton</a> objects</td>
</tr>
  /**
   * Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to <em>False</em>, in which case the custom keyboard can be hidden and opened with a keyboard icon.
   */
  is_persistent?: boolean;
  /**
   * Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to <em>False</em>, in which case the custom keyboard is always of the same height as the app&#39;s standard keyboard.
   */
  resize_keyboard?: boolean;
  /**
   * Requests clients to hide the keyboard as soon as it&#39;s been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to <em>False</em>.
   */
  one_time_keyboard?: boolean;
  /**
   * The placeholder to be shown in the input field when the keyboard is active; 1-64 characters
   */
  input_field_placeholder?: string;
  /**
   * Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the <em>text</em> of the <a href="#message">Message</a> object; 2) if the bot&#39;s message is a reply to a message in the same chat and forum topic, sender of the original message.<br><br><em>Example:</em> A user requests to change the bot&#39;s language, bot replies to the request with a keyboard to select the new language. Other users in the group don&#39;t see the keyboard.
   */
  selective?: boolean;
</tbody>
</table>
}
/**
 * This object represents one button of the reply keyboard. At most one of the fields other than <em>text</em>, <em>icon_custom_emoji_id</em>, and <em>style</em> must be used to specify the type of the button. For simple text buttons, <em>String</em> can be used instead of this object to specify the button text.
 */
export interface KeyboardButton {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Text of the button. If none of the fields other than <em>text</em>, <em>icon_custom_emoji_id</em>, and <em>style</em> are used, it will be sent as a message when the button is pressed.
   */
  text: string;
  /**
   * Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on <a href="https://fragment.com">Fragment</a> or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.
   */
  icon_custom_emoji_id?: string;
  /**
   * Style of the button. Must be one of “danger” (red), “success” (green) or “primary” (blue). If omitted, then an app-specific style is used.
   */
  style?: string;
  /**
   * If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a “users_shared” service message. Available in private chats only.
   */
  request_users?: KeyboardButtonRequestUsers;
  /**
   * If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a “chat_shared” service message. Available in private chats only.
   */
  request_chat?: KeyboardButtonRequestChat;
  /**
   * If specified, pressing the button will ask the user to create and share a bot that will be managed by the current bot. Available for bots that enabled management of other bots in the <a href="https://t.me/BotFather">@BotFather</a> Mini App. Available in private chats only.
   */
  request_managed_bot?: KeyboardButtonRequestManagedBot;
  /**
   * If <em>True</em>, the user&#39;s phone number will be sent as a contact when the button is pressed. Available in private chats only.
   */
  request_contact?: boolean;
  /**
   * If <em>True</em>, the user&#39;s current location will be sent when the button is pressed. Available in private chats only.
   */
  request_location?: boolean;
  /**
   * If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only.
   */
  request_poll?: KeyboardButtonPollType;
  /**
   * If specified, the described <a href="/bots/webapps">Web App</a> will be launched when the button is pressed. The Web App will be able to send a “web_app_data” service message. Available in private chats only.
   */
  web_app?: WebAppInfo;
</tbody>
</table>
}
/**
 * This object defines the criteria used to request suitable users. Information about the selected users will be shared with the bot when the corresponding button is pressed. <a href="/bots/features#chat-and-user-selection">More about requesting users »</a>
 */
export interface KeyboardButtonRequestUsers {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Signed 32-bit identifier of the request that will be received back in the <a href="#usersshared">UsersShared</a> object. Must be unique within the message.
   */
  request_id: number;
  /**
   * Pass <em>True</em> to request bots, pass <em>False</em> to request regular users. If not specified, no additional restrictions are applied.
   */
  user_is_bot?: boolean;
  /**
   * Pass <em>True</em> to request premium users, pass <em>False</em> to request non-premium users. If not specified, no additional restrictions are applied.
   */
  user_is_premium?: boolean;
  /**
   * The maximum number of users to be selected; 1-10. Defaults to 1.
   */
  max_quantity?: number;
  /**
   * Pass <em>True</em> to request the users&#39; first and last names
   */
  request_name?: boolean;
  /**
   * Pass <em>True</em> to request the users&#39; usernames
   */
  request_username?: boolean;
  /**
   * Pass <em>True</em> to request the users&#39; photos
   */
  request_photo?: boolean;
</tbody>
</table>
}
/**
 * This object defines the criteria used to request a suitable chat. Information about the selected chat will be shared with the bot when the corresponding button is pressed. The bot will be granted requested rights in the chat if appropriate. <a href="/bots/features#chat-and-user-selection">More about requesting chats »</a>.
 */
export interface KeyboardButtonRequestChat {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Signed 32-bit identifier of the request, which will be received back in the <a href="#chatshared">ChatShared</a> object. Must be unique within the message.
   */
  request_id: number;
  /**
   * Pass <em>True</em> to request a channel chat, pass <em>False</em> to request a group or a supergroup chat
   */
  chat_is_channel: boolean;
  /**
   * Pass <em>True</em> to request a forum supergroup, pass <em>False</em> to request a non-forum chat. If not specified, no additional restrictions are applied.
   */
  chat_is_forum?: boolean;
  /**
   * Pass <em>True</em> to request a supergroup or a channel with a username, pass <em>False</em> to request a chat without a username. If not specified, no additional restrictions are applied.
   */
  chat_has_username?: boolean;
  /**
   * Pass <em>True</em> to request a chat owned by the user. Otherwise, no additional restrictions are applied.
   */
  chat_is_created?: boolean;
  /**
   * A JSON-serialized object listing the required administrator rights of the user in the chat. The rights must be a superset of <em>bot_administrator_rights</em>. If not specified, no additional restrictions are applied.
   */
  user_administrator_rights?: ChatAdministratorRights;
  /**
   * A JSON-serialized object listing the required administrator rights of the bot in the chat. The rights must be a subset of <em>user_administrator_rights</em>. If not specified, no additional restrictions are applied.
   */
  bot_administrator_rights?: ChatAdministratorRights;
  /**
   * Pass <em>True</em> to request a chat with the bot as a member. Otherwise, no additional restrictions are applied.
   */
  bot_is_member?: boolean;
  /**
   * Pass <em>True</em> to request the chat&#39;s title
   */
  request_title?: boolean;
  /**
   * Pass <em>True</em> to request the chat&#39;s username
   */
  request_username?: boolean;
  /**
   * Pass <em>True</em> to request the chat&#39;s photo
   */
  request_photo?: boolean;
</tbody>
</table>
}
/**
 * This object defines the parameters for the creation of a managed bot. Information about the created bot will be shared with the bot using the update <em>managed_bot</em> and a <a href="#message">Message</a> with the field <em>managed_bot_created</em>.
 */
export interface KeyboardButtonRequestManagedBot {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Signed 32-bit identifier of the request. Must be unique within the message.
   */
  request_id: number;
  /**
   * Suggested name for the bot
   */
  suggested_name?: string;
  /**
   * Suggested username for the bot
   */
  suggested_username?: string;
</tbody>
</table>
}
/**
 * This object represents type of a poll, which is allowed to be created and sent when the corresponding button is pressed.
 */
export interface KeyboardButtonPollType {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * If <em>quiz</em> is passed, the user will be allowed to create only polls in the quiz mode. If <em>regular</em> is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type.
   */
  type?: string;
</tbody>
</table>
}
/**
 * Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a>). Not supported in channels and for messages sent on behalf of a business account.
 */
export interface ReplyKeyboardRemove {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use <em>one_time_keyboard</em> in <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a>)
   */
  remove_keyboard: true;
  /**
   * Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the <em>text</em> of the <a href="#message">Message</a> object; 2) if the bot&#39;s message is a reply to a message in the same chat and forum topic, sender of the original message.<br><br><em>Example:</em> A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven&#39;t voted yet.
   */
  selective?: boolean;
</tbody>
</table>
}
/**
 * This object represents an <a href="/bots/features#inline-keyboards">inline keyboard</a> that appears right next to the message it belongs to.
 */
export interface InlineKeyboardMarkup {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>inline_keyboard</td>
<td>Array of Array of <a href="#inlinekeyboardbutton">InlineKeyboardButton</a></td>
<td>Array of button rows, each represented by an Array of <a href="#inlinekeyboardbutton">InlineKeyboardButton</a> objects</td>
</tr>
</tbody>
</table>
}
/**
 * This object represents one button of an inline keyboard. Exactly one of the fields other than <em>text</em>, <em>icon_custom_emoji_id</em>, and <em>style</em> must be used to specify the type of the button.
 */
export interface InlineKeyboardButton {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Label text on the button
   */
  text: string;
  /**
   * Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on <a href="https://fragment.com">Fragment</a> or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.
   */
  icon_custom_emoji_id?: string;
  /**
   * Style of the button. Must be one of “danger” (red), “success” (green) or “primary” (blue). If omitted, then an app-specific style is used.
   */
  style?: string;
  /**
   * HTTP or tg:// URL to be opened when the button is pressed. Links <code>tg://user?id=&lt;user_id&gt;</code> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.
   */
  url?: string;
  /**
   * Data to be sent in a <a href="#callbackquery">callback query</a> to the bot when the button is pressed, 1-64 bytes
   */
  callback_data?: string;
  /**
   * Description of the <a href="/bots/webapps">Web App</a> that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method <a href="#answerwebappquery">answerWebAppQuery</a>. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account.
   */
  web_app?: WebAppInfo;
  /**
   * An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the <a href="/widgets/login">Telegram Login Widget</a>.
   */
  login_url?: LoginUrl;
  /**
   * If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot&#39;s username and the specified inline query in the input field. May be empty, in which case just the bot&#39;s username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
   */
  switch_inline_query?: string;
  /**
   * If set, pressing the button will insert the bot&#39;s username and the specified inline query in the current chat&#39;s input field. May be empty, in which case only the bot&#39;s username will be inserted.<br><br>This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account.
   */
  switch_inline_query_current_chat?: string;
  /**
   * If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot&#39;s username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
   */
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat;
  /**
   * Description of the button that copies the specified text to the clipboard
   */
  copy_text?: CopyTextButton;
  /**
   * Description of the game that will be launched when the user presses the button.<br><br><strong>NOTE:</strong> This type of button <strong>must</strong> always be the first button in the first row.
   */
  callback_game?: CallbackGame;
  /**
   * Specify <em>True</em>, to send a <a href="#payments">Pay button</a>. Substrings “<img class="emoji" src="//telegram.org/img/emoji/40/E2AD90.png" width="20" height="20" alt="⭐" />” and “XTR” in the buttons&#39;s text will be replaced with a Telegram Star icon.<br><br><strong>NOTE:</strong> This type of button <strong>must</strong> always be the first button in the first row and can only be used in invoice messages.
   */
  pay?: boolean;
</tbody>
</table>
}
/**
 * This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the <a href="/widgets/login">Telegram Login Widget</a> when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:
 *
 * <a href="/file/811140015/1734/8VZFkwWXalM.97872/6127fa62d8a0bf2b3c" target="_blank"><img src="/file/811140909/1631/20k1Z53eiyY.23995/c541e89b74253623d9" title="TITLE" alt="TITLE" srcset="/file/811140015/1734/8VZFkwWXalM.97872/6127fa62d8a0bf2b3c , 2x" /></a>
 *
 * Telegram apps support these buttons as of <a href="https://telegram.org/blog/privacy-discussions-web-bots#meet-seamless-web-bots">version 5.7</a>.
 *
 * > Sample bot: <a href="https://t.me/discussbot">@discussbot</a>
 */
export interface LoginUrl {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in <a href="/widgets/login#receiving-authorization-data">Receiving authorization data</a>.<br><br><strong>NOTE:</strong> You <strong>must</strong> always check the hash of the received data to verify the authentication and the integrity of the data as described in <a href="/widgets/login#checking-authorization">Checking authorization</a>.
   */
  url: string;
  /**
   * New text of the button in forwarded messages
   */
  forward_text?: string;
  /**
   * Username of a bot, which will be used for user authorization. See <a href="/widgets/login#setting-up-a-bot">Setting up a bot</a> for more details. If not specified, the current bot&#39;s username will be assumed. The <em>url</em>&#39;s domain must be the same as the domain linked with the bot. See <a href="/widgets/login#linking-your-domain-to-the-bot">Linking your domain to the bot</a> for more details.
   */
  bot_username?: string;
  /**
   * Pass <em>True</em> to request the permission for your bot to send messages to the user
   */
  request_write_access?: boolean;
</tbody>
</table>
}
/**
 * This object represents an inline button that switches the current user to inline mode in a chosen chat, with an optional default inline query.
 */
export interface SwitchInlineQueryChosenChat {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The default inline query to be inserted in the input field. If left empty, only the bot&#39;s username will be inserted.
   */
  query?: string;
  /**
   * <em>True</em>, if private chats with users can be chosen
   */
  allow_user_chats?: boolean;
  /**
   * <em>True</em>, if private chats with bots can be chosen
   */
  allow_bot_chats?: boolean;
  /**
   * <em>True</em>, if group and supergroup chats can be chosen
   */
  allow_group_chats?: boolean;
  /**
   * <em>True</em>, if channel chats can be chosen
   */
  allow_channel_chats?: boolean;
</tbody>
</table>
}
/**
 * This object represents an inline keyboard button that copies specified text to the clipboard.
 */
export interface CopyTextButton {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The text to be copied to the clipboard; 1-256 characters
   */
  text: string;
</tbody>
</table>
}
/**
 * This object represents an incoming callback query from a callback button in an <a href="/bots/features#inline-keyboards">inline keyboard</a>. If the button that originated the query was attached to a message sent by the bot, the field <em>message</em> will be present. If the button was attached to a message sent via the bot (in <a href="#inline-mode">inline mode</a>), the field <em>inline_message_id</em> will be present. Exactly one of the fields <em>data</em> or <em>game_short_name</em> will be present.
 * 
 * > <strong>NOTE:</strong> After the user presses a callback button, Telegram clients will display a progress bar until you call <a href="#answercallbackquery">answerCallbackQuery</a>. It is, therefore, necessary to react by calling <a href="#answercallbackquery">answerCallbackQuery</a> even if no notification to the user is needed (e.g., without specifying any of the optional parameters).
 */
export interface CallbackQuery {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier for this query
   */
  id: string;
  /**
   * Sender
   */
  from: User;
  /**
   * Message sent by the bot with the callback button that originated the query
   */
  message?: MaybeInaccessibleMessage;
  /**
   * Identifier of the message sent via the bot in inline mode, that originated the query
   */
  inline_message_id?: string;
  /**
   * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in <a href="#games">games</a>.
   */
  chat_instance: string;
  /**
   * Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data.
   */
  data?: string;
  /**
   * Short name of a <a href="#games">Game</a> to be returned, serves as the unique identifier for the game
   */
  game_short_name?: string;
</tbody>
</table>
}
/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot&#39;s message and tapped &#39;Reply&#39;). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice <a href="/bots/features#privacy-mode">privacy mode</a>. Not supported in channels and for messages sent on behalf of a user account.
 * 
 * > <strong>Example:</strong> A <a href="https://t.me/PollBot">poll bot</a> for groups runs in privacy mode (only receives commands, replies to its messages and mentions). There could be two ways to create a new poll:
 * >
 * > - Explain the user how to send a command with parameters (e.g. /newpoll question answer1 answer2). May be appealing for hardcore users but lacks modern day polish.
 * > - Guide the user through a step-by-step process. &#39;Please send me your question&#39;, &#39;Cool, now let&#39;s add the first answer option&#39;, &#39;Great. Keep adding answer options, then send /done when you&#39;re ready&#39;.
 * >
 * > The last option is definitely more attractive. And if you use <a href="#forcereply">ForceReply</a> in your bot&#39;s questions, it will receive the user&#39;s answers even if it only receives replies, commands and mentions - without any extra work for the user.
 */
export interface ForceReply {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Shows reply interface to the user, as if they manually selected the bot&#39;s message and tapped &#39;Reply&#39;
   */
  force_reply: true;
  /**
   * The placeholder to be shown in the input field when the reply is active; 1-64 characters
   */
  input_field_placeholder?: string;
  /**
   * Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the <em>text</em> of the <a href="#message">Message</a> object; 2) if the bot&#39;s message is a reply to a message in the same chat and forum topic, sender of the original message.
   */
  selective?: boolean;
</tbody>
</table>
}
/**
 * Represents a community (a group of chats).
 */
export interface Community {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier for this community. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  id: number;
  /**
   * Name of the community
   */
  name: string;
</tbody>
</table>
}
/**
 * This object represents a chat photo.
 */
export interface ChatPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
   */
  small_file_id: string;
  /**
   * Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  small_file_unique_id: string;
  /**
   * File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
   */
  big_file_id: string;
  /**
   * Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  big_file_unique_id: string;
</tbody>
</table>
}
/**
 * Represents an invite link for a chat.
 */
export interface ChatInviteLink {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”.
   */
  invite_link: string;
  /**
   * Creator of the link
   */
  creator: User;
  /**
   * <em>True</em>, if users joining the chat via the link need to be approved by chat administrators
   */
  creates_join_request: boolean;
  /**
   * <em>True</em>, if the link is primary
   */
  is_primary: boolean;
  /**
   * <em>True</em>, if the link is revoked
   */
  is_revoked: boolean;
  /**
   * Invite link name
   */
  name?: string;
  /**
   * Point in time (Unix timestamp) when the link will expire or has been expired
   */
  expire_date?: number;
  /**
   * The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
   */
  member_limit?: number;
  /**
   * Number of pending join requests created using this link
   */
  pending_join_request_count?: number;
  /**
   * The number of seconds the subscription will be active for before the next payment
   */
  subscription_period?: number;
  /**
   * The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link
   */
  subscription_price?: number;
</tbody>
</table>
}
/**
 * Represents the rights of an administrator in a chat.
 */
export interface ChatAdministratorRights {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if the user&#39;s presence in the chat is hidden
   */
  is_anonymous: boolean;
  /**
   * <em>True</em>, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.
   */
  can_manage_chat: boolean;
  /**
   * <em>True</em>, if the administrator can delete messages of other users
   */
  can_delete_messages: boolean;
  /**
   * <em>True</em>, if the administrator can manage video chats
   */
  can_manage_video_chats: boolean;
  /**
   * <em>True</em>, if the administrator can restrict, ban or unban chat members, or access supergroup statistics
   */
  can_restrict_members: boolean;
  /**
   * <em>True</em>, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)
   */
  can_promote_members: boolean;
  /**
   * <em>True</em>, if the user is allowed to change the chat title, photo and other settings
   */
  can_change_info: boolean;
  /**
   * <em>True</em>, if the user is allowed to invite new users to the chat
   */
  can_invite_users: boolean;
  /**
   * <em>True</em>, if the administrator can post stories to the chat
   */
  can_post_stories: boolean;
  /**
   * <em>True</em>, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat&#39;s story archive
   */
  can_edit_stories: boolean;
  /**
   * <em>True</em>, if the administrator can delete stories posted by other users
   */
  can_delete_stories: boolean;
  /**
   * <em>True</em>, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only
   */
  can_post_messages?: boolean;
  /**
   * <em>True</em>, if the administrator can edit messages of other users and can pin messages; for channels only
   */
  can_edit_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to pin messages; for groups and supergroups only
   */
  can_pin_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only
   */
  can_manage_topics?: boolean;
  /**
   * <em>True</em>, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only
   */
  can_manage_direct_messages?: boolean;
  /**
   * <em>True</em>, if the administrator can edit the tags of regular members; for groups and supergroups only. If omitted, defaults to the value of can_pin_messages.
   */
  can_manage_tags?: boolean;
</tbody>
</table>
}
/**
 * This object represents changes in the status of a chat member.
 */
export interface ChatMemberUpdated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Chat the user belongs to
   */
  chat: Chat;
  /**
   * Performer of the action, which resulted in the change
   */
  from: User;
  /**
   * Date the change was done in Unix time
   */
  date: number;
  /**
   * Previous information about the chat member
   */
  old_chat_member: ChatMember;
  /**
   * New information about the chat member
   */
  new_chat_member: ChatMember;
  /**
   * Chat invite link, which was used by the user to join the chat; for joining by invite link events only
   */
  invite_link?: ChatInviteLink;
  /**
   * <em>True</em>, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator
   */
  via_join_request?: boolean;
  /**
   * <em>True</em>, if the user joined the chat via a chat folder invite link
   */
  via_chat_folder_invite_link?: boolean;
</tbody>
</table>
}
/**
 * This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:
 *
 * - <a href="#chatmemberowner">ChatMemberOwner</a>
 * - <a href="#chatmemberadministrator">ChatMemberAdministrator</a>
 * - <a href="#chatmembermember">ChatMemberMember</a>
 * - <a href="#chatmemberrestricted">ChatMemberRestricted</a>
 * - <a href="#chatmemberleft">ChatMemberLeft</a>
 * - <a href="#chatmemberbanned">ChatMemberBanned</a>
 */
export type ChatMember =
 | <a href="#chatmemberowner">ChatMemberOwner</a>
 | <a href="#chatmemberadministrator">ChatMemberAdministrator</a>
 | <a href="#chatmembermember">ChatMemberMember</a>
 | <a href="#chatmemberrestricted">ChatMemberRestricted</a>
 | <a href="#chatmemberleft">ChatMemberLeft</a>
 | <a href="#chatmemberbanned">ChatMemberBanned</a>
/**
 * Represents a <a href="#chatmember">chat member</a> that owns the chat and has all administrator privileges.
 */
export interface ChatMemberOwner {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The member&#39;s status in the chat, always “creator”
   */
  status: string;
  /**
   * Information about the user
   */
  user: User;
  /**
   * <em>True</em>, if the user&#39;s presence in the chat is hidden
   */
  is_anonymous: boolean;
  /**
   * Custom title for this user
   */
  custom_title?: string;
</tbody>
</table>
}
/**
 * Represents a <a href="#chatmember">chat member</a> that has some additional privileges.
 */
export interface ChatMemberAdministrator {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The member&#39;s status in the chat, always “administrator”
   */
  status: string;
  /**
   * Information about the user
   */
  user: User;
  /**
   * <em>True</em>, if the bot is allowed to edit administrator privileges of that user
   */
  can_be_edited: boolean;
  /**
   * <em>True</em>, if the user&#39;s presence in the chat is hidden
   */
  is_anonymous: boolean;
  /**
   * <em>True</em>, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.
   */
  can_manage_chat: boolean;
  /**
   * <em>True</em>, if the administrator can delete messages of other users
   */
  can_delete_messages: boolean;
  /**
   * <em>True</em>, if the administrator can manage video chats
   */
  can_manage_video_chats: boolean;
  /**
   * <em>True</em>, if the administrator can restrict, ban or unban chat members, or access supergroup statistics
   */
  can_restrict_members: boolean;
  /**
   * <em>True</em>, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)
   */
  can_promote_members: boolean;
  /**
   * <em>True</em>, if the user is allowed to change the chat title, photo and other settings
   */
  can_change_info: boolean;
  /**
   * <em>True</em>, if the user is allowed to invite new users to the chat
   */
  can_invite_users: boolean;
  /**
   * <em>True</em>, if the administrator can post stories to the chat
   */
  can_post_stories: boolean;
  /**
   * <em>True</em>, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat&#39;s story archive
   */
  can_edit_stories: boolean;
  /**
   * <em>True</em>, if the administrator can delete stories posted by other users
   */
  can_delete_stories: boolean;
  /**
   * <em>True</em>, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only
   */
  can_post_messages?: boolean;
  /**
   * <em>True</em>, if the administrator can edit messages of other users and can pin messages; for channels only
   */
  can_edit_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to pin messages; for groups and supergroups only
   */
  can_pin_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only
   */
  can_manage_topics?: boolean;
  /**
   * <em>True</em>, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only
   */
  can_manage_direct_messages?: boolean;
  /**
   * <em>True</em>, if the administrator can edit the tags of regular members; for groups and supergroups only. If omitted, defaults to the value of can_pin_messages.
   */
  can_manage_tags?: boolean;
  /**
   * Custom title for this user
   */
  custom_title?: string;
</tbody>
</table>
}
/**
 * Represents a <a href="#chatmember">chat member</a> that has no additional privileges or restrictions.
 */
export interface ChatMemberMember {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The member&#39;s status in the chat, always “member”
   */
  status: string;
  /**
   * Tag of the member
   */
  tag?: string;
  /**
   * Information about the user
   */
  user: User;
  /**
   * Date when the user&#39;s subscription will expire; Unix time
   */
  until_date?: number;
</tbody>
</table>
}
/**
 * Represents a <a href="#chatmember">chat member</a> that is under certain restrictions in the chat. Supergroups only.
 */
export interface ChatMemberRestricted {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The member&#39;s status in the chat, always “restricted”
   */
  status: string;
  /**
   * Tag of the member
   */
  tag?: string;
  /**
   * Information about the user
   */
  user: User;
  /**
   * <em>True</em>, if the user is a member of the chat at the moment of the request
   */
  is_member: boolean;
  /**
   * <em>True</em>, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues
   */
  can_send_messages: boolean;
  /**
   * <em>True</em>, if the user is allowed to send audios
   */
  can_send_audios: boolean;
  /**
   * <em>True</em>, if the user is allowed to send documents
   */
  can_send_documents: boolean;
  /**
   * <em>True</em>, if the user is allowed to send photos
   */
  can_send_photos: boolean;
  /**
   * <em>True</em>, if the user is allowed to send videos
   */
  can_send_videos: boolean;
  /**
   * <em>True</em>, if the user is allowed to send video notes
   */
  can_send_video_notes: boolean;
  /**
   * <em>True</em>, if the user is allowed to send voice notes
   */
  can_send_voice_notes: boolean;
  /**
   * <em>True</em>, if the user is allowed to send polls and checklists
   */
  can_send_polls: boolean;
  /**
   * <em>True</em>, if the user is allowed to send animations, games, stickers and use inline bots
   */
  can_send_other_messages: boolean;
  /**
   * <em>True</em>, if the user is allowed to add web page previews to their messages
   */
  can_add_web_page_previews: boolean;
  /**
   * <em>True</em>, if the user is allowed to react to messages
   */
  can_react_to_messages: boolean;
  /**
   * <em>True</em>, if the user is allowed to edit their own tag
   */
  can_edit_tag: boolean;
  /**
   * <em>True</em>, if the user is allowed to change the chat title, photo and other settings
   */
  can_change_info: boolean;
  /**
   * <em>True</em>, if the user is allowed to invite new users to the chat
   */
  can_invite_users: boolean;
  /**
   * <em>True</em>, if the user is allowed to pin messages
   */
  can_pin_messages: boolean;
  /**
   * <em>True</em>, if the user is allowed to create forum topics
   */
  can_manage_topics: boolean;
  /**
   * Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever.
   */
  until_date: number;
</tbody>
</table>
}
/**
 * Represents a <a href="#chatmember">chat member</a> that isn&#39;t currently a member of the chat, but may join it themselves.
 */
export interface ChatMemberLeft {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The member&#39;s status in the chat, always “left”
   */
  status: string;
  /**
   * Information about the user
   */
  user: User;
</tbody>
</table>
}
/**
 * Represents a <a href="#chatmember">chat member</a> that was banned in the chat and can&#39;t return to the chat or view chat messages.
 */
export interface ChatMemberBanned {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The member&#39;s status in the chat, always “kicked”
   */
  status: string;
  /**
   * Information about the user
   */
  user: User;
  /**
   * Date when restrictions will be lifted for this user; Unix time. If 0, then the user is banned forever.
   */
  until_date: number;
</tbody>
</table>
}
/**
 * Represents a join request sent to a chat.
 */
export interface ChatJoinRequest {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Chat to which the request was sent
   */
  chat: Chat;
  /**
   * User that sent the join request
   */
  from: User;
  /**
   * Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user.
   */
  user_chat_id: number;
  /**
   * Date the request was sent in Unix time
   */
  date: number;
  /**
   * Bio of the user
   */
  bio?: string;
  /**
   * Chat invite link that was used by the user to send the join request
   */
  invite_link?: ChatInviteLink;
  /**
   * Identifier of the join request query; for bots assigned to process join requests only. If present, then the bot must call <a href="#sendchatjoinrequestwebapp">sendChatJoinRequestWebApp</a> or directly call <a href="#answerchatjoinrequestquery">answerChatJoinRequestQuery</a> within 10 seconds.
   */
  query_id?: string;
</tbody>
</table>
}
/**
 * Describes actions that a non-administrator user is allowed to take in a chat.
 */
export interface ChatPermissions {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues
   */
  can_send_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send audios
   */
  can_send_audios?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send documents
   */
  can_send_documents?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send photos
   */
  can_send_photos?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send videos
   */
  can_send_videos?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send video notes
   */
  can_send_video_notes?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send voice notes
   */
  can_send_voice_notes?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send polls and checklists
   */
  can_send_polls?: boolean;
  /**
   * <em>True</em>, if the user is allowed to send animations, games, stickers and use inline bots
   */
  can_send_other_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to add web page previews to their messages
   */
  can_add_web_page_previews?: boolean;
  /**
   * <em>True</em>, if the user is allowed to react to messages. If omitted, defaults to the value of <em>can_send_messages</em>.
   */
  can_react_to_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to edit their own tag. If omitted, defaults to the value of <em>can_pin_messages</em>.
   */
  can_edit_tag?: boolean;
  /**
   * <em>True</em>, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups.
   */
  can_change_info?: boolean;
  /**
   * <em>True</em>, if the user is allowed to invite new users to the chat
   */
  can_invite_users?: boolean;
  /**
   * <em>True</em>, if the user is allowed to pin messages. Ignored in public supergroups.
   */
  can_pin_messages?: boolean;
  /**
   * <em>True</em>, if the user is allowed to create forum topics. If omitted, defaults to the value of can_pin_messages.
   */
  can_manage_topics?: boolean;
</tbody>
</table>
}
/**
 * Describes the birthdate of a user.
 */
export interface Birthdate {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Day of the user&#39;s birth; 1-31
   */
  day: number;
  /**
   * Month of the user&#39;s birth; 1-12
   */
  month: number;
  /**
   * Year of the user&#39;s birth
   */
  year?: number;
</tbody>
</table>
}
/**
 * Contains information about the start page settings of a Telegram Business account.
 */
export interface BusinessIntro {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Title text of the business intro
   */
  title?: string;
  /**
   * Message text of the business intro
   */
  message?: string;
  /**
   * Sticker of the business intro
   */
  sticker?: Sticker;
</tbody>
</table>
}
/**
 * Contains information about the location of a Telegram Business account.
 */
export interface BusinessLocation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Address of the business
   */
  address: string;
  /**
   * Location of the business
   */
  location?: Location;
</tbody>
</table>
}
/**
 * Describes an interval of time during which a business is open.
 */
export interface BusinessOpeningHoursInterval {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The minute&#39;s sequence number in a week, starting on Monday, marking the start of the time interval during which the business is open; 0 - 7 * 24 * 60
   */
  opening_minute: number;
  /**
   * The minute&#39;s sequence number in a week, starting on Monday, marking the end of the time interval during which the business is open; 0 - 8 * 24 * 60
   */
  closing_minute: number;
</tbody>
</table>
}
/**
 * Describes the opening hours of a business.
 */
export interface BusinessOpeningHours {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique name of the time zone for which the opening hours are defined
   */
  time_zone_name: string;
<tr>
<td>opening_hours</td>
<td>Array of <a href="#businessopeninghoursinterval">BusinessOpeningHoursInterval</a></td>
<td>List of time intervals describing business opening hours</td>
</tr>
</tbody>
</table>
}
/**
 * This object describes the rating of a user based on their Telegram Star spendings.
 */
export interface UserRating {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Current level of the user, indicating their reliability when purchasing digital goods and services. A higher level suggests a more trustworthy customer; a negative level is likely reason for concern.
   */
  level: number;
  /**
   * Numerical value of the user&#39;s rating; the higher the rating, the better
   */
  rating: number;
  /**
   * The rating value required to get the current level
   */
  current_level_rating: number;
  /**
   * The rating value required to get to the next level; omitted if the maximum level was reached
   */
  next_level_rating?: number;
</tbody>
</table>
}
/**
 * Describes the position of a clickable area within a story.
 */
export interface StoryAreaPosition {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The abscissa of the area&#39;s center, as a percentage of the media width
   */
  x_percentage: number;
  /**
   * The ordinate of the area&#39;s center, as a percentage of the media height
   */
  y_percentage: number;
  /**
   * The width of the area&#39;s rectangle, as a percentage of the media width
   */
  width_percentage: number;
  /**
   * The height of the area&#39;s rectangle, as a percentage of the media height
   */
  height_percentage: number;
  /**
   * The clockwise rotation angle of the rectangle, in degrees; 0-360
   */
  rotation_angle: number;
  /**
   * The radius of the rectangle corner rounding, as a percentage of the media width
   */
  corner_radius_percentage: number;
</tbody>
</table>
}
/**
 * Describes the physical address of a location.
 */
export interface LocationAddress {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The two-letter ISO 3166-1 alpha-2 country code of the country where the location is located
   */
  country_code: string;
  /**
   * State of the location
   */
  state?: string;
  /**
   * City of the location
   */
  city?: string;
  /**
   * Street address of the location
   */
  street?: string;
</tbody>
</table>
}
/**
 * Describes the type of a clickable area on a story. Currently, it can be one of
 *
 * - <a href="#storyareatypelocation">StoryAreaTypeLocation</a>
 * - <a href="#storyareatypesuggestedreaction">StoryAreaTypeSuggestedReaction</a>
 * - <a href="#storyareatypelink">StoryAreaTypeLink</a>
 * - <a href="#storyareatypeweather">StoryAreaTypeWeather</a>
 * - <a href="#storyareatypeuniquegift">StoryAreaTypeUniqueGift</a>
 */
export type StoryAreaType =
 | <a href="#storyareatypelocation">StoryAreaTypeLocation</a>
 | <a href="#storyareatypesuggestedreaction">StoryAreaTypeSuggestedReaction</a>
 | <a href="#storyareatypelink">StoryAreaTypeLink</a>
 | <a href="#storyareatypeweather">StoryAreaTypeWeather</a>
 | <a href="#storyareatypeuniquegift">StoryAreaTypeUniqueGift</a>
/**
 * Describes a story area pointing to a location. Currently, a story can have up to 10 location areas.
 */
export interface StoryAreaTypeLocation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the area, always “location”
   */
  type: string;
  /**
   * Location latitude in degrees
   */
  latitude: number;
  /**
   * Location longitude in degrees
   */
  longitude: number;
  /**
   * Address of the location
   */
  address?: LocationAddress;
</tbody>
</table>
}
/**
 * Describes a story area pointing to a suggested reaction. Currently, a story can have up to 5 suggested reaction areas.
 */
export interface StoryAreaTypeSuggestedReaction {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the area, always “suggested_reaction”
   */
  type: string;
  /**
   * Type of the reaction
   */
  reaction_type: ReactionType;
  /**
   * Pass <em>True</em> if the reaction area has a dark background
   */
  is_dark?: boolean;
  /**
   * Pass <em>True</em> if reaction area corner is flipped
   */
  is_flipped?: boolean;
</tbody>
</table>
}
/**
 * Describes a story area pointing to an HTTP or tg:// link. Currently, a story can have up to 3 link areas.
 */
export interface StoryAreaTypeLink {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the area, always “link”
   */
  type: string;
  /**
   * HTTP or tg:// URL to be opened when the area is clicked
   */
  url: string;
</tbody>
</table>
}
/**
 * Describes a story area containing weather information. Currently, a story can have up to 3 weather areas.
 */
export interface StoryAreaTypeWeather {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the area, always “weather”
   */
  type: string;
  /**
   * Temperature, in degree Celsius
   */
  temperature: number;
  /**
   * Emoji representing the weather
   */
  emoji: string;
  /**
   * A color of the area background in the ARGB format
   */
  background_color: number;
</tbody>
</table>
}
/**
 * Describes a story area pointing to a unique gift. Currently, a story can have at most 1 unique gift area.
 */
export interface StoryAreaTypeUniqueGift {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the area, always “unique_gift”
   */
  type: string;
  /**
   * Unique name of the gift
   */
  name: string;
</tbody>
</table>
}
/**
 * Describes a clickable area on a story media.
 */
export interface StoryArea {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Position of the area
   */
  position: StoryAreaPosition;
  /**
   * Type of the area
   */
  type: StoryAreaType;
</tbody>
</table>
}
/**
 * Represents a location to which a chat is connected.
 */
export interface ChatLocation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The location to which the supergroup is connected. Can&#39;t be a live location.
   */
  location: Location;
  /**
   * Location address; 1-64 characters, as defined by the chat owner
   */
  address: string;
</tbody>
</table>
}
/**
 * This object describes the type of a reaction. Currently, it can be one of
 *
 * - <a href="#reactiontypeemoji">ReactionTypeEmoji</a>
 * - <a href="#reactiontypecustomemoji">ReactionTypeCustomEmoji</a>
 * - <a href="#reactiontypepaid">ReactionTypePaid</a>
 */
export type ReactionType =
 | <a href="#reactiontypeemoji">ReactionTypeEmoji</a>
 | <a href="#reactiontypecustomemoji">ReactionTypeCustomEmoji</a>
 | <a href="#reactiontypepaid">ReactionTypePaid</a>
/**
 * The reaction is based on an emoji.
 */
export interface ReactionTypeEmoji {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the reaction, always “emoji”
   */
  type: string;
  /**
   * Reaction emoji. Currently, it can be one of &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29DA4.png" width="20" height="20" alt="❤" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918E.png" width="20" height="20" alt="👎" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F94A5.png" width="20" height="20" alt="🔥" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA5B0.png" width="20" height="20" alt="🥰" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918F.png" width="20" height="20" alt="👏" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9881.png" width="20" height="20" alt="😁" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA494.png" width="20" height="20" alt="🤔" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AF.png" width="20" height="20" alt="🤯" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98B1.png" width="20" height="20" alt="😱" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AC.png" width="20" height="20" alt="🤬" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98A2.png" width="20" height="20" alt="😢" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E89.png" width="20" height="20" alt="🎉" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A9.png" width="20" height="20" alt="🤩" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AE.png" width="20" height="20" alt="🤮" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F92A9.png" width="20" height="20" alt="💩" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F998F.png" width="20" height="20" alt="🙏" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918C.png" width="20" height="20" alt="👌" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F958A.png" width="20" height="20" alt="🕊" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A1.png" width="20" height="20" alt="🤡" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA5B1.png" width="20" height="20" alt="🥱" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA5B4.png" width="20" height="20" alt="🥴" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F988D.png" width="20" height="20" alt="😍" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F90B3.png" width="20" height="20" alt="🐳" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29DA4E2808DF09F94A5.png" width="20" height="20" alt="❤‍🔥" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8C9A.png" width="20" height="20" alt="🌚" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8CAD.png" width="20" height="20" alt="🌭" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F92AF.png" width="20" height="20" alt="💯" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A3.png" width="20" height="20" alt="🤣" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29AA1.png" width="20" height="20" alt="⚡" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8D8C.png" width="20" height="20" alt="🍌" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F86.png" width="20" height="20" alt="🏆" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9294.png" width="20" height="20" alt="💔" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4A8.png" width="20" height="20" alt="🤨" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9890.png" width="20" height="20" alt="😐" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8D93.png" width="20" height="20" alt="🍓" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8DBE.png" width="20" height="20" alt="🍾" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F928B.png" width="20" height="20" alt="💋" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9695.png" width="20" height="20" alt="🖕" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9888.png" width="20" height="20" alt="😈" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98B4.png" width="20" height="20" alt="😴" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98AD.png" width="20" height="20" alt="😭" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA493.png" width="20" height="20" alt="🤓" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F91BB.png" width="20" height="20" alt="👻" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F91A8E2808DF09F92BB.png" width="20" height="20" alt="👨‍💻" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9180.png" width="20" height="20" alt="👀" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E83.png" width="20" height="20" alt="🎃" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9988.png" width="20" height="20" alt="🙈" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9887.png" width="20" height="20" alt="😇" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98A8.png" width="20" height="20" alt="😨" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA49D.png" width="20" height="20" alt="🤝" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29C8D.png" width="20" height="20" alt="✍" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA497.png" width="20" height="20" alt="🤗" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FABA1.png" width="20" height="20" alt="🫡" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E85.png" width="20" height="20" alt="🎅" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8E84.png" width="20" height="20" alt="🎄" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/E29883.png" width="20" height="20" alt="☃" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9285.png" width="20" height="20" alt="💅" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4AA.png" width="20" height="20" alt="🤪" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F97BF.png" width="20" height="20" alt="🗿" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F8692.png" width="20" height="20" alt="🆒" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9298.png" width="20" height="20" alt="💘" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9989.png" width="20" height="20" alt="🙉" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA684.png" width="20" height="20" alt="🦄" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F9898.png" width="20" height="20" alt="😘" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F928A.png" width="20" height="20" alt="💊" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F998A.png" width="20" height="20" alt="🙊" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F988E.png" width="20" height="20" alt="😎" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F91BE.png" width="20" height="20" alt="👾" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4B7E2808DE29982.png" width="20" height="20" alt="🤷‍♂" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4B7.png" width="20" height="20" alt="🤷" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09FA4B7E2808DE29980.png" width="20" height="20" alt="🤷‍♀" />&quot;, &quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F98A1.png" width="20" height="20" alt="😡" />&quot;.
   */
  emoji: string;
</tbody>
</table>
}
/**
 * The reaction is based on a custom emoji.
 */
export interface ReactionTypeCustomEmoji {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the reaction, always “custom_emoji”
   */
  type: string;
  /**
   * Custom emoji identifier
   */
  custom_emoji_id: string;
</tbody>
</table>
}
/**
 * The reaction is paid.
 */
export interface ReactionTypePaid {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the reaction, always “paid”
   */
  type: string;
</tbody>
</table>
}
/**
 * Represents a reaction added to a message along with the number of times it was added.
 */
export interface ReactionCount {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the reaction
   */
  type: ReactionType;
  /**
   * Number of times the reaction was added
   */
  total_count: number;
</tbody>
</table>
}
/**
 * This object represents a change of a reaction on a message performed by a user.
 */
export interface MessageReactionUpdated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The chat containing the message the user reacted to
   */
  chat: Chat;
  /**
   * Unique identifier of the message inside the chat
   */
  message_id: number;
  /**
   * The user that changed the reaction, if the user isn&#39;t anonymous
   */
  user?: User;
  /**
   * The chat on behalf of which the reaction was changed, if the user is anonymous
   */
  actor_chat?: Chat;
  /**
   * Date of the change in Unix time
   */
  date: number;
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
</tbody>
</table>
}
/**
 * This object represents reaction changes on a message with anonymous reactions.
 */
export interface MessageReactionCountUpdated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The chat containing the message
   */
  chat: Chat;
  /**
   * Unique message identifier inside the chat
   */
  message_id: number;
  /**
   * Date of the change in Unix time
   */
  date: number;
<tr>
<td>reactions</td>
<td>Array of <a href="#reactioncount">ReactionCount</a></td>
<td>List of reactions that are present on the message</td>
</tr>
</tbody>
</table>
}
/**
 * This object represents a forum topic.
 */
export interface ForumTopic {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the forum topic
   */
  message_thread_id: number;
  /**
   * Name of the topic
   */
  name: string;
  /**
   * Color of the topic icon in RGB format
   */
  icon_color: number;
  /**
   * Unique identifier of the custom emoji shown as the topic icon
   */
  icon_custom_emoji_id?: string;
  /**
   * <em>True</em>, if the name of the topic wasn&#39;t specified explicitly by its creator and likely needs to be changed by the bot
   */
  is_name_implicit?: true;
</tbody>
</table>
}
/**
 * This object describes the background of a gift.
 */
export interface GiftBackground {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Center color of the background in RGB format
   */
  center_color: number;
  /**
   * Edge color of the background in RGB format
   */
  edge_color: number;
  /**
   * Text color of the background in RGB format
   */
  text_color: number;
</tbody>
</table>
}
/**
 * This object represents a gift that can be sent by the bot.
 */
export interface Gift {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the gift
   */
  id: string;
  /**
   * The sticker that represents the gift
   */
  sticker: Sticker;
  /**
   * The number of Telegram Stars that must be paid to send the sticker
   */
  star_count: number;
  /**
   * The number of Telegram Stars that must be paid to upgrade the gift to a unique one
   */
  upgrade_star_count?: number;
  /**
   * <em>True</em>, if the gift can only be purchased by Telegram Premium subscribers
   */
  is_premium?: true;
  /**
   * <em>True</em>, if the gift can be used (after being upgraded) to customize a user&#39;s appearance
   */
  has_colors?: true;
  /**
   * The total number of gifts of this type that can be sent by all users; for limited gifts only
   */
  total_count?: number;
  /**
   * The number of remaining gifts of this type that can be sent by all users; for limited gifts only
   */
  remaining_count?: number;
  /**
   * The total number of gifts of this type that can be sent by the bot; for limited gifts only
   */
  personal_total_count?: number;
  /**
   * The number of remaining gifts of this type that can be sent by the bot; for limited gifts only
   */
  personal_remaining_count?: number;
  /**
   * Background of the gift
   */
  background?: GiftBackground;
  /**
   * The total number of different unique gifts that can be obtained by upgrading the gift
   */
  unique_gift_variant_count?: number;
  /**
   * Information about the chat that published the gift
   */
  publisher_chat?: Chat;
</tbody>
</table>
}
/**
 * This object represent a list of gifts.
 */
export interface Gifts {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>gifts</td>
<td>Array of <a href="#gift">Gift</a></td>
<td>The list of gifts</td>
</tr>
</tbody>
</table>
}
/**
 * This object describes the model of a unique gift.
 */
export interface UniqueGiftModel {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Name of the model
   */
  name: string;
  /**
   * The sticker that represents the unique gift
   */
  sticker: Sticker;
  /**
   * The number of unique gifts that receive this model for every 1000 gift upgrades. Always 0 for crafted gifts.
   */
  rarity_per_mille: number;
  /**
   * Rarity of the model if it is a crafted model. Currently, can be “uncommon”, “rare”, “epic”, or “legendary”.
   */
  rarity?: string;
</tbody>
</table>
}
/**
 * This object describes the symbol shown on the pattern of a unique gift.
 */
export interface UniqueGiftSymbol {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Name of the symbol
   */
  name: string;
  /**
   * The sticker that represents the unique gift
   */
  sticker: Sticker;
  /**
   * The number of unique gifts that receive this model for every 1000 gifts upgraded
   */
  rarity_per_mille: number;
</tbody>
</table>
}
/**
 * This object describes the colors of the backdrop of a unique gift.
 */
export interface UniqueGiftBackdropColors {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The color in the center of the backdrop in RGB format
   */
  center_color: number;
  /**
   * The color on the edges of the backdrop in RGB format
   */
  edge_color: number;
  /**
   * The color to be applied to the symbol in RGB format
   */
  symbol_color: number;
  /**
   * The color for the text on the backdrop in RGB format
   */
  text_color: number;
</tbody>
</table>
}
/**
 * This object describes the backdrop of a unique gift.
 */
export interface UniqueGiftBackdrop {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Name of the backdrop
   */
  name: string;
  /**
   * Colors of the backdrop
   */
  colors: UniqueGiftBackdropColors;
  /**
   * The number of unique gifts that receive this backdrop for every 1000 gifts upgraded
   */
  rarity_per_mille: number;
</tbody>
</table>
}
/**
 * This object contains information about the color scheme for a user&#39;s name, message replies and link previews based on a unique gift.
 */
export interface UniqueGiftColors {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Custom emoji identifier of the unique gift&#39;s model
   */
  model_custom_emoji_id: string;
  /**
   * Custom emoji identifier of the unique gift&#39;s symbol
   */
  symbol_custom_emoji_id: string;
  /**
   * Main color used in light themes; RGB format
   */
  light_theme_main_color: number;
  /**
   * List of 1-3 additional colors used in light themes; RGB format
   */
  light_theme_other_colors: number[];
  /**
   * Main color used in dark themes; RGB format
   */
  dark_theme_main_color: number;
  /**
   * List of 1-3 additional colors used in dark themes; RGB format
   */
  dark_theme_other_colors: number[];
</tbody>
</table>
}
/**
 * This object describes a unique gift that was upgraded from a regular gift.
 */
export interface UniqueGift {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier of the regular gift from which the gift was upgraded
   */
  gift_id: string;
  /**
   * Human-readable name of the regular gift from which this unique gift was upgraded
   */
  base_name: string;
  /**
   * Unique name of the gift. This name can be used in <code>https://t.me/nft/...</code> links and story areas.
   */
  name: string;
  /**
   * Unique number of the upgraded gift among gifts upgraded from the same regular gift
   */
  number: number;
  /**
   * Model of the gift
   */
  model: UniqueGiftModel;
  /**
   * Symbol of the gift
   */
  symbol: UniqueGiftSymbol;
  /**
   * Backdrop of the gift
   */
  backdrop: UniqueGiftBackdrop;
  /**
   * <em>True</em>, if the original regular gift was exclusively purchaseable by Telegram Premium subscribers
   */
  is_premium?: true;
  /**
   * <em>True</em>, if the gift was used to craft another gift and isn&#39;t available anymore
   */
  is_burned?: true;
  /**
   * <em>True</em>, if the gift is assigned from the TON blockchain and can&#39;t be resold or transferred in Telegram
   */
  is_from_blockchain?: true;
  /**
   * The color scheme that can be used by the gift&#39;s owner for the chat&#39;s name, replies to messages and link previews; for business account gifts and gifts that are currently on sale only
   */
  colors?: UniqueGiftColors;
  /**
   * Information about the chat that published the gift
   */
  publisher_chat?: Chat;
</tbody>
</table>
}
/**
 * Describes a service message about a regular gift that was sent or received.
 */
export interface GiftInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Information about the gift
   */
  gift: Gift;
  /**
   * Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts
   */
  owned_gift_id?: string;
  /**
   * Number of Telegram Stars that can be claimed by the receiver by converting the gift; omitted if conversion to Telegram Stars is impossible
   */
  convert_star_count?: number;
  /**
   * Number of Telegram Stars that were prepaid for the ability to upgrade the gift
   */
  prepaid_upgrade_star_count?: number;
  /**
   * <em>True</em>, if the gift&#39;s upgrade was purchased after the gift was sent
   */
  is_upgrade_separate?: true;
  /**
   * <em>True</em>, if the gift can be upgraded to a unique gift
   */
  can_be_upgraded?: true;
  /**
   * Text of the message that was added to the gift
   */
  text?: string;
  /**
   * Special entities that appear in the text
   */
  entities?: MessageEntity[];
  /**
   * <em>True</em>, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them
   */
  is_private?: true;
  /**
   * Unique number reserved for this gift when upgraded. See the <em>number</em> field in <a href="#uniquegift">UniqueGift</a>.
   */
  unique_gift_number?: number;
</tbody>
</table>
}
/**
 * Describes a service message about a unique gift that was sent or received.
 */
export interface UniqueGiftInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Information about the gift
   */
  gift: UniqueGift;
  /**
   * Origin of the gift. Currently, either “upgrade” for gifts upgraded from regular gifts, “transfer” for gifts transferred from other users or channels, “resale” for gifts bought from other users, “gifted_upgrade” for upgrades purchased after the gift was sent, or “offer” for gifts bought or sold through gift purchase offers.
   */
  origin: string;
  /**
   * For gifts bought from other users, the currency in which the payment for the gift was done. Currently, one of “XTR” for Telegram Stars or “TON” for TON grams.
   */
  last_resale_currency?: string;
  /**
   * For gifts bought from other users, the price paid for the gift in either Telegram Stars or nanograms
   */
  last_resale_amount?: number;
  /**
   * Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts
   */
  owned_gift_id?: string;
  /**
   * Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift
   */
  transfer_star_count?: number;
  /**
   * Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now.
   */
  next_transfer_date?: number;
</tbody>
</table>
}
/**
 * This object describes a gift received and owned by a user or a chat. Currently, it can be one of
 *
 * - <a href="#ownedgiftregular">OwnedGiftRegular</a>
 * - <a href="#ownedgiftunique">OwnedGiftUnique</a>
 */
export type OwnedGift =
 | <a href="#ownedgiftregular">OwnedGiftRegular</a>
 | <a href="#ownedgiftunique">OwnedGiftUnique</a>
/**
 * Describes a regular gift owned by a user or a chat.
 */
export interface OwnedGiftRegular {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the gift, always “regular”
   */
  type: string;
  /**
   * Information about the regular gift
   */
  gift: Gift;
  /**
   * Unique identifier of the gift for the bot; for gifts received on behalf of business accounts only
   */
  owned_gift_id?: string;
  /**
   * Sender of the gift if it is a known user
   */
  sender_user?: User;
  /**
   * Date the gift was sent in Unix time
   */
  send_date: number;
  /**
   * Text of the message that was added to the gift
   */
  text?: string;
  /**
   * Special entities that appear in the text
   */
  entities?: MessageEntity[];
  /**
   * <em>True</em>, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them
   */
  is_private?: true;
  /**
   * <em>True</em>, if the gift is displayed on the account&#39;s profile page; for gifts received on behalf of business accounts only
   */
  is_saved?: true;
  /**
   * <em>True</em>, if the gift can be upgraded to a unique gift; for gifts received on behalf of business accounts only
   */
  can_be_upgraded?: true;
  /**
   * <em>True</em>, if the gift was refunded and isn&#39;t available anymore
   */
  was_refunded?: true;
  /**
   * Number of Telegram Stars that can be claimed by the receiver instead of the gift; omitted if the gift cannot be converted to Telegram Stars; for gifts received on behalf of business accounts only
   */
  convert_star_count?: number;
  /**
   * Number of Telegram Stars that were paid for the ability to upgrade the gift
   */
  prepaid_upgrade_star_count?: number;
  /**
   * <em>True</em>, if the gift&#39;s upgrade was purchased after the gift was sent; for gifts received on behalf of business accounts only
   */
  is_upgrade_separate?: true;
  /**
   * Unique number reserved for this gift when upgraded. See the <em>number</em> field in <a href="#uniquegift">UniqueGift</a>.
   */
  unique_gift_number?: number;
</tbody>
</table>
}
/**
 * Describes a unique gift received and owned by a user or a chat.
 */
export interface OwnedGiftUnique {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the gift, always “unique”
   */
  type: string;
  /**
   * Information about the unique gift
   */
  gift: UniqueGift;
  /**
   * Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only
   */
  owned_gift_id?: string;
  /**
   * Sender of the gift if it is a known user
   */
  sender_user?: User;
  /**
   * Date the gift was sent in Unix time
   */
  send_date: number;
  /**
   * <em>True</em>, if the gift is displayed on the account&#39;s profile page; for gifts received on behalf of business accounts only
   */
  is_saved?: true;
  /**
   * <em>True</em>, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only
   */
  can_be_transferred?: true;
  /**
   * Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift
   */
  transfer_star_count?: number;
  /**
   * Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now.
   */
  next_transfer_date?: number;
</tbody>
</table>
}
/**
 * Contains the list of gifts received and owned by a user or a chat.
 */
export interface OwnedGifts {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The total number of gifts owned by the user or the chat
   */
  total_count: number;
<tr>
<td>gifts</td>
<td>Array of <a href="#ownedgift">OwnedGift</a></td>
<td>The list of gifts</td>
</tr>
  /**
   * Offset for the next request. If empty, then there are no more results.
   */
  next_offset?: string;
</tbody>
</table>
}
/**
 * This object describes the access settings of a bot.
 */
export interface BotAccessSettings {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if only selected users can access the bot. The bot&#39;s owner can always access it.
   */
  is_access_restricted: boolean;
  /**
   * The list of other users who have access to the bot if the access is restricted
   */
  added_users?: User[];
</tbody>
</table>
}
/**
 * This object describes the types of gifts that can be gifted to a user or a chat.
 */
export interface AcceptedGiftTypes {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if unlimited regular gifts are accepted
   */
  unlimited_gifts: boolean;
  /**
   * <em>True</em>, if limited regular gifts are accepted
   */
  limited_gifts: boolean;
  /**
   * <em>True</em>, if unique gifts or gifts that can be upgraded to unique for free are accepted
   */
  unique_gifts: boolean;
  /**
   * <em>True</em>, if a Telegram Premium subscription is accepted
   */
  premium_subscription: boolean;
  /**
   * <em>True</em>, if transfers of unique gifts from channels are accepted
   */
  gifts_from_channels: boolean;
</tbody>
</table>
}
/**
 * Describes an amount of Telegram Stars.
 */
export interface StarAmount {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Integer amount of Telegram Stars, rounded to 0; can be negative
   */
  amount: number;
  /**
   * The number of 1/1000000000 shares of Telegram Stars; from -999999999 to 999999999; can be negative if and only if <em>amount</em> is non-positive
   */
  nanostar_amount?: number;
</tbody>
</table>
}
/**
 * This object represents a bot command.
 */
export interface BotCommand {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Text of the command; 1-32 characters. Can contain only lowercase English letters, digits and underscores.
   */
  command: string;
  /**
   * Description of the command; 1-256 characters
   */
  description: string;
  /**
   * <em>True</em>, if the command sends an ephemeral message, which can be seen only by the sender of the message and the bot
   */
  is_ephemeral?: boolean;
</tbody>
</table>
}
/**
 * This object represents the scope to which bot commands are applied. Currently, the following 7 scopes are supported:
 *
 * - <a href="#botcommandscopedefault">BotCommandScopeDefault</a>
 * - <a href="#botcommandscopeallprivatechats">BotCommandScopeAllPrivateChats</a>
 * - <a href="#botcommandscopeallgroupchats">BotCommandScopeAllGroupChats</a>
 * - <a href="#botcommandscopeallchatadministrators">BotCommandScopeAllChatAdministrators</a>
 * - <a href="#botcommandscopechat">BotCommandScopeChat</a>
 * - <a href="#botcommandscopechatadministrators">BotCommandScopeChatAdministrators</a>
 * - <a href="#botcommandscopechatmember">BotCommandScopeChatMember</a>
 */
export type BotCommandScope =
 | <a href="#botcommandscopedefault">BotCommandScopeDefault</a>
 | <a href="#botcommandscopeallprivatechats">BotCommandScopeAllPrivateChats</a>
 | <a href="#botcommandscopeallgroupchats">BotCommandScopeAllGroupChats</a>
 | <a href="#botcommandscopeallchatadministrators">BotCommandScopeAllChatAdministrators</a>
 | <a href="#botcommandscopechat">BotCommandScopeChat</a>
 | <a href="#botcommandscopechatadministrators">BotCommandScopeChatAdministrators</a>
 | <a href="#botcommandscopechatmember">BotCommandScopeChatMember</a>
<h4><a class="anchor" name="determining-list-of-commands" href="#determining-list-of-commands"><i class="anchor-icon"></i></a>Determining list of commands</h4>
<p>The following algorithm is used to determine the list of commands for a particular user viewing the bot menu. The first list of commands which is set is returned:</p>
<p><strong>Commands in the chat with the bot</strong></p>
<ul>
<li>botCommandScopeChat + language_code</li>
<li>botCommandScopeChat</li>
<li>botCommandScopeAllPrivateChats + language_code</li>
<li>botCommandScopeAllPrivateChats</li>
<li>botCommandScopeDefault + language_code</li>
<li>botCommandScopeDefault</li>
</ul>
<p><strong>Commands in group and supergroup chats</strong></p>
<ul>
<li>botCommandScopeChatMember + language_code</li>
<li>botCommandScopeChatMember</li>
<li>botCommandScopeChatAdministrators + language_code (administrators only)</li>
<li>botCommandScopeChatAdministrators (administrators only)</li>
<li>botCommandScopeChat + language_code</li>
<li>botCommandScopeChat</li>
<li>botCommandScopeAllChatAdministrators + language_code (administrators only)</li>
<li>botCommandScopeAllChatAdministrators (administrators only)</li>
<li>botCommandScopeAllGroupChats + language_code</li>
<li>botCommandScopeAllGroupChats</li>
<li>botCommandScopeDefault + language_code</li>
<li>botCommandScopeDefault</li>
</ul>
/**
 * Represents the default <a href="#botcommandscope">scope</a> of bot commands. Default commands are used if no commands with a <a href="#determining-list-of-commands">narrower scope</a> are specified for the user.
 */
export interface BotCommandScopeDefault {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Scope type, must be <em>default</em>
   */
  type: string;
</tbody>
</table>
}
/**
 * Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all private chats.
 */
export interface BotCommandScopeAllPrivateChats {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Scope type, must be <em>all_private_chats</em>
   */
  type: string;
</tbody>
</table>
}
/**
 * Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all group and supergroup chats.
 */
export interface BotCommandScopeAllGroupChats {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Scope type, must be <em>all_group_chats</em>
   */
  type: string;
</tbody>
</table>
}
/**
 * Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all group and supergroup chat administrators.
 */
export interface BotCommandScopeAllChatAdministrators {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Scope type, must be <em>all_chat_administrators</em>
   */
  type: string;
</tbody>
</table>
}
/**
 * Represents the <a href="#botcommandscope">scope</a> of bot commands, covering a specific chat.
 */
export interface BotCommandScopeChat {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Scope type, must be <em>chat</em>
   */
  type: string;
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code>. Channel direct messages chats and channel chats aren&#39;t supported.</td>
</tr>
</tbody>
</table>
}
/**
 * Represents the <a href="#botcommandscope">scope</a> of bot commands, covering all administrators of a specific group or supergroup chat.
 */
export interface BotCommandScopeChatAdministrators {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Scope type, must be <em>chat_administrators</em>
   */
  type: string;
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code>. Channel direct messages chats and channel chats aren&#39;t supported.</td>
</tr>
</tbody>
</table>
}
/**
 * Represents the <a href="#botcommandscope">scope</a> of bot commands, covering a specific member of a group or supergroup chat.
 */
export interface BotCommandScopeChatMember {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Scope type, must be <em>chat_member</em>
   */
  type: string;
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code>. Channel direct messages chats and channel chats aren&#39;t supported.</td>
</tr>
  /**
   * Unique identifier of the target user
   */
  user_id: number;
</tbody>
</table>
}
/**
 * This object represents the bot&#39;s name.
 */
export interface BotName {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The bot&#39;s name
   */
  name: string;
</tbody>
</table>
}
/**
 * This object represents the bot&#39;s description.
 */
export interface BotDescription {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The bot&#39;s description
   */
  description: string;
</tbody>
</table>
}
/**
 * This object represents the bot&#39;s short description.
 */
export interface BotShortDescription {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The bot&#39;s short description
   */
  short_description: string;
</tbody>
</table>
}
/**
 * This object describes the bot&#39;s menu button in a private chat. It should be one of
 *
 * - <a href="#menubuttoncommands">MenuButtonCommands</a>
 * - <a href="#menubuttonwebapp">MenuButtonWebApp</a>
 * - <a href="#menubuttondefault">MenuButtonDefault</a>
 */
export type MenuButton =
 | <a href="#menubuttoncommands">MenuButtonCommands</a>
 | <a href="#menubuttonwebapp">MenuButtonWebApp</a>
 | <a href="#menubuttondefault">MenuButtonDefault</a>
<p>If a menu button other than <a href="#menubuttondefault">MenuButtonDefault</a> is set for a private chat, then it is applied in the chat. Otherwise the default menu button is applied. By default, the menu button opens the list of bot commands.</p>
/**
 * Represents a menu button, which opens the bot&#39;s list of commands.
 */
export interface MenuButtonCommands {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the button, must be <em>commands</em>
   */
  type: string;
</tbody>
</table>
}
/**
 * Represents a menu button, which launches a <a href="/bots/webapps">Web App</a>.
 */
export interface MenuButtonWebApp {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the button, must be <em>web_app</em>
   */
  type: string;
  /**
   * Text on the button
   */
  text: string;
  /**
   * Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method <a href="#answerwebappquery">answerWebAppQuery</a>. Alternatively, a <code>t.me</code> link to a Web App of the bot can be specified in the object instead of the Web App&#39;s URL, in which case the Web App will be opened as if the user pressed the link.
   */
  web_app: WebAppInfo;
</tbody>
</table>
}
/**
 * Describes that no specific value for the menu button was set.
 */
export interface MenuButtonDefault {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the button, must be <em>default</em>
   */
  type: string;
</tbody>
</table>
}
/**
 * This object describes the source of a chat boost. It can be one of
 *
 * - <a href="#chatboostsourcepremium">ChatBoostSourcePremium</a>
 * - <a href="#chatboostsourcegiftcode">ChatBoostSourceGiftCode</a>
 * - <a href="#chatboostsourcegiveaway">ChatBoostSourceGiveaway</a>
 */
export type ChatBoostSource =
 | <a href="#chatboostsourcepremium">ChatBoostSourcePremium</a>
 | <a href="#chatboostsourcegiftcode">ChatBoostSourceGiftCode</a>
 | <a href="#chatboostsourcegiveaway">ChatBoostSourceGiveaway</a>
/**
 * The boost was obtained by subscribing to Telegram Premium or by gifting a Telegram Premium subscription to another user.
 */
export interface ChatBoostSourcePremium {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Source of the boost, always “premium”
   */
  source: string;
  /**
   * User that boosted the chat
   */
  user: User;
</tbody>
</table>
}
/**
 * The boost was obtained by the creation of Telegram Premium gift codes to boost a chat. Each such code boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription.
 */
export interface ChatBoostSourceGiftCode {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Source of the boost, always “gift_code”
   */
  source: string;
  /**
   * User for which the gift code was created
   */
  user: User;
</tbody>
</table>
}
/**
 * The boost was obtained by the creation of a Telegram Premium or a Telegram Star giveaway. This boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription for Telegram Premium giveaways and <em>prize_star_count</em> / 500 times for one year for Telegram Star giveaways.
 */
export interface ChatBoostSourceGiveaway {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Source of the boost, always “giveaway”
   */
  source: string;
  /**
   * Identifier of a message in the chat with the giveaway; the message could have been deleted already. May be 0 if the message isn&#39;t sent yet.
   */
  giveaway_message_id: number;
  /**
   * User that won the prize in the giveaway if any; for Telegram Premium giveaways only
   */
  user?: User;
  /**
   * The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only
   */
  prize_star_count?: number;
  /**
   * <em>True</em>, if the giveaway was completed, but there was no user to win the prize
   */
  is_unclaimed?: true;
</tbody>
</table>
}
/**
 * This object contains information about a chat boost.
 */
export interface ChatBoost {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the boost
   */
  boost_id: string;
  /**
   * Point in time (Unix timestamp) when the chat was boosted
   */
  add_date: number;
  /**
   * Point in time (Unix timestamp) when the boost will automatically expire, unless the booster&#39;s Telegram Premium subscription is prolonged
   */
  expiration_date: number;
  /**
   * Source of the added boost
   */
  source: ChatBoostSource;
</tbody>
</table>
}
/**
 * This object represents a boost added to a chat or changed.
 */
export interface ChatBoostUpdated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Chat which was boosted
   */
  chat: Chat;
  /**
   * Information about the chat boost
   */
  boost: ChatBoost;
</tbody>
</table>
}
/**
 * This object represents a boost removed from a chat.
 */
export interface ChatBoostRemoved {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Chat which was boosted
   */
  chat: Chat;
  /**
   * Unique identifier of the boost
   */
  boost_id: string;
  /**
   * Point in time (Unix timestamp) when the boost was removed
   */
  remove_date: number;
  /**
   * Source of the removed boost
   */
  source: ChatBoostSource;
</tbody>
</table>
}
/**
 * Describes a service message about the chat owner leaving the chat.
 */
export interface ChatOwnerLeft {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The user who will become the new owner of the chat if the previous owner does not return to the chat
   */
  new_owner?: User;
</tbody>
</table>
}
/**
 * Describes a service message about an ownership change in the chat.
 */
export interface ChatOwnerChanged {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The new owner of the chat
   */
  new_owner: User;
</tbody>
</table>
}
/**
 * This object represents a list of boosts added to a chat by a user.
 */
export interface UserChatBoosts {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>boosts</td>
<td>Array of <a href="#chatboost">ChatBoost</a></td>
<td>The list of boosts added to the chat by the user</td>
</tr>
</tbody>
</table>
}
/**
 * Represents the rights of a business bot.
 */
export interface BusinessBotRights {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * <em>True</em>, if the bot can send and edit messages in the private chats that had incoming messages in the last 24 hours
   */
  can_reply?: true;
  /**
   * <em>True</em>, if the bot can mark incoming private messages as read
   */
  can_read_messages?: true;
  /**
   * <em>True</em>, if the bot can delete messages sent by the bot
   */
  can_delete_sent_messages?: true;
  /**
   * <em>True</em>, if the bot can delete all private messages in managed chats
   */
  can_delete_all_messages?: true;
  /**
   * <em>True</em>, if the bot can edit the first and last name of the business account
   */
  can_edit_name?: true;
  /**
   * <em>True</em>, if the bot can edit the bio of the business account
   */
  can_edit_bio?: true;
  /**
   * <em>True</em>, if the bot can edit the profile photo of the business account
   */
  can_edit_profile_photo?: true;
  /**
   * <em>True</em>, if the bot can edit the username of the business account
   */
  can_edit_username?: true;
  /**
   * <em>True</em>, if the bot can change the privacy settings pertaining to gifts for the business account
   */
  can_change_gift_settings?: true;
  /**
   * <em>True</em>, if the bot can view gifts and the amount of Telegram Stars owned by the business account
   */
  can_view_gifts_and_stars?: true;
  /**
   * <em>True</em>, if the bot can convert regular gifts owned by the business account to Telegram Stars
   */
  can_convert_gifts_to_stars?: true;
  /**
   * <em>True</em>, if the bot can transfer and upgrade gifts owned by the business account
   */
  can_transfer_and_upgrade_gifts?: true;
  /**
   * <em>True</em>, if the bot can transfer Telegram Stars received by the business account to its own account, or use them to upgrade and transfer gifts
   */
  can_transfer_stars?: true;
  /**
   * <em>True</em>, if the bot can post, edit and delete stories on behalf of the business account
   */
  can_manage_stories?: true;
</tbody>
</table>
}
/**
 * Describes the connection of the bot with a business account.
 */
export interface BusinessConnection {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the business connection
   */
  id: string;
  /**
   * Business account user that created the business connection
   */
  user: User;
  /**
   * Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  user_chat_id: number;
  /**
   * Date the connection was established in Unix time
   */
  date: number;
  /**
   * Rights of the business bot
   */
  rights?: BusinessBotRights;
  /**
   * <em>True</em>, if the connection is active
   */
  is_enabled: boolean;
</tbody>
</table>
}
/**
 * This object is received when messages are deleted from a connected business account.
 */
export interface BusinessMessagesDeleted {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the business connection
   */
  business_connection_id: string;
  /**
   * Information about a chat in the business account. The bot may not have access to the chat or the corresponding user.
   */
  chat: Chat;
  /**
   * The list of identifiers of deleted messages in the chat of the business account
   */
  message_ids: number[];
</tbody>
</table>
}
/**
 * Describes an inline message sent by a <a href="/bots/webapps">Web App</a> on behalf of a user.
 */
export interface SentWebAppMessage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier of the sent inline message. Available only if there is an <a href="#inlinekeyboardmarkup">inline keyboard</a> attached to the message.
   */
  inline_message_id?: string;
</tbody>
</table>
}
/**
 * Describes an inline message sent by a guest bot.
 */
export interface SentGuestMessage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier of the sent inline message
   */
  inline_message_id: string;
</tbody>
</table>
}
/**
 * Describes an inline message to be sent by a user of a Mini App.
 */
export interface PreparedInlineMessage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the prepared message
   */
  id: string;
  /**
   * Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used.
   */
  expiration_date: number;
</tbody>
</table>
}
/**
 * Describes a keyboard button to be used by a user of a Mini App.
 */
export interface PreparedKeyboardButton {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the keyboard button
   */
  id: string;
</tbody>
</table>
}
/**
 * Describes why a request was unsuccessful.
 */
export interface ResponseParameters {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
   */
  migrate_to_chat_id?: number;
  /**
   * In case of exceeding flood control, the number of seconds left to wait before the request can be repeated
   */
  retry_after?: number;
</tbody>
</table>
}
/**
 * This object represents the content of a media message to be sent. It should be one of
 *
 * - <a href="#inputmediaanimation">InputMediaAnimation</a>
 * - <a href="#inputmediaaudio">InputMediaAudio</a>
 * - <a href="#inputmediadocument">InputMediaDocument</a>
 * - <a href="#inputmedialivephoto">InputMediaLivePhoto</a>
 * - <a href="#inputmediaphoto">InputMediaPhoto</a>
 * - <a href="#inputmediavideo">InputMediaVideo</a>
 */
export type InputMedia =
 | <a href="#inputmediaanimation">InputMediaAnimation</a>
 | <a href="#inputmediaaudio">InputMediaAudio</a>
 | <a href="#inputmediadocument">InputMediaDocument</a>
 | <a href="#inputmedialivephoto">InputMediaLivePhoto</a>
 | <a href="#inputmediaphoto">InputMediaPhoto</a>
 | <a href="#inputmediavideo">InputMediaVideo</a>
/**
 * Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.
 */
export interface InputMediaAnimation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>animation</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  thumbnail?: string;
  /**
   * Caption of the animation to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the animation caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * Animation width
   */
  width?: number;
  /**
   * Animation height
   */
  height?: number;
  /**
   * Animation duration in seconds
   */
  duration?: number;
  /**
   * Pass <em>True</em> if the animation needs to be covered with a spoiler animation
   */
  has_spoiler?: boolean;
</tbody>
</table>
}
/**
 * Represents an audio file to be treated as music to be sent.
 */
export interface InputMediaAudio {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>audio</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  thumbnail?: string;
  /**
   * Caption of the audio to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Duration of the audio in seconds
   */
  duration?: number;
  /**
   * Performer of the audio
   */
  performer?: string;
  /**
   * Title of the audio
   */
  title?: string;
</tbody>
</table>
}
/**
 * Represents a general file to be sent.
 */
export interface InputMediaDocument {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>document</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  thumbnail?: string;
  /**
   * Caption of the document to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always <em>True</em>, if the document is sent as part of an album.
   */
  disable_content_type_detection?: boolean;
</tbody>
</table>
}
/**
 * Represents an HTTP link to be sent.
 */
export interface InputMediaLink {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>link</em>
   */
  type: string;
  /**
   * HTTP URL of the link
   */
  url: string;
</tbody>
</table>
}
/**
 * Represents a live photo to be sent.
 */
export interface InputMediaLivePhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>live_photo</em>
   */
  type: string;
  /**
   * Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>. Sending live photos by a URL is currently unsupported.
   */
  media: string;
  /**
   * The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>. Sending live photos by a URL is currently unsupported.
   */
  photo: string;
  /**
   * Caption of the live photo to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the live photo caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * Pass <em>True</em> if the live photo needs to be covered with a spoiler animation
   */
  has_spoiler?: boolean;
</tbody>
</table>
}
/**
 * Represents a location to be sent.
 */
export interface InputMediaLocation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>location</em>
   */
  type: string;
  /**
   * Latitude of the location
   */
  latitude: number;
  /**
   * Longitude of the location
   */
  longitude: number;
  /**
   * The radius of uncertainty for the location, measured in meters; 0-1500
   */
  horizontal_accuracy?: number;
</tbody>
</table>
}
/**
 * Represents a photo to be sent.
 */
export interface InputMediaPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>photo</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Caption of the photo to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * Pass <em>True</em> if the photo needs to be covered with a spoiler animation
   */
  has_spoiler?: boolean;
</tbody>
</table>
}
/**
 * Represents a sticker file to be sent.
 */
export interface InputMediaSticker {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>sticker</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a .WEBP sticker from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Emoji associated with the sticker; only for just uploaded stickers
   */
  emoji?: string;
</tbody>
</table>
}
/**
 * Represents a venue to be sent.
 */
export interface InputMediaVenue {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>venue</em>
   */
  type: string;
  /**
   * Latitude of the location
   */
  latitude: number;
  /**
   * Longitude of the location
   */
  longitude: number;
  /**
   * Name of the venue
   */
  title: string;
  /**
   * Address of the venue
   */
  address: string;
  /**
   * Foursquare identifier of the venue
   */
  foursquare_id?: string;
  /**
   * Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
   */
  foursquare_type?: string;
  /**
   * Google Places identifier of the venue
   */
  google_place_id?: string;
  /**
   * Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)
   */
  google_place_type?: string;
</tbody>
</table>
}
/**
 * Represents a video to be sent.
 */
export interface InputMediaVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>video</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  thumbnail?: string;
  /**
   * Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  cover?: string;
  /**
   * Start timestamp for the video in the message
   */
  start_timestamp?: number;
  /**
   * Caption of the video to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * Video width
   */
  width?: number;
  /**
   * Video height
   */
  height?: number;
  /**
   * Video duration in seconds
   */
  duration?: number;
  /**
   * Pass <em>True</em> if the uploaded video is suitable for streaming
   */
  supports_streaming?: boolean;
  /**
   * Pass <em>True</em> if the video needs to be covered with a spoiler animation
   */
  has_spoiler?: boolean;
</tbody>
</table>
}
/**
 * Represents a voice message file to be sent.
 */
export interface InputMediaVoiceNote {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>voice_note</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file_attach_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Caption of the voice message to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the voice message caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Duration of the voice message in seconds
   */
  duration?: number;
</tbody>
</table>
}
/**
 * This object represents the contents of a file to be uploaded. Must be posted using multipart/form-data in the usual way that files are uploaded via the browser.
 */
export interface InputFile {}
/**
 * This object describes the paid media to be sent. Currently, it can be one of
 *
 * - <a href="#inputpaidmedialivephoto">InputPaidMediaLivePhoto</a>
 * - <a href="#inputpaidmediaphoto">InputPaidMediaPhoto</a>
 * - <a href="#inputpaidmediavideo">InputPaidMediaVideo</a>
 */
export type InputPaidMedia =
 | <a href="#inputpaidmedialivephoto">InputPaidMediaLivePhoto</a>
 | <a href="#inputpaidmediaphoto">InputPaidMediaPhoto</a>
 | <a href="#inputpaidmediavideo">InputPaidMediaVideo</a>
/**
 * The paid media to send is a live photo.
 */
export interface InputPaidMediaLivePhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>live_photo</em>
   */
  type: string;
  /**
   * Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>. Sending live photos by a URL is currently unsupported.
   */
  media: string;
  /**
   * The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>. Sending live photos by a URL is currently unsupported.
   */
  photo: string;
</tbody>
</table>
}
/**
 * The paid media to send is a photo.
 */
export interface InputPaidMediaPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>photo</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
</tbody>
</table>
}
/**
 * The paid media to send is a video.
 */
export interface InputPaidMediaVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the media, must be <em>video</em>
   */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  media: string;
  /**
   * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  thumbnail?: string;
  /**
   * Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a>
   */
  cover?: string;
  /**
   * Start timestamp for the video in the message
   */
  start_timestamp?: number;
  /**
   * Video width
   */
  width?: number;
  /**
   * Video height
   */
  height?: number;
  /**
   * Video duration in seconds
   */
  duration?: number;
  /**
   * Pass <em>True</em> if the uploaded video is suitable for streaming
   */
  supports_streaming?: boolean;
</tbody>
</table>
}
/**
 * This object describes a profile photo to set. Currently, it can be one of
 *
 * - <a href="#inputprofilephotostatic">InputProfilePhotoStatic</a>
 * - <a href="#inputprofilephotoanimated">InputProfilePhotoAnimated</a>
 */
export type InputProfilePhoto =
 | <a href="#inputprofilephotostatic">InputProfilePhotoStatic</a>
 | <a href="#inputprofilephotoanimated">InputProfilePhotoAnimated</a>
/**
 * A static profile photo in the .JPG format.
 */
export interface InputProfilePhotoStatic {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the profile photo, must be <em>static</em>
   */
  type: string;
  /**
   * The static profile photo. Profile photos can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the photo was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  photo: string;
</tbody>
</table>
}
/**
 * An animated profile photo in the MPEG4 format.
 */
export interface InputProfilePhotoAnimated {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the profile photo, must be <em>animated</em>
   */
  type: string;
  /**
   * The animated profile photo. Profile photos can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the photo was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  animation: string;
  /**
   * Timestamp in seconds of the frame that will be used as the static profile photo. Defaults to 0.0.
   */
  main_frame_timestamp?: number;
</tbody>
</table>
}
/**
 * This object describes the content of a story to post. Currently, it can be one of
 *
 * - <a href="#inputstorycontentphoto">InputStoryContentPhoto</a>
 * - <a href="#inputstorycontentvideo">InputStoryContentVideo</a>
 */
export type InputStoryContent =
 | <a href="#inputstorycontentphoto">InputStoryContentPhoto</a>
 | <a href="#inputstorycontentvideo">InputStoryContentVideo</a>
/**
 * Describes a photo to post as a story.
 */
export interface InputStoryContentPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the content, must be <em>photo</em>
   */
  type: string;
  /**
   * The photo to post as a story. The photo must be of the size 1080x1920 and must not exceed 10 MB. The photo can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the photo was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  photo: string;
</tbody>
</table>
}
/**
 * Describes a video to post as a story.
 */
export interface InputStoryContentVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the content, must be <em>video</em>
   */
  type: string;
  /**
   * The video to post as a story. The video must be of the size 720x1280, streamable, encoded with H.265 codec, with key frames added each second in the MPEG4 format, and must not exceed 30 MB. The video can&#39;t be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the video was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a>
   */
  video: string;
  /**
   * Precise duration of the video in seconds; 0-60
   */
  duration?: number;
  /**
   * Timestamp in seconds of the frame that will be used as the static cover for the story. Defaults to 0.0.
   */
  cover_frame_timestamp?: number;
  /**
   * Pass <em>True</em> if the video has no sound
   */
  is_animation?: boolean;
</tbody>
</table>
}
<h4><a class="anchor" name="sending-files" href="#sending-files"><i class="anchor-icon"></i></a>Sending files</h4>
<p>There are three ways to send files (photos, stickers, audio, media, etc.):</p>
<ol>
<li>If the file is already stored somewhere on the Telegram servers, you don&#39;t need to reupload it: each file object has a <strong>file_id</strong> field, simply pass this <strong>file_id</strong> as a parameter instead of uploading. There are <strong>no limits</strong> for files sent this way.</li>
<li>Provide Telegram with an HTTP URL for the file to be sent. Telegram will download and send the file. 5 MB max size for photos and 20 MB max for other types of content.</li>
<li>Post the file using multipart/form-data in the usual way that files are uploaded via the browser. 10 MB max size for photos, 50 MB for other files.</li>
</ol>
<p><strong>Sending by file_id</strong></p>
<ul>
<li>It is not possible to change the file type when resending by <strong>file_id</strong>. I.e. a <a href="#video">video</a> can&#39;t be <a href="#sendphoto">sent as a photo</a>, a <a href="#photosize">photo</a> can&#39;t be <a href="#senddocument">sent as a document</a>, etc.</li>
<li>It is not possible to resend thumbnails.</li>
<li>Resending a photo by <strong>file_id</strong> will send all of its <a href="#photosize">sizes</a>.</li>
<li><strong>file_id</strong> is unique for each individual bot and <strong>can&#39;t</strong> be transferred from one bot to another.</li>
<li><strong>file_id</strong> uniquely identifies a file, but a file can have different valid <strong>file_id</strong>s even for the same bot.</li>
</ul>
<p><strong>Sending by URL</strong></p>
<ul>
<li>When sending by URL the target file must have the correct MIME type (e.g., audio/mpeg for <a href="#sendaudio">sendAudio</a>, etc.).</li>
<li>In <a href="#senddocument">sendDocument</a>, sending by URL will currently only work for <strong>.PDF</strong> and <strong>.ZIP</strong> files.</li>
<li>To use <a href="#sendvoice">sendVoice</a>, the file must have the type audio/ogg and be no more than 1MB in size. 1-20MB voice notes will be sent as files.</li>
<li>Other configurations may work but we can&#39;t guarantee that they will.</li>
</ul>
<h4><a class="anchor" name="accent-colors" href="#accent-colors"><i class="anchor-icon"></i></a>Accent colors</h4>
<p>Colors with identifiers 0 (red), 1 (orange), 2 (purple/violet), 3 (green), 4 (cyan), 5 (blue), 6 (pink) can be customized by app themes. Additionally, the following colors in RGB format are currently in use.</p>
<p><table class="table table-hover table-bordered">
<thead>
<tr><th>Color identifier</th><th>Light colors</th><th>Dark colors</th></tr>
</thead>
<tbody>
<tr><td>7</td><td>E15052 F9AE63</td><td>FF9380 992F37</td></tr>
<tr><td>8</td><td>E0802B FAC534</td><td>ECB04E C35714</td></tr>
<tr><td>9</td><td>A05FF3 F48FFF</td><td>C697FF 5E31C8</td></tr>
<tr><td>10</td><td>27A910 A7DC57</td><td>A7EB6E 167E2D</td></tr>
<tr><td>11</td><td>27ACCE 82E8D6</td><td>40D8D0 045C7F</td></tr>
<tr><td>12</td><td>3391D4 7DD3F0</td><td>52BFFF 0B5494</td></tr>
<tr><td>13</td><td>DD4371 FFBE9F</td><td>FF86A6 8E366E</td></tr>
<tr><td>14</td><td>247BED F04856 FFFFFF</td><td>3FA2FE E5424F FFFFFF</td></tr>
<tr><td>15</td><td>D67722 1EA011 FFFFFF</td><td>FF905E 32A527 FFFFFF</td></tr>
<tr><td>16</td><td>179E42 E84A3F FFFFFF</td><td>66D364 D5444F FFFFFF</td></tr>
<tr><td>17</td><td>2894AF 6FC456 FFFFFF</td><td>22BCE2 3DA240 FFFFFF</td></tr>
<tr><td>18</td><td>0C9AB3 FFAD95 FFE6B5</td><td>22BCE2 FF9778 FFDA6B</td></tr>
<tr><td>19</td><td>7757D6 F79610 FFDE8E</td><td>9791FF F2731D FFDB59</td></tr>
<tr><td>20</td><td>1585CF F2AB1D FFFFFF</td><td>3DA6EB EEA51D FFFFFF</td></tr>
</tbody>
</table></p>
<h4><a class="anchor" name="profile-accent-colors" href="#profile-accent-colors"><i class="anchor-icon"></i></a>Profile accent colors</h4>
<p>Currently, the following colors in RGB format are in use for profile backgrounds.</p>
<p><table class="table table-hover table-bordered">
<thead>
<tr><th>Color identifier</th><th>Light colors</th><th>Dark colors</th></tr>
</thead>
<tbody>
<tr><td>0</td><td>BA5650</td><td>9C4540</td></tr>
<tr><td>1</td><td>C27C3E</td><td>945E2C</td></tr>
<tr><td>2</td><td>956AC8</td><td>715099</td></tr>
<tr><td>3</td><td>49A355</td><td>33713B</td></tr>
<tr><td>4</td><td>3E97AD</td><td>387E87</td></tr>
<tr><td>5</td><td>5A8FBB</td><td>477194</td></tr>
<tr><td>6</td><td>B85378</td><td>944763</td></tr>
<tr><td>7</td><td>7F8B95</td><td>435261</td></tr>
<tr><td>8</td><td>C9565D D97C57</td><td>994343 AC583E</td></tr>
<tr><td>9</td><td>CF7244 CC9433</td><td>8F552F A17232</td></tr>
<tr><td>10</td><td>9662D4 B966B6</td><td>634691 9250A2</td></tr>
<tr><td>11</td><td>3D9755 89A650</td><td>296A43 5F8F44</td></tr>
<tr><td>12</td><td>3D95BA 50AD98</td><td>306C7C 3E987E</td></tr>
<tr><td>13</td><td>538BC2 4DA8BD</td><td>38618C 458BA1</td></tr>
<tr><td>14</td><td>B04F74 D1666D</td><td>884160 A65259</td></tr>
<tr><td>15</td><td>637482 7B8A97</td><td>53606E 384654</td></tr>
</tbody>
</table></p>
<h4><a class="anchor" name="inline-mode-objects" href="#inline-mode-objects"><i class="anchor-icon"></i></a>Inline mode objects</h4>
<p>Objects and methods used in the inline mode are described in the <a href="#inline-mode">Inline mode section</a>.</p>
// === AVAILABLE METHODS
<blockquote>
<p>All methods in the Bot API are case-insensitive. We support <strong>GET</strong> and <strong>POST</strong> HTTP methods. Use either <a href="https://en.wikipedia.org/wiki/Query_string">URL query string</a> or <em>application/json</em> or <em>application/x-www-form-urlencoded</em> or <em>multipart/form-data</em> for passing parameters in Bot API requests.<br>On successful call, a JSON-object containing the result will be returned.</p>
</blockquote>
export interface ApiMethods {
  /**
   * A simple method for testing your bot&#39;s authentication token. Requires no parameters. Returns basic information about the bot in form of a <a href="#user">User</a> object.
   */
  getMe(args: {}): never;
}
export interface ApiMethods {
  /**
   * Use this method to log out from the cloud Bot API server before launching the bot locally. You <strong>must</strong> log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns <em>True</em> on success. Requires no parameters.
   */
  logOut(args: {}): never;
}
export interface ApiMethods {
  /**
   * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn&#39;t launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns <em>True</em> on success. Requires no parameters.
   */
  close(args: {}): never;
}
export interface ApiMethods {
  /**
   * Use this method to send text messages. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Yes</td>
<td>Text of the message to be sent, 1-4096 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in message text, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>link_preview_options</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Optional</td>
<td>Link preview generation options for the message</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
<h4><a class="anchor" name="formatting-options" href="#formatting-options"><i class="anchor-icon"></i></a>Formatting options</h4>
<p>The Bot API supports basic formatting for messages. You can use bold, italic, underlined, strikethrough, spoiler text, block quotations as well as inline links and pre-formatted code in your bots&#39; messages. Telegram clients will render them accordingly. You can specify text entities directly, or use markdown-style or HTML-style formatting.</p>
<p>Note that Telegram clients will display an <strong>alert</strong> to the user before opening an inline link (&#39;Open this link?&#39; together with the full URL).</p>
<p>Message entities can be nested, providing following restrictions are met:<br>- If two entities have common characters, then one of them is fully contained inside another.<br>- <em>bold</em>, <em>italic</em>, <em>underline</em>, <em>strikethrough</em>, and <em>spoiler</em> entities can contain and can be part of any other entities, except <em>pre</em> and <em>code</em>.<br>- <em>blockquote</em> and <em>expandable_blockquote</em> entities can&#39;t be nested.<br>- All other entities can&#39;t contain each other.</p>
<p>Links <code>tg://user?id=&lt;user_id&gt;</code> can be used to mention a user by their identifier without using a username. Please note:</p>
<ul>
<li>These links will work <strong>only</strong> if they are used inside an inline link or in an inline keyboard button. For example, they will not work, when used in a message text.</li>
<li>Unless the user is a member of the chat where they were mentioned, these mentions are only guaranteed to work if the user has contacted the bot in private in the past or has sent a callback query to the bot via an inline button and doesn&#39;t have Forwarded Messages privacy enabled for the bot.</li>
</ul>
<p>You can find the list of programming and markup languages for which syntax highlighting is supported at <a href="https://github.com/TelegramMessenger/libprisma#supported-languages">libprisma#supported-languages</a>.</p>
<h6><a class="anchor" name="date-time-entity-formatting" href="#date-time-entity-formatting"><i class="anchor-icon"></i></a>Date-time entity formatting</h6>
<p>Date-time entity formatting is specified by a format string, which must adhere to the following regular expression: <code>r|w?[dD]?[tT]?</code>.</p>
<p>If the format string is empty, the underlying text is displayed as-is; however, the user can still receive the underlying date in their local format. When populated, the format string determines the output based on the presence of the following control characters:</p>
<ul>
<li><strong><code>r</code></strong>: Displays the time relative to the current time. Cannot be combined with any other control characters.</li>
<li><strong><code>w</code></strong>: Displays the day of the week in the user&#39;s localized language.</li>
<li><strong><code>d</code></strong>: Displays the date in short form (e.g., “17.03.22”).</li>
<li><strong><code>D</code></strong>: Displays the date in long form (e.g., “March 17, 2022”).</li>
<li><strong><code>t</code></strong>: Displays the time in short form (e.g., “22:45”).</li>
<li><strong><code>T</code></strong>: Displays the time in long form (e.g., “22:45:00”).</li>
</ul>
<h6><a class="anchor" name="markdownv2-style" href="#markdownv2-style"><i class="anchor-icon"></i></a>MarkdownV2 style</h6>
<p>To use this mode, pass <em>MarkdownV2</em> in the <em>parse_mode</em> field. Use the following syntax in your message:</p>
<pre><code>*bold \*text*
_italic \*text_
__underline__
~strikethrough~
||spoiler||
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
![<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />](tg://emoji?id=5368324170671202286)
![22:45 tomorrow](tg://time?unix=1647531900&amp;format=wDT)
![22:45 tomorrow](tg://time?unix=1647531900&amp;format=t)
![22:45 tomorrow](tg://time?unix=1647531900&amp;format=r)
![22:45 tomorrow](tg://time?unix=1647531900)
`inline fixed-width code`
```
pre-formatted fixed-width code block
```
```python
pre-formatted fixed-width code block written in the Python programming language
```
&gt;Block quotation started
&gt;Block quotation continued
&gt;Block quotation continued
&gt;Block quotation continued
&gt;The last line of the block quotation
**&gt;The expandable block quotation started right after the previous block quotation
&gt;It is separated from the previous block quotation by an empty bold entity
&gt;Expandable block quotation continued
&gt;Hidden by default part of the expandable block quotation started
&gt;Expandable block quotation continued
&gt;The last line of the expandable block quotation with the expandability mark||</code></pre>
<p>Please note:</p>
<ul>
<li>Any character with code between 1 and 126 inclusively can be escaped anywhere with a preceding &#39;\&#39; character, in which case it is treated as an ordinary character and not a part of the markup. This implies that &#39;\&#39; character usually must be escaped with a preceding &#39;\&#39; character.</li>
<li>Inside <code>pre</code> and <code>code</code> entities, all &#39;`&#39; and &#39;\&#39; characters must be escaped with a preceding &#39;\&#39; character.</li>
<li>Inside the <code>(...)</code> part of the inline link and custom emoji definition, all &#39;)&#39; and &#39;\&#39; must be escaped with a preceding &#39;\&#39; character.</li>
<li>In all other places characters &#39;_&#39;, &#39;*&#39;, &#39;[&#39;, &#39;]&#39;, &#39;(&#39;, &#39;)&#39;, &#39;~&#39;, &#39;`&#39;, &#39;&gt;&#39;, &#39;#&#39;, &#39;+&#39;, &#39;-&#39;, &#39;=&#39;, &#39;|&#39;, &#39;{&#39;, &#39;}&#39;, &#39;.&#39;, &#39;!&#39; must be escaped with the preceding character &#39;\&#39;.</li>
<li>In case of ambiguity between <code>italic</code> and <code>underline</code> entities <code>__</code> is always greedily treated from left to right as beginning or end of an <code>underline</code> entity, so instead of <code>___italic underline___</code> use <code>___italic underline_**__</code>, adding an empty bold entity as a separator.</li>
<li>A valid emoji must be provided as an alternative value for the custom emoji. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the <strong>emoji</strong> field of the custom emoji <a href="#sticker">sticker</a>.</li>
<li>Custom emoji entities can only be used by bots that purchased additional usernames on <a href="https://fragment.com">Fragment</a> or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.</li>
<li>See <a href="#date-time-entity-formatting">date-time entity formatting</a> for more details about supported date-time formats.</li>
</ul>
<h6><a class="anchor" name="html-style" href="#html-style"><i class="anchor-icon"></i></a>HTML style</h6>
<p>To use this mode, pass <em>HTML</em> in the <em>parse_mode</em> field. The following tags are currently supported:</p>
<pre><code>&lt;b&gt;bold&lt;/b&gt;, &lt;strong&gt;bold&lt;/strong&gt;
&lt;i&gt;italic&lt;/i&gt;, &lt;em&gt;italic&lt;/em&gt;
&lt;u&gt;underline&lt;/u&gt;, &lt;ins&gt;underline&lt;/ins&gt;
&lt;s&gt;strikethrough&lt;/s&gt;, &lt;strike&gt;strikethrough&lt;/strike&gt;, &lt;del&gt;strikethrough&lt;/del&gt;
&lt;span class=&quot;tg-spoiler&quot;&gt;spoiler&lt;/span&gt;, &lt;tg-spoiler&gt;spoiler&lt;/tg-spoiler&gt;
&lt;b&gt;bold &lt;i&gt;italic bold &lt;s&gt;italic bold strikethrough &lt;span class=&quot;tg-spoiler&quot;&gt;italic bold strikethrough spoiler&lt;/span&gt;&lt;/s&gt; &lt;u&gt;underline italic bold&lt;/u&gt;&lt;/i&gt; bold&lt;/b&gt;
&lt;a href=&quot;http://www.example.com/&quot;&gt;inline URL&lt;/a&gt;
&lt;a href=&quot;tg://user?id=123456789&quot;&gt;inline mention of a user&lt;/a&gt;
&lt;tg-emoji emoji-id=&quot;5368324170671202286&quot;&gt;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />&lt;/tg-emoji&gt;
&lt;tg-time unix=&quot;1647531900&quot; format=&quot;wDT&quot;&gt;22:45 tomorrow&lt;/tg-time&gt;
&lt;tg-time unix=&quot;1647531900&quot; format=&quot;t&quot;&gt;22:45 tomorrow&lt;/tg-time&gt;
&lt;tg-time unix=&quot;1647531900&quot; format=&quot;r&quot;&gt;22:45 tomorrow&lt;/tg-time&gt;
&lt;tg-time unix=&quot;1647531900&quot;&gt;22:45 tomorrow&lt;/tg-time&gt;
&lt;code&gt;inline fixed-width code&lt;/code&gt;
&lt;pre&gt;pre-formatted fixed-width code block&lt;/pre&gt;
&lt;pre&gt;&lt;code class=&quot;language-python&quot;&gt;pre-formatted fixed-width code block written in the Python programming language&lt;/code&gt;&lt;/pre&gt;
&lt;blockquote&gt;Block quotation started
Block quotation continued
The last line of the block quotation&lt;/blockquote&gt;
&lt;blockquote expandable&gt;Expandable block quotation started
Expandable block quotation continued
Expandable block quotation continued
Hidden by default part of the block quotation started
Expandable block quotation continued
The last line of the block quotation&lt;/blockquote&gt;</code></pre>
<p>Please note:</p>
<ul>
<li>Only the tags mentioned above are currently supported.</li>
<li>All <code>&lt;</code>, <code>&gt;</code> and <code>&amp;</code> symbols that are not a part of a tag or an HTML entity must be replaced with the corresponding HTML entities (<code>&lt;</code> with <code>&amp;lt;</code>, <code>&gt;</code> with <code>&amp;gt;</code> and <code>&amp;</code> with <code>&amp;amp;</code>).</li>
<li>All numerical HTML entities are supported.</li>
<li>The API currently supports only the following named HTML entities: <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;amp;</code> and <code>&amp;quot;</code>.</li>
<li>Use nested <code>pre</code> and <code>code</code> tags, to define programming language for <code>pre</code> entity.</li>
<li>Programming language can&#39;t be specified for standalone <code>code</code> tags.</li>
<li>A valid emoji must be used as the content of the <code>tg-emoji</code> tag. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the <strong>emoji</strong> field of the custom emoji <a href="#sticker">sticker</a>.</li>
<li>Custom emoji entities can only be used by bots that purchased additional usernames on <a href="https://fragment.com">Fragment</a> or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.</li>
<li>See <a href="#date-time-entity-formatting">date-time entity formatting</a> for more details about supported date-time formats.</li>
</ul>
<h6><a class="anchor" name="markdown-style" href="#markdown-style"><i class="anchor-icon"></i></a>Markdown style</h6>
<p>This is a legacy mode, retained for backward compatibility. To use this mode, pass <em>Markdown</em> in the <em>parse_mode</em> field. Use the following syntax in your message:</p>
<pre><code>*bold text*
_italic text_
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
`inline fixed-width code`
```
pre-formatted fixed-width code block
```
```python
pre-formatted fixed-width code block written in the Python programming language
```</code></pre>
<p>Please note:</p>
<ul>
<li>Entities must not be nested, use parse mode <a href="#markdownv2-style">MarkdownV2</a> instead.</li>
<li>There is no way to specify “underline”, “strikethrough”, “spoiler”, “blockquote”, “expandable_blockquote”, “custom_emoji”, and “date_time” entities, use parse mode <a href="#markdownv2-style">MarkdownV2</a> instead.</li>
<li>To escape characters &#39;_&#39;, &#39;*&#39;, &#39;`&#39;, &#39;[&#39; outside of an entity, prepend the character &#39;\&#39; before them.</li>
<li>Escaping inside entities is not allowed, so entity must be closed first and reopened again: use <code>_snake_\__case_</code> for italic <code>snake_case</code> and <code>*2*\**2=4*</code> for bold <code>2*2=4</code>.</li>
</ul>
<h4><a class="anchor" name="ephemeral-messages-and-commands" href="#ephemeral-messages-and-commands"><i class="anchor-icon"></i></a>Ephemeral Messages and Commands</h4>
<p>Ephemeral interactions allow a bot and an individual member of a group or supergroup chat to communicate privately on the public timeline without cluttering the chat for other members. They may disappear automatically after some time, or if the app is restarted.</p>
<p><strong>Ephemeral Commands (User to Bot)</strong><br>Bots can declare ephemeral commands by setting the <em>is_ephemeral</em> field to <em>True</em> in the <a href="#botcommand">BotCommand</a> class. A user can then send an ephemeral command that is received by the target bot but remains invisible to all members of the chat, including both users and other bots.</p>
<p><strong>Ephemeral Messages</strong><br>Bots can send an ephemeral message response back to a specific user designated by the <em>receiver_user_id</em> parameter. Other members of the group or supergroup chat will not see the message.</p>
<blockquote>
<p>It is <strong>not guaranteed</strong> that the ephemeral message will be received, especially if the user is offline.</p>
</blockquote>
<p><strong>Reply Targets and Conditions</strong></p>
<ul>
<li><p>Any bot can send an ephemeral message to a user within <strong>15 seconds</strong> of the incoming eligible action. The message will be sent to the exact client application that triggered the action. For this the bot must provide either:</p>
<ul>
<li>The <em>callback_query_id</em> from a received callback query, or</li>
<li>The <em>reply_parameters.ephemeral_message_id</em> from an incoming ephemeral message.</li>
</ul>
</li>
<li><p>If the bot is a chat administrator, it can send an ephemeral message to any non-bot member of the chat at any time without needing to specify a <em>callback_query_id</em> or <em>reply_parameters.ephemeral_message_id</em>. In this case, the message may be delivered across multiple active client applications of the user, but is regardless not guaranteed to be delivered to any of them.</p>
</li>
</ul>
<h4><a class="anchor" name="paid-broadcasts" href="#paid-broadcasts"><i class="anchor-icon"></i></a>Paid Broadcasts</h4>
<p>By default, all bots are able to broadcast up to <a href="https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this">30 messages</a> per second to their users. Developers can increase this limit by enabling <em>Paid Broadcasts</em> in <a href="https://t.me/botfather">@BotFather</a> - allowing their bot to broadcast <strong>up to 1000 messages</strong> per second.</p>
<p>Each message broadcasted over the free amount of 30 messages per second incurs a cost of 0.1 Stars per message, paid with Telegram Stars from the bot&#39;s balance. In order to use this feature, a bot must have at least <em>10,000 Stars</em> on its balance.</p>
<blockquote>
<p>Bots with increased limits are only charged for messages that are broadcasted successfully.</p>
</blockquote>
export interface ApiMethods {
  /**
   * Use this method to forward messages of any kind. Service messages and messages with protected content can&#39;t be forwarded. On success, the sent <a href="#message">Message</a> is returned.
   */
  forwardMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format <code>@username</code>)</td>
</tr>
<tr>
<td>video_start_timestamp</td>
<td>Integer</td>
<td>Optional</td>
<td>New start timestamp for the forwarded video in the message</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the forwarded message from forwarding and saving</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; only available when forwarding to private chats</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Message identifier in the chat specified in <em>from_chat_id</em></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to forward multiple messages of any kind. If some of the specified messages can&#39;t be found or forwarded, they are skipped. Service messages and messages with protected content can&#39;t be forwarded. Album grouping is kept for forwarded messages. On success, an Array of <a href="#messageid">MessageId</a> of the sent messages is returned.
   */
  forwardMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format <code>@username</code>)</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>Yes</td>
<td>A JSON-serialized list of 1-100 identifiers of messages in the chat <em>from_chat_id</em> to forward. The identifiers must be specified in a strictly increasing order.</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the messages <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the forwarded messages from forwarding and saving</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can&#39;t be copied. A quiz <a href="#poll">poll</a> can be copied only if the value of the field <em>correct_option_ids</em> is known to the bot. The method is analogous to the method <a href="#forwardmessage">forwardMessage</a>, but the copied message doesn&#39;t have a link to the original message. Returns the <a href="#messageid">MessageId</a> of the sent message on success.
   */
  copyMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format <code>@username</code>)</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Message identifier in the chat specified in <em>from_chat_id</em></td>
</tr>
<tr>
<td>video_start_timestamp</td>
<td>Integer</td>
<td>Optional</td>
<td>New start timestamp for the copied video in the message</td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept.</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the new caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>show_caption_above_media</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the caption must be shown above the message media. Ignored if a new caption isn&#39;t specified.</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; only available when copying to private chats</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to copy messages of any kind. If some of the specified messages can&#39;t be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can&#39;t be copied. A quiz <a href="#poll">poll</a> can be copied only if the value of the field <em>correct_option_ids</em> is known to the bot. The method is analogous to the method <a href="#forwardmessages">forwardMessages</a>, but the copied messages don&#39;t have a link to the original message. Album grouping is kept for copied messages. On success, an Array of <a href="#messageid">MessageId</a> of the sent messages is returned.
   */
  copyMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format <code>@username</code>)</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>Yes</td>
<td>A JSON-serialized list of 1-100 identifiers of messages in the chat <em>from_chat_id</em> to copy. The identifiers must be specified in a strictly increasing order.</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the messages <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent messages from forwarding and saving</td>
</tr>
<tr>
<td>remove_caption</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to copy the messages without their captions</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send photos. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendPhoto(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>photo</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo&#39;s width and height must not exceed 10000 in total. Width and height ratio must be at most 20. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Photo caption (may also be used when resending photos by <em>file_id</em>), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>show_caption_above_media</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the photo needs to be covered with a spoiler animation</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send live photos. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendLivePhoto(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel (in the format <code>@channelusername</code>)</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>live_photo</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Live photo video to send. The video must be no longer than 10 seconds and must not exceed 10 MB in size. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Sending live photos by a URL is currently unsupported.</td>
</tr>
<tr>
<td>photo</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Sending live photos by a URL is currently unsupported.</td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Video caption (may also be used when resending videos by <em>file_id</em>), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>show_caption_above_media</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the video needs to be covered with a spoiler animation</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent <a href="#message">Message</a> is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
   *
   * For sending voice messages, use the <a href="#sendvoice">sendVoice</a> method instead.
   */
  sendAudio(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>audio</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Audio caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Optional</td>
<td>Duration of the audio in seconds</td>
</tr>
<tr>
<td>performer</td>
<td>String</td>
<td>Optional</td>
<td>Performer</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Optional</td>
<td>Track name</td>
</tr>
<tr>
<td>thumbnail</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Optional</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send general files. On success, the sent <a href="#message">Message</a> is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
   */
  sendDocument(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>document</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>thumbnail</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Optional</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Document caption (may also be used when resending documents by <em>file_id</em>), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>disable_content_type_detection</td>
<td>Boolean</td>
<td>Optional</td>
<td>Disables automatic server-side content type detection for files uploaded using multipart/form-data</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as <a href="#document">Document</a>). On success, the sent <a href="#message">Message</a> is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
   */
  sendVideo(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>video</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Optional</td>
<td>Duration of sent video in seconds</td>
</tr>
<tr>
<td>width</td>
<td>Integer</td>
<td>Optional</td>
<td>Video width</td>
</tr>
<tr>
<td>height</td>
<td>Integer</td>
<td>Optional</td>
<td>Video height</td>
</tr>
<tr>
<td>thumbnail</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Optional</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>cover</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Optional</td>
<td>Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>start_timestamp</td>
<td>Integer</td>
<td>Optional</td>
<td>Start timestamp for the video in the message</td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Video caption (may also be used when resending videos by <em>file_id</em>), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>show_caption_above_media</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the video needs to be covered with a spoiler animation</td>
</tr>
<tr>
<td>supports_streaming</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the uploaded video is suitable for streaming</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent <a href="#message">Message</a> is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
   */
  sendAnimation(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>animation</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Optional</td>
<td>Duration of sent animation in seconds</td>
</tr>
<tr>
<td>width</td>
<td>Integer</td>
<td>Optional</td>
<td>Animation width</td>
</tr>
<tr>
<td>height</td>
<td>Integer</td>
<td>Optional</td>
<td>Animation height</td>
</tr>
<tr>
<td>thumbnail</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Optional</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Animation caption (may also be used when resending animation by <em>file_id</em>), 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the animation caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>show_caption_above_media</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the caption must be shown above the message media</td>
</tr>
<tr>
<td>has_spoiler</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the animation needs to be covered with a spoiler animation</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as <a href="#audio">Audio</a> or <a href="#document">Document</a>). On success, the sent <a href="#message">Message</a> is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
   */
  sendVoice(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>voice</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Voice message caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the voice message caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Optional</td>
<td>Duration of the voice message in seconds</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * As of <a href="https://telegram.org/blog/video-messages-and-telescope">v.4.0</a>, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendVideoNote(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>video_note</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Sending video notes by a URL is currently unsupported.</td>
</tr>
<tr>
<td>duration</td>
<td>Integer</td>
<td>Optional</td>
<td>Duration of sent video in seconds</td>
</tr>
<tr>
<td>length</td>
<td>Integer</td>
<td>Optional</td>
<td>Video width and height, i.e. diameter of the video message</td>
</tr>
<tr>
<td>thumbnail</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Optional</td>
<td>Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send paid media. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendPaidMedia(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat&#39;s balance. Otherwise, they will be credited to the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>Yes</td>
<td>The number of Telegram Stars that must be paid to buy access to the media; 1-25000</td>
</tr>
<tr>
<td>media</td>
<td>Array of <a href="#inputpaidmedia">InputPaidMedia</a></td>
<td>Yes</td>
<td>A JSON-serialized Array describing the media to be sent; up to 10 items</td>
</tr>
<tr>
<td>payload</td>
<td>String</td>
<td>Optional</td>
<td>Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes.</td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Media caption, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the media caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>show_caption_above_media</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the caption must be shown above the message media</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of <a href="#message">Message</a> objects that were sent is returned.
   */
  sendMediaGroup(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat</td>
</tr>
<tr>
<td>media</td>
<td>Array of <a href="#inputmediaaudio">InputMediaAudio</a>, <a href="#inputmediadocument">InputMediaDocument</a>, <a href="#inputmedialivephoto">InputMediaLivePhoto</a>, <a href="#inputmediaphoto">InputMediaPhoto</a> and <a href="#inputmediavideo">InputMediaVideo</a></td>
<td>Yes</td>
<td>A JSON-serialized Array describing messages to be sent, must include 2-10 items</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends messages <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent messages from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send point on the map. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendLocation(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Yes</td>
<td>Latitude of the location</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Yes</td>
<td>Longitude of the location</td>
</tr>
<tr>
<td>horizontal_accuracy</td>
<td>Float</td>
<td>Optional</td>
<td>The radius of uncertainty for the location, measured in meters; 0-1500</td>
</tr>
<tr>
<td>live_period</td>
<td>Integer</td>
<td>Optional</td>
<td>Period in seconds during which the location will be updated (see <a href="https://telegram.org/blog/live-locations">Live Locations</a>), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages.</td>
</tr>
<tr>
<td>heading</td>
<td>Integer</td>
<td>Optional</td>
<td>For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.</td>
</tr>
<tr>
<td>proximity_alert_radius</td>
<td>Integer</td>
<td>Optional</td>
<td>For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send information about a venue. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendVenue(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Yes</td>
<td>Latitude of the venue</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Yes</td>
<td>Longitude of the venue</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Yes</td>
<td>Name of the venue</td>
</tr>
<tr>
<td>address</td>
<td>String</td>
<td>Yes</td>
<td>Address of the venue</td>
</tr>
<tr>
<td>foursquare_id</td>
<td>String</td>
<td>Optional</td>
<td>Foursquare identifier of the venue</td>
</tr>
<tr>
<td>foursquare_type</td>
<td>String</td>
<td>Optional</td>
<td>Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)</td>
</tr>
<tr>
<td>google_place_id</td>
<td>String</td>
<td>Optional</td>
<td>Google Places identifier of the venue</td>
</tr>
<tr>
<td>google_place_type</td>
<td>String</td>
<td>Optional</td>
<td>Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send phone contacts. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendContact(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>phone_number</td>
<td>String</td>
<td>Yes</td>
<td>Contact&#39;s phone number</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>Yes</td>
<td>Contact&#39;s first name</td>
</tr>
<tr>
<td>last_name</td>
<td>String</td>
<td>Optional</td>
<td>Contact&#39;s last name</td>
</tr>
<tr>
<td>vcard</td>
<td>String</td>
<td>Optional</td>
<td>Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a>, 0-2048 bytes</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send a native poll. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendPoll(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>. Polls can&#39;t be sent to channel direct messages chats.</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>question</td>
<td>String</td>
<td>Yes</td>
<td>Poll question, 1-300 characters</td>
</tr>
<tr>
<td>question_parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the question. See <a href="#formatting-options">formatting options</a> for more details. Currently, only custom emoji entities are allowed.</td>
</tr>
<tr>
<td>question_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of <em>question_parse_mode</em>.</td>
</tr>
<tr>
<td>options</td>
<td>Array of <a href="#inputpolloption">InputPollOption</a></td>
<td>Yes</td>
<td>A JSON-serialized list of 1-12 answer options</td>
</tr>
<tr>
<td>is_anonymous</td>
<td>Boolean</td>
<td>Optional</td>
<td><em>True</em>, if the poll needs to be anonymous, defaults to <em>True</em></td>
</tr>
<tr>
<td>type</td>
<td>String</td>
<td>Optional</td>
<td>Poll type, “quiz” or “regular”, defaults to “regular”</td>
</tr>
<tr>
<td>allows_multiple_answers</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the poll allows multiple answers, defaults to <em>False</em></td>
</tr>
<tr>
<td>allows_revoting</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the poll allows to change chosen answer options, defaults to <em>False</em> for quizzes and to <em>True</em> for regular polls</td>
</tr>
<tr>
<td>shuffle_options</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the poll options must be shown in random order</td>
</tr>
<tr>
<td>allow_adding_options</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes</td>
</tr>
<tr>
<td>hide_results_until_closes</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if poll results must be shown only after the poll closes</td>
</tr>
<tr>
<td>members_only</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only</td>
</tr>
<tr>
<td>country_codes</td>
<td>Array of String</td>
<td>Optional</td>
<td>A JSON-serialized list of 0-12 two-letter <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a> country codes indicating the countries from which users can vote in the poll; for channel chats only. Use “FT” as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll.</td>
</tr>
<tr>
<td>correct_option_ids</td>
<td>Array of Integer</td>
<td>Optional</td>
<td>A JSON-serialized list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode</td>
</tr>
<tr>
<td>explanation</td>
<td>String</td>
<td>Optional</td>
<td>Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing</td>
</tr>
<tr>
<td>explanation_parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the explanation. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>explanation_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of <em>explanation_parse_mode</em>.</td>
</tr>
<tr>
<td>explanation_media</td>
<td><a href="#inputpollmedia">InputPollMedia</a></td>
<td>Optional</td>
<td>Media added to the quiz explanation</td>
</tr>
<tr>
<td>open_period</td>
<td>Integer</td>
<td>Optional</td>
<td>Amount of time in seconds the poll will be active after creation, 5-2628000. Can&#39;t be used together with <em>close_date</em>.</td>
</tr>
<tr>
<td>close_date</td>
<td>Integer</td>
<td>Optional</td>
<td>Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can&#39;t be used together with <em>open_period</em>.</td>
</tr>
<tr>
<td>is_closed</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the poll needs to be immediately closed. This can be useful for poll preview.</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Optional</td>
<td>Description of the poll to be sent, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>description_parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the poll description. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>description_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the poll description, which can be specified instead of <em>description_parse_mode</em></td>
</tr>
<tr>
<td>media</td>
<td><a href="#inputpollmedia">InputPollMedia</a></td>
<td>Optional</td>
<td>Media added to the poll description</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send a checklist on behalf of a connected business account. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendChecklist(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot in the format <code>@username</code></td>
</tr>
<tr>
<td>checklist</td>
<td><a href="#inputchecklist">InputChecklist</a></td>
<td>Yes</td>
<td>A JSON-serialized object for the checklist to send</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message silently. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object for description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send an animated emoji that will display a random value. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendDice(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>emoji</td>
<td>String</td>
<td>Optional</td>
<td>Emoji on which the dice throw animation is based. Currently, must be one of “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EAF.png" width="20" height="20" alt="🎯" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F80.png" width="20" height="20" alt="🏀" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/E29ABD.png" width="20" height="20" alt="⚽" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB3.png" width="20" height="20" alt="🎳" />”, or “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB0.png" width="20" height="20" alt="🎰" />”. Dice can have values 1-6 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”, “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EAF.png" width="20" height="20" alt="🎯" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB3.png" width="20" height="20" alt="🎳" />”, values 1-5 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8F80.png" width="20" height="20" alt="🏀" />” and “<img class="emoji" src="//telegram.org/img/emoji/40/E29ABD.png" width="20" height="20" alt="⚽" />”, and values 1-64 for “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB0.png" width="20" height="20" alt="🎰" />”. Defaults to “<img class="emoji" src="//telegram.org/img/emoji/40/F09F8EB2.png" width="20" height="20" alt="🎲" />”.</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you <strong>must</strong> call <a href="#sendmessage">sendMessage</a> with the complete message to persist it in the user&#39;s chat. Returns <em>True</em> on success.
   */
  sendMessageDraft(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target private chat</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread</td>
</tr>
<tr>
<td>draft_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated.</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Optional</td>
<td>Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a “Thinking…” placeholder.</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in message text, which can be specified instead of <em>parse_mode</em></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method when you need to tell the user that something is happening on the bot&#39;s side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns <em>True</em> on success.
   *
   * > Example: The <a href="https://t.me/imagebot">ImageBot</a> needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use <a href="#sendchataction">sendChatAction</a> with <em>action</em> = <em>upload_photo</em>. The user will see a “sending photo” status for the bot.
   */
  sendChatAction(args: {
<p>We only recommend using this method when a response from the bot will take a <strong>noticeable</strong> amount of time to arrive.</p>
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the action will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot or supergroup in the format <code>@username</code>. Channel chats and channel direct messages chats aren&#39;t supported.</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>action</td>
<td>String</td>
<td>Yes</td>
<td>Type of action to broadcast. Choose one, depending on what the user is about to receive: <em>typing</em> for <a href="#sendmessage">text messages</a>, <em>upload_photo</em> for <a href="#sendphoto">photos</a>, <em>record_video</em> or <em>upload_video</em> for <a href="#sendvideo">videos</a>, <em>record_voice</em> or <em>upload_voice</em> for <a href="#sendvoice">voice notes</a>, <em>upload_document</em> for <a href="#senddocument">general files</a>, <em>choose_sticker</em> for <a href="#sendsticker">stickers</a>, <em>find_location</em> for <a href="#sendlocation">location data</a>, <em>record_video_note</em> or <em>upload_video_note</em> for <a href="#sendvideonote">video notes</a>.</td>
</tr>
</tbody>
</table>
export interface ApiMethods {
  /**
   * Use this method to change the chosen reactions on a message. Service messages of some types can&#39;t be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can&#39;t use paid reactions. Returns <em>True</em> on success.
   */
  setMessageReaction(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.</td>
</tr>
<tr>
<td>reaction</td>
<td>Array of <a href="#reactiontype">ReactionType</a></td>
<td>Optional</td>
<td>A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can&#39;t be used by bots.</td>
</tr>
<tr>
<td>is_big</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to set the reaction with a big animation</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get a list of profile pictures for a user. Returns a <a href="#userprofilephotos">UserProfilePhotos</a> object.
   */
  getUserProfilePhotos(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>offset</td>
<td>Integer</td>
<td>Optional</td>
<td>Sequential number of the first photo to be returned. By default, all photos are returned.</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Optional</td>
<td>Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get a list of profile audios for a user. Returns a <a href="#userprofileaudios">UserProfileAudios</a> object.
   */
  getUserProfileAudios(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>offset</td>
<td>Integer</td>
<td>Optional</td>
<td>Sequential number of the first audio to be returned. By default, all audios are returned.</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Optional</td>
<td>Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method <a href="/bots/webapps#initializing-mini-apps">requestEmojiStatusAccess</a>. Returns <em>True</em> on success.
   */
  setUserEmojiStatus(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>emoji_status_custom_emoji_id</td>
<td>String</td>
<td>Optional</td>
<td>Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status.</td>
</tr>
<tr>
<td>emoji_status_expiration_date</td>
<td>Integer</td>
<td>Optional</td>
<td>Expiration date of the emoji status, if any</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a <a href="#file">File</a> object is returned. The file can then be downloaded via the link <code>https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;</code>, where <code>&lt;file_path&gt;</code> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling <a href="#getfile">getFile</a> again.
   * 
   * <strong>Note:</strong> This function may not preserve the original file name and MIME type. You should save the file&#39;s MIME type and name (if available) when the File object is received.
   */
  getFile(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>file_id</td>
<td>String</td>
<td>Yes</td>
<td>File identifier to get information about</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless <a href="#unbanchatmember">unbanned</a> first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns <em>True</em> on success.
   */
  banChatMember(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target group or username of the target supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>until_date</td>
<td>Integer</td>
<td>Optional</td>
<td>Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.</td>
</tr>
<tr>
<td>revoke_messages</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to delete all messages from the chat for the user that is being removed. If <em>False</em>, the user will be able to see messages in the group that were sent before the user was removed. Always <em>True</em> for supergroups and channels.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to unban a previously banned user in a supergroup or channel. The user will <strong>not</strong> return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be <strong>removed</strong> from the chat. If you don&#39;t want this, use the parameter <em>only_if_banned</em>. Returns <em>True</em> on success.
   */
  unbanChatMember(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target group or username of the target supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>only_if_banned</td>
<td>Boolean</td>
<td>Optional</td>
<td>Do nothing if the user is not banned</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass <em>True</em> for all permissions to lift restrictions from a user. Returns <em>True</em> on success.
   */
  restrictChatMember(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>permissions</td>
<td><a href="#chatpermissions">ChatPermissions</a></td>
<td>Yes</td>
<td>A JSON-serialized object for new user permissions</td>
</tr>
<tr>
<td>use_independent_chat_permissions</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if chat permissions are set independently. Otherwise, the <em>can_send_other_messages</em> and <em>can_add_web_page_previews</em> permissions will imply the <em>can_send_messages</em>, <em>can_send_audios</em>, <em>can_send_documents</em>, <em>can_send_photos</em>, <em>can_send_videos</em>, <em>can_send_video_notes</em>, and <em>can_send_voice_notes</em> permissions; the <em>can_send_polls</em> permission will imply the <em>can_send_messages</em> permission.</td>
</tr>
<tr>
<td>until_date</td>
<td>Integer</td>
<td>Optional</td>
<td>Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass <em>False</em> for all boolean parameters to demote a user. Returns <em>True</em> on success.
   */
  promoteChatMember(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>is_anonymous</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator&#39;s presence in the chat is hidden</td>
</tr>
<tr>
<td>can_manage_chat</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.</td>
</tr>
<tr>
<td>can_delete_messages</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can delete messages of other users</td>
</tr>
<tr>
<td>can_manage_video_chats</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can manage video chats</td>
</tr>
<tr>
<td>can_restrict_members</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to <em>True</em> for promotions of channel administrators.</td>
</tr>
<tr>
<td>can_promote_members</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)</td>
</tr>
<tr>
<td>can_change_info</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can change chat title, photo and other settings</td>
</tr>
<tr>
<td>can_invite_users</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can invite new users to the chat</td>
</tr>
<tr>
<td>can_post_stories</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can post stories to the chat</td>
</tr>
<tr>
<td>can_edit_stories</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat&#39;s story archive</td>
</tr>
<tr>
<td>can_delete_stories</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can delete stories posted by other users</td>
</tr>
<tr>
<td>can_post_messages</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only</td>
</tr>
<tr>
<td>can_edit_messages</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can edit messages of other users and can pin messages; for channels only</td>
</tr>
<tr>
<td>can_pin_messages</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can pin messages; for supergroups only</td>
</tr>
<tr>
<td>can_manage_topics</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only</td>
</tr>
<tr>
<td>can_manage_direct_messages</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can manage direct messages within the channel and decline suggested posts; for channels only</td>
</tr>
<tr>
<td>can_manage_tags</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the administrator can edit the tags of regular members; for groups and supergroups only</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns <em>True</em> on success.
   */
  setChatAdministratorCustomTitle(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>custom_title</td>
<td>String</td>
<td>Yes</td>
<td>New custom title for the administrator; 0-16 characters, emoji are not allowed</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_tags</em> administrator right. Returns <em>True</em> on success.
   */
  setChatMemberTag(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>tag</td>
<td>String</td>
<td>Optional</td>
<td>New tag for the member; 0-16 characters, emoji are not allowed</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is <a href="#unbanchatsenderchat">unbanned</a>, the owner of the banned chat won&#39;t be able to send messages on behalf of <strong>any of their channels</strong>. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns <em>True</em> on success.
   */
  banChatSenderChat(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>sender_chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target sender chat</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns <em>True</em> on success.
   */
  unbanChatSenderChat(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>sender_chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target sender chat</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the <em>can_restrict_members</em> administrator rights. Returns <em>True</em> on success.
   */
  setChatPermissions(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>permissions</td>
<td><a href="#chatpermissions">ChatPermissions</a></td>
<td>Yes</td>
<td>A JSON-serialized object for new default chat permissions</td>
</tr>
<tr>
<td>use_independent_chat_permissions</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if chat permissions are set independently. Otherwise, the <em>can_send_other_messages</em> and <em>can_add_web_page_previews</em> permissions will imply the <em>can_send_messages</em>, <em>can_send_audios</em>, <em>can_send_documents</em>, <em>can_send_photos</em>, <em>can_send_videos</em>, <em>can_send_video_notes</em>, and <em>can_send_voice_notes</em> permissions; the <em>can_send_polls</em> permission will imply the <em>can_send_messages</em> permission.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as <em>String</em> on success.
   * 
   * > Note: Each administrator in a chat generates their own invite links. Bots can&#39;t use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using <a href="#exportchatinvitelink">exportChatInviteLink</a> or by calling the <a href="#getchat">getChat</a> method. If your bot needs to generate a new primary invite link replacing its previous one, use <a href="#exportchatinvitelink">exportChatInviteLink</a> again.
   */
  exportChatInviteLink(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method <a href="#revokechatinvitelink">revokeChatInviteLink</a>. Returns the new invite link as <a href="#chatinvitelink">ChatInviteLink</a> object.
   */
  createChatInviteLink(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Optional</td>
<td>Invite link name; 0-32 characters</td>
</tr>
<tr>
<td>expire_date</td>
<td>Integer</td>
<td>Optional</td>
<td>Point in time (Unix timestamp) when the link will expire</td>
</tr>
<tr>
<td>member_limit</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999</td>
</tr>
<tr>
<td>creates_join_request</td>
<td>Boolean</td>
<td>Optional</td>
<td><em>True</em>, if users joining the chat via the link need to be approved by chat administrators. If <em>True</em>, <em>member_limit</em> can&#39;t be specified.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a <a href="#chatinvitelink">ChatInviteLink</a> object.
   */
  editChatInviteLink(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>invite_link</td>
<td>String</td>
<td>Yes</td>
<td>The invite link to edit</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Optional</td>
<td>Invite link name; 0-32 characters</td>
</tr>
<tr>
<td>expire_date</td>
<td>Integer</td>
<td>Optional</td>
<td>Point in time (Unix timestamp) when the link will expire</td>
</tr>
<tr>
<td>member_limit</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999</td>
</tr>
<tr>
<td>creates_join_request</td>
<td>Boolean</td>
<td>Optional</td>
<td><em>True</em>, if users joining the chat via the link need to be approved by chat administrators. If <em>True</em>, <em>member_limit</em> can&#39;t be specified.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to create a <a href="https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions">subscription invite link</a> for a channel chat. The bot must have the <em>can_invite_users</em> administrator rights. The link can be edited using the method <a href="#editchatsubscriptioninvitelink">editChatSubscriptionInviteLink</a> or revoked using the method <a href="#revokechatinvitelink">revokeChatInviteLink</a>. Returns the new invite link as a <a href="#chatinvitelink">ChatInviteLink</a> object.
   */
  createChatSubscriptionInviteLink(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target channel chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Optional</td>
<td>Invite link name; 0-32 characters</td>
</tr>
<tr>
<td>subscription_period</td>
<td>Integer</td>
<td>Yes</td>
<td>The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).</td>
</tr>
<tr>
<td>subscription_price</td>
<td>Integer</td>
<td>Yes</td>
<td>The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit a subscription invite link created by the bot. The bot must have the <em>can_invite_users</em> administrator rights. Returns the edited invite link as a <a href="#chatinvitelink">ChatInviteLink</a> object.
   */
  editChatSubscriptionInviteLink(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>invite_link</td>
<td>String</td>
<td>Yes</td>
<td>The invite link to edit</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Optional</td>
<td>Invite link name; 0-32 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as <a href="#chatinvitelink">ChatInviteLink</a> object.
   */
  revokeChatInviteLink(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier of the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>invite_link</td>
<td>String</td>
<td>Yes</td>
<td>The invite link to revoke</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the <em>can_invite_users</em> administrator right. Returns <em>True</em> on success.
   */
  approveChatJoinRequest(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the <em>can_invite_users</em> administrator right. Returns <em>True</em> on success.
   */
  declineChatJoinRequest(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to process a received chat join request query. Returns <em>True</em> on success.
   */
  answerChatJoinRequestQuery(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_join_request_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the join request query</td>
</tr>
<tr>
<td>result</td>
<td>String</td>
<td>Yes</td>
<td>Result of the query. Must be either “approve” to allow the user to join the chat, “decline” to disallow the user to join the chat, or “queue” to leave the decision to other administrators.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call <a href="#answerchatjoinrequestquery">answerChatJoinRequestQuery</a> to resolve the join request query based on the user interaction with the Mini App. Returns <em>True</em> on success.
   */
  sendChatJoinRequestWebApp(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_join_request_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the join request query</td>
</tr>
<tr>
<td>web_app_url</td>
<td>String</td>
<td>Yes</td>
<td>An HTTPS URL of a Web App to be opened with additional data as specified in <a href="/bots/webapps#initializing-mini-apps">Initializing Web Apps</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set a new profile photo for the chat. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns <em>True</em> on success.
   */
  setChatPhoto(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>photo</td>
<td><a href="#inputfile">InputFile</a></td>
<td>Yes</td>
<td>New chat photo, uploaded using multipart/form-data</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete a chat photo. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns <em>True</em> on success.
   */
  deleteChatPhoto(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the title of a chat. Titles can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns <em>True</em> on success.
   */
  setChatTitle(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Yes</td>
<td>New chat title, 1-128 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns <em>True</em> on success.
   */
  setChatDescription(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Optional</td>
<td>New chat description, 0-255 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the &#39;can_pin_messages&#39; right or the &#39;can_edit_messages&#39; right to pin messages in groups and channels respectively. Returns <em>True</em> on success.
   */
  pinChatMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be pinned</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of a message to pin</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the &#39;can_pin_messages&#39; right or the &#39;can_edit_messages&#39; right to unpin messages in groups and channels respectively. Returns <em>True</em> on success.
   */
  unpinChatMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be unpinned</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the message to unpin. Required if <em>business_connection_id</em> is specified. If not specified, the most recent pinned message (by sending date) will be unpinned.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the &#39;can_pin_messages&#39; right or the &#39;can_edit_messages&#39; right to unpin all pinned messages in groups and channels respectively. Returns <em>True</em> on success.
   */
  unpinAllChatMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method for your bot to leave a group, supergroup or channel. Returns <em>True</em> on success.
   */
  leaveChat(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel in the format <code>@username</code>. Channel direct messages chats aren&#39;t supported; leave the corresponding channel instead.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get up-to-date information about the chat. Returns a <a href="#chatfullinfo">ChatFullInfo</a> object on success.
   */
  getChat(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get a list of administrators in a chat. Returns an Array of <a href="#chatmember">ChatMember</a> objects.
   */
  getChatAdministrators(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>return_bots</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the number of members in a chat. Returns <em>Integer</em> on success.
   */
  getChatMemberCount(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a <a href="#chatmember">ChatMember</a> object on success.
   */
  getChatMember(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of <a href="#message">Message</a> objects is returned.
   */
  getUserPersonalChatMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target user</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Yes</td>
<td>The maximum number of messages to return; 1-20</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field <em>can_set_sticker_set</em> optionally returned in <a href="#getchat">getChat</a> requests to check if the bot can use this method. Returns <em>True</em> on success.
   */
  setChatStickerSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>sticker_set_name</td>
<td>String</td>
<td>Yes</td>
<td>Name of the sticker set to be set as the group sticker set</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field <em>can_set_sticker_set</em> optionally returned in <a href="#getchat">getChat</a> requests to check if the bot can use this method. Returns <em>True</em> on success.
   */
  deleteChatStickerSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of <a href="#sticker">Sticker</a> objects.
   */
  getForumTopicIconStickers(args: {}): never;
}
export interface ApiMethods {
  /**
   * Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator right. Returns information about the created topic as a <a href="#forumtopic">ForumTopic</a> object.
   */
  createForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Topic name, 1-128 characters</td>
</tr>
<tr>
<td>icon_color</td>
<td>Integer</td>
<td>Optional</td>
<td>Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F).</td>
</tr>
<tr>
<td>icon_custom_emoji_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the custom emoji shown as the topic icon. Use <a href="#getforumtopiciconstickers">getForumTopicIconStickers</a> to get all allowed custom emoji identifiers.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights, unless it is the creator of the topic. Returns <em>True</em> on success.
   */
  editForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Optional</td>
<td>New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept.</td>
</tr>
<tr>
<td>icon_custom_emoji_id</td>
<td>String</td>
<td>Optional</td>
<td>New unique identifier of the custom emoji shown as the topic icon. Use <a href="#getforumtopiciconstickers">getForumTopicIconStickers</a> to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights, unless it is the creator of the topic. Returns <em>True</em> on success.
   */
  closeForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights, unless it is the creator of the topic. Returns <em>True</em> on success.
   */
  reopenForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the <em>can_delete_messages</em> administrator rights. Returns <em>True</em> on success.
   */
  deleteForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the <em>can_pin_messages</em> administrator right in the supergroup. Returns <em>True</em> on success.
   */
  unpinAllForumTopicMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target message thread of the forum topic</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit the name of the &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights. Returns <em>True</em> on success.
   */
  editGeneralForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>New topic name, 1-128 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to close an open &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights. Returns <em>True</em> on success.
   */
  closeGeneralForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to reopen a closed &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights. The topic will be automatically unhidden if it was hidden. Returns <em>True</em> on success.
   */
  reopenGeneralForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to hide the &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights. The topic will be automatically closed if it was open. Returns <em>True</em> on success.
   */
  hideGeneralForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to unhide the &#39;General&#39; topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the <em>can_manage_topics</em> administrator rights. Returns <em>True</em> on success.
   */
  unhideGeneralForumTopic(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the <em>can_pin_messages</em> administrator right in the supergroup. Returns <em>True</em> on success.
   */
  unpinAllGeneralForumTopicMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to send answers to callback queries sent from <a href="/bots/features#inline-keyboards">inline keyboards</a>. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, <em>True</em> is returned.
   *
   * > Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via <a href="https://t.me/botfather">@BotFather</a> and accept the terms. Otherwise, you may use links like <code>t.me/your_bot?start=XXXX</code> that open your bot with a parameter.
   */
  answerCallbackQuery(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Optional</td>
<td>Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters.</td>
</tr>
<tr>
<td>show_alert</td>
<td>Boolean</td>
<td>Optional</td>
<td>If <em>True</em>, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to <em>False</em>.</td>
</tr>
<tr>
<td>url</td>
<td>String</td>
<td>Optional</td>
<td>URL that will be opened by the user&#39;s client. If you have created a <a href="#game">Game</a> and accepted the conditions via <a href="https://t.me/botfather">@BotFather</a>, specify the URL that opens your game - note that this will only work if the query comes from a <a href="#inlinekeyboardbutton"><em>callback_game</em></a> button.<br><br>Otherwise, you may use links like <code>t.me/your_bot?start=XXXX</code> that open your bot with a parameter.</td>
</tr>
<tr>
<td>cache_time</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to reply to a received guest message. On success, a <a href="#sentguestmessage">SentGuestMessage</a> object is returned.
   */
  answerGuestQuery(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>guest_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>result</td>
<td><a href="#inlinequeryresult">InlineQueryResult</a></td>
<td>Yes</td>
<td>A JSON-serialized object describing the message to be sent</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a <a href="#userchatboosts">UserChatBoosts</a> object.
   */
  getUserChatBoosts(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the chat or username of the channel in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get information about the connection of the bot with a business account. Returns a <a href="#businessconnection">BusinessConnection</a> object on success.
   */
  getBusinessConnection(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the token of a managed bot. Returns the token as <em>String</em> on success.
   */
  getManagedBotToken(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of the managed bot whose token will be returned</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as <em>String</em> on success.
   */
  replaceManagedBotToken(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of the managed bot whose token will be replaced</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the access settings of a managed bot. Returns a <a href="#botaccesssettings">BotAccessSettings</a> object on success.
   */
  getManagedBotAccessSettings(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of the managed bot whose access settings will be returned</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the access settings of a managed bot. Returns <em>True</em> on success.
   */
  setManagedBotAccessSettings(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of the managed bot whose access settings will be changed</td>
</tr>
<tr>
<td>is_access_restricted</td>
<td>Boolean</td>
<td>Yes</td>
<td>Pass <em>True</em> if only selected users can access the bot. The bot&#39;s owner can always access it.</td>
</tr>
<tr>
<td>added_user_ids</td>
<td>Array of Integer</td>
<td>Optional</td>
<td>A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if <em>is_access_restricted</em> is <em>False</em>.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the list of the bot&#39;s commands. See <a href="/bots/features#commands">this manual</a> for more details about bot commands. Returns <em>True</em> on success.
   */
  setMyCommands(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>commands</td>
<td>Array of <a href="#botcommand">BotCommand</a></td>
<td>Yes</td>
<td>A JSON-serialized list of bot commands to be set as the list of the bot&#39;s commands. At most 100 commands can be specified.</td>
</tr>
<tr>
<td>scope</td>
<td><a href="#botcommandscope">BotCommandScope</a></td>
<td>Optional</td>
<td>A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to <a href="#botcommandscopedefault">BotCommandScopeDefault</a>.</td>
</tr>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete the list of the bot&#39;s commands for the given scope and user language. After deletion, <a href="#determining-list-of-commands">higher level commands</a> will be shown to affected users. Returns <em>True</em> on success.
   */
  deleteMyCommands(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>scope</td>
<td><a href="#botcommandscope">BotCommandScope</a></td>
<td>Optional</td>
<td>A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to <a href="#botcommandscopedefault">BotCommandScopeDefault</a>.</td>
</tr>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the current list of the bot&#39;s commands for the given scope and user language. Returns an Array of <a href="#botcommand">BotCommand</a> objects. If commands aren&#39;t set, an empty list is returned.
   */
  getMyCommands(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>scope</td>
<td><a href="#botcommandscope">BotCommandScope</a></td>
<td>Optional</td>
<td>A JSON-serialized object, describing scope of users. Defaults to <a href="#botcommandscopedefault">BotCommandScopeDefault</a>.</td>
</tr>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the bot&#39;s name. Returns <em>True</em> on success.
   */
  setMyName(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>name</td>
<td>String</td>
<td>Optional</td>
<td>New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.</td>
</tr>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the current bot name for the given user language. Returns <a href="#botname">BotName</a> on success.
   */
  getMyName(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the bot&#39;s description, which is shown in the chat with the bot if the chat is empty. Returns <em>True</em> on success.
   */
  setMyDescription(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>description</td>
<td>String</td>
<td>Optional</td>
<td>New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.</td>
</tr>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the current bot description for the given user language. Returns <a href="#botdescription">BotDescription</a> on success.
   */
  getMyDescription(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the bot&#39;s short description, which is shown on the bot&#39;s profile page and is sent together with the link when users share the bot. Returns <em>True</em> on success.
   */
  setMyShortDescription(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>short_description</td>
<td>String</td>
<td>Optional</td>
<td>New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.</td>
</tr>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the current bot short description for the given user language. Returns <a href="#botshortdescription">BotShortDescription</a> on success.
   */
  getMyShortDescription(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>language_code</td>
<td>String</td>
<td>Optional</td>
<td>A two-letter ISO 639-1 language code or an empty string</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Changes the profile photo of the bot. Returns <em>True</em> on success.
   */
  setMyProfilePhoto(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>photo</td>
<td><a href="#inputprofilephoto">InputProfilePhoto</a></td>
<td>Yes</td>
<td>The new profile photo to set</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Removes the profile photo of the bot. Requires no parameters. Returns <em>True</em> on success.
   */
  removeMyProfilePhoto(args: {}): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the bot&#39;s menu button in a private chat, or the default menu button. Returns <em>True</em> on success.
   */
  setChatMenuButton(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target private chat. If not specified, the bot&#39;s default menu button will be changed.</td>
</tr>
<tr>
<td>menu_button</td>
<td><a href="#menubutton">MenuButton</a></td>
<td>Optional</td>
<td>A JSON-serialized object for the bot&#39;s new menu button. Defaults to <a href="#menubuttondefault">MenuButtonDefault</a>.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the current value of the bot&#39;s menu button in a private chat, or the default menu button. Returns <a href="#menubutton">MenuButton</a> on success.
   */
  getChatMenuButton(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target private chat. If not specified, the bot&#39;s default menu button will be returned.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the default administrator rights requested by the bot when it&#39;s added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns <em>True</em> on success.
   */
  setMyDefaultAdministratorRights(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>rights</td>
<td><a href="#chatadministratorrights">ChatAdministratorRights</a></td>
<td>Optional</td>
<td>A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared.</td>
</tr>
<tr>
<td>for_channels</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get the current default administrator rights of the bot. Returns <a href="#chatadministratorrights">ChatAdministratorRights</a> on success.
   */
  getMyDefaultAdministratorRights(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>for_channels</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a <a href="#gifts">Gifts</a> object.
   */
  getAvailableGifts(args: {}): never;
}
export interface ApiMethods {
  /**
   * Sends a gift to the given user or channel chat. The gift can&#39;t be converted to Telegram Stars by the receiver. Returns <em>True</em> on success.
   */
  sendGift(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> is not specified. Unique identifier of the target user who will receive the gift.</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Optional</td>
<td>Required if <em>user_id</em> is not specified. Unique identifier for the chat or username of the channel (in the format <code>@username</code>) that will receive the gift.</td>
</tr>
<tr>
<td>gift_id</td>
<td>String</td>
<td>Yes</td>
<td>Identifier of the gift; limited gifts can&#39;t be sent to channel chats</td>
</tr>
<tr>
<td>pay_for_upgrade</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to pay for the gift upgrade from the bot&#39;s balance, thereby making the upgrade free for the receiver</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Optional</td>
<td>Text that will be shown along with the gift; 0-128 characters</td>
</tr>
<tr>
<td>text_parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the text. See <a href="#formatting-options">formatting options</a> for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.</td>
</tr>
<tr>
<td>text_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of <em>text_parse_mode</em>. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Gifts a Telegram Premium subscription to the given user. Returns <em>True</em> on success.
   */
  giftPremiumSubscription(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user who will receive a Telegram Premium subscription</td>
</tr>
<tr>
<td>month_count</td>
<td>Integer</td>
<td>Yes</td>
<td>Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>Yes</td>
<td>Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Optional</td>
<td>Text that will be shown along with the service message about the subscription; 0-128 characters</td>
</tr>
<tr>
<td>text_parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the text. See <a href="#formatting-options">formatting options</a> for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.</td>
</tr>
<tr>
<td>text_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of <em>text_parse_mode</em>. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Verifies a user <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> which is represented by the bot. Returns <em>True</em> on success.
   */
  verifyUser(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
<tr>
<td>custom_description</td>
<td>String</td>
<td>Optional</td>
<td>Custom description for the verification; 0-70 characters. Must be empty if the organization isn&#39;t allowed to provide a custom verification description.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Verifies a chat <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> which is represented by the bot. Returns <em>True</em> on success.
   */
  verifyChat(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>. Channel direct messages chats can&#39;t be verified.</td>
</tr>
<tr>
<td>custom_description</td>
<td>String</td>
<td>Optional</td>
<td>Custom description for the verification; 0-70 characters. Must be empty if the organization isn&#39;t allowed to provide a custom verification description.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Removes verification from a user who is currently verified <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> represented by the bot. Returns <em>True</em> on success.
   */
  removeUserVerification(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Removes verification from a chat that is currently verified <a href="https://telegram.org/verify#third-party-verification">on behalf of the organization</a> represented by the bot. Returns <em>True</em> on success.
   */
  removeChatVerification(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot or channel in the format <code>@username</code></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Marks incoming message as read on behalf of a business account. Requires the <em>can_read_messages</em> business bot right. Returns <em>True</em> on success.
   */
  readBusinessMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection on behalf of which to read the message</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the message to mark as read</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Delete messages on behalf of a business account. Requires the <em>can_delete_sent_messages</em> business bot right to delete messages sent by the bot itself, or the <em>can_delete_all_messages</em> business bot right to delete any message. Returns <em>True</em> on success.
   */
  deleteBusinessMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection on behalf of which to delete the messages</td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>Yes</td>
<td>A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See <a href="#deletemessage">deleteMessage</a> for limitations on which messages can be deleted.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Changes the first and last name of a managed business account. Requires the <em>can_change_name</em> business bot right. Returns <em>True</em> on success.
   */
  setBusinessAccountName(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>first_name</td>
<td>String</td>
<td>Yes</td>
<td>The new value of the first name for the business account; 1-64 characters</td>
</tr>
<tr>
<td>last_name</td>
<td>String</td>
<td>Optional</td>
<td>The new value of the last name for the business account; 0-64 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Changes the username of a managed business account. Requires the <em>can_change_username</em> business bot right. Returns <em>True</em> on success.
   */
  setBusinessAccountUsername(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>username</td>
<td>String</td>
<td>Optional</td>
<td>The new value of the username for the business account; 0-32 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Changes the bio of a managed business account. Requires the <em>can_change_bio</em> business bot right. Returns <em>True</em> on success.
   */
  setBusinessAccountBio(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>bio</td>
<td>String</td>
<td>Optional</td>
<td>The new value of the bio for the business account; 0-140 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Changes the profile photo of a managed business account. Requires the <em>can_edit_profile_photo</em> business bot right. Returns <em>True</em> on success.
   */
  setBusinessAccountProfilePhoto(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>photo</td>
<td><a href="#inputprofilephoto">InputProfilePhoto</a></td>
<td>Yes</td>
<td>The new profile photo to set</td>
</tr>
<tr>
<td>is_public</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to set the public photo, which will be visible even if the main photo is hidden by the business account&#39;s privacy settings. An account can have only one public photo.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Removes the current profile photo of a managed business account. Requires the <em>can_edit_profile_photo</em> business bot right. Returns <em>True</em> on success.
   */
  removeBusinessAccountProfilePhoto(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>is_public</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to remove the public photo, which is visible even if the main photo is hidden by the business account&#39;s privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the <em>can_change_gift_settings</em> business bot right. Returns <em>True</em> on success.
   */
  setBusinessAccountGiftSettings(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>show_gift_button</td>
<td>Boolean</td>
<td>Yes</td>
<td>Pass <em>True</em> if a button for sending a gift to the user or by the business account must always be shown in the input field</td>
</tr>
<tr>
<td>accepted_gift_types</td>
<td><a href="#acceptedgifttypes">AcceptedGiftTypes</a></td>
<td>Yes</td>
<td>Types of gifts accepted by the business account</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Returns the amount of Telegram Stars owned by a managed business account. Requires the <em>can_view_gifts_and_stars</em> business bot right. Returns <a href="#staramount">StarAmount</a> on success.
   */
  getBusinessAccountStarBalance(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Transfers Telegram Stars from the business account balance to the bot&#39;s balance. Requires the <em>can_transfer_stars</em> business bot right. Returns <em>True</em> on success.
   */
  transferBusinessAccountStars(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>Yes</td>
<td>Number of Telegram Stars to transfer; 1-10000</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Returns the gifts received and owned by a managed business account. Requires the <em>can_view_gifts_and_stars</em> business bot right. Returns <a href="#ownedgifts">OwnedGifts</a> on success.
   */
  getBusinessAccountGifts(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>exclude_unsaved</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that aren&#39;t saved to the account&#39;s profile page</td>
</tr>
<tr>
<td>exclude_saved</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that are saved to the account&#39;s profile page</td>
</tr>
<tr>
<td>exclude_unlimited</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased an unlimited number of times</td>
</tr>
<tr>
<td>exclude_limited_upgradable</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased a limited number of times and can be upgraded to unique</td>
</tr>
<tr>
<td>exclude_limited_non_upgradable</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased a limited number of times and can&#39;t be upgraded to unique</td>
</tr>
<tr>
<td>exclude_unique</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude unique gifts</td>
</tr>
<tr>
<td>exclude_from_blockchain</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that were assigned from the TON blockchain and can&#39;t be resold or transferred in Telegram</td>
</tr>
<tr>
<td>sort_by_price</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to sort results by gift price instead of send date. Sorting is applied before pagination.</td>
</tr>
<tr>
<td>offset</td>
<td>String</td>
<td>Optional</td>
<td>Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum number of gifts to be returned; 1-100. Defaults to 100.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Returns the gifts owned and hosted by a user. Returns <a href="#ownedgifts">OwnedGifts</a> on success.
   */
  getUserGifts(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the user</td>
</tr>
<tr>
<td>exclude_unlimited</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased an unlimited number of times</td>
</tr>
<tr>
<td>exclude_limited_upgradable</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased a limited number of times and can be upgraded to unique</td>
</tr>
<tr>
<td>exclude_limited_non_upgradable</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased a limited number of times and can&#39;t be upgraded to unique</td>
</tr>
<tr>
<td>exclude_from_blockchain</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that were assigned from the TON blockchain and can&#39;t be resold or transferred in Telegram</td>
</tr>
<tr>
<td>exclude_unique</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude unique gifts</td>
</tr>
<tr>
<td>sort_by_price</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to sort results by gift price instead of send date. Sorting is applied before pagination.</td>
</tr>
<tr>
<td>offset</td>
<td>String</td>
<td>Optional</td>
<td>Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum number of gifts to be returned; 1-100. Defaults to 100.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Returns the gifts owned by a chat. Returns <a href="#ownedgifts">OwnedGifts</a> on success.
   */
  getChatGifts(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target channel in the format <code>@username</code></td>
</tr>
<tr>
<td>exclude_unsaved</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that aren&#39;t saved to the chat&#39;s profile page. Always <em>True</em>, unless the bot has the <em>can_post_messages</em> administrator right in the channel.</td>
</tr>
<tr>
<td>exclude_saved</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that are saved to the chat&#39;s profile page. Always <em>False</em>, unless the bot has the <em>can_post_messages</em> administrator right in the channel.</td>
</tr>
<tr>
<td>exclude_unlimited</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased an unlimited number of times</td>
</tr>
<tr>
<td>exclude_limited_upgradable</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased a limited number of times and can be upgraded to unique</td>
</tr>
<tr>
<td>exclude_limited_non_upgradable</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that can be purchased a limited number of times and can&#39;t be upgraded to unique</td>
</tr>
<tr>
<td>exclude_from_blockchain</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude gifts that were assigned from the TON blockchain and can&#39;t be resold or transferred in Telegram</td>
</tr>
<tr>
<td>exclude_unique</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to exclude unique gifts</td>
</tr>
<tr>
<td>sort_by_price</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to sort results by gift price instead of send date. Sorting is applied before pagination.</td>
</tr>
<tr>
<td>offset</td>
<td>String</td>
<td>Optional</td>
<td>Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum number of gifts to be returned; 1-100. Defaults to 100.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Converts a given regular gift to Telegram Stars. Requires the <em>can_convert_gifts_to_stars</em> business bot right. Returns <em>True</em> on success.
   */
  convertGiftToStars(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>owned_gift_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the regular gift that should be converted to Telegram Stars</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Upgrades a given regular gift to a unique gift. Requires the <em>can_transfer_and_upgrade_gifts</em> business bot right. Additionally requires the <em>can_transfer_stars</em> business bot right if the upgrade is paid. Returns <em>True</em> on success.
   */
  upgradeGift(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>owned_gift_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the regular gift that should be upgraded to a unique one</td>
</tr>
<tr>
<td>keep_original_details</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to keep the original gift text, sender and receiver in the upgraded gift</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>Optional</td>
<td>The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If <code>gift.prepaid_upgrade_star_count &gt; 0</code>, then pass 0, otherwise, the <em>can_transfer_stars</em> business bot right is required and <code>gift.upgrade_star_count</code> must be passed.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Transfers an owned unique gift to another user. Requires the <em>can_transfer_and_upgrade_gifts</em> business bot right. Requires <em>can_transfer_stars</em> business bot right if the transfer is paid. Returns <em>True</em> on success.
   */
  transferGift(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>owned_gift_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the regular gift that should be transferred</td>
</tr>
<tr>
<td>new_owner_chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.</td>
</tr>
<tr>
<td>star_count</td>
<td>Integer</td>
<td>Optional</td>
<td>The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the <em>can_transfer_stars</em> business bot right is required.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Posts a story on behalf of a managed business account. Requires the <em>can_manage_stories</em> business bot right. Returns <a href="#story">Story</a> on success.
   */
  postStory(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>content</td>
<td><a href="#inputstorycontent">InputStoryContent</a></td>
<td>Yes</td>
<td>Content of the story</td>
</tr>
<tr>
<td>active_period</td>
<td>Integer</td>
<td>Yes</td>
<td>Period after which the story is moved to the archive, in seconds; must be one of <code>6 * 3600</code>, <code>12 * 3600</code>, <code>86400</code>, or <code>2 * 86400</code></td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Caption of the story, 0-2048 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the story caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>areas</td>
<td>Array of <a href="#storyarea">StoryArea</a></td>
<td>Optional</td>
<td>A JSON-serialized list of clickable areas to be shown on the story</td>
</tr>
<tr>
<td>post_to_chat_page</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to keep the story accessible after it expires</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the content of the story must be protected from forwarding and screenshotting</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the <em>can_manage_stories</em> business bot right for both business accounts. Returns <a href="#story">Story</a> on success.
   */
  repostStory(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>from_chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the chat which posted the story that should be reposted</td>
</tr>
<tr>
<td>from_story_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the story that should be reposted</td>
</tr>
<tr>
<td>active_period</td>
<td>Integer</td>
<td>Yes</td>
<td>Period after which the story is moved to the archive, in seconds; must be one of <code>6 * 3600</code>, <code>12 * 3600</code>, <code>86400</code>, or <code>2 * 86400</code></td>
</tr>
<tr>
<td>post_to_chat_page</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to keep the story accessible after it expires</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the content of the story must be protected from forwarding and screenshotting</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Edits a story previously posted by the bot on behalf of a managed business account. Requires the <em>can_manage_stories</em> business bot right. Returns <a href="#story">Story</a> on success.
   */
  editStory(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>story_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the story to edit</td>
</tr>
<tr>
<td>content</td>
<td><a href="#inputstorycontent">InputStoryContent</a></td>
<td>Yes</td>
<td>Content of the story</td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>Caption of the story, 0-2048 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the story caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>areas</td>
<td>Array of <a href="#storyarea">StoryArea</a></td>
<td>Optional</td>
<td>A JSON-serialized list of clickable areas to be shown on the story</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the <em>can_manage_stories</em> business bot right. Returns <em>True</em> on success.
   */
  deleteStory(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection</td>
</tr>
<tr>
<td>story_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the story to delete</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set the result of an interaction with a <a href="/bots/webapps">Web App</a> and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a <a href="#sentwebappmessage">SentWebAppMessage</a> object is returned.
   */
  answerWebAppQuery(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>web_app_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>result</td>
<td><a href="#inlinequeryresult">InlineQueryResult</a></td>
<td>Yes</td>
<td>A JSON-serialized object describing the message to be sent</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Stores a message that can be sent by a user of a Mini App. Returns a <a href="#preparedinlinemessage">PreparedInlineMessage</a> object.
   */
  savePreparedInlineMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user that can use the prepared message</td>
</tr>
<tr>
<td>result</td>
<td><a href="#inlinequeryresult">InlineQueryResult</a></td>
<td>Yes</td>
<td>A JSON-serialized object describing the message to be sent</td>
</tr>
<tr>
<td>allow_user_chats</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the message can be sent to private chats with users</td>
</tr>
<tr>
<td>allow_bot_chats</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the message can be sent to private chats with bots</td>
</tr>
<tr>
<td>allow_group_chats</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the message can be sent to group and supergroup chats</td>
</tr>
<tr>
<td>allow_channel_chats</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the message can be sent to channel chats</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Stores a keyboard button that can be used by a user within a Mini App. Returns a <a href="#preparedkeyboardbutton">PreparedKeyboardButton</a> object.
   */
  savePreparedKeyboardButton(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the target user that can use the button</td>
</tr>
<tr>
<td>button</td>
<td><a href="#keyboardbutton">KeyboardButton</a></td>
<td>Yes</td>
<td>A JSON-serialized object describing the button to be saved. The button must be of the type <em>request_users</em>, <em>request_chat</em>, or <em>request_managed_bot</em>.</td>
</tr>
</tbody>
</table>
  }): never;
}
<h4><a class="anchor" name="inline-mode-methods" href="#inline-mode-methods"><i class="anchor-icon"></i></a>Inline mode methods</h4>
<p>Methods and objects used in the inline mode are described in the <a href="#inline-mode">Inline mode section</a>.</p>
// === UPDATING MESSAGES
<p>The following methods allow you to change an existing message in the message history instead of sending a new one with a result of an action. This is most useful for messages with <a href="/bots/features#inline-keyboards">inline keyboards</a> using callback queries, but can also help reduce clutter in conversations with regular chat bots.</p>
<p>Please note, that it is currently only possible to edit messages without <em>reply_markup</em> or with <a href="/bots/features#inline-keyboards">inline keyboards</a>.</p>
export interface ApiMethods {
  /**
   * Use this method to edit text, rich and <a href="#games">game</a> messages. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise <em>True</em> is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within <strong>48 hours</strong> from the time they were sent.
   */
  editMessageText(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the message to edit.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Optional</td>
<td>New text of the message, 1-4096 characters after entity parsing; required if <em>rich_message</em> isn&#39;t specified</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in message text, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>link_preview_options</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Optional</td>
<td>Link preview generation options for the message</td>
</tr>
<tr>
<td>rich_message</td>
<td><a href="#inputrichmessage">InputRichMessage</a></td>
<td>Optional</td>
<td>New rich content of the message; required if <em>text</em> isn&#39;t specified. Direct upload of new files isn&#39;t supported when an inline message is edited.</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise <em>True</em> is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within <strong>48 hours</strong> from the time they were sent.
   */
  editMessageCaption(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the message to edit.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>New caption of the message, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the message caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>show_caption_above_media</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the caption must be shown above the message media. Supported only for animation, photo and video messages.</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can&#39;t be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise <em>True</em> is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within <strong>48 hours</strong> from the time they were sent.
   */
  editMessageMedia(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the message to edit.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
<tr>
<td>media</td>
<td><a href="#inputmedia">InputMedia</a></td>
<td>Yes</td>
<td>A JSON-serialized object for the new media content of the message</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for a new <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit live location messages. A location can be edited until its <em>live_period</em> expires or editing is explicitly disabled by a call to <a href="#stopmessagelivelocation">stopMessageLiveLocation</a>. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise <em>True</em> is returned.
   */
  editMessageLiveLocation(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the message to edit.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
<tr>
<td>latitude</td>
<td>Float</td>
<td>Yes</td>
<td>Latitude of new location</td>
</tr>
<tr>
<td>longitude</td>
<td>Float</td>
<td>Yes</td>
<td>Longitude of new location</td>
</tr>
<tr>
<td>live_period</td>
<td>Integer</td>
<td>Optional</td>
<td>New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current <em>live_period</em> by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then <em>live_period</em> remains unchanged.</td>
</tr>
<tr>
<td>horizontal_accuracy</td>
<td>Float</td>
<td>Optional</td>
<td>The radius of uncertainty for the location, measured in meters; 0-1500</td>
</tr>
<tr>
<td>heading</td>
<td>Integer</td>
<td>Optional</td>
<td>Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.</td>
</tr>
<tr>
<td>proximity_alert_radius</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for a new <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to stop updating a live location message before <em>live_period</em> expires. On success, if the message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise <em>True</em> is returned.
   */
  stopMessageLiveLocation(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the message with live location to stop.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for a new <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit a checklist on behalf of a connected business account. On success, the edited <a href="#message">Message</a> is returned.
   */
  editMessageChecklist(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot in the format <code>@username</code></td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target message</td>
</tr>
<tr>
<td>checklist</td>
<td><a href="#inputchecklist">InputChecklist</a></td>
<td>Yes</td>
<td>A JSON-serialized object for the new checklist</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for the new <a href="/bots/features#inline-keyboards">inline keyboard</a> for the message</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited <a href="#message">Message</a> is returned, otherwise <em>True</em> is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within <strong>48 hours</strong> from the time they were sent.
   */
  editMessageReplyMarkup(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code>.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the message to edit.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to stop a poll which was sent by the bot. On success, the stopped <a href="#poll">Poll</a> is returned.
   */
  stopPoll(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message to be edited was sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the original message with the poll</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for a new message <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit an ephemeral text message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, <em>True</em> is returned.
   */
  editEphemeralMessageText(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the user who received the message</td>
</tr>
<tr>
<td>ephemeral_message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the ephemeral message to edit</td>
</tr>
<tr>
<td>text</td>
<td>String</td>
<td>Yes</td>
<td>New text of the message, 1-4096 characters after entity parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in message text, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>link_preview_options</td>
<td><a href="#linkpreviewoptions">LinkPreviewOptions</a></td>
<td>Optional</td>
<td>Link preview generation options for the message</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, <em>True</em> is returned.
   */
  editEphemeralMessageMedia(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the user who received the message</td>
</tr>
<tr>
<td>ephemeral_message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the ephemeral message to edit</td>
</tr>
<tr>
<td>media</td>
<td><a href="#inputmedia">InputMedia</a></td>
<td>Yes</td>
<td>A JSON-serialized object for the new media content of the message. A new file can&#39;t be uploaded; use a previously uploaded file via its file_id or specify a URL.</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, <em>True</em> is returned.
   */
  editEphemeralMessageCaption(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the user who received the message</td>
</tr>
<tr>
<td>ephemeral_message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the ephemeral message to edit</td>
</tr>
<tr>
<td>caption</td>
<td>String</td>
<td>Optional</td>
<td>New caption of the message, 0-1024 characters after entities parsing</td>
</tr>
<tr>
<td>parse_mode</td>
<td>String</td>
<td>Optional</td>
<td>Mode for parsing entities in the message caption. See <a href="#formatting-options">formatting options</a> for more details.</td>
</tr>
<tr>
<td>caption_entities</td>
<td>Array of <a href="#messageentity">MessageEntity</a></td>
<td>Optional</td>
<td>A JSON-serialized list of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em></td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, <em>True</em> is returned.
   */
  editEphemeralMessageReplyMarkup(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the user who received the message</td>
</tr>
<tr>
<td>ephemeral_message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the ephemeral message to edit</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a></td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to approve a suggested post in a direct messages chat. The bot must have the &#39;can_post_messages&#39; administrator right in the corresponding channel chat. Returns <em>True</em> on success.
   */
  approveSuggestedPost(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target direct messages chat</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of a suggested post message to approve</td>
</tr>
<tr>
<td>send_date</td>
<td>Integer</td>
<td>Optional</td>
<td>Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to decline a suggested post in a direct messages chat. The bot must have the &#39;can_manage_direct_messages&#39; administrator right in the corresponding channel chat. Returns <em>True</em> on success.
   */
  declineSuggestedPost(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target direct messages chat</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of a suggested post message to decline</td>
</tr>
<tr>
<td>comment</td>
<td>String</td>
<td>Optional</td>
<td>Comment for the creator of the suggested post; 0-128 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete a message, including service messages, with the following limitations:<br>- A message can only be deleted if it was sent less than 48 hours ago.<br>- Service messages about a supergroup, channel, or forum topic creation can&#39;t be deleted.<br>- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.<br>- Bots can delete outgoing messages in private chats, groups, and supergroups.<br>- Bots can delete incoming messages in private chats.<br>- Bots granted <em>can_post_messages</em> permissions can delete outgoing messages in channels.<br>- If the bot is an administrator of a group, it can delete any message there.<br>- If the bot has <em>can_delete_messages</em> administrator right in a supergroup or a channel, it can delete any message there.<br>- If the bot has <em>can_manage_direct_messages</em> administrator right in a channel, it can delete any message in the corresponding direct messages chat.<br>Returns <em>True</em> on success.
   */
  deleteMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the message to delete</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete multiple messages simultaneously. If some of the specified messages can&#39;t be found, they are skipped. Returns <em>True</em> on success.
   */
  deleteMessages(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_ids</td>
<td>Array of Integer</td>
<td>Yes</td>
<td>A JSON-serialized list of 1-100 identifiers of messages to delete. See <a href="#deletemessage">deleteMessage</a> for limitations on which messages can be deleted.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns <em>True</em> on success.
   */
  deleteEphemeralMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the user who received the message</td>
</tr>
<tr>
<td>ephemeral_message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the ephemeral message to delete</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the &#39;can_delete_messages&#39; administrator right in the chat. Returns <em>True</em> on success.
   */
  deleteMessageReaction(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the target message</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the user whose reaction will be removed, if the reaction was added by a user</td>
</tr>
<tr>
<td>actor_chat_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the chat whose reaction will be removed, if the reaction was added by a chat</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the &#39;can_delete_messages&#39; administrator right in the chat. Returns <em>True</em> on success.
   */
  deleteAllMessageReactions(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target supergroup in the format <code>@username</code></td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the user whose reactions will be removed, if the reactions were added by a user</td>
</tr>
<tr>
<td>actor_chat_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the chat whose reactions will be removed, if the reactions were added by a chat</td>
</tr>
</tbody>
</table>
  }): never;
}
// === STICKERS
<p>The following methods and objects allow your bot to handle stickers and sticker sets.</p>
/**
 * This object represents a sticker.
 */
export interface Sticker {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * Type of the sticker, currently one of “regular”, “mask”, “custom_emoji”. The type of the sticker is independent from its format, which is determined by the fields <em>is_animated</em> and <em>is_video</em>.
   */
  type: string;
  /**
   * Sticker width
   */
  width: number;
  /**
   * Sticker height
   */
  height: number;
  /**
   * <em>True</em>, if the sticker is <a href="https://telegram.org/blog/animated-stickers">animated</a>
   */
  is_animated: boolean;
  /**
   * <em>True</em>, if the sticker is a <a href="https://telegram.org/blog/video-stickers-better-reactions">video sticker</a>
   */
  is_video: boolean;
  /**
   * Sticker thumbnail in the .WEBP or .JPG format
   */
  thumbnail?: PhotoSize;
  /**
   * Emoji associated with the sticker
   */
  emoji?: string;
  /**
   * Name of the sticker set to which the sticker belongs
   */
  set_name?: string;
  /**
   * For premium regular stickers, premium animation for the sticker
   */
  premium_animation?: File;
  /**
   * For mask stickers, the position where the mask should be placed
   */
  mask_position?: MaskPosition;
  /**
   * For custom emoji stickers, unique identifier of the custom emoji
   */
  custom_emoji_id?: string;
  /**
   * <em>True</em>, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places
   */
  needs_repainting?: true;
  /**
   * File size in bytes
   */
  file_size?: number;
</tbody>
</table>
}
/**
 * This object represents a sticker set.
 */
export interface StickerSet {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Sticker set name
   */
  name: string;
  /**
   * Sticker set title
   */
  title: string;
  /**
   * Type of stickers in the set, currently one of “regular”, “mask”, “custom_emoji”
   */
  sticker_type: string;
<tr>
<td>stickers</td>
<td>Array of <a href="#sticker">Sticker</a></td>
<td>List of all set stickers</td>
</tr>
  /**
   * Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format
   */
  thumbnail?: PhotoSize;
</tbody>
</table>
}
/**
 * This object describes the position on faces where a mask should be placed by default.
 */
export interface MaskPosition {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”.
   */
  point: string;
  /**
   * Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position.
   */
  x_shift: number;
  /**
   * Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position.
   */
  y_shift: number;
  /**
   * Mask scaling coefficient. For example, 2.0 means double size.
   */
  scale: number;
</tbody>
</table>
}
/**
 * This object describes a sticker to be added to a sticker set.
 */
export interface InputSticker {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The added sticker. Pass a <em>file_id</em> as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new file using multipart/form-data under &lt;file_attach_name&gt; name. Animated and video stickers can&#39;t be uploaded via HTTP URL. <a href="#sending-files">More information on Sending Files »</a>
   */
  sticker: string;
  /**
   * Format of the added sticker, must be one of “static” for a <strong>.WEBP</strong> or <strong>.PNG</strong> image, “animated” for a <strong>.TGS</strong> animation, “video” for a <strong>.WEBM</strong> video
   */
  format: string;
  /**
   * List of 1-20 emoji associated with the sticker
   */
  emoji_list: string[];
  /**
   * Position where the mask should be placed on faces. For “mask” stickers only.
   */
  mask_position?: MaskPosition;
  /**
   * List of 0-20 search keywords for the sticker with total length of up to 64 characters. For “regular” and “custom_emoji” stickers only.
   */
  keywords?: string[];
</tbody>
</table>
}
export interface ApiMethods {
  /**
   * Use this method to send static .WEBP, <a href="https://telegram.org/blog/animated-stickers">animated</a> .TGS, or <a href="https://telegram.org/blog/video-stickers-better-reactions">video</a> .WEBM stickers. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendSticker(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>receiver_user_id</td>
<td>Integer</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, unique identifier of the user who will receive the message; for group and supergroup chats only. It is not guaranteed that the user will receive the message, especially if they are offline. See <a href="#ephemeral-messages-and-commands">ephemeral message sending</a> for more details.</td>
</tr>
<tr>
<td>callback_query_id</td>
<td>String</td>
<td>Optional</td>
<td>For outgoing ephemeral messages, identifier of the callback query which triggered the message if any</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Yes</td>
<td>Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Video and animated stickers can&#39;t be sent via an HTTP URL.</td>
</tr>
<tr>
<td>emoji</td>
<td>String</td>
<td>Optional</td>
<td>Emoji associated with the sticker; only for just uploaded stickers</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get a sticker set. On success, a <a href="#stickerset">StickerSet</a> object is returned.
   */
  getStickerSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Name of the sticker set</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of <a href="#sticker">Sticker</a> objects.
   */
  getCustomEmojiStickers(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>custom_emoji_ids</td>
<td>Array of String</td>
<td>Yes</td>
<td>A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to upload a file with a sticker for later use in the <a href="#createnewstickerset">createNewStickerSet</a>, <a href="#addstickertoset">addStickerToSet</a>, or <a href="#replacestickerinset">replaceStickerInSet</a> methods (the file can be used multiple times). Returns the uploaded <a href="#file">File</a> on success.
   */
  uploadStickerFile(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of sticker file owner</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputfile">InputFile</a></td>
<td>Yes</td>
<td>A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See <a href="/stickers"><a href="https://core.telegram.org/stickers">https://core.telegram.org/stickers</a></a> for technical requirements. <a href="#sending-files">More information on Sending Files »</a></td>
</tr>
<tr>
<td>sticker_format</td>
<td>String</td>
<td>Yes</td>
<td>Format of the sticker, must be one of “static”, “animated”, “video”</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns <em>True</em> on success.
   */
  createNewStickerSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of created sticker set owner</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Short name of sticker set, to be used in <code>t.me/addstickers/</code> URLs (e.g., <em>animals</em>). Can contain only English letters, digits and underscores. Must begin with a letter, can&#39;t contain consecutive underscores and must end in <code>&quot;_by_&lt;bot_username&gt;&quot;</code>. <code>&lt;bot_username&gt;</code> is case insensitive. 1-64 characters.</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set title, 1-64 characters</td>
</tr>
<tr>
<td>stickers</td>
<td>Array of <a href="#inputsticker">InputSticker</a></td>
<td>Yes</td>
<td>A JSON-serialized list of 1-50 initial stickers to be added to the sticker set</td>
</tr>
<tr>
<td>sticker_type</td>
<td>String</td>
<td>Optional</td>
<td>Type of stickers in the set, pass “regular”, “mask”, or “custom_emoji”. By default, a regular sticker set is created.</td>
</tr>
<tr>
<td>needs_repainting</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns <em>True</em> on success.
   */
  addStickerToSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of sticker set owner</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputsticker">InputSticker</a></td>
<td>Yes</td>
<td>A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn&#39;t changed.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to move a sticker in a set created by the bot to a specific position. Returns <em>True</em> on success.
   */
  setStickerPositionInSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>sticker</td>
<td>String</td>
<td>Yes</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>position</td>
<td>Integer</td>
<td>Yes</td>
<td>New sticker position in the set, zero-based</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete a sticker from a set created by the bot. Returns <em>True</em> on success.
   */
  deleteStickerFromSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>sticker</td>
<td>String</td>
<td>Yes</td>
<td>File identifier of the sticker</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling <a href="#deletestickerfromset">deleteStickerFromSet</a>, then <a href="#addstickertoset">addStickerToSet</a>, then <a href="#setstickerpositioninset">setStickerPositionInSet</a>. Returns <em>True</em> on success.
   */
  replaceStickerInSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of the sticker set owner</td>
</tr>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>old_sticker</td>
<td>String</td>
<td>Yes</td>
<td>File identifier of the replaced sticker</td>
</tr>
<tr>
<td>sticker</td>
<td><a href="#inputsticker">InputSticker</a></td>
<td>Yes</td>
<td>A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns <em>True</em> on success.
   */
  setStickerEmojiList(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>sticker</td>
<td>String</td>
<td>Yes</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>emoji_list</td>
<td>Array of String</td>
<td>Yes</td>
<td>A JSON-serialized list of 1-20 emoji associated with the sticker</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns <em>True</em> on success.
   */
  setStickerKeywords(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>sticker</td>
<td>String</td>
<td>Yes</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>keywords</td>
<td>Array of String</td>
<td>Optional</td>
<td>A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to change the <a href="#maskposition">mask position</a> of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns <em>True</em> on success.
   */
  setStickerMaskPosition(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>sticker</td>
<td>String</td>
<td>Yes</td>
<td>File identifier of the sticker</td>
</tr>
<tr>
<td>mask_position</td>
<td><a href="#maskposition">MaskPosition</a></td>
<td>Optional</td>
<td>A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set the title of a created sticker set. Returns <em>True</em> on success.
   */
  setStickerSetTitle(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set title, 1-64 characters</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns <em>True</em> on success.
   */
  setStickerSetThumbnail(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier of the sticker set owner</td>
</tr>
<tr>
<td>thumbnail</td>
<td><a href="#inputfile">InputFile</a> or String</td>
<td>Optional</td>
<td>A <strong>.WEBP</strong> or <strong>.PNG</strong> image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a <strong>.TGS</strong> animation with a thumbnail up to 32 kilobytes in size (see <a href="/stickers#animation-requirements"><a href="https://core.telegram.org/stickers#animation-requirements">https://core.telegram.org/stickers#animation-requirements</a></a> for animated sticker technical requirements), or a <strong>.WEBM</strong> video with the thumbnail up to 32 kilobytes in size; see <a href="/stickers#video-requirements"><a href="https://core.telegram.org/stickers#video-requirements">https://core.telegram.org/stickers#video-requirements</a></a> for video sticker technical requirements. Pass a <em>file_id</em> as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. <a href="#sending-files">More information on Sending Files »</a>. Animated and video sticker set thumbnails can&#39;t be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail.</td>
</tr>
<tr>
<td>format</td>
<td>String</td>
<td>Yes</td>
<td>Format of the thumbnail, must be one of “static” for a <strong>.WEBP</strong> or <strong>.PNG</strong> image, “animated” for a <strong>.TGS</strong> animation, or “video” for a <strong>.WEBM</strong> video</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to set the thumbnail of a custom emoji sticker set. Returns <em>True</em> on success.
   */
  setCustomEmojiStickerSetThumbnail(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set name</td>
</tr>
<tr>
<td>custom_emoji_id</td>
<td>String</td>
<td>Optional</td>
<td>Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to delete a sticker set that was created by the bot. Returns <em>True</em> on success.
   */
  deleteStickerSet(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>name</td>
<td>String</td>
<td>Yes</td>
<td>Sticker set name</td>
</tr>
</tbody>
</table>
  }): never;
}
// === RICH MESSAGES
<p>The following methods and objects allow your bot to handle and send rich messages.</p>
<h4><a class="anchor" name="rich-message-formatting-options" href="#rich-message-formatting-options"><i class="anchor-icon"></i></a>Rich Message Formatting Options</h4>
<p><a href="#inputrichmessage">Rich messages</a> support advanced structured formatting options like headings, lists, tables, media, block quotations, collapsible blocks, footnotes, and formulas. Telegram clients will render them accordingly. You can specify rich message content using <a href="#rich-markdown-style">Markdown-style</a> or <a href="#rich-html-style">HTML-style</a> formatting, or explicit <a href="#inputrichblock">blocks</a>.</p>
<p>Plain URLs, e-mail addresses, username mentions, hashtags, cashtags, bot commands, phone numbers, and bank card numbers are detected automatically. To disable automatic entity detection, pass <em>True</em> in the <em>skip_entity_detection</em> field. Note that Telegram clients will display an alert to the user before opening an inline link (&#39;Open this link?&#39; together with the full URL).</p>
<p>When <a href="#rich-markdown-style">Markdown-style</a> or <a href="#rich-html-style">HTML-style</a> formatting is used, you can use links in the form <code>tg://photo?id=...</code>, <code>tg://video?id=...</code>, and <code>tg://audio?id=...</code> instead of an HTTP URL to reuse previously uploaded files or upload a new file.</p>
<h6><a class="anchor" name="rich-message-limits" href="#rich-message-limits"><i class="anchor-icon"></i></a>Rich Message Limits</h6>
<p>Rich messages are subject to the following limits:</p>
<ul>
<li>Up to <strong>32768 UTF-8 characters</strong> in the rich message text, including custom emoji alternative text and formula source.</li>
<li>Up to <strong>500 blocks</strong>, including nested blocks, list items, ordered list items, table rows, quotation blocks, and details blocks.</li>
<li>Up to <strong>16 levels</strong> of nested formatting and blocks.</li>
<li>Up to <strong>50 media attachments</strong> in total, including photos, videos, and audio files.</li>
<li>Up to <strong>20 columns</strong> in a table.</li>
</ul>
<h6><a class="anchor" name="rich-markdown-style" href="#rich-markdown-style"><i class="anchor-icon"></i></a>Rich Markdown style</h6>
<p>To use this mode, pass rich message content in the <em>markdown</em> field. Use the following syntax in your message:</p>
<pre><code>**bold text**
__bold text__
*italic text*
_italic text_
~~strikethrough text~~
`inline fixed-width code`
==marked text==
||spoiler||

[inline URL](https://t.me/)
[inline e-mail](mailto:user@example.com)
[inline phone number](tel:+123456789)
[inline mention of a user](tg://user?id=123456789)
![<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />](tg://emoji?id=5368324170671202286)
![22:45 tomorrow](tg://time?unix=1647531900&amp;format=wDT)
$x^2 + y^2$
\#hashtag $USD +12345678901, card: 4242 4242 4242 4242, https://t.me t.me a@t.me /command @username
all the text above was on the same line

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

Paragraph text

```python
  print(&#39;pre-formatted fixed-width code block written in the Python programming language&#39;)
```

---

- unordered list item
* unordered list item
+ unordered list item

1. ordered list item
2. ordered list item

- [ ] task list item
- [x] completed task list item

&gt;Block quotation started
&gt;
&gt;Block quotation continued on the next line
&gt;Block quotation continued on the same line
&gt;
&gt;The last line of the block quotation

![](https://telegram.org/example/photo.jpg)
![](https://telegram.org/example/video.mp4)
![](https://telegram.org/example/audio.mp3)
![](https://telegram.org/example/audio.ogg)
![](https://telegram.org/example/animation.gif)

![](https://telegram.org/example/photo.jpg &quot;Photo caption&quot;)
![](https://telegram.org/example/video.mp4 &quot;Video caption&quot;)
![](https://telegram.org/example/audio.mp3 &quot;Audio caption&quot;)
![](https://telegram.org/example/audio.ogg &quot;Voice note caption&quot;)
![](https://telegram.org/example/animation.gif &quot;Animation caption&quot;)

| Header 1 | Header 2 |
|:---------|:--------:|
| left     | center   |

Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.

$$E = mc^2$$

```math
E = mc^2
```

## Example Nested Syntax Report for _Q1_
Intro with &lt;u&gt;underlined text&lt;/u&gt;, ==marked text==, and $x^2 + y^2$.
**Bold _italic &lt;u&gt;underlined italic bold&lt;/u&gt; italic_ bold**
&lt;u&gt;In inline tags, nested **markdown** is parsed&lt;/u&gt;
&gt;Quote with **bold text, ~~strikethrough, and &lt;tg-spoiler&gt;spoiler&lt;/tg-spoiler&gt;~~**, plus [a link](https://t.me/).

- List item with `code`, &lt;sup&gt;superscript&lt;/sup&gt;, &lt;sub&gt;subscript&lt;/sub&gt;, and a footnote[^note]
- Another item with **bold &lt;tg-spoiler&gt;&lt;code&gt;spoiler code&lt;/code&gt;&lt;/tg-spoiler&gt;**
- Another item with ~~strikethrough and &lt;ins&gt;inserted text&lt;/ins&gt;~~

| Metric | Value |
|:-------|------:|
| Speed  | **42** &lt;sup&gt;ms&lt;/sup&gt; |
| Status | &lt;tg-spoiler&gt;ready&lt;/tg-spoiler&gt; |

[^note]: Footnote with _italic text_ and &lt;u&gt;HTML underline&lt;/u&gt;.

---

# Details blocks can contain Markdown content:

&lt;details open&gt;&lt;summary&gt;Summary with **bold text**&lt;/summary&gt;

### Details heading
- List item with _italic text_
- List item with &lt;tg-spoiler&gt;spoiler&lt;/tg-spoiler&gt;

&lt;/details&gt;

# Collages and slideshows can contain Markdown media blocks:

&lt;tg-collage&gt;

![](https://telegram.org/example/photo.jpg)
![](https://telegram.org/example/video.mp4)

&lt;/tg-collage&gt;

&lt;tg-slideshow&gt;

![](https://telegram.org/example/photo.jpg)
![](https://telegram.org/example/video.mp4)

&lt;/tg-slideshow&gt;</code></pre>
<p>For formatting features that don&#39;t have Markdown syntax, use <a href="#rich-html-style">HTML tags</a>:</p>
<pre><code>&lt;u&gt;underlined text&lt;/u&gt;, &lt;ins&gt;underlined text&lt;/ins&gt;
&lt;sub&gt;subscript text&lt;/sub&gt;
&lt;sup&gt;superscript text&lt;/sup&gt;
&lt;a name=&quot;chapter-1&quot;&gt;&lt;/a&gt;
&lt;aside&gt;Pull quote&lt;cite&gt;The Author&lt;/cite&gt;&lt;/aside&gt;
&lt;details open&gt;&lt;summary&gt;Title&lt;/summary&gt;Content&lt;/details&gt;
&lt;tg-map lat=&quot;41.9&quot; long=&quot;12.5&quot; zoom=&quot;14&quot;/&gt;
&lt;tg-collage&gt;&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot;/&gt;&lt;figcaption&gt;Caption&lt;cite&gt;The Author&lt;/cite&gt;&lt;/figcaption&gt;&lt;/tg-collage&gt;
&lt;tg-slideshow&gt;&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot;/&gt;&lt;video src=&quot;https://telegram.org/example/video.mp4&quot;/&gt;&lt;figcaption&gt;Slideshow caption&lt;cite&gt;The Author&lt;/cite&gt;&lt;/figcaption&gt;&lt;/tg-slideshow&gt;</code></pre>
<p>Additionally, you can use the following tag in <a href="#sendrichmessagedraft">sendRichMessageDraft</a>:</p>
<pre><code>&lt;tg-thinking&gt;Thinking...&lt;/tg-thinking&gt;</code></pre>
<p>Please note:</p>
<ul>
<li>Rich Markdown is compatible with GitHub Flavored Markdown where possible and can contain arbitrary HTML. Supported rich message HTML tags are parsed as described in <a href="#rich-html-style">Rich HTML style</a>.</li>
<li>Media can be specified only as a separate block.</li>
<li>Media blocks support only HTTP and HTTPS URLs.</li>
<li>Media type is determined by the MIME type and the URL of the media.</li>
<li>In media syntax, the optional title after the URL is used as the caption; for example, <img class="icon" src="url" alt="" title="Photo caption"> displays “Photo caption” under the media.</li>
<li>Table cells can contain only inline formatting.</li>
<li>Formula source is treated as raw LaTeX.</li>
<li>Markdown isn&#39;t parsed inside block HTML tags other than &lt;details&gt;, &lt;tg-collage&gt; and &lt;tg-slideshow&gt;, therefore only HTML tags can be used there.</li>
<li>See <a href="#date-time-entity-formatting">date-time entity formatting</a> for more details about supported date-time formats.</li>
</ul>
<h6><a class="anchor" name="rich-html-style" href="#rich-html-style"><i class="anchor-icon"></i></a>Rich HTML style</h6>
<p>To use this mode, pass rich message content in the <em>html</em> field. The following tags are currently supported:</p>
<pre><code>&lt;a name=&quot;chapter-0&quot;&gt;&lt;/a&gt;
&lt;b&gt;bold text&lt;/b&gt;, &lt;strong&gt;bold text&lt;/strong&gt;
&lt;i&gt;italic text&lt;/i&gt;, &lt;em&gt;italic text&lt;/em&gt;
&lt;u&gt;underlined text&lt;/u&gt;, &lt;ins&gt;underlined text&lt;/ins&gt;
&lt;s&gt;strikethrough text&lt;/s&gt;, &lt;strike&gt;strikethrough text&lt;/strike&gt;, &lt;del&gt;strikethrough text&lt;/del&gt;
&lt;code&gt;inline fixed-width code&lt;/code&gt;
&lt;mark&gt;marked text&lt;/mark&gt;
&lt;sub&gt;subscript text&lt;/sub&gt;
&lt;sup&gt;superscript text&lt;/sup&gt;
&lt;tg-spoiler&gt;spoiler&lt;/tg-spoiler&gt;

&lt;a href=&quot;#note-1&quot;&gt;Reference&lt;/a&gt;
&lt;a href=&quot;https://t.me/&quot;&gt;inline URL&lt;/a&gt;
&lt;a href=&quot;mailto:user@example.com&quot;&gt;inline e-mail&lt;/a&gt;
&lt;a href=&quot;tel:+123456789&quot;&gt;inline phone number&lt;/a&gt;
&lt;a href=&quot;tg://user?id=123456789&quot;&gt;inline mention of a user&lt;/a&gt;
&lt;a href=&quot;#chapter-1&quot;&gt;in-document link&lt;/a&gt;
&lt;a name=&quot;chapter-1&quot;&gt;&lt;/a&gt;

&lt;tg-reference name=&quot;note-1&quot;&gt;Referenced text&lt;/tg-reference&gt;
&lt;tg-emoji emoji-id=&quot;5368324170671202286&quot;&gt;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />&lt;/tg-emoji&gt;
&lt;img src=&quot;tg://emoji?id=5368324170671202286&quot; alt=&quot;<img class="emoji" src="//telegram.org/img/emoji/40/F09F918D.png" width="20" height="20" alt="👍" />&quot;/&gt;
&lt;tg-time unix=&quot;1647531900&quot; format=&quot;wDT&quot;&gt;22:45 tomorrow&lt;/tg-time&gt;
&lt;tg-math&gt;x^2 + y^2&lt;/tg-math&gt;

#hashtag $USD +12345678901, card: 4242 4242 4242 4242, https://t.me t.me a@t.me /command @username

all the text above was on the same line

&lt;h1&gt;Heading 1&lt;/h1&gt;
&lt;h2&gt;Heading 2&lt;/h2&gt;
&lt;h3&gt;Heading 3&lt;/h3&gt;
&lt;h4&gt;Heading 4&lt;/h4&gt;
&lt;h5&gt;Heading 5&lt;/h5&gt;
&lt;h6&gt;Heading 6&lt;/h6&gt;

&lt;a name=&quot;chapter-2&quot;&gt;&lt;/a&gt;

&lt;p&gt;Paragraph text&lt;/p&gt;
&lt;pre&gt;pre-formatted fixed-width code block&lt;/pre&gt;
&lt;pre&gt;&lt;code class=&quot;language-python&quot;&gt;  print(&#39;pre-formatted fixed-width code block written in the Python programming language&#39;)&lt;/code&gt;&lt;/pre&gt;
&lt;footer&gt;Footer text&lt;/footer&gt;
&lt;hr/&gt;
&lt;ul&gt;&lt;li&gt;unordered list item&lt;/li&gt;&lt;/ul&gt;
&lt;ol&gt;&lt;li&gt;ordered list item&lt;/li&gt;&lt;/ol&gt;
&lt;ol start=&quot;3&quot; type=&quot;a&quot; reversed&gt;&lt;li&gt;ordered list item&lt;/li&gt;&lt;/ol&gt;
&lt;ol&gt;&lt;li value=&quot;7&quot; type=&quot;i&quot;&gt;ordered list item with explicit number&lt;/li&gt;&lt;/ol&gt;
&lt;ul&gt;
&lt;li&gt;&lt;input type=&quot;checkbox&quot; checked&gt;Checked checkbox&lt;/li&gt;
&lt;li&gt;&lt;input type=&quot;checkbox&quot;&gt;Unchecked checkbox&lt;/li&gt;
&lt;/ul&gt;

&lt;blockquote&gt;Block quotation started&lt;br&gt;Block quotation continued&lt;br&gt;The last line of the block quotation&lt;cite&gt;The Author&lt;/cite&gt;&lt;/blockquote&gt;
&lt;aside&gt;Pull quote&lt;cite&gt;The Author&lt;/cite&gt;&lt;/aside&gt;

&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot;/&gt;
&lt;video src=&quot;https://telegram.org/example/video.mp4&quot;&gt;&lt;/video&gt;
&lt;audio src=&quot;https://telegram.org/example/audio.mp3&quot;&gt;&lt;/audio&gt;
&lt;audio src=&quot;https://telegram.org/example/audio.ogg&quot;&gt;&lt;/audio&gt;
&lt;video src=&quot;https://telegram.org/example/animation.gif&quot;&gt;&lt;/video&gt;

&lt;figure&gt;&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot; tg-spoiler/&gt;&lt;figcaption&gt;Photo caption&lt;cite&gt;Photo credit&lt;/cite&gt;&lt;/figcaption&gt;&lt;/figure&gt;
&lt;figure&gt;&lt;video src=&quot;https://telegram.org/example/video.mp4&quot; tg-spoiler&gt;&lt;/video&gt;&lt;figcaption&gt;Video caption&lt;/figcaption&gt;&lt;/figure&gt;
&lt;figure&gt;&lt;audio src=&quot;https://telegram.org/example/audio.mp3&quot;&gt;&lt;/audio&gt;&lt;figcaption&gt;Audio caption&lt;/figcaption&gt;&lt;/figure&gt;
&lt;figure&gt;&lt;audio src=&quot;https://telegram.org/example/audio.ogg&quot;&gt;&lt;/audio&gt;&lt;figcaption&gt;Voice note caption&lt;/figcaption&gt;&lt;/figure&gt;
&lt;figure&gt;&lt;video src=&quot;https://telegram.org/example/animation.gif&quot; tg-spoiler&gt;&lt;/video&gt;&lt;figcaption&gt;Animation caption&lt;/figcaption&gt;&lt;/figure&gt;

&lt;tg-map lat=&quot;41.9&quot; long=&quot;12.5&quot; zoom=&quot;14&quot;/&gt;
&lt;figure&gt;&lt;tg-map lat=&quot;41.9&quot; long=&quot;12.5&quot; zoom=&quot;14&quot;/&gt;&lt;figcaption&gt;Map caption&lt;/figcaption&gt;&lt;/figure&gt;

&lt;tg-collage&gt;&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot;/&gt;&lt;video src=&quot;https://telegram.org/example/video.mp4&quot;/&gt;&lt;/tg-collage&gt;
&lt;tg-collage&gt;&lt;video src=&quot;https://telegram.org/example/video.mp4&quot;/&gt;&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot;/&gt;&lt;figcaption&gt;Collage caption&lt;/figcaption&gt;&lt;/tg-collage&gt;
&lt;tg-slideshow&gt;&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot;/&gt;&lt;video src=&quot;https://telegram.org/example/video.mp4&quot;/&gt;&lt;/tg-slideshow&gt;
&lt;tg-slideshow&gt;&lt;video src=&quot;https://telegram.org/example/video.mp4&quot;/&gt;&lt;img src=&quot;https://telegram.org/example/photo.jpg&quot;/&gt;&lt;figcaption&gt;Slideshow caption&lt;/figcaption&gt;&lt;/tg-slideshow&gt;

&lt;table&gt;&lt;tr&gt;&lt;th&gt;Header 1&lt;/th&gt;&lt;th&gt;Header 2&lt;/th&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Value 1&lt;/td&gt;&lt;td&gt;Value 2&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;
&lt;table bordered striped&gt;&lt;caption&gt;Table caption&lt;/caption&gt;
&lt;tr&gt;&lt;td colspan=&quot;2&quot; rowspan=&quot;2&quot; align=&quot;left&quot;&gt;Value&lt;/td&gt;&lt;td align=&quot;center&quot;&gt;Value2&lt;/td&gt;&lt;td align=&quot;right&quot;&gt;Value3&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td valign=&quot;top&quot;&gt;Value4&lt;/td&gt;&lt;td valign=&quot;middle&quot;&gt;Value5&lt;/td&gt;&lt;td valign=&quot;bottom&quot;&gt;Value6&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Value7&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;

&lt;details&gt;&lt;summary&gt;Title&lt;/summary&gt;Content&lt;/details&gt;
&lt;details open&gt;&lt;summary&gt;Title&lt;/summary&gt;Content&lt;/details&gt;
&lt;tg-math-block&gt;E = mc^2&lt;/tg-math-block&gt;</code></pre>
<p>Additionally, you can use the following tag in <a href="#sendrichmessagedraft">sendRichMessageDraft</a>:</p>
<pre><code>&lt;tg-thinking&gt;Thinking...&lt;/tg-thinking&gt;</code></pre>
<p>Please note:</p>
<ul>
<li>Only the tags mentioned above are currently supported.</li>
<li>All numerical HTML entities are supported.</li>
<li>The API currently supports only the following named HTML entities: <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;amp;</code>, <code>&amp;quot;</code>, <code>&amp;apos;</code>, <code>&amp;nbsp;</code>, <code>&amp;hellip;</code>, <code>&amp;mdash;</code>, <code>&amp;ndash;</code>, <code>&amp;lsquo;</code>, <code>&amp;rsquo;</code>, <code>&amp;ldquo;</code> and <code>&amp;rdquo;</code>.</li>
<li>Use nested <code>pre</code> and <code>code</code> tags to define the programming language for a pre-formatted block.</li>
<li>Programming language can&#39;t be specified for standalone <code>code</code> tags.</li>
<li>Links <code>mailto:...</code>, <code>tel:...</code>, and <code>tg://user?id=...</code> are rendered as e-mail links, phone links, and inline mentions respectively. Other supported links are rendered as regular inline links.</li>
<li>Images, videos, and audio files can be specified only as separate media blocks.</li>
<li>Media blocks support only HTTP and HTTPS URLs.</li>
<li>An empty <code>&lt;a name=&quot;...&quot;&gt;&lt;/a&gt;</code> on its own creates an anchor that can be linked to with <code>&lt;a href=&quot;#...&quot;&gt;...&lt;/a&gt;</code>.</li>
<li>In <code>&lt;figcaption&gt;</code>, you can use <code>&lt;cite&gt;</code> tags to specify caption credit.</li>
<li>Use <code>&lt;tg-reference name=&quot;...&quot;&gt;...&lt;/tg-reference&gt;</code> to define referenced text that can be linked to with <code>&lt;a href=&quot;#...&quot;&gt;...&lt;/a&gt;</code>.</li>
<li>The body of a <code>&lt;details&gt;</code> tag can contain rich message content. If the <code>open</code> attribute is specified, the block is expanded by default.</li>
<li>Formula source is treated as raw LaTeX.</li>
<li>See <a href="#date-time-entity-formatting">date-time entity formatting</a> for more details about supported date-time formats.</li>
</ul>
/**
 * Rich formatted message.
 */
export interface RichMessage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>blocks</td>
<td>Array of <a href="#richblock">RichBlock</a></td>
<td>Content of the message</td>
</tr>
  /**
   * <em>True</em>, if the rich message must be shown right-to-left
   */
  is_rtl?: boolean;
</tbody>
</table>
}
/**
 * Describes a rich message to be sent. Exactly <strong>one</strong> of the fields <em>html</em>, <em>markdown</em>, or <em>blocks</em> must be used.
 */
export interface InputRichMessage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Content of the rich message to send described as a list of blocks
   */
  blocks?: InputRichBlock[];
  /**
   * Content of the rich message to send described using HTML formatting. See <a href="#rich-message-formatting-options">rich message formatting options</a> for more details. Use <em>media</em> field to specify the media used in the message.
   */
  html?: string;
  /**
   * Content of the rich message to send described using Markdown formatting. See <a href="#rich-message-formatting-options">rich message formatting options</a> for more details. Use <em>media</em> field to specify the media used in the message.
   */
  markdown?: string;
  /**
   * List of media that are specified in the <em>markdown</em> or <em>html</em> fields using <code>tg://photo?id=</code>, <code>tg://video?id=</code>, and <code>tg://audio?id=</code> links
   */
  media?: InputRichMessageMedia[];
  /**
   * Pass <em>True</em> if the rich message must be shown right-to-left
   */
  is_rtl?: boolean;
  /**
   * Pass <em>True</em> to skip automatic detection of entities (e.g., URLs, email addresses, username mentions, hashtags, cashtags, bot commands, or phone numbers) in the text
   */
  skip_entity_detection?: boolean;
</tbody>
</table>
}
/**
 * Describes a media element embedded in an outgoing rich message.
 */
export interface InputRichMessageMedia {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the media used in a <code>tg://photo?id=</code>, <code>tg://video?id=</code>, or <code>tg://audio?id=</code> link. 1-64 characters, only <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>_</code> and <code>-</code> are allowed.
   */
  id: string;
  /**
   * The media to be sent. Everything except the media itself and its properties is ignored.
   */
  media: InputMediaAnimation | InputMediaAudio | InputMediaPhoto | InputMediaVideo | InputMediaVoiceNote
</tbody>
</table>
}
export interface ApiMethods {
  /**
   * Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendRichMessage(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent. Bot can send rich messages on behalf of a business account only if the corresponding user can send rich messages.</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>rich_message</td>
<td><a href="#inputrichmessage">InputRichMessage</a></td>
<td>Yes</td>
<td>The message to be sent</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a> or <a href="#replykeyboardmarkup">ReplyKeyboardMarkup</a> or <a href="#replykeyboardremove">ReplyKeyboardRemove</a> or <a href="#forcereply">ForceReply</a></td>
<td>Optional</td>
<td>Additional interface options. A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>, <a href="/bots/features#keyboards">custom reply keyboard</a>, instructions to remove a reply keyboard or to force a reply from the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you <strong>must</strong> call <a href="#sendrichmessage">sendRichMessage</a> with the complete message to persist it in the user&#39;s chat. Returns <em>True</em> on success.
   */
  sendRichMessageDraft(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier for the target private chat</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread</td>
</tr>
<tr>
<td>draft_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated.</td>
</tr>
<tr>
<td>rich_message</td>
<td><a href="#inputrichmessage">InputRichMessage</a></td>
<td>Yes</td>
<td>The partial message to be streamed. Direct upload of new files isn&#39;t supported.</td>
</tr>
</tbody>
</table>
  }): never;
}
/**
 * This object represents a rich formatted text. Currently, it can be either a String for plain text, an Array of <a href="#richtext">RichText</a>, or any of the following types:
 *
 * - <a href="#richtextbold">RichTextBold</a>
 * - <a href="#richtextitalic">RichTextItalic</a>
 * - <a href="#richtextunderline">RichTextUnderline</a>
 * - <a href="#richtextstrikethrough">RichTextStrikethrough</a>
 * - <a href="#richtextspoiler">RichTextSpoiler</a>
 * - <a href="#richtextdatetime">RichTextDateTime</a>
 * - <a href="#richtexttextmention">RichTextTextMention</a>
 * - <a href="#richtextsubscript">RichTextSubscript</a>
 * - <a href="#richtextsuperscript">RichTextSuperscript</a>
 * - <a href="#richtextmarked">RichTextMarked</a>
 * - <a href="#richtextcode">RichTextCode</a>
 * - <a href="#richtextcustomemoji">RichTextCustomEmoji</a>
 * - <a href="#richtextmathematicalexpression">RichTextMathematicalExpression</a>
 * - <a href="#richtexturl">RichTextUrl</a>
 * - <a href="#richtextemailaddress">RichTextEmailAddress</a>
 * - <a href="#richtextphonenumber">RichTextPhoneNumber</a>
 * - <a href="#richtextbankcardnumber">RichTextBankCardNumber</a>
 * - <a href="#richtextmention">RichTextMention</a>
 * - <a href="#richtexthashtag">RichTextHashtag</a>
 * - <a href="#richtextcashtag">RichTextCashtag</a>
 * - <a href="#richtextbotcommand">RichTextBotCommand</a>
 * - <a href="#richtextanchor">RichTextAnchor</a>
 * - <a href="#richtextanchorlink">RichTextAnchorLink</a>
 * - <a href="#richtextreference">RichTextReference</a>
 * - <a href="#richtextreferencelink">RichTextReferenceLink</a>
 */
export type RichText =
 | <a href="#richtextbold">RichTextBold</a>
 | <a href="#richtextitalic">RichTextItalic</a>
 | <a href="#richtextunderline">RichTextUnderline</a>
 | <a href="#richtextstrikethrough">RichTextStrikethrough</a>
 | <a href="#richtextspoiler">RichTextSpoiler</a>
 | <a href="#richtextdatetime">RichTextDateTime</a>
 | <a href="#richtexttextmention">RichTextTextMention</a>
 | <a href="#richtextsubscript">RichTextSubscript</a>
 | <a href="#richtextsuperscript">RichTextSuperscript</a>
 | <a href="#richtextmarked">RichTextMarked</a>
 | <a href="#richtextcode">RichTextCode</a>
 | <a href="#richtextcustomemoji">RichTextCustomEmoji</a>
 | <a href="#richtextmathematicalexpression">RichTextMathematicalExpression</a>
 | <a href="#richtexturl">RichTextUrl</a>
 | <a href="#richtextemailaddress">RichTextEmailAddress</a>
 | <a href="#richtextphonenumber">RichTextPhoneNumber</a>
 | <a href="#richtextbankcardnumber">RichTextBankCardNumber</a>
 | <a href="#richtextmention">RichTextMention</a>
 | <a href="#richtexthashtag">RichTextHashtag</a>
 | <a href="#richtextcashtag">RichTextCashtag</a>
 | <a href="#richtextbotcommand">RichTextBotCommand</a>
 | <a href="#richtextanchor">RichTextAnchor</a>
 | <a href="#richtextanchorlink">RichTextAnchorLink</a>
 | <a href="#richtextreference">RichTextReference</a>
 | <a href="#richtextreferencelink">RichTextReferenceLink</a>
/**
 * A bold text.
 */
export interface RichTextBold {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “bold”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * An italicized text.
 */
export interface RichTextItalic {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “italic”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * An underlined text.
 */
export interface RichTextUnderline {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “underline”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A strikethrough text.
 */
export interface RichTextStrikethrough {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “strikethrough”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A text covered by a spoiler.
 */
export interface RichTextSpoiler {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “spoiler”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * Formatted date and time.
 */
export interface RichTextDateTime {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “date_time”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The Unix time associated with the entity
   */
  unix_time: number;
  /**
   * The string that defines the formatting of the date and time. See <a href="#date-time-entity-formatting">date-time entity formatting</a> for more details.
   */
  date_time_format: string;
</tbody>
</table>
}
/**
 * A mention of a Telegram user by their identifier.
 */
export interface RichTextTextMention {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “text_mention”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The mentioned user
   */
  user: User;
</tbody>
</table>
}
/**
 * A subscript text.
 */
export interface RichTextSubscript {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “subscript”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A superscript text.
 */
export interface RichTextSuperscript {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “superscript”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A marked text.
 */
export interface RichTextMarked {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “marked”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A monowidth text.
 */
export interface RichTextCode {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “code”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A custom emoji.
 */
export interface RichTextCustomEmoji {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “custom_emoji”
   */
  type: string;
  /**
   * Unique identifier of the custom emoji. Use <a href="#getcustomemojistickers">getCustomEmojiStickers</a> to get full information about the sticker.
   */
  custom_emoji_id: string;
  /**
   * Alternative emoji for the custom emoji
   */
  alternative_text: string;
</tbody>
</table>
}
/**
 * A mathematical expression.
 */
export interface RichTextMathematicalExpression {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “mathematical_expression”
   */
  type: string;
  /**
   * The expression in LaTeX format
   */
  expression: string;
</tbody>
</table>
}
/**
 * A text with a link.
 */
export interface RichTextUrl {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “url”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * URL of the link
   */
  url: string;
</tbody>
</table>
}
/**
 * A text with an email address.
 */
export interface RichTextEmailAddress {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “email_address”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The email address
   */
  email_address: string;
</tbody>
</table>
}
/**
 * A text with a phone number.
 */
export interface RichTextPhoneNumber {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “phone_number”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The phone number
   */
  phone_number: string;
</tbody>
</table>
}
/**
 * A text with a bank card number.
 */
export interface RichTextBankCardNumber {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “bank_card_number”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The bank card number
   */
  bank_card_number: string;
</tbody>
</table>
}
/**
 * A mention by a username.
 */
export interface RichTextMention {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “mention”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The username
   */
  username: string;
</tbody>
</table>
}
/**
 * A hashtag.
 */
export interface RichTextHashtag {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “hashtag”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The hashtag
   */
  hashtag: string;
</tbody>
</table>
}
/**
 * A cashtag.
 */
export interface RichTextCashtag {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “cashtag”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The cashtag
   */
  cashtag: string;
</tbody>
</table>
}
/**
 * A bot command.
 */
export interface RichTextBotCommand {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “bot_command”
   */
  type: string;
  /**
   * The text
   */
  text: RichText;
  /**
   * The bot command
   */
  bot_command: string;
</tbody>
</table>
}
/**
 * An anchor.
 */
export interface RichTextAnchor {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “anchor”
   */
  type: string;
  /**
   * The name of the anchor
   */
  name: string;
</tbody>
</table>
}
/**
 * A link to an anchor.
 */
export interface RichTextAnchorLink {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “anchor_link”
   */
  type: string;
  /**
   * The link text
   */
  text: RichText;
  /**
   * The name of the anchor. If the name is empty, then the link brings back to the top of the message.
   */
  anchor_name: string;
</tbody>
</table>
}
/**
 * A reference.
 */
export interface RichTextReference {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “reference”
   */
  type: string;
  /**
   * Text of the reference
   */
  text: RichText;
  /**
   * The name of the reference
   */
  name: string;
</tbody>
</table>
}
/**
 * A link to a reference.
 */
export interface RichTextReferenceLink {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the rich text, always “reference_link”
   */
  type: string;
  /**
   * The link text
   */
  text: RichText;
  /**
   * The name of the reference
   */
  reference_name: string;
</tbody>
</table>
}
/**
 * Caption of a rich formatted block.
 */
export interface RichBlockCaption {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Block caption
   */
  text: RichText;
  /**
   * Block credit which corresponds to the HTML tag &lt;cite&gt;
   */
  credit?: RichText;
</tbody>
</table>
}
/**
 * Cell in a table.
 */
export interface RichBlockTableCell {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Text in the cell. If omitted, then the cell is invisible.
   */
  text?: RichText;
  /**
   * <em>True</em>, if the cell is a header cell
   */
  is_header?: true;
  /**
   * The number of columns the cell spans if it is bigger than 1
   */
  colspan?: number;
  /**
   * The number of rows the cell spans if it is bigger than 1
   */
  rowspan?: number;
  /**
   * Horizontal cell content alignment. Currently, must be one of “left”, “center”, or “right”.
   */
  align: string;
  /**
   * Vertical cell content alignment. Currently, must be one of “top”, “middle”, or “bottom”.
   */
  valign: string;
</tbody>
</table>
}
/**
 * An item of a list.
 */
export interface RichBlockListItem {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Label of the item
   */
  label: string;
<tr>
<td>blocks</td>
<td>Array of <a href="#richblock">RichBlock</a></td>
<td>The content of the item</td>
</tr>
  /**
   * <em>True</em>, if the item has a checkbox
   */
  has_checkbox?: true;
  /**
   * <em>True</em>, if the item has a checked checkbox
   */
  is_checked?: true;
  /**
   * For ordered lists, the numeric value of the item label
   */
  value?: number;
  /**
   * For ordered lists, the type of the item label; must be one of “a” for lowercase letters, “A” for uppercase letters, “i” for lowercase Roman numerals, “I” for uppercase Roman numerals, or “1” for decimal numbers
   */
  type?: string;
</tbody>
</table>
}
/**
 * This object represents a block in a rich formatted message. Currently, it can be any of the following types:
 *
 * - <a href="#richblockparagraph">RichBlockParagraph</a>
 * - <a href="#richblocksectionheading">RichBlockSectionHeading</a>
 * - <a href="#richblockpreformatted">RichBlockPreformatted</a>
 * - <a href="#richblockfooter">RichBlockFooter</a>
 * - <a href="#richblockdivider">RichBlockDivider</a>
 * - <a href="#richblockmathematicalexpression">RichBlockMathematicalExpression</a>
 * - <a href="#richblockanchor">RichBlockAnchor</a>
 * - <a href="#richblocklist">RichBlockList</a>
 * - <a href="#richblockblockquotation">RichBlockBlockQuotation</a>
 * - <a href="#richblockpullquotation">RichBlockPullQuotation</a>
 * - <a href="#richblockcollage">RichBlockCollage</a>
 * - <a href="#richblockslideshow">RichBlockSlideshow</a>
 * - <a href="#richblocktable">RichBlockTable</a>
 * - <a href="#richblockdetails">RichBlockDetails</a>
 * - <a href="#richblockmap">RichBlockMap</a>
 * - <a href="#richblockanimation">RichBlockAnimation</a>
 * - <a href="#richblockaudio">RichBlockAudio</a>
 * - <a href="#richblockphoto">RichBlockPhoto</a>
 * - <a href="#richblockvideo">RichBlockVideo</a>
 * - <a href="#richblockvoicenote">RichBlockVoiceNote</a>
 * - <a href="#richblockthinking">RichBlockThinking</a>
 */
export type RichBlock =
 | <a href="#richblockparagraph">RichBlockParagraph</a>
 | <a href="#richblocksectionheading">RichBlockSectionHeading</a>
 | <a href="#richblockpreformatted">RichBlockPreformatted</a>
 | <a href="#richblockfooter">RichBlockFooter</a>
 | <a href="#richblockdivider">RichBlockDivider</a>
 | <a href="#richblockmathematicalexpression">RichBlockMathematicalExpression</a>
 | <a href="#richblockanchor">RichBlockAnchor</a>
 | <a href="#richblocklist">RichBlockList</a>
 | <a href="#richblockblockquotation">RichBlockBlockQuotation</a>
 | <a href="#richblockpullquotation">RichBlockPullQuotation</a>
 | <a href="#richblockcollage">RichBlockCollage</a>
 | <a href="#richblockslideshow">RichBlockSlideshow</a>
 | <a href="#richblocktable">RichBlockTable</a>
 | <a href="#richblockdetails">RichBlockDetails</a>
 | <a href="#richblockmap">RichBlockMap</a>
 | <a href="#richblockanimation">RichBlockAnimation</a>
 | <a href="#richblockaudio">RichBlockAudio</a>
 | <a href="#richblockphoto">RichBlockPhoto</a>
 | <a href="#richblockvideo">RichBlockVideo</a>
 | <a href="#richblockvoicenote">RichBlockVoiceNote</a>
 | <a href="#richblockthinking">RichBlockThinking</a>
/**
 * A text paragraph, corresponding to the HTML tag <code>&lt;p&gt;</code>.
 */
export interface RichBlockParagraph {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “paragraph”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A section heading, corresponding to the HTML tags <code>&lt;h1&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>, <code>&lt;h4&gt;</code>, <code>&lt;h5&gt;</code>, or <code>&lt;h6&gt;</code>.
 */
export interface RichBlockSectionHeading {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “heading”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
  /**
   * Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest
   */
  size: number;
</tbody>
</table>
}
/**
 * A preformatted text block, corresponding to the nested HTML tags <code>&lt;pre&gt;</code> and <code>&lt;code&gt;</code>.
 */
export interface RichBlockPreformatted {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “pre”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
  /**
   * The programming language of the text
   */
  language?: string;
</tbody>
</table>
}
/**
 * A footer, corresponding to the HTML tag <code>&lt;footer&gt;</code>.
 */
export interface RichBlockFooter {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “footer”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A divider, corresponding to the HTML tag <code>&lt;hr/&gt;</code>.
 */
export interface RichBlockDivider {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “divider”
   */
  type: string;
</tbody>
</table>
}
/**
 * A block with a mathematical expression in LaTeX format, corresponding to the custom HTML tag <code>&lt;tg-math-block&gt;</code>.
 */
export interface RichBlockMathematicalExpression {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “mathematical_expression”
   */
  type: string;
  /**
   * The mathematical expression in LaTeX format
   */
  expression: string;
</tbody>
</table>
}
/**
 * A block with an anchor, corresponding to the HTML tag <code>&lt;a&gt;</code> with the attribute <code>name</code>.
 */
export interface RichBlockAnchor {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “anchor”
   */
  type: string;
  /**
   * The name of the anchor
   */
  name: string;
</tbody>
</table>
}
/**
 * A list of blocks, corresponding to the HTML tag <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code> with multiple nested tags <code>&lt;li&gt;</code>.
 */
export interface RichBlockList {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “list”
   */
  type: string;
<tr>
<td>items</td>
<td>Array of <a href="#richblocklistitem">RichBlockListItem</a></td>
<td>Items of the list</td>
</tr>
</tbody>
</table>
}
/**
 * A block quotation, corresponding to the HTML tag <code>&lt;blockquote&gt;</code>.
 */
export interface RichBlockBlockQuotation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “blockquote”
   */
  type: string;
<tr>
<td>blocks</td>
<td>Array of <a href="#richblock">RichBlock</a></td>
<td>Content of the block</td>
</tr>
  /**
   * Credit of the block
   */
  credit?: RichText;
</tbody>
</table>
}
/**
 * A quotation with centered text, loosely corresponding to the HTML tag <code>&lt;aside&gt;</code>.
 */
export interface RichBlockPullQuotation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “pullquote”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
  /**
   * Credit of the block
   */
  credit?: RichText;
</tbody>
</table>
}
/**
 * A collage, corresponding to the custom HTML tag <code>&lt;tg-collage&gt;</code>.
 */
export interface RichBlockCollage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “collage”
   */
  type: string;
<tr>
<td>blocks</td>
<td>Array of <a href="#richblock">RichBlock</a></td>
<td>Elements of the collage</td>
</tr>
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A slideshow, corresponding to the custom HTML tag <code>&lt;tg-slideshow&gt;</code>.
 */
export interface RichBlockSlideshow {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “slideshow”
   */
  type: string;
<tr>
<td>blocks</td>
<td>Array of <a href="#richblock">RichBlock</a></td>
<td>Elements of the slideshow</td>
</tr>
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A table, corresponding to the HTML tag <code>&lt;table&gt;</code>.
 */
export interface RichBlockTable {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “table”
   */
  type: string;
<tr>
<td>cells</td>
<td>Array of Array of <a href="#richblocktablecell">RichBlockTableCell</a></td>
<td>Cells of the table</td>
</tr>
  /**
   * <em>True</em>, if the table has borders
   */
  is_bordered?: true;
  /**
   * <em>True</em>, if the table is striped
   */
  is_striped?: true;
  /**
   * Caption of the table
   */
  caption?: RichText;
</tbody>
</table>
}
/**
 * An expandable block for details disclosure, corresponding to the HTML tag <code>&lt;details&gt;</code>.
 */
export interface RichBlockDetails {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “details”
   */
  type: string;
  /**
   * Always shown summary of the block
   */
  summary: RichText;
<tr>
<td>blocks</td>
<td>Array of <a href="#richblock">RichBlock</a></td>
<td>Content of the block</td>
</tr>
  /**
   * <em>True</em>, if the content of the block is visible by default
   */
  is_open?: true;
</tbody>
</table>
}
/**
 * A block with a map, corresponding to the custom HTML tag <code>&lt;tg-map&gt;</code>.
 */
export interface RichBlockMap {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “map”
   */
  type: string;
  /**
   * Location of the center of the map
   */
  location: Location;
  /**
   * Map zoom level; 13-20
   */
  zoom: number;
  /**
   * Expected width of the map
   */
  width: number;
  /**
   * Expected height of the map
   */
  height: number;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with an animation, corresponding to the HTML tag <code>&lt;video&gt;</code>.
 */
export interface RichBlockAnimation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “animation”
   */
  type: string;
  /**
   * The animation
   */
  animation: Animation;
  /**
   * <em>True</em>, if the media preview is covered by a spoiler animation
   */
  has_spoiler?: true;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a music file, corresponding to the HTML tag <code>&lt;audio&gt;</code>.
 */
export interface RichBlockAudio {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “audio”
   */
  type: string;
  /**
   * The audio
   */
  audio: Audio;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a photo, corresponding to the HTML tag <code>&lt;img&gt;</code>.
 */
export interface RichBlockPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “photo”
   */
  type: string;
<tr>
<td>photo</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Available sizes of the photo</td>
</tr>
  /**
   * <em>True</em>, if the media preview is covered by a spoiler animation
   */
  has_spoiler?: true;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a video, corresponding to the HTML tag <code>&lt;video&gt;</code>.
 */
export interface RichBlockVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “video”
   */
  type: string;
  /**
   * The video
   */
  video: Video;
  /**
   * <em>True</em>, if the media preview is covered by a spoiler animation
   */
  has_spoiler?: true;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a voice note, corresponding to the HTML tag <code>&lt;audio&gt;</code>.
 */
export interface RichBlockVoiceNote {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “voice_note”
   */
  type: string;
  /**
   * The voice note
   */
  voice_note: Voice;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a “Thinking…” placeholder, corresponding to the custom HTML tag <code>&lt;tg-thinking&gt;</code>. The block may be used only in <a href="#sendrichmessagedraft">sendRichMessageDraft</a>, therefore it can&#39;t be received in messages. See <a href="https://t.me/addemoji/AIActions"><a href="https://t.me/addemoji/AIActions">https://t.me/addemoji/AIActions</a></a> for examples of custom emoji that are recommended for usage in the block.
 */
export interface RichBlockThinking {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “thinking”
   */
  type: string;
  /**
   * Text of the block. See <a href="https://t.me/addemoji/AIActions"><a href="https://t.me/addemoji/AIActions">https://t.me/addemoji/AIActions</a></a> for examples of custom emoji that are recommended for usage in the block.
   */
  text: RichText;
</tbody>
</table>
}
/**
 * An item of a list to be sent.
 */
export interface InputRichBlockListItem {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>blocks</td>
<td>Array of <a href="#inputrichblock">InputRichBlock</a></td>
<td>The content of the item</td>
</tr>
  /**
   * Pass <em>True</em> if the item has a checkbox
   */
  has_checkbox?: true;
  /**
   * Pass <em>True</em> if the item has a checked checkbox
   */
  is_checked?: true;
  /**
   * For ordered lists, the numeric value of the item label
   */
  value?: number;
  /**
   * For ordered lists, the type of the item label; must be one of “a” for lowercase letters, “A” for uppercase letters, “i” for lowercase Roman numerals, “I” for uppercase Roman numerals, or “1” for decimal numbers
   */
  type?: string;
</tbody>
</table>
}
/**
 * This object represents a block in a rich formatted message to be sent. Currently, it can be any of the following types:
 *
 * - <a href="#inputrichblockparagraph">InputRichBlockParagraph</a>
 * - <a href="#inputrichblocksectionheading">InputRichBlockSectionHeading</a>
 * - <a href="#inputrichblockpreformatted">InputRichBlockPreformatted</a>
 * - <a href="#inputrichblockfooter">InputRichBlockFooter</a>
 * - <a href="#inputrichblockdivider">InputRichBlockDivider</a>
 * - <a href="#inputrichblockmathematicalexpression">InputRichBlockMathematicalExpression</a>
 * - <a href="#inputrichblockanchor">InputRichBlockAnchor</a>
 * - <a href="#inputrichblocklist">InputRichBlockList</a>
 * - <a href="#inputrichblockblockquotation">InputRichBlockBlockQuotation</a>
 * - <a href="#inputrichblockpullquotation">InputRichBlockPullQuotation</a>
 * - <a href="#inputrichblockcollage">InputRichBlockCollage</a>
 * - <a href="#inputrichblockslideshow">InputRichBlockSlideshow</a>
 * - <a href="#inputrichblocktable">InputRichBlockTable</a>
 * - <a href="#inputrichblockdetails">InputRichBlockDetails</a>
 * - <a href="#inputrichblockmap">InputRichBlockMap</a>
 * - <a href="#inputrichblockanimation">InputRichBlockAnimation</a>
 * - <a href="#inputrichblockaudio">InputRichBlockAudio</a>
 * - <a href="#inputrichblockphoto">InputRichBlockPhoto</a>
 * - <a href="#inputrichblockvideo">InputRichBlockVideo</a>
 * - <a href="#inputrichblockvoicenote">InputRichBlockVoiceNote</a>
 * - <a href="#inputrichblockthinking">InputRichBlockThinking</a>
 */
export type InputRichBlock =
 | <a href="#inputrichblockparagraph">InputRichBlockParagraph</a>
 | <a href="#inputrichblocksectionheading">InputRichBlockSectionHeading</a>
 | <a href="#inputrichblockpreformatted">InputRichBlockPreformatted</a>
 | <a href="#inputrichblockfooter">InputRichBlockFooter</a>
 | <a href="#inputrichblockdivider">InputRichBlockDivider</a>
 | <a href="#inputrichblockmathematicalexpression">InputRichBlockMathematicalExpression</a>
 | <a href="#inputrichblockanchor">InputRichBlockAnchor</a>
 | <a href="#inputrichblocklist">InputRichBlockList</a>
 | <a href="#inputrichblockblockquotation">InputRichBlockBlockQuotation</a>
 | <a href="#inputrichblockpullquotation">InputRichBlockPullQuotation</a>
 | <a href="#inputrichblockcollage">InputRichBlockCollage</a>
 | <a href="#inputrichblockslideshow">InputRichBlockSlideshow</a>
 | <a href="#inputrichblocktable">InputRichBlockTable</a>
 | <a href="#inputrichblockdetails">InputRichBlockDetails</a>
 | <a href="#inputrichblockmap">InputRichBlockMap</a>
 | <a href="#inputrichblockanimation">InputRichBlockAnimation</a>
 | <a href="#inputrichblockaudio">InputRichBlockAudio</a>
 | <a href="#inputrichblockphoto">InputRichBlockPhoto</a>
 | <a href="#inputrichblockvideo">InputRichBlockVideo</a>
 | <a href="#inputrichblockvoicenote">InputRichBlockVoiceNote</a>
 | <a href="#inputrichblockthinking">InputRichBlockThinking</a>
/**
 * A text paragraph, corresponding to the HTML tag <code>&lt;p&gt;</code>.
 */
export interface InputRichBlockParagraph {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “paragraph”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A section heading, corresponding to the HTML tags <code>&lt;h1&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>, <code>&lt;h4&gt;</code>, <code>&lt;h5&gt;</code>, or <code>&lt;h6&gt;</code>.
 */
export interface InputRichBlockSectionHeading {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “heading”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
  /**
   * Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest
   */
  size: number;
</tbody>
</table>
}
/**
 * A preformatted text block, corresponding to the nested HTML tags <code>&lt;pre&gt;</code> and <code>&lt;code&gt;</code>.
 */
export interface InputRichBlockPreformatted {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “pre”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
  /**
   * The programming language of the text
   */
  language?: string;
</tbody>
</table>
}
/**
 * A footer, corresponding to the HTML tag <code>&lt;footer&gt;</code>.
 */
export interface InputRichBlockFooter {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “footer”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
</tbody>
</table>
}
/**
 * A divider, corresponding to the HTML tag <code>&lt;hr/&gt;</code>.
 */
export interface InputRichBlockDivider {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “divider”
   */
  type: string;
</tbody>
</table>
}
/**
 * A block with a mathematical expression in LaTeX format, corresponding to the custom HTML tag <code>&lt;tg-math-block&gt;</code>.
 */
export interface InputRichBlockMathematicalExpression {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “mathematical_expression”
   */
  type: string;
  /**
   * The mathematical expression in LaTeX format
   */
  expression: string;
</tbody>
</table>
}
/**
 * A block with an anchor, corresponding to the HTML tag <code>&lt;a&gt;</code> with the attribute <code>name</code>.
 */
export interface InputRichBlockAnchor {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “anchor”
   */
  type: string;
  /**
   * The name of the anchor
   */
  name: string;
</tbody>
</table>
}
/**
 * A list of blocks, corresponding to the HTML tag <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code> with multiple nested tags <code>&lt;li&gt;</code>.
 */
export interface InputRichBlockList {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “list”
   */
  type: string;
<tr>
<td>items</td>
<td>Array of <a href="#inputrichblocklistitem">InputRichBlockListItem</a></td>
<td>Items of the list</td>
</tr>
</tbody>
</table>
}
/**
 * A block quotation, corresponding to the HTML tag <code>&lt;blockquote&gt;</code>.
 */
export interface InputRichBlockBlockQuotation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “blockquote”
   */
  type: string;
<tr>
<td>blocks</td>
<td>Array of <a href="#inputrichblock">InputRichBlock</a></td>
<td>Content of the block</td>
</tr>
  /**
   * Credit of the block
   */
  credit?: RichText;
</tbody>
</table>
}
/**
 * A quotation with centered text, loosely corresponding to the HTML tag <code>&lt;aside&gt;</code>.
 */
export interface InputRichBlockPullQuotation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “pullquote”
   */
  type: string;
  /**
   * Text of the block
   */
  text: RichText;
  /**
   * Credit of the block
   */
  credit?: RichText;
</tbody>
</table>
}
/**
 * A collage, corresponding to the custom HTML tag <code>&lt;tg-collage&gt;</code>.
 */
export interface InputRichBlockCollage {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “collage”
   */
  type: string;
<tr>
<td>blocks</td>
<td>Array of <a href="#inputrichblock">InputRichBlock</a></td>
<td>Elements of the collage</td>
</tr>
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A slideshow, corresponding to the custom HTML tag <code>&lt;tg-slideshow&gt;</code>.
 */
export interface InputRichBlockSlideshow {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “slideshow”
   */
  type: string;
<tr>
<td>blocks</td>
<td>Array of <a href="#inputrichblock">InputRichBlock</a></td>
<td>Elements of the slideshow</td>
</tr>
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A table, corresponding to the HTML tag <code>&lt;table&gt;</code>.
 */
export interface InputRichBlockTable {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “table”
   */
  type: string;
<tr>
<td>cells</td>
<td>Array of Array of <a href="#richblocktablecell">RichBlockTableCell</a></td>
<td>Cells of the table</td>
</tr>
  /**
   * Pass <em>True</em> if the table has borders
   */
  is_bordered?: true;
  /**
   * Pass <em>True</em> if the table is striped
   */
  is_striped?: true;
  /**
   * Caption of the table
   */
  caption?: RichText;
</tbody>
</table>
}
/**
 * An expandable block for details disclosure, corresponding to the HTML tag <code>&lt;details&gt;</code>.
 */
export interface InputRichBlockDetails {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “details”
   */
  type: string;
  /**
   * Always shown summary of the block
   */
  summary: RichText;
<tr>
<td>blocks</td>
<td>Array of <a href="#inputrichblock">InputRichBlock</a></td>
<td>Content of the block</td>
</tr>
  /**
   * Pass <em>True</em> if the content of the block is visible by default
   */
  is_open?: true;
</tbody>
</table>
}
/**
 * A block with a map, corresponding to the custom HTML tag <code>&lt;tg-map&gt;</code>. The map&#39;s width and height must not exceed 10000 in total. The width and height ratio must be at most 20.
 */
export interface InputRichBlockMap {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “map”
   */
  type: string;
  /**
   * Location of the center of the map
   */
  location: Location;
  /**
   * Map zoom level; 0-24
   */
  zoom: number;
  /**
   * Map width; 0-10000
   */
  width: number;
  /**
   * Map height; 0-10000
   */
  height: number;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with an animation, corresponding to the HTML tag <code>&lt;video&gt;</code>.
 */
export interface InputRichBlockAnimation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “animation”
   */
  type: string;
  /**
   * The animation. Caption is ignored.
   */
  animation: InputMediaAnimation;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a music file, corresponding to the HTML tag <code>&lt;audio&gt;</code>.
 */
export interface InputRichBlockAudio {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “audio”
   */
  type: string;
  /**
   * The audio. Caption is ignored.
   */
  audio: InputMediaAudio;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a photo, corresponding to the HTML tag <code>&lt;img&gt;</code>.
 */
export interface InputRichBlockPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “photo”
   */
  type: string;
  /**
   * The photo. Caption is ignored.
   */
  photo: InputMediaPhoto;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a video, corresponding to the HTML tag <code>&lt;video&gt;</code>.
 */
export interface InputRichBlockVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “video”
   */
  type: string;
  /**
   * The video. Caption is ignored.
   */
  video: InputMediaVideo;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a voice note, corresponding to the HTML tag <code>&lt;audio&gt;</code>.
 */
export interface InputRichBlockVoiceNote {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “voice_note”
   */
  type: string;
  /**
   * The voice note. Caption is ignored.
   */
  voice_note: InputMediaVoiceNote;
  /**
   * Caption of the block
   */
  caption?: RichBlockCaption;
</tbody>
</table>
}
/**
 * A block with a “Thinking…” placeholder, corresponding to the custom HTML tag <code>&lt;tg-thinking&gt;</code>. The block may be used only in <a href="#sendrichmessagedraft">sendRichMessageDraft</a>, therefore it can&#39;t be received in messages. See <a href="https://t.me/addemoji/AIActions"><a href="https://t.me/addemoji/AIActions">https://t.me/addemoji/AIActions</a></a> for examples of custom emoji that are recommended for usage in the block.
 */
export interface InputRichBlockThinking {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the block, always “thinking”
   */
  type: string;
  /**
   * Text of the block. See <a href="https://t.me/addemoji/AIActions"><a href="https://t.me/addemoji/AIActions">https://t.me/addemoji/AIActions</a></a> for examples of custom emoji that are recommended for usage in the block.
   */
  text: RichText;
</tbody>
</table>
}
// === INLINE MODE
<p>The following methods and objects allow your bot to work in <a href="/bots/inline">inline mode</a>.<br>Please see our <a href="/bots/inline">Introduction to Inline bots</a> for more details.</p>
<p>To enable this option, send the <code>/setinline</code> command to <a href="https://t.me/botfather">@BotFather</a> and provide the placeholder text that the user will see in the input field after typing your bot&#39;s name.</p>
/**
 * This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results.
 */
export interface InlineQuery {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier for this query
   */
  id: string;
  /**
   * Sender
   */
  from: User;
  /**
   * Text of the query (up to 256 characters)
   */
  query: string;
  /**
   * Offset of the results to be returned, can be controlled by the bot
   */
  offset: string;
  /**
   * Type of the chat from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat.
   */
  chat_type?: string;
  /**
   * Sender location, only for bots that request user location
   */
  location?: Location;
</tbody>
</table>
}
export interface ApiMethods {
  /**
   * Use this method to send answers to an inline query. On success, <em>True</em> is returned.<br>No more than <strong>50</strong> results per query are allowed.
   */
  answerInlineQuery(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>inline_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier for the answered query</td>
</tr>
<tr>
<td>results</td>
<td>Array of <a href="#inlinequeryresult">InlineQueryResult</a></td>
<td>Yes</td>
<td>A JSON-serialized Array of results for the inline query</td>
</tr>
<tr>
<td>cache_time</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.</td>
</tr>
<tr>
<td>is_personal</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.</td>
</tr>
<tr>
<td>next_offset</td>
<td>String</td>
<td>Optional</td>
<td>Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don&#39;t support pagination. Offset length can&#39;t exceed 64 bytes.</td>
</tr>
<tr>
<td>button</td>
<td><a href="#inlinequeryresultsbutton">InlineQueryResultsButton</a></td>
<td>Optional</td>
<td>A JSON-serialized object describing a button to be shown above inline query results</td>
</tr>
</tbody>
</table>
  }): never;
}
/**
 * This object represents a button to be shown above inline query results. You <strong>must</strong> use exactly one of the optional fields.
 */
export interface InlineQueryResultsButton {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Label text on the button
   */
  text: string;
  /**
   * Description of the <a href="/bots/webapps">Web App</a> that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method <a href="/bots/webapps#initializing-mini-apps">switchInlineQuery</a> inside the Web App.
   */
  web_app?: WebAppInfo;
  /**
   * <a href="/bots/features#deep-linking">Deep-linking</a> parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>_</code> and <code>-</code> are allowed.<br><br><em>Example:</em> An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a &#39;Connect your YouTube account&#39; button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a <a href="#inlinekeyboardmarkup"><em>switch_inline</em></a> button so that the user can easily return to the chat where they wanted to use the bot&#39;s inline capabilities.
   */
  start_parameter?: string;
</tbody>
</table>
}
/**
 * This object represents one result of an inline query. Telegram clients currently support results of the following 20 types:
 *
 * - <a href="#inlinequeryresultcachedaudio">InlineQueryResultCachedAudio</a>
 * - <a href="#inlinequeryresultcacheddocument">InlineQueryResultCachedDocument</a>
 * - <a href="#inlinequeryresultcachedgif">InlineQueryResultCachedGif</a>
 * - <a href="#inlinequeryresultcachedmpeg4gif">InlineQueryResultCachedMpeg4Gif</a>
 * - <a href="#inlinequeryresultcachedphoto">InlineQueryResultCachedPhoto</a>
 * - <a href="#inlinequeryresultcachedsticker">InlineQueryResultCachedSticker</a>
 * - <a href="#inlinequeryresultcachedvideo">InlineQueryResultCachedVideo</a>
 * - <a href="#inlinequeryresultcachedvoice">InlineQueryResultCachedVoice</a>
 * - <a href="#inlinequeryresultarticle">InlineQueryResultArticle</a>
 * - <a href="#inlinequeryresultaudio">InlineQueryResultAudio</a>
 * - <a href="#inlinequeryresultcontact">InlineQueryResultContact</a>
 * - <a href="#inlinequeryresultgame">InlineQueryResultGame</a>
 * - <a href="#inlinequeryresultdocument">InlineQueryResultDocument</a>
 * - <a href="#inlinequeryresultgif">InlineQueryResultGif</a>
 * - <a href="#inlinequeryresultlocation">InlineQueryResultLocation</a>
 * - <a href="#inlinequeryresultmpeg4gif">InlineQueryResultMpeg4Gif</a>
 * - <a href="#inlinequeryresultphoto">InlineQueryResultPhoto</a>
 * - <a href="#inlinequeryresultvenue">InlineQueryResultVenue</a>
 * - <a href="#inlinequeryresultvideo">InlineQueryResultVideo</a>
 * - <a href="#inlinequeryresultvoice">InlineQueryResultVoice</a>
 */
export type InlineQueryResult =
 | <a href="#inlinequeryresultcachedaudio">InlineQueryResultCachedAudio</a>
 | <a href="#inlinequeryresultcacheddocument">InlineQueryResultCachedDocument</a>
 | <a href="#inlinequeryresultcachedgif">InlineQueryResultCachedGif</a>
 | <a href="#inlinequeryresultcachedmpeg4gif">InlineQueryResultCachedMpeg4Gif</a>
 | <a href="#inlinequeryresultcachedphoto">InlineQueryResultCachedPhoto</a>
 | <a href="#inlinequeryresultcachedsticker">InlineQueryResultCachedSticker</a>
 | <a href="#inlinequeryresultcachedvideo">InlineQueryResultCachedVideo</a>
 | <a href="#inlinequeryresultcachedvoice">InlineQueryResultCachedVoice</a>
 | <a href="#inlinequeryresultarticle">InlineQueryResultArticle</a>
 | <a href="#inlinequeryresultaudio">InlineQueryResultAudio</a>
 | <a href="#inlinequeryresultcontact">InlineQueryResultContact</a>
 | <a href="#inlinequeryresultgame">InlineQueryResultGame</a>
 | <a href="#inlinequeryresultdocument">InlineQueryResultDocument</a>
 | <a href="#inlinequeryresultgif">InlineQueryResultGif</a>
 | <a href="#inlinequeryresultlocation">InlineQueryResultLocation</a>
 | <a href="#inlinequeryresultmpeg4gif">InlineQueryResultMpeg4Gif</a>
 | <a href="#inlinequeryresultphoto">InlineQueryResultPhoto</a>
 | <a href="#inlinequeryresultvenue">InlineQueryResultVenue</a>
 | <a href="#inlinequeryresultvideo">InlineQueryResultVideo</a>
 | <a href="#inlinequeryresultvoice">InlineQueryResultVoice</a>
<p><strong>Note:</strong> All URLs passed in inline query results will be available to end users and therefore must be assumed to be <strong>public</strong>.</p>
/**
 * Represents a link to an article or web page.
 */
export interface InlineQueryResultArticle {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>article</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 Bytes
   */
  id: string;
  /**
   * Title of the result
   */
  title: string;
  /**
   * Content of the message to be sent
   */
  input_message_content: InputMessageContent;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * URL of the result
   */
  url?: string;
  /**
   * Short description of the result
   */
  description?: string;
  /**
   * Url of the thumbnail for the result
   */
  thumbnail_url?: string;
  /**
   * Thumbnail width
   */
  thumbnail_width?: number;
  /**
   * Thumbnail height
   */
  thumbnail_height?: number;
</tbody>
</table>
}
/**
 * Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the photo.
 */
export interface InlineQueryResultPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>photo</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid URL of the photo. Photo must be in <strong>JPEG</strong> format. Photo size must not exceed 5MB.
   */
  photo_url: string;
  /**
   * URL of the thumbnail for the photo
   */
  thumbnail_url: string;
  /**
   * Width of the photo
   */
  photo_width?: number;
  /**
   * Height of the photo
   */
  photo_height?: number;
  /**
   * Title for the result
   */
  title?: string;
  /**
   * Short description of the result
   */
  description?: string;
  /**
   * Caption of the photo to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the photo
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the animation.
 */
export interface InlineQueryResultGif {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>gif</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid URL for the GIF file
   */
  gif_url: string;
  /**
   * Width of the GIF
   */
  gif_width?: number;
  /**
   * Height of the GIF
   */
  gif_height?: number;
  /**
   * Duration of the GIF in seconds
   */
  gif_duration?: number;
  /**
   * URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
   */
  thumbnail_url: string;
  /**
   * MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”.
   */
  thumbnail_mime_type?: string;
  /**
   * Title for the result
   */
  title?: string;
  /**
   * Caption of the GIF file to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the GIF animation
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the animation.
 */
export interface InlineQueryResultMpeg4Gif {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>mpeg4_gif</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid URL for the MPEG4 file
   */
  mpeg4_url: string;
  /**
   * Video width
   */
  mpeg4_width?: number;
  /**
   * Video height
   */
  mpeg4_height?: number;
  /**
   * Video duration in seconds
   */
  mpeg4_duration?: number;
  /**
   * URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
   */
  thumbnail_url: string;
  /**
   * MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”.
   */
  thumbnail_mime_type?: string;
  /**
   * Title for the result
   */
  title?: string;
  /**
   * Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the video animation
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the video.
 *
 * > If an InlineQueryResultVideo message contains an embedded video (e.g., YouTube), you <strong>must</strong> replace its content using <em>input_message_content</em>.
 */
export interface InlineQueryResultVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>video</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid URL for the embedded video player or video file
   */
  video_url: string;
  /**
   * MIME type of the content of the video URL, “text/html” or “video/mp4”
   */
  mime_type: string;
  /**
   * URL of the thumbnail (JPEG only) for the video
   */
  thumbnail_url: string;
  /**
   * Title for the result
   */
  title: string;
  /**
   * Caption of the video to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * Video width
   */
  video_width?: number;
  /**
   * Video height
   */
  video_height?: number;
  /**
   * Video duration in seconds
   */
  video_duration?: number;
  /**
   * Short description of the result
   */
  description?: string;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the video. This field is <strong>required</strong> if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video).
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the audio.
 */
export interface InlineQueryResultAudio {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>audio</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid URL for the audio file
   */
  audio_url: string;
  /**
   * Title
   */
  title: string;
  /**
   * Caption, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Performer
   */
  performer?: string;
  /**
   * Audio duration in seconds
   */
  audio_duration?: number;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the audio
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the the voice message.
 */
export interface InlineQueryResultVoice {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>voice</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid URL for the voice recording
   */
  voice_url: string;
  /**
   * Recording title
   */
  title: string;
  /**
   * Caption, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the voice message caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Recording duration in seconds
   */
  voice_duration?: number;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the voice recording
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the file. Currently, only <strong>.PDF</strong> and <strong>.ZIP</strong> files can be sent using this method.
 */
export interface InlineQueryResultDocument {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>document</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * Title for the result
   */
  title: string;
  /**
   * Caption of the document to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * A valid URL for the file
   */
  document_url: string;
  /**
   * MIME type of the content of the file, either “application/pdf” or “application/zip”
   */
  mime_type: string;
  /**
   * Short description of the result
   */
  description?: string;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the file
   */
  input_message_content?: InputMessageContent;
  /**
   * URL of the thumbnail (JPEG only) for the file
   */
  thumbnail_url?: string;
  /**
   * Thumbnail width
   */
  thumbnail_width?: number;
  /**
   * Thumbnail height
   */
  thumbnail_height?: number;
</tbody>
</table>
}
/**
 * Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the location.
 */
export interface InlineQueryResultLocation {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>location</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 Bytes
   */
  id: string;
  /**
   * Location latitude in degrees
   */
  latitude: number;
  /**
   * Location longitude in degrees
   */
  longitude: number;
  /**
   * Location title
   */
  title: string;
  /**
   * The radius of uncertainty for the location, measured in meters; 0-1500
   */
  horizontal_accuracy?: number;
  /**
   * Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely
   */
  live_period?: number;
  /**
   * For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
   */
  heading?: number;
  /**
   * For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
   */
  proximity_alert_radius?: number;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the location
   */
  input_message_content?: InputMessageContent;
  /**
   * Url of the thumbnail for the result
   */
  thumbnail_url?: string;
  /**
   * Thumbnail width
   */
  thumbnail_width?: number;
  /**
   * Thumbnail height
   */
  thumbnail_height?: number;
</tbody>
</table>
}
/**
 * Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the venue.
 */
export interface InlineQueryResultVenue {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>venue</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 Bytes
   */
  id: string;
  /**
   * Latitude of the venue location in degrees
   */
  latitude: number;
  /**
   * Longitude of the venue location in degrees
   */
  longitude: number;
  /**
   * Title of the venue
   */
  title: string;
  /**
   * Address of the venue
   */
  address: string;
  /**
   * Foursquare identifier of the venue if known
   */
  foursquare_id?: string;
  /**
   * Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
   */
  foursquare_type?: string;
  /**
   * Google Places identifier of the venue
   */
  google_place_id?: string;
  /**
   * Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)
   */
  google_place_type?: string;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the venue
   */
  input_message_content?: InputMessageContent;
  /**
   * Url of the thumbnail for the result
   */
  thumbnail_url?: string;
  /**
   * Thumbnail width
   */
  thumbnail_width?: number;
  /**
   * Thumbnail height
   */
  thumbnail_height?: number;
</tbody>
</table>
}
/**
 * Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the contact.
 */
export interface InlineQueryResultContact {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>contact</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 Bytes
   */
  id: string;
  /**
   * Contact&#39;s phone number
   */
  phone_number: string;
  /**
   * Contact&#39;s first name
   */
  first_name: string;
  /**
   * Contact&#39;s last name
   */
  last_name?: string;
  /**
   * Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a>, 0-2048 bytes
   */
  vcard?: string;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the contact
   */
  input_message_content?: InputMessageContent;
  /**
   * Url of the thumbnail for the result
   */
  thumbnail_url?: string;
  /**
   * Thumbnail width
   */
  thumbnail_width?: number;
  /**
   * Thumbnail height
   */
  thumbnail_height?: number;
</tbody>
</table>
}
/**
 * Represents a <a href="#games">Game</a>.
 */
export interface InlineQueryResultGame {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>game</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * Short name of the game
   */
  game_short_name: string;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
</tbody>
</table>
}
/**
 * Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the photo.
 */
export interface InlineQueryResultCachedPhoto {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>photo</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid file identifier of the photo
   */
  photo_file_id: string;
  /**
   * Title for the result
   */
  title?: string;
  /**
   * Short description of the result
   */
  description?: string;
  /**
   * Caption of the photo to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the photo caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the photo
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with specified content instead of the animation.
 */
export interface InlineQueryResultCachedGif {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>gif</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid file identifier for the GIF file
   */
  gif_file_id: string;
  /**
   * Title for the result
   */
  title?: string;
  /**
   * Caption of the GIF file to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the GIF animation
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the animation.
 */
export interface InlineQueryResultCachedMpeg4Gif {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>mpeg4_gif</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid file identifier for the MPEG4 file
   */
  mpeg4_file_id: string;
  /**
   * Title for the result
   */
  title?: string;
  /**
   * Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the video animation
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the sticker.
 */
export interface InlineQueryResultCachedSticker {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>sticker</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid file identifier of the sticker
   */
  sticker_file_id: string;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the sticker
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the file.
 */
export interface InlineQueryResultCachedDocument {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>document</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * Title for the result
   */
  title: string;
  /**
   * A valid file identifier for the file
   */
  document_file_id: string;
  /**
   * Short description of the result
   */
  description?: string;
  /**
   * Caption of the document to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the document caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the file
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the video.
 */
export interface InlineQueryResultCachedVideo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>video</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid file identifier for the video file
   */
  video_file_id: string;
  /**
   * Title for the result
   */
  title: string;
  /**
   * Short description of the result
   */
  description?: string;
  /**
   * Caption of the video to be sent, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the video caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * Pass <em>True</em> if the caption must be shown above the message media
   */
  show_caption_above_media?: boolean;
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the video
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the voice message.
 */
export interface InlineQueryResultCachedVoice {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>voice</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid file identifier for the voice message
   */
  voice_file_id: string;
  /**
   * Voice message title
   */
  title: string;
  /**
   * Caption, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the voice message caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the voice message
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use <em>input_message_content</em> to send a message with the specified content instead of the audio.
 */
export interface InlineQueryResultCachedAudio {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the result, must be <em>audio</em>
   */
  type: string;
  /**
   * Unique identifier for this result, 1-64 bytes
   */
  id: string;
  /**
   * A valid file identifier for the audio file
   */
  audio_file_id: string;
  /**
   * Caption, 0-1024 characters after entities parsing
   */
  caption?: string;
  /**
   * Mode for parsing entities in the audio caption. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in the caption, which can be specified instead of <em>parse_mode</em>
   */
  caption_entities?: MessageEntity[];
  /**
   * <a href="/bots/features#inline-keyboards">Inline keyboard</a> attached to the message
   */
  reply_markup?: InlineKeyboardMarkup;
  /**
   * Content of the message to be sent instead of the audio
   */
  input_message_content?: InputMessageContent;
</tbody>
</table>
}
/**
 * This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following types:
 *
 * - <a href="#inputtextmessagecontent">InputTextMessageContent</a>
 * - <a href="#inputrichmessagecontent">InputRichMessageContent</a>
 * - <a href="#inputlocationmessagecontent">InputLocationMessageContent</a>
 * - <a href="#inputvenuemessagecontent">InputVenueMessageContent</a>
 * - <a href="#inputcontactmessagecontent">InputContactMessageContent</a>
 * - <a href="#inputinvoicemessagecontent">InputInvoiceMessageContent</a>
 */
export type InputMessageContent =
 | <a href="#inputtextmessagecontent">InputTextMessageContent</a>
 | <a href="#inputrichmessagecontent">InputRichMessageContent</a>
 | <a href="#inputlocationmessagecontent">InputLocationMessageContent</a>
 | <a href="#inputvenuemessagecontent">InputVenueMessageContent</a>
 | <a href="#inputcontactmessagecontent">InputContactMessageContent</a>
 | <a href="#inputinvoicemessagecontent">InputInvoiceMessageContent</a>
/**
 * Represents the <a href="#inputmessagecontent">content</a> of a text message to be sent as the result of an inline query.
 */
export interface InputTextMessageContent {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Text of the message to be sent, 1-4096 characters
   */
  message_text: string;
  /**
   * Mode for parsing entities in the message text. See <a href="#formatting-options">formatting options</a> for more details.
   */
  parse_mode?: string;
  /**
   * List of special entities that appear in message text, which can be specified instead of <em>parse_mode</em>
   */
  entities?: MessageEntity[];
  /**
   * Link preview generation options for the message
   */
  link_preview_options?: LinkPreviewOptions;
</tbody>
</table>
}
/**
 * Represents the <a href="#inputmessagecontent">content</a> of a rich message to be sent as the result of an inline query.
 */
export interface InputRichMessageContent {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The message to be sent
   */
  rich_message: InputRichMessage;
</tbody>
</table>
}
/**
 * Represents the <a href="#inputmessagecontent">content</a> of a location message to be sent as the result of an inline query.
 */
export interface InputLocationMessageContent {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Latitude of the location in degrees
   */
  latitude: number;
  /**
   * Longitude of the location in degrees
   */
  longitude: number;
  /**
   * The radius of uncertainty for the location, measured in meters; 0-1500
   */
  horizontal_accuracy?: number;
  /**
   * Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely
   */
  live_period?: number;
  /**
   * For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
   */
  heading?: number;
  /**
   * For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
   */
  proximity_alert_radius?: number;
</tbody>
</table>
}
/**
 * Represents the <a href="#inputmessagecontent">content</a> of a venue message to be sent as the result of an inline query.
 */
export interface InputVenueMessageContent {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Latitude of the venue in degrees
   */
  latitude: number;
  /**
   * Longitude of the venue in degrees
   */
  longitude: number;
  /**
   * Name of the venue
   */
  title: string;
  /**
   * Address of the venue
   */
  address: string;
  /**
   * Foursquare identifier of the venue, if known
   */
  foursquare_id?: string;
  /**
   * Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
   */
  foursquare_type?: string;
  /**
   * Google Places identifier of the venue
   */
  google_place_id?: string;
  /**
   * Google Places type of the venue. (See <a href="https://developers.google.com/places/web-service/supported_types">supported types</a>.)
   */
  google_place_type?: string;
</tbody>
</table>
}
/**
 * Represents the <a href="#inputmessagecontent">content</a> of a contact message to be sent as the result of an inline query.
 */
export interface InputContactMessageContent {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Contact&#39;s phone number
   */
  phone_number: string;
  /**
   * Contact&#39;s first name
   */
  first_name: string;
  /**
   * Contact&#39;s last name
   */
  last_name?: string;
  /**
   * Additional data about the contact in the form of a <a href="https://en.wikipedia.org/wiki/VCard">vCard</a>, 0-2048 bytes
   */
  vcard?: string;
</tbody>
</table>
}
/**
 * Represents the <a href="#inputmessagecontent">content</a> of an invoice message to be sent as the result of an inline query.
 */
export interface InputInvoiceMessageContent {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Product name, 1-32 characters
   */
  title: string;
  /**
   * Product description, 1-255 characters
   */
  description: string;
  /**
   * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
   */
  payload: string;
  /**
   * Payment provider token, obtained via <a href="https://t.me/botfather">@BotFather</a>. Pass an empty string for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  provider_token?: string;
  /**
   * Three-letter ISO 4217 currency code, see <a href="/bots/payments#supported-currencies">more on currencies</a>. Pass “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  currency: string;
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
  /**
   * The maximum accepted amount for tips in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). For example, for a maximum tip of <code>US$ 1.45</code> pass <code>max_tip_amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  max_tip_amount?: number;
  /**
   * A JSON-serialized Array of suggested amounts of tip in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed <em>max_tip_amount</em>.
   */
  suggested_tip_amounts?: number[];
  /**
   * A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider.
   */
  provider_data?: string;
  /**
   * URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.
   */
  photo_url?: string;
  /**
   * Photo size in bytes
   */
  photo_size?: number;
  /**
   * Photo width
   */
  photo_width?: number;
  /**
   * Photo height
   */
  photo_height?: number;
  /**
   * Pass <em>True</em> if you require the user&#39;s full name to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  need_name?: boolean;
  /**
   * Pass <em>True</em> if you require the user&#39;s phone number to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  need_phone_number?: boolean;
  /**
   * Pass <em>True</em> if you require the user&#39;s email address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  need_email?: boolean;
  /**
   * Pass <em>True</em> if you require the user&#39;s shipping address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  need_shipping_address?: boolean;
  /**
   * Pass <em>True</em> if the user&#39;s phone number should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  send_phone_number_to_provider?: boolean;
  /**
   * Pass <em>True</em> if the user&#39;s email address should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  send_email_to_provider?: boolean;
  /**
   * Pass <em>True</em> if the final price depends on the shipping method. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.
   */
  is_flexible?: boolean;
</tbody>
</table>
}
/**
 * Represents a <a href="#inlinequeryresult">result</a> of an inline query that was chosen by the user and sent to their chat partner.
 * 
 * <strong>Note:</strong> It is necessary to enable <a href="/bots/inline#collecting-feedback">inline feedback</a> via <a href="https://t.me/botfather">@BotFather</a> in order to receive these objects in updates.
 */
export interface ChosenInlineResult {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The unique identifier for the result that was chosen
   */
  result_id: string;
  /**
   * The user that chose the result
   */
  from: User;
  /**
   * Sender location, only for bots that require user location
   */
  location?: Location;
  /**
   * Identifier of the sent inline message. Available only if there is an <a href="#inlinekeyboardmarkup">inline keyboard</a> attached to the message. Will be also received in <a href="#callbackquery">callback queries</a> and can be used to <a href="#updating-messages">edit</a> the message.
   */
  inline_message_id?: string;
  /**
   * The query that was used to obtain the result
   */
  query: string;
</tbody>
</table>
}
// === PAYMENTS
<p>Your bot can accept payments from Telegram users. Please see the <a href="/bots/payments">introduction to payments</a> for more details on the process and how to set up payments for your bot.</p>
export interface ApiMethods {
  /**
   * Use this method to send invoices. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendInvoice(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot, supergroup or channel in the format <code>@username</code></td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>direct_messages_topic_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Yes</td>
<td>Product name, 1-32 characters</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Yes</td>
<td>Product description, 1-255 characters</td>
</tr>
<tr>
<td>payload</td>
<td>String</td>
<td>Yes</td>
<td>Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.</td>
</tr>
<tr>
<td>provider_token</td>
<td>String</td>
<td>Optional</td>
<td>Payment provider token, obtained via <a href="https://t.me/botfather">@BotFather</a>. Pass an empty string for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Yes</td>
<td>Three-letter ISO 4217 currency code, see <a href="/bots/payments#supported-currencies">more on currencies</a>. Pass “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>Yes</td>
<td>Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>max_tip_amount</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum accepted amount for tips in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). For example, for a maximum tip of <code>US$ 1.45</code> pass <code>max_tip_amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>suggested_tip_amounts</td>
<td>Array of Integer</td>
<td>Optional</td>
<td>A JSON-serialized Array of suggested amounts of tips in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed <em>max_tip_amount</em>.</td>
</tr>
<tr>
<td>start_parameter</td>
<td>String</td>
<td>Optional</td>
<td>Unique deep-linking parameter. If left empty, <strong>forwarded copies</strong> of the sent message will have a <em>Pay</em> button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a <em>URL</em> button with a deep link to the bot (instead of a <em>Pay</em> button), with the value used as the start parameter.</td>
</tr>
<tr>
<td>provider_data</td>
<td>String</td>
<td>Optional</td>
<td>JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.</td>
</tr>
<tr>
<td>photo_url</td>
<td>String</td>
<td>Optional</td>
<td>URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.</td>
</tr>
<tr>
<td>photo_size</td>
<td>Integer</td>
<td>Optional</td>
<td>Photo size in bytes</td>
</tr>
<tr>
<td>photo_width</td>
<td>Integer</td>
<td>Optional</td>
<td>Photo width</td>
</tr>
<tr>
<td>photo_height</td>
<td>Integer</td>
<td>Optional</td>
<td>Photo height</td>
</tr>
<tr>
<td>need_name</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s full name to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_phone_number</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s phone number to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_email</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s email address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_shipping_address</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s shipping address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_phone_number_to_provider</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the user&#39;s phone number should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_email_to_provider</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the user&#39;s email address should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>is_flexible</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the final price depends on the shipping method. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>suggested_post_parameters</td>
<td><a href="#suggestedpostparameters">SuggestedPostParameters</a></td>
<td>Optional</td>
<td>A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>. If empty, one &#39;Pay <code>total price</code>&#39; button will be shown. If not empty, the first button must be a Pay button.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to create a link for an invoice. Returns the created invoice link as <em>String</em> on success.
   */
  createInvoiceLink(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the link will be created. For payments in <a href="https://t.me/BotNews/90">Telegram Stars</a> only.</td>
</tr>
<tr>
<td>title</td>
<td>String</td>
<td>Yes</td>
<td>Product name, 1-32 characters</td>
</tr>
<tr>
<td>description</td>
<td>String</td>
<td>Yes</td>
<td>Product description, 1-255 characters</td>
</tr>
<tr>
<td>payload</td>
<td>String</td>
<td>Yes</td>
<td>Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.</td>
</tr>
<tr>
<td>provider_token</td>
<td>String</td>
<td>Optional</td>
<td>Payment provider token, obtained via <a href="https://t.me/botfather">@BotFather</a>. Pass an empty string for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>currency</td>
<td>String</td>
<td>Yes</td>
<td>Three-letter ISO 4217 currency code, see <a href="/bots/payments#supported-currencies">more on currencies</a>. Pass “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>Yes</td>
<td>Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>subscription_period</td>
<td>Integer</td>
<td>Optional</td>
<td>The number of seconds the subscription will be active for before the next payment. The currency must be set to “XTR” (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars.</td>
</tr>
<tr>
<td>max_tip_amount</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum accepted amount for tips in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). For example, for a maximum tip of <code>US$ 1.45</code> pass <code>max_tip_amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>suggested_tip_amounts</td>
<td>Array of Integer</td>
<td>Optional</td>
<td>A JSON-serialized Array of suggested amounts of tips in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed <em>max_tip_amount</em>.</td>
</tr>
<tr>
<td>provider_data</td>
<td>String</td>
<td>Optional</td>
<td>JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.</td>
</tr>
<tr>
<td>photo_url</td>
<td>String</td>
<td>Optional</td>
<td>URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.</td>
</tr>
<tr>
<td>photo_size</td>
<td>Integer</td>
<td>Optional</td>
<td>Photo size in bytes</td>
</tr>
<tr>
<td>photo_width</td>
<td>Integer</td>
<td>Optional</td>
<td>Photo width</td>
</tr>
<tr>
<td>photo_height</td>
<td>Integer</td>
<td>Optional</td>
<td>Photo height</td>
</tr>
<tr>
<td>need_name</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s full name to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_phone_number</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s phone number to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_email</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s email address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>need_shipping_address</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if you require the user&#39;s shipping address to complete the order. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_phone_number_to_provider</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the user&#39;s phone number should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>send_email_to_provider</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the user&#39;s email address should be sent to the provider. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
<tr>
<td>is_flexible</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the final price depends on the shipping method. Ignored for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * If you sent an invoice requesting a shipping address and the parameter <em>is_flexible</em> was specified, the Bot API will send an <a href="#update">Update</a> with a <em>shipping_query</em> field to the bot. Use this method to reply to shipping queries. On success, <em>True</em> is returned.
   */
  answerShippingQuery(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>shipping_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>ok</td>
<td>Boolean</td>
<td>Yes</td>
<td>Pass <em>True</em> if delivery to the specified address is possible and <em>False</em> if there are any problems (for example, if delivery to the specified address is not possible)</td>
</tr>
<tr>
<td>shipping_options</td>
<td>Array of <a href="#shippingoption">ShippingOption</a></td>
<td>Optional</td>
<td>Required if <em>ok</em> is <em>True</em>. A JSON-serialized Array of available shipping options.</td>
</tr>
<tr>
<td>error_message</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>ok</em> is <em>False</em>. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an <a href="#update">Update</a> with the field <em>pre_checkout_query</em>. Use this method to respond to such pre-checkout queries. On success, <em>True</em> is returned. <strong>Note:</strong> The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
   */
  answerPreCheckoutQuery(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>pre_checkout_query_id</td>
<td>String</td>
<td>Yes</td>
<td>Unique identifier for the query to be answered</td>
</tr>
<tr>
<td>ok</td>
<td>Boolean</td>
<td>Yes</td>
<td>Specify <em>True</em> if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use <em>False</em> if there are any problems.</td>
</tr>
<tr>
<td>error_message</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>ok</em> is <em>False</em>. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. &quot;Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!&quot;). Telegram will display this message to the user.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a <a href="#staramount">StarAmount</a> object.
   */
  getMyStarBalance(args: {}): never;
}
export interface ApiMethods {
  /**
   * Returns the bot&#39;s Telegram Star transactions in chronological order. On success, returns a <a href="#startransactions">StarTransactions</a> object.
   */
  getStarTransactions(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>offset</td>
<td>Integer</td>
<td>Optional</td>
<td>Number of transactions to skip in the response</td>
</tr>
<tr>
<td>limit</td>
<td>Integer</td>
<td>Optional</td>
<td>The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Refunds a successful payment in <a href="https://t.me/BotNews/90">Telegram Stars</a>. Returns <em>True</em> on success.
   */
  refundStarPayment(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the user whose payment will be refunded</td>
</tr>
<tr>
<td>telegram_payment_charge_id</td>
<td>String</td>
<td>Yes</td>
<td>Telegram payment identifier</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns <em>True</em> on success.
   */
  editUserStarSubscription(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Identifier of the user whose subscription will be edited</td>
</tr>
<tr>
<td>telegram_payment_charge_id</td>
<td>String</td>
<td>Yes</td>
<td>Telegram payment identifier for the subscription</td>
</tr>
<tr>
<td>is_canceled</td>
<td>Boolean</td>
<td>Yes</td>
<td>Pass <em>True</em> to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass <em>False</em> to allow the user to re-enable a subscription that was previously canceled by the bot.</td>
</tr>
</tbody>
</table>
  }): never;
}
/**
 * This object represents a portion of the price for goods or services.
 */
export interface LabeledPrice {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Portion label
   */
  label: string;
  /**
   * Price of the product in the <em>smallest units</em> of the <a href="/bots/payments#supported-currencies">currency</a> (integer, <strong>not</strong> float/double). For example, for a price of <code>US$ 1.45</code> pass <code>amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
   */
  amount: number;
</tbody>
</table>
}
/**
 * This object contains basic information about an invoice.
 */
export interface Invoice {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Product name
   */
  title: string;
  /**
   * Product description
   */
  description: string;
  /**
   * Unique bot deep-linking parameter that can be used to generate this invoice
   */
  start_parameter: string;
  /**
   * Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>
   */
  currency: string;
  /**
   * Total price in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). For example, for a price of <code>US$ 1.45</code> pass <code>amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
   */
  total_amount: number;
</tbody>
</table>
}
/**
 * This object represents a shipping address.
 */
export interface ShippingAddress {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Two-letter <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 alpha-2</a> country code
   */
  country_code: string;
  /**
   * State, if applicable
   */
  state: string;
  /**
   * City
   */
  city: string;
  /**
   * First line for the address
   */
  street_line1: string;
  /**
   * Second line for the address
   */
  street_line2: string;
  /**
   * Address post code
   */
  post_code: string;
</tbody>
</table>
}
/**
 * This object represents information about an order.
 */
export interface OrderInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * User name
   */
  name?: string;
  /**
   * User&#39;s phone number
   */
  phone_number?: string;
  /**
   * User email
   */
  email?: string;
  /**
   * User shipping address
   */
  shipping_address?: ShippingAddress;
</tbody>
</table>
}
/**
 * This object represents one shipping option.
 */
export interface ShippingOption {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Shipping option identifier
   */
  id: string;
  /**
   * Option title
   */
  title: string;
<tr>
<td>prices</td>
<td>Array of <a href="#labeledprice">LabeledPrice</a></td>
<td>List of price portions</td>
</tr>
</tbody>
</table>
}
/**
 * This object contains basic information about a successful payment. Note that if the buyer initiates a chargeback with the relevant payment provider following this transaction, the funds may be debited from your balance. This is outside of Telegram&#39;s control.
 */
export interface SuccessfulPayment {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>
   */
  currency: string;
  /**
   * Total price in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). For example, for a price of <code>US$ 1.45</code> pass <code>amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
   */
  total_amount: number;
  /**
   * Bot-specified invoice payload
   */
  invoice_payload: string;
  /**
   * Expiration date of the subscription, in Unix time; for recurring payments only
   */
  subscription_expiration_date?: number;
  /**
   * <em>True</em>, if the payment is a recurring payment for a subscription
   */
  is_recurring?: true;
  /**
   * <em>True</em>, if the payment is the first payment for a subscription
   */
  is_first_recurring?: true;
  /**
   * Identifier of the shipping option chosen by the user
   */
  shipping_option_id?: string;
  /**
   * Order information provided by the user
   */
  order_info?: OrderInfo;
  /**
   * Telegram payment identifier
   */
  telegram_payment_charge_id: string;
  /**
   * Provider payment identifier
   */
  provider_payment_charge_id: string;
</tbody>
</table>
}
/**
 * This object contains basic information about a refunded payment.
 */
export interface RefundedPayment {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>. Currently, always “XTR”.
   */
  currency: string;
  /**
   * Total refunded price in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). For example, for a price of <code>US$ 1.45</code>, <code>total_amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
   */
  total_amount: number;
  /**
   * Bot-specified invoice payload
   */
  invoice_payload: string;
  /**
   * Telegram payment identifier
   */
  telegram_payment_charge_id: string;
  /**
   * Provider payment identifier
   */
  provider_payment_charge_id?: string;
</tbody>
</table>
}
/**
 * This object contains information about an incoming shipping query.
 */
export interface ShippingQuery {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique query identifier
   */
  id: string;
  /**
   * User who sent the query
   */
  from: User;
  /**
   * Bot-specified invoice payload
   */
  invoice_payload: string;
  /**
   * User specified shipping address
   */
  shipping_address: ShippingAddress;
</tbody>
</table>
}
/**
 * This object contains information about an incoming pre-checkout query.
 */
export interface PreCheckoutQuery {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique query identifier
   */
  id: string;
  /**
   * User who sent the query
   */
  from: User;
  /**
   * Three-letter ISO 4217 <a href="/bots/payments#supported-currencies">currency</a> code, or “XTR” for payments in <a href="https://t.me/BotNews/90">Telegram Stars</a>
   */
  currency: string;
  /**
   * Total price in the <em>smallest units</em> of the currency (integer, <strong>not</strong> float/double). For example, for a price of <code>US$ 1.45</code> pass <code>amount = 145</code>. See the <em>exp</em> parameter in <a href="/bots/payments/currencies.json">currencies.json</a>, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
   */
  total_amount: number;
  /**
   * Bot-specified invoice payload
   */
  invoice_payload: string;
  /**
   * Identifier of the shipping option chosen by the user
   */
  shipping_option_id?: string;
  /**
   * Order information provided by the user
   */
  order_info?: OrderInfo;
</tbody>
</table>
}
/**
 * This object contains information about a paid media purchase.
 */
export interface PaidMediaPurchased {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * User who purchased the media
   */
  from: User;
  /**
   * Bot-specified paid media payload
   */
  paid_media_payload: string;
</tbody>
</table>
}
/**
 * This object describes the state of a revenue withdrawal operation. Currently, it can be one of
 *
 * - <a href="#revenuewithdrawalstatepending">RevenueWithdrawalStatePending</a>
 * - <a href="#revenuewithdrawalstatesucceeded">RevenueWithdrawalStateSucceeded</a>
 * - <a href="#revenuewithdrawalstatefailed">RevenueWithdrawalStateFailed</a>
 */
export type RevenueWithdrawalState =
 | <a href="#revenuewithdrawalstatepending">RevenueWithdrawalStatePending</a>
 | <a href="#revenuewithdrawalstatesucceeded">RevenueWithdrawalStateSucceeded</a>
 | <a href="#revenuewithdrawalstatefailed">RevenueWithdrawalStateFailed</a>
/**
 * The withdrawal is in progress.
 */
export interface RevenueWithdrawalStatePending {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the state, always “pending”
   */
  type: string;
</tbody>
</table>
}
/**
 * The withdrawal succeeded.
 */
export interface RevenueWithdrawalStateSucceeded {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the state, always “succeeded”
   */
  type: string;
  /**
   * Date the withdrawal was completed in Unix time
   */
  date: number;
  /**
   * An HTTPS URL that can be used to see transaction details
   */
  url: string;
</tbody>
</table>
}
/**
 * The withdrawal failed and the transaction was refunded.
 */
export interface RevenueWithdrawalStateFailed {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the state, always “failed”
   */
  type: string;
</tbody>
</table>
}
/**
 * Contains information about the affiliate that received a commission via this transaction.
 */
export interface AffiliateInfo {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * The bot or the user that received an affiliate commission if it was received by a bot or a user
   */
  affiliate_user?: User;
  /**
   * The chat that received an affiliate commission if it was received by a chat
   */
  affiliate_chat?: Chat;
  /**
   * The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users
   */
  commission_per_mille: number;
  /**
   * Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds
   */
  amount: number;
  /**
   * The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds
   */
  nanostar_amount?: number;
</tbody>
</table>
}
/**
 * This object describes the source of a transaction, or its recipient for outgoing transactions. Currently, it can be one of
 *
 * - <a href="#transactionpartneruser">TransactionPartnerUser</a>
 * - <a href="#transactionpartnerchat">TransactionPartnerChat</a>
 * - <a href="#transactionpartneraffiliateprogram">TransactionPartnerAffiliateProgram</a>
 * - <a href="#transactionpartnerfragment">TransactionPartnerFragment</a>
 * - <a href="#transactionpartnertelegramads">TransactionPartnerTelegramAds</a>
 * - <a href="#transactionpartnertelegramapi">TransactionPartnerTelegramApi</a>
 * - <a href="#transactionpartnerother">TransactionPartnerOther</a>
 */
export type TransactionPartner =
 | <a href="#transactionpartneruser">TransactionPartnerUser</a>
 | <a href="#transactionpartnerchat">TransactionPartnerChat</a>
 | <a href="#transactionpartneraffiliateprogram">TransactionPartnerAffiliateProgram</a>
 | <a href="#transactionpartnerfragment">TransactionPartnerFragment</a>
 | <a href="#transactionpartnertelegramads">TransactionPartnerTelegramAds</a>
 | <a href="#transactionpartnertelegramapi">TransactionPartnerTelegramApi</a>
 | <a href="#transactionpartnerother">TransactionPartnerOther</a>
/**
 * Describes a transaction with a user.
 */
export interface TransactionPartnerUser {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the transaction partner, always “user”
   */
  type: string;
  /**
   * Type of the transaction, currently one of “invoice_payment” for payments via invoices, “paid_media_payment” for payments for paid media, “gift_purchase” for gifts sent by the bot, “premium_purchase” for Telegram Premium subscriptions gifted by the bot, “business_account_transfer” for direct transfers from managed business accounts
   */
  transaction_type: string;
  /**
   * Information about the user
   */
  user: User;
  /**
   * Information about the affiliate that received a commission via this transaction. Can be available only for “invoice_payment” and “paid_media_payment” transactions.
   */
  affiliate?: AffiliateInfo;
  /**
   * Bot-specified invoice payload. Can be available only for “invoice_payment” transactions.
   */
  invoice_payload?: string;
  /**
   * The duration of the paid subscription. Can be available only for “invoice_payment” transactions.
   */
  subscription_period?: number;
  /**
   * Information about the paid media bought by the user; for “paid_media_payment” transactions only
   */
  paid_media?: PaidMedia[];
  /**
   * Bot-specified paid media payload. Can be available only for “paid_media_payment” transactions.
   */
  paid_media_payload?: string;
  /**
   * The gift sent to the user by the bot; for “gift_purchase” transactions only
   */
  gift?: Gift;
  /**
   * Number of months the gifted Telegram Premium subscription will be active for; for “premium_purchase” transactions only
   */
  premium_subscription_duration?: number;
</tbody>
</table>
}
/**
 * Describes a transaction with a chat.
 */
export interface TransactionPartnerChat {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the transaction partner, always “chat”
   */
  type: string;
  /**
   * Information about the chat
   */
  chat: Chat;
  /**
   * The gift sent to the chat by the bot
   */
  gift?: Gift;
</tbody>
</table>
}
/**
 * Describes the affiliate program that issued the affiliate commission received via this transaction.
 */
export interface TransactionPartnerAffiliateProgram {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the transaction partner, always “affiliate_program”
   */
  type: string;
  /**
   * Information about the bot that sponsored the affiliate program
   */
  sponsor_user?: User;
  /**
   * The number of Telegram Stars received by the bot for each 1000 Telegram Stars received by the affiliate program sponsor from referred users
   */
  commission_per_mille: number;
</tbody>
</table>
}
/**
 * Describes a withdrawal transaction with Fragment.
 */
export interface TransactionPartnerFragment {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the transaction partner, always “fragment”
   */
  type: string;
  /**
   * State of the transaction if the transaction is outgoing
   */
  withdrawal_state?: RevenueWithdrawalState;
</tbody>
</table>
}
/**
 * Describes a withdrawal transaction to the Telegram Ads platform.
 */
export interface TransactionPartnerTelegramAds {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the transaction partner, always “telegram_ads”
   */
  type: string;
</tbody>
</table>
}
/**
 * Describes a transaction with payment for <a href="#paid-broadcasts">paid broadcasting</a>.
 */
export interface TransactionPartnerTelegramApi {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the transaction partner, always “telegram_api”
   */
  type: string;
  /**
   * The number of successful requests that exceeded regular limits and were therefore billed
   */
  request_count: number;
</tbody>
</table>
}
/**
 * Describes a transaction with an unknown source or recipient.
 */
export interface TransactionPartnerOther {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Type of the transaction partner, always “other”
   */
  type: string;
</tbody>
</table>
}
/**
 * Describes a Telegram Star transaction. Note that if the buyer initiates a chargeback with the payment provider from whom they acquired Stars (e.g., Apple, Google) following this transaction, the refunded Stars will be deducted from the bot&#39;s balance. This is outside of Telegram&#39;s control.
 */
export interface StarTransaction {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with <em>SuccessfulPayment.telegram_payment_charge_id</em> for successful incoming payments from users.
   */
  id: string;
  /**
   * Integer amount of Telegram Stars transferred by the transaction
   */
  amount: number;
  /**
   * The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999
   */
  nanostar_amount?: number;
  /**
   * Date the transaction was created in Unix time
   */
  date: number;
  /**
   * Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions.
   */
  source?: TransactionPartner;
  /**
   * Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions.
   */
  receiver?: TransactionPartner;
</tbody>
</table>
}
/**
 * Contains a list of Telegram Star transactions.
 */
export interface StarTransactions {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>transactions</td>
<td>Array of <a href="#startransaction">StarTransaction</a></td>
<td>The list of transactions</td>
</tr>
</tbody>
</table>
}
// === TELEGRAM PASSPORT
<p><strong>Telegram Passport</strong> is a unified authorization method for services that require personal identification. Users can upload their documents once, then instantly share their data with services that require real-world ID (finance, ICOs, etc.). Please see the <a href="/passport">manual</a> for details.</p>
/**
 * Describes Telegram Passport data shared with the bot by the user.
 */
export interface PassportData {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>data</td>
<td>Array of <a href="#encryptedpassportelement">EncryptedPassportElement</a></td>
<td>Array with information about documents and other Telegram Passport elements that was shared with the bot</td>
</tr>
  /**
   * Encrypted credentials required to decrypt the data
   */
  credentials: EncryptedCredentials;
</tbody>
</table>
}
/**
 * This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don&#39;t exceed 10MB.
 */
export interface PassportFile {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Identifier for this file, which can be used to download or reuse the file
   */
  file_id: string;
  /**
   * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file.
   */
  file_unique_id: string;
  /**
   * File size in bytes
   */
  file_size: number;
  /**
   * Unix time when the file was uploaded
   */
  file_date: number;
</tbody>
</table>
}
/**
 * Describes documents or other Telegram Passport elements shared with the bot by the user.
 */
export interface EncryptedPassportElement {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Element type. One of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”, “phone_number”, “email”.
   */
  type: string;
  /**
   * Base64-encoded encrypted Telegram Passport element data provided by the user; available only for “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport” and “address” types. Can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.
   */
  data?: string;
  /**
   * User&#39;s verified phone number; available only for “phone_number” type
   */
  phone_number?: string;
  /**
   * User&#39;s verified email address; available only for “email” type
   */
  email?: string;
  /**
   * Array of encrypted files with documents provided by the user; available only for “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.
   */
  files?: PassportFile[];
  /**
   * Encrypted file with the front side of the document, provided by the user; available only for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.
   */
  front_side?: PassportFile;
  /**
   * Encrypted file with the reverse side of the document, provided by the user; available only for “driver_license” and “identity_card”. The file can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.
   */
  reverse_side?: PassportFile;
  /**
   * Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.
   */
  selfie?: PassportFile;
  /**
   * Array of encrypted files with translated versions of documents provided by the user; available if requested for “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying <a href="#encryptedcredentials">EncryptedCredentials</a>.
   */
  translation?: PassportFile[];
  /**
   * Base64-encoded element hash for using in <a href="#passportelementerrorunspecified">PassportElementErrorUnspecified</a>
   */
  hash: string;
</tbody>
</table>
}
/**
 * Describes data required for decrypting and authenticating <a href="#encryptedpassportelement">EncryptedPassportElement</a>. See the <a href="/passport#receiving-information">Telegram Passport Documentation</a> for a complete description of the data decryption and authentication processes.
 */
export interface EncryptedCredentials {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Base64-encoded encrypted JSON-serialized data with unique user&#39;s payload, data hashes and secrets required for <a href="#encryptedpassportelement">EncryptedPassportElement</a> decryption and authentication
   */
  data: string;
  /**
   * Base64-encoded data hash for data authentication
   */
  hash: string;
  /**
   * Base64-encoded secret, encrypted with the bot&#39;s public RSA key, required for data decryption
   */
  secret: string;
</tbody>
</table>
}
export interface ApiMethods {
  /**
   * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns <em>True</em> on success.
   *
   * Use this if the data submitted by the user doesn&#39;t satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
   */
  setPassportDataErrors(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier</td>
</tr>
<tr>
<td>errors</td>
<td>Array of <a href="#passportelementerror">PassportElementError</a></td>
<td>Yes</td>
<td>A JSON-serialized Array describing the errors</td>
</tr>
</tbody>
</table>
  }): never;
}
/**
 * This object represents an error in the Telegram Passport element which was submitted that should be resolved by the user. It should be one of:
 *
 * - <a href="#passportelementerrordatafield">PassportElementErrorDataField</a>
 * - <a href="#passportelementerrorfrontside">PassportElementErrorFrontSide</a>
 * - <a href="#passportelementerrorreverseside">PassportElementErrorReverseSide</a>
 * - <a href="#passportelementerrorselfie">PassportElementErrorSelfie</a>
 * - <a href="#passportelementerrorfile">PassportElementErrorFile</a>
 * - <a href="#passportelementerrorfiles">PassportElementErrorFiles</a>
 * - <a href="#passportelementerrortranslationfile">PassportElementErrorTranslationFile</a>
 * - <a href="#passportelementerrortranslationfiles">PassportElementErrorTranslationFiles</a>
 * - <a href="#passportelementerrorunspecified">PassportElementErrorUnspecified</a>
 */
export type PassportElementError =
 | <a href="#passportelementerrordatafield">PassportElementErrorDataField</a>
 | <a href="#passportelementerrorfrontside">PassportElementErrorFrontSide</a>
 | <a href="#passportelementerrorreverseside">PassportElementErrorReverseSide</a>
 | <a href="#passportelementerrorselfie">PassportElementErrorSelfie</a>
 | <a href="#passportelementerrorfile">PassportElementErrorFile</a>
 | <a href="#passportelementerrorfiles">PassportElementErrorFiles</a>
 | <a href="#passportelementerrortranslationfile">PassportElementErrorTranslationFile</a>
 | <a href="#passportelementerrortranslationfiles">PassportElementErrorTranslationFiles</a>
 | <a href="#passportelementerrorunspecified">PassportElementErrorUnspecified</a>
/**
 * Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field&#39;s value changes.
 */
export interface PassportElementErrorDataField {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>data</em>
   */
  source: string;
  /**
   * The section of the user&#39;s Telegram Passport which has the error, one of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”
   */
  type: string;
  /**
   * Name of the data field which has the error
   */
  field_name: string;
  /**
   * Base64-encoded data hash
   */
  data_hash: string;
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes.
 */
export interface PassportElementErrorFrontSide {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>front_side</em>
   */
  source: string;
  /**
   * The section of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”
   */
  type: string;
  /**
   * Base64-encoded hash of the file with the front side of the document
   */
  file_hash: string;
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes.
 */
export interface PassportElementErrorReverseSide {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>reverse_side</em>
   */
  source: string;
  /**
   * The section of the user&#39;s Telegram Passport which has the issue, one of “driver_license”, “identity_card”
   */
  type: string;
  /**
   * Base64-encoded hash of the file with the reverse side of the document
   */
  file_hash: string;
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes.
 */
export interface PassportElementErrorSelfie {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>selfie</em>
   */
  source: string;
  /**
   * The section of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”
   */
  type: string;
  /**
   * Base64-encoded hash of the file with the selfie
   */
  file_hash: string;
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes.
 */
export interface PassportElementErrorFile {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>file</em>
   */
  source: string;
  /**
   * The section of the user&#39;s Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
   */
  type: string;
  /**
   * Base64-encoded file hash
   */
  file_hash: string;
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes.
 */
export interface PassportElementErrorFiles {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>files</em>
   */
  source: string;
  /**
   * The section of the user&#39;s Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
   */
  type: string;
  /**
   * List of base64-encoded file hashes
   */
  file_hashes: string[];
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes.
 */
export interface PassportElementErrorTranslationFile {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>translation_file</em>
   */
  source: string;
  /**
   * Type of element of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
   */
  type: string;
  /**
   * Base64-encoded file hash
   */
  file_hash: string;
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change.
 */
export interface PassportElementErrorTranslationFiles {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>translation_files</em>
   */
  source: string;
  /**
   * Type of element of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
   */
  type: string;
  /**
   * List of base64-encoded file hashes
   */
  file_hashes: string[];
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
/**
 * Represents an issue in an unspecified place. The error is considered resolved when new data is added.
 */
export interface PassportElementErrorUnspecified {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Error source, must be <em>unspecified</em>
   */
  source: string;
  /**
   * Type of element of the user&#39;s Telegram Passport which has the issue
   */
  type: string;
  /**
   * Base64-encoded element hash
   */
  element_hash: string;
  /**
   * Error message
   */
  message: string;
</tbody>
</table>
}
// === GAMES
<p>Your bot can offer users <strong>HTML5 games</strong> to play solo or to compete against each other in groups and one-on-one chats. Create games via <a href="https://t.me/botfather">@BotFather</a> using the <em>/newgame</em> command. Please note that this kind of power requires responsibility: you will need to accept the terms for each game that your bots will be offering.</p>
<ul>
<li>Games are a new type of content on Telegram, represented by the <a href="#game">Game</a> and <a href="#inlinequeryresultgame">InlineQueryResultGame</a> objects.</li>
<li>Once you&#39;ve created a game via <a href="https://t.me/botfather">BotFather</a>, you can send games to chats as regular messages using the <a href="#sendgame">sendGame</a> method, or use <a href="#inline-mode">inline mode</a> with <a href="#inlinequeryresultgame">InlineQueryResultGame</a>.</li>
<li>If you send the game message without any buttons, it will automatically have a &#39;Play <em>GameName</em>&#39; button. When this button is pressed, your bot gets a <a href="#callbackquery">CallbackQuery</a> with the <em>game_short_name</em> of the requested game. You provide the correct URL for this particular user and the app opens the game in the in-app browser.</li>
<li>You can manually add multiple buttons to your game message. Please note that the first button in the first row <strong>must always</strong> launch the game, using the field <em>callback_game</em> in <a href="#inlinekeyboardbutton">InlineKeyboardButton</a>. You can add extra buttons according to taste: e.g., for a description of the rules, or to open the game&#39;s official community.</li>
<li>To make your game more attractive, you can upload a GIF animation that demonstrates the game to the users via <a href="https://t.me/botfather">BotFather</a> (see <a href="https://t.me/gamebot?game=lumberjack">Lumberjack</a> for example).</li>
<li>A game message will also display high scores for the current chat. Use <a href="#setgamescore">setGameScore</a> to post high scores to the chat with the game, add the <em>disable_edit_message</em> parameter to disable automatic update of the message with the current scoreboard.</li>
<li>Use <a href="#getgamehighscores">getGameHighScores</a> to get data for in-game high score tables.</li>
<li>You can also add an extra <a href="/bots/games#sharing-your-game-to-telegram-chats">sharing button</a> for users to share their best score to different chats.</li>
<li>For examples of what can be done using this new stuff, check the <a href="https://t.me/gamebot">@gamebot</a> and <a href="https://t.me/gamee">@gamee</a> bots.</li>
</ul>
export interface ApiMethods {
  /**
   * Use this method to send a game. On success, the sent <a href="#message">Message</a> is returned.
   */
  sendGame(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>business_connection_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the business connection on behalf of which the message will be sent</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer or String</td>
<td>Yes</td>
<td>Unique identifier for the target chat or username of the target bot in the format <code>@username</code>. Games can&#39;t be sent to channel direct messages chats and channel chats.</td>
</tr>
<tr>
<td>message_thread_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only</td>
</tr>
<tr>
<td>game_short_name</td>
<td>String</td>
<td>Yes</td>
<td>Short name of the game, serves as the unique identifier for the game. Set up your games via <a href="https://t.me/botfather">@BotFather</a>.</td>
</tr>
<tr>
<td>disable_notification</td>
<td>Boolean</td>
<td>Optional</td>
<td>Sends the message <a href="https://telegram.org/blog/channels-2-0#silent-messages">silently</a>. Users will receive a notification with no sound.</td>
</tr>
<tr>
<td>protect_content</td>
<td>Boolean</td>
<td>Optional</td>
<td>Protects the contents of the sent message from forwarding and saving</td>
</tr>
<tr>
<td>allow_paid_broadcast</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> to allow up to 1000 messages per second, ignoring <a href="https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once">broadcasting limits</a> for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot&#39;s balance.</td>
</tr>
<tr>
<td>message_effect_id</td>
<td>String</td>
<td>Optional</td>
<td>Unique identifier of the message effect to be added to the message; for private chats only</td>
</tr>
<tr>
<td>reply_parameters</td>
<td><a href="#replyparameters">ReplyParameters</a></td>
<td>Optional</td>
<td>Description of the message to reply to</td>
</tr>
<tr>
<td>reply_markup</td>
<td><a href="#inlinekeyboardmarkup">InlineKeyboardMarkup</a></td>
<td>Optional</td>
<td>A JSON-serialized object for an <a href="/bots/features#inline-keyboards">inline keyboard</a>. If empty, one &#39;Play game_title&#39; button will be shown. If not empty, the first button must launch the game.</td>
</tr>
</tbody>
</table>
  }): never;
}
/**
 * This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.
 */
export interface Game {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Title of the game
   */
  title: string;
  /**
   * Description of the game
   */
  description: string;
<tr>
<td>photo</td>
<td>Array of <a href="#photosize">PhotoSize</a></td>
<td>Photo that will be displayed in the game message in chats</td>
</tr>
  /**
   * Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls <a href="#setgamescore">setGameScore</a>, or manually edited using <a href="#editmessagetext">editMessageText</a>. 0-4096 characters.
   */
  text?: string;
  /**
   * Special entities that appear in <em>text</em>, such as usernames, URLs, bot commands, etc.
   */
  text_entities?: MessageEntity[];
  /**
   * Animation that will be displayed in the game message in chats. Upload via <a href="https://t.me/botfather">BotFather</a>.
   */
  animation?: Animation;
</tbody>
</table>
}
/**
 * A placeholder, currently holds no information. Use <a href="https://t.me/botfather">BotFather</a> to set up your game.
 */
export interface CallbackGame {}
export interface ApiMethods {
  /**
   * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the <a href="#message">Message</a> is returned, otherwise <em>True</em> is returned. Returns an error, if the new score is not greater than the user&#39;s current score in the chat and <em>force</em> is <em>False</em>.
   */
  setGameScore(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>User identifier</td>
</tr>
<tr>
<td>score</td>
<td>Integer</td>
<td>Yes</td>
<td>New score, must be non-negative</td>
</tr>
<tr>
<td>force</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters.</td>
</tr>
<tr>
<td>disable_edit_message</td>
<td>Boolean</td>
<td>Optional</td>
<td>Pass <em>True</em> if the game message should not be automatically edited to include the current scoreboard</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the sent message.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
</tbody>
</table>
  }): never;
}
export interface ApiMethods {
  /**
   * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of <a href="#gamehighscore">GameHighScore</a> objects.
   *
   * > This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.
   */
  getGameHighScores(args: {
<table class="table">
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>user_id</td>
<td>Integer</td>
<td>Yes</td>
<td>Target user id</td>
</tr>
<tr>
<td>chat_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Unique identifier for the target chat.</td>
</tr>
<tr>
<td>message_id</td>
<td>Integer</td>
<td>Optional</td>
<td>Required if <em>inline_message_id</em> is not specified. Identifier of the sent message.</td>
</tr>
<tr>
<td>inline_message_id</td>
<td>String</td>
<td>Optional</td>
<td>Required if <em>chat_id</em> and <em>message_id</em> are not specified. Identifier of the inline message.</td>
</tr>
</tbody>
</table>
  }): never;
}
/**
 * This object represents one row of the high scores table for a game.
 */
export interface GameHighScore {
<table class="table">
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  /**
   * Position in high score table for the game
   */
  position: number;
  /**
   * User
   */
  user: User;
  /**
   * Score
   */
  score: number;
</tbody>
</table>
}
<hr>
<p>And that&#39;s about all we&#39;ve got for now.<br>If you&#39;ve got any questions, please check out our <a href="/bots/faq"><strong>Bot FAQ »</strong></a></p>
</div>
</div>
</div>
</div>
</div>
</body>
</html>
