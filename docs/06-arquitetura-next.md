# 06 — Arquitetura Next.js

## App Router

Usamos o **App Router** (`src/app`). Cada dashboard é uma rota em
`src/app/dashboards/<slug>/` com `page.tsx`, `loading.tsx` e `error.tsx`.

## Separação de responsabilidades

```text
src/
├── app/                         # rotas (UI da página, Server Components)
│   └── dashboards/<slug>/
├── features/                    # lógica/dados POR dashboard
│   └── dashboards/<slug>/
│       ├── contract.ts          # tipos consumidos pela UI
│       ├── mock-data.ts         # fallback de desenvolvimento
│       ├── adapters.ts          # linha bruta Snowflake -> contract
│       ├── metrics.ts           # rastreabilidade PBI ↔ SF ↔ componente
│       ├── queries.ts           # SQL (texto) espelhando os .sql
│       ├── snowflake-queries.ts # funções server-side (fetch + adapt + fallback)
│       └── source-map.ts        # mapeamento tipado
├── components/
│   ├── dashboard/               # componentes reutilizáveis (sem regra de negócio)
│   └── ui/                       # primitivos shadcn/ui
├── server/snowflake/            # conexão e execução (SERVER-ONLY)
├── server/auth/                 # Auth.js: config, allowlist, NextAuth() (SERVER)
└── lib/                         # formatters, chart-utils, cn()
```

`middleware.ts` (raiz) protege as rotas; `src/app/api/auth/[...nextauth]` e
`src/app/auth/*` cobrem os fluxos de login. Detalhes em `11-autenticacao-auth-js.md`.

## Fluxo de dados

```text
[.sql] —espelhado→ queries.ts ─┐
                                ├→ snowflake-queries.ts (executeSnowflakeQuery)
adapters.ts ←——linha bruta——————┘
   │
   ▼
contract.ts (tipos)  →  page.tsx (Server Component)  →  componentes
                                   │
                          fallback: mock-data.ts
```

## Princípios

- **Server-side data fetching**: a página é um Server Component `async` que chama
  `getXDashboardData()`. O browser nunca toca o Snowflake.
- **UI sem regra crítica**: componentes recebem dados por props. Cálculos ficam
  em adapters/metrics e devem refletir o DAX original (ou virar pendência).
- **Queries isoladas**: SQL vive em arquivos `.sql` (revisão) e em `queries.ts`
  (runtime). Use binds `?`.
- **Contracts**: os componentes só conhecem os tipos do `contract.ts`.
- **Mocks só como fallback** de desenvolvimento.
- **Autenticação**: toda rota é protegida pelo `middleware.ts` (login Google
  restrito ao domínio corporativo). Credenciais `AUTH_*` só no servidor.

## Gráficos

- **Recharts** é o padrão. Use um Client Component para o gráfico (ex.:
  `SeriesChart.tsx`) e o `ChartCard` para o contêiner.
- **Apache ECharts** apenas para casos complexos (mapas, sankey, grande volume),
  com justificativa registrada em `validation-notes.md`.

## Cache

`export const revalidate = <segundos>` na página controla o cache server-side.
Use `DASHBOARD_CACHE_SECONDS` como referência de configuração.

## Próximo

Leia `07-validacao-paridade.md`.
