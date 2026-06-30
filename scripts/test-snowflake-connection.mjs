#!/usr/bin/env node
// =============================================================================
// test-snowflake-connection — testa a conexão com uma query segura.
//
//   npm run snowflake:test
//
// Executa `SELECT CURRENT_VERSION()`. Usa a MESMA lógica de configuração de
// src/server/snowflake/client.ts (replicada aqui porque aquele módulo é
// "server-only" e não pode ser importado por um script Node puro).
// NÃO imprime credenciais.
// =============================================================================

import path from "node:path";

import snowflake from "snowflake-sdk";
import { fail, ok, title, info } from "./lib/console.mjs";
import { loadEnv } from "./lib/load-env.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
loadEnv(ROOT);

const REQUIRED = [
  "SNOWFLAKE_ACCOUNT",
  "SNOWFLAKE_USERNAME",
  "SNOWFLAKE_PASSWORD",
  "SNOWFLAKE_ROLE",
  "SNOWFLAKE_WAREHOUSE",
  "SNOWFLAKE_DATABASE",
  "SNOWFLAKE_SCHEMA",
];

title("Testando conexão com o Snowflake");

const missing = REQUIRED.filter((n) => !process.env[n]?.trim());
if (missing.length) {
  fail(`Configuração ausente: ${missing.join(", ")}`);
  info("Rode `npm run snowflake:check` e configure .env.local antes de testar.");
  process.exit(1);
}

try {
  snowflake.configure({ logLevel: "ERROR" });
} catch {
  /* ignore */
}

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  role: process.env.SNOWFLAKE_ROLE,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
});

connection.connect((err) => {
  if (err) {
    fail(`Falha ao conectar: ${err.message}`);
    process.exit(1);
  }
  ok("Conexão estabelecida.");
  connection.execute({
    sqlText: "SELECT CURRENT_VERSION() AS VERSION",
    complete: (qErr, _stmt, rows) => {
      if (qErr) {
        fail(`Falha na query de teste: ${qErr.message}`);
        process.exit(1);
      }
      const version = rows?.[0]?.VERSION ?? "desconhecida";
      ok(`Snowflake respondeu. CURRENT_VERSION = ${version}`);
      connection.destroy(() => process.exit(0));
    },
  });
});
