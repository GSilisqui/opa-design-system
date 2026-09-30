import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function Example({ type = "single" }: { type?: "single" | "multiple" }) {
  const props = type === "single" ? ({ type: "single", collapsible: true } as const) : ({ type: "multiple" } as const);
  return (
    <Accordion {...props}>
      <AccordionItem value="a">
        <AccordionTrigger>Como arquivo um contato?</AccordionTrigger>
        <AccordionContent>Use Ações &gt; Arquivar.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Posso desfazer?</AccordionTrigger>
        <AccordionContent>Sim, pelo toast.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("começa fechado e abre ao clicar no título", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Como arquivo um contato?" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Use Ações > Arquivar.")).toBeVisible();
  });

  it("single: abrir outro fecha o primeiro", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Como arquivo um contato?" }));
    await userEvent.click(screen.getByRole("button", { name: "Posso desfazer?" }));
    expect(screen.getByRole("button", { name: "Como arquivo um contato?" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Posso desfazer?" })).toHaveAttribute("aria-expanded", "true");
  });

  it("multiple: vários ficam abertos", async () => {
    render(<Example type="multiple" />);
    await userEvent.click(screen.getByRole("button", { name: "Como arquivo um contato?" }));
    await userEvent.click(screen.getByRole("button", { name: "Posso desfazer?" }));
    expect(screen.getAllByRole("button").every((b) => b.getAttribute("aria-expanded") === "true")).toBe(true);
  });

  it("teclado: Enter abre e as setas movem o foco", async () => {
    render(<Example />);
    screen.getByRole("button", { name: "Como arquivo um contato?" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Como arquivo um contato?" })).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Posso desfazer?" })).toHaveFocus();
  });

  it("estilo: linha entre itens, título 44px medium e seta do DS", () => {
    const { container } = render(<Example />);
    const item = container.querySelector('[data-slot="accordion-item"]')!;
    expect(item.className).toContain("border-b");
    const trigger = screen.getByRole("button", { name: "Como arquivo um contato?" });
    for (const cls of ["min-h-11", "text-base", "font-medium"]) expect(trigger.className).toContain(cls);
    expect(trigger.querySelector('[data-icon="angle-down"]')).not.toBeNull();
  });
});
