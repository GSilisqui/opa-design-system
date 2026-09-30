// Tipos e estilos compartilhados entre o Combobox de seleção única e o de seleção múltipla (interno, fora do index).
import type * as React from "react";

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

/** Props comuns às duas versões. */
type ComboboxCommonProps = {
  label: string;
  options: ComboboxOption[];
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

export { filterByLabelAndKeywords, statusText, statusTrigger, type ComboboxCommonProps, type ComboboxOption, type ComboboxStatus };
