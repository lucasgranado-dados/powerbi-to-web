/**
 * METRICS — rastreabilidade das métricas entre Power BI, Snowflake e a web.
 *
 * Cada entrada documenta a "linha de visão" de uma métrica: como ela é definida
 * no Power BI (DAX), de onde vem no Snowflake (camada ouro) e onde aparece na
 * página. Isto torna a migração auditável e facilita a validação de paridade.
 *
 * `status` deve refletir a realidade. NÃO marque como "validated" sem
 * confirmação de um responsável de negócio.
 */

export type MetricStatus =
  | "pending_mapping" // ainda não mapeado para Snowflake
  | "pending_validation" // mapeado, aguardando validação de negócio
  | "validated"; // confirmado contra o Power BI

export interface MetricTraceability {
  /** Id estável (igual ao METRIC_ID retornado pela query, quando aplicável). */
  id: string;
  /** Nome amigável. */
  label: string;
  /** Nome da medida no Power BI. */
  powerbiMeasure: string;
  /** Definição/Referência DAX (resumida). */
  daxReference: string;
  /** Tabela/view da camada ouro (use CHANGE_ME até confirmar). */
  snowflakeSource: string;
  /** Expressão SQL equivalente (resumida). */
  snowflakeExpression: string;
  /** Componente/arquivo onde a métrica é exibida. */
  usedInComponent: string;
  status: MetricStatus;
  notes?: string;
}

export const templateMetrics: MetricTraceability[] = [
  {
    id: "revenue",
    label: "Receita",
    powerbiMeasure: "CHANGE_ME_Receita",
    daxReference: "SUM(Vendas[Valor])",
    snowflakeSource: "CHANGE_ME_GOLD_TABLE",
    snowflakeExpression: "SUM(REVENUE)",
    usedInComponent: "KpiCard (revenue)",
    status: "pending_validation",
    notes: "Confirmar se inclui impostos/descontos com o responsável de negócio.",
  },
  {
    id: "orders",
    label: "Pedidos",
    powerbiMeasure: "CHANGE_ME_Pedidos",
    daxReference: "DISTINCTCOUNT(Vendas[PedidoID])",
    snowflakeSource: "CHANGE_ME_GOLD_TABLE",
    snowflakeExpression: "COUNT(DISTINCT ORDER_ID)",
    usedInComponent: "KpiCard (orders)",
    status: "pending_validation",
  },
  {
    id: "avg_ticket",
    label: "Ticket médio",
    powerbiMeasure: "CHANGE_ME_TicketMedio",
    daxReference: "[Receita] / [Pedidos]",
    snowflakeSource: "CHANGE_ME_GOLD_TABLE",
    snowflakeExpression: "SUM(REVENUE) / NULLIF(COUNT(DISTINCT ORDER_ID),0)",
    usedInComponent: "KpiCard (avg_ticket)",
    status: "pending_validation",
    notes: "Validar tratamento de divisão por zero e granularidade.",
  },
  {
    id: "conversion",
    label: "Conversão",
    powerbiMeasure: "CHANGE_ME_Conversao",
    daxReference: "[Pedidos] / [Sessões]",
    snowflakeSource: "CHANGE_ME_GOLD_TABLE",
    snowflakeExpression: "COUNT(DISTINCT ORDER_ID) / NULLIF(COUNT(DISTINCT SESSION_ID),0)",
    usedInComponent: "KpiCard (conversion)",
    status: "pending_mapping",
    notes: "Origem de Sessões ainda não localizada na camada ouro.",
  },
];
