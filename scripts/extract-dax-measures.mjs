#!/usr/bin/env node
// =============================================================================
// extract-dax-measures — extrai medidas DAX do TMDL para o catálogo do dashboard.
//
//   npm run dax:extract -- --slug nome-do-dashboard
//
// Lê os arquivos .tmdl em powerbi-input/<slug>/ e gera
// src/features/dashboards/<slug>/dax/measures.catalog.json com nome, tabela,
// expressão DAX, arquivo de origem, funções usadas e dependências.
//
// Esta é a 1ª etapa da DAX Review Layer. NÃO traduz nada — apenas cataloga.
// =============================================================================

import fs from "node:fs";
import path from "node:path";

import { fail, getSlug, info, ok, title, warn } from "./lib/console.mjs";
import { readText, walk, writeFileEnsuring } from "./lib/files.mjs";
import { detectDependencies, detectFunctions, parseMeasures } from "./lib/tmdl.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const { slug } = getSlug();
const baseDir = path.join(ROOT, "powerbi-input", slug);
const outPath = path.join(
  ROOT,
  "src/features/dashboards",
  slug,
  "dax/measures.catalog.json",
);

title(`Extraindo medidas DAX de "${slug}"`);

if (!fs.existsSync(baseDir)) {
  fail(`Pasta não encontrada: powerbi-input/${slug}/`);
  fail("Copie o PBIP exportado (com TMDL) para essa pasta e rode novamente.");
  process.exit(1);
}

const tmdlFiles = walk(baseDir).filter((f) => f.endsWith(".tmdl"));
if (tmdlFiles.length === 0) {
  fail("Nenhum arquivo .tmdl encontrado — habilite TMDL ao exportar o PBIP.");
  process.exit(1);
}

// 1ª passada: coletar todas as medidas (para resolver dependências entre elas).
const raw = [];
for (const file of tmdlFiles) {
  const rel = path.relative(baseDir, file);
  for (const m of parseMeasures(readText(file), rel)) raw.push(m);
}

const knownMeasureNames = raw.map((m) => m.name);

const measures = raw.map((m) => {
  const usedFunctions = detectFunctions(m.dax);
  const deps = detectDependencies(m.dax, knownMeasureNames);
  return {
    name: m.name,
    table: m.table,
    dax: m.dax,
    sourceFile: m.sourceFile,
    dependsOn: deps.measures,
    dependsOnTables: deps.tables,
    usedFunctions,
    status: "extracted",
  };
});

const catalog = {
  dashboard: slug,
  generatedAt: new Date().toISOString(),
  generatedBy: "dax:extract",
  measures,
};

writeFileEnsuring(outPath, `${JSON.stringify(catalog, null, 2)}\n`);

if (measures.length === 0) {
  warn("Nenhuma medida encontrada no TMDL (confirme se há `measure ... =`).");
} else {
  info(`Medidas extraídas: ${measures.length}`);
}
ok(`Catálogo gerado: ${path.relative(ROOT, outPath)}`);
info("Próximo: npm run dax:classify -- --slug " + slug);
