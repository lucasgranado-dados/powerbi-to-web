// Traduções CANDIDATAS de medidas DAX complexas/críticas para este dashboard.
//
// ⚠️ NENHUMA tradução aqui é definitiva. Toda medida complexa nasce como
// `validation_required` (ou `blocked_for_auto_translation`, se crítica) e só
// pode ser promovida para `validated` após validação de paridade contra o
// Power BI. O arquivo é regenerado por `npm run dax:review-cards`.

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
  /** Motivos/avisos da revisão semântica. */
  notes: string[];
  /** SQL Snowflake candidato (string). Comentado até validar. */
  snowflakeSqlCandidate: string;
}

// Exemplo (do dashboard real, substitua): medida "Closer".
//
//   VAR Closer =
//       CALCULATE(
//           SELECTEDVALUE('Clientes consultoria total_v2'[CLOSER_FUNIL]),
//           REMOVEFILTERS(dCalendario)
//       )
export const measureTranslations: Record<string, MeasureTranslation> = {
  closer: {
    powerBiMeasure: "Closer",
    status: "validation_required",
    risk: "high",
    notes: [
      "Uses CALCULATE",
      "Uses SELECTEDVALUE",
      "Removes calendar filters via REMOVEFILTERS(dCalendario)",
    ],
    snowflakeSqlCandidate: `
      -- SQL candidato. Validar contra o Power BI antes de uso definitivo.
      -- SELECTEDVALUE => retorna o valor só quando há exatamente um distinto:
      --   CASE WHEN COUNT(DISTINCT CLOSER_FUNIL) = 1 THEN MAX(CLOSER_FUNIL) ELSE NULL END
      -- REMOVEFILTERS(dCalendario) => NÃO aplicar filtros de data/calendário,
      --   mas preservar os demais filtros do contexto.
    `,
  },
};
