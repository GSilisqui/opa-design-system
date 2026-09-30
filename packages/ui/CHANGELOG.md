# @gsilisqui/ui

## 0.2.1

### Patch Changes

- e5af4ab: Icon: não corta mais os ícones do Font Awesome que passam do viewBox (`overflow-visible`, como no CSS oficial do FA e no Figma).

## 0.2.0

### Minor Changes

- 702bc15: Button: `layout` separado de `size`, como no Figma.
  
  - `size` agora é só `sm | default | lg`.
  - Novo `layout="default" | "icon-only"` para o botão só com ícone, em qualquer tamanho.
  
  **Migração:** `size="icon-sm"` → `size="sm" layout="icon-only"`; `size="icon"` → `layout="icon-only"`; `size="icon-lg"` → `size="lg" layout="icon-only"`.

## 0.1.0

### Minor Changes

- f222644: Primeira versão do @opa/ui: Icon (Font Awesome Pro), Button, Input, InputField, Label, Tag, Dialog, Popover, Command e Combobox, com CSS do DS (foco, hover, sombras) e tema embutido.
