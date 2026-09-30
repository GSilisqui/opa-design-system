import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

function Example({ side }: { side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="quiet" layout="icon-only" aria-label="Arquivar">
            A
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>Arquivar contato</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("não aparece até o mouse chegar ou o foco entrar, e liga o texto ao botão", async () => {
    render(<Example />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await userEvent.hover(screen.getByRole("button", { name: "Arquivar" }));
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Arquivar contato");
    expect(screen.getByRole("button", { name: "Arquivar" })).toHaveAccessibleDescription("Arquivar contato");
  });

  it("abre pelo teclado (foco) e fecha com Esc", async () => {
    render(<Example />);
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("estilo: compacto, cor inversa, text-sm e sem seta", async () => {
    render(<Example />);
    await userEvent.hover(screen.getByRole("button", { name: "Arquivar" }));
    await screen.findByRole("tooltip");
    const content = document.querySelector('[data-slot="tooltip-content"]') as HTMLElement;
    for (const cls of ["bg-foreground", "text-background", "text-sm", "rounded-lg", "px-2", "py-1"]) expect(content.className).toContain(cls);
    expect(content.querySelector("svg")).toBeNull();
  });
});
