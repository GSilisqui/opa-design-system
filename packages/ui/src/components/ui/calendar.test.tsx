import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Calendar, type DateRange } from "./calendar";

const jan = new Date(2025, 0, 1);

describe("Calendar", () => {
  it("mostra o mês em pt-BR, os dias da semana de uma letra e uma grade acessível", () => {
    render(<Calendar mode="single" defaultMonth={jan} />);
    expect(screen.getByText("janeiro de 2025")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    const headers = [...document.querySelectorAll(".rdp-weekday")].map((h) => h.textContent);
    expect(headers.filter(Boolean)).toEqual(["D", "S", "T", "Q", "Q", "S", "S"]);
  });

  it("seleciona um dia e chama onSelect", async () => {
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={jan} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /^\D+, 12 de janeiro/i }));
    expect(onSelect).toHaveBeenCalled();
    const picked = onSelect.mock.calls[0][0] as Date;
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2025, 0, 12]);
  });

  it("dia selecionado fica em primary (data única)", () => {
    render(<Calendar mode="single" defaultMonth={jan} selected={new Date(2025, 0, 12)} />);
    const day = screen.getByRole("button", { name: /^\D+, 12 de janeiro/i });
    expect(day).toHaveAttribute("data-selected-single", "true");
    expect(day.className).toContain("data-[selected-single=true]:bg-primary");
  });

  it("período: extremos em primary e meio marcado", () => {
    const range: DateRange = { from: new Date(2025, 0, 8), to: new Date(2025, 0, 12) };
    render(<Calendar mode="range" defaultMonth={jan} selected={range} />);
    expect(screen.getByRole("button", { name: /^\D+, 8 de janeiro/i })).toHaveAttribute("data-range-start", "true");
    expect(screen.getByRole("button", { name: /^\D+, 10 de janeiro/i })).toHaveAttribute("data-range-middle", "true");
    expect(screen.getByRole("button", { name: /^\D+, 12 de janeiro/i })).toHaveAttribute("data-range-end", "true");
    const middleCell = screen.getByRole("button", { name: /^\D+, 10 de janeiro/i }).closest("td")!;
    expect(middleCell.className).toContain("bg-primary-subtle");
  });

  it("dias de outro mês ficam esmaecidos", () => {
    render(<Calendar mode="single" defaultMonth={jan} />);
    const outside = screen.getByRole("button", { name: /^\D+, 30 de dezembro/i });
    expect(outside.className).toContain("text-foreground-secondary");
    expect(outside.closest("td")).toHaveAttribute("data-outside", "true");
  });

  it("hoje ganha o ponto indicador", () => {
    const today = new Date();
    render(<Calendar mode="single" defaultMonth={today} />);
    const cell = document.querySelector('[data-today="true"]');
    expect(cell).not.toBeNull();
    expect(cell!.className).toContain("after:block");
  });

  it("dias desabilitados não são selecionáveis e usam opacity-40", async () => {
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={jan} disabled={{ before: new Date(2025, 0, 10) }} onSelect={onSelect} />);
    const day = screen.getByRole("button", { name: /^\D+, 5 de janeiro/i });
    expect(day).toBeDisabled();
    expect(day.closest("td")!.className).toContain("opacity-40");
    await userEvent.click(day);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("navega entre meses pelas setas", async () => {
    render(<Calendar mode="single" defaultMonth={jan} />);
    await userEvent.click(screen.getByRole("button", { name: /próximo mês/i }));
    expect(screen.getByText("fevereiro de 2025")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /mês anterior/i }));
    expect(screen.getByText("janeiro de 2025")).toBeInTheDocument();
  });

  it("funciona pelo teclado (setas e Enter)", async () => {
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={jan} selected={new Date(2025, 0, 12)} onSelect={onSelect} />);
    screen.getByRole("button", { name: /^\D+, 12 de janeiro/i }).focus();
    await userEvent.keyboard("{ArrowRight}{Enter}");
    const picked = onSelect.mock.calls[0][0] as Date;
    expect(picked.getDate()).toBe(13);
  });
});
