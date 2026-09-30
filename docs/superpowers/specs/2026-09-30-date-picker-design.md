# Date Picker, Calendar e Date Range Picker — desenho

Aprovado pelo dono em 2026-09-30, no companion visual (brainstorming). Fase 2 (formulários) do spec principal, §8.4.

## Decisões

- **Campo:** `size="default"` (60px, label flutuante) e `size="sm"` (36px, label como placeholder), igual ao InputField e ao Combobox. Ícone de calendário à direita.
- **Calendário:** o "1" do companion. Cabeçalho com setas nas pontas e o mês no centro ("janeiro de 2025"), dias da semana de uma letra, pt-BR por padrão, popover de 280px.
- **Dias (estilo do Figma de Filtros Salvos, do dono):**
  - data única: dia em `primary` cheio, raio 12;
  - período: extremos em `primary`, meio em `primary-subtle`, faixa contínua;
  - hoje: ponto de 4px embaixo do número (claro quando o dia está selecionado);
  - fora do mês: `muted-foreground`; desabilitado: `opacity-40`.
- **Período:** coluna de atalhos à esquerda do calendário. Os atalhos são passados por quem usa; o DS só desenha a coluna e marca o ativo.
- **Fora do escopo:** seletor de operador ("é / antes de / entre", é construtor de filtro), os atalhos em si, seleção múltipla do Combobox (próximo brainstorming).

## Código (`packages/ui`)

| Componente | Origem | Notas |
|---|---|---|
| `Calendar` | Shadcn `calendar` (react-day-picker 9) | modos `single` e `range`; tokens do DS; locale `ptBR` padrão; exporta o tipo `DateRange` |
| `DatePicker` | exemplo oficial do Shadcn (Popover + Calendar) | props: `label`, `value` (`Date`), `onValueChange`, `size`, `status`, `description`, `required`, `disabled`, `placeholder`, `minDate`, `maxDate`, `id`, `name`; formato `dd/MM/yyyy`; erro de `required` como no Combobox |
| `DateRangePicker` | idem, `mode="range"` | `value` (`DateRange`), `presets?: { label: string; range: () => DateRange }[]`; texto "12/01/2025 – 18/01/2025" |

- Ícones novos no registro: `calendar`, `angle-left`, `angle-right`.
- Dependências: `react-day-picker` e `date-fns` (dependencies).
- Acessibilidade: grade do react-day-picker (roles e teclado), campo com nome pelo label, testes + stories com a11y.

## Figma

`Calendar Day` (dia, hoje, selecionado, início, meio, fim, fora do mês, desabilitado), `Calendar`, `DatePicker` (size × state, como o Combobox), `DateRangePicker` (com a coluna de atalhos). Só variáveis e estilos.

## Ordem

1. Calendar + ícones. 2. DatePicker. 3. DateRangePicker + atalhos. 4. Figma, manifesto, README e changeset. Cada etapa com testes, stories e `pnpm verify`.
