import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildFromDir, findStale } from "../scripts/build";

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

describe("buildFromDir", () => {
  it("os tokens do repositório são válidos e geram as duas saídas", () => {
    const outputs = buildFromDir(srcDir);
    expect(Object.keys(outputs).sort()).toEqual(["theme.css", "tokens.css"]);
    expect(outputs["theme.css"]).toContain("--color-primary: var(--primary);");
  });
});

describe("findStale", () => {
  const outputs = { "a.css": "x\ny\n" };

  it("marca arquivo ausente como desatualizado", () => {
    const dir = mkdtempSync(join(tmpdir(), "opa-stale-"));
    expect(findStale(dir, outputs)).toEqual(["a.css"]);
  });

  it("marca arquivo com conteúdo diferente como desatualizado", () => {
    const dir = mkdtempSync(join(tmpdir(), "opa-stale-"));
    writeFileSync(join(dir, "a.css"), "outro");
    expect(findStale(dir, outputs)).toEqual(["a.css"]);
  });

  it("ignora diferença de CRLF/LF", () => {
    const dir = mkdtempSync(join(tmpdir(), "opa-stale-"));
    writeFileSync(join(dir, "a.css"), "x\r\ny\r\n");
    expect(findStale(dir, outputs)).toEqual([]);
  });
});
