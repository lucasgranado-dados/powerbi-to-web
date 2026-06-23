# 07 — Validação de paridade

## Por que validar contra o Power BI

O Power BI é a **referência**. A web só está pronta quando os números batem
(dentro de uma tolerância acordada) com o dashboard original.

## Organizar a validação

```bash
npm run validation:init -- --slug <slug>
```

Estrutura criada:

```text
validation/dashboards/<slug>/
├── powerbi/
│   ├── dax-queries/        # as consultas DAX usadas
│   └── expected-results/   # CSVs esperados (exportados do Power BI)
├── web/
│   └── api-results/        # CSVs gerados pela web/Snowflake
└── diffs/                  # saídas da comparação
```

## Passos

1. **Consultas DAX**: no Power BI (DAX Studio ou "Performance Analyzer →
   Copy query"), extraia as medidas por dimensão/filtro relevante. Salve os
   `.dax` em `powerbi/dax-queries/`.
2. **Resultados esperados**: exporte o resultado de cada consulta para CSV em
   `powerbi/expected-results/` (ex.: `kpis.csv` com colunas `METRIC_ID,VALUE`).
3. **Resultados web**: gere um CSV equivalente a partir da camada web/Snowflake
   em `web/api-results/` (mesmas chaves e coluna de valor).
4. **Comparar**:

   ```bash
   python validation/compare-results.py \
     --expected validation/dashboards/<slug>/powerbi/expected-results/kpis.csv \
     --actual   validation/dashboards/<slug>/web/api-results/kpis.csv \
     --key METRIC_ID --value VALUE --tolerance 0.01 \
     --out validation/dashboards/<slug>/diffs/kpis-diff.csv
   ```

## Tolerância

- Padrão: **relativa de 1%** (`--tolerance 0.01`).
- Use `--abs-tolerance` para métricas próximas de zero.
- Acorde a tolerância com o responsável de negócio e registre em
  `validation-notes.md`.

## Filtros e períodos

Compare os **mesmos filtros** e **mesmos períodos** dos dois lados. Liste os
filtros obrigatórios e os períodos de teste no `validation-notes.md`.

## Quem valida

A paridade técnica é necessária, mas a **validação final é de negócio**: um
responsável da área confirma e assina. Registre nome e data.

## Próximo

Leia `08-deploy-vercel.md`.
