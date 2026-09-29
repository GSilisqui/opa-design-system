"use client";

// Composição aprovada pelo dono (decisão D): Input + Label + descrição do Shadcn, no layout do Input Field do Figma 885:5165.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputFieldStatus = "error" | "success" | "warning";

const statusField: Record<InputFieldStatus, string> = {
  error: "border-destructive focus-halo-destructive focus-visible:border-destructive focus-visible:focus-halo-destructive",
  success: "border-success focus-halo-success focus-visible:border-success focus-visible:focus-halo-success",
  warning: "border-warning focus-halo-warning focus-visible:border-warning focus-visible:focus-halo-warning",
};

const statusText: Record<InputFieldStatus, string> = {
  error: "text-destructive",
  success: "text-success",
  warning: "text-warning",
};

type InputFieldProps = Omit<React.ComponentProps<"input">, "size"> & {
  label: string;
  description?: React.ReactNode;
  status?: InputFieldStatus;
  size?: "default" | "sm";
  optional?: boolean;
  containerClassName?: string;
};

function InputField({
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
}: InputFieldProps) {
  const autoId = React.useId();
  const inputId = id ?? `input-${autoId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  // Figma: o * é vermelho, segue a cor do estado em sucesso/alerta e fica cinza quando desabilitado.
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
    id: inputId,
    required,
    readOnly,
    disabled,
    "aria-invalid": status === "error" ? true : undefined,
    "data-status": status,
    ...props,
    // Depois do ...props: soma a descrição ao aria-describedby do consumidor em vez de ser sobrescrito por ele.
    "aria-describedby": [descriptionId, props["aria-describedby"]].filter(Boolean).join(" ") || undefined,
  };

  const readOnlyClass = "rounded-none border-0 border-b border-b-border bg-transparent px-0";

  return (
    <div data-slot="input-field" data-size={size} className={cn("grid gap-1", containerClassName)}>
      {size === "default" ? (
        <div className="relative">
          <Input
            {...shared}
            placeholder={placeholder ?? " "}
            className={cn(
              "peer h-15 border-input bg-input-background px-3 pt-6 pb-2 text-base placeholder:text-transparent focus-visible:placeholder:text-muted-foreground",
              readOnly && readOnlyClass,
              status && statusField[status],
              className,
            )}
          />
          <Label
            htmlFor={inputId}
            data-status={status}
            className={cn(
              "pointer-events-none absolute top-5 left-3 text-base leading-5 transition-all",
              "peer-focus-visible:top-2 peer-focus-visible:text-sm peer-focus-visible:leading-4",
              "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:leading-4",
              readOnly && "left-0",
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
          <Label htmlFor={inputId} className="sr-only">
            {label}
          </Label>
          <Input
            {...shared}
            placeholder={placeholder ?? label}
            className={cn(readOnly && readOnlyClass, status && statusField[status], className)}
          />
        </>
      )}
      {description ? (
        <p
          id={descriptionId}
          data-slot="input-field-description"
          data-status={status}
          className={cn("text-xs leading-3 text-muted-foreground", status && statusText[status])}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { InputField, type InputFieldStatus };
