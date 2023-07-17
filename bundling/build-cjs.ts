#!/usr/bin/env -S deno run --no-prompt --allow-read=. --allow-write=out/
import {
    Context,
    deno2node,
    emit,
    ts,
} from "https://raw.githubusercontent.com/fromdeno/deno2node/70cddb305e3e65f51da4c34e7e8ebfc5f2085d38/src/mod.ts";

const compilerOptions: ts.CompilerOptions = {
    "forceConsistentCasingInFileNames": true,
    "newLine": ts.NewLineKind.LineFeed,
    "noImplicitReturns": true,
    "noUnusedParameters": true,
    "rootDir": "src/",
    "strict": true,
    "declaration": true,
    "module": ts.ModuleKind.CommonJS,
    "outDir": "out/",
    "skipLibCheck": true,
    "target": ts.ScriptTarget.ES2019,
};

const ctx = new Context({ compilerOptions });
ctx.config = { shim: "src/shim.node.ts" };

console.time("Loading source files");
ctx.project.addSourceFilesAtPaths(Deno.args);
ctx.project.resolveSourceFileDependencies();
console.timeEnd("Loading source files");

await deno2node(ctx);

console.time("Emitting");
const diagnostics = await emit(ctx.project);
console.timeEnd("Emitting");

if (diagnostics.length !== 0) {
    console.info(ctx.project.formatDiagnosticsWithColorAndContext(diagnostics));
    console.info("TypeScript", ts.version);
    console.info(`Found ${diagnostics.length} errors.`);
    Deno.exit(1);
}
