# Prompt 06 — Conectar dados ou criar mocks

Revise a camada de dados de `{{DASHBOARD_SLUG}}` e garanta o caminho real
(Snowflake) com fallback de mock.

## Tarefas

1. Revise os **dados necessários** por componente (KPIs, série, tabela, filtros).
2. **Priorize o Snowflake**:
   - confirme que `queries.ts` reflete os `.sql`;
   - confirme que `snowflake-queries.ts` chama `executeSnowflakeQuery` e adapta;
   - rode `npm run snowflake:check` e `npm run snowflake:test`.
3. Crie/atualize **mocks** apenas como **fallback** (não como dado real) em
   `mock-data.ts`, com valores plausíveis e claramente marcados.
4. Garanta os **contracts** (`contract.ts`) e **adapters** (`adapters.ts`)
   cobrindo todos os campos usados pela UI.
5. **Documente métricas pendentes** em `metrics.ts` e `validation-notes.md`.
6. Se for necessário trocar a fonte no futuro (API/camada semântica), deixe a
   função de busca isolada para facilitar a substituição.

## Regras

- Mock nunca substitui validação de paridade.
- Sem segredos no frontend.

## Saída

Camada de dados consistente, com Snowflake como fonte primária e mock como
fallback documentado.
