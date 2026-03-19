import { API_CONSTANTS } from "../../src/convenience/constants.ts";
import type { ChatPermissions, Update } from "../../src/types.ts";
import {
    assert,
    assertType,
    describe,
    type IsExact,
    it,
} from "../deps.test.ts";

describe("API_CONSTANTS", () => {
    it("should be frozen", () => {
        assert(Object.isFrozen(API_CONSTANTS));
    });

    describe("ALL_UPDATE_TYPES", () => {
        it("should cover every update type", () => {
            assertType<
                IsExact<
                    (typeof API_CONSTANTS.ALL_UPDATE_TYPES)[number],
                    Exclude<keyof Update, "update_id">
                >
            >(true);
        });
    });

    describe("ALL_CHAT_PERMISSIONS", () => {
        it("should cover every chat permission", () => {
            assertType<
                IsExact<
                    keyof typeof API_CONSTANTS.ALL_CHAT_PERMISSIONS,
                    keyof ChatPermissions
                >
            >(true);
        });
    });
});
