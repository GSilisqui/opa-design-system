import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";
import { brandIconNames, iconNames } from "./icon-registry";

const meta = {
  title: "Componentes/Icon",
  component: Icon,
  args: { name: "face-smile", variant: "regular", size: "md" },
  argTypes: {
    name: { control: "select", options: iconNames },
    variant: { control: "inline-radio", options: ["regular", "solid"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Font Awesome 7 Pro. Regular por padrão; solid para estados ativos. Logos de marcas com `variant=\"brands\"`. Sem `label`, é decorativo. Galeria completa em Fundações/Ícones.",
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-end gap-4 text-foreground">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Icon key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Logos: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      {brandIconNames.map((name) => (
        <Icon key={name} name={name} variant="brands" size="xl" label={name} />
      ))}
    </div>
  ),
};
