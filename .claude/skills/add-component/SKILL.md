---
name: add-component
description: Use when adding a new Shadcn/Radix component to @opa/ui (packages/ui), or when a screen/prototype needs a component the DS does not have yet. Covers shadcn add, adaptation to tokens and Figma, Icon, tests, story, export, manifest and changeset. Stops for owner approval if the component is not in Shadcn/Radix.
---

# add-component — trazer um componente do Shadcn para o `@opa/ui`

Fluxo do spec §8.1 com as lições do Plano 2. Leia antes: `CLAUDE.md` (regras), a tabela de decisões no topo de
`docs/superpowers/plans/2026-09-29-plano-2-componentes-storybook.md` e `manifest/components.json`.

## 0. Portão: existe no Shadcn/Radix?

- Procure em https://ui.shadcn.com/docs/components e nos primitivos do Radix (`radix-ui`).
- **Não existe → PARE.** Explique ao dono o que falta, por que Shadcn/Radix não resolve (e o que chega mais perto) e
  **espere aprovação explícita** antes de escrever qualquer código. Isso vale para "wrappers" e composições novas também.
- Existe, mas é outro nome no Figma (ex.: Badge do Shadcn = `Tag` no DS)? Confirme o nome com o dono antes.
- Composições (ex.: Combobox = Popover + Command) seguem o exemplo oficial do Shadcn; composição nova de dono (como
  `InputField`) exige aprovação.

## 1. Gerar o código

```bash
cd packages/ui
export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')"
pnpm dlx shadcn@4.21.0 add <nome>
```

- `packages/ui/components.json` aponta o CSS para `src/.shadcn/scratch.css` (ignorado pelo git): o CLI não mexe no tema gerado.
- **Layout plano:** o arquivo fica em `src/components/ui/<nome>.tsx`. Não mova. Teste e story ficam ao lado.
- **Não sobrescreva** componentes existentes que o CLI oferecer (responda "não"); confira `git status` depois.
- Se o CLI adicionar `lucide-react` ou outra dependência de ícones ao `package.json`, **remova** (`pnpm remove lucide-react`).
  Dependências Radix/cmdk legítimas ficam em `dependencies`.
- Mesma versão do CLI de sempre (`shadcn@4.21.0`, new-york). Se precisar de outra, registre no comentário de origem.

## 2. Adaptar

1. Primeira linha (após `"use client"` se houver): `// Origem: shadcn/ui <nome> (shadcn@4.21.0, new-york). Adaptado ao Figma <node>.`
2. `cn`: o gerado importa `cn` de `"cn"` → troque por `import { cn } from "@/lib/utils";` (o `cn` do DS conhece
   `shadow-popover`, `focus-ring`, `focus-halo*`).
3. **Ícones:** troque todo Lucide por `<Icon name="…" />` de `@/components/ui/icon`. Ícone novo:
   - `src/components/ui/icon-registry.ts`: import do regular (`@fortawesome/pro-regular-svg-icons/fa<Nome>`) e do solid,
     nome na união `IconName`, chave nos mapas `regular` e `solid`;
   - Figma: o ícone já existe no catálogo (página Ícones · Font Awesome) como componente `<name>` com `variant` regular | solid.
     Anote o nodeId/key do componente e das duas variantes em `figma-library-index.json → icons` (e, se quiser, mostre-o na página Ícones);
   - `manifest/components.json → icons.items` (o teste exige os três em sincronia).
4. **Tokens e specs do Figma** (decisões do Plano 2):
   - Só cores semânticas (`bg-primary`, `text-muted-foreground`, `border-border`…). Nada de `--opa-*`, hex ou paleta do Tailwind.
   - Tamanhos de texto com nomes do Figma: `text-sm`=12px, `text-base`=14px, `text-lg`=16px. **Revise todo `text-sm` do Shadcn**
     (que era 14px) — normalmente vira `text-base`.
   - `font-semibold` → `font-medium` (ou `font-normal` onde o Figma usa Regular).
   - Foco: `focus-visible:focus-ring` sem borda; com borda: `focus-visible:border-ring focus-visible:focus-halo`
     (estados: `focus-halo-destructive|success|warning`). Remova os `ring-[3px]`/`ring-ring/50` do Shadcn.
   - Hover/active de fundo sólido: `hover:bg-shade-<token>` (15%) e `active:bg-shade-strong-<token>` (25%); neutral: `hover:bg-input`.
   - Disabled: `disabled:opacity-40` (não 50).
   - Placeholder `muted-foreground`; erro de campo `destructive`; sombras `shadow-popover` / `shadow-dropdown`.
   - Valores arbitrários do Shadcn (`[&_svg]:size-4`, `w-(--radix-…)`, `calc()`) ficam. Não invente novos valores arbitrários de cor.
5. Variantes/tamanhos no `cva` com **os mesmos nomes e valores das propriedades do Figma** (spec §8.2; ex.: `destructive-quiet`).
   Estados de hover/focus são CSS; só `disabled` vira prop.
6. `"use client"` **só** onde há estado, efeito ou Radix interativo. Componentes puramente visuais (como `Button`, `Input`, `Icon`)
   ficam sem diretiva. Sem `next/*`: o pacote é agnóstico de framework.

## 3. Testes, story, export

- `src/components/ui/<nome>.test.tsx` (Vitest + Testing Library, jsdom): renderiza cada variante, comportamento e teclado,
  papel/nome acessível (`getByRole`), `aria-*` relevantes, `disabled`. Veja `button.test.tsx`, `combobox.test.tsx`.
- `src/components/ui/<nome>.stories.tsx`: `title: "Componentes/<Nome>"`, `argTypes` com as opções do cva, stories de variantes
  e estados, e em `parameters.docs.description.component` o **link do Figma**
  (`https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=<id-com-hífen>`) e as notas de uso. As stories rodam como teste de a11y.
- Export em `src/index.ts` (componente, subpartes e tipos públicos).

## 4. Manifesto, Figma e changeset

- `manifest/components.json`: nova entrada com `status`, `react` (`import`, `exports`, `source`), `figma` (nome, `nodeId`, `key`,
  `page`, `url`) ou `null` + `figmaUsage`, `storybook.title` e `props` cobrindo **toda** propriedade do Figma
  (`{ figma, react, values?, map?, notes? }`). O componente no Figma é criado com a skill `figma-component`, que também atualiza
  `docs/superpowers/notes/figma-library-index.json`.
- `pnpm changeset` → `@gsilisqui/ui` **minor** (componente novo), texto em português.
- `packages/ui/README.md`: linha na tabela de componentes.

## 5. Verificar e entregar

```bash
export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')" && pnpm verify
```

- Tudo verde (lint da regra de tokens, typecheck, testes incl. `test/manifest.test.ts` e `test/dist.test.ts`, build, Storybook).
- Commit com stage por caminho explícito e `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Algo que não coube no Shadcn/Radix ou nas decisões registradas → **pare e pergunte ao dono**; registre o resto em
  `docs/superpowers/notes/backlog.md`.
