import { describe, expect, it } from "vitest";
import { emitThemeCss, emitTokensCss } from "../scripts/emit";
import type { ResolvedColors } from "../scripts/resolve";
import type { Typography } from "../scripts/typography";

const colors: ResolvedColors = {
  primitives: [["opa-neutral-0", "#ffffff"]],
  light: [["primary", "var(--opa-neutral-0)"]],
  dark: [["primary", "var(--opa-neutral-0)"]],
  component: [["tag-bg", "var(--primary)"]],
};
const typography: Typography = {
  fonts: [["font-sans", '"Inter", sans-serif']],
  text: [
    ["text-sm", "0.8125rem"],
    ["text-sm--line-height", "1.25rem"],
  ],
};

const block = (css: string, selector: string) => {
  const start = css.indexOf(`${selector} {`);
  return css.slice(start, css.indexOf("}", start) + 1);
};

describe("emitTokensCss", () => {
  const css = emitTokensCss(colors);

  it("tem :root com primitivos, semânticos e componente", () => {
    const root = block(css, ":root");
    expect(root).toContain("--opa-neutral-0: #ffffff;");
    expect(root).toContain("--primary: var(--opa-neutral-0);");
    expect(root).toContain("--tag-bg: var(--primary);");
  });

  it("repete tokens de componente no .dark", () => {
    const dark = block(css, ".dark");
    expect(dark).toContain("--primary: var(--opa-neutral-0);");
    expect(dark).toContain("--tag-bg: var(--primary);");
  });

  it("não tem sintaxe do Tailwind nem @import", () => {
    expect(css).not.toContain("@theme");
    expect(css).not.toContain("@custom-variant");
    expect(css).not.toContain("@import");
  });
});

describe("emitThemeCss", () => {
  const css = emitThemeCss(colors, typography);

  it("coloca os @import de fonte antes de qualquer regra", () => {
    const withoutHeader = css.replace(/^\/\*[\s\S]*?\*\/\s*/, "");
    expect(withoutHeader.startsWith('@import "@fontsource-variable/inter";')).toBe(true);
    expect(css.indexOf("@fontsource-variable/jetbrains-mono")).toBeLessThan(css.indexOf(":root"));
  });

  it("declara o variant dark por classe", () => {
    expect(css).toContain("@custom-variant dark (&:where(.dark, .dark *));");
  });

  it("zera a paleta do Tailwind e re-adiciona as cores base", () => {
    const theme = block(css, "@theme inline");
    const lines = theme.split("\n").map((l) => l.trim());
    expect(lines[1]).toBe("--color-*: initial;");
    expect(theme).toContain("--color-white: #ffffff;");
    expect(theme).toContain("--color-black: #000000;");
  });

  it("expõe semânticos, componente, fontes e texto; nunca primitivos", () => {
    const theme = block(css, "@theme inline");
    expect(theme).toContain("--color-primary: var(--primary);");
    expect(theme).toContain("--color-tag-bg: var(--tag-bg);");
    expect(theme).toContain('--font-sans: "Inter", sans-serif;');
    expect(theme).toContain("--text-sm: 0.8125rem;");
    expect(theme).toContain("--text-sm--line-height: 1.25rem;");
    expect(theme).not.toContain("opa-neutral");
  });
});
