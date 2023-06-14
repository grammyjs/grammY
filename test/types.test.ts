import { debug as d } from "../src/platform.deno.ts";
import { InputFile } from "../src/types.ts";
import {
    assertEquals,
    assertInstanceOf,
    assertRejects,
    assertStringIncludes,
    readAll,
    readerFromIterable,
    stub,
} from "./deps.test.ts";

Deno.test({
    name: "file name inference",
    fn() {
        assertEquals(new InputFile("/tmp/file.txt").filename, "file.txt");
        assertEquals(
            new InputFile((function* (): Iterable<Uint8Array> {})()).filename,
            undefined,
        );
        assertEquals(
            new InputFile({ url: "https://grammy.dev/file.txt" }).filename,
            "file.txt",
        );
        assertEquals(
            new InputFile({ url: "https://grammy.dev" }).filename,
            "grammy.dev",
        );
        assertEquals(
            new InputFile(new URL("https://grammy.dev/file.txt")).filename,
            "file.txt",
        );
        assertEquals(
            new InputFile(new URL("https://grammy.dev")).filename,
            "grammy.dev",
        );
    },
});

Deno.test({
    name: "invalid usage warning",
    fn() {
        const debug = stub(d as Console, "log");
        d.enable("*");
        new InputFile("http://grammy.dev");
        new InputFile("https://grammy.dev");
        d.disable("*");
        debug.restore();
        assertEquals(debug.calls.length, 2);
        assertStringIncludes(debug.calls[0].args[0], "local file path");
        assertStringIncludes(debug.calls[1].args[0], "local file path");
    },
});

Deno.test({
    name: "throw upon using a consumed InputFile",
    fn() {
        const file = new InputFile((function* (): Iterable<Uint8Array> {})());
        const raw = () => file.toRaw();
        raw();
        assertRejects(raw, "consumed InputFile");
    },
});

Deno.test({
    name: "convert Uint8Array to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const file = new InputFile(bytes);
        const data = await file.toRaw();
        assertInstanceOf(data, Uint8Array);
        assertEquals(data, bytes);
    },
});

Deno.test({
    name: "convert file to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const open = stub(Deno, "open", (path) => {
            assertEquals(path, "/tmp/file.txt");
            function* data() {
                yield bytes;
            }
            return Promise.resolve(readerFromIterable(data()) as Deno.FsFile);
        });
        const file = new InputFile("/tmp/file.txt");
        assertEquals(file.filename, "file.txt");
        const data = await file.toRaw();
        if (data instanceof Uint8Array) throw new Error("no itr");
        const values = await readAll(readerFromIterable(data));
        assertEquals(values, bytes);
        open.restore();
    },
});

Deno.test({
    name: "convert blob to raw",
    async fn() {
        const blob = new Blob(["AB", "CD"]);
        const file = new InputFile(blob);
        const data = await file.toRaw();
        if (data instanceof Uint8Array) throw new Error("no itr");
        const values = await readAll(readerFromIterable(data));
        assertEquals(values, new Uint8Array([65, 66, 67, 68])); // ABCD
    },
});

Deno.test({
    name: "convert Deno.FsFile to raw",
    async fn() {
        let count = 0;
        const fsfile = new Deno.FsFile(42);
        const source = stub(fsfile, "read", (buf) => {
            if (count !== 0) return Promise.resolve(null);
            let char = 65;
            for (let i = 0; i < buf.byteLength; i++) buf[i] = char++;
            count = buf.byteLength;
            return Promise.resolve(buf.byteLength);
        });
        const file = new InputFile(fsfile);
        const data = await file.toRaw();
        if (data instanceof Uint8Array) throw new Error("no itr");
        const values = await readAll(readerFromIterable(data));
        const expected = new Uint8Array(count);
        for (let i = 0; i < count; i++) expected[i] = i + 65;
        assertEquals(values, expected);
        source.restore();
    },
});

Deno.test({
    name: "convert URL to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const source = stub(
            globalThis,
            "fetch",
            () => Promise.resolve(new Response(bytes)),
        );
        const file0 = new InputFile({ url: "https://grammy.dev" });
        const file1 = new InputFile(new URL("https://grammy.dev"));
        const data0 = await file0.toRaw();
        const data1 = await file1.toRaw();
        if (data0 instanceof Uint8Array) throw new Error("no itr");
        if (data1 instanceof Uint8Array) throw new Error("no itr");
        const values0 = await readAll(readerFromIterable(data0));
        const values1 = await readAll(readerFromIterable(data1));
        assertEquals(values0, bytes);
        assertEquals(values1, bytes);
        source.restore();
    },
});

Deno.test({
    name: "convert Response to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const file0 = new InputFile(new Response(bytes));
        const data0 = await file0.toRaw();
        if (data0 instanceof Uint8Array) throw new Error("no itr");
        const values0 = await readAll(readerFromIterable(data0));
        assertEquals(values0, bytes);
    },
});

Deno.test({
    name: "handle invalid URLs",
    async fn() {
        const source = stub(
            globalThis,
            "fetch",
            () => Promise.resolve(new Response(null)),
        );
        const file = new InputFile({ url: "https://grammy.dev" });
        const data = await file.toRaw();
        if (data instanceof Uint8Array) throw new Error("no itr");
        assertRejects(
            () => readAll(readerFromIterable(data)),
            "no response body from 'https://grammy.dev'",
        );
        source.restore();
    },
});
