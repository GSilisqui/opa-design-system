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
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi/?node-id=11-357 · Header e footer separados por divisórias; o corpo fica entre os dois. Sem X por padrão; `showCloseButton` para ativar. Footer: Outline (cancelar) + Primary. Só texto? Ele vai na `DialogDescription`, não num corpo separado; o corpo é para formulários e outros componentes.",
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
            <Button variant="outline">Cancelar</Button>
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
        <DialogHeader className="pr-12">
          <DialogTitle>Novo contato</DialogTitle>
          <DialogDescription>Preencha os dados principais.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <InputField label="Nome" required />
          <InputField label="E-mail" type="email" optional />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Destrutivo: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Excluir contatos</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Excluir 3 contatos?</DialogTitle>
          <DialogDescription>
            Os contatos saem das listas e dos atendimentos em aberto. O histórico de conversas continua salvo. Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive">Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

