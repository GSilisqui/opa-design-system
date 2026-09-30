"use client";

// Origem: shadcn/ui radio-group (shadcn@4.21.0, new-york). Adaptado aos tokens do DS (20px, borda Gray/800; sm 16px).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

const radioGroupItemVariants = cva(
  "aspect-square shrink-0 rounded-full border border-muted-foreground bg-card text-primary outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:focus-halo disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:focus-halo-destructive data-[state=checked]:border-primary",
  {
    variants: {
      size: {
        default: "size-5",
        sm: "size-4",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> & VariantProps<typeof radioGroupItemVariants>;

function RadioGroupItem({ className, size = "default", ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item data-slot="radio-group-item" data-size={size} className={cn(radioGroupItemVariants({ size }), className)} {...props}>
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="grid place-content-center">
        <span aria-hidden="true" className={cn("rounded-full bg-primary", size === "sm" ? "size-2" : "size-2.5")} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, radioGroupItemVariants };
