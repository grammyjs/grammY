console.log("ES6 bundling script started.");

// === THROTTLING UTILS
const CONCURRENCY = 4;
async function throttle(tasks: Array<() => Promise<void>>) {
    const workers = Array<Promise<void>>(CONCURRENCY).fill(Promise.resolve());
    for (let i = 0; i < tasks.length; i++) {
        const w = i % workers.length;
        const task = tasks[i];
        workers[w] = workers[w].then(task);
    }
    await Promise.all(workers);
}

// === LISTING VERSIONS
console.log("Fetching release list ...");
const res = await fetch("https://cdn.deno.land/grammy/meta/versions.json");
const { versions: vs } = await res.json();
const versions: string[] = vs.filter((v: string) => v.startsWith("v1"));
console.log("Found", versions.length, "stable releases");
console.log(versions);

function url(version: string) {
    return `https://deno.land/x/grammy@${version}/mod.ts`;
}

// === CACHING
async function cache(url: string) {
    console.log(url);
    await Deno.run({ cmd: ["deno", "cache", "--quiet", url] }).status();
}

console.log("Caching source code and releases ...");
const src = "../src/mod.ts";
await throttle([src, ...versions.map(url)].map((v) => () => cache(v)));

// === BUNDLING
type EmitArg1 = Parameters<typeof Deno.emit>[1];
type V = Required<Exclude<EmitArg1, undefined>>["compilerOptions"]["target"];
async function createBundle(input: string, release: string) {
    const bundled = await bundle(input);
    const targets = ["es3", "es5", "es6", "esnext"] as const;
    await throttle(targets.map((es) => () => transpile(bundled, release, es)));
}
async function bundle(source: string) {
    console.log("Bundling", source);
    const bundled = await Deno.emit(source, { bundle: "module" });
    const bundledCode = bundled.files["deno:///bundle.js"];
    return bundledCode;
}
async function transpile(source: string, release: string, es: V) {
    console.log("Transpiling", release, "to", es);
    const transpiled = await Deno.emit("/src.ts", {
        sources: { "/src.ts": source },
        compilerOptions: { target: es },
    });
    const transpiledCode = transpiled.files["file:///src.ts.js"];

    const path = `./bundles/${es}@${release}.js`;
    console.log("Writing", path);
    await Deno.writeTextFile(path, transpiledCode);
}

console.log("Bundling source and releases ...");
await Deno.mkdir("./bundles/", { recursive: true });
const inputs = [[src, "dev"], ...versions.map((v) => [url(v), v])];
await throttle(inputs.map(([url, v]) => () => createBundle(url, v)));
console.log("Done! Created files:");
for await (const path of Deno.readDir("./bundles/")) {
    console.log(path.name);
}
console.log("ES bundling script complete.");
