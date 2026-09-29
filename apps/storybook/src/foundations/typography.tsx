import typography from "@opa/tokens/json/typography";

type TypographyFile = { text: Record<string, { size: { $value: string }; "line-height": { $value: string } } | string> };

export function TypeScale() {
  const text = (typography as unknown as TypographyFile).text;
  const sizes = Object.entries(text).filter(([key]) => !key.startsWith("$")) as [string, { size: { $value: string }; "line-height": { $value: string } }][];
  return (
    <div className="grid gap-3 text-foreground">
      {sizes.map(([name, value]) => (
        <div key={name} className="grid grid-cols-[120px_160px_1fr] items-baseline gap-4 border-b border-border pb-3">
          <code className="text-sm">text-{name}</code>
          <span className="font-mono text-xs text-muted-foreground">
            {value.size.$value} / {value["line-height"].$value}
          </span>
          <span className={`text-${name} truncate`}>Olá, como posso ajudar?</span>
        </div>
      ))}
    </div>
  );
}
