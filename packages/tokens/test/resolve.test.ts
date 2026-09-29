import { describe, expect, it } from "vitest";
import type { FlatToken } from "../scripts/flatten";
import { resolveColors } from "../scripts/resolve";

const tok = (path: string, value: unknown, type = "color"): FlatToken => ({
  path: path.split("."),
  type,
  value,
});

const primitives = [tok("color.neutral.0", "#ffffff"), tok("color.brand.600", "#4a3fd9")];
const light = [tok("color.background", "{color.neutral.0}"), tok("color.primary", "{color.brand.600}")];
const dark = [tok("color.background", "{color.brand.600}"), tok("color.primary", "{color.neutral.0}")];

describe("resolveColors", () => {
  it("gera primitivos com prefixo opa-", () => {
    const r = resolveColors({ primitives, light, dark, component: [] });
    expect(r.primitives).toEqual([
      ["opa-neutral-0", "#ffffff"],
      ["opa-brand-600", "#4a3fd9"],
    ]);
  });

  it("semânticos apontam para variáveis de primitivos", () => {
    const r = resolveColors({ primitives, light, dark, component: [] });
    expect(r.light).toEqual([
      ["background", "var(--opa-neutral-0)"],
      ["primary", "var(--opa-brand-600)"],
    ]);
    expect(r.dark[0]).toEqual(["background", "var(--opa-brand-600)"]);
  });

  it("componente aponta para variável de semântico", () => {
    const component = [tok("color.tag-bg", "{color.primary}")];
    const r = resolveColors({ primitives, light, dark, component });
    expect(r.component).toEqual([["tag-bg", "var(--primary)"]]);
  });

  it("aceita hex com alfa e oklch em primitivos", () => {
    const p = [tok("color.black.alpha-10", "#0000001a"), tok("color.x.1", "oklch(0.5 0.1 250)")];
    expect(() => resolveColors({ primitives: p, light: [], dark: [], component: [] })).not.toThrow();
  });

  it("falha se primitivo não for cor literal", () => {
    const p = [tok("color.brand.600", "{color.neutral.0}")];
    expect(() => resolveColors({ primitives: p, light: [], dark: [], component: [] })).toThrow(
      'primitives.json: "color.brand.600" precisa ser uma cor literal',
    );
  });

  it("falha se semântico referenciar outro semântico", () => {
    const l = [...light, tok("color.ring", "{color.primary}")];
    const d = [...dark, tok("color.ring", "{color.brand.600}")];
    expect(() => resolveColors({ primitives, light: l, dark: d, component: [] })).toThrow(
      'semantic.light.json: "ring" referencia "{color.primary}", que não é um primitivo existente',
    );
  });

  it("falha se semântico tiver valor literal", () => {
    const l = [tok("color.background", "#ffffff")];
    expect(() => resolveColors({ primitives, light: l, dark: l, component: [] })).toThrow(
      "precisa ser uma referência",
    );
  });

  it("falha se Light e Dark tiverem nomes diferentes", () => {
    expect(() =>
      resolveColors({ primitives, light, dark: [dark[0]], component: [] }),
    ).toThrow("Faltando no dark: [primary]");
  });

  it("falha se componente referenciar primitivo", () => {
    const component = [tok("color.tag-bg", "{color.brand.600}")];
    expect(() => resolveColors({ primitives, light, dark, component })).toThrow(
      'component.json: "tag-bg" referencia "{color.brand.600}", que não é um token semântico existente',
    );
  });

  it("falha com nome reservado", () => {
    const l = [tok("color.white", "{color.neutral.0}")];
    expect(() => resolveColors({ primitives, light: l, dark: l, component: [] })).toThrow(
      '"white" é um nome reservado',
    );
  });

  it("falha com token fora do grupo color", () => {
    const p = [tok("brand.600", "#4a3fd9")];
    expect(() => resolveColors({ primitives: p, light: [], dark: [], component: [] })).toThrow(
      'deve ficar dentro do grupo "color"',
    );
  });
});
