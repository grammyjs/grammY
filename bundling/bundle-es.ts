// Parse args
const [release, source = `https://deno.land/x/grammy@${release}/mod.ts`] =
    Deno.args;
if (!release) throw new Error("No release specified!");
// Bundle code
const bundled = await Deno.emit(source, { bundle: "module" });
const bundledCode = bundled.files["deno:///bundle.js"];
console.log("Bundled", release);
// Transpile code
for (const target of ["es6", "esnext"] as const) {
    const transpiled = await Deno.emit("/src.ts", {
        sources: { "/src.ts": bundledCode },
        compilerOptions: { target },
    });
    const transpiledCode = transpiled.files["file:///src.ts.js"];
    console.log("Transpiled", release, "to", target);
    const path = `bundles/${target}@${release}.js`;
    await Deno.writeTextFile(path, transpiledCode);
    console.log("Wrote", path);
}
