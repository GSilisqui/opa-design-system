import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";

const options: ComboboxOption[] = [
  { value: "comercial", label: "Comercial" },
  { value: "suporte", label: "Suporte" },
  { value: "financeiro", label: "Financeiro" },
  { value: "logistica", label: "Logística", keywords: ["entregas"] },
];

describe("Combobox", () => {
  it("tem nome acessível pelo label e começa fechado", () => {
    render(<Combobox label="Departamento" options={options} />);
    const trigger = screen.getByRole("combobox", { name: "Departamento" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.className).toContain("h-15");
  });

  it("abre e lista as opções", async () => {
    render(<Combobox label="Departamento" options={options} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("filtra pela busca, inclusive por palavras-chave", async () => {
    render(<Combobox label="Departamento" options={options} searchPlaceholder="Buscar departamento" />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.type(screen.getByPlaceholderText("Buscar departamento"), "entreg");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Logística"]);
  });

  it("mostra a mensagem quando nada é encontrado", async () => {
    render(<Combobox label="Departamento" options={options} searchPlaceholder="Buscar" emptyMessage="Nada por aqui" />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.type(screen.getByPlaceholderText("Buscar"), "zzz");
    expect(screen.getByText("Nada por aqui")).toBeInTheDocument();
  });

  it("selecionar chama onValueChange, fecha e mostra o valor", async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Departamento" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.click(screen.getByRole("option", { name: "Financeiro" }));
    expect(onValueChange).toHaveBeenCalledWith("financeiro");
    const trigger = screen.getByRole("combobox", { name: "Departamento" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Financeiro");
  });

  it("funciona pelo teclado: seta para baixo e Enter selecionam", async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Departamento" options={options} onValueChange={onValueChange} searchPlaceholder="Buscar" />);
    screen.getByRole("combobox", { name: "Departamento" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByPlaceholderText("Buscar")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("suporte");
  });

  it("status mantém a cor ao focar e ao abrir", () => {
    render(<Combobox label="Departamento" options={options} status="error" />);
    const className = screen.getByRole("combobox", { name: "Departamento" }).className;
    expect(className).toContain("focus-visible:border-destructive");
    expect(className).toContain("data-[state=open]:border-destructive");
  });

  it("funciona controlado e marca o item selecionado", async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>("suporte");
      return <Combobox label="Departamento" options={options} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveTextContent("Suporte");
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    expect(screen.getByRole("option", { name: "Suporte" })).toHaveAttribute("data-checked", "true");
  });

  it("status e descrição ficam ligados ao trigger", () => {
    render(<Combobox label="Departamento" options={options} status="error" description="Escolha um departamento" />);
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveAccessibleDescription("Escolha um departamento");
    expect(screen.getByText("Escolha um departamento").className).toContain("text-destructive");
  });

  it("envia o valor em formulários quando recebe name", () => {
    const { container } = render(<Combobox label="Departamento" options={options} defaultValue="comercial" name="departamento" />);
    expect(container.querySelector('input[type="hidden"][name="departamento"]')).toHaveValue("comercial");
  });
});
