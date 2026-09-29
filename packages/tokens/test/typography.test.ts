import { describe, expect, it } from "vitest";
import type { FlatToken } from "../scripts/flatten";
import { formatFontFamily, resolveTypography } from "../scripts/typography";

const tok = (path: string, value: unknown, type = "dimension"): FlatToken => ({
  path: path.split("."),
  type,
  value,
});

describe("formatFontFamily", () => {
  it("coloca aspas em nomes próprios e mantém famílias genéricas sem aspas", () => {
    expect(formatFontFamily(["Inter Variable", "Inter", "system-ui", "sans-serif"])).toBe(
      '"Inter Variable", "Inter", system-ui, sans-serif',
    );
  });
});

describe("resolveTypography", () => {
  it("gera fontes e tamanhos no formato do Tailwind v4", () => {
    const r = resolveTypography([
      tok("font.sans", ["Inter", "sans-serif"], "fontFamily"),
      tok("text.sm.size", "0.8125rem"),
      tok("text.sm.line-height", "1.25rem"),
      tok("text.sm.letter-spacing", "-0.01em"),
    ]);
    expect(r.fonts).toEqual([["font-sans", '"Inter", sans-serif']]);
    expect(r.text).toEqual([
      ["text-sm", "0.8125rem"],
      ["text-sm--line-height", "1.25rem"],
      ["text-sm--letter-spacing", "-0.01em"],
    ]);
  });

  it("falha se faltar line-height", () => {
    expect(() => resolveTypography([tok("text.sm.size", "0.8125rem")])).toThrow(
      '"text.sm" precisa de "size" e "line-height"',
    );
  });

  it("falha se a fonte não for lista", () => {
    expect(() => resolveTypography([tok("font.sans", "Inter", "fontFamily")])).toThrow(
      '"font.sans" precisa ser uma lista de famílias',
    );
  });

  it("falha com token desconhecido", () => {
    expect(() => resolveTypography([tok("text.sm.weight", "500")])).toThrow(
      'token "text.sm.weight" não reconhecido',
    );
  });
});

describe("resolveTypography: extras", () => {
  it("não emite letter-spacing quando ausente", () => {
    const r = resolveTypography([tok("text.sm.size", "1rem"), tok("text.sm.line-height", "1.5rem")]);
    expect(r.text.map(([n]) => n)).toEqual(["text-sm", "text-sm--line-height"]);
  });

  it("falha com nome de fonte inválido", () => {
    expect(() => resolveTypography([tok("font.Sans", ["Inter"], "fontFamily")])).toThrow(
      'typography.json: "font.Sans" tem um segmento inválido "Sans" (use minúsculas, números e hífens)',
    );
  });

  it("falha com nome de tamanho inválido", () => {
    expect(() => resolveTypography([tok("text.2XL.size", "1rem")])).toThrow(
      'tem um segmento inválido "2XL"',
    );
  });
});
