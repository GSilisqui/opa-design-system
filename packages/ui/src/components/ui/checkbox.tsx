"use client";

// Origem: shadcn/ui checkbox (shadcn@4.21.0, new-york). Adaptado ao Checkbox do Figma (20px, raio 6px, borda Gray/800; sm 16px).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const checkboxVariants = cva(
  "peer grid shrink-0 place-content-center border border-muted-foreground bg-card text-primary-foreground outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:focus-halo disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:focus-halo-destructive data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
  {
    variants: {
      size: {
        default: "size-5 rounded-md",
        sm: "size-4 rounded-sm",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>;

function Checkbox({ className, size = "default", ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root data-slot="checkbox" data-size={size} className={cn(checkboxVariants({ size }), className)} {...props}>
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current">
        {props.checked === "indeterminate" ? <Icon name="minus" size={size === "sm" ? "xs" : "sm"} /> : <Icon name="check" size={size === "sm" ? "xs" : "sm"} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
