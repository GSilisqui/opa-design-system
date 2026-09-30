// Origem: shadcn/ui breadcrumb (shadcn@4.21.0, new-york). Estilo validado com o dono: texto de 14px em foreground-secondary,
// separador de seta pequena, página atual em foreground medium; caminhos longos colapsam num "…" (use com o DropdownMenu).
import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

function Breadcrumb({ "aria-label": ariaLabel = "Trilha de navegação", ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label={ariaLabel} data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-2 text-base break-words text-foreground-secondary", className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-2", className)} {...props} />;
}

function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("rounded-md transition-colors outline-none hover:text-foreground focus-visible:focus-ring", className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn("font-medium text-foreground", className)} {...props} />;
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("text-muted-foreground", className)} {...props}>
      {children ?? <Icon name="angle-right" size="xs" />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="breadcrumb-ellipsis" role="presentation" className={cn("flex size-6 items-center justify-center rounded-lg", className)} {...props}>
      <Icon name="ellipsis" size="sm" />
      <span className="sr-only">Mais</span>
    </span>
  );
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
