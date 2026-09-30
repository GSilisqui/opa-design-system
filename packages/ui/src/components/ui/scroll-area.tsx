"use client";

// Origem: shadcn/ui scroll-area (shadcn@4.21.0, new-york). Validado com o dono: faixa fixa de 14px demarcada por uma linha,
// com setas nas pontas e o "polegar" no meio, tudo na mesma cor suave (muted-foreground a 50%). Vertical (padrão) ou horizontal.
import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /** Direção da rolagem (e da faixa). */
  orientation?: "vertical" | "horizontal";
  /** Quanto cada clique nas setas rola, em px. */
  step?: number;
};

const arrow =
  "grid size-3.5 shrink-0 place-items-center rounded-sm text-muted-foreground/50 outline-none transition-colors hover:text-muted-foreground";

function ScrollArea({ className, children, orientation = "vertical", step = 48, ...props }: ScrollAreaProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const vertical = orientation === "vertical";
  const scroll = (direction: -1 | 1) => viewportRef.current?.scrollBy({ [vertical ? "top" : "left"]: direction * step, behavior: "smooth" });

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      data-orientation={orientation}
      className={cn("relative overflow-hidden", vertical ? "pr-3.5" : "pb-3.5", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        // Região rolável focável: é assim que o teclado rola o conteúdo (regra scrollable-region-focusable do axe).
        tabIndex={0}
        className="size-full rounded-[inherit] outline-none focus-visible:focus-ring"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {/* Faixa fixa: linha de separação + seta, barra e seta. As setas são só para o mouse (o teclado rola o próprio conteúdo). */}
      <div
        data-slot="scroll-area-rail"
        className={cn(
          "absolute flex items-center",
          vertical ? "inset-y-0 right-0 w-3.5 flex-col border-l border-border py-0.5" : "inset-x-0 bottom-0 h-3.5 flex-row border-t border-border px-0.5",
        )}
      >
        <button type="button" tabIndex={-1} aria-hidden="true" className={arrow} onClick={() => scroll(-1)}>
          <Icon name={vertical ? "angle-up" : "angle-left"} size="xs" />
        </button>
        <ScrollBar orientation={orientation} className="flex-1" />
        <button type="button" tabIndex={-1} aria-hidden="true" className={arrow} onClick={() => scroll(1)}>
          <Icon name={vertical ? "angle-down" : "angle-right"} size="xs" />
        </button>
      </div>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      forceMount
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      // `relative!`: o Radix posiciona a barra de forma absoluta; aqui ela precisa ocupar o espaço entre as duas setas.
      className={cn("relative! flex touch-none p-0.5 select-none", orientation === "vertical" ? "w-full" : "h-full flex-col", className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-muted-foreground/50 transition-colors hover:bg-muted-foreground/70"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
