-- =============================================================================
-- Tabela de detalhe — página Aquisição (visão por cliente/closer)
-- -----------------------------------------------------------------------------
-- Fonte:       SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
-- Filtro fixo: PIPE_VENDAS = 'SIM'
-- Binds:       ?1 = periodo_inicio (DATE YYYY-MM-DD)
--              ?2 = periodo_fim    (DATE YYYY-MM-DD)
-- Ordenação:   PL_TAXA_BASE DESC (espelho do Power BI)
--
-- Colunas do visual PBI (visual 29c2e8107a900b5e0950, página Aquisição):
--   Cliente        → DEALNAME_TRATADO_CONSULTORIA
--   E-mail         → EMAIL_CONSULTORIA
--   Etapa negocio  → ETAPA_DO_NEGOCIO_CONSULTORIA
--   PL Hubspot     → PATRIMONIO_VALIDADO_FUNIL
--   PL Consolidado → CADASTRO_PL_TOTAL_IMPLANTADO
--   PL Taxa Base   → PL Consolidado - PL WS
--   PL Taxa WS     → CADASTRO_PL_TOTAL_IMPLANTADO_API
--   Delta PL       → PL Consolidado - PL Hubspot
--   Taxa           → TAXA_FECHADA_CONSULTORIA
--   Data implant.  → CADASTRO_DATA_IMPLANTACAO
--   SLA (Dias)     → DATEDIFF(ASSINATURA_TERMO → DATA_IMPLANTACAO)
--   SDR            → AD_SDR_RESPONSAVEL_FUNIL
--   Closer         → CLOSER_FUNIL
--   Consultor      → CONSULTOR_CONSULTORIA
--   Tombou         → TOMBOU
--
-- Precisa validar:
--   * SLA por linha: confirmar se é assinatura→implantação.
--   * EMAIL_CONSULTORIA: expor apenas via Server Component; nunca como NEXT_PUBLIC_.
-- =============================================================================

SELECT
    DEALNAME_TRATADO_CONSULTORIA                                AS CLIENTE,
    EMAIL_CONSULTORIA                                           AS EMAIL,
    ETAPA_DO_NEGOCIO_CONSULTORIA                                AS ETAPA_DO_NEGOCIO,
    PATRIMONIO_VALIDADO_FUNIL                                   AS PL_HUBSPOT,
    CADASTRO_PL_TOTAL_IMPLANTADO                                AS PL_CONSOLIDADO,
    CADASTRO_PL_TOTAL_IMPLANTADO - CADASTRO_PL_TOTAL_IMPLANTADO_API
                                                                AS PL_TAXA_BASE,
    CADASTRO_PL_TOTAL_IMPLANTADO_API                            AS PL_WS,
    CADASTRO_PL_TOTAL_IMPLANTADO - PATRIMONIO_VALIDADO_FUNIL    AS DELTA_PL,
    TAXA_FECHADA_CONSULTORIA                                    AS TAXA,
    CADASTRO_DATA_IMPLANTACAO                                   AS DATA_IMPLANTACAO,
    DATEDIFF(
        'day',
        CADASTRO_DATA_ASSINATURA_TERMO,
        CADASTRO_DATA_IMPLANTACAO
    )                                                           AS SLA_DIAS,
    AD_SDR_RESPONSAVEL_FUNIL                                    AS SDR,
    CLOSER_FUNIL                                                AS CLOSER,
    CONSULTOR_CONSULTORIA                                       AS CONSULTOR,
    TOMBOU
FROM SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA
WHERE PIPE_VENDAS = 'SIM'
  AND CADASTRO_DATA_IMPLANTACAO
          BETWEEN COALESCE(TRY_TO_DATE(?), DATE_TRUNC('year', CURRENT_DATE()))
              AND COALESCE(TRY_TO_DATE(?), LAST_DAY(CURRENT_DATE()))
ORDER BY PL_TAXA_BASE DESC NULLS LAST;
