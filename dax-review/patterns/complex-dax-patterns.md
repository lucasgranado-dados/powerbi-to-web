# Padrões de DAX complexo

Visão geral dos padrões que tornam uma medida DAX **dependente de contexto** e,
portanto, perigosa de traduzir automaticamente.

## Por que DAX complexo é diferente

DAX avalia medidas dentro de um **contexto de filtro** (os filtros vindos de
slicers, segmentações, linhas/colunas de visuais e outras medidas) e de um
**contexto de linha** (em iteradores). O mesmo texto DAX retorna valores
diferentes conforme esse contexto. SQL puro não tem esse conceito embutido: o
contexto precisa virar `WHERE`/`GROUP BY`/janelas **explícitos**.

## Sinais de alerta

| Padrão | Função(ões) | Risco |
| --- | --- | --- |
| Modificação de contexto | `CALCULATE`, `CALCULATETABLE` | alto |
| Remoção de filtros | `REMOVEFILTERS`, `ALL`, `ALLEXCEPT` | alto |
| Seleção única | `SELECTEDVALUE`, `HASONEVALUE`, `VALUES` | alto |
| Iteração (contexto de linha) | `SUMX`, `AVERAGEX`, `COUNTX`, `RANKX` | médio/alto |
| Relacionamento alternativo | `USERELATIONSHIP`, `CROSSFILTER` | crítico |
| Mapeamento de filtros | `TREATAS` | crítico |
| Posição na hierarquia | `ISINSCOPE` | crítico |
| Inteligência de tempo | `TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`, … | crítico |
| Encadeamento profundo | medidas que chamam medidas que chamam medidas | médio/alto |

## Classificação usada pelo toolkit

`npm run dax:classify` aplica estas listas (ver
`scripts/lib/dax-classify.mjs`):

- **simple** — só `SUM`/`COUNT`/`AVERAGE`/`MIN`/`MAX` + aritmética.
- **moderate** — `DIVIDE`/`IF`/`SWITCH` e encadeamentos simples.
- **complex** — `CALCULATE`, `FILTER`, `ALL`, `ALLSELECTED`, `REMOVEFILTERS`,
  `SELECTEDVALUE`, `VALUES`, `HASONEVALUE`, `KEEPFILTERS`, `SUMX`, `AVERAGEX`,
  `COUNTX`.
- **critical** — `USERELATIONSHIP`, `TREATAS`, `ISINSCOPE`, inteligência de tempo,
  múltiplos `CALCULATE`, múltiplas `VAR`, RLS, drill-through, aninhamento complexo.

## Regra de ouro

> Prefira **bloquear** a tradução (`blocked_for_auto_translation`) a gerar SQL
> incorreto. Toda medida complexa precisa de explicação semântica e plano de
> validação contra o Power BI antes do uso definitivo.
