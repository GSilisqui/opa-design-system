import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("monta cabeçalho, conteúdo e rodapé", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Ana Souza</CardTitle>
          <CardDescription>Cliente desde março de 2024</CardDescription>
          <CardAction>ação</CardAction>
        </CardHeader>
        <CardContent>Última conversa há 2 dias.</CardContent>
        <CardFooter>rodapé</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Ana Souza")).toBeInTheDocument();
    expect(screen.getByText("Cliente desde março de 2024")).toBeInTheDocument();
    expect(screen.getByText("Última conversa há 2 dias.")).toBeInTheDocument();
    expect(screen.getByText("rodapé")).toBeInTheDocument();
    expect(screen.getByText("ação").getAttribute("data-slot")).toBe("card-action");
  });

  it("estilo: superfície card com borda e raio xl, sem sombra, padding 16", () => {
    const { container } = render(<Card>x</Card>);
    const card = container.querySelector('[data-slot="card"]')!;
    for (const cls of ["bg-card", "border-border", "rounded-xl", "py-4"]) expect(card.className).toContain(cls);
    expect(card.className).not.toContain("shadow");
  });

  it("título 16px regular e descrição 14px em foreground-secondary", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
          <CardDescription>Descrição</CardDescription>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByText("Título").className).toContain("text-lg");
    expect(screen.getByText("Título").className).toContain("font-normal");
    expect(screen.getByText("Descrição").className).toContain("text-foreground-secondary");
  });
});
