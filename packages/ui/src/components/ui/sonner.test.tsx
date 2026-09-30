import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster, toast } from "./sonner";

afterEach(() => {
  act(() => {
    toast.dismiss();
  });
});

describe("Toaster", () => {
  it("mostra o título e a descrição do toast", async () => {
    render(<Toaster />);
    act(() => {
      toast("Contato atualizado", { description: "Segunda, 3 de janeiro às 17:00" });
    });
    expect(await screen.findByText("Contato atualizado")).toBeInTheDocument();
    expect(screen.getByText("Segunda, 3 de janeiro às 17:00")).toBeInTheDocument();
  });

  it("tipos mostram o ícone do DS (sólido, colorido)", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Contato arquivado");
      toast.error("Não foi possível enviar");
    });
    await screen.findByText("Contato arquivado");
    const ok = document.querySelector('[data-icon="circle-check"]');
    const er = document.querySelector('[data-icon="circle-xmark"]');
    expect(ok?.getAttribute("class")).toContain("text-success");
    expect(er?.getAttribute("class")).toContain("text-destructive");
  });

  it("a ação chama o callback", async () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.success("Contato arquivado", { action: { label: "Desfazer", onClick } });
    });
    await userEvent.click(await screen.findByRole("button", { name: "Desfazer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("estilo: cartão popover com borda, sombra e raio xl", async () => {
    render(<Toaster />);
    act(() => {
      toast("Olá");
    });
    await screen.findByText("Olá");
    const el = document.querySelector("[data-sonner-toast]") as HTMLElement;
    for (const cls of ["!bg-popover", "!border-border", "!shadow-popover", "!rounded-xl"]) expect(el.className).toContain(cls);
    expect(document.querySelector("[data-sonner-toaster]")).toHaveAttribute("data-y-position", "bottom");
    expect(document.querySelector("[data-sonner-toaster]")).toHaveAttribute("data-x-position", "right");
  });
});
