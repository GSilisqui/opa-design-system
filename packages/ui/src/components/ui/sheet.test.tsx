import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";

function Example({ side, showCloseButton }: { side?: "top" | "right" | "bottom" | "left"; showCloseButton?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Editar contato</Button>
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Editar contato</SheetTitle>
          <SheetDescription>Atualize os dados.</SheetDescription>
        </SheetHeader>
        <div data-testid="corpo">Campos</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button>Salvar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("abre pelo gatilho com título e descrição acessíveis", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    const dialog = screen.getByRole("dialog", { name: "Editar contato" });
    expect(dialog).toHaveAccessibleDescription("Atualize os dados.");
  });

  it("entra pela direita por padrão, com largura máxima de 400px", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    const cls = screen.getByRole("dialog").className;
    expect(cls).toContain("right-0");
    expect(cls).toContain("sm:max-w-100");
    expect(cls).toContain("shadow-popover");
  });

  it("outros lados", async () => {
    const { unmount } = render(<Example side="left" />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    expect(screen.getByRole("dialog").className).toContain("left-0");
    unmount();
    render(<Example side="bottom" />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    expect(screen.getByRole("dialog").className).toContain("bottom-0");
  });

  it("estilo do Dialog v2: cabeçalho e rodapé com divisórias e padding 12; corpo rola", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    const dialog = screen.getByRole("dialog");
    const header = dialog.querySelector('[data-slot="sheet-header"]')!;
    const footer = dialog.querySelector('[data-slot="sheet-footer"]')!;
    expect(header.className).toContain("border-b");
    expect(header.className).toContain("p-3");
    expect(footer.className).toContain("border-t");
    expect(footer.className).toContain("bg-background");
    expect(dialog.className).toContain("overflow-y-auto");
    expect(dialog.className).toContain("bg-card");
  });

  it("o X fecha; showCloseButton=false esconde; Esc fecha", async () => {
    const { unmount } = render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();
    render(<Example showCloseButton={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    expect(screen.queryByRole("button", { name: "Fechar" })).not.toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Cancelar dentro do SheetClose fecha", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Editar contato" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
