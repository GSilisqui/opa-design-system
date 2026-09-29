import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Icon } from "./icon";
import { iconNames, icons } from "./icon-registry";

describe("Icon", () => {
  it("desenha o path do ícone e fica oculto para leitores de tela", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("data-icon", "check");
    expect(svg.getAttribute("viewBox")).toMatch(/^0 0 \d+ \d+$/);
    expect(svg.querySelector("path")?.getAttribute("d")).toBeTruthy();
    expect(svg.getAttribute("class")).toContain("h-[1em]");
  });

  it("com label vira imagem acessível", () => {
    render(<Icon name="trash" label="Excluir" />);
    expect(screen.getByRole("img", { name: "Excluir" })).toBeInTheDocument();
  });

  it("variant solid usa o desenho sólido", () => {
    const { container } = render(
      <>
        <Icon name="circle-info" />
        <Icon name="circle-info" variant="solid" />
      </>,
    );
    const [regular, solid] = container.querySelectorAll("path");
    expect(regular.getAttribute("d")).not.toBe(solid.getAttribute("d"));
  });

  it("nome desconhecido não desenha nada e avisa em desenvolvimento", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // @ts-expect-error nome fora do registro, como pode chegar de JS ou de dados.
    const { container } = render(<Icon name="nao-existe" />);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("nao-existe"));
    warn.mockRestore();
  });

  it("size aplica a classe de tamanho", () => {
    const { container } = render(<Icon name="plus" size="lg" />);
    expect(container.querySelector("svg")!.getAttribute("class")).toContain("size-5");
  });
});

describe("registro de ícones", () => {
  it.each(iconNames)("%s existe em regular e solid com o nome certo", (name) => {
    expect(icons.regular[name].iconName).toBe(name);
    expect(icons.regular[name].prefix).toBe("far");
    expect(icons.solid[name].iconName).toBe(name);
    expect(icons.solid[name].prefix).toBe("fas");
  });
});
