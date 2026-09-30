"use client";

// Origem: shadcn/ui switch (shadcn@4.21.0, new-york). Adaptado aos tokens do DS (36×20px; sm 28×16px).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "peer group/switch inline-flex shrink-0 items-center rounded-full p-0.5 outline-none transition-[color,box-shadow,background-color] focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      size: {
        default: "h-5 w-9",
        sm: "h-4 w-7",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>;

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root data-slot="switch" data-size={size} className={cn(switchVariants({ size }), className)} {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-background transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-full data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
