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
        const boundary = "----------4i0pnj0q100lsvq4ei5ruul6n88m05vm";
        const attachId = "2nxu206s4tu3lq1s";

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
content-disposition:form-data;name="${attachId}";filename=${document.filename}\r
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
        let boundary = "----------whl2u7es98vw5xhvtc1662mgj3m1o8dv";
        let attachId = "f1jxwzuglgppazoe";

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
content-disposition:form-data;name="${attachId}";filename=${document.filename}\r
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
        boundary = "----------0mrvd0l5jp948uvly28j4287udrw1rw3";
        attachId = "jk2kbsxa76ab737l";

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
content-disposition:form-data;name="${attachId}";filename=${document.filename}\r
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
        boundary = "----------xmitze3chu4fxg1esd81r6vwa6x740yn";
        attachId = "drpdb69tf1vr6bhe";

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
content-disposition:form-data;name="${attachId}";filename=${document.filename}\r
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
