async function transform(
    data: Uint8Array,
    stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
    const transformed = new Blob([Uint8Array.from(data).buffer]).stream()
        .pipeThrough(stream);
    return new Uint8Array(await new Response(transformed).arrayBuffer());
}

export function gzip(data: Uint8Array): Promise<Uint8Array> {
    return transform(data, new CompressionStream("gzip"));
}

export function gunzip(data: Uint8Array): Promise<Uint8Array> {
    return transform(data, new DecompressionStream("gzip"));
}
