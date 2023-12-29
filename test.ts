import { Bot } from "./src/mod.ts";

const bot = new Bot("829364035:AAHwgJyGwdSatEtANilFkCqSKuece7q5QAw");

bot.on("message", async (ctx, next) => {
    await ctx.react("👍");
    await next();
});

bot.command(
    "del",
    async (ctx) => {
        const ids = ctx.match
            .split(",")
            .map((id) => id.trim())
            .map((id) => parseInt(id));
        await ctx.deleteMessages(ids);
    },
);

bot.on("chat_join_request", (ctx) => ctx.chatJoinRequest.chat);

bot.on<"message" | "channel_post">("message", async (ctx) => {
    await ctx.reply("okay");
});

bot.on("message_reaction:new_reaction:emoji");

const x = bot.on("msg", () => {});
x.use(() => {
});

bot.on("message:forward_origin:channel", async (ctx) => {
    ctx.msg.reply_to_message;
    await ctx.reply("channel post yay");
});
bot.on(
    "message:forward_origin",
    (ctx) => ctx.reply(ctx.msg.forward_origin.type),
);
bot.on("message", (ctx) => ctx.reply(`other, ${ctx.msg.message_id}`));
// bot.on("message_reaction:new_reaction", (ctx) => ctx.deleteMessage());

bot.start();
