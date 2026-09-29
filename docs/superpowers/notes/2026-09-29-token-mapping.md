# Proposta de mapeamento de tokens: Figma → JSON

> **Status: APROVADO** (2026-09-29). As decisões finais estão na seção 6 e prevalecem sobre a proposta das seções 1 a 5. Aplicado em `packages/tokens/src`.
> Fonte: Figma "Component Library" (`7FS6JptRPLnco6VSAEAOAH`), extraído em 2026-09-29. Dados brutos em [`2026-09-29-figma-dump.json`](./2026-09-29-figma-dump.json).

## Resumo

- **O que tem no Figma:** coleção **Colors** (modos Light e Dark, 117 variáveis: 78 de paleta, 20 `Semantic/*` e 19 `Component/*`), coleção **Tokens** (1 modo, 22 variáveis de spacing e radius, fora do escopo desta task) e **47 text styles** (39 `Default/*` + 8 `Icons/*`, que foram ignorados).
- **Primitivos:** 155 (78 na família Light + 77 na família `-dark`). No Figma, a paleta **muda de valor por modo** (ex.: `Primary/100` é `#d3d2f4` no Light e `#07071e` no Dark), e o JSON não tem modo nos primitivos. Por isso a proposta cria uma família `-dark` (ex.: `brand-dark.100`) com os valores do modo Dark (Dúvida 1).
- **Semânticos:** 33 tokens: 13 vêm de variáveis semânticas do Figma, 4 de variáveis de componente do Chip, 13 de evidência em componentes (primitivo ligado direto) e 3 são sugestões ⚠️. Mais 3 tokens novos ⚠️ (opcionais).
- **As semânticas do Figma são poucas** (fundos, textos, bordas, 1 hover). Cores de ação e status (primary, destructive, success etc.) vêm dos primitivos que os componentes usam direto (Button, Chip, Input), marcadas com 🔎.
- **Componente:** a Tag (Chip no Figma) usa os `*-subtle` semânticos nas variantes coloridas. `tag-*` fica só para a variante Neutral.
- **Tipografia:** 13 tamanhos (`xs`…`9xl`), Inter, pesos Regular/Medium/Bold. **Atenção:** no Figma, `sm` = 12px e `base` = 14px, um degrau abaixo do padrão do Tailwind (Dúvida 17).
- **Principais decisões em aberto:** família `-dark` nos primitivos (1), fundo da tela vs card (3), um nível de texto a mais para `Gray/900` (4), Input preenchido (6), a variante Yellow da Tag (10) e o deslocamento dos nomes de tamanho de texto (17).

Legenda da coluna "Origem": ✅ = existe variável no Figma com esse papel · 🔎 = o componente do Figma usa esse primitivo direto (sem variável semântica) · ⚠️ = sugestão, sem equivalente no Figma.

---

## 1. Primitivos

Regras: os degraus numéricos do Figma são mantidos e só os grupos são renomeados. As cores com opacidade viram primitivos com alfa (`#rrggbbaa`) com o nome `alpha-{porcentagem}`.

| Grupo Figma | JSON (Light) | JSON (Dark) | Por quê |
|---|---|---|---|
| `Primary` | `brand` | `brand-dark` | Nome da spec (§7.1). |
| `Secondary` | `orange` | `orange-dark` | `secondary` confundiria com o semântico `secondary` do Shadcn (que aqui é o botão Neutral, cinza). |
| `Green` | `green` | `green-dark` | |
| `Blue` | `blue` | `blue-dark` | |
| `Yellow` | `yellow` | `yellow-dark` | O provisório usava `amber`; o Figma usa `yellow`. |
| `Red` | `red` | `red-dark` | |
| `Gray` | `neutral` | `neutral-dark` | Nome da spec (§7.1). |
| `Destaque/Highlight` | `highlight.500` | (não precisa) | Cor única, igual nos dois modos. Só aparece no paint style "Brand Gradient". |

Como fica no JSON (exemplo):

```json
"brand":      { "600": { "$value": "#3a2fc1" }, "alpha-10": { "$value": "#3a2fc11a" } },
"brand-dark": { "600": { "$value": "#3a2fc1" }, "alpha-30": { "$value": "#3a2fc14d" } }
```

No CSS gerado, isso vira `--opa-brand-600`, `--opa-brand-dark-600` etc. Os primitivos não viram utilitários do Tailwind.


#### Primary → `brand` / `brand-dark`

| Figma | Light (hex) | JSON (família Light) | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Primary/100` | `#d3d2f4` | `color.brand.100` | `#07071e` | `color.brand-dark.100` |
| `Primary/200` | `#acafec` | `color.brand.200` | `#171363` | `color.brand-dark.200` |
| `Primary/300` | `#7c82e4` | `color.brand.300` | `#1e197a` | `color.brand-dark.300` |
| `Primary/400` | `#5c6bde` | `color.brand.400` | `#261e91` | `color.brand-dark.400` |
| `Primary/500` | `#4950d1` | `color.brand.500` | `#2f25a9` | `color.brand-dark.500` |
| `Primary/600` | `#3a2fc1` | `color.brand.600` | `#3a2fc1` | `color.brand-dark.600` |
| `Primary/700` | `#2c23a3` | `color.brand.700` | `#4649ce` | `color.brand-dark.700` |
| `Primary/800` | `#221b85` | `color.brand.800` | `#5460d9` | `color.brand-dark.800` |
| `Primary/900` | `#191569` | `color.brand.900` | `#6974e0` | `color.brand-dark.900` |
| `Primary/1000` | `#07071e` | `color.brand.1000` | `#b7baf0` | `color.brand-dark.1000` |
| `Primary/Opacity` | `#3a2fc11a` | `color.brand.alpha-10` | `#3a2fc14d` | `color.brand-dark.alpha-30` |

#### Secondary → `orange` / `orange-dark`

| Figma | Light (hex) | JSON (família Light) | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Secondary/100` | `#fff1e9` | `color.orange.100` | `#180d00` | `color.orange-dark.100` |
| `Secondary/200` | `#ffe4d2` | `color.orange.200` | `#301900` | `color.orange-dark.200` |
| `Secondary/300` | `#ffc9a5` | `color.orange.300` | `#603200` | `color.orange-dark.300` |
| `Secondary/400` | `#ffad78` | `color.orange.400` | `#8f4b00` | `color.orange-dark.400` |
| `Secondary/500` | `#ff924b` | `color.orange.500` | `#bf6400` | `color.orange-dark.500` |
| `Secondary/600` | `#ef7d00` | `color.orange.600` | `#ef7d00` | `color.orange-dark.600` |
| `Secondary/700` | `#cc5f18` | `color.orange.700` | `#f29733` | `color.orange-dark.700` |
| `Secondary/800` | `#994712` | `color.orange.800` | `#f5b166` | `color.orange-dark.800` |
| `Secondary/900` | `#66300c` | `color.orange.900` | `#f9cb99` | `color.orange-dark.900` |
| `Secondary/1000` | `#331806` | `color.orange.1000` | `#fce5cc` | `color.orange-dark.1000` |
| `Secondary/Opacity Orange` | `#ef7d001a` | `color.orange.alpha-10` | `#ef7d0033` | `color.orange-dark.alpha-20` |

#### Green → `green` / `green-dark`

| Figma | Light (hex) | JSON (família Light) | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Green/100` | `#e6f4e7` | `color.green.100` | `#000f02` | `color.green-dark.100` |
| `Green/200` | `#cce9d0` | `color.green.200` | `#001d04` | `color.green-dark.200` |
| `Green/300` | `#99d3a0` | `color.green.300` | `#003a07` | `color.green-dark.300` |
| `Green/400` | `#66bd71` | `color.green.400` | `#00570b` | `color.green-dark.400` |
| `Green/500` | `#33a741` | `color.green.500` | `#00740e` | `color.green-dark.500` |
| `Green/600` | `#009112` | `color.green.600` | `#009112` | `color.green-dark.600` |
| `Green/700` | `#00740e` | `color.green.700` | `#33a741` | `color.green-dark.700` |
| `Green/800` | `#00570b` | `color.green.800` | `#66bd71` | `color.green-dark.800` |
| `Green/900` | `#003a07` | `color.green.900` | `#99d3a0` | `color.green-dark.900` |
| `Green/1000` | `#001d04` | `color.green.1000` | `#cce9d0` | `color.green-dark.1000` |
| `Green/Opacity Green` | `#0091121a` | `color.green.alpha-10` | `#00911233` | `color.green-dark.alpha-20` |

#### Blue → `blue` / `blue-dark`

| Figma | Light (hex) | JSON (família Light) | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Blue/100` | `#e6f4fb` | `color.blue.100` | `#000e15` | `color.blue-dark.100` |
| `Blue/200` | `#cce8f7` | `color.blue.200` | `#001c2b` | `color.blue-dark.200` |
| `Blue/300` | `#99d2ef` | `color.blue.300` | `#003956` | `color.blue-dark.300` |
| `Blue/400` | `#66bbe6` | `color.blue.400` | `#005580` | `color.blue-dark.400` |
| `Blue/500` | `#33a5de` | `color.blue.500` | `#0072ab` | `color.blue-dark.500` |
| `Blue/600` | `#008ed6` | `color.blue.600` | `#008ed6` | `color.blue-dark.600` |
| `Blue/700` | `#0072ab` | `color.blue.700` | `#33a5de` | `color.blue-dark.700` |
| `Blue/800` | `#005580` | `color.blue.800` | `#66bbe6` | `color.blue-dark.800` |
| `Blue/900` | `#003956` | `color.blue.900` | `#99d2ef` | `color.blue-dark.900` |
| `Blue/1000` | `#001c2b` | `color.blue.1000` | `#cce8f7` | `color.blue-dark.1000` |
| `Blue/Opacity Blue` | `#008ed61a` | `color.blue.alpha-10` | `#008ed633` | `color.blue-dark.alpha-20` |

#### Yellow → `yellow` / `yellow-dark`

| Figma | Light (hex) | JSON (família Light) | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Yellow/100` | `#fff9e6` | `color.yellow.100` | `#1a1400` | `color.yellow-dark.100` |
| `Yellow/200` | `#fff3cc` | `color.yellow.200` | `#332700` | `color.yellow-dark.200` |
| `Yellow/300` | `#ffe799` | `color.yellow.300` | `#664e00` | `color.yellow-dark.300` |
| `Yellow/400` | `#ffdb66` | `color.yellow.400` | `#997500` | `color.yellow-dark.400` |
| `Yellow/500` | `#ffcf33` | `color.yellow.500` | `#cc9c00` | `color.yellow-dark.500` |
| `Yellow/600` | `#ffc300` | `color.yellow.600` | `#ffc300` | `color.yellow-dark.600` |
| `Yellow/700` | `#cc9c00` | `color.yellow.700` | `#ffcf33` | `color.yellow-dark.700` |
| `Yellow/800` | `#997500` | `color.yellow.800` | `#ffdb66` | `color.yellow-dark.800` |
| `Yellow/900` | `#664e00` | `color.yellow.900` | `#ffe799` | `color.yellow-dark.900` |
| `Yellow/1000` | `#332700` | `color.yellow.1000` | `#fff3cc` | `color.yellow-dark.1000` |
| `Yellow/Opacity Yellow` | `#ffc30026` | `color.yellow.alpha-15` | `#ffc3001a` | `color.yellow-dark.alpha-10` |

#### Red → `red` / `red-dark`

| Figma | Light (hex) | JSON (família Light) | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Red/100` | `#fbe8e7` | `color.red.100` | `#150202` | `color.red-dark.100` |
| `Red/200` | `#f6d0cf` | `color.red.200` | `#2a0403` | `color.red-dark.200` |
| `Red/300` | `#eda19f` | `color.red.300` | `#540806` | `color.red-dark.300` |
| `Red/400` | `#e57370` | `color.red.400` | `#7f0d0a` | `color.red-dark.400` |
| `Red/500` | `#dc4440` | `color.red.500` | `#a9110d` | `color.red-dark.500` |
| `Red/600` | `#d31510` | `color.red.600` | `#d31510` | `color.red-dark.600` |
| `Red/700` | `#a9110d` | `color.red.700` | `#dc4440` | `color.red-dark.700` |
| `Red/800` | `#7f0d0a` | `color.red.800` | `#e57370` | `color.red-dark.800` |
| `Red/900` | `#540806` | `color.red.900` | `#eda19f` | `color.red-dark.900` |
| `Red/1000` | `#2a0403` | `color.red.1000` | `#f6d0cf` | `color.red-dark.1000` |
| `Red/Opacity Red` | `#d315101a` | `color.red.alpha-10` | `#d3151033` | `color.red-dark.alpha-20` |

#### Gray → `neutral` / `neutral-dark`

| Figma | Light (hex) | JSON (família Light) | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Gray/100` | `#f6f7f8` | `color.neutral.100` | `#1a1d24` | `color.neutral-dark.100` |
| `Gray/200` | `#edeef2` | `color.neutral.200` | `#21252f` | `color.neutral-dark.200` |
| `Gray/300` | `#e7e9ed` | `color.neutral.300` | `#2a2f3c` | `color.neutral-dark.300` |
| `Gray/400` | `#e2e3e9` | `color.neutral.400` | `#353a4a` | `color.neutral-dark.400` |
| `Gray/500` | `#d2d5de` | `color.neutral.500` | `#444b5e` | `color.neutral-dark.500` |
| `Gray/600` | `#bec3cf` | `color.neutral.600` | `#5a6175` | `color.neutral-dark.600` |
| `Gray/700` | `#989db3` | `color.neutral.700` | `#6f7590` | `color.neutral-dark.700` |
| `Gray/800` | `#6d748e` | `color.neutral.800` | `#8a90a9` | `color.neutral-dark.800` |
| `Gray/900` | `#434b5a` | `color.neutral.900` | `#c6cede` | `color.neutral-dark.900` |
| `Gray/1000` | `#282d37` | `color.neutral.1000` | `#ebeef5` | `color.neutral-dark.1000` |
| `Gray/Opacity Gray` | `#6d748e1a` | `color.neutral.alpha-10` | `#5a61751a` | `color.neutral-dark.alpha-10` |

#### Destaque → `highlight`

| Figma | Light (hex) | JSON | Dark (hex) | JSON (família Dark) |
|---|---|---|---|---|
| `Destaque/Highlight` | `#ff646c` | `color.highlight.500` | `#ff646c` | (mesmo valor nos dois modos, não precisa de `-dark`) |

**Não viram primitivos na v1** (são cores literais com alfa guardadas em variáveis semânticas ou de componente do Figma, ver Dúvida 15): `Semantic/Main/Surface/Primary-opacity-0/10/20`, `Semantic/Main/Surface/Secondary-opacity-0/20` e `Component/Kbd/Foreground/Border`.

---

## 2. Semânticos (Light / Dark)

Todos os valores Light apontam para a família Light (`neutral.*`) e todos os Dark para a família `-dark`. A coluna de contraste (WCAG) mede o `*-foreground` sobre o fundo do par; fundos translúcidos foram compostos sobre `card`.

| | Token | Light | Dark | Origem no Figma | Contraste L / D | Nota |
|---|---|---|---|---|---|---|
|  | `background` | `neutral.200` `#edeef2` | `neutral-dark.100` `#1a1d24` | ✅ variável semântica: `Semantic/Main/Surface/Primary` |  | Fundo da tela (frame 'Chat' atrás do Command menu). É uma interpretação, ver Dúvida 3. |
|  | `foreground` | `neutral.1000` `#282d37` | `neutral-dark.1000` `#ebeef5` | ✅ variável semântica: `Semantic/Main/Content/Default` |  | Texto padrão. |
|  | `card` | `neutral.100` `#f6f7f8` | `neutral-dark.200` `#21252f` | ✅ variável semântica: `Semantic/Main/Surface/Secondary` |  | Cards, instâncias de Modal, Command menu, Input SM. |
|  | `card-foreground` | `neutral.1000` `#282d37` | `neutral-dark.1000` `#ebeef5` | ✅ variável semântica: `Semantic/Main/Content/Default` | 12.9 / 13.2 |  |
|  | `popover` | `neutral.100` `#f6f7f8` | `neutral-dark.200` `#21252f` | ✅ variável semântica: `Semantic/Main/Surface/Secondary` |  | Lista do Command menu e do Select. |
|  | `popover-foreground` | `neutral.1000` `#282d37` | `neutral-dark.1000` `#ebeef5` | ✅ variável semântica: `Semantic/Main/Content/Default` | 12.9 / 13.2 |  |
|  | `primary` | `brand.600` `#3a2fc1` | `brand-dark.600` `#3a2fc1` | 🔎 evidência em componente: `Primary/600` (primitivo direto) |  | Button Primary (bg). Não há variável semântica: o botão usa o primitivo direto. |
|  | `primary-foreground` | `neutral.100` `#f6f7f8` | `neutral-dark.1000` `#ebeef5` | ✅ variável semântica: `Semantic/Main/Content/Fixed White` | 8.3 / 7.7 | Texto do Button Primary. |
|  | `secondary` | `neutral.400` `#e2e3e9` | `neutral-dark.400` `#353a4a` | 🔎 evidência em componente: `Gray/400` (primitivo direto) |  | Button **Neutral** (bg). |
|  | `secondary-foreground` | `neutral.1000` `#282d37` | `neutral-dark.1000` `#ebeef5` | ✅ variável semântica: `Semantic/Main/Content/Default` | 10.8 / 9.7 | Texto do Button Neutral. |
|  | `muted` | `neutral.200` `#edeef2` | `neutral-dark.300` `#2a2f3c` | ✅ variável semântica: `Semantic/Main/Surface/Tertiary` |  | Container das Tabs segmentadas, SearchBar. |
|  | `muted-foreground` | `neutral.800` `#6d748e` | `neutral-dark.800` `#8a90a9` | 🔎 evidência em componente: `Gray/800` (primitivo direto) | 4.0 / 4.2 | helper-text, hint, placeholder (Input Default), descrição de card. |
|  | `accent` | `neutral.alpha-10` `#6d748e1a` | `neutral-dark.alpha-10` `#5a61751a` | 🔎 evidência em componente: `Gray/Opacity Gray` (primitivo direto) |  | Hover do Button Quiet/Outline, hover do Select Item (single), Tabcard. Alternativa: `Hover/Primary` (Dúvida 5). |
|  | `accent-foreground` | `neutral.1000` `#282d37` | `neutral-dark.1000` `#ebeef5` | ✅ variável semântica: `Semantic/Main/Content/Default` | 11.4 / 12.2 | Texto e ícone do Button Quiet. |
|  | `destructive` | `red.700` `#a9110d` | `red-dark.700` `#dc4440` | 🔎 evidência em componente: `Red/700` (primitivo direto) |  | Button Destructive (bg). O erro do Input usa `Red/600` (Dúvida 7). |
|  | `destructive-foreground` | `neutral.100` `#f6f7f8` | `neutral-dark.1000` `#ebeef5` | ✅ variável semântica: `Semantic/Main/Content/Fixed White` | 7.1 / 3.7 | Texto do Button Destructive. |
|  | `destructive-subtle` | `red.alpha-10` `#d315101a` | `red-dark.alpha-20` `#d3151033` | 🔎 evidência em componente: `Red/Opacity Red` (primitivo direto) |  | Hover do Button Red Quiet; Chip Danger. |
|  | `destructive-subtle-foreground` | `red.700` `#a9110d` | `red-dark.800` `#e57370` | ✅ variável de componente (Chip): `Component/Chips/Content/Error` | 6.0 / 4.7 | Texto do Chip Danger. O Red Quiet usa `Red/700` nos dois modos (Dúvida 8). |
|  | `success` | `green.600` `#009112` | `green-dark.600` `#009112` | 🔎 evidência em componente: `Green/600` (primitivo direto) |  | Input Success (borda e texto). |
| ⚠️ | `success-foreground` | `neutral.100` `#f6f7f8` | `neutral-dark.1000` `#ebeef5` | ⚠️ sugestão: `Semantic/Main/Content/Fixed White` | 3.9 / 3.6 | Não há fundo verde sólido com texto no Figma. Segue o padrão de primary/destructive. |
|  | `success-subtle` | `green.alpha-10` `#0091121a` | `green-dark.alpha-20` `#00911233` | 🔎 evidência em componente: `Green/Opacity Green` (primitivo direto) |  | Hover do Button Green Quiet; Chip Sucess. |
|  | `success-subtle-foreground` | `green.700` `#00740e` | `green-dark.800` `#66bd71` | ✅ variável de componente (Chip): `Component/Chips/Content/Success` | 4.9 / 5.4 | Texto do Chip Sucess. |
|  | `warning` | `orange.600` `#ef7d00` | `orange-dark.600` `#ef7d00` | 🔎 evidência em componente: `Secondary/600` (primitivo direto) |  | Input Warning (borda e texto). **Warning é laranja**: o Chip "Warning" também usa Secondary. |
| ⚠️ | `warning-foreground` | `neutral.1000` `#282d37` | `neutral-dark.100` `#1a1d24` | ⚠️ sugestão: `Semantic/Main/Content/Fixed Black` | 5.0 / 6.1 | Branco sobre `#ef7d00` tem contraste de só ~2,6:1; o preto fixo passa de 5:1. |
|  | `warning-subtle` | `orange.alpha-10` `#ef7d001a` | `orange-dark.alpha-20` `#ef7d0033` | 🔎 evidência em componente: `Secondary/Opacity Orange` (primitivo direto) |  | Chip Warning. |
|  | `warning-subtle-foreground` | `orange.700` `#cc5f18` | `orange-dark.800` `#f5b166` | ✅ variável de componente (Chip): `Component/Chips/Content/Warning` | 3.4 / 6.1 | Texto do Chip Warning. |
|  | `info` | `blue.600` `#008ed6` | `blue-dark.600` `#008ed6` | 🔎 evidência em componente: `Blue/600` (primitivo direto) |  | Ícones de info (Input, Select, Checkbox, Tooltip). |
| ⚠️ | `info-foreground` | `neutral.100` `#f6f7f8` | `neutral-dark.1000` `#ebeef5` | ⚠️ sugestão: `Semantic/Main/Content/Fixed White` | 3.4 / 3.1 | Não há fundo azul sólido com texto no Figma. Contraste abaixo de 4,5:1 (ver coluna). |
|  | `info-subtle` | `blue.alpha-10` `#008ed61a` | `blue-dark.alpha-20` `#008ed633` | 🔎 evidência em componente: `Blue/Opacity Blue` (primitivo direto) |  | Chip Info; chips dentro do Select. |
|  | `info-subtle-foreground` | `blue.700` `#0072ab` | `blue-dark.800` `#66bbe6` | ✅ variável de componente (Chip): `Component/Chips/Content/Info` | 4.4 / 5.6 | Texto do Chip Info. |
|  | `border` | `neutral.400` `#e2e3e9` | `neutral-dark.400` `#353a4a` | ✅ variável semântica: `Semantic/Main/Border/Default` |  | Bordas em geral; Button Outline usa Gray/400 (mesmo valor). |
|  | `input` | `neutral.500` `#d2d5de` | `neutral-dark.500` `#444b5e` | 🔎 evidência em componente: `Gray/500` (primitivo direto) |  | Borda do Input/Select no tamanho Default. O tamanho SM usa `Border/Default` (Dúvida 6). |
|  | `ring` | `brand.400` `#5c6bde` | `brand-dark.800` `#5460d9` | ✅ variável semântica: `Semantic/Main/Border/Primary` |  | Focus do Button; Input em Typing. |

### Tokens novos propostos (⚠️ fora da lista da spec)

Só entram se você aprovar. Cada um resolve um caso em que o Figma usa uma cor que nenhum nome do Shadcn cobre.

| | Token | Light | Dark | Origem no Figma | Contraste L / D | Nota |
|---|---|---|---|---|---|---|
| ⚠️ | `primary-subtle` | `brand.alpha-10` `#3a2fc11a` | `brand-dark.alpha-30` `#3a2fc14d` | ⚠️ token novo: `Primary/Opacity` (primitivo direto) |  | Chip Primary; card selecionado (página Modals). Necessário se a Tag tiver a variante Primary. |
| ⚠️ | `primary-subtle-foreground` | `brand.700` `#2c23a3` | `brand-dark.1000` `#b7baf0` | ⚠️ token novo: `Component/Chips/Content/Primary` | 8.8 / 7.3 | Texto do Chip Primary. |
| ⚠️ | `input-background` | `neutral.300` `#e7e9ed` | `neutral-dark.300` `#2a2f3c` | ⚠️ token novo: `Gray/300` (primitivo direto) |  | Fundo preenchido do Input/Select Default. O Input do Shadcn é transparente; sem este token o visual do Figma se perde. |

---

## 3. Componente: Tag (Chip no Figma)

O Chip tem as variantes `Neutral`, `Yellow`, `Primary`, `Warning`, `Sucess`, `Info` e `Danger`, e os tamanhos Default (raio 6px = `rounded-md`) e Medium (raio 8px = `rounded-lg`). Em todas as variantes, **fundo e borda usam a mesma variável translúcida** e o texto usa `Component/Chips/Content/*`.

Proposta: as variantes coloridas usam os semânticos `*-subtle` direto (a spec diz que token de componente só existe se não fizer sentido como semântico global). `tag-*` fica só para a Neutral.

| | Token | Referência (só semântico) | Light | Dark | Origem no Figma |
|---|---|---|---|---|---|
| | `tag-bg` | `{color.accent}` | `#6d748e1a` | `#5a61751a` | ✅ Chip Neutral, fundo `Gray/Opacity Gray` (valor idêntico) |
| ⚠️ | `tag-foreground` | `{color.muted-foreground}` | `#6d748e` | `#8a90a9` | Figma usa `Chips/Content/Neutral` = `Gray/900` (`#434b5a` / `#c6cede`), que não tem semântico equivalente. Contraste com `muted-foreground`: 3,8 / 4,5; com `Gray/900`: 7,3 / 8,9 (Dúvidas 4 e 11) |
| ⚠️ | `tag-border` | `{color.accent}` | `#6d748e1a` | `#5a61751a` | Figma usa a mesma variável do fundo (borda quase invisível). Dúvida 12 |

Variantes coloridas (sem token de componente):

| Variante Figma | Classes na Tag | Semânticos usados |
|---|---|---|
| Primary | `bg-primary-subtle text-primary-subtle-foreground border-primary-subtle` | ⚠️ tokens novos `primary-subtle*` |
| Warning | `bg-warning-subtle text-warning-subtle-foreground border-warning-subtle` | `warning-subtle*` (laranja) |
| Sucess | `bg-success-subtle …` | `success-subtle*` |
| Info | `bg-info-subtle …` | `info-subtle*` |
| Danger | `bg-destructive-subtle …` | `destructive-subtle*` |
| Yellow | ⚠️ sem semântico | Dúvida 10 |

---

## 4. Tipografia

Família: **Inter** em todos os estilos `Default/*`. Nenhum estilo usa JetBrains Mono, que fica só como `font-mono` para código. Letter-spacing é **0% em todos os estilos**, então fica de fora do `typography.json` (equivale a `0em`). Conversão: px ÷ 16 = rem.

| Estilo Figma | Token | size (px → rem) | line-height (px → rem) | letter-spacing | Hoje (padrão do Tailwind) |
|---|---|---|---|---|---|
| `Default/xs/*` | `text-xs` | 10 → `0.625rem` | 12 → `0.75rem` | 0% → `0em` | 12 / 16px |
| `Default/sm/*` | `text-sm` | 12 → `0.75rem` | 16 → `1rem` | 0% → `0em` | 14 / 20px |
| `Default/base/*` | `text-base` | 14 → `0.875rem` | 20 → `1.25rem` | 0% → `0em` | 16 / 24px |
| `Default/lg/*` | `text-lg` | 16 → `1rem` | 24 → `1.5rem` | 0% → `0em` | 18 / 28px |
| `Default/xl/*` | `text-xl` | 18 → `1.125rem` | 26 → `1.625rem` | 0% → `0em` | 20 / 28px |
| `Default/2xl/*` | `text-2xl` | 20 → `1.25rem` | 28 → `1.75rem` | 0% → `0em` | 24 / 32px |
| `Default/3xl/*` | `text-3xl` | 24 → `1.5rem` | 32 → `2rem` | 0% → `0em` | 30 / 36px |
| `Default/4xl/*` | `text-4xl` | 28 → `1.75rem` | 40 → `2.5rem` | 0% → `0em` | 36 / 40px |
| `Default/5xl/*` | `text-5xl` | 32 → `2rem` | 40 → `2.5rem` | 0% → `0em` | 48px / 1 |
| `Default/6xl/*` | `text-6xl` | 40 → `2.5rem` | 50 → `3.125rem` | 0% → `0em` | 60px / 1 |
| `Default/7xl/*` | `text-7xl` | 48 → `3rem` | 60 → `3.75rem` | 0% → `0em` | 72px / 1 |
| `Default/8xl/*` | `text-8xl` | 64 → `4rem` | 80 → `5rem` | 0% → `0em` | 96px / 1 |
| `Default/9xl/*` | `text-9xl` | 80 → `5rem` | 96 → `6rem` | 0% → `0em` | 128px / 1 |

O `typography.json` provisório só vai até `4xl`. A proposta inclui os 13 tamanhos.

**Pesos encontrados** (todos os 13 tamanhos têm os três; não entram no `typography.json`, usam os padrões do Tailwind):

| Figma | Tailwind | Valor |
|---|---|---|
| Regular | `font-normal` | 400 |
| Medium | `font-medium` | 500 |
| Bold | `font-bold` | 700 |

Nenhum peso foge desses três. **Não existe Semi Bold (600)** no Figma (Dúvida 18).

---

## 5. Dúvidas

**Paleta**

1. **Primitivos em duas famílias (`brand` + `brand-dark`)?** No Figma a paleta muda de valor por modo, e no JSON os primitivos não têm modo. A proposta cria `*-dark` com os valores Dark e os mesmos degraus (155 primitivos, 1:1 com o Figma, o que simplifica a sincronização). Alternativa: reaproveitar degraus do Light. Isso só funciona em Green/Blue/Yellow/Red, cujo Dark é o Light espelhado mais um tom extra bem escuro (ex.: `Red/100` Dark = `#150202`). Em Primary/Secondary/Gray o Dark tem cores próprias. Aprovamos as duas famílias?
2. **Nomes dos grupos:** `Primary→brand`, `Secondary→orange`, `Gray→neutral`, `Yellow→yellow`, `Destaque/Highlight→highlight.500`. Ok? `highlight` precisa existir se só aparece num gradiente?

**Superfícies e texto**

3. **Fundo da tela vs card:** proposta `background` = `Surface/Primary` (`#edeef2`, mais cinza) e `card`/`popover` = `Surface/Secondary` (`#f6f7f8`, mais claro). A paleta não tem branco puro. Confirma? Efeitos colaterais: (a) no Light, `muted` (`Surface/Tertiary`) tem o mesmo valor do `background` (`#edeef2`), então o container das Tabs segmentadas some se estiver direto no fundo da tela; (b) o componente Modal usa `Gray/100` direto, que no Dark fica igual ao fundo da tela (`#1a1d24`) em vez de `Surface/Secondary`.
4. **Um nível de texto a mais?** O Figma usa três cinzas de texto: `Gray/1000` (`foreground`), `Gray/900` (labels, corpo do Modal, Tooltip, Chip Neutral, com mais de 150 usos) e `Gray/800` (helper/placeholder → `muted-foreground`). O Shadcn só tem os dois extremos. Criamos um semântico para `Gray/900` (nome a definir, ex.: `foreground-secondary`) ou os labels passam a usar `foreground`/`muted-foreground`?
5. **`accent` (hover):** proposta `Gray/Opacity Gray` (translúcido, usado na maioria dos hovers: Button Quiet/Outline, Select Item single, Tabcard). Alternativa: a variável `Semantic/Main/Hover/Primary` (opaca, `Gray/200`/`Gray/300`, usada no Select Item multi e no Command menu). Qual das duas?
6. **Input:** o tamanho Default usa fundo `Gray/300` + borda `Gray/500`, e o SM usa `Surface/Secondary` + `Border/Default`. Qual é o padrão? Se for o Default: `input` = `Gray/500` + token novo `input-background` (proposta atual). Se for o SM: `input` = `Border/Default`, o fundo usa `card` e nenhum token novo é necessário.

**Status**

7. **Vermelho do `destructive`:** o Button Destructive usa `Red/700` (`#a9110d`), e o erro do Input e o marcador de obrigatório usam `Red/600` (`#d31510`). O Shadcn usa um único `destructive` para os dois. A proposta é `Red/700`. No Dark, o texto branco sobre `#dc4440` fica com contraste de 3,7:1.
8. **`*-subtle-foreground` no Dark:** as variáveis do Chip usam o degrau 800 no Dark (ex.: `Red/800` = `#e57370`), mas os Buttons Red/Green Quiet usam `Red/700`/`Green/700` direto nos dois modos (no Dark, `#dc4440`/`#33a741`). A proposta segue o Chip. Ok?
9. **Texto sobre success/info sólidos** (⚠️): branco sobre `Green/600` dá 3,9:1 e sobre `Blue/600` dá 3,4:1, abaixo de AA (4,5:1) para texto normal. Aceitamos (só ícones e texto grande) ou usamos o preto fixo, como no `warning-foreground`? Além disso, `warning-subtle-foreground` no Light (`#cc5f18` sobre a tinta laranja) dá 3,4:1.

**Tag**

10. **Variante Yellow da Tag:** não há semântico amarelo (`warning` é laranja), e token de componente só pode apontar para semântico. Opções: (a) tirar a variante Yellow; (b) criar um semântico novo (ex.: `highlight-subtle` / `highlight-subtle-foreground` com `Yellow/Opacity Yellow` + `Chips/Content/Yellow`). Além disso, o texto do Chip Yellow no Light tem contraste de 2,2:1.
11. **`tag-foreground`:** depende da Dúvida 4. Se criarmos o semântico de `Gray/900`, a Tag usa ele (fica fiel ao Figma). Se não, fica `muted-foreground` (mais claro) ou `foreground` (mais escuro).
12. **`tag-border`:** o Figma usa na borda a mesma cor translúcida do fundo. Mantemos (`tag-border` = `accent`) ou a Tag fica sem borda?

**Estados**

13. **Hover e active com degraus explícitos:** o Figma usa degraus próprios (Primary 600→700→800, Red 700→800, Gray 400→500→600). O Shadcn usa opacidade (`hover:bg-primary/90`). A proposta para a v1 é seguir o Shadcn, sem tokens de hover. Ou quer tokens `primary-hover` etc.?
14. **Disabled:** o Figma tem `Component/Button/Disabled/Background` (`Primary/400`) e `/Content` (`Primary/200`), além de `Content/Disabled` (`Gray/700`). O Shadcn usa `disabled:opacity-50`. A proposta é seguir o Shadcn na v1 (não mapear). Obs.: no Figma, o Button Destructive Disabled é igual ao Default, o que parece um erro.

**Fora da v1 (confirmar)**

15. **Não mapeados na v1:** `Content/Primary` (texto na cor da marca, mesmo valor do `ring`; se for cor de link, pode virar token novo), `Surface/Quaternary` (aba ativa das Tabs segmentadas), os 5 `Surface/*-opacity-*` (transparências literais, provavelmente para fades), `Border/Secondary/Red/Blue`, `Component/Chart/*` (7 cores; `chart-1…5` ficam para a fase 4 e o Figma tem 7), `Component/Kbd/*` (3) e os paint styles "Brand Gradient" (`#ef7d00→#ff646c`) e "Stroke AI" (gradiente angular). Também aparecem variáveis remotas de outra biblioteca nas páginas de documentação (`border`, `BubbleMessage/*`), que foram ignoradas.
16. **Opacidades inconsistentes:** as cores "Opacity" são 10% no Light e 20% no Dark, com duas exceções: `Primary/Opacity` é 30% no Dark e `Yellow/Opacity Yellow` é 15% no Light e 10% no Dark (invertido). É intencional?

**Tipografia**

17. **Nomes de tamanho deslocados:** no Figma, `xs`=10, `sm`=12 e `base`=14px; no Tailwind padrão são 12, 14 e 16px. Os componentes do Shadcn usam `text-sm` pensando em 14px, que no nosso DS vira 12px. A proposta segue os nomes do Figma (a spec pede nomenclatura Figma = código) e revisa as classes `text-*` ao adaptar cada componente (ex.: `text-sm` → `text-base` onde o Figma usa 14px). Confirma?
18. **Semi Bold:** não existe no Figma, mas o Shadcn usa `font-semibold` em alguns componentes (títulos de Card e Dialog). Trocamos por `font-medium` ou `font-bold`, ou o Figma ganha Semi Bold?
19. **Nome estranho:** o estilo `Default/lg/Regular28` tem o mesmo valor dos outros `lg` (16/24px). Sugestão: renomear no Figma para `Default/lg/Regular`.

**Para o Plano 3 (só registro)**

20. **Coleção Tokens:** o spacing do Figma bate com a escala do Tailwind (`spacing-25` = 2px = `0.5`). Os nomes de radius seguem o **Tailwind v3** (`rounded-sm` = 2px, `rounded-base` = 4px), e no **v4** 2px é `rounded-xs` e 4px é `rounded-sm`. Isso vai importar na biblioteca Figma do Plano 3.

---

## 6. Decisões aprovadas (2026-09-29)

Resultado aplicado: **154 primitivos** (77 na família Light + 77 na família `-dark`), **39 semânticos** (os 33 da proposta + 6 novos), **3 de componente** (`tag-*`) e **13 tamanhos de texto**.

| # | Tema | Decisão |
|---|---|---|
| 1 | Famílias de primitivos | ✔ Duas famílias (`<grupo>` + `<grupo>-dark`), 1:1 com o Figma. |
| 2 | Nomes dos grupos | ✔ Primary→`brand`, Secondary→`orange`, Gray→`neutral`; Green/Blue/Yellow/Red sem mudança. **`highlight` removido** (não é primitivo). |
| 3 | Fundo vs card | ✔ `background` = `neutral.200` / `neutral-dark.100`; `card` e `popover` = `neutral.100` / `neutral-dark.200`. **`muted` = `neutral.300` (`#e7e9ed`) / `neutral-dark.300`**, para se distinguir do fundo no Light. |
| 4 | Nível de texto extra | **Novo** `foreground-secondary` = `neutral.900` / `neutral-dark.900`. |
| 5 | `accent` | ✔ `neutral.alpha-10` / `neutral-dark.alpha-10` (translúcido). |
| 6 | Input | ✔ Input preenchido: `input` = `neutral.500` / `neutral-dark.500`; **novo** `input-background` = `neutral.300` / `neutral-dark.300`. |
| 7 | `destructive` | `red.700` / `red-dark.700` (`#dc4440`), como no Figma. O erro do Input também usa `destructive` (sem token separado). |
| 8 | `*-subtle-foreground` no Dark | ✔ Degrau 800 (variáveis do Chip). |
| 9 | Texto sobre status sólido | `success-foreground` e `info-foreground` = `neutral.100` / `neutral-dark.1000` (texto claro); `warning-foreground` = `neutral.1000` / `neutral-dark.100`; **`warning-subtle-foreground` Light = `orange.800` (`#994712`)**, Dark = `orange-dark.800`. |
| 10 | Tag Yellow | Mantida. **Novos** `highlight-subtle` = `yellow.alpha-15` / `yellow-dark.alpha-10` e `highlight-subtle-foreground` = `yellow.700` / `yellow-dark.800` (de `Component/Chips/Content/Yellow`). |
| 11 | `tag-foreground` | `{color.foreground-secondary}`. |
| 12 | `tag-border` | Mantém a borda sobreposta ao fundo, como no Figma: `tag-border` = `{color.accent}` (igual a `tag-bg`). |
| 13 | Hover/active | ✔ Sem tokens; segue a opacidade do Shadcn. |
| 14 | Disabled | ✔ Sem tokens; segue `disabled:opacity-50` do Shadcn. |
| 15 | Itens fora da v1 | ✔ Continuam fora (Content/Primary, Surface/Quaternary, Surface opacity, Border Secondary/Red/Blue, Chart, Kbd, gradientes). |
| 16 | Opacidades diferentes | São intencionais: os valores do Figma ficam exatos (`brand-dark.alpha-30`, `yellow.alpha-15` / `yellow-dark.alpha-10` etc.). Podem ser revistos depois. |
| 17 | Nomes de tamanho de texto | ✔ Nomes do Figma (`xs`=10, `sm`=12, `base`=14px…), com os 13 tamanhos de `xs` a `9xl`. |
| 18 | Semi Bold | ✔ `font-semibold` → `font-medium` nos componentes (nota para o Plano 2; nada no JSON). |
| 19 | `Default/lg/Regular28` | ✔ O dono renomeia no Figma. |
| 20 | Nomes de radius | Seguir o padrão do Tailwind v4 (nota para o Plano 3). |

Além das decisões acima, também foram aprovados `primary-subtle` = `brand.alpha-10` / `brand-dark.alpha-30` e `primary-subtle-foreground` = `brand.700` / `brand-dark.1000` (variante Primary da Tag).
