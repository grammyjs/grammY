import { Composer, type Context } from "../src/mod.ts";
import type {
    ApiMethods,
    AreaPosition,
    Chat,
    ChatFullInfo,
    ChatShareTheme,
    InputMessageContent,
    Message,
    RichText,
    TonNft,
    TonWalletCard,
    TonWalletTransfer,
    User,
    WidgetQueryType,
    WidgetQueryTypeData,
    WidgetQueryTypeSentTransaction,
    WidgetQueryTypeSignData,
} from "../src/types.ts";
import { assertType, describe, type IsExact, it } from "./deps.test.ts";

describe("Bot API 10.4 types", () => {
    it("should distinguish widget contexts and optional message information", () => {
        const composer = new Composer<Context>();
        composer.on("widget_query", (ctx) => {
            assertType<IsExact<typeof ctx.from, User>>(true);
            assertType<IsExact<typeof ctx.chat, Chat | undefined>>(true);
            assertType<IsExact<typeof ctx.chatId, number | undefined>>(true);
            assertType<IsExact<typeof ctx.msgId, number | undefined>>(true);
            assertType<IsExact<typeof ctx.msg, undefined>>(true);
        });
        composer.on("widget_query:chat", (ctx) => {
            assertType<IsExact<typeof ctx.chat, Chat>>(true);
            assertType<IsExact<typeof ctx.chatId, number>>(true);
        });
        composer.on("widget_query:message_id", (ctx) => {
            assertType<IsExact<typeof ctx.msgId, number>>(true);
        });
        composer.on("shared_widget_query", (ctx) => {
            assertType<IsExact<typeof ctx.from, User>>(true);
            assertType<IsExact<typeof ctx.chat, undefined>>(true);
            assertType<IsExact<typeof ctx.chatId, undefined>>(true);
            assertType<IsExact<typeof ctx.msgId, undefined>>(true);
            assertType<IsExact<typeof ctx.msg, undefined>>(true);
        });
        composer.on("widget_query:type:data", (ctx) => {
            const type = ctx.widgetQuery.type;
            if (type.type === "data") {
                assertType<IsExact<typeof type, WidgetQueryTypeData>>(true);
            }
            if (type.type === "sign_data") {
                assertType<IsExact<typeof type, WidgetQueryTypeSignData>>(true);
            }
            if (type.type === "sent_transaction") {
                assertType<
                    IsExact<typeof type, WidgetQueryTypeSentTransaction>
                >(true);
            }
            assertType<
                IsExact<typeof ctx.widgetQuery.type, WidgetQueryType>
            >(true);
        });
        composer.on("widget_query:type:sign_data", (ctx) => {
            assertType<
                IsExact<typeof ctx.widgetQuery.type, WidgetQueryType>
            >(true);
        });
        composer.on("shared_widget_query:type:sent_transaction", (ctx) => {
            assertType<
                IsExact<
                    typeof ctx.sharedWidgetQuery.type,
                    WidgetQueryType
                >
            >(true);
        });
    });

    it("should expose new inline content, rich text, and quotes", () => {
        const widget: InputMessageContent = {
            html: "<p>Widget</p>",
            allow_queries: true,
        };
        const shared: InputMessageContent = {
            widget_id: "widget",
            chat_data: "",
        };
        const rich: RichText = {
            type: "ton_address",
            text: "Wallet",
            address: "address",
        };
        const reply: NonNullable<Parameters<ApiMethods["sendMessage"]>[0]> = {
            text: "Reply",
            ephemeral_message_parameters: { callback_query_id: "callback" },
            reply_parameters: { message_id: 7, quote_rich_texts: ["Quote"] },
        };
        assertType<IsExact<typeof widget.html, string>>(true);
        assertType<IsExact<typeof shared.widget_id, string>>(true);
        assertType<IsExact<typeof rich.address, string>>(true);
        assertType<IsExact<typeof reply.chat_id, number | string | undefined>>(
            true,
        );
    });

    it("should preserve wallet precision and chat-specific fields", () => {
        assertType<IsExact<TonWalletTransfer["amount"], string>>(true);
        assertType<IsExact<TonWalletCard["amount"], string>>(true);
        assertType<IsExact<TonNft["index"], string>>(true);
        assertType<
            IsExact<
                ChatFullInfo.PrivateChat["ton_wallet_card"],
                TonWalletCard | undefined
            >
        >(true);
        assertType<
            IsExact<ChatFullInfo.GroupChat["ton_wallet_card"], undefined>
        >(true);
        assertType<IsExact<ChatFullInfo.GroupChat["share_theme"], undefined>>(
            true,
        );
        assertType<
            IsExact<
                ChatFullInfo.ChannelChat["share_theme"],
                ChatShareTheme | undefined
            >
        >(true);
        assertType<
            IsExact<
                NonNullable<TonWalletCard["stickers"]>[number]["position"],
                AreaPosition
            >
        >(true);
        assertType<
            IsExact<ReturnType<ApiMethods["sendWidget"]>, Message.WidgetMessage>
        >(true);
        assertType<
            IsExact<ReturnType<ApiMethods["deleteBusinessAccountGift"]>, true>
        >(true);
        assertType<
            IsExact<
                number extends TonWalletTransfer["amount"] ? true : false,
                false
            >
        >(true);
        assertType<
            IsExact<
                { html: number } extends InputMessageContent ? true : false,
                false
            >
        >(true);
        assertType<
            IsExact<
                { type: "sign_data" } extends WidgetQueryTypeSignData ? true
                    : false,
                false
            >
        >(true);
    });
});
