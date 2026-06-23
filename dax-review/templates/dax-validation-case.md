# Gabarito — caso de validação de medida DAX

> Cada medida `complex`/`critical` precisa de casos que provem a paridade entre o
> Power BI e a tradução Snowflake. Espelha `measure-validation-cases.ts`.

## Medida: <nome>

| Cenário | Filtros aplicados | Resultado esperado (Power BI) | Resultado (Snowflake) | Status |
| ------- | ----------------- | ----------------------------- | --------------------- | ------ |
| Contexto total (sem filtros) | nenhum | | | ⏳ |
| Com filtro de calendário | dCalendario = 2024-01 | | | ⏳ |
| Único valor no contexto | ... | | | ⏳ |
| Múltiplos valores no contexto | ... | | | ⏳ |

Status: ⏳ pendente · ✅ paridade ok · ❌ divergência (investigar)

## Como obter os resultados

- **Power BI:** exporte o resultado da medida nos cenários acima para
  `validation/dax/expected-powerbi-results/`.
- **Snowflake:** rode a query candidata e salve em
  `validation/dax/snowflake-results/`.
- Compare e registre divergências em `validation/dax/diffs/`.
