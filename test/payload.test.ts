import { createFormDataPayload, preparePayload } from "../src/payload.ts";
import { EntityString, InputFile } from "../src/mod.ts";
import {
    assert,
    assertEquals,
    assertFalse,
    convertToUint8Array,
    describe,
    it,
} from "./deps.test.ts";

const requiresFormDataUpload = (payload: unknown) =>
    preparePayload(payload).requiresFormDataUpload;

describe("preparePayload", () => {
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
        const prepared = preparePayload(parameters);
        assert(prepared.requiresFormDataUpload);
        const payload = createFormDataPayload(
            parameters,
            prepared.files,
            (err) => {
                // cannot happen
                throw err;
            },
        );

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
        const prepared = preparePayload(parameters);
        assert(prepared.requiresFormDataUpload);

        // First run
        let payload = createFormDataPayload(
            parameters,
            prepared.files,
            (err) => {
                // cannot happen
                throw err;
            },
        );

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
        payload = createFormDataPayload(parameters, prepared.files, (err) => {
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
        payload = createFormDataPayload(parameters, prepared.files, (err) => {
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

    it("collects files with origin hints", () => {
        const root = new InputFile({ path: "" });
        const rootResult = preparePayload(root);
        assert(rootResult.requiresFormDataUpload);
        assertEquals(rootResult.files, [{ origin: "file", file: root }]);

        const media = new InputFile({ path: "" });
        const photo = new InputFile({ path: "" });
        const thumbnail = new InputFile({ path: "" });
        const result = preparePayload({
            type: "video",
            media,
            album: [{ type: "photo", media: photo, thumbnail }],
        });
        assert(result.requiresFormDataUpload);
        assertEquals(result.files, [
            { origin: "media", file: media },
            { origin: "photo", file: photo },
            { origin: "thumbnail", file: thumbnail },
        ]);
    });

    it("rewrites EntityStrings throughout the payload", () => {
        const entity = { type: "bold" as const, offset: 0, length: 4 };
        const payload: Record<string, unknown> = {
            text: new EntityString("root", [entity]),
            nested: {
                text: new EntityString("nest", [entity]),
                message_text: new EntityString("msg!", [entity]),
                caption: new EntityString("capt", [entity]),
            },
            items: [{ title: new EntityString("titl", [entity]) }],
        };

        const result = preparePayload(payload);

        assertFalse(result.requiresFormDataUpload);
        assertEquals(payload, {
            text: "root",
            entities: [entity],
            nested: {
                text: "nest",
                text_entities: [entity],
                message_text: "msg!",
                entities: [entity],
                caption: "capt",
                caption_entities: [entity],
            },
            items: [{ title: "titl", title_entities: [entity] }],
        });
    });

    it("preserves existing entities and continues after finding files", () => {
        const document = new InputFile(new Uint8Array(), "document.dat");
        const generated = { type: "bold" as const, offset: 0, length: 4 };
        const existing = { type: "italic" as const, offset: 0, length: 4 };
        const payload: Record<string, unknown> = {
            document,
            text: new EntityString("root", [generated]),
            entities: [existing],
            parse_mode: "MarkdownV2",
            nested: {
                text: new EntityString("nest", [generated]),
                text_entities: [],
                caption: new EntityString("capt"),
                caption_entities: undefined,
                quote: new EntityString("quot", [generated]),
                quote_entities: null,
            },
        };

        const result = preparePayload(payload);

        assert(result.requiresFormDataUpload);
        assertEquals(result.files, [{ origin: "document", file: document }]);
        assertEquals(payload, {
            document,
            text: "root",
            entities: [existing],
            parse_mode: "MarkdownV2",
            nested: {
                text: "nest",
                text_entities: [],
                caption: "capt",
                caption_entities: [],
                quote: "quot",
                quote_entities: null,
            },
        });
    });
});

// TODO: adds tests for:
// - other input file types
// - errors in streams
// - null values which should be removed
// - complex values which should get JSON.stringify'ed (with nulls removed)
// - input file types with several nested input files
