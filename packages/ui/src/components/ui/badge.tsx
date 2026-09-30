// Componente do DS aprovado pelo dono (não vem do Shadcn: o Badge do Shadcn virou o Tag). Figma Chat 413:5242 (bolinha) e 987:16351 (contador).
// Indicador de pendência: contador laranja (16px, min 16, `rounded-full`, 10px medium) ou só a bolinha (`dot`).
import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  /** Só a bolinha de 6px com halo de 2px, sem número (o conteúdo é ignorado). Dê `aria-label` se ela precisar ser lida. */
  dot?: boolean;
};

function Badge({ className, dot, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-dot={dot ? "true" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-warning text-warning-foreground",
        dot ? "size-1.5 ring-2 ring-warning/20" : "h-4 min-w-4 px-1 text-xs leading-3 font-medium",
        className,
      )}
      {...props}
    >
      {dot ? null : children}
    </span>
  );
}

export { Badge, type BadgeProps };
