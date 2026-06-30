import "server-only";

import snowflake, { type Connection } from "snowflake-sdk";
import type { SnowflakeConfig } from "./types";

/**
 * Camada de conexão Snowflake — SERVER-SIDE APENAS.
 *
 * Responsabilidades:
 *  - ler variáveis de ambiente (nunca NEXT_PUBLIC_);
 *  - montar a configuração de autenticação (key-pair / JWT);
 *  - criar e reutilizar a conexão;
 *  - lançar erros claros quando a configuração estiver ausente;
 *  - JAMAIS imprimir/serializar segredos.
 *
 * O `import "server-only"` garante erro de build se algum componente client
 * tentar importar este módulo.
 */

const REQUIRED_VARS = [
  "SNOWFLAKE_ACCOUNT",
  "SNOWFLAKE_USERNAME",
  "SNOWFLAKE_PASSWORD",
  "SNOWFLAKE_ROLE",
  "SNOWFLAKE_WAREHOUSE",
  "SNOWFLAKE_DATABASE",
  "SNOWFLAKE_SCHEMA",
] as const;

export class SnowflakeConfigError extends Error {
  readonly isConfigError = true as const;
  constructor(message: string) {
    super(message);
    this.name = "SnowflakeConfigError";
  }
}

/**
 * Lê e valida as variáveis de ambiente. Lança SnowflakeConfigError listando
 * (apenas os nomes das) variáveis ausentes — nunca os valores.
 */
export function getSnowflakeConfig(): SnowflakeConfig {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new SnowflakeConfigError(
      `Configuração Snowflake ausente: ${missing.join(", ")}. ` +
        `Defina estas variáveis em .env.local (local) ou nas Environment Variables da Vercel.`,
    );
  }

  return {
    account: process.env.SNOWFLAKE_ACCOUNT as string,
    username: process.env.SNOWFLAKE_USERNAME as string,
    password: process.env.SNOWFLAKE_PASSWORD as string,
    role: process.env.SNOWFLAKE_ROLE as string,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE as string,
    database: process.env.SNOWFLAKE_DATABASE as string,
    schema: process.env.SNOWFLAKE_SCHEMA as string,
  };
}

// Cache de conexão por processo (evita reconectar a cada request em runtime serverless quente).
let cachedConnection: Connection | null = null;

function createConnection(config: SnowflakeConfig): Promise<Connection> {
  // Reduz o ruído do logger do SDK para não vazar detalhes em logs.
  try {
    snowflake.configure({ logLevel: "ERROR" });
  } catch {
    // configure pode lançar se chamado mais de uma vez; ignore com segurança.
  }

  const connection = snowflake.createConnection({
    account: config.account,
    username: config.username,
    password: config.password,
    role: config.role,
    warehouse: config.warehouse,
    database: config.database,
    schema: config.schema,
  });

  return new Promise<Connection>((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) {
        // Não inclui credenciais; apenas a mensagem do driver.
        reject(new Error(`Falha ao conectar no Snowflake: ${err.message}`));
        return;
      }
      resolve(conn);
    });
  });
}

/**
 * Retorna uma conexão pronta, reutilizando a conexão em cache quando válida.
 */
export async function getConnection(): Promise<Connection> {
  if (cachedConnection && cachedConnection.isUp()) {
    return cachedConnection;
  }
  const config = getSnowflakeConfig();
  cachedConnection = await createConnection(config);
  return cachedConnection;
}
