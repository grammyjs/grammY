// deno-lint-ignore-file no-empty-interface
import type { ChatAdministratorRights, User } from "./manage.ts";
import type { MaybeInaccessibleMessage } from "./message.ts";

/** This object represents one button of an inline keyboard. Exactly one of the optional fields must be used to specify type of the button. */
export interface InlineKeyboardMarkup {
    /** Array of button rows, each represented by an Array of InlineKeyboardButton objects */
    inline_keyboard: InlineKeyboardButton[][];
}

export declare namespace InlineKeyboardButton {
    interface AbstractInlineKeyboardButton {
        /** Label text on the button */
        text: string;
    }
    export interface UrlButton extends AbstractInlineKeyboardButton {
        /** HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings. */
        url: string;
    }
    export interface CallbackButton extends AbstractInlineKeyboardButton {
        /** Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes */
        callback_data: string;
    }
    export interface WebAppButton extends AbstractInlineKeyboardButton {
        /** Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a Telegram Business account. */
        web_app: WebAppInfo;
    }
    export interface LoginButton extends AbstractInlineKeyboardButton {
        /** An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. */
        login_url: LoginUrl;
    }
    export interface SwitchInlineButton extends AbstractInlineKeyboardButton {
        /** If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent on behalf of a Telegram Business account. */
        switch_inline_query: string;
    }
    export interface SwitchInlineCurrentChatButton
        extends AbstractInlineKeyboardButton {
        /** If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. Can be empty, in which case only the bot's username will be inserted.

    This offers a quick way for the user to open your bot in inline mode in the same chat – good for selecting something from multiple options. Not supported in channels and for messages sent on behalf of a Telegram Business account. */
        switch_inline_query_current_chat: string;
    }
    export interface SwitchInlineChosenChatButton
        extends AbstractInlineKeyboardButton {
        /** If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent on behalf of a Telegram Business account. */
        switch_inline_query_chosen_chat: SwitchInlineQueryChosenChat;
    }
    export interface CopyTextButtonButton extends AbstractInlineKeyboardButton {
        /** Description of the button that copies the specified text to the clipboard. */
        copy_text: CopyTextButton;
    }
    export interface GameButton extends AbstractInlineKeyboardButton {
        /** Description of the game that will be launched when the user presses the button.

    NOTE: This type of button must always be the first button in the first row. */
        callback_game: CallbackGame;
    }
    export interface PayButton extends AbstractInlineKeyboardButton {
        /** Specify True, to send a Pay button. Substrings “⭐” and “XTR” in the buttons's text will be replaced with a Telegram Star icon.

    NOTE: This type of button must always be the first button in the first row and can only be used in invoice messages. */
        pay: boolean;
    }
}

/** This object represents one button of an inline keyboard. You must use exactly one of the optional fields. */
export type InlineKeyboardButton =
    | InlineKeyboardButton.CallbackButton
    | InlineKeyboardButton.GameButton
    | InlineKeyboardButton.LoginButton
    | InlineKeyboardButton.PayButton
    | InlineKeyboardButton.SwitchInlineButton
    | InlineKeyboardButton.SwitchInlineCurrentChatButton
    | InlineKeyboardButton.SwitchInlineChosenChatButton
    | InlineKeyboardButton.CopyTextButtonButton
    | InlineKeyboardButton.UrlButton
    | InlineKeyboardButton.WebAppButton;

/** This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the Telegram Login Widget when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in.
Telegram apps support these buttons as of version 5.7. */
export interface LoginUrl {
    /** An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data.

  NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization. */
    url: string;
    /** New text of the button in forwarded messages. */
    forward_text?: string;
    /** Username of a bot, which will be used for user authorization. See Setting up a bot for more details. If not specified, the current bot's username will be assumed. The url's domain must be the same as the domain linked with the bot. See Linking your domain to the bot for more details. */
    bot_username?: string;
    /** Pass True to request the permission for your bot to send messages to the user. */
    request_write_access?: boolean;
}

/** This object represents an inline button that switches the current user to inline mode in a chosen chat, with an optional default inline query. */
export interface SwitchInlineQueryChosenChat {
    /** The default inline query to be inserted in the input field. If left empty, only the bot's username will be inserted */
    query?: string;
    /** True, if private chats with users can be chosen */
    allow_user_chats?: boolean;
    /** True, if private chats with bots can be chosen */
    allow_bot_chats?: boolean;
    /** True, if group and supergroup chats can be chosen */
    allow_group_chats?: boolean;
    /** True, if channel chats can be chosen */
    allow_channel_chats?: boolean;
}

/** A placeholder, currently holds no information. Use BotFather to set up your game. */
export interface CallbackGame {}

/** This object represents an incoming callback query from a callback button in an inline keyboard. If the button that originated the query was attached to a message sent by the bot, the field message will be present. If the button was attached to a message sent via the bot (in inline mode), the field inline_message_id will be present. Exactly one of the fields data or game_short_name will be present.

 NOTE: After the user presses a callback button, Telegram clients will display a progress bar until you call answerCallbackQuery. It is, therefore, necessary to react by calling answerCallbackQuery even if no notification to the user is needed (e.g., without specifying any of the optional parameters). */
export interface CallbackQuery {
    /** Unique identifier for this query */
    id: string;
    /** Sender */
    from: User;
    /** Message sent by the bot with the callback button that originated the query */
    message?: MaybeInaccessibleMessage;
    /** Identifier of the message sent via the bot in inline mode, that originated the query. */
    inline_message_id?: string;
    /** Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games. */
    chat_instance: string;
    /** Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data. */
    data?: string;
    /** Short name of a Game to be returned, serves as the unique identifier for the game */
    game_short_name?: string;
}

/** This object represents a custom keyboard with reply options (see Introduction to bots for details and examples). Not supported in channels and for messages sent on behalf of a Telegram Business account. */
export interface ReplyKeyboardMarkup {
    /** Array of button rows, each represented by an Array of KeyboardButton objects */
    keyboard: KeyboardButton[][];
    /** Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to false, in which case the custom keyboard can be hidden and opened with a keyboard icon. */
    is_persistent?: boolean;
    /** Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard. */
    resize_keyboard?: boolean;
    /** Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat – the user can press a special button in the input field to see the custom keyboard again. Defaults to false. */
    one_time_keyboard?: boolean;
    /** The placeholder to be shown in the input field when the keyboard is active; 1-64 characters */
    input_field_placeholder?: string;
    /** Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.

  Example: A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard. */
    selective?: boolean;
}

export declare namespace KeyboardButton {
    export interface CommonButton {
        /** Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed */
        text: string;
    }
    export interface RequestUsersButton extends CommonButton {
        /** If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a “users_shared” service message. Available in private chats only. */
        request_users: KeyboardButtonRequestUsers;
    }
    export interface RequestChatButton extends CommonButton {
        /** If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a “chat_shared” service message. Available in private chats only. */
        request_chat: KeyboardButtonRequestChat;
    }
    export interface RequestContactButton extends CommonButton {
        /** If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only. */
        request_contact: boolean;
    }
    export interface RequestLocationButton extends CommonButton {
        /** If True, the user's current location will be sent when the button is pressed. Available in private chats only. */
        request_location: boolean;
    }
    export interface RequestPollButton extends CommonButton {
        /** If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only. */
        request_poll: KeyboardButtonPollType;
    }
    export interface WebAppButton extends CommonButton {
        /** If specified, the described Web App will be launched when the button is pressed. The Web App will be able to send a “web_app_data” service message. Available in private chats only. */
        web_app: WebAppInfo;
    }
}

/** This object represents one button of the reply keyboard. At most one of the optional fields must be used to specify type of the button. For simple text buttons, String can be used instead of this object to specify the button text. */
export type KeyboardButton =
    | KeyboardButton.CommonButton
    | KeyboardButton.RequestUsersButton
    | KeyboardButton.RequestChatButton
    | KeyboardButton.RequestContactButton
    | KeyboardButton.RequestLocationButton
    | KeyboardButton.RequestPollButton
    | KeyboardButton.WebAppButton
    | string;

/** This object represents type of a poll, which is allowed to be created and sent when the corresponding button is pressed. */
export interface KeyboardButtonPollType {
    /** If quiz is passed, the user will be allowed to create only polls in the quiz mode. If regular is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type. */
    type?: "quiz" | "regular";
}

/** Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see ReplyKeyboardMarkup). Not supported in channels and for messages sent on behalf of a Telegram Business account. */
export interface ReplyKeyboardRemove {
    /** Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in ReplyKeyboardMarkup) */
    remove_keyboard: true;
    /** Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.

  Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet. */
    selective?: boolean;
}

/** Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice privacy mode. Not supported in channels and for messages sent on behalf of a Telegram Business account.

Example: A poll bot for groups runs in privacy mode (only receives commands, replies to its messages and mentions). There could be two ways to create a new poll:

Explain the user how to send a command with parameters (e.g. /newpoll question answer1 answer2). May be appealing for hardcore users but lacks modern day polish.

Guide the user through a step-by-step process. 'Please send me your question', 'Cool, now let's add the first answer option', 'Great. Keep adding answer options, then send /done when you're ready'.

The last option is definitely more attractive. And if you use ForceReply in your bot's questions, it will receive the user's answers even if it only receives replies, commands and mentions - without any extra work for the user. */
export interface ForceReply {
    /** Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply' */
    force_reply: true;
    /** The placeholder to be shown in the input field when the reply is active; 1-64 characters */
    input_field_placeholder?: string;
    /** Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. */
    selective?: boolean;
}

/** This object represents an inline keyboard button that copies specified text to the clipboard. */
export interface CopyTextButton {
    /** The text to be copied to the clipboard; 1-256 characters */
    text: string;
}

/** Describes a Web App. */
export interface WebAppInfo {
    /** An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps */
    url: string;
}

/** This object defines the criteria used to request suitable users. Information about the selected users will be shared with the bot when the corresponding button is pressed. */
export interface KeyboardButtonRequestUsers {
    /** Signed 32-bit identifier of the request that will be received back in the UsersShared object. Must be unique within the message */
    request_id: number;
    /** Pass True to request bots, pass False to request regular users. If not specified, no additional restrictions are applied. */
    user_is_bot?: boolean;
    /** Pass True to request premium users, pass False to request non-premium users. If not specified, no additional restrictions are applied. */
    user_is_premium?: boolean;
    /** The maximum number of users to be selected; 1-10. Defaults to 1. */
    max_quantity?: number;
    /** Pass True to request the users' first and last names */
    request_name?: boolean;
    /** Pass True to request the users' usernames */
    request_username?: boolean;
    /** Pass True to request the users' photos */
    request_photo?: boolean;
}

/** This object defines the criteria used to request a suitable chat. Information about the selected chat will be shared with the bot when the corresponding button is pressed. The bot will be granted requested rights in the chat if appropriate. */
export interface KeyboardButtonRequestChat {
    /** Signed 32-bit identifier of the request, which will be received back in the ChatShared object. Must be unique within the message */
    request_id: number;
    /** Pass True to request a channel chat, pass False to request a group or a supergroup chat. */
    chat_is_channel: boolean;
    /** Pass True to request a forum supergroup, pass False to request a non-forum chat. If not specified, no additional restrictions are applied. */
    chat_is_forum?: boolean;
    /** Pass True to request a supergroup or a channel with a username, pass False to request a chat without a username. If not specified, no additional restrictions are applied. */
    chat_has_username?: boolean;
    /** Pass True to request a chat owned by the user. Otherwise, no additional restrictions are applied. */
    chat_is_created?: boolean;
    /** An object listing the required administrator rights of the user in the chat. The rights must be a superset of bot_administrator_rights. If not specified, no additional restrictions are applied. */
    user_administrator_rights?: ChatAdministratorRights;
    /** An object listing the required administrator rights of the bot in the chat. The rights must be a subset of user_administrator_rights. If not specified, no additional restrictions are applied. */
    bot_administrator_rights?: ChatAdministratorRights;
    /** Pass True to request a chat with the bot as a member. Otherwise, no additional restrictions are applied. */
    bot_is_member?: boolean;
    /** Pass True to request the chat's title */
    request_title?: boolean;
    /** Pass True to request the chat's username */
    request_username?: boolean;
    /** Pass True to request the chat's photo */
    request_photo?: boolean;
}
