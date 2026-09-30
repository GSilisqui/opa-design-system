import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./pagination";

const meta = {
  title: "Componentes/Pagination",
  component: Pagination,
  args: { page: 1, pageCount: 10, total: 100, pageSize: 10 },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=80-97 · Composição do DS (desenho do Figma antigo), não o Pagination numerado do Shadcn: resumo \"Exibindo 1 – 10 de 100\" à esquerda; \"Página 1 de 10\" e botões primeira/anterior/próxima/última (Quiet, só ícone) à direita. Controlado: `page` + `onPageChange`. Sem `total`/`pageSize`, some o resumo.",
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return (
      <div className="max-w-[560px]">
        <Pagination {...args} page={page} onPageChange={setPage} />
      </div>
    );
  },
};

export const Posicoes: Story = {
  render: () => (
    <div className="grid max-w-[560px] gap-4">
      {/* Cada navegação precisa de um nome único quando há várias na mesma tela. */}
      <Pagination page={1} pageCount={10} total={100} pageSize={10} labels={{ nav: "Paginação, primeira página" }} />
      <Pagination page={5} pageCount={10} total={100} pageSize={10} labels={{ nav: "Paginação, página do meio" }} />
      <Pagination page={10} pageCount={10} total={95} pageSize={10} labels={{ nav: "Paginação, última página" }} />
      <Pagination page={1} pageCount={1} labels={{ nav: "Paginação, página única" }} />
    </div>
  ),
};
