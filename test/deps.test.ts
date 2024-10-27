export {
    assert,
    assertEquals,
    assertFalse,
    assertInstanceOf,
    assertNotStrictEquals,
    assertObjectMatch,
    assertRejects,
    assertStringIncludes,
    assertThrows,
} from "jsr:@std/assert";
export { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
export { type Spy, spy, type Stub, stub } from "jsr:@std/testing/mock";
export { assertType, type Has, type IsExact } from "jsr:@std/testing/types";

export async function convertToUint8Array(
    data: Iterable<Uint8Array> | AsyncIterable<Uint8Array>,
) {
    const values: number[] = [];

    for await (const chunk of data) {
        values.push(...chunk);
    }

    return new Uint8Array(values);
}
