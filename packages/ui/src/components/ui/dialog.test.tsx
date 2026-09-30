import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

function Example({ showCloseButton }: { showCloseButton?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Encerrar</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>Encerrar atendimento</DialogTitle>
          <DialogDescription>O cliente vai receber a pesquisa de satisfação.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("abre pelo trigger com título e descrição acessíveis", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    const dialog = screen.getByRole("dialog", { name: "Encerrar atendimento" });
    expect(dialog).toHaveAccessibleDescription("O cliente vai receber a pesquisa de satisfação.");
    expect(dialog.className).toContain("sm:max-w-[448px]");
    expect(dialog.className).toContain("shadow-popover");
  });

  it("não mostra o X por padrão", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    expect(screen.queryByRole("button", { name: "Fechar" })).not.toBeInTheDocument();
  });

  it("showCloseButton mostra o X, que fecha o dialog", async () => {
    render(<Example showCloseButton />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("header e footer têm divisórias e o footer usa o fundo background", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    const dialog = screen.getByRole("dialog");
    const header = dialog.querySelector('[data-slot="dialog-header"]')!;
    const footer = dialog.querySelector('[data-slot="dialog-footer"]')!;
    expect(header.className).toContain("border-b");
    expect(header.className).toContain("p-3");
    expect(footer.className).toContain("bg-background");
    expect(footer.className).toContain("border-t");
    expect(dialog.className).toContain("rounded-xl");
  });

  it("Esc fecha o dialog", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("título é Regular (sem semibold)", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Encerrar" }));
    const title = screen.getByText("Encerrar atendimento");
    expect(title.className).toContain("font-normal");
    expect(title.className).not.toContain("font-semibold");
  });
});
