# Backlog do DS

Itens menores levantados nas revisões. Nenhum bloqueia o uso atual. Marque com `[x]` e cite o commit ao resolver.

## @opa/ui (revisão final do Plano 2, 2026-09-29)

- [x] **Combobox obrigatório sem erro acessível.** Ao bloquear o envio, o balão do navegador fica preso no input oculto (aria-hidden) e o trigger não recebe `aria-invalid`. Proposta: `onInvalid` com `preventDefault()` e mostrar o estado de erro do próprio componente. Adicionar `autoComplete="off"` no input oculto. (`combobox.tsx`)
- [x] **Tipos em `moduleResolution: nodenext`.** Os `.d.ts` usam imports relativos sem extensão. Vite/Next (`bundler`) funcionam. Adicionar `.js` no build ou documentar o requisito `bundler` no README.
- [x] **`package.json` do ui:** condição `default` em `exports["."]`; Tailwind v4 como peerDependency; `@types/react` como peer opcional.
- [x] **Source maps publicados** são varridos pelo `@source "./"` e podem gerar classes soltas a partir de comentários. Usar `@source not "./**/*.map"` ou não publicar os maps.
- [x] **Combobox:** o item destacado não acompanha mudança de `value` controlado com o popup aberto; em listas longas o valor atual não é rolado para a vista ao abrir.
- [x] **Teste fraco:** "Enter não troca o valor" (`combobox.test.tsx`) itera `mock.calls` e passa sem chamadas. Assertar a quantidade de chamadas.
- [x] **Tag com `onRemove`:** o `gap-1` fica fixo no wrapper interno; `className="gap-*"` do consumidor não muda o espaço entre ícone e texto.
- [x] **Exportar o `cn` do DS** em `index.ts` para quem estende componentes (o `cn` puro não conhece `shadow-popover`/`focus-halo`).
- [x] **Changelog do Storybook:** incluir `packages/ui/CHANGELOG.md` (existe desde o release 0.1.0).
- [x] **Contraste no Dark** agora é testável: `pnpm --filter opa-storybook test:dark` roda as stories com `.dark`. Fora do `verify` porque reprova (ver próximo item).
- [ ] **Adiado pelo dono (2026-09-30): manter `destructive` como está.** Ele no Dark (#dc4440) não passa AA. Texto destrutivo (label/descrição de erro, Button `destructive-quiet`) sobre `background`/`card` escuro: 3,14 a 3,97:1 (precisa de 4,5:1); texto `destructive-foreground` (#ebeef5) sobre o botão `destructive`: 3,65:1. Opções: clarear o `destructive` no Dark (tokens + Figma), ou registrar exceção como as da Tag `info`/`highlight`. Depois de decidir, incluir `test:dark` no `test`.

## Figma (para o Plano 3)

Auditado em 2026-09-30 no arquivo novo (`UW4As1KdSaPboQ3sNMAbCi`): Button, Input, Tag, Dialog e Combobox sem fill/stroke/texto/efeito solto (única exceção intencional: overlay `bg-black/50` do Dialog, igual ao código). Estes itens eram do "Component Library" antigo e não se aplicam à biblioteca nova.

- [x] Valores soltos (contador do Input, descrição do Select Item, check do Checkbox, sombras): obsoleto, tudo ligado a variáveis/estilos na biblioteca nova.
- [x] Destructive Active igual ao Default: obsoleto. O novo tem estados default/hover/focus/disabled e o hover destructive usa `foreground` 25%, igual ao código (`bg-shade-strong-destructive`).
- [x] Surface/Tertiary no Light = Gray/300: decisão de tokens 3, já refletida nas variáveis Semantic.
- [x] Nomes de radius no padrão Tailwind v4 (decisão registrada no ledger).
- [ ] Renomear `Default/lg/Regular28` → `Default/lg/Regular`: é do arquivo antigo, ação do dono (baixa prioridade).
- [x] Estados de hover/active/disabled seguindo o código: aplicado (15%/25% de `foreground`, opacidade 40%).

## Figma (construção da biblioteca, 2026-09-29)

- [x] **Links do Figma antigo no código:** (resolvido: stories e README apontam para o arquivo novo) as stories (`parameters.docs.description.component`) e a tabela de `packages/ui/README.md` ainda apontam para o "Component Library" (`7FS6JptRPLnco6VSAEAOAH`). Trocar pelos nós do arquivo novo (`manifest/components.json → figma.url`).

- [ ] **Combobox Option:** no Light, `selected` (muted `#e7e9ed`) e `hover` (accent 10% sobre popover ≈ `#e9eaee`) ficam quase iguais. Mesmo resultado no código. Avaliar um token de seleção mais forte ou um check sutil.

## Ícones (catálogo completo no Figma, 2026-09-30)

- [x] **Brands no código** (8 logos de comunicação; para mais, incluir no `brandsMap`). O Figma tem os 572 logos (`variant=brands`), mas o `<Icon>` só desenha regular e solid do `icon-registry.ts`. Proposta: aceitar `variant="brands"` com um mapa `brands` no registro (pacote `@fortawesome/free-brands-svg-icons`, deep imports), mantendo o registro explícito.
- [x] **Changelog do Figma:** entrada 0.2.0 registrada na página Changelog (troca para um componente por ícone com `variant` e catálogo completo).

## Antes da Fase 2

- [x] **Revisar o estilo do Dialog** (header e footer separados; código e Figma atualizados em 2026-09-30) para um visual mais refinado (pedido do dono, 2026-09-30). Atualizar Figma, manifesto e story junto.

## Tokens emprestados de outro papel (auditoria de 2026-09-30)

Estados e controles que usam um token semântico criado para outra coisa. Funciona e está espelhado no Figma, mas acopla papéis: mexer em um muda o outro.

- [ ] **Button neutral hover/active** usam `input` (borda de campo) como fundo. Decisão A do Plano 2 aprovou `hover:bg-input`. Proposta: `secondary-hover` e `secondary-active` nas Semantic (Light/Dark).
- [ ] **Switch desligado** usa `input` como fundo do track. Proposta: `switch-track` (ou reaproveitar `secondary-hover`).
- [ ] **Checkbox/Radio desmarcados** usam `muted-foreground` (token de texto) como borda (Gray/800 do Figma antigo). Proposta: `control-border`.
- [ ] **Dialog footer** usa `background` (fundo da página). Aceitável enquanto o Dialog for sempre sobre `background`; se o fundo mudar, o footer acompanha.

