import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import { DataTable, DataTableColumnHeader } from "./data-table";

type Row = { nome: string; cidade: string };
const data: Row[] = [
  { nome: "Carla", cidade: "Recife" },
  { nome: "Ana", cidade: "Natal" },
  { nome: "Bruno", cidade: "Belém" },
];
const columns: ColumnDef<Row>[] = [
  { accessorKey: "nome", header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" /> },
  { accessorKey: "cidade", header: "Cidade" },
];
const names = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((r) => within(r).getAllByRole("cell")[0].textContent);

describe("DataTable", () => {
  it("mostra cabeçalho, linhas e o resumo do rodapé", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByRole("columnheader", { name: /Nome/ })).toBeInTheDocument();
    expect(names()).toEqual(["Carla", "Ana", "Bruno"]);
    expect(screen.getByText("Exibindo 1 - 3 de 3")).toBeInTheDocument();
  });

  it("clicar no título ordena e marca aria-sort", async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByRole("button", { name: "Nome" }));
    expect(names()).toEqual(["Ana", "Bruno", "Carla"]);
    expect(screen.getByRole("columnheader", { name: /Nome/ })).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(screen.getByRole("button", { name: "Nome" }));
    expect(names()).toEqual(["Carla", "Bruno", "Ana"]);
    expect(screen.getByRole("columnheader", { name: /Nome/ })).toHaveAttribute("aria-sort", "descending");
  });

  it("selectable: marca linhas, mostra o total selecionado e avisa onSelectionChange", async () => {
    const onSelectionChange = vi.fn();
    render(<DataTable columns={columns} data={data} selectable onSelectionChange={onSelectionChange} />);
    const boxes = screen.getAllByRole("checkbox", { name: "Selecionar linha" });
    await userEvent.click(boxes[1]);
    expect(screen.getByText(/1 selecionado/)).toBeInTheDocument();
    expect(onSelectionChange).toHaveBeenLastCalledWith([data[1]]);
    expect(screen.getAllByRole("row")[2]).toHaveAttribute("data-state", "selected");
    await userEvent.click(screen.getByRole("checkbox", { name: "Selecionar todas as linhas" }));
    expect(screen.getByText(/3 selecionados/)).toBeInTheDocument();
  });

  it("pagina com pageSize e navega pelo Pagination", async () => {
    render(<DataTable columns={columns} data={data} pageSize={2} />);
    expect(names()).toEqual(["Carla", "Ana"]);
    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(names()).toEqual(["Bruno"]);
  });

  it("sem dados mostra a mensagem vazia; loading mostra skeletons", () => {
    const { rerender, container } = render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText("Nenhum resultado.")).toBeInTheDocument();
    rerender(<DataTable columns={columns} data={data} loading />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    expect(screen.queryByText("Carla")).not.toBeInTheDocument();
  });

  it("a barra de ferramentas recebe a tabela", () => {
    render(<DataTable columns={columns} data={data} toolbar={(t) => <p>{t.getRowModel().rows.length} linhas</p>} />);
    expect(screen.getByText("3 linhas")).toBeInTheDocument();
  });
});
