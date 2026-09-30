---
"@gsilisqui/ui": minor
---

Dialog: novo estilo com padding de 12px, header e corpo no `card` e footer no `background`, separados por divisórias. `DialogContent` não tem padding (cada seção cuida do seu); conteúdo customizado deve ficar em `DialogHeader`, `DialogFooter` ou como filho direto (recebe `p-3`). Texto solto vai na `DialogDescription`, não num corpo separado. O botão de cancelar do footer passa a ser `outline`. Button `outline` agora tem fundo `card` e hover/active por mistura com o foreground.
