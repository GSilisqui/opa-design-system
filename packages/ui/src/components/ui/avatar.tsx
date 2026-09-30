"use client";

// Origem: shadcn/ui avatar (shadcn@4.21.0, new-york). Validado com o dono: não é redondo; os tamanhos casam com as alturas de
// Button, Input e Combobox (24, 36, 48, 60) mais 96 para perfis, e o raio acompanha o do componente vizinho.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const avatarVariants = cva("group/avatar relative flex shrink-0 overflow-hidden select-none", {
  variants: {
    size: {
      sm: "size-6 rounded-lg",
      default: "size-9 rounded-xl",
      lg: "size-12 rounded-2xl",
      xl: "size-15 rounded-xl",
      "2xl": "size-24 rounded-3xl",
    },
  },
  defaultVariants: { size: "default" },
});

type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>["size"]>;

function Avatar({ className, size = "default", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: AvatarSize }) {
  return <AvatarPrimitive.Root data-slot="avatar" data-size={size} className={cn(avatarVariants({ size }), className)} {...props} />;
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full object-cover", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-secondary font-medium text-foreground-secondary",
        "group-data-[size=sm]/avatar:text-xs group-data-[size=default]/avatar:text-base group-data-[size=lg]/avatar:text-lg group-data-[size=xl]/avatar:text-xl group-data-[size=2xl]/avatar:text-3xl",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="avatar-group" className={cn("group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background", className)} {...props} />;
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-base text-primary-foreground ring-2 ring-background",
        "group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:rounded-lg group-has-data-[size=sm]/avatar-group:text-xs",
        "group-has-data-[size=lg]/avatar-group:size-12 group-has-data-[size=lg]/avatar-group:rounded-2xl group-has-data-[size=lg]/avatar-group:text-lg",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, avatarVariants };
