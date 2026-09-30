import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Componentes/Skeleton",
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=97-47 · Bloco `accent` que pulsa enquanto o conteúdo carrega (parado com \"reduzir movimento\"). Você monta a forma com classes: linha, círculo ou quadrado com o raio do componente que vai aparecer no lugar.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linha: Story = { render: () => <Skeleton className="h-3 w-48" /> };

export const Contato: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="size-9 rounded-xl" />
      <div className="grid gap-2">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  ),
};

export const Bloco: Story = { render: () => <Skeleton className="h-[72px] w-[300px] rounded-xl" /> };
