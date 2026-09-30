"use client";

// Receita oficial do Shadcn (Table + TanStack Table v8) no visual das referências do dono: barra de ferramentas fora da tabela,
// contêiner com borda e raio, rolagem horizontal pelo ScrollArea do DS, seleção por checkbox e rodapé com Pagination.
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Pagination } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DataTableLabels = {
  empty: string;
  selectAll: string;
  selectRow: string;
  selected: (count: number) => string;
  summary: (range: { from: number; to: number; total: number }) => string;
};

const defaultLabels: DataTableLabels = {
  empty: "Nenhum resultado.",
  selectAll: "Selecionar todas as linhas",
  selectRow: "Selecionar linha",
  selected: (count) => `${count} selecionado${count === 1 ? "" : "s"}`,
  summary: ({ from, to, total }) => `Exibindo ${from} - ${to} de ${total}`,
};

type DataTableProps<TData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  /** Coluna de checkbox à esquerda (seleciona linhas e mostra "N selecionados" no rodapé). */
  selectable?: boolean;
  /** Linhas por página (padrão 10). */
  pageSize?: number;
  /** Mostra linhas de Skeleton no lugar dos dados. */
  loading?: boolean;
  /** Barra acima da tabela (busca, filtros, ações): recebe a instância da tabela. */
  toolbar?: (table: TanstackTable<TData>) => React.ReactNode;
  onSelectionChange?: (rows: TData[]) => void;
  labels?: Partial<DataTableLabels>;
  className?: string;
};

function DataTable<TData>({ columns, data, selectable, pageSize = 10, loading, toolbar, onSelectionChange, labels, className }: DataTableProps<TData>) {
  const text = { ...defaultLabels, ...labels };
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (!selectable) return columns;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const select: ColumnDef<TData, any> = {
      id: "select",
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          size="sm"
          aria-label={text.selectAll}
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
        />
      ),
      cell: ({ row }) => <Checkbox size="sm" aria-label={text.selectRow} checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(value === true)} />,
    };
    return [select, ...columns];
  }, [columns, selectable, text.selectAll, text.selectRow]);

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  React.useEffect(() => {
    onSelectionChange?.(table.getSelectedRowModel().rows.map((row) => row.original));
  }, [rowSelection]);

  const { pageIndex, pageSize: size } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const rows = table.getRowModel().rows;
  const summary = (range: { from: number; to: number; total: number }) =>
    selectable && selectedCount > 0 ? `${text.summary(range)}  |  ${text.selected(selectedCount)}` : text.summary(range);

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)}>
      {toolbar?.(table)}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <ScrollArea orientation="horizontal">
          <Table containerClassName="overflow-visible">
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id} className="border-b-0 hover:bg-transparent">
                  {group.headers.map((header) => (
                    <TableHead key={header.id} aria-sort={sortAria(header.column.getIsSorted())}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: Math.min(size, 5) }, (_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    {allColumns.map((_c, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-3 w-full max-w-40" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length ? (
                rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={allColumns.length} className="h-24 text-center text-foreground-secondary">
                    {text.empty}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <Pagination
        page={pageIndex + 1}
        pageCount={table.getPageCount()}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        total={total}
        pageSize={size}
        labels={{ summary }}
      />
    </div>
  );
}

function sortAria(state: false | "asc" | "desc") {
  return state === "asc" ? "ascending" : state === "desc" ? "descending" : undefined;
}

/** Título de coluna ordenável: clique alterna crescente, decrescente e sem ordem. */
function DataTableColumnHeader<TData, TValue>({ column, title, className }: { column: Column<TData, TValue>; title: string; className?: string }) {
  if (!column.getCanSort()) return <span className={className}>{title}</span>;
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn("-mx-1 inline-flex items-center gap-1.5 rounded-md px-1 outline-none focus-visible:focus-ring", className)}
    >
      {title}
      <span aria-hidden="true" className="inline-flex flex-col -space-y-1.5 text-muted-foreground/50">
        <Icon name="angle-up" size="xs" className={cn(sorted === "asc" && "text-foreground")} />
        <Icon name="angle-down" size="xs" className={cn(sorted === "desc" && "text-foreground")} />
      </span>
    </button>
  );
}

export { DataTable, DataTableColumnHeader, type DataTableLabels, type DataTableProps };
