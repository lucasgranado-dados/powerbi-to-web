-- =============================================================================
-- KPIs do dashboard _template
-- -----------------------------------------------------------------------------
-- Alimenta:        os cartões de KPI (componente KpiCard) no topo da página.
-- Substitui:       as medidas do Power BI (Receita, Pedidos, Ticket médio,
--                  Conversão) — ver src/features/dashboards/_template/metrics.ts.
-- Filtros (binds): ? = REF_DATE (YYYY-MM-DD). Se nulo, usa CURRENT_DATE().
-- Retorna:         METRIC_ID, LABEL, VALUE, PREV_VALUE, FORMAT, SORT_ORDER.
-- Precisa validar:
--   * nome real da tabela/view na camada ouro (CHANGE_ME_GOLD_TABLE_KPIS);
--   * se VALUE já vem agregado por dia ou precisa de GROUP BY;
--   * regra de PREV_VALUE (período anterior) com responsável de negócio.
-- =============================================================================

SELECT
    METRIC_ID,
    LABEL,
    VALUE,
    PREV_VALUE,
    FORMAT,          -- 'currency' | 'number' | 'percent'
    SORT_ORDER
FROM CHANGE_ME_GOLD_TABLE_KPIS
WHERE REF_DATE = COALESCE(TRY_TO_DATE(?), CURRENT_DATE())
ORDER BY SORT_ORDER;
