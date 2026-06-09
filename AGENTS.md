# AGENTS.md

Instruções para agentes de IA que trabalham neste repositório (boilerplate de
migração Power BI → Web com Next.js + Snowflake).

## Antes de alterar qualquer código

1. Leia o `README.md` e a pasta `docs/` (especialmente `00`, `05` e `09`).
2. Para um dashboard específico, leia
   `src/features/dashboards/<slug>/validation-notes.md`.
3. Use o `_template` como referência de estrutura e padrões.

## Regras inegociáveis

- **TMDL/PBIR** (em `powerbi-input/<slug>/`) são a **fonte de verdade** do
  dashboard original.
- **Snowflake camada ouro** é a **fonte preferencial dos dados reais**.
- **Nunca invente** regra de negócio.
- **Nunca invente** nomes de tabela/view/coluna/métrica sem evidência — use
  `CHANGE_ME_*` e documente a pendência.
- **Nunca exponha segredos**: sem `NEXT_PUBLIC_` para credenciais; conexão
  Snowflake só em `src/server/snowflake` (módulos `server-only`).
- **Componentes React não contêm regra crítica** — cálculos ficam em
  `adapters.ts`/`metrics.ts` e devem espelhar o DAX (ou virar pendência).
- **SQL isolado** em `snowflake/queries/...` e espelhado em `queries.ts`.
- **Dados passam por adapters** antes de chegar aos gráficos.
- **Mocks** apenas como fallback de desenvolvimento.

## Fluxo de trabalho (skills + prompts)

Há **skills** em `.claude/skills/` que guiam cada etapa e disparam por descrição
(ou via `/<nome>`): `migrar-dashboard` (orquestrador), `pbip-diagnostico`,
`snowflake-mapeamento`, `gerar-dashboard-web`, `validar-paridade`, `deploy-vercel`,
além de `recharts` e `snowflake-semanticview`. Elas **referenciam** os `prompts/`
e `docs/` — mesma fonte de verdade.

Para conduzir manualmente, siga `prompts/00`..`07` na ordem (ver
`docs/04-fluxo-de-prompts.md`).

## Ao terminar uma tarefa

- Rode e garanta que passam:

  ```bash
  npm run lint
  npm run typecheck
  npm run test
  npm run build
  ```

- **Explique os arquivos criados/alterados** no resumo.
- **Atualize** `src/features/dashboards/<slug>/validation-notes.md` com decisões
  e pendências.

## Estrutura (resumo)

- `src/app/dashboards/<slug>/` — rota (Server Component) + loading/error.
- `src/features/dashboards/<slug>/` — contract, mock, adapters, metrics, queries,
  snowflake-queries, source-map, validation-notes.
- `src/components/{dashboard,ui}/` — componentes reutilizáveis.
- `src/server/snowflake/` — conexão/execução (server-only).
- `snowflake/`, `validation/`, `docs/`, `prompts/`, `scripts/`.
