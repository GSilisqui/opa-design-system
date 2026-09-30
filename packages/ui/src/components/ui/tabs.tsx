"use client";

// Origem: shadcn/ui tabs (shadcn@4.21.0, new-york). Adaptado ao Tab do Figma antigo (Segmented | Underline, default 36px | sm 24px, só ícone).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva("group/tabs-list inline-flex items-center", {
  variants: {
    variant: {
      // Trilho cinza com borda; a aba ativa fica em card.
      segmented: "w-fit rounded-xl border border-border bg-muted p-1",
      // Linha fina embaixo de toda a lista; a aba ativa ganha a linha em foreground.
      underline: "w-full border-b border-border",
    },
  },
  defaultVariants: { variant: "segmented" },
});

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants> & {
    /** default = abas de 36px; sm = 24px. */
    size?: "default" | "sm";
  };

function TabsList({ className, variant = "segmented", size = "default", ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-size={size}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 border border-transparent font-normal whitespace-nowrap text-foreground-secondary outline-none transition-colors",
    "hover:text-foreground focus-visible:border-ring focus-visible:focus-halo disabled:pointer-events-none disabled:opacity-40",
    "data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
    // tamanho vem da lista (data-size)
    "group-data-[size=default]/tabs-list:h-9 group-data-[size=default]/tabs-list:text-base group-data-[size=default]/tabs-list:[&_svg:not([class*='size-'])]:size-3.5",
    "group-data-[size=sm]/tabs-list:h-6 group-data-[size=sm]/tabs-list:text-sm group-data-[size=sm]/tabs-list:[&_svg:not([class*='size-'])]:size-3",
    // segmented: aba ativa em card; hover em accent
    "group-data-[variant=segmented]/tabs-list:rounded-lg group-data-[variant=segmented]/tabs-list:hover:bg-accent group-data-[variant=segmented]/tabs-list:data-[state=active]:bg-card group-data-[variant=segmented]/tabs-list:data-[state=active]:shadow-popover",
    // underline: hover em accent; ativa com a linha
    "group-data-[variant=underline]/tabs-list:rounded-xl group-data-[variant=underline]/tabs-list:hover:bg-accent",
    "group-data-[variant=underline]/tabs-list:after:absolute group-data-[variant=underline]/tabs-list:after:inset-x-0 group-data-[variant=underline]/tabs-list:after:-bottom-px group-data-[variant=underline]/tabs-list:after:h-0.5 group-data-[variant=underline]/tabs-list:after:bg-foreground group-data-[variant=underline]/tabs-list:after:opacity-0 group-data-[variant=underline]/tabs-list:data-[state=active]:after:opacity-100",
  ],
  {
    variants: {
      layout: {
        default: "group-data-[size=default]/tabs-list:px-3 group-data-[size=sm]/tabs-list:px-2",
        // Quadrado na altura do tamanho. Sem texto visível: exige aria-label.
        "icon-only": "aspect-square px-0",
      },
    },
    defaultVariants: { layout: "default" },
  },
);

function TabsTrigger({
  className,
  layout = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" data-layout={layout} className={cn(tabsTriggerVariants({ layout }), className)} {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants };
