# Prompt 11 — Revisão final e PR

Faça a revisão final de `{{DASHBOARD_SLUG}}` e prepare o Pull Request. Este é o
**último** prompt: rode-o depois da autenticação (prompts 08–10).

## Checagens automáticas

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Corrija todos os erros antes de prosseguir.

## Revisão

1. **Segurança**: sem segredos no frontend; conexão Snowflake só server-side;
   erros não vazam SQL/credenciais.
2. **Dados**: queries apontam para tabelas/views reais (sem `CHANGE_ME` pendente,
   ou pendências documentadas); adapters cobrem todos os campos.
3. **UI**: responsiva; estados loading/error/empty; coerente com o Power BI.
4. **Mocks**: identificados como fallback (não como dado real).
5. **Métricas pendentes**: listadas em `metrics.ts` e `validation-notes.md`.

## Resumo para o PR

Gere um resumo seguindo `.github/pull_request_template.md`, incluindo:

- dashboard migrado e origem Power BI;
- fonte Snowflake / camada ouro;
- o que foi recriado;
- métricas implementadas e **pendentes**;
- mapeamento Power BI → Snowflake;
- status da validação de paridade (e responsável de negócio);
- riscos conhecidos;
- link do deploy preview;
- checklist final (de `docs/09-checklist-final.md`).

## Saída

PR preenchido + `validation-notes.md` atualizado.
