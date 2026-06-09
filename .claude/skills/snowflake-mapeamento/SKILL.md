---
name: snowflake-mapeamento
description: >-
  Mapeia medidas e visuais do Power BI para a camada ouro do Snowflake e cria as
  queries, adapters e o source-map do dashboard. Use quando o analista pedir para
  conectar os dados reais, mapear KPIs/medidas para tabelas/views da camada ouro,
  criar ou ajustar as queries SQL, contracts, adapters ou o source-map.
---

# Mapeamento Power BI → Snowflake (camada ouro)

Ligue cada medida/visual do dashboard a uma fonte real da **camada ouro** e
implemente a camada de dados server-side do repositório.

## Regras-guarda

- **Não invente** nomes de tabela/view/coluna/medida. Sem evidência, use
  `CHANGE_ME_*` e marque `pending_mapping` / `pending_validation`.
- Conexão **só server-side** (`src/server/snowflake`, `server-only`). Sem
  `NEXT_PUBLIC_` para segredos.
- SQL **isolado** em `snowflake/queries/...` e espelhado em `queries.ts` (binds `?`,
  nunca concatene valores de filtro).
- Transformação que não for cópia fiel do DAX vira **pendência** documentada.

## Passos

1. Confirme a conexão (sem imprimir segredos):
   ```bash
   npm run snowflake:check
   npm run snowflake:test
   ```
2. A partir do `diagnostico.md` + TMDL/PBIR, preencha o **source-map**:
   - `snowflake/mappings/<slug>.source-map.json`
   - `src/features/dashboards/<slug>/source-map.ts` (versão tipada — mantê-los em sincronia)
3. Escreva as **queries SQL** em `snowflake/queries/dashboards/<slug>/`
   (`kpis.sql`, `chart-series.sql`, `detail-table.sql`) com comentários
   (visual / medida PBI / filtros / campos / o que validar).
4. Reflita o SQL em `src/features/dashboards/<slug>/queries.ts` e implemente as
   funções de busca em `snowflake-queries.ts` (`executeSnowflakeQuery` + adapter +
   fallback de mock).
5. Atualize `adapters.ts` (linha bruta → contract) e `metrics.ts`
   (rastreabilidade PBI ↔ Snowflake ↔ componente, com `status`).
6. Registre pendências em `validation-notes.md`.

## Semantic views (opcional)

Se a camada ouro expõe (ou deve expor) uma **semantic view**, use a skill
**`snowflake-semanticview`** para criá-la/validá-la via `snow` CLI. A app continua
**lendo** via `src/server/snowflake` — a semantic view é só a modelagem da fonte.

## Próximo

Vá para **`gerar-dashboard-web`** (se a UI ainda não existe) e depois
**`validar-paridade`**.

## Referências

- `prompts/03-mapear-snowflake-camada-ouro.md`
- `docs/09-snowflake-camada-ouro.md`, `snowflake/README.md`
