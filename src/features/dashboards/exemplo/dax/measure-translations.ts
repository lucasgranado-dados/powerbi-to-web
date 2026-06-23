// AUTOGERADO por `npm run dax:review-cards -- --slug exemplo`.
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
  closer: {
    powerBiMeasure: "Closer",
    status: "validation_required",
    risk: "high",
    notes: [
      "uses CALCULATE",
      "uses SELECTEDVALUE",
      "uses REMOVEFILTERS",
      "uses VAR/RETURN",
    ],
    snowflakeSqlCandidate: `
      -- SQL candidato para "Closer".
      -- NÃO use sem validar a paridade contra o Power BI.
    `,
  },
  receitaYtd: {
    powerBiMeasure: "Receita YTD",
    status: "blocked_for_auto_translation",
    risk: "high",
    notes: [
      "uses time intelligence (TOTALYTD)",
    ],
    snowflakeSqlCandidate: `
      -- SQL candidato para "Receita YTD".
      -- NÃO use sem validar a paridade contra o Power BI.
    `,
  },
};
