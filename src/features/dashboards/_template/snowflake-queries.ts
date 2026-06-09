import "server-only";

import { executeSnowflakeQuery, isSafeQueryError } from "@/server/snowflake/execute-query";
import type { DashboardData, DashboardFiltersState } from "./contract";
import {
  adaptKpis,
  adaptSeries,
  adaptTable,
  type RawDetailRow,
  type RawKpiRow,
  type RawSeriesRow,
} from "./adapters";
import { CHART_SERIES_SQL, DETAIL_TABLE_SQL, KPIS_SQL } from "./queries";
import { mockDashboardData } from "./mock-data";

/**
 * SNOWFLAKE-QUERIES — funções server-side que buscam os dados reais.
 *
 * Estratégia: tenta o Snowflake e, em caso de erro de configuração/conexão,
 * cai no MOCK (fallback de desenvolvimento). Em produção com Snowflake
 * configurado, o mock nunca é usado.
 *
 * Esta função só pode ser chamada de Server Components / Route Handlers.
 */
export async function getTemplateDashboardData(
  filters: DashboardFiltersState = {},
): Promise<DashboardData> {
  const dateBind = [filters.date ?? null];

  try {
    const [kpiRows, seriesRows, tableRows] = await Promise.all([
      executeSnowflakeQuery<RawKpiRow>(KPIS_SQL, dateBind),
      executeSnowflakeQuery<RawSeriesRow>(CHART_SERIES_SQL, dateBind),
      executeSnowflakeQuery<RawDetailRow>(DETAIL_TABLE_SQL, dateBind),
    ]);

    return {
      source: "snowflake",
      kpis: adaptKpis(kpiRows),
      series: adaptSeries(seriesRows),
      table: adaptTable(tableRows),
    };
  } catch (err) {
    // Fallback controlado para mock. Em produção, prefira tratar como erro real.
    const safe = isSafeQueryError(err) ? err : null;
    const reason = safe?.isConfigError
      ? "Snowflake não configurado"
      : "Falha ao consultar o Snowflake";

    return {
      ...mockDashboardData,
      notice: `${reason}. Exibindo dados MOCK (fallback de desenvolvimento).`,
    };
  }
}
