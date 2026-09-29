import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("usa primary e default por padrão", () => {
    render(<Button>Salvar</Button>);
    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "default");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("hover:bg-shade-primary");
    expect(button.className).toContain("h-9");
    expect(button.className).toContain("rounded-xl");
    expect(button.className).toContain("font-normal");
  });

  it.each([
    ["destructive", "bg-destructive"],
    ["neutral", "hover:bg-input"],
    ["quiet", "hover:bg-accent"],
    ["outline", "border-border"],
    ["destructive-quiet", "hover:bg-destructive-subtle"],
    ["success-quiet", "text-success-subtle-foreground"],
  ] as const)("variante %s", (variant, expected) => {
    render(<Button variant={variant}>Ok</Button>);
    expect(screen.getByRole("button").className).toContain(expected);
  });

  it.each([
    ["sm", "h-6"],
    ["lg", "h-12"],
    ["icon-sm", "size-6"],
    ["icon", "size-9"],
    ["icon-lg", "size-12"],
  ] as const)("tamanho %s", (size, expected) => {
    render(<Button size={size} aria-label="Ação">+</Button>);
    expect(screen.getByRole("button").className).toContain(expected);
  });

  it("dispara onClick e respeita disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Ok</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Ok</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button").className).toContain("disabled:opacity-40");
  });

  it("asChild aplica o estilo no filho", () => {
    render(
      <Button asChild>
        <a href="/novo">Novo</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Novo" }).className).toContain("bg-primary");
  });
});
