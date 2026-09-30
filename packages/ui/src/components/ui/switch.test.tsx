import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Label } from "./label";
import { Switch } from "./switch";

describe("Switch", () => {
  it("tem papel switch, nome pelo label e alterna", async () => {
    const onCheckedChange = vi.fn();
    render(
      <div>
        <Switch id="notif" onCheckedChange={onCheckedChange} />
        <Label htmlFor="notif">Notificações</Label>
      </div>,
    );
    const sw = screen.getByRole("switch", { name: "Notificações" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("funciona pelo teclado", async () => {
    render(<Switch aria-label="x" />);
    screen.getByRole("switch").focus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("tamanhos e disabled", () => {
    render(
      <>
        <Switch aria-label="a" />
        <Switch aria-label="b" size="sm" disabled />
      </>,
    );
    expect(screen.getByRole("switch", { name: "a" }).className).toContain("h-5");
    const small = screen.getByRole("switch", { name: "b" });
    expect(small.className).toContain("h-4");
    expect(small).toBeDisabled();
    expect(small.className).toContain("disabled:opacity-40");
  });
});
