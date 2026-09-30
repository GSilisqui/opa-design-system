"use client";

// Composição do DS aprovada pelo dono (desenho do Figma antigo, Pagination 337:7985): NÃO é o Pagination numerado do Shadcn.
// Resumo "Exibindo 1 – 10 de 100" à esquerda; "Página 1 de 10" e botões de primeira/anterior/próxima/última à direita.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type PaginationProps = Omit<React.ComponentProps<"nav">, "onChange"> & {
  /** Página atual (começa em 1). */
  page: number;
  /** Total de páginas. */
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Total de itens: com `pageSize`, mostra o resumo "Exibindo 1 – 10 de 100". */
  total?: number;
  pageSize?: number;
  disabled?: boolean;
  /** Textos (padrão em português). */
  labels?: {
    nav?: string;
    summary?: (range: { from: number; to: number; total: number }) => string;
    page?: (page: number, pageCount: number) => string;
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
};

const defaultLabels = {
  nav: "Paginação",
  summary: ({ from, to, total }: { from: number; to: number; total: number }) => `Exibindo ${from} – ${to} de ${total}`,
  page: (page: number, pageCount: number) => `Página ${page} de ${pageCount}`,
  first: "Primeira página",
  previous: "Página anterior",
  next: "Próxima página",
  last: "Última página",
};

function Pagination({ page, pageCount, onPageChange, total, pageSize, disabled, labels, className, ...props }: PaginationProps) {
  const text = { ...defaultLabels, ...labels };
  const count = Math.max(pageCount, 1);
  const current = Math.min(Math.max(page, 1), count);
  const atStart = current <= 1;
  const atEnd = current >= count;
  const go = (next: number) => onPageChange?.(Math.min(Math.max(next, 1), count));
  const showSummary = total !== undefined && pageSize !== undefined;
  const from = total === 0 ? 0 : (current - 1) * (pageSize ?? 0) + 1;
  const to = Math.min(current * (pageSize ?? 0), total ?? 0);

  return (
    <nav
      aria-label={text.nav}
      data-slot="pagination"
      className={cn("flex w-full items-center justify-between gap-4 text-base text-foreground-secondary", className)}
      {...props}
    >
      <p data-slot="pagination-summary">{showSummary ? text.summary({ from, to, total: total! }) : null}</p>
      <div className="flex items-center gap-2">
        <span data-slot="pagination-page" aria-live="polite" className="mr-2">
          {text.page(current, count)}
        </span>
        <Button variant="quiet" layout="icon-only" aria-label={text.first} disabled={disabled || atStart} onClick={() => go(1)}>
          <Icon name="angles-left" />
        </Button>
        <Button variant="quiet" layout="icon-only" aria-label={text.previous} disabled={disabled || atStart} onClick={() => go(current - 1)}>
          <Icon name="angle-left" />
        </Button>
        <Button variant="quiet" layout="icon-only" aria-label={text.next} disabled={disabled || atEnd} onClick={() => go(current + 1)}>
          <Icon name="angle-right" />
        </Button>
        <Button variant="quiet" layout="icon-only" aria-label={text.last} disabled={disabled || atEnd} onClick={() => go(count)}>
          <Icon name="angles-right" />
        </Button>
      </div>
    </nav>
  );
}

export { Pagination, type PaginationProps };
