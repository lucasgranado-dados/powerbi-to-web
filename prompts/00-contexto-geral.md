# Prompt 00 — Contexto geral

Você é um arquiteto sênior de software, BI e dados. Estamos migrando um dashboard
**Power BI** para uma página **web em Next.js** dentro deste repositório
boilerplate. Carregue este contexto e mantenha-o em todas as etapas seguintes.

## Objetivo

Recriar, na web, o dashboard cujo slug é `{{DASHBOARD_SLUG}}`, consumindo dados
da **camada ouro do Snowflake**, com paridade contra o Power BI original.

## Workflow

PBIP → checar TMDL/PBIR → diagnóstico → mapear Snowflake (ouro) → arquitetura →
gerar página → conectar dados/mocks → validar paridade → revisão humana →
deploy Vercel → DataHub.

## Stack obrigatória

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · shadcn/ui ·
**Recharts** (padrão) · Apache ECharts (só casos complexos, com justificativa) ·
lucide-react · snowflake-sdk (server-side) · Vitest · Playwright.

## Fontes de verdade

- **TMDL/PBIR** (em `powerbi-input/{{DASHBOARD_SLUG}}/`) = verdade técnica do
  dashboard original (páginas, visuais, medidas, DAX, relações, filtros).
- **Snowflake camada ouro** = fonte preferencial dos dados reais.

## Regras inegociáveis

1. **Não invente** regra de negócio.
2. **Não invente** nomes de tabela, view, coluna ou métrica sem evidência — use
   `CHANGE_ME_*` e registre como pendência.
3. **Credenciais nunca** vão para o frontend; nada de `NEXT_PUBLIC_` para segredos.
4. Conexão Snowflake **só server-side** (`src/server/snowflake`).
5. Componentes React **não** contêm regra crítica de negócio.
6. SQL isolado em arquivos próprios; dados passam por **adapters** antes da UI.
7. Métricas **rastreáveis** entre Power BI, Snowflake e componente.
8. **Mocks** apenas como fallback de desenvolvimento.
9. **Documente pendências** em
   `src/features/dashboards/{{DASHBOARD_SLUG}}/validation-notes.md`.

## Referência de implementação

Use o dashboard `_template` (`src/app/dashboards/_template/`,
`src/features/dashboards/_template/`, `snowflake/queries/dashboards/_template/`)
como modelo de estrutura e padrões.

Responda confirmando que entendeu o contexto e aguardando o próximo prompt.
