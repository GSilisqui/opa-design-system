import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Icon } from "./icon";

const variants = ["primary", "destructive", "neutral", "quiet", "outline", "destructive-quiet", "success-quiet"] as const;

const meta = {
  title: "Componentes/Button",
  component: Button,
  args: { children: "Salvar", variant: "primary", size: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: ["sm", "default", "lg", "icon-sm", "icon", "icon-lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi/?node-id=10-1010 · Red Quiet = `destructive-quiet`, Green Quiet = `success-quiet`. Botão só com ícone precisa de `aria-label`.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">SM</Button>
      <Button>Default</Button>
      <Button size="lg">LG</Button>
      <Button size="icon-sm" variant="quiet" aria-label="Editar">
        <Icon name="pen" />
      </Button>
      <Button size="icon" variant="quiet" aria-label="Editar">
        <Icon name="pen" />
      </Button>
      <Button size="icon-lg" variant="quiet" aria-label="Editar">
        <Icon name="pen" />
      </Button>
    </div>
  ),
};

export const ComIcone: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button>
        <Icon name="plus" />
        Novo contato
      </Button>
      <Button variant="neutral">
        Filtrar
        <Icon name="angle-down" />
      </Button>
      <Button variant="destructive-quiet">
        <Icon name="trash" />
        Excluir
      </Button>
    </div>
  ),
};

export const Desabilitado: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
