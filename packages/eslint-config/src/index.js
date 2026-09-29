import noRawDesignValues from "./rules/no-raw-design-values.js";

export const plugin = {
  meta: { name: "@opa/eslint-config" },
  rules: { "no-raw-design-values": noRawDesignValues },
};

/** Para packages/ui: libera valores arbitrários vindos do código-fonte do Shadcn. */
export const ui = [
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { opa: plugin },
    rules: { "opa/no-raw-design-values": ["error", { allowArbitraryValues: true }] },
  },
];

/** Para produto e protótipos: só a escala do Tailwind e tokens semânticos. */
export const app = [
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { opa: plugin },
    rules: { "opa/no-raw-design-values": ["error", { allowArbitraryValues: false }] },
  },
];

export default { plugin, configs: { ui, app } };
