# OPA Design System — Design

- **Data:** 2026-09-29
- **Status:** Aprovado em brainstorming, aguardando revisão do spec
- **Autor:** Gabriel Silisqui (com Claude)

## 1. Contexto e problema

Os componentes da plataforma são reconstruídos a cada demanda, sem padronização. Consequências: inconsistência visual, muita revisão de UX por demanda e retrabalho de desenvolvimento.

Existe uma base visual no Figma (arquivo "Component Library", `7FS6JptRPLnco6VSAEAOAH`) com componentes parcialmente estruturados (ex.: Button com variantes, estados e página de documentação), paletas de cor Light/Dark e estilos de texto. Existem também outras bibliotecas na organização ("Biblioteca de componentes - Nova", "Produ2", "Service Components"), nenhuma consolidada.

## 2. Objetivos

1. Um Design System único, baseado em **Shadcn/Radix UI**, consumido pelo produto oficial como pacote versionado.
2. Estrutura de tokens **nova, feita do zero**, espelhada 1:1 entre código e Figma.
3. Documentação para desenvolvimento em **Storybook**.
4. Biblioteca no **Figma** com a mesma qualidade do código: variáveis ligadas e propriedades iguais às props.
5. Repositório **fácil de consumir pelo Claude**: para montar telas no Figma (uso principal do designer) e para gerar protótipos em código (casos com muitas microinterações, ex.: `opa-desk`).

## 3. Não-objetivos (v1)

- Site editorial de diretrizes de UX (fica no Figma; ZeroHeight ou similar no futuro).
- Registry npm oficial `@opa/*` (entra com a migração para GitLab).
- Code Connect do Figma (não disponível no plano Professional).
- Componentes fora do Shadcn/Radix (ex.: Lottie). Cada um exige aprovação explícita do dono do DS.
- Migração do produto oficial para o DS (é consumo, não faz parte deste projeto).

## 4. Regras invioláveis

1. Todo componente vem do **Shadcn/Radix** (`shadcn add` → customização). **Criar do zero só com aviso e aprovação explícita** do dono do DS.
2. Componentes e telas **só usam tokens semânticos**. Primitivos e valores arbitrários (`bg-[#...]`, `p-[13px]`) são proibidos fora de `packages/tokens`.
3. Toda variante existe **no Figma e no código**, com o mesmo nome, registrada no manifesto.
4. Ícones **somente Font Awesome Pro** (e SVGs próprios via o mesmo `<Icon>`). Proibido MUI, Lucide ou outra biblioteca no consumo.
5. `theme.css` é **gerado**, nunca editado à mão.

## 5. Stack e ambiente

| Item | Decisão |
|---|---|
| Produto oficial | Next.js (App Router) + Tailwind v4 |
| Protótipos em código | Vite + React + Tailwind v4 (ex.: `opa-desk`) |
| Pacote de UI | React, **agnóstico de framework** (sem `next/*`), ESM + tipos, `"use client"` onde necessário |
| Monorepo | pnpm workspaces + Turborepo |
| Variantes | `class-variance-authority` + `tailwind-merge` (`cn()`) |
| Ícones | Font Awesome Pro via **Kit** (`@awesome.me/kit-…`) |
| Docs | Storybook (versão estável atual), deploy na Vercel |
| Testes | Vitest + Testing Library + addon a11y do Storybook |
| Versionamento | Changesets (semver) |
| Hospedagem | GitHub pessoal agora; GitLab no futuro |
| Figma | Plano Professional |

## 6. Arquitetura do repositório

```
design-system/
├── packages/
│   ├── tokens/                 @opa/tokens
│   │   ├── src/
│   │   │   ├── primitives.json
│   │   │   ├── semantic.light.json
│   │   │   ├── semantic.dark.json
│   │   │   ├── component.json
│   │   │   └── typography.json
│   │   ├── scripts/build.ts    JSON (DTCG) → CSS
│   │   └── dist/theme.css      gerado
│   └── ui/                     @opa/ui
│       ├── components.json     config do shadcn CLI
│       ├── src/components/<nome>/
│       │   ├── <nome>.tsx
│       │   ├── <nome>.stories.tsx
│       │   ├── <nome>.test.tsx
│       │   └── index.ts
│       ├── src/lib/utils.ts    cn()
│       ├── src/styles.css      importa tokens + @source dos componentes
│       └── src/index.ts        exports públicos
├── apps/
│   └── storybook/
├── manifest/
│   └── components.json         Figma ↔ React
├── CLAUDE.md
├── .claude/skills/
│   ├── add-component/
│   ├── sync-tokens/
│   ├── figma-component/
│   └── build-figma-screen/
└── .changeset/
```

**Consumo (Next.js ou Vite):**

```css
/* globals.css */
@import "tailwindcss";
@import "@opa/ui/styles.css";
```

```tsx
import { Button, Icon } from "@opa/ui";
```

`@opa/tokens` é pacote separado para permitir uso isolado (protótipos HTML, e-mails, outros apps).

## 7. Tokens

### 7.1 Camadas

| Camada | Conteúdo | Quem pode usar |
|---|---|---|
| 1. Primitivos | Cores cruas: `brand-50…950`, `neutral`, `red`, `green`, `amber`… (prefixo CSS `--opa-`) | Só as camadas 2 e 3 |
| 2. Semânticos | **Nomes do Shadcn**: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `sidebar-*`, `chart-1…5` (cada um com `-foreground` quando aplicável). **Extensões:** `success`, `warning`, `info` e variantes `*-subtle` (ex.: `destructive-subtle`, `success-subtle`) | Componentes e telas |
| 3. Componente | Exceções específicas (ex.: `chip-bg`, `chip-border`). Só existe se não fizer sentido como semântico global | Só o componente dono |

Os semânticos têm modos **Light** (`:root`) e **Dark** (`.dark`) na v1, a partir das paletas que já existem no Figma.

### 7.2 Escalas não-cor

**Padrão do Tailwind, sem alteração:** espaçamento, raio, sombra, breakpoints, z-index, opacidade, duração/easing.

**Tipografia:**
- `--font-sans: Inter` para todo texto; `--font-mono: JetBrains Mono` para código.
- Nomenclatura Tailwind (`text-xs … text-4xl`) com **valores próprios** (tamanho + altura de linha) extraídos dos estilos do Figma (`Default/{tamanho}/{peso}`), sobrescrevendo o `@theme`.
- Pesos: os existentes no Figma (Regular, Medium, Bold e outros que forem encontrados).

### 7.3 Formato e build

- Fonte de verdade: JSON no formato **W3C Design Tokens (DTCG)** em `packages/tokens/src`.
- `build.ts` gera `theme.css` com:
  - `:root { --opa-* }`: primitivos
  - `:root { --primary … }` e `.dark { … }`: semânticos e componente
  - `@theme inline { --color-primary: var(--primary); … --font-*; --text-* }`: exposição ao Tailwind
- O CI falha se o `theme.css` commitado divergir do gerado.

### 7.4 Sincronização Figma ↔ código

Assistida pelo Claude via MCP do Figma, sob demanda (sem API REST de variáveis, que exige Enterprise):
- **Figma → JSON** (fluxo principal): designer altera variáveis → pede "sincroniza os tokens" → Claude lê as variáveis, atualiza os JSON e abre PR com diff legível (alterados/novos/removidos).
- **JSON → Figma**: Claude cria/atualiza as variáveis a partir dos JSON (usado no setup inicial e quando o código muda).

## 8. Componentes

### 8.1 Padrão

1. `shadcn add <componente>` dentro de `packages/ui`.
2. Aplicar tokens semânticos (o Shadcn já usa esses nomes; ajustes mínimos).
3. Trocar ícones Lucide internos por `<Icon>`.
4. Ajustar variantes/tamanhos para bater com o Figma (cva).
5. Story + teste + entrada no manifesto + changeset.

### 8.2 Convenção de nomes Figma = React

As propriedades do Figma passam a ter os mesmos nomes e valores das props React. Exemplo, Button:

| Figma atual | Figma novo = React |
|---|---|
| Type = Primary / Destructive / Neutral / Quiet / Outline | `variant="primary" \| "destructive" \| "neutral" \| "quiet" \| "outline"` |
| Type = Red Quiet / Green Quiet | `variant="destructive-quiet" \| "success-quiet"` (nome pela função, não pela cor) |
| Size = SM / Default / LG | `size="sm" \| "default" \| "lg"` |
| Layout = Icon Only | `size="icon-sm" \| "icon" \| "icon-lg"` |
| Has Leading / Trailing Icon | `<Icon>` como filho; no Figma, boolean + instance swap |
| State = Hover / Active / Focus / Disabled | Estados CSS; só `disabled` é prop. No Figma continuam como variantes (documentação) |

### 8.3 Ícones — `<Icon>`

- API: `<Icon name="plus" />`, `variant="regular" | "solid"` (padrão `regular`; `solid` para estados ativos/selecionados), `size` alinhado à escala tipográfica, `label` opcional (sem label → `aria-hidden`).
- Cor via `currentColor`.
- Ícones registrados a partir do **Font Awesome Kit**, que contém só o subconjunto usado e os **SVGs próprios** enviados como ícones customizados do Kit.
- Ilustrações SVG (não-ícones) são assets, não passam pelo `<Icon>`.
- O token npm do FA Pro fica configurado no CI do DS, do produto e dos protótipos.

### 8.4 Faseamento

| Fase | Escopo |
|---|---|
| **1. Fundações + piloto** | Tokens completos (3 camadas, Light/Dark), tipografia, `<Icon>`, e **Button, Input, Badge/Chip, Dialog, Select** percorrendo o fluxo inteiro (código → Storybook → Figma → manifesto → regras do Claude) |
| 2. Formulários | Label, Textarea, Checkbox, Radio Group, Switch, Form (react-hook-form + zod), Combobox, Date Picker |
| 3. Navegação e feedback | Tabs, Dropdown Menu, Tooltip, Popover, Toast (Sonner), Alert, Sheet, Command, Breadcrumb, Pagination |
| 4. Dados e layout | Card, Table/Data Table, Avatar, Skeleton, Scroll Area, Sidebar, Accordion, Separator |
| Pendentes de aprovação | Componentes fora do Shadcn (ex.: Lottie) |

A fase 1 valida o fluxo. As fases seguintes repetem o padrão via skill `add-component`.

## 9. Figma

Arquivo **novo** "OPA Design System". O "Component Library" atual serve só de referência visual.

- **Coleções de variáveis:**
  - `Primitives` (1 modo)
  - `Semantic` (Light/Dark → aliases de Primitives)
  - `Component` (→ aliases de Semantic)
  - `Spacing` e `Radius` (escala Tailwind, com escopos restritos)
- **Estilos de texto** com nomes do código: `text-sm/regular`, `text-sm/medium`, …, `mono/…`.
- **Ícones:** componentes **vetoriais** nomeados como no FA (`regular/plus`, `solid/plus`, `custom/<nome>`), só o subconjunto do Kit; usados via **instance swap**. Os estilos de texto `Icons/…` não entram na biblioteca nova.
- **Todas** as cores, raios e espaçamentos dos componentes ligados a variáveis. Sem valores soltos.
- **Páginas:** Capa · Fundações (Cores, Tipografia, Ícones, Espaçamento, Raio, Sombra) · uma página por componente · Changelog.
- **Documentação por componente** no template do Button atual: Anatomia, Variantes, Tamanhos, Estados, Propriedades e **Quando usar / Quando não usar** (as diretrizes de UX da v1 ficam aqui).
- Descrição de cada componente com **link para a story** no Storybook.

## 10. Storybook

- `apps/storybook`, deploy na Vercel com preview por PR.
- **Fundações geradas dos JSON de tokens:** paletas, tabela de semânticos Light/Dark, escala tipográfica, galeria de ícones com busca.
- Por componente: autodocs com playground de props, todas as variantes e estados, exemplos de uso, link para o nó do Figma.
- Seletor de tema Light/Dark na barra; addon a11y.
- Página de Changelog alimentada pelos changesets.

## 11. Uso pelo Claude

### 11.1 `CLAUDE.md`

Na raiz do DS e copiado para repositórios de protótipo:
1. Usar só `@opa/ui` e classes semânticas.
2. Faltou componente → buscar no Shadcn/Radix → propor entrada via `add-component`.
3. **Nunca criar componente do zero sem avisar e obter aprovação**, explicando por que Shadcn/Radix não resolve.
4. Proibido MUI, outras bibliotecas de ícones e valores arbitrários.

### 11.2 Skills (`.claude/skills/`)

| Skill | Faz |
|---|---|
| `add-component` | Fluxo da seção 8.1 completo |
| `sync-tokens` | Figma ↔ JSON via MCP, com PR e diff legível |
| `figma-component` | Cria/atualiza componente no Figma: variáveis ligadas, propriedades = props, página de documentação no template |
| `build-figma-screen` | Monta telas no Figma só com instâncias da biblioteca e variáveis, consultando o manifesto |

### 11.3 Manifesto (`manifest/components.json`)

Por componente: nome e chave no Figma, mapa propriedade Figma ↔ prop React, valores permitidos, ícones/slots, link da story, status (`stable` | `beta` | `planned`). Substitui o Code Connect e é a referência do Claude em ambos os meios.

## 12. Distribuição e versionamento

- **Changesets**, semver:
  - *patch*: correção sem mudança visual intencional
  - *minor*: nova variante/componente ou ajuste visual compatível
  - *major*: prop removida/renomeada ou quebra de comportamento, com nota de migração
- **v1 (GitHub pessoal):** cada release publica os `.tgz` de `@opa/tokens` e `@opa/ui` no **GitHub Releases**; consumo por URL. Motivo: o GitHub Packages exige que o escopo seja igual à conta, e o nome `@opa/*` deve ser preservado.
- **Futuro (GitLab):** publicação no Package Registry do GitLab com escopo `@opa`.
- **CI portável:** toda lógica em scripts do `package.json`/turbo; o arquivo de CI só invoca scripts.

## 13. Qualidade e testes (CI em todo PR)

1. `typecheck` + `lint`, incluindo regra que proíbe primitivos e valores arbitrários fora de `packages/tokens`.
2. Vitest + Testing Library: renderização por variante, comportamento, navegação por teclado.
3. Addon a11y do Storybook: falha em violações sérias/críticas.
4. Build dos pacotes + verificação `theme.css` gerado == commitado.
5. Smoke test de consumo: app Vite mínimo e app Next mínimo importando o pacote buildado (garante agnosticismo de framework).

## 14. Riscos e pontos em aberto

| Item | Tratamento |
|---|---|
| Valores exatos da tipografia e das paletas | Extraídos do Figma na fase 1 via MCP; validados com o designer antes do primeiro release |
| Token do Font Awesome Pro em CI e protótipos | Documentar setup no README; variável de ambiente `FONTAWESOME_PACKAGE_TOKEN` |
| Sem Code Connect (plano Professional) | Manifesto + descrição/link no Figma |
| Migração GitHub → GitLab | CI portável; troca apenas da etapa de publicação |
| Tailwind v4 precisa enxergar classes do pacote | `@source` no `styles.css` do `@opa/ui` apontando para `dist`; coberto pelo smoke test |
| Componentes fora do Shadcn (Lottie etc.) | Fora da v1; cada um requer aprovação explícita |
| Coexistência com bibliotecas Figma antigas | Fora do escopo; a nova biblioteca é a referência a partir do release 1.0 |
