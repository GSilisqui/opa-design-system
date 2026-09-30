import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("é um bloco accent que pulsa e para com reduzir movimento", () => {
    const { container } = render(<Skeleton className="h-3 w-40" />);
    const el = container.querySelector('[data-slot="skeleton"]')!;
    for (const cls of ["bg-accent", "animate-pulse", "motion-reduce:animate-none", "rounded-lg", "h-3", "w-40"]) expect(el.className).toContain(cls);
  });

  it("aceita formas via className (círculo, bloco)", () => {
    const { container } = render(<Skeleton className="size-9 rounded-xl" />);
    expect(container.querySelector('[data-slot="skeleton"]')!.className).toContain("size-9");
  });
});
