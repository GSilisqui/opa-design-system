"use client";

// Composição oficial do Shadcn (Combobox = Popover + Command). Seleção única com busca; `multiple` usa combobox-multiple.tsx.
// Trigger no visual do Select do Figma 885:3949.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { ComboboxMultiple, type ComboboxMultipleProps } from "@/components/ui/combobox-multiple";
import {
  filterByLabelAndKeywords,
  statusText,
  statusTrigger,
  type ComboboxCommonProps,
  type ComboboxOption,
  type ComboboxStatus,
} from "@/components/ui/combobox-utils";

type ComboboxSingleProps = ComboboxCommonProps & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
};

type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

function ComboboxSingle({
  label,
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = "Busque ou selecione…",
  searchPlaceholder = "Buscar…",
  emptyMessage = "Nenhum resultado encontrado",
  description,
  status: statusProp,
  size = "default",
  required,
  disabled,
  name,
  id,
  className,
}: ComboboxSingleProps) {
  const [open, setOpen] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : innerValue;
  const selected = options.find((option) => option.value === value);
  // Erro do envio: o formulário bloqueou por `required` e ainda não há valor. Some assim que algo é escolhido.
  const [blocked, setBlocked] = React.useState(false);
  const status: ComboboxStatus | undefined = statusProp ?? (blocked && !selected ? "error" : undefined);
  // Item destacado da lista: acompanha o valor atual ao abrir e quando o valor controlado muda com o popup aberto.
  const [highlighted, setHighlighted] = React.useState("");

  const autoId = React.useId();
  const triggerId = id ?? `combobox-${autoId}`;
  const labelId = `${triggerId}-label`;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const floated = open || Boolean(selected);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) setHighlighted(value?.trim() ?? "");
  }, [value]); // só reage à mudança do valor; a abertura é tratada em handleOpenChange

  // Em listas longas, traz o valor atual para a vista ao abrir.
  React.useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      listRef.current?.querySelector<HTMLElement>('[data-checked="true"]')?.scrollIntoView?.({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function handleOpenChange(next: boolean) {
    if (next) setHighlighted(value?.trim() ?? "");
    setOpen(next);
  }

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
      <Popover open={open} onOpenChange={handleOpenChange}>
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
                {/* Preenchido: o nome do campo sai da tela (fica sr-only para o nome acessível) e sobra só o valor. */}
                <span
                  id={labelId}
                  data-slot="combobox-label"
                  data-status={status}
                  className={cn(selected ? "sr-only" : "text-foreground-secondary", !selected && status && statusText[status])}
                >
                  {label}
                  {marker}
                </span>
                {selected ? <span className="truncate text-foreground">{selected.label}</span> : null}
              </span>
            )}
            <span className={cn("grid shrink-0 place-items-center rounded-xl text-foreground", size === "default" ? "size-9" : "size-6")}>
              <Icon name="angle-down" size={size === "default" ? "sm" : "xs"} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-labelledby={labelId} className="w-(--radix-popover-trigger-width) p-0">
          {/* Controlado: ao abrir, o item destacado é o valor atual (não o primeiro), então Enter não troca a seleção. */}
          <Command label={label} value={highlighted} onValueChange={setHighlighted} filter={filterByLabelAndKeywords}>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList ref={listRef} label={label}>
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
          autoComplete="off"
          value={value ?? ""}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={() => {}}
          onInvalid={(event) => {
            // Sem o balão do navegador (preso num input oculto): o erro aparece no próprio componente.
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
          data-slot="combobox-description"
          data-status={status}
          className={cn("text-xs leading-3 text-foreground-secondary", status && statusText[status])}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Seleção única (padrão) ou múltipla (`multiple`, com `value` em `string[]`). */
function Combobox(props: ComboboxProps) {
  return props.multiple ? <ComboboxMultiple {...props} /> : <ComboboxSingle {...props} />;
}

export { Combobox, type ComboboxOption, type ComboboxProps, type ComboboxStatus };
