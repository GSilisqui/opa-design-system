# Wizard (Dialog em passos) — design

Data: 2026-10-01 · Dono: Gabriel Silisqui · Status: design aprovado em conversa, aguardando revisão do documento.

## Contexto e justificativa

O produto precisa de um diálogo em passos para formulários longos e processos de importação. O Shadcn não tem
Stepper nem Wizard, e o Radix não tem primitivo para isso. O dono aprovou criar o componente (regra 3 do CLAUDE.md).

Para não inventar um primitivo, o `Wizard` é uma casca visual sobre o `Dialog` e o Radix **Tabs vertical**
(`radix-ui`), que já entrega teclado, ARIA e `value`/`onValueChange`. A navegação livre entre passos, decidida
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

- `WizardStepStatus = "pending" | "current" | "complete" | "error"`. O consumidor informa só `complete` e `error`
  (ausente = `pending`); **`current` é derivado de `step`**, para não haver duas fontes da verdade. Se o passo atual
  também tiver `error`, vale `error` (mantendo o destaque de selecionado).
- Props: `open`, `onOpenChange`, `title`, `steps`, `step`, `defaultStep`, `onStepChange`, `onFinish`, `finishLabel`,
  `nextLabel`, `backLabel`, `nextDisabled`, `loading`, `showCloseButton` (padrão `true`), `closeLabel`.
- Textos em português como padrão (`Voltar`, `Próximo`, `Concluir`, `Fechar`), sobrescrevíveis.

## Comportamento

- **Próximo** fica `disabled` se o passo atual está em `error` ou `nextDisabled` é verdadeiro.
- **Voltar** não é renderizado no primeiro passo.
- No último passo, o botão primário vira `finishLabel`, chama `onFinish` e aceita `loading`.
- Com `loading`: Voltar, coluna de etapas e fechar ficam desabilitados; Esc e clique fora não fecham.
- Ao trocar de passo (botões ou coluna), o foco vai para o painel do passo.
- O conteúdo de cada passo é montado só quando o passo está ativo (o consumidor guarda o estado do formulário fora do passo).

## Visual (tokens semânticos, sem valor solto)

Casca herdada do `DialogContent`, com `className` para: `w-4/5 h-4/5 max-w-none sm:max-w-none rounded-2xl`. Como o dialog é `fixed`,
`w-4/5`/`h-4/5` resolvem contra a janela, sem valor arbitrário. Grade interna de duas colunas (coluna de etapas
de largura fixa + área principal).

**Coluna de etapas:** `bg-background`, `border-r border-border`, título do wizard em `text-lg`. Cada etapa é um botão
(`TabsTrigger`) com círculo de 24px (`size-6`) e linha de conexão de 2px até a próxima.

| Status | Círculo | Texto | Linha até a próxima |
|---|---|---|---|
| `pending` | borda `border-border`, número `text-muted-foreground` | `text-muted-foreground` | `bg-border` |
| `current` | borda `border-primary`, número `text-primary font-bold` | `text-foreground font-bold` | `bg-border` |
| `complete` | `bg-primary`, ícone `check` em `text-primary-foreground` | `text-foreground` | `bg-primary` |
| `error` | `bg-destructive-subtle`, borda `border-destructive`, ícone `exclamation` | `text-destructive` | `bg-border` |

Descrição opcional do passo: `text-sm text-foreground-secondary` abaixo do título. Foco: `focus-visible:focus-ring`.

**Área principal:** cabeçalho com o título do passo (`text-lg font-bold`) e botão X (`Button quiet icon-only`, como no
`DialogContent`), separado por `border-b border-border`. Corpo com `ScrollArea` e `p-4`. Rodapé como o do `DialogFooter`
(`bg-background`, `border-t`), conteúdo alinhado à direita, `gap-3`.

Mockup validado (claro e escuro) em `.superpowers/brainstorm/*/wizard-visual-v1.html`.

## Acessibilidade

- `Dialog` do Radix: foco preso, Esc, `DialogTitle`/`DialogDescription`.
- Coluna = `Tabs` com `orientation="vertical"`: setas, Home/End, `aria-selected`.
- Cada etapa traz um texto só para leitor de tela com o status ("concluído", "com erro"); a cor não carrega a informação sozinha.
- Painel do passo: `role="tabpanel"` rotulado pela etapa.

## Testes (Vitest + Testing Library + axe)

- Renderiza título, etapas e o conteúdo apenas do passo atual.
- Clique na etapa e setas chamam `onStepChange`; Voltar/Próximo andam um passo.
- Próximo bloqueado em `error` e em `nextDisabled`; Voltar ausente no primeiro passo.
- Último passo: `finishLabel`, `onFinish`, `loading` (botões e fechamento desabilitados).
- Texto de status para leitor de tela; sem violações de a11y; modo não controlado com `defaultStep`.

## Entregáveis

- `packages/ui/src/components/ui/wizard.tsx`, `wizard.test.tsx`, `wizard.stories.tsx` (Padrão, Importação, Com erro, Carregando).
- Export em `packages/ui/src/index.ts`; entrada em `manifest/components.json`; changeset `minor`.
- Ícone `exclamation` no `icon-registry.ts` (`check` e `xmark` já existem).
- Figma: página **Wizard** (skill `figma-component`), com índice, ledger e manifesto atualizados.
- Branch `feat/wizard`.

## Fora de escopo

Layout mobile (a coluna não tem fallback por enquanto), navegação bloqueada para passos futuros, persistência
de rascunho e animação de transição entre passos.
