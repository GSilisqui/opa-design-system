# Backlog do DS

Itens menores levantados nas revisões. Nenhum bloqueia o uso atual. Marque com `[x]` e cite o commit ao resolver.

## @opa/ui (revisão final do Plano 2, 2026-09-29)

- [x] **Combobox obrigatório sem erro acessível.** Ao bloquear o envio, o balão do navegador fica preso no input oculto (aria-hidden) e o trigger não recebe `aria-invalid`. Proposta: `onInvalid` com `preventDefault()` e mostrar o estado de erro do próprio componente. Adicionar `autoComplete="off"` no input oculto. (`combobox.tsx`)
- [ ] **Tipos em `moduleResolution: nodenext`.** Os `.d.ts` usam imports relativos sem extensão. Vite/Next (`bundler`) funcionam. Adicionar `.js` no build ou documentar o requisito `bundler` no README.
- [ ] **`package.json` do ui:** condição `default` em `exports["."]`; Tailwind v4 como peerDependency; `@types/react` como peer opcional.
- [ ] **Source maps publicados** são varridos pelo `@source "./"` e podem gerar classes soltas a partir de comentários. Usar `@source not "./**/*.map"` ou não publicar os maps.
- [x] **Combobox:** o item destacado não acompanha mudança de `value` controlado com o popup aberto; em listas longas o valor atual não é rolado para a vista ao abrir.
- [x] **Teste fraco:** "Enter não troca o valor" (`combobox.test.tsx`) itera `mock.calls` e passa sem chamadas. Assertar a quantidade de chamadas.
- [ ] **Tag com `onRemove`:** o `gap-1` fica fixo no wrapper interno; `className="gap-*"` do consumidor não muda o espaço entre ícone e texto.
- [ ] **Exportar o `cn` do DS** em `index.ts` para quem estende componentes (o `cn` puro não conhece `shadow-popover`/`focus-halo`).
- [ ] **Changelog do Storybook:** incluir `packages/ui/CHANGELOG.md` (existe desde o release 0.1.0).
- [ ] **Contraste no Dark não é testado** (as stories rodam só no tema Light). Avaliar um segundo projeto de teste com `.dark`.

## Figma (para o Plano 3)

- [ ] Ligar a variáveis os valores soltos: contador do Input (`#000000`), descrição do Select Item (`#6b738c`), check do Checkbox (`#ffffff`), sombras.
- [ ] Destructive Active igual ao Default no Button.
- [ ] Surface/Tertiary no Light = Gray/300 (muted, decisão de tokens 3).
- [ ] Nomes de radius no padrão Tailwind v4 (2px `rounded-xs`, 4px `rounded-sm`).
- [ ] Renomear `Default/lg/Regular28` → `Default/lg/Regular` (ação do dono).
- [ ] Estados de hover/active/disabled seguindo a abordagem do código (mistura com foreground, opacidade 40%).

## Figma (construção da biblioteca, 2026-09-29)

- [x] **Links do Figma antigo no código:** (resolvido: stories e README apontam para o arquivo novo) as stories (`parameters.docs.description.component`) e a tabela de `packages/ui/README.md` ainda apontam para o "Component Library" (`7FS6JptRPLnco6VSAEAOAH`). Trocar pelos nós do arquivo novo (`manifest/components.json → figma.url`).

- [ ] **Combobox Option:** no Light, `selected` (muted `#e7e9ed`) e `hover` (accent 10% sobre popover ≈ `#e9eaee`) ficam quase iguais. Mesmo resultado no código. Avaliar um token de seleção mais forte ou um check sutil.

## Ícones (catálogo completo no Figma, 2026-09-30)

- [ ] **Brands no código.** O Figma tem os 572 logos (`variant=brands`), mas o `<Icon>` só desenha regular e solid do `icon-registry.ts`. Proposta: aceitar `variant="brands"` com um mapa `brands` no registro (pacote `@fortawesome/free-brands-svg-icons`, deep imports), mantendo o registro explícito.
- [x] **Changelog do Figma:** entrada 0.2.0 registrada na página Changelog (troca para um componente por ícone com `variant` e catálogo completo).

## Antes da Fase 2

- [ ] **Revisar o estilo do Dialog** para um visual mais refinado (pedido do dono, 2026-09-30). Atualizar Figma, manifesto e story junto.
