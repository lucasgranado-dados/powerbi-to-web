#!/usr/bin/env node
// =============================================================================
// check-pbip — valida se o pacote PBIP exportado está adequado.
//
//   npm run pbip:check -- --slug nome-do-dashboard
//
// Verifica a presença dos artefatos esperados (PBIP, .Report, definition.pbir,
// .SemanticModel, TMDL) e alerta sobre formatos legados (model.bim/report.json).
// Encerra com código de erro quando faltar algo OBRIGATÓRIO.
// =============================================================================

import fs from "node:fs";
import path from "node:path";

import { fail, getSlug, ok, title, warn } from "./lib/console.mjs";
import { walk } from "./lib/files.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const { slug } = getSlug();
const baseDir = path.join(ROOT, "powerbi-input", slug);

let errors = 0;

title(`Checando PBIP de "${slug}"`);

if (!fs.existsSync(baseDir)) {
  fail(`Pasta não encontrada: powerbi-input/${slug}/`);
  fail("Copie o PBIP exportado para essa pasta e rode novamente.");
  process.exit(1);
}

const files = walk(baseDir);
const dirs = new Set(
  files.map((f) => path.relative(baseDir, path.dirname(f))),
);
const has = (pred) => files.some(pred);
const hasDir = (suffix) =>
  [...dirs].some((d) => d === suffix || d.endsWith(`/${suffix}`) || d.includes(`${suffix}/`) || d.includes(`${suffix}\\`)) ||
  files.some((f) => f.includes(`${suffix}${path.sep}`));

// Obrigatórios -----------------------------------------------------------------
const pbipFiles = files.filter((f) => f.endsWith(".pbip"));
if (pbipFiles.length >= 1) ok("PBIP encontrado");
else {
  fail("Nenhum arquivo .pbip encontrado");
  errors++;
}

if (has((f) => f.includes(".Report") || f.endsWith(".Report"))) ok("Pasta Report encontrada");
else {
  fail("Pasta .Report não encontrada");
  errors++;
}

if (has((f) => path.basename(f) === "definition.pbir")) ok("definition.pbir encontrado");
else {
  fail("definition.pbir não encontrado");
  errors++;
}

// PBIR granular: pasta .Report/definition com JSONs
if (
  has(
    (f) =>
      f.includes(`.Report${path.sep}definition`) ||
      f.includes(".Report/definition"),
  )
)
  ok("PBIR granular encontrado (.Report/definition)");
else {
  warn("PBIR granular (.Report/definition) não encontrado — habilite PBIR ao exportar");
  errors++;
}

if (has((f) => f.includes(".SemanticModel"))) ok("SemanticModel encontrado");
else {
  fail("Pasta .SemanticModel não encontrada");
  errors++;
}

if (
  has(
    (f) =>
      f.includes(`.SemanticModel${path.sep}definition`) ||
      f.includes(".SemanticModel/definition"),
  )
)
  ok("SemanticModel/definition encontrado");
else {
  warn("SemanticModel/definition não encontrado");
}

const tmdlFiles = files.filter((f) => f.endsWith(".tmdl"));
if (tmdlFiles.length >= 1) ok(`TMDL encontrado (${tmdlFiles.length} arquivo(s) .tmdl)`);
else {
  fail("Nenhum arquivo .tmdl encontrado — habilite TMDL ao exportar o PBIP");
  errors++;
}

// Alertas (não bloqueiam) -------------------------------------------------------
if (has((f) => path.basename(f) === "model.bim"))
  warn("model.bim encontrado: pode indicar modelo legado/TMSL (prefira TMDL)");
if (has((f) => path.basename(f) === "report.json"))
  warn("report.json encontrado: formato legado de relatório (prefira PBIR granular)");
if (pbipFiles.length > 1)
  warn(`Mais de um .pbip encontrado (${pbipFiles.length}) — confirme qual é o correto`);

const sensitive = files.filter(
  (f) =>
    f.includes("localSettings.json") ||
    f.endsWith("cache.abf") ||
    f.endsWith(".pbix"),
);
if (sensitive.length > 0)
  warn(
    `Arquivos locais/sensíveis do Power BI encontrados (${sensitive.length}) — devem ficar fora do versionamento (.gitignore)`,
  );

console.log("");
if (errors > 0) {
  fail(`Checagem falhou: ${errors} item(ns) obrigatório(s)/recomendado(s) ausente(s).`);
  process.exit(1);
}
ok("PBIP válido para diagnóstico.");
