/**
 * METRICS — rastreabilidade das métricas entre Power BI, Snowflake e a web.
 *
 * Dashboard btg-pl-total: sem medidas DAX explícitas.
 * As únicas agregações são SUM inline na tabela do Power BI.
 */

export type MetricStatus =
  | "pending_mapping"
  | "pending_validation"
  | "validated";

export interface MetricTraceability {
  id: string;
  label: string;
  powerbiMeasure: string;
  daxReference: string;
  snowflakeSource: string;
  snowflakeExpression: string;
  usedInComponent: string;
  status: MetricStatus;
  notes?: string;
}

export const btgPlMetrics: MetricTraceability[] = [
  {
    id: "valor_liquido",
    label: "Valor Líquido",
    powerbiMeasure: "(inline) Sum(VW_BTG_PL_TOTAL.VALOR_LIQUIDO)",
    daxReference: "SUM(VW_BTG_PL_TOTAL[VALOR_LIQUIDO]) — agregação inline na tableEx",
    snowflakeSource: "REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL",
    snowflakeExpression: "SUM(VALOR_LIQUIDO) GROUP BY CODIGO_CLIENTE, ADMINISTRADORA, POSICAO_DATA, GENERATED_AT",
    usedInComponent: "BtgPlTable (coluna VALOR_LIQUIDO)",
    status: "pending_validation",
    notes: "Confirmar granularidade do GROUP BY com responsável de negócio (risco R1 — schema WEALTH_LEGADO).",
  },
  {
    id: "valor_bruto",
    label: "Valor Bruto",
    powerbiMeasure: "(inline) Sum(VW_BTG_PL_TOTAL.VALOR_BRUTO)",
    daxReference: "SUM(VW_BTG_PL_TOTAL[VALOR_BRUTO]) — agregação inline na tableEx",
    snowflakeSource: "REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL",
    snowflakeExpression: "SUM(VALOR_BRUTO) GROUP BY CODIGO_CLIENTE, ADMINISTRADORA, POSICAO_DATA, GENERATED_AT",
    usedInComponent: "BtgPlTable (coluna VALOR_BRUTO)",
    status: "pending_validation",
    notes: "Mesma granularidade de VALOR_LIQUIDO. Confirmar junto.",
  },
];
