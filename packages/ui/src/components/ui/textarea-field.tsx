"use client";

// Composição pedida pelo dono (mesmo padrão do InputField): Textarea + Label + descrição, com label flutuante no size default.
// Visual do TextArea do Figma antigo (caixa input-background, label no topo que sobe ao digitar), sem a barra de edição de texto.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TextareaFieldStatus = "error" | "success" | "warning";

const statusField: Record<TextareaFieldStatus, string> = {
  error: "border-destructive focus-halo-destructive focus-visible:border-destructive focus-visible:focus-halo-destructive",
  success: "border-success focus-halo-success focus-visible:border-success focus-visible:focus-halo-success",
  warning: "border-warning focus-halo-warning focus-visible:border-warning focus-visible:focus-halo-warning",
};

const statusText: Record<TextareaFieldStatus, string> = {
  error: "text-destructive",
  success: "text-success",
  warning: "text-warning",
};

type TextareaFieldProps = React.ComponentProps<"textarea"> & {
  label: string;
  description?: React.ReactNode;
  status?: TextareaFieldStatus;
  /** `default`: caixa escura com label flutuante; `sm`: caixa clara, o label é o placeholder. */
  size?: "default" | "sm";
  optional?: boolean;
  containerClassName?: string;
};

function TextareaField({
  label,
  description,
  status,
  size = "default",
  optional,
  required,
  readOnly,
  disabled,
  id,
  placeholder,
  className,
  containerClassName,
  ...props
}: TextareaFieldProps) {
  const autoId = React.useId();
  const fieldId = id ?? `textarea-${autoId}`;
  const descriptionId = description ? `${fieldId}-description` : undefined;

  // Igual ao InputField: o * segue a cor do estado em sucesso/alerta e fica cinza quando desabilitado.
  const markerColor = disabled
    ? "text-muted-foreground"
    : status === "success" || status === "warning"
      ? statusText[status]
      : "text-destructive";
  const marker = required ? (
    <span aria-hidden="true" className={markerColor}>
      *
    </span>
  ) : optional ? (
    <span className="text-xs text-muted-foreground">(opcional)</span>
  ) : null;

  const shared = {
    id: fieldId,
    required,
    readOnly,
    disabled,
    "aria-invalid": status === "error" ? true : undefined,
    "data-status": status,
    ...props,
    "aria-describedby": [descriptionId, props["aria-describedby"]].filter(Boolean).join(" ") || undefined,
  };

  return (
    <div data-slot="textarea-field" data-size={size} className={cn("grid gap-1", containerClassName)}>
      {size === "default" ? (
        <div className="relative">
          <Textarea
            {...shared}
            placeholder={placeholder ?? " "}
            className={cn(
              "peer min-h-24 border-input bg-input-background px-3 pt-7 pb-3 text-base placeholder:text-transparent focus-visible:placeholder:text-muted-foreground",
              status && statusField[status],
              className,
            )}
          />
          <Label
            htmlFor={fieldId}
            data-status={status}
            className={cn(
              "pointer-events-none absolute top-3 left-3 text-base leading-5 transition-all",
              "peer-focus-visible:top-2 peer-focus-visible:text-sm peer-focus-visible:leading-4",
              "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:leading-4",
              status && statusText[status],
              disabled && "text-muted-foreground",
            )}
          >
            {label}
            {marker}
          </Label>
        </div>
      ) : (
        <>
          <Label htmlFor={fieldId} className="sr-only">
            {label}
          </Label>
          <Textarea {...shared} placeholder={placeholder ?? label} className={cn(status && statusField[status], className)} />
        </>
      )}
      {description ? (
        <p
          id={descriptionId}
          data-slot="textarea-field-description"
          data-status={status}
          className={cn("text-xs leading-3 text-foreground-secondary", status && statusText[status])}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { TextareaField, type TextareaFieldProps, type TextareaFieldStatus };
