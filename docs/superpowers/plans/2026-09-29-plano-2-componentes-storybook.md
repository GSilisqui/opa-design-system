# Plano 2 — `@opa/ui`, componentes do piloto e Storybook — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o pacote de componentes `@gsilisqui/ui` (importado como `@opa/ui`) com `<Icon>` (Font Awesome Pro) e os 5 componentes do piloto (Button, InputField/Input, Tag, Dialog, Combobox), documentados num Storybook com testes de acessibilidade e validados em apps reais Vite e Next.js.

**Architecture:** Componentes no layout plano do Shadcn (`packages/ui/src/components/ui/*.tsx`), derivados do código do `shadcn@4.21.0` (registry new-york, Tailwind v4) e adaptados às specs do Figma e às decisões do dono. O build usa Vite 8 em library mode com `preserveModules` (mantém `"use client"` por arquivo) + `vite-plugin-dts`. O CSS publicado (`dist/styles.css`) embute o tema de `@opa/tokens` e traz utilitários próprios (`focus-ring`, `bg-shade-*`, sombras do Figma). O Storybook (`apps/storybook`) lê o código-fonte com hot reload e roda cada story como teste de acessibilidade num Chromium real.

**Tech Stack:** React 19 (peer ≥18.3), Radix UI (`radix-ui`), cmdk, class-variance-authority, `cn` (shadcn), Tailwind CSS v4.3, tw-animate-css, Font Awesome 7 Pro (pacotes SVG, import por ícone), Vite 8 + vite-plugin-dts 5, Vitest 5 + Testing Library (jsdom), Storybook 10.6 (+ addon-vitest com Vitest 4.1 + Playwright), Next.js 16.

**Spec:** `docs/superpowers/specs/2026-09-29-opa-design-system-design.md`.
**Specs visuais:** `docs/superpowers/notes/2026-09-29-figma-component-specs.md`.
**Tokens:** `docs/superpowers/notes/2026-09-29-token-mapping.md` (§6 decisões).

---

## Decisões do dono que este plano aplica

| # | Decisão |
|---|---|
| Tokens 17 | Tamanhos com nomes do Figma: `text-xs`=10, `text-sm`=12, **`text-base`=14**, `text-lg`=16px. Todo `text-sm` do Shadcn é revisto. |
| Tokens 18 | `font-semibold` → `font-medium` (ou `font-normal` onde o Figma usa Regular). |
| A | Hover/active dos botões sólidos por **mistura com `foreground`** (`bg-shade-*` 15%, `bg-shade-strong-*` 25%). Neutral: `hover:bg-input`. |
| B | Disabled: `opacity-40`. |
| C | Foco **igual em tudo**: 1px `ring` + halo 2px `primary-subtle` (`focus-ring`). Em elementos com borda, a borda vira `ring` e o halo é `focus-halo`. Estados de campo usam o halo do estado. |
| D | **Aprovado:** `InputField` = composição Shadcn (`Input` + `Label` + descrição), tamanhos `default` (60px, label flutuante) e `sm` (36px). |
| E | Placeholder: `muted-foreground`. |
| F | Erro dos campos: `destructive`. |
| G | Dialog sem X por padrão (`showCloseButton`), overlay `bg-black/50`, título Regular. |
| H + busca | **Só Combobox** (Popover + Command do Shadcn), seleção única com busca. Selecionado = fundo `muted`, sem check. Múltipla seleção fica para a fase 2. |
| I | Tag: ícone como filho; `onRemove` mostra o botão ✕ ("Remover"). Borda sobreposta ao fundo (decisão de tokens 12). |
| J | Hex soltos no Figma ficam para o Plano 3. |
| Contraste | **Exceções aprovadas (2026-09-29):** texto da Tag `info` (4,0:1) e `highlight` (2,05:1, decisão 10), e label/descrição de campo com status `success` (≈3,5:1) e `warning` (≈2,3:1). Mantêm as cores do Figma; o teste de a11y ignora contraste **só nesses elementos**. |
| Ícones | Sem Kit (dono): pacotes Pro diretos. O `<Icon>` desenha o SVG da definição, sem `@fortawesome/react-fontawesome` (ajuste ao spec §8.3). |

## Convenções

- Escopo npm real `@gsilisqui`; nome de import `@opa/*` via alias de workspace (`"@opa/tokens": "workspace:@gsilisqui/tokens@*"`).
- Commits terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Stage **por caminho explícito**.
- **Token do Font Awesome:** a variável `FONTAWESOME_PACKAGE_TOKEN` está no ambiente do usuário do Windows, mas pode não estar na sessão. Antes de qualquer `pnpm install`/`pnpm add`, rode na mesma linha de comando:
  ```bash
  export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')"
  ```
  **Nunca** imprima, grave em arquivo ou commite o valor.
- **Windows:** trabalhe no repo em `C:\Users\IXCSoft\Downloads\DesignSystem`. Não crie worktrees em pastas profundas (ex.: `%TEMP%`): caminhos do store do pnpm acima de ~260 caracteres quebram o Vitest 5 (`#module-evaluator`).
- Componentes: layout plano do Shadcn. Arquivo, teste e story lado a lado: `button.tsx`, `button.test.tsx`, `button.stories.tsx`. (Ajuste ao spec §6: mantém o `shadcn add` funcionando sem mover arquivos.)
- Cada componente começa com um comentário de origem: `// Origem: shadcn/ui <nome> (shadcn@4.21.0, new-york). Adaptado ao Figma <node>.`
- Ícones: `"use client"` só onde há estado/efeito/Radix interativo. `Button`, `Icon` e `Input` ficam sem diretiva (funcionam em Server Components).

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `.npmrc` | Registry do Font Awesome para `@fortawesome/*` |
| `packages/ui/package.json`, `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `components.json` | Pacote, build de biblioteca, testes, config do shadcn CLI |
| `packages/ui/src/styles.css` | Fonte do CSS: tema, tw-animate, base layer, utilitários do DS |
| `packages/ui/scripts/compose-css.ts`, `build-css.ts` | Gera `dist/styles.css` (tema embutido, `@import` no topo) |
| `packages/ui/src/components/ui/icon-registry.ts` | Lista explícita de ícones FA (regular + solid) |
| `packages/ui/src/components/ui/icon.tsx` | `<Icon>` desenha o SVG do FA direto |
| `packages/ui/src/components/ui/{button,label,input,input-field,tag,dialog,popover,command,combobox}.tsx` | Componentes |
| `packages/ui/src/index.ts` | Exports públicos |
| `packages/ui/test/*` | Setup jsdom, testes de CSS e do `dist` |
| `apps/storybook/*` | Storybook: config, tema, Fundações, testes a11y |
| `apps/smoke-vite/*`, `apps/smoke-next/*` | Apps mínimos que consomem o `dist` e verificam o build |

---

### Task 1: Esqueleto do `@gsilisqui/ui`

**Files:**
- Create: `.npmrc`, `packages/ui/package.json`, `packages/ui/tsconfig.json`, `packages/ui/tsconfig.build.json`, `packages/ui/vite.config.ts`, `packages/ui/vitest.config.ts`, `packages/ui/components.json`, `packages/ui/test/setup.ts`, `packages/ui/src/index.ts`
- Modify: `.gitignore`, `turbo.json`

- [ ] **Step 1: Criar `.npmrc` na raiz**

```ini
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=${FONTAWESOME_PACKAGE_TOKEN}
```

- [ ] **Step 2: Criar `packages/ui/package.json`**

```json
{
  "name": "@gsilisqui/ui",
  "version": "0.0.0",
  "description": "Componentes do OPA Design System (Shadcn/Radix). Importe como @opa/ui.",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css",
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build && tsx scripts/build-css.ts",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "peerDependencies": {
    "@fortawesome/pro-regular-svg-icons": "^7.3.0",
    "@fortawesome/pro-solid-svg-icons": "^7.3.0",
    "react": ">=18.3",
    "react-dom": ">=18.3"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/GSilisqui/opa-design-system.git",
    "directory": "packages/ui"
  }
}
```

- [ ] **Step 3: Instalar dependências** (com o token exportado, ver Convenções)

```bash
export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')"
pnpm --filter @gsilisqui/ui add radix-ui@^1.6.7 cmdk@^1.1.1 class-variance-authority@^0.7.1 cn@^0.4.0 tw-animate-css@^1.4.0 @fontsource-variable/inter @fontsource-variable/jetbrains-mono
pnpm --filter @gsilisqui/ui add -D "@opa/tokens@workspace:@gsilisqui/tokens@*" @fortawesome/pro-regular-svg-icons@^7.3.1 @fortawesome/pro-solid-svg-icons@^7.3.1 react@^19.3.0 react-dom@^19.3.0 @types/react@^19.3.0 @types/react-dom@^19.3.0 @types/node vite@^8.3.1 @vitejs/plugin-react@^6.1.1 vite-plugin-dts@^5.1.1 typescript@~6.0 vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom tailwindcss@^4.3.3 @tailwindcss/cli@^4.3.3 tsx storybook@10.6.0 @storybook/react-vite@10.6.0
```
Expected: instalação sem erros. Em `devDependencies` aparece `"@opa/tokens": "workspace:@gsilisqui/tokens@*"`. Se o pnpm recusar o alias no `add`, escreva a linha à mão no `package.json` e rode `pnpm install`.

> `@opa/tokens` é **devDependency**: o tema é embutido no `dist/styles.css` durante o build (spec §6.1), então o pacote publicado não depende dele.

- [ ] **Step 4: Criar `packages/ui/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] },
    "types": ["node"],
    "noEmit": true
  },
  "include": ["src", "test", "scripts", "vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 5: Criar `packages/ui/tsconfig.build.json`** (usado só pelo `vite-plugin-dts`)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": false, "types": [] },
  "include": ["src"],
  "exclude": ["src/**/*.test.tsx", "src/**/*.stories.tsx"]
}
```

- [ ] **Step 6: Criar `packages/ui/vite.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/**/*.test.tsx", "src/**/*.stories.tsx"],
    }),
  ],
  resolve: { alias: { "@": src } },
  build: {
    lib: { entry: "src/index.ts", formats: ["es"] },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
    rolldownOptions: {
      // Tudo de fora fica como import: ícones Pro nunca entram no dist (licença), React/Radix vêm do consumidor.
      external: [/^react(\/|$)/, /^react-dom(\/|$)/, /^radix-ui(\/|$)/, /^@radix-ui\//, /^@fortawesome\//, "cmdk", "cn", "class-variance-authority"],
      output: { preserveModules: true, preserveModulesRoot: "src", entryFileNames: "[name].js" },
    },
  },
});
```

- [ ] **Step 7: Criar `packages/ui/vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.tsx", "test/**/*.test.ts"],
  },
});
```

- [ ] **Step 8: Criar `packages/ui/test/setup.ts`** (lacunas do jsdom usadas por Radix e cmdk)

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
Element.prototype.scrollIntoView ??= function scrollIntoView() {};
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => {};
```

Se o import `@testing-library/jest-dom/vitest` não existir na versão instalada, use o caminho indicado no README do pacote e registre no relatório.

- [ ] **Step 9: Criar `packages/ui/components.json`** (para futuros `shadcn add`; o CSS aponta para um arquivo descartável, spec §8.1)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/.shadcn/scratch.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 10: Criar `packages/ui/src/index.ts` provisório**

```ts
export {};
```

- [ ] **Step 11: Ajustar `.gitignore` e `turbo.json`**

Acrescente ao `.gitignore`:
```gitignore
.shadcn/
.next/
next-env.d.ts
```

Em `turbo.json`, troque o `outputs` de `build` por:
```json
"outputs": ["dist/**", "generated/**", "storybook-static/**", ".next/**", "!.next/cache/**"]
```

- [ ] **Step 12: Verificar**

Run: `pnpm --filter @gsilisqui/ui run typecheck`
Expected: sem erros.

- [ ] **Step 13: Commit**

```bash
git add .npmrc .gitignore turbo.json packages/ui/package.json packages/ui/tsconfig.json packages/ui/tsconfig.build.json packages/ui/vite.config.ts packages/ui/vitest.config.ts packages/ui/components.json packages/ui/test/setup.ts packages/ui/src/index.ts pnpm-lock.yaml
git commit -m "chore(ui): scaffold @gsilisqui/ui package

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: CSS do pacote (`styles.css`) e utilitários do DS

**Files:**
- Create: `packages/ui/src/styles.css`, `packages/ui/test/css-fixture/input.css`, `packages/ui/test/css-fixture/fixture.html`
- Test: `packages/ui/test/styles.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `packages/ui/test/styles.test.ts`

```ts
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const flat = (css: string) => css.replace(/\s+/g, " ");

describe("src/styles.css compilado pelo Tailwind v4", () => {
  let css = "";
  let dir = "";

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "opa-ui-css-"));
    const out = join(dir, "out.css");
    execSync(`pnpm exec tailwindcss -i test/css-fixture/input.css -o "${out}"`, { cwd: pkgRoot, stdio: "pipe", timeout: 60_000 });
    css = flat(readFileSync(out, "utf8"));
  }, 60_000);

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("aplica borda e fundo base do Shadcn", () => {
    expect(css).toMatch(/\* \{[^}]*border-color: var\(--border\)/);
    expect(css).toMatch(/body \{[^}]*background-color: var\(--background\)/);
  });

  it("gera o foco do DS (1px ring + halo 2px)", () => {
    expect(css).toContain(".focus-visible\\:focus-ring:focus-visible");
    expect(css).toContain("inset 0 0 0 1px var(--ring), 0 0 0 2px var(--primary-subtle)");
    expect(css).toContain(".focus-halo-destructive");
  });

  it("gera hover por mistura com o foreground", () => {
    expect(css).toContain(".hover\\:bg-shade-primary");
    expect(css).toContain("color-mix(in oklab, var(--primary), var(--foreground) 15%)");
    expect(css).toMatch(/\.bg-shade-strong-destructive[^}]*color-mix\(in oklab, var\(--destructive\), var\(--foreground\) 25%\)/);
  });

  it("nenhum utilitário aponta para --color-* (não existe no CSS com @theme inline)", () => {
    expect(css).not.toMatch(/var\(--color-(ring|foreground|primary-subtle|destructive-subtle|success-subtle|warning-subtle)\)/);
  });

  it("gera as sombras do Figma", () => {
    expect(css).toMatch(/\.shadow-popover \{[^}]*0 1px 4px 0 rgb\(0 0 0 \/ 0\.25\)/);
    expect(css).toMatch(/\.shadow-dropdown \{[^}]*0 6px 16px 0 rgb\(0 0 0 \/ 0\.08\)/);
  });

  it("inclui as animações do tw-animate-css", () => {
    expect(css).toContain("animate-in");
  });
});
```

- [ ] **Step 2: Criar a fixture**

`packages/ui/test/css-fixture/input.css`:
```css
@import "tailwindcss" source(none);
@import "../../src/styles.css";
@source "./fixture.html";
```

`packages/ui/test/css-fixture/fixture.html`:
```html
<div class="focus-visible:focus-ring focus-halo-destructive hover:bg-shade-primary bg-shade-strong-destructive shadow-popover shadow-dropdown animate-in"></div>
```

- [ ] **Step 3: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run test/styles.test.ts`
Expected: FAIL (o Tailwind não encontra `../../src/styles.css`).

- [ ] **Step 4: Criar `packages/ui/src/styles.css`**

```css
/* Fonte do CSS do @opa/ui. O build gera dist/styles.css embutindo @opa/tokens/theme.css (scripts/build-css.ts). */
@import "@opa/tokens/theme.css";
@import "tw-animate-css";

@source "./";

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Usa as variáveis semânticas (--ring, --foreground...): com @theme inline o Tailwind não emite --color-* no CSS. */

/* Foco (decisão C): 1px ring + halo 2px. Em elementos com borda, troque a borda por border-ring e use focus-halo. */
@utility focus-ring {
  outline: none;
  box-shadow: inset 0 0 0 1px var(--ring), 0 0 0 2px var(--primary-subtle);
}
@utility focus-halo {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-subtle);
}
@utility focus-halo-destructive {
  outline: none;
  box-shadow: 0 0 0 2px var(--destructive-subtle);
}
@utility focus-halo-success {
  outline: none;
  box-shadow: 0 0 0 2px var(--success-subtle);
}
@utility focus-halo-warning {
  outline: none;
  box-shadow: 0 0 0 2px var(--warning-subtle);
}

/* Hover/active (decisão A): mistura com o foreground. Escurece no Light e clareia no Dark, como o Figma. */
@utility bg-shade-* {
  background-color: color-mix(in oklab, --value(--color-*), var(--foreground) 15%);
}
@utility bg-shade-strong-* {
  background-color: color-mix(in oklab, --value(--color-*), var(--foreground) 25%);
}

/* Sombras = effect styles do Figma ("popover" e o dropdown do Select). */
@utility shadow-popover {
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.25);
}
@utility shadow-dropdown {
  box-shadow: 0 6px 16px 0 rgb(0 0 0 / 0.08);
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/ui exec vitest run test/styles.test.ts`
Expected: PASS (6 testes). Se uma asserção de formato falhar, **imprima o trecho gerado** e ajuste só a forma da checagem, mantendo o conteúdo verificado (`color-mix ... 15%`, `var(--ring)`). Se o utilitário não for gerado, investigue a sintaxe `--value(--color-*)` com @superpowers:systematic-debugging antes de mudar a abordagem.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/styles.css packages/ui/test/styles.test.ts packages/ui/test/css-fixture
git commit -m "feat(ui): add package CSS with DS focus, shade and shadow utilities

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `<Icon>` e registro de ícones

O `<Icon>` desenha o `<svg>` do Font Awesome direto (sem runtime nem CSS do FA). Assim as regras do Shadcn como `[&_svg:not([class*='size-'])]:size-4` continuam funcionando. O tamanho padrão é `1em` via `h-[1em] w-[1em]`, que não contém `size-` e portanto deixa o componente pai definir o tamanho.

**Files:**
- Create: `packages/ui/src/components/ui/icon-registry.ts`, `packages/ui/src/components/ui/icon.tsx`, `packages/ui/src/components/ui/icon.stories.tsx`
- Test: `packages/ui/src/components/ui/icon.test.tsx`

- [ ] **Step 1: Escrever o teste que falha** — `icon.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";
import { iconNames, icons } from "./icon-registry";

describe("Icon", () => {
  it("desenha o path do ícone e fica oculto para leitores de tela", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("data-icon", "check");
    expect(svg.getAttribute("viewBox")).toMatch(/^0 0 \d+ \d+$/);
    expect(svg.querySelector("path")?.getAttribute("d")).toBeTruthy();
    expect(svg.getAttribute("class")).toContain("h-[1em]");
  });

  it("com label vira imagem acessível", () => {
    render(<Icon name="trash" label="Excluir" />);
    expect(screen.getByRole("img", { name: "Excluir" })).toBeInTheDocument();
  });

  it("variant solid usa o desenho sólido", () => {
    const { container } = render(
      <>
        <Icon name="circle-info" />
        <Icon name="circle-info" variant="solid" />
      </>,
    );
    const [regular, solid] = container.querySelectorAll("path");
    expect(regular.getAttribute("d")).not.toBe(solid.getAttribute("d"));
  });

  it("size aplica a classe de tamanho", () => {
    const { container } = render(<Icon name="plus" size="lg" />);
    expect(container.querySelector("svg")!.getAttribute("class")).toContain("size-5");
  });
});

describe("registro de ícones", () => {
  it.each(iconNames)("%s existe em regular e solid com o nome certo", (name) => {
    expect(icons.regular[name].iconName).toBe(name);
    expect(icons.regular[name].prefix).toBe("far");
    expect(icons.solid[name].iconName).toBe(name);
    expect(icons.solid[name].prefix).toBe("fas");
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/icon.test.tsx`
Expected: FAIL, `Failed to resolve import "./icon"`.

- [ ] **Step 3: Criar `icon-registry.ts`**

```ts
// Ícones do DS (Font Awesome 7 Pro). Import por ícone: só o que está listado entra no bundle do consumidor.
// Para adicionar: importe o regular e o solid, inclua o nome em IconName e a chave (nome do FA) nos dois mapas.
import { faAngleDown as rAngleDown } from "@fortawesome/pro-regular-svg-icons/faAngleDown";
import { faAngleUp as rAngleUp } from "@fortawesome/pro-regular-svg-icons/faAngleUp";
import { faCheck as rCheck } from "@fortawesome/pro-regular-svg-icons/faCheck";
import { faCircleCheck as rCircleCheck } from "@fortawesome/pro-regular-svg-icons/faCircleCheck";
import { faCircleExclamation as rCircleExclamation } from "@fortawesome/pro-regular-svg-icons/faCircleExclamation";
import { faCircleInfo as rCircleInfo } from "@fortawesome/pro-regular-svg-icons/faCircleInfo";
import { faCopy as rCopy } from "@fortawesome/pro-regular-svg-icons/faCopy";
import { faEllipsis as rEllipsis } from "@fortawesome/pro-regular-svg-icons/faEllipsis";
import { faFaceSmile as rFaceSmile } from "@fortawesome/pro-regular-svg-icons/faFaceSmile";
import { faMagnifyingGlass as rMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlass";
import { faPen as rPen } from "@fortawesome/pro-regular-svg-icons/faPen";
import { faPlus as rPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faTrash as rTrash } from "@fortawesome/pro-regular-svg-icons/faTrash";
import { faTriangleExclamation as rTriangleExclamation } from "@fortawesome/pro-regular-svg-icons/faTriangleExclamation";
import { faXmark as rXmark } from "@fortawesome/pro-regular-svg-icons/faXmark";
import { faAngleDown as sAngleDown } from "@fortawesome/pro-solid-svg-icons/faAngleDown";
import { faAngleUp as sAngleUp } from "@fortawesome/pro-solid-svg-icons/faAngleUp";
import { faCheck as sCheck } from "@fortawesome/pro-solid-svg-icons/faCheck";
import { faCircleCheck as sCircleCheck } from "@fortawesome/pro-solid-svg-icons/faCircleCheck";
import { faCircleExclamation as sCircleExclamation } from "@fortawesome/pro-solid-svg-icons/faCircleExclamation";
import { faCircleInfo as sCircleInfo } from "@fortawesome/pro-solid-svg-icons/faCircleInfo";
import { faCopy as sCopy } from "@fortawesome/pro-solid-svg-icons/faCopy";
import { faEllipsis as sEllipsis } from "@fortawesome/pro-solid-svg-icons/faEllipsis";
import { faFaceSmile as sFaceSmile } from "@fortawesome/pro-solid-svg-icons/faFaceSmile";
import { faMagnifyingGlass as sMagnifyingGlass } from "@fortawesome/pro-solid-svg-icons/faMagnifyingGlass";
import { faPen as sPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faPlus as sPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";
import { faTrash as sTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faTriangleExclamation as sTriangleExclamation } from "@fortawesome/pro-solid-svg-icons/faTriangleExclamation";
import { faXmark as sXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";

/** Forma mínima de uma definição de ícone do Font Awesome. */
export type IconDefinition = {
  prefix: string;
  iconName: string;
  icon: [width: number, height: number, aliases: (string | number)[], unicode: string, path: string | string[]];
};

// União explícita (em vez de inferir): o tipo inferido apontaria para @fortawesome/fontawesome-common-types,
// que não é dependência direta, e o vite-plugin-dts deixaria de gerar este .d.ts.
export type IconName =
  | "angle-down"
  | "angle-up"
  | "check"
  | "circle-check"
  | "circle-exclamation"
  | "circle-info"
  | "copy"
  | "ellipsis"
  | "face-smile"
  | "magnifying-glass"
  | "pen"
  | "plus"
  | "trash"
  | "triangle-exclamation"
  | "xmark";

const regular: Record<IconName, IconDefinition> = {
  "angle-down": rAngleDown,
  "angle-up": rAngleUp,
  check: rCheck,
  "circle-check": rCircleCheck,
  "circle-exclamation": rCircleExclamation,
  "circle-info": rCircleInfo,
  copy: rCopy,
  ellipsis: rEllipsis,
  "face-smile": rFaceSmile,
  "magnifying-glass": rMagnifyingGlass,
  pen: rPen,
  plus: rPlus,
  trash: rTrash,
  "triangle-exclamation": rTriangleExclamation,
  xmark: rXmark,
};

const solid: Record<IconName, IconDefinition> = {
  "angle-down": sAngleDown,
  "angle-up": sAngleUp,
  check: sCheck,
  "circle-check": sCircleCheck,
  "circle-exclamation": sCircleExclamation,
  "circle-info": sCircleInfo,
  copy: sCopy,
  ellipsis: sEllipsis,
  "face-smile": sFaceSmile,
  "magnifying-glass": sMagnifyingGlass,
  pen: sPen,
  plus: sPlus,
  trash: sTrash,
  "triangle-exclamation": sTriangleExclamation,
  xmark: sXmark,
};

export const icons: Record<"regular" | "solid", Record<IconName, IconDefinition>> = { regular, solid };
export const iconNames = Object.keys(regular) as IconName[];
```

Se o TypeScript reclamar do tipo `aliases` (o FA usa `string[]` ou `(string|number)[]` dependendo da versão), ajuste só a tupla de `IconDefinition` para aceitar a forma real do `.d.ts` do pacote.

- [ ] **Step 4: Criar `icon.tsx`**

```tsx
// Ícone do DS: desenha o SVG do Font Awesome Pro direto. Regular é o padrão; solid para estados ativos/selecionados.
import * as React from "react";
import { cn } from "cn";
import { icons, type IconName } from "@/components/ui/icon-registry";

const iconSizes = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
} as const;

type IconProps = Omit<React.ComponentProps<"svg">, "children"> & {
  name: IconName;
  variant?: "regular" | "solid";
  /** Sem size, o ícone tem 1em e o componente pai pode definir o tamanho. */
  size?: keyof typeof iconSizes;
  /** Texto para leitores de tela. Sem label, o ícone é decorativo (aria-hidden). */
  label?: string;
};

function Icon({ name, variant = "regular", size, label, className, ...props }: IconProps) {
  const [width, height, , , path] = icons[variant][name].icon;
  const paths = Array.isArray(path) ? path : [path];

  return (
    <svg
      data-slot="icon"
      data-icon={name}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block h-[1em] w-[1em] shrink-0", size && iconSizes[size], className)}
      {...props}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export { Icon, type IconName };
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/icon.test.tsx`
Expected: PASS (4 + 15 testes).

- [ ] **Step 6: Criar `icon.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";
import { iconNames } from "./icon-registry";

const meta = {
  title: "Componentes/Icon",
  component: Icon,
  args: { name: "face-smile", variant: "regular", size: "md" },
  argTypes: {
    name: { control: "select", options: iconNames },
    variant: { control: "inline-radio", options: ["regular", "solid"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Font Awesome 7 Pro. Regular por padrão; solid para estados ativos. Sem `label`, é decorativo. Galeria completa em Fundações/Ícones.",
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-end gap-4 text-foreground">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Icon key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/components/ui/icon-registry.ts packages/ui/src/components/ui/icon.tsx packages/ui/src/components/ui/icon.test.tsx packages/ui/src/components/ui/icon.stories.tsx
git commit -m "feat(ui): add Icon with explicit Font Awesome Pro registry

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Button

Figma `36:2938`: tipos Primary, Destructive, Neutral, Quiet, Outline, Red Quiet, Green Quiet; alturas 24/36/48px; raios 8/12/16px; texto Regular; ícones 12px (SM) e 14px (Default/LG).

**Files:**
- Create: `packages/ui/src/components/ui/button.tsx`, `packages/ui/src/components/ui/button.stories.tsx`
- Test: `packages/ui/src/components/ui/button.test.tsx`

- [ ] **Step 1: Escrever o teste que falha** — `button.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("usa primary e default por padrão", () => {
    render(<Button>Salvar</Button>);
    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "default");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("hover:bg-shade-primary");
    expect(button.className).toContain("h-9");
    expect(button.className).toContain("rounded-xl");
    expect(button.className).toContain("font-normal");
  });

  it.each([
    ["destructive", "bg-destructive"],
    ["neutral", "hover:bg-input"],
    ["quiet", "hover:bg-accent"],
    ["outline", "border-border"],
    ["destructive-quiet", "hover:bg-destructive-subtle"],
    ["success-quiet", "text-success-subtle-foreground"],
  ] as const)("variante %s", (variant, expected) => {
    render(<Button variant={variant}>Ok</Button>);
    expect(screen.getByRole("button").className).toContain(expected);
  });

  it.each([
    ["sm", "h-6"],
    ["lg", "h-12"],
    ["icon-sm", "size-6"],
    ["icon", "size-9"],
    ["icon-lg", "size-12"],
  ] as const)("tamanho %s", (size, expected) => {
    render(<Button size={size} aria-label="Ação">+</Button>);
    expect(screen.getByRole("button").className).toContain(expected);
  });

  it("dispara onClick e respeita disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Ok</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Ok</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button").className).toContain("disabled:opacity-40");
  });

  it("asChild aplica o estilo no filho", () => {
    render(
      <Button asChild>
        <a href="/novo">Novo</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Novo" }).className).toContain("bg-primary");
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/button.test.tsx`
Expected: FAIL, `Failed to resolve import "./button"`.

- [ ] **Step 3: Criar `button.tsx`**

```tsx
// Origem: shadcn/ui button (shadcn@4.21.0, new-york). Adaptado ao Figma Button 36:2938.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-normal whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-shade-primary focus-visible:focus-ring active:bg-shade-strong-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-shade-strong-destructive focus-visible:focus-ring active:bg-shade-strong-destructive",
        neutral: "bg-secondary text-secondary-foreground hover:bg-input focus-visible:focus-ring active:bg-shade-input",
        quiet: "text-foreground hover:bg-accent focus-visible:bg-card focus-visible:focus-ring active:bg-accent",
        outline:
          "border border-border text-foreground hover:bg-accent focus-visible:border-ring focus-visible:bg-card focus-visible:focus-halo active:bg-accent",
        "destructive-quiet":
          "text-destructive hover:bg-destructive-subtle focus-visible:bg-card focus-visible:focus-ring active:bg-destructive-subtle",
        "success-quiet":
          "text-success-subtle-foreground hover:bg-success-subtle focus-visible:bg-card focus-visible:focus-ring active:bg-success-subtle",
      },
      size: {
        sm: "h-6 rounded-lg px-2 text-sm [&_svg:not([class*='size-'])]:size-3",
        default: "h-9 rounded-xl px-4 text-base [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 rounded-2xl px-4 text-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        icon: "size-9 rounded-xl [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 rounded-2xl [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/button.test.tsx`
Expected: PASS (14 testes).

- [ ] **Step 5: Criar `button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Icon } from "./icon";

const variants = ["primary", "destructive", "neutral", "quiet", "outline", "destructive-quiet", "success-quiet"] as const;

const meta = {
  title: "Componentes/Button",
  component: Button,
  args: { children: "Salvar", variant: "primary", size: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: ["sm", "default", "lg", "icon-sm", "icon", "icon-lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=36-2938 · Red Quiet = `destructive-quiet`, Green Quiet = `success-quiet`. Botão só com ícone precisa de `aria-label`.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">SM</Button>
      <Button>Default</Button>
      <Button size="lg">LG</Button>
      <Button size="icon-sm" variant="quiet" aria-label="Editar">
        <Icon name="pen" />
      </Button>
      <Button size="icon" variant="quiet" aria-label="Editar">
        <Icon name="pen" />
      </Button>
      <Button size="icon-lg" variant="quiet" aria-label="Editar">
        <Icon name="pen" />
      </Button>
    </div>
  ),
};

export const ComIcone: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button>
        <Icon name="plus" />
        Novo contato
      </Button>
      <Button variant="neutral">
        Filtrar
        <Icon name="angle-down" />
      </Button>
      <Button variant="destructive-quiet">
        <Icon name="trash" />
        Excluir
      </Button>
    </div>
  ),
};

export const Desabilitado: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/components/ui/button.tsx packages/ui/src/components/ui/button.test.tsx packages/ui/src/components/ui/button.stories.tsx
git commit -m "feat(ui): add Button adapted to Figma variants and sizes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Label, Input e InputField

`Input` = Input do Shadcn com o visual do SM do Figma (36px, `card` + `border`). `InputField` = composição aprovada (decisão D): `default` 60px com label flutuante e fundo preenchido (`input-background` + `input`), `sm` 36px inline. Estados: `status` (`error` | `success` | `warning`), `readOnly` (só borda inferior), `disabled`, `required` (`*`), `optional` ("(opcional)"), `description` (10px abaixo).

**Files:**
- Create: `packages/ui/src/components/ui/label.tsx`, `input.tsx`, `input-field.tsx`, `input-field.stories.tsx`
- Test: `packages/ui/src/components/ui/input-field.test.tsx`

- [ ] **Step 1: Escrever o teste que falha** — `input-field.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";
import { InputField } from "./input-field";

describe("Input", () => {
  it("usa o visual SM do Figma e placeholder muted", () => {
    render(<Input aria-label="Buscar" placeholder="Buscar" />);
    const input = screen.getByRole("textbox", { name: "Buscar" });
    expect(input.className).toContain("h-9");
    expect(input.className).toContain("bg-card");
    expect(input.className).toContain("placeholder:text-muted-foreground");
    expect(input.className).toContain("focus-visible:focus-halo");
  });
});

describe("InputField", () => {
  it("associa o label ao campo e aceita digitação", async () => {
    render(<InputField label="Nome do contato" />);
    const input = screen.getByLabelText("Nome do contato");
    await userEvent.type(input, "Ana");
    expect(input).toHaveValue("Ana");
  });

  it("default tem 60px, fundo preenchido e label flutuante", () => {
    render(<InputField label="Nome" />);
    const input = screen.getByLabelText("Nome");
    expect(input.className).toContain("h-15");
    expect(input.className).toContain("bg-input-background");
    expect(input.className).toContain("peer");
    expect(input).toHaveAttribute("placeholder", " ");
  });

  it("liga a descrição por aria-describedby", () => {
    render(<InputField label="E-mail" description="Usado para login" />);
    expect(screen.getByLabelText("E-mail")).toHaveAccessibleDescription("Usado para login");
  });

  it("status error marca aria-invalid e pinta label e descrição", () => {
    render(<InputField label="E-mail" status="error" description="Informe um e-mail válido" />);
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-status", "error");
    expect(input.className).toContain("border-destructive");
    expect(screen.getByText("Informe um e-mail válido").className).toContain("text-destructive");
  });

  it.each(["success", "warning"] as const)("status %s não marca aria-invalid", (status) => {
    render(<InputField label="CPF" status={status} />);
    expect(screen.getByLabelText("CPF")).not.toHaveAttribute("aria-invalid");
  });

  it("required mostra o asterisco e marca o campo", () => {
    render(<InputField label="Nome" required />);
    expect(screen.getByLabelText(/Nome/)).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("o asterisco segue a cor do estado", () => {
    render(<InputField label="CPF" required status="success" />);
    expect(screen.getByText("*").className).toContain("text-success");
  });

  it("optional mostra (opcional)", () => {
    render(<InputField label="Apelido" optional />);
    expect(screen.getByText("(opcional)")).toBeInTheDocument();
  });

  it("readOnly usa só a borda inferior", () => {
    render(<InputField label="Protocolo" readOnly defaultValue="#482913" />);
    const input = screen.getByLabelText("Protocolo");
    expect(input).toHaveAttribute("readonly");
    expect(input.className).toContain("rounded-none");
    expect(input.className).toContain("border-b");
  });

  it("sm usa o label como placeholder e mantém o nome acessível", () => {
    render(<InputField label="Buscar conversa" size="sm" />);
    const input = screen.getByLabelText("Buscar conversa");
    expect(input).toHaveAttribute("placeholder", "Buscar conversa");
    expect(input.className).toContain("h-9");
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/input-field.test.tsx`
Expected: FAIL, `Failed to resolve import "./input"`.

- [ ] **Step 3: Criar `label.tsx`**

```tsx
"use client";

// Origem: shadcn/ui label (shadcn@4.21.0, new-york). Texto do label do Figma: 12px Regular, foreground-secondary.
import * as React from "react";
import { cn } from "cn";
import { Label as LabelPrimitive } from "radix-ui";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1 text-sm leading-4 font-normal text-foreground-secondary select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
```

- [ ] **Step 4: Criar `input.tsx`**

```tsx
// Origem: shadcn/ui input (shadcn@4.21.0, new-york). Visual do Input SM do Figma 885:5165 (36px, card + border, raio 12px).
import * as React from "react";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-border bg-card px-3 text-sm text-foreground transition-[color,box-shadow,border-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:border-ring focus-visible:focus-halo",
        "aria-invalid:border-destructive aria-invalid:focus-halo-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
```

- [ ] **Step 5: Criar `input-field.tsx`**

```tsx
"use client";

// Composição aprovada pelo dono (decisão D): Input + Label + descrição do Shadcn, no layout do Input Field do Figma 885:5165.
import * as React from "react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputFieldStatus = "error" | "success" | "warning";

const statusField: Record<InputFieldStatus, string> = {
  error: "border-destructive focus-halo-destructive focus-visible:border-destructive focus-visible:focus-halo-destructive",
  success: "border-success focus-halo-success focus-visible:border-success focus-visible:focus-halo-success",
  warning: "border-warning focus-halo-warning focus-visible:border-warning focus-visible:focus-halo-warning",
};

const statusText: Record<InputFieldStatus, string> = {
  error: "text-destructive",
  success: "text-success",
  warning: "text-warning",
};

type InputFieldProps = Omit<React.ComponentProps<"input">, "size"> & {
  label: string;
  description?: React.ReactNode;
  status?: InputFieldStatus;
  size?: "default" | "sm";
  optional?: boolean;
  containerClassName?: string;
};

function InputField({
  label,
  description,
  status,
  size = "default",
  optional,
  required,
  readOnly,
  disabled,
  id,
  placeholder,
  className,
  containerClassName,
  ...props
}: InputFieldProps) {
  const autoId = React.useId();
  const inputId = id ?? `input-${autoId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  // Figma: o * é vermelho, segue a cor do estado em sucesso/alerta e fica cinza quando desabilitado.
  const markerColor = disabled
    ? "text-muted-foreground"
    : status === "success" || status === "warning"
      ? statusText[status]
      : "text-destructive";
  const marker = required ? (
    <span aria-hidden="true" className={markerColor}>
      *
    </span>
  ) : optional ? (
    <span className="text-xs text-muted-foreground">(opcional)</span>
  ) : null;

  const shared = {
    id: inputId,
    required,
    readOnly,
    disabled,
    "aria-invalid": status === "error" ? true : undefined,
    "aria-describedby": descriptionId,
    "data-status": status,
    ...props,
  };

  const readOnlyClass = "rounded-none border-0 border-b border-b-border bg-transparent px-0";

  return (
    <div data-slot="input-field" data-size={size} className={cn("grid gap-1", containerClassName)}>
      {size === "default" ? (
        <div className="relative">
          <Input
            {...shared}
            placeholder={placeholder ?? " "}
            className={cn(
              "peer h-15 border-input bg-input-background px-3 pt-6 pb-2 text-base placeholder:text-transparent focus-visible:placeholder:text-muted-foreground",
              readOnly && readOnlyClass,
              status && statusField[status],
              className,
            )}
          />
          <Label
            htmlFor={inputId}
            data-status={status}
            className={cn(
              "pointer-events-none absolute top-5 left-3 text-base leading-5 transition-all",
              "peer-focus-visible:top-2 peer-focus-visible:text-sm peer-focus-visible:leading-4",
              "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:leading-4",
              readOnly && "left-0",
              status && statusText[status],
              disabled && "text-muted-foreground",
            )}
          >
            {label}
            {marker}
          </Label>
        </div>
      ) : (
        <>
          <Label htmlFor={inputId} className="sr-only">
            {label}
          </Label>
          <Input
            {...shared}
            placeholder={placeholder ?? label}
            className={cn(readOnly && readOnlyClass, status && statusField[status], className)}
          />
        </>
      )}
      {description ? (
        <p
          id={descriptionId}
          data-slot="input-field-description"
          data-status={status}
          className={cn("text-xs leading-3 text-muted-foreground", status && statusText[status])}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { InputField, type InputFieldStatus };
```

- [ ] **Step 6: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/input-field.test.tsx`
Expected: PASS (12 testes). Se `required` via `getByLabelText(/Nome/)` falhar porque o asterisco entra no nome, mantenha o `aria-hidden` do marcador e ajuste só a consulta do teste, sem mudar o componente.

- [ ] **Step 7: Criar `input-field.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { InputField } from "./input-field";

const meta = {
  title: "Componentes/InputField",
  component: InputField,
  args: { label: "Nome do contato", placeholder: "Digite o nome", size: "default" },
  argTypes: {
    status: { control: "inline-radio", options: [undefined, "error", "success", "warning"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=885-5165 · `default` (60px) tem label flutuante; `sm` (36px) usa o label como placeholder. Para um campo sem label visível, use `Input`.",
      },
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-5">
      <InputField label="Vazio" />
      <InputField label="Preenchido" defaultValue="Ana Souza" />
      <InputField label="E-mail" required status="error" defaultValue="ana@" description="Informe um e-mail válido" />
      <InputField label="CPF" status="success" defaultValue="123.456.789-00" description="CPF verificado" />
      <InputField label="Telefone" status="warning" defaultValue="(11) 9999-9999" description="Número sem WhatsApp" />
      <InputField label="Protocolo" readOnly defaultValue="#482913" />
      <InputField label="Apelido" optional disabled />
    </div>
  ),
};

export const TamanhoSM: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-3">
      <InputField size="sm" label="Buscar conversa" />
      <InputField size="sm" label="E-mail" status="error" description="Informe um e-mail válido" />
    </div>
  ),
};

export const InputPuro: Story = {
  render: () => <Input aria-label="Buscar" placeholder="Buscar…" className="max-w-[400px]" />,
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/ui/label.tsx packages/ui/src/components/ui/input.tsx packages/ui/src/components/ui/input-field.tsx packages/ui/src/components/ui/input-field.test.tsx packages/ui/src/components/ui/input-field.stories.tsx
git commit -m "feat(ui): add Label, Input and InputField with floating label

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Tag

Origem: Badge do Shadcn, renomeado para Tag (spec §8.4). Figma Chip `304:4496`: 20px (`default`, raio 6px) e 24px (`md`, raio 8px), texto 14px Regular, fundo e borda com a mesma cor translúcida.

**Files:**
- Create: `packages/ui/src/components/ui/tag.tsx`, `packages/ui/src/components/ui/tag.stories.tsx`
- Test: `packages/ui/src/components/ui/tag.test.tsx`

- [ ] **Step 1: Escrever o teste que falha** — `tag.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./tag";

describe("Tag", () => {
  it("usa neutral e default por padrão", () => {
    render(<Tag>Neutra</Tag>);
    const tag = screen.getByText("Neutra");
    expect(tag).toHaveAttribute("data-slot", "tag");
    expect(tag.className).toContain("bg-tag-bg");
    expect(tag.className).toContain("border-tag-border");
    expect(tag.className).toContain("text-tag-foreground");
    expect(tag.className).toContain("h-5");
    expect(tag.className).toContain("text-base");
  });

  it.each([
    ["primary", "bg-primary-subtle"],
    ["success", "bg-success-subtle"],
    ["warning", "bg-warning-subtle"],
    ["info", "bg-info-subtle"],
    ["destructive", "bg-destructive-subtle"],
    ["highlight", "bg-highlight-subtle"],
  ] as const)("variante %s", (variant, expected) => {
    render(<Tag variant={variant}>X</Tag>);
    expect(screen.getByText("X").className).toContain(expected);
  });

  it("size md tem 24px e raio 8px", () => {
    render(<Tag size="md">Médio</Tag>);
    expect(screen.getByText("Médio").className).toContain("h-6");
    expect(screen.getByText("Médio").className).toContain("rounded-lg");
  });

  it("sem onRemove não tem botão", () => {
    render(<Tag>Sem remover</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("onRemove mostra o botão Remover e chama a função", async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>VIP</Tag>);
    await userEvent.click(screen.getByRole("button", { name: "Remover" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("aceita outro texto para o botão", () => {
    render(
      <Tag onRemove={() => {}} removeLabel="Remover VIP">
        VIP
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Remover VIP" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/tag.test.tsx`
Expected: FAIL, `Failed to resolve import "./tag"`.

- [ ] **Step 3: Criar `tag.tsx`**

```tsx
"use client";

// Origem: shadcn/ui badge (shadcn@4.21.0, new-york), renomeado para Tag. Adaptado ao Figma Chip 304:4496.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Icon } from "@/components/ui/icon";

const tagVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 border px-2 text-base font-normal whitespace-nowrap [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        neutral: "border-tag-border bg-tag-bg text-tag-foreground",
        primary: "border-primary-subtle bg-primary-subtle text-primary-subtle-foreground",
        success: "border-success-subtle bg-success-subtle text-success-subtle-foreground",
        warning: "border-warning-subtle bg-warning-subtle text-warning-subtle-foreground",
        info: "border-info-subtle bg-info-subtle text-info-subtle-foreground",
        destructive: "border-destructive-subtle bg-destructive-subtle text-destructive-subtle-foreground",
        highlight: "border-highlight-subtle bg-highlight-subtle text-highlight-subtle-foreground",
      },
      size: {
        default: "h-5 rounded-md [&>svg]:size-3",
        md: "h-6 rounded-lg [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  },
);

type TagProps = React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & {
    /** Mostra o botão ✕ e chama esta função ao clicar. */
    onRemove?: () => void;
    removeLabel?: string;
  };

function Tag({ className, variant = "neutral", size = "default", onRemove, removeLabel = "Remover", children, ...props }: TagProps) {
  return (
    <span data-slot="tag" data-variant={variant} className={cn(tagVariants({ variant, size }), className)} {...props}>
      {children}
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="-mr-1 ml-1 inline-grid size-4 place-items-center rounded-sm outline-none hover:bg-current/10 focus-visible:focus-ring"
        >
          <Icon name="xmark" size={size === "md" ? "sm" : "xs"} />
        </button>
      ) : null}
    </span>
  );
}

export { Tag, tagVariants };
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/tag.test.tsx`
Expected: PASS (11 testes).

- [ ] **Step 5: Criar `tag.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";
import { Tag } from "./tag";

const variants = ["neutral", "primary", "success", "warning", "info", "destructive", "highlight"] as const;
const labels: Record<(typeof variants)[number], string> = {
  neutral: "Neutra",
  primary: "Primária",
  success: "Resolvido",
  warning: "Pendente",
  info: "Novo",
  destructive: "Atrasado",
  highlight: "VIP",
};

const meta = {
  title: "Componentes/Tag",
  component: Tag,
  args: { children: "Novo", variant: "info", size: "default" },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: ["default", "md"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma (Chip): https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=304-4496 · Rótulo/categoria. Para indicador de pendência (contador), use Badge (fora do piloto). Yellow = `highlight`, Danger = `destructive`.",
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["default", "md"] as const).map((size) => (
        <div key={size} className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Tag key={variant} variant={variant} size={size}>
              {labels[variant]}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ComIconeERemover: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Tag key={variant} variant={variant} onRemove={() => {}} removeLabel={`Remover ${labels[variant]}`}>
          <Icon name="circle-info" />
          {labels[variant]}
        </Tag>
      ))}
    </div>
  ),
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/components/ui/tag.tsx packages/ui/src/components/ui/tag.test.tsx packages/ui/src/components/ui/tag.stories.tsx
git commit -m "feat(ui): add Tag (from shadcn Badge) with remove button

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Dialog

Figma Modal `6377:1529`: 448px, `p-6`, `gap-4`, `rounded-xl`, `bg-card`, borda `border`, sombra "popover", título 16px Regular, descrição 14px `foreground-secondary`, footer à direita. Sem X por padrão (decisão G).

**Files:**
- Create: `packages/ui/src/components/ui/dialog.tsx`, `packages/ui/src/components/ui/dialog.stories.tsx`
- Test: `packages/ui/src/components/ui/dialog.test.tsx`

- [ ] **Step 1: Escrever o teste que falha** — `dialog.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

function Example({ showCloseButton }: { showCloseButton?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Encerrar</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>Encerrar atendimento</DialogTitle>
          <DialogDescription>O cliente vai receber a pesquisa de satisfação.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="neutral">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("abre pelo trigger com título e descrição acessíveis", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    const dialog = screen.getByRole("dialog", { name: "Encerrar atendimento" });
    expect(dialog).toHaveAccessibleDescription("O cliente vai receber a pesquisa de satisfação.");
    expect(dialog.className).toContain("sm:max-w-[448px]");
    expect(dialog.className).toContain("shadow-popover");
  });

  it("não mostra o X por padrão", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    expect(screen.queryByRole("button", { name: "Fechar" })).not.toBeInTheDocument();
  });

  it("showCloseButton mostra o X, que fecha o dialog", async () => {
    render(<Example showCloseButton />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Esc fecha o dialog", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("título é Regular (sem semibold)", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    const title = screen.getByText("Encerrar atendimento");
    expect(title.className).toContain("font-normal");
    expect(title.className).not.toContain("font-semibold");
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/dialog.test.tsx`
Expected: FAIL, `Failed to resolve import "./dialog"`.

- [ ] **Step 3: Criar `dialog.tsx`**

```tsx
"use client";

// Origem: shadcn/ui dialog (shadcn@4.21.0, new-york). Adaptado ao Figma Modal 6377:1529.
import * as React from "react";
import { cn } from "cn";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = false,
  closeLabel = "Fechar",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** No Figma não há X; use só quando a tarefa não tem botão de cancelar. Esc sempre fecha. */
  showCloseButton?: boolean;
  closeLabel?: string;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-popover duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-[448px]",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close asChild>
            <Button variant="quiet" size="icon" aria-label={closeLabel} className="absolute top-3 right-3">
              <Icon name="xmark" />
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 text-left", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-6 font-normal text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-base text-foreground-secondary", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/dialog.test.tsx`
Expected: PASS (5 testes).

- [ ] **Step 5: Criar `dialog.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { InputField } from "./input-field";

const meta = {
  title: "Componentes/Dialog",
  component: DialogContent,
  parameters: {
    docs: {
      description: {
        component:
          "Figma (Modal): https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=6377-1529 · Sem X por padrão; `showCloseButton` para ativar. Footer: Neutral (cancelar) + Primary.",
      },
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Encerrar atendimento</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Encerrar atendimento</DialogTitle>
          <DialogDescription>O cliente vai receber a pesquisa de satisfação.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral">Cancelar</Button>
          </DialogClose>
          <Button>Encerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ComFormulario: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="neutral">Novo contato</Button>
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader className="pr-10">
          <DialogTitle>Novo contato</DialogTitle>
          <DialogDescription>Preencha os dados principais.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <InputField label="Nome" required />
          <InputField label="E-mail" type="email" optional />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral">Cancelar</Button>
          </DialogClose>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/components/ui/dialog.tsx packages/ui/src/components/ui/dialog.test.tsx packages/ui/src/components/ui/dialog.stories.tsx
git commit -m "feat(ui): add Dialog adapted to Figma Modal

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Popover, Command e Combobox

Combobox = composição oficial do Shadcn (Popover + Command/cmdk), seleção única com busca. Trigger no visual do Select do Figma (`885:3949`): `default` 60px (label flutuante, preenchido) e `sm` 36px ("Label │ Valor"); popover `rounded-xl`, `shadow-dropdown`; itens 36px `rounded-lg`, hover `accent`, selecionado `muted` sem check.

**Files:**
- Create: `packages/ui/src/components/ui/popover.tsx`, `command.tsx`, `combobox.tsx`, `combobox.stories.tsx`
- Test: `packages/ui/src/components/ui/combobox.test.tsx`

- [ ] **Step 1: Escrever o teste que falha** — `combobox.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";

const options: ComboboxOption[] = [
  { value: "comercial", label: "Comercial" },
  { value: "suporte", label: "Suporte" },
  { value: "financeiro", label: "Financeiro" },
  { value: "logistica", label: "Logística", keywords: ["entregas"] },
];

describe("Combobox", () => {
  it("tem nome acessível pelo label e começa fechado", () => {
    render(<Combobox label="Departamento" options={options} />);
    const trigger = screen.getByRole("combobox", { name: "Departamento" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.className).toContain("h-15");
  });

  it("abre e lista as opções", async () => {
    render(<Combobox label="Departamento" options={options} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("filtra pela busca, inclusive por palavras-chave", async () => {
    render(<Combobox label="Departamento" options={options} searchPlaceholder="Buscar departamento" />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.type(screen.getByPlaceholderText("Buscar departamento"), "entreg");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Logística"]);
  });

  it("mostra a mensagem quando nada é encontrado", async () => {
    render(<Combobox label="Departamento" options={options} searchPlaceholder="Buscar" emptyMessage="Nada por aqui" />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.type(screen.getByPlaceholderText("Buscar"), "zzz");
    expect(screen.getByText("Nada por aqui")).toBeInTheDocument();
  });

  it("selecionar chama onValueChange, fecha e mostra o valor", async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Departamento" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.click(screen.getByRole("option", { name: "Financeiro" }));
    expect(onValueChange).toHaveBeenCalledWith("financeiro");
    const trigger = screen.getByRole("combobox", { name: "Departamento" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Financeiro");
  });

  it("funciona pelo teclado: seta para baixo e Enter selecionam", async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Departamento" options={options} onValueChange={onValueChange} searchPlaceholder="Buscar" />);
    screen.getByRole("combobox", { name: "Departamento" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByPlaceholderText("Buscar")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("suporte");
  });

  it("status mantém a cor ao focar e ao abrir", () => {
    render(<Combobox label="Departamento" options={options} status="error" />);
    const className = screen.getByRole("combobox", { name: "Departamento" }).className;
    expect(className).toContain("focus-visible:border-destructive");
    expect(className).toContain("data-[state=open]:border-destructive");
  });

  it("funciona controlado e marca o item selecionado", async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>("suporte");
      return <Combobox label="Departamento" options={options} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveTextContent("Suporte");
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    expect(screen.getByRole("option", { name: "Suporte" })).toHaveAttribute("data-checked", "true");
  });

  it("status e descrição ficam ligados ao trigger", () => {
    render(<Combobox label="Departamento" options={options} status="error" description="Escolha um departamento" />);
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveAccessibleDescription("Escolha um departamento");
    expect(screen.getByText("Escolha um departamento").className).toContain("text-destructive");
  });

  it("envia o valor em formulários quando recebe name", () => {
    const { container } = render(<Combobox label="Departamento" options={options} defaultValue="comercial" name="departamento" />);
    expect(container.querySelector('input[type="hidden"][name="departamento"]')).toHaveValue("comercial");
  });
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/combobox.test.tsx`
Expected: FAIL, `Failed to resolve import "./combobox"`.

- [ ] **Step 3: Criar `popover.tsx`**

```tsx
"use client";

// Origem: shadcn/ui popover (shadcn@4.21.0, new-york). Visual do Select Popover do Figma 6216:189.
import * as React from "react";
import { cn } from "cn";
import { Popover as PopoverPrimitive } from "radix-ui";

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-dropdown outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
```

- [ ] **Step 4: Criar `command.tsx`**

```tsx
"use client";

// Origem: shadcn/ui command (shadcn@4.21.0, new-york), sem CommandDialog/CommandShortcut (fora do piloto).
// Itens no visual do Select Item do Figma 6214:164: 36px, rounded-lg, hover accent, selecionado muted.
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "cn";
import { Icon } from "@/components/ui/icon";

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground", className)}
      {...props}
    />
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b border-border px-3">
      <Icon name="magnifying-glass" className="size-3.5 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-9 w-full bg-transparent py-2 text-base text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
      {...props}
    />
  );
}

function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className="py-6 text-center text-base text-muted-foreground" {...props} />;
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-0.5",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("-mx-1 h-px bg-border", className)} {...props} />;
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex h-9 cursor-default items-center gap-2 rounded-lg px-3 text-base outline-hidden select-none data-[checked=true]:bg-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 data-[selected=true]:bg-accent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

export { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator };
```

- [ ] **Step 5: Criar `combobox.tsx`**

```tsx
"use client";

// Composição oficial do Shadcn (Combobox = Popover + Command). Seleção única com busca (decisão do dono: só Combobox).
// Trigger no visual do Select do Figma 885:3949.
import * as React from "react";
import { cn } from "cn";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  /** Termos extras que também encontram a opção na busca. */
  keywords?: string[];
};

type ComboboxStatus = "error" | "success" | "warning";

// Os variants focus-visible/data-[state=open] precisam ser repetidos: senão o foco e o estado aberto trocam a cor do status pela do ring.
const statusTrigger: Record<ComboboxStatus, string> = {
  error:
    "border-destructive focus-halo-destructive focus-visible:border-destructive focus-visible:focus-halo-destructive data-[state=open]:border-destructive data-[state=open]:focus-halo-destructive",
  success:
    "border-success focus-halo-success focus-visible:border-success focus-visible:focus-halo-success data-[state=open]:border-success data-[state=open]:focus-halo-success",
  warning:
    "border-warning focus-halo-warning focus-visible:border-warning focus-visible:focus-halo-warning data-[state=open]:border-warning data-[state=open]:focus-halo-warning",
};

const statusText: Record<ComboboxStatus, string> = {
  error: "text-destructive",
  success: "text-success",
  warning: "text-warning",
};

type ComboboxProps = {
  label: string;
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  description?: React.ReactNode;
  status?: ComboboxStatus;
  size?: "default" | "sm";
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
};

function Combobox({
  label,
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = "Busque ou selecione…",
  searchPlaceholder = "Buscar…",
  emptyMessage = "Nenhum resultado encontrado",
  description,
  status,
  size = "default",
  required,
  disabled,
  name,
  id,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : innerValue;
  const selected = options.find((option) => option.value === value);

  const autoId = React.useId();
  const triggerId = id ?? `combobox-${autoId}`;
  const labelId = `${triggerId}-label`;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const floated = open || Boolean(selected);

  function handleSelect(next: string) {
    setInnerValue(next);
    onValueChange?.(next);
    setOpen(false);
  }

  const marker = required ? (
    <span aria-hidden="true" className="text-destructive">
      {" "}*
    </span>
  ) : null;

  return (
    <div data-slot="combobox" data-size={size} className={cn("grid gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            id={triggerId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            aria-invalid={status === "error" ? true : undefined}
            aria-required={required || undefined}
            data-status={status}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-xl border text-left outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:focus-halo disabled:pointer-events-none disabled:opacity-40 data-[state=open]:border-ring data-[state=open]:focus-halo",
              size === "default" ? "h-15 border-input bg-input-background pr-1 pl-3" : "h-9 border-border bg-card pr-1.5 pl-3",
              status && statusTrigger[status],
            )}
          >
            {size === "default" ? (
              <span className="grid min-w-0 gap-1">
                <span
                  id={labelId}
                  data-slot="combobox-label"
                  data-status={status}
                  className={cn(
                    "text-foreground-secondary transition-all",
                    floated ? "text-sm leading-4" : "text-base leading-5",
                    status && statusText[status],
                  )}
                >
                  {label}
                  {marker}
                </span>
                {floated ? (
                  <span className={cn("truncate text-base leading-5", selected ? "text-foreground" : "text-muted-foreground")}>
                    {selected?.label ?? placeholder}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <span id={labelId} data-slot="combobox-label" data-status={status} className={cn("text-foreground-secondary", status && statusText[status])}>
                  {label}
                  {marker}
                </span>
                {selected ? (
                  <>
                    <span aria-hidden="true" className="text-xs text-border">
                      │
                    </span>
                    <span className="truncate text-foreground">{selected.label}</span>
                  </>
                ) : null}
              </span>
            )}
            <span className={cn("grid shrink-0 place-items-center rounded-xl text-foreground", size === "default" ? "size-9" : "size-6")}>
              <Icon name="angle-down" size={size === "default" ? "sm" : "xs"} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, ...(option.keywords ?? [])]}
                    disabled={option.disabled}
                    data-checked={option.value === value ? "true" : undefined}
                    onSelect={handleSelect}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      {description ? (
        <p
          id={descriptionId}
          data-slot="combobox-description"
          data-status={status}
          className={cn("text-xs leading-3 text-muted-foreground", status && statusText[status])}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { Combobox, type ComboboxOption, type ComboboxStatus };
```

- [ ] **Step 6: Rodar e confirmar que passa**

Run: `pnpm --filter @gsilisqui/ui exec vitest run src/components/ui/combobox.test.tsx`
Expected: PASS (10 testes). No teste de teclado, o cmdk destaca o primeiro item ao abrir; `ArrowDown` vai para o segundo ("Suporte"). Se a versão instalada não destacar o primeiro automaticamente, ajuste só a sequência de teclas para chegar em "Suporte". Pontos prováveis de ajuste, **sem enfraquecer os testes**:
- Se o cmdk não filtrar por `keywords` na versão instalada, confira a assinatura do `CommandItem` no `.d.ts` do cmdk e corrija a prop.
- Se `getAllByRole("option")` não achar itens, confirme no DOM que o cmdk usa `role="option"` e que o popover abriu (o setup do jsdom precisa de `ResizeObserver` e `scrollIntoView`).
- Se o nome acessível do trigger não bater, verifique se o `aria-labelledby` aponta para o `id` do label.

- [ ] **Step 7: Criar `combobox.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox, type ComboboxOption } from "./combobox";

const departamentos: ComboboxOption[] = [
  { value: "comercial", label: "Comercial" },
  { value: "suporte", label: "Suporte" },
  { value: "financeiro", label: "Financeiro" },
  { value: "logistica", label: "Logística", keywords: ["entregas", "frete"] },
  { value: "rh", label: "Recursos Humanos", keywords: ["rh", "pessoas"] },
  { value: "juridico", label: "Jurídico", disabled: true },
];

const meta = {
  title: "Componentes/Combobox",
  component: Combobox,
  args: { label: "Departamento", options: departamentos, size: "default" },
  argTypes: {
    status: { control: "inline-radio", options: [undefined, "error", "success", "warning"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma (Select): https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=885-3949 · Todo seletor do DS é um Combobox com busca. Seleção múltipla: fase 2.",
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-5">
      <Combobox label="Departamento" options={departamentos} />
      <Combobox label="Departamento" options={departamentos} defaultValue="suporte" />
      <Combobox label="Departamento" options={departamentos} required status="error" description="Escolha um departamento" />
      <Combobox label="Departamento" options={departamentos} disabled />
    </div>
  ),
};

export const TamanhoSM: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-3">
      <Combobox size="sm" label="Departamento" options={departamentos} />
      <Combobox size="sm" label="Departamento" options={departamentos} defaultValue="financeiro" />
    </div>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/ui/popover.tsx packages/ui/src/components/ui/command.tsx packages/ui/src/components/ui/combobox.tsx packages/ui/src/components/ui/combobox.test.tsx packages/ui/src/components/ui/combobox.stories.tsx pnpm-lock.yaml
git commit -m "feat(ui): add Popover, Command and searchable Combobox

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Exports públicos, build e verificação do `dist`

**Files:**
- Modify: `packages/ui/src/index.ts`
- Create: `packages/ui/scripts/compose-css.ts`, `packages/ui/scripts/build-css.ts`
- Test: `packages/ui/test/compose-css.test.ts`, `packages/ui/test/dist.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `test/compose-css.test.ts`

```ts
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
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm --filter @gsilisqui/ui exec vitest run test/compose-css.test.ts`
Expected: FAIL, `Failed to resolve import "../scripts/compose-css"`.

- [ ] **Step 3: Criar `scripts/compose-css.ts`**

```ts
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
```

- [ ] **Step 4: Criar `scripts/build-css.ts`**

```ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { composeDistCss } from "./compose-css";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const src = readFileSync(join(root, "src", "styles.css"), "utf8");
const theme = readFileSync(require.resolve("@opa/tokens/theme.css"), "utf8");

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "styles.css"), composeDistCss(src, theme));
console.log("Gerado: dist/styles.css");
```

- [ ] **Step 5: Rodar o teste do compose**

Run: `pnpm --filter @gsilisqui/ui exec vitest run test/compose-css.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 6: Preencher `src/index.ts`**

```ts
export { Button, buttonVariants } from "./components/ui/button";
export { Combobox, type ComboboxOption, type ComboboxStatus } from "./components/ui/combobox";
export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./components/ui/command";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
export { Icon, type IconName } from "./components/ui/icon";
export { iconNames } from "./components/ui/icon-registry";
export { Input } from "./components/ui/input";
export { InputField, type InputFieldStatus } from "./components/ui/input-field";
export { Label } from "./components/ui/label";
export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./components/ui/popover";
export { Tag, tagVariants } from "./components/ui/tag";
```

- [ ] **Step 7: Escrever o teste do `dist`** — `test/dist.test.ts` (roda depois do build: `turbo` faz `test` depender de `build`)

```ts
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
```

- [ ] **Step 8: Build e testes**

Run: `pnpm --filter @gsilisqui/ui run build && pnpm --filter @gsilisqui/ui run test`
Expected: build sem erros (`dist/index.js`, `dist/components/ui/*.js`, `*.d.ts`, `dist/styles.css`) e todos os testes do pacote passando, incluindo `dist.test.ts`. Leia a saída do build: um aviso `TS2883 … not portable` do vite-plugin-dts significa que um `.d.ts` foi pulado mesmo com exit 0 — trate como erro. Se o `"use client"` sumir de algum arquivo, investigue a opção de diretivas do Rolldown antes de trocar de ferramenta, e registre.

- [ ] **Step 9: Typecheck e lint**

Run: `pnpm --filter @gsilisqui/ui run typecheck && pnpm --filter @gsilisqui/ui run lint`
Expected: sem erros.

- [ ] **Step 10: Commit**

```bash
git add packages/ui/src/index.ts packages/ui/scripts packages/ui/test/compose-css.test.ts packages/ui/test/dist.test.ts
git commit -m "feat(ui): public exports, dist CSS build and dist checks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Lint do DS no monorepo

A regra `opa/no-raw-design-values` passa a valer no próprio repo: nível `ui` em `packages/ui/src` e no Storybook (ferramenta de documentação, com layouts arbitrários), nível `app` nos apps de verificação.

**Files:**
- Modify: `eslint.config.js`

- [ ] **Step 1: Substituir `eslint.config.js`**

```js
import tseslint from "typescript-eslint";
import opa from "./packages/eslint-config/src/index.js";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/generated/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/storybook-static/**",
      "**/.next/**",
      "**/.shadcn/**",
      "**/next-env.d.ts",
    ],
  },
  ...tseslint.configs.recommended,
  ...opa.configs.ui.map((config) => ({ ...config, files: ["packages/ui/src/**/*.{ts,tsx}", "apps/storybook/**/*.{ts,tsx}"] })),
  ...opa.configs.app.map((config) => ({ ...config, files: ["apps/smoke-*/**/*.{ts,tsx}"] })),
);
```

- [ ] **Step 2: Rodar o lint**

Run: `pnpm lint`
Expected: sem erros. Se a regra acusar algo nos componentes, **corrija o componente** (é exatamente o que ela existe para pegar); só relaxe a regra se o caso for um falso positivo documentado no README do `eslint-config`, e registre.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js
git commit -m "chore: enforce DS lint rule on ui and apps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Storybook

**Files:**
- Create: `apps/storybook/package.json`, `apps/storybook/tsconfig.json`, `apps/storybook/.storybook/main.ts`, `apps/storybook/.storybook/preview.tsx`, `apps/storybook/.storybook/vitest.setup.ts`, `apps/storybook/vitest.config.ts`, `apps/storybook/src/styles.css`, `apps/storybook/src/foundations/colors.tsx`, `colors.mdx`, `typography.tsx`, `typography.mdx`, `icons.tsx`, `icons.mdx`, `apps/storybook/src/introduction.mdx`, `apps/storybook/src/changelog.mdx`, `apps/storybook/src/raw.d.ts`

- [ ] **Step 1: Criar `apps/storybook/package.json`**

```json
{
  "name": "storybook",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build -o storybook-static",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  }
}
```

- [ ] **Step 2: Instalar** (com o token exportado)

```bash
export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')"
pnpm --filter storybook add react@^19.3.0 react-dom@^19.3.0 "@opa/ui@workspace:@gsilisqui/ui@*" "@opa/tokens@workspace:@gsilisqui/tokens@*" @fortawesome/pro-regular-svg-icons@^7.3.1 @fortawesome/pro-solid-svg-icons@^7.3.1
pnpm --filter storybook add -D storybook@10.6.0 @storybook/react-vite@10.6.0 @storybook/addon-docs@10.6.0 @storybook/addon-a11y@10.6.0 @storybook/addon-themes@10.6.0 @storybook/addon-vitest@10.6.0 vite@^8.3.1 @vitejs/plugin-react@^6.1.1 tailwindcss@^4.3.3 @tailwindcss/vite@^4.3.3 vitest@4.1.11 @vitest/browser@4.1.11 @vitest/browser-playwright@4.1.11 playwright typescript@~6.0 @types/node @types/react@^19.3.0 @types/react-dom@^19.3.0
pnpm --filter storybook exec playwright install chromium
```
Expected: instalação sem erros. O `addon-vitest` 10.6 exige Vitest 4, por isso a versão fica travada **só neste app**.

- [ ] **Step 3: Criar `apps/storybook/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "types": ["node"],
    "paths": {
      "@/*": ["../../packages/ui/src/*"],
      "@opa/ui": ["../../packages/ui/src/index.ts"]
    }
  },
  "include": ["src", ".storybook", "vitest.config.ts"]
}
```

- [ ] **Step 4: Criar `apps/storybook/.storybook/main.ts`**

```ts
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const uiSrc = fileURLToPath(new URL("../../../packages/ui/src", import.meta.url));

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../src/**/*.mdx", "../../../packages/ui/src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes", "@storybook/addon-vitest"],
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    viteConfig.resolve = {
      ...viteConfig.resolve,
      // Código-fonte do @opa/ui direto (hot reload), sem depender do build.
      alias: { ...(viteConfig.resolve?.alias ?? {}), "@opa/ui": `${uiSrc}/index.ts`, "@": uiSrc },
    };
    return viteConfig;
  },
};

export default config;
```

- [ ] **Step 5: Criar `apps/storybook/src/styles.css`**

```css
@import "tailwindcss";
@import "../../../packages/ui/src/styles.css";
@source "./";
/* A página de Tipografia monta text-${name} em runtime; estas classes precisam existir. */
@source inline("text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl,6xl,7xl,8xl,9xl}");
```

- [ ] **Step 6: Criar `apps/storybook/.storybook/preview.tsx`**

```tsx
import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles.css";

// Exceções de contraste aprovadas pelo dono em 2026-09-29 (ver tabela de decisões do Plano 2):
// Tag info/highlight e textos de campo com status success/warning mantêm as cores do Figma.
// O contraste continua sendo verificado em todos os outros elementos.
const STATUS_TEXT_SLOTS = ["label", "input-field-description", "combobox-label", "combobox-description"];
const CONTRAST_EXCEPTIONS = [
  '[data-slot="tag"][data-variant="info"]',
  '[data-slot="tag"][data-variant="highlight"]',
  ...STATUS_TEXT_SLOTS.flatMap((slot) => ["success", "warning"].map((status) => `[data-slot="${slot}"][data-status="${status}"]`)),
];

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withThemeByClassName({ themes: { Light: "", Dark: "dark" }, defaultTheme: "Light" })],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: {
      test: "error",
      config: {
        rules: [
          {
            id: "color-contrast",
            selector: `*${CONTRAST_EXCEPTIONS.map((s) => `:not(${s}):not(${s} *)`).join("")}`,
          },
        ],
      },
    },
    options: { storySort: { order: ["Introdução", "Fundações", "Componentes", "Changelog"] } },
  },
};

export default preview;
```

- [ ] **Step 7: Criar `apps/storybook/.storybook/vitest.setup.ts` e `apps/storybook/vitest.config.ts`**

`vitest.setup.ts`:
```ts
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
```

`vitest.config.ts`:
```ts
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [storybookTest({ configDir: fileURLToPath(new URL("./.storybook", import.meta.url)) })],
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
    setupFiles: ["./.storybook/vitest.setup.ts"],
  },
});
```

Se a API do `addon-vitest` 10.6 for diferente (nomes de export, opções), rode `pnpm --filter storybook exec storybook add @storybook/addon-vitest` num branch descartável, compare os arquivos que ele gera e adote o formato gerado. Registre a diferença.

- [ ] **Step 8: Criar as Fundações**

`apps/storybook/src/foundations/colors.tsx`:
```tsx
import { useEffect, useRef, useState } from "react";
import component from "@opa/tokens/json/component";
import primitives from "@opa/tokens/json/primitives";
import light from "@opa/tokens/json/semantic.light";

type PrimitiveFile = { color: Record<string, Record<string, { $value: string }> | string> };

// Única exceção consciente à regra opa/no-raw-design-values: esta página existe para MOSTRAR a paleta crua.
// A cor passa por função (a regra só inspeciona objetos literais em style), deixando a exceção explícita aqui.
const rawSwatch = (hex: string) => ({ background: hex });

/** Paleta crua (camada 1): só para consulta. Componentes e telas usam os semânticos. */
export function Palette() {
  const groups = Object.entries((primitives as unknown as PrimitiveFile).color).filter(
    ([key]) => !key.startsWith("$"),
  ) as [string, Record<string, { $value: string }>][];
  return (
    <div className="grid gap-4 text-foreground">
      {groups.map(([group, steps]) => (
        <div key={group} className="grid gap-1">
          <code className="text-sm">{group}</code>
          <div className="flex flex-wrap gap-1">
            {Object.entries(steps)
              .filter(([step]) => !step.startsWith("$"))
              .map(([step, token]) => (
                <div key={step} className="grid w-16 gap-1">
                  <span className="h-10 rounded-md border border-border" style={rawSwatch(token.$value)} />
                  <span className="font-mono text-xs text-muted-foreground">{step}</span>
                  <span className="font-mono text-xs text-muted-foreground">{token.$value}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type TokenFile = { color: Record<string, unknown> };
const names = (file: TokenFile) => Object.keys(file.color).filter((key) => !key.startsWith("$"));

function Swatch({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(`--${name}`).trim());
  }, [name]);
  return (
    <div className="flex items-center gap-3">
      <span ref={ref} className="size-8 shrink-0 rounded-lg border border-border" style={{ background: `var(--${name})` }} />
      <code className="text-sm text-foreground">{name}</code>
      <span className="ml-auto font-mono text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

export function SemanticColors() {
  const all = [...names(light as TokenFile), ...names(component as TokenFile)];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        ["Light", ""],
        ["Dark", "dark"],
      ].map(([title, mode]) => (
        <div key={title} className={`${mode} rounded-xl border border-border bg-background p-4 text-foreground`}>
          <p className="mb-3 text-sm text-muted-foreground">{title}</p>
          <div className="grid gap-2">
            {all.map((name) => (
              <Swatch key={name} name={name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

`apps/storybook/src/foundations/colors.mdx`:
```mdx
import { Meta } from "@storybook/addon-docs/blocks";
import { Palette, SemanticColors } from "./colors";

<Meta title="Fundações/Cores" />

# Cores

Use sempre os **tokens semânticos** (`bg-primary`, `text-foreground-secondary`, `border-border`). Cores cruas (`--opa-*`), hex e a paleta padrão do Tailwind são bloqueadas pelo lint `opa/no-raw-design-values`.

Fonte: `packages/tokens/src/*.json`. Os valores abaixo são lidos do CSS em tempo real.

## Semânticos e componente

<SemanticColors />

## Paleta (primitivos)

Só para consulta: a família `-dark` guarda os valores do modo Dark. Nunca use estas cores direto.

<Palette />
```

`apps/storybook/src/changelog.mdx`:
```mdx
import { Markdown, Meta } from "@storybook/addon-docs/blocks";
import eslintChangelog from "../../../packages/eslint-config/CHANGELOG.md?raw";
import tokensChangelog from "../../../packages/tokens/CHANGELOG.md?raw";

<Meta title="Changelog" />

# Changelog

Versões publicadas: https://github.com/GSilisqui/opa-design-system/releases

<Markdown>{tokensChangelog}</Markdown>

<Markdown>{eslintChangelog}</Markdown>
```

`apps/storybook/src/raw.d.ts`:
```ts
declare module "*?raw" {
  const content: string;
  export default content;
}
```

> O `packages/ui/CHANGELOG.md` só existe depois do primeiro release do `@gsilisqui/ui`. Quando existir, acrescente o import e o bloco dele na página de Changelog.

`apps/storybook/src/foundations/typography.tsx`:
```tsx
import typography from "@opa/tokens/json/typography";

type TypographyFile = { text: Record<string, { size: { $value: string }; "line-height": { $value: string } } | string> };

export function TypeScale() {
  const text = (typography as unknown as TypographyFile).text;
  const sizes = Object.entries(text).filter(([key]) => !key.startsWith("$")) as [string, { size: { $value: string }; "line-height": { $value: string } }][];
  return (
    <div className="grid gap-3 text-foreground">
      {sizes.map(([name, value]) => (
        <div key={name} className="grid grid-cols-[120px_160px_1fr] items-baseline gap-4 border-b border-border pb-3">
          <code className="text-sm">text-{name}</code>
          <span className="font-mono text-xs text-muted-foreground">
            {value.size.$value} / {value["line-height"].$value}
          </span>
          <span className={`text-${name} truncate`}>Olá, como posso ajudar?</span>
        </div>
      ))}
    </div>
  );
}
```

> As classes `text-${name}` montadas em runtime existem graças ao `@source inline(...)` do Step 5.

`apps/storybook/src/foundations/typography.mdx`:
```mdx
import { Meta } from "@storybook/addon-docs/blocks";
import { TypeScale } from "./typography";

<Meta title="Fundações/Tipografia" />

# Tipografia

Inter em todo o texto, JetBrains Mono (`font-mono`) para código. Os nomes seguem o Tailwind, mas os tamanhos são os do Figma: **`text-sm` = 12px** e **`text-base` = 14px**. Pesos: `font-normal` (Regular), `font-medium` e `font-bold`; não há Semi Bold.

<TypeScale />
```

`apps/storybook/src/foundations/icons.tsx`:
```tsx
import { useMemo, useState } from "react";
import { Icon, iconNames, Input } from "@opa/ui";

export function IconGallery() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const visible = useMemo(() => iconNames.filter((name) => name.includes(query.trim().toLowerCase())), [query]);

  async function copy(name: string) {
    const snippet = `<Icon name="${name}" />`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(name);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="grid gap-4 text-foreground">
      <Input aria-label="Buscar ícone" placeholder="Buscar ícone…" value={query} onChange={(event) => setQuery(event.target.value)} className="max-w-sm" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
        {visible.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => copy(name)}
            className="grid justify-items-center gap-2 rounded-xl border border-border bg-card p-3 text-sm outline-none hover:bg-accent focus-visible:focus-ring"
          >
            <span className="flex gap-3 text-lg">
              <Icon name={name} />
              <Icon name={name} variant="solid" />
            </span>
            <code>{copied === name ? "copiado" : name}</code>
          </button>
        ))}
      </div>
    </div>
  );
}
```

`apps/storybook/src/foundations/icons.mdx`:
```mdx
import { Meta } from "@storybook/addon-docs/blocks";
import { IconGallery } from "./icons";

<Meta title="Fundações/Ícones" />

# Ícones

Font Awesome 7 Pro. **Regular** é o padrão; **solid** para estados ativos/selecionados (`variant="solid"`). Clique para copiar o código.

Para adicionar um ícone: inclua o regular e o solid em `packages/ui/src/components/ui/icon-registry.ts` (o teste do registro garante os dois).

<IconGallery />
```

`apps/storybook/src/introduction.mdx`:
~~~mdx
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Introdução" />

# OPA Design System

Componentes do produto, baseados em Shadcn/Radix e no Figma "Component Library".

```bash
pnpm add @opa/ui@npm:@gsilisqui/ui
```

```css
/* globals.css */
@import "tailwindcss";
@import "@opa/ui/styles.css";
```

```tsx
import { Button, Icon } from "@opa/ui";
```

Regras: use só componentes do DS e tokens semânticos. Precisa de algo que não existe? Procure no Shadcn/Radix e proponha a entrada no DS. Nada é criado do zero sem aprovação.
~~~

- [ ] **Step 9: Rodar o Storybook e os testes**

Run: `pnpm --filter storybook run build && pnpm --filter storybook run test`
Expected: build gera `apps/storybook/storybook-static` com uma página **Docs** por componente (autodocs, com o link do Figma); os testes rodam todas as stories no Chromium, sem violações de acessibilidade. Violação real → **corrija o componente ou a story** (ex.: `aria-label` faltando), não desligue a regra. As únicas exceções são as de `CONTRAST_EXCEPTIONS` no `preview.tsx`. Se o axe não aceitar o seletor composto com `:not(...)`, troque pela desativação `color-contrast` **só nas stories** que mostram esses elementos, citando a decisão, e registre. Contraste do `destructive` no Dark (decisão de tokens 7) não é testado porque as stories rodam no tema Light.

- [ ] **Step 10: Conferir visualmente** (opcional, se o executor tiver navegador)

Run: `pnpm --filter storybook run dev`, abra `http://localhost:6006` e alterne Light/Dark na barra.

- [ ] **Step 11: Commit**

```bash
git add apps/storybook pnpm-lock.yaml
git commit -m "feat(storybook): docs app with foundations, themes and a11y tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Apps de verificação (Vite e Next.js)

Provam, com o `dist` real: o CSS gera os utilitários, as fontes são emitidas (achado do review do Plano 1: com o Tailwind CLI elas quebram, com Vite/Next não) e o `"use client"` funciona no App Router.

**Files:**
- Create: `apps/smoke-vite/{package.json,index.html,vite.config.ts,tsconfig.json,src/main.tsx,src/App.tsx,src/index.css,scripts/assert-build.mjs}`
- Create: `apps/smoke-next/{package.json,next.config.ts,postcss.config.mjs,tsconfig.json,app/layout.tsx,app/page.tsx,app/globals.css,scripts/assert-build.mjs}`

- [ ] **Step 1: `apps/smoke-vite/package.json`**

```json
{
  "name": "smoke-vite",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build && node scripts/assert-build.mjs",
    "lint": "eslint ."
  }
}
```

Instale (com o token exportado):
```bash
pnpm --filter smoke-vite add react@^19.3.0 react-dom@^19.3.0 "@opa/ui@workspace:@gsilisqui/ui@*" @fortawesome/pro-regular-svg-icons@^7.3.1 @fortawesome/pro-solid-svg-icons@^7.3.1
pnpm --filter smoke-vite add -D vite@^8.3.1 @vitejs/plugin-react@^6.1.1 tailwindcss@^4.3.3 @tailwindcss/vite@^4.3.3 typescript@~6.0 @types/react@^19.3.0 @types/react-dom@^19.3.0
```

- [ ] **Step 2: Arquivos do `smoke-vite`**

`vite.config.ts`:
```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [react(), tailwindcss()] });
```

`tsconfig.json`:
```json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "noEmit": true }, "include": ["src", "vite.config.ts"] }
```

`index.html`:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Smoke Vite · @opa/ui</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/index.css`:
```css
@import "tailwindcss";
@import "@opa/ui/styles.css";
```

`src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx`:
```tsx
import { Button, Combobox, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Icon, InputField, Tag } from "@opa/ui";

export function App() {
  return (
    <main className="grid max-w-md gap-4 p-8">
      <Button>
        <Icon name="plus" />
        Novo contato
      </Button>
      <Tag variant="info">Novo</Tag>
      <InputField label="Nome" />
      <Combobox label="Departamento" options={[{ value: "suporte", label: "Suporte" }]} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="neutral">Abrir</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título</DialogTitle>
            <DialogDescription>Descrição</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
```

`scripts/assert-build.mjs`:
```js
import { readdirSync, readFileSync } from "node:fs";

const assets = readdirSync("dist/assets");
const css = assets.filter((f) => f.endsWith(".css")).map((f) => readFileSync(`dist/assets/${f}`, "utf8")).join("\n");

const checks = [
  ["utilitário semântico .bg-primary", /\.bg-primary\{/.test(css)],
  ["variáveis do tema (--primary)", css.includes("--primary:")],
  ["foco do DS (focus-ring)", css.includes("focus-visible\\:focus-ring")],
  ["hover do DS (bg-shade-primary)", css.includes("bg-shade-primary")],
  ["fontes Inter emitidas", assets.some((f) => /inter.*\.woff2$/i.test(f))],
  ["nenhum @import pendente", !/@import/.test(css)],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? "✓" : "✗"} ${name}`);
if (failed.length) process.exit(1);
```

- [ ] **Step 3: `apps/smoke-next/package.json`**

```json
{
  "name": "smoke-next",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "next build && node scripts/assert-build.mjs",
    "lint": "eslint ."
  }
}
```

Instale (com o token exportado):
```bash
pnpm --filter smoke-next add next@^16.3.7 react@^19.3.0 react-dom@^19.3.0 "@opa/ui@workspace:@gsilisqui/ui@*" @fortawesome/pro-regular-svg-icons@^7.3.1 @fortawesome/pro-solid-svg-icons@^7.3.1
pnpm --filter smoke-next add -D tailwindcss@^4.3.3 @tailwindcss/postcss@^4.3.3 typescript@~6.0 @types/react@^19.3.0 @types/react-dom@^19.3.0 @types/node
```

- [ ] **Step 4: Arquivos do `smoke-next`**

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const config: NextConfig = {};
export default config;
```

`postcss.config.mjs`:
```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`tsconfig.json` (já na forma que o `next build` reescreveria, para não gerar diff):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Se depois do primeiro `next build` o `git diff` mostrar mudanças no `tsconfig.json`, commite a versão que o Next gerou.

`app/globals.css`:
```css
@import "tailwindcss";
@import "@opa/ui/styles.css";
```

`app/layout.tsx`:
```tsx
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Smoke Next · @opa/ui" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx` (Server Component de propósito: se algum componente perder o `"use client"`, o `next build` falha):
```tsx
import { Button, Combobox, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Icon, InputField, Tag } from "@opa/ui";

export default function Page() {
  return (
    <main className="grid max-w-md gap-4 p-8">
      <Button>
        <Icon name="plus" />
        Novo contato
      </Button>
      <Tag variant="info">Novo</Tag>
      <InputField label="Nome" />
      <Combobox label="Departamento" options={[{ value: "suporte", label: "Suporte" }]} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="neutral">Abrir</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título</DialogTitle>
            <DialogDescription>Descrição</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
```

`scripts/assert-build.mjs`:
```js
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const files = walk(".next/static");
const css = files.filter((f) => f.endsWith(".css")).map((f) => readFileSync(f, "utf8")).join("\n");

const checks = [
  ["utilitário semântico .bg-primary", /\.bg-primary\{/.test(css)],
  ["variáveis do tema (--primary)", css.includes("--primary:")],
  ["foco do DS (focus-ring)", css.includes("focus-visible\\:focus-ring")],
  ["fontes emitidas (.woff2)", files.some((f) => f.endsWith(".woff2"))],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? "✓" : "✗"} ${name}`);
if (failed.length) process.exit(1);
```

- [ ] **Step 5: Rodar os dois builds** (o `turbo` builda `@gsilisqui/ui` antes)

Run: `pnpm turbo run build --filter=smoke-vite --filter=smoke-next`
Expected: os dois terminam com todas as linhas `✓`. Se o Next reclamar de hook/contexto num Server Component, algum arquivo perdeu o `"use client"` no `dist`: volte à Task 9. Se as fontes não forem emitidas, **pare e reporte** (é o risco levantado no Plano 1).

- [ ] **Step 6: Commit**

```bash
git add apps/smoke-vite apps/smoke-next pnpm-lock.yaml
git commit -m "test: smoke apps build @opa/ui in Vite and Next.js

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: CI, changeset e documentação

**Files:**
- Modify: `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `README.md`
- Create: `.changeset/ui-initial-release.md`, `packages/ui/README.md`

- [ ] **Step 1: `ci.yml` e `release.yml`**

Nos dois workflows, no job, acrescente o token do FA (o `.npmrc` da raiz lê a variável):
```yaml
    env:
      FONTAWESOME_PACKAGE_TOKEN: ${{ secrets.FONTAWESOME_PACKAGE_TOKEN }}
```
E, logo depois de `pnpm install --frozen-lockfile`, instale o Chromium dos testes do Storybook:
```yaml
      - run: pnpm --filter storybook exec playwright install --with-deps chromium
```

- [ ] **Step 2: `.changeset/ui-initial-release.md`**

```md
---
"@gsilisqui/ui": minor
---

Primeira versão do @opa/ui: Icon (Font Awesome Pro), Button, Input, InputField, Label, Tag, Dialog, Popover, Command e Combobox, com CSS do DS (foco, hover, sombras) e tema embutido.
```

- [ ] **Step 3: `packages/ui/README.md`**

````md
# @opa/ui

Componentes do OPA Design System (Shadcn/Radix), publicados como `@gsilisqui/ui`.

## Instalar

`.npmrc` do projeto:
```
@gsilisqui:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=${FONTAWESOME_PACKAGE_TOKEN}
```

```bash
pnpm add @opa/ui@npm:@gsilisqui/ui @fortawesome/pro-regular-svg-icons @fortawesome/pro-solid-svg-icons
```

`GITHUB_TOKEN`: PAT com `read:packages`. `FONTAWESOME_PACKAGE_TOKEN`: token npm da conta Font Awesome Pro.

## Usar

```css
/* globals.css — Next.js (@tailwindcss/postcss) ou Vite (@tailwindcss/vite) */
@import "tailwindcss";
@import "@opa/ui/styles.css";
```

```tsx
import { Button, Icon } from "@opa/ui";

<Button variant="neutral">
  <Icon name="plus" />
  Novo contato
</Button>;
```

Dark mode: coloque a classe `dark` no `<html>`.

## Componentes

| Componente | Figma | Notas |
|---|---|---|
| `Icon` | — | Font Awesome 7 Pro, `variant="regular" \| "solid"` |
| `Button` | Button `36:2938` | `primary`, `destructive`, `neutral`, `quiet`, `outline`, `destructive-quiet`, `success-quiet` · `sm`, `default`, `lg`, `icon-sm`, `icon`, `icon-lg` |
| `InputField` / `Input` / `Label` | Input Field `885:5165` | `InputField` tem label flutuante (`default`) ou inline (`sm`) |
| `Tag` | Chip `304:4496` | 7 variantes, `onRemove` |
| `Dialog` | Modal `6377:1529` | `showCloseButton` opcional |
| `Combobox` | Select `885:3949` | Seleção única com busca |

Documentação completa: Storybook (`pnpm --filter storybook dev`).

## Desenvolvimento

- Componentes em `src/components/ui/` (layout do Shadcn), com teste e story ao lado.
- `pnpm --filter @gsilisqui/ui test` · `build` · `typecheck`.
- Novo ícone: `src/components/ui/icon-registry.ts` (regular + solid).
- Nunca crie componente do zero sem aprovação: primeiro procure no Shadcn/Radix.
````

- [ ] **Step 4: README da raiz** — acrescente a linha na tabela de pacotes:

```md
| `@opa/ui` | `@gsilisqui/ui` | Componentes (Shadcn/Radix + Font Awesome Pro). Ver `packages/ui/README.md` |
```

- [ ] **Step 5: Rodar tudo**

Run: `pnpm verify`
Expected: `Tokens em dia.` e o turbo verde em todos os pacotes e apps: tokens, eslint-config, ui (unit + CSS + dist), storybook (build + a11y), smoke-vite, smoke-next.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows .changeset/ui-initial-release.md packages/ui/README.md README.md
git commit -m "ci: Font Awesome token and Storybook browser tests; docs for @opa/ui

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Publicar o Storybook na Vercel (**checkpoint do dono**, opcional)

Deploy é ação externa e usa a conta do dono. **Pergunte antes.** Instruções para ele:

1. Em vercel.com → **Add New… → Project** → importar `GSilisqui/opa-design-system`.
2. **Root Directory:** `apps/storybook`. **Framework:** Other.
3. **Build Command:** `cd ../.. && pnpm turbo run build --filter=storybook`. **Output Directory:** `storybook-static`. **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`.
4. **Environment Variables:** `FONTAWESOME_PACKAGE_TOKEN` (mesmo valor do GitHub).
5. Deploy. Cada PR ganha uma URL de preview.

Depois do primeiro deploy, registre a URL no `README.md` da raiz e no `packages/ui/README.md`, e commite (`docs: link Storybook`).

---

## Critérios de pronto do Plano 2

- `pnpm verify` verde localmente e no CI.
- `@opa/ui` com os componentes do piloto, testes unitários, story por componente e **zero violações de acessibilidade** nas stories (exceções só onde o dono aprovou contraste menor, documentadas).
- `dist`: `"use client"` onde precisa, ícones Pro externos, tipos gerados, `styles.css` com tema embutido.
- Apps Vite e Next compilam consumindo o `dist`, com fontes emitidas.
- Storybook com Fundações (Cores, Tipografia, Ícones) e tema Light/Dark.
- Changeset do `@gsilisqui/ui` pronto para o próximo "Version Packages".
