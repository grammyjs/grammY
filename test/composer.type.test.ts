import { Composer } from "../src/composer.ts";
import { Context } from "../src/mod.ts";
import type { Chat, MaybeInaccessibleMessage, User } from "../src/types.ts";
import {
    assertType,
    beforeEach,
    describe,
    type IsExact,
    it,
} from "./deps.test.ts";

// Compile-time type tests. No run-time assertion will actually run. Either compile fails or test passes.
describe("Composer types", () => {
    let composer: Composer<Context>;

    beforeEach(() => {
        composer = new Composer();
    });

    describe(".hears", () => {
        it("should have correct type for properties", () => {
            composer.hears("test", (ctx) => {
                const msgCaption = ctx.msg.caption;
                const msgText = ctx.msg.text;
                const messageCaption = ctx.message?.caption;
                const messageText = ctx.message?.text;
                const channelPostCaption = ctx.channelPost?.caption;
                const channelPostText = ctx.channelPost?.text;
                const match = ctx.match;
                assertType<IsExact<typeof msgCaption, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof msgText, string | undefined>>(true);
                assertType<IsExact<typeof messageCaption, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof messageText, string | undefined>>(
                    true,
                );
                assertType<
                    IsExact<typeof channelPostCaption, string | undefined>
                >(
                    true,
                );
                assertType<IsExact<typeof channelPostText, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof match, string | RegExpMatchArray>>(
                    true,
                );
            });
        });
    });

    describe(".callbackQuery", () => {
        it("should have correct type for properties", () => {
            composer.callbackQuery("test", (ctx) => {
                const msg = ctx.msg;
                const message = ctx.message;
                const callbackQueryMessage = ctx.callbackQuery.message;
                const callbackQueryData = ctx.callbackQuery.data;
                const match = ctx.match;
                assertType<
                    IsExact<typeof msg, MaybeInaccessibleMessage | undefined>
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof message,
                        undefined // This is ctx.update.message, but not ctx.update.callback_query.message
                    >
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof callbackQueryMessage,
                        MaybeInaccessibleMessage | undefined
                    >
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof callbackQueryData,
                        string
                    >
                >(
                    true,
                );
                assertType<IsExact<typeof match, string | RegExpMatchArray>>(
                    true,
                );
            });
        });
    });

    describe(".command", () => {
        it("should have correct type for properties", () => {
            composer.command("test", (ctx) => {
                const msgText = ctx.msg.text;
                const messageCaption = ctx.message?.caption;
                const messageText = ctx.message?.text;
                const channelPostCaption = ctx.channelPost?.caption;
                const channelPostText = ctx.channelPost?.text;
                const match = ctx.match;
                assertType<IsExact<typeof msgText, string>>(true);
                assertType<IsExact<typeof messageCaption, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof messageText, string | undefined>>(
                    true,
                );
                assertType<
                    IsExact<typeof channelPostCaption, string | undefined>
                >(true);
                assertType<IsExact<typeof channelPostText, string | undefined>>(
                    true,
                );
                assertType<IsExact<typeof match, string>>(true);
            });
        });
    });

    describe(".chatType", () => {
        it("should have correct type for properties in private chats", () => {
            composer.chatType("private", (ctx) => {
                const chat = ctx.chat;
                const chatId = ctx.chatId;
                const from = ctx.from;
                const channelPost = ctx.channelPost;

                assertType<IsExact<typeof chat, Chat.PrivateChat>>(true);
                assertType<IsExact<typeof chatId, number>>(true);
                assertType<IsExact<typeof from, User>>(true);
                assertType<IsExact<typeof channelPost, undefined>>(true);
                if (ctx.message) {
                    assertType<
                        IsExact<typeof ctx.message.chat, Chat.PrivateChat>
                    >(true);
                }
                if (ctx.callbackQuery?.message) {
                    assertType<
                        IsExact<
                            typeof ctx.callbackQuery.message.chat,
                            Chat.PrivateChat
                        >
                    >(true);
                }
            });
        });
        it("should have correct type for properties in group chats", () => {
            composer.chatType("group", (ctx) => {
                const chat = ctx.chat;
                const chatId = ctx.chatId;
                const channelPost = ctx.channelPost;

                assertType<IsExact<typeof chat, Chat.GroupChat>>(true);
                assertType<IsExact<typeof chatId, number>>(true);
                assertType<IsExact<typeof channelPost, undefined>>(true);
                if (ctx.message) {
                    assertType<
                        IsExact<typeof ctx.message.chat, Chat.GroupChat>
                    >(true);
                }
                if (ctx.callbackQuery?.message) {
                    assertType<
                        IsExact<
                            typeof ctx.callbackQuery.message.chat,
                            Chat.GroupChat
                        >
                    >(true);
                }
            });
        });
        it("should have correct type for properties in supergroup chats", () => {
            composer.chatType("supergroup", (ctx) => {
                const chat = ctx.chat;
                const chatId = ctx.chatId;
                const channelPost = ctx.channelPost;

                assertType<IsExact<typeof chat, Chat.SupergroupChat>>(true);
                assertType<IsExact<typeof chatId, number>>(true);
                assertType<IsExact<typeof channelPost, undefined>>(true);
                if (ctx.message) {
                    assertType<
                        IsExact<typeof ctx.message.chat, Chat.SupergroupChat>
                    >(true);
                }
                if (ctx.callbackQuery?.message) {
                    assertType<
                        IsExact<
                            typeof ctx.callbackQuery.message.chat,
                            Chat.SupergroupChat
                        >
                    >(true);
                }
            });
        });
        it("should have correct type for properties in channel chats", () => {
            composer.chatType("channel", (ctx) => {
                const chat = ctx.chat;
                const chatId = ctx.chatId;
                const message = ctx.message;

                assertType<IsExact<typeof chat, Chat.ChannelChat>>(true);
                assertType<IsExact<typeof chatId, number>>(true);
                assertType<IsExact<typeof message, undefined>>(true);
                if (ctx.channelPost) {
                    assertType<
                        IsExact<typeof ctx.channelPost.chat, Chat.ChannelChat>
                    >(true);
                }
                if (ctx.callbackQuery?.message) {
                    assertType<
                        IsExact<
                            typeof ctx.callbackQuery.message.chat,
                            Chat.ChannelChat
                        >
                    >(true);
                }
            });
        });
        it("should combine different chat types correctly", () => {
            composer.chatType(["private", "channel"], (ctx) => {
                const chat = ctx.chat;
                const chatId = ctx.chatId;

                assertType<
                    IsExact<typeof chat, Chat.PrivateChat | Chat.ChannelChat>
                >(true);
                assertType<IsExact<typeof chatId, number>>(true);
                if (ctx.message) {
                    assertType<
                        IsExact<typeof ctx.message.chat, Chat.PrivateChat>
                    >(true);
                }
                if (ctx.channelPost) {
                    assertType<
                        IsExact<typeof ctx.channelPost.chat, Chat.ChannelChat>
                    >(true);
                }
            });
        });
    });

    describe(".gameQuery", () => {
        it("should have correct type for properties", () => {
            composer.gameQuery("test", (ctx) => {
                const msg = ctx.msg;
                const message = ctx.message;
                const callbackQueryMessage = ctx.callbackQuery.message;
                const gameShortName = ctx.callbackQuery.game_short_name;
                const match = ctx.match;
                assertType<
                    IsExact<typeof msg, MaybeInaccessibleMessage | undefined>
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof message,
                        undefined // This is ctx.update.message, but not ctx.update.callback_query.message
                    >
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof callbackQueryMessage,
                        MaybeInaccessibleMessage | undefined
                    >
                >(
                    true,
                );
                assertType<
                    IsExact<
                        typeof gameShortName,
                        string
                    >
                >(
                    true,
                );
                assertType<IsExact<typeof match, string | RegExpMatchArray>>(
                    true,
                );
            });
        });
    });

    describe(".inlineQuery", () => {
        it("should have correct type for properties", () => {
            composer.inlineQuery("test", (ctx) => {
                const query = ctx.inlineQuery.query;
                const match = ctx.match;
                assertType<IsExact<typeof query, string>>(true);
                assertType<IsExact<typeof match, RegExpMatchArray | string>>(
                    true,
                );
            });
        });
    });

    describe(".filter", () => {
        it("should have correct type for properties", () => {
            type TmpCtx = Context & { prop: number };
            composer.filter((_ctx): _ctx is TmpCtx => true, (ctx) => {
                assertType<IsExact<typeof ctx, TmpCtx>>(true);
                assertType<IsExact<typeof ctx.prop, number>>(true);
            });
        });
    });
});
