# OPA Design System — instruções para o Claude

Design System da OPA baseado em **Shadcn/Radix UI**, com tokens espelhados 1:1 entre código e Figma.
Consumido pelo produto oficial (Next.js) e por protótipos (Vite, ex.: `opa-desk`). Dono: Gabriel Silisqui.
Escreva textos, docs e commits de conteúdo em português (BR); identificadores em inglês.

## Estrutura

| Caminho | O que é |
|---|---|
| `packages/tokens` | `@opa/tokens` (publicado `@gsilisqui/tokens`). JSON DTCG em `src/` → `generated/theme.css` (Tailwind v4) e `generated/tokens.css` (CSS puro). `src/tailwind-scales.json` só alimenta o Figma |
| `packages/ui` | `@opa/ui` (`@gsilisqui/ui`). Componentes em `src/components/ui/*.tsx` (layout plano do Shadcn), teste e story ao lado; exports em `src/index.ts`; CSS em `src/styles.css` |
| `packages/eslint-config` | `@opa/eslint-config`: regra `opa/no-raw-design-values` (configs `ui` e `app`) |
| `apps/storybook` | Storybook (pacote `opa-storybook`): Fundações, stories e testes de a11y em Chromium |
| `apps/smoke-vite`, `apps/smoke-next` | Apps mínimos que consomem o `dist` (garantem Vite + Next) |
| `manifest/components.json` | **Manifesto Figma ↔ React**: nó/chave do Figma, props, valores, ícones e tokens. Validado por `packages/ui/test/manifest.test.ts` |
| `docs/superpowers/` | Spec, planos e notas (decisões, índice e ledger do Figma, backlog) |
| `docs/prototype-CLAUDE.md` | Modelo de `CLAUDE.md` para repositórios de protótipo |
| `.claude/skills/` | Skills do DS (ver no fim) |

## Regras invioláveis

1. **Só componentes do `@opa/ui` e tokens semânticos.** Nada de estilo "na mão" que duplique um componente existente.
2. **Faltou componente → procure primeiro no Shadcn/Radix** e proponha a entrada pela skill `add-component`.
3. **NUNCA crie componente do zero sem avisar e obter aprovação explícita do dono.** Pare, explique por que Shadcn/Radix
   não resolve e espere a resposta. Isso vale também para "só um wrapper" ou "só um div estilizado" que faça papel de componente.
   (Ex.: `Badge` de pendência e Lottie estão pendentes de aprovação.)
4. **Proibido:** MUI, Lucide ou qualquer outra biblioteca de ícones (só Font Awesome Pro via `<Icon>`); cores arbitrárias
   (`bg-[#3b35c9]`, `rgb()`, `hsl()`, `oklch()`, `style={{ color }}`); primitivos `var(--opa-*)`; paleta padrão do Tailwind (`bg-blue-500`).
5. **Valores arbitrários (Regra 2 do spec, §4/§13.1):**
   - Consumidores (produto, protótipos, `apps/smoke-*`): proibido `p-[13px]`, `w-[372px]`… Use a escala do Tailwind.
   - `packages/ui`: permitidos os que vêm do Shadcn — variantes arbitrárias (`has-[>svg]:px-3`, `[&_svg]:size-4`),
     variáveis do Radix (`w-(--radix-popover-trigger-width)`) e `calc()`/`translate-*`. **Nunca remova** esses do código do Shadcn.
6. **Arquivos gerados nunca são editados à mão:** `packages/tokens/generated/*` (edite `src/*.json` e rode `pnpm tokens:build`).
7. Toda variante existe **no Figma e no código com o mesmo nome** e está no manifesto.

## Como consumir

```css
@import "tailwindcss";
@import "@opa/ui/styles.css"; /* tema + fontes + utilitários do DS */
```

```tsx
import { Button, Icon } from "@opa/ui";
<Button variant="neutral"><Icon name="plus" />Novo contato</Button>
```

- Ícones: `<Icon name="plus" />` (regular) ou `variant="solid"` para ativo/selecionado; nomes em `manifest/components.json → icons`.
  No Figma, cada ícone é um componente com a propriedade `variant` (regular | solid; brands para logos). O Figma tem o catálogo
  completo do Font Awesome 7; o código só desenha os do `icon-registry.ts`.
- Dark mode: classe `.dark` num ancestral (normalmente `<html>`). O `dark:` do Tailwind segue essa classe.
- Tipografia com nomes do Figma: `text-sm`=12px, `text-base`=14px, `text-lg`=16px. Pesos: `font-normal|medium|bold` (sem `font-semibold`).
- Foco: `focus-visible:focus-ring` (sem borda) ou `focus-visible:border-ring focus-visible:focus-halo` (com borda). Disabled: `opacity-40`.

## Comandos

```bash
pnpm verify                                  # o mesmo que o CI: tokens:check + lint + typecheck + test + build
pnpm tokens:build                            # regenera packages/tokens/generated/
pnpm tokens:check                            # falha se generated/ estiver desatualizado
pnpm --filter @gsilisqui/ui run test         # vitest (turbo builda antes quando via `pnpm test`)
pnpm --filter @gsilisqui/ui exec vitest run test/manifest.test.ts   # só o manifesto
pnpm --filter @gsilisqui/ui run build
pnpm --filter opa-storybook dev              # Storybook em http://localhost:6006
pnpm changeset                               # descrever mudança publicável (patch/minor/major, spec §12)
```

### Token do Font Awesome (nesta máquina Windows)

`FONTAWESOME_PACKAGE_TOKEN` está no ambiente do **usuário** do Windows e pode não estar na sessão do Git Bash.
Qualquer comando pnpm que resolva `@fortawesome/*` (install, add, verify, test, build) deve começar com:

```bash
export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')" && pnpm verify
```

**Nunca** imprima, grave em arquivo ou commite o valor.

- Não crie worktrees em pastas profundas (`%TEMP%`): caminhos do store do pnpm > ~260 caracteres quebram o Vitest.

## Git e GitHub

- Repositório `GSilisqui/opa-design-system` (privado). Trabalhe em branch; stage por caminho explícito.
- Commits terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Sem `gh` CLI.** Use a API REST do GitHub com o token do credential helper do git, sem nunca imprimi-lo:

  ```bash
  GH_TOKEN="$(printf 'protocol=https\nhost=github.com\n\n' | git credential fill | sed -n 's/^password=//p')"
  curl -s -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github+json" \
    https://api.github.com/repos/GSilisqui/opa-design-system/pulls \
    -d '{"title":"…","head":"feat/…","base":"main","body":"…"}'
  ```
- Push, merge e release são ações externas: **confirme com o dono antes.**
- Release: PR com changeset → merge na `main` → o workflow Release abre o PR **"Version Packages"** → merge desse PR publica
  no GitHub Packages. Não rode `changeset version`/`publish` à mão.

## Figma

- Arquivo **OPA Design System**: `UW4As1KdSaPboQ3sNMAbCi` — https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi
  (o antigo "Component Library" `7FS6JptRPLnco6VSAEAOAH` é só referência visual).
- Páginas: Capa · Comece aqui · Cores · Tipografia · Espaçamento e raio · Efeitos · Ícones · Ícones · Font Awesome · Ícones · brands · Button · Input · Tag · Dialog · Combobox · Changelog.
- Coleções: `Primitives` (escondidos: escopos vazios) · `Semantic` (Light/Dark, nomes = variáveis CSS) · `Component` (`tag-*`) · `Spacing` · `Radius`.
  Estilos de texto `text-{size}/{regular|medium|bold}` e `mono/*`; effect styles `focus/*` e `shadow/*`.
- **Antes de qualquer `use_figma`:** carregue as skills `figma:figma-use` e `figma:figma-generate-library`
  (e `figma:figma-generate-design` para telas). Chamadas `use_figma` **em sequência, nunca em paralelo** neste arquivo.
- Leia antes: `docs/superpowers/notes/figma-library-index.json` (nós, chaves, propriedades) e
  `docs/superpowers/notes/figma-build-state.json` (ledger). Convenções aprendidas:
  - nomes de Spacing usam `_` no lugar de `.` (`0_5` = `0.5` do Tailwind);
  - `figma.createAutoLayout()` cria frame com fill branco: use `fills = []` nos frames internos;
  - `resize()` volta o sizing para FIXED: reaplique `AUTO`/`HUG` depois;
  - a variante padrão é a do canto superior esquerdo do canvas (não a ordem dos filhos);
  - propriedades do Figma = props do React; tudo ligado a variáveis/estilos, sem valores soltos.
- Mudou algo no Figma → atualize o índice, o ledger e o `manifest/components.json` (o teste do manifesto pega divergências).

## Onde estão as decisões

- Spec: `docs/superpowers/specs/2026-09-29-opa-design-system-design.md` (§4 regras, §8 componentes, §9 Figma, §11 Claude).
- Plano 1 (tokens, pipeline, CI): `docs/superpowers/plans/2026-09-29-plano-1-tokens-pipeline.md`.
- Plano 2 (componentes, Storybook) — **tabela de decisões do dono no topo**: `docs/superpowers/plans/2026-09-29-plano-2-componentes-storybook.md`.
- Tokens: `docs/superpowers/notes/2026-09-29-token-mapping.md` §6 (decisões aprovadas).
- Specs visuais do Figma antigo: `docs/superpowers/notes/2026-09-29-figma-component-specs.md`.
- Pendências: `docs/superpowers/notes/backlog.md` (marque `[x]` com o commit ao resolver).

## Skills do DS (`.claude/skills/`)

| Skill | Quando usar |
|---|---|
| `add-component` | Trazer um componente do Shadcn para o `@opa/ui` (fluxo completo até manifesto e changeset) |
| `sync-tokens` | Sincronizar variáveis Figma ↔ `packages/tokens/src/*.json` |
| `figma-component` | Criar/atualizar um componente na biblioteca do Figma |
| `build-figma-screen` | Montar telas no Figma só com instâncias da biblioteca e variáveis |
