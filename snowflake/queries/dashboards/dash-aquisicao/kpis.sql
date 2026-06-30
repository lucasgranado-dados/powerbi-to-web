-- =============================================================================
-- KPIs agregados — páginas Aquisição e Aquisição SDR
-- -----------------------------------------------------------------------------
-- Fonte:       SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
-- Filtro fixo: PIPE_VENDAS = 'SIM'
-- Binds:       ?1 = periodo_inicio (DATE YYYY-MM-DD)
--              ?2 = periodo_fim    (DATE YYYY-MM-DD)
--              ?3 = periodo_inicio (repetido — subquery arr_por_cliente)
--              ?4 = periodo_fim    (repetido)
--
-- Medidas PBI equivalentes (Medidas.tmdl):
--   ARR_AJUSTADO_API    → .ARR Ajustado via API
--   MRR_API             → MRR Api  (ARR/12)
--   PL_CONSOLIDADO      → PL Consolidado  SUM(CADASTRO_PL_TOTAL_IMPLANTADO)
--   PL_WS               → PL WS           SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)
--   PL_TAXA_BASE        → PL Taxa Base    PL_CONSOLIDADO - PL_WS
--   PL_HUBSPOT          → PL Hubspot      SUM(PATRIMONIO_VALIDADO_FUNIL)
--   DELTA_PL            → Delta PL        PL_CONSOLIDADO - PL_HUBSPOT
--   DIFERENCA_PERC      → Diferença % PL x PL Hubspot
--   QTD_IMPLANTACOES    → Qtd implantações / Carteiras consolidadas
--   PL_MEDIO            → PL Médio
--   TAXA_EFETIVA_CLOSER → Taxa efetiva closer (ARR_API / PL_CONSOLIDADO)
--   TOTAL_ARR_CARD      → Total ARR card ajustado (SUMX por CADASTRO_COD_GORILA)
--   SLA_DIAS            → SLA Aquisicao DATEDIFF(MAX assinatura→implantação)
--
-- Precisa validar:
--   * Confirmar nomes exatos das colunas na view (podem diferir dos nomes TMDL).
--   * Regra do piso R$ 6.000: no TMDL aplica-se apenas quando TOMBOU='SIM'.
--   * Total ARR card usa GREATEST por CADASTRO_COD_GORILA — confirmar com negócio.
--   * SLA: confirmar se deve ser MAX ou mediana no card.
--   * Filtro de período: no PBI original era CADASTRO_DATA_IMPLANTACAO via dCalendario.
-- =============================================================================

WITH base AS (
    SELECT
        CADASTRO_COD_GORILA,
        ETAPA_DO_NEGOCIO_CONSULTORIA,
        TOMBOU,
        CADASTRO_PL_TOTAL_IMPLANTADO,
        CADASTRO_PL_TOTAL_IMPLANTADO_API,
        TAXA_FECHADA_CONSULTORIA,
        PATRIMONIO_VALIDADO_FUNIL,
        CADASTRO_DATA_ASSINATURA_TERMO,
        CADASTRO_DATA_IMPLANTACAO,
        CASE
            WHEN ETAPA_DO_NEGOCIO_CONSULTORIA IN (
                'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn'
            ) THEN 0
            WHEN TOMBOU = 'SIM'
             AND (CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA) < 6000
            THEN 6000
            ELSE CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA
        END AS arr_ajustado,
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

arr_por_cliente AS (
    SELECT
        GREATEST(
            SUM(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA),
            6000
        ) AS arr_card
    FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
    WHERE PIPE_VENDAS = 'SIM'
      AND CADASTRO_DATA_IMPLANTACAO
              BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
                  AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
    GROUP BY CADASTRO_COD_GORILA
)

SELECT
    SUM(arr_ajustado_api)                                       AS ARR_AJUSTADO_API,
    SUM(arr_ajustado_api) / 12                                  AS MRR_API,
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO)                           AS PL_CONSOLIDADO,
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)                       AS PL_WS,
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO)
        - SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)                 AS PL_TAXA_BASE,
    SUM(PATRIMONIO_VALIDADO_FUNIL)                              AS PL_HUBSPOT,
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO)
        - SUM(PATRIMONIO_VALIDADO_FUNIL)                        AS DELTA_PL,
    (SUM(CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(PATRIMONIO_VALIDADO_FUNIL))
        / NULLIF(SUM(PATRIMONIO_VALIDADO_FUNIL), 0)             AS DIFERENCA_PERC,
    COUNT_IF(TOMBOU = 'SIM')                                    AS QTD_IMPLANTACOES,
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO)
        / NULLIF(COUNT_IF(TOMBOU = 'SIM'), 0)                   AS PL_MEDIO,
    SUM(arr_ajustado_api)
        / NULLIF(SUM(CADASTRO_PL_TOTAL_IMPLANTADO), 0)          AS TAXA_EFETIVA_CLOSER,
    (SELECT SUM(arr_card) FROM arr_por_cliente)                 AS TOTAL_ARR_CARD,
    DATEDIFF(
        'day',
        MAX(CADASTRO_DATA_ASSINATURA_TERMO),
        MAX(CADASTRO_DATA_IMPLANTACAO)
    )                                                           AS SLA_DIAS
FROM base;
