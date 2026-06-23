import { describe, expect, it } from "vitest";

import { classify } from "../../scripts/lib/dax-classify.mjs";

describe("classify (DAX Review Layer)", () => {
  it("classifica agregações puras como simple", () => {
    expect(classify({ dax: "SUM(Vendas[Valor])" }).complexity).toBe("simple");
    expect(classify({ dax: "DISTINCTCOUNT(Vendas[PedidoID])" }).complexity).toBe(
      "simple",
    );
  });

  it("classifica DIVIDE/IF/SWITCH como moderate", () => {
    expect(classify({ dax: "DIVIDE([Receita], [Pedidos])" }).complexity).toBe(
      "moderate",
    );
    expect(classify({ dax: "IF([Receita] > 0, 1, 0)" }).complexity).toBe(
      "moderate",
    );
  });

  it("classifica CALCULATE/SELECTEDVALUE/REMOVEFILTERS como complex", () => {
    const r = classify({
      dax: `VAR Closer = CALCULATE(SELECTEDVALUE(Clientes[CLOSER_FUNIL]), REMOVEFILTERS(dCalendario)) RETURN Closer`,
    });
    expect(r.complexity).toBe("complex");
    expect(r.requiresManualReview).toBe(true);
    expect(r.riskReasons).toEqual(
      expect.arrayContaining(["uses CALCULATE", "uses SELECTEDVALUE", "uses REMOVEFILTERS"]),
    );
  });

  it("classifica inteligência de tempo como critical", () => {
    const r = classify({ dax: "TOTALYTD(SUM(Vendas[Valor]), dCalendario[Data])" });
    expect(r.complexity).toBe("critical");
    expect(r.requiresManualReview).toBe(true);
  });

  it("classifica USERELATIONSHIP como critical", () => {
    const r = classify({
      dax: "CALCULATE(SUM(Vendas[Valor]), USERELATIONSHIP(Vendas[DataEnvio], dCalendario[Data]))",
    });
    expect(r.complexity).toBe("critical");
  });

  it("trata múltiplos CALCULATE como critical", () => {
    const r = classify({
      dax: "CALCULATE(CALCULATE(SUM(Vendas[Valor]), ALL(Vendas)), Vendas[Tipo] = 1)",
    });
    expect(r.complexity).toBe("critical");
    expect(r.riskReasons.join(" ")).toMatch(/multiple CALCULATE/);
  });

  it("usa usedFunctions quando disponível", () => {
    const r = classify({ dax: "", usedFunctions: ["KEEPFILTERS", "SUMX"] });
    expect(r.complexity).toBe("complex");
  });
});
