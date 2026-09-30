import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Toaster, toast } from "./sonner";

const meta = {
  title: "Componentes/Toast",
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          "Sonner no estilo validado com o dono: cartão popover com ícone só nos tipos, título + descrição, ação em Outline pequeno (secundária em Quiet) e botão de fechar no canto ao passar o mouse. Canto inferior direito, pilha compacta, some em 4s. Coloque `<Toaster />` uma vez na raiz do app e chame `toast(...)` de qualquer lugar.",
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tipos: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button variant="neutral" onClick={() => toast("Contato atualizado", { description: "Segunda, 3 de janeiro às 17:00" })}>
        Padrão
      </Button>
      <Button
        variant="neutral"
        onClick={() => toast.success("Contato arquivado", { description: "Ele sai da lista de abertos", action: { label: "Desfazer", onClick: () => {} } })}
      >
        Sucesso com ação
      </Button>
      <Button
        variant="neutral"
        onClick={() => toast.error("Não foi possível enviar", { description: "Verifique a conexão", action: { label: "Tentar", onClick: () => {} }, cancel: { label: "Cancelar", onClick: () => {} } })}
      >
        Erro
      </Button>
      <Button variant="neutral" onClick={() => toast.warning("Número sem WhatsApp", { description: "A mensagem irá por SMS" })}>
        Alerta
      </Button>
      <Button variant="neutral" onClick={() => toast.info("Nova versão disponível", { description: "Atualize a página quando puder" })}>
        Info
      </Button>
      <Button variant="neutral" onClick={() => toast.loading("Enviando mensagem…")}>
        Carregando
      </Button>
    </div>
  ),
};
