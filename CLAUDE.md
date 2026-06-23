# CLAUDE.md

Guia para o Claude Code (e outros agentes) neste repositório. Vale o conteúdo de
`AGENTS.md` — abaixo, os pontos essenciais.

## Contexto

Boilerplate para migrar dashboards **Power BI** para **web (Next.js App Router)**
consumindo **Snowflake (camada ouro)** server-side. Stack: Next.js · React · TS ·
Tailwind v4 · shadcn/ui · Recharts · snowflake-sdk · Vitest · Playwright.

## Sempre

- Ler `README.md` e `docs/` antes de alterar código.
- Usar **TMDL/PBIR** como fonte de verdade do dashboard original.
- Priorizar **Snowflake camada ouro** como fonte de dados real.
- Manter o padrão do `_template`.
- Rodar `lint`, `typecheck`, `test`, `build` ao finalizar.
- Explicar os arquivos criados/alterados.
- Atualizar `validation-notes.md` do dashboard.

## Nunca

- Inventar regra de negócio.
- Inventar nomes de tabela/coluna/medida sem evidência (use `CHANGE_ME_*`).
- Expor segredos no frontend (`NEXT_PUBLIC_` é só para dados públicos).
- Acessar Snowflake fora de `src/server/snowflake`.
- Colocar regra crítica de negócio em componentes React.
- Expor `AUTH_*` no client ou desabilitar o `middleware.ts` (login Google restrito
  ao domínio corporativo) sem autorização. Auth só em `src/server/auth`.

## Skills

Use as skills de `.claude/skills/` para conduzir cada etapa (disparam por
descrição ou via `/<nome>`): `migrar-dashboard` (orquestrador), `pbip-diagnostico`,
`dax-review` (revisão de medidas DAX complexas), `snowflake-mapeamento`,
`gerar-dashboard-web`, `validar-paridade`, `auth-nextauth`, `deploy-vercel`,
`recharts`, `snowflake-semanticview`. Elas referenciam `prompts/` e `docs/`.

Medidas DAX complexas (que dependem de contexto de filtro) passam pela **DAX
Review Layer** antes de virar SQL/TS: prefira **bloquear** uma tradução insegura
a gerar SQL incorreto. Ver `dax-review/` e `docs/04-revisao-medidas-dax-complexas.md`.

## Comandos úteis

```bash
npm run dashboard:init -- --slug <slug>
npm run pbip:check -- --slug <slug>
npm run pbip:inventory -- --slug <slug>
npm run dax:extract -- --slug <slug>
npm run dax:classify -- --slug <slug>
npm run dax:review-cards -- --slug <slug>
npm run validation:init -- --slug <slug>
npm run snowflake:check
npm run snowflake:test
npm run dev | lint | typecheck | test | build
```

## Comandos não-interativos

`init` e demais scripts aceitam `--slug` e `--force`. Para evitar prompts, passe
sempre os argumentos explicitamente.
