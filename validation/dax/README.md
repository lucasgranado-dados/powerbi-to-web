# Validação de medidas DAX

Artefatos da validação de paridade **específica de medidas DAX complexas**,
complementando a validação por dashboard em `validation/dashboards/<slug>/`.

## Estrutura

```text
validation/dax/
  expected-powerbi-results/   # resultados exportados do Power BI (referência)
  snowflake-results/          # resultados da tradução Snowflake candidata
  diffs/                      # divergências encontradas na comparação
```

## Fluxo

1. Gere os casos com `npm run dax:review-cards -- --slug <slug>` →
   `src/features/dashboards/<slug>/dax/measure-validation-cases.ts`.
2. Para cada cenário, exporte o resultado da medida no **Power BI** para
   `expected-powerbi-results/` (CSV, nomeado por `<slug>__<medida>__<cenario>.csv`).
3. Rode a query Snowflake candidata e salve em `snowflake-results/` com o mesmo
   nome.
4. Compare (pode reutilizar `validation/compare-results.py`) e registre as
   divergências em `diffs/`.
5. Só então promova o status da medida para `validated` em
   `dax/measures.catalog.json` e `dax/measure-translations.ts`.

## Relação com a validação por dashboard

A validação por dashboard (`validation/dashboards/<slug>/`) cobre KPIs, gráfico e
tabela no agregado. Esta pasta foca nas **medidas que dependem de contexto de
filtro**, onde os cenários (com/sem calendário, valor único, etc.) precisam ser
testados individualmente. Veja `dax-review/` e
`docs/04-revisao-medidas-dax-complexas.md`.
