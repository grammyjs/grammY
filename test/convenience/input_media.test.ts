import { InputMediaBuilder } from "../../src/convenience/input_media.ts";
import { InputFile } from "../../src/mod.ts";
import { assertEquals, describe, it } from "../deps.test.ts";

describe("InputMediaBuilder", () => {
    const file = new InputFile(new Uint8Array([65, 66, 67]));

    it("should build photos", () => {
        const media = InputMediaBuilder.photo(file, {
            caption: "photo caption",
        });
        assertEquals(media, {
            type: "photo",
            media: file,
            caption: "photo caption",
        });
    });

    it("should build videos", () => {
        const media = InputMediaBuilder.video(file, {
            caption: "video caption",
        });
        assertEquals(media, {
            type: "video",
            media: file,
            caption: "video caption",
        });
    });

    it("should build animations", () => {
        const media = InputMediaBuilder.animation(file, {
            caption: "animation caption",
        });
        assertEquals(media, {
            type: "animation",
            media: file,
            caption: "animation caption",
        });
    });

    it("should build audios", () => {
        const media = InputMediaBuilder.audio(file, {
            caption: "audio caption",
        });
        assertEquals(media, {
            type: "audio",
            media: file,
            caption: "audio caption",
        });
    });

    it("should build documents", () => {
        const media = InputMediaBuilder.document(file, {
            caption: "document caption",
        });
        assertEquals(media, {
            type: "document",
            media: file,
            caption: "document caption",
        });
    });
});
