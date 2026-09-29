import { describe, expect, it } from "vitest";
import { flatten } from "../scripts/flatten";

describe("flatten", () => {
  it("achata grupos aninhados herdando o $type do grupo", () => {
    const tokens = flatten({
      color: {
        $type: "color",
        brand: { "600": { $value: "#4a3fd9" } },
      },
    });
    expect(tokens).toEqual([{ path: ["color", "brand", "600"], type: "color", value: "#4a3fd9" }]);
  });

  it("usa o $type do token quando definido", () => {
    const tokens = flatten({ size: { $type: "dimension", x: { $type: "number", $value: 2 } } });
    expect(tokens[0].type).toBe("number");
  });

  it("ignora chaves de metadados ($description etc.)", () => {
    const tokens = flatten({ $description: "raiz", a: { $type: "color", $value: "#fff", $description: "x" } });
    expect(tokens).toHaveLength(1);
  });

  it("falha quando o token não tem $type", () => {
    expect(() => flatten({ a: { $value: "#fff" } })).toThrow('Token "a" sem $type');
  });

  it("falha quando um nó não é objeto", () => {
    expect(() => flatten({ a: "#fff" })).toThrow('"a" precisa ser um grupo ou token');
  });
});
