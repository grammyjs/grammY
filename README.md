# <h1 align="center">grammY</h1>

_<h3 align="right">—The Telegram Bot Framework</h3>_

---

> This project has not reached 1.0. Please try it out, but don't expect everything to work just yet :)

**grammY makes is easy to create Telegram bots.** No matter whether you just learned how to code and are looking for something **simple to get started**, or whether you are an experienced developer that has to deploy a **complex codebase that can autoscale** to handle thousands of messages per second.

Bots are written in [TypeScript](https://www.typescriptlang.org/) (or JavaScript) and run on [Node.js](https://nodejs.org/).

## Quickstart

> If you are new to Telegram bots, read the official [Introduction for Developers](https://core.telegram.org/bots) written by the Telegram team.

Visit [@BotFather](https://t.me/BotFather) and create a new bot. You will obtain a **bot token**.

Create a new directory and run

```bash
npm install grammy
```

inside it. Then create a file `bot.js` with this content:

```ts
const { Bot } = require("grammy");

// Create a bot object
const bot = new Bot(""); // <-- place your bot token in this string

// Register listeners to handle messages
bot.on("message:text", (ctx) => ctx.reply("Echo: " + ctx.message.text));

// Start the bot (using long polling)
bot.start();
```

Now you can run the bot via

```bash
node bot.js
```

and it will echo all received text messages.

Congrats! You just wrote a Telegram bot :)

## Going further

grammY has an excellent documentation. If you are using [VSCode](https://code.visualstudio.com/) as your code editor, you can hover over any element of grammY to get a detailed description of what that thing does or means.

If you are still stuck, just join the [Telegram chat](https://t.me/grammyjs) and ask for help. People are nice there and we appreciate your question, no matter what it is :)

Here are some more resources to support you:

## Resources

### [grammY Telegram Chat](https://t.me/grammyjs)

—Telegram chat where you can ask any question about grammY or bots in general. We are also open for feedback, ideas and contributions!

### [grammY News Channel](https://t.me/grammyjs_news)

—Telegram channel where updates to grammY and the ecosystem are posted.

### [grammY API Reference](https://doc.deno.land/https/deno.land/x/grammy/mod.ts)

—documentation of everything that grammY exports.

### [grammY Example Bots](https://github.com/grammyjs/examples)

—repository full of example bots. Includes a setup to easily run any of them.

### [Telegram Bot API Reference](https://core.telegram.org/bots/api)

—documentation of the API that Telegram offers, and that grammY connects to under the hood.

## Deno Support

All grammY packages published by [@grammyjs](https://github.com/grammyjs) run natively in Deno. We maintain our own backporting scripts to transform every codebase to still run on Node.

However, given that most bot developers are still using Node, all documentation is written Node-first. We may migrate it if Deno overtakes Node. If you are already on Deno today, we expect you to know what you're doing. You mainly have to adjust the imports to URL imports, and use [`https://deno.land/x/grammy`](https://deno.land/x/grammy).
