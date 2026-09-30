import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { InputField } from "./input-field";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";

const meta = {
  title: "Componentes/Sheet",
  component: SheetContent,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=84-108 · Radix Dialog como painel lateral, no estilo do Dialog v2: padding 12, cabeçalho e rodapé separados por divisórias (rodapé no `background`), overlay preto a 50% e X no canto. Entra pela direita por padrão (`side`: left, top, bottom), largura máxima de 400px. O corpo (qualquer filho direto fora de cabeçalho e rodapé) rola. Só texto? Use Dialog.",
      },
    },
  },
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Editar contato</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Editar contato</SheetTitle>
          <SheetDescription>Atualize os dados principais.</SheetDescription>
        </SheetHeader>
        <div className="grid content-start gap-2">
          <InputField label="Nome" defaultValue="Ana Souza" />
          <InputField label="E-mail" defaultValue="ana@opa.com" />
          <InputField label="Telefone" defaultValue="(11) 99999-0000" />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button>Salvar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Lados: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["right", "left", "top", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="neutral">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Painel {side}</SheetTitle>
              <SheetDescription>Entra pelo lado {side}.</SheetDescription>
            </SheetHeader>
            <p className="text-base text-foreground-secondary">Conteúdo do painel.</p>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
