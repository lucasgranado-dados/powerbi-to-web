#!/usr/bin/env node
// =============================================================================
// create-dax-review-cards — gera os artefatos de revisão das medidas complexas.
//
//   npm run dax:review-cards -- --slug nome-do-dashboard
//
// A partir do catálogo classificado, gera na pasta dax/ do dashboard:
//   - complex-measures.review.md   (1 card por medida complex/critical)
//   - measure-translations.ts      (traduções CANDIDATAS, marcadas)
//   - measure-validation-cases.ts  (casos de validação obrigatórios)
// E atualiza o status no catálogo + acrescenta um bloco em validation-notes.md.
//
// 3ª etapa da DAX Review Layer. NÃO traduz automaticamente: medidas críticas
// nascem como `blocked_for_auto_translation`.
// =============================================================================

import fs from "node:fs";
import path from "node:path";

import { fail, getSlug, info, ok, title, warn } from "./lib/console.mjs";
import { writeFileEnsuring } from "./lib/files.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const { slug } = getSlug();
const daxDir = path.join(ROOT, "src/features/dashboards", slug, "dax");
const catalogPath = path.join(daxDir, "measures.catalog.json");
const notesPath = path.join(
  ROOT,
  "src/features/dashboards",
  slug,
  "validation-notes.md",
);

title(`Gerando cards de revisão DAX de "${slug}"`);

if (!fs.existsSync(catalogPath)) {
  fail(`Catálogo não encontrado: ${path.relative(ROOT, catalogPath)}`);
  fail(`Rode antes: npm run dax:extract / dax:classify -- --slug ${slug}`);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const measures = catalog.measures || [];
const needsReview = measures.filter(
  (m) => m.complexity === "complex" || m.complexity === "critical",
);

if (measures.some((m) => !m.complexity)) {
  warn("Há medidas sem classificação. Rode `dax:classify` antes para um resultado completo.");
}

// --- Helpers -----------------------------------------------------------------
const HIGH_RISK_FN = new Set([
  "REMOVEFILTERS",
  "SELECTEDVALUE",
  "ALL",
  "ALLSELECTED",
  "ALLEXCEPT",
  "KEEPFILTERS",
  "FILTER",
]);

const riskOf = (m) => {
  if (m.complexity === "critical") return "high";
  if ((m.usedFunctions || []).some((f) => HIGH_RISK_FN.has(f))) return "high";
  return "medium";
};

const translationStatusOf = (m) =>
  m.complexity === "critical" ? "blocked_for_auto_translation" : "validation_required";

const usedKeys = new Set();
const keyOf = (name) => {
  let base = name
    .replace(/['"]/g, "")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
  if (!base) base = "measure";
  if (/^[0-9]/.test(base)) base = `m_${base}`;
  let key = base;
  let n = 2;
  while (usedKeys.has(key)) key = `${base}${n++}`;
  usedKeys.add(key);
  return key;
};

// Alvos de filtros removidos (heurística a partir de REMOVEFILTERS/ALL).
const removedFilters = (dax) => {
  const out = [];
  for (const m of dax.matchAll(/\b(?:REMOVEFILTERS|ALL|ALLEXCEPT)\s*\(([^)]*)\)/gi)) {
    const arg = m[1].trim();
    if (arg) out.push(arg);
  }
  return [...new Set(out)];
};

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const bullets = (arr, empty = "_a confirmar com TMDL/negócio_") =>
  arr.length ? arr.map((x) => `- ${x}`).join("\n") : `- ${empty}`;

// --- 1) Cards markdown -------------------------------------------------------
const cardFor = (m) => {
  const removed = removedFilters(m.dax);
  return `## Medida: ${m.name}

### DAX original

\`\`\`DAX
${m.dax || "(expressão não capturada — confira o TMDL)"}
\`\`\`

### Classificação

Complexidade: **${m.complexity}**

Motivos:

${bullets(m.riskReasons || [], "classificação pendente")}

### Interpretação semântica

> _Explique em linguagem natural o que a medida faz. **Não** traduza ainda._

### Contexto de filtro

Filtros mantidos:

- _a confirmar (todos os filtros do contexto que NÃO foram removidos)_

Filtros removidos:

${bullets(removed, "nenhum filtro removido detectado automaticamente")}

Filtros alterados:

- _a confirmar_

### Dependências

Tabelas:

${bullets(m.dependsOnTables || [])}

Colunas:

- _ver DAX acima_

Medidas dependentes:

${bullets(m.dependsOn || [], "nenhuma")}

Relacionamentos relevantes:

- _a confirmar (USERELATIONSHIP/TREATAS, se houver)_

### Risco de tradução

**${riskOf(m) === "high" ? "Alto" : "Médio"}**

### Estratégia recomendada

- [ ] SQL Snowflake
- [ ] adapter TypeScript
- [ ] pré-agregação
- [ ] query separada
- [ ] validação manual obrigatória
- [ ] **não migrar automaticamente**${m.complexity === "critical" ? " ✅ (crítica — bloqueada por padrão)" : ""}

### Tradução proposta

\`\`\`sql
-- SQL candidato. NÃO use sem validação contra o Power BI.
\`\`\`

### Casos de teste obrigatórios

| Cenário | Filtros aplicados | Resultado esperado Power BI | Resultado Snowflake | Status |
| ------- | ----------------- | --------------------------- | ------------------- | ------ |
| Contexto total (sem filtros) | nenhum | _preencher_ | _preencher_ | ⏳ |
| Com filtro de calendário | dCalendario | _preencher_ | _preencher_ | ⏳ |

### Pendências

- [ ] Confirmar regra com responsável de negócio
- [ ] Validar resultado contra Power BI
- [ ] Revisar comportamento com filtros de calendário
`;
};

const reviewMd = `# Revisão de Medidas DAX Complexas — ${slug}

> Gerado por \`npm run dax:review-cards -- --slug ${slug}\`. Edite à mão para
> preencher a interpretação semântica, os filtros e os casos de teste.
> Toda medida abaixo precisa de **validação de paridade** antes do uso definitivo.

Medidas que exigem revisão: **${needsReview.length}** de ${measures.length}.

${needsReview.length ? needsReview.map(cardFor).join("\n---\n\n") : "_Nenhuma medida complex/critical detectada._"}
`;

writeFileEnsuring(path.join(daxDir, "complex-measures.review.md"), reviewMd);

// --- 2) measure-translations.ts ----------------------------------------------
const translationEntries = needsReview
  .map((m) => {
    const key = keyOf(m.name);
    const notes = (m.riskReasons || []).map((r) => `      ${JSON.stringify(r)},`).join("\n");
    return `  ${key}: {
    powerBiMeasure: ${JSON.stringify(m.name)},
    status: ${JSON.stringify(translationStatusOf(m))},
    risk: ${JSON.stringify(riskOf(m))},
    notes: [
${notes}
    ],
    snowflakeSqlCandidate: \`
      -- SQL candidato para "${esc(m.name)}".
      -- NÃO use sem validar a paridade contra o Power BI.
    \`,
  },`;
  })
  .join("\n");

const translationsTs = `// AUTOGERADO por \`npm run dax:review-cards -- --slug ${slug}\`.
// Traduções CANDIDATAS de medidas DAX complexas/críticas. NENHUMA está validada.
// Edite à mão e só promova o status após validação de paridade contra o Power BI.

export type MeasureTranslationStatus =
  | "needs_review"
  | "translation_proposed"
  | "validation_required"
  | "validated"
  | "blocked_for_auto_translation";

export interface MeasureTranslation {
  /** Nome exato da medida no Power BI. */
  powerBiMeasure: string;
  status: MeasureTranslationStatus;
  risk: "low" | "medium" | "high";
  /** Motivos/avisos da revisão. */
  notes: string[];
  /** SQL Snowflake candidato (string). Vazio/comentado até validar. */
  snowflakeSqlCandidate: string;
}

export const measureTranslations: Record<string, MeasureTranslation> = {
${translationEntries}
};
`;

writeFileEnsuring(path.join(daxDir, "measure-translations.ts"), translationsTs);

// --- 3) measure-validation-cases.ts ------------------------------------------
const caseEntries = needsReview
  .map((m) => {
    const removesCalendar = /REMOVEFILTERS\s*\(\s*dCalendario\b/i.test(m.dax);
    const usesSelectedValue = /(^|[^A-Za-z])SELECTEDVALUE\s*\(/i.test(m.dax);
    const blocks = [
      `  {
    measureName: ${JSON.stringify(m.name)},
    scenario: "Contexto total, sem filtros aplicados",
    filters: {},
    expectedBehavior: "Preencher com o resultado observado no Power BI",
  },`,
      `  {
    measureName: ${JSON.stringify(m.name)},
    scenario: "Com filtro de calendário aplicado",
    filters: { calendar: "2024-01" },
    expectedBehavior: ${JSON.stringify(
      removesCalendar
        ? "Ignora o filtro de calendário por causa de REMOVEFILTERS(dCalendario)"
        : "Preencher: confirmar se o filtro de calendário afeta o resultado",
    )},
  },`,
    ];
    if (usesSelectedValue) {
      blocks.push(`  {
    measureName: ${JSON.stringify(m.name)},
    scenario: "Mais de um valor distinto no contexto",
    filters: {},
    expectedBehavior: "Retorna BLANK/NULL por causa de SELECTEDVALUE",
  },`);
    }
    return blocks.join("\n");
  })
  .join("\n");

const casesTs = `// AUTOGERADO por \`npm run dax:review-cards -- --slug ${slug}\`.
// Casos de validação obrigatórios por medida complexa/crítica.
// Preencha "expectedBehavior" com o resultado REAL observado no Power BI.

export interface MeasureValidationCase {
  measureName: string;
  scenario: string;
  filters: Record<string, string | null>;
  expectedBehavior: string;
}

export const measureValidationCases: MeasureValidationCase[] = [
${caseEntries}
];
`;

writeFileEnsuring(path.join(daxDir, "measure-validation-cases.ts"), casesTs);

// --- 4) Atualiza status no catálogo ------------------------------------------
catalog.measures = measures.map((m) => {
  if (m.complexity === "critical")
    return { ...m, status: "blocked_for_auto_translation" };
  if (m.complexity === "complex") return { ...m, status: "needs_review" };
  return m;
});
catalog.reviewCardsAt = new Date().toISOString();
writeFileEnsuring(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

// --- 5) Acrescenta bloco em validation-notes.md ------------------------------
if (fs.existsSync(notesPath)) {
  const marker = "## Revisão de medidas DAX (DAX Review Layer)";
  let notes = fs.readFileSync(notesPath, "utf8");
  const block = `${marker}

> Atualizado por \`dax:review-cards\` em ${new Date().toISOString().slice(0, 10)}.
> Detalhes em \`dax/complex-measures.review.md\`.

- Medidas complex/critical: **${needsReview.length}** de ${measures.length}.
- Críticas bloqueadas (\`blocked_for_auto_translation\`): **${needsReview.filter((m) => m.complexity === "critical").length}**.
- [ ] Cards de revisão preenchidos (semântica + filtros)
- [ ] Traduções candidatas validadas contra o Power BI
- [ ] Status das medidas promovido para \`validated\`
`;
  if (notes.includes(marker)) {
    notes = notes.replace(new RegExp(`${marker}[\\s\\S]*?(?=\\n## |$)`), block + "\n");
  } else {
    notes = `${notes.trimEnd()}\n\n${block}`;
  }
  fs.writeFileSync(notesPath, notes);
  info("validation-notes.md atualizado com o bloco de revisão DAX.");
} else {
  warn("validation-notes.md não encontrado — bloco de revisão não foi adicionado.");
}

info(`Medidas para revisão: ${needsReview.length} (de ${measures.length}).`);
ok(`Gerados em ${path.relative(ROOT, daxDir)}/: complex-measures.review.md, measure-translations.ts, measure-validation-cases.ts`);
