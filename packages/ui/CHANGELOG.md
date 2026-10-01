# @gsilisqui/ui

## 0.3.0

### Minor Changes

- 637e38f: Novo `Badge` (indicador de pendência): contador laranja ou só a bolinha (`dot`). O aviso do `SidebarItem` passa a usar o Badge.
- 9fd983c: Novo `Calendar` (Shadcn, react-day-picker) em pt-BR: data única e período, com dia selecionado em `primary`, meio do período em `primary-subtle` e ponto no dia de hoje. Ícones `calendar`, `angle-left` e `angle-right` no registro. Exporta o tipo `DateRange`.
- 9fd983c: Combobox com seleção múltipla (`multiple`): `value`/`defaultValue` em `string[]` e `onValueChange(string[])`. As escolhas viram Tags no campo (uma linha, com ✕ para remover) e o que não couber vira um contador `+N`; a lista fica aberta ao escolher e mostra um Checkbox à direita. Envia um valor por item (`name`). Sem `multiple`, nada muda.
- 9fd983c: Novos `DatePicker` (data única) e `DateRangePicker` (período, com coluna de atalhos opcional via `presets`), sobre Popover + Calendar do Shadcn. Campo no padrão do Combobox (`size` default 60px e sm 36px, status, descrição, obrigatório). Data em dd/mm/aaaa; `name` envia aaaa-mm-dd (período: aaaa-mm-dd/aaaa-mm-dd). `react-day-picker` e `date-fns` como dependências.
- d40363f: Dialog: novo estilo com padding de 12px, header e corpo no `card` e footer no `background`, separados por divisórias. `DialogContent` não tem padding (cada seção cuida do seu); conteúdo customizado deve ficar em `DialogHeader`, `DialogFooter` ou como filho direto (recebe `p-3`). Texto solto vai na `DialogDescription`, não num corpo separado. O botão de cancelar do footer passa a ser `outline`. Button `outline` agora tem fundo `card` e hover/active por mistura com o foreground.
- 0e9c0db: Fase 3: novos `DropdownMenu` (superfície do Popover, itens de 36px com ícone e atalho, destrutivo, marcar/opção e submenu), `Sheet` (painel lateral no estilo do Dialog v2, `side` right/left/top/bottom) e `Breadcrumb` (página atual em medium, colapso com `…`).
- 9fd983c: Fase 2 (formulários): novos `Checkbox` (20px; `size="sm"` 16px, com estado indeterminado), `RadioGroup`/`RadioGroupItem` (20px; sm 16px), `Switch` (36×20px; sm 28×16px) e `Textarea` (mesmo visual do Input). Ícone `minus` no registro.
- 0e9c0db: Fase 3: novos `Tabs` (`segmented` | `underline`, `default` | `sm`, aba só com ícone), `Toaster`/`toast` (Sonner no estilo do DS: cartão popover, ícone só nos tipos, ação em Outline pequeno, fechar no canto) e `Tooltip` (compacto, cor inversa, sem seta, `text-sm`). Ícones `circle-xmark` e `spinner` no registro. `sonner` como dependência.
- f556d92: Fase 4: novos `Card`, `Avatar` (quadrado arredondado em 5 tamanhos que casam com Button e Input, mais `AvatarGroup`), `Skeleton`, `Separator`, `Accordion` e `ScrollArea` (faixa de 14px com linha, setas e polegar, vertical ou horizontal).
- f556d92: Fase 4: novos `Table`, `DataTable` (TanStack Table v8: ordenação, seleção, paginação, carregando e vazio) e `Sidebar`/`SidebarPanel` (rail de ícones sempre recolhido e painel contextual). `@tanstack/react-table` como dependência.
- 9fd983c: Novo `Form` (Shadcn: react-hook-form + zod): `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`. `react-hook-form` é peerDependency (`^7.50`). Erro do zod liga `aria-invalid`, pinta o label e mostra a mensagem em `destructive`.
- d40363f: Exporta o `cn` do DS; `exports["."]` ganha a condição `default`; Tailwind v4 e `@types/react` (opcional) como peerDependencies; o CSS publicado ignora `*.map` no `@source`; Tag com `onRemove` respeita o `gap-*` do consumidor; README documenta o requisito `moduleResolution: bundler`.
- d40363f: `<Icon variant="brands" />` desenha logos de marcas (Facebook, Messenger, Google, Instagram, LinkedIn, Telegram, WhatsApp, X) a partir de `@fortawesome/free-brands-svg-icons`, agora peerDependency. Novo export `brandIconNames`; `BrandIconName` como tipo.
- 0e9c0db: Novo `Pagination` (composição do DS, desenho do Figma antigo): resumo "Exibindo 1 – 10 de 100", "Página X de Y" e botões primeira/anterior/próxima/última (Quiet, só ícone). Controlado por `page`/`pageCount`/`onPageChange`. Ícones `angles-left` e `angles-right` no registro.
- 9fd983c: Novo `TextareaField` (Textarea + Label + descrição), no padrão do InputField: `size="default"` com caixa escura e label flutuante que sobe ao digitar, e `size="sm"` com caixa clara. Status (`error`/`success`/`warning`), `required`, `optional` e `description`.
- edb238e: Wizard: novo dialog em passos para formulários longos e importações. Etapas na vertical à esquerda (círculo numerado + linha, com `status` `complete`/`error`), navegação livre por clique ou teclado, passo atual controlado por `step`/`onStepChange` e `steps={[{ id, title, content }]}`. Próximo bloqueado quando o passo está com `error`; `loading` trava a navegação. Ocupa 80% da janela.

### Patch Changes

- d40363f: Combobox: `sm` preenchido mostra só o valor (label vira sr-only); campo obrigatório bloqueado no envio mostra o erro no próprio componente (`aria-invalid`) em vez do balão do navegador; o item destacado acompanha o `value` controlado com o popup aberto; o valor atual é rolado para a vista ao abrir; input oculto com `autoComplete="off"`.
- 9fd983c: A descrição de campo sem status (InputField e Combobox, single e múltiplo) usa `foreground-secondary` em vez de `muted-foreground`, para passar o contraste de 4,5:1 nos 10px.

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
