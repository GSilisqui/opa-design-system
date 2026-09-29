import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const flat = (css: string) => css.replace(/\s+/g, " ");

describe("src/styles.css compilado pelo Tailwind v4", () => {
  let css = "";
  let dir = "";

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "opa-ui-css-"));
    const out = join(dir, "out.css");
    execSync(`pnpm exec tailwindcss -i test/css-fixture/input.css -o "${out}"`, { cwd: pkgRoot, stdio: "pipe", timeout: 60_000 });
    css = flat(readFileSync(out, "utf8"));
  }, 60_000);

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("aplica borda e fundo base do Shadcn", () => {
    expect(css).toMatch(/\* \{[^}]*border-color: var\(--border\)/);
    expect(css).toMatch(/body \{[^}]*background-color: var\(--background\)/);
  });

  it("gera o foco do DS (1px ring + halo 2px)", () => {
    expect(css).toContain(".focus-visible\\:focus-ring:focus-visible");
    expect(css).toContain("inset 0 0 0 1px var(--ring), 0 0 0 2px var(--primary-subtle)");
    expect(css).toContain(".focus-halo-destructive");
  });

  it("gera hover por mistura com o foreground", () => {
    expect(css).toContain(".hover\\:bg-shade-primary");
    expect(css).toContain("color-mix(in oklab, var(--primary), var(--foreground) 15%)");
    expect(css).toMatch(/\.bg-shade-strong-destructive[^}]*color-mix\(in oklab, var\(--destructive\), var\(--foreground\) 25%\)/);
  });

  it("nenhum utilitário aponta para --color-* (não existe no CSS com @theme inline)", () => {
    expect(css).not.toMatch(/var\(--color-(ring|foreground|primary-subtle|destructive-subtle|success-subtle|warning-subtle)\)/);
  });

  it("gera as sombras do Figma", () => {
    expect(css).toMatch(/\.shadow-popover \{[^}]*0 1px 4px 0 rgb\(0 0 0 \/ 0\.25\)/);
    expect(css).toMatch(/\.shadow-dropdown \{[^}]*0 6px 16px 0 rgb\(0 0 0 \/ 0\.08\)/);
  });

  it("inclui as animações do tw-animate-css", () => {
    expect(css).toContain("animate-in");
  });
});
