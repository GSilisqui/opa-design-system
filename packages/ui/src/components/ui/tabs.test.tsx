import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Example(props: { variant?: "segmented" | "underline"; size?: "default" | "sm" }) {
  return (
    <Tabs defaultValue="abertos">
      <TabsList aria-label="Atendimentos" {...props}>
        <TabsTrigger value="abertos">
          <Icon name="face-smile" />
          Abertos
        </TabsTrigger>
        <TabsTrigger value="fechados">Fechados</TabsTrigger>
        <TabsTrigger value="arquivados" disabled>
          Arquivados
        </TabsTrigger>
        <TabsTrigger value="busca" layout="icon-only" aria-label="Busca">
          <Icon name="magnifying-glass" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="abertos">Lista de abertos</TabsContent>
      <TabsContent value="fechados">Lista de fechados</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("expõe tablist, abas e o painel da aba ativa", () => {
    render(<Example />);
    expect(screen.getByRole("tablist", { name: "Atendimentos" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tab", { name: "Abertos" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Lista de abertos");
  });

  it("clicar troca a aba e o painel", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Fechados" }));
    expect(screen.getByRole("tab", { name: "Fechados" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Lista de fechados");
  });

  it("setas movem o foco e pulam a aba desabilitada", async () => {
    render(<Example />);
    screen.getByRole("tab", { name: "Abertos" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Fechados" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Busca" })).toHaveFocus();
  });

  it("aba desabilitada não é selecionável e usa opacity-40", async () => {
    render(<Example />);
    const tab = screen.getByRole("tab", { name: "Arquivados" });
    expect(tab).toBeDisabled();
    expect(tab.className).toContain("disabled:opacity-40");
  });

  it("variante e tamanho vêm da lista (data-*) e as abas se ajustam", () => {
    const { rerender } = render(<Example />);
    let list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-variant", "segmented");
    expect(list).toHaveAttribute("data-size", "default");
    expect(list.className).toContain("bg-muted");
    expect(screen.getByRole("tab", { name: "Fechados" }).className).toContain("group-data-[size=default]/tabs-list:h-9");
    rerender(<Example variant="underline" size="sm" />);
    list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-variant", "underline");
    expect(list).toHaveAttribute("data-size", "sm");
    expect(list.className).toContain("border-b");
    expect(screen.getByRole("tab", { name: "Fechados" }).className).toContain("group-data-[size=sm]/tabs-list:h-6");
  });

  it("layout icon-only é quadrado e precisa de aria-label", () => {
    render(<Example />);
    const tab = screen.getByRole("tab", { name: "Busca" });
    expect(tab.className).toContain("aspect-square");
    expect(tab).toHaveAttribute("data-layout", "icon-only");
  });
});
