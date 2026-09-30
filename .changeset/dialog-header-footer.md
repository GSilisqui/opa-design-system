---
"@gsilisqui/ui": minor
---

Dialog: novo estilo com header e footer separados por divisórias; o corpo fica entre os dois com padding próprio e o footer ganha fundo `muted` rebaixado. `DialogContent` agora não tem padding (cada seção cuida do seu), então conteúdo customizado deve ficar dentro de `DialogHeader`, `DialogFooter` ou como filho direto (recebe `px-6 py-4`).
