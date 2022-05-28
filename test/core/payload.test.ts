import {
    createFormDataPayload,
    requiresFormDataUpload,
} from "../../src/core/payload.ts";
import { InputFile } from "../../src/platform.deno.ts";
import {
    assert,
    assertEquals,
    assertFalse,
} from "https://deno.land/std@0.141.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.141.0/testing/bdd.ts";
import {
    readAll,
    readerFromIterable,
} from "https://deno.land/std@0.141.0/streams/conversion.ts";

describe("requiresFormDataUpload", () => {
    it("should ignore primitives", () => {
        assertFalse(requiresFormDataUpload(0));
        assertFalse(requiresFormDataUpload(""));
        assertFalse(requiresFormDataUpload(true));
        assertFalse(requiresFormDataUpload(false));
        assertFalse(requiresFormDataUpload("asdfa"));
        assertFalse(requiresFormDataUpload(324234));
        assertFalse(requiresFormDataUpload(Symbol()));
    });

    it("should ignore objects", () => {
        assertFalse(requiresFormDataUpload({}));
        assertFalse(requiresFormDataUpload({ key: 0 }));
        assertFalse(requiresFormDataUpload({ a: 1, b: 2 }));
        assertFalse(requiresFormDataUpload({ foo: "asdf", bar: { baz: 3 } }));
        assertFalse(requiresFormDataUpload({ foo: "asdf", bar: [3, 3] }));
        assertFalse(requiresFormDataUpload([]));
        assertFalse(requiresFormDataUpload([1, 2, 3, "asdf", { a: -4 }]));
        assertFalse(requiresFormDataUpload(new Response("")));
    });

    it("should ignore InputFiles at the top level or in arrays", () => {
        assertFalse(requiresFormDataUpload(new InputFile("")));
        assertFalse(requiresFormDataUpload({ x: [0, 1, new InputFile("")] }));
    });

    it("should detect InputFiles inside objects", () => {
        assert(requiresFormDataUpload({ data: new InputFile("") }));
        assert(requiresFormDataUpload([0, 1, new InputFile("")]));
        assert(requiresFormDataUpload({ x: [0, 1, { y: new InputFile("") }] }));
    });

    // TODO: json payloads, including nullish values

    it("builds multipart/form-data streams", async () => {
        const fileContent = "abc";
        const payload = createFormDataPayload({
            chat_id: 42,
            document: new InputFile(new TextEncoder().encode(fileContent)),
        }, (err) => {
            throw err;
        });
        assertEquals(payload.method, "POST");
        assertEquals(payload.headers.connection, "keep-alive");
        const prefix = "multipart/form-data; boundary=";
        assert(payload.headers["content-type"].startsWith(prefix));
        const boundary = payload.headers["content-type"]
            .substring(prefix.length);
        const body = await readAll(readerFromIterable(payload.body));
        let text = new TextDecoder().decode(body);
        const start = `--${boundary}\r
content-disposition:form-data;name="chat_id"\r
\r
42\r
--${boundary}\r
content-disposition:form-data;name="document"\r
\r
attach://`;
        assert(text.startsWith(start));
        text = text.substring(start.length);
        const id = text.substring(0, 16);
        text = text.substring(16);
        const mid = `\r
--${boundary}\r
content-disposition:form-data;name="`;
        assert(text.startsWith(mid));
        text = text.substring(mid.length);
        assert(text.startsWith(id));
        text = text.substring(id.length);
        const end = `";filename=document.dat\r
content-type:application/octet-stream\r
\r
${fileContent}\r
--${boundary}--\r
`;
        assertEquals(text, end);
    });
});

// TODO: adds tests for:
// - other input file types
// - errors in streams
// - null values which should be removed
// - complex values which should get JSON.stringify'ed (with nulls removed)
// - input file types with several nested input files
