import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Componentes/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=73-232 · Radix Tabs. `variant` da lista: `segmented` (trilho cinza, aba ativa em card) ou `underline` (linha embaixo). `size`: `default` (36px) ou `sm` (24px). Aba só com ícone: `layout=\"icon-only\"` e `aria-label`. Setas navegam, Home/End vão às pontas.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ variant, size }: { variant?: "segmented" | "underline"; size?: "default" | "sm" }) {
  return (
    <Tabs defaultValue="abertos" className="max-w-[420px]">
      <TabsList variant={variant} size={size} aria-label="Atendimentos">
        <TabsTrigger value="abertos">
          <Icon name="face-smile" />
          Abertos
        </TabsTrigger>
        <TabsTrigger value="fechados">
          <Icon name="check" />
          Fechados
        </TabsTrigger>
        <TabsTrigger value="arquivados" disabled>
          Arquivados
        </TabsTrigger>
        <TabsTrigger value="busca" layout="icon-only" aria-label="Busca">
          <Icon name="magnifying-glass" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="abertos" className="text-base text-foreground-secondary">
        12 atendimentos abertos.
      </TabsContent>
      <TabsContent value="fechados" className="text-base text-foreground-secondary">
        340 atendimentos fechados.
      </TabsContent>
      <TabsContent value="busca" className="text-base text-foreground-secondary">
        Busque por nome ou protocolo.
      </TabsContent>
    </Tabs>
  );
}

export const Segmented: Story = { render: () => <Demo variant="segmented" /> };
export const Underline: Story = { render: () => <Demo variant="underline" /> };

export const Tamanhos: Story = {
  render: () => (
    <div className="grid gap-6">
      <Demo variant="segmented" size="default" />
      <Demo variant="segmented" size="sm" />
      <Demo variant="underline" size="default" />
      <Demo variant="underline" size="sm" />
    </div>
  ),
};
