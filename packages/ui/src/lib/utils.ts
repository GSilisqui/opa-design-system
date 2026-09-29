// cn do DS: o cn do shadcn configurado com os utilitários próprios de src/styles.css.
// Sem isso o merge não conhece as classes do DS (ex.: o "none" do consumidor não tirava a sombra do dropdown).
import { createCn } from "cn/config";

const cn = createCn({
  extend: {
    // Sombras "popover" e "dropdown" do @theme: são tamanhos de sombra (como sm e none), não cores.
    theme: { shadow: ["popover", "dropdown"] },
    // Foco do DS (decisão C): todos definem o mesmo box-shadow/outline, então o último vence.
    classGroups: {
      "focus-ring": ["focus-ring", "focus-halo", { "focus-halo": ["destructive", "success", "warning"] }],
    },
  },
});

export { cn };
