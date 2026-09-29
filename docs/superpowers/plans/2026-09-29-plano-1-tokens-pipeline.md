# Plano 1 — Tokens, pipeline e CI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o monorepo do OPA Design System com o pacote de tokens (`@gsilisqui/tokens`, importado como `@opa/tokens`), que gera o CSS do Tailwind v4 a partir de JSON (DTCG), mais a regra de lint de tokens (`@gsilisqui/eslint-config`), versionamento com changesets e CI no GitHub Actions.

**Architecture:** pnpm workspaces + Turborepo. Os tokens ficam em `packages/tokens/src/*.json` (fonte de verdade, formato W3C DTCG, 3 camadas: primitivos → semânticos Light/Dark → componente). Um script TypeScript (`flatten → resolve → emit`) valida as regras de camada e gera `generated/theme.css` (Tailwind v4: `@custom-variant`, `@theme inline`) e `generated/tokens.css` (variáveis puras). Os arquivos gerados são commitados e o CI falha se estiverem desatualizados. A regra ESLint `opa/no-raw-design-values` bloqueia cores fixas, primitivos e a paleta padrão do Tailwind.

**Tech Stack:** Node 24, pnpm 10, Turborepo, TypeScript 6.0 (travado), tsx, Vitest, Tailwind CSS v4 (`@tailwindcss/cli` para teste de integração), ESLint 9 (flat config) + typescript-eslint, Changesets, GitHub Actions, GitHub Packages.

**Spec:** `docs/superpowers/specs/2026-09-29-opa-design-system-design.md` (seções 6, 7, 12, 13).

**Fora deste plano:** `packages/tokens/src/tailwind-scales.json` (spacing/radius/shadow só para o Figma, spec §7.2) é criado no Plano 3, junto com a biblioteca Figma. O `buildFromDir` lê apenas os 5 arquivos que conhece e ignora os demais.

**Planos seguintes:** Plano 2 (`@opa/ui` + `<Icon>` + 5 componentes + Storybook) e Plano 3 (biblioteca Figma + manifesto + `CLAUDE.md`/skills) são escritos depois deste, porque dependem dos nomes reais dos tokens definidos na Task 11.

**Convenções:**
- Escopo npm real: `@gsilisqui` (GitHub `GSilisqui`, sempre em minúsculas no npm). Repositório: `GSilisqui/opa-design-system` (privado).
- Mensagens de erro e documentação em português; identificadores de código em inglês.
- Todos os comandos rodam a partir da raiz do repo (`C:\Users\IXCSoft\Downloads\DesignSystem`) em Git Bash, salvo indicação.
- Commits terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `package.json` | Raiz do monorepo: scripts orquestrados por turbo, `verify`, `release` |
| `pnpm-workspace.yaml` | Declara `packages/*` e `apps/*` |
| `turbo.json` | Pipeline `build`/`test`/`lint`/`typecheck` |
| `tsconfig.base.json` | Opções TS compartilhadas |
| `eslint.config.js` | Lint do próprio monorepo (typescript-eslint) |
| `.gitignore`, `.gitattributes` | Ignorados; força LF (arquivos gerados comparados byte a byte) |
| `packages/tokens/src/*.json` | **Fonte de verdade** dos tokens |
| `packages/tokens/scripts/flatten.ts` | Árvore DTCG → lista plana de tokens |
| `packages/tokens/scripts/resolve.ts` | Cores: resolve referências e valida as regras de camada |
| `packages/tokens/scripts/typography.ts` | Fontes e escala de texto → declarações CSS |
| `packages/tokens/scripts/emit.ts` | Monta `theme.css` e `tokens.css` |
| `packages/tokens/scripts/build.ts` | Lê `src/`, gera saídas, detecta arquivos desatualizados |
| `packages/tokens/scripts/cli.ts` | Entrada de linha de comando (`build` / `--check`) |
| `packages/tokens/generated/*.css` | Saída gerada e **commitada** |
| `packages/tokens/test/*` | Testes unitários + integração com Tailwind v4 |
| `packages/eslint-config/src/lib/classes.js` | Separar classes e extrair a utilidade (sem variantes) |
| `packages/eslint-config/src/rules/no-raw-design-values.js` | Regra de tokens (Regra 2 do spec) |
| `packages/eslint-config/src/index.js` | Plugin + configs `ui` e `app` |
| `.changeset/config.json` | Versionamento |
| `.github/workflows/ci.yml`, `release.yml` | CI fino: só chama scripts do `package.json` |

---

### Task 1: Esqueleto do monorepo

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `eslint.config.js`, `.gitignore`, `.gitattributes`

- [ ] **Step 1: Criar `package.json` da raiz**

```json
{
  "name": "opa-design-system",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.33.2",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "tokens:build": "pnpm --filter @gsilisqui/tokens run build",
    "tokens:check": "pnpm --filter @gsilisqui/tokens run check",
    "verify": "pnpm tokens:check && turbo run lint typecheck test build",
    "changeset": "changeset",
    "release": "turbo run build && changeset publish"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild"],
    "ignoredBuiltDependencies": ["@parcel/watcher"]
  }
}
```

- [ ] **Step 2: Criar `pnpm-workspace.yaml`**

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

- [ ] **Step 3: Criar `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "generated/**"]
    },
    "test": {
      "dependsOn": ["^build", "build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

- [ ] **Step 4: Criar `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx"
  }
}
```

- [ ] **Step 5: Criar `eslint.config.js`**

```js
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/generated/**", "**/node_modules/**", "**/.turbo/**"] },
  ...tseslint.configs.recommended,
);
```

- [ ] **Step 6: Criar `.gitignore`**

```gitignore
node_modules/
dist/
.turbo/
coverage/
storybook-static/
*.log
.DS_Store
.obsidian/
```

- [ ] **Step 7: Criar `.gitattributes`** (os arquivos gerados são comparados byte a byte; LF em qualquer SO)

```gitattributes
* text=auto eol=lf
*.png binary
*.woff2 binary
```

- [ ] **Step 8: Instalar dependências da raiz**

Run: `pnpm add -Dw turbo typescript@~6.0 eslint@^9 typescript-eslint @changesets/cli`
Expected: `pnpm-lock.yaml` criado, sem erros.

> **Por que fixar versões:** sem as travas, o pnpm instala TypeScript 7 e ESLint 10, e o typescript-eslint atual não suporta TS 7 (`eslint .` quebra com "typescript-eslint does not support TS 7.0"). Não remova as travas sem confirmar a compatibilidade.

- [ ] **Step 9: Renormalizar finais de linha do que já está commitado**

Run: `git add --renormalize . && git status --short`
Expected: o spec aparece modificado (CRLF → LF) ou nada muda.

- [ ] **Step 10: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json tsconfig.base.json eslint.config.js .gitignore .gitattributes pnpm-lock.yaml docs
git commit -m "chore: scaffold pnpm + turbo monorepo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Esqueleto do pacote de tokens

**Files:**
- Create: `packages/tokens/package.json`, `packages/tokens/tsconfig.json`

- [ ] **Step 1: Criar `packages/tokens/package.json`**

```json
{
  "name": "@gsilisqui/tokens",
  "version": "0.0.0",
  "description": "Tokens do OPA Design System. Fonte: JSON (W3C DTCG). Importe como @opa/tokens.",
  "type": "module",
  "exports": {
    "./theme.css": "./generated/theme.css",
    "./tokens.css": "./generated/tokens.css",
    "./json/*": "./src/*.json"
  },
  "files": ["generated", "src"],
  "scripts": {
    "build": "tsx scripts/cli.ts",
    "check": "tsx scripts/cli.ts --check",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/GSilisqui/opa-design-system.git",
    "directory": "packages/tokens"
  }
}
```

- [ ] **Step 2: Criar `packages/tokens/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["node"],
    "noEmit": true
  },
  "include": ["scripts", "test"]
}
```

- [ ] **Step 3: Instalar dependências**

Run:
```bash
pnpm --filter @gsilisqui/tokens add @fontsource-variable/inter @fontsource-variable/jetbrains-mono
pnpm --filter @gsilisqui/tokens add -D tsx vitest @types/node tailwindcss @tailwindcss/cli
```
Expected: instalação sem erros.

- [ ] **Step 4: Commit**

```bash
git add packages/tokens pnpm-lock.yaml
git commit -m "chore(tokens): scaffold tokens package

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `flatten` — árvore DTCG para lista plana

**Files:**
- Create: `packages/tokens/scripts/flatten.ts`
- Test: `packages/tokens/test/flatten.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { describe, expect, it } from "vitest";
import { flatten } from "../scripts/flatten";

describe("flatten", () => {
  it("achata grupos aninhados herdando o $type do grupo", () => {
    const tokens = flatten({
      color: {
        $type: "color",
        brand: { "600": { $value: "#4a3fd9" } },
      },
    });
    expect(tokens).toEqual([{ path: ["color", "brand", "600"], type: "color", value: "#4a3fd9" }]);
  });

  it("usa o $type do token quando definido", () => {
    const tokens = flatten({ size: { $type: "dimension", x: { $type: "number", $value: 2 } } });
    expect(tokens[0].type).toBe("number");
  });

  it("ignora chaves de metadados ($description etc.)", () => {
    const tokens = flatten({ $description: "raiz", a: { $type: "color", $value: "#fff", $description: "x" } });
    expect(tokens).toHaveLength(1);
  });

  it("falha quando o token não tem $type", () => {
    expect(() => flatten({ a: { $value: "#fff" } })).toThrow('Token "a" sem $type');
  });

  it("falha quando um nó não é objeto", () => {
    expect(() => flatten({ a: "#fff" })).toThrow('"a" precisa ser um grupo ou token');
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/flatten.test.ts`
Expected: FAIL, `Failed to resolve import "../scripts/flatten"`.

- [ ] **Step 3: Implementar**

```ts
export interface FlatToken {
  path: string[];
  type: string;
  value: unknown;
}

type Node = Record<string, unknown>;

const isNode = (value: unknown): value is Node =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function flatten(tree: Node, inheritedType?: string, path: string[] = []): FlatToken[] {
  const groupType = typeof tree.$type === "string" ? tree.$type : inheritedType;
  const out: FlatToken[] = [];

  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    const nodePath = [...path, key];
    const id = nodePath.join(".");

    if (!isNode(node)) throw new Error(`"${id}" precisa ser um grupo ou token (objeto)`);

    if ("$value" in node) {
      const type = typeof node.$type === "string" ? node.$type : groupType;
      if (!type) throw new Error(`Token "${id}" sem $type (defina no token ou no grupo)`);
      out.push({ path: nodePath, type, value: node.$value });
    } else {
      out.push(...flatten(node, groupType, nodePath));
    }
  }

  return out;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/flatten.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/scripts/flatten.ts packages/tokens/test/flatten.test.ts
git commit -m "feat(tokens): flatten DTCG token trees

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: `resolveColors` — referências e regras de camada

Regras (spec 7.1): primitivo = cor literal; semântico = referência a **primitivo**; componente = referência a **semântico**; Light e Dark têm exatamente os mesmos nomes; nomes reservados (`white`, `black`, `transparent`, `current`) e colisões são proibidos.

**Files:**
- Create: `packages/tokens/scripts/resolve.ts`
- Test: `packages/tokens/test/resolve.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
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
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/resolve.test.ts`
Expected: FAIL, `Failed to resolve import "../scripts/resolve"`.

- [ ] **Step 3: Implementar**

```ts
import type { FlatToken } from "./flatten";

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
const COLOR = /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgba?|hsla?|oklch|oklab)\([^)]*\))$/i;
const RESERVED = new Set(["white", "black", "transparent", "current"]);

function cssName(token: FlatToken, file: string): string {
  const id = token.path.join(".");
  if (token.path[0] !== "color" || token.path.length < 2) {
    throw new Error(`${file}: token "${id}" deve ficar dentro do grupo "color"`);
  }
  if (token.type !== "color") throw new Error(`${file}: "${id}" precisa ter $type "color"`);
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

function assertAvailable(name: string, file: string, taken: Set<string>): void {
  if (RESERVED.has(name)) throw new Error(`${file}: "${name}" é um nome reservado`);
  if (taken.has(name)) throw new Error(`${file}: "${name}" já existe em outra camada`);
  taken.add(name);
}

export function resolveColors(src: ColorSources): ResolvedColors {
  const primitiveByPath = new Map<string, string>();
  const primitives: Decl[] = src.primitives.map((t) => {
    const name = `opa-${cssName(t, "primitives.json")}`;
    if (typeof t.value !== "string" || !COLOR.test(t.value)) {
      throw new Error(
        `primitives.json: "${t.path.join(".")}" precisa ser uma cor literal (hex, rgb, hsl ou oklch), recebeu ${JSON.stringify(t.value)}`,
      );
    }
    primitiveByPath.set(t.path.join("."), name);
    return [name, t.value];
  });

  const resolveSemantic = (tokens: FlatToken[], file: string): Decl[] =>
    tokens.map((t) => {
      const name = cssName(t, file);
      const target = refTarget(t, file);
      const primitive = primitiveByPath.get(target);
      if (!primitive) {
        throw new Error(`${file}: "${name}" referencia "{${target}}", que não é um primitivo existente`);
      }
      return [name, `var(--${primitive})`];
    });

  const light = resolveSemantic(src.light, "semantic.light.json");
  const dark = resolveSemantic(src.dark, "semantic.dark.json");
  assertSameNames(light, dark);

  const taken = new Set<string>();
  light.forEach(([name]) => assertAvailable(name, "semantic.light.json", taken));

  const semanticByPath = new Map(src.light.map((t) => [t.path.join("."), cssName(t, "semantic.light.json")]));
  const component: Decl[] = src.component.map((t) => {
    const name = cssName(t, "component.json");
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/resolve.test.ts`
Expected: PASS (11 testes).

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/scripts/resolve.ts packages/tokens/test/resolve.test.ts
git commit -m "feat(tokens): resolve color references and enforce tier rules

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: `resolveTypography` — fontes e escala de texto

Formato de `typography.json`: `font.<nome>` = lista de famílias; `text.<tamanho>.size` / `line-height` / `letter-spacing` (opcional). Saída no padrão do Tailwind v4: `--font-sans`, `--text-sm`, `--text-sm--line-height`, `--text-sm--letter-spacing`.

**Files:**
- Create: `packages/tokens/scripts/typography.ts`
- Test: `packages/tokens/test/typography.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
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
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/typography.test.ts`
Expected: FAIL, `Failed to resolve import "../scripts/typography"`.

- [ ] **Step 3: Implementar**

```ts
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/typography.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/scripts/typography.ts packages/tokens/test/typography.test.ts
git commit -m "feat(tokens): resolve font families and text scale

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: `emit` — montar `theme.css` e `tokens.css`

Pontos que o teste precisa garantir:
- `@import` das fontes antes de qualquer regra (só o comentário de cabeçalho pode vir antes).
- `@custom-variant dark` para o `dark:` seguir a classe `.dark`.
- Tokens de componente emitidos também em `.dark`. Variáveis CSS que referenciam outras são resolvidas no elemento onde são declaradas; sem isso, um `.dark` aplicado numa subárvore herdaria `--tag-bg` já resolvido com o valor Light.
- `@theme inline` começa com `--color-*: initial` (remove a paleta do Tailwind), re-adiciona `white`/`black`/`transparent`/`current`, expõe semânticos e componente, **nunca** primitivos.
- `tokens.css` não tem sintaxe do Tailwind nem `@import`.

**Files:**
- Create: `packages/tokens/scripts/emit.ts`
- Test: `packages/tokens/test/emit.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { describe, expect, it } from "vitest";
import { emitThemeCss, emitTokensCss } from "../scripts/emit";
import type { ResolvedColors } from "../scripts/resolve";
import type { Typography } from "../scripts/typography";

const colors: ResolvedColors = {
  primitives: [["opa-neutral-0", "#ffffff"]],
  light: [["primary", "var(--opa-neutral-0)"]],
  dark: [["primary", "var(--opa-neutral-0)"]],
  component: [["tag-bg", "var(--primary)"]],
};
const typography: Typography = {
  fonts: [["font-sans", '"Inter", sans-serif']],
  text: [
    ["text-sm", "0.8125rem"],
    ["text-sm--line-height", "1.25rem"],
  ],
};

const block = (css: string, selector: string) => {
  const start = css.indexOf(`${selector} {`);
  return css.slice(start, css.indexOf("}", start) + 1);
};

describe("emitTokensCss", () => {
  const css = emitTokensCss(colors);

  it("tem :root com primitivos, semânticos e componente", () => {
    const root = block(css, ":root");
    expect(root).toContain("--opa-neutral-0: #ffffff;");
    expect(root).toContain("--primary: var(--opa-neutral-0);");
    expect(root).toContain("--tag-bg: var(--primary);");
  });

  it("repete tokens de componente no .dark", () => {
    const dark = block(css, ".dark");
    expect(dark).toContain("--primary: var(--opa-neutral-0);");
    expect(dark).toContain("--tag-bg: var(--primary);");
  });

  it("não tem sintaxe do Tailwind nem @import", () => {
    expect(css).not.toContain("@theme");
    expect(css).not.toContain("@custom-variant");
    expect(css).not.toContain("@import");
  });
});

describe("emitThemeCss", () => {
  const css = emitThemeCss(colors, typography);

  it("coloca os @import de fonte antes de qualquer regra", () => {
    const withoutHeader = css.replace(/^\/\*[\s\S]*?\*\/\s*/, "");
    expect(withoutHeader.startsWith('@import "@fontsource-variable/inter";')).toBe(true);
    expect(css.indexOf("@fontsource-variable/jetbrains-mono")).toBeLessThan(css.indexOf(":root"));
  });

  it("declara o variant dark por classe", () => {
    expect(css).toContain("@custom-variant dark (&:where(.dark, .dark *));");
  });

  it("zera a paleta do Tailwind e re-adiciona as cores base", () => {
    const theme = block(css, "@theme inline");
    const lines = theme.split("\n").map((l) => l.trim());
    expect(lines[1]).toBe("--color-*: initial;");
    expect(theme).toContain("--color-white: #ffffff;");
    expect(theme).toContain("--color-black: #000000;");
  });

  it("expõe semânticos, componente, fontes e texto; nunca primitivos", () => {
    const theme = block(css, "@theme inline");
    expect(theme).toContain("--color-primary: var(--primary);");
    expect(theme).toContain("--color-tag-bg: var(--tag-bg);");
    expect(theme).toContain('--font-sans: "Inter", sans-serif;');
    expect(theme).toContain("--text-sm: 0.8125rem;");
    expect(theme).toContain("--text-sm--line-height: 1.25rem;");
    expect(theme).not.toContain("opa-neutral");
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/emit.test.ts`
Expected: FAIL, `Failed to resolve import "../scripts/emit"`.

- [ ] **Step 3: Implementar**

```ts
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/emit.test.ts`
Expected: PASS (7 testes).

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/scripts/emit.ts packages/tokens/test/emit.test.ts
git commit -m "feat(tokens): emit Tailwind v4 theme.css and plain tokens.css

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Tokens provisórios (seed)

Valores **provisórios**, só para o pipeline funcionar de ponta a ponta. A Task 11 substitui tudo pelos valores reais do Figma. Os nomes semânticos seguem o spec (Shadcn + extensões; `sidebar-*` e `chart-*` ficam para a fase 4).

**Files:**
- Create: `packages/tokens/src/primitives.json`, `semantic.light.json`, `semantic.dark.json`, `component.json`, `typography.json`

- [ ] **Step 1: Criar `packages/tokens/src/primitives.json`**

```json
{
  "$description": "Camada 1: cores cruas. PROVISÓRIO até a extração do Figma (Plano 1, Task 11).",
  "color": {
    "$type": "color",
    "neutral": {
      "0": { "$value": "#ffffff" },
      "50": { "$value": "#f8f9fb" },
      "100": { "$value": "#f1f2f5" },
      "200": { "$value": "#e4e6eb" },
      "300": { "$value": "#cfd2da" },
      "400": { "$value": "#9aa0ad" },
      "500": { "$value": "#6b7280" },
      "600": { "$value": "#4b5260" },
      "700": { "$value": "#363b47" },
      "800": { "$value": "#23272f" },
      "900": { "$value": "#16181d" },
      "950": { "$value": "#0d0f12" }
    },
    "brand": {
      "100": { "$value": "#eceafd" },
      "400": { "$value": "#8f86f0" },
      "500": { "$value": "#6a5fe8" },
      "600": { "$value": "#4a3fd9" },
      "900": { "$value": "#221c6b" }
    },
    "red": {
      "100": { "$value": "#fde8e8" },
      "500": { "$value": "#e5484d" },
      "600": { "$value": "#cd2b31" },
      "900": { "$value": "#5c1215" }
    },
    "green": {
      "100": { "$value": "#e6f6ec" },
      "500": { "$value": "#30a46c" },
      "600": { "$value": "#18794e" },
      "900": { "$value": "#0f3d27" }
    },
    "amber": {
      "100": { "$value": "#fff4d6" },
      "500": { "$value": "#f5a524" },
      "600": { "$value": "#b76e00" },
      "900": { "$value": "#4a2c00" }
    },
    "blue": {
      "100": { "$value": "#e6f0fe" },
      "500": { "$value": "#3b82f6" },
      "600": { "$value": "#1d64d8" },
      "900": { "$value": "#0f2a5c" }
    }
  }
}
```

- [ ] **Step 2: Criar `packages/tokens/src/semantic.light.json`**

```json
{
  "$description": "Camada 2 (Light): nomes do Shadcn + extensões. Só referencia primitivos.",
  "color": {
    "$type": "color",
    "background": { "$value": "{color.neutral.0}" },
    "foreground": { "$value": "{color.neutral.900}" },
    "card": { "$value": "{color.neutral.0}" },
    "card-foreground": { "$value": "{color.neutral.900}" },
    "popover": { "$value": "{color.neutral.0}" },
    "popover-foreground": { "$value": "{color.neutral.900}" },
    "primary": { "$value": "{color.brand.600}" },
    "primary-foreground": { "$value": "{color.neutral.0}" },
    "secondary": { "$value": "{color.neutral.100}" },
    "secondary-foreground": { "$value": "{color.neutral.900}" },
    "muted": { "$value": "{color.neutral.100}" },
    "muted-foreground": { "$value": "{color.neutral.500}" },
    "accent": { "$value": "{color.neutral.100}" },
    "accent-foreground": { "$value": "{color.neutral.900}" },
    "destructive": { "$value": "{color.red.600}" },
    "destructive-foreground": { "$value": "{color.neutral.0}" },
    "destructive-subtle": { "$value": "{color.red.100}" },
    "destructive-subtle-foreground": { "$value": "{color.red.600}" },
    "success": { "$value": "{color.green.600}" },
    "success-foreground": { "$value": "{color.neutral.0}" },
    "success-subtle": { "$value": "{color.green.100}" },
    "success-subtle-foreground": { "$value": "{color.green.600}" },
    "warning": { "$value": "{color.amber.500}" },
    "warning-foreground": { "$value": "{color.neutral.950}" },
    "warning-subtle": { "$value": "{color.amber.100}" },
    "warning-subtle-foreground": { "$value": "{color.amber.600}" },
    "info": { "$value": "{color.blue.600}" },
    "info-foreground": { "$value": "{color.neutral.0}" },
    "info-subtle": { "$value": "{color.blue.100}" },
    "info-subtle-foreground": { "$value": "{color.blue.600}" },
    "border": { "$value": "{color.neutral.200}" },
    "input": { "$value": "{color.neutral.300}" },
    "ring": { "$value": "{color.brand.500}" }
  }
}
```

- [ ] **Step 3: Criar `packages/tokens/src/semantic.dark.json`**

```json
{
  "$description": "Camada 2 (Dark): mesmos nomes do Light. Só referencia primitivos.",
  "color": {
    "$type": "color",
    "background": { "$value": "{color.neutral.950}" },
    "foreground": { "$value": "{color.neutral.50}" },
    "card": { "$value": "{color.neutral.900}" },
    "card-foreground": { "$value": "{color.neutral.50}" },
    "popover": { "$value": "{color.neutral.900}" },
    "popover-foreground": { "$value": "{color.neutral.50}" },
    "primary": { "$value": "{color.brand.400}" },
    "primary-foreground": { "$value": "{color.neutral.950}" },
    "secondary": { "$value": "{color.neutral.800}" },
    "secondary-foreground": { "$value": "{color.neutral.50}" },
    "muted": { "$value": "{color.neutral.800}" },
    "muted-foreground": { "$value": "{color.neutral.400}" },
    "accent": { "$value": "{color.neutral.800}" },
    "accent-foreground": { "$value": "{color.neutral.50}" },
    "destructive": { "$value": "{color.red.500}" },
    "destructive-foreground": { "$value": "{color.neutral.0}" },
    "destructive-subtle": { "$value": "{color.red.900}" },
    "destructive-subtle-foreground": { "$value": "{color.red.100}" },
    "success": { "$value": "{color.green.500}" },
    "success-foreground": { "$value": "{color.neutral.950}" },
    "success-subtle": { "$value": "{color.green.900}" },
    "success-subtle-foreground": { "$value": "{color.green.100}" },
    "warning": { "$value": "{color.amber.500}" },
    "warning-foreground": { "$value": "{color.neutral.950}" },
    "warning-subtle": { "$value": "{color.amber.900}" },
    "warning-subtle-foreground": { "$value": "{color.amber.100}" },
    "info": { "$value": "{color.blue.500}" },
    "info-foreground": { "$value": "{color.neutral.0}" },
    "info-subtle": { "$value": "{color.blue.900}" },
    "info-subtle-foreground": { "$value": "{color.blue.100}" },
    "border": { "$value": "{color.neutral.800}" },
    "input": { "$value": "{color.neutral.700}" },
    "ring": { "$value": "{color.brand.400}" }
  }
}
```

- [ ] **Step 4: Criar `packages/tokens/src/component.json`**

```json
{
  "$description": "Camada 3: exceções por componente. Só referencia semânticos.",
  "color": {
    "$type": "color",
    "tag-bg": { "$value": "{color.muted}" },
    "tag-foreground": { "$value": "{color.muted-foreground}" },
    "tag-border": { "$value": "{color.border}" }
  }
}
```

- [ ] **Step 5: Criar `packages/tokens/src/typography.json`**

```json
{
  "$description": "Famílias e escala de texto (nomes do Tailwind, valores do DS). Tamanhos PROVISÓRIOS até a Task 11.",
  "font": {
    "$type": "fontFamily",
    "sans": { "$value": ["Inter Variable", "Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
    "mono": { "$value": ["JetBrains Mono Variable", "JetBrains Mono", "ui-monospace", "monospace"] }
  },
  "text": {
    "$type": "dimension",
    "xs": { "size": { "$value": "0.75rem" }, "line-height": { "$value": "1rem" } },
    "sm": { "size": { "$value": "0.875rem" }, "line-height": { "$value": "1.25rem" } },
    "base": { "size": { "$value": "1rem" }, "line-height": { "$value": "1.5rem" } },
    "lg": { "size": { "$value": "1.125rem" }, "line-height": { "$value": "1.75rem" } },
    "xl": { "size": { "$value": "1.25rem" }, "line-height": { "$value": "1.75rem" } },
    "2xl": { "size": { "$value": "1.5rem" }, "line-height": { "$value": "2rem" } },
    "3xl": { "size": { "$value": "1.875rem" }, "line-height": { "$value": "2.25rem" } },
    "4xl": { "size": { "$value": "2.25rem" }, "line-height": { "$value": "2.5rem" } }
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/src
git commit -m "feat(tokens): add provisional seed tokens

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: `build` + CLI + modo `--check`

**Files:**
- Create: `packages/tokens/scripts/build.ts`, `packages/tokens/scripts/cli.ts`
- Test: `packages/tokens/test/build.test.ts`
- Create (gerado): `packages/tokens/generated/theme.css`, `packages/tokens/generated/tokens.css`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildFromDir, findStale } from "../scripts/build";

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

describe("buildFromDir", () => {
  it("os tokens do repositório são válidos e geram as duas saídas", () => {
    const outputs = buildFromDir(srcDir);
    expect(Object.keys(outputs).sort()).toEqual(["theme.css", "tokens.css"]);
    expect(outputs["theme.css"]).toContain("--color-primary: var(--primary);");
  });
});

describe("findStale", () => {
  const outputs = { "a.css": "x\ny\n" };

  it("marca arquivo ausente como desatualizado", () => {
    const dir = mkdtempSync(join(tmpdir(), "opa-stale-"));
    expect(findStale(dir, outputs)).toEqual(["a.css"]);
  });

  it("marca arquivo com conteúdo diferente como desatualizado", () => {
    const dir = mkdtempSync(join(tmpdir(), "opa-stale-"));
    writeFileSync(join(dir, "a.css"), "outro");
    expect(findStale(dir, outputs)).toEqual(["a.css"]);
  });

  it("ignora diferença de CRLF/LF", () => {
    const dir = mkdtempSync(join(tmpdir(), "opa-stale-"));
    writeFileSync(join(dir, "a.css"), "x\r\ny\r\n");
    expect(findStale(dir, outputs)).toEqual([]);
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/build.test.ts`
Expected: FAIL, `Failed to resolve import "../scripts/build"`.

- [ ] **Step 3: Implementar `packages/tokens/scripts/build.ts`**

```ts
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
```

- [ ] **Step 4: Implementar `packages/tokens/scripts/cli.ts`**

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFromDir, findStale } from "./build";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "generated");

try {
  const outputs = buildFromDir(join(root, "src"));

  if (process.argv.includes("--check")) {
    const stale = findStale(outDir, outputs);
    if (stale.length) {
      console.error(
        `Tokens desatualizados: ${stale.join(", ")}. Rode "pnpm tokens:build" e commite packages/tokens/generated/.`,
      );
      process.exit(1);
    }
    console.log("Tokens em dia.");
  } else {
    mkdirSync(outDir, { recursive: true });
    for (const [file, content] of Object.entries(outputs)) writeFileSync(join(outDir, file), content);
    console.log(`Gerado: ${Object.keys(outputs).join(", ")}`);
  }
} catch (error) {
  console.error(`Erro nos tokens: ${(error as Error).message}`);
  process.exit(1);
}
```

- [ ] **Step 5: Rodar os testes**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/build.test.ts`
Expected: PASS (4 testes).

- [ ] **Step 6: Confirmar que o `--check` falha antes de gerar**

Run: `pnpm tokens:check`
Expected: exit 1, `Tokens desatualizados: theme.css, tokens.css.`

- [ ] **Step 7: Gerar e confirmar que o `--check` passa**

Run: `pnpm tokens:build && pnpm tokens:check`
Expected: `Gerado: theme.css, tokens.css` e depois `Tokens em dia.`

- [ ] **Step 8: Conferir o topo do CSS gerado**

Run: `head -8 packages/tokens/generated/theme.css`
Expected: comentário de cabeçalho, as duas linhas `@import "@fontsource-variable/…";`, linha vazia, `@custom-variant dark (&:where(.dark, .dark *));`.

- [ ] **Step 9: Commit**

```bash
git add packages/tokens/scripts/build.ts packages/tokens/scripts/cli.ts packages/tokens/test/build.test.ts packages/tokens/generated
git commit -m "feat(tokens): build CLI with --check and generated CSS

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Teste de integração com Tailwind v4

Garante que o `theme.css` gerado funciona no Tailwind v4 de verdade: utilitários semânticos existem, a paleta padrão sumiu, `dark:` segue `.dark`, a escala tipográfica é a do DS e as fontes são incluídas.

**Files:**
- Create: `packages/tokens/test/tailwind-fixture/input.css`, `packages/tokens/test/tailwind-fixture/fixture.html`
- Test: `packages/tokens/test/tailwind.test.ts`

- [ ] **Step 1: Criar `packages/tokens/test/tailwind-fixture/input.css`**

```css
@import "tailwindcss" source(none);
@import "../../generated/theme.css";
@source "./fixture.html";
```

- [ ] **Step 2: Criar `packages/tokens/test/tailwind-fixture/fixture.html`**

```html
<div class="bg-primary text-primary-foreground dark:bg-muted bg-blue-500 bg-tag-bg text-sm font-sans"></div>
```

- [ ] **Step 3: Escrever o teste**

```ts
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const typography = JSON.parse(readFileSync(join(pkgRoot, "src", "typography.json"), "utf8"));

describe("theme.css compilado pelo Tailwind v4", () => {
  let css = "";

  beforeAll(() => {
    const out = join(mkdtempSync(join(tmpdir(), "opa-tw-")), "out.css");
    execSync(`pnpm exec tailwindcss -i test/tailwind-fixture/input.css -o "${out}"`, {
      cwd: pkgRoot,
      stdio: "pipe",
    });
    css = readFileSync(out, "utf8");
  }, 60_000);

  it("gera utilitários semânticos e de componente", () => {
    expect(css).toMatch(/\.bg-primary\s*\{[^}]*var\(--primary\)/);
    expect(css).toMatch(/\.bg-tag-bg\s*\{[^}]*var\(--tag-bg\)/);
  });

  it("não gera a paleta padrão do Tailwind", () => {
    expect(css).not.toContain(".bg-blue-500");
  });

  it("dark: segue a classe .dark", () => {
    expect(css).toContain(".dark\\:bg-muted");
    expect(css).toMatch(/:where\(\.dark, ?\.dark \*\)/);
  });

  it("usa a escala tipográfica do DS", () => {
    const size = typography.text.sm.size.$value.replace(".", "\\.");
    expect(css).toMatch(new RegExp(`\\.text-sm\\s*\\{[^}]*font-size:\\s*${size}`));
  });

  it("inclui as fontes do fontsource", () => {
    expect(css).toContain("@font-face");
    expect(css).toContain("Inter Variable");
  });
});
```

- [ ] **Step 4: Rodar**

Run: `pnpm --filter @gsilisqui/tokens exec vitest run test/tailwind.test.ts`
Expected: PASS (5 testes). Se algum falhar, **não altere o teste para passar**. Investigue o `theme.css` gerado com @superpowers:systematic-debugging (ex.: sintaxe do `@custom-variant` ou do reset `--color-*: initial` na versão instalada do Tailwind) e corrija `emit.ts`.

- [ ] **Step 5: Rodar a suíte inteira do pacote + typecheck + lint**

Run: `pnpm --filter @gsilisqui/tokens run test && pnpm --filter @gsilisqui/tokens run typecheck && pnpm --filter @gsilisqui/tokens run lint`
Expected: tudo verde.

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/test/tailwind-fixture packages/tokens/test/tailwind.test.ts
git commit -m "test(tokens): verify generated theme compiles in Tailwind v4

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: `@gsilisqui/eslint-config` — regra `opa/no-raw-design-values`

Aplica a Regra 2 do spec. Lê strings em `className`/`class`, em chamadas `cn`/`clsx`/`cx`/`cva`/`twMerge` e em `style={{…}}`.

| Problema | Exemplo | `ui` (`allowArbitraryValues: true`) | `app` |
|---|---|---|---|
| `primitive` | `text-(--opa-brand-600)`, `style={{color:"var(--opa-…)"}}` | erro | erro |
| `rawColor` | `bg-[#3b35c9]`, `shadow-[0_0_0_1px_rgba(0,0,0,.1)]`, `style={{color:"#fff"}}` | erro | erro |
| `palette` | `bg-blue-500`, `hover:bg-red-500/50` | erro | erro |
| `arbitraryValue` | `p-[13px]`, `max-h-(--radix-…)` | permitido | erro |
| variante arbitrária | `has-[>svg]:px-3`, `[&_svg]:size-4` | permitido | permitido |

**Files:**
- Create: `packages/eslint-config/package.json`, `packages/eslint-config/src/lib/classes.js`, `packages/eslint-config/src/rules/no-raw-design-values.js`, `packages/eslint-config/src/index.js`
- Test: `packages/eslint-config/test/classes.test.js`, `packages/eslint-config/test/no-raw-design-values.test.js`

- [ ] **Step 1: Criar `packages/eslint-config/package.json`**

```json
{
  "name": "@gsilisqui/eslint-config",
  "version": "0.0.0",
  "description": "Regras de lint do OPA Design System. Importe como @opa/eslint-config.",
  "type": "module",
  "exports": {
    ".": "./src/index.js"
  },
  "files": ["src"],
  "scripts": {
    "test": "vitest run",
    "lint": "eslint ."
  },
  "peerDependencies": {
    "eslint": ">=9"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/GSilisqui/opa-design-system.git",
    "directory": "packages/eslint-config"
  }
}
```

Run: `pnpm --filter @gsilisqui/eslint-config add -D eslint@^9 vitest`
Expected: instalação sem erros.

- [ ] **Step 2: Escrever o teste que falha para `classes.js`**

`packages/eslint-config/test/classes.test.js`:

```js
import { describe, expect, it } from "vitest";
import { splitClasses, utilityOf } from "../src/lib/classes.js";

describe("splitClasses", () => {
  it("separa por qualquer espaço em branco", () => {
    expect(splitClasses("  a  b\n c ")).toEqual(["a", "b", "c"]);
  });
});

describe("utilityOf", () => {
  it("remove variantes simples", () => {
    expect(utilityOf("hover:focus:bg-primary")).toBe("bg-primary");
  });

  it("não quebra em ':' dentro de colchetes ou parênteses", () => {
    expect(utilityOf("[&>svg:first-child]:size-4")).toBe("size-4");
    expect(utilityOf("hover:[color:#fff]")).toBe("[color:#fff]");
    expect(utilityOf("md:max-h-(--radix-x)")).toBe("max-h-(--radix-x)");
  });

  it("remove o modificador ! de importante", () => {
    expect(utilityOf("!bg-primary")).toBe("bg-primary");
    expect(utilityOf("bg-primary!")).toBe("bg-primary");
  });
});
```

- [ ] **Step 3: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/eslint-config exec vitest run test/classes.test.js`
Expected: FAIL, `Failed to resolve import "../src/lib/classes.js"`.

- [ ] **Step 4: Implementar `packages/eslint-config/src/lib/classes.js`**

```js
/** @param {string} value */
export function splitClasses(value) {
  return value.split(/\s+/).filter(Boolean);
}

/**
 * Retorna só a utilidade de uma classe Tailwind, sem variantes.
 * "hover:[&>svg]:bg-[#fff]" -> "bg-[#fff]"
 * @param {string} cls
 */
export function utilityOf(cls) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < cls.length; i++) {
    const char = cls[i];
    if (char === "[" || char === "(") depth++;
    else if (char === "]" || char === ")") depth--;
    else if (char === ":" && depth === 0) start = i + 1;
  }
  return cls.slice(start).replace(/^!/, "").replace(/!$/, "");
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/eslint-config exec vitest run test/classes.test.js`
Expected: PASS (4 testes).

- [ ] **Step 6: Escrever o teste que falha para a regra**

`packages/eslint-config/test/no-raw-design-values.test.js`:

```js
import { RuleTester } from "eslint";
import { afterAll, describe, it } from "vitest";
import rule from "../src/rules/no-raw-design-values.js";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const ui = [{ allowArbitraryValues: true }];

tester.run("no-raw-design-values", rule, {
  valid: [
    { code: '<div className="bg-primary text-muted-foreground p-4 hover:bg-accent" />' },
    { code: 'cn("rounded-md", active && "bg-primary text-primary-foreground")' },
    { code: '<div className="[&>svg]:size-4 has-[>svg]:px-3" />' },
    { code: '<div style={{ display: "flex" }} />' },
    {
      code: 'cva("max-h-(--radix-select-content-available-height) w-[calc(100%-2rem)] translate-x-[-50%]")',
      options: ui,
    },
    { code: 'cva("", { variants: { variant: { primary: "bg-primary" } }, defaultVariants: { variant: "primary" } })' },
    { code: 'const label = "bg-[#fff]"', name: "strings fora de className/cn não são analisadas" },
  ],
  invalid: [
    {
      code: '<div className="bg-[#3b35c9]" />',
      options: ui,
      errors: [{ messageId: "rawColor", data: { cls: "bg-[#3b35c9]" } }],
    },
    {
      code: 'cn("shadow-[0_0_0_1px_rgba(0,0,0,.1)]")',
      options: ui,
      errors: [{ messageId: "rawColor" }],
    },
    {
      code: '<div className="text-(--opa-brand-600)" />',
      options: ui,
      errors: [{ messageId: "primitive" }],
    },
    {
      code: '<div className="bg-blue-500 hover:bg-red-500/50" />',
      errors: [{ messageId: "palette" }, { messageId: "palette" }],
    },
    {
      code: '<div className="p-[13px]" />',
      errors: [{ messageId: "arbitraryValue", data: { cls: "p-[13px]" } }],
    },
    {
      code: '<div style={{ color: "#fff" }} />',
      errors: [{ messageId: "rawColor" }],
    },
    {
      code: '<div style={{ color: "var(--opa-brand-600)" }} />',
      errors: [{ messageId: "primitive" }],
    },
    {
      code: 'cva("", { variants: { v: { a: "bg-[rgb(0,0,0)]" } } })',
      options: ui,
      errors: [{ messageId: "rawColor" }],
    },
    {
      code: '<div className={cn("px-2", cn("bg-zinc-100"))} />',
      errors: [{ messageId: "palette" }],
      name: "cn aninhado reporta uma vez só",
    },
    {
      code: "<div className={`flex ${open ? 'bg-[#000]' : 'bg-muted'}`} />",
      errors: [{ messageId: "rawColor" }],
    },
  ],
});
```

- [ ] **Step 7: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/eslint-config exec vitest run test/no-raw-design-values.test.js`
Expected: FAIL, `Failed to resolve import "../src/rules/no-raw-design-values.js"`.

- [ ] **Step 8: Implementar `packages/eslint-config/src/rules/no-raw-design-values.js`**

```js
import { splitClasses, utilityOf } from "../lib/classes.js";

// (?<![a-z]) em vez de \b: no Tailwind "_" substitui espaço (ex.: 0_0_0_1px_rgba(...)), e "_" conta como caractere de palavra.
const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|(?<![a-z])(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\(/i;
const PALETTE =
  /-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|[1-9]00|950)(?:\/\S+)?$/;
const ARBITRARY = /\[[^\]]*\]|\(--[^)]*\)/;
const DEFAULT_CALLEES = ["cn", "clsx", "cx", "cva", "twMerge"];

/**
 * @param {string} cls
 * @param {{ allowArbitraryValues: boolean }} options
 * @returns {"primitive" | "rawColor" | "palette" | "arbitraryValue" | null}
 */
export function classProblem(cls, { allowArbitraryValues }) {
  const utility = utilityOf(cls);
  if (utility.includes("--opa-")) return "primitive";
  const arbitrary = utility.match(ARBITRARY)?.[0];
  if (arbitrary && COLOR_LITERAL.test(arbitrary)) return "rawColor";
  if (PALETTE.test(utility)) return "palette";
  if (arbitrary && !allowArbitraryValues) return "arbitraryValue";
  return null;
}

/**
 * Coleta strings de classes de uma expressão. Não desce em chamadas:
 * cn/cva/... aninhados são tratados pelo visitor de CallExpression (evita erro duplicado).
 */
function collectStrings(node, out = []) {
  if (!node) return out;
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") out.push({ node, value: node.value });
      break;
    case "TemplateLiteral":
      node.quasis.forEach((q) => out.push({ node: q, value: q.value.cooked ?? "" }));
      node.expressions.forEach((e) => collectStrings(e, out));
      break;
    case "ArrayExpression":
      node.elements.forEach((e) => collectStrings(e, out));
      break;
    case "ObjectExpression":
      node.properties.forEach((p) => {
        if (p.type !== "Property") return;
        if (p.key.type === "Literal") collectStrings(p.key, out);
        collectStrings(p.value, out);
      });
      break;
    case "ConditionalExpression":
      collectStrings(node.consequent, out);
      collectStrings(node.alternate, out);
      break;
    case "LogicalExpression":
      if (node.operator !== "&&") collectStrings(node.left, out);
      collectStrings(node.right, out);
      break;
    case "JSXExpressionContainer":
      collectStrings(node.expression, out);
      break;
  }
  return out;
}

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Proíbe cores fixas, primitivos, paleta padrão do Tailwind e (em apps) valores arbitrários.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowArbitraryValues: { type: "boolean" },
          callees: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      primitive: 'Primitivo "{{cls}}" não pode ser usado diretamente. Use o token semântico correspondente.',
      rawColor: 'Cor fixa "{{cls}}" não é permitida. Use um token semântico (ex.: bg-primary, text-muted-foreground).',
      palette: '"{{cls}}" usa a paleta padrão do Tailwind, que não existe no DS. Use um token semântico.',
      arbitraryValue: 'Valor arbitrário "{{cls}}" não é permitido em apps. Use a escala do Tailwind (ex.: p-4, w-96).',
    },
  },
  create(context) {
    const options = { allowArbitraryValues: false, callees: DEFAULT_CALLEES, ...context.options[0] };

    function checkClasses(strings) {
      for (const { node, value } of strings) {
        for (const cls of splitClasses(value)) {
          const problem = classProblem(cls, options);
          if (problem) context.report({ node, messageId: problem, data: { cls } });
        }
      }
    }

    function checkStyle(objectExpression) {
      for (const p of objectExpression.properties) {
        if (p.type !== "Property" || p.value.type !== "Literal" || typeof p.value.value !== "string") continue;
        const value = p.value.value;
        if (value.includes("--opa-")) context.report({ node: p.value, messageId: "primitive", data: { cls: value } });
        else if (COLOR_LITERAL.test(value)) context.report({ node: p.value, messageId: "rawColor", data: { cls: value } });
      }
    }

    return {
      JSXAttribute(node) {
        const name = node.name.name;
        if (name === "className" || name === "class") {
          checkClasses(collectStrings(node.value));
        } else if (
          name === "style" &&
          node.value?.type === "JSXExpressionContainer" &&
          node.value.expression.type === "ObjectExpression"
        ) {
          checkStyle(node.value.expression);
        }
      },
      CallExpression(node) {
        if (node.callee.type === "Identifier" && options.callees.includes(node.callee.name)) {
          checkClasses(node.arguments.flatMap((arg) => collectStrings(arg)));
        }
      },
    };
  },
};
```

- [ ] **Step 9: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/eslint-config exec vitest run`
Expected: PASS (classes + 17 casos da regra).

- [ ] **Step 10: Criar `packages/eslint-config/src/index.js`**

```js
import noRawDesignValues from "./rules/no-raw-design-values.js";

export const plugin = {
  meta: { name: "@opa/eslint-config" },
  rules: { "no-raw-design-values": noRawDesignValues },
};

/** Para packages/ui: libera valores arbitrários vindos do código-fonte do Shadcn. */
export const ui = [
  {
    plugins: { opa: plugin },
    rules: { "opa/no-raw-design-values": ["error", { allowArbitraryValues: true }] },
  },
];

/** Para produto e protótipos: só a escala do Tailwind e tokens semânticos. */
export const app = [
  {
    plugins: { opa: plugin },
    rules: { "opa/no-raw-design-values": ["error", { allowArbitraryValues: false }] },
  },
];

export default { plugin, configs: { ui, app } };
```

- [ ] **Step 11: Lint do pacote**

Run: `pnpm --filter @gsilisqui/eslint-config run lint`
Expected: sem erros.

- [ ] **Step 12: Commit**

```bash
git add packages/eslint-config pnpm-lock.yaml
git commit -m "feat(eslint-config): add opa/no-raw-design-values rule

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Valores reais a partir do Figma (**com checkpoint do dono**)

Substitui os tokens provisórios pelos valores do Figma "Component Library" (`7FS6JptRPLnco6VSAEAOAH`). O mapeamento das cores semânticas atuais (básicas: fundos e textos) para os nomes do Shadcn exige julgamento, por isso **para e pede validação** antes de gravar.

**Files:**
- Create: `docs/superpowers/notes/2026-09-29-figma-dump.json`, `docs/superpowers/notes/2026-09-29-token-mapping.md`
- Modify: `packages/tokens/src/*.json`, `packages/tokens/generated/*`

- [ ] **Step 1: Carregar o skill `figma:figma-use`** (obrigatório antes de `use_figma`).

- [ ] **Step 2: Extrair variáveis e estilos de texto** com `use_figma` no arquivo `7FS6JptRPLnco6VSAEAOAH`:

```js
const toHex = ({ r, g, b, a = 1 }) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a) : ""}`;
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = [];
for (const c of collections) {
  for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    const values = {};
    for (const m of c.modes) {
      const raw = v.valuesByMode[m.modeId];
      if (raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS") {
        const target = await figma.variables.getVariableByIdAsync(raw.id);
        values[m.name] = `{${target ? target.name : raw.id}}`;
      } else if (raw && typeof raw === "object" && "r" in raw) {
        values[m.name] = toHex(raw);
      } else {
        values[m.name] = raw;
      }
    }
    variables.push({ collection: c.name, name: v.name, type: v.resolvedType, values });
  }
}

const textStyles = (await figma.getLocalTextStylesAsync()).map((s) => ({
  name: s.name,
  font: s.fontName,
  size: s.fontSize,
  lineHeight: s.lineHeight,
  letterSpacing: s.letterSpacing,
}));

return { collections: collections.map((c) => ({ name: c.name, modes: c.modes.map((m) => m.name) })), variables, textStyles };
```

Salve o retorno em `docs/superpowers/notes/2026-09-29-figma-dump.json`. Se o retorno for grande demais, rode por coleção (filtrando `collections` pelo nome).

- [ ] **Step 3: Escrever a proposta de mapeamento** em `docs/superpowers/notes/2026-09-29-token-mapping.md`:
  - **Primitivos:** tabela `Figma (ex.: Primary/600)` → `JSON (color.brand.600)`. Mantenha os degraus numéricos do Figma. Renomeie só os grupos (`Primary` → `brand`, etc.). Cores com opacidade (ex.: `Primary/Opacity`) viram primitivos com alfa (`#rrggbbaa`), ex.: `color.brand.alpha-10`.
  - **Semânticos:** tabela `token Shadcn/extensão` → `primitivo Light` → `primitivo Dark` → `origem no Figma` (variável semântica existente ou "sugestão"). Marque **⚠️** toda linha que for sugestão sem equivalente no Figma.
  - **Componente:** `tag-*` a partir das cores do Chip no Figma.
  - **Tipografia:** tabela `estilo Figma (Default/sm/Regular)` → `text-sm` com `size`/`line-height`/`letter-spacing` convertidos para `rem` (px ÷ 16) e `em`. Liste os pesos encontrados e o utilitário Tailwind equivalente (Regular → `font-normal` 400, Medium → `font-medium` 500, Bold → `font-bold` 700). **Pesos não entram no `typography.json`**: usam os padrões do Tailwind. Se o Figma tiver um peso fora desses valores numéricos, registre em "Dúvidas".
  - Seção **"Dúvidas"** com tudo que for ambíguo.

- [ ] **Step 4: CHECKPOINT: pedir validação ao dono.** Mostre o caminho do arquivo de mapeamento, resuma as linhas ⚠️ e as dúvidas, e **aguarde aprovação**. Não siga sem resposta.

- [ ] **Step 5: Aplicar o mapeamento aprovado** reescrevendo `primitives.json`, `semantic.light.json`, `semantic.dark.json`, `component.json` e `typography.json`. Remova "PROVISÓRIO" dos `$description`. Mantenha o formato das Tasks 7 e 5.

- [ ] **Step 6: Gerar e validar**

Run: `pnpm tokens:build && pnpm --filter @gsilisqui/tokens run test`
Expected: `Gerado: …` e todos os testes passando (inclusive a integração com Tailwind usando os novos tamanhos). Erros de camada (ex.: semântico apontando para semântico) mostram o arquivo e o token; corrija o JSON, não o validador.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/notes packages/tokens/src packages/tokens/generated
git commit -m "feat(tokens): real palette, semantic mapping and type scale from Figma

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Changesets, publicação e CI

**Files:**
- Create: `.changeset/config.json`, `.changeset/initial-release.md`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`

- [ ] **Step 1: Criar `.changeset/config.json`**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- [ ] **Step 2: Criar `.changeset/initial-release.md`**

```md
---
"@gsilisqui/tokens": minor
"@gsilisqui/eslint-config": minor
---

Primeira versão: tokens em 3 camadas (Light/Dark) gerando theme.css para Tailwind v4, e a regra opa/no-raw-design-values.
```

- [ ] **Step 3: Criar `.github/workflows/ci.yml`** (fino: só chama `pnpm verify`)

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm verify
```

- [ ] **Step 4: Criar `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: release-${{ github.ref }}

permissions:
  contents: write
  pull-requests: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
          registry-url: https://npm.pkg.github.com
          scope: "@gsilisqui"
      - run: pnpm install --frozen-lockfile
      - uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 5: Rodar o `verify` localmente** (é exatamente o que o CI roda)

Run: `pnpm verify`
Expected: `Tokens em dia.` e depois turbo com `lint`, `typecheck`, `test` e `build` verdes em `@gsilisqui/tokens` e `@gsilisqui/eslint-config`.

- [ ] **Step 6: Confirmar que o `verify` pega tokens editados sem build**

Run: `sed -i 's/"#ffffff"/"#fefefe"/' packages/tokens/src/primitives.json && pnpm tokens:check; echo "exit=$?"; git checkout packages/tokens/src/primitives.json`
Expected: `Tokens desatualizados: theme.css, tokens.css.` e `exit=1`; o arquivo é restaurado em seguida. Se `#ffffff` não existir mais depois da Task 11, troque por qualquer valor existente.

- [ ] **Step 7: Commit**

```bash
git add .changeset .github
git commit -m "ci: add changesets, CI verify and GitHub Packages release

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: README e publicação no GitHub (**com confirmação do dono**)

**Files:**
- Create: `README.md`

- [ ] **Step 1: Criar `README.md`**

````md
# OPA Design System

Design System da OPA baseado em Shadcn/Radix UI. Spec: `docs/superpowers/specs/2026-09-29-opa-design-system-design.md`.

## Pacotes

| Import | Pacote publicado | O que é |
|---|---|---|
| `@opa/tokens` | `@gsilisqui/tokens` | Tokens (JSON DTCG → `theme.css` para Tailwind v4 e `tokens.css` puro) |
| `@opa/eslint-config` | `@gsilisqui/eslint-config` | Regra `opa/no-raw-design-values` |

## Tokens

- Fonte de verdade: `packages/tokens/src/*.json`. **Nunca edite `packages/tokens/generated/`.**
- Camadas: primitivos (`primitives.json`) → semânticos (`semantic.light.json` / `semantic.dark.json`, nomes do Shadcn) → componente (`component.json`).
- Depois de editar: `pnpm tokens:build` e commite `generated/`. O CI falha se estiver desatualizado.

## Consumir (produto ou protótipo)

`.npmrc`:
```
@gsilisqui:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`package.json`:
```json
"dependencies": { "@opa/tokens": "npm:@gsilisqui/tokens@^0.1.0" },
"devDependencies": { "@opa/eslint-config": "npm:@gsilisqui/eslint-config@^0.1.0" }
```

CSS:
```css
@import "tailwindcss";
@import "@opa/tokens/theme.css";
```

`eslint.config.js`:
```js
import opa from "@opa/eslint-config";
export default [...opa.configs.app];
```

## Desenvolvimento

```bash
pnpm install
pnpm verify      # o mesmo que o CI roda
pnpm changeset   # descrever a mudança para o próximo release
```
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: CHECKPOINT: publicar no GitHub.** Push é uma ação externa, então **peça confirmação ao dono** antes. Instruções para ele:
  1. Em github.com, criar o repositório **privado** `GSilisqui/opa-design-system` **vazio** (sem README/licença).
  2. Em *Settings → Actions → General → Workflow permissions*, marcar **Read and write** e **Allow GitHub Actions to create and approve pull requests** (necessário para o changesets abrir o PR de versão).

  Após a confirmação:

Run:
```bash
git remote add origin https://github.com/GSilisqui/opa-design-system.git
git push -u origin main
```
Expected: push concluído. No GitHub, o workflow **CI** fica verde e o **Release** abre um PR "Version Packages" (0.1.0). Ao fazer merge desse PR, os pacotes são publicados no GitHub Packages.

---

## Critérios de pronto do Plano 1

- `pnpm verify` verde localmente e no GitHub Actions.
- `packages/tokens/generated/theme.css` gerado a partir dos valores **reais** do Figma, com mapeamento aprovado pelo dono.
- Teste de integração prova: utilitários semânticos, paleta padrão removida, `dark:` por classe, escala tipográfica do DS, fontes incluídas.
- Regra `opa/no-raw-design-values` com testes cobrindo os níveis `ui` e `app`.
- PR "Version Packages" aberto no GitHub.
