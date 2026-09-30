import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextareaField } from "./textarea-field";

describe("TextareaField", () => {
  it("default: label flutuante ligado ao campo e caixa escura (input-background)", () => {
    render(<TextareaField label="Observações" />);
    const field = screen.getByRole("textbox", { name: "Observações" });
    expect(field.className).toContain("bg-input-background");
    expect(field.className).toContain("border-input");
    expect(field.className).toContain("min-h-24");
    expect(field.getAttribute("placeholder")).toBe(" ");
  });

  it("o label sobe quando há foco ou texto (classes peer)", () => {
    render(<TextareaField label="Observações" />);
    const label = screen.getByText("Observações");
    expect(label.className).toContain("peer-focus-visible:top-2");
    expect(label.className).toContain("peer-[:not(:placeholder-shown)]:text-sm");
  });

  it("aceita digitação", async () => {
    render(<TextareaField label="Observações" />);
    await userEvent.type(screen.getByRole("textbox"), "Cliente prefere contato à tarde");
    expect(screen.getByRole("textbox")).toHaveValue("Cliente prefere contato à tarde");
  });

  it("required mostra * e optional mostra (opcional)", () => {
    const { rerender } = render(<TextareaField label="Observações" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
    rerender(<TextareaField label="Observações" optional />);
    expect(screen.getByText("(opcional)")).toBeInTheDocument();
  });

  it("status error liga aria-invalid, a descrição e as cores de erro", () => {
    render(<TextareaField label="Observações" status="error" description="Use no máximo 120 caracteres" />);
    const field = screen.getByRole("textbox");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Use no máximo 120 caracteres");
    expect(field.className).toContain("border-destructive");
    expect(screen.getByText("Use no máximo 120 caracteres").className).toContain("text-destructive");
  });

  it("sm: label vira placeholder (sr-only para o nome) e caixa clara", () => {
    render(<TextareaField size="sm" label="Observações" />);
    const field = screen.getByRole("textbox", { name: "Observações" });
    expect(field.getAttribute("placeholder")).toBe("Observações");
    expect(field.className).not.toContain("bg-input-background");
    expect(field.className).toContain("bg-card");
  });

  it("disabled desabilita o campo", () => {
    render(<TextareaField label="Observações" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
