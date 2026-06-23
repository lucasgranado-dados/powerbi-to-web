# Prompt 04 — Mapear Snowflake (camada ouro)

Mapeie as medidas/visual do Power BI de `{{DASHBOARD_SLUG}}` para a **camada
ouro do Snowflake** e crie as queries iniciais.

## Entrada

- `docs/dashboards/{{DASHBOARD_SLUG}}/diagnostico.md`
- TMDL/PBIR em `powerbi-input/{{DASHBOARD_SLUG}}/`
- Padrões do `_template` (queries, source-map, adapters).

## Tarefas

1. A partir do diagnóstico e do TMDL/PBIR, identifique **campos, medidas e
   filtros** necessários.
2. Mapeie cada um para **tabelas/views da camada ouro**:
   - preencha `snowflake/mappings/{{DASHBOARD_SLUG}}.source-map.json` e a versão
     tipada `src/features/dashboards/{{DASHBOARD_SLUG}}/source-map.ts`;
   - se **não houver evidência** do nome real, use `CHANGE_ME_*` e marque
     `pending_mapping`/`pending_validation`.
3. Crie as **queries SQL** iniciais em
   `snowflake/queries/dashboards/{{DASHBOARD_SLUG}}/` (kpis, chart-series,
   detail-table), com comentários (visual/medida/filtros/campos/validação) e
   binds `?`.
4. Reflita as queries em
   `src/features/dashboards/{{DASHBOARD_SLUG}}/queries.ts` e implemente as
   funções de busca em `snowflake-queries.ts` (fetch + adapt + fallback).
5. Atualize `adapters.ts` e `metrics.ts` (rastreabilidade PBI ↔ SF ↔ componente).

## Regras

- **Não invente** nomes de tabela/coluna/medida.
- Toda transformação que não for cópia direta do DAX vira **pendência**
  documentada em `validation-notes.md`.

## Saída

Arquivos acima atualizados + pendências documentadas.
