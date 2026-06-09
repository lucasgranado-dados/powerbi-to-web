# Prompt 02 — Definir stack e arquitetura

Com base no diagnóstico de `{{DASHBOARD_SLUG}}`, defina a arquitetura da página
web. **Ainda não recrie a tela inteira.**

## Entrada

- `docs/dashboards/{{DASHBOARD_SLUG}}/diagnostico.md`
- Padrões do `_template`.

## Tarefas

1. Leia o diagnóstico.
2. Defina a **arquitetura do dashboard**:
   - layout/páginas web (uma rota ou várias seções?);
   - quais **componentes reutilizáveis** usar (`DashboardHeader`,
     `DashboardFilters`, `KpiCard`, `ChartCard`, `DataTable`, `EmptyState`,
     `LoadingState`);
   - quais **gráficos** e a biblioteca: **Recharts** por padrão; **ECharts** só
     se houver necessidade comprovada (mapa, sankey, grande volume) — **justifique**;
   - **filtros** e como serão aplicados (server-side preferencialmente);
   - estratégia de **data fetching server-side** e cache (`revalidate`).
3. Use a stack obrigatória (Next.js App Router, TS, Tailwind v4, shadcn/ui).

## Saída

- Crie/atualize `docs/dashboards/{{DASHBOARD_SLUG}}/arquitetura.md`.
- Opcionalmente, crie a **base técnica** (rota vazia + esqueleto de contracts) se
  ajudar — mas **não** implemente os dados ainda.

Registre decisões e trade-offs (ex.: Recharts vs ECharts) também em
`src/features/dashboards/{{DASHBOARD_SLUG}}/validation-notes.md`.
