// Origem: shadcn/ui button (shadcn@4.21.0, new-york). Adaptado ao Figma Button (Component Library 36:2938; biblioteca OPA 10:1010).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-normal whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-shade-primary focus-visible:focus-ring active:bg-shade-strong-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-shade-strong-destructive focus-visible:focus-ring active:bg-shade-strong-destructive",
        neutral: "bg-secondary text-secondary-foreground hover:bg-input focus-visible:focus-ring active:bg-shade-input",
        quiet: "text-foreground hover:bg-accent focus-visible:bg-card focus-visible:focus-ring active:bg-accent",
        outline:
          "border border-border text-foreground hover:bg-accent focus-visible:border-ring focus-visible:bg-card focus-visible:focus-halo active:bg-accent",
        "destructive-quiet":
          "text-destructive hover:bg-destructive-subtle focus-visible:bg-card focus-visible:focus-ring active:bg-destructive-subtle",
        "success-quiet":
          "text-success-subtle-foreground hover:bg-success-subtle focus-visible:bg-card focus-visible:focus-ring active:bg-success-subtle",
      },
      // Tamanho e layout são independentes (Figma: Size × Layout): qualquer tamanho pode ser só ícone.
      size: {
        sm: "h-6 rounded-lg px-2 text-sm [&_svg:not([class*='size-'])]:size-3",
        default: "h-9 rounded-xl px-4 text-base [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 rounded-2xl px-4 text-lg [&_svg:not([class*='size-'])]:size-3.5",
      },
      layout: {
        default: "",
        // Quadrado na altura do tamanho. Sem texto visível: exige aria-label.
        "icon-only": "aspect-square px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      layout: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
  layout = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-layout={layout}
      className={cn(buttonVariants({ variant, size, layout, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
