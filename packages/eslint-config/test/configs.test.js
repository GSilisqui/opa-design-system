import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";
import opa from "../src/index.js";

async function lint(configs, filePath) {
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [...configs] });
  const [result] = await eslint.lintText('export const A = () => <div className="bg-blue-500 p-[13px]" />;', { filePath });
  return result.messages;
}

describe("configs standalone", () => {
  it("app lint em .jsx sem configuração extra", async () => {
    const messages = await lint(opa.configs.app, "a.jsx");
    expect(messages.map((m) => m.ruleId)).toEqual(["opa/no-raw-design-values", "opa/no-raw-design-values"]);
    expect(messages[0].message).toContain("bg-blue-500");
  });

  it("ui permite valor arbitrário mas ainda pega a paleta", async () => {
    const messages = await lint(opa.configs.ui, "a.jsx");
    expect(messages).toHaveLength(1);
    expect(messages[0].message).toContain("bg-blue-500");
  });
});
