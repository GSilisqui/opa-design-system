"use client";

// Combobox de seleção múltipla (Popover + Command do Shadcn), ativado por `multiple` no Combobox.
// Campo com Tags (uma linha) e contador "+N" quando não cabem mais; lista com Checkbox à direita e fica aberta ao escolher.
import * as React from "react";
import { cn } from "@/lib/utils";
import { checkboxVariants } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { filterByLabelAndKeywords, statusText, statusTrigger, type ComboboxCommonProps, type ComboboxStatus } from "@/components/ui/combobox-utils";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag } from "@/components/ui/tag";

type ComboboxMultipleProps = ComboboxCommonProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

const GAP = 4; // gap-1 entre as Tags

function ComboboxMultiple({
  label,
  options,
  value: valueProp,
  defaultValue,
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
}: ComboboxMultipleProps) {
  const [open, setOpen] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState<string[]>(defaultValue ?? []);
  const values = valueProp ?? innerValue;
  const selected = values.map((v) => options.find((option) => option.value === v)).filter((o): o is NonNullable<typeof o> => Boolean(o));
  const hasValue = selected.length > 0;

  // Erro do envio: o formulário bloqueou por `required` e ainda não há valor. Some assim que algo é escolhido.
  const [blocked, setBlocked] = React.useState(false);
  const status: ComboboxStatus | undefined = statusProp ?? (blocked && !hasValue ? "error" : undefined);
  const [highlighted, setHighlighted] = React.useState("");

  const autoId = React.useId();
  const triggerId = id ?? `combobox-${autoId}`;
  const labelId = `${triggerId}-label`;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const floated = open || hasValue;

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Quantas Tags cabem numa linha (o resto vira "+N"). Mede uma cópia invisível de todas as Tags e do contador.
  const [visibleCount, setVisibleCount] = React.useState(selected.length);
  const labelsKey = selected.map((o) => o.label).join("\u0000");
  const recompute = React.useCallback(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const widths = [...measure.querySelectorAll<HTMLElement>("[data-measure-tag]")].map((el) => el.offsetWidth);
    const counterWidth = measure.querySelector<HTMLElement>("[data-measure-counter]")?.offsetWidth ?? 0;
    const available = row.clientWidth;
    // Sem largura (ainda sem layout, ou escondido): mostra todas; o ResizeObserver recalcula quando aparecer.
    if (available === 0) {
      setVisibleCount(widths.length);
      return;
    }
    const total = widths.reduce((sum, w) => sum + w, 0) + GAP * Math.max(widths.length - 1, 0);
    if (total <= available) {
      setVisibleCount(widths.length);
      return;
    }
    let used = 0;
    let fit = 0;
    for (const w of widths) {
      const next = used + (fit > 0 ? GAP : 0) + w;
      if (next + GAP + counterWidth > available) break;
      used = next;
      fit++;
    }
    setVisibleCount(fit);
  }, []);
  React.useLayoutEffect(() => {
    recompute();
  }, [recompute, labelsKey, size, floated]);
  React.useEffect(() => {
    const row = rowRef.current;
    if (!row || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => recompute());
    observer.observe(row);
    return () => observer.disconnect();
  }, [recompute, floated]);

  React.useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      listRef.current?.querySelector<HTMLElement>('[data-checked="true"]')?.scrollIntoView?.({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function commit(next: string[]) {
    setInnerValue(next);
    onValueChange?.(next);
  }
  const toggle = (v: string) => commit(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

  function handleOpenChange(next: boolean) {
    if (disabled) return; // o campo é um div: o Radix só desabilita o gatilho quando ele é um botão
    if (next) setHighlighted(values[0]?.trim() ?? "");
    setOpen(next);
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // As teclas dos botões ✕ das Tags não abrem a lista.
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      handleOpenChange(true);
    }
  }

  const marker = required ? (
    <span aria-hidden="true" className="text-destructive">
      {" "}*
    </span>
  ) : null;

  const hidden = selected.length - visibleCount;
  const tags = (
    <div
      ref={rowRef}
      data-slot="combobox-tags"
      className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden"
      // Clique em ✕ remove só aquela Tag: não deixa subir para o campo (que abriria a lista).
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) event.stopPropagation();
      }}
    >
      {selected.slice(0, visibleCount).map((option) => (
        <Tag key={option.value} onRemove={() => toggle(option.value)} className="shrink-0">
          {option.label}
        </Tag>
      ))}
      {hidden > 0 ? (
        <Tag variant="primary" className="shrink-0" data-slot="combobox-counter">
          +{hidden}
          <span className="sr-only"> selecionados</span>
        </Tag>
      ) : null}
    </div>
  );

  return (
    <div data-slot="combobox" data-size={size} data-multiple="true" className={cn("relative grid gap-1", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild disabled={disabled}>
          <div
            ref={triggerRef}
            id={triggerId}
            role="combobox"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            aria-invalid={status === "error" ? true : undefined}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            data-status={status}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              "flex w-full cursor-default items-center justify-between gap-2 rounded-xl border text-left outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:focus-halo aria-disabled:pointer-events-none aria-disabled:opacity-40 data-[state=open]:border-ring data-[state=open]:focus-halo",
              size === "default" ? "h-15 border-input bg-input-background pr-1 pl-3" : "h-9 border-border bg-card pr-1.5 pl-3",
              status && statusTrigger[status],
            )}
          >
            {size === "default" ? (
              <div className="grid min-w-0 flex-1 gap-1">
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
                {hasValue ? tags : floated ? <span className="truncate text-base leading-5 text-muted-foreground">{placeholder}</span> : null}
              </div>
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                <span
                  id={labelId}
                  data-slot="combobox-label"
                  data-status={status}
                  className={cn(hasValue ? "sr-only" : "text-foreground-secondary", !hasValue && status && statusText[status])}
                >
                  {label}
                  {marker}
                </span>
                {hasValue ? tags : null}
              </div>
            )}
            <span className={cn("grid shrink-0 place-items-center rounded-xl text-foreground", size === "default" ? "size-9" : "size-6")}>
              <Icon name="angle-down" size={size === "default" ? "sm" : "xs"} />
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" aria-labelledby={labelId} className="w-(--radix-popover-trigger-width) p-0">
          <Command label={label} value={highlighted} onValueChange={setHighlighted} filter={filterByLabelAndKeywords}>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList ref={listRef} label={label} aria-multiselectable="true">
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const checked = values.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={[option.label, ...(option.keywords ?? [])]}
                      disabled={option.disabled}
                      data-checked={checked ? "true" : undefined}
                      className="justify-between"
                      onSelect={() => toggle(option.value)}
                    >
                      <span>
                        {option.label}
                        {checked ? <span className="sr-only">, selecionado</span> : null}
                      </span>
                      {/* Só visual (o item já é o controle): mesmas classes do Checkbox do DS, sem botão aninhado. */}
                      <span aria-hidden="true" data-state={checked ? "checked" : "unchecked"} className={cn(checkboxVariants({ size: "default" }), "pointer-events-none")}>
                        {checked ? <Icon name="check" size="sm" /> : null}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Cópia invisível para medir quantas Tags cabem (inert: sem foco nem leitor de tela). */}
      <div ref={measureRef} aria-hidden="true" inert className="pointer-events-none invisible absolute top-0 left-0 flex h-0 gap-1 overflow-hidden whitespace-nowrap">
        {selected.map((option) => (
          <Tag key={option.value} data-measure-tag="" onRemove={() => {}} className="shrink-0">
            {option.label}
          </Tag>
        ))}
        <Tag variant="primary" data-measure-counter="" className="shrink-0">
          +{Math.max(selected.length, 1)}
        </Tag>
      </div>
      {name || required ? (
        <>
          {/* Um campo escondido por valor escolhido: o formulário envia todos (FormData.getAll). */}
          {name ? values.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={disabled} />) : null}
          {/* Só para validar `required` (vazio bloqueia o envio); sem name, não é enviado. */}
          <input
            type="text"
            autoComplete="off"
            value={values.join(",")}
            required={required}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            onChange={() => {}}
            onInvalid={(event) => {
              event.preventDefault();
              setBlocked(true);
              triggerRef.current?.focus();
            }}
            onFocus={() => triggerRef.current?.focus()}
          />
        </>
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

export { ComboboxMultiple, type ComboboxMultipleProps };
