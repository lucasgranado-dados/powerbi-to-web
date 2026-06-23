# 09 — Checklist final

Use antes de abrir o PR.

## Origem e diagnóstico

- [ ] PBIP copiado para `powerbi-input/<slug>/`
- [ ] TMDL encontrado (`npm run pbip:check`)
- [ ] PBIR encontrado
- [ ] Inventário gerado (`npm run pbip:inventory`)
- [ ] `diagnostico.md` criado

## Mapeamento e dados

- [ ] Mapeamento Snowflake criado (`source-map` sem `CHANGE_ME`)
- [ ] Queries SQL criadas e apontando para tabelas/views reais
- [ ] Contracts criados
- [ ] Adapters criados
- [ ] Métricas documentadas em `metrics.ts`
- [ ] Mocks identificados (apenas como fallback)

## Página

- [ ] Página criada (header, filtros, KPIs, gráfico, tabela)
- [ ] Estados de loading, error e empty implementados
- [ ] Responsiva

## Segurança

- [ ] Sem segredos no frontend (nenhum `NEXT_PUBLIC_` sensível)
- [ ] Conexão Snowflake apenas server-side
- [ ] Variáveis `AUTH_*` configuradas (local e Vercel), nenhuma como `NEXT_PUBLIC_`

## Autenticação

- [ ] Rota protegida sem sessão redireciona para `/auth/signin`
- [ ] Login com conta corporativa (`@suno.com.br`/`@sunoresearch.com.br`) entra
- [ ] Conta fora do domínio é barrada (`/auth/error`)
- [ ] `/healthz` e `/api/auth/*` respondem sem autenticação
- [ ] Redirect URI cadastrada no Google bate com a URL do deploy
- [ ] `DATAHUB_FRAME_ANCESTORS` definido e dashboard abre embutido autenticado

## Qualidade

- [ ] `npm run lint` passou
- [ ] `npm run typecheck` passou
- [ ] `npm run test` passou
- [ ] `npm run build` passou

## Validação e entrega

- [ ] Estrutura de validação criada (`npm run validation:init`)
- [ ] Deploy preview criado (Vercel)
- [ ] Validação de negócio realizada **ou** pendência documentada em `validation-notes.md`
- [ ] PR aberto com o template preenchido
