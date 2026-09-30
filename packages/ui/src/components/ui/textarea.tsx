// Origem: shadcn/ui textarea (shadcn@4.21.0, new-york). Mesmo visual do Input SM do Figma (card + border, raio 12px).
import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:border-ring focus-visible:focus-halo",
        "aria-invalid:border-destructive aria-invalid:focus-halo-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
