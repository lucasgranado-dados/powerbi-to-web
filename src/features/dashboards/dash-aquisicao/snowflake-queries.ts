import "server-only";

import { executeSnowflakeQuery, isSafeQueryError } from "@/server/snowflake/execute-query";
import type {
  AquisicaoFilters,
  AquisicaoPageData,
  AquisicaoRvCloserPageData,
  AquisicaoRvSdrPageData,
  AquisicaoSdrPageData,
} from "./contract";
import {
  adaptChartSeries,
  adaptDetalhes,
  adaptKpis,
  adaptRvCloserRows,
  adaptRvSdrRows,
  adaptSdrRows,
  type RawChartRow,
  type RawDetalheRow,
  type RawKpisRow,
  type RawRvCloserRow,
  type RawRvSdrRow,
  type RawSdrRow,
} from "./adapters";
import {
  CHART_SERIES_SQL,
  DETAIL_TABLE_SDR_SQL,
  DETAIL_TABLE_SQL,
  KPIS_SQL,
  RV_CLOSER_SQL,
  RV_SDR_SQL,
} from "./queries";
import {
  mockAquisicaoData,
  mockAquisicaoRvCloserData,
  mockAquisicaoRvSdrData,
  mockAquisicaoSdrData,
} from "./mock-data";

function periodBinds(f: AquisicaoFilters) {
  const inicio = f.periodoInicio ?? null;
  const fim = f.periodoFim ?? null;
  return [inicio, fim] as const;
}

export async function getAquisicaoData(
  filters: AquisicaoFilters = {},
): Promise<AquisicaoPageData> {
  const [inicio, fim] = periodBinds(filters);

  try {
    const [kpiRows, detalheRows, serieRows] = await Promise.all([
      executeSnowflakeQuery<RawKpisRow>(KPIS_SQL, [inicio, fim, inicio, fim]),
      executeSnowflakeQuery<RawDetalheRow>(DETAIL_TABLE_SQL, [inicio, fim]),
      executeSnowflakeQuery<RawChartRow>(CHART_SERIES_SQL, [inicio, fim]),
    ]);

    return {
      source: "snowflake",
      kpis: adaptKpis(kpiRows[0]),
      detalhes: adaptDetalhes(detalheRows),
      serie: adaptChartSeries(serieRows),
    };
  } catch (err) {
    const safe = isSafeQueryError(err) ? err : null;
    const reason = safe?.isConfigError
      ? "Snowflake não configurado"
      : "Falha ao consultar o Snowflake";
    return {
      ...mockAquisicaoData,
      notice: `${reason}. Exibindo dados MOCK.`,
    };
  }
}

export async function getAquisicaoSdrData(
  filters: AquisicaoFilters = {},
): Promise<AquisicaoSdrPageData> {
  const [inicio, fim] = periodBinds(filters);

  try {
    const [kpiRows, sdrRows, serieRows] = await Promise.all([
      executeSnowflakeQuery<RawKpisRow>(KPIS_SQL, [inicio, fim, inicio, fim]),
      executeSnowflakeQuery<RawSdrRow>(DETAIL_TABLE_SDR_SQL, [inicio, fim]),
      executeSnowflakeQuery<RawChartRow>(CHART_SERIES_SQL, [inicio, fim]),
    ]);

    return {
      source: "snowflake",
      kpis: adaptKpis(kpiRows[0]),
      detalhes: adaptSdrRows(sdrRows),
      serie: adaptChartSeries(serieRows),
    };
  } catch (err) {
    const safe = isSafeQueryError(err) ? err : null;
    const reason = safe?.isConfigError
      ? "Snowflake não configurado"
      : "Falha ao consultar o Snowflake";
    return {
      ...mockAquisicaoSdrData,
      notice: `${reason}. Exibindo dados MOCK.`,
    };
  }
}

export { getAquisicaoData as getAquisicaoVisaoGeralData };

export async function getAquisicaoRvCloserData(
  filters: AquisicaoFilters = {},
): Promise<AquisicaoRvCloserPageData> {
  const inicio = filters.periodoInicio ?? null;
  const fim = filters.periodoFim ?? null;

  try {
    const rows = await executeSnowflakeQuery<RawRvCloserRow>(RV_CLOSER_SQL, [inicio, fim]);
    return { source: "snowflake", rows: adaptRvCloserRows(rows) };
  } catch (err) {
    const safe = isSafeQueryError(err) ? err : null;
    const reason = safe?.isConfigError
      ? "Snowflake não configurado"
      : "Falha ao consultar o Snowflake";
    return {
      ...mockAquisicaoRvCloserData,
      notice: `${reason}. Exibindo dados MOCK.`,
    };
  }
}

export async function getAquisicaoRvSdrData(
  filters: AquisicaoFilters = {},
): Promise<AquisicaoRvSdrPageData> {
  const inicio = filters.periodoInicio ?? null;
  const fim = filters.periodoFim ?? null;

  try {
    const rows = await executeSnowflakeQuery<RawRvSdrRow>(RV_SDR_SQL, [inicio, fim]);
    return { source: "snowflake", rows: adaptRvSdrRows(rows) };
  } catch (err) {
    const safe = isSafeQueryError(err) ? err : null;
    const reason = safe?.isConfigError
      ? "Snowflake não configurado"
      : "Falha ao consultar o Snowflake";
    return {
      ...mockAquisicaoRvSdrData,
      notice: `${reason}. Exibindo dados MOCK.`,
    };
  }
}
