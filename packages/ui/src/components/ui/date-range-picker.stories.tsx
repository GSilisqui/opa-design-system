import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker, type DateRangePreset } from "./date-range-picker";

const day = 24 * 60 * 60 * 1000;
const ref = new Date(2025, 0, 18);
const back = (n: number) => ({ from: new Date(ref.getTime() - (n - 1) * day), to: ref });

const presets: DateRangePreset[] = [
  { label: "Hoje", range: () => ({ from: ref, to: ref }) },
  { label: "Ontem", range: () => ({ from: new Date(ref.getTime() - day), to: new Date(ref.getTime() - day) }) },
  { label: "Últimos 7 dias", range: () => back(7) },
  { label: "Últimos 30 dias", range: () => back(30) },
  { label: "Últimos 90 dias", range: () => back(90) },
];

const meta = {
  title: "Componentes/DateRangePicker",
  component: DateRangePicker,
  args: { label: "Período", size: "default" },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    status: { control: "inline-radio", options: [undefined, "error", "success", "warning"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=54-157 · Popover + Calendar em modo período, no campo do DatePicker. O período só é aplicado quando o fim é escolhido. `presets` (opcional) desenha a coluna de atalhos à esquerda: cada item tem `label` e `range()`; os atalhos em si (Hoje, Últimos 7 dias…) são de quem usa. `name` envia aaaa-mm-dd/aaaa-mm-dd.",
      },
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultValue: { from: new Date(2025, 0, 8), to: new Date(2025, 0, 16) } },
};

export const ComAtalhos: Story = {
  args: { presets, defaultValue: back(7) },
};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[320px] gap-5">
      <DateRangePicker label="Vazio" />
      <DateRangePicker label="Preenchido" defaultValue={back(7)} />
      <DateRangePicker label="Obrigatório" required status="error" description="Escolha o período" />
      <DateRangePicker label="Desabilitado" disabled />
    </div>
  ),
};

export const TamanhoSM: Story = {
  render: () => (
    <div className="grid max-w-[320px] gap-3">
      <DateRangePicker size="sm" label="Período" />
      <DateRangePicker size="sm" label="Período" defaultValue={back(7)} presets={presets} />
    </div>
  ),
};
