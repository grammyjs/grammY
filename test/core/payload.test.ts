import {
    createFormDataPayload,
    requiresFormDataUpload,
} from "../../src/core/payload.ts";
import { InputFile } from "../../src/mod.ts";
import {
    assert,
    assertEquals,
    assertFalse,
    convertToUint8Array,
    describe,
    it,
} from "../deps.test.ts";

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

    it("should detect InputFiles inside objects", () => {
        assert(requiresFormDataUpload(new InputFile("")));
        assert(requiresFormDataUpload({ data: new InputFile("") }));
        assert(requiresFormDataUpload([0, 1, new InputFile("")]));
        assert(requiresFormDataUpload({ x: [0, 1, new InputFile("")] }));
        assert(requiresFormDataUpload({ x: [0, 1, { y: new InputFile("") }] }));
    });

    // TODO: json payloads, including nullish values

    it("builds multipart/form-data streams", async (t) => {
        const fileContent = "abc";
        const buffer = new TextEncoder().encode(fileContent);
        const document = new InputFile(buffer, "my-file");
        const parameters = { chat_id: 42, document };
        const payload = createFormDataPayload(parameters, (err) => {
            // cannot happen
            throw err;
        });

        assertEquals(payload.method, "POST");
        const body = await convertToUint8Array(payload.body);
        const actual = new TextDecoder().decode(body);
        // the random values in the payload are stable because of the testing
        // seed, so they can be stored in a snapshot
        await t.assertSnapshot({ headers: payload.headers, body: actual });
    });

    it("builds multipart/form-data streams from the same payload repeatedly", async (t) => {
        const fileContent = "abc";
        const buffer = new TextEncoder().encode(fileContent);
        const document = new InputFile(buffer, "my-file");
        const parameters = { chat_id: 42, document };

        for (let run = 0; run < 3; run++) {
            const payload = createFormDataPayload(parameters, (err) => {
                // cannot happen
                throw err;
            });

            assertEquals(payload.method, "POST");
            const body = await convertToUint8Array(payload.body);
            const actual = new TextDecoder().decode(body);
            // the random values in the payload are stable because of the
            // testing seed, so they can be stored in a snapshot
            await t.assertSnapshot({ headers: payload.headers, body: actual });
        }
    });
});

// TODO: adds tests for:
// - other input file types
// - errors in streams
// - null values which should be removed
// - complex values which should get JSON.stringify'ed (with nulls removed)
// - input file types with several nested input files
