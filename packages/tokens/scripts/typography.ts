import type { FlatToken } from "./flatten";
import type { Decl } from "./resolve";

export interface Typography {
  fonts: Decl[];
  text: Decl[];
}

type TextProp = "size" | "line-height" | "letter-spacing";

const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
]);

export function formatFontFamily(families: string[]): string {
  return families.map((f) => (GENERIC_FAMILIES.has(f) ? f : `"${f}"`)).join(", ");
}

export function resolveTypography(tokens: FlatToken[]): Typography {
  const fonts: Decl[] = [];
  const sizes = new Map<string, Partial<Record<TextProp, string>>>();

  for (const t of tokens) {
    const [group, name, prop] = t.path;
    const id = t.path.join(".");

    if (group === "font" && t.path.length === 2) {
      if (!Array.isArray(t.value) || !t.value.every((v) => typeof v === "string")) {
        throw new Error(`typography.json: "${id}" precisa ser uma lista de famílias`);
      }
      fonts.push([`font-${name}`, formatFontFamily(t.value)]);
    } else if (
      group === "text" &&
      t.path.length === 3 &&
      (prop === "size" || prop === "line-height" || prop === "letter-spacing")
    ) {
      if (typeof t.value !== "string") {
        throw new Error(`typography.json: "${id}" precisa ser uma dimensão em texto (ex.: "0.875rem")`);
      }
      const entry = sizes.get(name) ?? {};
      entry[prop] = t.value;
      sizes.set(name, entry);
    } else {
      throw new Error(`typography.json: token "${id}" não reconhecido`);
    }
  }

  const text: Decl[] = [];
  for (const [name, entry] of sizes) {
    if (!entry.size || !entry["line-height"]) {
      throw new Error(`typography.json: "text.${name}" precisa de "size" e "line-height"`);
    }
    text.push([`text-${name}`, entry.size], [`text-${name}--line-height`, entry["line-height"]]);
    if (entry["letter-spacing"]) text.push([`text-${name}--letter-spacing`, entry["letter-spacing"]]);
  }

  return { fonts, text };
}
