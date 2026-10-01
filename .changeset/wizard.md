---
"@gsilisqui/ui": minor
---

Wizard: novo dialog em passos para formulários longos e importações. Etapas na vertical à esquerda (círculo numerado + linha, com `status` `complete`/`error`), navegação livre por clique ou teclado, passo atual controlado por `step`/`onStepChange` e `steps={[{ id, title, content }]}`. Próximo bloqueado quando o passo está com `error`; `loading` trava a navegação. Ocupa 80% da janela.
