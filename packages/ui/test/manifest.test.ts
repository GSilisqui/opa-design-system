// Manifesto Figma ↔ código (manifest/components.json): falha quando o manifesto, o código e o índice do Figma divergem.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import * as ui from "../src/index";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(pkgRoot, "../..");
const manifestPath = join(repoRoot, "manifest/components.json");
const figmaIndexPath = join(repoRoot, "docs/superpowers/notes/figma-library-index.json");

type FigmaRef = { name: string; nodeId: string; key: string; page: string; url: string };
type PropMap = { figma: string | null; react: string | null; values?: string[]; map?: Record<string, string>; notes?: string };
type ManifestComponent = {
  status: "stable" | "beta" | "planned";
  react: { import: string; exports: string[]; source: string };
  figma: FigmaRef | null;
  figmaParts?: (FigmaRef & { props: PropMap[] })[];
  storybook: { title: string; story?: string } | null;
  props: PropMap[];
};
type Manifest = {
  version: number;
  figmaFile: { key: string; url: string };
  components: Record<string, ManifestComponent>;
  icons: { items: { name: string; figma: FigmaIcon }[]; brands: { names: string[] } };
  tokens: unknown;
};
type FigmaIndex = {
  fileKey: string;
  fileUrl: string;
  components: Record<string, { nodeId: string; key: string; page: string; properties: Record<string, { type: string; values?: string[] }> }>;
  icons: Record<string, FigmaIcon>;
};
/** No Figma, cada ícone é um componente com a propriedade variant (regular | solid), como o <Icon variant>. */
type FigmaIcon = { nodeId: string; key: string; type: string; variants: Record<string, { nodeId: string; key: string }> };

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T;

/** Chaves de `variants.<group>` do cva num arquivo-fonte (o cva não expõe a config em runtime). */
function cvaVariantKeys(file: string, cvaName: string, group: string): string[] {
  const source = ts.createSourceFile(file, readFileSync(join(pkgRoot, file), "utf8"), ts.ScriptTarget.Latest, true);
  const nameOf = (prop: ts.ObjectLiteralElementLike) =>
    prop.name && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) ? prop.name.text : undefined;
  const findObject = (obj: ts.ObjectLiteralExpression, key: string) => {
    const prop = obj.properties.find((p) => nameOf(p) === key);
    return prop && ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer) ? prop.initializer : undefined;
  };
  let keys: string[] | undefined;
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === cvaName && node.initializer && ts.isCallExpression(node.initializer)) {
      const config = node.initializer.arguments[1];
      const variants = config && ts.isObjectLiteralExpression(config) ? findObject(config, "variants") : undefined;
      const groupObj = variants && findObject(variants, group);
      keys = groupObj?.properties.map(nameOf).filter((k): k is string => Boolean(k));
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!keys) throw new Error(`variants.${group} de ${cvaName} não encontrado em ${file}`);
  return keys;
}

describe("manifest/components.json", () => {
  it("existe", () => {
    expect(existsSync(manifestPath), `falta ${manifestPath}`).toBe(true);
  });

  const manifest = existsSync(manifestPath) ? readJson<Manifest>(manifestPath) : undefined;
  const index = readJson<FigmaIndex>(figmaIndexPath);
  const components = Object.entries(manifest?.components ?? {});

  it("aponta para o arquivo do Figma do índice", () => {
    expect(manifest?.version).toBeTypeOf("number");
    expect(manifest?.figmaFile).toEqual({ key: index.fileKey, url: index.fileUrl });
  });

  it("todo export listado existe em src/index.ts e todo export de componente está no manifesto", () => {
    const listed = components.flatMap(([, c]) => c.react.exports);
    for (const name of listed) expect(ui, `export "${name}" não existe em src/index.ts`).toHaveProperty(name);
    // Exports de runtime (inclui helpers como buttonVariants e iconNames; tipos não aparecem aqui).
    // `cn` é utilitário para quem estende componentes, não um componente do Figma.
    expect(Object.keys(ui).filter((name) => name !== "cn" && !listed.includes(name))).toEqual([]);
  });

  it("usa @opa/ui e caminhos de código que existem", () => {
    for (const [name, c] of components) {
      expect(c.react.import, name).toBe("@opa/ui");
      expect(existsSync(join(repoRoot, c.react.source)), `${name}: ${c.react.source}`).toBe(true);
      expect(["stable", "beta", "planned"]).toContain(c.status);
    }
  });

  it("referências do Figma batem com o índice (nodeId, key, page, url)", () => {
    const refs = components.flatMap(([, c]) => [c.figma, ...(c.figmaParts ?? [])]).filter((r): r is FigmaRef => Boolean(r));
    for (const ref of refs) {
      const entry = index.components[ref.name];
      expect(entry, `"${ref.name}" não está no figma-library-index.json`).toBeDefined();
      expect({ nodeId: ref.nodeId, key: ref.key, page: ref.page }).toEqual({ nodeId: entry.nodeId, key: entry.key, page: entry.page });
      expect(ref.url).toBe(`${index.fileUrl}?node-id=${ref.nodeId.replace(":", "-")}`);
    }
    // Todo componente do Figma aparece no manifesto.
    expect(Object.keys(index.components).filter((name) => !refs.some((r) => r.name === name))).toEqual([]);
  });

  it("toda propriedade do Figma está mapeada em props[].figma", () => {
    const owners = components.flatMap(([, c]) => [
      ...(c.figma ? [{ name: c.figma.name, props: c.props }] : []),
      ...(c.figmaParts ?? []).map((part) => ({ name: part.name, props: part.props })),
    ]);
    for (const { name, props } of owners) {
      const mapped = props.map((p) => p.figma);
      const missing = Object.keys(index.components[name]?.properties ?? {}).filter((prop) => !mapped.includes(prop));
      expect(missing, `${name}: propriedades do Figma sem mapeamento`).toEqual([]);
      for (const p of props.filter((p) => p.figma)) {
        expect(index.components[name]?.properties, `${name}: "${p.figma}" não existe no Figma`).toHaveProperty(p.figma as string);
      }
    }
  });

  it.each([
    ["Button", "src/components/ui/button.tsx", "buttonVariants"],
    ["Tag", "src/components/ui/tag.tsx", "tagVariants"],
  ])("%s: variant e size iguais no manifesto, no cva e no Figma", (name, file, cvaName) => {
    const c = manifest?.components[name];
    expect(c, name).toBeDefined();
    for (const group of ["variant", "size"]) {
      const prop = c?.props.find((p) => p.react === group);
      const code = cvaVariantKeys(file, cvaName, group);
      expect(prop?.figma, `${name}.${group}`).toBe(group);
      expect(prop?.values, `${name}.${group} manifesto × cva`).toEqual(code);
      expect(index.components[name].properties[group].values, `${name}.${group} Figma × cva`).toEqual(code);
    }
  });

  it("ícones: mesmos nomes do icon-registry; no Figma, um componente por ícone com variant regular e solid", () => {
    const items = manifest?.icons.items ?? [];
    expect(items.map((i) => i.name).sort()).toEqual([...ui.iconNames].sort());
    expect(Object.keys(index.icons).sort(), "índice do Figma × icon-registry").toEqual([...ui.iconNames].sort());
    for (const item of items) {
      const figma = index.icons[item.name];
      expect(figma, `${item.name} não está no Figma`).toBeDefined();
      expect(figma.type).toBe("COMPONENT_SET");
      expect(Object.keys(figma.variants).sort(), `${item.name}: variantes`).toEqual(["regular", "solid"]);
      expect(item.figma).toEqual(figma);
    }
  });

  it("logos: mesmos nomes do brandsMap do registro", () => {
    expect([...(manifest?.icons.brands.names ?? [])].sort()).toEqual([...ui.brandIconNames].sort());
  });

  it("stories citadas existem", () => {
    const storyFiles = readdirSync(join(pkgRoot, "src/components/ui")).filter((f) => f.endsWith(".stories.tsx"));
    const titles = storyFiles.map((f) => /title:\s*"([^"]+)"/.exec(readFileSync(join(pkgRoot, "src/components/ui", f), "utf8"))?.[1]);
    for (const [name, c] of components) {
      if (c.storybook) expect(titles, name).toContain(c.storybook.title);
    }
  });
});
