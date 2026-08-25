import { Composer, type Context } from "../src/mod.ts";
import {
    assertType,
    describe,
    type IsExact,
    type IsMutuallyAssignable,
    it,
} from "./deps.test.ts";

describe("ctx.has* checks", () => {
    it("should narrow down types", () => {
        const c = new Composer<Context & { state: 1 }>();
        c.use((ctx) => {
            assertType<IsExact<typeof ctx.state, 1>>(true);
            if (ctx.has(":contact")) {
                assertType<
                    IsExact<typeof ctx.msg.contact.phone_number, string>
                >(true);
                assertType<IsExact<typeof ctx.state, 1>>(true);
            }
            if (ctx.hasText("123")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.match,
                        string | RegExpMatchArray
                    >
                >(true);
            }
            if (ctx.hasCommand("123")) {
                assertType<IsMutuallyAssignable<typeof ctx.match, string>>(
                    true,
                );
            }
            if (ctx.hasChatType("private")) {
                assertType<IsExact<typeof ctx.chat.type, "private">>(true);
            }
            if (ctx.hasGameQuery("123")) {
                assertType<
                    IsExact<
                        typeof ctx.callbackQuery.game_short_name,
                        string
                    >
                >(true);
            }
            if (ctx.hasInlineQuery("123")) {
                assertType<IsExact<typeof ctx.inlineQuery.id, string>>(
                    true,
                );
            }
        });
        c.command("c", (ctx) => {
            assertType<IsMutuallyAssignable<typeof ctx.match, string>>(true);
        });
    });
});

describe("ctx update shortcuts", () => {
    it("should narrow down all update aliases", () => {
        const c = new Composer<Context>();
        c.use((ctx) => {
            if (ctx.has("message")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.message,
                        typeof ctx.update.message
                    >
                >(true);
            }
            if (ctx.has("edited_message")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.editedMessage,
                        typeof ctx.update.edited_message
                    >
                >(true);
            }
            if (ctx.has("channel_post")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.channelPost,
                        typeof ctx.update.channel_post
                    >
                >(true);
            }
            if (ctx.has("edited_channel_post")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.editedChannelPost,
                        typeof ctx.update.edited_channel_post
                    >
                >(true);
            }
            if (ctx.has("business_connection")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.businessConnection,
                        typeof ctx.update.business_connection
                    >
                >(true);
            }
            if (ctx.has("business_message")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.businessMessage,
                        typeof ctx.update.business_message
                    >
                >(true);
            }
            if (ctx.has("edited_business_message")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.editedBusinessMessage,
                        typeof ctx.update.edited_business_message
                    >
                >(true);
            }
            if (ctx.has("deleted_business_messages")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.deletedBusinessMessages,
                        typeof ctx.update.deleted_business_messages
                    >
                >(true);
            }
            if (ctx.has("guest_message")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.guestMessage,
                        typeof ctx.update.guest_message
                    >
                >(true);
            }
            if (ctx.has("message_reaction")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.messageReaction,
                        typeof ctx.update.message_reaction
                    >
                >(true);
            }
            if (ctx.has("message_reaction_count")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.messageReactionCount,
                        typeof ctx.update.message_reaction_count
                    >
                >(true);
            }
            if (ctx.has("inline_query")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.inlineQuery,
                        typeof ctx.update.inline_query
                    >
                >(true);
            }
            if (ctx.has("chosen_inline_result")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.chosenInlineResult,
                        typeof ctx.update.chosen_inline_result
                    >
                >(true);
            }
            if (ctx.has("callback_query")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.callbackQuery,
                        typeof ctx.update.callback_query
                    >
                >(true);
            }
            if (ctx.has("shipping_query")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.shippingQuery,
                        typeof ctx.update.shipping_query
                    >
                >(true);
            }
            if (ctx.has("pre_checkout_query")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.preCheckoutQuery,
                        typeof ctx.update.pre_checkout_query
                    >
                >(true);
            }
            if (ctx.has("poll")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.poll,
                        typeof ctx.update.poll
                    >
                >(true);
            }
            if (ctx.has("poll_answer")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.pollAnswer,
                        typeof ctx.update.poll_answer
                    >
                >(true);
            }
            if (ctx.has("my_chat_member")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.myChatMember,
                        typeof ctx.update.my_chat_member
                    >
                >(true);
            }
            if (ctx.has("chat_member")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.chatMember,
                        typeof ctx.update.chat_member
                    >
                >(true);
            }
            if (ctx.has("managed_bot")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.managedBot,
                        typeof ctx.update.managed_bot
                    >
                >(true);
            }
            if (ctx.has("chat_join_request")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.chatJoinRequest,
                        typeof ctx.update.chat_join_request
                    >
                >(true);
            }
            if (ctx.has("chat_boost")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.chatBoost,
                        typeof ctx.update.chat_boost
                    >
                >(true);
            }
            if (ctx.has("removed_chat_boost")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.removedChatBoost,
                        typeof ctx.update.removed_chat_boost
                    >
                >(true);
            }
            if (ctx.has("purchased_paid_media")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.purchasedPaidMedia,
                        typeof ctx.update.purchased_paid_media
                    >
                >(true);
            }
            if (ctx.has("subscription")) {
                assertType<
                    IsMutuallyAssignable<
                        typeof ctx.subscription,
                        typeof ctx.update.subscription
                    >
                >(true);
            }
        });
    });
});
