import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./date-picker";

const trigger = (name = "Data de nascimento") => screen.getByRole("combobox", { name: new RegExp(name) });
const day = (n: number, month = "janeiro") => screen.getByRole("button", { name: new RegExp(`^\\D+, ${n} de ${month}`, "i") });

describe("DatePicker", () => {
  it("tem nome acessível pelo label e começa fechado", () => {
    render(<DatePicker label="Data de nascimento" />);
    const t = trigger();
    expect(t).toHaveAttribute("aria-expanded", "false");
    expect(t.className).toContain("h-15");
  });

  it("abre o calendário, seleciona um dia, mostra dd/mm/aaaa e fecha", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Data de nascimento" defaultValue={new Date(2025, 0, 1)} onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(day(12));
    const picked = onValueChange.mock.calls[0][0] as Date;
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2025, 0, 12]);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveTextContent("12/01/2025");
  });

  it("funciona controlado", async () => {
    function Controlled() {
      const [v, setV] = useState<Date | null>(new Date(2025, 0, 5));
      return <DatePicker label="Data" value={v} onValueChange={(d) => setV(d ?? null)} />;
    }
    render(<Controlled />);
    expect(trigger("Data")).toHaveTextContent("05/01/2025");
    await userEvent.click(trigger("Data"));
    await userEvent.click(day(20));
    expect(trigger("Data")).toHaveTextContent("20/01/2025");
  });

  it("abre pelo teclado", async () => {
    render(<DatePicker label="Data" defaultValue={new Date(2025, 0, 5)} />);
    trigger("Data").focus();
    await userEvent.keyboard("{Enter}");
    expect(trigger("Data")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("size sm preenchido esconde o label (sr-only) e mostra só o valor", () => {
    render(<DatePicker label="Data" size="sm" defaultValue={new Date(2025, 0, 5)} />);
    expect(trigger("Data").className).toContain("h-9");
    expect(screen.getByText("Data").className).toContain("sr-only");
    expect(screen.getByText("05/01/2025")).toBeVisible();
  });

  it("minDate e maxDate desabilitam dias", async () => {
    render(<DatePicker label="Data" defaultValue={new Date(2025, 0, 15)} minDate={new Date(2025, 0, 10)} maxDate={new Date(2025, 0, 20)} />);
    await userEvent.click(trigger("Data"));
    expect(day(9)).toBeDisabled();
    expect(day(21)).toBeDisabled();
    expect(day(15)).not.toBeDisabled();
  });

  it("envia a data em ISO quando recebe name", () => {
    const { container } = render(<DatePicker label="Data" name="nascimento" defaultValue={new Date(2025, 2, 7)} />);
    expect(container.querySelector('input[name="nascimento"]')).toHaveValue("2025-03-07");
    expect(container.querySelector('input[name="nascimento"]')).toHaveAttribute("autocomplete", "off");
  });

  it("required bloqueia o envio, mostra o erro no próprio campo e limpa ao escolher", async () => {
    render(
      <form data-testid="form">
        <DatePicker label="Data" name="d" required defaultValue={null} />
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    expect(trigger("Data")).not.toHaveAttribute("aria-invalid");
    act(() => {
      form.reportValidity();
    });
    expect(trigger("Data")).toHaveAttribute("aria-invalid", "true");
    expect(trigger("Data")).toHaveFocus();
    await userEvent.click(trigger("Data"));
    await userEvent.click(screen.getAllByRole("button", { name: /^\D+, \d+ de/i })[10]);
    expect(trigger("Data")).not.toHaveAttribute("aria-invalid");
  });

  it("status e descrição ficam ligados ao campo", () => {
    render(<DatePicker label="Data" status="error" description="Informe a data" />);
    expect(trigger("Data")).toHaveAccessibleDescription("Informe a data");
    expect(screen.getByText("Informe a data").className).toContain("text-destructive");
    expect(trigger("Data").className).toContain("focus-visible:border-destructive");
  });

  it("desabilitado não abre", async () => {
    render(<DatePicker label="Data" disabled />);
    await userEvent.click(trigger("Data"));
    expect(trigger("Data")).toHaveAttribute("aria-expanded", "false");
  });
});
