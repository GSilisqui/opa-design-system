import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function Example({ onEdit = () => {}, onDelete = () => {} }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Ações</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Contato</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onEdit}>
            Editar <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Duplicar</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Mover para…</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Comercial</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("abre pelo botão e lista os itens como menuitem", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Ações" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem").map((i) => i.textContent)).toEqual(["Editar Ctrl E", "Duplicar", "Mover para…", "Excluir"]);
    expect(screen.getByText("Contato")).toBeInTheDocument();
  });

  it("escolher um item chama onSelect e fecha o menu", async () => {
    const onEdit = vi.fn();
    render(<Example onEdit={onEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Ações" }));
    await userEvent.click(screen.getByRole("menuitem", { name: /Editar/ }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("funciona pelo teclado e Esc fecha", async () => {
    const onEdit = vi.fn();
    render(<Example onEdit={onEdit} />);
    screen.getByRole("button", { name: "Ações" }).focus();
    await userEvent.keyboard("{Enter}");
    // aberto pelo teclado, o primeiro item já recebe o foco
    await userEvent.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Ações" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("item desabilitado e item destrutivo", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Ações" }));
    const disabled = screen.getByRole("menuitem", { name: "Duplicar" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled.className).toContain("data-[disabled]:opacity-40");
    const del = screen.getByRole("menuitem", { name: "Excluir" });
    expect(del).toHaveAttribute("data-variant", "destructive");
    expect(del.className).toContain("data-[variant=destructive]:text-destructive");
  });

  it("estilo: superfície do popover, sombra dropdown, raio xl e itens de 36px", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Ações" }));
    const content = screen.getByRole("menu");
    for (const cls of ["bg-popover", "shadow-dropdown", "rounded-xl", "p-1"]) expect(content.className).toContain(cls);
    const item = screen.getByRole("menuitem", { name: /Editar/ });
    for (const cls of ["h-9", "rounded-lg", "px-3", "text-base"]) expect(item.className).toContain(cls);
  });

  it("rótulo de grupo tem o mesmo respiro lateral dos itens (px-3) e py-2", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Ações" }));
    const label = screen.getByText("Contato");
    expect(label.className).toContain("px-3");
    expect(label.className).toContain("py-2");
    // mais suave que o texto dos itens; 80% mantém o contraste de 4,5:1 (70% reprovava no Light)
    expect(label.className).toContain("text-foreground-secondary/80");
  });

  it("submenu abre com a seta para a direita", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Ações" }));
    screen.getByRole("menuitem", { name: "Mover para…" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(await screen.findByRole("menuitem", { name: "Comercial" })).toBeInTheDocument();
  });

  it("itens de marcar e de opção", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Exibir</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Telefone</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Nome</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="b">Data</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Exibir" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "Telefone" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: "Nome" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: "Data" })).toHaveAttribute("aria-checked", "false");
  });
});
