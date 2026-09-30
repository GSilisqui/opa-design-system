import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Icon } from "./icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Componentes/Tooltip",
  component: TooltipContent,
  parameters: {
    docs: {
      description: {
        component:
          "Radix Tooltip no estilo validado com o dono: compacto, cor inversa (`bg-foreground text-background`), `text-sm`, sem seta. Aparece no hover e no foco; Esc fecha. Serve para explicar botões só com ícone (que também precisam de `aria-label`). Texto longo ou conteúdo interativo: use Popover.",
      },
    },
  },
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex justify-center p-16">
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button variant="neutral" layout="icon-only" aria-label="Arquivar contato">
              <Icon name="copy" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Arquivar contato</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const Posicoes: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex flex-wrap justify-center gap-24 p-24">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side} defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Dica</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};
