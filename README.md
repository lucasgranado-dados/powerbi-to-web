# Power BI to Web Boilerplate

Kit interno para **migrar dashboards Power BI para páginas web em Next.js**,
consumindo dados tratados no **Snowflake (camada ouro)**. Não é só um app: é um
**kit de migração** com app + docs + scripts + prompts de IA + componentes +
camada Snowflake server-side + validação de paridade + CI.

> 📄 **Manual simplificado (PDF):** [`docs/manual-powerbi-para-web.pdf`](docs/manual-powerbi-para-web.pdf)
> — visão de ponta a ponta para analistas. Regenere com
> `python docs/manual/build-pdf.py` (requer `pip install reportlab`).

## 1. O que é

Um repositório **template** para clonar a cada migração. Padroniza arquitetura,
torna as métricas **rastreáveis** (Power BI ↔ Snowflake ↔ componente) e garante
que **credenciais nunca** vão para o frontend.

## 2. Quando usar

Quando um dashboard Power BI precisa virar uma página web governada, com dados
reais do Snowflake e paridade validada contra o original.

## 3. Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · shadcn/ui ·
**Recharts** (padrão) · Apache ECharts (casos complexos) · lucide-react ·
snowflake-sdk (server-side) · Vitest · Playwright · Python/Pandas (validação) ·
GitHub Actions · Vercel.

## 4. Workflow resumido

```text
PBIP → checar TMDL/PBIR → diagnóstico (IA) → mapear Snowflake (ouro) →
arquitetura → gerar página → conectar dados/mocks → validar paridade →
revisão humana → deploy Vercel → DataHub
```

## 5. Quickstart

```bash
git clone <repo-template>
cd powerbi-to-web-boilerplate
npm install
npm run doctor                  # confere se o ambiente está pronto (em português)
cp .env.example .env.local      # preencha SNOWFLAKE_* (não versione)
npm run dev                     # http://localhost:3000
```

Veja o dashboard de exemplo em `/dashboards/_template` (usa mock até configurar o
Snowflake).

> 🧭 **Pouca experiência com dev?** Comece por `npm run doctor` (diz o que falta) e
> depois `npm run migrate` (um wizard que cria a estrutura e te diz o próximo passo).

## 6. Como exportar o PBIP

No Power BI Desktop, habilite **PBIP**, **TMDL** e **PBIR** em Preview features e
salve como `.pbip`. Passo a passo: [`docs/02-exportar-pbip.md`](docs/02-exportar-pbip.md).

## 7. Copiar o PBIP para `powerbi-input/`

```bash
npm run dashboard:init -- --slug vendas-por-hora
cp -r /caminho/do/export/* powerbi-input/vendas-por-hora/
```

## 8. Checar TMDL/PBIR

```bash
npm run pbip:check -- --slug vendas-por-hora
npm run pbip:inventory -- --slug vendas-por-hora
```

Interpretação dos resultados: [`docs/03-checar-tmdl-pbir.md`](docs/03-checar-tmdl-pbir.md).

## 9. Configurar o Snowflake

```bash
# variáveis em .env.local (ver .env.example)
npm run snowflake:check         # confere variáveis (sem imprimir valores)
npm run snowflake:test          # SELECT CURRENT_VERSION()
```

Detalhes: [`docs/09-snowflake-camada-ouro.md`](docs/09-snowflake-camada-ouro.md).

## 10. Iniciar um dashboard

```bash
npm run dashboard:init -- --slug <slug>
npm run validation:init -- --slug <slug>
```

Cria as pastas/arquivos base (app, features, docs, validação, queries, mapping) a
partir do `_template`. É **idempotente** (use `--force` para sobrescrever).

## 11. Usar os prompts de IA

Na sua IDE com IA, rode `prompts/00`..`07` na ordem, substituindo
`{{DASHBOARD_SLUG}}`. Guia: [`docs/04-fluxo-de-prompts.md`](docs/04-fluxo-de-prompts.md).

## 12. Rodar local

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## 13. Validar paridade

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r validation/requirements.txt
python validation/compare-results.py \
  --expected validation/dashboards/<slug>/powerbi/expected-results/kpis.csv \
  --actual   validation/dashboards/<slug>/web/api-results/kpis.csv \
  --key METRIC_ID --value VALUE --tolerance 0.01
```

Detalhes: [`docs/06-validacao-paridade.md`](docs/06-validacao-paridade.md).

## 14. Deploy na Vercel

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # produção
```

Configure as variáveis `SNOWFLAKE_*` no painel da Vercel (nunca `NEXT_PUBLIC_`
para segredos). Detalhes: [`docs/07-deploy-vercel.md`](docs/07-deploy-vercel.md).

## 15. Abrir PR

Use o template em `.github/pull_request_template.md` e preencha o checklist.

## 16. Checklist final

Veja [`docs/08-checklist-final.md`](docs/08-checklist-final.md).

---

## Estrutura

```text
.
├── powerbi-input/      # PBIP por dashboard (ignorado pelo git)
├── docs/               # documentação operacional (00..09 + dashboards/)
├── prompts/            # prompts de IA (00..07)
├── scripts/            # automação (init, check-pbip, inventory, snowflake, ...)
├── snowflake/          # queries SQL + mappings (source-map)
├── validation/         # comparação de paridade (Python)
├── src/
│   ├── app/            # rotas (App Router)
│   ├── components/     # dashboard/ + ui/ (shadcn)
│   ├── features/       # lógica/dados por dashboard
│   ├── server/snowflake/  # conexão server-only
│   └── lib/            # formatters, chart-utils, cn()
├── tests/              # unit (Vitest) + e2e (Playwright)
└── .github/            # CI + templates de PR/Issue
```

## Scripts (package.json)

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `start` | Build / produção |
| `npm run lint` / `typecheck` | Qualidade |
| `npm run test` / `test:e2e` | Vitest / Playwright |
| `npm run doctor` | Pré-voo: checa se o ambiente está pronto (Node, deps, Snowflake…) |
| `npm run migrate` | **Wizard guiado**: cria a estrutura e encadeia os primeiros passos |
| `npm run dashboard:init -- --slug X` | Cria a estrutura de um dashboard |
| `npm run pbip:check -- --slug X` | Valida o PBIP |
| `npm run pbip:inventory -- --slug X` | Gera inventário do PBIP |
| `npm run validation:init -- --slug X` | Cria pastas de validação |
| `npm run snowflake:check` | Confere variáveis do Snowflake |
| `npm run snowflake:test` | Testa a conexão Snowflake |
| `npm run validate:python` | Comparação de paridade (Python) |

## Skills de IA (`.claude/skills/`)

O repositório traz **skills** do Claude Code que guiam a migração. Elas **disparam
sozinhas** quando o pedido casa com a descrição e também podem ser chamadas por
`/<nome>`. Como são versionadas, todo analista que clonar já as tem.

**Fluxo de migração:**

| Skill | Quando |
| --- | --- |
| `migrar-dashboard` | Porta de entrada — orquestra o pipeline ponta a ponta |
| `pbip-diagnostico` | Checar/inventariar o PBIP e gerar o diagnóstico |
| `snowflake-mapeamento` | Mapear medidas → camada ouro, queries, adapters, source-map |
| `gerar-dashboard-web` | Recriar a página (Server Component + componentes do repo) |
| `validar-paridade` | Comparar números web × Power BI (CSV/tolerância) |
| `deploy-vercel` | Deploy na Vercel + env vars + DataHub |

**Conhecimento:** `recharts` (gráficos no padrão `ChartCard`/`chart-utils`) ·
`snowflake-semanticview` (criar/validar semantic views via `snow` CLI).

> Skills são guia/procedimento (não automação). Para "sempre rode X após Y", use
> hooks em `.claude/settings.json`. As skills referenciam `prompts/` e `docs/`
> como fonte única de verdade.

## shadcn/ui

Já vêm vendorizados os primitivos usados pelo template (`button`, `card`,
`table`, `skeleton`, `badge`, `input`, `select`, `separator`, `alert`). Para
adicionar outros:

```bash
npx shadcn@latest add tabs scroll-area dropdown-menu
```

## Princípios

Veja [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md). Em resumo: TMDL/PBIR são
verdade técnica; Snowflake ouro é a fonte de dados; não inventar regra/nome;
segredos só no servidor; mocks só como fallback; tudo rastreável e revisável.
