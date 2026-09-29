import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./tag";

describe("Tag", () => {
  it("usa neutral e default por padrão", () => {
    render(<Tag>Neutra</Tag>);
    const tag = screen.getByText("Neutra");
    expect(tag).toHaveAttribute("data-slot", "tag");
    expect(tag.className).toContain("bg-tag-bg");
    expect(tag.className).toContain("border-tag-border");
    expect(tag.className).toContain("text-tag-foreground");
    expect(tag.className).toContain("h-5");
    expect(tag.className).toContain("text-base");
  });

  it.each([
    ["primary", "bg-primary-subtle"],
    ["success", "bg-success-subtle"],
    ["warning", "bg-warning-subtle"],
    ["info", "bg-info-subtle"],
    ["destructive", "bg-destructive-subtle"],
    ["highlight", "bg-highlight-subtle"],
  ] as const)("variante %s", (variant, expected) => {
    render(<Tag variant={variant}>X</Tag>);
    expect(screen.getByText("X").className).toContain(expected);
  });

  it("size md tem 24px e raio 8px", () => {
    render(<Tag size="md">Médio</Tag>);
    expect(screen.getByText("Médio").className).toContain("h-6");
    expect(screen.getByText("Médio").className).toContain("rounded-lg");
  });

  it("sem onRemove não tem botão", () => {
    render(<Tag>Sem remover</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("onRemove mostra o botão Remover e chama a função", async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>VIP</Tag>);
    await userEvent.click(screen.getByRole("button", { name: "Remover VIP" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("aceita outro texto para o botão", () => {
    render(
      <Tag onRemove={() => {}} removeLabel="Excluir">
        VIP
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Excluir VIP" })).toBeInTheDocument();
  });

  it("cada tag tem um botão de remover com nome próprio", () => {
    render(
      <>
        <Tag onRemove={() => {}}>VIP</Tag>
        <Tag onRemove={() => {}}>Atrasado</Tag>
      </>,
    );
    expect(screen.getByRole("button", { name: "Remover VIP" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remover Atrasado" })).toBeInTheDocument();
  });
});
