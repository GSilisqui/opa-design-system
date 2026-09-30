import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./avatar";
import { Button } from "./button";
import { InputField } from "./input-field";

const meta = {
  title: "Componentes/Avatar",
  component: Avatar,
  args: { size: "default" },
  argTypes: { size: { control: "select", options: ["sm", "default", "lg", "xl", "2xl"] } },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=97-13 · Radix Avatar, **não redondo**: os tamanhos casam com as alturas do DS para ficarem lado a lado com Button, Input e Combobox (24 = Button sm; 36 = Button, Input sm; 48 = Button lg; 60 = Input default) e 96px para perfis. O raio acompanha o do vizinho (8, 12, 16, 12, 24). Sem foto mostra as iniciais sobre `secondary`.",
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="" alt="Ana Souza" />
      <AvatarFallback>AS</AvatarFallback>
    </Avatar>
  ),
};

export const Tamanhos: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["sm", "default", "lg", "xl", "2xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const LadoALado: Story = {
  render: () => (
    <div className="grid max-w-[420px] gap-4">
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Button size="sm" variant="outline">
          Filtrar
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Button>Salvar</Button>
        <div className="flex-1">
          <InputField size="sm" label="Buscar contato" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Avatar size="lg">
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Button size="lg">Nova conversa</Button>
      </div>
      <div className="flex items-center gap-2">
        <Avatar size="xl">
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <InputField label="Nome do contato" defaultValue="Ana Souza" />
        </div>
      </div>
    </div>
  ),
};

export const Grupo: Story = {
  render: () => (
    <AvatarGroup>
      {["AS", "LM", "JP"].map((i) => (
        <Avatar key={i}>
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};
