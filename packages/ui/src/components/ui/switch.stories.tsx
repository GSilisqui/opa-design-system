import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "Componentes/Switch",
  component: Switch,
  args: { size: "default", "aria-label": "Notificações" },
  argTypes: { size: { control: "inline-radio", options: ["default", "sm"] } },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=47-72 · Radix Switch. 36×20px (`default`) e 28×16px (`sm`). Liga/desliga aplica na hora; para escolhas que dependem de um envio, use Checkbox.",
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid gap-3">
      {[
        { id: "s1", label: "Desligado" },
        { id: "s2", label: "Ligado", defaultChecked: true },
        { id: "s3", label: "Desabilitado", disabled: true },
        { id: "s4", label: "Desabilitado ligado", disabled: true, defaultChecked: true },
        { id: "s5", label: "Tamanho sm", size: "sm" as const, defaultChecked: true },
      ].map(({ id, label, ...rest }) => (
        <div key={id} className="flex items-center gap-2">
          <Switch id={id} {...rest} />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  ),
};
