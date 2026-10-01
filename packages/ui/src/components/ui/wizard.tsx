"use client";

// Sem origem no Shadcn/Radix: não há Wizard nem Stepper. Criado com aprovação do dono (2026-10-01) como composição de
// Dialog + Radix Tabs vertical, que entrega teclado, ARIA e value controlado. Spec: docs/superpowers/specs/2026-10-01-wizard-design.md.
import * as React from "react";
import { Dialog as DialogPrimitive, Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";

/** O passo atual não é um status: vem de `step`. */
type WizardStepStatus = "pending" | "complete" | "error";

type WizardStep = {
  /** Identificador estável; é o valor de `step`/`defaultStep` e de `onStepChange`. */
  id: string;
  title: string;
  /** Linha de apoio abaixo do título, na coluna de etapas. */
  description?: string;
  /** Ausente = `pending`. */
  status?: WizardStepStatus;
  /** Só é montado enquanto o passo está ativo. */
  content: React.ReactNode;
};

type WizardProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Título do wizard (vira o `DialogTitle`, na coluna de etapas). */
  title: string;
  /** Descrição opcional do dialog, abaixo do título. */
  description?: string;
  steps: WizardStep[];
  /** `id` do passo atual (controlado). Id inexistente cai no primeiro passo. */
  step?: string;
  /** `id` inicial no modo não controlado. */
  defaultStep?: string;
  onStepChange?: (id: string) => void;
  /** Clique no botão do último passo. */
  onFinish?: () => void;
  finishLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  /** Bloqueia só o avanço do passo atual (além do bloqueio automático por `error`). */
  nextDisabled?: boolean;
  /** Botão final em carregamento; trava navegação, X, Esc e clique fora. */
  loading?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
};

const statusLabel: Record<Exclude<WizardStepStatus, "pending">, string> = {
  complete: "concluído",
  error: "com erro",
};

function Wizard({
  open,
  onOpenChange,
  title,
  description,
  steps,
  step,
  defaultStep,
  onStepChange,
  onFinish,
  finishLabel = "Concluir",
  nextLabel = "Próximo",
  backLabel = "Voltar",
  nextDisabled = false,
  loading = false,
  showCloseButton = true,
  closeLabel = "Fechar",
}: WizardProps) {
  const [internalStep, setInternalStep] = React.useState(defaultStep ?? steps[0]?.id);
  const requested = step ?? internalStep;
  const index = Math.max(0, steps.findIndex((s) => s.id === requested));
  const current = steps[index];

  const mainRef = React.useRef<HTMLDivElement>(null);
  const previousId = React.useRef(current?.id);
  React.useEffect(() => {
    // Só quando o passo muda (não na montagem): leva o foco para o painel. O adiamento (setTimeout) é necessário:
    // o Radix só mostra o painel novo (tira o `hidden`) depois deste efeito, e o clique na etapa foca o botão depois do handler.
    if (previousId.current === current?.id) return;
    previousId.current = current?.id;
    // Busca o painel ativo no DOM (e não por ref): enquanto o Radix troca de painel, o ref ainda pode apontar para o antigo.
    const timer = setTimeout(() => mainRef.current?.querySelector<HTMLElement>('[role="tabpanel"][data-state="active"]')?.focus(), 0);
    return () => clearTimeout(timer);
  }, [current?.id]);

  if (!current) return null;

  const goTo = (id: string) => {
    if (step === undefined) setInternalStep(id);
    onStepChange?.(id);
  };
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;
  const blocked = current.status === "error" || nextDisabled || loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="wizard"
          // Sem descrição o Radix avisa; o atributo precisa sumir (undefined), não ficar apontando para um id inexistente.
          {...(description ? {} : { "aria-describedby": undefined })}
          onEscapeKeyDown={(event) => loading && event.preventDefault()}
          onInteractOutside={(event) => loading && event.preventDefault()}
          className="fixed top-[50%] left-[50%] z-50 h-4/5 w-4/5 translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-popover duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <TabsPrimitive.Root
            value={current.id}
            onValueChange={goTo}
            orientation="vertical"
            activationMode="manual"
            className="grid size-full grid-cols-[auto_1fr] grid-rows-1"
          >
            <div data-slot="wizard-sidebar" className="flex w-56 flex-col gap-5 overflow-y-auto border-r border-border bg-background p-4">
              <div className="flex flex-col gap-0.5">
                <DialogTitle>{title}</DialogTitle>
                {description ? <DialogDescription className="text-sm">{description}</DialogDescription> : null}
              </div>
              <TabsPrimitive.List aria-label="Etapas" className="flex flex-col">
                {steps.map((s, i) => {
                  const status = s.status ?? "pending";
                  const selected = s.id === current.id;
                  return (
                    <TabsPrimitive.Trigger
                      key={s.id}
                      value={s.id}
                      disabled={loading}
                      data-status={status}
                      className={cn(
                        "relative flex w-full gap-3 pb-6 text-left text-base outline-none last:pb-0 focus-visible:focus-ring disabled:opacity-40",
                        // Linha de conexão até a próxima etapa: preenchida quando esta etapa está concluída.
                        "not-last:after:absolute not-last:after:top-6 not-last:after:bottom-0 not-last:after:left-2.75 not-last:after:w-0.5",
                        status === "complete" ? "not-last:after:bg-primary" : "not-last:after:bg-border",
                      )}
                    >
                      <span
                        data-slot="wizard-step-marker"
                        aria-hidden="true"
                        className={cn(
                          "relative z-10 grid size-6 shrink-0 place-items-center rounded-full border text-sm",
                          status === "complete" && "border-primary bg-primary text-primary-foreground",
                          status === "error" && "border-0 bg-destructive-subtle text-destructive",
                          status === "pending" &&
                            (selected ? "border-primary bg-card font-bold text-primary" : "border-border bg-card text-muted-foreground"),
                        )}
                      >
                        {status === "complete" ? (
                          <Icon name="check" size="xs" />
                        ) : status === "error" ? (
                          <Icon name="circle-exclamation" size="xl" />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span className="flex min-w-0 flex-col pt-0.5">
                        <span
                          className={cn(
                            status === "error" ? "text-destructive" : selected || status === "complete" ? "text-foreground" : "text-muted-foreground",
                            selected && "font-bold",
                          )}
                        >
                          {s.title}
                        </span>
                        {s.description ? <span className="text-sm font-normal text-foreground-secondary">{s.description}</span> : null}
                        {status !== "pending" ? <span className="sr-only"> ({statusLabel[status]})</span> : null}
                      </span>
                    </TabsPrimitive.Trigger>
                  );
                })}
              </TabsPrimitive.List>
            </div>

            <div ref={mainRef} className="flex min-h-0 min-w-0 flex-col">
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                <h3 className="text-lg leading-6 font-bold text-foreground">{current.title}</h3>
                {showCloseButton ? (
                  <DialogPrimitive.Close asChild>
                    <Button variant="quiet" layout="icon-only" aria-label={closeLabel} disabled={loading} className="-mt-1.5 -mr-2">
                      <Icon name="xmark" />
                    </Button>
                  </DialogPrimitive.Close>
                ) : null}
              </div>

              <ScrollArea className="min-h-0 flex-1">
                {steps.map((s) => (
                  <TabsPrimitive.Content
                    key={s.id}
                    value={s.id}
                    // -1: o painel recebe foco por código (ao trocar de passo), mas não entra na ordem de Tab.
                    tabIndex={-1}
                    className="p-4 outline-none"
                  >
                    {s.content}
                  </TabsPrimitive.Content>
                ))}
              </ScrollArea>

              <div data-slot="wizard-footer" className="flex justify-end gap-3 border-t border-border bg-background px-4 py-2.5">
                {isFirst ? null : (
                  <Button variant="outline" disabled={loading} onClick={() => goTo(steps[index - 1].id)}>
                    {backLabel}
                  </Button>
                )}
                {isLast ? (
                  <Button disabled={blocked} onClick={onFinish}>
                    {loading ? <Icon name="spinner" className="animate-spin" /> : null}
                    {finishLabel}
                  </Button>
                ) : (
                  <Button disabled={blocked} onClick={() => goTo(steps[index + 1].id)}>
                    {nextLabel}
                  </Button>
                )}
              </div>
            </div>
          </TabsPrimitive.Root>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

export { Wizard, type WizardProps, type WizardStep, type WizardStepStatus };
