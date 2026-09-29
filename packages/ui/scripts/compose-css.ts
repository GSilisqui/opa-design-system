const THEME_IMPORT = '@import "@opa/tokens/theme.css";';

/** Junta src/styles.css com o tema de @opa/tokens e move todos os @import para o topo (exigência do CSS). */
export function composeDistCss(src: string, theme: string): string {
  if (!src.includes(THEME_IMPORT)) {
    throw new Error(`src/styles.css precisa ter ${THEME_IMPORT}`);
  }
  const lines = src.replace(THEME_IMPORT, theme).split("\n");
  const isImport = (line: string) => line.trim().startsWith("@import ");
  return [
    "/* GERADO por packages/ui/scripts/build-css.ts a partir de src/styles.css + @opa/tokens/theme.css. Não edite. */",
    ...lines.filter(isImport),
    ...lines.filter((line) => !isImport(line)),
  ].join("\n");
}
