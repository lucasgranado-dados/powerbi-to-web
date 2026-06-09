/**
 * QUERIES — SQL (texto) do dashboard, isolado da UI.
 *
 * O SQL canônico vive em arquivos versionados em
 *   snowflake/queries/dashboards/_template/*.sql
 * (com comentários de documentação para revisão e validação).
 *
 * Aqui mantemos o MESMO SQL como constantes para que o runtime server-side
 * possa executá-lo sem depender de leitura de arquivos em disco (o que quebra
 * no empacotamento serverless da Vercel). Ao editar o SQL, mantenha os dois
 * lados em sincronia — o `.sql` é a fonte de verdade para revisão.
 *
 * Use placeholders `?` para binds posicionais. NÃO concatene valores de filtro
 * diretamente na string (risco de SQL injection).
 */

// Substitua CHANGE_ME_GOLD_TABLE por uma tabela/view real da camada ouro
// somente após confirmação (ver source-map.ts e metrics.ts).

export const KPIS_SQL = /* sql */ `
-- KPIs do dashboard (ver snowflake/queries/dashboards/_template/kpis.sql)
SELECT
  METRIC_ID,
  LABEL,
  VALUE,
  PREV_VALUE,
  FORMAT
FROM CHANGE_ME_GOLD_TABLE_KPIS
WHERE REF_DATE = COALESCE(TRY_TO_DATE(?), CURRENT_DATE())
ORDER BY SORT_ORDER
`;

export const CHART_SERIES_SQL = /* sql */ `
-- Série do gráfico (ver snowflake/queries/dashboards/_template/chart-series.sql)
SELECT
  BUCKET,
  VALUE
FROM CHANGE_ME_GOLD_TABLE_SERIES
WHERE REF_DATE = COALESCE(TRY_TO_DATE(?), CURRENT_DATE())
ORDER BY BUCKET
`;

export const DETAIL_TABLE_SQL = /* sql */ `
-- Tabela de detalhe (ver snowflake/queries/dashboards/_template/detail-table.sql)
SELECT
  CATEGORY,
  ORDERS,
  REVENUE
FROM CHANGE_ME_GOLD_TABLE_DETAIL
WHERE REF_DATE = COALESCE(TRY_TO_DATE(?), CURRENT_DATE())
ORDER BY REVENUE DESC
`;
