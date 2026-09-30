import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Label } from "./label";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("é um textbox com nome pelo label e aceita digitação", async () => {
    render(
      <div>
        <Label htmlFor="obs">Observações</Label>
        <Textarea id="obs" />
      </div>,
    );
    const field = screen.getByRole("textbox", { name: "Observações" });
    await userEvent.type(field, "Cliente prefere contato à tarde");
    expect(field).toHaveValue("Cliente prefere contato à tarde");
  });

  it("usa os tokens do Input (borda, foco com halo e erro destructive)", () => {
    render(<Textarea aria-label="x" aria-invalid />);
    const className = screen.getByRole("textbox").className;
    expect(className).toContain("rounded-xl");
    expect(className).toContain("focus-visible:focus-halo");
    expect(className).toContain("aria-invalid:border-destructive");
  });

  it("disabled usa opacity-40", () => {
    render(<Textarea aria-label="x" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox").className).toContain("disabled:opacity-40");
  });
});
