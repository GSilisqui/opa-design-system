# CLAUDE.md — protótipo com o OPA Design System

> Modelo para copiar na raiz de um repositório de protótipo (ex.: `opa-desk`, Vite + React + Tailwind v4).
> Ajuste o nome do projeto e as versões. Fonte: `docs/prototype-CLAUDE.md` do repositório `GSilisqui/opa-design-system`.

Este protótipo usa o **OPA Design System** (`@opa/ui`, `@opa/tokens`, `@opa/eslint-config`). Toda interface é montada
com os componentes e tokens do DS. Escreva textos e documentação em português (BR).

## Regras invioláveis

1. **Só componentes do `@opa/ui` e classes com tokens semânticos** (`bg-primary`, `text-foreground`, `border-border`…).
2. **Antes de construir UI, consulte o que o DS oferece:** `manifest/components.json` no repositório do DS
   (componentes, props, valores, ícones, tokens) ou o Storybook do DS. Use o componente existente com as props do manifesto.
3. **Faltou componente → procure no Shadcn/Radix** e peça ao dono do DS para incluí-lo no `@opa/ui` (skill `add-component`
   no repositório do DS). Não copie componentes do Shadcn para dentro do protótipo.
4. **NUNCA crie componente do zero sem avisar e obter aprovação explícita do dono do DS.** Pare, explique por que
   Shadcn/Radix não resolve e espere a resposta.
5. **Proibido MUI e qualquer outra biblioteca de componentes ou de ícones** (Lucide, Heroicons, react-icons…).
   Ícones só via `<Icon>` do `@opa/ui` (Font Awesome Pro). Ícone que não existe no DS → peça a inclusão.
6. **Proibido:** cores arbitrárias (`bg-[#3b35c9]`, `rgb()`, `hsl()`, `oklch()`, `style={{ color }}`), primitivos
   `var(--opa-*)`, paleta padrão do Tailwind (`bg-blue-500`) e **valores arbitrários de espaçamento/tamanho**
   (`p-[13px]`, `w-[372px]`). Use a escala do Tailwind (`p-3`, `gap-1.5`, `w-96`). O lint (`opa.configs.app`) bloqueia isso.

## Instalação

`.npmrc` na raiz do protótipo:

```ini
@gsilisqui:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=${FONTAWESOME_PACKAGE_TOKEN}
```

- `GITHUB_TOKEN`: Personal Access Token (classic) com `read:packages`.
- `FONTAWESOME_PACKAGE_TOKEN`: token npm da conta Font Awesome Pro. **Nunca** imprima nem commite tokens.
  No Windows, se a variável estiver só no ambiente do usuário, exporte-a no Git Bash antes do `pnpm install`:
  `export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')"`

Dependências (alias npm: o import continua `@opa/*`):

```bash
pnpm add @opa/ui@npm:@gsilisqui/ui@^0.1.0 @fortawesome/pro-regular-svg-icons @fortawesome/pro-solid-svg-icons
pnpm add -D @opa/eslint-config@npm:@gsilisqui/eslint-config@^0.1.0 tailwindcss @tailwindcss/vite
```

`vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [react(), tailwindcss()] });
```

CSS global (ex.: `src/index.css`):

```css
@import "tailwindcss";
@import "@opa/ui/styles.css"; /* tema do DS, fontes Inter/JetBrains Mono e utilitários (focus-ring, shadow-popover…) */
```

`eslint.config.js`:

```js
import tseslint from "typescript-eslint";
import opa from "@opa/eslint-config";

export default tseslint.config(...tseslint.configs.recommended, ...opa.configs.app);
```

## Uso

```tsx
import { Button, Combobox, Icon, InputField, Tag } from "@opa/ui";

<Button variant="primary" size="default">
  <Icon name="plus" />
  Novo atendimento
</Button>;
```

- Variantes e tamanhos: exatamente os do manifesto (ex.: Button `primary | destructive | neutral | quiet | outline |
  destructive-quiet | success-quiet`; `sm | default | lg | icon-sm | icon | icon-lg`). Botão só com ícone precisa de `aria-label`.
- Ícones: `<Icon name="…" />` (regular) e `variant="solid"` para estados ativos/selecionados.
- Dark mode: classe `dark` no `<html>`.
- Tipografia com nomes do Figma: `text-sm`=12px, `text-base`=14px, `text-lg`=16px; pesos `font-normal | font-medium | font-bold`.
- Layout livre com utilitários do Tailwind (flex, grid, gap, padding da escala) é permitido; o que tiver cara de
  componente reutilizável (card, badge, lista com ação…) passa pela regra 3/4.

## Verificação

- `pnpm lint` sem erros (regra `opa/no-raw-design-values`).
- Nada importado de `@mui/*`, `lucide-react` ou outras bibliotecas de ícones/componentes.
