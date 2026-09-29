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
2. Componentes e telas **só usam tokens semânticos**. Detalhamento em 13.1. Resumo:
   - **Proibido em todo lugar** (exceto `packages/tokens`): cores arbitrárias (`bg-[#3b35c9]`, `rgb()`, `hsl()`, `oklch()`), uso de primitivos (`var(--opa-*)`) e estilos inline de cor.
   - **Proibido em apps consumidores** (produto, protótipos): valores arbitrários de espaçamento/tamanho (`p-[13px]`, `w-[372px]`). Usar a escala do Tailwind.
   - **Permitido em `packages/ui`**, por vir do código-fonte do Shadcn: variantes arbitrárias (`has-[>svg]:px-3`, `[&_svg]:size-4`), variáveis CSS do Radix (`max-h-(--radix-select-content-available-height)`) e cálculos de layout (`max-w-[calc(100%-2rem)]`, `translate-x-[-50%]`).
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
│   │   │   ├── typography.json
│   │   │   └── tailwind-scales.json   só para o Figma (spacing/radius/shadow)
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
│   └── eslint-config/          @opa/eslint-config (regra de tokens, seção 13)
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

### 6.1 Build e empacotamento de `@opa/ui`

- **Vite em library mode** com `preserveModules` (um arquivo por módulo) e preservação das diretivas `"use client"`. Bundle em arquivo único remove as diretivas e quebra o App Router do Next.
- `react`, `react-dom` e o Kit do Font Awesome são `peerDependencies`; Radix, cva e tailwind-merge são `dependencies`.
- `dist/styles.css` é gerado no build e contém: o `theme.css` de `@opa/tokens` **copiado para dentro** (o CSS do `@opa/ui` não depende de resolver `@opa/tokens` no consumidor), mais `@source "./";` para o Tailwind do consumidor encontrar as classes nos `.js` do `dist`.
- `package.json` → `exports`: `"."` (JS + tipos) e `"./styles.css"` → `./dist/styles.css`.
- O Storybook dentro do monorepo usa `@source` apontando para `packages/ui/src` (hot reload), e não para o `dist`.

## 7. Tokens

### 7.1 Camadas

| Camada | Conteúdo | Quem pode usar |
|---|---|---|
| 1. Primitivos | Cores cruas: `brand-50…950`, `neutral`, `red`, `green`, `amber`… (prefixo CSS `--opa-`) | Só as camadas 2 e 3 |
| 2. Semânticos | **Nomes do Shadcn**: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` (cada um com `-foreground` quando aplicável). **Extensões:** `success`, `warning`, `info` e variantes `*-subtle` (ex.: `destructive-subtle`, `success-subtle`). `sidebar-*` e `chart-1…5` ficam para a fase 4 | Componentes e telas |
| 3. Componente | Exceções específicas (ex.: `tag-bg`, `tag-border`). Só existe se não fizer sentido como semântico global. Expostos ao Tailwind (`bg-tag-bg`) | Só o componente dono |

Os semânticos têm modos **Light** (`:root`) e **Dark** (`.dark`) na v1, a partir das paletas que já existem no Figma.

### 7.2 Escalas não-cor

**Padrão do Tailwind, sem alteração:** espaçamento, raio, sombra, breakpoints, z-index, opacidade, duração/easing. Não são emitidos no CSS (o Tailwind já os fornece).

Para o Figma, `packages/tokens/src/tailwind-scales.json` descreve espaçamento, raio e sombra com os valores padrão do Tailwind. Ele é **só entrada para o Figma** (coleções `Spacing`/`Radius` e effect styles de sombra), sincronizado **apenas JSON → Figma**; o `build.ts` o ignora.

**Paleta padrão do Tailwind removida:** o `@theme` gerado começa com `--color-*: initial;`, e `bg-blue-500` e similares deixam de existir. São re-adicionados apenas `white`, `black`, `transparent`, `current` (usados pelo Shadcn, ex.: overlay `bg-black/50`) e os semânticos/componente.

**Tipografia:**
- `--font-sans: Inter` para todo texto; `--font-mono: JetBrains Mono` para código.
- Arquivos de fonte entregues pelo DS: `@fontsource-variable/inter` e `@fontsource-variable/jetbrains-mono` são dependências de `@opa/tokens`, e o `@font-face` já vem incluído no CSS do pacote. Sem `next/font`, para manter o pacote agnóstico de framework.
- Nomenclatura Tailwind (`text-xs … text-4xl`) com **valores próprios** (tamanho + altura de linha) extraídos dos estilos do Figma (`Default/{tamanho}/{peso}`), sobrescrevendo o `@theme`.
- Pesos: os existentes no Figma (Regular, Medium, Bold e outros que forem encontrados).

### 7.3 Formato e build

- Fonte de verdade: JSON no formato **W3C Design Tokens (DTCG)** em `packages/tokens/src`.
- `build.ts` gera `theme.css` com:
  - `@custom-variant dark (&:where(.dark, .dark *));`: faz o `dark:` do Tailwind seguir a classe `.dark`, e não o tema do sistema operacional
  - `:root { --opa-* }`: primitivos (não viram utilitários do Tailwind)
  - `:root { --primary … }` e `.dark { … }`: semânticos e componente
  - `@theme inline { --color-*: initial; --color-primary: var(--primary); … --font-*; --text-* }`: exposição ao Tailwind
- O CI falha se o `theme.css` commitado divergir do gerado.

### 7.4 Sincronização Figma ↔ código

Assistida pelo Claude via MCP do Figma, sob demanda (sem API REST de variáveis, que exige Enterprise):
- **Figma → JSON** (fluxo principal): designer altera variáveis → pede "sincroniza os tokens" → Claude lê as variáveis, atualiza os JSON e abre PR com diff legível (alterados/novos/removidos).
- **JSON → Figma**: Claude cria/atualiza as variáveis a partir dos JSON (usado no setup inicial e quando o código muda).

## 8. Componentes

### 8.1 Padrão

1. `shadcn add <componente>` dentro de `packages/ui`. O `components.json` aponta o CSS para um arquivo descartável, para o CLI não injetar `cssVars` no tema gerado. Depois o arquivo é movido de `components/ui/<nome>.tsx` para `src/components/<nome>/<nome>.tsx`.
2. Aplicar tokens semânticos (o Shadcn já usa esses nomes; ajustes mínimos, sem reescrever o funcionamento interno).
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
- Como o lookup é por nome em texto, o `<Icon>` mantém um registro nome → definição de **todo o Kit**. Tree-shaking não reduz nada aqui, e isso é aceitável porque o Kit já é um subconjunto curado. Renderização via `@fortawesome/react-fontawesome`. Os subpaths exatos do Kit (regular/solid/custom) são confirmados na implementação.
- O Kit é **dependência externa** de `@opa/ui` e **não é embutido no `dist`**. Ícones Pro nunca entram em arquivo redistribuível; cada consumidor instala com o próprio token FA.
- Ilustrações SVG (não-ícones) são assets, não passam pelo `<Icon>`.
- O token npm do FA Pro fica configurado no CI do DS, do produto e dos protótipos.

### 8.4 Faseamento

| Fase | Escopo |
|---|---|
| **1. Fundações + piloto** | Tokens completos (3 camadas, Light/Dark), tipografia, `<Icon>`, e **Button, Input, Tag, Dialog, Select** percorrendo o fluxo inteiro (código → Storybook → Figma → manifesto → regras do Claude) |
| 2. Formulários | Label, Textarea, Checkbox, Radio Group, Switch, Form (react-hook-form + zod), Combobox, Date Picker |
| 3. Navegação e feedback | Tabs, Dropdown Menu, Tooltip, Popover, Toast (Sonner), Alert, Sheet, Command, Breadcrumb, Pagination |
| 4. Dados e layout | Card, Table/Data Table, Avatar, Skeleton, Scroll Area, Sidebar, Accordion, Separator |
| Pendentes de aprovação | Componentes fora do Shadcn: **Badge** (indicador de pendência: contador/ponto), Lottie |

A fase 1 valida o fluxo. As fases seguintes repetem o padrão via skill `add-component`.

**Nomenclatura Tag × Badge:**
- **Tag** = rótulo/categoria (o antigo "Chip" do Figma). Origem: `Badge` do Shadcn, **renomeado para `Tag`** no código e no Figma. Não é criação do zero.
- **Badge** = indicador de pendência (ex.: mensagens não lidas). Não existe no Shadcn, então só entra com aprovação explícita.

## 9. Figma

Arquivo **novo** "OPA Design System". O "Component Library" atual serve só de referência visual.

- **Coleções de variáveis:**
  - `Primitives` (1 modo)
  - `Semantic` (Light/Dark → aliases de Primitives)
  - `Component` (→ aliases de Semantic)
  - `Spacing` e `Radius` (escala Tailwind, com escopos restritos), gerados de `tailwind-scales.json`
- **Effect styles** de sombra (escala Tailwind), gerados de `tailwind-scales.json`. Sombras não podem ser variáveis no Figma.
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
- **v1 (GitHub pessoal, repo privado):** publicação no **GitHub Packages** com o escopo da conta (`@<usuario>/ui`, `@<usuario>/tokens`, `@<usuario>/eslint-config`), porque o GitHub Packages exige isso. Os consumidores usam **alias npm**, e os imports continuam `@opa/*`:
  ```json
  "dependencies": { "@opa/ui": "npm:@<usuario>/ui@^1.0.0" }
  ```
  com `.npmrc` apontando `@<usuario>` para `npm.pkg.github.com` e um token de leitura.
- `@opa/ui` **não depende de `@opa/tokens` em runtime**: o tema é copiado para o `dist/styles.css` no build (seção 6.1). Assim não há dependência interna a ser resolvida no registry público, nem risco de *dependency confusion*. As fontes (`@fontsource-variable/*`) são `dependencies` de `@opa/ui` e de `@opa/tokens`.
- **Futuro (GitLab):** publicação no Package Registry do GitLab com escopo `@opa`. A migração nos consumidores troca só o `.npmrc` e o alvo do alias (ou remove o alias); nenhum import muda.
- **CI portável:** toda lógica em scripts do `package.json`/turbo; o arquivo de CI só invoca scripts.

## 13. Qualidade e testes (CI em todo PR)

1. `typecheck` + `lint`. A regra de tokens é uma **regra ESLint customizada** (`eslint-plugin-tailwindcss` tem suporte limitado ao v4) que analisa strings de `className`, `cn()` e `cva()` e aplica a Regra 2 (seção 4): cores arbitrárias e `--opa-*` bloqueados em todo lugar; espaçamento/tamanho arbitrário bloqueado só nos consumidores; variantes arbitrárias, variáveis do Radix e `calc()` liberados em `packages/ui`. A regra é publicada como `@opa/eslint-config` para produto e protótipos.
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
| Componentes fora do Shadcn (Badge indicador, Lottie etc.) | Fora da v1; cada um requer aprovação explícita |
| Escopo do plano de implementação | Limitado à fase 1, dividido em 3 sub-planos: (a) tokens + pipeline + CI; (b) `@opa/ui` com `<Icon>` e 5 componentes + Storybook; (c) biblioteca Figma + manifesto + `CLAUDE.md`/skills |
| Coexistência com bibliotecas Figma antigas | Fora do escopo; a nova biblioteca é a referência a partir do release 1.0 |
