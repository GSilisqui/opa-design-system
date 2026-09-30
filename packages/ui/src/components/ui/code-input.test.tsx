import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { CodeInput, tokenizeJsonLine } from "./code-input";

function Example(props: Partial<React.ComponentProps<typeof CodeInput>>) {
  const [value, setValue] = useState('{"a":1}');
  return <CodeInput value={value} onValueChange={setValue} {...props} />;
}

describe("tokenizeJsonLine", () => {
  it("separa chave, texto, número, literal, colchete e pontuação", () => {
    const tokens = tokenizeJsonLine('  "id": [1, true, "x"],');
    const by = (text: string) => tokens.find((t) => t.text === text)?.className;
    expect(by('"id"')).toBe("text-primary-subtle-foreground");
    expect(by("1")).toBe("text-warning-subtle-foreground");
    expect(by("true")).toBe("text-warning-subtle-foreground");
    expect(by('"x"')).toBe("text-success-subtle-foreground");
    expect(by("[")).toBe("text-info-subtle-foreground");
    expect(tokens.map((t) => t.text).join("")).toBe('  "id": [1, true, "x"],');
  });
});

describe("CodeInput", () => {
  it("tem cabeçalho com a linguagem, campo nomeado e números de linha", () => {
    render(<CodeInput defaultValue={"{\n  \"a\": 1\n}"} minLines={3} />);
    expect(screen.getByText("JSON")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "JSON" })).toHaveValue('{\n  "a": 1\n}');
    const gutter = document.querySelector('[data-slot="code-input-gutter"]') as HTMLElement;
    expect(gutter.textContent).toBe("123");
  });

  it("completa o gutter até minLines", () => {
    render(<CodeInput defaultValue="x" minLines={5} />);
    expect((document.querySelector('[data-slot="code-input-gutter"]') as HTMLElement).children).toHaveLength(5);
  });

  it("digitar chama onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<CodeInput defaultValue="" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("textbox"), "ab");
    expect(onValueChange).toHaveBeenLastCalledWith("ab");
  });

  it("Formatar reindenta o JSON", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Formatar" }));
    expect(screen.getByRole("textbox")).toHaveValue('{\n  "a": 1\n}');
  });

  it("Formatar com JSON inválido avisa onFormatError e não muda o texto", async () => {
    const onFormatError = vi.fn();
    render(<CodeInput defaultValue="{oops" onFormatError={onFormatError} />);
    await userEvent.click(screen.getByRole("button", { name: "Formatar" }));
    expect(onFormatError).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("textbox")).toHaveValue("{oops");
  });

  it("Copiar escreve na área de transferência e mostra Copiado", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<CodeInput defaultValue="abc" />);
    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(writeText).toHaveBeenCalledWith("abc");
    await waitFor(() => expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument());
  });

  it("Tab insere dois espaços e Enter mantém a indentação", () => {
    render(<CodeInput defaultValue="a" />);
    const area = screen.getByRole("textbox") as HTMLTextAreaElement;
    area.setSelectionRange(0, 0);
    fireEvent.keyDown(area, { key: "Tab" });
    expect(area).toHaveValue("  a");
    area.setSelectionRange(3, 3);
    fireEvent.keyDown(area, { key: "Enter" });
    expect(area).toHaveValue("  a\n  ");
  });

  it("Enter depois de abrir chave aumenta a indentação", () => {
    render(<CodeInput defaultValue="{" />);
    const area = screen.getByRole("textbox") as HTMLTextAreaElement;
    area.setSelectionRange(1, 1);
    fireEvent.keyDown(area, { key: "Enter" });
    expect(area).toHaveValue("{\n  ");
  });

  it("readOnly e disabled bloqueiam a edição; invalid marca aria-invalid", () => {
    const { rerender } = render(<CodeInput defaultValue="x" readOnly invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Formatar" })).toBeDisabled();
    rerender(<CodeInput defaultValue="x" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("language=text não mostra Formatar", () => {
    render(<CodeInput defaultValue="x" language="text" />);
    expect(screen.queryByRole("button", { name: "Formatar" })).not.toBeInTheDocument();
    expect(screen.getByText("TEXT")).toBeInTheDocument();
  });
});
