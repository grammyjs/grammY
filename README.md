<div align="center"><a href="https://grammy.dev"><img src="https://raw.githubusercontent.com/grammyjs/website/main/logos/grammY.png" alt="grammY"></a></h1></div>

<div align="right">

# The Telegram Bot Framework

</div>

<div align="center">

<!-- deno-fmt-ignore-start -->

[![Bot API](https://img.shields.io/badge/Bot%20API-6.9-blue?logo=telegram&style=flat&labelColor=000&color=3b82f6)](https://core.telegram.org/bots/api)
[![Deno](https://shield.deno.dev/x/grammy)](https://deno.land/x/grammy)
[![npm](https://img.shields.io/npm/v/grammy?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/grammy)
[![All Contributors](https://img.shields.io/github/all-contributors/grammyjs/grammy?style=flat&labelColor=000&color=3b82f6)](#contributors-)

<!-- deno-fmt-ignore-end -->

## _[docs.](https://grammy.dev) [reference.](https://deno.land/x/grammy/mod.ts) [chat.](https://telegram.me/grammyjs) [news.](https://telegram.me/grammyjs_news)_

</div>

**grammY makes it easy to create Telegram bots.** Both for beginners and at scale.

You want grammY because it is easy to use. It is very powerful and always up to date. It has the best [documentation](https://grammy.dev) in town. It is extremely efficient and scales up effortlessly. It has a thriving ecosystem of plugins, a friendly community chat, seamless integrations with web frameworks and databases, and so much more.

Are you ready? 🤖🚀

Bots are written in [TypeScript](https://www.typescriptlang.org/) (or JavaScript) and run on [Node.js](https://nodejs.org/) or [Deno](#deno-support).

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

grammY has an excellent [documentation](https://grammy.dev), and an [API Reference](https://doc.deno.land/https://deno.land/x/grammy/mod.ts). It even integrates with your code editor, e.g. [VS Code](https://code.visualstudio.com/). You can hover over any element of grammY to get a detailed description of what that thing does or means.

If you are still stuck, just join the [Telegram chat](https://t.me/grammyjs) and ask for help. People are nice there and we appreciate your question, no matter what it is :)

Here are some more resources to support you:

## Resources

### [grammY website](https://grammy.dev)

—main project website and documentation.
Gets you started and explains all concepts.

### [grammY API reference](https://doc.deno.land/https://deno.land/x/grammy/mod.ts)

—reference of everything that grammY exports.
Useful to look up descriptions about any element of grammY.

### [grammY examples](https://github.com/grammyjs/examples)

—repository full of example bots.
Includes a setup to easily run any of them.

### [Awesome grammY](https://github.com/grammyjs/awesome-grammY)

—list of awesome projects built with grammY.
Helpful if you want to see some real-world usage.

### [grammY chat](https://t.me/grammyjs)

—The chat where you can ask any question about grammY or bots in general.
We are also open for feedback, ideas, and contributions!

The Russian community chat can be found [here](https://t.me/grammyjs_ru).

### [grammY news](https://t.me/grammyjs_news)

—The channel where updates to grammY and the ecosystem are posted.
We are also [on Twitter](https://twitter.com/grammy_js).

### [Telegram Bot API Reference](https://core.telegram.org/bots/api)

—documentation of the API that Telegram offers, and that grammY connects to under the hood.

## Deno Support

All grammY packages published by [@grammyjs](https://github.com/grammyjs) run natively on [Deno](https://deno.land). We are compiling every codebase to still run on Node.js.

However, given that most bot developers are still using Node.js, all documentation is written Node.js-first. We may migrate it if Deno overtakes Node.js. If you are already on Deno today, import grammY from [`https://deno.land/x/grammy/mod.ts`](https://deno.land/x/grammy).

You may also be interested in [why we support Deno](https://grammy.dev/resources/faq.html#why-do-you-support-deno).

## JavaScript Bundles

The grammY core package in this repository is available as a JavaScript bundle via <https://bundle.deno.dev/>.
This lets you transpile all published versions including current `main` branch to standalone JavaScript files.
For example, the most recent source on `main` is available from <https://bundle.deno.dev/https://raw.githubusercontent.com/grammyjs/grammY/main/src/mod.ts>.

Being compatible with browsers is especially useful for running bots on Cloudflare Workers.
For this reason, we also include a web bundle in our npm package.
You can simply do `import { Bot } from "grammy/web"`.

## [Contribution Guide »](./CONTRIBUTING.md)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/KnorpelSenf"><img src="https://avatars.githubusercontent.com/u/12952387?v=4?s=100" width="100px;" alt="KnorpelSenf"/><br /><sub><b>KnorpelSenf</b></sub></a><br /><a href="#ideas-KnorpelSenf" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Documentation">📖</a> <a href="#design-KnorpelSenf" title="Design">🎨</a> <a href="#example-KnorpelSenf" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Tests">⚠️</a> <a href="#plugin-KnorpelSenf" title="Plugin/utility libraries">🔌</a> <a href="#platform-KnorpelSenf" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AKnorpelSenf" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-KnorpelSenf" title="Mentoring">🧑‍🏫</a> <a href="#projectManagement-KnorpelSenf" title="Project Management">📆</a> <a href="#infra-KnorpelSenf" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#audio-KnorpelSenf" title="Audio">🔊</a> <a href="#a11y-KnorpelSenf" title="Accessibility">️️️️♿️</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/HeeroML"><img src="https://avatars.githubusercontent.com/u/42873000?v=4?s=100" width="100px;" alt="Heero"/><br /><sub><b>Heero</b></sub></a><br /><a href="#plugin-HeeroML" title="Plugin/utility libraries">🔌</a> <a href="#userTesting-HeeroML" title="User Testing">📓</a> <a href="#example-HeeroML" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/commits?author=HeeroML" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AHeeroML" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=HeeroML" title="Code">💻</a> <a href="#ideas-HeeroML" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/wojpawlik"><img src="https://avatars.githubusercontent.com/u/23058303?v=4?s=100" width="100px;" alt="Wojciech Pawlik"/><br /><sub><b>Wojciech Pawlik</b></sub></a><br /><a href="#ideas-wojpawlik" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Awojpawlik" title="Reviewed Pull Requests">👀</a> <a href="#infra-wojpawlik" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-wojpawlik" title="Packaging/porting to new platform">📦</a> <a href="#tool-wojpawlik" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/MegaITA"><img src="https://avatars.githubusercontent.com/u/32493080?v=4?s=100" width="100px;" alt="Alessandro Bertozzi"/><br /><sub><b>Alessandro Bertozzi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MegaITA" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://trgwii.no/"><img src="https://avatars.githubusercontent.com/u/11262022?v=4?s=100" width="100px;" alt="trgwii"/><br /><sub><b>trgwii</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=trgwii" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Atrgwii" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/KnightNiwrem"><img src="https://avatars.githubusercontent.com/u/9781814?v=4?s=100" width="100px;" alt="KnightNiwrem"/><br /><sub><b>KnightNiwrem</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=KnightNiwrem" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3AKnightNiwrem" title="Bug reports">🐛</a> <a href="#plugin-KnightNiwrem" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnightNiwrem" title="Documentation">📖</a> <a href="#example-KnightNiwrem" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AKnightNiwrem" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-KnightNiwrem" title="Mentoring">🧑‍🏫</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://mkr.pw"><img src="https://avatars.githubusercontent.com/u/19621208?v=4?s=100" width="100px;" alt="Muthu Kumar"/><br /><sub><b>Muthu Kumar</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AMKRhere" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://edjopato.de/"><img src="https://avatars.githubusercontent.com/u/7953011?v=4?s=100" width="100px;" alt="EdJoPaTo"/><br /><sub><b>EdJoPaTo</b></sub></a><br /><a href="#plugin-EdJoPaTo" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=EdJoPaTo" title="Documentation">📖</a> <a href="#ideas-EdJoPaTo" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AEdJoPaTo" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3AEdJoPaTo" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=EdJoPaTo" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Amir-Zouerami"><img src="https://avatars.githubusercontent.com/u/53701884?v=4?s=100" width="100px;" alt="Amir Zouerami"/><br /><sub><b>Amir Zouerami</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Amir-Zouerami" title="Documentation">📖</a> <a href="#plugin-Amir-Zouerami" title="Plugin/utility libraries">🔌</a> <a href="#example-Amir-Zouerami" title="Examples">💡</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/roj1512"><img src="https://avatars.githubusercontent.com/u/49933115?v=4?s=100" width="100px;" alt="Roj"/><br /><sub><b>Roj</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=roj1512" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Aroj1512" title="Reviewed Pull Requests">👀</a> <a href="#infra-roj1512" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#translation-roj1512" title="Translation">🌍</a> <a href="https://github.com/grammyjs/grammY/commits?author=roj1512" title="Code">💻</a> <a href="#ideas-roj1512" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-roj1512" title="Mentoring">🧑‍🏫</a> <a href="#example-roj1512" title="Examples">💡</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/jokasimr"><img src="https://avatars.githubusercontent.com/u/20954731?v=4?s=100" width="100px;" alt="jokasimr"/><br /><sub><b>jokasimr</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ajokasimr" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/CikiMomogi"><img src="https://avatars.githubusercontent.com/u/74030149?v=4?s=100" width="100px;" alt="Ciki Momogi"/><br /><sub><b>Ciki Momogi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=CikiMomogi" title="Documentation">📖</a> <a href="#translation-CikiMomogi" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/AndreoliBR"><img src="https://avatars.githubusercontent.com/u/15970011?v=4?s=100" width="100px;" alt="AndreoliBR"/><br /><sub><b>AndreoliBR</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AAndreoliBR" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Loskir"><img src="https://avatars.githubusercontent.com/u/21295738?v=4?s=100" width="100px;" alt="Kirill Loskutov"/><br /><sub><b>Kirill Loskutov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Loskir" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3ALoskir" title="Bug reports">🐛</a> <a href="#ideas-Loskir" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-Loskir" title="Design">🎨</a> <a href="#question-Loskir" title="Answering Questions">💬</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3ALoskir" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=Loskir" title="Code">💻</a> <a href="#plugin-Loskir" title="Plugin/utility libraries">🔌</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://lungers.com/"><img src="https://avatars.githubusercontent.com/u/32808683?v=4?s=100" width="100px;" alt="Andrew Lane"/><br /><sub><b>Andrew Lane</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3AAndrewLaneX" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AAndrewLaneX" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/code-withAshish"><img src="https://avatars.githubusercontent.com/u/73625149?v=4?s=100" width="100px;" alt="code-withAshish"/><br /><sub><b>code-withAshish</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=code-withAshish" title="Documentation">📖</a> <a href="#question-code-withAshish" title="Answering Questions">💬</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3Acode-withAshish" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Acode-withAshish" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://beta.ku-di.com/waptik"><img src="https://avatars.githubusercontent.com/u/1687551?v=4?s=100" width="100px;" alt="Stephane Mensah"/><br /><sub><b>Stephane Mensah</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Awaptik" title="Bug reports">🐛</a> <a href="#plugin-waptik" title="Plugin/utility libraries">🔌</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Asaku01"><img src="https://avatars.githubusercontent.com/u/29716396?v=4?s=100" width="100px;" alt="Asaku01"/><br /><sub><b>Asaku01</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Asaku01" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/ppsimn"><img src="https://avatars.githubusercontent.com/u/88509883?v=4?s=100" width="100px;" alt="ppsimn"/><br /><sub><b>ppsimn</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Appsimn" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://satont.js.org/"><img src="https://avatars.githubusercontent.com/u/42675886?v=4?s=100" width="100px;" alt="Satont"/><br /><sub><b>Satont</b></sub></a><br /><a href="#plugin-Satont" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=Satont" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/deptyped"><img src="https://avatars.githubusercontent.com/u/26162440?v=4?s=100" width="100px;" alt="deptyped"/><br /><sub><b>deptyped</b></sub></a><br /><a href="#example-deptyped" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/commits?author=deptyped" title="Documentation">📖</a> <a href="#tutorial-deptyped" title="Tutorials">✅</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3Adeptyped" title="Bug reports">🐛</a> <a href="#translation-deptyped" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/dzek69"><img src="https://avatars.githubusercontent.com/u/4936805?v=4?s=100" width="100px;" alt="Jacek Nowacki"/><br /><sub><b>Jacek Nowacki</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=dzek69" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/commits?author=dzek69" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3Adzek69" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Adzek69" title="Reviewed Pull Requests">👀</a> <a href="#ideas-dzek69" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://blog.outv.im"><img src="https://avatars.githubusercontent.com/u/19144373?v=4?s=100" width="100px;" alt="Outvi V"/><br /><sub><b>Outvi V</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=outloudvi" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://bandism.net/"><img src="https://avatars.githubusercontent.com/u/22633385?v=4?s=100" width="100px;" alt="Ikko Ashimine"/><br /><sub><b>Ikko Ashimine</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=eltociear" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/amberlionk"><img src="https://avatars.githubusercontent.com/u/29119723?v=4?s=100" width="100px;" alt="Yevhen Denesiuk"/><br /><sub><b>Yevhen Denesiuk</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Aamberlionk" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3Aamberlionk" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=amberlionk" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/prazedotid"><img src="https://avatars.githubusercontent.com/u/19567624?v=4?s=100" width="100px;" alt="prastian"/><br /><sub><b>prastian</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aprazedotid" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=prazedotid" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://sayem.eu.org/"><img src="https://avatars.githubusercontent.com/u/14138401?v=4?s=100" width="100px;" alt="Sayem Chowdhury"/><br /><sub><b>Sayem Chowdhury</b></sub></a><br /><a href="#ideas-sayem314" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/kospra"><img src="https://avatars.githubusercontent.com/u/42740406?v=4?s=100" width="100px;" alt="kospra"/><br /><sub><b>kospra</b></sub></a><br /><a href="#ideas-kospra" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=kospra" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/chimit"><img src="https://avatars.githubusercontent.com/u/839349?v=4?s=100" width="100px;" alt="Chimit"/><br /><sub><b>Chimit</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=chimit" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/CalsiBotDev"><img src="https://avatars.githubusercontent.com/u/55633371?v=4?s=100" width="100px;" alt="Calsi"/><br /><sub><b>Calsi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=CalsiBotDev" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://zohren.xyz"><img src="https://avatars.githubusercontent.com/u/15788906?v=4?s=100" width="100px;" alt="Jonas Zohren"/><br /><sub><b>Jonas Zohren</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ajfowl" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=jfowl" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://zhemu.buzz/"><img src="https://avatars.githubusercontent.com/u/56839018?v=4?s=100" width="100px;" alt="linbuxiao"/><br /><sub><b>linbuxiao</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=linbuxiao" title="Documentation">📖</a> <a href="#translation-linbuxiao" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/JiquanWang99"><img src="https://avatars.githubusercontent.com/u/63894579?v=4?s=100" width="100px;" alt="JiquanWang99"/><br /><sub><b>JiquanWang99</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=JiquanWang99" title="Documentation">📖</a> <a href="#translation-JiquanWang99" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://bor691.ir/"><img src="https://avatars.githubusercontent.com/u/4184939?v=4?s=100" width="100px;" alt="Borhan Hafez"/><br /><sub><b>Borhan Hafez</b></sub></a><br /><a href="#plugin-zumoshi" title="Plugin/utility libraries">🔌</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://blog.limx.dev/"><img src="https://avatars.githubusercontent.com/u/6434137?v=4?s=100" width="100px;" alt="WingLim"/><br /><sub><b>WingLim</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=WingLim" title="Documentation">📖</a> <a href="#translation-WingLim" title="Translation">🌍</a> <a href="https://github.com/grammyjs/grammY/commits?author=WingLim" title="Code">💻</a> <a href="#plugin-WingLim" title="Plugin/utility libraries">🔌</a> <a href="#ideas-WingLim" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/taotie111"><img src="https://avatars.githubusercontent.com/u/44166322?v=4?s=100" width="100px;" alt="taotie111"/><br /><sub><b>taotie111</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=taotie111" title="Documentation">📖</a> <a href="#translation-taotie111" title="Translation">🌍</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://www.linkedin.com/in/merlin-brandes-42328717a/"><img src="https://avatars.githubusercontent.com/u/14237330?v=4?s=100" width="100px;" alt="Merlin"/><br /><sub><b>Merlin</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=FatalMerlin" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://darve.sh"><img src="https://avatars.githubusercontent.com/u/22394081?v=4?s=100" width="100px;" alt="Darvesh"/><br /><sub><b>Darvesh</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Adarvesh" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=darvesh" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Adarvesh" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://telegram.me/dcdunkan"><img src="https://avatars.githubusercontent.com/u/70066170?v=4?s=100" width="100px;" alt="dcdunkan"/><br /><sub><b>dcdunkan</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Adcdunkan" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=dcdunkan" title="Code">💻</a> <a href="#plugin-dcdunkan" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Adcdunkan" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=dcdunkan" title="Documentation">📖</a> <a href="#ideas-dcdunkan" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-dcdunkan" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#tool-dcdunkan" title="Tools">🔧</a> <a href="#mentoring-dcdunkan" title="Mentoring">🧑‍🏫</a> <a href="#maintenance-dcdunkan" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://xuann.wang/"><img src="https://avatars.githubusercontent.com/u/44045911?v=4?s=100" width="100px;" alt="Kid"/><br /><sub><b>Kid</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=kidonng" title="Documentation">📖</a> <a href="#translation-kidonng" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://slava.fomin.io/"><img src="https://avatars.githubusercontent.com/u/1702725?v=4?s=100" width="100px;" alt="Slava Fomin II"/><br /><sub><b>Slava Fomin II</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aslavafomin" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=slavafomin" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://kikobeats.com/"><img src="https://avatars.githubusercontent.com/u/2096101?v=4?s=100" width="100px;" alt="Kiko Beats"/><br /><sub><b>Kiko Beats</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Kikobeats" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////kraftwerk28.pp.ua"><img src="https://avatars.githubusercontent.com/u/31807671?v=4?s=100" width="100px;" alt="Vsevolod"/><br /><sub><b>Vsevolod</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=kraftwerk28" title="Code">💻</a> <a href="#ideas-kraftwerk28" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Akraftwerk28" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/habemuscode"><img src="https://avatars.githubusercontent.com/u/34692207?v=4?s=100" width="100px;" alt="Habemuscode"/><br /><sub><b>Habemuscode</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Ahabemuscode" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=habemuscode" title="Documentation">📖</a> <a href="#translation-habemuscode" title="Translation">🌍</a> <a href="#maintenance-habemuscode" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://borodutch.com/"><img src="https://avatars.githubusercontent.com/u/3192028?v=4?s=100" width="100px;" alt="Nikita Kolmogorov"/><br /><sub><b>Nikita Kolmogorov</b></sub></a><br /><a href="#plugin-backmeupplz" title="Plugin/utility libraries">🔌</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="http://glukki.ru"><img src="https://avatars.githubusercontent.com/u/140462?v=4?s=100" width="100px;" alt="Vitaliy Meshchaninov"/><br /><sub><b>Vitaliy Meshchaninov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aglukki" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=glukki" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/dilyanpalauzov"><img src="https://avatars.githubusercontent.com/u/4992947?v=4?s=100" width="100px;" alt="Дилян Палаузов"/><br /><sub><b>Дилян Палаузов</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Adilyanpalauzov" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=dilyanpalauzov" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/lmx-Hexagram"><img src="https://avatars.githubusercontent.com/u/52130356?v=4?s=100" width="100px;" alt="lmx-Hexagram"/><br /><sub><b>lmx-Hexagram</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=lmx-Hexagram" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/IlyaSemenov"><img src="https://avatars.githubusercontent.com/u/128121?v=4?s=100" width="100px;" alt="Ilya Semenov"/><br /><sub><b>Ilya Semenov</b></sub></a><br /><a href="#ideas-IlyaSemenov" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AIlyaSemenov" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=IlyaSemenov" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/abdollahzadehAli"><img src="https://avatars.githubusercontent.com/u/96317431?v=4?s=100" width="100px;" alt="abdollahzadehAli"/><br /><sub><b>abdollahzadehAli</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=abdollahzadehAli" title="Documentation">📖</a> <a href="#example-abdollahzadehAli" title="Examples">💡</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/MrSaeedNasiri"><img src="https://avatars.githubusercontent.com/u/17780289?v=4?s=100" width="100px;" alt="Saeed Nasiri"/><br /><sub><b>Saeed Nasiri</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MrSaeedNasiri" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Scrip7"><img src="https://avatars.githubusercontent.com/u/37535505?v=4?s=100" width="100px;" alt="Hesoyam"/><br /><sub><b>Hesoyam</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Scrip7" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://yrz.am"><img src="https://avatars.githubusercontent.com/u/96742416?v=4?s=100" width="100px;" alt="yrzam"/><br /><sub><b>yrzam</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ayrzam" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/drmikecrowe"><img src="https://avatars.githubusercontent.com/u/90312?v=4?s=100" width="100px;" alt="drmikecrowe"/><br /><sub><b>drmikecrowe</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Adrmikecrowe" title="Reviewed Pull Requests">👀</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://rys.pw"><img src="https://avatars.githubusercontent.com/u/1641362?v=4?s=100" width="100px;" alt="Martin"/><br /><sub><b>Martin</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=C0rn3j" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3AC0rn3j" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AC0rn3j" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://pavelpolyakov.com/"><img src="https://avatars.githubusercontent.com/u/839290?v=4?s=100" width="100px;" alt="Pavel"/><br /><sub><b>Pavel</b></sub></a><br /><a href="#example-PavelPolyakov" title="Examples">💡</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://youtube.com/thorwebdev"><img src="https://avatars.githubusercontent.com/u/5748289?v=4?s=100" width="100px;" alt="Thor 雷神 Schaeff"/><br /><sub><b>Thor 雷神 Schaeff</b></sub></a><br /><a href="#example-thorwebdev" title="Examples">💡</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/x066it"><img src="https://avatars.githubusercontent.com/u/75589380?v=4?s=100" width="100px;" alt="x066it"/><br /><sub><b>x066it</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ax066it" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Ax066it" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/kolay-v"><img src="https://avatars.githubusercontent.com/u/49853802?v=4?s=100" width="100px;" alt="kolay"/><br /><sub><b>kolay</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Akolay-v" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://enepom.com/"><img src="https://avatars.githubusercontent.com/u/2511553?v=4?s=100" width="100px;" alt="Evgeny Nepomnyashchiy"/><br /><sub><b>Evgeny Nepomnyashchiy</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Apizzaeater" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/anantakrishna"><img src="https://avatars.githubusercontent.com/u/6065071?v=4?s=100" width="100px;" alt="Ananta Krsna dasa"/><br /><sub><b>Ananta Krsna dasa</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=anantakrishna" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Mi3liX9"><img src="https://avatars.githubusercontent.com/u/26169870?v=4?s=100" width="100px;" alt="Mighty Ali"/><br /><sub><b>Mighty Ali</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Mi3liX9" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AMi3liX9" title="Reviewed Pull Requests">👀</a> <a href="#ideas-Mi3liX9" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://oott123.com"><img src="https://avatars.githubusercontent.com/u/905663?v=4?s=100" width="100px;" alt="三三"/><br /><sub><b>三三</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aoott123" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=oott123" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="http://roz.ninja"><img src="https://avatars.githubusercontent.com/u/3948961?v=4?s=100" width="100px;" alt="Roz"/><br /><sub><b>Roz</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aroziscoding" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=roziscoding" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Aroziscoding" title="Reviewed Pull Requests">👀</a> <a href="#infra-roziscoding" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-roziscoding" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-roziscoding" title="Mentoring">🧑‍🏫</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/daniharo"><img src="https://avatars.githubusercontent.com/u/47931084?v=4?s=100" width="100px;" alt="Dani Haro"/><br /><sub><b>Dani Haro</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=daniharo" title="Code">💻</a> <a href="#plugin-daniharo" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=daniharo" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Ryukaizen"><img src="https://avatars.githubusercontent.com/u/55140313?v=4?s=100" width="100px;" alt="Ryukaizen"/><br /><sub><b>Ryukaizen</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Ryukaizen" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/mcpeblocker"><img src="https://avatars.githubusercontent.com/u/59408255?v=4?s=100" width="100px;" alt="Alisher Ortiqov"/><br /><sub><b>Alisher Ortiqov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=mcpeblocker" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/tonytkachenko"><img src="https://avatars.githubusercontent.com/u/103267335?v=4?s=100" width="100px;" alt="Tony Tkachenko"/><br /><sub><b>Tony Tkachenko</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=tonytkachenko" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/rainrisa"><img src="https://avatars.githubusercontent.com/u/108156134?v=4?s=100" width="100px;" alt="Ra"/><br /><sub><b>Ra</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=rainrisa" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/sartoshi-foot-dao"><img src="https://avatars.githubusercontent.com/u/99770068?v=4?s=100" width="100px;" alt="sartoshi-foot-dao"/><br /><sub><b>sartoshi-foot-dao</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=sartoshi-foot-dao" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/yn4v4s"><img src="https://avatars.githubusercontent.com/u/35275827?v=4?s=100" width="100px;" alt="Yoel Navas E."/><br /><sub><b>Yoel Navas E.</b></sub></a><br /><a href="#ideas-yn4v4s" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/vitorleo"><img src="https://avatars.githubusercontent.com/u/5118352?v=4?s=100" width="100px;" alt="Vitor Gomes"/><br /><sub><b>Vitor Gomes</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Avitorleo" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=vitorleo" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="http://xditya.me/"><img src="https://avatars.githubusercontent.com/u/58950863?v=4?s=100" width="100px;" alt="Aditya"/><br /><sub><b>Aditya</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Axditya" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Axditya" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://uditkaro.de"><img src="https://avatars.githubusercontent.com/u/30829387?v=4?s=100" width="100px;" alt="Udit Karode"/><br /><sub><b>Udit Karode</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Auditkarode" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://rockett.pw"><img src="https://avatars.githubusercontent.com/u/4586280?v=4?s=100" width="100px;" alt="Mike Rockétt"/><br /><sub><b>Mike Rockétt</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Amikerockett" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3Amikerockett" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/MrVSiK"><img src="https://avatars.githubusercontent.com/u/79159341?v=4?s=100" width="100px;" alt="Srinivasa IK Varanasi"/><br /><sub><b>Srinivasa IK Varanasi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MrVSiK" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/abdoo9"><img src="https://avatars.githubusercontent.com/u/63903814?v=4?s=100" width="100px;" alt="abdoo9"/><br /><sub><b>abdoo9</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aabdoo9" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=abdoo9" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="http://ak4zh.com"><img src="https://avatars.githubusercontent.com/u/26350053?v=4?s=100" width="100px;" alt="ak4zh"/><br /><sub><b>ak4zh</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Aak4zh" title="Reviewed Pull Requests">👀</a> <a href="#ideas-ak4zh" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=ak4zh" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/nlapshin"><img src="https://avatars.githubusercontent.com/u/39495311?v=4?s=100" width="100px;" alt="Nikolay Lapshin"/><br /><sub><b>Nikolay Lapshin</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=nlapshin" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Aquathing"><img src="https://avatars.githubusercontent.com/u/81624781?v=4?s=100" width="100px;" alt="Aquatica"/><br /><sub><b>Aquatica</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Aquathing" title="Documentation">📖</a> <a href="#question-Aquathing" title="Answering Questions">💬</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/fadzikri"><img src="https://avatars.githubusercontent.com/u/109416385?v=4?s=100" width="100px;" alt="Fa Dzikri"/><br /><sub><b>Fa Dzikri</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Afadzikri" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=fadzikri" title="Documentation">📖</a> <a href="#translation-fadzikri" title="Translation">🌍</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/solidprinciples"><img src="https://avatars.githubusercontent.com/u/7939765?v=4?s=100" width="100px;" alt="Chandler Lattin"/><br /><sub><b>Chandler Lattin</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=solidprinciples" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Asolidprinciples" title="Reviewed Pull Requests">👀</a> <a href="#plugin-solidprinciples" title="Plugin/utility libraries">🔌</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/sparfenyuk"><img src="https://avatars.githubusercontent.com/u/134065?v=4?s=100" width="100px;" alt="Sergey Parfenyuk"/><br /><sub><b>Sergey Parfenyuk</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Asparfenyuk" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/felinto-dev"><img src="https://avatars.githubusercontent.com/u/32253743?v=4?s=100" width="100px;" alt="Émerson Felinto"/><br /><sub><b>Émerson Felinto</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Afelinto-dev" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/stPitty"><img src="https://avatars.githubusercontent.com/u/85024641?v=4?s=100" width="100px;" alt="Petr Stankin"/><br /><sub><b>Petr Stankin</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3AstPitty" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/ByMsx"><img src="https://avatars.githubusercontent.com/u/5565836?v=4?s=100" width="100px;" alt="Maxim Lebedev"/><br /><sub><b>Maxim Lebedev</b></sub></a><br /><a href="#ideas-ByMsx" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=ByMsx" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Madnex"><img src="https://avatars.githubusercontent.com/u/14137610?v=4?s=100" width="100px;" alt="Madnex"/><br /><sub><b>Madnex</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Madnex" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/tup4ienko"><img src="https://avatars.githubusercontent.com/u/89318613?v=4?s=100" width="100px;" alt="Svyatoslav Tupchienko"/><br /><sub><b>Svyatoslav Tupchienko</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=tup4ienko" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/evermake"><img src="https://avatars.githubusercontent.com/u/53311479?v=4?s=100" width="100px;" alt="Vladislav Deryabkin"/><br /><sub><b>Vladislav Deryabkin</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aevermake" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=evermake" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Aevermake" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/kashyapndps00"><img src="https://avatars.githubusercontent.com/u/98746601?v=4?s=100" width="100px;" alt="Kashyap Sharma"/><br /><sub><b>Kashyap Sharma</b></sub></a><br /><a href="#example-kashyapndps00" title="Examples">💡</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/AlexOwl"><img src="https://avatars.githubusercontent.com/u/47189254?v=4?s=100" width="100px;" alt="AlexOwl"/><br /><sub><b>AlexOwl</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3AAlexOwl" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=AlexOwl" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://www.shrimadhavuk.me/"><img src="https://avatars.githubusercontent.com/u/6317196?v=4?s=100" width="100px;" alt="Shrimadhav U K"/><br /><sub><b>Shrimadhav U K</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=SpEcHiDe" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/binamralamsal"><img src="https://avatars.githubusercontent.com/u/61900781?v=4?s=100" width="100px;" alt="Binamra Lamsal"/><br /><sub><b>Binamra Lamsal</b></sub></a><br /><a href="#ideas-binamralamsal" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/gertminov"><img src="https://avatars.githubusercontent.com/u/78727928?v=4?s=100" width="100px;" alt="gertminov"/><br /><sub><b>gertminov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=gertminov" title="Documentation">📖</a> <a href="#tutorial-gertminov" title="Tutorials">✅</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/amanape"><img src="https://avatars.githubusercontent.com/u/83104063?v=4?s=100" width="100px;" alt="Stephan Psaras"/><br /><sub><b>Stephan Psaras</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aamanape" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/shevernitskiy"><img src="https://avatars.githubusercontent.com/u/28886342?v=4?s=100" width="100px;" alt="shevernitskiy"/><br /><sub><b>shevernitskiy</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ashevernitskiy" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Ashevernitskiy" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=shevernitskiy" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/mrmaster009"><img src="https://avatars.githubusercontent.com/u/81420490?v=4?s=100" width="100px;" alt="mrmaster009"/><br /><sub><b>mrmaster009</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=mrmaster009" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://lwjerri.dev/"><img src="https://avatars.githubusercontent.com/u/50290430?v=4?s=100" width="100px;" alt="Andrey Zontov"/><br /><sub><b>Andrey Zontov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3ALWJerri" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=LWJerri" title="Code">💻</a> <a href="#question-LWJerri" title="Answering Questions">💬</a> <a href="#ideas-LWJerri" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=LWJerri" title="Documentation">📖</a> <a href="#translation-LWJerri" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/AbbassAlmusawi"><img src="https://avatars.githubusercontent.com/u/73327881?v=4?s=100" width="100px;" alt="Abbass Al-Musawi"/><br /><sub><b>Abbass Al-Musawi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=AbbassAlmusawi" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/inji-gg"><img src="https://avatars.githubusercontent.com/u/5071242?v=4?s=100" width="100px;" alt="ArunR"/><br /><sub><b>ArunR</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ainji-gg" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=inji-gg" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/ndatg"><img src="https://avatars.githubusercontent.com/u/108090198?v=4?s=100" width="100px;" alt="NDA"/><br /><sub><b>NDA</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Andatg" title="Bug reports">🐛</a> <a href="#ideas-ndatg" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=ndatg" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/MatyiFKBT"><img src="https://avatars.githubusercontent.com/u/6183867?v=4?s=100" width="100px;" alt="MatyiFKBT"/><br /><sub><b>MatyiFKBT</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MatyiFKBT" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://chrisandrew.cl"><img src="https://avatars.githubusercontent.com/u/368831?v=4?s=100" width="100px;" alt="Chris Andrew C. L."/><br /><sub><b>Chris Andrew C. L.</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Achrisandrewcl" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=chrisandrewcl" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Achrisandrewcl" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/kiyasov"><img src="https://avatars.githubusercontent.com/u/16527461?v=4?s=100" width="100px;" alt="Islam Kiiasov"/><br /><sub><b>Islam Kiiasov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=kiyasov" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/ssistoza"><img src="https://avatars.githubusercontent.com/u/17445445?v=4?s=100" width="100px;" alt="Shane Avery Sistoza"/><br /><sub><b>Shane Avery Sistoza</b></sub></a><br /><a href="#ideas-ssistoza" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=ssistoza" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/commits?author=ssistoza" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/MaicolAntali"><img src="https://avatars.githubusercontent.com/u/79454487?v=4?s=100" width="100px;" alt="Maicol"/><br /><sub><b>Maicol</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MaicolAntali" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/Nazar-Ant"><img src="https://avatars.githubusercontent.com/u/75927667?v=4?s=100" width="100px;" alt="Nazar Antoniuk"/><br /><sub><b>Nazar Antoniuk</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Nazar-Ant" title="Documentation">📖</a> <a href="#translation-Nazar-Ant" title="Translation">🌍</a> <a href="#maintenance-Nazar-Ant" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/MajorLettuce"><img src="https://avatars.githubusercontent.com/u/3730149?v=4?s=100" width="100px;" alt="Aleksei Ivanov"/><br /><sub><b>Aleksei Ivanov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AMajorLettuce" title="Reviewed Pull Requests">👀</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/PonomareVlad"><img src="https://avatars.githubusercontent.com/u/2877584?v=4?s=100" width="100px;" alt="Vladislav Ponomarev"/><br /><sub><b>Vladislav Ponomarev</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=PonomareVlad" title="Tests">⚠️</a> <a href="https://github.com/grammyjs/grammY/commits?author=PonomareVlad" title="Code">💻</a> <a href="#platform-PonomareVlad" title="Packaging/porting to new platform">📦</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/louietyj"><img src="https://avatars.githubusercontent.com/u/11096034?v=4?s=100" width="100px;" alt="Louie Tan"/><br /><sub><b>Louie Tan</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Alouietyj" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/lejovaar7"><img src="https://avatars.githubusercontent.com/u/26439842?v=4?s=100" width="100px;" alt="Leandro Vargas"/><br /><sub><b>Leandro Vargas</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Alejovaar7" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=lejovaar7" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/shaunnope"><img src="https://avatars.githubusercontent.com/u/19631195?v=4?s=100" width="100px;" alt="Sean Yap"/><br /><sub><b>Sean Yap</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ashaunnope" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=shaunnope" title="Code">💻</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://sergeysolovev.com"><img src="https://avatars.githubusercontent.com/u/5831301?v=4?s=100" width="100px;" alt="Sergey Solovev"/><br /><sub><b>Sergey Solovev</b></sub></a><br /><a href="#ideas-sergeysolovev" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Asergeysolovev" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="11.11%"><a href="https://github.com/HeySreelal"><img src="https://avatars.githubusercontent.com/u/94184909?v=4?s=100" width="100px;" alt="Sree (Taylor's Version)"/><br /><sub><b>Sree (Taylor's Version)</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3AHeySreelal" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=HeySreelal" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!
