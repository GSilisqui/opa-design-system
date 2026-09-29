"use client";

// Composição oficial do Shadcn (Combobox = Popover + Command). Seleção única com busca (decisão do dono: só Combobox).
// Trigger no visual do Select do Figma 885:3949.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  /** Termos extras que também encontram a opção na busca. */
  keywords?: string[];
};

type ComboboxStatus = "error" | "success" | "warning";

// Os variants focus-visible/data-[state=open] precisam ser repetidos: senão o foco e o estado aberto trocam a cor do status pela do ring.
const statusTrigger: Record<ComboboxStatus, string> = {
  error:
    "border-destructive focus-halo-destructive focus-visible:border-destructive focus-visible:focus-halo-destructive data-[state=open]:border-destructive data-[state=open]:focus-halo-destructive",
  success:
    "border-success focus-halo-success focus-visible:border-success focus-visible:focus-halo-success data-[state=open]:border-success data-[state=open]:focus-halo-success",
  warning:
    "border-warning focus-halo-warning focus-visible:border-warning focus-visible:focus-halo-warning data-[state=open]:border-warning data-[state=open]:focus-halo-warning",
};

const statusText: Record<ComboboxStatus, string> = {
  error: "text-destructive",
  success: "text-success",
  warning: "text-warning",
};

// Busca sem acento e sem caixa. Pontua só o label e as palavras-chave: o value (ex.: um id) nunca casa com a busca.
const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function filterByLabelAndKeywords(_value: string, search: string, keywords?: string[]) {
  const term = normalize(search.trim());
  if (!term) return 1;
  return (keywords ?? []).some((keyword) => normalize(keyword).includes(term)) ? 1 : 0;
}

type ComboboxProps = {
  label: string;
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  description?: React.ReactNode;
  status?: ComboboxStatus;
  size?: "default" | "sm";
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
};

function Combobox({
  label,
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = "Busque ou selecione…",
  searchPlaceholder = "Buscar…",
  emptyMessage = "Nenhum resultado encontrado",
  description,
  status,
  size = "default",
  required,
  disabled,
  name,
  id,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : innerValue;
  const selected = options.find((option) => option.value === value);

  const autoId = React.useId();
  const triggerId = id ?? `combobox-${autoId}`;
  const labelId = `${triggerId}-label`;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const floated = open || Boolean(selected);

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  function handleSelect(next: string) {
    setInnerValue(next);
    onValueChange?.(next);
    setOpen(false);
  }

  const marker = required ? (
    <span aria-hidden="true" className="text-destructive">
      {" "}*
    </span>
  ) : null;

  return (
    <div data-slot="combobox" data-size={size} className={cn("grid gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-labelledby={labelId}
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
                  data-slot="combobox-label"
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
                {floated ? (
                  <span className={cn("truncate text-base leading-5", selected ? "text-foreground" : "text-muted-foreground")}>
                    {selected?.label ?? placeholder}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <span id={labelId} data-slot="combobox-label" data-status={status} className={cn("text-foreground-secondary", status && statusText[status])}>
                  {label}
                  {marker}
                </span>
                {selected ? (
                  <>
                    <span aria-hidden="true" className="text-xs text-border">
                      │
                    </span>
                    <span className="truncate text-foreground">{selected.label}</span>
                  </>
                ) : null}
              </span>
            )}
            <span className={cn("grid shrink-0 place-items-center rounded-xl text-foreground", size === "default" ? "size-9" : "size-6")}>
              <Icon name="angle-down" size={size === "default" ? "sm" : "xs"} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-labelledby={labelId} className="w-(--radix-popover-trigger-width) p-0">
          {/* defaultValue: ao abrir, o item destacado é o valor atual (não o primeiro), então Enter não troca a seleção. */}
          <Command label={label} defaultValue={value?.trim() || undefined} filter={filterByLabelAndKeywords}>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList label={label}>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, ...(option.keywords ?? [])]}
                    disabled={option.disabled}
                    data-checked={option.value === value ? "true" : undefined}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {name || required ? (
        // Campo nativo escondido (como o fallback do Radix Select): participa do envio e da validação do formulário.
        // Desabilitado, não é enviado; inválido ou focado, devolve o foco ao trigger.
        <input
          type="text"
          name={name}
          value={value ?? ""}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={() => {}}
          onInvalid={() => triggerRef.current?.focus()}
          onFocus={() => triggerRef.current?.focus()}
        />
      ) : null}
      {description ? (
        <p
          id={descriptionId}
          data-slot="combobox-description"
          data-status={status}
          className={cn("text-xs leading-3 text-muted-foreground", status && statusText[status])}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { Combobox, type ComboboxOption, type ComboboxStatus };
