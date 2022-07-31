import { Bot } from "../src/bot.ts";
import {
    assertEquals,
    assertThrows,
} from "https://deno.land/std@0.148.0/testing/asserts.ts";

function createBot(token: string) {
    return new Bot(token);
}

Deno.test("should take a token", () => {
    const bot = createBot("fake-token");
    assertEquals(bot.token, "fake-token");
});

Deno.test("should not take an empty token", () => {
    assertThrows(() => createBot(undefined as unknown as string));
    assertThrows(() => createBot(""));
});

// TODO: add tests

// for error handling
// for initilisation, including retries
// for starting and stopping
