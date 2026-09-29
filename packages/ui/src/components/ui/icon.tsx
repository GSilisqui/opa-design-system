// Ícone do DS: desenha o SVG do Font Awesome Pro direto. Regular é o padrão; solid para estados ativos/selecionados.
import * as React from "react";
import { cn } from "cn";
import { icons, type IconName } from "@/components/ui/icon-registry";

const iconSizes = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
} as const;

type IconProps = Omit<React.ComponentProps<"svg">, "children"> & {
  name: IconName;
  variant?: "regular" | "solid";
  /** Sem size, o ícone tem 1em e o componente pai pode definir o tamanho. */
  size?: keyof typeof iconSizes;
  /** Texto para leitores de tela. Sem label, o ícone é decorativo (aria-hidden). */
  label?: string;
};

function Icon({ name, variant = "regular", size, label, className, ...props }: IconProps) {
  const [width, height, , , path] = icons[variant][name].icon;
  const paths = Array.isArray(path) ? path : [path];

  return (
    <svg
      data-slot="icon"
      data-icon={name}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block h-[1em] w-[1em] shrink-0", size && iconSizes[size], className)}
      {...props}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export { Icon, type IconName };
