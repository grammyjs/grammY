import {
    type InlineKeyboardButton,
    type KeyboardButton,
    type LoginUrl,
} from "../types.ts";

/**
 * Use this class to simplify building a custom keyboard (something like this:
 * https://core.telegram.org/bots#keyboards).
 *
 * ```ts
 * // Build a custom keyboard:
 * const keyboard = new Keyboard()
 *   .text('A').text('B').row()
 *   .text('C').text('D')
 *
 * // Now you can either pass it directly:
 * await ctx.reply('Here is your custom keyboard!', {
 *   reply_markup: keyboard
 * })
 * // Or if you need to specify more options in `reply_markup`:
 * await ctx.reply('Here is your custom keyboard!', {
 *   reply_markup: {
 *     keyboard: keyboard.build(), // note the `build` call
 *     one_time_keyboard: true,
 *   }
 * })
 * ```
 *
 * Be sure to check out the
 * [documentation](https://grammy.dev/plugins/keyboard.html#custom-keyboards) on
 * custom keyboards in grammY.
 */
export class Keyboard {
    /**
     * Show the current keyboard only to those users that are mentioned in the
     * text of the message object.
     */
    public selective?: boolean;
    /**
     * Hide the keyboard after a button is pressed.
     */
    public one_time_keyboard?: boolean;
    /**
     * Resize the current keyboard according to its buttons. Usually, this will
     * make the keyboard smaller.
     */
    public resize_keyboard?: boolean;
    /**
     * Placeholder to be shown in the input field when the keyboard is active.
     */
    public input_field_placeholder?: string;

    /**
     * Initialize a new `Keyboard` with an optional two-dimensional array of
     * `KeyboardButton` objects. This is the nested array that holds the custom
     * keyboard. It will be extended every time you call one of the provided
     * methods.
     *
     * @param keyboard The initial custom keyboard
     */
    constructor(public readonly keyboard: KeyboardButton[][] = [[]]) {
    }
    /**
     * Allows you to add your own `KeyboardButton` objects if you already have
     * them for some reason. You most likely want to call one of the other
     * methods.
     *
     * @param buttons The buttons to add
     */
    add(...buttons: KeyboardButton[]) {
        this.keyboard[this.keyboard.length - 1]?.push(...buttons);
        return this;
    }
    /**
     * Adds a 'line break'. Call this method to make sure that the next added
     * buttons will be on a new row.
     *
     * You may pass a number of `KeyboardButton` objects if you already have the
     * instances for some reason. You most likely don't want to pass any
     * arguments to `row`.
     *
     * @param buttons A number of buttons to add to the next row
     */
    row(...buttons: KeyboardButton[]) {
        this.keyboard.push(buttons);
        return this;
    }
    /**
     * Adds a new text button. This button will simply send the given text as a
     * text message back to your bot if a user clicks on it.
     *
     * @param text The text to display
     */
    text(text: string) {
        return this.add({ text });
    }
    /**
     * Adds a new contact request button. The user's phone number will be sent
     * as a contact when the button is pressed. Available in private chats only.
     *
     * @param text The text to display
     */
    requestContact(text: string) {
        return this.add({ text, request_contact: true });
    }
    /**
     * Adds a new location request button. The user's current location will be
     * sent when the button is pressed. Available in private chats only.
     *
     * @param text The text to display
     */
    requestLocation(text: string) {
        return this.add({ text, request_location: true });
    }
    /**
     * Adds a new poll request button. The user will be asked to create a poll
     * and send it to the bot when the button is pressed. Available in private
     * chats only.
     *
     * @param text The text to display
     * @param type The type of permitted polls to create, omit if the user may send a poll of any type
     */
    requestPoll(text: string, type?: "quiz" | "regular") {
        return this.add({ text, request_poll: { type } });
    }
    /**
     * Adds a new web app button. The Web App that will be launched when the
     * user presses the button. The Web App will be able to send a
     * “web_app_data” service message. Available in private chats only.
     *
     * @param text Text text to display
     * @param url An HTTPS URL of a Web App to be opened with additional data
     */
    webApp(text: string, url: string) {
        return this.add({ text, web_app: { url } });
    }
    /**
     * Make the current keyboard selective. See
     * https://grammy.dev/plugins/keyboard.html#selectively-send-custom-keyboards
     * for more details.
     *
     * Keyboards are non-selective by default, use this function to enable it
     * (without any parameters or pass `true`). Pass `false` to force the
     * keyboard to be non-selective.
     *
     * @param isEnabled `true` if the keyboard should be selective, and `false` otherwise
     */
    selected(isEnabled = true) {
        this.selective = isEnabled;
        return this;
    }
    /**
     * Make the current keyboard one-time. See
     * https://grammy.dev/plugins/keyboard.html#one-time-custom-keyboards for
     * more details.
     *
     * Keyboards are non-one-time by default, use this function to enable it
     * (without any parameters or pass `true`). Pass `false` to force the
     * keyboard to be non-one-time.
     *
     * @param isEnabled `true` if the keyboard should be one-time, and `false` otherwise
     */
    oneTime(isEnabled = true) {
        this.one_time_keyboard = isEnabled;
        return this;
    }
    /**
     * Make the current keyboard resized. See
     * https://grammy.dev/plugins/keyboard.html#resize-custom-keyboard for more
     * details.
     *
     * Keyboards are non-resized by default, use this function to enable it
     * (without any parameters or pass `true`). Pass `false` to force the
     * keyboard to be non-resized.
     *
     * @param isEnabled `true` if the keyboard should be resized, and `false` otherwise
     */
    resized(isEnabled = true) {
        this.resize_keyboard = isEnabled;
        return this;
    }
    /**
     * Set the current keyboard's input field placeholder. See
     * https://grammy.dev/plugins/keyboard.html#input-field-placeholder for more
     * details.
     *
     * @param value The placeholder text
     */
    placeholder(value: string) {
        this.input_field_placeholder = value;
        return this;
    }
    /**
     * Return the resulting custom keyboard that was built. May be called in the
     * end if necessary so you can specify more options in `reply_markup`.
     */
    build() {
        return this.keyboard;
    }
}

/**
 * Use this class to simplify building an inline keyboard (something like this:
 * https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating).
 *
 * ```ts
 * // Build an inline keyboard:
 * const keyboard = new InlineKeyboard()
 *   .text('A').text('B', 'callback-data').row()
 *   .text('C').text('D').row()
 *   .url('Telegram', 'telegram.org')
 *
 * // Send the keyboard:
 * await ctx.reply('Here is your inline keyboard!', {
 *   reply_markup: keyboard
 * })
 * ```
 *
 * Be sure to to check the
 * [documentation](https://grammy.dev/plugins/keyboard.html#inline-keyboards) on
 * inline keyboards in grammY.
 */
export class InlineKeyboard {
    /**
     * Initialize a new `InlineKeyboard` with an optional two-dimensional array
     * of `InlineKeyboardButton` objects. This is the nested array that holds
     * the inline keyboard. It will be extended every time you call one of the
     * provided methods.
     *
     * @param inline_keyboard The initial inline keyboard
     */
    constructor(
        public readonly inline_keyboard: InlineKeyboardButton[][] = [[]],
    ) {}
    /**
     * Allows you to add your own `InlineKeyboardButton` objects if you already
     * have them for some reason. You most likely want to call one of the other
     * methods.
     *
     * @param buttons The buttons to add
     */
    add(...buttons: InlineKeyboardButton[]) {
        this.inline_keyboard[this.inline_keyboard.length - 1]?.push(...buttons);
        return this;
    }
    /**
     * Adds a 'line break'. Call this method to make sure that the next added
     * buttons will be on a new row.
     *
     * You may pass a number of `InlineKeyboardButton` objects if you already
     * have the instances for some reason. You most likely don't want to pass
     * any arguments to `row`.
     *
     * @param buttons A number of buttons to add to the next row
     */
    row(...buttons: InlineKeyboardButton[]) {
        this.inline_keyboard.push(buttons);
        return this;
    }
    /**
     * Adds a new URL button. Telegram clients will open the provided URL when
     * the button is pressed.
     *
     * @param text The text to display
     * @param url HTTP or tg:// url to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their ID without using a username, if this is allowed by their privacy settings.
     */
    url(text: string, url: string) {
        return this.add({ text, url });
    }
    /**
     * Adds a new callback query button. The button contains a text and a custom
     * payload. This payload will be sent back to your bot when the button is
     * pressed. If you omit the payload, the display text will be sent back to
     * your bot.
     *
     * Your bot will receive an update every time a user presses any of the text
     * buttons. You can listen to these updates like this:
     * ```ts
     * // Specific buttons:
     * bot.callbackQuery('button-data', ctx => { ... })
     * // Any button of any inline keyboard:
     * bot.on('callback_query:data',    ctx => { ... })
     * ```
     *
     * @param text The text to display
     * @param data The callback data to send back to your bot (default = text)
     */
    text(text: string, data = text) {
        return this.add({ text, callback_data: data });
    }
    /**
     * Adds a new web app button, confer https://core.telegram.org/bots/webapps
     *
     * @param text The text to display
     * @param url An HTTPS URL of a Web App to be opened with additional data
     */
    webApp(text: string, url: string) {
        return this.add({ text, web_app: { url } });
    }
    /**
     * Adds a new login button. This can be used as a replacement for the
     * Telegram Login Widget. You must specify an HTTPS URL used to
     * automatically authorize the user.
     *
     * @param text The text to display
     * @param loginUrl The login URL as string or `LoginUrl` object
     */
    login(text: string, loginUrl: string | LoginUrl) {
        return this.add({
            text,
            login_url: typeof loginUrl === "string"
                ? { url: loginUrl }
                : loginUrl,
        });
    }
    /**
     * Adds a new inline query button. Telegram clients will let the user pick a
     * chat when this button is pressed. This will start an inline query. The
     * selected chat will be prefilled with the name of your bot. You may
     * provide a text that is specified along with it.
     *
     * Your bot will in turn receive updates for inline queries. You can listen
     * to inline query updates like this:
     * ```ts
     * bot.on('inline_query', ctx => { ... })
     * ```
     *
     * @param text The text to display
     * @param query The (optional) inline query string to prefill
     */
    switchInline(text: string, query = "") {
        return this.add({ text, switch_inline_query: query });
    }
    /**
     * Adds a new inline query button that act on the current chat. The selected
     * chat will be prefilled with the name of your bot. You may provide a text
     * that is specified along with it. This will start an inline query.
     *
     * Your bot will in turn receive updates for inline queries. You can listen
     * to inline query updates like this:
     * ```ts
     * bot.on('inline_query', ctx => { ... })
     * ```
     *
     * @param text The text to display
     * @param query The (optional) inline query string to prefill
     */
    switchInlineCurrent(text: string, query = "") {
        return this.add({ text, switch_inline_query_current_chat: query });
    }
    /**
     * Adds a new game query button, confer
     * https://core.telegram.org/bots/api#games
     *
     * This type of button must always be the first button in the first row.
     *
     * @param text The text to display
     */
    game(text: string) {
        return this.add({ text, callback_game: {} });
    }
    /**
     * Adds a new payment button, confer
     * https://core.telegram.org/bots/api#payments
     *
     * This type of button must always be the first button in the first row and
     * can only be used in invoice messages.
     *
     * @param text The text to display
     */
    pay(text: string) {
        return this.add({ text, pay: true });
    }
}
