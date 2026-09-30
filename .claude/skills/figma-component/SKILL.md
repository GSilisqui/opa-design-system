---
name: figma-component
description: Use when creating or updating a component (or icon) in the OPA Design System Figma library (file UW4As1KdSaPboQ3sNMAbCi) — e.g. after add-component added it to @opa/ui, or when variants/props changed in code. Enforces variables-only bindings, property names = React props, DS state conventions, doc frame, audit, and updating the index, manifest and ledger.
---

# figma-component — componente na biblioteca do Figma

## 0. Preparar

1. Carregue as skills **`figma:figma-use`** e **`figma:figma-generate-library`** antes de qualquer `use_figma`.
   Chamadas `use_figma` **uma de cada vez** (sequenciais) neste arquivo.
2. Leia `docs/superpowers/notes/figma-build-state.json` (ledger: ids de coleções, páginas, estilos, notas) e
   `docs/superpowers/notes/figma-library-index.json` (componentes, chaves, propriedades, ícones).
3. Leia o código: `packages/ui/src/components/ui/<nome>.tsx` (cva = variantes/tamanhos), a story e a entrada em `manifest/components.json`.
4. Inspecione (read-only) a página do componente, se já existir: não recrie o que dá para atualizar (quebraria instâncias).

## 1. Regras de construção

- **Só variáveis e estilos, nenhum valor solto:**
  - Cor de fill/stroke: `figma.variables.setBoundVariableForPaint(paint, "color", variavel)` — retorna um paint **novo**; reatribua `node.fills = [p]`.
    Use a coleção `Semantic` (ou `Component` para `tag-*`), nunca `Primitives`.
  - Raio: `node.setBoundVariable("topLeftRadius" | … | "bottomRightRadius", Radius[<nome>])` (os quatro cantos).
  - Padding/gap/altura/largura: `node.setBoundVariable("paddingLeft" | "paddingRight" | "paddingTop" | "paddingBottom" | "itemSpacing" | "height" | "width", Spacing[<nome>])`
    — nomes com `_` (`0_5`, `1_5`, `2_5`, `3_5`); ex.: `h-9` = `Spacing["9"]`, `px-4` = `Spacing["4"]`.
  - Texto: `await text.setTextStyleIdAsync(estilo.id)` com `text-{size}/{regular|medium|bold}` (`text-base/regular` = `text-base font-normal`).
    Carregue a fonte antes de mexer no texto.
  - Efeitos: `await node.setEffectStyleIdAsync(...)` com `focus/ring`, `focus/halo`, `focus/halo-{destructive|success|warning}`, `shadow/popover`, `shadow/dropdown`.
- Helper típico (dentro de cada script, nada persiste entre chamadas):

```js
const V = {};
for (const c of await figma.variables.getLocalVariableCollectionsAsync()) {
  V[c.name] = {};
  for (const id of c.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); V[c.name][v.name] = v; }
}
const paint = (name, opacity) => {
  const p = figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", V.Semantic[name] ?? V.Component[name]);
  return opacity == null ? p : { ...p, opacity }; // opacidade DEPOIS do binding
};
const radius = (n, name) => ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach((f) => n.setBoundVariable(f, V.Radius[name]));
const pad = (n, x, y) => { n.setBoundVariable("paddingLeft", V.Spacing[x]); n.setBoundVariable("paddingRight", V.Spacing[x]); if (y) { n.setBoundVariable("paddingTop", V.Spacing[y]); n.setBoundVariable("paddingBottom", V.Spacing[y]); } };
```

- **Propriedades = props do React** (mesmos nomes e valores, spec §8.2): `variant`, `size`, `state`, `label`, `leadingIcon` +
  `leadingIconName`, `removable`… O nome do componente é o do código (`Button`, `InputField`); subpartes internas começam com `_`
  (`_Dialog/Body`) ou são nomeadas pelo papel (`Combobox Option`).
- **Estados** (variante `state`, documentação — no código só `disabled` é prop):
  - hover = fill extra por cima do fundo com `foreground` a **15%**; active/pressed = **25%** (`paint("foreground", 0.15)`).
    Neutral usa `input` no hover. Quiet/outline: `accent`.
  - disabled = `opacity` **0.4** no nó raiz da variante.
  - focus = effect style `focus/ring` (sem borda) ou borda `ring` + `focus/halo` (com borda); campos em erro/sucesso/alerta usam o halo do estado.
- **Ícones:** propriedade BOOLEAN (mostrar) + **INSTANCE_SWAP** (`<slot>Name`) com `preferredValues` = chaves dos ícones
  (`{ type: "COMPONENT_SET", key }` dos ícones em `figma-library-index.json → icons`). Cada ícone é um componente `<name>`
  com a propriedade `variant` (regular | solid, e brands para logos), cor ligada a `foreground` (a instância herda a cor do contexto).
  O catálogo completo do Font Awesome 7 já está nas páginas Ícones · Font Awesome e Ícones · brands: não recrie ícones.
  Em todo nó de ícone dentro de um componente (inclusive fixos, como chevron e remover), use `isExposedInstance = true`: o seletor
  `variant` (regular | solid) aparece no painel da instância, sem precisar entrar no ícone.
  Cuidado ao trocar `preferredValues` em lote: só em propriedades de ícone (`*IconName`/`iconName`), nunca em slots como `bodyContent`.
- **Grade de variantes:** `figma.combineAsVariants`, variantes em grade legível (linhas = variant, colunas = size × state).
  **A variante padrão é a do canto superior esquerdo** — posicione a combinação default do código (ex.: `primary/default/default`) lá.
- **Opacidade em fills ligados a variável (armadilha):** `paint.opacity` num fill/stroke ligado a variável **não é herdado pelas instâncias** (a variante renderiza certo, a instância fica sólida; `inst.fills[0].opacity` lê 1). Para translucidez use, nesta ordem: (1) variável que já traga alpha (`accent`, `*-subtle`); (2) `node.opacity` em texto, ícone (instância), retângulo ou elipse; (3) uma camada filha `Sobreposição` (retângulo absoluto, constraints STRETCH, mesmos raios ligados, `opacity` do nó); (4) para bordas, retângulos `Linha` com `opacity`. Ao gravar um paint ligado com opacidade, atribua o paint e depois releia e regrave (`n.fills = n.fills.map(q => ({...q, opacity}))`); `{...paint, opacity}` direto zera a opacidade.
- **Fills ligados a variável, em massa:** depois de reatribuir `fills`/`strokes`, compare `paint.color` com `variable.resolveForConsumer(node).value`.
  Com a cor bruta `{0,0,0}` do helper, alguns paints renderizam pretos mesmo com binding (aconteceu no Button outline). Regrave a cor resolvida e confirme com screenshot.
- Armadilhas do ledger: `createAutoLayout()` põe fill branco — `fills = []` nos frames internos; `resize()` volta o sizing para
  FIXED — reaplique `primaryAxisSizingMode = "AUTO"` / `layoutSizing* = "HUG"` depois.
- `description` do COMPONENT_SET: uma frase de uso + link da story do Storybook e caminho do código.

## 2. Documentação na página do componente

Frame de documentação ao lado do set (mesmo modelo das páginas Button/Input/Tag), só com variáveis e estilos de texto:
**Quando usar** · **Quando não usar** · **Propriedades** (tabela Figma = React, valores) · **Exemplos** (instâncias reais do set).
Se o componente muda algo relevante, registre na página Changelog.

## 3. Auditoria (obrigatória) e screenshot

Script read-only sobre o set e o frame de docs que retorna listas vazias para:
- fills/strokes `SOLID` sem `boundVariables.color`;
- raio > 0 sem binding nos cantos; padding/itemSpacing > 0 sem binding;
- TEXT sem `textStyleId`; efeitos sem `effectStyleId`;
- nomes padrão (`Frame 12`, `Rectangle`, `Text`), instâncias destacadas (detached);
- propriedades do set ≠ props do manifesto.

Depois, **um** screenshot do set (e um após correção visual, se houver).

## 4. Atualizar referências

1. `docs/superpowers/notes/figma-library-index.json`: `nodeId`, `key`, `type`, `page`, `variantCount` e `properties`
   (`componentPropertyDefinitions` lido do COMPONENT_SET — nunca de uma variante), e `icons` para ícones novos.
2. `manifest/components.json`: `figma` (`name`, `nodeId`, `key`, `page`, `url` = `https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=<id com ":"→"-">`)
   e `props` cobrindo **todas** as propriedades do Figma.
3. `docs/superpowers/notes/figma-build-state.json`: componente, docFrame, página, decisões/notas novas.
4. Link do Figma na story (`parameters.docs.description.component`).
5. Rode o teste do manifesto (falha se índice, manifesto e código divergirem):

```bash
export FONTAWESOME_PACKAGE_TOKEN="$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('FONTAWESOME_PACKAGE_TOKEN','User')" | tr -d '\r')" && pnpm --filter @gsilisqui/ui exec vitest run test/manifest.test.ts
```

Divergência entre Figma e código (nome de variante, valor visual) → **pergunte ao dono** qual lado vale; não "ajuste" o código sozinho.
