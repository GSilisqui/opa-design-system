import { useMemo, useState } from "react";
import { Icon, iconNames, Input } from "@opa/ui";

export function IconGallery() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const visible = useMemo(() => iconNames.filter((name) => name.includes(query.trim().toLowerCase())), [query]);

  async function copy(name: string) {
    const snippet = `<Icon name="${name}" />`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(name);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="grid gap-4 text-foreground">
      <Input aria-label="Buscar ícone" placeholder="Buscar ícone…" value={query} onChange={(event) => setQuery(event.target.value)} className="max-w-sm" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
        {visible.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => copy(name)}
            className="grid justify-items-center gap-2 rounded-xl border border-border bg-card p-3 text-sm outline-none hover:bg-accent focus-visible:focus-ring"
          >
            <span className="flex gap-3 text-lg">
              <Icon name={name} />
              <Icon name={name} variant="solid" />
            </span>
            <code>{copied === name ? "copiado" : name}</code>
          </button>
        ))}
      </div>
    </div>
  );
}
