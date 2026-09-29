import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
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
    { code: '<div className="[mask:url(#fade)]" />', options: ui },
    { code: '<svg style={{ clipPath: "url(#abc)" }} />' },
    { code: '<div className="bg-(color:--x)" />', options: ui },
    { code: '<div style={{ border: "none" }} />' },
    { code: '<div style={{ color: "var(--primary)" }} />' },
    { code: '<div style={{ color: "transparent", fill: "currentColor" }} />' },
    { code: 'myCn("bg-primary")', options: [{ callees: ["myCn"] }] },
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
    { code: 'cn("bg-[linear-gradient(90deg,#fff_0%,#000_100%)]")', options: ui, errors: [{ messageId: "rawColor" }] },
    { code: 'cn("shadow-[#0003_0_1px_2px]")', options: ui, errors: [{ messageId: "rawColor" }] },
    { code: '<div style={{ color: "red" }} />', errors: [{ messageId: "rawColor" }] },
    { code: '<div style={{ border: "1px solid Red" }} />', errors: [{ messageId: "rawColor" }] },
    { code: '<div style={{ color: a ? "#fff" : "var(--primary)" }} />', errors: [{ messageId: "rawColor" }] },
    { code: "<div style={{ color: `#fff` }} />", errors: [{ messageId: "rawColor" }] },
    { code: 'cn("bg-mauve-500 text-taupe-100 border-mist-200 ring-olive-900")', errors: Array(4).fill({ messageId: "palette" }) },
    { code: 'cn("bg-(color:--x)")', errors: [{ messageId: "arbitraryValue" }] },
    { code: 'cn("bg-blue-500")', options: [{ callees: ["myCn"] }], errors: [{ messageId: "palette" }] },
    { code: 'myCn("bg-blue-500")', options: [{ callees: ["myCn"] }], errors: [{ messageId: "palette" }] },
    { code: 'tv("bg-blue-500"); twJoin("bg-red-500")', errors: [{ messageId: "palette" }, { messageId: "palette" }] },
    {
      code: "<div className={`flex ${open ? 'bg-[#000]' : 'bg-muted'}`} />",
      errors: [{ messageId: "rawColor" }],
    },
  ],
});

const tsTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

tsTester.run("no-raw-design-values (ts)", rule, {
  valid: [{ code: 'cva("", { variants: { v: { a: "bg-primary" } } as const })' }],
  invalid: [
    { code: 'cva("", { variants: { v: { a: "bg-[#000]" } } as const })', options: ui, errors: [{ messageId: "rawColor" }] },
    { code: 'cn("bg-[#000]" satisfies string)', options: ui, errors: [{ messageId: "rawColor" }] },
    { code: 'cn(x! && "bg-[#000]"!)', options: ui, errors: [{ messageId: "rawColor" }] },
  ],
});
