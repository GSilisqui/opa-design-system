import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { DataTable, DataTableColumnHeader } from "./data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Icon } from "./icon";
import { Input } from "./input";
import { Tag } from "./tag";

const meta = {
  title: "Componentes/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=99-89 · Receita do Shadcn (`Table` + TanStack Table v8) no visual do DS: contêiner com borda e raio 12, cabeçalho em `muted`, linhas de 48px, hover em `accent`, linha selecionada em `primary-subtle`, rolagem horizontal pelo `ScrollArea` e rodapé com `Pagination`. Ordenação com `DataTableColumnHeader`; `selectable` adiciona os checkboxes; `toolbar` recebe a tabela e fica acima, fora do contêiner. Para tabelas estáticas use `Table`, `TableRow`… direto.",
      },
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

type Voz = { nome: string; descricao: string; tipo: string };
const vozes: Voz[] = Array.from({ length: 13 }, (_, i) => ({
  nome: ["Lucas Almeida", "Gabriel Santos", "Mariana Oliveira", "Rafael Pereira", "Sofia Costa"][i % 5],
  descricao: "Descubra uma voz que combina profissionalismo e versatilidade. Com um tom acolhedor e claro.",
  tipo: "Padrão do sistema",
}));

const colunasVozes: ColumnDef<Voz>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>{row.original.nome.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {row.original.nome}
      </div>
    ),
  },
  { accessorKey: "descricao", header: "Descrição", cell: ({ row }) => <span className="block max-w-96 truncate">{row.original.descricao}</span> },
  { accessorKey: "tipo", header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" /> },
  {
    id: "acoes",
    header: () => <span className="sr-only">Ações</span>,
    cell: () => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="quiet" layout="icon-only" size="sm" aria-label="Ações da linha">
            <Icon name="ellipsis" className="rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const Padrao: Story = {
  args: { columns: colunasVozes as never, data: vozes as never },
  render: () => (
    <DataTable
      columns={colunasVozes}
      data={vozes}
      pageSize={13}
      toolbar={() => (
        <div className="flex items-center justify-between gap-2">
          <div className="relative w-60">
            <Icon name="magnifying-glass" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-primary" />
            <Input aria-label="Buscar vozes" placeholder="Busque por vozes…" className="pl-9" />
          </div>
          <Button>
            <Icon name="plus" />
            Clonar nova voz
          </Button>
        </div>
      )}
    />
  ),
};

type Atendimento = { protocolo: string; status: string; cliente: string; atendente: string; aberto: string };
const atendimentos: Atendimento[] = Array.from({ length: 13 }, (_, i) => ({
  protocolo: `OPA2025${274 + i}`,
  status: "Em andamento",
  cliente: "Gabriela Vanessa Cardoso",
  atendente: "Gabriel Silisqui",
  aberto: "13/05/2025 09:31",
}));

const colunasAtendimentos: ColumnDef<Atendimento>[] = [
  { accessorKey: "protocolo", header: "Protocolo" },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Tag variant="info">{row.original.status}</Tag>,
  },
  { accessorKey: "cliente", header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" /> },
  { accessorKey: "atendente", header: ({ column }) => <DataTableColumnHeader column={column} title="Último atendente" /> },
  { accessorKey: "aberto", header: ({ column }) => <DataTableColumnHeader column={column} title="Aberto em" /> },
];

export const ComSelecao: Story = {
  args: { columns: colunasAtendimentos as never, data: atendimentos as never },
  render: () => (
    <DataTable
      columns={colunasAtendimentos}
      data={atendimentos}
      selectable
      pageSize={6}
      toolbar={() => (
        <div className="flex items-center justify-between gap-2">
          <div className="relative w-60">
            <Icon name="magnifying-glass" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-primary" />
            <Input aria-label="Buscar atendimentos" placeholder="Busque por atendimentos…" className="pl-9" />
          </div>
          <Button variant="outline">Exportar</Button>
        </div>
      )}
    />
  ),
};

export const Carregando: Story = {
  args: { columns: colunasAtendimentos as never, data: [] },
  render: () => <DataTable columns={colunasAtendimentos} data={[]} loading pageSize={5} />,
};

export const Vazio: Story = {
  args: { columns: colunasAtendimentos as never, data: [] },
  render: () => <DataTable columns={colunasAtendimentos} data={[]} />,
};
