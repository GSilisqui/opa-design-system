import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./separator";

describe("Separator", () => {
  it("horizontal por padrão: 1px em border e decorativo", () => {
    const { container } = render(<Separator />);
    const el = container.querySelector('[data-slot="separator"]')!;
    expect(el.className).toContain("bg-border");
    expect(el.className).toContain("data-[orientation=horizontal]:h-px");
    expect(el).toHaveAttribute("data-orientation", "horizontal");
    expect(el).toHaveAttribute("role", "none");
  });

  it("vertical", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.querySelector('[data-slot="separator"]')).toHaveAttribute("data-orientation", "vertical");
  });

  it("decorative=false expõe role separator", () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});
