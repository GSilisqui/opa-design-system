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

- Localmente, `GITHUB_TOKEN` é um Personal Access Token (classic) com o escopo `read:packages`.
- No CI de outro repositório, o `GITHUB_TOKEN` do Actions só instala os pacotes depois que aquele repositório for liberado em *Package settings → Manage Actions access* de cada pacote.

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

As fontes (Inter e JetBrains Mono) vêm junto e funcionam com **Vite** (`@tailwindcss/vite`) e **Next.js** (`@tailwindcss/postcss`). O `@tailwindcss/cli` não reescreve os caminhos das fontes; nesse caso, carregue as fontes por conta própria.

`eslint.config.js`:
```js
import tseslint from "typescript-eslint";
import opa from "@opa/eslint-config";

export default tseslint.config(...tseslint.configs.recommended, ...opa.configs.app);
```

Detalhes das configs e da regra: `packages/eslint-config/README.md`.

## Desenvolvimento

```bash
pnpm install
pnpm verify      # o mesmo que o CI roda
pnpm changeset   # descrever a mudança para o próximo release
```
