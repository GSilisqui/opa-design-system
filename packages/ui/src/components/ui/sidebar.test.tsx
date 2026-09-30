import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Icon } from "./icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem, SidebarPanel, SidebarPanelGroup, SidebarPanelGroupLabel, SidebarPanelHeader, SidebarPanelItem, SidebarPanelTitle } from "./sidebar";

describe("Sidebar (rail)", () => {
  it("é uma navegação; cada item só com ícone tem nome acessível", () => {
    render(
      <Sidebar aria-label="Principal">
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem label="Buscar">
              <Icon name="magnifying-glass" />
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>,
    );
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  it("item ativo marca aria-current e data-active; aviso desenha a bolinha", () => {
    const { container } = render(
      <Sidebar>
        <SidebarItem label="Atendimentos" active notification>
          <Icon name="calendar" />
        </SidebarItem>
        <SidebarItem label="Agenda">
          <Icon name="calendar" />
        </SidebarItem>
      </Sidebar>,
    );
    const ativo = screen.getByRole("button", { name: "Atendimentos" });
    expect(ativo).toHaveAttribute("aria-current", "page");
    expect(ativo).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: "Agenda" })).not.toHaveAttribute("aria-current");
    expect(container.querySelectorAll('[data-slot="sidebar-item-dot"]')).toHaveLength(1);
  });

  it("mostra o nome num Tooltip ao focar e dispara o clique", async () => {
    const onClick = vi.fn();
    render(
      <Sidebar>
        <SidebarItem label="Buscar" onClick={onClick}>
          <Icon name="magnifying-glass" />
        </SidebarItem>
      </Sidebar>,
    );
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Buscar");
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("asChild usa o link como item", () => {
    render(
      <Sidebar>
        <SidebarItem label="Início" asChild>
          <a href="/inicio">
            <Icon name="plus" />
          </a>
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/inicio");
  });
});

describe("SidebarPanel", () => {
  it("monta cabeçalho, grupo com título, itens e contador", () => {
    render(
      <SidebarPanel aria-label="Atendimentos">
        <SidebarPanelHeader>
          <SidebarPanelTitle>Atendimentos</SidebarPanelTitle>
        </SidebarPanelHeader>
        <SidebarPanelGroup>
          <SidebarPanelGroupLabel>Pastas</SidebarPanelGroupLabel>
          <SidebarPanelItem active count={3}>
            Fila
          </SidebarPanelItem>
          <SidebarPanelItem>Encerrados</SidebarPanelItem>
        </SidebarPanelGroup>
      </SidebarPanel>,
    );
    expect(screen.getByRole("complementary", { name: "Atendimentos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Atendimentos" })).toBeInTheDocument();
    const fila = screen.getByRole("button", { name: /Fila/ });
    expect(fila).toHaveAttribute("aria-current", "page");
    expect(fila).toHaveTextContent("3");
    expect(screen.getByRole("button", { name: "Encerrados" })).not.toHaveAttribute("aria-current");
  });
});
