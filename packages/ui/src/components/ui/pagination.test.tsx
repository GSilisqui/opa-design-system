import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("é uma navegação com o texto da página e o resumo", () => {
    render(<Pagination page={3} pageCount={10} total={100} pageSize={10} />);
    expect(screen.getByRole("navigation", { name: "Paginação" })).toBeInTheDocument();
    expect(screen.getByText("Página 3 de 10")).toBeInTheDocument();
    expect(screen.getByText("Exibindo 21 – 30 de 100")).toBeInTheDocument();
  });

  it("sem total/pageSize não mostra o resumo", () => {
    render(<Pagination page={1} pageCount={5} />);
    expect(document.querySelector('[data-slot="pagination-summary"]')).toBeEmptyDOMElement();
  });

  it("última página corta o resumo no total", () => {
    render(<Pagination page={4} pageCount={4} total={35} pageSize={10} />);
    expect(screen.getByText("Exibindo 31 – 35 de 35")).toBeInTheDocument();
  });

  it("os quatro botões chamam onPageChange com a página certa", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Primeira página" }));
    await userEvent.click(screen.getByRole("button", { name: "Página anterior" }));
    await userEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    await userEvent.click(screen.getByRole("button", { name: "Última página" }));
    expect(onPageChange.mock.calls.map((c) => c[0])).toEqual([1, 4, 6, 10]);
  });

  it("na primeira página, primeira e anterior ficam desabilitadas; na última, próxima e última", () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} />);
    expect(screen.getByRole("button", { name: "Primeira página" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima página" })).toBeEnabled();
    rerender(<Pagination page={3} pageCount={3} />);
    expect(screen.getByRole("button", { name: "Próxima página" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Última página" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Primeira página" })).toBeEnabled();
  });

  it("funciona controlado e atualiza o texto", async () => {
    function Controlled() {
      const [page, setPage] = useState(1);
      return <Pagination page={page} pageCount={3} onPageChange={setPage} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    expect(screen.getByText("Página 2 de 3")).toBeInTheDocument();
  });

  it("disabled desabilita todos os botões; textos podem ser trocados", () => {
    render(<Pagination page={2} pageCount={5} disabled labels={{ page: (p, c) => `Pág. ${p}/${c}`, next: "Avançar" }} />);
    expect(screen.getByText("Pág. 2/5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Avançar" })).toBeDisabled();
  });

  it("botões são de ícone (Quiet, quadrado) com nome acessível", () => {
    render(<Pagination page={2} pageCount={5} />);
    const btn = screen.getByRole("button", { name: "Próxima página" });
    expect(btn.className).toContain("aspect-square");
  });
});
