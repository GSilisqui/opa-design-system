import noRawDesignValues from "./rules/no-raw-design-values.js";

export const plugin = {
  meta: { name: "@opa/eslint-config" },
  rules: { "no-raw-design-values": noRawDesignValues },
};

/** Para packages/ui: libera valores arbitrários vindos do código-fonte do Shadcn. */
export const ui = [
  {
    plugins: { opa: plugin },
    rules: { "opa/no-raw-design-values": ["error", { allowArbitraryValues: true }] },
  },
];

/** Para produto e protótipos: só a escala do Tailwind e tokens semânticos. */
export const app = [
  {
    plugins: { opa: plugin },
    rules: { "opa/no-raw-design-values": ["error", { allowArbitraryValues: false }] },
  },
];

export default { plugin, configs: { ui, app } };
