import { formatCompact } from "@/lib/formatters";

/**
 * Utilitários de apresentação para gráficos (Recharts por padrão).
 *
 * Mantém uma paleta e helpers consistentes entre dashboards. Não contém
 * regra de negócio.
 */

/** Paleta padrão alinhada aos tokens de tema (CSS variables --chart-*). */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/** Formatter de tick de eixo numérico (abrevia valores grandes). */
export function axisTickFormatter(value: number): string {
  return formatCompact(value);
}

/**
 * Calcula um domínio "arredondado" para eixos Y, com um respiro acima do máximo.
 */
export function niceYDomain(
  values: number[],
  paddingRatio = 0.1,
): [number, number] {
  if (values.length === 0) return [0, 1];
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const padded = max + Math.abs(max) * paddingRatio;
  return [min < 0 ? min - Math.abs(min) * paddingRatio : 0, padded || 1];
}
