import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const read = (file: string) => readFileSync(join(dist, file), "utf8");
const component = (name: string) => `components/ui/${name}.js`;

describe.runIf(existsSync(dist))("dist publicado", () => {
  it.each(["dialog", "combobox", "command", "popover", "input-field", "label", "tag"])("%s mantém \"use client\"", (name) => {
    expect(read(component(name)).trimStart().startsWith('"use client"')).toBe(true);
  });

  it.each(["button", "icon", "input"])("%s funciona em Server Components (sem diretiva)", (name) => {
    expect(read(component(name))).not.toContain('"use client"');
  });

  it("ícones Pro ficam como import externo, nunca embutidos", () => {
    const registry = read(component("icon-registry"));
    expect(registry).toContain('from "@fortawesome/pro-regular-svg-icons/faAngleDown"');
    expect(registry).not.toMatch(/svgPathData|M\d+\.?\d* \d/);
  });

  it("imports internos viraram caminhos relativos", () => {
    expect(read(component("dialog"))).not.toContain('"@/');
    expect(read(component("dialog"))).toContain('from "../../lib/utils.js"');
  });

  it("o cn do DS usa o pacote cn como import externo", () => {
    expect(read("lib/utils.js")).toContain('from "cn/config"');
    expect(existsSync(join(dist, "lib/utils.test.js"))).toBe(false);
  });

  it("gera tipos, inclusive do registro de ícones", () => {
    expect(existsSync(join(dist, "index.d.ts"))).toBe(true);
    expect(read("index.d.ts")).toContain("Combobox");
    expect(existsSync(join(dist, "components/ui/icon-registry.d.ts"))).toBe(true);
    expect(read("components/ui/icon-registry.d.ts")).toContain('"magnifying-glass"');
  });

  it("styles.css embute o tema com @import no topo e @source do dist", () => {
    const css = read("styles.css");
    const lines = css.split("\n").filter((l) => l.trim() && !l.trim().startsWith("/*"));
    expect(lines[0]).toMatch(/^@import "@fontsource-variable\//);
    expect(css).toContain('@import "tw-animate-css";');
    expect(css).toContain("@custom-variant dark");
    expect(css).toContain('@source "./";');
    expect(css).toContain("@utility focus-ring");
    expect(css).not.toContain('@import "@opa/tokens/theme.css"');
  });
});
