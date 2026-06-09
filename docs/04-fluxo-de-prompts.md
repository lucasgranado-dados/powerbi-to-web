# 04 — Fluxo de prompts

Os prompts em `prompts/` orientam a IA da sua IDE por etapas. Rode-os **na ordem**,
substituindo `{{DASHBOARD_SLUG}}` pelo slug do dashboard.

## Ordem

1. **`00-contexto-geral.md`** — carrega o contexto do boilerplate, stack e regras.
2. **`01-diagnostico-pbip-tmdl-pbir.md`** — analisa o PBIP e gera `diagnostico.md`.
3. **`02-definir-stack-e-arquitetura.md`** — define a arquitetura do dashboard.
4. **`03-mapear-snowflake-camada-ouro.md`** — mapeia medidas/visual → camada ouro,
   cria `source-map` e queries.
5. **`04-gerar-pagina-web.md`** — recria a primeira versão funcional da página.
6. **`05-conectar-dados-ou-criar-mocks.md`** — conecta Snowflake ou cria mocks.
7. **`06-validacao-paridade.md`** — monta a estrutura de validação.
8. **`07-revisao-final-e-pr.md`** — roda checagens e prepara o PR.

## Como usar (exemplo)

1. Abra o chat de IA da IDE com o repositório no contexto.
2. Cole o conteúdo de `prompts/00-contexto-geral.md`.
3. Cole o `prompts/01-...` substituindo `{{DASHBOARD_SLUG}}` por, ex., `vendas-por-hora`.
4. Revise a saída, ajuste e só então avance para o próximo prompt.

## Regras transversais (todos os prompts)

- TMDL/PBIR são **fonte de verdade**; Snowflake camada ouro é a **fonte de dados**.
- **Não inventar** regra de negócio nem nomes de tabela/coluna sem evidência.
- **Documentar pendências** em `validation-notes.md`.
- **Nunca expor segredos** no frontend.

## Próximo

Leia `05-arquitetura-next.md`.
