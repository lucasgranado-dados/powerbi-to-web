#!/usr/bin/env node
// =============================================================================
// create-validation-folders — cria a estrutura de validação de paridade.
//
//   npm run validation:init -- --slug nome-do-dashboard
// =============================================================================

import fs from "node:fs";
import path from "node:path";

import { getSlug, ok, title, warn } from "./lib/console.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const { slug, force } = getSlug();
const base = path.join(ROOT, "validation/dashboards", slug);

title(`Criando pastas de validação para "${slug}"`);

const dirs = [
  "powerbi/dax-queries",
  "powerbi/expected-results",
  "web/api-results",
  "diffs",
];

for (const d of dirs) {
  const dir = path.join(base, d);
  fs.mkdirSync(dir, { recursive: true });
  const keep = path.join(dir, ".gitkeep");
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, "");
  ok(`pasta: ${path.relative(ROOT, dir)}`);
}

const readmePath = path.join(base, "README.md");
if (fs.existsSync(readmePath) && !force) {
  warn(`README mantido: ${path.relative(ROOT, readmePath)}`);
} else {
  fs.writeFileSync(
    readmePath,
    `# Validação de paridade — ${slug}\n\n` +
      `- \`powerbi/dax-queries/\` — consultas DAX de referência.\n` +
      `- \`powerbi/expected-results/\` — CSVs esperados (Power BI).\n` +
      `- \`web/api-results/\` — CSVs da camada web/Snowflake.\n` +
      `- \`diffs/\` — saídas da comparação.\n\n` +
      `\`\`\`bash\npython validation/compare-results.py \\\n` +
      `  --expected validation/dashboards/${slug}/powerbi/expected-results/kpis.csv \\\n` +
      `  --actual   validation/dashboards/${slug}/web/api-results/kpis.csv \\\n` +
      `  --key METRIC_ID --value VALUE --tolerance 0.01\n\`\`\`\n`,
  );
  ok(`README: ${path.relative(ROOT, readmePath)}`);
}

console.log("");
ok("Estrutura de validação pronta.");
