import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { InputField } from "./input-field";

const meta = {
  title: "Componentes/Dialog",
  component: DialogContent,
  parameters: {
    docs: {
      description: {
        component:
          "Figma (Modal): https://www.figma.com/design/7FS6JptRPLnco6VSAEAOAH/?node-id=6377-1529 · Sem X por padrão; `showCloseButton` para ativar. Footer: Neutral (cancelar) + Primary.",
      },
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Encerrar atendimento</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Encerrar atendimento</DialogTitle>
          <DialogDescription>O cliente vai receber a pesquisa de satisfação.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral">Cancelar</Button>
          </DialogClose>
          <Button>Encerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ComFormulario: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="neutral">Novo contato</Button>
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader className="pr-10">
          <DialogTitle>Novo contato</DialogTitle>
          <DialogDescription>Preencha os dados principais.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <InputField label="Nome" required />
          <InputField label="E-mail" type="email" optional />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral">Cancelar</Button>
          </DialogClose>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
