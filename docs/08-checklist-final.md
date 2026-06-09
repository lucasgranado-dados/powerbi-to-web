# 08 — Checklist final

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
