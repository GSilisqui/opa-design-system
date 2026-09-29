import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Icon } from "./icon";

const variants = ["primary", "destructive", "neutral", "quiet", "outline", "destructive-quiet", "success-quiet"] as const;

const meta = {
  title: "Componentes/Button",
  component: Button,
  args: { children: "Salvar", variant: "primary", size: "default", layout: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    layout: { control: "inline-radio", options: ["default", "icon-only"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi/?node-id=10-1010 · Red Quiet = `destructive-quiet`, Green Quiet = `success-quiet`. `size` (sm/default/lg) e `layout` (default/icon-only) são independentes. Botão só com ícone (`layout=\"icon-only\"`) precisa de `aria-label`.",
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
    </div>
  ),
};

export const SoIcone: Story = {
  name: "Só ícone (layout icon-only)",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Button key={size} size={size} layout="icon-only" variant="quiet" aria-label="Editar">
          <Icon name="pen" />
        </Button>
      ))}
      {(["sm", "default", "lg"] as const).map((size) => (
        <Button key={"p" + size} size={size} layout="icon-only" aria-label="Adicionar">
          <Icon name="plus" />
        </Button>
      ))}
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
