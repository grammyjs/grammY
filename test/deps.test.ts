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
export { FakeTime } from "jsr:@std/testing/time";
export { assertType, type IsExact } from "jsr:@std/testing/types";
export { type IsMutuallyAssignable } from "jsr:@std/testing/unstable-types";

/**
 * Collects a potentially async iterator of `Uint8Array` objects into a single
 * array.
 *
 * @param data a stream of byte chunks
 */
export async function convertToUint8Array(
    data: Iterable<Uint8Array> | AsyncIterable<Uint8Array>,
) {
    const values: number[] = [];

    for await (const chunk of data) {
        values.push(...chunk);
    }

    return new Uint8Array(values);
}
