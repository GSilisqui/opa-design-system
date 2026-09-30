"use client";

// Origem: shadcn/ui badge (shadcn@4.21.0, new-york), renomeado para Tag. Adaptado ao Figma Chip 304:4496.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const tagVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 border px-2 text-base font-normal whitespace-nowrap [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        neutral: "border-tag-border bg-tag-bg text-tag-foreground",
        primary: "border-primary-subtle bg-primary-subtle text-primary-subtle-foreground",
        success: "border-success-subtle bg-success-subtle text-success-subtle-foreground",
        warning: "border-warning-subtle bg-warning-subtle text-warning-subtle-foreground",
        info: "border-info-subtle bg-info-subtle text-info-subtle-foreground",
        destructive: "border-destructive-subtle bg-destructive-subtle text-destructive-subtle-foreground",
        highlight: "border-highlight-subtle bg-highlight-subtle text-highlight-subtle-foreground",
      },
      size: {
        default: "h-5 rounded-md [&_svg]:size-3",
        md: "h-6 rounded-lg [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  },
);

type TagProps = React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & {
    /** Mostra o botão ✕ e chama esta função ao clicar. */
    onRemove?: () => void;
    /** Verbo do botão ✕; o nome acessível junta o texto da tag (ex.: "Remover VIP"). */
    removeLabel?: string;
  };

function Tag({ className, variant = "neutral", size = "default", onRemove, removeLabel = "Remover", children, ...props }: TagProps) {
  const id = React.useId();
  const textId = `tag-${id}-text`;
  const buttonId = `tag-${id}-remove`;

  return (
    <span data-slot="tag" data-variant={variant} className={cn(tagVariants({ variant, size }), className)} {...props}>
      {onRemove ? (
        // O texto ganha id para compor o nome do botão: "Remover VIP", distinto em cada tag.
        <span id={textId} data-slot="tag-text" className="contents">
          {children}
        </span>
      ) : (
        children
      )}
      {onRemove ? (
        <button
          type="button"
          id={buttonId}
          aria-label={removeLabel}
          aria-labelledby={`${buttonId} ${textId}`}
          onClick={onRemove}
          className="-mr-1 ml-1 inline-grid size-4 place-items-center rounded-sm outline-none hover:bg-current/10 focus-visible:focus-ring"
        >
          <Icon name="xmark" size={size === "md" ? "sm" : "xs"} />
        </button>
      ) : null}
    </span>
  );
}

export { Tag, tagVariants };
