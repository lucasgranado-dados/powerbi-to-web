/**
 * CONTRACT — formas de dados que a UI do dashboard consome.
 *
 * Este é o "contrato" entre a camada de dados (Snowflake/mock) e os componentes.
 * Os componentes só conhecem estes tipos; nunca a linha bruta do Snowflake.
 * Os adapters (adapters.ts) convertem linhas cruas -> estes tipos.
 *
 * Ao migrar um dashboard real, ajuste estes tipos para refletir os KPIs,
 * séries e tabelas do Power BI original.
 */

/** Um KPI já formatado e pronto para o KpiCard. */
export interface DashboardKpi {
  id: string;
  label: string;
  /** Valor numérico bruto (para validação de paridade). */
  rawValue: number;
  /** Valor já formatado para exibição. */
  value: string;
  hint?: string;
  /** Variação relativa vs período anterior (0.12 = +12%). */
  deltaRatio?: number;
  deltaLabel?: string;
}

/** Ponto da série temporal do gráfico. */
export interface ChartPoint {
  /** Rótulo do eixo X (ex.: hora "08:00"). */
  label: string;
  /** Valor da série principal. */
  value: number;
}

/** Linha da tabela de detalhe. */
export interface DetailRow {
  category: string;
  orders: number;
  revenue: number;
  /** Ticket médio (revenue / orders), já calculado pelo adapter. */
  averageTicket: number;
}

/** Pacote completo de dados do dashboard, consumido pela página. */
export interface DashboardData {
  kpis: DashboardKpi[];
  series: ChartPoint[];
  table: DetailRow[];
  /** Origem efetiva dos dados nesta renderização. */
  source: "snowflake" | "mock";
  /** Mensagem de aviso (ex.: fallback para mock). */
  notice?: string;
}

/** Filtros aplicáveis ao dashboard (espelham os slicers do Power BI). */
export interface DashboardFiltersState {
  /** Data de referência (YYYY-MM-DD). */
  date?: string;
  region?: string;
}
