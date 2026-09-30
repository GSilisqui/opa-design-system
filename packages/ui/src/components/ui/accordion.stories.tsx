import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "Componentes/Accordion",
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=97-117 · Radix Accordion: itens separados por linha fina, título em 14px medium (44px de altura) com seta que gira, conteúdo em `foreground-secondary`. `type=\"single\"` abre um por vez (`collapsible` deixa fechar todos); `type=\"multiple\"` abre vários. Sem borda externa: envolva num Card ou numa borda quando precisar.",
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: { type: "single", collapsible: true, defaultValue: "a" },
  render: (args) => (
    <div className="max-w-[380px] rounded-xl border border-border bg-card px-3">
      <Accordion {...args}>
        <AccordionItem value="a">
          <AccordionTrigger>Como arquivo um contato?</AccordionTrigger>
          <AccordionContent>Abra o contato e use Ações &gt; Arquivar. Ele sai da lista de abertos.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Posso desfazer?</AccordionTrigger>
          <AccordionContent>Sim, pelo botão Desfazer do aviso que aparece logo depois.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>Quem vê os arquivados?</AccordionTrigger>
          <AccordionContent>Somente administradores, na aba Arquivados.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
