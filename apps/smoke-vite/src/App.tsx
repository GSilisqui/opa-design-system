import { Button, Combobox, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Icon, InputField, Tag } from "@opa/ui";

export function App() {
  return (
    <main className="grid max-w-md gap-4 p-8">
      <Button>
        <Icon name="plus" />
        Novo contato
      </Button>
      <Tag variant="info">Novo</Tag>
      <InputField label="Nome" />
      <Combobox label="Departamento" options={[{ value: "suporte", label: "Suporte" }]} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="neutral">Abrir</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título</DialogTitle>
            <DialogDescription>Descrição</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
