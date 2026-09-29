import { describe, expect, it } from "vitest";
import { composeDistCss } from "../scripts/compose-css";

const theme = `/* tema */\n@import "@fontsource-variable/inter";\n\n:root {\n  --primary: #000;\n}\n`;
const src = `/* fonte */\n@import "@opa/tokens/theme.css";\n@import "tw-animate-css";\n\n@source "./";\n\n@utility x {\n  color: red;\n}\n`;

describe("composeDistCss", () => {
  it("embute o tema e põe todos os @import no topo", () => {
    const out = composeDistCss(src, theme);
    const lines = out.split("\n").filter((l) => l.trim() && !l.trim().startsWith("/*"));
    const firstRule = lines.findIndex((l) => !l.startsWith("@import"));
    expect(lines.slice(0, firstRule)).toEqual(['@import "@fontsource-variable/inter";', '@import "tw-animate-css";']);
    expect(lines.slice(firstRule).some((l) => l.startsWith("@import"))).toBe(false);
    expect(out).toContain("--primary: #000;");
    expect(out).toContain('@source "./";');
    expect(out).not.toContain('@import "@opa/tokens/theme.css"');
  });

  it("falha se o src não importar o tema", () => {
    expect(() => composeDistCss("@source \"./\";", theme)).toThrow('src/styles.css precisa ter @import "@opa/tokens/theme.css";');
  });
});
