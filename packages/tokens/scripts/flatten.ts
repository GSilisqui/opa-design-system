export interface FlatToken {
  path: string[];
  type: string;
  value: unknown;
}

type Node = Record<string, unknown>;

const isNode = (value: unknown): value is Node =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function flatten(tree: Node, inheritedType?: string, path: string[] = []): FlatToken[] {
  const groupType = typeof tree.$type === "string" ? tree.$type : inheritedType;
  const out: FlatToken[] = [];

  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    const nodePath = [...path, key];
    const id = nodePath.join(".");

    if (!isNode(node)) throw new Error(`"${id}" precisa ser um grupo ou token (objeto)`);

    if ("$value" in node) {
      const type = typeof node.$type === "string" ? node.$type : groupType;
      if (!type) throw new Error(`Token "${id}" sem $type (defina no token ou no grupo)`);
      out.push({ path: nodePath, type, value: node.$value });
    } else {
      out.push(...flatten(node, groupType, nodePath));
    }
  }

  return out;
}
