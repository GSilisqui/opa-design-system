import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { InputField } from "./input-field";
import { Wizard, type WizardProps, type WizardStep } from "./wizard";

const meta = {
  title: "Componentes/Wizard",
  component: Wizard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dialog em passos para formulários longos e importações. Etapas na vertical à esquerda (círculo numerado + linha), navegação livre por clique ou teclado, passo atual controlado por `step`/`onStepChange`. `status` por etapa (`complete`, `error`); o atual vem de `step`. Próximo fica bloqueado quando o passo atual está com `error`. Ocupa 80% da janela. Sem layout mobile por enquanto. Figma: ainda não construído.",
      },
    },
  },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

const importSteps: WizardStep[] = [
  {
    id: "arquivo",
    title: "Arquivo",
    description: "contatos.csv",
    status: "complete",
    content: (
      <div className="grid gap-3">
        <InputField label="Arquivo" defaultValue="contatos.csv" />
      </div>
    ),
  },
  {
    id: "mapear",
    title: "Mapear colunas",
    content: (
      <div className="grid max-w-md gap-3">
        <InputField label="Coluna “Nome”" defaultValue="Nome do contato" />
        <InputField label="Coluna “Fone”" defaultValue="Telefone" />
        <InputField label="Coluna “E-mail”" defaultValue="E-mail" optional />
      </div>
    ),
  },
  { id: "revisar", title: "Revisar", content: <p className="text-base text-foreground-secondary">Confira os 128 contatos antes de importar.</p> },
  { id: "importar", title: "Importar", content: <p className="text-base text-foreground-secondary">Tudo pronto. Clique em Importar para começar.</p> },
];

/** Consumidor típico: guarda o passo e abre/fecha pelo botão. */
function Demo({ initialStep = "mapear", ...props }: Partial<WizardProps> & { initialStep?: string }) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(initialStep);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir wizard</Button>
      <Wizard
        title="Importar contatos"
        steps={importSteps}
        finishLabel="Importar"
        {...props}
        open={open}
        onOpenChange={setOpen}
        step={step}
        onStepChange={setStep}
      />
    </>
  );
}

export const Padrao: Story = {
  args: { open: false, title: "Importar contatos", steps: importSteps },
  render: () => <Demo />,
};

export const Importacao: Story = {
  args: Padrao.args,
  render: () => <Demo description="Envie, mapeie e importe seus contatos." initialStep="arquivo" />,
};

export const ComErro: Story = {
  args: Padrao.args,
  render: () => (
    <Demo
      initialStep="revisar"
      steps={importSteps.map((s) => (s.id === "revisar" ? { ...s, status: "error" as const, content: <p className="text-base text-destructive">Corrija as 2 linhas com telefone inválido.</p> } : s))}
    />
  ),
};

export const Carregando: Story = {
  args: Padrao.args,
  render: () => <Demo initialStep="importar" loading />,
};
