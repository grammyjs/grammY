import { bundle, emit } from "https://deno.land/x/emit@0.0.1/mod.ts";
// Parse args
const [release, source = `https://deno.land/x/grammy@${release}/mod.ts`] =
    Deno.args;
if (!release) throw new Error("No release specified!");
// Bundle code
const { code } = await bundle(
    source.startsWith("http") ? source : `file://${source}`,
);
const file = await Deno.makeTempFile({ suffix: ".ts" });
await Deno.writeTextFile(file, code);
// Transpile code
for (const target of ["es6", "esnext"] as const) {
    const transpiled = await emit(`file://${file}`);
    const transpiledCode = Object.values(transpiled)[0];
    console.log("Transpiled", release, "to", target);
    const path = `bundles/${target}@${release}.js`;
    await Deno.writeTextFile(path, transpiledCode);
    console.log("Wrote", path);
}
