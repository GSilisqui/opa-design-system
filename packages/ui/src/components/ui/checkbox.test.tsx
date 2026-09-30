import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

describe("Checkbox", () => {
  it("tem papel checkbox, nome pelo label e alterna ao clicar", async () => {
    const onCheckedChange = vi.fn();
    render(
      <div>
        <Checkbox id="aceite" onCheckedChange={onCheckedChange} />
        <Label htmlFor="aceite">Aceito os termos</Label>
      </div>,
    );
    const box = screen.getByRole("checkbox", { name: "Aceito os termos" });
    expect(box).toHaveAttribute("aria-checked", "false");
    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it("funciona pelo teclado (Espaço)", async () => {
    render(<Checkbox aria-label="Marcar" />);
    screen.getByRole("checkbox").focus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("indeterminate expõe aria-checked=mixed", () => {
    render(<Checkbox aria-label="Todos" checked="indeterminate" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
  });

  it("tamanhos: default 20px e sm 16px", () => {
    render(
      <>
        <Checkbox aria-label="a" />
        <Checkbox aria-label="b" size="sm" />
      </>,
    );
    expect(screen.getByRole("checkbox", { name: "a" }).className).toContain("size-5");
    expect(screen.getByRole("checkbox", { name: "b" }).className).toContain("size-4");
  });

  it("disabled não alterna e usa opacity-40", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="x" disabled onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole("checkbox");
    expect(box.className).toContain("disabled:opacity-40");
    await userEvent.click(box);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("aria-invalid usa a borda e o halo destructive", () => {
    render(<Checkbox aria-label="x" aria-invalid />);
    expect(screen.getByRole("checkbox").className).toContain("aria-invalid:border-destructive");
  });
});
