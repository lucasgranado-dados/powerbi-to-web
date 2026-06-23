#!/usr/bin/env node
// =============================================================================
// inventory-pbip — gera um inventário do pacote PBIP para orientar o analista.
//
//   npm run pbip:inventory -- --slug nome-do-dashboard
//
// Gera docs/dashboards/<slug>/inventario-pbip.md com contagens e inferências
// LEVES (regex) sobre páginas, visuais, tabelas, medidas e relacionamentos.
// NÃO substitui a análise da IA — apenas ajuda a avaliar se o PBIP está completo.
// =============================================================================

import fs from "node:fs";
import path from "node:path";

import { fail, getSlug, ok, title, warn } from "./lib/console.mjs";
import { readText as read, walk } from "./lib/files.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const { slug } = getSlug();
const baseDir = path.join(ROOT, "powerbi-input", slug);

title(`Inventariando PBIP de "${slug}"`);

if (!fs.existsSync(baseDir)) {
  fail(`Pasta não encontrada: powerbi-input/${slug}/`);
  process.exit(1);
}

const files = walk(baseDir);
const rel = (f) => path.relative(baseDir, f);

const tmdl = files.filter((f) => f.endsWith(".tmdl"));
const json = files.filter((f) => f.endsWith(".json"));
const pbip = files.filter((f) => f.endsWith(".pbip"));

// Inferência leve a partir do TMDL ---------------------------------------------
const tmdlText = tmdl.map(read).join("\n");
const matchAll = (re, text) => [...text.matchAll(re)].map((m) => m[1]);

const tables = [...new Set(matchAll(/^\s*table\s+'?([^'\n]+?)'?\s*$/gim, tmdlText))];
const measures = [...new Set(matchAll(/^\s*measure\s+'?([^'=\n]+?)'?\s*=/gim, tmdlText))];
const relationships = matchAll(/^\s*relationship\s+([^\n]+)$/gim, tmdlText);

// Inferência leve a partir do PBIR (JSONs do report) ---------------------------
const pageFiles = json.filter(
  (f) => /pages?\b/i.test(rel(f)) && /page\.json$/i.test(f),
);
const visualFiles = json.filter((f) => /visual\.json$/i.test(f));
// Heurística alternativa quando os nomes não batem (PBIR varia por versão).
const pagesGuess = pageFiles.length || new Set(
  json.filter((f) => /(\/|\\)pages(\/|\\)/i.test(f)).map((f) => rel(f).split(/[\\/]/).slice(0, -1).join("/")),
).size;
const visualsGuess = visualFiles.length || json.filter((f) => /visual/i.test(rel(f))).length;

const alerts = [];
if (tmdl.length === 0) alerts.push("Nenhum TMDL — habilite TMDL ao exportar.");
if (files.some((f) => path.basename(f) === "model.bim"))
  alerts.push("model.bim presente (modelo legado/TMSL).");
if (files.some((f) => path.basename(f) === "report.json"))
  alerts.push("report.json presente (relatório legado, sem PBIR granular).");
if (pbip.length > 1) alerts.push(`Mais de um .pbip (${pbip.length}).`);

const md = `# Inventário PBIP — ${slug}

> Gerado por \`npm run pbip:inventory -- --slug ${slug}\`. Inferências são
> heurísticas (regex) e **não substituem** a análise da IA (prompt 01).

## Resumo

- Arquivos totais: **${files.length}**
- Arquivos \`.pbip\`: **${pbip.length}**
- Arquivos \`.tmdl\`: **${tmdl.length}**
- Arquivos \`.json\` (PBIR): **${json.length}**
- Páginas (estimado): **${pagesGuess}**
- Visuais (estimado): **${visualsGuess}**

## Tabelas (TMDL) — ${tables.length}

${tables.length ? tables.map((t) => `- ${t}`).join("\n") : "_não identificadas_"}

## Medidas (TMDL) — ${measures.length}

${measures.length ? measures.slice(0, 200).map((m) => `- ${m.trim()}`).join("\n") : "_não identificadas_"}

## Relacionamentos (TMDL) — ${relationships.length}

${relationships.length ? relationships.slice(0, 100).map((r) => `- ${r.trim()}`).join("\n") : "_não identificados_"}

## Alertas técnicos

${alerts.length ? alerts.map((a) => `- ⚠️ ${a}`).join("\n") : "- Nenhum alerta automático."}

## Próximos passos sugeridos

1. Rode \`npm run pbip:check -- --slug ${slug}\` e resolva pendências.
2. Execute o prompt \`prompts/01-diagnostico-pbip-tmdl-pbir.md\`.
3. Preencha \`docs/dashboards/${slug}/diagnostico.md\`.
4. Revise as medidas DAX complexas (prompt 03) e mapeie para Snowflake (prompt 04).

## Arquivos encontrados

${files
  .slice(0, 500)
  .map((f) => `- \`${rel(f)}\``)
  .join("\n")}
${files.length > 500 ? `\n_(+${files.length - 500} arquivos omitidos)_` : ""}
`;

const outPath = path.join(ROOT, "docs/dashboards", slug, "inventario-pbip.md");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md);

if (alerts.length) alerts.forEach((a) => warn(a));
ok(`Inventário gerado: ${path.relative(ROOT, outPath)}`);
