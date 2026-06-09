---
name: migrar-dashboard
description: >-
  Orquestra a migração de um dashboard Power BI para uma página web (Next.js +
  Snowflake) neste boilerplate. Use quando o analista pedir para migrar, recriar
  ou "passar para web" um dashboard Power BI, ou quando perguntar por onde começar
  a migração. Conduz o pipeline ponta a ponta e aciona as skills de cada etapa.
---

# Migrar dashboard (orquestrador)

Você está conduzindo a migração de um dashboard Power BI para web dentro deste
repositório. Esta skill é a **porta de entrada**: estabelece o contexto, executa
a inicialização e encaminha para a skill certa em cada passo.

## Regras-guarda (inegociáveis)

1. **TMDL/PBIR** (`powerbi-input/<slug>/`) são a **fonte de verdade** do original.
2. **Snowflake camada ouro** é a **fonte preferencial dos dados reais**.
3. **Nunca invente** regra de negócio nem nomes de tabela/coluna/medida — use
   `CHANGE_ME_*` e registre a pendência.
4. **Sem segredos no frontend**: nada de `NEXT_PUBLIC_` para credenciais; conexão
   Snowflake só em `src/server/snowflake` (módulos `server-only`).
5. **Mocks** apenas como fallback de desenvolvimento.
6. **Documente pendências** em `src/features/dashboards/<slug>/validation-notes.md`.
7. Termine com **revisão humana** e **validação de negócio**.

## Pipeline (10 passos)

| # | Etapa | Como conduzir |
| --- | --- | --- |
| 1 | Receber o dashboard | Confirme slug, dono de negócio, fonte e objetivo. |
| 2 | Exportar PBIP | Oriente por `docs/02-exportar-pbip.md` (TMDL + PBIR ligados). |
| 3 | Inicializar | `npm run dashboard:init -- --slug <slug>` (cria as 5 árvores). |
| 4 | Checar/diagnosticar | Skill **`pbip-diagnostico`**. |
| 5 | Classificar complexidade | Saída no `diagnostico.md`. |
| 6 | Gerar a página web | Skill **`gerar-dashboard-web`**. |
| 7 | Mapear dados (camada ouro) | Skill **`snowflake-mapeamento`**. |
| 8 | Validar paridade | Skill **`validar-paridade`**. |
| 9 | Checklist visual + revisão | `docs/08-checklist-final.md`. |
| 10 | Deploy + PR | Skill **`deploy-vercel`** + `.github/pull_request_template.md`. |

> Ordem prática usual: 3 → 4 → 7 (dados) → 6 (UI) → 8 → 10. Ajuste conforme a
> maturidade (se a fonte ainda não está clara, comece pela UI com mocks).

## Primeiro passo concreto

1. Pergunte/confirme o **slug** (kebab-case, ex.: `vendas-por-hora`).
2. Rode `npm run dashboard:init -- --slug <slug>` (idempotente; `--force` sobrescreve).
3. Confirme que o PBIP está em `powerbi-input/<slug>/` e siga para
   **`pbip-diagnostico`**.

## Referências

- Visão geral: `docs/00-visao-geral.md`
- Fluxo de prompts (equivalente detalhado): `docs/04-fluxo-de-prompts.md`,
  `prompts/00-contexto-geral.md`
- Regras para agentes: `AGENTS.md` / `CLAUDE.md`
