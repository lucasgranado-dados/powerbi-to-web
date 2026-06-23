# Padrão: `ALL` / `ALLSELECTED`

Ambas removem filtros, mas de formas **diferentes**. Confundi-las gera números
errados (tipicamente em percentuais "do total").

## `ALL`

```DAX
CALCULATE([Medida], ALL(Tabela))
CALCULATE([Medida], ALL(Tabela[Coluna]))
```

Remove **todos** os filtros da tabela/coluna — inclusive os de slicers do usuário.
Usado para denominadores "do total absoluto".

**SQL:** calcule o total **sem** aplicar o filtro da coluna/tabela citada (ex.:
uma subconsulta/janela sem aquele `WHERE`). Os demais filtros permanecem.

## `ALLSELECTED`

```DAX
CALCULATE([Medida], ALLSELECTED(Tabela))
```

Remove os filtros **internos do visual** (linha/coluna), mas **respeita** os
filtros externos selecionados pelo usuário (slicers/segmentações). Usado para
"percentual do total **visível/selecionado**".

**SQL:** o denominador deve respeitar os filtros dos slicers (parâmetros da query),
ignorando apenas o agrupamento do próprio visual. Costuma virar uma **window
function** (`SUM(x) OVER (PARTITION BY <filtros externos>)`) em vez de remover o
`WHERE` inteiro.

## Diferença que mais causa bug

| Função | Respeita slicers do usuário? | Uso típico |
| --- | --- | --- |
| `ALL` | ❌ não | % do total absoluto |
| `ALLSELECTED` | ✅ sim | % do total selecionado/visível |

## Casos de teste obrigatórios

1. Sem slicer → `ALL` e `ALLSELECTED` tendem a coincidir.
2. Com slicer aplicado → devem **divergir**; confirme qual o visual usa.
3. Percentual deve somar 100% no escopo correto (total vs. selecionado).
