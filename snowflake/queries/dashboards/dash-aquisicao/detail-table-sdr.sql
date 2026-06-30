-- =============================================================================
-- Tabela de detalhe — página Aquisição SDR (visão agrupada por SDR)
-- -----------------------------------------------------------------------------
-- Fonte:       SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
-- Filtro fixo: PIPE_VENDAS = 'SIM'
-- Binds:       ?1 = periodo_inicio (DATE YYYY-MM-DD)
--              ?2 = periodo_fim    (DATE YYYY-MM-DD)
-- Ordenação:   PL_CONSOLIDADO DESC (espelho do Power BI)
--
-- Colunas do visual PBI (visual b87d0e73fa2c3d78453d, página Aquisição SDR):
--   SDR                    → AD_SDR_RESPONSAVEL_FUNIL
--   Carteiras consolidadas → COUNTROWS(TOMBOU='SIM')
--   PL Hubspot             → SUM(PATRIMONIO_VALIDADO_FUNIL)
--   PL Consolidado         → SUM(CADASTRO_PL_TOTAL_IMPLANTADO)
--   PL Taxa Base           → PL Consolidado - PL WS
--   PL Taxa WS             → SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)
--   Diferença consol. %    → (PL Consolidado - PL Hubspot) / PL Hubspot
--   ARR (card)             → Total ARR card ajustado (piso 6k por cliente)
--   MRR                    → ARR_AJUSTADO / 12  (via .ARR Ajustado)
--   Taxa efetiva closer    → ARR_API / PL_CONSOLIDADO
--   ARR Api                → .ARR Ajustado via API
--   MRR Api                → ARR_API / 12
--   Variavel consultor     → (MRR Api × 2 − Variavel closer) × (1−0,18)
--
-- Precisa validar:
--   * Variavel consultor: depende de "Variavel closer" que usa Taxa efetiva
--     closer — verificar cálculo em cadeia com responsável de negócio.
--   * Total ARR card: subquery por CADASTRO_COD_GORILA dentro de cada SDR.
-- =============================================================================

WITH base AS (
    SELECT
        AD_SDR_RESPONSAVEL_FUNIL                                    AS SDR,
        CADASTRO_COD_GORILA,
        TOMBOU,
        ETAPA_DO_NEGOCIO_CONSULTORIA,
        CADASTRO_PL_TOTAL_IMPLANTADO,
        CADASTRO_PL_TOTAL_IMPLANTADO_API,
        TAXA_FECHADA_CONSULTORIA,
        PATRIMONIO_VALIDADO_FUNIL,
        -- ARR Ajustado (para MRR)
        CASE
            WHEN ETAPA_DO_NEGOCIO_CONSULTORIA IN (
                'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn'
            ) THEN 0
            WHEN TOMBOU = 'SIM'
             AND (CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA) < 6000
            THEN 6000
            ELSE CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA
        END AS arr_ajustado,
        -- ARR via API
        CASE
            WHEN ETAPA_DO_NEGOCIO_CONSULTORIA IN (
                'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn'
            ) THEN 0
            WHEN TOMBOU = 'SIM'
             AND (CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA) < 6000
            THEN 6000
            ELSE CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA
        END AS arr_ajustado_api
    FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
    WHERE PIPE_VENDAS = 'SIM'
      AND CADASTRO_DATA_IMPLANTACAO
              BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
                  AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
),

-- ARR card por (SDR, CADASTRO_COD_GORILA) para aplicar piso 6k por cliente
arr_card_base AS (
    SELECT
        SDR,
        CADASTRO_COD_GORILA,
        GREATEST(
            SUM(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA),
            6000
        ) AS arr_card_cliente
    FROM base
    GROUP BY SDR, CADASTRO_COD_GORILA
),

arr_card_sdr AS (
    SELECT SDR, SUM(arr_card_cliente) AS TOTAL_ARR_CARD
    FROM arr_card_base
    GROUP BY SDR
)

SELECT
    b.SDR,
    COUNT_IF(b.TOMBOU = 'SIM')                                 AS CARTEIRAS_CONSOLIDADAS,
    SUM(b.PATRIMONIO_VALIDADO_FUNIL)                           AS PL_HUBSPOT,
    SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO)                        AS PL_CONSOLIDADO,
    SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO)
        - SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO_API)              AS PL_TAXA_BASE,
    SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO_API)                    AS PL_WS,
    (
        SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO)
            - SUM(b.PATRIMONIO_VALIDADO_FUNIL)
    ) / NULLIF(SUM(b.PATRIMONIO_VALIDADO_FUNIL), 0)            AS DIFERENCA_PERC,
    a.TOTAL_ARR_CARD                                           AS ARR_CARD,
    SUM(b.arr_ajustado) / 12                                   AS MRR,
    SUM(b.arr_ajustado_api)
        / NULLIF(SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO), 0)       AS TAXA_EFETIVA_CLOSER,
    SUM(b.arr_ajustado_api)                                    AS ARR_API,
    SUM(b.arr_ajustado_api) / 12                               AS MRR_API,
    -- Variavel consultor: (MRR_API × 2 − Variavel_closer) × (1−0,18)
    -- Variavel_closer = MRR_API × Taxa_efetiva_closer
    -- PENDÊNCIA: confirmar cálculo em cadeia com responsável de negócio
    (
        (SUM(b.arr_ajustado_api) / 12) * 2
        - (SUM(b.arr_ajustado_api) / 12)
          * (SUM(b.arr_ajustado_api) / NULLIF(SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO), 0))
    ) * (1 - 0.18)                                             AS VARIAVEL_CONSULTOR
FROM base b
LEFT JOIN arr_card_sdr a ON a.SDR = b.SDR
GROUP BY b.SDR, a.TOTAL_ARR_CARD
ORDER BY PL_CONSOLIDADO DESC NULLS LAST;
