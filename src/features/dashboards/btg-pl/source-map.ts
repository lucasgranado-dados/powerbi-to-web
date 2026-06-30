/**
 * SOURCE-MAP (tipado) — versão TypeScript do mapeamento Power BI → Snowflake.
 * JSON canônico: snowflake/mappings/btg-pl-total.source-map.json.
 * Mantenha os dois em sincronia.
 */

export type MappingStatus =
  | "pending_mapping"
  | "pending_validation"
  | "validated";

export interface SourceMapEntry {
  powerbiMeasure: string;
  daxReference: string;
  powerbiVisual: string;
  snowflakeTableOrView: string;
  snowflakeExpression: string;
  queryFile: string;
  usedInComponent: string;
  status: MappingStatus;
  notes: string;
}

export interface DashboardSourceMap {
  dashboard: string;
  description: string;
  powerbi: {
    pbipPath: string;
    semanticModelPath: string;
    reportPath: string;
  };
  goldLayer: {
    database: string;
    schema: string;
    tablesOrViews: string[];
    notes?: string;
  };
  mappings: SourceMapEntry[];
}

export const btgPlSourceMap: DashboardSourceMap = {
  dashboard: "btg-pl-total",
  description: "PL Total BTG — tabela de posição por cliente/administradora/data.",
  powerbi: {
    pbipPath: "powerbi-input/btg-pl-total/btg_pl_total.pbip",
    semanticModelPath: "powerbi-input/btg-pl-total/btg_pl_total.SemanticModel/definition/",
    reportPath: "powerbi-input/btg-pl-total/btg_pl_total.Report/definition/",
  },
  goldLayer: {
    database: "REFINED_ADVISORY",
    schema: "WEALTH_LEGADO",
    tablesOrViews: ["VW_BTG_PL_TOTAL"],
    notes: "Schema WEALTH_LEGADO — confirmar se existe equivalente na camada ouro canônica (risco R1).",
  },
  mappings: [
    {
      powerbiMeasure: "(inline) Sum(VW_BTG_PL_TOTAL.VALOR_LIQUIDO)",
      daxReference: "SUM(VW_BTG_PL_TOTAL[VALOR_LIQUIDO])",
      powerbiVisual: "tableEx fadedf872ded08e1e346",
      snowflakeTableOrView: "REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL",
      snowflakeExpression: "SUM(VALOR_LIQUIDO)",
      queryFile: "snowflake/queries/dashboards/btg-pl-total/detail-table.sql",
      usedInComponent: "BtgPlTable — coluna Valor Líquido",
      status: "pending_validation",
      notes: "Confirmar granularidade do GROUP BY com responsável de negócio.",
    },
    {
      powerbiMeasure: "(inline) Sum(VW_BTG_PL_TOTAL.VALOR_BRUTO)",
      daxReference: "SUM(VW_BTG_PL_TOTAL[VALOR_BRUTO])",
      powerbiVisual: "tableEx fadedf872ded08e1e346",
      snowflakeTableOrView: "REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL",
      snowflakeExpression: "SUM(VALOR_BRUTO)",
      queryFile: "snowflake/queries/dashboards/btg-pl-total/detail-table.sql",
      usedInComponent: "BtgPlTable — coluna Valor Bruto",
      status: "pending_validation",
      notes: "Mesma granularidade de VALOR_LIQUIDO. Validar junto.",
    },
  ],
};
