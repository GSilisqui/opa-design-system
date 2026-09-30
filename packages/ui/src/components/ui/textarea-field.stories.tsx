import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaField } from "./textarea-field";

const meta = {
  title: "Componentes/TextareaField",
  component: TextareaField,
  args: { label: "Observações", size: "default" },
  argTypes: {
    status: { control: "inline-radio", options: [undefined, "error", "success", "warning"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=62-24 · Igual ao InputField, para várias linhas: `default` tem caixa escura (input-background) e label flutuante que sobe ao digitar; `sm` tem caixa clara e o label é o placeholder. Cresce com o conteúdo. Para um campo sem label visível, use `Textarea`.",
      },
    },
  },
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-5">
      <TextareaField label="Vazio" />
      <TextareaField label="Preenchido" defaultValue="Cliente prefere contato à tarde, depois das 14h. Não ligar às segundas." />
      <TextareaField label="Observações" required status="error" defaultValue="Texto acima do limite" description="Use no máximo 120 caracteres" />
      <TextareaField label="Motivo" status="success" defaultValue="Motivo registrado" description="Salvo no histórico" />
      <TextareaField label="Nota" optional disabled />
    </div>
  ),
};

export const TamanhoSM: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-3">
      <TextareaField size="sm" label="Observações" />
      <TextareaField size="sm" label="Observações" status="error" description="Use no máximo 120 caracteres" defaultValue="Texto longo demais" />
    </div>
  ),
};
