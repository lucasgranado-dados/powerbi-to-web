/**
 * QUERIES — SQL (texto) do dashboard dash-aquisicao.
 *
 * O SQL canônico vive em snowflake/queries/dashboards/dash-aquisicao/*.sql.
 * Aqui mantemos o MESMO SQL como constantes para que o runtime server-side
 * possa executá-lo sem depender de leitura de arquivos em disco (quebra no
 * empacotamento serverless da Vercel).
 *
 * Ao editar o SQL, mantenha os dois lados em sincronia — o .sql é a fonte
 * de verdade para revisão e versionamento.
 *
 * Binds posicionais com `?`. NUNCA concatene valores de filtro nas strings.
 * Binds de kpis.sql: ?1=inicio ?2=fim ?3=inicio ?4=fim (subquery repete datas)
 * Binds de detail-table.sql: ?1=inicio ?2=fim
 * Binds de detail-table-sdr.sql: ?1=inicio ?2=fim
 * Binds de chart-series.sql: ?1=inicio ?2=fim
 */

export const KPIS_SQL = /* sql */ `
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
    SELECT GREATEST(
        SUM(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA), 6000
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
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API) AS PL_TAXA_BASE,
    SUM(PATRIMONIO_VALIDADO_FUNIL)                              AS PL_HUBSPOT,
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(PATRIMONIO_VALIDADO_FUNIL) AS DELTA_PL,
    (SUM(CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(PATRIMONIO_VALIDADO_FUNIL))
        / NULLIF(SUM(PATRIMONIO_VALIDADO_FUNIL), 0)             AS DIFERENCA_PERC,
    COUNT_IF(TOMBOU = 'SIM')                                    AS QTD_IMPLANTACOES,
    SUM(CADASTRO_PL_TOTAL_IMPLANTADO) / NULLIF(COUNT_IF(TOMBOU = 'SIM'), 0) AS PL_MEDIO,
    SUM(arr_ajustado_api) / NULLIF(SUM(CADASTRO_PL_TOTAL_IMPLANTADO), 0) AS TAXA_EFETIVA_CLOSER,
    (SELECT SUM(arr_card) FROM arr_por_cliente)                 AS TOTAL_ARR_CARD,
    DATEDIFF('day', MAX(CADASTRO_DATA_ASSINATURA_TERMO), MAX(CADASTRO_DATA_IMPLANTACAO)) AS SLA_DIAS
FROM base
`;

export const DETAIL_TABLE_SQL = /* sql */ `
SELECT
    DEALNAME_TRATADO_CONSULTORIA    AS CLIENTE,
    EMAIL_CONSULTORIA               AS EMAIL,
    ETAPA_DO_NEGOCIO_CONSULTORIA    AS ETAPA_DO_NEGOCIO,
    PATRIMONIO_VALIDADO_FUNIL       AS PL_HUBSPOT,
    CADASTRO_PL_TOTAL_IMPLANTADO    AS PL_CONSOLIDADO,
    CADASTRO_PL_TOTAL_IMPLANTADO - CADASTRO_PL_TOTAL_IMPLANTADO_API AS PL_TAXA_BASE,
    CADASTRO_PL_TOTAL_IMPLANTADO_API AS PL_WS,
    CADASTRO_PL_TOTAL_IMPLANTADO - PATRIMONIO_VALIDADO_FUNIL AS DELTA_PL,
    TAXA_FECHADA_CONSULTORIA        AS TAXA,
    CADASTRO_DATA_IMPLANTACAO       AS DATA_IMPLANTACAO,
    DATEDIFF('day', CADASTRO_DATA_ASSINATURA_TERMO, CADASTRO_DATA_IMPLANTACAO) AS SLA_DIAS,
    AD_SDR_RESPONSAVEL_FUNIL        AS SDR,
    CLOSER_FUNIL                    AS CLOSER,
    CONSULTOR_CONSULTORIA           AS CONSULTOR,
    TOMBOU
FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
WHERE PIPE_VENDAS = 'SIM'
  AND CADASTRO_DATA_IMPLANTACAO
          BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
              AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
ORDER BY PL_TAXA_BASE DESC NULLS LAST
`;

export const DETAIL_TABLE_SDR_SQL = /* sql */ `
WITH base AS (
    SELECT
        AD_SDR_RESPONSAVEL_FUNIL AS SDR,
        CADASTRO_COD_GORILA,
        TOMBOU,
        ETAPA_DO_NEGOCIO_CONSULTORIA,
        CADASTRO_PL_TOTAL_IMPLANTADO,
        CADASTRO_PL_TOTAL_IMPLANTADO_API,
        TAXA_FECHADA_CONSULTORIA,
        PATRIMONIO_VALIDADO_FUNIL,
        CASE
            WHEN ETAPA_DO_NEGOCIO_CONSULTORIA IN (
                'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn'
            ) THEN 0
            WHEN TOMBOU = 'SIM' AND (CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA) < 6000 THEN 6000
            ELSE CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA
        END AS arr_ajustado,
        CASE
            WHEN ETAPA_DO_NEGOCIO_CONSULTORIA IN (
                'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn'
            ) THEN 0
            WHEN TOMBOU = 'SIM' AND (CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA) < 6000 THEN 6000
            ELSE CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA
        END AS arr_ajustado_api
    FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
    WHERE PIPE_VENDAS = 'SIM'
      AND CADASTRO_DATA_IMPLANTACAO
              BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
                  AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
),
arr_card_cliente AS (
    SELECT SDR, CADASTRO_COD_GORILA,
           GREATEST(SUM(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA), 6000) AS arr_card_cliente
    FROM base
    GROUP BY SDR, CADASTRO_COD_GORILA
),
arr_card_sdr AS (
    SELECT SDR, SUM(arr_card_cliente) AS TOTAL_ARR_CARD
    FROM arr_card_cliente
    GROUP BY SDR
)
SELECT
    b.SDR,
    COUNT_IF(b.TOMBOU = 'SIM')                                 AS CARTEIRAS_CONSOLIDADAS,
    SUM(b.PATRIMONIO_VALIDADO_FUNIL)                           AS PL_HUBSPOT,
    SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO)                        AS PL_CONSOLIDADO,
    SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO_API) AS PL_TAXA_BASE,
    SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO_API)                    AS PL_WS,
    (SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO) - SUM(b.PATRIMONIO_VALIDADO_FUNIL))
        / NULLIF(SUM(b.PATRIMONIO_VALIDADO_FUNIL), 0)          AS DIFERENCA_PERC,
    a.TOTAL_ARR_CARD                                           AS ARR_CARD,
    SUM(b.arr_ajustado) / 12                                   AS MRR,
    SUM(b.arr_ajustado_api) / NULLIF(SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO), 0) AS TAXA_EFETIVA_CLOSER,
    SUM(b.arr_ajustado_api)                                    AS ARR_API,
    SUM(b.arr_ajustado_api) / 12                               AS MRR_API,
    ((SUM(b.arr_ajustado_api) / 12) * 2
      - (SUM(b.arr_ajustado_api) / 12)
        * (SUM(b.arr_ajustado_api) / NULLIF(SUM(b.CADASTRO_PL_TOTAL_IMPLANTADO), 0))
    ) * (1 - 0.18)                                             AS VARIAVEL_CONSULTOR
FROM base b
LEFT JOIN arr_card_sdr a ON a.SDR = b.SDR
GROUP BY b.SDR, a.TOTAL_ARR_CARD
ORDER BY PL_CONSOLIDADO DESC NULLS LAST
`;

// ---------------------------------------------------------------------------
// RV — Remuneração Variável por Closer (por mês)
// Binds: ?1=inicio ?2=fim
//
// ARR = GREATEST(PL_TOTAL * TAXA, 6000) por cliente (conforme DAX).
// ARR_BASE = ARR * (1 - PL_WS/PL_TOTAL) — componente taxa base.
// ARR_CUSTODIA = ARR * (PL_WS/PL_TOTAL) — componente custódia.
// Média Móvel 3M e Faixa calculados sem filtro de data para garantir
// que meses anteriores ao período selecionado alimentem a janela.
// Faixa: 1=≤80k, 2=≤160k, 3=≤240k, 4=>240k (mês 0 = Faixa 4 automático).
// RV = ARR_BASE*TaxaBase(Faixa) + ARR_CUSTODIA*TaxaCustodia(Faixa)
// Taxa: F1=1%/1.5%, F2=2%/3%, F3=2.5%/3.75%, F4=3%/4.5%
// Pendência: ADV_PRODUTO_ADQUIRIDO_FUNIL (Mentoria/Black/Grupo Elite) não incluso.
// ---------------------------------------------------------------------------

export const RV_CLOSER_SQL = /* sql */ `
WITH base_clientes AS (
    SELECT
        DATE_TRUNC('month', CADASTRO_DATA_IMPLANTACAO) AS MES_DATE,
        TO_CHAR(CADASTRO_DATA_IMPLANTACAO, 'YYYY-MM')  AS MES_ANO,
        CLOSER_FUNIL                                    AS CLOSER,
        CADASTRO_PL_TOTAL_IMPLANTADO                    AS PL_TOTAL,
        CADASTRO_PL_TOTAL_IMPLANTADO_API                AS PL_WS,
        -- Produtos especiais (Mentoria, Assinatura Black, Grupo Elite) somam AMOUNT_FUNIL ao ARR Base
        CASE
            WHEN ADV_PRODUTO_ADQUIRIDO_FUNIL IN ('Assinatura Black','Mentoria','Grupo Elite')
            THEN COALESCE(AMOUNT_FUNIL, 0)
            ELSE 0
        END                                             AS VALOR_PRODUTO_ESPECIAL,
        GREATEST(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA, 6000) AS ARR_BASE_CALC,
        GREATEST(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA, 6000)
            * COALESCE(
                (CADASTRO_PL_TOTAL_IMPLANTADO - CADASTRO_PL_TOTAL_IMPLANTADO_API)
                    / NULLIF(CADASTRO_PL_TOTAL_IMPLANTADO, 0),
                1.0
            )                                           AS ARR_BASE_TAXA_CLIENTE,
        GREATEST(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA, 6000)
            * COALESCE(
                CADASTRO_PL_TOTAL_IMPLANTADO_API
                    / NULLIF(CADASTRO_PL_TOTAL_IMPLANTADO, 0),
                0.0
            )                                           AS ARR_CUSTODIA_CLIENTE
    FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
    WHERE PIPE_VENDAS = 'SIM'
      AND TOMBOU = 'SIM'
      AND ETAPA_DO_NEGOCIO_CONSULTORIA NOT IN (
              'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn')
),
monthly AS (
    SELECT
        MES_DATE, MES_ANO, CLOSER,
        SUM(PL_TOTAL)             AS PL_CONSOLIDADO,
        SUM(PL_TOTAL - PL_WS)     AS PL_TAXA_BASE,
        SUM(PL_WS)                AS PL_WS,
        SUM(ARR_BASE_CALC + VALOR_PRODUTO_ESPECIAL)    AS ARR_TOTAL_MENSAL,
        SUM(ARR_BASE_TAXA_CLIENTE + VALOR_PRODUTO_ESPECIAL) AS ARR_BASE_MENSAL,
        SUM(ARR_CUSTODIA_CLIENTE)                      AS ARR_CUSTODIA_MENSAL
    FROM base_clientes
    GROUP BY MES_DATE, MES_ANO, CLOSER
),
m1_closer AS (
    SELECT DISTINCT CLOSER, DATE '2026-03-01' AS M1_DATE
    FROM monthly
),
with_rolling AS (
    SELECT
        m.*,
        mc.M1_DATE,
        DATEDIFF('month', mc.M1_DATE, m.MES_DATE) AS MES_OFFSET,
        AVG(m.ARR_TOTAL_MENSAL) OVER (
            PARTITION BY m.CLOSER
            ORDER BY m.MES_DATE
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        )                                          AS MEDIA_MOV_3M
    FROM monthly m
    LEFT JOIN m1_closer mc ON mc.CLOSER = m.CLOSER
),
with_faixa AS (
    SELECT *,
        CASE
            WHEN M1_DATE IS NULL OR MES_OFFSET < 0 THEN NULL
            WHEN MES_OFFSET = 0         THEN 4
            WHEN MEDIA_MOV_3M <= 80000  THEN 1
            WHEN MEDIA_MOV_3M <= 160000 THEN 2
            WHEN MEDIA_MOV_3M <= 240000 THEN 3
            ELSE 4
        END AS FAIXA
    FROM with_rolling
)
SELECT
    MES_ANO,
    CLOSER,
    PL_CONSOLIDADO,
    PL_TAXA_BASE,
    PL_WS,
    ARR_BASE_MENSAL,
    ARR_CUSTODIA_MENSAL,
    ARR_TOTAL_MENSAL,
    FAIXA,
    MEDIA_MOV_3M,
    CASE FAIXA
        WHEN 1 THEN ARR_BASE_MENSAL * 0.010  + ARR_CUSTODIA_MENSAL * 0.0150
        WHEN 2 THEN ARR_BASE_MENSAL * 0.020  + ARR_CUSTODIA_MENSAL * 0.0300
        WHEN 3 THEN ARR_BASE_MENSAL * 0.025  + ARR_CUSTODIA_MENSAL * 0.0375
        WHEN 4 THEN ARR_BASE_MENSAL * 0.030  + ARR_CUSTODIA_MENSAL * 0.0450
        ELSE NULL
    END AS RV_CLOSER
FROM with_faixa
WHERE MES_DATE
        BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
            AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
ORDER BY MES_ANO DESC, ARR_TOTAL_MENSAL DESC NULLS LAST
`;

// ---------------------------------------------------------------------------
// RV — Remuneração Variável por SDR (por mês)
// Binds: ?1=inicio ?2=fim
//
// RV SDR = ARR_TOTAL * Taxa(Faixa)
// Taxa: F1=0.5%, F2=0.6%, F3=0.7%, F4=0.8%
// Faixa: igual ao Closer (Média Móvel 3M do ARR Total)
// ---------------------------------------------------------------------------

export const RV_SDR_SQL = /* sql */ `
WITH base_clientes AS (
    SELECT
        DATE_TRUNC('month', CADASTRO_DATA_IMPLANTACAO) AS MES_DATE,
        TO_CHAR(CADASTRO_DATA_IMPLANTACAO, 'YYYY-MM')  AS MES_ANO,
        AD_SDR_RESPONSAVEL_FUNIL                        AS SDR,
        CADASTRO_PL_TOTAL_IMPLANTADO                    AS PL_TOTAL,
        CADASTRO_PL_TOTAL_IMPLANTADO_API                AS PL_WS,
        GREATEST(CADASTRO_PL_TOTAL_IMPLANTADO * TAXA_FECHADA_CONSULTORIA, 6000) AS ARR_BASE_CALC,
        CASE
            WHEN ADV_PRODUTO_ADQUIRIDO_FUNIL IN ('Assinatura Black','Mentoria','Grupo Elite')
            THEN COALESCE(AMOUNT_FUNIL, 0)
            ELSE 0
        END                                             AS VALOR_PRODUTO_ESPECIAL
    FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
    WHERE PIPE_VENDAS = 'SIM'
      AND TOMBOU = 'SIM'
      AND ETAPA_DO_NEGOCIO_CONSULTORIA NOT IN (
              'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn')
),
monthly AS (
    SELECT
        MES_DATE, MES_ANO, SDR,
        SUM(PL_TOTAL)                                  AS PL_CONSOLIDADO,
        SUM(PL_TOTAL - PL_WS)                          AS PL_TAXA_BASE,
        SUM(PL_WS)                                     AS PL_WS,
        SUM(ARR_BASE_CALC + VALOR_PRODUTO_ESPECIAL)    AS ARR_TOTAL_MENSAL
    FROM base_clientes
    GROUP BY MES_DATE, MES_ANO, SDR
),
m1_sdr AS (
    SELECT DISTINCT SDR, DATE '2026-03-01' AS M1_DATE
    FROM monthly
),
with_rolling AS (
    SELECT
        m.*,
        ms.M1_DATE,
        DATEDIFF('month', ms.M1_DATE, m.MES_DATE) AS MES_OFFSET,
        AVG(m.ARR_TOTAL_MENSAL) OVER (
            PARTITION BY m.SDR
            ORDER BY m.MES_DATE
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        )                                          AS MEDIA_MOV_3M
    FROM monthly m
    LEFT JOIN m1_sdr ms ON ms.SDR = m.SDR
),
with_faixa AS (
    SELECT *,
        CASE
            WHEN M1_DATE IS NULL OR MES_OFFSET < 0 THEN NULL
            WHEN MES_OFFSET = 0         THEN 4
            WHEN MEDIA_MOV_3M <= 80000  THEN 1
            WHEN MEDIA_MOV_3M <= 160000 THEN 2
            WHEN MEDIA_MOV_3M <= 240000 THEN 3
            ELSE 4
        END AS FAIXA
    FROM with_rolling
)
SELECT
    MES_ANO,
    SDR,
    PL_CONSOLIDADO,
    PL_TAXA_BASE,
    PL_WS,
    ARR_TOTAL_MENSAL,
    FAIXA,
    MEDIA_MOV_3M,
    CASE FAIXA
        WHEN 1 THEN ARR_TOTAL_MENSAL * 0.005
        WHEN 2 THEN ARR_TOTAL_MENSAL * 0.006
        WHEN 3 THEN ARR_TOTAL_MENSAL * 0.007
        WHEN 4 THEN ARR_TOTAL_MENSAL * 0.008
        ELSE NULL
    END AS RV_SDR
FROM with_faixa
WHERE MES_DATE
        BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
            AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
ORDER BY MES_ANO DESC, ARR_TOTAL_MENSAL DESC NULLS LAST
`;

export const CHART_SERIES_SQL = /* sql */ `
SELECT
    TO_CHAR(CADASTRO_DATA_IMPLANTACAO, 'YYYY-MM') AS MES_ANO,
    COUNT(*)                                       AS QTD_IMPLANTACOES,
    SUM(
        CASE
            WHEN ETAPA_DO_NEGOCIO_CONSULTORIA IN (
                'CANCELOU/NÃO RENOVOU','RENOVOU','Cancelou/Perdidos','Perdidos','Churn'
            ) THEN 0
            WHEN (CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA) < 6000 THEN 6000
            ELSE CADASTRO_PL_TOTAL_IMPLANTADO_API * TAXA_FECHADA_CONSULTORIA
        END
    )                                              AS ARR_API_MES
FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
WHERE PIPE_VENDAS = 'SIM'
  AND TOMBOU = 'SIM'
  AND CADASTRO_DATA_IMPLANTACAO
          BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
              AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
GROUP BY MES_ANO
ORDER BY MES_ANO
`;
