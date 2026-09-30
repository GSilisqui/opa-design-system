import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.stories.tsx"],
    }),
  ],
  resolve: { alias: { "@": src } },
  build: {
    lib: { entry: "src/index.ts", formats: ["es"] },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
    rolldownOptions: {
      // Tudo de fora fica como import: ícones Pro nunca entram no dist (licença), React/Radix vêm do consumidor.
      external: [/^react(\/|$)/, /^react-dom(\/|$)/, /^radix-ui(\/|$)/, /^@radix-ui\//, /^@fortawesome\//, /^react-hook-form(\/|$)/, /^react-day-picker(\/|$)/, /^sonner(\/|$)/, /^@tanstack\//, /^date-fns(\/|$)/, "cmdk", /^cn(\/|$)/, "class-variance-authority"],
      output: { preserveModules: true, preserveModulesRoot: "src", entryFileNames: "[name].js" },
    },
  },
});
