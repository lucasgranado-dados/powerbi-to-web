#!/usr/bin/env node
// =============================================================================
// migrate — wizard guiado para iniciar a migração de um dashboard.
//
//   npm run migrate                      # modo interativo (pergunta o slug)
//   npm run migrate -- --slug vendas     # modo direto (sem perguntas)
//
// Encadeia, num comando só, os passos mecânicos do início do fluxo:
//   1) dashboard:init      (cria a estrutura)
//   2) validation:init     (cria pastas de validação)
//   3) detecta o PBIP -> pbip:check + pbip:inventory (se já estiver copiado)
// e, no fim, imprime os próximos passos (skills/prompts) em português.
//
// Reutiliza os scripts existentes (não duplica lógica). Não imprime segredos.
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { ok, warn, fail, info, title } from "./lib/console.mjs";
import { loadEnv } from "./lib/load-env.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

function run(scriptArgs, label) {
  console.log(`\n▶  ${label}`);
  const r = spawnSync("node", scriptArgs, { stdio: "inherit", cwd: ROOT });
  return r.status === 0;
}

async function resolveSlug() {
  const { values } = parseArgs({
    options: { slug: { type: "string" }, force: { type: "boolean", default: false } },
    strict: false,
  });
  let slug = values.slug;

  if (!slug) {
    if (!input.isTTY) {
      fail("Sem terminal interativo. Informe o slug: npm run migrate -- --slug <slug>");
      process.exit(1);
    }
    const rl = createInterface({ input, output });
    slug = (await rl.question("\n👉  Nome (slug) do dashboard (ex.: vendas-por-hora): ")).trim();
    rl.close();
  }

  if (!SLUG_RE.test(slug || "")) {
    fail(`Slug inválido: "${slug}". Use minúsculas, números e hífens (ex.: vendas-por-hora).`);
    process.exit(1);
  }
  return { slug, force: Boolean(values.force) };
}

const { slug, force } = await resolveSlug();
const forceArg = force ? ["--force"] : [];

title(`Wizard de migração — "${slug}"`);

// 1) Estrutura do dashboard
if (!run(["scripts/init-dashboard.mjs", "--slug", slug, ...forceArg], "Criando a estrutura (dashboard:init)")) {
  fail("Falha ao criar a estrutura. Verifique a mensagem acima.");
  process.exit(1);
}

// 2) Pastas de validação
run(["scripts/create-validation-folders.mjs", "--slug", slug, ...forceArg], "Criando pastas de validação (validation:init)");

// 3) PBIP: detectar e, se presente, checar + inventariar
const pbipDir = path.join(ROOT, "powerbi-input", slug);
const hasPbip =
  fs.existsSync(pbipDir) &&
  fs.readdirSync(pbipDir).some((f) => f.endsWith(".pbip")) === true;

console.log("");
if (hasPbip) {
  ok(`PBIP encontrado em powerbi-input/${slug}/`);
  run(["scripts/check-pbip.mjs", "--slug", slug], "Checando TMDL/PBIR (pbip:check)");
  run(["scripts/inventory-pbip.mjs", "--slug", slug], "Gerando inventário (pbip:inventory)");
} else {
  warn(`Nenhum PBIP em powerbi-input/${slug}/ ainda.`);
  info(
    "Copie o PBIP exportado para essa pasta e depois rode:\n" +
      `    npm run pbip:check -- --slug ${slug}\n` +
      `    npm run pbip:inventory -- --slug ${slug}`,
  );
}

// Snowflake (apenas informativo)
loadEnv(ROOT);
const snowflakeOk = [
  "SNOWFLAKE_ACCOUNT", "SNOWFLAKE_USERNAME", "SNOWFLAKE_PRIVATE_KEY",
].every((n) => process.env[n]?.trim());

// Próximos passos
console.log("\n" + "─".repeat(56));
title("Próximos passos");
console.log(
  `Use as skills de IA da sua IDE (ou os prompts em prompts/), nesta ordem:\n\n` +
    `  1. pbip-diagnostico      → docs/dashboards/${slug}/diagnostico.md\n` +
    `  2. snowflake-mapeamento  → source-map + queries (camada ouro)\n` +
    `  3. gerar-dashboard-web   → a página em src/app/dashboards/${slug}/\n` +
    `  4. validar-paridade      → comparar números com o Power BI\n` +
    `  5. deploy-vercel         → publicar\n`,
);

if (!snowflakeOk) {
  warn("Snowflake não configurado: a página usará dados MOCK por enquanto.");
  info("Quando tiver acesso: preencha .env.local e rode `npm run snowflake:check && npm run snowflake:test`.");
}
console.log("\nVer agora:  npm run dev   →   http://localhost:3000/dashboards/" + slug);
ok("Estrutura pronta. Bom trabalho!");
