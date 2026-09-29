---
name: sync-tokens
description: Use when the designer changed variables in the OPA Design System Figma file and asks to "sincronizar os tokens" (Figma → packages/tokens/src/*.json + PR), or when token JSON changed in code and the Figma variables must be updated (JSON → Figma). Always ends by verifying Figma resolved values against packages/tokens/generated/tokens.css.
---

# sync-tokens — variáveis do Figma ↔ `packages/tokens/src/*.json`

Arquivo Figma: `UW4As1KdSaPboQ3sNMAbCi`. Sem API REST de variáveis (plano Professional): tudo via `use_figma`.
**Antes de qualquer `use_figma`:** carregue `figma:figma-use` (e `figma:figma-generate-library` para escrita).
Chamadas `use_figma` **em sequência**, nunca em paralelo. Leia `docs/superpowers/notes/figma-build-state.json`.

## Mapa Figma ↔ JSON ↔ CSS

| Coleção (modos) | Nome no Figma | JSON | CSS |
|---|---|---|---|
| `Primitives` (Value) | `brand/600`, `neutral/alpha-10`, `brand-dark/600` | `primitives.json` → `color.brand.600` | `--opa-brand-600` |
| `Semantic` (Light, Dark) | `primary`, `primary-subtle-foreground` | `semantic.light.json` / `semantic.dark.json` → `color.primary` = `{color.brand.600}` | `--primary` em `:root` / `.dark` |
| `Component` (Value) | `tag-bg`, `tag-foreground`, `tag-border` | `component.json` → `{color.accent}` | `--tag-bg` |
| `Spacing` (Value) | `0_5`, `1_5` (Figma não aceita `.`) | `tailwind-scales.json → spacing["0.5"]` | Tailwind nativo |
| `Radius` (Value) | `xs`…`4xl`, `none`, `full` (Tailwind v4) | `tailwind-scales.json → radius` | Tailwind nativo |

- Cores em hex `#rrggbb` ou `#rrggbbaa` (alfa em 2 dígitos: 0.1 → `1a`).
- Semantic só referencia Primitives (família Light no modo Light, `-dark` no modo Dark); Component só referencia Semantic.
  O build (`packages/tokens/scripts/resolve.ts`) rejeita violações de camada.
- Spacing/Radius/sombras são **só JSON → Figma** (o build do CSS ignora `tailwind-scales.json`).
- Tipografia (`typography.json`) ↔ estilos de texto `text-{size}/{regular|medium|bold}`; mudanças de tipografia: confirme com o dono.

## A. Figma → JSON (fluxo principal)

1. Leia as variáveis (read-only):

```js
const toHex = ({ r, g, b, a = 1 }) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a) : ""}`;
};
const wanted = ["Primitives", "Semantic", "Component"]; // Spacing/Radius só se o dono pedir
const collections = (await figma.variables.getLocalVariableCollectionsAsync()).filter((c) => wanted.includes(c.name));
const out = {};
for (const c of collections) {
  const vars = {};
  for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    const values = {};
    for (const m of c.modes) {
      const raw = v.valuesByMode[m.modeId];
      if (raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS") {
        const target = await figma.variables.getVariableByIdAsync(raw.id);
        values[m.name] = `{${target ? target.name : raw.id}}`;
      } else if (raw && typeof raw === "object" && "r" in raw) values[m.name] = toHex(raw);
      else values[m.name] = raw;
    }
    vars[v.name] = values;
  }
  out[c.name] = { modes: c.modes.map((m) => m.name), vars };
}
return out;
```

   Se o retorno for grande, rode uma coleção por chamada.
2. Converta nomes: `brand/600` → `color.brand.600`; alias `{neutral/200}` → `{color.neutral.200}`; semântico `primary` → `color.primary`.
3. Reescreva **só os valores** em `packages/tokens/src/{primitives,semantic.light,semantic.dark,component}.json`, mantendo
   `$description`, `$type`, ordem e formato. Nome novo ou removido no Figma: **pergunte ao dono** antes (vira API pública:
   `--<nome>` e `bg-<nome>`; remoção é breaking).
4. `pnpm tokens:build && pnpm --filter @gsilisqui/tokens run test` (com o export do token do Font Awesome se for rodar `pnpm verify`).
5. Faça a verificação (seção C).
6. Branch `chore/sync-tokens-<data>`, commit de `src/` + `generated/`, changeset `@gsilisqui/tokens` (e `@gsilisqui/ui`, que
   embute o tema) — patch para ajuste de valor, minor para token novo, major para remoção/renomeação.
7. PR (API REST, ver `CLAUDE.md`) com **diff legível**: tabelas "Alterados" (`token · modo · antes → depois`), "Novos" e "Removidos".

## B. JSON → Figma

Idempotente, **por nome** (nunca apague e recrie: quebraria os bindings dos componentes). Cole os dados do JSON no script
(o plugin não lê arquivos). Para cada token:

- Ache a coleção pelo nome (crie só se não existir, com os modos acima) e a variável pelo nome dentro dela; crie se faltar
  (`figma.variables.createVariable(name, collection, "COLOR" | "FLOAT")`).
- Valor por modo: primitivo = cor (`{r,g,b,a}` 0–1); semântico/componente = `figma.variables.createVariableAlias(alvo)`
  (alvo buscado por nome na coleção de baixo). Spacing: nome com `.` → `_` (`0.5` → `0_5`), valor em px (número).
- `codeSyntax` WEB: `v.setVariableCodeSyntax("WEB", …)` — primitivo `var(--opa-<grupo>-<degrau>)`; semântico/componente
  `var(--<nome>)`; spacing/radius = `$extensions.css` do `tailwind-scales.json` (ex.: `calc(var(--spacing) * 0.5)`, `var(--radius-xl)`).
- **Escopos** (sempre explícitos; nunca `ALL_SCOPES`):

| Variáveis | `scopes` |
|---|---|
| Primitives (todos) | `[]` (escondidos dos seletores; nunca usados direto) |
| Fundos: `background`, `card`, `popover`, `secondary`, `muted`, `input-background`, `tag-bg` | `FRAME_FILL`, `SHAPE_FILL` |
| Textos: `*-foreground`, `foreground-secondary`, `tag-foreground` | `SHAPE_FILL`, `TEXT_FILL` |
| Sólidos de status: `primary`, `destructive`, `success`, `warning`, `info` | `FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR` |
| Subtle: `*-subtle` | `FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR`, `EFFECT_COLOR` |
| `accent` | `FRAME_FILL`, `SHAPE_FILL`, `STROKE_COLOR` |
| `border`, `input`, `tag-border` | `STROKE_COLOR` |
| `ring` | `STROKE_COLOR`, `EFFECT_COLOR` |
| Spacing | `WIDTH_HEIGHT`, `GAP` |
| Radius | `CORNER_RADIUS` |

  Token semântico novo: escolha a linha pelo papel e confirme com o dono.
- Retorne contagens `{ created, updated, unchanged }` por coleção e confira com o JSON
  (hoje: Primitives 154, Semantic 39, Component 3, Spacing 21, Radius 10). Atualize o ledger se as contagens mudarem.

## C. Verificação (sempre, nos dois sentidos)

Compare os valores **resolvidos** dos dois lados, por modo:

1. Figma (read-only): para cada variável de `Semantic` e `Component`, siga a cadeia de aliases até a cor final em cada modo
   (`Light`/`Dark`; Component usa o modo do Semantic) e retorne `{ light: { nome: hex }, dark: { nome: hex } }`.
   Para `Primitives`, retorne `{ nome-css: hex }` com `brand/600` → `opa-brand-600`.
2. Código: leia `packages/tokens/generated/tokens.css`, separe o bloco `:root { … }` e o `.dark { … }`, e resolva `var(--x)` até o hex
   (`.dark` herda de `:root` o que não redefine), por exemplo com um script Node descartável no scratchpad:

```js
import { readFileSync } from "node:fs";
const css = readFileSync("packages/tokens/generated/tokens.css", "utf8");
const block = (sel) => Object.fromEntries([...(css.split(sel + " {")[1] ?? "").split("}")[0].matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const root = block(":root"), dark = { ...root, ...block(".dark") };
const resolve = (vars, v) => { const m = /^var\(--([\w-]+)\)$/.exec(v); return m ? resolve(vars, vars[m[1]]) : v.toLowerCase(); };
const resolved = (vars) => Object.fromEntries(Object.keys(vars).map((k) => [k, resolve(vars, vars[k])]));
console.log(JSON.stringify({ light: resolved(root), dark: resolved(dark) }));
```

3. Diferença esperada = **zero** (mesmos nomes, mesmos hex, incluindo alfa). Liste qualquer divergência ao dono antes de concluir.
   Spacing/Radius: compare com `tailwind-scales.json` (px) trocando `_` por `.`.
