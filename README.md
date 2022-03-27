# <h1 align="center"> [![grammY](https://raw.githubusercontent.com/grammyjs/website/main/logos/grammY.png)](https://grammy.dev)</h1>

**<h1 align="right">The Telegram Bot Framework.</h1>**

---

_<h2 align="center"> [:mag: Documentation](https://grammy.dev) | [:page_with_curl: API Reference](https://doc.deno.land/https://deno.land/x/grammy/mod.ts) | [:busts_in_silhouette: Group Chat](https://telegram.me/grammyjs) | [:new: News](https://telegram.me/grammyjs_news)</h2>_

<div align="center">

<!-- deno-fmt-ignore-start -->

[![Bot API](https://img.shields.io/badge/Bot%20API-5.7-blue?logo=telegram&style=flat-square)](https://core.telegram.org/bots/api)
[![npm](https://img.shields.io/npm/v/grammy?logo=npm&style=flat-square)](https://www.npmjs.org/package/grammy) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-50-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- deno-fmt-ignore-end -->

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

grammY has an excellent [documentation](https://grammy.dev), and an [API Reference](https://doc.deno.land/https://deno.land/x/grammy/mod.ts). It even integrates with your code editor, e.g. [VSCode](https://code.visualstudio.com/). You can hover over any element of grammY to get a detailed description of what that thing does or means.

If you are still stuck, just join the [Telegram chat](https://t.me/grammyjs) and ask for help. People are nice there and we appreciate your question, no matter what it is :)

Here are some more resources to support you:

## Resources

### [grammY Website](https://grammy.dev)

—main project website and documentation.

### [grammY API Reference](https://doc.deno.land/https://deno.land/x/grammy/mod.ts)

—reference of everything that grammY exports.

### [grammY Example Bots](https://github.com/grammyjs/examples)

—repository full of example bots. Includes a setup to easily run any of them.

### [grammY Telegram Chat](https://t.me/grammyjs)

—Telegram chat where you can ask any question about grammY or bots in general. We are also open for feedback, ideas, and contributions!

The Russian commnity chat can be found [here](https://t.me/grammyjs_ru).

### [grammY News Channel](https://t.me/grammyjs_news)

—Telegram channel where updates to grammY and the ecosystem are posted.

### [Telegram Bot API Reference](https://core.telegram.org/bots/api)

—documentation of the API that Telegram offers, and that grammY connects to under the hood.

## Deno Support

All grammY packages published by [@grammyjs](https://github.com/grammyjs) run natively on [Deno](https://deno.land). We are compiling every codebase to still run on Node.js.

However, given that most bot developers are still using Node.js, all documentation is written Node.js-first. We may migrate it if Deno overtakes Node.js. If you are already on Deno today, import grammY from [`https://deno.land/x/grammy/mod.ts`](https://deno.land/x/grammy).

You may also be interested in [why we support Deno](https://grammy.dev/resources/faq.html#why-do-you-support-deno).

## Browser Support

The grammY core package in this repository is avaiable as a JavaScript bundle from the CDN at `get.grammy.dev`.
Currently, we transpile all stable versions (all releases since v1.0) as well as the current `main` branch to ES3, ES5, ES6, and ESNext.

You can download them from the URL `https://get.grammy.dev/[ES version lowercased]@[grammY version including v-prefix].js`.
For example, the most recent source on `main` in ES6 is available from <https://get.grammy.dev/es6@dev.js>.

So far, this is mainly useful for running bots on Cloudflare Workers.

## [Contribution Guide »](./CONTRIBUTING.md)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/KnorpelSenf"><img src="https://avatars.githubusercontent.com/u/12952387?v=4?s=100" width="100px;" alt=""/><br /><sub><b>KnorpelSenf</b></sub></a><br /><a href="#ideas-KnorpelSenf" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Documentation">📖</a> <a href="#design-KnorpelSenf" title="Design">🎨</a> <a href="#example-KnorpelSenf" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnorpelSenf" title="Tests">⚠️</a> <a href="#plugin-KnorpelSenf" title="Plugin/utility libraries">🔌</a> <a href="#platform-KnorpelSenf" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AKnorpelSenf" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-KnorpelSenf" title="Mentoring">🧑‍🏫</a> <a href="#projectManagement-KnorpelSenf" title="Project Management">📆</a> <a href="#infra-KnorpelSenf" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/Tecardo1"><img src="https://avatars.githubusercontent.com/u/42873000?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tecardo1</b></sub></a><br /><a href="#plugin-Tecardo1" title="Plugin/utility libraries">🔌</a> <a href="#userTesting-Tecardo1" title="User Testing">📓</a> <a href="#example-Tecardo1" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/commits?author=Tecardo1" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3ATecardo1" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/wojpawlik"><img src="https://avatars.githubusercontent.com/u/23058303?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Wojciech Pawlik</b></sub></a><br /><a href="#ideas-wojpawlik" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Awojpawlik" title="Reviewed Pull Requests">👀</a> <a href="#infra-wojpawlik" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-wojpawlik" title="Packaging/porting to new platform">📦</a> <a href="#tool-wojpawlik" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/MegaITA"><img src="https://avatars.githubusercontent.com/u/32493080?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alessandro Bertozzi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=MegaITA" title="Documentation">📖</a></td>
    <td align="center"><a href="https://trgwii.no/"><img src="https://avatars.githubusercontent.com/u/11262022?v=4?s=100" width="100px;" alt=""/><br /><sub><b>trgwii</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=trgwii" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Atrgwii" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/KnightNiwrem"><img src="https://avatars.githubusercontent.com/u/9781814?v=4?s=100" width="100px;" alt=""/><br /><sub><b>KnightNiwrem</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=KnightNiwrem" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3AKnightNiwrem" title="Bug reports">🐛</a> <a href="#plugin-KnightNiwrem" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=KnightNiwrem" title="Documentation">📖</a> <a href="#example-KnightNiwrem" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AKnightNiwrem" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-KnightNiwrem" title="Mentoring">🧑‍🏫</a></td>
    <td align="center"><a href="https://mkr.pw"><img src="https://avatars.githubusercontent.com/u/19621208?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Muthu Kumar</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AMKRhere" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://edjopato.de/"><img src="https://avatars.githubusercontent.com/u/7953011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>EdJoPaTo</b></sub></a><br /><a href="#plugin-EdJoPaTo" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=EdJoPaTo" title="Documentation">📖</a> <a href="#ideas-EdJoPaTo" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AEdJoPaTo" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3AEdJoPaTo" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=EdJoPaTo" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Amir-Zouerami"><img src="https://avatars.githubusercontent.com/u/53701884?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Amir Zouerami</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Amir-Zouerami" title="Documentation">📖</a> <a href="#plugin-Amir-Zouerami" title="Plugin/utility libraries">🔌</a> <a href="#example-Amir-Zouerami" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/roj1512"><img src="https://avatars.githubusercontent.com/u/49933115?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Roj</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=roj1512" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Aroj1512" title="Reviewed Pull Requests">👀</a> <a href="#infra-roj1512" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#translation-roj1512" title="Translation">🌍</a> <a href="https://github.com/grammyjs/grammY/commits?author=roj1512" title="Code">💻</a> <a href="#ideas-roj1512" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-roj1512" title="Mentoring">🧑‍🏫</a></td>
    <td align="center"><a href="https://github.com/jokasimr"><img src="https://avatars.githubusercontent.com/u/20954731?v=4?s=100" width="100px;" alt=""/><br /><sub><b>jokasimr</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ajokasimr" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/CikiMomogi"><img src="https://avatars.githubusercontent.com/u/74030149?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ciki Momogi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=CikiMomogi" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/AndreoliBR"><img src="https://avatars.githubusercontent.com/u/15970011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AndreoliBR</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AAndreoliBR" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/Loskir"><img src="https://avatars.githubusercontent.com/u/21295738?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kirill Loskutov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Loskir" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3ALoskir" title="Bug reports">🐛</a> <a href="#ideas-Loskir" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://lungers.com/"><img src="https://avatars.githubusercontent.com/u/32808683?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Lane</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3AAndrewLaneX" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AAndrewLaneX" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/code-withAshish"><img src="https://avatars.githubusercontent.com/u/73625149?v=4?s=100" width="100px;" alt=""/><br /><sub><b>code-withAshish</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=code-withAshish" title="Documentation">📖</a></td>
    <td align="center"><a href="https://beta.ku-di.com/waptik"><img src="https://avatars.githubusercontent.com/u/1687551?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stephane Mensah</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Awaptik" title="Bug reports">🐛</a> <a href="#plugin-waptik" title="Plugin/utility libraries">🔌</a></td>
    <td align="center"><a href="https://github.com/Asaku01"><img src="https://avatars.githubusercontent.com/u/29716396?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Asaku01</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Asaku01" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/ppsimn"><img src="https://avatars.githubusercontent.com/u/88509883?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ppsimn</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Appsimn" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://satont.js.org/"><img src="https://avatars.githubusercontent.com/u/42675886?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Satont</b></sub></a><br /><a href="#plugin-Satont" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/commits?author=Satont" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/deptyped"><img src="https://avatars.githubusercontent.com/u/26162440?v=4?s=100" width="100px;" alt=""/><br /><sub><b>deptyped</b></sub></a><br /><a href="#example-deptyped" title="Examples">💡</a> <a href="https://github.com/grammyjs/grammY/commits?author=deptyped" title="Documentation">📖</a> <a href="#tutorial-deptyped" title="Tutorials">✅</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/dzek69"><img src="https://avatars.githubusercontent.com/u/4936805?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jacek Nowacki</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=dzek69" title="Documentation">📖</a> <a href="https://github.com/grammyjs/grammY/commits?author=dzek69" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3Adzek69" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Adzek69" title="Reviewed Pull Requests">👀</a> <a href="#ideas-dzek69" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://blog.outv.im"><img src="https://avatars.githubusercontent.com/u/19144373?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Outvi V</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=outloudvi" title="Code">💻</a></td>
    <td align="center"><a href="https://bandism.net/"><img src="https://avatars.githubusercontent.com/u/22633385?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ikko Ashimine</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=eltociear" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/amberlionk"><img src="https://avatars.githubusercontent.com/u/29119723?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yevhen Denesiuk</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Aamberlionk" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/issues?q=author%3Aamberlionk" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=amberlionk" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/prazedotid"><img src="https://avatars.githubusercontent.com/u/19567624?v=4?s=100" width="100px;" alt=""/><br /><sub><b>prastian</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aprazedotid" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=prazedotid" title="Code">💻</a></td>
    <td align="center"><a href="https://sayem.eu.org/"><img src="https://avatars.githubusercontent.com/u/14138401?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sayem Chowdhury</b></sub></a><br /><a href="#ideas-sayem314" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/kospra"><img src="https://avatars.githubusercontent.com/u/42740406?v=4?s=100" width="100px;" alt=""/><br /><sub><b>kospra</b></sub></a><br /><a href="#ideas-kospra" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/commits?author=kospra" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/chimit"><img src="https://avatars.githubusercontent.com/u/839349?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chimit</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=chimit" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/CalsiBotDev"><img src="https://avatars.githubusercontent.com/u/55633371?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Calsi</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=CalsiBotDev" title="Documentation">📖</a></td>
    <td align="center"><a href="https://zohren.xyz"><img src="https://avatars.githubusercontent.com/u/15788906?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonas Zohren</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Ajfowl" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=jfowl" title="Code">💻</a></td>
    <td align="center"><a href="https://zhemu.buzz/"><img src="https://avatars.githubusercontent.com/u/56839018?v=4?s=100" width="100px;" alt=""/><br /><sub><b>linbuxiao</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=linbuxiao" title="Documentation">📖</a> <a href="#translation-linbuxiao" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/JiquanWang99"><img src="https://avatars.githubusercontent.com/u/63894579?v=4?s=100" width="100px;" alt=""/><br /><sub><b>JiquanWang99</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=JiquanWang99" title="Documentation">📖</a> <a href="#translation-JiquanWang99" title="Translation">🌍</a></td>
    <td align="center"><a href="http://bor691.ir/"><img src="https://avatars.githubusercontent.com/u/4184939?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Borhan Hafez</b></sub></a><br /><a href="#plugin-zumoshi" title="Plugin/utility libraries">🔌</a></td>
    <td align="center"><a href="https://blog.limx.dev/"><img src="https://avatars.githubusercontent.com/u/6434137?v=4?s=100" width="100px;" alt=""/><br /><sub><b>WingLim</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=WingLim" title="Documentation">📖</a> <a href="#translation-WingLim" title="Translation">🌍</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/taotie111"><img src="https://avatars.githubusercontent.com/u/44166322?v=4?s=100" width="100px;" alt=""/><br /><sub><b>taotie111</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=taotie111" title="Documentation">📖</a> <a href="#translation-taotie111" title="Translation">🌍</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/merlin-brandes-42328717a/"><img src="https://avatars.githubusercontent.com/u/14237330?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Merlin</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=FatalMerlin" title="Documentation">📖</a></td>
    <td align="center"><a href="https://darve.sh"><img src="https://avatars.githubusercontent.com/u/22394081?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Darvesh</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Adarvesh" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=darvesh" title="Code">💻</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Adarvesh" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://telegram.me/dcdunkan"><img src="https://avatars.githubusercontent.com/u/70066170?v=4?s=100" width="100px;" alt=""/><br /><sub><b>dcdunkan</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Adcdunkan" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=dcdunkan" title="Code">💻</a> <a href="#plugin-dcdunkan" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Adcdunkan" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=dcdunkan" title="Documentation">📖</a></td>
    <td align="center"><a href="https://xuann.wang/"><img src="https://avatars.githubusercontent.com/u/44045911?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kid</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=kidonng" title="Documentation">📖</a> <a href="#translation-kidonng" title="Translation">🌍</a></td>
    <td align="center"><a href="http://slava.fomin.io/"><img src="https://avatars.githubusercontent.com/u/1702725?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Slava Fomin II</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aslavafomin" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=slavafomin" title="Documentation">📖</a></td>
    <td align="center"><a href="https://kikobeats.com/"><img src="https://avatars.githubusercontent.com/u/2096101?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kiko Beats</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=Kikobeats" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////kraftwerk28.pp.ua"><img src="https://avatars.githubusercontent.com/u/31807671?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vsevolod</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=kraftwerk28" title="Code">💻</a> <a href="#ideas-kraftwerk28" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Akraftwerk28" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/habemuscode"><img src="https://avatars.githubusercontent.com/u/34692207?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Habemuscode</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3Ahabemuscode" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/grammyjs/grammY/commits?author=habemuscode" title="Documentation">📖</a></td>
    <td align="center"><a href="https://borodutch.com/"><img src="https://avatars.githubusercontent.com/u/3192028?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nikita Kolmogorov</b></sub></a><br /><a href="#plugin-backmeupplz" title="Plugin/utility libraries">🔌</a></td>
    <td align="center"><a href="http://glukki.ru"><img src="https://avatars.githubusercontent.com/u/140462?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vitaliy Meshchaninov</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Aglukki" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=glukki" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dilyanpalauzov"><img src="https://avatars.githubusercontent.com/u/4992947?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Дилян Палаузов</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/issues?q=author%3Adilyanpalauzov" title="Bug reports">🐛</a> <a href="https://github.com/grammyjs/grammY/commits?author=dilyanpalauzov" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lmx-Hexagram"><img src="https://avatars.githubusercontent.com/u/52130356?v=4?s=100" width="100px;" alt=""/><br /><sub><b>lmx-Hexagram</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=lmx-Hexagram" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/IlyaSemenov"><img src="https://avatars.githubusercontent.com/u/128121?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ilya Semenov</b></sub></a><br /><a href="#ideas-IlyaSemenov" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/grammyjs/grammY/pulls?q=is%3Apr+reviewed-by%3AIlyaSemenov" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/abdollahzadehAli"><img src="https://avatars.githubusercontent.com/u/96317431?v=4?s=100" width="100px;" alt=""/><br /><sub><b>abdollahzadehAli</b></sub></a><br /><a href="https://github.com/grammyjs/grammY/commits?author=abdollahzadehAli" title="Documentation">📖</a> <a href="#example-abdollahzadehAli" title="Examples">💡</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
