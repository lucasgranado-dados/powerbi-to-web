---
name: validar-paridade
description: >-
  Monta e executa a validação de paridade entre o dashboard web e o Power BI
  original. Use quando o analista pedir para validar os números, comparar
  resultados/CSVs, conferir se os KPIs batem com o Power BI, definir tolerância
  ou organizar consultas DAX vs. queries Snowflake.
---

# Validação de paridade

O Power BI é a **referência**. A web só está pronta quando os números batem
(dentro de uma tolerância acordada). Esta skill monta a estrutura e executa a
comparação.

## Regras-guarda

- Compare os **mesmos filtros** e **mesmos períodos** dos dois lados.
- **Não marque** uma métrica como `validated` sem confirmação do **responsável de
  negócio**.
- Tolerância padrão **relativa de 1%**; use absoluta para valores perto de zero.

## Passos

1. Criar a estrutura (idempotente):
   ```bash
   npm run validation:init -- --slug <slug>
   ```
   Gera `validation/dashboards/<slug>/{powerbi/{dax-queries,expected-results},web/api-results,diffs}`.
2. **Power BI**: extraia as medidas por dimensão/filtro (DAX Studio ou Performance
   Analyzer), salve as consultas em `powerbi/dax-queries/` e exporte os resultados
   esperados em CSV para `powerbi/expected-results/` (ex.: `kpis.csv` com
   `METRIC_ID,VALUE`).
3. **Web/Snowflake**: gere o CSV equivalente (mesmas chaves e coluna de valor) em
   `web/api-results/`.
4. **Comparar** (ambiente Python: `pip install -r validation/requirements.txt`):
   ```bash
   python validation/compare-results.py \
     --expected validation/dashboards/<slug>/powerbi/expected-results/kpis.csv \
     --actual   validation/dashboards/<slug>/web/api-results/kpis.csv \
     --key METRIC_ID --value VALUE --tolerance 0.01 \
     --out validation/dashboards/<slug>/diffs/kpis-diff.csv
   ```
   O script reporta diff absoluto, diff %, status (APROVADO/REPROVADO/FALTANTE) e
   encerra com erro se houver reprovação.
5. Registre tolerância, períodos, resultado e **responsável** em
   `src/features/dashboards/<slug>/validation-notes.md`; atualize o `status` em
   `metrics.ts`.

## Próximo

Com paridade ok e validação de negócio assinada, vá para **`deploy-vercel`**.

## Referências

- `prompts/06-validacao-paridade.md`
- `docs/06-validacao-paridade.md`, `validation/README.md`
