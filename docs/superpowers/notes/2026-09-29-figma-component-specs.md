# Specs visuais dos componentes no Figma (Button, Input, Tag, Dialog, Select)

> Extraído (somente leitura) do Figma "Component Library" (`7FS6JptRPLnco6VSAEAOAH`) em 2026-09-29, via `use_figma`.
> Cores traduzidas para os **semânticos aprovados** em [`2026-09-29-token-mapping.md`](./2026-09-29-token-mapping.md) (§2 + §6). Hex = valor Light (Dark entre parênteses quando importa).
> Tipografia com os nomes do DS (`text-xs`=10, `text-sm`=12, `text-base`=14, `text-lg`=16px). Espaçamento em Tailwind v4 (1 = 4px) + px. Raio v4: 2 `rounded-xs`, 4 `rounded-sm`, 6 `rounded-md`, 8 `rounded-lg`, 12 `rounded-xl`, 16 `rounded-2xl`.

**Convenções**

- ❌ = cor do Figma **sem semântico** equivalente (fica fora, ou vira decisão).
- Nas cores "Opacity" do Figma o alfa fica na opacidade da *paint*. Ex.: `Gray/Opacity Gray` = 10% efetivo, igual ao valor de `accent`.
- **Ícones:** no Figma são glifos da fonte **Font Awesome 7 Pro** (text styles `Icons/sm/*` = 12px/16 e `Icons/base/*` = 14px/20), não SVG. O tamanho do ícone é o `font-size`: 12px → `size-3`, 14px → `size-3.5`. Os ícones de info (`info-circle`) em Input/Select usam texto solto de 14px (ou 10px) em **Font Awesome 6 Pro**, sem estilo aplicado.
- **Focus ring (effect style "Focus ring"):** `DROP_SHADOW 0 0 0 2px #3a2fc11a` (a cor é hex solto, não uma variável; o valor é igual a `primary-subtle` no Light).

## Links de referência (screenshots)

As URLs de screenshot do MCP expiram em poucas horas. Os links do Figma são permanentes.

| Componente | Component set | Link Figma | Screenshot (expira) |
|---|---|---|---|
| Button | `36:2938` | https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=36-2938 | https://www.figma.com/api/mcp/asset/a1273e69-a1d7-4318-84b7-71c23dbdf528.png |
| Input Field | `885:5165` | https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=885-5165 | https://www.figma.com/api/mcp/asset/e235318f-1494-4cef-b559-434a97903ee2.png |
| Chip (Tag) | `304:4496` | https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=304-4496 | https://www.figma.com/api/mcp/asset/30c7e7d2-fe4a-4b0a-b39a-3c373c2b24a2.png |
| Modal (Dialog) | `6377:1529` | https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=6377-1529 | https://www.figma.com/api/mcp/asset/0423517e-9317-4bb5-8b7e-7e7b28ba8c55.png |
| Select (trigger) | `885:3949` | https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=885-3949 | https://www.figma.com/api/mcp/asset/c4902552-afa3-492a-9c49-ab90a97e73cc.png |
| Select Item | `6214:164` | https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=6214-164 | https://www.figma.com/api/mcp/asset/06e25900-789f-48c7-8afb-28adae508d72.png |
| Select Popover | `6216:189` | https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=6216-189 | https://www.figma.com/api/mcp/asset/f8d202c6-cecc-4c40-a93b-dd1160980d2e.png |

---

## 1. Button (`36:2938`, página "↳ Button" `2466:10100`)

### Propriedades

| Propriedade | Tipo | Valores / default |
|---|---|---|
| `Type` | variant | `Quiet`, `Primary`, `Neutral`, `Outline`, `Destructive`, `Green Quiet`, `Red Quiet` |
| `Size` | variant | `Default`, `SM`, `LG` |
| `State` | variant | `Active`, `Default`, `Disabled`, `Hover`, `Focus` |
| `Layout` | variant | `Default`, `Icon Only` |
| `Has Leading Icon` | boolean | `false` |
| `Has Trailing Icon` | boolean | `false` |
| `Has Label` | boolean | `true` |
| `Btn_text` | text | `"Button"` |

São 210 variantes (7 × 3 × 5 × 2). Os ícones leading/trailing são glifos (`smile` como placeholder) e herdam a cor do texto.

Mapeamento para os nomes do Shadcn: Primary → `default`, Neutral → `secondary`, Quiet → `ghost`, Outline → `outline`, Destructive → `destructive`. **Red Quiet e Green Quiet não existem no Shadcn** (seriam variantes novas, ex.: `ghost-destructive` / `ghost-success`). O `link` do Shadcn não tem par no Figma.

### Tamanhos

| Size | Altura | Padding (y / x) | Gap | Raio | Texto | Ícone | Icon Only |
|---|---|---|---|---|---|---|---|
| SM | 24px `h-6` | 4 / 8px `py-1 px-2` | 8px `gap-2` | 8px `rounded-lg` | `Default/sm/Regular` → `text-sm font-normal` (12/16) | 12px (`Icons/sm`) | 24×24 `size-6`, ícone 12px, `rounded-lg` |
| Default | 36px `h-9` | 8 / 16px `py-2 px-4` | 8px `gap-2` | 12px `rounded-xl` | `Default/base/Regular` → `text-base font-normal` (14/20) | 14px (`Icons/base`) | 36×36 `size-9`, ícone 14px, `rounded-xl` |
| LG | 48px `h-12` | 12 / 16px `py-3 px-4` | 8px `gap-2` | 16px `rounded-2xl` | `Default/lg/Regular28` → `text-lg font-normal` (16/24) | 14px (`Icons/base`) | 48×48 `size-12`, ícone 14px, `rounded-2xl` |

Sem borda, exceto Outline (1px, `INSIDE`) e Focus (2px, `OUTSIDE`). O peso é **Regular** em todos os tamanhos (o Shadcn usa `font-medium`).

### Cores por Type × State

Valores medidos em Size=Default. Os outros tamanhos usam as mesmas cores.

| Type | Default | Hover | Active | Disabled | Focus |
|---|---|---|---|---|---|
| **Primary** | bg `Primary/600` → `primary` `#3a2fc1`; texto/ícone `Content/Fixed White` → `primary-foreground` | bg `Primary/700` `#2c23a3` (Dark `#4649ce`) ❌ | bg `Primary/800` `#221b85` (Dark `#5460d9`) ❌ | bg `Component/Button/Disabled/Background` (`Primary/400` `#5c6bde`), texto `…/Disabled/Content` (`Primary/200` `#acafec`) ❌ | = Default + anel (ver abaixo) |
| **Neutral** | bg `Gray/400` → `secondary` `#e2e3e9`; texto `Content/Default` → `secondary-foreground` | bg `Gray/500` `#d2d5de` ❌ (valor = `input`) | bg `Gray/600` `#bec3cf` ❌ | bg `Gray/300` `#e7e9ed` (valor = `muted`), texto `Content/Disabled` `Gray/700` `#989db3` ❌ | = Default + anel |
| **Quiet** | sem fundo; texto `Gray/1000` / ícone `Content/Default` → `foreground` | bg `Gray/Opacity Gray` 10% → `accent` | 2 camadas de `Gray/Opacity Gray` (~19%) ❌ | texto `Content/Disabled` `#989db3` ❌ | bg `Surface/Secondary` → `card` + anel |
| **Outline** | sem fundo; borda 1px `Gray/400` → `border`; texto/ícone `Gray/1000` → `foreground` | bg `accent` + borda `border` | 2 camadas de `accent` (~19%) ❌ | borda `Gray/300` ❌; texto `Content/Disabled` ❌ | bg `card` + anel |
| **Destructive** | bg `Red/700` → `destructive` `#a9110d` (Dark `#dc4440`); texto `Content/Fixed White` → `destructive-foreground` | bg `Red/800` `#7f0d0a` (Dark `#e57370`) ❌ | bg `Red/700` (**igual ao Default**) | = Default com **opacidade 40% na camada** → `disabled:opacity-40` | = Default + anel |
| **Red Quiet** | sem fundo; texto/ícone `Red/700` → `destructive` | bg `Red/Opacity Red` 10% → `destructive-subtle` | 2 camadas de `destructive-subtle` (~19%) ❌ | texto `Red/300` `#eda19f` ❌ | bg `card` + anel |
| **Green Quiet** | sem fundo; texto/ícone `Green/700` `#00740e` → `success-subtle-foreground` (Light igual; Dark Figma `#33a741` vs token `#66bd71`) | bg `Green/Opacity Green` 10% → `success-subtle` | 2 camadas de `success-subtle` ❌ | texto `Green/300` `#99d3a0` ❌ | bg `card` + anel |

**Focus (todos os Types):** stroke **2px `OUTSIDE`** em `Semantic/Main/Border/Primary` → `ring` (`#5c6bde`, Dark `#5460d9`), mais o effect style "Focus ring" (`0 0 0 2px #3a2fc11a`). Esse shadow tem o mesmo tamanho do stroke e fica escondido embaixo dele, então **o que aparece é um anel sólido de 2px, colado na borda, sem offset**: `focus-visible:ring-2 focus-visible:ring-ring` (sem `ring-offset`). Nos Types sem fundo (Quiet, Outline, Red Quiet e Green Quiet), o Focus também ganha `bg-card`.

**Hover e active: Figma × opacidade do Shadcn** (decisão 13 aprovou a opacidade). Os degraus do Figma **se afastam do fundo** (no Light escurecem, no Dark clareiam). A opacidade faz o contrário: aproxima a cor do fundo.

| Type | Figma hover (L / D) | `hover:bg-X/90` sobre `background` (Light) | O que mais se aproxima do Figma |
|---|---|---|---|
| Primary | `#2c23a3` / `#4649ce` | `#4c42c6` (mais **claro** que o default) | Não há opacidade que escureça. `/90` é o mais discreto. Alternativa sem token: `hover:bg-[color-mix(in_oklab,var(--color-primary),black_15%)]` ≈ `#3128a4` (active ≈ 30% black ≈ `#292187`) |
| Destructive | `#7f0d0a` / `#e57370` | `#b02724` | Com `/90` fica mais claro. `color-mix(… black 25%)` = `#7f0d0a` (exato no Light) |
| Neutral | `#d2d5de` / `#444b5e` | `/80` = `#e4e5eb` (**quase invisível**: `secondary` e `background` são quase iguais) | A opacidade não funciona aqui. Alternativa: `hover:bg-input` (`Gray/500` = mesmo valor do hover do Figma; no Dark também bate: `#444b5e`) |
| Quiet / Outline / Red / Green Quiet | tokens `accent` / `*-subtle` | n/a | Usar os tokens direto (`hover:bg-accent`, `hover:bg-destructive-subtle`, `hover:bg-success-subtle`) |

Opção que funciona nos dois modos: `color-mix(in oklab, var(--color-X), var(--color-foreground) 15–25%)`. Como `foreground` é escuro no Light e claro no Dark, ela segue a direção do Figma nos dois modos (**decisão do dono**).

**Disabled:** a decisão 14 aprovou `disabled:opacity-50`. Mas o Figma usa cores próprias em Primary, Neutral, Quiet, Outline e Red/Green Quiet, e **opacidade 40%** no Destructive (então não é "igual ao Default", como diz a Dúvida 14 do mapeamento). A opacidade que mais se aproxima do Figma é **`disabled:opacity-40`**.

---

## 2. Input (Input Field `885:5165`, página "↳ Inputs (Input field)" `2509:3357`)

### Propriedades

| Propriedade | Tipo | Valores / default |
|---|---|---|
| `State` | variant | `Default`, `Placeholder`, `Typing`, `Filled`, `Disabled`, `Error`, `Warning`, `Read-Only`, `Success`, `Hover` |
| `Size` | variant | `Default`, `SM` |
| `Is Mandatory` | boolean | `false`: marcador `*` `Red/600` |
| `Is Optional` | boolean | `false`: "(opcional)" em 10px, `Gray/800` |
| `Has Description` | boolean | `false`: helper text abaixo do campo |
| `Has Counter` | boolean | `false`: "0/99" em 10px, **`#000000` solto** ❌ |
| `Has Action` | boolean | `false`: botão Quiet Icon Only Default (36px) na direita, absoluto |
| `Has Info` | boolean | `false`: ícone `info-circle` `Blue/600` → `info` |
| `Has Prefix Slot` / `Has Suffix Slot` | boolean | `false` |
| `Prefix Slot` / `Suffix Slot` | instance swap | `Input Slot / Country Code` (`6071:362`: bandeira + `angle-down`, divisor à direita 1px `Gray/500`) / `Input Slot / Time Unit` (`6071:367`: "minutos" + `angle-down`, divisor à esquerda) |
| `ActionIcon` | text | `"Copy"` (glifo do ícone de ação do SM) |
| `Icon` | boolean | `true`: ícone leading (SM) |

### Anatomia

A anatomia muda muito entre os tamanhos:

- **Default (60px): label flutuante dentro da caixa.** Vazio (`Default`/`Hover`): só o label, em 14px e centralizado (`p-3` = 12px). Com valor ou foco (`Placeholder`/`Typing`/`Filled`/…): o label sobe para 12px (`text-sm`) e o valor fica embaixo em 14px (`text-base`), com `gap-1` (4px) e padding **8 top / 12 x / 12 bottom** (`pt-2 px-3 pb-3`). Largura de referência: 400px. Prefix/suffix ficam na mesma linha do valor, com `gap-2`.
- **SM (36px): campo inline de uma linha.** Ícone leading 12px + texto 12px (`text-sm`), `px-3`, `gap-1`, sem label separado (o "Label" funciona como placeholder/valor). O ícone de ação (`Copy`, 12px) aparece no Hover.
- **Helper text** (instância `Descrição`): absoluto, **4px abaixo** da caixa (`mt-1`), 10px (`text-xs`, sem estilo aplicado). O counter também fica embaixo, à direita.

### Tamanhos

| Size | Altura | Padding | Gap | Raio | Borda | Texto |
|---|---|---|---|---|---|---|
| Default | 60px (`h-15`) | vazio `p-3`; preenchido `pt-2 px-3 pb-3` | label↔valor 4px `gap-1`; linha do valor `gap-2` | 12px `rounded-xl` | 1px inside | label 12px `text-sm` (14px `text-base` quando vazio); valor `text-base` |
| SM | 36px `h-9` | `px-3 py-0` | 4px `gap-1` | 12px `rounded-xl` | 1px inside | `text-sm` (12/16) + ícone 12px |

### Cores por estado

| State | Fundo | Borda | Label | Valor / placeholder | Anel |
|---|---|---|---|---|---|
| Default / Hover (Default) | `Gray/300` → `input-background` | `Gray/500` → `input` | `Gray/900` → `foreground-secondary` | n/a | n/a |
| Default / Hover (SM) | `Surface/Secondary` → `card` | `Border/Default` → `border` | ícone + texto `Gray/900` → `foreground-secondary` | n/a | n/a (no Hover só aparece o ícone de ação, `Gray/1000`) |
| Placeholder | igual ao Default | igual | igual (Default: 12px) | Default: `Gray/800` → `muted-foreground`; **SM: `Gray/700` ❌** (valor = `Content/Disabled`) | n/a |
| Typing (focus) | igual ao Default | **1px** `Border/Primary` → `ring` | igual | cursor `Gray/1000` → `foreground` | "Focus ring" `0 0 0 2px #3a2fc11a` → `ring-2 ring-primary-subtle` (bate no Light; no Dark `primary-subtle` é 30%) |
| Filled | igual | igual | `foreground-secondary` | `Gray/1000` → `foreground` | n/a |
| Disabled (Default) | `input-background` | **sem borda** | `Gray/800` → `muted-foreground` | `Gray/800` → `muted-foreground` | n/a |
| Disabled (SM) | `card` | `border` | `Content/Disabled` `Gray/700` ❌ | n/a | n/a |
| Read-Only | **sem fundo, sem raio** | só **borda inferior 1px** `Gray/400` → `border` | `foreground-secondary` | `foreground` | n/a |
| Error | igual ao Default | 1px `Red/600` `#d31510` → `destructive` (decisão 7; o token é `Red/700` `#a9110d`) | `Red/600` → `destructive` | `Red/600` | `0 0 0 2px #d315101a` → `ring-2 ring-destructive-subtle` |
| Success | igual | 1px `Green/600` → `success` | `success` | `success` | `0 0 0 2px #0091121a` → `ring-2 ring-success-subtle` |
| Warning | igual | 1px `Secondary/600` → `warning` | `warning` | `warning` | `0 0 0 2px #ef7d001a` → `ring-2 ring-warning-subtle` |

- **Helper text:** Default `Gray/800` → `muted-foreground`. As variantes `Error`/`Success`/`Warning` usam a cor do estado.
- **Marcadores:** `*` `Red/600` → `destructive`. Nos estados Success e Warning ele segue a cor do estado; no Disabled fica `Gray/800`.

---

## 3. Tag (Chip `304:4496`, página "↳ Chip" `4982:781`)

### Propriedades

| Propriedade | Tipo | Valores / default |
|---|---|---|
| `Type` | variant | `Neutral`, `Yellow`, `Primary`, `Warning`, `Sucess`, `Info`, `Danger` |
| `Size` | variant | `Default`, `Medium` |
| `CloseButton` | boolean | `true`: glifo `times` à direita (dismiss) |
| `Icon` | boolean | `true`: glifo leading (`circle` como placeholder) |
| `Placeholder text` | text | `"Chip"` |

### Tamanhos

| Size | Altura | Padding (y / x) | Gap | Raio | Borda | Texto | Ícones |
|---|---|---|---|---|---|---|---|
| Default | 20px `h-5` | 0 / 8px `px-2` | ícone↔texto 4px `gap-1`; conteúdo↔close 8px `gap-2` | 6px `rounded-md` | 1px inside | `Default/base/Regular` → `text-base font-normal` (14/20) | 12px (`Icons/sm`), close 12px |
| Medium | 24px `h-6` | 2 / 8px `py-0.5 px-2` | idem | 8px `rounded-lg` | 1px inside | `text-base font-normal` (igual ao Default) | 14px (`Icons/base`), close 14px |

**Tamanho extra que não está no set:** dentro do Select SM (MultiSelected), o Chip Info aparece sobrescrito com **16px de altura, raio 4px (`rounded-sm`) e texto `text-sm`**. Seria um tamanho "SM" que não existe no component set.

### Cores

Em todos os Types, fundo e borda usam a **mesma** cor translúcida (decisão 12). O texto e os ícones (leading e close) usam a cor de conteúdo.

| Type Figma | Fundo = borda (Figma) | Conteúdo (Figma) | Classes |
|---|---|---|---|
| Neutral | `Gray/Opacity Gray` 10% | `Chips/Content/Neutral` (`Gray/900`) | `bg-tag-bg border-tag-border text-tag-foreground` |
| Yellow | `Yellow/Opacity Yellow` 15% | `Chips/Content/Yellow` (`Yellow/700`) | `bg-highlight-subtle border-highlight-subtle text-highlight-subtle-foreground` |
| Primary | `Primary/Opacity` 10% | `Chips/Content/Primary` (`Primary/700`) | `bg-primary-subtle border-primary-subtle text-primary-subtle-foreground` |
| Warning | `Secondary/Opacity Orange` 10% | `Chips/Content/Warning` (`Secondary/700` `#cc5f18`) | `bg-warning-subtle border-warning-subtle text-warning-subtle-foreground`. O token Light é `orange.800` `#994712` (decisão 9), mais escuro que o Figma |
| Sucess | `Green/Opacity Green` 10% | `Chips/Content/Success` | `bg-success-subtle border-success-subtle text-success-subtle-foreground` |
| Info | `Blue/Opacity Blue` 10% | `Chips/Content/Info` | `bg-info-subtle border-info-subtle text-info-subtle-foreground` |
| Danger | `Red/Opacity Red` 10% | `Chips/Content/Error` | `bg-destructive-subtle border-destructive-subtle text-destructive-subtle-foreground` |

O Chip não tem estados (hover, focus ou disabled), nem para o botão de fechar.

---

## 4. Dialog (Modal `6377:1529`, página "↳ Modals" `6377:1528`)

### Propriedades

| Propriedade | Tipo | Valores / default |
|---|---|---|
| `Type` | variant | `Default`, `Text+Form`, `OverflowText`, `Form`, `Table`, `Wizard` |
| `Search-filter header` | boolean | `true` (só afeta o `Table`: mostra ou esconde a barra de busca/filtro) |

### Container (Default, Text+Form, OverflowText, Form)

| Item | Valor |
|---|---|
| Largura | **448px**, fixa pelo conteúdo (400 + 2×24) → `max-w-[448px]` (o Shadcn usa `sm:max-w-lg` = 512px) |
| Padding | 24px `p-6` |
| Gap entre header, body e footer | 16px `gap-4` |
| Raio | 12px `rounded-xl` (Table também 12; Wizard 16 `rounded-2xl`) |
| Fundo | `Gray/100` direto no componente (no Dark isso dá `#1a1d24`, igual a `background`). As instâncias da seção "Modais" usam `Surface/Secondary` → **`bg-card`**, ou `bg-popover` (mesmo valor) |
| Borda | 1px inside `Gray/400` → `border` |
| Sombra | effect style **"popover"**: `0 1px 4px 0 #00000040` (preto 25%). O `shadow-sm` do v4 é o mais próximo (`0 1px 3px rgb(0 0 0/.1)…`), mas bem mais fraco. Mais fiel: `shadow-[0_1px_4px_rgb(0_0_0/0.25)]`. O Wizard usa `0 4px 4px 0 #00000040` |

### Slots

| Slot | Figma | Classes |
|---|---|---|
| Header / Title | "Title", `Default/lg/Regular28` (16/24, **Regular**), `Gray/1000` | `text-lg font-normal text-foreground`. O Shadcn usa `text-lg font-semibold leading-none`. Table: `Default/lg/Bold`; Wizard: `text-lg/Bold` |
| Description | não tem slot próprio: o corpo de texto é `Default/base/Regular` (14/20), `Gray/900` | `text-base text-foreground-secondary`. O Shadcn usa `text-sm text-muted-foreground`, que no DS vira 12px e cinza mais claro |
| Body | frame FILL; em forms, `gap-3` (12px) entre campos (Input Field Default + TextArea) | n/a |
| Footer | alinhado à **direita**, `gap-2` (8px): Button Neutral (cancelar) + Button Primary, ambos Size Default (36px). Wizard: `gap-3` | Bate com o `sm:flex-row sm:justify-end gap-2` do Shadcn |
| Close button | **não existe** nas variantes Default, Text+Form, OverflowText e Form. No `Table`, fica num header próprio: Title (`lg/Bold`) + `CloseButton` (Button Quiet Icon Only Default 36px, glifo `close` 14px), `pt-2 pr-3 pb-2 pl-4`, com Divider 1px `Gray/400` → `border` embaixo | O Shadcn tem o X absoluto `top-4 right-4` com `opacity-70` |
| Overlay | **não definido** no Figma (nenhum frame de scrim ou backdrop na página) | Manter o `bg-black/50` do Shadcn (❌ sem token) |

---

## 5. Select (página "↳ Selects" `2511:8212`)

### Component sets

| Set | Id | Propriedades |
|---|---|---|
| Select (trigger) | `885:3949` | `State`: `Default`, `MultiSelected`, `Placeholder`, `Selecting`, `SingleSelected`, `Hover`, `Focus`, `Disabled`, `Read-Only`, `Error`, `Success`, `Warning` · `Size`: `Default`, `SM` · booleans `Is Mandatory`, `Is Optional`, `Has Description`, `Has Info` (false), `Has Icon` (true) |
| Select Item | `6214:164` | `State`: `Default`, `Hover`, `Selected`, `Disabled` · `Mode`: `Single`, `Multi` · `Size`: `Default`, `Sm` · `Has Description` (false) |
| Select Popover | `6216:189` | `Mode`: `Single`, `Multi` · `Has Add Action` (false) · `Has divider` (false) |

### Trigger

Tem a mesma anatomia e as mesmas medidas do Input (seção 2): Default 60px com label flutuante, SM 36px inline, `rounded-xl`, `px-3`. O chevron é uma **instância de Button Quiet Icon Only**: Default 36px (`size-9`, glifo `angle-down` 14px), SM 24px (`size-6`, glifo 12px), `Content/Default` → `foreground`. No SM Hover o glifo muda para `edit`.

| State | Default (60px) | SM (36px) |
|---|---|---|
| Default | bg `input-background`, borda `input`, label 14px `foreground-secondary` | **sem fundo**, borda `border`, ícone + label 12px `foreground-secondary` |
| Placeholder | label 12px + placeholder "Busque ou selecione..." `Gray/800` → `muted-foreground` | texto `Gray/700` ❌ |
| Hover | igual ao Default | bg `Gray/Opacity Gray` → `accent` |
| Focus | borda **2px OUTSIDE** `ring` + shadow Focus ring | bg `card` + borda 2px OUTSIDE `ring` + shadow |
| Selecting (aberto) | borda 1px inside `ring` + shadow Focus ring (igual ao Input Typing) | bg `card` + borda 1px OUTSIDE `ring` + shadow |
| SingleSelected | label 12px + valor `Gray/1000` → `foreground` | inline "Label │ Valor": divisor `│` em `text-xs` `Border/Default` → `border`, valor `Content/Default` → `foreground` |
| MultiSelected | label 12px + linha de Chips Info Default (`gap-2`) | "Label │" + Chip Info reduzido (16px, `rounded-sm`, `text-sm`) |
| Disabled | fundo e borda iguais ao Default; texto e chevron `Content/Disabled` ❌ | sem fundo, borda `border`, texto `Content/Disabled` ❌ |
| Read-Only | sem fundo e sem raio, só borda inferior 1px `border`, **sem chevron** | igual |
| Error / Success / Warning | borda 1px (`Red/600` / `Green/600` / `Secondary/600`) + ring 2px `*-subtle`; label na cor do estado; chevron fica `foreground` | idem, com fundo `card` |

### Content (Select Popover)

| Item | Valor |
|---|---|
| Largura | 304px fixa (equivale a `w-(--radix-select-trigger-width)` / `min-w-[8rem]`) |
| Raio | 12px `rounded-xl` (o Shadcn usa `rounded-md`) |
| Fundo | `Surface/Secondary` → `popover` |
| Borda | 1px inside `Border/Default` → `border` |
| Sombra | `0 6px 16px 0 #00000014` (preto 8%). O mais próximo é `shadow-md` do v4 (`0 4px 6px -1px /.1, 0 2px 4px -2px /.1`). Mais fiel: `shadow-[0_6px_16px_rgb(0_0_0/0.08)]` |
| Padding / gap | grupo de itens `p-1` (4px; o último grupo tem `pb-0.5`); 2px entre itens (`gap-0.5`) |
| Separator (`Has divider`) | instância "Divider / Horizontal - Clear": bloco de 16px de altura com `px-4`, **sem linha visível** (espaçador) |
| Add action (`Has Add Action`) | rodapé de 40px com borda superior 1px `border`, `px-1 pb-1`, contendo um Select Item "Add “Typed text”" |
| Label de grupo / scroll chevrons | **não existem** no Figma (SelectLabel e ScrollUp/DownButton do Shadcn ficam sem spec) |

### Item (Select Item)

| Size | Altura | Padding | Raio | Texto |
|---|---|---|---|---|
| Default | 36px `h-9` | `py-2 px-3` (Multi: `pr-2`) | 8px `rounded-lg` | `Default/base/Regular` → `text-base`, `Content/Default` → `popover-foreground` |
| Sm | 32px `h-8` | `py-2 px-3` (Multi: `pr-2`) | 8px `rounded-lg` | `Default/sm/Regular` → `text-sm` |

Descrição opcional (`Has Description`): 12px `#6b738c`, **hex solto** ≈ `Gray/800` → `muted-foreground`, `gap-0.5` abaixo do label.

| State | Single | Multi |
|---|---|---|
| Default | sem fundo | sem fundo + Checkbox à **direita** (20px no Default / 16px no Sm; raio 6 / 4.8px; borda `Gray/800`) |
| Hover | `accent` | `Semantic/Main/Hover/Primary` (`Gray/200` / Dark `Gray/300`) ❌ sem semântico (decisão 5 escolheu `accent`) |
| Selected | bg `Gray/300` (valor = `muted` / `input-background`), **sem ícone de check** | bg `Gray/300` + Checkbox marcado (fundo `Primary/600` → `primary`, glifo `check` branco `#ffffff` solto) |
| Disabled | texto `Content/Disabled` ❌ | texto `Content/Disabled` + Checkbox com borda `Gray/500` |

**Check indicator:** no modo Single o Figma **não mostra check**, só o fundo (o Shadcn mostra o `CheckIcon` absoluto à direita). No modo Multi, o indicador é um Checkbox à direita.

---

## 6. Principais diferenças em relação ao Shadcn padrão

1. **Button, alturas:** Figma SM/Default/LG = 24/36/48px (Shadcn 32/36/40). Raios de 8/12/16px (Shadcn `rounded-md`). Padding do LG `px-4`. Peso Regular (Shadcn `font-medium`). Ícone 12 ou 14px (Shadcn `size-4` = 16px). Icon-only com 24/36/48px.
2. **Button, variantes:** Red Quiet e Green Quiet não existem no Shadcn. O Outline no Figma é transparente, sem `bg-background` e sem `shadow-xs`. Os Types sem fundo ganham `bg-card` no Focus.
3. **Hover e active:** os degraus do Figma se afastam do fundo; a opacidade do Shadcn aproxima. No Neutral a opacidade é quase invisível. Ver as alternativas na tabela da seção 1.
4. **Focus:** o Button tem um anel sólido de 2px em `ring`, sem offset. O Input tem borda de 1px em `ring` mais um halo de 2px a 10% (`ring-primary-subtle`). O Shadcn v4 usa `ring-[3px] ring-ring/50`.
5. **Input:** preenchido (`input-background` + borda `input`), 60px com label flutuante interno no Default. O SM (36px) é outra anatomia, com fundo `card` e borda `border`. Raio 12px (Shadcn `rounded-md`, h-9, transparente). Tem os estados Success, Warning e Read-Only (Read-Only só com borda inferior). Os halos de erro, sucesso e alerta usam os tokens `*-subtle`.
6. **Tag:** texto 14px Regular (o Badge do Shadcn usa `text-xs font-medium`, 12px no Shadcn). Altura de 20 ou 24px. Raio 6/8px. Tem ícone leading e botão de fechar, e a borda é da mesma cor translúcida do fundo.
7. **Dialog:** 448px (Shadcn 512), `rounded-xl`, sombra "popover" (25% black, `0 1px 4px`). Título 16px **Regular** (Shadcn `font-semibold`). Descrição 14px `foreground-secondary`. Footer à direita (igual ao Shadcn). **Sem X nas variantes padrão** e **sem overlay definido**.
8. **Select:** o trigger segue o Input (60px com label flutuante, ou 36px). O chevron é um Button Quiet de 36 ou 24px. O popover usa `rounded-xl` e a sombra `0 6px 16px /8%`. O item usa `rounded-lg` e 36/32px. No Single não há check, a seleção é só o fundo `Gray/300`. Não há SelectLabel nem scroll buttons.

## 7. Dúvidas para o dono

1. **Hover/active dos botões sólidos:** manter a opacidade (`/90`, que clareia no Light e fica quase invisível no Neutral) ou usar `color-mix` com `foreground`/`black` (fiel ao Figma, sem token novo)? E o Neutral: usar `hover:bg-input`, que tem o mesmo valor do Figma?
2. **Disabled:** usar `opacity-50` (aprovado) ou `opacity-40` (o valor que o Figma usa no Destructive)?
3. **Anel de focus:** usar o do Button (2px sólido `ring`) para todos os componentes, ou o do Input (borda `ring` + halo 2px `primary-subtle`) nos campos?
4. **Input Default de 60px com label flutuante:** implementar essa anatomia (label dentro do campo) ou manter o Input simples do Shadcn e tratar o label pelo componente `Label`/`FormItem`? Se for o Input simples, o tamanho base passa a ser o SM (36px)? O SM usa `card` + `border`, não `input-background` + `input`, o que contradiz a decisão 6.
5. **Placeholder:** o Default usa `Gray/800` (`muted-foreground`) e o SM usa `Gray/700` (sem token). Padronizar em `muted-foreground`?
6. **Vermelho do erro:** Input e Select usam `Red/600` `#d31510`, e o token `destructive` é `Red/700` (decisão 7 aceita a diferença). Só confirmar.
7. **Dialog:** mostrar o botão X por padrão (Shadcn) ou só quando pedido (`showCloseButton={false}` por padrão, como no Figma)? Se mostrar, usar o Button Quiet Icon Only de 36px no canto? Qual cor e opacidade para o overlay (não há no Figma)? O título fica Regular (Default) ou Bold (Table/Wizard)?
8. **Tag:** criar um tamanho SM (16px, `rounded-sm`, `text-sm`), como aparece dentro do Select? Warning: o token (`orange.800`) é mais escuro que o Figma (`Secondary/700`) por causa do contraste (decisão 9), só registrar.
9. **Select Item:** no Single, mostrar o check do Shadcn ou só o fundo selecionado (`Gray/300`, sem token: `muted` ou `input-background`)? E no Multi, o hover `Hover/Primary` (opaco) vira `accent`?
10. **Hex soltos no Figma:** o counter do Input (`#000000`), a descrição do Select Item (`#6b738c`), o check do Checkbox (`#ffffff`) e as sombras. Pedir ao dono para ligar esses valores a variáveis no Figma.
