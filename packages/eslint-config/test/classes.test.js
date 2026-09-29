import { describe, expect, it } from "vitest";
import { splitClasses, utilityOf } from "../src/lib/classes.js";

describe("splitClasses", () => {
  it("separa por qualquer espaço em branco", () => {
    expect(splitClasses("  a  b\n c ")).toEqual(["a", "b", "c"]);
  });
});

describe("utilityOf", () => {
  it("remove variantes simples", () => {
    expect(utilityOf("hover:focus:bg-primary")).toBe("bg-primary");
  });

  it("não quebra em ':' dentro de colchetes ou parênteses", () => {
    expect(utilityOf("[&>svg:first-child]:size-4")).toBe("size-4");
    expect(utilityOf("hover:[color:#fff]")).toBe("[color:#fff]");
    expect(utilityOf("md:max-h-(--radix-x)")).toBe("max-h-(--radix-x)");
  });

  it("remove o modificador ! de importante", () => {
    expect(utilityOf("!bg-primary")).toBe("bg-primary");
    expect(utilityOf("bg-primary!")).toBe("bg-primary");
  });
});
