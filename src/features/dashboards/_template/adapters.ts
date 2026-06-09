import type { ChartPoint, DashboardKpi, DetailRow } from "./contract";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";

/**
 * ADAPTERS — convertem linhas BRUTAS do Snowflake nos tipos do contract.
 *
 * Por que existem: o Snowflake retorna colunas em MAIÚSCULAS e tipos crus
 * (strings/números). Os componentes não devem lidar com isso. Os adapters
 * centralizam essa tradução e a formatação de apresentação.
 *
 * NÃO coloque regra de negócio nova aqui. Cálculos derivados (ex.: ticket
 * médio) só devem ser feitos quando refletirem fielmente a medida do Power BI;
 * caso contrário, documente como pendência em validation-notes.md.
 */

/** Linha crua esperada de kpis.sql. */
export interface RawKpiRow {
  METRIC_ID: string;
  LABEL: string;
  VALUE: number;
  PREV_VALUE: number | null;
  FORMAT: "currency" | "number" | "percent";
}

/** Linha crua esperada de chart-series.sql. */
export interface RawSeriesRow {
  BUCKET: string;
  VALUE: number;
}

/** Linha crua esperada de detail-table.sql. */
export interface RawDetailRow {
  CATEGORY: string;
  ORDERS: number;
  REVENUE: number;
}

function formatByType(
  value: number,
  format: RawKpiRow["FORMAT"],
): string {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "percent":
      return formatPercent(value);
    default:
      return formatNumber(value);
  }
}

export function adaptKpis(rows: RawKpiRow[]): DashboardKpi[] {
  return rows.map((r) => {
    const hasPrev = r.PREV_VALUE != null && r.PREV_VALUE !== 0;
    const deltaRatio = hasPrev ? (r.VALUE - r.PREV_VALUE!) / r.PREV_VALUE! : undefined;
    return {
      id: r.METRIC_ID,
      label: r.LABEL,
      rawValue: r.VALUE,
      value: formatByType(r.VALUE, r.FORMAT),
      hint: hasPrev ? "vs. período anterior" : undefined,
      deltaRatio,
      deltaLabel: deltaRatio != null ? formatPercent(deltaRatio) : undefined,
    };
  });
}

export function adaptSeries(rows: RawSeriesRow[]): ChartPoint[] {
  return rows.map((r) => ({ label: r.BUCKET, value: Number(r.VALUE) }));
}

export function adaptTable(rows: RawDetailRow[]): DetailRow[] {
  return rows.map((r) => {
    const orders = Number(r.ORDERS);
    const revenue = Number(r.REVENUE);
    return {
      category: r.CATEGORY,
      orders,
      revenue,
      // Derivado de apresentação: confirmar se equivale à medida "Ticket Médio" do Power BI.
      averageTicket: orders > 0 ? revenue / orders : 0,
    };
  });
}
