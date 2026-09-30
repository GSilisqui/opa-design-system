"use client";

// Origem: shadcn/ui calendar (shadcn@4.21.0, new-york, react-day-picker). Estilo dos dias do Figma de Filtros Salvos (dono):
// dia em primary cheio (raio 12), período com extremos em primary e meio em primary-subtle, "hoje" com um ponto.
import * as React from "react";
import { ptBR } from "date-fns/locale";
import { DayPicker, getDefaultClassNames, type DateRange, type DayButton } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  locale = ptBR,
  formatters,
  labels,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      captionLayout={captionLayout}
      className={cn("group/calendar w-fit bg-card p-3 [--cell-size:--spacing(9)]", className)}
      labels={{
        // Nomes acessíveis em português (o locale só formata datas; os rótulos do react-day-picker vêm em inglês).
        labelNav: () => "Navegação do calendário",
        labelPrevious: () => "Mês anterior",
        labelNext: () => "Próximo mês",
        labelGrid: (date) => date.toLocaleDateString(locale?.code ?? "pt-BR", { month: "long", year: "numeric" }),
        labelDayButton: (date, modifiers) =>
          date.toLocaleDateString(locale?.code ?? "pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) +
          (modifiers.today ? ", hoje" : "") +
          (modifiers.selected ? ", selecionado" : ""),
        ...labels,
      }}
      formatters={{
        formatCaption: (date) => date.toLocaleDateString(locale?.code ?? "pt-BR", { month: "long", year: "numeric" }),
        // Uma letra por dia da semana (D S T Q Q S S).
        formatWeekdayName: (date) => date.toLocaleDateString(locale?.code ?? "pt-BR", { weekday: "narrow" }),
        formatMonthDropdown: (date) => date.toLocaleDateString(locale?.code ?? "pt-BR", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-1.5", defaultClassNames.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: "quiet", layout: "icon-only" }),
          "size-8 rounded-lg p-0 select-none aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "quiet", layout: "icon-only" }),
          "size-8 rounded-lg p-0 select-none aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_next,
        ),
        month_caption: cn("flex h-8 w-full items-center justify-center px-10 text-base text-foreground", defaultClassNames.month_caption),
        dropdowns: cn("flex h-8 w-full items-center justify-center gap-1.5 text-base", defaultClassNames.dropdowns),
        dropdown_root: cn(
          "relative rounded-xl border border-border bg-input-background has-focus:border-ring has-focus:focus-halo",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "text-base font-normal select-none",
          captionLayout === "label" ? "" : "flex h-8 items-center gap-1 rounded-xl pr-1 pl-2 [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn("flex h-7 flex-1 items-center justify-center text-sm font-normal text-muted-foreground select-none", defaultClassNames.weekday),
        week: cn("mt-0.5 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn("text-sm text-muted-foreground select-none", defaultClassNames.week_number),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          // Ponto de "hoje": vira claro sobre o dia em primary e continua primary sobre o meio do período.
          "after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:z-10 after:hidden after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
          defaultClassNames.day,
        ),
        range_start: cn(defaultClassNames.range_start),
        range_middle: cn("bg-primary-subtle first:rounded-l-xl last:rounded-r-xl", defaultClassNames.range_middle),
        range_end: cn(defaultClassNames.range_end),
        today: cn("after:block data-[selected=true]:after:bg-primary-foreground", defaultClassNames.today),
        outside: cn("text-foreground-secondary aria-selected:text-foreground-secondary", defaultClassNames.outside),
        disabled: cn("opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />,
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <Icon name="angle-left" size="sm" />;
          if (orientation === "right") return <Icon name="angle-right" size="sm" />;
          return <Icon name="angle-down" size="xs" />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">{children}</div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="quiet"
      layout="icon-only"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "size-auto w-full min-w-(--cell-size) font-normal",
        "group-data-[outside=true]/day:not-data-[selected-single=true]:not-data-[range-start=true]:not-data-[range-end=true]:text-foreground-secondary",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-shade-primary",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:hover:bg-shade-primary",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:hover:bg-shade-primary",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton, type DateRange };
