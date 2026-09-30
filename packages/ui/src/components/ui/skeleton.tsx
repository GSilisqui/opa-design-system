// Origem: shadcn/ui skeleton (shadcn@4.21.0, new-york). Bloco `accent` que pulsa (parado com "reduzir movimento").
import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-lg bg-accent motion-reduce:animate-none", className)} {...props} />;
}

export { Skeleton };
