# Padrão: inteligência de tempo

Funções como `TOTALYTD`, `DATESYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`,
`DATESINPERIOD`, `PREVIOUSMONTH`, `PARALLELPERIOD`, `FIRSTDATE`/`LASTDATE`, etc.

São classificadas como **`critical`**: dependem de uma **tabela calendário
marcada como tabela de datas** no modelo, contígua e completa. Traduções ingênuas
para SQL erram em viradas de ano, meses incompletos e dias sem fato.

## Por que é crítico

- Exigem um calendário **completo e contínuo** (sem buracos de datas).
- O resultado muda conforme o **grão** do visual (dia/mês/ano) e o filtro de
  período ativo.
- "Year-to-date", "mês anterior", "mesmo período do ano passado" têm definições
  precisas que precisam casar com as regras de negócio.

## Tradução para SQL/Snowflake (princípios)

- **YTD / MTD / QTD** → `SUM(...)` com filtro de data do início do período até a
  data corrente, normalmente via **window function** ordenada por data
  (`SUM(x) OVER (PARTITION BY ano ORDER BY data ...)`), apoiada numa dimensão de
  calendário.
- **SAMEPERIODLASTYEAR / DATEADD** → junção/deslocamento contra a dimensão de
  calendário (`DATEADD`/`DATE_TRUNC` no Snowflake), nunca `data - 365` ingênuo.
- **Sempre** apoiar em uma tabela calendário real da camada ouro; não derivar
  períodos só das datas dos fatos (datas faltantes quebram o cálculo).

## Cuidados

- Confirme qual coluna de data dirige o cálculo e se ela é a chave do
  relacionamento ativo (ou se há `USERELATIONSHIP`).
- Períodos parciais (mês/ano em andamento) precisam de regra explícita.

## Casos de teste obrigatórios

1. Virada de ano (dez → jan) para YTD/SAMEPERIODLASTYEAR.
2. Mês/ano em andamento (período parcial).
3. Dia sem fato no meio do período (o acumulado não pode "pular").
