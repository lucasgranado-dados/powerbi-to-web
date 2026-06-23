# Padrão: iteradores (`SUMX`, `AVERAGEX`, `COUNTX`, …)

```DAX
SUMX(Tabela, <expressão por linha>)
AVERAGEX(Tabela, <expressão por linha>)
COUNTX(Tabela, <expressão por linha>)
```

Iteradores avaliam a `<expressão>` **linha a linha** (contexto de linha) sobre a
tabela informada e depois agregam. O ponto crítico é **a granularidade**: a
expressão por linha pode multiplicar colunas antes de somar — algo que um `SUM`
simples no SQL não reproduz.

## Tradução para SQL/Snowflake

- `SUMX(T, a * b)` → `SUM(a * b)` **na granularidade de `T`**:
  ```sql
  SELECT SUM(a * b) FROM <grão de T>
  ```
  Não é `SUM(a) * SUM(b)`.
- `AVERAGEX(T, expr)` → `AVG(expr)` no grão de `T` (cuidado com linhas nulas e com
  a definição de "média" — média das linhas, não média ponderada, salvo se a expr
  já ponderar).
- `COUNTX(T, expr)` → `COUNT(expr)` (conta linhas onde `expr` não é blank) no grão
  de `T`.

## Cuidados

- Identifique **qual tabela** é iterada e em **qual grão** ela está na camada ouro.
  Se a granularidade do Snowflake for diferente da do modelo, o resultado muda.
- Se a `<expressão>` referencia outra medida (`SUMX(T, [Medida])`), há **transição
  de contexto** — trate como `complex`/`critical` e valide com cuidado.
- `RANKX` e afins → quase sempre **window functions** (`RANK() OVER (...)`).

## Casos de teste obrigatórios

1. Linha única → `SUMX(T, a*b)` = `a*b`.
2. Várias linhas → confirme que é a soma dos produtos, não o produto das somas.
3. Linhas com valores nulos → confirme o tratamento (ignorar vs. contar como 0).
