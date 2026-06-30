import type { BtgPlFilterOptions, BtgPlRow } from "./contract";

/**
 * ADAPTERS — convertem linhas brutas do Snowflake nos tipos do contract.
 *
 * O Snowflake retorna colunas em MAIÚSCULAS e tipos crus. Os adapters
 * centralizam a tradução e não adicionam lógica de negócio nova.
 */

/** Linha crua retornada por detail-table.sql. */
export interface RawDetailRow {
  CODIGO_CLIENTE: string;
  ADMINISTRADORA: string;
  POSICAO_DATA: string;
  VALOR_LIQUIDO: number | string;
  VALOR_BRUTO: number | string;
  GENERATED_AT: string;
}

export interface RawCodigoClienteRow { CODIGO_CLIENTE: string }
export interface RawAdministradoraRow { ADMINISTRADORA: string }
export interface RawPosicaoDataRow    { POSICAO_DATA: string }
export interface RawGeneratedAtRow    { GENERATED_AT: string }

export function adaptRows(rows: RawDetailRow[]): BtgPlRow[] {
  return rows.map((r) => ({
    codigoCliente: r.CODIGO_CLIENTE,
    administradora: r.ADMINISTRADORA,
    posicaoData: r.POSICAO_DATA,
    valorLiquido: Number(r.VALOR_LIQUIDO),
    valorBruto: Number(r.VALOR_BRUTO),
    generatedAt: r.GENERATED_AT,
  }));
}

export function adaptFilterOptions(
  codigosCliente: RawCodigoClienteRow[],
  administradoras: RawAdministradoraRow[],
  datasDisponiveis: RawPosicaoDataRow[],
  generatedAts: RawGeneratedAtRow[],
): BtgPlFilterOptions {
  return {
    codigosCliente: codigosCliente.map((r) => r.CODIGO_CLIENTE),
    administradoras: administradoras.map((r) => r.ADMINISTRADORA),
    datasDisponiveis: datasDisponiveis.map((r) => r.POSICAO_DATA),
    generatedAts: generatedAts.map((r) => r.GENERATED_AT),
  };
}
