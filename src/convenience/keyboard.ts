import {
    type InlineKeyboardButton,
    type KeyboardButton,
    type KeyboardButtonPollType,
    type KeyboardButtonRequestChat,
    type KeyboardButtonRequestUsers,
    type LoginUrl,
    type SwitchInlineQueryChosenChat,
} from "../types.ts";

type KeyboardButtonSource = string | KeyboardButton;
type KeyboardSource = KeyboardButtonSource[][] | Keyboard;
/**
 * Use this class to simplify building a custom keyboard (something like this:
 * https://core.telegram.org/bots/features#keyboards).
 *
 * ```ts
 * // Build a custom keyboard:
 * const keyboard = new Keyboard()
 *   .text('A').text('B').row()
 *   .text('C').text('D')
 *
 * // Now you can send it like so:
 * await ctx.reply('Here is your custom keyboard!', {
 *   reply_markup: keyboard
 * })
 * ```
 *
 * If you already have some source data which you would like to turn into a
 * keyboard button object, you can use the static equivalents which every button
 * has. You can use them to create a two-dimensional keyboard button array. The
 * resulting array can be turned into a keyboard instance.
 *
 * ```ts
 * const button = Keyboard.text('push my buttons')
 * const array = [[button]]
 * const keyboard = Keyboard.from(array)
 * ```
 *
 * If you want to create text buttons only, you can directly use a
 * two-dimensional string array and turn it into a keyboard.
 *
 * ```ts
 * const data = [['A', 'B'], ['C', 'D']]
 * const keyboard = Keyboard.from(data)
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
    constructor(public readonly keyboard: KeyboardButton[][] = [[]]) {}
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
     * Adds a new request users button. When the user presses the button, a list
     * of suitable users will be opened. Tapping on any number of users will
     * send their identifiers to the bot in a “users_shared” service message.
     * Available in private chats only.
     *
     * @param text The text to display
     * @param requestId A signed 32-bit identifier of the request
     * @param options Options object for further requirements
     */
    requestUsers(
        text: string,
        requestId: number,
        options: Omit<KeyboardButtonRequestUsers, "request_id"> = {},
    ) {
        return this.add(Keyboard.requestUsers(text, requestId, options));
    }
    /**
     * Creates a new request users button. When the user presses the button, a
     * list of suitable users will be opened. Tapping on any number of users
     * will send their identifiers to the bot in a “users_shared” service
     * message. Available in private chats only.
     *
     * @param text The text to display
     * @param requestId A signed 32-bit identifier of the request
     * @param options Options object for further requirements
     */
    static requestUsers(
        text: string,
        requestId: number,
        options: Omit<KeyboardButtonRequestUsers, "request_id"> = {},
    ): KeyboardButton.RequestUsersButton {
        return { text, request_users: { request_id: requestId, ...options } };
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
     * Creates a new web app button. The Web App that will be launched when the
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
     * Creates a new keyboard that contains the transposed grid of buttons of
     * this keyboard. This means that the resulting keyboard has the rows and
     * columns flipped.
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
     * [  a  ]  ~> [  a  ]
     *
     *             [  a  ]
     * [a b c]  ~> [  b  ]
     *             [  c  ]
     *
     * [ a b ]     [a c e]
     * [ c d ]  ~> [ b d ]
     * [  e  ]
     *
     * [ a b ]     [a c d]
     * [  c  ]  ~> [ b e ]
     * [d e f]     [  f  ]
     * ```
     */
    toTransposed() {
        const original = this.keyboard;
        const transposed = transpose(original);
        return this.clone(transposed);
    }
    /**
     * Creates a new keyboard with the same buttons but reflowed into a given
     * number of columns as if the buttons were text elements. Optionally, you
     * can specify if the flow should make sure to fill up the last row.
     *
     * This method is idempotent, so calling it a second time will effectively
     * clone this keyboard without reordering the buttons.
     *
     * Here are some examples.
     *
     * ```
     * original    flowed
     * [  a  ]  ~> [  a  ]    (4 columns)
     *
     *             [  a  ]
     * [a b c]  ~> [  b  ]    (1 column)
     *             [  c  ]
     *
     * [ a b ]     [a b c]
     * [ c d ]  ~> [ d e ]    (3 columns)
     * [  e  ]
     *
     * [ a b ]     [abcde]
     * [  c  ]  ~> [  f  ]    (5 columns)
     * [d e f]
     *
     * [a b c]     [  a  ]
     * [d e f]  ~> [b c d]    (3 colums, { fillLastRow: true })
     * [g h i]     [e f g]
     * [  j  ]     [h i j]
     * ```
     *
     * @param columns Maximum number of buttons per row
     * @param options Optional flowing behavior
     */
    toFlowed(columns: number, options: FlowOptions = {}) {
        const original = this.keyboard;
        const flowed = reflow(original, columns, options);
        return this.clone(flowed);
    }
    /**
     * Creates and returns a deep copy of this keyboard.
     *
     * Optionally takes a new grid of buttons to replace the current buttons. If
     * specified, only the options will be cloned, and the given buttons will be
     * used instead.
     */
    clone(keyboard: KeyboardButton[][] = this.keyboard) {
        const clone = new Keyboard(keyboard.map((row) => row.slice()));
        clone.is_persistent = this.is_persistent;
        clone.selective = this.selective;
        clone.one_time_keyboard = this.one_time_keyboard;
        clone.resize_keyboard = this.resize_keyboard;
        clone.input_field_placeholder = this.input_field_placeholder;
        return clone;
    }
    /**
     * Appends the buttons of the given keyboards to this keyboard. If other
     * options are specified in these keyboards, they will be ignored.
     *
     * @param sources A number of keyboards to append
     */
    append(...sources: KeyboardSource[]) {
        for (const source of sources) {
            const keyboard = Keyboard.from(source);
            this.keyboard.push(...keyboard.keyboard.map((row) => row.slice()));
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
     * @param source A two-dimensional button array
     */
    static from(source: KeyboardSource): Keyboard {
        if (source instanceof Keyboard) return source.clone();
        function toButton(btn: KeyboardButtonSource) {
            return typeof btn === "string" ? Keyboard.text(btn) : btn;
        }
        return new Keyboard(source.map((row) => row.map(toButton)));
    }
}

type InlineKeyboardSource = InlineKeyboardButton[][] | InlineKeyboard;
/**
 * Use this class to simplify building an inline keyboard (something like this:
 * https://core.telegram.org/bots/features#inline-keyboards).
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
 * If you already have some source data which you would like to turn into an
 * inline button object, you can use the static equivalents which every inline
 * button has. You can use them to create a two-dimensional inline button array.
 * The resulting array can be turned into a keyboard instance.
 *
 * ```ts
 * const button = InlineKeyboard.text('GO', 'go')
 * const array = [[button]]
 * const keyboard = InlineKeyboard.from(array)
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
     * @param inline_keyboard An optional initial two-dimensional button array
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
        return this.add(InlineKeyboard.url(text, url));
    }
    /**
     * Creates a new URL button. Telegram clients will open the provided URL
     * when the button is pressed.
     *
     * @param text The text to display
     * @param url HTTP or tg:// url to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their ID without using a username, if this is allowed by their privacy settings.
     */
    static url(text: string, url: string): InlineKeyboardButton.UrlButton {
        return { text, url };
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
        return this.add(InlineKeyboard.text(text, data));
    }
    /**
     * Creates a new callback query button. The button contains a text and a
     * custom payload. This payload will be sent back to your bot when the
     * button is pressed. If you omit the payload, the display text will be sent
     * back to your bot.
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
    static text(
        text: string,
        data = text,
    ): InlineKeyboardButton.CallbackButton {
        return { text, callback_data: data };
    }
    /**
     * Adds a new web app button, confer https://core.telegram.org/bots/webapps
     *
     * @param text The text to display
     * @param url An HTTPS URL of a Web App to be opened with additional data
     */
    webApp(text: string, url: string) {
        return this.add(InlineKeyboard.webApp(text, url));
    }
    /**
     * Creates a new web app button, confer https://core.telegram.org/bots/webapps
     *
     * @param text The text to display
     * @param url An HTTPS URL of a Web App to be opened with additional data
     */
    static webApp(
        text: string,
        url: string,
    ): InlineKeyboardButton.WebAppButton {
        return { text, web_app: { url } };
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
        return this.add(InlineKeyboard.login(text, loginUrl));
    }
    /**
     * Creates a new login button. This can be used as a replacement for the
     * Telegram Login Widget. You must specify an HTTPS URL used to
     * automatically authorize the user.
     *
     * @param text The text to display
     * @param loginUrl The login URL as string or `LoginUrl` object
     */
    static login(
        text: string,
        loginUrl: string | LoginUrl,
    ): InlineKeyboardButton.LoginButton {
        return {
            text,
            login_url: typeof loginUrl === "string"
                ? { url: loginUrl }
                : loginUrl,
        };
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
        return this.add(InlineKeyboard.switchInline(text, query));
    }
    /**
     * Creates a new inline query button. Telegram clients will let the user pick a
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
    static switchInline(
        text: string,
        query = "",
    ): InlineKeyboardButton.SwitchInlineButton {
        return { text, switch_inline_query: query };
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
        return this.add(InlineKeyboard.switchInlineCurrent(text, query));
    }
    /**
     * Creates a new inline query button that acts on the current chat. The
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
    static switchInlineCurrent(
        text: string,
        query = "",
    ): InlineKeyboardButton.SwitchInlineCurrentChatButton {
        return { text, switch_inline_query_current_chat: query };
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
        return this.add(InlineKeyboard.switchInlineChosen(text, query));
    }
    /**
     * Creates a new inline query button. Telegram clients will let the user pick a
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
    static switchInlineChosen(
        text: string,
        query: SwitchInlineQueryChosenChat = {},
    ): InlineKeyboardButton.SwitchInlineChosenChatButton {
        return { text, switch_inline_query_chosen_chat: query };
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
        return this.add(InlineKeyboard.game(text));
    }
    /**
     * Creates a new game query button, confer
     * https://core.telegram.org/bots/api#games
     *
     * This type of button must always be the first button in the first row.
     *
     * @param text The text to display
     */
    static game(text: string): InlineKeyboardButton.GameButton {
        return { text, callback_game: {} };
    }
    /**
     * Adds a new payment button, confer
     * https://core.telegram.org/bots/api#payments
     *
     * This type of button must always be the first button in the first row and
     * can only be used in invoice messages.
     *
     * @param text The text to display. Substrings “⭐” and “XTR” in the buttons's text will be replaced with a Telegram Star icon.
     */
    pay(text: string) {
        return this.add(InlineKeyboard.pay(text));
    }
    /**
     * Create a new payment button, confer
     * https://core.telegram.org/bots/api#payments
     *
     * This type of button must always be the first button in the first row and
     * can only be used in invoice messages.
     *
     * @param text The text to display. Substrings “⭐” and “XTR” in the buttons's text will be replaced with a Telegram Star icon.
     */
    static pay(text: string): InlineKeyboardButton.PayButton {
        return { text, pay: true };
    }
    /**
     * Creates a new inline keyboard that contains the transposed grid of
     * buttons of this inline keyboard. This means that the resulting inline
     * keyboard has the rows and columns flipped.
     *
     * Note that inline buttons can only span multiple columns, but never
     * multiple rows. This means that if the given arrays have different
     * lengths, some buttons might flow up in the layout. In these cases,
     * transposing an inline keyboard a second time will not undo the first
     * transposition.
     *
     * Here are some examples.
     *
     * ```
     * original    transposed
     * [  a  ]  ~> [  a  ]
     *
     *             [  a  ]
     * [a b c]  ~> [  b  ]
     *             [  c  ]
     *
     * [ a b ]     [a c e]
     * [ c d ]  ~> [ b d ]
     * [  e  ]
     *
     * [ a b ]     [a c d]
     * [  c  ]  ~> [ b e ]
     * [d e f]     [  f  ]
     * ```
     */
    toTransposed() {
        const original = this.inline_keyboard;
        const transposed = transpose(original);
        return new InlineKeyboard(transposed);
    }
    /**
     * Creates a new inline keyboard with the same buttons but reflowed into a
     * given number of columns as if the buttons were text elements. Optionally,
     * you can specify if the flow should make sure to fill up the last row.
     *
     * This method is idempotent, so calling it a second time will effectively
     * clone this inline keyboard without reordering the buttons.
     *
     * Here are some examples.
     *
     * ```
     * original    flowed
     * [  a  ]  ~> [  a  ]    (4 columns)
     *
     *             [  a  ]
     * [a b c]  ~> [  b  ]    (1 column)
     *             [  c  ]
     *
     * [ a b ]     [a b c]
     * [ c d ]  ~> [ d e ]    (3 columns)
     * [  e  ]
     *
     * [ a b ]     [abcde]
     * [  c  ]  ~> [  f  ]    (5 columns)
     * [d e f]
     *
     * [a b c]     [  a  ]
     * [d e f]  ~> [b c d]    (3 colums, { fillLastRow: true })
     * [g h i]     [e f g]
     * [  j  ]     [h i j]
     * ```
     *
     * @param columns Maximum number of buttons per row
     * @param options Optional flowing behavior
     */
    toFlowed(columns: number, options: FlowOptions = {}) {
        const original = this.inline_keyboard;
        const flowed = reflow(original, columns, options);
        return new InlineKeyboard(flowed);
    }
    /**
     * Creates and returns a deep copy of this inline keyboard.
     */
    clone() {
        return new InlineKeyboard(
            this.inline_keyboard.map((row) => row.slice()),
        );
    }
    /**
     * Appends the buttons of the given inline keyboards to this keyboard.
     *
     * @param sources A number of inline keyboards to append
     */
    append(...sources: InlineKeyboardSource[]) {
        for (const source of sources) {
            const keyboard = InlineKeyboard.from(source);
            this.inline_keyboard.push(
                ...keyboard.inline_keyboard.map((row) => row.slice()),
            );
        }
        return this;
    }
    /**
     * Turns a two-dimensional inline button array into an inline keyboard
     * instance. You can use the static button builder methods to create inline
     * button objects.
     *
     * @param source A two-dimensional inline button array
     */
    static from(source: InlineKeyboardSource): InlineKeyboard {
        if (source instanceof InlineKeyboard) return source.clone();
        return new InlineKeyboard(source.map((row) => row.slice()));
    }
}

function transpose<T>(grid: T[][]): T[][] {
    const transposed: T[][] = [];
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            const button = row[j];
            (transposed[j] ??= []).push(button);
        }
    }
    return transposed;
}
interface FlowOptions {
    /** Set to `true` to completely fill up the last row */
    fillLastRow?: boolean;
}
function reflow<T>(
    grid: T[][],
    columns: number,
    { fillLastRow = false }: FlowOptions,
): T[][] {
    let first = columns;
    if (fillLastRow) {
        const buttonCount = grid
            .map((row) => row.length)
            .reduce((a, b) => a + b, 0);
        first = buttonCount % columns;
    }
    const reflowed: T[][] = [];
    for (const row of grid) {
        for (const button of row) {
            const at = Math.max(0, reflowed.length - 1);
            const max = at === 0 ? first : columns;
            let next = (reflowed[at] ??= []);
            if (next.length === max) {
                next = [];
                reflowed.push(next);
            }
            next.push(button);
        }
    }
    return reflowed;
}
