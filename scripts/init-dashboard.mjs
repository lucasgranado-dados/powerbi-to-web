#!/usr/bin/env node
// =============================================================================
// init-dashboard — cria a estrutura de um novo dashboard a partir do _template.
//
//   npm run dashboard:init -- --slug nome-do-dashboard
//
// Copia as árvores do `_template` (app, features, queries, mapping) substituindo
// o token `_template` pelo slug, e gera docs + pastas de validação.
// Idempotente: NÃO sobrescreve um destino existente sem --force.
// =============================================================================

import fs from "node:fs";
import path from "node:path";

import { fail, getSlug, info, ok, title, warn } from "./lib/console.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const TOKEN = "_template";

const { slug, force } = getSlug();

/** Extensões tratadas como texto (substituição de token no conteúdo). */
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".sql",
  ".md",
  ".css",
]);

let created = 0;
let skipped = 0;

function applyToken(str) {
  return str.split(TOKEN).join(slug);
}

/** Copia recursivamente, substituindo o token em caminhos e conteúdo. */
function copyTree(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    warn(`Origem não encontrada (ignorada): ${path.relative(ROOT, srcDir)}`);
    return;
  }
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, applyToken(entry.name));
    if (entry.isDirectory()) {
      copyTree(src, dest);
    } else {
      writeFile(dest, transformFile(src));
    }
  }
}

function transformFile(src) {
  const ext = path.extname(src);
  if (TEXT_EXT.has(ext)) {
    return applyToken(fs.readFileSync(src, "utf8"));
  }
  return fs.readFileSync(src); // binário: cópia literal
}

function writeFile(dest, content) {
  const rel = path.relative(ROOT, dest);
  if (fs.existsSync(dest) && !force) {
    warn(`existe, mantido: ${rel}`);
    skipped++;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
  ok(`criado: ${rel}`);
  created++;
}

function writeIfAbsent(relPath, content) {
  writeFile(path.join(ROOT, relPath), content);
}

title(`Inicializando dashboard "${slug}"`);

// 1) Árvores copiadas a partir do _template
copyTree(
  path.join(ROOT, "src/app/dashboards", TOKEN),
  path.join(ROOT, "src/app/dashboards", slug),
);
copyTree(
  path.join(ROOT, "src/features/dashboards", TOKEN),
  path.join(ROOT, "src/features/dashboards", slug),
);
copyTree(
  path.join(ROOT, "snowflake/queries/dashboards", TOKEN),
  path.join(ROOT, "snowflake/queries/dashboards", slug),
);

// 2) Mapping (arquivo único)
const mappingSrc = path.join(ROOT, "snowflake/mappings", `${TOKEN}.source-map.json`);
if (fs.existsSync(mappingSrc)) {
  writeFile(
    path.join(ROOT, "snowflake/mappings", `${slug}.source-map.json`),
    applyToken(fs.readFileSync(mappingSrc, "utf8")),
  );
}

// 3) Documentação do dashboard
writeIfAbsent(
  `docs/dashboards/${slug}/README.md`,
  `# Dashboard: ${slug}\n\nDocumentação da migração do dashboard **${slug}**.\n\n` +
    `- \`diagnostico.md\` — análise do PBIP/TMDL/PBIR (gerado na etapa de diagnóstico).\n` +
    `- \`arquitetura.md\` — decisões de arquitetura Next.js.\n` +
    `- \`inventario-pbip.md\` — gerado por \`npm run pbip:inventory -- --slug ${slug}\`.\n\n` +
    `## Fluxo\n\n1. Copie o PBIP para \`powerbi-input/${slug}/\`.\n` +
    `2. \`npm run pbip:check -- --slug ${slug}\`\n` +
    `3. \`npm run pbip:inventory -- --slug ${slug}\`\n` +
    `4. Rode os prompts em \`prompts/\` na ordem.\n`,
);
writeIfAbsent(
  `docs/dashboards/${slug}/diagnostico.md`,
  `# Diagnóstico — ${slug}\n\n> Preencha com a IA (prompt 01). Use TMDL/PBIR como fonte de verdade.\n\n` +
    `## Páginas\n\n## Visuais\n\n## Medidas (DAX)\n\n## Tabelas\n\n## Relacionamentos\n\n` +
    `## Filtros / Segmentações\n\n## Bookmarks / Drill-through / RLS\n\n## Complexidade\n\n## Riscos\n`,
);
writeIfAbsent(
  `docs/dashboards/${slug}/arquitetura.md`,
  `# Arquitetura — ${slug}\n\n> Preencha com a IA (prompt 02).\n\n` +
    `## Layout / Páginas web\n\n## Componentes usados\n\n## Gráficos (Recharts / ECharts c/ justificativa)\n\n` +
    `## Data fetching server-side\n\n## Filtros\n\n## Pendências\n`,
);

// 4) Pastas de validação
for (const dir of [
  `validation/dashboards/${slug}/powerbi/dax-queries`,
  `validation/dashboards/${slug}/powerbi/expected-results`,
  `validation/dashboards/${slug}/web/api-results`,
  `validation/dashboards/${slug}/diffs`,
]) {
  const abs = path.join(ROOT, dir, ".gitkeep");
  writeFile(abs, "");
}
writeIfAbsent(
  `validation/dashboards/${slug}/README.md`,
  `# Validação de paridade — ${slug}\n\n` +
    `- \`powerbi/dax-queries/\` — consultas DAX usadas para extrair os valores de referência.\n` +
    `- \`powerbi/expected-results/\` — CSVs esperados (exportados do Power BI).\n` +
    `- \`web/api-results/\` — CSVs gerados pela camada web/Snowflake.\n` +
    `- \`diffs/\` — saídas da comparação.\n\n` +
    `Compare com:\n\n\`\`\`bash\npython validation/compare-results.py \\\n` +
    `  --expected validation/dashboards/${slug}/powerbi/expected-results/kpis.csv \\\n` +
    `  --actual   validation/dashboards/${slug}/web/api-results/kpis.csv \\\n` +
    `  --key METRIC_ID --value VALUE --tolerance 0.01\n\`\`\`\n`,
);

console.log("");
ok(`Concluído: ${created} arquivo(s) criado(s), ${skipped} mantido(s).`);
if (skipped > 0 && !force) {
  info("Use --force para sobrescrever os arquivos mantidos.");
}
if (created === 0 && skipped === 0) {
  fail("Nada foi criado. Verifique se a árvore _template existe.");
  process.exit(1);
}
