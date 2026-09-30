import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";

const schema = z.object({
  nome: z.string().min(2, "Informe o nome do contato"),
  email: z.string().email("Informe um e-mail válido"),
  observacoes: z.string().max(120, "Use no máximo 120 caracteres").optional(),
  aceite: z.boolean().refine((v) => v, "Confirme para continuar"),
});
type Values = z.infer<typeof schema>;

function ContatoForm({ initial }: { initial?: Partial<Values> }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", observacoes: "", aceite: false, ...initial },
    mode: "onSubmit",
  });
  // Com valores iniciais, valida ao abrir a story para já mostrar os erros.
  useEffect(() => {
    if (initial) void form.trigger();
  }, []);
  return (
    <Form {...form}>
      <form className="grid max-w-[400px] gap-4" onSubmit={form.handleSubmit(() => {})} noValidate>
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ana Souza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ana@opa.com" {...field} />
              </FormControl>
              <FormDescription>Usamos para enviar o resumo do atendimento.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Escreva uma observação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aceite"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Tenho autorização para cadastrar este contato</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}

const meta = {
  title: "Componentes/Form",
  component: ContatoForm,
  parameters: {
    docs: {
      description: {
        component:
          "react-hook-form + zod (Shadcn Form). Sem componente próprio no Figma: é a composição de `FormLabel`, o campo dentro de `FormControl`, `FormDescription` e `FormMessage`. Erro do zod liga `aria-invalid`, pinta o label e mostra a mensagem em `destructive`. Para um campo com label flutuante e status visual, prefira `InputField`.",
      },
    },
  },
} satisfies Meta<typeof ContatoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => <ContatoForm />,
};

export const ComErros: Story = {
  render: () => <ContatoForm initial={{ nome: "A", email: "ana@" }} />,
};
