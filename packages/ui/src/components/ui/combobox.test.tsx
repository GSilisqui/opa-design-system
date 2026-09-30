import { act, render, screen, waitFor } from "@testing-library/react";
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
    // Aberto, a busca também é um combobox "Departamento": guarda o trigger antes de abrir.
    const trigger = screen.getByRole("combobox", { name: "Departamento" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
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

  it("sm preenchido esconde o label (só sr-only) e mostra apenas o valor", () => {
    render(<Combobox label="Departamento" size="sm" options={options} defaultValue="suporte" />);
    const trigger = screen.getByRole("combobox", { name: "Departamento" });
    expect(screen.getByText("Suporte")).toBeVisible();
    expect(screen.getByText("Departamento").className).toContain("sr-only");
    expect(trigger).not.toHaveTextContent("│");
  });

  it("sm vazio mostra o label como placeholder", () => {
    render(<Combobox label="Departamento" size="sm" options={options} />);
    expect(screen.getByText("Departamento").className).not.toContain("sr-only");
  });

  it("status e descrição ficam ligados ao trigger", () => {
    render(<Combobox label="Departamento" options={options} status="error" description="Escolha um departamento" />);
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveAccessibleDescription("Escolha um departamento");
    expect(screen.getByText("Escolha um departamento").className).toContain("text-destructive");
  });

  it("envia o valor em formulários quando recebe name", () => {
    const { container } = render(<Combobox label="Departamento" options={options} defaultValue="comercial" name="departamento" />);
    expect(container.querySelector('input[name="departamento"]')).toHaveValue("comercial");
  });

  it("busca, lista e popup são nomeados pelo label", async () => {
    render(<Combobox label="Departamento" options={options} required />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    expect(document.activeElement).toHaveAccessibleName("Departamento");
    expect(document.activeElement).toHaveAttribute("cmdk-input");
    expect(screen.getByRole("listbox", { name: "Departamento" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Departamento" })).toBeInTheDocument();
  });

  it("ao abrir, destaca o valor atual; Enter não troca o valor", async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Departamento" options={options} defaultValue="financeiro" onValueChange={onValueChange} />);
    screen.getByRole("combobox", { name: "Departamento" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "Financeiro" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).not.toHaveBeenCalledWith(expect.not.stringMatching(/^financeiro$/));
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("required bloqueia o envio do formulário enquanto está vazio", async () => {
    render(
      <form data-testid="form">
        <Combobox label="Departamento" options={options} name="departamento" required />
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.click(screen.getByRole("option", { name: "Suporte" }));
    expect(form.checkValidity()).toBe(true);
  });

  it("envio bloqueado por required mostra o erro no próprio componente e limpa ao escolher", async () => {
    render(
      <form data-testid="form">
        <Combobox label="Departamento" options={options} name="departamento" required />
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    const trigger = screen.getByRole("combobox", { name: "Departamento" });
    expect(trigger).not.toHaveAttribute("aria-invalid");
    act(() => {
      form.reportValidity();
    });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("option", { name: "Suporte" }));
    expect(screen.getByRole("combobox", { name: "Departamento" })).not.toHaveAttribute("aria-invalid");
  });

  it("o input oculto desliga o autocompletar", () => {
    const { container } = render(<Combobox label="Departamento" options={options} name="departamento" />);
    expect(container.querySelector('input[name="departamento"]')).toHaveAttribute("autocomplete", "off");
  });

  it("com o popup aberto, o destaque acompanha o valor controlado", async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>("suporte");
      return (
        <>
          <button type="button" onClick={() => setValue("logistica")}>
            trocar
          </button>
          <Combobox label="Departamento" options={options} value={value} onValueChange={setValue} />
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    expect(screen.getByRole("option", { name: "Suporte" })).toHaveAttribute("aria-selected", "true");
    act(() => screen.getByRole("button", { name: "trocar" }).click());
    expect(screen.getByRole("option", { name: "Logística" })).toHaveAttribute("aria-selected", "true");
  });

  it("ao abrir, rola o valor atual para a vista", async () => {
    const scrollIntoView = vi.fn();
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    try {
      render(<Combobox label="Departamento" options={options} defaultValue="financeiro" />);
      await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
      await waitFor(() =>
        expect(scrollIntoView.mock.contexts.some((el) => (el as HTMLElement).textContent === "Financeiro")).toBe(true),
      );
    } finally {
      HTMLElement.prototype.scrollIntoView = original;
    }
  });

  it("desabilitado não envia o valor", () => {
    render(
      <form data-testid="form">
        <Combobox label="Departamento" options={options} name="departamento" defaultValue="comercial" disabled />
      </form>,
    );
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement);
    expect(data.has("departamento")).toBe(false);
  });

  it("campo inválido devolve o foco ao trigger", () => {
    const { container } = render(<Combobox label="Departamento" options={options} name="departamento" required />);
    const native = container.querySelector('input[name="departamento"]') as HTMLInputElement;
    expect(native).toHaveAttribute("aria-hidden", "true");
    expect(native).toHaveAttribute("tabindex", "-1");
    native.focus();
    expect(screen.getByRole("combobox", { name: "Departamento" })).toHaveFocus();
  });

  it("a busca olha o label e as palavras-chave, não o value", async () => {
    const cidades: ComboboxOption[] = [
      { value: "101", label: "Recife" },
      { value: "202", label: "São Paulo" },
    ];
    render(<Combobox label="Cidade" options={cidades} searchPlaceholder="Buscar" />);
    await userEvent.click(screen.getByRole("combobox", { name: "Cidade" }));
    const search = screen.getByPlaceholderText("Buscar");
    await userEvent.type(search, "1");
    expect(screen.queryByRole("option", { name: "Recife" })).not.toBeInTheDocument();
    await userEvent.clear(search);
    await userEvent.type(search, "rec");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Recife"]);
    await userEvent.clear(search);
    await userEvent.type(search, "sao");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["São Paulo"]);
  });

  it("onSelect usa o value original, mesmo com espaços", async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Departamento" options={[{ value: " vip ", label: "VIP" }]} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Departamento" }));
    await userEvent.click(screen.getByRole("option", { name: "VIP" }));
    expect(onValueChange).toHaveBeenCalledWith(" vip ");
  });
});
