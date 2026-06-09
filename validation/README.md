# Validação de paridade

Esta pasta organiza a comparação entre os valores do **Power BI** (referência) e
os valores produzidos pela **camada web/Snowflake**.

## Estrutura

```text
validation/
├── requirements.txt          # deps Python (pandas, ...)
├── compare-results.py        # compara dois CSVs
├── powerbi/
│   ├── dax-queries/          # consultas DAX usadas no Power BI
│   └── expected-results/     # CSVs esperados (exportados do Power BI)
├── web/
│   └── api-results/          # CSVs gerados pela web/Snowflake
└── dashboards/
    └── <slug>/               # validação por dashboard (criada por validation:init)
        ├── powerbi/{dax-queries,expected-results}
        ├── web/api-results
        └── diffs/
```

## Preparar o ambiente Python

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r validation/requirements.txt
```

## Comparar resultados

```bash
python validation/compare-results.py \
  --expected validation/dashboards/<slug>/powerbi/expected-results/kpis.csv \
  --actual   validation/dashboards/<slug>/web/api-results/kpis.csv \
  --key METRIC_ID --value VALUE --tolerance 0.01 \
  --out validation/dashboards/<slug>/diffs/kpis-diff.csv
```

O script reporta, por linha: diferença absoluta, diferença percentual e status
(`APROVADO`/`REPROVADO`/`FALTANTE`), além de um resumo. Encerra com código de
erro se houver reprovações.

## Quem valida

A paridade técnica é necessária, mas **a validação final é de negócio**: um
responsável da área deve confirmar que os números batem com o Power BI original.
Registre o responsável e a data em `src/features/dashboards/<slug>/validation-notes.md`.
