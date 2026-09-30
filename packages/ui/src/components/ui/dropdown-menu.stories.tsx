import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Icon } from "./icon";

const meta = {
  title: "Componentes/DropdownMenu",
  component: DropdownMenuContent,
  parameters: {
    docs: {
      description: {
        component:
          "Radix DropdownMenu no estilo validado com o dono: superfície do Popover (borda, sombra `dropdown`, raio xl), itens de 36px com ícone à esquerda e atalho à direita, rótulo de grupo, separador, item destrutivo em vermelho, itens de marcar/opção e submenu. Para ações; escolher um valor de um formulário é Combobox.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => (
    <div className="flex min-h-[320px] justify-start">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Ações</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuLabel>Contato</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon name="pen" />
              Editar
              <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="copy" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Icon name="plus" />
                Mover para…
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Comercial</DropdownMenuItem>
                <DropdownMenuItem>Suporte</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Icon name="trash" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const ItensDeMarcar: Story = {
  render: () => (
    <div className="flex min-h-[300px] justify-start">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Exibir</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Colunas</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked>Telefone</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>E-mail</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuRadioGroup value="nome">
            <DropdownMenuRadioItem value="nome">Nome</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="data">Data</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
