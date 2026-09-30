import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Switch } from "./switch";
import { Tag } from "./tag";

const meta = {
  title: "Componentes/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=96-4 · Bloco de conteúdo dentro da página: superfície `card` com borda e raio xl, **sem sombra** (a sombra é de quem flutua: popover, menu, toast), padding de 16px. Agrupa uma informação (métrica, resumo de um contato, uma configuração) e pode ser clicável. Não é o Dialog: o Card fica no fluxo da tela e não interrompe o usuário.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => (
    <Card className="max-w-[360px]">
      <CardHeader>
        <CardTitle>Ana Souza</CardTitle>
        <CardDescription>Cliente desde março de 2024</CardDescription>
      </CardHeader>
      <CardContent className="text-base text-foreground-secondary">Última conversa há 2 dias, no WhatsApp. Prefere contato à tarde.</CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline">Ver histórico</Button>
        <Button>Abrir conversa</Button>
      </CardFooter>
    </Card>
  ),
};

export const EmUso: Story = {
  render: () => (
    <div className="grid max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Atendimentos abertos</CardDescription>
          <CardTitle className="text-3xl leading-9 font-medium">128</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-success-subtle-foreground">+12% em relação a ontem</CardContent>
      </Card>
      <Card className="cursor-pointer transition-colors hover:bg-shade-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar size="default">
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base leading-5">Ana Souza</CardTitle>
              <CardDescription className="text-sm">Cliente desde 2024</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex gap-1">
          <Tag>VIP</Tag>
          <Tag>WhatsApp</Tag>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base leading-5">Notificações por e-mail</CardTitle>
          <CardDescription className="text-sm">Resumo diário</CardDescription>
          <CardAction>
            <Switch defaultChecked aria-label="Notificações por e-mail" />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  ),
};
