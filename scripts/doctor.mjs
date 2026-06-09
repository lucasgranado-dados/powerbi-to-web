#!/usr/bin/env node
// =============================================================================
// doctor — pré-voo do ambiente. Mostra, em português, o que está pronto e o
// que falta para começar a migrar um dashboard.
//
//   npm run doctor
//
// Não imprime segredos. Encerra com erro só se houver um bloqueador real
// (Node muito antigo ou dependências não instaladas).
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { ok, warn, fail, info, title } from "./lib/console.mjs";
import { loadEnv } from "./lib/load-env.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");

let blockers = 0;

function has(cmd, args = ["--version"]) {
  try {
    const r = spawnSync(cmd, args, { encoding: "utf8" });
    if (r.status === 0) return (r.stdout || r.stderr || "").trim().split("\n")[0];
  } catch {
    /* ignore */
  }
  return null;
}

title("Diagnóstico do ambiente (doctor)");

// --- Essenciais ---------------------------------------------------------------
console.log("\nEssenciais");

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor >= 20) ok(`Node.js v${process.versions.node} (>= 20)`);
else {
  fail(`Node.js v${process.versions.node} é muito antigo — instale a versão 20 ou superior`);
  blockers++;
}

const npmVer = has("npm");
if (npmVer) ok(`npm ${npmVer}`);
else warn("npm não detectado no PATH");

const depsOk = fs.existsSync(path.join(ROOT, "node_modules", "next"));
if (depsOk) ok("Dependências instaladas (node_modules)");
else {
  fail("Dependências não instaladas — rode `npm install`");
  blockers++;
}

const gitVer = has("git");
if (gitVer) {
  const isRepo = fs.existsSync(path.join(ROOT, ".git"));
  ok(`Git disponível${isRepo ? " (repositório inicializado)" : ""}`);
  if (!isRepo) info("Ainda não é um repositório git — rode `git init` quando for versionar.");
} else warn("Git não encontrado (necessário para versionar e abrir PRs)");

// --- Snowflake ----------------------------------------------------------------
console.log("\nSnowflake (dados reais)");

const envLocal = fs.existsSync(path.join(ROOT, ".env.local"));
if (envLocal) ok(".env.local encontrado");
else warn(".env.local não encontrado — copie de .env.example e preencha as variáveis SNOWFLAKE_*");

loadEnv(ROOT);
const REQUIRED = [
  "SNOWFLAKE_ACCOUNT", "SNOWFLAKE_USERNAME", "SNOWFLAKE_ROLE", "SNOWFLAKE_WAREHOUSE",
  "SNOWFLAKE_DATABASE", "SNOWFLAKE_SCHEMA", "SNOWFLAKE_AUTHENTICATOR", "SNOWFLAKE_PRIVATE_KEY",
];
const missing = REQUIRED.filter((n) => !process.env[n]?.trim());
if (missing.length === 0) {
  ok("Todas as variáveis SNOWFLAKE_* obrigatórias estão configuradas");
  info("Confirme a conexão com `npm run snowflake:test`.");
} else if (missing.length === REQUIRED.length) {
  warn("Snowflake ainda não configurado — a app usará dados MOCK até você preencher .env.local");
} else {
  warn(`${missing.length} variável(is) SNOWFLAKE_* ausente(s) — rode \`npm run snowflake:check\` para a lista`);
}

// --- Opcionais ----------------------------------------------------------------
console.log("\nOpcionais");

const py = has("python3") || has("python");
if (py) ok(`Python disponível (${py})`);
else warn("Python não encontrado — necessário só para a validação de paridade (etapa final)");

const vercel = has("vercel");
if (vercel) ok(`Vercel CLI disponível (${vercel})`);
else info("Vercel CLI não instalado — necessário só para o deploy (`npm i -g vercel`)");

// --- Resumo -------------------------------------------------------------------
console.log("");
if (blockers > 0) {
  fail(`${blockers} bloqueador(es) encontrado(s). Resolva-os antes de continuar.`);
  process.exit(1);
}

ok("Ambiente pronto para começar.");
console.log(
  "\nPróximos passos:\n" +
    "  1. npm run migrate            # wizard guiado para um novo dashboard\n" +
    "     (ou) npm run dashboard:init -- --slug <slug>\n" +
    "  2. copie o PBIP para powerbi-input/<slug>/\n" +
    "  3. npm run dev                # ver a aplicação em http://localhost:3000\n",
);
