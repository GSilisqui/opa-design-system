import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

function Example({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <RadioGroup aria-label="Canal" defaultValue="whatsapp" onValueChange={onValueChange}>
      <div>
        <RadioGroupItem id="c1" value="whatsapp" />
        <Label htmlFor="c1">WhatsApp</Label>
      </div>
      <div>
        <RadioGroupItem id="c2" value="email" />
        <Label htmlFor="c2">E-mail</Label>
      </div>
      <div>
        <RadioGroupItem id="c3" value="telefone" disabled size="sm" />
        <Label htmlFor="c3">Telefone</Label>
      </div>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("expõe radiogroup e marca o valor padrão", () => {
    render(<Example />);
    expect(screen.getByRole("radiogroup", { name: "Canal" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "WhatsApp" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "E-mail" })).not.toBeChecked();
  });

  it("escolher outro item chama onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "E-mail" }));
    expect(onValueChange).toHaveBeenCalledWith("email");
    expect(screen.getByRole("radio", { name: "E-mail" })).toBeChecked();
  });

  it("setas movem o foco entre os itens (roving focus)", async () => {
    render(<Example />);
    screen.getByRole("radio", { name: "WhatsApp" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    // O Radix move o foco num setTimeout; a seleção por seta depende do keydown ainda estar ativo, o que o jsdom não reproduz.
    await waitFor(() => expect(screen.getByRole("radio", { name: "E-mail" })).toHaveFocus());
  });

  it("disabled e tamanho sm", () => {
    render(<Example />);
    const item = screen.getByRole("radio", { name: "Telefone" });
    expect(item).toBeDisabled();
    expect(item.className).toContain("size-4");
    expect(item.className).toContain("disabled:opacity-40");
  });
});
