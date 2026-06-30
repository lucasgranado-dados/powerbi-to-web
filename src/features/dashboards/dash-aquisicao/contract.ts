/**
 * CONTRACT — tipos de dados consumidos pelos componentes das páginas
 * Aquisição, Aquisição SDR e Aquisição visão geral.
 *
 * Os componentes só conhecem estes tipos; nunca a linha bruta do Snowflake.
 * Os adapters (adapters.ts) convertem linhas cruas → estes tipos.
 */

// ---------------------------------------------------------------------------
// KPIs (compartilhado entre as três páginas)
// ---------------------------------------------------------------------------

export interface AquisicaoKpi {
  id: string;
  label: string;
  rawValue: number;
  value: string;
  hint?: string;
  deltaRatio?: number;
  deltaLabel?: string;
}

// ---------------------------------------------------------------------------
// Linha da tabela de detalhe — página Aquisição (por cliente/closer)
// ---------------------------------------------------------------------------

export interface AquisicaoDetalheRow {
  cliente: string;
  email: string;
  etapaDoNegocio: string;
  plHubspot: number;
  plConsolidado: number;
  plTaxaBase: number;
  plWs: number;
  deltaPl: number;
  taxa: number;
  dataImplantacao: string;
  slaDias: number | null;
  sdr: string;
  closer: string;
  consultor: string;
  tombou: string;
}

// ---------------------------------------------------------------------------
// Linha da tabela de detalhe — página Aquisição SDR (por SDR)
// ---------------------------------------------------------------------------

export interface AquisicaoSdrRow {
  sdr: string;
  carteirasConsolidadas: number;
  plHubspot: number;
  plConsolidado: number;
  plTaxaBase: number;
  plWs: number;
  diferencaPercent: number;
  arrCard: number;
  mrr: number;
  taxaEfetivaCloser: number;
  arrApi: number;
  mrrApi: number;
  variavelConsultor: number;
}

// ---------------------------------------------------------------------------
// Ponto do gráfico de série temporal
// ---------------------------------------------------------------------------

export interface AquisicaoChartPoint {
  mesAno: string;
  qtdImplantacoes: number;
  arrApiMes: number;
}

// ---------------------------------------------------------------------------
// Filtros (espelham os slicers do Power BI)
// ---------------------------------------------------------------------------

export interface AquisicaoFilters {
  periodoInicio?: string;
  periodoFim?: string;
  closer?: string;
  sdr?: string;
  consultor?: string;
}

// ---------------------------------------------------------------------------
// Pacotes de dados por página
// ---------------------------------------------------------------------------

export interface AquisicaoPageData {
  kpis: AquisicaoKpi[];
  detalhes: AquisicaoDetalheRow[];
  serie: AquisicaoChartPoint[];
  source: "snowflake" | "mock";
  notice?: string;
}

export interface AquisicaoSdrPageData {
  kpis: AquisicaoKpi[];
  detalhes: AquisicaoSdrRow[];
  serie: AquisicaoChartPoint[];
  source: "snowflake" | "mock";
  notice?: string;
}

export type AquisicaoVisaoGeralPageData = AquisicaoPageData;

// ---------------------------------------------------------------------------
// RV — Remuneração Variável (Closer e SDR)
// ---------------------------------------------------------------------------

export interface AquisicaoRvCloserRow {
  mesAno: string;
  closer: string;
  plConsolidado: number;
  plTaxaBase: number;
  plWs: number;
  arrBaseMensal: number;
  arrCustodiaMensal: number;
  arrTotalMensal: number;
  faixa: number | null;
  mediaMov3m: number | null;
  rvCloser: number | null;
}

export interface AquisicaoRvSdrRow {
  mesAno: string;
  sdr: string;
  plConsolidado: number;
  plTaxaBase: number;
  plWs: number;
  arrTotalMensal: number;
  faixa: number | null;
  mediaMov3m: number | null;
  rvSdr: number | null;
}

export interface AquisicaoRvCloserPageData {
  rows: AquisicaoRvCloserRow[];
  source: "snowflake" | "mock";
  notice?: string;
}

export interface AquisicaoRvSdrPageData {
  rows: AquisicaoRvSdrRow[];
  source: "snowflake" | "mock";
  notice?: string;
}
