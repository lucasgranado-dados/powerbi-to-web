# 05 — Fluxo de prompts

Os prompts em `prompts/` orientam a IA da sua IDE por etapas. Rode-os **na ordem**,
substituindo `{{DASHBOARD_SLUG}}` pelo slug do dashboard.

## Ordem

1. **`00-contexto-geral.md`** — carrega o contexto do boilerplate, stack e regras.
2. **`01-diagnostico-pbip-tmdl-pbir.md`** — analisa o PBIP e gera `diagnostico.md`.
3. **`02-definir-stack-e-arquitetura.md`** — define a arquitetura do dashboard.
4. **`03-revisar-medidas-dax-complexas.md`** — revisa/classifica as medidas DAX
   complexas (DAX Review Layer) antes de traduzi-las. Ver `04-revisao-medidas-dax-complexas.md`.
5. **`04-mapear-snowflake-camada-ouro.md`** — mapeia medidas/visual → camada ouro,
   cria `source-map` e queries.
6. **`05-gerar-pagina-web.md`** — recria a primeira versão funcional da página.
7. **`06-conectar-dados-ou-criar-mocks.md`** — conecta Snowflake ou cria mocks.
8. **`07-validacao-paridade.md`** — monta a estrutura de validação.
9. **`08-auditoria-autenticacao.md`** — audita a camada de autenticação.
10. **`09-implementar-autenticacao.md`** — pluga/corrige a autenticação (se preciso).
11. **`10-validar-autenticacao.md`** — valida login, proteção de rota e iframe.
12. **`11-revisao-final-e-pr.md`** — roda checagens e prepara o PR.

> Revisão de DAX complexo (03) vem **antes** do mapeamento Snowflake (04).
> Autenticação (08–10) vem **antes** da revisão final (11). A camada já nasce no
> boilerplate; ver `11-autenticacao-auth-js.md`.

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

Leia `06-arquitetura-next.md`.
