// Origem: shadcn/ui input (shadcn@4.21.0, new-york). Visual do Input SM do Figma 885:5165 (36px, card + border, raio 12px).
import * as React from "react";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-border bg-card px-3 text-sm text-foreground transition-[color,box-shadow,border-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:border-ring focus-visible:focus-halo",
        "aria-invalid:border-destructive aria-invalid:focus-halo-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
