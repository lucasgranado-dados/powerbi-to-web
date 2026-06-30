# Validação de paridade — btg-pl

- `powerbi/dax-queries/` — consultas DAX usadas para extrair os valores de referência.
- `powerbi/expected-results/` — CSVs esperados (exportados do Power BI).
- `web/api-results/` — CSVs gerados pela camada web/Snowflake.
- `diffs/` — saídas da comparação.

Compare com:

```bash
python validation/compare-results.py \
  --expected validation/dashboards/btg-pl/powerbi/expected-results/kpis.csv \
  --actual   validation/dashboards/btg-pl/web/api-results/kpis.csv \
  --key METRIC_ID --value VALUE --tolerance 0.01
```
