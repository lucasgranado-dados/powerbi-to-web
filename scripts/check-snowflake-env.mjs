#!/usr/bin/env node
// =============================================================================
// check-snowflake-env — confere se as variáveis do Snowflake estão presentes.
//
//   npm run snowflake:check
//
// NÃO imprime valores/segredos — apenas se cada variável está configurada.
// Encerra com erro se faltar alguma obrigatória.
// =============================================================================

import path from "node:path";

import { fail, ok, title, warn } from "./lib/console.mjs";
import { loadEnv } from "./lib/load-env.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
loadEnv(ROOT);

const REQUIRED = [
  "SNOWFLAKE_ACCOUNT",
  "SNOWFLAKE_USERNAME",
  "SNOWFLAKE_ROLE",
  "SNOWFLAKE_WAREHOUSE",
  "SNOWFLAKE_DATABASE",
  "SNOWFLAKE_SCHEMA",
  "SNOWFLAKE_AUTHENTICATOR",
  "SNOWFLAKE_PRIVATE_KEY",
];
const OPTIONAL = ["SNOWFLAKE_PRIVATE_KEY_PASSPHRASE"];

title("Checando variáveis de ambiente do Snowflake");

let missing = 0;
for (const name of REQUIRED) {
  if (process.env[name]?.trim()) ok(`${name} configurado`);
  else {
    fail(`${name} ausente`);
    missing++;
  }
}
for (const name of OPTIONAL) {
  if (process.env[name]?.trim()) ok(`${name} configurado (opcional)`);
  else warn(`${name} ausente (opcional — apenas se a chave tiver passphrase)`);
}

console.log("");
if (missing > 0) {
  fail(`${missing} variável(is) obrigatória(s) ausente(s). Configure em .env.local ou na Vercel.`);
  process.exit(1);
}
ok("Todas as variáveis obrigatórias estão configuradas.");
