-- =============================================================================
-- Série do gráfico do dashboard btg-pl
-- -----------------------------------------------------------------------------
-- Alimenta:        o gráfico de área/linha (SeriesChart -> ChartCard).
-- Substitui:       o visual de linhas/área do Power BI ("Evolução por período").
-- Filtros (binds): ? = REF_DATE (YYYY-MM-DD). Se nulo, usa CURRENT_DATE().
-- Retorna:         BUCKET (rótulo do eixo X), VALUE (medida da série).
-- Precisa validar:
--   * granularidade do BUCKET (hora? dia?) conforme o eixo do Power BI;
--   * tabela/view real (CHANGE_ME_GOLD_TABLE_SERIES);
--   * ordenação cronológica correta do BUCKET.
-- =============================================================================

SELECT
    BUCKET,          -- ex.: '08:00', '09:00' ...  (ajuste à granularidade real)
    VALUE
FROM CHANGE_ME_GOLD_TABLE_SERIES
WHERE REF_DATE = COALESCE(TRY_TO_DATE(?), CURRENT_DATE())
ORDER BY BUCKET;
