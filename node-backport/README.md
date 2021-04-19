# grammY

The grammY package lets you easily write Telegram bots. Here is a quickstart for you to get started, but note that a better explanation is [in our repo on GitHub](https://github.com/grammyjs/grammY).

You may also want to check out the [docs](https://grammy.dev).

## Quickstart

Talk to [@BotFather](https://t.me/BotFather) to create a new Telegram bot and obtain a _bot token_.

Paste the following code into a new file `bot.js`.

```js
import { Bot } from "grammy";
// This works, too (CommonJS modules):
// const { Bot } = require('grammy')

// Create bot object
const bot = new Bot(""); // <-- place your bot token inside this string

// Listen for messages
bot.command("start", (ctx) => ctx.reply("Welcome! Send me a photo!"));
bot.on("message:text", (ctx) => ctx.reply("That is text and not a photo!"));
bot.on("message:photo", (ctx) => ctx.reply("Nice photo! Is that you?"));
bot.on("edited_message", (ctx) =>
  ctx.reply("Ha! Gotcha! You just edited this!", {
    reply_to_message_id: ctx.editedMessage.message_id,
  })
);

// Launch!
bot.start();
```

**Congratulations!** You have successfully created your first Telegram bot.

You can run it like so:

```bash
node bot.js
```
