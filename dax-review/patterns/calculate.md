# Padrão: `CALCULATE`

```DAX
CALCULATE(<expressão>, <filtro1>, <filtro2>, ...)
```

`CALCULATE` **altera o contexto de filtro** antes de avaliar a expressão. É a
função mais poderosa — e mais perigosa de traduzir — do DAX.

## As 7 perguntas obrigatórias

Antes de traduzir **qualquer** `CALCULATE`, a IA (ou o revisor) deve responder:

1. Qual expressão está sendo calculada?
2. Quais filtros são **adicionados**?
3. Quais filtros são **removidos**?
4. Quais filtros são **substituídos**?
5. Quais filtros do dashboard **permanecem**?
6. Existe **mudança de relacionamento** (`USERELATIONSHIP`/`CROSSFILTER`)?
7. Existe **dependência de contexto visual** (linha/coluna do visual, drill)?

Se essas perguntas **não puderem ser respondidas** com evidência do TMDL/PBIR e do
negócio, a medida deve ser marcada como `blocked_for_auto_translation`.

## Tradução para SQL (princípios)

- **Filtros adicionados** → cláusulas `WHERE`/`QUALIFY` adicionais.
- **Filtros removidos** (`REMOVEFILTERS`/`ALL`) → **não** aplicar aquele filtro;
  ver [`removefilters.md`](removefilters.md) e [`all-allselected.md`](all-allselected.md).
- **Filtros substituídos** → trocar a condição, não acumular.
- **Filtros mantidos** → continuam vindo dos parâmetros da query (slicers).
- Múltiplos `CALCULATE` aninhados → tratar como **crítico**: avalie de dentro para
  fora e documente cada camada.

## Exemplo

```DAX
VAR Closer =
    CALCULATE(
        SELECTEDVALUE('Clientes consultoria total_v2'[CLOSER_FUNIL]),
        REMOVEFILTERS(dCalendario)
    )
```

- Expressão: `SELECTEDVALUE([CLOSER_FUNIL])` — ver [`selectedvalue.md`](selectedvalue.md).
- Filtros removidos: os de `dCalendario` — ver [`removefilters.md`](removefilters.md).
- Filtros mantidos: todos os demais do contexto (ex.: filtro de closer/funil).
- Resultado: o closer, **ignorando o período**, desde que haja um único valor.
