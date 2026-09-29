import { RuleTester } from "eslint";
import { afterAll, describe, it } from "vitest";
import rule from "../src/rules/no-raw-design-values.js";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const ui = [{ allowArbitraryValues: true }];

tester.run("no-raw-design-values", rule, {
  valid: [
    { code: '<div className="bg-primary text-muted-foreground p-4 hover:bg-accent" />' },
    { code: 'cn("rounded-md", active && "bg-primary text-primary-foreground")' },
    { code: '<div className="[&>svg]:size-4 has-[>svg]:px-3" />' },
    { code: '<div style={{ display: "flex" }} />' },
    {
      code: 'cva("max-h-(--radix-select-content-available-height) w-[calc(100%-2rem)] translate-x-[-50%]")',
      options: ui,
    },
    { code: 'cva("", { variants: { variant: { primary: "bg-primary" } }, defaultVariants: { variant: "primary" } })' },
    { code: 'const label = "bg-[#fff]"', name: "strings fora de className/cn não são analisadas" },
  ],
  invalid: [
    {
      code: '<div className="bg-[#3b35c9]" />',
      options: ui,
      errors: [{ messageId: "rawColor", data: { cls: "bg-[#3b35c9]" } }],
    },
    {
      code: 'cn("shadow-[0_0_0_1px_rgba(0,0,0,.1)]")',
      options: ui,
      errors: [{ messageId: "rawColor" }],
    },
    {
      code: '<div className="text-(--opa-brand-600)" />',
      options: ui,
      errors: [{ messageId: "primitive" }],
    },
    {
      code: '<div className="bg-blue-500 hover:bg-red-500/50" />',
      errors: [{ messageId: "palette" }, { messageId: "palette" }],
    },
    {
      code: '<div className="p-[13px]" />',
      errors: [{ messageId: "arbitraryValue", data: { cls: "p-[13px]" } }],
    },
    {
      code: '<div style={{ color: "#fff" }} />',
      errors: [{ messageId: "rawColor" }],
    },
    {
      code: '<div style={{ color: "var(--opa-brand-600)" }} />',
      errors: [{ messageId: "primitive" }],
    },
    {
      code: 'cva("", { variants: { v: { a: "bg-[rgb(0,0,0)]" } } })',
      options: ui,
      errors: [{ messageId: "rawColor" }],
    },
    {
      code: '<div className={cn("px-2", cn("bg-zinc-100"))} />',
      errors: [{ messageId: "palette" }],
      name: "cn aninhado reporta uma vez só",
    },
    {
      code: "<div className={`flex ${open ? 'bg-[#000]' : 'bg-muted'}`} />",
      errors: [{ messageId: "rawColor" }],
    },
  ],
});
