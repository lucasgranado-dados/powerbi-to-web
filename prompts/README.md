# Prompts internos

Prompts em português para guiar a IA da IDE na migração de um dashboard.
Substitua `{{DASHBOARD_SLUG}}` pelo slug real (ex.: `vendas-por-hora`).

## Ordem de uso

1. `00-contexto-geral.md`
2. `01-diagnostico-pbip-tmdl-pbir.md`
3. `02-definir-stack-e-arquitetura.md`
4. `03-revisar-medidas-dax-complexas.md`
5. `04-mapear-snowflake-camada-ouro.md`
6. `05-gerar-pagina-web.md`
7. `06-conectar-dados-ou-criar-mocks.md`
8. `07-validacao-paridade.md`
9. `08-auditoria-autenticacao.md`
10. `09-implementar-autenticacao.md`
11. `10-validar-autenticacao.md`
12. `11-revisao-final-e-pr.md`

A **revisão de medidas DAX complexas** (`03`, DAX Review Layer) vem **antes** do
mapeamento Snowflake (`04`): medidas dependentes de contexto de filtro precisam
ser classificadas/validadas para não serem traduzidas de forma ingênua. Guia:
`docs/04-revisao-medidas-dax-complexas.md`.

Os prompts **08–10** (autenticação) vêm **antes** da revisão final (`11`): a
camada de auth (Auth.js + Google, restrita ao domínio corporativo) já nasce no
boilerplate, então auditar → corrigir → validar antecede o PR/deploy. Guia:
`docs/11-autenticacao-auth-js.md`.

## Como usar

- Comece sempre pelo `00` para carregar o contexto.
- Rode um prompt por vez, revisando a saída antes de avançar.
- A IA **não deve inventar** regra de negócio nem nomes de tabela/coluna.
- Pendências vão para `src/features/dashboards/{{DASHBOARD_SLUG}}/validation-notes.md`.

Veja também `docs/05-fluxo-de-prompts.md`.
