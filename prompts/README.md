# Prompts internos

Prompts em português para guiar a IA da IDE na migração de um dashboard.
Substitua `{{DASHBOARD_SLUG}}` pelo slug real (ex.: `vendas-por-hora`).

## Ordem de uso

1. `00-contexto-geral.md`
2. `01-diagnostico-pbip-tmdl-pbir.md`
3. `02-definir-stack-e-arquitetura.md`
4. `03-mapear-snowflake-camada-ouro.md`
5. `04-gerar-pagina-web.md`
6. `05-conectar-dados-ou-criar-mocks.md`
7. `06-validacao-paridade.md`
8. `07-revisao-final-e-pr.md`

## Como usar

- Comece sempre pelo `00` para carregar o contexto.
- Rode um prompt por vez, revisando a saída antes de avançar.
- A IA **não deve inventar** regra de negócio nem nomes de tabela/coluna.
- Pendências vão para `src/features/dashboards/{{DASHBOARD_SLUG}}/validation-notes.md`.

Veja também `docs/04-fluxo-de-prompts.md`.
