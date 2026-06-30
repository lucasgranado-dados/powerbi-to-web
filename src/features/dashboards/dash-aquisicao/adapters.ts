import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import type {
  AquisicaoChartPoint,
  AquisicaoDetalheRow,
  AquisicaoKpi,
  AquisicaoRvCloserRow,
  AquisicaoRvSdrRow,
  AquisicaoSdrRow,
} from "./contract";

// ---------------------------------------------------------------------------
// Linhas brutas (colunas em MAIÚSCULAS conforme retorno do Snowflake)
// ---------------------------------------------------------------------------

export interface RawKpisRow {
  ARR_AJUSTADO_API: number;
  MRR_API: number;
  PL_CONSOLIDADO: number;
  PL_WS: number;
  PL_TAXA_BASE: number;
  PL_HUBSPOT: number;
  DELTA_PL: number;
  DIFERENCA_PERC: number;
  QTD_IMPLANTACOES: number;
  PL_MEDIO: number;
  TAXA_EFETIVA_CLOSER: number;
  TOTAL_ARR_CARD: number;
  SLA_DIAS: number | null;
}

export interface RawDetalheRow {
  CLIENTE: string;
  EMAIL: string;
  ETAPA_DO_NEGOCIO: string;
  PL_HUBSPOT: number;
  PL_CONSOLIDADO: number;
  PL_TAXA_BASE: number;
  PL_WS: number;
  DELTA_PL: number;
  TAXA: number;
  DATA_IMPLANTACAO: string;
  SLA_DIAS: number | null;
  SDR: string;
  CLOSER: string;
  CONSULTOR: string;
  TOMBOU: string;
}

export interface RawSdrRow {
  SDR: string;
  CARTEIRAS_CONSOLIDADAS: number;
  PL_HUBSPOT: number;
  PL_CONSOLIDADO: number;
  PL_TAXA_BASE: number;
  PL_WS: number;
  DIFERENCA_PERC: number;
  ARR_CARD: number;
  MRR: number;
  TAXA_EFETIVA_CLOSER: number;
  ARR_API: number;
  MRR_API: number;
  VARIAVEL_CONSULTOR: number;
}

export interface RawChartRow {
  MES_ANO: string;
  QTD_IMPLANTACOES: number;
  ARR_API_MES: number;
}

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

export function adaptKpis(row: RawKpisRow): AquisicaoKpi[] {
  return [
    {
      id: "arr_ajustado_api",
      label: "ARR Ajustado (API)",
      rawValue: Number(row.ARR_AJUSTADO_API),
      value: formatCurrency(Number(row.ARR_AJUSTADO_API)),
    },
    {
      id: "mrr_api",
      label: "MRR (API)",
      rawValue: Number(row.MRR_API),
      value: formatCurrency(Number(row.MRR_API)),
    },
    {
      id: "pl_consolidado",
      label: "PL Consolidado",
      rawValue: Number(row.PL_CONSOLIDADO),
      value: formatCurrency(Number(row.PL_CONSOLIDADO)),
    },
    {
      id: "qtd_implantacoes",
      label: "Qtd. Implantações",
      rawValue: Number(row.QTD_IMPLANTACOES),
      value: formatNumber(Number(row.QTD_IMPLANTACOES)),
    },
    {
      id: "taxa_efetiva_closer",
      label: "Taxa Efetiva Closer",
      rawValue: Number(row.TAXA_EFETIVA_CLOSER),
      value: formatPercent(Number(row.TAXA_EFETIVA_CLOSER)),
    },
    {
      id: "sla_dias",
      label: "SLA (dias)",
      rawValue: row.SLA_DIAS ?? 0,
      value: row.SLA_DIAS != null ? formatNumber(row.SLA_DIAS) : "—",
    },
    {
      id: "delta_pl",
      label: "Delta PL",
      rawValue: Number(row.DELTA_PL),
      value: formatCurrency(Number(row.DELTA_PL)),
    },
    {
      id: "total_arr_card",
      label: "ARR Card",
      rawValue: Number(row.TOTAL_ARR_CARD),
      value: formatCurrency(Number(row.TOTAL_ARR_CARD)),
    },
  ];
}

export function adaptDetalhes(rows: RawDetalheRow[]): AquisicaoDetalheRow[] {
  return rows.map((r) => ({
    cliente: r.CLIENTE ?? "",
    email: r.EMAIL ?? "",
    etapaDoNegocio: r.ETAPA_DO_NEGOCIO ?? "",
    plHubspot: Number(r.PL_HUBSPOT),
    plConsolidado: Number(r.PL_CONSOLIDADO),
    plTaxaBase: Number(r.PL_TAXA_BASE),
    plWs: Number(r.PL_WS),
    deltaPl: Number(r.DELTA_PL),
    taxa: Number(r.TAXA),
    dataImplantacao: r.DATA_IMPLANTACAO ? String(r.DATA_IMPLANTACAO).slice(0, 10) : "",
    slaDias: r.SLA_DIAS != null ? Number(r.SLA_DIAS) : null,
    sdr: r.SDR ?? "",
    closer: r.CLOSER ?? "",
    consultor: r.CONSULTOR ?? "",
    tombou: r.TOMBOU ?? "",
  }));
}

export function adaptSdrRows(rows: RawSdrRow[]): AquisicaoSdrRow[] {
  return rows.map((r) => ({
    sdr: r.SDR ?? "",
    carteirasConsolidadas: Number(r.CARTEIRAS_CONSOLIDADAS),
    plHubspot: Number(r.PL_HUBSPOT),
    plConsolidado: Number(r.PL_CONSOLIDADO),
    plTaxaBase: Number(r.PL_TAXA_BASE),
    plWs: Number(r.PL_WS),
    diferencaPercent: Number(r.DIFERENCA_PERC),
    arrCard: Number(r.ARR_CARD),
    mrr: Number(r.MRR),
    taxaEfetivaCloser: Number(r.TAXA_EFETIVA_CLOSER),
    arrApi: Number(r.ARR_API),
    mrrApi: Number(r.MRR_API),
    variavelConsultor: Number(r.VARIAVEL_CONSULTOR),
  }));
}

export function adaptChartSeries(rows: RawChartRow[]): AquisicaoChartPoint[] {
  return rows.map((r) => ({
    mesAno: r.MES_ANO,
    qtdImplantacoes: Number(r.QTD_IMPLANTACOES),
    arrApiMes: Number(r.ARR_API_MES),
  }));
}

// ---------------------------------------------------------------------------
// RV — Remuneração Variável
// ---------------------------------------------------------------------------

export interface RawRvCloserRow {
  MES_ANO: string;
  CLOSER: string;
  PL_CONSOLIDADO: number;
  PL_TAXA_BASE: number;
  PL_WS: number;
  ARR_BASE_MENSAL: number;
  ARR_CUSTODIA_MENSAL: number;
  ARR_TOTAL_MENSAL: number;
  FAIXA: number | null;
  MEDIA_MOV_3M: number | null;
  RV_CLOSER: number | null;
}

export interface RawRvSdrRow {
  MES_ANO: string;
  SDR: string;
  PL_CONSOLIDADO: number;
  PL_TAXA_BASE: number;
  PL_WS: number;
  ARR_TOTAL_MENSAL: number;
  FAIXA: number | null;
  MEDIA_MOV_3M: number | null;
  RV_SDR: number | null;
}

export function adaptRvCloserRows(rows: RawRvCloserRow[]): AquisicaoRvCloserRow[] {
  return rows.map((r) => ({
    mesAno: r.MES_ANO ?? "",
    closer: r.CLOSER ?? "",
    plConsolidado: Number(r.PL_CONSOLIDADO),
    plTaxaBase: Number(r.PL_TAXA_BASE),
    plWs: Number(r.PL_WS),
    arrBaseMensal: Number(r.ARR_BASE_MENSAL),
    arrCustodiaMensal: Number(r.ARR_CUSTODIA_MENSAL),
    arrTotalMensal: Number(r.ARR_TOTAL_MENSAL),
    faixa: r.FAIXA != null ? Number(r.FAIXA) : null,
    mediaMov3m: r.MEDIA_MOV_3M != null ? Number(r.MEDIA_MOV_3M) : null,
    rvCloser: r.RV_CLOSER != null ? Number(r.RV_CLOSER) : null,
  }));
}

export function adaptRvSdrRows(rows: RawRvSdrRow[]): AquisicaoRvSdrRow[] {
  return rows.map((r) => ({
    mesAno: r.MES_ANO ?? "",
    sdr: r.SDR ?? "",
    plConsolidado: Number(r.PL_CONSOLIDADO),
    plTaxaBase: Number(r.PL_TAXA_BASE),
    plWs: Number(r.PL_WS),
    arrTotalMensal: Number(r.ARR_TOTAL_MENSAL),
    faixa: r.FAIXA != null ? Number(r.FAIXA) : null,
    mediaMov3m: r.MEDIA_MOV_3M != null ? Number(r.MEDIA_MOV_3M) : null,
    rvSdr: r.RV_SDR != null ? Number(r.RV_SDR) : null,
  }));
}
