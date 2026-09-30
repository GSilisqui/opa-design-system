import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { Icon } from "./icon";
import { ScrollArea } from "./scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarPanel,
  SidebarPanelActions,
  SidebarPanelContent,
  SidebarPanelGroup,
  SidebarPanelGroupLabel,
  SidebarPanelHeader,
  SidebarPanelItem,
  SidebarPanelTitle,
} from "./sidebar";

const meta = {
  title: "Componentes/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Enxugada do Shadcn a pedido do dono: **sem modo expandido**. `Sidebar` é o rail de 56px, só com ícones (nome no Tooltip e no `aria-label`), item ativo como cartão elevado com ícone `solid`, bolinha de aviso e rodapé (notificações, avatar). Os grupos se separam só por espaço. `SidebarPanel` é o painel contextual de 248px de cada aplicação: cabeçalho com título e ações, grupos com título pequeno e itens com ícone, nome e contador; para listas longas (configurações) envolva o conteúdo num `ScrollArea`. Refs no Figma Chat: rail 481:10021, painel 604:6113, lista de configurações 415:3226.",
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Rail = () => (
  <Sidebar aria-label="Aplicações">
    <SidebarHeader>
      <div aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-warning text-sm font-bold text-warning-foreground">
        opa!
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarItem label="Buscar">
          <Icon name="magnifying-glass" />
        </SidebarItem>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarItem label="Atendimentos" active notification>
          <Icon name="circle-info" variant="solid" />
        </SidebarItem>
        <SidebarItem label="Agenda">
          <Icon name="calendar" />
        </SidebarItem>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarItem label="Novidades" notification>
        <Icon name="circle-exclamation" />
      </SidebarItem>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </SidebarFooter>
  </Sidebar>
);

export const Rail56: Story = {
  name: "Rail",
  render: () => (
    <div className="h-[460px]">
      <Rail />
    </div>
  ),
};

export const ComPainel: Story = {
  render: () => (
    <div className="flex h-[460px] bg-background">
      <Rail />
      <SidebarPanel aria-label="Atendimentos">
        <SidebarPanelHeader>
          <SidebarPanelTitle>Atendimentos</SidebarPanelTitle>
          <SidebarPanelActions>
            <Button variant="quiet" layout="icon-only" size="sm" aria-label="Buscar atendimento">
              <Icon name="magnifying-glass" />
            </Button>
            <Button variant="quiet" layout="icon-only" size="sm" aria-label="Novo atendimento">
              <Icon name="plus" />
            </Button>
          </SidebarPanelActions>
        </SidebarPanelHeader>
        <SidebarPanelContent>
          <SidebarPanelGroup>
            <SidebarPanelItem active count={3}>
              <Icon name="calendar" />
              Fila
            </SidebarPanelItem>
            <SidebarPanelItem count={3}>
              <Icon name="copy" />
              Em andamento
            </SidebarPanelItem>
            <SidebarPanelItem count={2}>
              <Icon name="pen" />
              Mais tarde
            </SidebarPanelItem>
            <SidebarPanelItem>
              <Icon name="check" />
              Encerrados
            </SidebarPanelItem>
          </SidebarPanelGroup>
          <SidebarPanelGroup>
            <SidebarPanelGroupLabel>Pastas</SidebarPanelGroupLabel>
            <SidebarPanelItem count={3}>
              <Icon name="face-smile" />
              Inadimplentes
            </SidebarPanelItem>
            <SidebarPanelItem>
              <Icon name="plus" />
              Adicionar nova
            </SidebarPanelItem>
          </SidebarPanelGroup>
        </SidebarPanelContent>
      </SidebarPanel>
    </div>
  ),
};

const secoes: Record<string, string[]> = {
  Empresa: ["Empresa", "Departamentos", "Usuários"],
  Integrações: ["Opa! Store", "Webhooks"],
  Automações: ["Agentes virtuais", "Fluxo de conversa", "Rotinas"],
  Organização: ["Etiquetas", "Motivos", "Mensagens", "Envios em massa"],
  Disponibilidade: ["Controle de horários", "Períodos", "Feriados"],
};

export const ListaLonga: Story = {
  render: () => (
    <div className="h-[420px]">
      <SidebarPanel aria-label="Configurações">
        <ScrollArea className="min-h-0 flex-1">
          <div className="py-2">
            <SidebarPanelGroup>
              <SidebarPanelItem active count={3}>
                <Icon name="check" />
                Geral
              </SidebarPanelItem>
            </SidebarPanelGroup>
            {Object.entries(secoes).map(([titulo, itens]) => (
              <SidebarPanelGroup key={titulo}>
                <SidebarPanelGroupLabel>{titulo}</SidebarPanelGroupLabel>
                {itens.map((item) => (
                  <SidebarPanelItem key={item} count={3}>
                    <Icon name="circle-info" />
                    {item}
                  </SidebarPanelItem>
                ))}
              </SidebarPanelGroup>
            ))}
          </div>
        </ScrollArea>
      </SidebarPanel>
    </div>
  ),
};
