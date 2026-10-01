# Wizard (Dialog em passos) — design

Data: 2026-10-01 · Dono: Gabriel Silisqui · Status: design aprovado em conversa, aguardando revisão do documento.

## Contexto e justificativa

O produto precisa de um diálogo em passos para formulários longos e processos de importação. O Shadcn não tem
Stepper nem Wizard, e o Radix não tem primitivo para isso. O dono aprovou criar o componente (regra 3 do CLAUDE.md).

Para não inventar um primitivo, o `Wizard` é uma casca visual sobre o Dialog e o Radix **Tabs vertical**
(`Tabs as TabsPrimitive` direto de `radix-ui`, **não** o `tabs.tsx` do DS, cujos estilos de aba horizontal não servem para a coluna),
que já entrega teclado, ARIA e `value`/`onValueChange`. O container usa `DialogPortal`, `DialogOverlay` e `DialogPrimitive.Content`
direto (não o `DialogContent`, que força padding nos filhos, X próprio e `max-w` de 448px). A navegação livre entre passos, decidida
pelo dono, é o comportamento natural das Tabs.

Referências visuais consultadas: [blocks.so Dialog Multi-Step Wizard](https://blocks.so/dialogs/dialog-11) e
[ReUI Stepper](https://reui.io/components/stepper). A spec do Wizard no Figma antigo está em
`docs/superpowers/notes/2026-09-29-figma-component-specs.md` (variante `Type=Wizard` do Dialog).

## Decisões do dono

| Tema | Decisão |
|---|---|
| Layout | Etapas em coluna à esquerda, estilo **círculos numerados + linha de conexão** |
| Navegação | **Livre**: qualquer passo é clicável; Voltar/Próximo andam um passo |
| Estado | **Controlado pelo consumidor** (`step`, `onStepChange`, status por passo); aceita `defaultStep` |
| API | **Config por props** (`steps={[…]}`), conteúdo em `content` dentro de cada passo |
| Erro | Próximo **bloqueado** quando o passo atual está em `error` |
| Tamanho | **80% da largura e da altura da janela** |
| Cabeçalho | Só o título do passo; **sem** "Passo X de X" |
| Rodapé | Voltar e Próximo **juntos à direita**, `gap-3`; sem Voltar no primeiro passo |
| Mobile | Fora de escopo por ora |

## API

```tsx
<Wizard
  open={open}
  onOpenChange={setOpen}
  title="Importar contatos"
  step={step}
  onStepChange={setStep}
  steps={[
    { id: "arquivo",  title: "Arquivo",        description: "contatos.csv", status: "complete", content: <UploadStep /> },
    { id: "mapear",   title: "Mapear colunas",                              content: <MapStep /> },
    { id: "revisar",  title: "Revisar",        status: "error",            content: <ReviewStep /> },
    { id: "importar", title: "Importar",                                    content: <RunStep /> },
  ]}
  onFinish={handleImport}
  finishLabel="Importar"
  nextLabel="Próximo"
  backLabel="Voltar"
  nextDisabled={!valid}
  loading={isImporting}
/>
```

- `step` e `defaultStep` são o **`id` (string)** do passo. Se o `id` não existir em `steps`, vale o primeiro passo.
- `WizardStepStatus = "pending" | "complete" | "error"` (ausente = `pending`). O passo atual **não é um status**: é derivado de
  `step` (estado "selecionado"), para não haver duas fontes da verdade. Selecionado + `pending` tem o visual "atual"; selecionado +
  `complete`/`error` mantém as cores do status e acrescenta o negrito.
- Props: `open`, `onOpenChange`, `title`, `steps`, `step`, `defaultStep`, `onStepChange`, `onFinish`, `finishLabel`,
  `nextLabel`, `backLabel`, `nextDisabled`, `loading`, `showCloseButton` (padrão `true`), `closeLabel`.
- Textos em português como padrão (`Voltar`, `Próximo`, `Concluir`, `Fechar`), sobrescrevíveis.

## Comportamento

- **Próximo** (e o botão de finalizar, no último passo) fica `disabled` se o passo atual está em `error` ou `nextDisabled` é verdadeiro.
- **Voltar** não é renderizado no primeiro passo.
- No último passo, o botão primário vira `finishLabel`, chama `onFinish` e aceita `loading`.
- Com `loading`: Voltar, coluna de etapas e o X ficam desabilitados; Esc e clique fora não fecham
  (`onEscapeKeyDown` e `onInteractOutside` com `preventDefault`, no `DialogPrimitive.Content` próprio do Wizard).
- Ao trocar de passo (botões ou coluna, **não** na montagem), o foco vai para o painel do passo: o painel tem `tabIndex={-1}` e o
  Wizard chama `focus()` por `ref` num efeito após a troca. O painel fica dentro do `ScrollArea`.
- O conteúdo de cada passo é montado só quando o passo está ativo (o consumidor guarda o estado do formulário fora do passo).

## Visual (tokens semânticos, sem valor solto)

Casca montada com `DialogPrimitive.Content` e as mesmas classes de animação/centralização do `DialogContent`, mas com
`w-4/5 h-4/5 rounded-2xl p-0` e sem limite de `max-w`. Como o conteúdo é `fixed`, `w-4/5`/`h-4/5` resolvem contra a janela,
sem valor arbitrário. `rounded-2xl` é a escala padrão do Tailwind, como o `rounded-xl` do Dialog. Grade interna de duas colunas (coluna de etapas
de largura fixa + área principal).

**Coluna de etapas:** `bg-background`, `border-r border-border`, título do wizard em `text-lg`. Cada etapa é um botão
(`TabsTrigger`) com círculo de 24px (`size-6`) e linha de conexão de 2px até a próxima.

| Status / estado | Círculo | Texto | Linha até a próxima |
|---|---|---|---|
| `pending` (não selecionado) | borda `border-border`, número `text-muted-foreground` | `text-muted-foreground` | `bg-border` |
| selecionado + `pending` ("atual") | borda `border-primary`, número `text-primary font-bold` | `text-foreground font-bold` | `bg-border` |
| `complete` | `bg-primary`, ícone `check` em `text-primary-foreground` | `text-foreground` | `bg-primary` |
| `error` | `bg-destructive-subtle`, borda `border-destructive`, ícone `circle-exclamation` (24px, sem borda própria, sobre o `bg-destructive-subtle`) | `text-destructive` | `bg-border` |

O botão de cada etapa é um `TabsPrimitive.Trigger` estilizado do zero (altura automática, `text-left`, `whitespace-normal`),
sem herdar nada do `tabs.tsx`. Descrição opcional do passo: `text-sm text-foreground-secondary` abaixo do título. Foco: `focus-visible:focus-ring`.

**Área principal:** cabeçalho com o título do passo (`text-lg font-bold`) e botão X próprio (`Button quiet icon-only`, `aria-label={closeLabel}`,
`disabled` com `loading`; aparece com `showCloseButton`), separado por `border-b border-border`. Corpo com `ScrollArea` e `p-4`. Rodapé como o do `DialogFooter`
(`bg-background`, `border-t`), conteúdo alinhado à direita, `gap-3`.

O mockup validado (claro e escuro, com os tokens reais) foi aprovado na conversa de 2026-10-01; não é versionado.

## Acessibilidade

- `Dialog` do Radix: foco preso e Esc. O `title` do wizard é o `DialogTitle`; há `description` opcional (`DialogDescription`),
  e sem ela o conteúdo leva `aria-describedby={undefined}`. O título do passo no cabeçalho é um `h3` visual; o painel é rotulado pela etapa
  (Radix liga `aria-labelledby` ao trigger).
- Coluna = `Tabs` com `orientation="vertical"` e **`activationMode="manual"`**: setas e Home/End só movem o foco; Enter/Espaço (ou clique)
  ativam a etapa. Assim o foco que vai para o painel depois da troca não atrapalha a navegação por setas. `aria-selected` indica a etapa atual.
- Cada etapa traz um texto só para leitor de tela com o status ("concluído", "com erro"); a cor não carrega a informação sozinha.
- Painel do passo: `role="tabpanel"` rotulado pela etapa.

## Testes (Vitest + Testing Library + axe)

- Renderiza título, etapas e o conteúdo apenas do passo atual.
- Clique na etapa e setas chamam `onStepChange`; Voltar/Próximo andam um passo.
- Próximo bloqueado em `error` e em `nextDisabled`; Voltar ausente no primeiro passo.
- Último passo: `finishLabel`, `onFinish`, `loading` (botões e fechamento desabilitados).
- Texto de status para leitor de tela; modo não controlado com `defaultStep`. (Axe não roda nos testes unitários do repo: a checagem de
  a11y fica no Storybook, em Chromium.)
- `step` com `id` inexistente cai no primeiro passo; `onOpenChange` é chamado pelo X e por Esc, e não com `loading`.
- Foco vai para o painel ao trocar de passo, e não na montagem.

## Entregáveis

- `packages/ui/src/components/ui/wizard.tsx`, `wizard.test.tsx`, `wizard.stories.tsx` (Padrão, Importação, Com erro, Carregando).
- Export em `packages/ui/src/index.ts`; entrada em `manifest/components.json`; changeset `minor`.
- Sem ícone novo: `check`, `xmark` e `circle-exclamation` já existem no `icon-registry.ts`. (Um `exclamation` novo exigiria
  registro regular + solid, manifesto e o componente no índice do Figma, e o teste do manifesto cobra os três.)
- Figma: página **Wizard** (skill `figma-component`) com o componente de etapa (`Status`: pending | complete | error;
  `Selected`: boolean, derivado de `step` no React) e o Wizard completo, com índice, ledger e manifesto atualizados.
- Branch `feat/wizard`.

## Fora de escopo

Layout mobile (a coluna não tem fallback por enquanto), navegação bloqueada para passos futuros, persistência
de rascunho e animação de transição entre passos.
