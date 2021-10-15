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
  If a third-party plugins was to be listed on the website, some docs would be nice.
- **Storage adapters.**
  Please send a message to the [group chat](https://telegram.me/grammyjs) if you want to create an offical storage adapter for the [session plugin](https://grammy.dev/plugins/session.html).
  You will be granted all necessary permissions, and the repository will be listed [here](https://grammy.dev/plugins/session.html#official).
  Consider checking out an existing implementation to make your life easier, e.g. [this one](https://github.com/grammyjs/storage-firestore/blob/main/src/index.ts).
- **Issues, bugs, and everything else.**
  We're happy to hear from you if you want to report a bug, request a feature, or contribute anything else—also if it is not code.
  There are no technical steps to this.

### Working on the Core of grammY

1. Install Deno from <https://deno.land>.
2. Use <https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno> or a similar extension if you are using a different editor.
3. `cd` into `deno/` and run `deno cache src/mod.ts`.

You are now ready to work on grammY.

Before you open a PR, make sure to run `deno test` and `deno lint` on the Deno codebase, i.e. inside the `deno/` subdir.

### Working on an Official Plugin of grammY

This works analogously to the grammY core development.

If you want to publish a new official plugin, a quick message in the [group chat](https://telegram.me/grammyjs) is enough and you will be granted the necessary permissions to work on a repository under the [@grammyjs](https://github.com/grammyjs) organisation on GitHub, and to publish your plugin on npm.
You will be responsible for maintaining it, but perhaps other people will join in.
