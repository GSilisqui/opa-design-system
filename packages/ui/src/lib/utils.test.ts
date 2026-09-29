import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn do DS", () => {
  it("sombras do DS são tamanhos de sombra: shadow-none sobrescreve", () => {
    expect(cn("shadow-dropdown", "shadow-none")).toBe("shadow-none");
    expect(cn("shadow-popover", "shadow-dropdown")).toBe("shadow-dropdown");
  });

  it("cor de sombra não remove a sombra do DS", () => {
    expect(cn("shadow-popover", "shadow-black")).toBe("shadow-popover shadow-black");
  });

  it("focus-ring e focus-halo* são um grupo: o último vence", () => {
    expect(cn("focus-halo", "focus-halo-destructive")).toBe("focus-halo-destructive");
    expect(cn("focus-ring", "focus-halo-success")).toBe("focus-halo-success");
    expect(cn("focus-visible:focus-halo", "focus-visible:focus-halo-warning")).toBe("focus-visible:focus-halo-warning");
    expect(cn("focus-halo", "focus-visible:focus-halo-destructive")).toBe("focus-halo focus-visible:focus-halo-destructive");
  });

  it("mantém o merge padrão do Tailwind", () => {
    expect(cn("bg-primary hover:bg-shade-primary", "hover:bg-destructive")).toBe("bg-primary hover:bg-destructive");
    expect(cn("px-2", false, { "px-4": true })).toBe("px-4");
  });
});
