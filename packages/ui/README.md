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
pnpm add @opa/ui@npm:@gsilisqui/ui @fortawesome/pro-regular-svg-icons @fortawesome/pro-solid-svg-icons @fortawesome/free-brands-svg-icons
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

Requisitos: Tailwind CSS v4 e `"moduleResolution": "bundler"` no `tsconfig` (padrão de Vite e Next.js). Os `.d.ts` usam imports relativos sem extensão, então `node16`/`nodenext` não resolvem os tipos. Para estender componentes, use o `cn` do DS (`import { cn } from "@opa/ui"`): ele conhece `shadow-popover`, `focus-ring` e afins.

## Componentes

| Componente | Figma | Notas |
|---|---|---|
| `Icon` | — | Font Awesome 7 Pro, `variant="regular" \| "solid"` |
| `Button` | Button `10:1010` | `primary`, `destructive`, `neutral`, `quiet`, `outline`, `destructive-quiet`, `success-quiet` · `size`: `sm`, `default`, `lg` · `layout`: `default`, `icon-only` |
| `InputField` / `Input` / `Label` | InputField `11:138` · Input `11:154` | `InputField` tem label flutuante (`default`) ou inline (`sm`) |
| `Tag` | Tag `11:253` | 7 variantes, `onRemove` |
| `Dialog` | Dialog `11:357` | `showCloseButton` opcional |
| `Combobox` | Combobox `12:127` | Seleção única com busca |
| `Calendar` | Calendar `56:269` · Calendar Day `55:45` | Data única e período, pt-BR; dia em primary, meio do período em primary-subtle |
| `DatePicker` / `DateRangePicker` | DatePicker `54:41` · DateRangePicker `54:157` | Campo `default`/`sm`; período com `presets` (coluna de atalhos) |
| `Form` | — (sem componente próprio) | react-hook-form + zod |
| `Tabs` | Tabs `73:232` · Tab `73:163` | `segmented` \| `underline`; `default` (36px) \| `sm` (24px); aba só com ícone |
| `Toaster` / `toast` | Toast `75:153` | Sonner: ícone só nos tipos, ação Outline pequena, canto inferior direito |
| `Tooltip` | Tooltip `72:3` | Compacto, cor inversa, `text-sm`, sem seta |
| `Pagination` | Pagination `80:97` | Composição do DS: resumo + "Página X de Y" + primeira/anterior/próxima/última |
| `DropdownMenu` | Dropdown Menu `82:62` · Dropdown Item `82:45` | Menu de ações: itens de 36px, atalho, destrutivo, marcar/opção, submenu |
| `Sheet` | Sheet `84:108` | Painel lateral no estilo do Dialog v2 (`side`: right, left, top, bottom) |
| `Breadcrumb` | Breadcrumb `85:48` · Breadcrumb Item `85:20` | Trilha com página atual em medium; colapso com `…` + DropdownMenu |
| `Checkbox` | Checkbox `46:115` | `size`: `default` (20px), `sm` (16px); `checked="indeterminate"` |
| `RadioGroup` / `RadioGroupItem` | RadioGroupItem `47:27` | Itens de 20px ou 16px (`sm`) |
| `Switch` | Switch `47:72` | 36×20px ou 28×16px (`sm`) |
| `Textarea` / `TextareaField` | Textarea `47:103` · TextareaField `62:24` | `Textarea` = caixa clara; `TextareaField` = padrão do InputField (default: caixa escura + label flutuante; sm: clara) |
| `Card` | — (Figma na Fase 4) | Quadro `bg-card` com borda e raio 12; Header, Title, Description, Action, Content, Footer |
| `Avatar` | — (Figma na Fase 4) | Quadrado arredondado; `size`: sm 24, default 36, lg 48, xl 60, 2xl 96; `AvatarGroup` |
| `Skeleton` | — (Figma na Fase 4) | Bloco `accent` que pulsa |
| `Separator` | — (Figma na Fase 4) | Linha de 1px, horizontal ou vertical |
| `Accordion` | — (Figma na Fase 4) | Itens com seta; `single` ou `multiple` |
| `ScrollArea` | — (Figma na Fase 4) | Faixa de 14px com setas; vertical ou horizontal |

Documentação completa: Storybook (`pnpm --filter opa-storybook dev`).

## Desenvolvimento

- Componentes em `src/components/ui/` (layout do Shadcn), com teste e story ao lado.
- `pnpm --filter @gsilisqui/ui test` · `build` · `typecheck`.
- Novo ícone: `src/components/ui/icon-registry.ts` (regular + solid).
- Nunca crie componente do zero sem aprovação: primeiro procure no Shadcn/Radix.
