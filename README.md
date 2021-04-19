# <h1 align="center">[![grammY](https://raw.githubusercontent.com/grammyjs/website/main/logos/grammY.png)](https://grammy.dev)</h1>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

_<h3 align="right">—The Telegram Bot Framework</h3>_

---

_<h1 align="center">[Docs](https://grammy.dev) | [API Reference](https://doc.deno.land/https/deno.land/x/grammy/mod.ts) | [Chat](https://telegram.me/grammyjs)</h1>_

> This project has not reached 1.0. Please try it out and give some feedback before the release :)

**grammY makes it easy to create Telegram bots.** No matter whether you just learned how to code and are looking for something **simple to get started**, or whether you are an experienced developer that has to deploy a **complex codebase that can autoscale** to handle thousands of messages per second.

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

grammY has an excellent [documentation](https://grammy.dev/). If you are using [VSCode](https://code.visualstudio.com/) as your code editor, you can hover over any element of grammY to get a detailed description of what that thing does or means.

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
    <td align="center"><a href="https://github.com/KnorpelSenf"><img src="https://avatars.githubusercontent.com/u/12952387?v=4?s=100" width="100px;" alt=""/><br /><sub><b>KnorpelSenf</b></sub></a><br /><a href="#ideas-KnorpelSenf" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Documentation">📖</a> <a href="#design-KnorpelSenf" title="Design">🎨</a> <a href="#example-KnorpelSenf" title="Examples">💡</a> <a href="#question-KnorpelSenf" title="Answering Questions">💬</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Tests">⚠️</a> <a href="#plugin-KnorpelSenf" title="Plugin/utility libraries">🔌</a> <a href="#platform-KnorpelSenf" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://github.com/Tecardo1"><img src="https://avatars.githubusercontent.com/u/42873000?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tecardo1</b></sub></a><br /><a href="#plugin-Tecardo1" title="Plugin/utility libraries">🔌</a> <a href="#userTesting-Tecardo1" title="User Testing">📓</a></td>
    <td align="center"><a href="https://github.com/wojpawlik"><img src="https://avatars.githubusercontent.com/u/23058303?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Wojciech Pawlik</b></sub></a><br /><a href="#ideas-wojpawlik" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/MegaITA"><img src="https://avatars.githubusercontent.com/u/32493080?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alessandro Bertozzi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MegaITA" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Contribution Guide

> This section is intended for people who want to develop the grammY core package or one of its plugins. If you want to develop a Telegram bot, check out the [documentation](https://grammy.dev/).

First of all, thanks for your interest in helping out!
We appreciate any kind of support, be it small bug fixes, large feature contributions, or even just if you drop us a message with some constructive criticism how grammY can be improved for your use case.
This library would not be possible without you.

We believe it is a strength of grammY to provide an integrated experience to its users.
Important plugins have a dedicated page right inside the main documentation, and they are published under @grammyjs both on GitHub and on npm.
If you have a good idea, don't hesitate to tell us in the group chat!
We can grant you access to the GitHub Organization, so you can get a dedicated repository under our name, and publish your code as an offcial plugin of grammY.
You will be responsible for maintaining it.

### A Few Words on Deno and Node

**TL;DR** working on grammY means working on a Deno project, and that is a good thing.

grammY started out as a hybrid project, targeting both Deno and Node.js as runtimes not long after the Deno 1.0 release.
Naturally, this poses a challenge to grammY.
So far, there are no sufficiently good tools to convert a codebase back and forth between the ecosystems.
As a result, grammY maintains its own backporting script to convert Deno code (`deno/` subdirectory) for the Node.js platform (`node-backport/` subdirectoy), which is much simpler than doing it the other way around.

The script is simple.
There are three steps to do in order to obtain TypeScript code for Node from the grammY codebase that runs on Deno.

1. Platform-specifics (`Deno.open`) etc are replaced by their equivalents (`fs.createReadStream`).
2. Built-in functions in Deno (`fetch`) are replaced by equivalent dependencies (`node-fetch`)
3. Explicit file extensions are stripped because Node uses implicit ones

Steps 2. and 3. are achieved using regular coreutil operations on the codebase that replace file extensions in imports and inject polyfilling import calls for Node.js.
Step 1. is achieved by having extracted all platform-specific code into a file called `platform.ts` that resides in the top level of the project.
The backporting script's first operation (after duplicating the codebase into a fresh directory) is to replace the `platform.ts` file with a predefined second, Node-specific version of the same file that “coincidentally” exports exactly the same set of members with identical (or at least compatible) type signatures.
Also, all dependencies of grammY are imported and re-exported here, as the import syntax for external modules differs between the platforms.

Long story short: if you want to work on grammY, you effectively work on a Deno project.
We use Deno testing, Deno linting, and the [Deno extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) for VSCode.
We just make sure that _the code also runs on Node.js_, but this transpilation process is automated, and you usually don't even have to think about it.

> Note that not all plugins of grammY have to have the same setup: many of them only integrate with grammY itself, and hence can be written for Node and automatically ported to Deno via <https://skypack.dev/> and similar services.
