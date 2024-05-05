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
} from "https://deno.land/std@0.211.0/assert/mod.ts";
export {
    afterEach,
    beforeEach,
    describe,
    it,
} from "https://deno.land/std@0.211.0/testing/bdd.ts";
export {
    type Spy,
    spy,
    type Stub,
    stub,
} from "https://deno.land/std@0.211.0/testing/mock.ts";

export async function convertToUint8Array(
    data: Iterable<Uint8Array> | AsyncIterable<Uint8Array>,
) {
    const values: number[] = [];

    for await (const chunk of data) {
        values.push(...chunk);
    }

    return new Uint8Array(values);
}
