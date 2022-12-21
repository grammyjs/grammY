import { Context } from "../src/context.ts";
import { Api } from "../src/mod.ts";
import {
    type Chat,
    type Message,
    type Update,
    type User,
    type UserFromGetMe,
} from "../src/types.ts";
import {
    assert,
    assertEquals,
    assertFalse,
    assertThrows,
} from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.170.0/testing/bdd.ts";

describe("Context", () => {
    const u = { id: 42, first_name: "bot", is_bot: true } as User;
    const c = { id: 100, type: "private" } as Chat;
    const m = { text: "a", from: u, chat: c, sender_chat: c } as Message;
    const update = {
        message: m,
        edited_message: m,
        channel_post: m,
        edited_channel_post: m,
        inline_query: { id: "b", from: u, query: "iq" },
        chosen_inline_result: { from: u, inline_message_id: "x" },
        callback_query: {
            data: "cb",
            game_short_name: "game",
            message: m,
            from: u,
            inline_message_id: "y",
        },
        shipping_query: { id: "d", from: u },
        pre_checkout_query: { id: "e", from: u },
        poll: { id: "f" },
        poll_answer: { poll_id: "g" },
        my_chat_member: { date: 1, from: u, chat: c },
        chat_member: { date: 2, from: u, chat: c },
        chat_join_request: { date: 3, from: u, chat: c },
    } as Update;
    const api = new Api("dummy-token");
    const me = { id: 42 } as UserFromGetMe;

    it("provide basic properties", () => {
        const ctx = new Context(update, api, me);
        assertEquals(ctx.update, update);
        assertEquals(ctx.api, api);
        assertEquals(ctx.me, me);
    });

    it("should have aliases", () => {
        const ctx = new Context(update, api, me);
        assertEquals(ctx.message, update.message);
        assertEquals(ctx.editedMessage, update.edited_message);
        assertEquals(ctx.channelPost, update.channel_post);
        assertEquals(ctx.editedChannelPost, update.edited_channel_post);
        assertEquals(ctx.inlineQuery, update.inline_query);
        assertEquals(ctx.chosenInlineResult, update.chosen_inline_result);
        assertEquals(ctx.callbackQuery, update.callback_query);
        assertEquals(ctx.shippingQuery, update.shipping_query);
        assertEquals(ctx.preCheckoutQuery, update.pre_checkout_query);
        assertEquals(ctx.poll, update.poll);
        assertEquals(ctx.pollAnswer, update.poll_answer);
        assertEquals(ctx.myChatMember, update.my_chat_member);
        assertEquals(ctx.chatMember, update.chat_member);
        assertEquals(ctx.chatJoinRequest, update.chat_join_request);
    });

    it("should have update shortcuts", () => {
        const ctx = new Context(update, api, me);
        assertEquals(ctx.message, update.message);
        assertEquals(ctx.editedMessage, update.edited_message);
        assertEquals(ctx.channelPost, update.channel_post);
        assertEquals(ctx.editedChannelPost, update.edited_channel_post);
        assertEquals(ctx.chosenInlineResult, update.chosen_inline_result);
        assertEquals(ctx.callbackQuery, update.callback_query);
        assertEquals(ctx.shippingQuery, update.shipping_query);
        assertEquals(ctx.preCheckoutQuery, update.pre_checkout_query);
        assertEquals(ctx.poll, update.poll);
        assertEquals(ctx.pollAnswer, update.poll_answer);
        assertEquals(ctx.myChatMember, update.my_chat_member);
        assertEquals(ctx.chatMember, update.chat_member);
        assertEquals(ctx.chatJoinRequest, update.chat_join_request);
    });

    it(".msg should aggregate messages", () => {
        let up: Update, ctx: Context;

        up = { message: update.message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.msg, up.message);
        up = { edited_message: update.edited_message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.msg, up.edited_message);
        up = { callback_query: update.callback_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.msg, up.callback_query?.message);
        up = { channel_post: update.channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.msg, up.channel_post);
        up = { edited_channel_post: update.edited_channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.msg, up.edited_channel_post);
    });

    it(".chat should aggregate chats", () => {
        let up: Update, ctx: Context;

        up = { message: update.message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.message?.chat);
        up = { edited_message: update.edited_message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.edited_message?.chat);
        up = { callback_query: update.callback_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.callback_query?.message?.chat);
        up = { channel_post: update.channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.channel_post?.chat);
        up = { edited_channel_post: update.edited_channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.edited_channel_post?.chat);
        up = { my_chat_member: update.my_chat_member } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.my_chat_member?.chat);
        up = { chat_member: update.chat_member } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.chat_member?.chat);
        up = { chat_join_request: update.chat_join_request } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.chat, up.chat_join_request?.chat);
    });

    it(".senderChat should aggregate sender chats", () => {
        let up: Update, ctx: Context;

        up = { message: update.message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.senderChat, up.message?.sender_chat);
        up = { edited_message: update.edited_message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.senderChat, up.edited_message?.sender_chat);
        up = { callback_query: update.callback_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.senderChat, up.callback_query?.message?.sender_chat);
        up = { channel_post: update.channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.senderChat, up.channel_post?.sender_chat);
        up = { edited_channel_post: update.edited_channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.senderChat, up.edited_channel_post?.sender_chat);
    });

    it(".from should aggregate user objects", () => {
        let up: Update, ctx: Context;

        up = { callback_query: update.callback_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.callback_query?.from);
        up = { inline_query: update.inline_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.inline_query?.from);
        up = { shipping_query: update.shipping_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.shipping_query?.from);
        up = { pre_checkout_query: update.pre_checkout_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.pre_checkout_query?.from);
        up = { chosen_inline_result: update.chosen_inline_result } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.chosen_inline_result?.from);
        up = { message: update.message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.message?.from);
        up = { edited_message: update.edited_message } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.edited_message?.from);
        up = { callback_query: update.callback_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.callback_query?.message?.from);
        up = { channel_post: update.channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.channel_post?.from);
        up = { edited_channel_post: update.edited_channel_post } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.edited_channel_post?.from);
        up = { my_chat_member: update.my_chat_member } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.my_chat_member?.from);
        up = { chat_member: update.chat_member } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.chat_member?.from);
        up = { chat_join_request: update.chat_join_request } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.from, up.chat_join_request?.from);
    });

    it(".inlineMessageId should aggregate inline message identifiers", () => {
        let up: Update, ctx: Context;

        up = { callback_query: update.callback_query } as Update;
        ctx = new Context(up, api, me);
        assertEquals(ctx.inlineMessageId, up.callback_query?.inline_message_id);
        up = { chosen_inline_result: update.chosen_inline_result } as Update;
        ctx = new Context(up, api, me);
        assertEquals(
            ctx.inlineMessageId,
            up.chosen_inline_result?.inline_message_id,
        );
    });

    it("should be able to check for callback queries", () => {
        const ctx = new Context(update, api, me);

        assert(Context.has.callbackQuery("cb")(ctx));
        assert(ctx.hasCallbackQuery("cb"));
        assert(Context.has.callbackQuery(/^c./)(ctx));
        assertEquals(ctx.match, "cb".match(/^c./));
        assert(ctx.hasCallbackQuery(/^c./));
        assertFalse(Context.has.callbackQuery("bb")(ctx));
        assertFalse(ctx.hasCallbackQuery("bb"));
    });

    it("should be able to check for chat types", () => {
        const ctx = new Context(update, api, me);

        assert(Context.has.chatType("private")(ctx));
        assert(ctx.hasChatType("private"));
        assert(Context.has.chatType(["channel", "private"])(ctx));
        assert(ctx.hasChatType(["channel", "private"]));
        assertFalse(Context.has.chatType("group")(ctx));
        assertFalse(ctx.hasChatType("group"));
    });

    it("should be able to check for commands", () => {
        let up = {
            message: {
                text: "/start args",
                entities: [{
                    type: "bot_command",
                    offset: 0,
                    length: "/start".length,
                }],
            },
        } as Update;
        let ctx = new Context(up, api, me);

        assert(Context.has.command("start")(ctx));
        assert(ctx.hasCommand("start"));
        assert(Context.has.command(["help", "start"])(ctx));
        assert(ctx.hasCommand(["help", "start"]));
        assertEquals(ctx.match, "args");
        assertFalse(Context.has.command("help")(ctx));
        assertFalse(ctx.hasCommand("help"));

        assertThrows(
            () => Context.has.command("/asdf"),
            "Do not include '/' when registering command handlers (use 'asdf' not '/asdf')",
        );

        up = {
            message: {
                text: "Test with /start args",
                entities: [{
                    type: "bot_command",
                    offset: "Test with ".length,
                    length: "/start".length,
                }],
            },
        } as Update;
        ctx = new Context(up, api, me);
        assertFalse(Context.has.command("start")(ctx));
        assertFalse(ctx.hasCommand("start"));

        up = { message: { text: "/start" } } as Update;
        ctx = new Context(up, api, me);
        assertFalse(Context.has.command("start")(ctx));
        assertFalse(ctx.hasCommand("start"));
    });

    it("should be able to check for game queries", () => {
        const ctx = new Context(update, api, me);

        assert(Context.has.gameQuery("game")(ctx));
        assert(ctx.hasGameQuery("game"));
        assert(Context.has.gameQuery(/^ga..$/)(ctx));
        assertEquals(ctx.match, "game".match(/^ga..$/));
        assert(ctx.hasGameQuery(/^ga..$/));
        assertFalse(Context.has.gameQuery("xy")(ctx));
        assertFalse(ctx.hasGameQuery("xy"));
    });

    it("should be able to check for inline queries", () => {
        const ctx = new Context(update, api, me);

        assert(Context.has.inlineQuery("iq")(ctx));
        assert(ctx.hasInlineQuery("iq"));
        assert(Context.has.inlineQuery(/^i./)(ctx));
        assertEquals(ctx.match, "iq".match(/^i./));
        assert(ctx.hasInlineQuery(/^i./));
        assertFalse(Context.has.inlineQuery("cb")(ctx));
        assertFalse(ctx.hasInlineQuery("cb"));
    });

    it("should be able to match filter queries", () => {
        const ctx = new Context(update, api, me);

        assert(Context.has.filterQuery(":text")(ctx));
        assert(ctx.has(":text"));
        assertFalse(Context.has.filterQuery(":photo")(ctx));
        assertFalse(ctx.has(":photo"));
    });

    it("should be able to check for text", () => {
        const ctx = new Context(update, api, me);

        assert(Context.has.text("a")(ctx));
        assert(ctx.hasText("a"));
        assertFalse(Context.has.text("b")(ctx));
        assertFalse(ctx.hasText("b"));
    });
});
