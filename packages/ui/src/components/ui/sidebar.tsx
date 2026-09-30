"use client";

// Origem: shadcn/ui sidebar (shadcn@4.21.0, new-york), enxugado a pedido do dono: sem modo expandido nem colapsar.
// Duas peças: `Sidebar` (rail de ícones, sempre recolhido) e `SidebarPanel` (painel contextual de uma aplicação, com grupos e itens).
// Referências: arquivo Chat do Figma (nós 481:10021, 604:6113 e 415:3226).
import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* ─── Rail de ícones ─────────────────────────────────────────────────────── */

function Sidebar({ className, children, ...props }: React.ComponentProps<"nav">) {
  return (
    <TooltipProvider>
      <nav data-slot="sidebar" className={cn("flex h-full w-14 shrink-0 flex-col items-center gap-2 bg-muted px-2 py-2", className)} {...props}>
        {children}
      </nav>
    </TooltipProvider>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("flex flex-col items-center gap-2 pb-2", className)} {...props} />;
}

/** Itens do meio; ocupa o espaço livre e empurra o rodapé para baixo. */
function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto", className)} {...props} />;
}

/** Grupo de itens: a separação entre grupos é só espaço (sem linha). */
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" role="group" className={cn("flex flex-col items-center gap-1 [&+&]:mt-4", className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("flex flex-col items-center gap-2 pt-2", className)} {...props} />;
}

type SidebarItemProps = React.ComponentProps<"button"> & {
  /** Nome do item: vira o `aria-label` e o texto do Tooltip (o item só tem ícone). */
  label: string;
  /** Item da página atual: cartão elevado; use o ícone `variant="solid"`. */
  active?: boolean;
  /** Bolinha de aviso no canto. */
  notification?: boolean;
  asChild?: boolean;
};

function SidebarItem({ label, active, notification, asChild, className, children, ...props }: SidebarItemProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Comp
          data-slot="sidebar-item"
          data-active={active ? "true" : undefined}
          aria-label={label}
          aria-current={active ? "page" : undefined}
          {...(asChild ? {} : { type: "button" })}
          className={cn(
            "relative grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:focus-ring data-[active=true]:bg-card data-[active=true]:text-foreground data-[active=true]:shadow-xs [&_svg]:size-4",
            className,
          )}
          {...props}
        >
          <Slot.Slottable>{children}</Slot.Slottable>
          {notification ? <span aria-hidden="true" data-slot="sidebar-item-dot" className="absolute top-1.5 right-1.5 size-2 rounded-full bg-warning" /> : null}
        </Comp>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

/* ─── Painel contextual ──────────────────────────────────────────────────── */

function SidebarPanel({ className, ...props }: React.ComponentProps<"aside">) {
  return <aside data-slot="sidebar-panel" className={cn("flex h-full w-62 shrink-0 flex-col border-r border-border bg-card text-foreground", className)} {...props} />;
}

function SidebarPanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-panel-header" className={cn("flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-4", className)} {...props} />;
}

function SidebarPanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="sidebar-panel-title" className={cn("truncate text-base font-medium", className)} {...props} />;
}

function SidebarPanelActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-panel-actions" className={cn("flex items-center gap-1", className)} {...props} />;
}

/** Área dos grupos; rola quando a lista passa da altura (use dentro de um `ScrollArea` para ter a faixa do DS). */
function SidebarPanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-panel-content" className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto py-2", className)} {...props} />;
}

function SidebarPanelGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-panel-group" role="group" className={cn("flex flex-col gap-0.5 px-2 [&+&]:mt-3", className)} {...props} />;
}

function SidebarPanelGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-panel-group-label" className={cn("px-2 pt-2 pb-1 text-sm text-foreground-secondary", className)} {...props} />;
}

type SidebarPanelItemProps = React.ComponentProps<"button"> & {
  /** Item da página atual. */
  active?: boolean;
  /** Contador à direita (ex.: conversas na fila). */
  count?: number | string;
  asChild?: boolean;
};

function SidebarPanelItem({ active, count, asChild, className, children, ...props }: SidebarPanelItemProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="sidebar-panel-item"
      data-active={active ? "true" : undefined}
      aria-current={active ? "page" : undefined}
      {...(asChild ? {} : { type: "button" })}
      className={cn(
        "flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-base outline-none transition-colors hover:bg-accent focus-visible:focus-ring data-[active=true]:bg-muted [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      {count !== undefined ? (
        <span data-slot="sidebar-panel-item-count" className="ml-auto text-sm text-foreground-secondary">
          {count}
        </span>
      ) : null}
    </Comp>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarPanel,
  SidebarPanelActions,
  SidebarPanelContent,
  SidebarPanelGroup,
  SidebarPanelGroupLabel,
  SidebarPanelHeader,
  SidebarPanelItem,
  SidebarPanelTitle,
  type SidebarItemProps,
  type SidebarPanelItemProps,
};
