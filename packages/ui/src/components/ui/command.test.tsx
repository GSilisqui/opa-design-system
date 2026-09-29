import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Command, CommandEmpty, CommandList } from "./command";

describe("Command", () => {
  it("CommandEmpty mescla o className do consumidor", () => {
    render(
      <Command>
        <CommandList>
          <CommandEmpty className="py-2">Vazio</CommandEmpty>
        </CommandList>
      </Command>,
    );
    const empty = screen.getByText("Vazio");
    expect(empty.className).toContain("py-2");
    expect(empty.className).not.toContain("py-6");
    expect(empty.className).toContain("text-center");
  });
});
