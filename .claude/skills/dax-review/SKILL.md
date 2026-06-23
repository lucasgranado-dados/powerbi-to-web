---
name: dax-review
description: >-
  Revisa, classifica, documenta e valida medidas DAX complexas (que dependem do
  contexto de filtro do Power BI) antes de traduzi-las para SQL/Snowflake ou
  TypeScript. Use quando o analista pedir para revisar/traduzir medidas DAX,
  tratar CALCULATE/SELECTEDVALUE/REMOVEFILTERS/ALL/iteradores/inteligência de
  tempo, classificar a complexidade das medidas, ou quando uma medida não bater
  na validação de paridade por causa de contexto de filtro.
---

# Revisão de medidas DAX complexas (DAX Review Layer)

Camada de segurança que impede a tradução ingênua de DAX dependente de contexto.
Roda **depois** do diagnóstico (`pbip-diagnostico`) e **antes** do mapeamento
(`snowflake-mapeamento`). Prefira **bloquear** uma tradução insegura a gerar SQL
incorreto.

## Regras-guarda (inegociáveis)

1. **Não traduza DAX complexo de forma ingênua.** Toda medida `complex`/`critical`
   exige explicação semântica + plano de validação.
2. **Toda SQL proposta é candidata** até validação de paridade contra o Power BI.
3. **Medidas incertas/críticas** ficam `blocked_for_auto_translation` e não entram
   no mapeamento.
4. **Não invente** nomes de tabela/coluna — use `CHANGE_ME_*` e registre pendência.
5. **Documente** tudo em `validation-notes.md` e nos cards.

## Passos

1. **Extrair** as medidas do TMDL:
   ```bash
   npm run dax:extract -- --slug <slug>
   ```
   Gera `src/features/dashboards/<slug>/dax/measures.catalog.json`.
2. **Classificar** a complexidade:
   ```bash
   npm run dax:classify -- --slug <slug>
   ```
   Adiciona `complexity` (simple|moderate|complex|critical), `riskReasons` e
   `requiresManualReview`.
3. **Gerar os cards e artefatos**:
   ```bash
   npm run dax:review-cards -- --slug <slug>
   ```
   Gera `complex-measures.review.md`, `measure-translations.ts` e
   `measure-validation-cases.ts`, e atualiza o `validation-notes.md`.
4. **Revisar à mão** cada card: interpretação semântica, filtros
   mantidos/removidos/alterados, dependências, risco, estratégia e SQL candidata
   (só quando seguro). Use os padrões em `dax-review/patterns/`.
5. **Validar** contra o Power BI (ver `validation/dax/`) antes de promover qualquer
   medida para `validated`.

## Para todo `CALCULATE`

Responda: (1) qual expressão; (2) filtros adicionados; (3) removidos; (4)
substituídos; (5) mantidos; (6) mudança de relacionamento; (7) dependência de
contexto visual. Sem resposta com evidência → `blocked_for_auto_translation`.

## Próximo

Vá para **`snowflake-mapeamento`** — mas só com medidas `validated` ou com SQL
candidata explicitamente marcada para validação.

## Referências

- `prompts/03-revisar-medidas-dax-complexas.md`
- `docs/04-revisao-medidas-dax-complexas.md`
- `dax-review/` (README, `patterns/`, `templates/`)
