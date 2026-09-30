import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./scroll-area";

const meta = {
  title: "Componentes/ScrollArea",
  component: ScrollArea,
  parameters: {
    docs: {
      description: {
        component:
          "Radix ScrollArea com faixa fixa de 14px demarcada por uma linha, setas nas pontas e o polegar no meio, tudo em `muted-foreground` a 50% (escurece no hover). `orientation` vertical (padrão) ou horizontal. A caixa ao redor (borda, raio) é de quem usa: passe `className`. As setas são só para o mouse; o teclado rola o conteúdo direto.",
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const nomes = ["Ana Souza", "Bruno Lima", "Carla Mota", "Diego Reis", "Elisa Prado", "Fábio Neri", "Gabi Alves", "Hugo Melo"];

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-[132px] w-[200px] rounded-xl border border-border bg-card">
      <div className="p-1">
        {nomes.map((n) => (
          <div key={n} className="flex h-7 items-center rounded-lg px-2.5 text-base">
            {n}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea orientation="horizontal" className="w-[200px] rounded-xl border border-border bg-card">
      <div className="flex w-max gap-1.5 p-1.5">
        {["Todos", "Abertos", "Fechados", "Arquivados", "Favoritos", "Recentes"].map((t) => (
          <span key={t} className="rounded-lg bg-muted px-2.5 py-1 text-base">
            {t}
          </span>
        ))}
      </div>
    </ScrollArea>
  ),
};
