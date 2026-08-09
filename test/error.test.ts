import { HttpError, toHttpError } from "../src/error.ts";
import { assertThrows, describe, it } from "./deps.test.ts";

describe("toHttpError", () => {
    it("should throw errors", () => {
        const sensitiveLogs = false;
        const handler = () => toHttpError("method", "secret", sensitiveLogs)(0);
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed!",
        );
    });

    it("should include Telegram info", () => {
        const sensitiveLogs = false;
        const handler = () =>
            toHttpError("method", "secret", sensitiveLogs)({
                status: "STAT",
                statusText: "status text",
            });
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! (STAT: status text)",
        );
    });

    it("should redact tokens from underlying errors", () => {
        const sensitiveLogs = false;
        const handler = () =>
            toHttpError("method", "secret", sensitiveLogs)(
                new Error("my secret info"),
            );
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! my <token> info",
        );
    });

    it("should include sensitive info", () => {
        const sensitiveLogs = true;
        const handler = () =>
            toHttpError("method", "secret", sensitiveLogs)(
                new Error("my secret info"),
            );
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! my secret info",
        );
    });

    it("should include Telegram info and redact tokens from underlying errors", () => {
        const sensitiveLogs = false;
        const handler = () =>
            toHttpError("method", "secret", sensitiveLogs)(
                Object.assign(new Error("my secret info"), {
                    status: "STAT",
                    statusText: "status text",
                }),
            );
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! (STAT: status text) my <token> info",
        );
    });

    it("should include Telegram info and sensitive info", () => {
        const sensitiveLogs = true;
        const handler = () =>
            toHttpError("method", "secret", sensitiveLogs)(
                Object.assign(new Error("my secret info"), {
                    status: "STAT",
                    statusText: "status text",
                }),
            );
        assertThrows(
            handler,
            HttpError,
            "Network request for 'method' failed! (STAT: status text) my secret info",
        );
    });
});
