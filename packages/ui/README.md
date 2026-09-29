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
| `Button` | Button `10:1010` | `primary`, `destructive`, `neutral`, `quiet`, `outline`, `destructive-quiet`, `success-quiet` · `size`: `sm`, `default`, `lg` · `layout`: `default`, `icon-only` |
| `InputField` / `Input` / `Label` | InputField `11:138` · Input `11:154` | `InputField` tem label flutuante (`default`) ou inline (`sm`) |
| `Tag` | Tag `11:253` | 7 variantes, `onRemove` |
| `Dialog` | Dialog `11:357` | `showCloseButton` opcional |
| `Combobox` | Combobox `12:127` | Seleção única com busca |

Documentação completa: Storybook (`pnpm --filter opa-storybook dev`).

## Desenvolvimento

- Componentes em `src/components/ui/` (layout do Shadcn), com teste e story ao lado.
- `pnpm --filter @gsilisqui/ui test` · `build` · `typecheck`.
- Novo ícone: `src/components/ui/icon-registry.ts` (regular + solid).
- Nunca crie componente do zero sem aprovação: primeiro procure no Shadcn/Radix.
