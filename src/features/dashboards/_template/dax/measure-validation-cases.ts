// Casos de validação obrigatórios por medida complexa/crítica.
//
// Preencha `expectedBehavior` com o resultado REAL observado no Power BI para
// cada cenário. Estes casos guiam a validação de paridade (DAX vs. Snowflake).
// O arquivo é regenerado por `npm run dax:review-cards`.

export interface MeasureValidationCase {
  measureName: string;
  scenario: string;
  filters: Record<string, string | null>;
  expectedBehavior: string;
}

// Exemplo para a medida "Closer" (CALCULATE + SELECTEDVALUE + REMOVEFILTERS).
export const measureValidationCases: MeasureValidationCase[] = [
  {
    measureName: "Closer",
    scenario: "Sem filtro de calendário, com um único closer no contexto",
    filters: {
      calendar: null,
      closer: "exemplo",
    },
    expectedBehavior: "Retorna o closer selecionado",
  },
  {
    measureName: "Closer",
    scenario: "Com filtro de calendário aplicado",
    filters: {
      calendar: "2024-01",
    },
    expectedBehavior:
      "Ignora o filtro de calendário por causa de REMOVEFILTERS(dCalendario)",
  },
  {
    measureName: "Closer",
    scenario: "Mais de um closer no contexto",
    filters: {},
    expectedBehavior: "Retorna BLANK/NULL por causa de SELECTEDVALUE",
  },
];
