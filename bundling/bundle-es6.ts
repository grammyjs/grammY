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
await cache("../src/mod.ts");
await throttle(versions.map(url).map((v: string) => () => cache(v)));

// === BUNDLING
async function createBundle(source: string, release: string) {
    console.log(release);
    const bundleRes = await Deno.emit(source, { bundle: "module" });
    const bundle = bundleRes.files["deno:///bundle.js"];
    const transpileRes = await Deno.emit("/src.ts", {
        sources: { "/src.ts": bundle },
        compilerOptions: { target: "es6" },
    });
    const output = transpileRes.files["file:///src.ts.js"];
    const path = `./bundles/es6@${release}.js`;
    await Deno.writeTextFile(path, bundle);
}

console.log("Bundling source and releases ...");
await Deno.mkdir("./bundles/", { recursive: true });
await createBundle("../src/mod.ts", "dev");
await throttle(versions.map((v: string) => () => createBundle(url(v), v)));
console.log("Done! Created files:");
for await (const path of Deno.readDir("./bundles/")) {
    console.log(path.name);
}
console.log("ES6 bundling script complete.");
