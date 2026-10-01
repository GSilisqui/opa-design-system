import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Wizard, type WizardProps, type WizardStep } from "./wizard";

const steps: WizardStep[] = [
  { id: "arquivo", title: "Arquivo", description: "contatos.csv", status: "complete", content: <p>Envie o arquivo</p> },
  { id: "mapear", title: "Mapear colunas", content: <p>Relacione os campos</p> },
  { id: "revisar", title: "Revisar", status: "error", content: <p>Corrija os erros</p> },
  { id: "importar", title: "Importar", content: <p>Pronto para importar</p> },
];

type HarnessProps = Partial<Omit<WizardProps, "step">> & { initial?: string };

/** Controla o passo como um consumidor faria. */
function Harness({ initial = "mapear", onStepChange, ...rest }: HarnessProps) {
  const [step, setStep] = React.useState(initial);
  return (
    <Wizard
      open
      title="Importar contatos"
      steps={steps}
      {...rest}
      step={step}
      onStepChange={(id) => {
        setStep(id);
        onStepChange?.(id);
      }}
    />
  );
}

const tab = (name: RegExp) => screen.getByRole("tab", { name });
const button = (name: string) => screen.getByRole("button", { name });
const marker = (name: RegExp) => tab(name).querySelector('[data-slot="wizard-step-marker"]')!;

describe("Wizard", () => {
  describe("etapas e painel", () => {
    it("mostra título, etapas e só o conteúdo do passo atual", () => {
      render(<Harness />);
      expect(screen.getByRole("dialog", { name: "Importar contatos" })).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(4);
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Relacione os campos");
      expect(screen.queryByText("Envie o arquivo")).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: "Mapear colunas" })).toBeInTheDocument();
    });

    it("clicar numa etapa chama onStepChange e troca o conteúdo (navegação livre)", async () => {
      const onStepChange = vi.fn();
      render(<Harness onStepChange={onStepChange} />);
      await userEvent.click(tab(/^Importar/));
      expect(onStepChange).toHaveBeenCalledWith("importar");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Pronto para importar");
    });

    it("modo não controlado usa defaultStep", async () => {
      render(<Wizard open title="Importar contatos" steps={steps} defaultStep="revisar" />);
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Corrija os erros");
      await userEvent.click(tab(/^Importar/));
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Pronto para importar");
    });

    it("id inexistente cai no primeiro passo", () => {
      render(<Wizard open title="Importar contatos" steps={steps} step="nada" />);
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Envie o arquivo");
    });

    it("setas movem o foco sem trocar de passo; Enter ativa a etapa", async () => {
      const onStepChange = vi.fn();
      render(<Harness onStepChange={onStepChange} />);
      await userEvent.click(tab(/^Mapear/));
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() => expect(tab(/^Revisar/)).toHaveFocus());
      expect(onStepChange).not.toHaveBeenCalled();
      await userEvent.keyboard("{Enter}");
      expect(onStepChange).toHaveBeenCalledWith("revisar");
    });

    it("o foco vai para o painel ao trocar de passo, mas não na montagem", async () => {
      render(<Harness />);
      expect(screen.getByRole("tabpanel")).not.toHaveFocus();
      await userEvent.click(tab(/^Importar/));
      await waitFor(() => expect(screen.getByRole("tabpanel")).toHaveFocus());
    });
  });

  describe("status", () => {
    it("o nome acessível da etapa informa concluído e com erro", () => {
      render(<Harness />);
      expect(tab(/^Arquivo/)).toHaveAccessibleName(/concluído/);
      expect(tab(/^Revisar/)).toHaveAccessibleName(/com erro/);
      expect(tab(/^Importar/)).not.toHaveAccessibleName(/concluído|com erro/);
    });

    it("o marcador segue o status (número, check, alerta) e o destaque do passo atual", () => {
      render(<Harness />);
      expect(marker(/^Arquivo/).className).toContain("bg-primary");
      expect(marker(/^Arquivo/).querySelector('[data-icon="check"]')).not.toBeNull();
      expect(marker(/^Mapear/).className).toContain("border-primary");
      expect(marker(/^Mapear/)).toHaveTextContent("2");
      expect(marker(/^Revisar/).className).toContain("bg-destructive-subtle");
      expect(marker(/^Revisar/).querySelector('[data-icon="circle-exclamation"]')).not.toBeNull();
      expect(marker(/^Importar/).className).toContain("border-border");
      expect(marker(/^Importar/)).toHaveTextContent("4");
    });
  });

  describe("rodapé", () => {
    it("Próximo e Voltar andam um passo", async () => {
      render(<Harness />);
      await userEvent.click(button("Próximo"));
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Corrija os erros");
      await userEvent.click(button("Voltar"));
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Relacione os campos");
    });

    it("não mostra Voltar no primeiro passo", () => {
      render(<Harness initial="arquivo" />);
      expect(screen.queryByRole("button", { name: "Voltar" })).not.toBeInTheDocument();
    });

    it("Voltar e Próximo ficam juntos, à direita", () => {
      render(<Harness />);
      const footer = button("Próximo").parentElement!;
      expect(footer.className).toContain("justify-end");
      expect(footer.className).toContain("gap-3");
      expect(footer).toContainElement(button("Voltar"));
    });

    it("rótulos customizados", () => {
      render(<Harness backLabel="Anterior" nextLabel="Seguir" />);
      expect(button("Anterior")).toBeInTheDocument();
      expect(button("Seguir")).toBeInTheDocument();
    });

    it("Próximo fica bloqueado quando o passo atual tem erro", () => {
      render(<Harness initial="revisar" />);
      expect(button("Próximo")).toBeDisabled();
    });

    it("nextDisabled bloqueia o Próximo", () => {
      render(<Harness nextDisabled />);
      expect(button("Próximo")).toBeDisabled();
    });

    it("último passo: mostra finishLabel (padrão Concluir) e chama onFinish", async () => {
      const onFinish = vi.fn();
      const { rerender } = render(<Harness initial="importar" onFinish={onFinish} />);
      expect(screen.queryByRole("button", { name: "Próximo" })).not.toBeInTheDocument();
      await userEvent.click(button("Concluir"));
      expect(onFinish).toHaveBeenCalledOnce();
      rerender(<Harness initial="importar" onFinish={onFinish} finishLabel="Importar agora" />);
      expect(button("Importar agora")).toBeInTheDocument();
    });

    it("último passo com erro também bloqueia o botão de finalizar", () => {
      const last = [...steps.slice(0, 3), { ...steps[3], status: "error" as const }];
      render(<Harness initial="importar" steps={last} />);
      expect(button("Concluir")).toBeDisabled();
    });
  });

  describe("fechar e loading", () => {
    it("o X aparece por padrão e fecha; Esc também", async () => {
      const onOpenChange = vi.fn();
      render(<Harness onOpenChange={onOpenChange} />);
      await userEvent.click(button("Fechar"));
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      await userEvent.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledTimes(2);
    });

    it("showCloseButton={false} esconde o X", () => {
      render(<Harness showCloseButton={false} />);
      expect(screen.queryByRole("button", { name: "Fechar" })).not.toBeInTheDocument();
    });

    it("loading desabilita a navegação e impede fechar", async () => {
      const onOpenChange = vi.fn();
      render(<Harness initial="importar" loading onOpenChange={onOpenChange} />);
      expect(button("Concluir")).toBeDisabled();
      expect(button("Voltar")).toBeDisabled();
      expect(button("Fechar")).toBeDisabled();
      for (const t of screen.getAllByRole("tab")) expect(t).toBeDisabled();
      expect(button("Concluir").querySelector('[data-icon="spinner"]')).not.toBeNull();
      await userEvent.keyboard("{Escape}");
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("casca e acessibilidade do dialog", () => {
    it("ocupa 80% da janela, com raio 2xl", () => {
      render(<Harness />);
      const dialog = screen.getByRole("dialog");
      for (const cls of ["w-4/5", "h-4/5", "rounded-2xl", "shadow-popover"]) expect(dialog.className).toContain(cls);
    });

    it("description vira a descrição acessível do dialog", () => {
      render(<Harness description="Envie, mapeie e importe." />);
      expect(screen.getByRole("dialog")).toHaveAccessibleDescription("Envie, mapeie e importe.");
    });

    it("sem description não há aria-describedby nem aviso do Radix", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Harness />);
      expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });
  });
});
