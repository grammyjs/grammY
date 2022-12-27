import { bundle } from "https://deno.land/x/emit@0.12.0/mod.ts";

// Parse args
const [release, source = `https://deno.land/x/grammy@${release}/mod.ts`] =
    Deno.args;
if (!release) throw new Error("No release specified!");

// Bundle code
const { code: bundledCode } = await bundle(source, {
    compilerOptions: {
        sourceMap: false,
        inlineSources: false,
        inlineSourceMap: false,
    },
});

await Deno.writeTextFile(
    "../out/web.js",
    bundledCode.replace(/\/\/# sourceMappingURL=.*\n/, ""),
);
await Deno.writeTextFile(
    "../out/web.d.ts",
    'export * from "./mod"',
);
