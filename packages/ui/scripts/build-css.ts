import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { composeDistCss } from "./compose-css";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const src = readFileSync(join(root, "src", "styles.css"), "utf8");
const theme = readFileSync(require.resolve("@opa/tokens/theme.css"), "utf8");

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "styles.css"), composeDistCss(src, theme));
console.log("Gerado: dist/styles.css");
