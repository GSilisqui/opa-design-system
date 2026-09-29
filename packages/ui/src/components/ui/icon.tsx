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

// Sem import.meta.env: nem todo consumidor usa Vite. Os bundlers (Vite, Next, webpack) trocam o texto
// process.env.NODE_ENV pelo modo do app; sem bundler e sem process, fica quieto.
declare const process: { env: { NODE_ENV?: string } };
function isDev() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

function Icon({ name, variant = "regular", size, label, className, ...props }: IconProps) {
  const definition = icons[variant]?.[name];
  if (!definition) {
    if (isDev()) console.warn(`[@opa/ui] Icon: "${name}" (${variant}) não está no registro de ícones (icon-registry.ts).`);
    return null;
  }
  const [width, height, , , path] = definition.icon;
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
