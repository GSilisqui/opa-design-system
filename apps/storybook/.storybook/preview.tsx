import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles.css";

// Exceções de contraste aprovadas pelo dono em 2026-09-29 (ver tabela de decisões do Plano 2):
// Tag info/highlight e textos de campo com status success/warning mantêm as cores do Figma.
// O contraste continua sendo verificado em todos os outros elementos.
const STATUS_TEXT_SLOTS = ["label", "input-field-description", "combobox-label", "combobox-description", "date-picker-label", "date-picker-description"];
const CONTRAST_EXCEPTIONS = [
  '[data-slot="tag"][data-variant="info"]',
  '[data-slot="tag"][data-variant="highlight"]',
  ...STATUS_TEXT_SLOTS.flatMap((slot) => ["success", "warning"].map((status) => `[data-slot="${slot}"][data-status="${status}"]`)),
];

const preview: Preview = {
  tags: ["autodocs"],
  // `pnpm test:dark` (vitest run --mode dark) roda todas as stories (e o teste de a11y/contraste) no tema Dark.
  initialGlobals: { theme: import.meta.env.MODE === "dark" ? "Dark" : "Light" },
  decorators: [withThemeByClassName({ themes: { Light: "", Dark: "dark" }, defaultTheme: "Light" })],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: {
      test: "error",
      config: {
        rules: [
          {
            id: "color-contrast",
            selector: `*${CONTRAST_EXCEPTIONS.map((s) => `:not(${s}):not(${s} *)`).join("")}`,
          },
        ],
      },
    },
    options: { storySort: { order: ["Introdução", "Fundações", "Componentes", "Changelog"] } },
  },
};

export default preview;
