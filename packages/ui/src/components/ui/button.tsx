// Origem: shadcn/ui button (shadcn@4.21.0, new-york). Adaptado ao Figma Button 36:2938.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
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
      size: {
        sm: "h-6 rounded-lg px-2 text-sm [&_svg:not([class*='size-'])]:size-3",
        default: "h-9 rounded-xl px-4 text-base [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 rounded-2xl px-4 text-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        icon: "size-9 rounded-xl [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 rounded-2xl [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
