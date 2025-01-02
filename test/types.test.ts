import { InputFile, ResponseError } from "../src/types.ts";
import {
    assertEquals,
    assertRejects,
    convertToUint8Array,
    stub,
} from "./deps.test.ts";

Deno.test({
    name: "file name inference",
    fn() {
        assertEquals(
            new InputFile({ path: "/tmp/file.txt" }).name,
            "file.txt",
        );
        assertEquals(
            new InputFile((async function* () {})()).name,
            undefined,
        );
        assertEquals(
            new InputFile({ url: "https://grammy.dev/file.txt" }).name,
            "file.txt",
        );
        assertEquals(
            new InputFile({ url: "https://grammy.dev" }).name,
            "grammy.dev",
        );
        assertEquals(
            new InputFile(new URL("https://grammy.dev/file.txt")).name,
            "file.txt",
        );
        assertEquals(
            new InputFile(new URL("https://grammy.dev")).name,
            "grammy.dev",
        );
    },
});

Deno.test({
    name: "throw upon using a consumed InputFile",
    fn() {
        const file = new InputFile((async function* () {})());
        const raw = () => convertToUint8Array(file);
        raw();
        assertRejects(raw, TypeError, "Cannot reuse InputFile data source!");
    },
});

Deno.test({
    name: "convert Uint8Array to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const file = new InputFile(bytes);
        const data = await convertToUint8Array(file);
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

            const stream = ReadableStream.from(data());
            return Promise.resolve({ readable: stream } as Deno.FsFile);
        });
        const file = new InputFile({ path: "/tmp/file.txt" });
        assertEquals(file.name, "file.txt");
        const values = await convertToUint8Array(file);
        assertEquals(values, bytes);
        open.restore();
    },
});

Deno.test({
    name: "convert blob to raw",
    async fn() {
        const blob = new Blob(["AB", "CD"]);
        const file = new InputFile(blob);
        const values = await convertToUint8Array(file);
        assertEquals(values, new Uint8Array([65, 66, 67, 68])); // ABCD
    },
});

Deno.test({
    name: "convert base64 to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const file = new InputFile({ base64: "QUJD" });
        const values = await convertToUint8Array(file);
        assertEquals(values, bytes);
    },
});

Deno.test({
    name: "convert URL to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const url = "data:,ABC";
        const file0 = new InputFile({ url });
        const file1 = new InputFile(new URL(url));
        const values0 = await convertToUint8Array(file0);
        const values1 = await convertToUint8Array(file1);
        assertEquals(values0, bytes);
        assertEquals(values1, bytes);
    },
});

Deno.test({
    name: "convert Response to raw",
    async fn() {
        const bytes = new Uint8Array([65, 66, 67]);
        const file0 = new InputFile(new Response(bytes));
        const values0 = await convertToUint8Array(file0);
        assertEquals(values0, bytes);
    },
});

Deno.test({
    name: "convert supplier function to raw",
    async fn() {
        const blob = new Blob(["AB", "CD"]);
        const file = new InputFile(() => blob.stream());
        const values = await convertToUint8Array(file);
        assertEquals(values, new Uint8Array([65, 66, 67, 68])); // ABCD
    },
});

Deno.test({
    name: "handle invalid URLs",
    fn() {
        const source = stub(
            globalThis,
            "fetch",
            () => Promise.resolve(new Response(null)),
        );
        const file = new InputFile({ url: "https://grammy.dev" });

        assertRejects(
            () => convertToUint8Array(file),
            ResponseError,
            "No response body",
        );
        source.restore();
    },
});
