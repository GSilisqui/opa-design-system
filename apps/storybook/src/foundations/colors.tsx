import { useEffect, useRef, useState } from "react";
import component from "@opa/tokens/json/component";
import primitives from "@opa/tokens/json/primitives";
import light from "@opa/tokens/json/semantic.light";

type PrimitiveFile = { color: Record<string, Record<string, { $value: string }> | string> };

// Única exceção consciente à regra opa/no-raw-design-values: esta página existe para MOSTRAR a paleta crua.
// A cor passa por função (a regra só inspeciona objetos literais em style), deixando a exceção explícita aqui.
const rawSwatch = (hex: string) => ({ background: hex });

/** Paleta crua (camada 1): só para consulta. Componentes e telas usam os semânticos. */
export function Palette() {
  const groups = Object.entries((primitives as unknown as PrimitiveFile).color).filter(
    ([key]) => !key.startsWith("$"),
  ) as [string, Record<string, { $value: string }>][];
  return (
    <div className="grid gap-4 text-foreground">
      {groups.map(([group, steps]) => (
        <div key={group} className="grid gap-1">
          <code className="text-sm">{group}</code>
          <div className="flex flex-wrap gap-1">
            {Object.entries(steps)
              .filter(([step]) => !step.startsWith("$"))
              .map(([step, token]) => (
                <div key={step} className="grid w-16 gap-1">
                  <span className="h-10 rounded-md border border-border" style={rawSwatch(token.$value)} />
                  <span className="font-mono text-xs text-muted-foreground">{step}</span>
                  <span className="font-mono text-xs text-muted-foreground">{token.$value}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type TokenFile = { color: Record<string, unknown> };
const names = (file: TokenFile) => Object.keys(file.color).filter((key) => !key.startsWith("$"));

function Swatch({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(`--${name}`).trim());
  }, [name]);
  return (
    <div className="flex items-center gap-3">
      <span ref={ref} className="size-8 shrink-0 rounded-lg border border-border" style={{ background: `var(--${name})` }} />
      <code className="text-sm text-foreground">{name}</code>
      <span className="ml-auto font-mono text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

export function SemanticColors() {
  const all = [...names(light as TokenFile), ...names(component as TokenFile)];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        ["Light", ""],
        ["Dark", "dark"],
      ].map(([title, mode]) => (
        <div key={title} className={`${mode} rounded-xl border border-border bg-background p-4 text-foreground`}>
          <p className="mb-3 text-sm text-muted-foreground">{title}</p>
          <div className="grid gap-2">
            {all.map((name) => (
              <Swatch key={name} name={name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
