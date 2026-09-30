import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateRangePicker, type DateRangePreset } from "./date-range-picker";

const trigger = (name = "Período") => screen.getByRole("combobox", { name: new RegExp(name) });
const day = (n: number, month = "janeiro") => screen.getByRole("button", { name: new RegExp(`^\\D+, ${n} de ${month}`, "i") });
const jan = { from: new Date(2025, 0, 6), to: new Date(2025, 0, 8) };

const presets: DateRangePreset[] = [
  { label: "Primeira semana", range: () => ({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 7) }) },
  { label: "Últimos 3 dias", range: () => ({ from: new Date(2025, 0, 6), to: new Date(2025, 0, 8) }) },
];

describe("DateRangePicker", () => {
  it("tem nome acessível pelo label e mostra o período em dd/mm/aaaa", () => {
    render(<DateRangePicker label="Período" defaultValue={jan} />);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveTextContent("06/01/2025 – 08/01/2025");
  });

  it("escolher início e fim aplica o período e fecha; o campo só muda no fim", async () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Período" defaultValue={jan} onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    await userEvent.click(day(10));
    // só o início escolhido: continua aberto e o campo ainda mostra o período anterior
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger()).toHaveTextContent("06/01/2025 – 08/01/2025");
    await userEvent.click(day(16));
    const applied = onValueChange.mock.calls[0][0];
    expect([applied.from.getDate(), applied.to.getDate()]).toEqual([10, 16]);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveTextContent("10/01/2025 – 16/01/2025");
  });

  it("fechar sem completar descarta o início", async () => {
    render(<DateRangePicker label="Período" defaultValue={jan} />);
    await userEvent.click(trigger());
    await userEvent.click(day(10));
    await userEvent.keyboard("{Escape}");
    expect(trigger()).toHaveTextContent("06/01/2025 – 08/01/2025");
  });

  it("atalhos: coluna à esquerda, clicar aplica o período e marca o ativo", async () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Período" defaultValue={jan} presets={presets} onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    const group = screen.getByRole("group", { name: "Atalhos de período" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Últimos 3 dias" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Primeira semana" })).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(screen.getByRole("button", { name: "Primeira semana" }));
    const applied = onValueChange.mock.calls[0][0];
    expect([applied.from.getDate(), applied.to.getDate()]).toEqual([1, 7]);
    expect(trigger()).toHaveTextContent("01/01/2025 – 07/01/2025");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("sem atalhos não mostra a coluna", async () => {
    render(<DateRangePicker label="Período" defaultValue={jan} />);
    await userEvent.click(trigger());
    expect(screen.queryByRole("group", { name: "Atalhos de período" })).not.toBeInTheDocument();
  });

  it("envia o intervalo ISO quando recebe name", () => {
    const { container } = render(<DateRangePicker label="Período" name="periodo" defaultValue={jan} />);
    expect(container.querySelector('input[name="periodo"]')).toHaveValue("2025-01-06/2025-01-08");
  });

  it("size sm preenchido esconde o label (sr-only)", () => {
    render(<DateRangePicker label="Período" size="sm" defaultValue={jan} />);
    expect(screen.getByText("Período").className).toContain("sr-only");
    expect(screen.getByText("06/01/2025 – 08/01/2025")).toBeVisible();
  });
});
