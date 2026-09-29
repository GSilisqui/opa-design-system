import tseslint from "typescript-eslint";
import opa from "./packages/eslint-config/src/index.js";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/generated/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/storybook-static/**",
      "**/.next/**",
      "**/.shadcn/**",
      "**/next-env.d.ts",
    ],
  },
  ...tseslint.configs.recommended,
  ...opa.configs.ui.map((config) => ({ ...config, files: ["packages/ui/src/**/*.{ts,tsx}", "apps/storybook/**/*.{ts,tsx}"] })),
  ...opa.configs.app.map((config) => ({ ...config, files: ["apps/smoke-*/**/*.{ts,tsx}"] })),
);
