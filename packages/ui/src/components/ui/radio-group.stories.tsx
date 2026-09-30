import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Componentes/RadioGroup",
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Radix RadioGroup. Itens de 20px (`default`) ou 16px (`sm`). O grupo precisa de nome acessível (`aria-label` ou `aria-labelledby`).",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => (
    <RadioGroup aria-label="Canal de atendimento" defaultValue="whatsapp">
      {[
        ["whatsapp", "WhatsApp"],
        ["email", "E-mail"],
        ["telefone", "Telefone"],
      ].map(([value, label]) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem id={`canal-${value}`} value={value} />
          <Label htmlFor={`canal-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Estados: Story = {
  render: () => (
    <RadioGroup aria-label="Estados" defaultValue="b">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r-a" value="a" />
        <Label htmlFor="r-a">Desmarcado</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r-b" value="b" />
        <Label htmlFor="r-b">Marcado</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r-c" value="c" aria-invalid />
        <Label htmlFor="r-c">Inválido</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r-d" value="d" disabled />
        <Label htmlFor="r-d">Desabilitado</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r-e" value="e" size="sm" />
        <Label htmlFor="r-e">Tamanho sm</Label>
      </div>
    </RadioGroup>
  ),
};
