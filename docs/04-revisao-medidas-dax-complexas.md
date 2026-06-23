# 04 — Revisão de medidas DAX complexas

A **DAX Review Layer** é uma etapa de segurança entre o diagnóstico e o mapeamento
para o Snowflake. Ela classifica, documenta e valida medidas DAX que dependem do
**contexto de filtro** do Power BI antes de qualquer tradução para SQL/TypeScript.

## Por que medidas DAX complexas são perigosas

O DAX avalia medidas dentro de um **contexto de filtro** (slicers, segmentações,
linhas/colunas dos visuais, outras medidas) e de um **contexto de linha** (em
iteradores). O mesmo texto retorna valores diferentes conforme o contexto. SQL puro
não tem esse conceito embutido — o contexto precisa virar `WHERE`/`GROUP BY`/janelas
**explícitos**. Traduzir de forma ingênua gera números errados e silenciosos.

## DAX simples vs. DAX dependente de contexto

- **Simples:** `SUM`, `COUNT`, `AVERAGE`, `MIN`, `MAX`, aritmética. Tradução direta.
- **Dependente de contexto:** `CALCULATE`, `SELECTEDVALUE`, `REMOVEFILTERS`, `ALL`,
  `ALLSELECTED`, `FILTER`, `KEEPFILTERS`, iteradores (`SUMX`/`AVERAGEX`/`COUNTX`),
  `USERELATIONSHIP`, `TREATAS`, `ISINSCOPE`, inteligência de tempo. Exigem revisão.

## Como rodar

```bash
npm run dax:extract      -- --slug <slug>   # TMDL → dax/measures.catalog.json
npm run dax:classify     -- --slug <slug>   # adiciona complexity + riskReasons
npm run dax:review-cards -- --slug <slug>   # cards + translations + validation cases
```

Saídas em `src/features/dashboards/<slug>/dax/`:

- `measures.catalog.json` — catálogo (nome, tabela, DAX, dependências, status).
- `complex-measures.review.md` — 1 card por medida `complex`/`critical`.
- `measure-translations.ts` — traduções **candidatas** (marcadas, não validadas).
- `measure-validation-cases.ts` — casos de teste obrigatórios por medida.

## Como interpretar a classificação

| Nível | Critério | Ação |
| --- | --- | --- |
| `simple` | só agregações simples + aritmética | tradução direta |
| `moderate` | `DIVIDE`, `IF`, `SWITCH`, encadeamento simples | cuidado |
| `complex` | `CALCULATE`, `FILTER`, `ALL(SELECTED)`, `REMOVEFILTERS`, `SELECTEDVALUE`, `VALUES`, `HASONEVALUE`, `KEEPFILTERS`, `SUMX`/`AVERAGEX`/`COUNTX` | **revisão manual** |
| `critical` | `USERELATIONSHIP`, `TREATAS`, `ISINSCOPE`, inteligência de tempo, múltiplos `CALCULATE`/`VAR`, RLS, drill-through | **bloqueada por padrão** |

Cada medida `complex`/`critical` recebe `requiresManualReview: true` e os
`riskReasons` que motivaram a classificação.

## Como revisar os cards

Para cada card em `complex-measures.review.md`:

1. Escreva a **interpretação semântica** (o que a medida faz, em palavras).
2. Liste filtros **mantidos / removidos / alterados** (use `dax-review/patterns/`).
3. Registre **dependências** (tabelas, colunas, medidas, relacionamentos).
4. Defina a **estratégia** (SQL, window function, adapter TS, pré-agregação, …).
5. Só escreva a **SQL candidata** se conseguir responder às 7 perguntas do
   `CALCULATE`. Caso contrário, mantenha `blocked_for_auto_translation`.

## Como aprovar ou bloquear

Status possíveis de uma medida:

```text
extracted → classified → needs_review → translation_proposed
          → validation_required → validated
          → blocked_for_auto_translation
```

- **Aprovar:** só promova para `validated` após a validação de paridade abaixo,
  com assinatura do responsável de negócio.
- **Bloquear:** medidas críticas (ou incertas) ficam `blocked_for_auto_translation`
  e **não** entram no mapeamento Snowflake até serem revisadas.

## Como validar contra o Power BI

1. Para cada cenário em `measure-validation-cases.ts`, exporte o resultado da
   medida no Power BI para `validation/dax/expected-powerbi-results/`.
2. Rode a SQL candidata e salve em `validation/dax/snowflake-results/`.
3. Compare e registre divergências em `validation/dax/diffs/` (ver
   `validation/dax/README.md`).

## Exemplos

### `SELECTEDVALUE`

```DAX
SELECTEDVALUE(Tabela[Coluna])
```

Equivale aproximadamente a:

```sql
CASE WHEN COUNT(DISTINCT coluna) = 1 THEN MAX(coluna) ELSE NULL END
```

### `REMOVEFILTERS`

`REMOVEFILTERS(dCalendario)` → **não** aplicar filtros de data; **preservar** os
demais filtros do contexto; documentar o que foi ignorado.

### `CALCULATE`

Altera o contexto de filtro. Responda às 7 perguntas (ver
`dax-review/patterns/calculate.md`) antes de traduzir; na dúvida, bloqueie.

## Referências

- `dax-review/` (README + `patterns/` + `templates/`).
- `prompts/03-revisar-medidas-dax-complexas.md`.
- `docs/05-fluxo-de-prompts.md`, `docs/10-snowflake-camada-ouro.md`.

## Próximo

Leia `05-fluxo-de-prompts.md`.
