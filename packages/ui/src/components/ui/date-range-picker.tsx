"use client";

// Composição oficial do Shadcn (Date Range Picker = Popover + Calendar mode="range"). A coluna de atalhos é do desenho do dono
// (Figma de Filtros Salvos): quem usa passa a lista, o DS só desenha a coluna.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { DateField, formatDate, toIsoDate, type DatePickerStatus } from "@/components/ui/date-picker";

type DateRangePreset = {
  label: string;
  /** Devolve o período do atalho (chamado ao clicar e para marcar o atalho ativo). */
  range: () => DateRange;
};

type DateRangePickerProps = {
  label: string;
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | undefined) => void;
  /** Atalhos ("Hoje", "Últimos 7 dias"…) mostrados numa coluna à esquerda do calendário. */
  presets?: DateRangePreset[];
  placeholder?: string;
  description?: React.ReactNode;
  status?: DatePickerStatus;
  size?: "default" | "sm";
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
};

const sameDay = (a?: Date, b?: Date) =>
  Boolean(a && b) && a!.getFullYear() === b!.getFullYear() && a!.getMonth() === b!.getMonth() && a!.getDate() === b!.getDate();
const sameRange = (a?: DateRange | null, b?: DateRange | null) => sameDay(a?.from, b?.from) && sameDay(a?.to, b?.to);

function DateRangePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  presets,
  minDate,
  maxDate,
  placeholder = "dd/mm/aaaa – dd/mm/aaaa",
  ...field
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState<DateRange | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : innerValue;
  // Enquanto o período não está completo (só o início), fica num rascunho: o campo só muda quando o fim é escolhido.
  const [draft, setDraft] = React.useState<DateRange | undefined>(undefined);
  const [month, setMonth] = React.useState<Date | undefined>(value?.from);

  const disabled = [minDate ? { before: minDate } : null, maxDate ? { after: maxDate } : null].filter(Boolean) as React.ComponentProps<
    typeof Calendar
  >["disabled"];

  function commit(next: DateRange | undefined) {
    setInnerValue(next ?? null);
    onValueChange?.(next);
    setDraft(undefined);
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setDraft(undefined);
      setMonth(value?.from ?? month);
    }
  }

  // Não usa o período calculado pelo react-day-picker (ele estenderia o período já aplicado): o 1º clique começa um
  // rascunho e o 2º fecha o período, em qualquer ordem. Clicar duas vezes no mesmo dia vale um período de um dia.
  function handleSelect(_next: DateRange | undefined, clicked: Date) {
    if (!draft?.from) {
      setDraft({ from: clicked, to: undefined });
      return;
    }
    const [from, to] = draft.from <= clicked ? [draft.from, clicked] : [clicked, draft.from];
    commit({ from, to });
  }

  // Durante a escolha mostra só o rascunho; fora dela, o período aplicado.
  const shown = draft ?? value ?? undefined;
  const display = value?.from && value?.to ? `${formatDate(value.from)} – ${formatDate(value.to)}` : null;

  return (
    <DateField
      {...field}
      placeholder={placeholder}
      open={open}
      onOpenChange={handleOpenChange}
      displayValue={display}
      hiddenValue={value?.from && value?.to ? `${toIsoDate(value.from)}/${toIsoDate(value.to)}` : ""}
    >
      <div className="flex">
        {presets?.length ? (
          <div role="group" aria-label="Atalhos de período" data-slot="date-range-presets" className="grid w-40 content-start gap-0.5 border-r border-border p-2">
            {presets.map((preset) => {
              const active = sameRange(value, preset.range());
              return (
                <Button
                  key={preset.label}
                  type="button"
                  variant="quiet"
                  aria-pressed={active}
                  className={cn("justify-start", active && "bg-accent")}
                  onClick={() => {
                    const range = preset.range();
                    setMonth(range.from);
                    commit(range);
                  }}
                >
                  {preset.label}
                </Button>
              );
            })}
          </div>
        ) : null}
        <Calendar
          mode="range"
          selected={shown}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          disabled={disabled}
          autoFocus
        />
      </div>
    </DateField>
  );
}

export { DateRangePicker, type DateRange, type DateRangePickerProps, type DateRangePreset };
