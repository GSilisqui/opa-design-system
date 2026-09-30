import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  it("renderiza o conteúdo dentro do viewport", () => {
    render(
      <ScrollArea className="h-32">
        <p>Ana Souza</p>
      </ScrollArea>,
    );
    expect(screen.getByText("Ana Souza")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="scroll-area-viewport"]')).not.toBeNull();
  });

  it("vertical: faixa de 14px à direita, com uma linha lateral e setas para cima e para baixo", () => {
    const { container } = render(
      <ScrollArea className="h-32">
        <p>x</p>
      </ScrollArea>,
    );
    const rail = container.querySelector('[data-slot="scroll-area-rail"]')!;
    for (const cls of ["w-3.5", "right-0", "border-l", "border-border", "flex-col"]) expect(rail.className).toContain(cls);
    expect(rail.querySelector('[data-icon="angle-up"]')).not.toBeNull();
    expect(rail.querySelector('[data-icon="angle-down"]')).not.toBeNull();
  });

  it("horizontal: faixa de 14px na base, com setas para esquerda e direita", () => {
    const { container } = render(
      <ScrollArea orientation="horizontal" className="w-40">
        <p>x</p>
      </ScrollArea>,
    );
    const rail = container.querySelector('[data-slot="scroll-area-rail"]')!;
    for (const cls of ["h-3.5", "bottom-0", "border-t"]) expect(rail.className).toContain(cls);
    expect(rail.querySelector('[data-icon="angle-left"]')).not.toBeNull();
    expect(rail.querySelector('[data-icon="angle-right"]')).not.toBeNull();
  });

  it("setas na cor suave (muted-foreground a 50%)", () => {
    const { container } = render(
      <ScrollArea>
        <p>x</p>
      </ScrollArea>,
    );
    const buttons = container.querySelectorAll('[data-slot="scroll-area-rail"] button');
    buttons.forEach((b) => expect(b.className).toContain("text-muted-foreground/50"));
    // O polegar só existe com medidas reais (jsdom não mede): a cor dele fica a cargo do Storybook.
    expect(buttons.length).toBe(2);
  });

  it("as setas rolam o viewport e são só para o mouse (aria-hidden, fora da ordem de tab)", async () => {
    const { container } = render(
      <ScrollArea step={30}>
        <p>x</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    const scrollBy = vi.fn();
    viewport.scrollBy = scrollBy as unknown as typeof viewport.scrollBy;
    const [up, down] = container.querySelectorAll('[data-slot="scroll-area-rail"] button');
    expect(up).toHaveAttribute("aria-hidden", "true");
    expect(up).toHaveAttribute("tabindex", "-1");
    await userEvent.click(down);
    await userEvent.click(up);
    expect(scrollBy).toHaveBeenNthCalledWith(1, { top: 30, behavior: "smooth" });
    expect(scrollBy).toHaveBeenNthCalledWith(2, { top: -30, behavior: "smooth" });
  });
});
