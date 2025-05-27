import { createCache } from "jsr:@deno/cache-dir@0.13.2";
import { bundle } from "jsr:@deno/emit@0.46.0";

// Parse args
const [release, source = `https://deno.land/x/grammy@${release}/mod.ts`] =
    Deno.args;
if (!release) throw new Error("No release specified!");

// Rewrite imports from .deno.ts to .web.ts
const cache = createCache();
const load = (specifier: string) => {
    if (specifier.endsWith(".deno.ts")) {
        const baseLength = specifier.length - ".deno.ts".length;
        specifier = specifier.substring(0, baseLength) + ".web.ts";
    }
    return cache.load(specifier);
};

console.log(`Bundling version '${release}' from ${source} ...`);
// Bundle code
const { code: bundledCode } = await bundle(source, {
    load,
    compilerOptions: {
        sourceMap: false,
        inlineSources: false,
        inlineSourceMap: false,
    },
});

console.log("Emitting ...");
await Deno.writeTextFile("../out/web.mjs", bundledCode);
await Deno.writeTextFile(
    "../out/web.d.ts",
    'export * from "./mod";\n',
);

console.log("Done.");
