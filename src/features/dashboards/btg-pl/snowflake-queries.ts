import "server-only";

import { executeSnowflakeQuery, isSafeQueryError } from "@/server/snowflake/execute-query";
import type { BtgPlDashboardData, BtgPlFilters } from "./contract";
import {
  adaptFilterOptions,
  adaptRows,
  type RawAdministradoraRow,
  type RawCodigoClienteRow,
  type RawDetailRow,
  type RawGeneratedAtRow,
  type RawPosicaoDataRow,
} from "./adapters";
import {
  DETAIL_TABLE_SQL,
  FILTER_ADMINISTRADORA_SQL,
  FILTER_CODIGO_CLIENTE_SQL,
  FILTER_GENERATED_AT_SQL,
  FILTER_POSICAO_DATA_SQL,
} from "./queries";
import { mockBtgPlData } from "./mock-data";

/**
 * Busca os dados do dashboard btg-pl-total no Snowflake.
 * Em caso de erro de configuração/conexão cai no mock (fallback de dev).
 * Só pode ser chamado de Server Components ou Route Handlers.
 */
export async function getBtgPlDashboardData(
  filters: BtgPlFilters = {},
): Promise<BtgPlDashboardData> {
  // posicaoData aparece 1x (COALESCE no SQL usa MAX como default quando null).
  // codigoCliente, administradora e generatedAt aparecem 2x (padrão IS NULL check).
  const tableBinds = [
    filters.codigoCliente ?? null, filters.codigoCliente ?? null,
    filters.administradora ?? null, filters.administradora ?? null,
    filters.posicaoData   ?? null,
    filters.generatedAt   ?? null, filters.generatedAt   ?? null,
  ];

  try {
    const [rows, codigosCliente, administradoras, datasDisponiveis, generatedAts] =
      await Promise.all([
        executeSnowflakeQuery<RawDetailRow>(DETAIL_TABLE_SQL, tableBinds),
        executeSnowflakeQuery<RawCodigoClienteRow>(FILTER_CODIGO_CLIENTE_SQL),
        executeSnowflakeQuery<RawAdministradoraRow>(FILTER_ADMINISTRADORA_SQL),
        executeSnowflakeQuery<RawPosicaoDataRow>(FILTER_POSICAO_DATA_SQL),
        executeSnowflakeQuery<RawGeneratedAtRow>(FILTER_GENERATED_AT_SQL),
      ]);

    return {
      source: "snowflake",
      rows: adaptRows(rows),
      filterOptions: adaptFilterOptions(
        codigosCliente,
        administradoras,
        datasDisponiveis,
        generatedAts,
      ),
    };
  } catch (err) {
    const safe = isSafeQueryError(err) ? err : null;
    const reason = safe?.isConfigError
      ? "Snowflake não configurado"
      : "Falha ao consultar o Snowflake";

    return {
      ...mockBtgPlData,
      notice: `${reason}. Exibindo dados MOCK (fallback de desenvolvimento).`,
    };
  }
}
