import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFromDir, findStale } from "./build";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "generated");

try {
  const outputs = buildFromDir(join(root, "src"));

  if (process.argv.includes("--check")) {
    const stale = findStale(outDir, outputs);
    if (stale.length) {
      console.error(
        `Tokens desatualizados: ${stale.join(", ")}. Rode "pnpm tokens:build" e commite packages/tokens/generated/.`,
      );
      process.exit(1);
    }
    console.log("Tokens em dia.");
  } else {
    mkdirSync(outDir, { recursive: true });
    for (const [file, content] of Object.entries(outputs)) writeFileSync(join(outDir, file), content);
    console.log(`Gerado: ${Object.keys(outputs).join(", ")}`);
  }
} catch (error) {
  console.error(`Erro nos tokens: ${(error as Error).message}`);
  process.exit(1);
}
