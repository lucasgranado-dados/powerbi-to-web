import "server-only";

import { getConnection, SnowflakeConfigError } from "./client";
import type { QueryParams, SafeQueryError } from "./types";

/**
 * Executa uma query de LEITURA no Snowflake e retorna linhas tipadas.
 *
 * - `sqlText`: SQL parametrizado (use `?` para binds).
 * - `binds`: parâmetros posicionais opcionais.
 *
 * Erros são normalizados para `SafeQueryError` (sem credenciais nem SQL bruto)
 * antes de propagar, de modo que nada sensível chegue ao frontend.
 */
export async function executeSnowflakeQuery<T>(
  sqlText: string,
  binds?: QueryParams,
): Promise<T[]> {
  try {
    const connection = await getConnection();

    return await new Promise<T[]>((resolve, reject) => {
      connection.execute({
        sqlText,
        binds: binds as (string | number)[] | undefined,
        complete: (err, _stmt, rows) => {
          if (err) {
            reject(toSafeError(err));
            return;
          }
          resolve((rows ?? []) as T[]);
        },
      });
    });
  } catch (err) {
    throw toSafeError(err);
  }
}

/**
 * Converte qualquer erro em um SafeQueryError serializável e não-sensível.
 */
export function toSafeError(err: unknown): SafeQueryError {
  if (err && typeof err === "object" && "isConfigError" in err) {
    const e = err as SafeQueryError;
    return {
      message: e.message,
      code: e.code,
      isConfigError: Boolean(e.isConfigError),
    };
  }
  if (err instanceof SnowflakeConfigError) {
    return { message: err.message, isConfigError: true };
  }
  if (err instanceof Error) {
    return {
      message: err.message,
      code: (err as { code?: string | number }).code,
      isConfigError: false,
    };
  }
  return { message: "Erro desconhecido ao consultar o Snowflake.", isConfigError: false };
}

/** Type guard prático para tratar fallback (ex.: cair em mock). */
export function isSafeQueryError(value: unknown): value is SafeQueryError {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    "isConfigError" in value
  );
}
