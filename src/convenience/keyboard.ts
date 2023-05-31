import {
    type InlineKeyboardButton,
    type KeyboardButton,
    type KeyboardButtonPollType,
    type KeyboardButtonRequestChat,
    type KeyboardButtonRequestUser,
    type LoginUrl,
    type ReplyKeyboardMarkup,
    type SwitchInlineQueryChosenChat,
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
 * // Now you send it like so:
 * await ctx.reply('Here is your custom keyboard!', {
 *   reply_markup: keyboard
 * })
 * ```
 *
 * If you already have an array of elements which you would like to turn into a
 * keyboard, you can use the static equivalents which every button has. This
 * will create a two-dimensional keyboard button array. The resulting array can
 * be turned into a keyboard instance.
 *
 * ```ts
 * // Data source:
 * const data = [['a', 'b'], ['c', 'd']]
 *
 * // Build a custom keyboard:
 * const keyboard = Keyboard.from(data.map(row => row.map(Keyboard.text)))
 *
 * // Now you send it like so:
 * await ctx.reply('Here is your custom keyboard!', {
 *   reply_markup: keyboard
 * })
 * ```
 *
 * Be sure to check out the
 * [documentation](https://grammy.dev/plugins/keyboard.html#custom-keyboards) on
 * custom keyboards in grammY.
 */
export class Keyboard {
    /**
     * Requests clients to always show the keyboard when the regular keyboard is
     * hidden. Defaults to false, in which case the custom keyboard can be
     * hidden and opened with a keyboard icon.
     */
    public is_persistent?: boolean;
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
     * @param keyboard An optional initial two-dimensional button array
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
        return this.add(Keyboard.text(text));
    }
    /**
     * Creates a new text button. This button will simply send the given text as
     * a text message back to your bot if a user clicks on it.
     *
     * @param text The text to display
     */
    static text(text: string): KeyboardButton.CommonButton {
        return { text };
    }
    /**
     * Adds a new request user button. When the user presses the button, a list
     * of suitable users will be opened. Tapping on any user will send their
     * identifier to the bot in a “user_shared” service message. Available in
     * private chats only.
     *
     * @param text The text to display
     * @param requestId A signed 32-bit identifier of the request
     * @param options Options object for further requirements
     */
    requestUser(
        text: string,
        requestId: number,
        options: Omit<KeyboardButtonRequestUser, "request_id"> = {},
    ) {
        return this.add(Keyboard.requestUser(text, requestId, options));
    }
    /**
     * Creates a new request user button. When the user presses the button, a
     * list of suitable users will be opened. Tapping on any user will send
     * their identifier to the bot in a “user_shared” service message. Available
     * in private chats only.
     *
     * @param text The text to display
     * @param requestId A signed 32-bit identifier of the request
     * @param options Options object for further requirements
     */
    static requestUser(
        text: string,
        requestId: number,
        options: Omit<KeyboardButtonRequestUser, "request_id"> = {},
    ): KeyboardButton.RequestUserButton {
        return { text, request_user: { request_id: requestId, ...options } };
    }
    /**
     * Adds a new request chat button. When the user presses the button, a list
     * of suitable users will be opened. Tapping on a chat will send its
     * identifier to the bot in a “chat_shared” service message. Available in
     * private chats only.
     *
     * @param text The text to display
     * @param requestId A signed 32-bit identifier of the request
     * @param options Options object for further requirements
     */
    requestChat(
        text: string,
        requestId: number,
        options: Omit<KeyboardButtonRequestChat, "request_id"> = {
            chat_is_channel: false,
        },
    ) {
        return this.add(Keyboard.requestChat(text, requestId, options));
    }
    /**
     * Creates a new request chat button. When the user presses the button, a
     * list of suitable users will be opened. Tapping on a chat will send its
     * identifier to the bot in a “chat_shared” service message. Available in
     * private chats only.
     *
     * @param text The text to display
     * @param requestId A signed 32-bit identifier of the request
     * @param options Options object for further requirements
     */
    static requestChat(
        text: string,
        requestId: number,
        options: Omit<KeyboardButtonRequestChat, "request_id"> = {
            chat_is_channel: false,
        },
    ): KeyboardButton.RequestChatButton {
        return { text, request_chat: { request_id: requestId, ...options } };
    }
    /**
     * Adds a new contact request button. The user's phone number will be sent
     * as a contact when the button is pressed. Available in private chats only.
     *
     * @param text The text to display
     */
    requestContact(text: string) {
        return this.add(Keyboard.requestContact(text));
    }
    /**
     * Creates a new contact request button. The user's phone number will be
     * sent as a contact when the button is pressed. Available in private chats
     * only.
     *
     * @param text The text to display
     */
    static requestContact(text: string): KeyboardButton.RequestContactButton {
        return { text, request_contact: true };
    }
    /**
     * Adds a new location request button. The user's current location will be
     * sent when the button is pressed. Available in private chats only.
     *
     * @param text The text to display
     */
    requestLocation(text: string) {
        return this.add(Keyboard.requestLocation(text));
    }
    /**
     * Creates a new location request button. The user's current location will
     * be sent when the button is pressed. Available in private chats only.
     *
     * @param text The text to display
     */
    static requestLocation(text: string): KeyboardButton.RequestLocationButton {
        return { text, request_location: true };
    }
    /**
     * Adds a new poll request button. The user will be asked to create a poll
     * and send it to the bot when the button is pressed. Available in private
     * chats only.
     *
     * @param text The text to display
     * @param type The type of permitted polls to create, omit if the user may
     * send a poll of any type
     */
    requestPoll(text: string, type?: KeyboardButtonPollType["type"]) {
        return this.add(Keyboard.requestPoll(text, type));
    }
    /**
     * Creates a new poll request button. The user will be asked to create a
     * poll and send it to the bot when the button is pressed. Available in
     * private chats only.
     *
     * @param text The text to display
     * @param type The type of permitted polls to create, omit if the user may
     * send a poll of any type
     */
    static requestPoll(
        text: string,
        type?: KeyboardButtonPollType["type"],
    ): KeyboardButton.RequestPollButton {
        return { text, request_poll: { type } };
    }
    /**
     * Adds a new web app button. The Web App that will be launched when the
     * user presses the button. The Web App will be able to send a
     * “web_app_data” service message. Available in private chats only.
     *
     * @param text The text to display
     * @param url An HTTPS URL of a Web App to be opened with additional data
     */
    webApp(text: string, url: string) {
        return this.add(Keyboard.webApp(text, url));
    }
    /**
     * Adds a new web app button. The Web App that will be launched when the
     * user presses the button. The Web App will be able to send a
     * “web_app_data” service message. Available in private chats only.
     *
     * @param text The text to display
     * @param url An HTTPS URL of a Web App to be opened with additional data
     */
    static webApp(text: string, url: string): KeyboardButton.WebAppButton {
        return { text, web_app: { url } };
    }
    /**
     * Make the current keyboard persistent. See
     * https://grammy.dev/plugins/keyboard.html#persistent-keyboards for more
     * details.
     *
     * Keyboards are not persistent by default, use this function to enable it
     * (without any parameters or pass `true`). Pass `false` to force the
     * keyboard to not persist.
     *
     * @param isEnabled `true` if the keyboard should persist, and `false` otherwise
     */
    persistent(isEnabled = true) {
        this.is_persistent = isEnabled;
        return this;
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
     * Flips the rows and columns by modifying this keyboard.
     *
     * Note that buttons can only span multiple columns, but never multiple
     * rows. This means that if the given arrays have different lengths, some
     * buttons might flow up in the layout. In these cases, transposing a
     * keyboard a second time will not undo the first transposition.
     *
     * Here are some examples.
     *
     * ```
     * original    transposed
     * [a]      ~> [a]
     *
     *             [a]
     * [a b c]  ~> [b]
     *             [c]
     *
     * [a b]       [a c e]
     * [c d]    ~> [ b d ]
     * [ e ]
     *
     * [ a b ]     [a c d]
     * [  c  ]  ~> [ b e ]
     * [d e f]     [  f  ]
     * ```
     */
    transpose() {
        const original = this.keyboard;
        const transposed: KeyboardButton[][] = [];
        for (let i = 0; i < original.length; i++) {
            const row = original[i];
            for (let j = 0; j < row.length; j++) {
                const button = row[j];
                (transposed[j] ??= []).push(button);
            }
        }
        original.length = transposed.length;
        for (let i = 0; i < transposed.length; i++) {
            original[i] = transposed[i];
        }
        return this;
    }
    /**
     * Reflows the keyboard in-place into a given number of columns (default: 4)
     * as if the buttons were text elements. Optionally, you can specify how
     * many buttons should be on the first column.
     *
     * This method is idempotent, so calling it a second time will have no
     * effect.
     *
     * Here are some examples.
     *
     * ```
     * original    reflowed
     * [a]      ~> [a]         (4 columns)
     *
     *             [a]
     * [a b c]  ~> [b]         (1 column)
     *             [c]
     *
     * [a b]       [a b c]
     * [c d]    ~> [ d e ]     (3 columns)
     * [ e ]
     *
     * [ a b ]     [a b c d e]
     * [  c  ]  ~> [    f    ] (5 columns)
     * [d e f]
     *
     * [a b c]     [  a  ]
     * [d e f]  ~> [b c d]     (3 colums, 1 on first row)
     * [g h i]     [e f g]
     * [  j  ]     [h i j]
     * ```
     *
     * @param columns Maximum number of buttons per row
     * @param options Optional option for the first row
     */
    reflow(columns = 4, options = { first: columns }) {
        const original = this.keyboard;
        const reflowed: KeyboardButton[][] = [[]];
        for (let i = 0; i < original.length; i++) {
            const row = original[i];
            for (let j = 0; j < row.length; j++) {
                const button = row[j];
                const at = reflowed.length - 1;
                const max = at === 0 ? options.first : columns;
                let next = (reflowed[at] ??= []);
                if (next.length === max) {
                    next = [];
                    reflowed.push(next);
                }
                next.push(button);
            }
        }
        original.length = reflowed.length;
        for (let i = 0; i < reflowed.length; i++) {
            original[i] = reflowed[i];
        }
        return this;
    }
    /**
     * Creates and returns a deep copy of this keyboard.
     */
    clone() {
        const clone = new Keyboard(this.keyboard.map((row) => row.slice()));
        clone.is_persistent = this.is_persistent;
        clone.selective = this.selective;
        clone.one_time_keyboard = this.one_time_keyboard;
        clone.resize_keyboard = this.resize_keyboard;
        clone.input_field_placeholder = this.input_field_placeholder;
        return clone;
    }
    /**
     * Appends the buttons of the given keyboards to this keyboard. If other
     * options are given in these keyboards, they will override our options.
     *
     * @param keyboards A number of keyboards to append
     */
    append(...keyboards: Keyboard[]) {
        for (const keyboard of keyboards) {
            this.keyboard.push(...keyboard.keyboard.map((row) => row.slice()));
            this.is_persistent = keyboard.is_persistent ??
                this.is_persistent;
            this.selective = keyboard.selective ??
                this.selective;
            this.one_time_keyboard = keyboard.one_time_keyboard ??
                this.one_time_keyboard;
            this.resize_keyboard = keyboard.resize_keyboard ??
                this.resize_keyboard;
            this.input_field_placeholder = keyboard.input_field_placeholder ??
                this.input_field_placeholder;
        }
        return this;
    }
    /**
     * Returns the keyboard that was build. Note that it doesn't return
     * `resize_keyboard` or other options that may be set. You don't usually
     * need to call this method. It is no longer useful.
     */
    build() {
        return this.keyboard;
    }
    /**
     * Turns a two-dimensional keyboard button array into a keyboard instance.
     * You can use the static button builder methods to create keyboard button
     * objects.
     *
     * @param buttons A two-dimensional button array
     * @param options Optional options for the custom keyboard
     */
    static from(
        buttons: (string | KeyboardButton)[][],
        options: Omit<ReplyKeyboardMarkup, "keyboard"> = {},
    ): Keyboard {
        function toButton(btn: string | KeyboardButton) {
            return typeof btn === "string" ? Keyboard.text(btn) : btn;
        }
        return Object.assign(
            new Keyboard(buttons.map((row) => row.map(toButton))),
            options,
        );
    }
    /**
     * Takes a number of button rows and creates a custom keyboard from them.
     * You can use the static button builder methods to create keyboard button
     * objects.
     *
     * @param buttons A number of button rows
     */
    static fromRows(...buttons: (string | KeyboardButton)[][]) {
        return Keyboard.from(buttons);
    }
    /**
     * Takes a number of button columns and creates a custom keyboard from them.
     *
     * Note that buttons can only span multiple columns, but never multiple
     * rows. This means that if the given arrays have different lengths, some
     * buttons might flow up in the layout. In these cases, transposing a
     * keyboard a second time will not undo the first transposition.
     *
     * You can use the static button builder methods to create keyboard button
     * objects.
     *
     * @param buttons A number of button rows
     */
    static fromColumns(...buttons: (string | KeyboardButton)[][]) {
        return Keyboard.from(buttons).transpose();
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
     * @param url HTTP or tg:// url to be opened when the button is pressed.
     * Links tg://user?id=<user_id> can be used to mention a user by their ID
     * without using a username, if this is allowed by their privacy settings.
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
     * Adds a new inline query button that acts on the current chat. The
     * selected chat will be prefilled with the name of your bot. You may
     * provide a text that is specified along with it. This will start an inline
     * query.
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
     * @param query The query object describing which chats can be picked
     */
    switchInlineChosen(
        text: string,
        query: SwitchInlineQueryChosenChat = {},
    ) {
        return this.add({ text, switch_inline_query_chosen_chat: query });
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
