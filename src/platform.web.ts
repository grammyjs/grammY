import d from "https://cdn.skypack.dev/debug@4.3.4";
export { d as debug };

// === Export system-specific operations
async function writeAsyncItrToStream<T>(
    itr: AsyncIterable<T>,
    writer: WritableStreamDefaultWriter<T>,
) {
    let writeOrCloseErr;
    let isWriteDone = false;
    try {
        for await (const chunk of itr) {
            await writer.write(chunk);
        }
        isWriteDone = true;
        await writer.close();
    } catch (err) {
        console.error(
            `${isWriteDone ? "Stream error:" : "Chunk error:"} ${err}`,
        );
        writeOrCloseErr = err;
    }
    if (writeOrCloseErr) {
        try {
            await writer.abort(writeOrCloseErr);
        } catch (err) {
            console.error(`Abort error: ${err}`);
        }
    }
}

// Turn an AsyncIterable<Uint8Array> into a stream
export const itrToStream = (itr: AsyncIterable<Uint8Array>) => {
    // do not assume ReadableStream.from or new ReadableStream to exist yet
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // This should never throw
    writeAsyncItrToStream(itr, writer);

    return readable;
};

// === Base configuration for `fetch` calls
export const baseFetchConfig = (_apiRoot: string) => ({});

export const defaultAdapter = "cloudflare";
