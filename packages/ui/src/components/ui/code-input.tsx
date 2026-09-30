"use client";

// Componente do DS pedido pelo dono (não existe no Shadcn), baseado no exemplo "Copiar e colar JSON" (OPAII-4930, nó 1:9224):
// editor de código com cabeçalho (linguagem + Formatar + Copiar), números de linha e realce de sintaxe.
// Leve de propósito: um <textarea> transparente sobre um <pre> colorido (sem biblioteca de editor). A rolagem é a do ScrollArea do DS.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";

type CodeInputLanguage = "json" | "text";

type CodeInputLabels = { format: string; copy: string; copied: string };

const defaultLabels: CodeInputLabels = { format: "Formatar", copy: "Copiar", copied: "Copiado" };

type CodeInputProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `json` colore a sintaxe e habilita o botão Formatar. */
  language?: CodeInputLanguage;
  /** Texto do cabeçalho (padrão: a linguagem em maiúsculas). */
  title?: string;
  /** Nome acessível do campo (padrão: `title`). */
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  showFormat?: boolean;
  showCopy?: boolean;
  /** Linhas mínimas mostradas (padrão 8). A altura máxima vem de `className` (ex.: `h-80`). */
  minLines?: number;
  /** Chamado quando Formatar encontra JSON inválido. */
  onFormatError?: (error: Error) => void;
  labels?: Partial<CodeInputLabels>;
};

type Token = { text: string; className?: string };

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\]])|([,:])/g;

/** Quebra uma linha de JSON em pedaços coloridos (chave, texto, número, literal, colchete, pontuação). */
function tokenizeJsonLine(line: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    if (m.index > last) out.push({ text: line.slice(last, m.index) });
    if (m[1] !== undefined) {
      out.push({ text: m[1], className: m[2] ? "text-primary-subtle-foreground" : "text-success-subtle-foreground" });
      if (m[2]) out.push({ text: m[2], className: "text-muted-foreground" });
    } else if (m[3] !== undefined) out.push({ text: m[3], className: "text-warning-subtle-foreground" });
    else if (m[4] !== undefined) out.push({ text: m[4], className: "text-warning-subtle-foreground" });
    else if (m[5] !== undefined) out.push({ text: m[5], className: "text-info-subtle-foreground" });
    else out.push({ text: m[6], className: "text-muted-foreground" });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last) });
  return out;
}

function CodeInput({
  value,
  defaultValue = "",
  onValueChange,
  language = "json",
  title,
  label,
  placeholder,
  readOnly,
  disabled,
  invalid,
  showFormat = language === "json",
  showCopy = true,
  minLines = 8,
  onFormatError,
  labels,
  className,
  ...props
}: CodeInputProps) {
  const text = { ...defaultLabels, ...labels };
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const code = controlled ? value : inner;
  const [copied, setCopied] = React.useState(false);
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  const heading = title ?? language.toUpperCase();

  const change = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  const lines = code.split("\n");
  const total = Math.max(lines.length, minLines);

  const format = () => {
    try {
      change(JSON.stringify(JSON.parse(code), null, 2));
    } catch (error) {
      onFormatError?.(error as Error);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* sem permissão de área de transferência: nada a fazer */
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const el = event.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;
    const apply = (next: string, caret: number) => {
      event.preventDefault();
      change(next);
      requestAnimationFrame(() => el.setSelectionRange(caret, caret));
    };
    if (event.key === "Tab" && !event.shiftKey) {
      apply(`${code.slice(0, start)}  ${code.slice(end)}`, start + 2);
    } else if (event.key === "Enter" && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const indent = /^ */.exec(code.slice(lineStart, start))?.[0] ?? "";
      const extra = /[{[]\s*$/.test(code.slice(lineStart, start)) ? "  " : "";
      apply(`${code.slice(0, start)}\n${indent}${extra}${code.slice(end)}`, start + 1 + indent.length + extra.length);
    }
  };

  return (
    <div
      data-slot="code-input"
      data-invalid={invalid ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-muted text-foreground has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:focus-halo data-[invalid=true]:border-destructive has-[textarea:disabled]:opacity-40",
        className,
      )}
      {...props}
    >
      <div data-slot="code-input-header" className="flex shrink-0 items-center justify-between border-b border-border bg-background py-1 pr-1 pl-3">
        <span className="text-base text-foreground-secondary">{heading}</span>
        <div className="flex items-center gap-1">
          {showFormat ? (
            <Button type="button" variant="quiet" size="sm" disabled={disabled || readOnly} onClick={format}>
              <Icon name="align-left" />
              {text.format}
            </Button>
          ) : null}
          {showCopy ? (
            <Button type="button" variant="quiet" size="sm" disabled={disabled} onClick={copy}>
              <Icon name={copied ? "check" : "copy"} />
              {copied ? text.copied : text.copy}
            </Button>
          ) : null}
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex py-3 font-mono text-base leading-5.5">
          <div aria-hidden="true" data-slot="code-input-gutter" className="w-11 shrink-0 pr-3.5 text-right text-muted-foreground/70 select-none">
            {Array.from({ length: total }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="relative grid min-w-0 flex-1 overflow-x-auto pr-3">
            <pre aria-hidden="true" data-slot="code-input-highlight" className="pointer-events-none col-start-1 row-start-1 m-0 font-[inherit] whitespace-pre">
              {lines.map((line, i) => (
                <div key={i} className="min-h-5.5">
                  {language === "json"
                    ? tokenizeJsonLine(line).map((t, k) => (
                        <span key={k} className={t.className}>
                          {t.text}
                        </span>
                      ))
                    : line}
                </div>
              ))}
            </pre>
            <textarea
              ref={areaRef}
              data-slot="code-input-textarea"
              aria-label={label ?? heading}
              aria-invalid={invalid || undefined}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
              rows={total}
              value={code}
              placeholder={placeholder}
              readOnly={readOnly}
              disabled={disabled}
              onChange={(event) => change(event.target.value)}
              onKeyDown={onKeyDown}
              className="col-start-1 row-start-1 m-0 block w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-[inherit] leading-[inherit] whitespace-pre text-transparent caret-foreground outline-none selection:bg-primary-subtle placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export { CodeInput, tokenizeJsonLine, type CodeInputLabels, type CodeInputLanguage, type CodeInputProps };
