import { readdirSync, readFileSync } from "node:fs";

const assets = readdirSync("dist/assets");
const css = assets.filter((f) => f.endsWith(".css")).map((f) => readFileSync(`dist/assets/${f}`, "utf8")).join("\n");

const checks = [
  ["utilitário semântico .bg-primary", /\.bg-primary\{/.test(css)],
  ["variáveis do tema (--primary)", css.includes("--primary:")],
  ["foco do DS (focus-ring)", css.includes("focus-visible\\:focus-ring")],
  ["hover do DS (bg-shade-primary)", css.includes("bg-shade-primary")],
  ["fontes Inter emitidas", assets.some((f) => /inter.*\.woff2$/i.test(f))],
  ["nenhum @import pendente", !/@import/.test(css)],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? "✓" : "✗"} ${name}`);
if (failed.length) process.exit(1);
