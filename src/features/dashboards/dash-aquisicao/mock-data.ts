import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import type {
  AquisicaoPageData,
  AquisicaoRvCloserPageData,
  AquisicaoRvSdrPageData,
  AquisicaoSdrPageData,
} from "./contract";

/**
 * MOCK DATA — fallback de desenvolvimento enquanto o Snowflake não está configurado.
 * Valores plausíveis mas INVENTADOS. Não usar para validação de paridade.
 */

const NOTICE =
  "Exibindo dados MOCK (Snowflake não configurado). Configure as variáveis SNOWFLAKE_* para usar dados reais.";

const meses = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05"];

export const mockAquisicaoData: AquisicaoPageData = {
  source: "mock",
  notice: NOTICE,
  kpis: [
    { id: "arr_ajustado_api", label: "ARR Ajustado (API)", rawValue: 2_400_000, value: formatCurrency(2_400_000) },
    { id: "mrr_api",          label: "MRR (API)",          rawValue: 200_000,   value: formatCurrency(200_000) },
    { id: "pl_consolidado",   label: "PL Consolidado",     rawValue: 45_000_000, value: formatCurrency(45_000_000) },
    { id: "qtd_implantacoes", label: "Qtd. Implantações",  rawValue: 38,         value: formatNumber(38) },
    { id: "taxa_efetiva_closer", label: "Taxa Efetiva Closer", rawValue: 0.0533, value: formatPercent(0.0533) },
    { id: "sla_dias",         label: "SLA (dias)",         rawValue: 14,         value: formatNumber(14) },
    { id: "delta_pl",         label: "Delta PL",           rawValue: -800_000,   value: formatCurrency(-800_000) },
    { id: "total_arr_card",   label: "ARR Card",           rawValue: 2_600_000,  value: formatCurrency(2_600_000) },
  ],
  detalhes: [
    {
      cliente: "João Silva",
      email: "joao@email.com",
      etapaDoNegocio: "ATIVO",
      plHubspot: 500_000,
      plConsolidado: 480_000,
      plTaxaBase: 350_000,
      plWs: 130_000,
      deltaPl: -20_000,
      taxa: 0.05,
      dataImplantacao: "2026-02-10",
      slaDias: 12,
      sdr: "Ana SDR",
      closer: "Carlos Closer",
      consultor: "Maria Consultora",
      tombou: "SIM",
    },
    {
      cliente: "Empresa ABC",
      email: "abc@empresa.com",
      etapaDoNegocio: "ATIVO",
      plHubspot: 1_200_000,
      plConsolidado: 1_150_000,
      plTaxaBase: 900_000,
      plWs: 250_000,
      deltaPl: -50_000,
      taxa: 0.06,
      dataImplantacao: "2026-03-15",
      slaDias: 18,
      sdr: "Pedro SDR",
      closer: "Carlos Closer",
      consultor: "João Consultor",
      tombou: "SIM",
    },
  ],
  serie: meses.map((m, i) => ({
    mesAno: m,
    qtdImplantacoes: 5 + i * 2,
    arrApiMes: 350_000 + i * 80_000,
  })),
};

export const mockAquisicaoRvCloserData: AquisicaoRvCloserPageData = {
  source: "mock",
  notice: NOTICE,
  rows: [
    {
      mesAno: "2026-06",
      closer: "Carlos Closer",
      plConsolidado: 18_000_000,
      plTaxaBase: 12_000_000,
      plWs: 6_000_000,
      arrBaseMensal: 450_000,
      arrCustodiaMensal: 180_000,
      arrTotalMensal: 630_000,
      faixa: 4,
      mediaMov3m: 610_000,
      rvCloser: 21_600,
    },
    {
      mesAno: "2026-06",
      closer: "Ana Closer",
      plConsolidado: 9_000_000,
      plTaxaBase: 6_000_000,
      plWs: 3_000_000,
      arrBaseMensal: 180_000,
      arrCustodiaMensal: 90_000,
      arrTotalMensal: 270_000,
      faixa: 3,
      mediaMov3m: 255_000,
      rvCloser: 7_875,
    },
  ],
};

export const mockAquisicaoRvSdrData: AquisicaoRvSdrPageData = {
  source: "mock",
  notice: NOTICE,
  rows: [
    {
      mesAno: "2026-06",
      sdr: "Pedro SDR",
      plConsolidado: 14_200_000,
      plTaxaBase: 10_500_000,
      plWs: 3_700_000,
      arrTotalMensal: 460_000,
      faixa: 4,
      mediaMov3m: 440_000,
      rvSdr: 3_680,
    },
    {
      mesAno: "2026-06",
      sdr: "Ana SDR",
      plConsolidado: 11_500_000,
      plTaxaBase: 8_500_000,
      plWs: 3_000_000,
      arrTotalMensal: 310_000,
      faixa: 3,
      mediaMov3m: 290_000,
      rvSdr: 2_170,
    },
  ],
};

export const mockAquisicaoSdrData: AquisicaoSdrPageData = {
  source: "mock",
  notice: NOTICE,
  kpis: mockAquisicaoData.kpis,
  detalhes: [
    {
      sdr: "Ana SDR",
      carteirasConsolidadas: 18,
      plHubspot: 12_000_000,
      plConsolidado: 11_500_000,
      plTaxaBase: 8_500_000,
      plWs: 3_000_000,
      diferencaPercent: -0.042,
      arrCard: 1_100_000,
      mrr: 83_000,
      taxaEfetivaCloser: 0.052,
      arrApi: 1_000_000,
      mrrApi: 83_333,
      variavelConsultor: 120_000,
    },
    {
      sdr: "Pedro SDR",
      carteirasConsolidadas: 20,
      plHubspot: 15_000_000,
      plConsolidado: 14_200_000,
      plTaxaBase: 10_500_000,
      plWs: 3_700_000,
      diferencaPercent: -0.053,
      arrCard: 1_350_000,
      mrr: 100_000,
      taxaEfetivaCloser: 0.055,
      arrApi: 1_200_000,
      mrrApi: 100_000,
      variavelConsultor: 145_000,
    },
  ],
  serie: mockAquisicaoData.serie,
};
