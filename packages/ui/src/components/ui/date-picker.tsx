"use client";

// Composição oficial do Shadcn (Date Picker = Popover + Calendar), com o campo no visual do Combobox do Figma.
// `DateField` é interno (compartilhado com o DateRangePicker) e não é exportado no index.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DatePickerStatus = "error" | "success" | "warning";

// Repetidos de propósito (como no Combobox): foco e estado aberto não podem trocar a cor do status pela do ring.
const statusTrigger: Record<DatePickerStatus, string> = {
  error:
    "border-destructive focus-halo-destructive focus-visible:border-destructive focus-visible:focus-halo-destructive data-[state=open]:border-destructive data-[state=open]:focus-halo-destructive",
  success:
    "border-success focus-halo-success focus-visible:border-success focus-visible:focus-halo-success data-[state=open]:border-success data-[state=open]:focus-halo-success",
  warning:
    "border-warning focus-halo-warning focus-visible:border-warning focus-visible:focus-halo-warning data-[state=open]:border-warning data-[state=open]:focus-halo-warning",
};

const statusText: Record<DatePickerStatus, string> = {
  error: "text-destructive",
  success: "text-success",
  warning: "text-warning",
};

/** dd/MM/aaaa */
const formatDate = (date: Date) => date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
/** aaaa-MM-dd, para o campo nativo escondido (envio de formulário) */
const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

type DateFieldProps = {
  label: string;
  /** Texto mostrado no campo; vazio/nulo = sem valor. */
  displayValue?: string | null;
  /** Valor do campo nativo escondido (formulários e validação de `required`). */
  hiddenValue?: string;
  placeholder?: string;
  description?: React.ReactNode;
  status?: DatePickerStatus;
  size?: "default" | "sm";
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentClassName?: string;
  children: React.ReactNode;
};

function DateField({
  label,
  displayValue,
  hiddenValue = "",
  placeholder = "dd/mm/aaaa",
  description,
  status: statusProp,
  size = "default",
  required,
  disabled,
  name,
  id,
  className,
  open,
  onOpenChange,
  contentClassName,
  children,
}: DateFieldProps) {
  const hasValue = Boolean(displayValue);
  // Erro do envio: o formulário bloqueou por `required` e ainda não há valor. Some assim que uma data é escolhida.
  const [blocked, setBlocked] = React.useState(false);
  const status: DatePickerStatus | undefined = statusProp ?? (blocked && !hasValue ? "error" : undefined);

  const autoId = React.useId();
  const triggerId = id ?? `datepicker-${autoId}`;
  const labelId = `${triggerId}-label`;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const floated = open || hasValue;
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const marker = required ? (
    <span aria-hidden="true" className="text-destructive">
      {" "}*
    </span>
  ) : null;

  return (
    <div data-slot="date-picker" data-size={size} className={cn("grid gap-1", className)}>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-labelledby={`${labelId} ${triggerId}-value`}
            aria-describedby={descriptionId}
            aria-invalid={status === "error" ? true : undefined}
            aria-required={required || undefined}
            data-status={status}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-xl border text-left outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:focus-halo disabled:pointer-events-none disabled:opacity-40 data-[state=open]:border-ring data-[state=open]:focus-halo",
              size === "default" ? "h-15 border-input bg-input-background pr-1 pl-3" : "h-9 border-border bg-card pr-1.5 pl-3",
              status && statusTrigger[status],
            )}
          >
            {size === "default" ? (
              <span className="grid min-w-0 gap-1">
                <span
                  id={labelId}
                  data-slot="date-picker-label"
                  data-status={status}
                  className={cn(
                    "text-foreground-secondary transition-all",
                    floated ? "text-sm leading-4" : "text-base leading-5",
                    status && statusText[status],
                  )}
                >
                  {label}
                  {marker}
                </span>
                <span
                  id={`${triggerId}-value`}
                  className={cn("truncate text-base leading-5", hasValue ? "text-foreground" : "text-muted-foreground", !floated && "sr-only")}
                >
                  {displayValue ?? placeholder}
                </span>
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-2 text-sm">
                {/* Preenchido: o nome do campo sai da tela (sr-only, para o nome acessível) e sobra só o valor. */}
                <span
                  id={labelId}
                  data-slot="date-picker-label"
                  data-status={status}
                  className={cn(hasValue ? "sr-only" : "text-foreground-secondary", !hasValue && status && statusText[status])}
                >
                  {label}
                  {marker}
                </span>
                <span id={`${triggerId}-value`} className={cn("truncate text-foreground", !hasValue && "sr-only")}>
                  {displayValue ?? placeholder}
                </span>
              </span>
            )}
            <span className={cn("grid shrink-0 place-items-center rounded-xl text-foreground", size === "default" ? "size-9" : "size-6")}>
              <Icon name="calendar" size={size === "default" ? "sm" : "xs"} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-labelledby={labelId} className={cn("w-auto p-0", contentClassName)}>
          {children}
        </PopoverContent>
      </Popover>
      {name || required ? (
        // Campo nativo escondido (como no Combobox): participa do envio e da validação do formulário.
        <input
          type="text"
          name={name}
          value={hiddenValue}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          className="sr-only"
          onChange={() => {}}
          onInvalid={(event) => {
            event.preventDefault();
            setBlocked(true);
            triggerRef.current?.focus();
          }}
          onFocus={() => triggerRef.current?.focus()}
        />
      ) : null}
      {description ? (
        <p
          id={descriptionId}
          data-slot="date-picker-description"
          data-status={status}
          className={cn("text-xs leading-3 text-foreground-secondary", status && statusText[status])}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

type DatePickerProps = {
  label: string;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | undefined) => void;
  placeholder?: string;
  description?: React.ReactNode;
  status?: DatePickerStatus;
  size?: "default" | "sm";
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  /** Datas antes desta ficam desabilitadas. */
  minDate?: Date;
  /** Datas depois desta ficam desabilitadas. */
  maxDate?: Date;
};

function DatePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  minDate,
  maxDate,
  ...field
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState<Date | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : innerValue;

  const disabled = [minDate ? { before: minDate } : null, maxDate ? { after: maxDate } : null].filter(Boolean) as React.ComponentProps<
    typeof Calendar
  >["disabled"];

  function handleSelect(next: Date | undefined) {
    setInnerValue(next ?? null);
    onValueChange?.(next);
    setOpen(false);
  }

  return (
    <DateField {...field} open={open} onOpenChange={setOpen} displayValue={value ? formatDate(value) : null} hiddenValue={value ? toIsoDate(value) : ""}>
      <Calendar mode="single" selected={value ?? undefined} onSelect={handleSelect} defaultMonth={value ?? undefined} disabled={disabled} autoFocus />
    </DateField>
  );
}

export { DateField, DatePicker, formatDate, toIsoDate, type DatePickerProps, type DatePickerStatus };
