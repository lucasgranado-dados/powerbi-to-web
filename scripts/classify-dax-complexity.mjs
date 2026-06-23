#!/usr/bin/env node
// =============================================================================
// classify-dax-complexity — classifica a complexidade das medidas do catálogo.
//
//   npm run dax:classify -- --slug nome-do-dashboard
//
// Lê src/features/dashboards/<slug>/dax/measures.catalog.json e adiciona, em
// cada medida: complexity (simple|moderate|complex|critical), riskReasons[] e
// requiresManualReview. Medidas complex/critical exigem revisão manual.
//
// 2ª etapa da DAX Review Layer.
// =============================================================================

import fs from "node:fs";
import path from "node:path";

import { fail, getSlug, info, ok, title, warn } from "./lib/console.mjs";
import { writeFileEnsuring } from "./lib/files.mjs";
import { classify } from "./lib/dax-classify.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const { slug } = getSlug();
const catalogPath = path.join(
  ROOT,
  "src/features/dashboards",
  slug,
  "dax/measures.catalog.json",
);

title(`Classificando complexidade DAX de "${slug}"`);

if (!fs.existsSync(catalogPath)) {
  fail(`Catálogo não encontrado: ${path.relative(ROOT, catalogPath)}`);
  fail(`Rode antes: npm run dax:extract -- --slug ${slug}`);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const counts = { simple: 0, moderate: 0, complex: 0, critical: 0 };

catalog.measures = (catalog.measures || []).map((m) => {
  const { complexity, riskReasons, requiresManualReview } = classify(m);
  counts[complexity] = (counts[complexity] || 0) + 1;
  return {
    ...m,
    complexity,
    riskReasons,
    requiresManualReview,
    status: m.status === "extracted" ? "classified" : m.status,
  };
});

catalog.classifiedAt = new Date().toISOString();
writeFileEnsuring(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

info(
  `simple: ${counts.simple} · moderate: ${counts.moderate} · complex: ${counts.complex} · critical: ${counts.critical}`,
);
if (counts.complex + counts.critical > 0) {
  warn(
    `${counts.complex + counts.critical} medida(s) exigem revisão manual (complex/critical).`,
  );
}
ok(`Catálogo classificado: ${path.relative(ROOT, catalogPath)}`);
info("Próximo: npm run dax:review-cards -- --slug " + slug);
