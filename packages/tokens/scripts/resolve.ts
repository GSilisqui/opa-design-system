import type { FlatToken } from "./flatten";
import { NAME_SEGMENT } from "./names";

export type Decl = [name: string, value: string];

export interface ColorSources {
  primitives: FlatToken[];
  light: FlatToken[];
  dark: FlatToken[];
  component: FlatToken[];
}

export interface ResolvedColors {
  primitives: Decl[];
  light: Decl[];
  dark: Decl[];
  component: Decl[];
}

const REF = /^\{([^{}]+)\}$/;
const COLOR = /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgba?|hsla?|oklch|oklab)\([^();{}]*\))$/i;

const RESERVED = new Set(["white", "black", "transparent", "current"]);

function cssName(token: FlatToken, file: string): string {
  const id = token.path.join(".");
  if (token.path[0] !== "color" || token.path.length < 2) {
    throw new Error(`${file}: token "${id}" deve ficar dentro do grupo "color"`);
  }
  if (token.type !== "color") throw new Error(`${file}: "${id}" precisa ter $type "color"`);
  for (const segment of token.path.slice(1)) {
    if (!NAME_SEGMENT.test(segment)) {
      throw new Error(
        `${file}: "${id}" tem um segmento inválido "${segment}" (use minúsculas, números e hífens)`,
      );
    }
  }
  return token.path.slice(1).join("-");
}

function refTarget(token: FlatToken, file: string): string {
  const match = typeof token.value === "string" ? REF.exec(token.value) : null;
  if (!match) {
    throw new Error(
      `${file}: "${token.path.join(".")}" precisa ser uma referência {…}, recebeu ${JSON.stringify(token.value)}`,
    );
  }
  return match[1];
}

function assertSameNames(light: Decl[], dark: Decl[]): void {
  const l = new Set(light.map(([n]) => n));
  const d = new Set(dark.map(([n]) => n));
  const missingInDark = [...l].filter((n) => !d.has(n));
  const missingInLight = [...d].filter((n) => !l.has(n));
  if (missingInDark.length || missingInLight.length) {
    throw new Error(
      `Light e Dark precisam ter os mesmos tokens. Faltando no dark: [${missingInDark.join(", ")}]. Faltando no light: [${missingInLight.join(", ")}]`,
    );
  }
}

function assertOwnName(name: string, file: string, seen: Set<string>): void {
  if (name.startsWith("opa-")) throw new Error(`${file}: "${name}" usa o prefixo reservado "opa-"`);
  if (seen.has(name)) throw new Error(`${file}: "${name}" duplicado`);
  seen.add(name);
}

function assertAvailable(name: string, file: string, taken: Set<string>): void {
  if (RESERVED.has(name)) throw new Error(`${file}: "${name}" é um nome reservado`);
  if (taken.has(name)) throw new Error(`${file}: "${name}" já existe em outra camada`);
  taken.add(name);
}

export function resolveColors(src: ColorSources): ResolvedColors {
  const primitiveByPath = new Map<string, string>();
  const seenPrimitives = new Set<string>();
  const primitives: Decl[] = src.primitives.map((t) => {
    const name = `opa-${cssName(t, "primitives.json")}`;
    if (typeof t.value !== "string" || !COLOR.test(t.value)) {
      throw new Error(
        `primitives.json: "${t.path.join(".")}" precisa ser uma cor literal (hex, rgb, hsl, oklch ou oklab), recebeu ${JSON.stringify(t.value)}`,
      );
    }
    if (seenPrimitives.has(name)) throw new Error(`primitives.json: "${name}" duplicado`);
    seenPrimitives.add(name);
    primitiveByPath.set(t.path.join("."), name);
    return [name, t.value];
  });

  const resolveSemantic = (tokens: FlatToken[], file: string): Decl[] => {
    const seen = new Set<string>();
    return tokens.map((t) => {
      const name = cssName(t, file);
      assertOwnName(name, file, seen);
      const target = refTarget(t, file);
      const primitive = primitiveByPath.get(target);
      if (!primitive) {
        throw new Error(`${file}: "${name}" referencia "{${target}}", que não é um primitivo existente`);
      }
      return [name, `var(--${primitive})`];
    });
  };

  const light = resolveSemantic(src.light, "semantic.light.json");
  const dark = resolveSemantic(src.dark, "semantic.dark.json");
  assertSameNames(light, dark);

  const taken = new Set<string>();
  light.forEach(([name]) => assertAvailable(name, "semantic.light.json", taken));

  const semanticByPath = new Map(src.light.map((t) => [t.path.join("."), cssName(t, "semantic.light.json")]));
  const seenComponent = new Set<string>();
  const component: Decl[] = src.component.map((t) => {
    const name = cssName(t, "component.json");
    assertOwnName(name, "component.json", seenComponent);
    const target = refTarget(t, "component.json");
    const semantic = semanticByPath.get(target);
    if (!semantic) {
      throw new Error(
        `component.json: "${name}" referencia "{${target}}", que não é um token semântico existente`,
      );
    }
    assertAvailable(name, "component.json", taken);
    return [name, `var(--${semantic})`];
  });

  return { primitives, light, dark, component };
}
