import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { Button } from "./button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

const schema = z.object({ email: z.string().email("Informe um e-mail válido") });

function Example({ onSubmit = () => {} }: { onSubmit?: (v: z.infer<typeof schema>) => void }) {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="ana@opa.com" {...field} />
              </FormControl>
              <FormDescription>Usamos para enviar o resumo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("liga label, descrição e campo pelo id", () => {
    render(<Example />);
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAccessibleDescription("Usamos para enviar o resumo.");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("mostra a mensagem do zod, marca aria-invalid e o label em destructive", async () => {
    const onSubmit = vi.fn();
    render(<Example onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("E-mail"), "ana@");
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
    const message = await screen.findByText("Informe um e-mail válido");
    expect(message.className).toContain("text-destructive");
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Usamos para enviar o resumo. Informe um e-mail válido");
    expect(screen.getByText("E-mail").getAttribute("data-error")).toBe("true");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envia quando válido e limpa o erro", async () => {
    const onSubmit = vi.fn();
    render(<Example onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("E-mail"), "ana@opa.com");
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({ email: "ana@opa.com" });
    expect(screen.queryByText("Informe um e-mail válido")).not.toBeInTheDocument();
  });

  it("useFormField fora de um FormField lança erro", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bad() {
      const form = useForm();
      return (
        <Form {...form}>
          <FormItem>
            <FormLabel>Solto</FormLabel>
          </FormItem>
        </Form>
      );
    }
    expect(() => render(<Bad />)).toThrow("useFormField should be used within <FormField>");
    spy.mockRestore();
  });
});
