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

describe("resolveColors: colisões e nomes inválidos", () => {
  const empty = { light: [], dark: [], component: [] };

  it("falha com primitivos duplicados após normalizar o nome", () => {
    const p = [tok("color.neutral.0", "#ffffff"), tok("color.neutral-0", "#000000")];
    expect(() => resolveColors({ primitives: p, ...empty })).toThrow(
      'primitives.json: "opa-neutral-0" duplicado',
    );
  });

  it("falha com semântico usando o prefixo opa-", () => {
    const l = [tok("color.opa-x", "{color.neutral.0}")];
    expect(() => resolveColors({ primitives, light: l, dark: l, component: [] })).toThrow(
      'semantic.light.json: "opa-x" usa o prefixo reservado "opa-"',
    );
  });

  it("falha com componente usando o prefixo opa-", () => {
    const component = [tok("color.opa-x", "{color.primary}")];
    expect(() => resolveColors({ primitives, light, dark, component })).toThrow(
      'component.json: "opa-x" usa o prefixo reservado "opa-"',
    );
  });

  it("falha com duplicata no mesmo arquivo (light)", () => {
    const l = [...light, tok("color.a.b", "{color.neutral.0}"), tok("color.a-b", "{color.neutral.0}")];
    expect(() => resolveColors({ primitives, light: l, dark: l, component: [] })).toThrow(
      'semantic.light.json: "a-b" duplicado',
    );
  });

  it("falha com duplicata no mesmo arquivo (dark)", () => {
    const d = [...dark, tok("color.primary", "{color.neutral.0}")];
    expect(() => resolveColors({ primitives, light, dark: d, component: [] })).toThrow(
      'semantic.dark.json: "primary" duplicado',
    );
  });

  it("falha com duplicata no mesmo arquivo (component)", () => {
    const component = [tok("color.tag-bg", "{color.primary}"), tok("color.tag.bg", "{color.primary}")];
    expect(() => resolveColors({ primitives, light, dark, component })).toThrow(
      'component.json: "tag-bg" duplicado',
    );
  });

  it("falha se componente tiver o mesmo nome de um semântico", () => {
    const component = [tok("color.primary", "{color.primary}")];
    expect(() => resolveColors({ primitives, light, dark, component })).toThrow("já existe em outra camada");
  });

  it("falha com segmento inválido para CSS", () => {
    const p = [tok("color.Brand.600", "#4a3fd9")];
    expect(() => resolveColors({ primitives: p, ...empty })).toThrow(
      'primitives.json: "color.Brand.600" tem um segmento inválido "Brand" (use minúsculas, números e hífens)',
    );
  });

  it("falha com Faltando no light", () => {
    expect(() => resolveColors({ primitives, light: [light[0]], dark, component: [] })).toThrow(
      "Faltando no light: [primary]",
    );
  });

  it("falha se componente tiver valor literal", () => {
    const component = [tok("color.tag-bg", "#ffffff")];
    expect(() => resolveColors({ primitives, light, dark, component })).toThrow("precisa ser uma referência");
  });

  it("falha se semântico tiver $type diferente de color", () => {
    const l = [tok("color.background", "{color.neutral.0}", "dimension")];
    expect(() => resolveColors({ primitives, light: l, dark: l, component: [] })).toThrow(
      'precisa ter $type "color"',
    );
  });

  it("rejeita cor com ; ou chaves", () => {
    const p = [tok("color.x.1", "rgb(0;}body{color:red)")];
    expect(() => resolveColors({ primitives: p, ...empty })).toThrow("precisa ser uma cor literal");
  });
});
