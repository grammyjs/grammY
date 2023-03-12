import {
    assertEquals,
    assertRejects,
    assertStringIncludes,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.179.0/testing/mock.ts";
import { debug as d } from "../src/platform.deno.ts";
import { InputFile } from "../src/types.ts";

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
        assertRejects(raw);
    },
});
