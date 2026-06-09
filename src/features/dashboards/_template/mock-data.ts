import type { DashboardData } from "./contract";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";

/**
 * MOCK DATA — usado APENAS como fallback de desenvolvimento.
 *
 * Regra do boilerplate: mocks só entram quando o Snowflake não está
 * configurado/acessível. Eles NÃO representam dados reais e NÃO devem ser
 * usados para validação de paridade.
 *
 * Os valores aqui são plausíveis mas inventados — sirva-se deles apenas para
 * desenvolver a UI antes de conectar a camada ouro.
 */

const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 08:00 .. 19:00

export const mockDashboardData: DashboardData = {
  source: "mock",
  notice:
    "Exibindo dados MOCK (Snowflake não configurado). Configure as variáveis SNOWFLAKE_* para usar dados reais.",
  kpis: [
    {
      id: "revenue",
      label: "Receita",
      rawValue: 184320,
      value: formatCurrency(184320),
      hint: "vs. ontem",
      deltaRatio: 0.082,
      deltaLabel: formatPercent(0.082),
    },
    {
      id: "orders",
      label: "Pedidos",
      rawValue: 1432,
      value: formatNumber(1432),
      hint: "vs. ontem",
      deltaRatio: 0.041,
      deltaLabel: formatPercent(0.041),
    },
    {
      id: "avg_ticket",
      label: "Ticket médio",
      rawValue: 128.71,
      value: formatCurrency(128.71),
      hint: "vs. ontem",
      deltaRatio: 0.039,
      deltaLabel: formatPercent(0.039),
    },
    {
      id: "conversion",
      label: "Conversão",
      rawValue: 0.236,
      value: formatPercent(0.236),
      hint: "vs. ontem",
      deltaRatio: -0.012,
      deltaLabel: formatPercent(-0.012),
    },
  ],
  series: hours.map((h) => ({
    label: `${String(h).padStart(2, "0")}:00`,
    value: Math.round(6000 + Math.sin((h - 8) / 2) * 4200 + (h - 8) * 320),
  })),
  table: [
    { category: "Eletrônicos", orders: 412, revenue: 78240, averageTicket: 189.9 },
    { category: "Vestuário", orders: 388, revenue: 42680, averageTicket: 110.0 },
    { category: "Casa & Cozinha", orders: 301, revenue: 33110, averageTicket: 110.0 },
    { category: "Esporte", orders: 201, revenue: 18090, averageTicket: 90.0 },
    { category: "Beleza", orders: 130, revenue: 12200, averageTicket: 93.85 },
  ],
};
