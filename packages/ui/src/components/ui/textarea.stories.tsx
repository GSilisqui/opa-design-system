import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "Componentes/Textarea",
  component: Textarea,
  args: { placeholder: "Escreva uma observação", "aria-label": "Observações" },
  parameters: {
    docs: {
      description: {
        component:
          "Mesmo visual do Input (card + border, raio 12px). Cresce com o conteúdo (`field-sizing-content`). Para texto curto de uma linha, use Input ou InputField.",
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid max-w-[400px] gap-3">
      <div className="grid gap-1">
        <Label htmlFor="t1">Observações</Label>
        <Textarea id="t1" placeholder="Escreva uma observação" />
      </div>
      <Textarea aria-label="Preenchido" defaultValue="Cliente prefere contato à tarde, depois das 14h." />
      <Textarea aria-label="Inválido" aria-invalid defaultValue="Texto acima do limite" />
      <Textarea aria-label="Desabilitado" disabled placeholder="Desabilitado" />
    </div>
  ),
};
