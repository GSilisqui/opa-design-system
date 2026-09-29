import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { emitThemeCss, emitTokensCss } from "./emit";
import { flatten } from "./flatten";
import { resolveColors } from "./resolve";
import { resolveTypography } from "./typography";

export function buildFromDir(srcDir: string): Record<string, string> {
  const read = (file: string) => {
    try {
      return flatten(JSON.parse(readFileSync(join(srcDir, file), "utf8")));
    } catch (error) {
      throw new Error(`${file}: ${(error as Error).message}`);
    }
  };

  const colors = resolveColors({
    primitives: read("primitives.json"),
    light: read("semantic.light.json"),
    dark: read("semantic.dark.json"),
    component: read("component.json"),
  });
  const typography = resolveTypography(read("typography.json"));

  return {
    "theme.css": emitThemeCss(colors, typography),
    "tokens.css": emitTokensCss(colors),
  };
}

export function findStale(outDir: string, outputs: Record<string, string>): string[] {
  return Object.entries(outputs)
    .filter(([file, content]) => {
      const path = join(outDir, file);
      return !existsSync(path) || readFileSync(path, "utf8").replace(/\r\n/g, "\n") !== content;
    })
    .map(([file]) => file);
}
