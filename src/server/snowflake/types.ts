/**
 * Tipos auxiliares da camada Snowflake server-side.
 *
 * Estes tipos NÃO devem ser importados por componentes client. A conexão e a
 * execução de queries acontecem somente no servidor.
 */

/** Configuração resolvida a partir das variáveis de ambiente. */
export interface SnowflakeConfig {
  account: string;
  username: string;
  role: string;
  warehouse: string;
  database: string;
  schema: string;
  authenticator: string;
  /** Conteúdo PEM da chave privada (key-pair auth). */
  privateKey: string;
  /** Opcional — apenas se a chave estiver protegida por passphrase. */
  privateKeyPass?: string;
}

/** Parâmetros (binds) posicionais para uma query parametrizada. */
export type QueryParams = ReadonlyArray<unknown>;

/** Resultado tipado de uma query de leitura. */
export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

/**
 * Erro "seguro" — não carrega credenciais nem SQL bruto sensível.
 * É o que pode ser logado/serializado sem risco de vazamento.
 */
export interface SafeQueryError {
  message: string;
  /** Código do driver Snowflake, quando disponível. */
  code?: string | number;
  /** Verdadeiro quando a causa é configuração ausente/ inválida. */
  isConfigError: boolean;
}
