import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./date-picker";

const meta = {
  title: "Componentes/DatePicker",
  component: DatePicker,
  args: { label: "Data de nascimento", size: "default" },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    status: { control: "inline-radio", options: [undefined, "error", "success", "warning"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=54-41 · Popover + Calendar do Shadcn, com o campo no padrão do Combobox: `default` (60px, label flutuante) e `sm` (36px, label como placeholder). Data em dd/mm/aaaa; `name` envia em aaaa-mm-dd. Para período, use DateRangePicker.",
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[320px] gap-5">
      <DatePicker label="Vazio" />
      <DatePicker label="Preenchido" defaultValue={new Date(1990, 2, 12)} />
      <DatePicker label="Obrigatório" required status="error" description="Informe a data de nascimento" />
      <DatePicker label="Verificada" status="success" defaultValue={new Date(1990, 2, 12)} description="Data confirmada" />
      <DatePicker label="Aviso" status="warning" defaultValue={new Date(2001, 0, 3)} description="Data muito antiga" />
      <DatePicker label="Desabilitado" disabled />
    </div>
  ),
};

export const TamanhoSM: Story = {
  render: () => (
    <div className="grid max-w-[320px] gap-3">
      <DatePicker size="sm" label="Data de início" />
      <DatePicker size="sm" label="Data de início" defaultValue={new Date(2025, 0, 12)} />
    </div>
  ),
};

export const ComLimites: Story = {
  render: () => (
    <div className="grid max-w-[320px] gap-3">
      <DatePicker label="Entrega (só janeiro de 2025)" defaultValue={new Date(2025, 0, 15)} minDate={new Date(2025, 0, 10)} maxDate={new Date(2025, 0, 20)} />
    </div>
  ),
};
