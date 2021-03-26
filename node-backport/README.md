# grammY for Node

If you haven't already, [install Node.js](https://nodejs.org/en/download/).

## Quickstart

### Simple example

Talk to [@BotFather](https://t.me/BotFather) to create a new Telegram bot and obtain a _bot token_.

Paste the following code into a new file `example-bot.js`.

```js
import { Bot } from 'grammy'
// This works, too (CommonJS modules):
// const { Bot } = require('grammy')

// Create bot
const bot = new Bot('<your-bot-token>')

// Listen for messages
bot.command('start', ctx => ctx.reply('Welcome! Send me your pics!'))
bot.on('message:photo' ctx => ctx.reply('Nice photo!'))

// Launch!
bot.launch()
```

**Congratulations!**
You have successfully created your first Telegram bot for Node.

You can run it like so:

```shellscript
node example-bot.js
```

### Advanced example

TODO: create more complicated example

```ts
const token = process.env.BOT_TOKEN;
```

```shellscript
node example-bot.js
```
