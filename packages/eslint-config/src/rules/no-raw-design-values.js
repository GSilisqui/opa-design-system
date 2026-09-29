import { splitClasses, utilityOf } from "../lib/classes.js";

// (?<![a-z]) em vez de \b: no Tailwind "_" substitui espaço (ex.: 0_0_0_1px_rgba(...)), e "_" conta como caractere de palavra.
// Hex: termina em qualquer coisa que não seja [0-9a-z] (então "#fff_0%" é pego) e ignora referências "url(#id)".
const COLOR_LITERAL = /(?<!url\()#[0-9a-f]{3,8}(?![0-9a-z])|(?<![a-z])(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\(/i;
const NAMED_COLORS = [
  "black", "white", "red", "green", "blue", "yellow", "orange", "purple", "pink", "gray", "grey", "silver",
  "maroon", "navy", "teal", "olive", "lime", "aqua", "cyan", "magenta", "fuchsia", "brown", "gold", "indigo", "violet",
];
const NAMED_COLOR = new RegExp(`(?<![\w-])(?:${NAMED_COLORS.join("|")})(?![\w-])`, "i");
const COLOR_PROPERTY = /color|background|fill|stroke|border|outline|shadow/i;
const PALETTE =
  /-(?:slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|[1-9]00|950)(?:\/\S+)?$/;
const ARBITRARY = /\[[^\]]*\]|\((?:[a-z-]+:)?--[^)]*\)/;
const DEFAULT_CALLEES = ["cn", "clsx", "cx", "cva", "twMerge", "tv", "twJoin"];

/**
 * @param {string} cls
 * @param {{ allowArbitraryValues: boolean }} options
 * @returns {"primitive" | "rawColor" | "palette" | "arbitraryValue" | null}
 */
export function classProblem(cls, { allowArbitraryValues }) {
  const utility = utilityOf(cls);
  if (utility.includes("--opa-")) return "primitive";
  const arbitrary = utility.match(ARBITRARY)?.[0];
  if (arbitrary && COLOR_LITERAL.test(arbitrary)) return "rawColor";
  if (PALETTE.test(utility)) return "palette";
  if (arbitrary && !allowArbitraryValues) return "arbitraryValue";
  return null;
}

/**
 * Coleta strings de classes de uma expressão. Não desce em chamadas:
 * cn/cva/... aninhados são tratados pelo visitor de CallExpression (evita erro duplicado).
 */
function collectStrings(node, out = []) {
  if (!node) return out;
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") out.push({ node, value: node.value });
      break;
    case "TemplateLiteral":
      node.quasis.forEach((q) => out.push({ node: q, value: q.value.cooked ?? "" }));
      node.expressions.forEach((e) => collectStrings(e, out));
      break;
    case "ArrayExpression":
      node.elements.forEach((e) => collectStrings(e, out));
      break;
    case "ObjectExpression":
      node.properties.forEach((p) => {
        if (p.type !== "Property") return;
        if (p.key.type === "Literal") collectStrings(p.key, out);
        collectStrings(p.value, out);
      });
      break;
    case "ConditionalExpression":
      collectStrings(node.consequent, out);
      collectStrings(node.alternate, out);
      break;
    case "LogicalExpression":
      if (node.operator !== "&&") collectStrings(node.left, out);
      collectStrings(node.right, out);
      break;
    case "JSXExpressionContainer":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSNonNullExpression":
      collectStrings(node.expression, out);
      break;
  }
  return out;
}

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Proíbe cores fixas, primitivos, paleta padrão do Tailwind e (em apps) valores arbitrários.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowArbitraryValues: { type: "boolean" },
          callees: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      primitive: 'Primitivo "{{cls}}" não pode ser usado diretamente. Use o token semântico correspondente.',
      rawColor: 'Cor fixa "{{cls}}" não é permitida. Use um token semântico (ex.: bg-primary, text-muted-foreground).',
      palette: '"{{cls}}" usa a paleta padrão do Tailwind, que não existe no DS. Use um token semântico.',
      arbitraryValue: 'Valor arbitrário "{{cls}}" não é permitido em apps. Use a escala do Tailwind (ex.: p-4, w-96).',
    },
  },
  create(context) {
    const options = { allowArbitraryValues: false, ...context.options[0] };
    options.callees = [...new Set([...DEFAULT_CALLEES, ...(context.options[0]?.callees ?? [])])];

    function checkClasses(strings) {
      for (const { node, value } of strings) {
        for (const cls of splitClasses(value)) {
          const problem = classProblem(cls, options);
          if (problem) context.report({ node, messageId: problem, data: { cls } });
        }
      }
    }

    function checkStyle(objectExpression) {
      for (const p of objectExpression.properties) {
        if (p.type !== "Property") continue;
        const key = p.key.type === "Identifier" ? p.key.name : String(p.key.value ?? "");
        const colorKey = COLOR_PROPERTY.test(key);
        for (const { node, value } of collectStrings(p.value)) {
          if (value.includes("--opa-")) context.report({ node, messageId: "primitive", data: { cls: value } });
          else if (COLOR_LITERAL.test(value) || (colorKey && NAMED_COLOR.test(value)))
            context.report({ node, messageId: "rawColor", data: { cls: value } });
        }
      }
    }

    return {
      JSXAttribute(node) {
        const name = node.name.name;
        if (name === "className" || name === "class") {
          checkClasses(collectStrings(node.value));
        } else if (
          name === "style" &&
          node.value?.type === "JSXExpressionContainer" &&
          node.value.expression.type === "ObjectExpression"
        ) {
          checkStyle(node.value.expression);
        }
      },
      CallExpression(node) {
        if (node.callee.type === "Identifier" && options.callees.includes(node.callee.name)) {
          checkClasses(node.arguments.flatMap((arg) => collectStrings(arg)));
        }
      },
    };
  },
};
