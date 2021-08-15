# <h1 align="center">[![grammY](https://raw.githubusercontent.com/grammyjs/website/main/logos/grammY.png)](https://grammy.dev)</h1>

_<h3 align="right">—The Telegram Bot Framework</h3>_

---

_<h1 align="center">[Docs](https://grammy.dev) | [API Reference](https://doc.deno.land/https/deno.land/x/grammy/mod.ts) | [Chat](https://telegram.me/grammyjs)</h1>_

<div align="center">

[![Bot API](https://img.shields.io/badge/Bot%20API-5.3-blue?logo=telegram&style=flat-square)](https://core.telegram.org/bots/api)
[![npm](https://img.shields.io/npm/v/grammy?logo=npm&style=flat-square)](https://www.npmjs.org/package/grammy) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-15-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

</div>

**grammY makes it easy to create Telegram bots.**

No matter whether you just learned how to code and are looking for something **simple to get started**, or whether you are an experienced developer that has to deploy a complex codebase that can autoscale to handle thousands of messages per second.

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

## Going Further

grammY has an excellent [documentation](https://grammy.dev). If you are using [VSCode](https://code.visualstudio.com/) as your code editor, you can hover over any element of grammY to get a detailed description of what that thing does or means.

If you are still stuck, just join the [Telegram chat](https://t.me/grammyjs) and ask for help. People are nice there and we appreciate your question, no matter what it is :)

Here are some more resources to support you:

## Resources

### [grammY Website](https://grammy.dev)

—main project website and documentation.

### [grammY API Reference](https://doc.deno.land/https/deno.land/x/grammy/mod.ts)

—reference of everything that grammY exports.

### [grammY Example Bots](https://github.com/grammyjs/examples)

—repository full of example bots. Includes a setup to easily run any of them.

### [grammY Telegram Chat](https://t.me/grammyjs)

—Telegram chat where you can ask any question about grammY or bots in general. We are also open for feedback, ideas, and contributions!

### [grammY News Channel](https://t.me/grammyjs_news)

—Telegram channel where updates to grammY and the ecosystem are posted.

### [Telegram Bot API Reference](https://core.telegram.org/bots/api)

—documentation of the API that Telegram offers, and that grammY connects to under the hood.

## Deno Support

All grammY packages published by [@grammyjs](https://github.com/grammyjs) run natively in Deno. We maintain our own backporting scripts to transform every codebase to still run on Node.

However, given that most bot developers are still using Node, all documentation is written Node-first. We may migrate it if Deno overtakes Node. If you are already on Deno today, we expect you to know what you're doing. You mainly have to adjust the imports to URL imports, and use [`https://deno.land/x/grammy`](https://deno.land/x/grammy).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/KnorpelSenf"><img src="https://avatars.githubusercontent.com/u/12952387?v=4?s=100" width="100px;" alt=""/><br /><sub><b>KnorpelSenf</b></sub></a><br /><a href="#ideas-KnorpelSenf" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Documentation">📖</a> <a href="#design-KnorpelSenf" title="Design">🎨</a> <a href="#example-KnorpelSenf" title="Examples">💡</a> <a href="#question-KnorpelSenf" title="Answering Questions">💬</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Tests">⚠️</a> <a href="#plugin-KnorpelSenf" title="Plugin/utility libraries">🔌</a> <a href="#platform-KnorpelSenf" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AKnorpelSenf" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-KnorpelSenf" title="Mentoring">🧑‍🏫</a></td>
    <td align="center"><a href="https://github.com/Tecardo1"><img src="https://avatars.githubusercontent.com/u/42873000?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tecardo1</b></sub></a><br /><a href="#plugin-Tecardo1" title="Plugin/utility libraries">🔌</a> <a href="#userTesting-Tecardo1" title="User Testing">📓</a></td>
    <td align="center"><a href="https://github.com/wojpawlik"><img src="https://avatars.githubusercontent.com/u/23058303?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Wojciech Pawlik</b></sub></a><br /><a href="#ideas-wojpawlik" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Awojpawlik" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/MegaITA"><img src="https://avatars.githubusercontent.com/u/32493080?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alessandro Bertozzi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MegaITA" title="Documentation">📖</a></td>
    <td align="center"><a href="https://trgwii.no/"><img src="https://avatars.githubusercontent.com/u/11262022?v=4?s=100" width="100px;" alt=""/><br /><sub><b>trgwii</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=trgwii" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/KnightNiwrem"><img src="https://avatars.githubusercontent.com/u/9781814?v=4?s=100" width="100px;" alt=""/><br /><sub><b>KnightNiwrem</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=KnightNiwrem" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3AKnightNiwrem" title="Bug reports">🐛</a> <a href="#plugin-KnightNiwrem" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnightNiwrem" title="Documentation">📖</a> <a href="#example-KnightNiwrem" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AKnightNiwrem" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://mkr.pw"><img src="https://avatars.githubusercontent.com/u/19621208?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Muthu Kumar</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AMKRhere" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://edjopato.de/"><img src="https://avatars.githubusercontent.com/u/7953011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>EdJoPaTo</b></sub></a><br /><a href="#plugin-EdJoPaTo" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=EdJoPaTo" title="Documentation">📖</a> <a href="#ideas-EdJoPaTo" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AEdJoPaTo" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3AEdJoPaTo" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=EdJoPaTo" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Amir-Zouerami"><img src="https://avatars.githubusercontent.com/u/53701884?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Amir Zouerami</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Amir-Zouerami" title="Documentation">📖</a> <a href="#plugin-Amir-Zouerami" title="Plugin/utility libraries">🔌</a></td>
    <td align="center"><a href="https://github.com/rojserbest"><img src="https://avatars.githubusercontent.com/u/49933115?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Roj</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=rojserbest" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/jokasimr"><img src="https://avatars.githubusercontent.com/u/20954731?v=4?s=100" width="100px;" alt=""/><br /><sub><b>jokasimr</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ajokasimr" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/CikiMomogi"><img src="https://avatars.githubusercontent.com/u/74030149?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ciki Momogi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=CikiMomogi" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/AndreoliBR"><img src="https://avatars.githubusercontent.com/u/15970011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AndreoliBR</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AAndreoliBR" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/Loskir"><img src="https://avatars.githubusercontent.com/u/21295738?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kirill Loskutov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Loskir" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3ALoskir" title="Bug reports">🐛</a> <a href="#ideas-Loskir" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://lungers.com/"><img src="https://avatars.githubusercontent.com/u/32808683?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Lane</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3AAndrewLaneX" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## [Contribution Guide »](./CONTRIBUTING.md)
