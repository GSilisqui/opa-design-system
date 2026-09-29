---
"@gsilisqui/ui": minor
---

Button: `layout` separado de `size`, como no Figma.

- `size` agora é só `sm | default | lg`.
- Novo `layout="default" | "icon-only"` para o botão só com ícone, em qualquer tamanho.

**Migração:** `size="icon-sm"` → `size="sm" layout="icon-only"`; `size="icon"` → `layout="icon-only"`; `size="icon-lg"` → `size="lg" layout="icon-only"`.
