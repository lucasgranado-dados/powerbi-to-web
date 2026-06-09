# Prompt 06 — Validação de paridade

Monte a estrutura de validação de `{{DASHBOARD_SLUG}}` contra o Power BI.

## Tarefas

1. Rode/assegure a estrutura: `npm run validation:init -- --slug {{DASHBOARD_SLUG}}`.
2. **Liste os KPIs** a comparar (com a coluna de chave e a de valor).
3. **Liste os filtros obrigatórios** que devem ser idênticos nos dois lados.
4. **Liste os períodos** de comparação (ex.: ontem, mês atual, um mês fechado).
5. **Defina a tolerância** (relativa padrão 1%; absoluta para valores próximos de
   zero) e registre o acordo.
6. **Liste as consultas DAX** necessárias (para `powerbi/dax-queries/`).
7. **Liste as queries Snowflake equivalentes** que geram o CSV web.
8. Indique o **responsável de negócio** pela validação.

## Saída

- Tabela de validação (KPI, chave, valor, filtros, período, tolerância) no
  `validation-notes.md`.
- Instrução pronta de comparação:

  ```bash
  python validation/compare-results.py \
    --expected validation/dashboards/{{DASHBOARD_SLUG}}/powerbi/expected-results/kpis.csv \
    --actual   validation/dashboards/{{DASHBOARD_SLUG}}/web/api-results/kpis.csv \
    --key METRIC_ID --value VALUE --tolerance 0.01
  ```

Não marque nenhuma métrica como `validated` sem confirmação do responsável.
