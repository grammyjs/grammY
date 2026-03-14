import { API_CONSTANTS } from "../../src/convenience/constants.ts";
import { DEFAULT_UPDATE_TYPES } from "../../src/bot.ts";
import { assert, assertEquals, describe, it } from "../deps.test.ts";

describe("API_CONSTANTS", () => {
    it("should be frozen", () => {
        assert(Object.isFrozen(API_CONSTANTS));
    });

    describe("DEFAULT_UPDATE_TYPES", () => {
        it("should match the DEFAULT_UPDATE_TYPES from bot.ts", () => {
            assertEquals(
                API_CONSTANTS.DEFAULT_UPDATE_TYPES,
                DEFAULT_UPDATE_TYPES,
            );
        });

        it("should not contain duplicates", () => {
            const unique = new Set(API_CONSTANTS.DEFAULT_UPDATE_TYPES);
            assertEquals(
                unique.size,
                API_CONSTANTS.DEFAULT_UPDATE_TYPES.length,
            );
        });
    });

    describe("ALL_UPDATE_TYPES", () => {
        it("should include all default update types", () => {
            for (const type of API_CONSTANTS.DEFAULT_UPDATE_TYPES) {
                assert(
                    API_CONSTANTS.ALL_UPDATE_TYPES.includes(type),
                    `ALL_UPDATE_TYPES is missing default type '${type}'`,
                );
            }
        });

        it("should include chat_member, message_reaction, and message_reaction_count", () => {
            assert(API_CONSTANTS.ALL_UPDATE_TYPES.includes("chat_member"));
            assert(
                API_CONSTANTS.ALL_UPDATE_TYPES.includes("message_reaction"),
            );
            assert(
                API_CONSTANTS.ALL_UPDATE_TYPES.includes(
                    "message_reaction_count",
                ),
            );
        });

        it("should not contain duplicates", () => {
            const unique = new Set(API_CONSTANTS.ALL_UPDATE_TYPES);
            assertEquals(unique.size, API_CONSTANTS.ALL_UPDATE_TYPES.length);
        });
    });

    describe("ALL_CHAT_PERMISSIONS", () => {
        it("should have all permissions set to true", () => {
            for (
                const [key, value] of Object.entries(
                    API_CONSTANTS.ALL_CHAT_PERMISSIONS,
                )
            ) {
                assertEquals(
                    value,
                    true,
                    `Permission '${key}' should be true`,
                );
            }
        });

        it("should not be empty", () => {
            assert(
                Object.keys(API_CONSTANTS.ALL_CHAT_PERMISSIONS).length > 0,
            );
        });
    });
});
