import { Bot as MegaBot } from "./src_old/bot.ts";
import { Bot as MonoBot } from "./src/bot.ts";

function createBot(bot, complexity) {
    // skip all API calls
    bot.api.config.use(() =>
        Promise.resolve({ ok: true, result: true })
    );
    if (complexity === "high") {
        // fake plugins
        bot.use(async (ctx, next) => {
            Object.assign(ctx, { foo: ctx.update.update_id++ });
            await next();
        });
        bot.use(async (ctx, next) => {
            Object.assign(ctx, { bar: ctx.update.update_id-- });
            await next();
        });
    }
    if (complexity === "medium" || complexity === "high") {
        // fake handlers
        let n = 5;
        if (complexity === 'high') n *= 3;
        for (let i = 0; i < n; i++) {
            bot.command("start");
            bot.command("help");
            bot.command("settings");
            bot.chatType(["group", "supergroup"]).command("privacy");
            bot.on('inline_query')
            bot.on('callback_query:game_short_name')
            bot.on('::bot_command')
            bot.on('edit::email')
            bot.on(['msg:photo', 'msg:video'])
        }
    }
    // bench handlers
    bot.on(":text", (ctx) => ctx.reply("Yo!", { parse_mode: "HTML" }));
    bot.on("edit:text", (ctx) => ctx.react("⚡"));
    bot.callbackQuery("button_clicked_payload")
        .use((ctx) => ctx.answerCallbackQuery());
    bot.on("my_chat_member")
        .filter((ctx) => ctx.myChatMember.old_chat_member.status === "left")
        .filter((ctx) => ctx.myChatMember.new_chat_member.status === "member")
        .use((ctx) => ctx.leaveChat());
    bot.reaction("👍").use((ctx) => ctx.deleteMessage());
    return bot;
}

// fake updates
function msg() {
    return {
        "update_id": 10000,
        "message": {
            "message_id": 123,
            "date": 1700000000,
            "chat": {
                "id": 123456789,
                "type": "private",
                "first_name": "John"
            },
            "from": {
                "id": 123456789,
                "is_bot": false,
                "first_name": "John"
            },
            "text": "Hello, world!"
        }
    };
}

function edit() {
    return {
        "update_id": 10001,
        "edited_message": {
            "message_id": 123,
            "date": 1700000000,
            "edit_date": 1700000010,
            "chat": {
                "id": 123456789,
                "type": "private",
                "first_name": "John"
            },
            "from": {
                "id": 123456789,
                "is_bot": false,
                "first_name": "John"
            },
            "text": "Hello, edited world!"
        }
    };
}

function post() {
    return {
        "update_id": 10002,
        "channel_post": {
            "message_id": 456,
            "date": 1700000000,
            "chat": {
                "id": -1001234567890,
                "type": "channel",
                "title": "My News Channel"
            },
            "text": "This is a channel post."
        }
    };
}

function cbquery() {
    return {
        "update_id": 10003,
        "callback_query": {
            "id": "1234567890123456",
            "from": {
                "id": 123456789,
                "is_bot": false,
                "first_name": "John"
            },
            "chat_instance": "987654321",
            "data": "button_clicked_payload",
            "message": {
                "message_id": 123,
                "date": 1700000000,
                "chat": {
                    "id": 123456789,
                    "type": "private",
                    "first_name": "John"
                },
                "from": {
                    "id": 987654321,
                    "is_bot": true,
                    "first_name": "MyBot"
                },
                "text": "Please click the button"
            }
        }
    }
}

function my() {
    return {
        "update_id": 10004,
        "my_chat_member": {
            "chat": {
                "id": -123456789,
                "type": "group",
                "title": "My Group Chat"
            },
            "from": {
                "id": 123456789,
                "is_bot": false,
                "first_name": "John"
            },
            "date": 1700000000,
            "old_chat_member": {
                "status": "left",
                "user": {
                    "id": 987654321,
                    "is_bot": true,
                    "first_name": "MyBot"
                }
            },
            "new_chat_member": {
                "status": "member",
                "user": {
                    "id": 987654321,
                    "is_bot": true,
                    "first_name": "MyBot"
                }
            }
        }
    };
}

function reaction() {
    return {
        "update_id": 10005,
        "message_reaction": {
            "chat": {
                "id": 123456789,
                "type": "private",
                "first_name": "John"
            },
            "message_id": 123,
            "date": 1700000000,
            "user": {
                "id": 123456789,
                "is_bot": false,
                "first_name": "John"
            },
            "old_reaction": [],
            "new_reaction": [
                {
                    "type": "emoji",
                    "emoji": "👍"
                }
            ]
        }
    };
}

for (const complexity of ["low", "medium", "high"]) {
    const megabot = createBot(new MegaBot('dummy', { botInfo: {} }), complexity); // old impl
    const monobot = createBot(new MonoBot('dummy', { botInfo: {} }), complexity); // new impl
    const _msg = msg();
    const _edit = edit();
    const _post = post();
    const _cbquery = cbquery();
    const _my = my();
    const _reaction = reaction();
    Deno.bench({
        name: `${complexity}-complexity-megamorphic`,
        group: complexity,
        warmup: 10_000,
        n: 100_000,
        fn: async () => {
            await megabot.handleUpdate(_msg);
            await megabot.handleUpdate(_edit);
            await megabot.handleUpdate(_post);
            await megabot.handleUpdate(_cbquery);
            await megabot.handleUpdate(_my);
            await megabot.handleUpdate(_reaction);
        },
    });
    Deno.bench({
        name: `${complexity}-complexity-monomorphic`,
        group: complexity,
        warmup: 10_000,
        n: 100_000,
        fn: async () => {
            await monobot.handleUpdate(_msg);
            await monobot.handleUpdate(_edit);
            await monobot.handleUpdate(_post);
            await monobot.handleUpdate(_cbquery);
            await monobot.handleUpdate(_my);
            await monobot.handleUpdate(_reaction);
        },
    });
}
