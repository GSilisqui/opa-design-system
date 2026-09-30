import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Componentes/Checkbox",
  component: Checkbox,
  args: { size: "default", "aria-label": "Aceito os termos" },
  argTypes: { size: { control: "inline-radio", options: ["default", "sm"] } },
  parameters: {
    docs: {
      description: {
        component:
          "Radix Checkbox. 20px (`default`) e 16px (`sm`). Use com `Label` (`htmlFor`) ou `aria-label`. `checked=\"indeterminate\"` mostra o traço.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid gap-3">
      {[
        { id: "e1", label: "Desmarcado" },
        { id: "e2", label: "Marcado", defaultChecked: true },
        { id: "e3", label: "Indeterminado", checked: "indeterminate" as const },
        { id: "e4", label: "Inválido", "aria-invalid": true },
        { id: "e5", label: "Desabilitado", disabled: true },
        { id: "e6", label: "Desabilitado marcado", disabled: true, defaultChecked: true },
      ].map(({ id, label, ...rest }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox id={id} {...rest} />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="default" defaultChecked />
      <Checkbox aria-label="sm" size="sm" defaultChecked />
    </div>
  ),
};
