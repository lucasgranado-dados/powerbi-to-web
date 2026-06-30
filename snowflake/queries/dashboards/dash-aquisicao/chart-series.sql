-- =============================================================================
-- Série temporal — implantações e ARR por mês
-- -----------------------------------------------------------------------------
-- Fonte:       SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
-- Filtro fixo: PIPE_VENDAS = 'SIM', TOMBOU = 'SIM'
-- Binds:       ?1 = periodo_inicio (DATE YYYY-MM-DD)
--              ?2 = periodo_fim    (DATE YYYY-MM-DD)
--
-- Alimenta o gráfico de barras/linha das páginas Aquisição e SDR.
-- Eixo X = mês/ano (YYYY-MM); séries = Qtd implantações + ARR API.
--
-- Precisa validar:
--   * Confirmar se o gráfico PBI usa CADASTRO_DATA_IMPLANTACAO ou
--     DATA_DA_CONTRATACAO_FUNIL no eixo temporal.
--   * Confirmar qual medida compõe a série secundária (ARR ou PL).
-- =============================================================================

SELECT
    TO_CHAR(CADASTRO_DATA_IMPLANTACAO, 'YYYY-MM')  AS MES_ANO,
    COUNT(*)                                        AS QTD_IMPLANTACOES,
    SUM(
        CASE
            WHEN ETAPA_DO_NEGOCIO_CONSULTORIA IN (
                'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn'
            ) THEN 0
            WHEN (CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA) < 6000
            THEN 6000
            ELSE CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA
        END
    )                                               AS ARR_API_MES
FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
WHERE PIPE_VENDAS = 'SIM'
  AND TOMBOU = 'SIM'
  AND CADASTRO_DATA_IMPLANTACAO
          BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
              AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
GROUP BY MES_ANO
ORDER BY MES_ANO;
