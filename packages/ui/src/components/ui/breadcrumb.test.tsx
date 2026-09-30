import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";

function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Início</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/contatos">Contatos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Ana Souza</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("é uma navegação com nome em português e lista ordenada", () => {
    render(<Example />);
    expect(screen.getByRole("navigation", { name: "Trilha de navegação" })).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("links navegam e a página atual é aria-current", () => {
    render(<Example />);
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Contatos" })).toHaveAttribute("href", "/contatos");
    const current = screen.getByText("Ana Souza");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.className).toContain("font-medium");
    expect(current.className).toContain("text-foreground");
  });

  it("separadores são decorativos e o ellipsis tem texto para leitor de tela", () => {
    const { container } = render(<Example />);
    const seps = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
    expect(seps).toHaveLength(3);
    seps.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"));
    expect(screen.getByText("Mais").className).toContain("sr-only");
  });

  it("estilo: 14px em foreground-secondary, link com hover em foreground", () => {
    render(<Example />);
    expect(screen.getByRole("list").className).toContain("text-base");
    expect(screen.getByRole("list").className).toContain("text-foreground-secondary");
    expect(screen.getByRole("link", { name: "Início" }).className).toContain("hover:text-foreground");
  });
});
