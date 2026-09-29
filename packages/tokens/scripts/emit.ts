import type { Decl, ResolvedColors } from "./resolve";
import type { Typography } from "./typography";

const HEADER =
  "/* GERADO por packages/tokens/scripts/cli.ts. Não edite à mão: altere packages/tokens/src/*.json e rode `pnpm tokens:build`. */";

const FONT_IMPORTS = [
  '@import "@fontsource-variable/inter";',
  '@import "@fontsource-variable/jetbrains-mono";',
];

const BASE_COLORS: Decl[] = [
  ["color-*", "initial"],
  ["color-white", "#ffffff"],
  ["color-black", "#000000"],
  ["color-transparent", "transparent"],
  ["color-current", "currentColor"],
];

function cssBlock(selector: string, decls: Decl[]): string {
  return `${selector} {\n${decls.map(([name, value]) => `  --${name}: ${value};`).join("\n")}\n}`;
}

function variables(c: ResolvedColors): string {
  const root = cssBlock(":root", [...c.primitives, ...c.light, ...c.component]);
  const dark = cssBlock(".dark", [...c.dark, ...c.component]);
  return `${root}\n\n${dark}`;
}

export function emitTokensCss(c: ResolvedColors): string {
  return `${HEADER}\n\n${variables(c)}\n`;
}

export function emitThemeCss(c: ResolvedColors, t: Typography): string {
  const exposed: Decl[] = [...c.light, ...c.component].map(([name]) => [`color-${name}`, `var(--${name})`]);
  const theme = cssBlock("@theme inline", [...BASE_COLORS, ...exposed, ...t.fonts, ...t.text]);
  return [
    HEADER,
    ...FONT_IMPORTS,
    "",
    "@custom-variant dark (&:where(.dark, .dark *));",
    "",
    variables(c),
    "",
    theme,
    "",
  ].join("\n");
}
