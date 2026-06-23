// AUTOGERADO por `npm run dax:review-cards -- --slug exemplo`.
// Casos de validação obrigatórios por medida complexa/crítica.
// Preencha "expectedBehavior" com o resultado REAL observado no Power BI.

export interface MeasureValidationCase {
  measureName: string;
  scenario: string;
  filters: Record<string, string | null>;
  expectedBehavior: string;
}

export const measureValidationCases: MeasureValidationCase[] = [
  {
    measureName: "Closer",
    scenario: "Contexto total, sem filtros aplicados",
    filters: {},
    expectedBehavior: "Preencher com o resultado observado no Power BI",
  },
  {
    measureName: "Closer",
    scenario: "Com filtro de calendário aplicado",
    filters: { calendar: "2024-01" },
    expectedBehavior: "Ignora o filtro de calendário por causa de REMOVEFILTERS(dCalendario)",
  },
  {
    measureName: "Closer",
    scenario: "Mais de um valor distinto no contexto",
    filters: {},
    expectedBehavior: "Retorna BLANK/NULL por causa de SELECTEDVALUE",
  },
  {
    measureName: "Receita YTD",
    scenario: "Contexto total, sem filtros aplicados",
    filters: {},
    expectedBehavior: "Preencher com o resultado observado no Power BI",
  },
  {
    measureName: "Receita YTD",
    scenario: "Com filtro de calendário aplicado",
    filters: { calendar: "2024-01" },
    expectedBehavior: "Preencher: confirmar se o filtro de calendário afeta o resultado",
  },
];
