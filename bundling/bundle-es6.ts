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
const versions: string[] = [vs.filter((v: string) => v.startsWith("v1"))[0]];
console.log("Found", versions.length, "stable releases");
console.log(versions);

function url(version: string) {
    return `https://deno.land/x/grammy@${version}/mod.ts`;
}

// === CACHING
async function cache(url: string) {
    await Deno.run({ cmd: ["deno", "cache", url] }).status();
}

console.log("Caching source code");
await cache("../src/mod.ts");
console.log("Caching releases ...");
await throttle(versions.map(url).map((v: string) => () => cache(v)));

// === BUNDLING
let progress = 0;
const steps = 3 * versions.length + 3;
function tick() {
    progress++;
    const percent = progress / steps * 100;
    console.log(percent.toFixed(1), "%");
}

async function createBundle(source: string, release: string) {
    const es6 = await Deno.emit(source, {
        bundle: "module",
        compilerOptions: { target: "es6" },
    }).then((res) => res.files["deno:///bundle.js"]);
    tick();
    const bundle = await Deno.emit("/src.js", {
        sources: { "/src.js": es6 },
        compilerOptions: { target: "es6" },
    }).then((res) => res.files["file:///src.js"]);
    const path = `./bundles/es6-${release}.js`;
    tick();
    await Deno.writeTextFile(path, bundle);
    tick();
}

console.log("Bundling source and releases ...");
await Deno.mkdir("./bundles/", { recursive: true });
console.log("Bundling source ...");
await createBundle("../src/mod.ts", "dev");
console.log("Bundling releases ...");
await throttle(versions.map((v: string) => () => createBundle(url(v), v)));
console.log("Done! Created files:");
for await (const path of Deno.readDir("./bundles/")) {
    console.log(path.name);
}
console.log("ES6 bundling script complete.");
