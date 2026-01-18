import {
    createFormDataPayload,
    requiresFormDataUpload,
} from "../src/payload.ts";
import { InputFile } from "../src/mod.ts";
import {
    assert,
    assertEquals,
    assertFalse,
    convertToUint8Array,
    describe,
    it,
} from "./deps.test.ts";

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
        assert(requiresFormDataUpload(new InputFile({ path: "" })));
        assert(requiresFormDataUpload({ data: new InputFile({ path: "" }) }));
        assert(requiresFormDataUpload([0, 1, new InputFile({ path: "" })]));
        assert(
            requiresFormDataUpload({ x: [0, 1, new InputFile({ path: "" })] }),
        );
        assert(
            requiresFormDataUpload({
                x: [0, 1, { y: new InputFile({ path: "" }) }],
            }),
        );
    });

    // TODO: json payloads, including nullish values

    it("builds multipart/form-data streams", async () => {
        const fileContent = "abc";
        const buffer = new TextEncoder().encode(fileContent);
        const document = new InputFile(buffer, "my-file");
        const parameters = { chat_id: 42, document };
        const payload = createFormDataPayload(parameters, (err) => {
            // cannot happen
            throw err;
        });

        // based on testing seed which generates stable randomness
        const boundary = "----------f4c6da38cec27403ee00e1cd26c1cf80";
        const attachId = "b12ae27a9a468237";

        assertEquals(payload.method, "POST");
        const headers = {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            connection: "keep-alive",
        };
        assertEquals(payload.headers, headers);
        const body = await convertToUint8Array(payload.body);
        const actual = new TextDecoder().decode(body);
        const expected = `--${boundary}\r
content-disposition:form-data;name="chat_id"\r
\r
42\r
--${boundary}\r
content-disposition:form-data;name="document"\r
\r
attach://${attachId}\r
--${boundary}\r
content-disposition:form-data;name="${attachId}";filename=${document.name}\r
content-type:application/octet-stream\r
\r
${fileContent}\r
--${boundary}--\r
`;
        assertEquals(actual, expected);
    });

    it("builds multipart/form-data streams from the same payload repeatedly", async () => {
        const fileContent = "abc";
        const buffer = new TextEncoder().encode(fileContent);
        const document = new InputFile(buffer, "my-file");
        const parameters = { chat_id: 42, document };

        // First run
        let payload = createFormDataPayload(parameters, (err) => {
            // cannot happen
            throw err;
        });

        // based on testing seed which generates stable randomness
        let boundary = "----------799cf44a254f6e15c3e2ef8c3f6e83a2";
        const attachId = "e6611f9255fbb88b";

        assertEquals(payload.method, "POST");
        let headers = {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            connection: "keep-alive",
        };
        assertEquals(payload.headers, headers);
        let body = await convertToUint8Array(payload.body);
        let actual = new TextDecoder().decode(body);
        let expected = `--${boundary}\r
content-disposition:form-data;name="chat_id"\r
\r
42\r
--${boundary}\r
content-disposition:form-data;name="document"\r
\r
attach://${attachId}\r
--${boundary}\r
content-disposition:form-data;name="${attachId}";filename=${document.name}\r
content-type:application/octet-stream\r
\r
${fileContent}\r
--${boundary}--\r
`;
        assertEquals(actual, expected);

        // Second run
        payload = createFormDataPayload(parameters, (err) => {
            // cannot happen
            throw err;
        });

        // based on testing seed which generates stable randomness
        boundary = "----------14c63d6f18224d3867384ff362904afa";

        assertEquals(payload.method, "POST");
        headers = {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            connection: "keep-alive",
        };
        assertEquals(payload.headers, headers);
        body = await convertToUint8Array(payload.body);
        actual = new TextDecoder().decode(body);
        expected = `--${boundary}\r
content-disposition:form-data;name="chat_id"\r
\r
42\r
--${boundary}\r
content-disposition:form-data;name="document"\r
\r
attach://${attachId}\r
--${boundary}\r
content-disposition:form-data;name="${attachId}";filename=${document.name}\r
content-type:application/octet-stream\r
\r
${fileContent}\r
--${boundary}--\r
`;
        assertEquals(actual, expected);

        // Third run
        payload = createFormDataPayload(parameters, (err) => {
            // cannot happen
            throw err;
        });

        // based on testing seed which generates stable randomness
        boundary = "----------584a4627921e7bb8568dca7d832a0953";

        assertEquals(payload.method, "POST");
        headers = {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            connection: "keep-alive",
        };
        assertEquals(payload.headers, headers);
        body = await convertToUint8Array(payload.body);
        actual = new TextDecoder().decode(body);
        expected = `--${boundary}\r
content-disposition:form-data;name="chat_id"\r
\r
42\r
--${boundary}\r
content-disposition:form-data;name="document"\r
\r
attach://${attachId}\r
--${boundary}\r
content-disposition:form-data;name="${attachId}";filename=${document.name}\r
content-type:application/octet-stream\r
\r
${fileContent}\r
--${boundary}--\r
`;
        assertEquals(actual, expected);
    });
});

// TODO: adds tests for:
// - other input file types
// - errors in streams
// - null values which should be removed
// - complex values which should get JSON.stringify'ed (with nulls removed)
// - input file types with several nested input files
