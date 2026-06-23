# Padrão: `SELECTEDVALUE`

```DAX
SELECTEDVALUE(Tabela[Coluna])
SELECTEDVALUE(Tabela[Coluna], <valorAlternativo>)
```

`SELECTEDVALUE` **não** é equivalente a simplesmente selecionar a coluna em SQL.

Ela retorna o valor **apenas quando há exatamente um valor distinto** da coluna no
contexto de filtro atual. Se houver mais de um valor distinto (ou nenhum), retorna
`BLANK` — ou o `<valorAlternativo>`, se informado.

## Equivalência lógica aproximada (SQL/Snowflake)

```sql
CASE
  WHEN COUNT(DISTINCT coluna) = 1 THEN MAX(coluna)
  ELSE NULL          -- ou o <valorAlternativo>, se houver no DAX
END
```

- Se o DAX tiver um valor alternativo, use-o no `ELSE` em vez de `NULL`.
- O `COUNT(DISTINCT ...)` / `MAX(...)` precisa respeitar **o mesmo agrupamento**
  que define o "contexto" (ex.: por linha de uma tabela de detalhe).

## Cuidados

- O resultado depende de quais filtros estão ativos — confira se algum
  `CALCULATE`/`REMOVEFILTERS`/`ALL` ao redor altera o contexto antes de medir o
  "distinto".
- Em um visual com várias linhas, o "contexto" é por linha: o `CASE` precisa estar
  no nível de agrupamento certo, não no total geral.

## Casos de teste obrigatórios

1. Exatamente um valor no contexto → retorna esse valor.
2. Mais de um valor no contexto → retorna `BLANK`/`NULL` (ou o alternativo).
3. Nenhum valor no contexto → retorna `BLANK`/`NULL` (ou o alternativo).
