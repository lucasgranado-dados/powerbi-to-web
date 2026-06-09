---
name: gerar-dashboard-web
description: >-
  Gera a página web (Next.js App Router) de um dashboard migrado, seguindo os
  padrões deste repositório. Use quando o analista pedir para recriar a tela,
  montar a página do dashboard, criar a UI (header, filtros, KPIs, gráfico,
  tabela) ou os estados de loading/error/empty em Next.js.
---

# Gerar a página web do dashboard

Recrie a primeira versão funcional da página, fiel ao Power BI original e
seguindo a arquitetura do repositório. **Esta skill substitui padrões genéricos
de Next.js — siga as convenções abaixo, que são específicas deste projeto.**

## Convenções OBRIGATÓRIAS deste repo (não use padrões genéricos)

- App Router em **`src/app/`** (não `app/`). Alias de import: **`@/` → `src/`**.
- A página é um **Server Component `async`** em
  `src/app/dashboards/<slug>/page.tsx` que busca os dados via
  `src/features/dashboards/<slug>/snowflake-queries.ts` (server-side, com fallback
  de mock). **Nunca** busque dados do Snowflake no client nem com `useEffect`.
- Crie `loading.tsx` e `error.tsx` na mesma pasta (o `error.tsx` é Client
  Component e **não** expõe detalhes sensíveis).
- Cache server-side: `export const revalidate = <segundos>` (referência:
  `DASHBOARD_CACHE_SECONDS`).
- Use os **componentes reutilizáveis** de `src/components/dashboard/`:
  `DashboardHeader`, `DashboardFilters`, `KpiCard`, `ChartCard`, `DataTable`,
  `EmptyState`, `LoadingState`. Eles recebem dados por props — **sem regra de
  negócio** dentro deles.
- Gráficos: **Recharts** dentro de um **Client Component** (ex.: `SeriesChart.tsx`)
  embrulhado por `ChartCard`. Veja a skill **`recharts`**. ECharts só com
  justificativa registrada em `validation-notes.md`.
- Tipos vêm do `contract.ts`; a UI não conhece a linha bruta do Snowflake.

## Passos

1. Garanta que `contract.ts`, `mock-data.ts` e (se já houver) `adapters.ts`/
   `snowflake-queries.ts` existem para o slug (criados por `dashboard:init` e pela
   skill `snowflake-mapeamento`).
2. Implemente `page.tsx` (Server Component) montando header → filtros → KPIs →
   gráfico → tabela, com os componentes base. Use os formatadores de
   `src/lib/formatters.ts`.
3. Implemente `loading.tsx` (use `LoadingState`) e `error.tsx`.
4. Trate o **estado vazio** (`EmptyState`) quando não houver linhas.
5. Garanta **responsividade** (grid Tailwind) e bom visual padrão.
6. Use **mock** apenas se o Snowflake não estiver configurado (o fallback já está
   em `snowflake-queries.ts`). Registre pendências em `validation-notes.md`.

> Referência viva: o dashboard `_template` (`src/app/dashboards/_template/` +
> `src/features/dashboards/_template/`) é o modelo a imitar.

## Próximo

Vá para **`snowflake-mapeamento`** (se faltam dados reais) e **`validar-paridade`**.

## Referências

- `prompts/04-gerar-pagina-web.md`, `prompts/05-conectar-dados-ou-criar-mocks.md`
- `docs/05-arquitetura-next.md`
