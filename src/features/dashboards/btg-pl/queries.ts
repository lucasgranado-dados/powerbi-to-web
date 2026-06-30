/**
 * QUERIES — SQL canônico do dashboard btg-pl-total.
 *
 * Fonte de verdade legível: snowflake/queries/dashboards/btg-pl-total/
 * Esta cópia existe porque o Vercel serverless não acessa arquivos em disco
 * em runtime. Mantenha os dois lados em sincronia.
 *
 * Binds posicionais (`?`). NÃO concatene valores de filtro diretamente.
 */

/**
 * Tabela principal com os 4 filtros opcionais.
 * Bind order: [codigoCliente, codigoCliente, administradora, administradora,
 *              posicaoData, posicaoData, generatedAt, generatedAt]
 * Passe `null` para filtros inativos.
 */
export const DETAIL_TABLE_SQL = /* sql */ `
SELECT
    CODIGO_CLIENTE,
    ADMINISTRADORA,
    TO_VARCHAR(POSICAO_DATA, 'YYYY-MM-DD')  AS POSICAO_DATA,
    VALOR_LIQUIDO,
    VALOR_BRUTO,
    TO_VARCHAR(GENERATED_AT)               AS GENERATED_AT
FROM REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL
WHERE (CAST(? AS TEXT) IS NULL OR CODIGO_CLIENTE = ?)
  AND (CAST(? AS TEXT) IS NULL OR ADMINISTRADORA = ?)
  AND TO_VARCHAR(POSICAO_DATA, 'YYYY-MM-DD') = COALESCE(
        CAST(? AS TEXT),
        (SELECT MAX(TO_VARCHAR(POSICAO_DATA, 'YYYY-MM-DD')) FROM REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL)
      )
  AND (CAST(? AS TEXT) IS NULL OR TO_VARCHAR(GENERATED_AT) = ?)
ORDER BY
    POSICAO_DATA DESC,
    CODIGO_CLIENTE ASC
`;

/** Valores distintos de CODIGO_CLIENTE para o slicer. */
export const FILTER_CODIGO_CLIENTE_SQL = /* sql */ `
SELECT DISTINCT CODIGO_CLIENTE
FROM REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL
WHERE CODIGO_CLIENTE IS NOT NULL
ORDER BY CODIGO_CLIENTE ASC
`;

/** Valores distintos de ADMINISTRADORA para o slicer. */
export const FILTER_ADMINISTRADORA_SQL = /* sql */ `
SELECT DISTINCT ADMINISTRADORA
FROM REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL
WHERE ADMINISTRADORA IS NOT NULL
ORDER BY ADMINISTRADORA ASC
`;

/** Valores distintos de POSICAO_DATA para o slicer (formato YYYY-MM-DD). */
export const FILTER_POSICAO_DATA_SQL = /* sql */ `
SELECT DISTINCT TO_VARCHAR(POSICAO_DATA, 'YYYY-MM-DD') AS POSICAO_DATA
FROM REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL
WHERE POSICAO_DATA IS NOT NULL
ORDER BY POSICAO_DATA ASC
`;

/** Valores distintos de GENERATED_AT para o slicer (desc — igual ao PBI). */
export const FILTER_GENERATED_AT_SQL = /* sql */ `
SELECT DISTINCT GENERATED_AT
FROM REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL
WHERE GENERATED_AT IS NOT NULL
ORDER BY GENERATED_AT DESC
`;
