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
    const stream = ReadableStream.from(data);
    const reader = stream.getReader();

    const values = [] as number[];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        values.push(...value);
    }

    return new Uint8Array(values);
}
