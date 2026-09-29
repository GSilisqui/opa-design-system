import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";
import { InputField } from "./input-field";

describe("Input", () => {
  it("usa o visual SM do Figma e placeholder muted", () => {
    render(<Input aria-label="Buscar" placeholder="Buscar" />);
    const input = screen.getByRole("textbox", { name: "Buscar" });
    expect(input.className).toContain("h-9");
    expect(input.className).toContain("bg-card");
    expect(input.className).toContain("placeholder:text-muted-foreground");
    expect(input.className).toContain("focus-visible:focus-halo");
  });
});

describe("InputField", () => {
  it("associa o label ao campo e aceita digitação", async () => {
    render(<InputField label="Nome do contato" />);
    const input = screen.getByLabelText("Nome do contato");
    await userEvent.type(input, "Ana");
    expect(input).toHaveValue("Ana");
  });

  it("default tem 60px, fundo preenchido e label flutuante", () => {
    render(<InputField label="Nome" />);
    const input = screen.getByLabelText("Nome");
    expect(input.className).toContain("h-15");
    expect(input.className).toContain("bg-input-background");
    expect(input.className).toContain("peer");
    expect(input).toHaveAttribute("placeholder", " ");
  });

  it("liga a descrição por aria-describedby", () => {
    render(<InputField label="E-mail" description="Usado para login" />);
    expect(screen.getByLabelText("E-mail")).toHaveAccessibleDescription("Usado para login");
  });

  it("status error marca aria-invalid e pinta label e descrição", () => {
    render(<InputField label="E-mail" status="error" description="Informe um e-mail válido" />);
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-status", "error");
    expect(input.className).toContain("border-destructive");
    expect(screen.getByText("Informe um e-mail válido").className).toContain("text-destructive");
  });

  it.each(["success", "warning"] as const)("status %s não marca aria-invalid", (status) => {
    render(<InputField label="CPF" status={status} />);
    expect(screen.getByLabelText("CPF")).not.toHaveAttribute("aria-invalid");
  });

  it("required mostra o asterisco e marca o campo", () => {
    render(<InputField label="Nome" required />);
    expect(screen.getByLabelText(/Nome/)).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("o asterisco segue a cor do estado", () => {
    render(<InputField label="CPF" required status="success" />);
    expect(screen.getByText("*").className).toContain("text-success");
  });

  it("optional mostra (opcional)", () => {
    render(<InputField label="Apelido" optional />);
    expect(screen.getByText("(opcional)")).toBeInTheDocument();
  });

  it("readOnly usa só a borda inferior", () => {
    render(<InputField label="Protocolo" readOnly defaultValue="#482913" />);
    const input = screen.getByLabelText("Protocolo");
    expect(input).toHaveAttribute("readonly");
    expect(input.className).toContain("rounded-none");
    expect(input.className).toContain("border-b");
  });

  it("sm usa o label como placeholder e mantém o nome acessível", () => {
    render(<InputField label="Buscar conversa" size="sm" />);
    const input = screen.getByLabelText("Buscar conversa");
    expect(input).toHaveAttribute("placeholder", "Buscar conversa");
    expect(input.className).toContain("h-9");
  });
});
