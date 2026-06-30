/**
 * METRICS — rastreabilidade PBI ↔ Snowflake ↔ componente.
 * NÃO marque como "validated" sem confirmação do responsável de negócio.
 */

export type MetricStatus = "pending_mapping" | "pending_validation" | "validated";

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

export const aquisicaoMetrics: MetricTraceability[] = [
  {
    id: "arr_ajustado_api",
    label: "ARR Ajustado (API)",
    powerbiMeasure: ".ARR Ajustado via API",
    daxReference: "CASE: status∈zerados→0 | TOMBOU='SIM' e PLxTX<6k→6000 | ELSE PLxTX (coluna _API)",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(CASE WHEN status_zerado THEN 0 WHEN TOMBOU='SIM' AND PLxTX<6000 THEN 6000 ELSE PLxTX END)",
    usedInComponent: "KpiCard arr_ajustado_api / tabela SDR",
    status: "pending_validation",
    notes: "Lógica de piso R$6k e zeragem por status replicada em SQL. Validar linha a linha contra Power BI.",
  },
  {
    id: "mrr_api",
    label: "MRR (API)",
    powerbiMeasure: "MRR Api",
    daxReference: "[.ARR Ajustado via API] / 12",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(arr_ajustado_api) / 12",
    usedInComponent: "KpiCard mrr_api / tabela SDR",
    status: "pending_validation",
  },
  {
    id: "pl_consolidado",
    label: "PL Consolidado",
    powerbiMeasure: "PL Consolidado",
    daxReference: "SUM('Clientes consultoria total_v2'[CADASTRO_PL_TOTAL_IMPLANTADO])",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(CADASTRO_PL_TOTAL_IMPLANTADO)",
    usedInComponent: "KpiCard pl_consolidado / tabela detalhe / tabela SDR",
    status: "pending_validation",
  },
  {
    id: "pl_ws",
    label: "PL WS",
    powerbiMeasure: "PL WS",
    daxReference: "SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)",
    usedInComponent: "tabela detalhe / tabela SDR",
    status: "pending_validation",
  },
  {
    id: "pl_taxa_base",
    label: "PL Taxa Base",
    powerbiMeasure: "PL Taxa Base",
    daxReference: "[PL Consolidado] - [PL WS]",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)",
    usedInComponent: "tabela detalhe / tabela SDR",
    status: "pending_validation",
  },
  {
    id: "pl_hubspot",
    label: "PL Hubspot",
    powerbiMeasure: "PL Hubspot",
    daxReference: "SUM(PATRIMONIO_VALIDADO_FUNIL)",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(PATRIMONIO_VALIDADO_FUNIL)",
    usedInComponent: "tabela detalhe / tabela SDR",
    status: "pending_validation",
  },
  {
    id: "delta_pl",
    label: "Delta PL",
    powerbiMeasure: "Delta PL",
    daxReference: "[PL Consolidado] - [PL Hubspot]",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(PATRIMONIO_VALIDADO_FUNIL)",
    usedInComponent: "KpiCard delta_pl / tabela detalhe",
    status: "pending_validation",
  },
  {
    id: "qtd_implantacoes",
    label: "Qtd. Implantações",
    powerbiMeasure: "Qtd implantações / Carteiras consolidadas",
    daxReference: "COUNTROWS(TOMBOU='SIM')",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "COUNT_IF(TOMBOU = 'SIM')",
    usedInComponent: "KpiCard qtd_implantacoes / tabela SDR",
    status: "pending_validation",
  },
  {
    id: "taxa_efetiva_closer",
    label: "Taxa Efetiva Closer",
    powerbiMeasure: "Taxa efetiva closer",
    daxReference: "DIVIDE([.ARR Ajustado], [PL Consolidado])",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(arr_ajustado_api) / NULLIF(SUM(CADASTRO_PL_TOTAL_IMPLANTADO), 0)",
    usedInComponent: "KpiCard taxa_efetiva_closer / tabela SDR",
    status: "pending_validation",
    notes: "DAX usa .ARR Ajustado (sem API). SQL usa arr_ajustado_api. Confirmar qual coluna é usada no numerador.",
  },
  {
    id: "total_arr_card",
    label: "ARR Card",
    powerbiMeasure: "Total ARR card ajustado",
    daxReference: "SUMX(VALUES(CADASTRO_COD_GORILA), IF(PLxTX<6000, 6000, PLxTX))",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "SUM(GREATEST(SUM(PLxTX), 6000)) GROUP BY CADASTRO_COD_GORILA",
    usedInComponent: "KpiCard total_arr_card / tabela SDR",
    status: "pending_validation",
    notes: "Sem filtro de status e sem filtro de TOMBOU. Confirmar com negócio se é intencional.",
  },
  {
    id: "sla_dias",
    label: "SLA (dias)",
    powerbiMeasure: "SLA Aquisicao",
    daxReference: "DATEDIFF(MAX(ASSINATURA_TERMO), MAX(DATA_IMPLANTACAO), DAY)",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "DATEDIFF('day', MAX(CADASTRO_DATA_ASSINATURA_TERMO), MAX(CADASTRO_DATA_IMPLANTACAO))",
    usedInComponent: "KpiCard sla_dias / tabela detalhe",
    status: "pending_validation",
    notes: "Card usa MAX das datas. Tabela detalhe usa diferença por linha individual.",
  },
  {
    id: "variavel_consultor",
    label: "Variável Consultor",
    powerbiMeasure: "Variavel consultor aquisicao",
    daxReference: "([MRR Api] × 2 − [Variavel closer]) × (1−0,18)",
    snowflakeSource: "SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA",
    snowflakeExpression: "((MRR_API × 2) - (MRR_API × TAXA_EFETIVA_CLOSER)) × 0.82",
    usedInComponent: "tabela SDR",
    status: "pending_validation",
    notes: "Cálculo em cadeia: depende de MRR Api e Taxa efetiva closer. Confirmar com negócio.",
  },
];
