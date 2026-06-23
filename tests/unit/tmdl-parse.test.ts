import { describe, expect, it } from "vitest";

import { detectDependencies, detectFunctions, parseMeasures } from "../../scripts/lib/tmdl.mjs";

// TMDL com indentação por TAB (\t), como o Power BI exporta.
const TMDL = [
  "table 'Clientes consultoria total_v2'",
  "\tmeasure 'Receita' = SUM('Clientes consultoria total_v2'[VALOR])",
  "\t\tformatString: \\#,0",
  "",
  "\tmeasure 'Closer' =",
  "\t\t\tVAR Closer =",
  "\t\t\t\tCALCULATE(",
  "\t\t\t\t\tSELECTEDVALUE('Clientes consultoria total_v2'[CLOSER_FUNIL]),",
  "\t\t\t\t\tREMOVEFILTERS(dCalendario)",
  "\t\t\t\t)",
  "\t\t\tRETURN",
  "\t\t\t\tCloser",
  "\t\tformatString: 0",
  "",
  "\tcolumn VALOR",
  "\t\tdataType: double",
].join("\n");

describe("parseMeasures (DAX Review Layer)", () => {
  const measures = parseMeasures(TMDL, "tabela.tmdl");

  it("extrai todas as medidas com a tabela correta", () => {
    expect(measures.map((m: { name: string }) => m.name)).toEqual([
      "Receita",
      "Closer",
    ]);
    expect(measures[0].table).toBe("Clientes consultoria total_v2");
    expect(measures[0].sourceFile).toBe("tabela.tmdl");
  });

  it("captura expressão inline sem as propriedades", () => {
    expect(measures[0].dax).toBe("SUM('Clientes consultoria total_v2'[VALOR])");
  });

  it("captura a expressão DAX multilinha completa (VAR/RETURN)", () => {
    const closer = measures[1].dax;
    expect(closer).toMatch(/^VAR Closer =/);
    expect(closer).toContain("CALCULATE(");
    expect(closer).toContain("SELECTEDVALUE('Clientes consultoria total_v2'[CLOSER_FUNIL])");
    expect(closer).toContain("REMOVEFILTERS(dCalendario)");
    expect(closer.trimEnd()).toMatch(/Closer$/);
    // Não deve vazar a propriedade formatString para dentro do DAX.
    expect(closer).not.toContain("formatString");
  });

  it("não confunde `column` com `measure`", () => {
    expect(measures.find((m: { name: string }) => m.name === "VALOR")).toBeUndefined();
  });
});

describe("detectFunctions / detectDependencies", () => {
  it("detecta funções DAX em maiúsculas", () => {
    const fns = detectFunctions("CALCULATE(SELECTEDVALUE(T[c]), REMOVEFILTERS(d))");
    expect(fns).toEqual(
      expect.arrayContaining(["CALCULATE", "SELECTEDVALUE", "REMOVEFILTERS"]),
    );
  });

  it("resolve dependências de medidas conhecidas e tabelas", () => {
    const deps = detectDependencies("DIVIDE([Receita], [Pedidos]) + SUM(Vendas[Valor])", [
      "Receita",
      "Pedidos",
    ]);
    expect(deps.measures).toEqual(expect.arrayContaining(["Receita", "Pedidos"]));
    expect(deps.tables).toEqual(expect.arrayContaining(["Vendas"]));
  });
});
