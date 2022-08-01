# Contributing to grammY

First of all, thanks for your interest in helping out!
We appreciate any kind of support, be it small bug fixes, large feature contributions, or even just if you drop us a message with some constructive criticism how grammY can be improved for your use case.
This library would not be possible without you.

We believe it is a strength of grammY to provide an integrated experience to its users.
Important plugins have a dedicated page right inside the main documentation, and they are published under @grammyjs both on GitHub and on npm.
If you have a good idea, don't hesitate to tell us in the group chat!
We can grant you access to the GitHub Organization, so you can get a dedicated repository under our name, and publish your code as an offcial plugin of grammY.
You will be responsible for maintaining it.

## A Few Words on Deno and Node

**TL;DR** working on grammY means working on a Deno project, and that is a good thing.

grammY started out as a hybrid project, targeting both Deno and Node.js as runtimes not long after the Deno 1.0 release.
In the beginning, this posed a challenge to grammY.
There were no sufficiently good tools to convert a codebase back and forth between the ecosystems, so we had to maintain our own shell scripts to convert the Deno code to run under Node.js.

However, after some time the amazing tool `deno2node` emerged out of grammY's need.
It solves this problem substantially better by providing a Deno-aware wrapper of the TypeScript compiler.
Hence, you can write a Deno project and directly compile it to JavaScript files that run under Node.js.

In other words, working on grammY effectively means work on a Deno project.
We use Deno testing, Deno linting, Deno formatting, and the [Deno extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) for VSCode.
Your usual TypeScript tooling does not work—and once you tried developing for Deno and you have experienced how superior the development experience is, you will know why we are happy about our choice.

> Note that not all plugins of grammY have to have the same setup: many of them only integrate with grammY itself, and hence can be written for Node and automatically ported to Deno via <https://skypack.dev/> and similar services.

## How to Contribute

There are several areas of contributions, and they have different ways to get you started.

- **Docs.**
  You can always just edit the documentation by clicking the link at the bottom of the respective page.
  This will open a pull request on GitHub.
- **Core.**
  We are happy to take pull requests of any kind against the core code base of grammY.
  If you're unsure whether or not your work goes in the right direction, simply ask about it in an issue or in the [Telegram chat](https://telegram.me/grammyjs).
- **Plugins.**
  There are both official plugins and third-party plugins.
  Our official plugins need to be of high quality (100 % TypeScript, ES6, Deno support, docs that are on par with grammY, semver, etc).
  Third-party plugins are independent and anyone can do them however they want.
  If a third-party plugin was to be listed on the website, some docs would be nice.
- **Storage adapters.**
  Please send a message to the [group chat](https://telegram.me/grammyjs) if you want to create an offical storage adapter for the [session plugin](https://grammy.dev/plugins/session.html).
  You will be granted all necessary permissions, and the repository will be listed [here](https://grammy.dev/plugins/session.html#official).
  Consider checking out an existing implementation to make your life easier, e.g. [this one](https://github.com/grammyjs/storage-firestore/blob/main/src/index.ts).
- **Issues, bugs, and everything else.**
  We're happy to hear from you if you want to report a bug, request a feature, or contribute anything else—also if it is not code.
  There are no technical steps to this.

### Working on the Core of grammY using Deno (recommended)

If you just want to build from the newest version of the source code on GitHub, you can directly import from `https://raw.githubusercontent.com/grammyjs/grammY/main/src/mod.ts`.
(Naturally, you can replace main by another branch name, e.g. in order to test a PR.)

#### Coding

If you want to read or modify grammY's code, you can do the following.

1. Install Deno from <https://deno.land>.
2. Use <https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno> or a similar extension if you are using a different editor.
3. Clone this repo.
4. Run `deno task check` in the root directory of the repo.
   This will download and cache all dependencies and typecheck the complete code base.

You are now ready to work on grammY.
Before you open a PR, make sure to run `deno task dev` on the Deno codebase.

#### Test Coverage

A CI job will determine the test coverage for your changes, and comment them on GitHub.
If you want to see the code coverage locally, you need to have [LCOV](https://github.com/linux-test-project/lcov) installed (trying installing the `lcov` package).
This should give you `genhtml`, a tool to display LCOV code coverage.

1. Run `deno task coverage` to generate test coverage files.
2. Run `deno task report` to generate an HTML report for the coverage.
3. Point your browser to `./test/coverage/index.html` to view the test coverage.

### Working on the Core of grammY using Node.js

You can install grammY directly from source via

```sh
# main branch
npm install grammyjs/grammy
# another branch, e.g. called branch-name
npm install grammyjs/grammy#branch-name
```

which will download grammY and build the code locally.

If you want to read or modify grammY's code, you can do the following.

1. Clone this repo.
2. Install the dependencies via `npm install`.
   This will also compile the project for you.
3. Use [`npm link`](https://docs.npmjs.com/cli/v7/commands/npm-link) to integrate grammY into your bot project.
4. After changing the code, you can run `npm run backport` to compile the code.

### Working on an Official Plugin of grammY

This works analogously to the grammY core development.

If you want to publish a new official plugin, a quick message in the [group chat](https://telegram.me/grammyjs) is enough and you will be granted the necessary permissions to work on a repository under the [@grammyjs](https://github.com/grammyjs) organisation on GitHub, and to publish your plugin on npm.
You will be responsible for maintaining it, but perhaps other people will join in.
