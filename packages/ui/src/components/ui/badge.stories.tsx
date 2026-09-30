import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "Componentes/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=103-6 · Indicador de pendência: contador laranja (`warning`, 16px de altura, largura mínima 16, `rounded-full`, número em 10px medium) ou só a bolinha de 6px com halo de 2px (`warning` a 20%) com `dot`. O número é sempre claro (`primary-foreground`), por decisão do dono, mesmo com contraste abaixo do AA. Não confundir com o Tag (rótulo/categoria). Referências no Figma Chat: 413:5242 (bolinha) e 987:16351 (contador).",
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contador: Story = { args: { children: "3" } };

export const Bolinha: Story = { args: { dot: true, "aria-label": "Há pendências", role: "img" } };

export const Valores: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge>1</Badge>
      <Badge>12</Badge>
      <Badge>99+</Badge>
      <Badge dot role="img" aria-label="Há pendências" />
    </div>
  ),
};

export const EmUso: Story = {
  render: () => (
    <div className="flex w-64 items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-base">
      <span>Pedro Henrique</span>
      <Badge>3</Badge>
    </div>
  ),
};
