import { HttpError, toHttpError } from "../../src/core/error.ts";
import { assertIsError, describe, it } from "../deps.test.ts";

describe("toHttpError", () => {
    it("should wrap errors", () => {
        const sensitiveLogs = false;
        assertIsError(
            toHttpError("method", sensitiveLogs, 0),
            HttpError,
            "Network request for 'method' failed!",
        );
    });

    it("should include Telegram info", () => {
        const sensitiveLogs = false;
        assertIsError(
            toHttpError(
                "method",
                sensitiveLogs,
                { status: "STAT", statusText: "status text" },
            ),
            HttpError,
            "Network request for 'method' failed! (STAT: status text)",
        );
    });

    it("should include sensitive info", () => {
        const sensitiveLogs = true;
        assertIsError(
            toHttpError("method", sensitiveLogs, new Error("info")),
            HttpError,
            "Network request for 'method' failed! info",
        );
    });

    it("should include Telegram info and sensitive info", () => {
        const sensitiveLogs = true;
        assertIsError(
            toHttpError(
                "method",
                sensitiveLogs,
                Object.assign(
                    new Error("info"),
                    { status: "STAT", statusText: "status text" },
                ),
            ),
            HttpError,
            "Network request for 'method' failed! (STAT: status text) info",
        );
    });
});
