import { HttpError, toHttpError } from "../../src/core/error.ts";
import { assertThrows } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.150.0/testing/bdd.ts";

describe("toHttpError", () => {
    it("should throw errors", () => {
        const sensitiveLogs = false;
        const handler = () => toHttpError("method", sensitiveLogs)(0);
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed!",
        );
    });

    it("should include Telegram info", () => {
        const sensitiveLogs = false;
        const handler = () =>
            toHttpError("method", sensitiveLogs)({
                status: "STAT",
                statusText: "status text",
            });
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! (STAT: status text)",
        );
    });

    it("should include sensitive info", () => {
        const sensitiveLogs = true;
        const handler = () =>
            toHttpError("method", sensitiveLogs)(new Error("info"));
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! info",
        );
    });

    it("should include Telegram info and sensitive info", () => {
        const sensitiveLogs = true;
        const handler = () =>
            toHttpError("method", sensitiveLogs)(
                Object.assign(new Error("info"), {
                    status: "STAT",
                    statusText: "status text",
                }),
            );
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! (STAT: status text) info",
        );
    });
});
