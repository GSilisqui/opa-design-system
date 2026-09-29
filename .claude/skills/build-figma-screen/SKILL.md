---
name: build-figma-screen
description: Use when the designer asks to build, mock up or update a screen, modal, panel or flow in Figma with the OPA Design System (e.g. "monta a tela de atendimento no Figma"). Assembles screens ONLY from library component instances, variables and text styles, consulting manifest/components.json; stops and proposes add-component when something is missing.
---

# build-figma-screen — telas no Figma só com a biblioteca do DS

## 0. Preparar

1. Carregue **`figma:figma-use`** e **`figma:figma-generate-design`** (fluxo oficial de montar telas por seções) antes de qualquer
   `use_figma`. Chamadas `use_figma` **sequenciais**, nunca em paralelo.
2. Leia `manifest/components.json` (componentes, props Figma ↔ React, valores, ícones, tokens) e
   `docs/superpowers/notes/figma-library-index.json` (`nodeId`, `key`, propriedades de cada componente).
3. Liste com o designer as seções da tela e, para cada elemento, **qual componente do DS** o representa.
   **Faltou algo** (componente, variante, ícone)? **Pare e diga ao dono** o que falta e proponha a skill `add-component`
   (Shadcn/Radix primeiro). **Nunca desenhe à mão** algo com cara de componente (retângulo + texto fazendo papel de botão, badge, card…).

## 1. Instâncias da biblioteca

- **No próprio arquivo do DS** (`UW4As1KdSaPboQ3sNMAbCi`): use o componente local pelo `nodeId` do índice
  (`await figma.getNodeByIdAsync("10:1010")` → COMPONENT_SET → `defaultVariant.createInstance()`).
- **Em outro arquivo:** `await figma.importComponentSetByKeyAsync(key)` (sets: Button, InputField, Input, Tag, Combobox,
  Combobox Option) ou `await figma.importComponentByKeyAsync(key)` (componentes simples: Dialog, Combobox Popover, ícones).
  Só funciona com a biblioteca **publicada**; se falhar, peça ao dono para publicar (Assets → Publish) em vez de copiar nós.
- Propriedades **pelo nome do manifesto**: `instance.setProperties({ variant: "neutral", size: "sm" })`. Propriedades TEXT/BOOLEAN/
  INSTANCE_SWAP têm sufixo de id: resolva o nome completo em `instance.componentProperties` (chave que começa com `label#`, `leadingIcon#`…).
  Ícone: INSTANCE_SWAP com o id do componente `regular/<name>` (ou `solid/<name>` para ativo/selecionado).
- **Nunca** `detachInstance()` nem edite a estrutura interna de uma instância. Precisa de algo que a instância não oferece → falta variante:
  volte ao passo 0.3.

## 2. Layout e tokens

- Frames com `figma.createAutoLayout()`; `fills = []` nos frames internos (o padrão é branco).
- Espaçamento com a coleção **Spacing** (`itemSpacing`, `padding*` via `setBoundVariable`; nomes com `_`: `1_5` = `gap-1.5`).
  Raio com **Radius** (nomes do Tailwind v4). Nenhum número solto.
- Cores só da coleção **Semantic** (fundo da tela `background`, superfícies `card`/`popover`, texto `foreground`/`muted-foreground`, bordas `border`)
  via `setBoundVariableForPaint`. Nada de hex nem de `Primitives`.
- Texto solto (títulos, parágrafos) com estilos `text-{size}/{regular|medium|bold}` (`text-sm`=12px, `text-base`=14px). Sombras/foco:
  effect styles `shadow/*`, `focus/*`.
- **Tela escura:** `frame.setExplicitVariableModeForCollection(semanticCollection, darkModeId)` no frame raiz (modo `Dark` da coleção
  `Semantic`; id em `figma-build-state.json → modes`). As instâncias herdam o modo.
- Larguras de tela: use valores de layout reais (ex.: 1440/1280/390) só no frame raiz; o interior é auto-layout com FILL/HUG.

## 3. Por seções, com verificação

1. Crie o frame raiz e as seções (placeholder), posicionado longe de outros nós da página.
2. Monte **uma seção por chamada** (`use_figma`), retornando os ids criados.
3. **Um screenshot por seção** montada; corrija só o que estiver errado (texto cortado, sobreposição, variante errada).
4. Ao final, auditoria read-only da tela: nenhum paint sem variável, nenhum TEXT sem estilo, nenhuma instância destacada,
   nenhum nó com nome padrão; liste os componentes usados.

## 4. Entrega

- Link do frame (`https://www.figma.com/design/<fileKey>?node-id=<id com ":"→"-">`), lista de componentes/variantes usados e
  **o que faltou** no DS (proposto via `add-component`, nunca improvisado).
- Se a tela vai virar protótipo em código, os mesmos componentes e props do manifesto valem no `@opa/ui`.
