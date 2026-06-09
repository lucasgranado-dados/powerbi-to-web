/**
 * Formatadores reutilizáveis (locale pt-BR por padrão).
 *
 * Estes helpers padronizam a apresentação de KPIs e tabelas para que os
 * dashboards migrados fiquem visualmente consistentes com o Power BI original.
 * NÃO contêm regra de negócio — apenas formatação de apresentação.
 */

const DEFAULT_LOCALE = "pt-BR";

export function formatNumber(
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {},
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number | null | undefined,
  currency = "BRL",
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata um número decimal como percentual.
 * @param value 0.1234 => "12,34%"
 */
export function formatPercent(
  value: number | null | undefined,
  fractionDigits = 1,
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatDate(
  value: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: "short" },
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Abrevia números grandes (1.2K, 3.4M, 5.6B) — útil em eixos de gráficos.
 */
export function formatCompact(
  value: number | null | undefined,
  locale: string = DEFAULT_LOCALE,
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
