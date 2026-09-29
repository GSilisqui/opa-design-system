import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox, type ComboboxOption } from "./combobox";

const departamentos: ComboboxOption[] = [
  { value: "comercial", label: "Comercial" },
  { value: "suporte", label: "Suporte" },
  { value: "financeiro", label: "Financeiro" },
  { value: "logistica", label: "Logística", keywords: ["entregas", "frete"] },
  { value: "rh", label: "Recursos Humanos", keywords: ["rh", "pessoas"] },
  { value: "juridico", label: "Jurídico", disabled: true },
];

const meta = {
  title: "Componentes/Combobox",
  component: Combobox,
  args: { label: "Departamento", options: departamentos, size: "default" },
  argTypes: {
    status: { control: "inline-radio", options: [undefined, "error", "success", "warning"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma (Select): https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=885-3949 · Todo seletor do DS é um Combobox com busca. Seleção múltipla: fase 2.",
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-5">
      <Combobox label="Departamento" options={departamentos} />
      <Combobox label="Departamento" options={departamentos} defaultValue="suporte" />
      <Combobox label="Departamento" options={departamentos} required status="error" description="Escolha um departamento" />
      <Combobox label="Departamento" options={departamentos} disabled />
    </div>
  ),
};

export const TamanhoSM: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-3">
      <Combobox size="sm" label="Departamento" options={departamentos} />
      <Combobox size="sm" label="Departamento" options={departamentos} defaultValue="financeiro" />
    </div>
  ),
};
