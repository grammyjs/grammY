import { matchFilter } from "https://deno.land/x/grammy@v1.17.1/mod.ts";
import { matchFilter as matchFilter2 } from "./mod.ts";

Deno.bench({
    name: "no-cache",
    baseline: true,
    fn: () => {
        matchFilter("::bold");
        matchFilter("message:dice");
        matchFilter("channel_post");
    },
});

Deno.bench({
    name: "cache",
    fn: () => {
        matchFilter2("::bold");
        matchFilter2("message:dice");
        matchFilter2("channel_post");
    },
});
