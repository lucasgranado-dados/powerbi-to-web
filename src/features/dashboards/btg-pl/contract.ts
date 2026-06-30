/**
 * CONTRACT — tipos de dados que a UI do dashboard btg-pl-total consome.
 *
 * Dashboard original: 1 página, 1 tabela (tableEx) + 4 slicers dropdown.
 * Sem KPI cards nem gráfico de série.
 */

/** Linha da tabela principal (equivale ao visual tableEx do Power BI). */
export interface BtgPlRow {
  codigoCliente: string;
  administradora: string;
  /** Data de posição no formato YYYY-MM-DD. */
  posicaoData: string;
  /** SUM(VALOR_LIQUIDO) agrupado por cliente + administradora + data + geração. */
  valorLiquido: number;
  /** SUM(VALOR_BRUTO) agrupado pelo mesmo critério. */
  valorBruto: number;
  /** Timestamp de geração da view — formato "YYYY-MM-DD HH:MI:SS" (datetime, não date). */
  generatedAt: string;
}

/** Valores disponíveis para os 4 slicers dropdown (carregados separadamente). */
export interface BtgPlFilterOptions {
  codigosCliente: string[];
  administradoras: string[];
  /** Datas disponíveis no formato YYYY-MM-DD, ordenadas ascendente. */
  datasDisponiveis: string[];
  /** Valores de GENERATED_AT disponíveis, ordenados descendente. */
  generatedAts: string[];
}

/** Filtros ativos — espelham exatamente os 4 slicers do Power BI. */
export interface BtgPlFilters {
  codigoCliente?: string;
  administradora?: string;
  /** YYYY-MM-DD. */
  posicaoData?: string;
  generatedAt?: string;
}

/** Pacote completo enviado pela Server Action / Route Handler para a UI. */
export interface BtgPlDashboardData {
  rows: BtgPlRow[];
  filterOptions: BtgPlFilterOptions;
  source: "snowflake" | "mock";
  notice?: string;
}
