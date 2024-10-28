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
export { assertType, type IsExact } from "jsr:@std/testing/types";

/**
 * Checks if the actual type `A` is assignable to the expected type `E`, and
 * vice versa.
 *
 * ```ts
 * // false because E is not assignable to A
 * type P = IsMutuallyAssignable<string & RegExpMatchArray, string>;
 * // false because A is not assignable to E
 * type Q = IsMutuallyAssignable<string | RegExpMatchArray, string>;
 * // true
 * type R = IsMutuallyAssignable<string | (string & RegExpMatchArray), string>;
 * ```
 */
export type IsMutuallyAssignable<A, E> = [E] extends [A]
    ? [A] extends [E] ? true : false
    : false;

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
