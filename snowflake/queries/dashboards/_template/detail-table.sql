-- =============================================================================
-- Tabela de detalhe do dashboard _template
-- -----------------------------------------------------------------------------
-- Alimenta:        a tabela de detalhe (DataTable) por categoria.
-- Substitui:       a matriz/tabela do Power BI (detalhe por categoria).
-- Filtros (binds): ? = REF_DATE (YYYY-MM-DD). Se nulo, usa CURRENT_DATE().
-- Retorna:         CATEGORY, ORDERS, REVENUE.
--                  (o ticket médio é derivado no adapter: REVENUE / ORDERS)
-- Precisa validar:
--   * tabela/view real (CHANGE_ME_GOLD_TABLE_DETAIL);
--   * se o ticket médio deve ser calculado no SQL ou no app (paridade c/ DAX);
--   * agregações (COUNT DISTINCT vs COUNT) com responsável de negócio.
-- =============================================================================

SELECT
    CATEGORY,
    ORDERS,
    REVENUE
FROM CHANGE_ME_GOLD_TABLE_DETAIL
WHERE REF_DATE = COALESCE(TRY_TO_DATE(?), CURRENT_DATE())
ORDER BY REVENUE DESC;
