/**
 * SOURCE-MAP (tipado) — versão TypeScript do mapeamento Power BI → Snowflake.
 *
 * O JSON canônico vive em snowflake/mappings/_template.source-map.json.
 * Aqui exportamos os TIPOS e uma cópia tipada para uso no app/validação.
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
  };
  mappings: SourceMapEntry[];
}

export const templateSourceMap: DashboardSourceMap = {
  dashboard: "_template",
  description:
    "Mapeamento entre elementos do Power BI e fontes Snowflake camada ouro.",
  powerbi: {
    pbipPath: "powerbi-input/_template/",
    semanticModelPath: "powerbi-input/_template/",
    reportPath: "powerbi-input/_template/",
  },
  goldLayer: {
    database: "CHANGE_ME",
    schema: "GOLD",
    tablesOrViews: [],
  },
  mappings: [
    {
      powerbiMeasure: "CHANGE_ME",
      daxReference: "CHANGE_ME",
      powerbiVisual: "CHANGE_ME",
      snowflakeTableOrView: "CHANGE_ME",
      snowflakeExpression: "CHANGE_ME",
      queryFile: "snowflake/queries/dashboards/_template/kpis.sql",
      usedInComponent: "CHANGE_ME",
      status: "pending_validation",
      notes: "Confirmar regra com responsável de negócio.",
    },
  ],
};
