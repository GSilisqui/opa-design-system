import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("mostra o contador", () => {
    render(<Badge>3</Badge>);
    const badge = screen.getByText("3");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).not.toHaveAttribute("data-dot");
    expect(badge.className).toContain("h-4");
    expect(badge.className).toContain("rounded-full");
  });

  it("dot vira a bolinha de 6px e ignora o conteúdo", () => {
    const { container } = render(<Badge dot>3</Badge>);
    const badge = container.querySelector('[data-slot="badge"]') as HTMLElement;
    expect(badge).toHaveAttribute("data-dot", "true");
    expect(badge).toBeEmptyDOMElement();
    expect(badge.className).toContain("size-1.5");
  });

  it("repassa aria-label e className", () => {
    render(<Badge dot aria-label="Há pendências" className="absolute" role="img" />);
    expect(screen.getByRole("img", { name: "Há pendências" }).className).toContain("absolute");
  });
});
