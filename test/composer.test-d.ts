import { Composer, Context } from "../src/mod.ts";

function _f<C extends Context>() {
    const c = new Composer<C & { state: 1 }>();
    c.use((ctx) => {
        if (ctx.has(":contact")) {
            ctx.msg.contact.phone_number;
            ctx.state;
        }
        if (ctx.hasText("123")) {
            ctx.match.includes;
        }
        if (ctx.hasCommand("123")) {
            ctx.match.charCodeAt;
        }
        if (ctx.hasChatType("private")) {
            ctx.chat.type;
        }
        if (ctx.hasGameQuery("123")) {
            ctx.callbackQuery.game_short_name;
        }
        if (ctx.hasInlineQuery("123")) {
            ctx.inlineQuery.id;
        }
        ctx.state;
    });
    c.command("c", (ctx) => {
        ctx.match.charCodeAt;
    });
}
