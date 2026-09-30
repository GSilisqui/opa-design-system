import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { InputField } from "./input-field";

const meta = {
  title: "Componentes/InputField",
  component: InputField,
  args: { label: "Nome do contato", placeholder: "Digite o nome", size: "default" },
  argTypes: {
    status: { control: "inline-radio", options: [undefined, "error", "success", "warning"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi/?node-id=11-138 · `default` (60px) tem label flutuante; `sm` (36px) usa o label como placeholder. Para um campo sem label visível, use `Input`.",
      },
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-5">
      <InputField label="Vazio" />
      <InputField label="Com descrição" description="Texto de ajuda" />
      <InputField label="Preenchido" defaultValue="Ana Souza" />
      <InputField label="E-mail" required status="error" defaultValue="ana@" description="Informe um e-mail válido" />
      <InputField label="CPF" status="success" defaultValue="123.456.789-00" description="CPF verificado" />
      <InputField label="Telefone" status="warning" defaultValue="(11) 9999-9999" description="Número sem WhatsApp" />
      <InputField label="Protocolo" readOnly defaultValue="#482913" />
      <InputField label="Apelido" optional disabled />
    </div>
  ),
};

export const TamanhoSM: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-3">
      <InputField size="sm" label="Buscar conversa" />
      <InputField size="sm" label="E-mail" status="error" description="Informe um e-mail válido" />
    </div>
  ),
};

export const InputPuro: Story = {
  render: () => <Input aria-label="Buscar" placeholder="Buscar…" className="max-w-[400px]" />,
};
