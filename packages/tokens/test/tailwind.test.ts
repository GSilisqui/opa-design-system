import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const typography = JSON.parse(readFileSync(join(pkgRoot, "src", "typography.json"), "utf8"));

describe("theme.css compilado pelo Tailwind v4", () => {
  let css = "";

  beforeAll(() => {
    const out = join(mkdtempSync(join(tmpdir(), "opa-tw-")), "out.css");
    execSync(`pnpm exec tailwindcss -i test/tailwind-fixture/input.css -o "${out}"`, {
      cwd: pkgRoot,
      stdio: "pipe",
      timeout: 60_000,
    });
    css = readFileSync(out, "utf8");
  }, 60_000);

  it("gera utilitários semânticos e de componente", () => {
    expect(css).toMatch(/\.bg-primary\s*\{[^}]*var\(--primary\)/);
    expect(css).toMatch(/\.bg-tag-bg\s*\{[^}]*var\(--tag-bg\)/);
  });

  it("não gera a paleta padrão do Tailwind", () => {
    expect(css).not.toContain(".bg-blue-500");
  });

  it("dark: segue a classe .dark", () => {
    expect(css).toMatch(/\.dark\\:bg-muted:where\(\.dark, ?\.dark \*\)/);
  });

  // Depende de `@theme inline` emitir valores literais (tamanhos do seed = defaults do Tailwind; só fica significativo com os valores do Figma).
  it("usa a escala tipográfica do DS", () => {
    const size = typography.text.sm.size.$value.replace(".", "\\.");
    expect(css).toMatch(new RegExp(`\\.text-sm\\s*\\{[^}]*font-size:\\s*${size}`));
  });

  it("inclui as fontes do fontsource", () => {
    expect(css).toContain("@font-face");
    expect(css).toContain("Inter Variable");
  });
});
