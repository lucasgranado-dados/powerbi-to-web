# Padrão: `REMOVEFILTERS`

```DAX
REMOVEFILTERS(dCalendario)
REMOVEFILTERS(Tabela[Coluna])
REMOVEFILTERS()            -- remove todos os filtros do contexto
```

`REMOVEFILTERS(dCalendario)` significa **remover os filtros vindos da tabela
calendário**, mas **preservar** os outros filtros ativos no contexto.

Geralmente aparece dentro de um `CALCULATE` (ver [`calculate.md`](calculate.md)).

## Tradução para SQL/Snowflake

- **Não aplicar** os filtros de data/período quando a medida remove `dCalendario`
  (ou a coluna/tabela citada).
- **Preservar** os filtros das outras dimensões (continuam vindo dos parâmetros da
  query / slicers).
- **Documentar** explicitamente quais filtros foram ignorados — isso muda o
  resultado e precisa ser visível na validação de paridade.

Exemplo prático: se a query do dashboard normalmente tem
`WHERE REF_DATE BETWEEN ? AND ?` por causa do slicer de calendário, uma medida com
`REMOVEFILTERS(dCalendario)` deve **omitir** essa cláusula (ou calculá-la numa
subconsulta sem o filtro de data), mantendo as demais condições.

## Cuidados

- `REMOVEFILTERS()` sem argumento remove **todos** os filtros — trate como crítico.
- `ALLEXCEPT(T, T[c])` é o oposto: remove tudo **exceto** as colunas listadas.
- Confirme se há `KEEPFILTERS` por perto, que altera como filtros se combinam.

## Casos de teste obrigatórios

1. Com filtro de calendário aplicado → o resultado **ignora** o período.
2. Sem filtro de calendário → resultado idêntico (o filtro já não existia).
3. Com filtro de outra dimensão → esse filtro **continua** valendo.
