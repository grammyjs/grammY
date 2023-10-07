import d from "https://cdn.skypack.dev/debug@4.3.4";
export { d as debug };

// === Export system-specific operations
async function writeAsyncItrToStream<T>(
    itr: AsyncIterable<T>,
    writer: WritableStreamDefaultWriter<T>,
) {
    for await (const chunk of itr) {
        await writer.write(chunk);
    }
    await writer.close();
}

// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) => {
    // do not assume ReadableStream.from or new ReadableStream to exist yet
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    writeAsyncItrToStream(itr, writer).catch((err) =>
        console.error("Something went wrong with writing itrToStream")
    );

    return readable;
};

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

export const defaultAdapter = "cloudflare";
