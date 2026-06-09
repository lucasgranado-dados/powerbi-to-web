# Snowflake — queries e mapeamentos

Esta pasta concentra o **SQL versionado** e o **mapeamento Power BI → camada ouro**
de cada dashboard. A conexão acontece **apenas no servidor** (`src/server/snowflake`).

## Estrutura

```text
snowflake/
├── queries/
│   └── dashboards/
│       └── <slug>/
│           ├── kpis.sql          # alimenta os KpiCard
│           ├── chart-series.sql  # alimenta o gráfico
│           └── detail-table.sql  # alimenta a tabela de detalhe
└── mappings/
    └── <slug>.source-map.json    # mapeia medidas/visual PBI -> tabela/view ouro
```

## Princípios

- **Fonte de verdade do SQL para revisão** são os arquivos `.sql` (com comentários
  explicando visual, medida PBI substituída, filtros, campos e o que validar).
- O runtime executa o SQL a partir de constantes em
  `src/features/dashboards/<slug>/queries.ts` (espelho dos `.sql`) — isso evita
  leitura de arquivos em disco no empacotamento serverless da Vercel. **Mantenha
  os dois lados em sincronia.**
- **Nunca** invente nomes de tabela/coluna. Use placeholders `CHANGE_ME_*` até
  confirmar com evidência (TMDL/PBIR + responsável de negócio).
- Use binds posicionais (`?`) para filtros — nunca concatene valores na string.

## Mapeamento (`source-map.json`)

Cada entrada liga uma **medida/visual do Power BI** a uma **tabela/view da camada
ouro** e ao **componente** que a exibe, com um `status`:

- `pending_mapping` — ainda não há fonte identificada;
- `pending_validation` — mapeado, aguardando validação de negócio;
- `validated` — confirmado contra o Power BI.

A versão tipada vive em `src/features/dashboards/<slug>/source-map.ts`.
