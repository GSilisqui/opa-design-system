import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";

const options: ComboboxOption[] = [
  { value: "comercial", label: "Comercial" },
  { value: "suporte", label: "Suporte" },
  { value: "financeiro", label: "Financeiro" },
  { value: "logistica", label: "Logística", keywords: ["entregas"] },
];

// Aberto, a busca também é um combobox "Departamentos": o campo é sempre o primeiro no DOM.
const trigger = () => screen.getAllByRole("combobox", { name: /Departamentos/ })[0];

describe("Combobox multiple", () => {
  it("começa fechado e vazio, com o label", () => {
    render(<Combobox multiple label="Departamentos" options={options} />);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger().className).toContain("h-15");
    expect(screen.queryByRole("button", { name: /Remover/ })).not.toBeInTheDocument();
  });

  it("escolhe vários itens sem fechar a lista e mostra as Tags", async () => {
    const onValueChange = vi.fn();
    render(<Combobox multiple label="Departamentos" options={options} onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    const list = screen.getByRole("listbox");
    expect(list).toHaveAttribute("aria-multiselectable", "true");
    await userEvent.click(screen.getByRole("option", { name: "Suporte" }));
    await userEvent.click(screen.getByRole("option", { name: "Comercial" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["suporte", "comercial"]);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option").filter((o) => o.getAttribute("data-checked") === "true")).toHaveLength(2);
    // Tags no campo (fora do popover)
    expect(screen.getByRole("button", { name: "Remover Suporte" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remover Comercial" })).toBeInTheDocument();
  });

  it("clicar de novo desmarca", async () => {
    render(<Combobox multiple label="Departamentos" options={options} defaultValue={["suporte"]} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: /Suporte/ }));
    expect(screen.queryByRole("button", { name: "Remover Suporte" })).not.toBeInTheDocument();
  });

  it("o ✕ da Tag remove só aquela e não abre a lista", async () => {
    const onValueChange = vi.fn();
    render(<Combobox multiple label="Departamentos" options={options} defaultValue={["suporte", "comercial"]} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Remover Suporte" }));
    expect(onValueChange).toHaveBeenCalledWith(["comercial"]);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: "Remover Suporte" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remover Comercial" })).toBeInTheDocument();
  });

  it("funciona controlado", async () => {
    function Controlled() {
      const [v, setV] = useState<string[]>(["financeiro"]);
      return <Combobox multiple label="Departamentos" options={options} value={v} onValueChange={setV} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("button", { name: "Remover Financeiro" })).toBeInTheDocument();
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: "Logística" }));
    expect(screen.getByRole("button", { name: "Remover Logística" })).toBeInTheDocument();
  });

  it("abre pelo teclado e escolhe com Enter", async () => {
    const onValueChange = vi.fn();
    render(<Combobox multiple label="Departamentos" options={options} onValueChange={onValueChange} searchPlaceholder="Buscar" />);
    trigger().focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByPlaceholderText("Buscar")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(["suporte"]);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("size sm preenchido esconde o label (sr-only) e mostra só as Tags", () => {
    render(<Combobox multiple size="sm" label="Departamentos" options={options} defaultValue={["suporte"]} />);
    expect(trigger().className).toContain("h-9");
    expect(screen.getByText("Departamentos").className).toContain("sr-only");
    expect(screen.getByRole("button", { name: "Remover Suporte" })).toBeInTheDocument();
  });

  it("envia um valor por item escolhido", () => {
    const { container } = render(<Combobox multiple label="Departamentos" options={options} name="deps" defaultValue={["suporte", "comercial"]} />);
    const inputs = [...container.querySelectorAll<HTMLInputElement>('input[name="deps"]')];
    expect(inputs.map((i) => i.value)).toEqual(["suporte", "comercial"]);
  });

  it("required vazio bloqueia o envio e mostra o erro no campo; limpa ao escolher", async () => {
    render(
      <form data-testid="form">
        <Combobox multiple label="Departamentos" options={options} name="deps" required />
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    expect(trigger()).not.toHaveAttribute("aria-invalid");
    act(() => {
      form.reportValidity();
    });
    expect(trigger()).toHaveAttribute("aria-invalid", "true");
    expect(trigger()).toHaveFocus();
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: "Suporte" }));
    expect(trigger()).not.toHaveAttribute("aria-invalid");
    expect(form.checkValidity()).toBe(true);
  });

  it("desabilitado não abre", async () => {
    render(<Combobox multiple label="Departamentos" options={options} disabled />);
    await userEvent.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveAttribute("aria-disabled", "true");
  });

  describe("contador +N", () => {
    const original = { offset: Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth"), client: Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth") };
    afterEach(() => {
      if (original.offset) Object.defineProperty(HTMLElement.prototype, "offsetWidth", original.offset);
      else delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetWidth;
      if (original.client) Object.defineProperty(HTMLElement.prototype, "clientWidth", original.client);
      else delete (HTMLElement.prototype as unknown as Record<string, unknown>).clientWidth;
    });
    function mockWidths(rowWidth: number) {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get(this: HTMLElement) {
          if (this.hasAttribute("data-measure-tag")) return 100;
          if (this.hasAttribute("data-measure-counter")) return 30;
          return 0;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get(this: HTMLElement) {
          return this.getAttribute("data-slot") === "combobox-tags" ? rowWidth : 0;
        },
      });
    }

    it("mostra +N quando as Tags não cabem", () => {
      mockWidths(250);
      render(<Combobox multiple label="Departamentos" options={options} defaultValue={["suporte", "comercial", "financeiro"]} />);
      const counter = document.querySelector('[data-slot="combobox-counter"]');
      expect(counter).not.toBeNull();
      expect(counter).toHaveTextContent("+1");
      expect(screen.getAllByRole("button", { name: /^Remover/ })).toHaveLength(2);
    });

    it("sem falta de espaço não mostra contador", () => {
      mockWidths(400);
      render(<Combobox multiple label="Departamentos" options={options} defaultValue={["suporte", "comercial", "financeiro"]} />);
      expect(document.querySelector('[data-slot="combobox-counter"]')).toBeNull();
      expect(screen.getAllByRole("button", { name: /^Remover/ })).toHaveLength(3);
    });
  });
});
