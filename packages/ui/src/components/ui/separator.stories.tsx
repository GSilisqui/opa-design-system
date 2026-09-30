import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Componentes/Separator",
  component: Separator,
  parameters: {
    docs: {
      description: {
        component: "Linha de 1px em `border`, horizontal ou vertical. Decorativa por padrão (sem papel para leitor de tela); `decorative={false}` expõe `role=\"separator\"`.",
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[280px]">
      <div className="text-base font-medium">Contatos</div>
      <div className="mb-3 text-sm text-foreground-secondary">Gerencie sua base.</div>
      <Separator />
      <div className="mt-3 text-base">Lista abaixo</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-3 text-base">
      Abertos
      <Separator orientation="vertical" />
      Fechados
      <Separator orientation="vertical" />
      Arquivados
    </div>
  ),
};
