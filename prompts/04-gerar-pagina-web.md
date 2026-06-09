# Prompt 04 — Gerar a página web

Recrie a **primeira versão funcional** da página de `{{DASHBOARD_SLUG}}`.

## Entrada

- Diagnóstico e arquitetura em `docs/dashboards/{{DASHBOARD_SLUG}}/`.
- `source-map`, `queries.ts`, `snowflake-queries.ts`, `adapters.ts`, `contract.ts`.
- Padrões do `_template`.

## Tarefas

1. Implemente `src/app/dashboards/{{DASHBOARD_SLUG}}/page.tsx` como **Server
   Component** que busca os dados via `snowflake-queries.ts`.
2. Use TMDL/PBIR como **referência visual** (layout, ordem, agrupamentos).
3. Monte a UI com os **componentes base**: header, filtros, KPIs, gráfico
   (Recharts via Client Component), tabela.
4. Implemente `loading.tsx`, `error.tsx` e o estado **empty** (EmptyState).
5. Garanta **responsividade** e boa aparência padrão (Tailwind/shadcn).
6. Use **mocks** apenas se o Snowflake não estiver configurado (fallback já
   previsto em `snowflake-queries.ts`).

## Regras

- Sem regra de negócio nos componentes; cálculos ficam em adapters/metrics.
- Sem segredos no client; nada de acesso direto ao Snowflake no browser.

## Saída

Página funcional + estados (loading/error/empty). Liste o que ficou pendente em
`validation-notes.md`.
