import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const files = walk(".next/static");
const css = files.filter((f) => f.endsWith(".css")).map((f) => readFileSync(f, "utf8")).join("\n");

const checks = [
  ["utilitário semântico .bg-primary", /\.bg-primary\{/.test(css)],
  ["variáveis do tema (--primary)", css.includes("--primary:")],
  ["foco do DS (focus-ring)", css.includes("focus-visible\\:focus-ring")],
  ["fontes emitidas (.woff2)", files.some((f) => f.endsWith(".woff2"))],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? "✓" : "✗"} ${name}`);
if (failed.length) process.exit(1);
