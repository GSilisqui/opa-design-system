"use client";

// Origem: shadcn/ui sonner (shadcn@4.21.0, new-york). Sem next-themes: as cores vêm dos tokens (que já trocam com .dark).
// Estilo validado com o dono: cartão A no formato do Sonner, ação em Outline pequeno (secundária em Quiet), fechar no canto ao passar o mouse.
// Os botões de ação/cancelar são estilizados em src/styles.css (o Sonner os renderiza por dentro, com seletores próprios).
import * as React from "react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";
import { Icon } from "@/components/ui/icon";

const Toaster = ({ toastOptions, style, ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      duration={4000}
      closeButton
      icons={{
        success: <Icon name="circle-check" variant="solid" size="md" className="text-success" />,
        info: <Icon name="circle-info" variant="solid" size="md" className="text-info" />,
        warning: <Icon name="triangle-exclamation" variant="solid" size="md" className="text-warning" />,
        error: <Icon name="circle-xmark" variant="solid" size="md" className="text-destructive" />,
        loading: <Icon name="spinner" size="md" className="animate-spin text-foreground-secondary" />,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: "!items-center !gap-3 !rounded-xl !border-border !bg-popover !p-4 !text-foreground !shadow-popover",
          title: "!text-base !leading-5 !font-medium !text-foreground",
          description: "!text-sm !leading-4 !text-foreground-secondary",
          closeButton: "!border-border !bg-card !text-foreground-secondary",
          ...toastOptions?.classNames,
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-xl)",
          "--width": "356px",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, toast };
