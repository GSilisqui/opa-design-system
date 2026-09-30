import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("mostra as iniciais quando não há imagem", () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="Ana Souza" />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  it.each([
    ["sm", "size-6", "rounded-lg"],
    ["default", "size-9", "rounded-xl"],
    ["lg", "size-12", "rounded-2xl"],
    ["xl", "size-15", "rounded-xl"],
    ["2xl", "size-24", "rounded-3xl"],
  ] as const)("tamanho %s: %s com raio %s (casa com Button/Input)", (size, dim, radius) => {
    const { container } = render(
      <Avatar size={size}>
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>,
    );
    const root = container.querySelector('[data-slot="avatar"]')!;
    expect(root.className).toContain(dim);
    expect(root.className).toContain(radius);
    expect(root.className).not.toContain("rounded-full");
    expect(root).toHaveAttribute("data-size", size);
  });

  it("padrão é 36px (a altura do Button e do Input sm)", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector('[data-slot="avatar"]')!.className).toContain("size-9");
  });

  it("fallback usa secondary e o texto cresce com o tamanho", () => {
    render(
      <Avatar size="lg">
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>,
    );
    const cls = screen.getByText("AS").className;
    expect(cls).toContain("bg-secondary");
    expect(cls).toContain("group-data-[size=lg]/avatar:text-lg");
  });

  it("grupo sobreposto com contador +N", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>LM</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    );
    expect(screen.getByText("+3")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-group"]')!.className).toContain("-space-x-2");
    expect(screen.getByText("+3").className).toContain("bg-primary");
  });
});
