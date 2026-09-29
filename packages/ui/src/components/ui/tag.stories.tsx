import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";
import { Tag } from "./tag";

const variants = ["neutral", "primary", "success", "warning", "info", "destructive", "highlight"] as const;
const labels: Record<(typeof variants)[number], string> = {
  neutral: "Neutra",
  primary: "Primária",
  success: "Resolvido",
  warning: "Pendente",
  info: "Novo",
  destructive: "Atrasado",
  highlight: "VIP",
};

const meta = {
  title: "Componentes/Tag",
  component: Tag,
  args: { children: "Novo", variant: "info", size: "default" },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: ["default", "md"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma (Chip): https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=304-4496 · Rótulo/categoria. Para indicador de pendência (contador), use Badge (fora do piloto). Yellow = `highlight`, Danger = `destructive`.",
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["default", "md"] as const).map((size) => (
        <div key={size} className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Tag key={variant} variant={variant} size={size}>
              {labels[variant]}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ComIconeERemover: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Tag key={variant} variant={variant} onRemove={() => {}}>
          <Icon name="circle-info" />
          {labels[variant]}
        </Tag>
      ))}
    </div>
  ),
};
