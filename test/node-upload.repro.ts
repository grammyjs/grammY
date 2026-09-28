import { Api } from "../src/api.ts";
import { InputFile } from "../src/types.ts";

const api = new Api("not-a-real-token");

await api.sendDocument(
    1,
    new InputFile(new URL("https://grammy.dev/images/Y.svg")),
);
