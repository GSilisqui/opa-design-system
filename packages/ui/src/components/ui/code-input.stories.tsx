import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CodeInput } from "./code-input";

const meta = {
  title: "Componentes/CodeInput",
  component: CodeInput,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=110-221 · Editor de código leve, baseado no exemplo \"Copiar e colar JSON\" (OPAII-4930). Cabeçalho com a linguagem e as ações **Formatar** (reindenta JSON) e **Copiar**; números de linha; realce de sintaxe JSON (chave em `primary`, texto em `success`, números e literais em `warning`, colchetes em `info`); rolagem pelo `ScrollArea` do DS. A altura vem de `className` (ex.: `h-80`). Tab insere dois espaços e Enter mantém a indentação. Um `<textarea>` transparente fica sobre o texto colorido, sem biblioteca de editor.",
      },
    },
  },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const exemplo = '{\n  "cliente_id": "CLI-553",\n  "itens": [ 1, 2, true, null ],\n  "observacao": "Pedido via Opa! IA"\n}';

export const Json: Story = {
  render: () => {
    const [value, setValue] = useState(exemplo);
    return <CodeInput value={value} onValueChange={setValue} className="h-72 max-w-xl" />;
  },
};

export const ColarEFormatar: Story = {
  render: () => {
    const [value, setValue] = useState('{"cliente_id":"CLI-553","itens":[1,2,3],"ok":true}');
    return <CodeInput value={value} onValueChange={setValue} title="Resposta da ferramenta" className="h-72 max-w-xl" />;
  },
};

export const Invalido: Story = {
  render: () => <CodeInput defaultValue={'{ "a": '} invalid className="h-56 max-w-xl" />,
};

export const SomenteLeitura: Story = {
  render: () => <CodeInput defaultValue={exemplo} readOnly className="h-56 max-w-xl" />,
};

export const Desabilitado: Story = {
  render: () => <CodeInput defaultValue={exemplo} disabled className="h-56 max-w-xl" />,
};
