# DAX Review Layer

Camada de **revisão de medidas DAX complexas** antes de convertê-las para
SQL/Snowflake, TypeScript ou lógica da aplicação web.

O toolkit já lida bem com medidas DAX simples. Medidas que dependem do **contexto
de filtro** do Power BI (`CALCULATE`, `SELECTEDVALUE`, `REMOVEFILTERS`, `ALL`,
iteradores, inteligência de tempo, `USERELATIONSHIP`, …) **não** podem ser
traduzidas de forma ingênua. Esta camada força uma revisão semântica e prefere
**bloquear** uma tradução insegura a gerar SQL incorreto.

## Fluxo

```text
TMDL
→ extração das medidas DAX            (npm run dax:extract)
→ classificação de complexidade       (npm run dax:classify)
→ revisão semântica + decomposição    (cards em complex-measures.review.md)
→ filtros removidos/mantidos
→ proposta de tradução Snowflake/SQL  (measure-translations.ts — CANDIDATA)
→ geração de casos de paridade        (measure-validation-cases.ts)
→ aprovação ou bloqueio da medida
→ uso seguro na página web
```

## Como rodar

```bash
npm run dax:extract      -- --slug <slug>   # TMDL → dax/measures.catalog.json
npm run dax:classify     -- --slug <slug>   # adiciona complexity + riskReasons
npm run dax:review-cards -- --slug <slug>   # cards + translations + validation cases
```

Saídas em `src/features/dashboards/<slug>/dax/`:

- `measures.catalog.json` — catálogo de medidas (nome, tabela, DAX, deps, status).
- `complex-measures.review.md` — 1 card por medida `complex`/`critical`.
- `measure-translations.ts` — traduções **candidatas** (marcadas, não validadas).
- `measure-validation-cases.ts` — casos de teste obrigatórios por medida.

## Classificação de complexidade

| Nível | Exemplos | Ação |
| --- | --- | --- |
| `simple` | `SUM`, `COUNT`, `AVERAGE`, `MIN`, `MAX`, aritmética | tradução direta |
| `moderate` | `DIVIDE`, `IF`, `SWITCH`, filtros simples | tradução com cuidado |
| `complex` | `CALCULATE`, `FILTER`, `ALL(SELECTED)`, `REMOVEFILTERS`, `SELECTEDVALUE`, `VALUES`, `HASONEVALUE`, `KEEPFILTERS`, `SUMX`/`AVERAGEX`/`COUNTX` | **revisão manual** |
| `critical` | `USERELATIONSHIP`, `TREATAS`, `ISINSCOPE`, inteligência de tempo, múltiplos `CALCULATE`/`VAR`, RLS, drill-through | **bloqueada por padrão** |

## Status das medidas

```text
extracted → classified → needs_review → translation_proposed
          → validation_required → validated
          → blocked_for_auto_translation
```

Medidas `complex`/`critical` **não** podem ser usadas como definitivas sem passar
por `validation_required` ou `validated`.

## Padrões de tradução

Regras detalhadas por função em `patterns/`:

- [`complex-dax-patterns.md`](patterns/complex-dax-patterns.md)
- [`selectedvalue.md`](patterns/selectedvalue.md)
- [`calculate.md`](patterns/calculate.md)
- [`removefilters.md`](patterns/removefilters.md)
- [`all-allselected.md`](patterns/all-allselected.md)
- [`iterators.md`](patterns/iterators.md)
- [`time-intelligence.md`](patterns/time-intelligence.md)

Gabaritos em `templates/` (`dax-review-card.md`, `dax-translation-plan.md`,
`dax-validation-case.md`).

Ver também `docs/04-revisao-medidas-dax-complexas.md` e o
`prompts/03-revisar-medidas-dax-complexas.md`.
