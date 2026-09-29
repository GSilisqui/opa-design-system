# @gsilisqui/eslint-config

Regra `opa/no-raw-design-values` do OPA Design System (Regra 2 do spec). Importe como `@opa/eslint-config`.

## Uso

```js
// eslint.config.js
import tseslint from "typescript-eslint";
import opa from "@opa/eslint-config";

export default [
  ...tseslint.configs.recommended, // parser TypeScript (necessário para .ts/.tsx)
  ...opa.configs.app, // ou opa.configs.ui em packages/ui
];
```

As configs se aplicam a `**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}` e ativam JSX no parser padrão. Para `.ts`/`.tsx`
é preciso registrar o parser do `typescript-eslint` (o pacote não o traz como dependência).

## `ui` vs `app`

- `ui` (`allowArbitraryValues: true`): para `packages/ui`, onde o código vindo do Shadcn usa valores arbitrários.
- `app` (`allowArbitraryValues: false`): para produto e protótipos; só a escala do Tailwind e tokens semânticos.

Opção extra `callees`: nomes adicionais de funções analisadas (somam-se a `cn`, `clsx`, `cx`, `cva`, `twMerge`, `tv`, `twJoin`).

## Problemas reportados

| Id | Significado | `ui` | `app` |
|---|---|---|---|
| `primitive` | uso de `--opa-*` (ex.: `text-(--opa-brand-600)`) | erro | erro |
| `rawColor` | cor fixa (`bg-[#fff]`, `rgba(...)`, `style={{ color: "red" }}`) | erro | erro |
| `palette` | paleta padrão do Tailwind (`bg-blue-500`) | erro | erro |
| `arbitraryValue` | valor arbitrário (`p-[13px]`, `bg-(color:--x)`) | permitido | erro |

Variantes arbitrárias (`has-[>svg]:px-3`, `[&_svg]:size-4`) são sempre permitidas.
Em `style`, palavras-chave `transparent`, `currentColor`, `inherit`, `initial`, `unset` e `none` são permitidas.

## Limites conhecidos

- Chamadas por membro (`utils.cn(...)`), template tagueado e classes guardadas em variáveis não são analisadas.
- `color-mix()` e `hsl(var(--x))` dentro de valores arbitrários são reportados como `rawColor`.
- Cores nomeadas em `style` só são checadas em propriedades cujo nome contém color, background, fill, stroke, border, outline ou shadow.
