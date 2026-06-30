# Diagnóstico — dash-aquisicao

> Gerado a partir de TMDL/PBIR. Fonte de verdade: `powerbi-input/dash-aquisicao/`.

## Páginas (9)

| # | Nome | Filtro de página | Dimensões (px) |
|---|------|-----------------|----------------|
| 1 | **Captação** *(ativa)* | `fMovimentações[descricao]` NOT IN {PREV APORTE, PREV PORTABILIDADE …, CBX, CEX, COE, FUNDOS PCO, OTA, PREV RESGATE, RF, TD} | 1280 × 1480 |
| 2 | **Aquisição** | `PIPE_VENDAS = 'SIM'`, `DATA_DA_CONTRATACAO_FUNIL` (seleção aberta) | 1280 × 1500 |
| 3 | **Aquisição SDR** | `PIPE_VENDAS = 'SIM'` | 1280 × 1500 |
| 4 | **Aquisição visão geral** | `PIPE_VENDAS = 'SIM'` (tabela `_copy`) | 1452 × 1162 |
| 5 | **Geral** | `arquivo IN ('Avenue', 'BTG', 'XP')` | 1280 × 1162 |
| 6 | **Avenue** | `arquivo = 'Avenue'` | 1280 × 1162 |
| 7 | **BTG** | `arquivo = 'BTG'` | 1280 × 1162 |
| 8 | **XP** | `arquivo = 'XP'` | 1280 × 1162 |
| 9 | **Data Quality** | nenhum | 1280 × 1440 |

> Todas as páginas usam imagem de fundo personalizada (PNG em `StaticResources/RegisteredResources`).

## Visuais

Estimativa: **100 visuais** distribuídos em 9 páginas (média 11/pág). Tipos
inferidos dos `visual.json` — detalhamento por página pendente de leitura
individual.

Padrão recorrente identificado nas páginas de Captação/Aquisição:
- Cards de KPI (medidas de ARR, PL, MRR, Captação, taxa)
- Gráfico de barras/colunas (evolução temporal)
- Tabela detalhe (lista por consultor/closer)
- Segmentações de data e consultor
- Interações bidirecionais entre visuais (confirmado em `Geral`)

## Medidas (DAX) — 42

### Grupo: Aquisição (tabela `Clientes consultoria total_v2`)

| Medida | Lógica resumida | Formato |
|--------|----------------|---------|
| `PL Consolidado` | `SUM(CADASTRO_PL_TOTAL_IMPLANTADO)` | número |
| `PL WS` | `SUM(CADASTRO_PL_TOTAL_IMPLANTADO_API)` | #,0 |
| `PL Taxa Base` | `PL Consolidado - PL WS` | #,0 |
| `PL Hubspot` | `SUM(PATRIMONIO_VALIDADO_FUNIL)` | #,0 |
| `Delta PL` | `PL Consolidado - PL Hubspot` | #,0 |
| `Diferença % PL x PL Hubspot` | `Delta PL / PL Hubspot` | % |
| `Qtd implantações` | `COUNTROWS` onde `TOMBOU = 'SIM'` | inteiro |
| `Carteiras consolidadas` | `COUNTROWS` onde `TOMBOU = 'SIM'` *(idem Qtd implantações)* | inteiro |
| `PL Médio` | `PL Consolidado / Qtd implantações` | número |
| `.ARR Ajustado` | PL × taxa; piso de R$ 6.000 se TOMBOU='SIM'; zera para status {CANCELOU/NÃO RENOVOU, RENOVOU, Cancelou/Perdidos, Perdidos, Churn} | #,0 |
| `.ARR Ajustado via API` | Igual a `.ARR Ajustado` mas usa `CADASTRO_PL_TOTAL_IMPLANTADO_API` | #,0 |
| `.ARR Ajustado via API (Sem o validador de 6k)` | `.ARR via API` sem piso de 6k | #,0 |
| `Total ARR card ajustado` | `SUMX` por cliente; piso de 6k **sem** filtro de status | #,0 |
| `MRR` | `.ARR Ajustado / 12` | número |
| `MRR Api` | `.ARR Ajustado via API / 12` | #,0 |
| `Taxa efetiva closer` | `.ARR Ajustado / PL Consolidado` | % |
| `SLA Aquisicao` | `DATEDIFF(ASSINATURA_TERMO, DATA_IMPLANTACAO, DAY)` | inteiro |

### Grupo: Captação (tabela `fMovimentações`)

| Medida | Lógica resumida | Formato |
|--------|----------------|---------|
| `Captação` | `SUM(valor_brl)` | #,0 |
| `Quantidade de clientes com captação` | `DISTINCTCOUNT(nome_cliente)` | #,0 |
| `Captação média` | `Captação / Qtd clientes` | número |
| `ARR Captação` | `SUM(.CAPxTX)` com fallback 0 | #,0 |
| `MRR Captação` | `ARR Captação / 12` | #,0 |
| `Taxa efetiva` | `ARR Captação / Captação` | % |
| `Captação BRL` | `SUM(valor_brl)` filtrado `arquivo = 'Avenue'` | número |
| `Captação USD` | `SUM(valor_usd)` filtrado `arquivo = 'Avenue'` | número |
| `Captação BRL/USD` | `Captação BRL / Captação USD` | número |
| `Taxa` | `SUM(taxa)` com fallback 0 | número |

### Grupo: Remuneração

| Medida | Fórmula | Formato |
|--------|---------|---------|
| `Variável Consultor` | `MRR Captação × 2 × (1−0,18)` | #,0 |
| `Variável Team Leader` | `MRR Captação × 0,3 × (1−0,18)` | #,0 |
| `Variavel closer` | `MRR Api × Taxa efetiva closer` | número |
| `Variavel consultor aquisicao` | `(MRR Api × 2 − Variavel closer) × (1−0,18)` | #,0 |
| `Variavel team leader aquisicao` | `MRR Api × 0,3 − Variavel closer × (1−0,18)` | #,0 |

### Grupo: Visão geral (tabela `Clientes consultoria total_v2_copy`)

Espelha as medidas principais com sufixo `(Visão geral)`, adicionando lógica
para produtos especiais (Assinatura Black, Mentoria, Grupo Elite) que usam
`AMOUNT_FUNIL` em vez de PL×taxa.

Medidas adicionais neste grupo: `.ARR Ajustado (Visão geral)`,
`.ARR Ajustado via API (Visão geral)`, `PL (Visão geral)`, `PL Hubspot (Visão geral)`,
`Pl hubspot - pl (Visão geral)`, `.ARR Ajustado via API (Sem o validador de 6k) (Visão geral)`,
`SLA Aquisicao (Visão geral)`, `PL WS (Visão geral)`, `PL Base (visão geral)`,
`Valor (Mentoria/Black/Elite)`.

## Tabelas

| Tabela | Tipo | Fonte Snowflake | Colunas relevantes |
|--------|------|----------------|--------------------|
| `Clientes consultoria total_v2` | Fato/dimensão | `SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA` | TOMBOU, ETAPA_DO_NEGOCIO_CONSULTORIA, PIPE_VENDAS, CADASTRO_PL_TOTAL_IMPLANTADO, CADASTRO_PL_TOTAL_IMPLANTADO_API, TAXA_FECHADA_CONSULTORIA, datas múltiplas, CLOSER_FUNIL, consultor, lider |
| `Clientes consultoria total_v2_copy` | Cópia da anterior | mesma view | Usada para isolar contexto de filtro na página "Visão geral" |
| `fMovimentações` | Fato | `SERVING_LAYER.CONSULTORIA.VW_APORTE_RESGATE` | data, valor_brl, valor_usd, taxa, nome_cliente, consultor, lider, produto, dc, arquivo |
| `dCalendario` | Dimensão de tempo | pendência — não localizada a fonte; provavelmente gerada em M ou via Snowflake | Date |
| `Medidas` | Tabela de medidas (vazia) | — | — |
| `DateTableTemplate_*` / `LocalDateTable_*` (11) | Auto-geradas por PBI | — | Hierarquias de data automáticas |

> **Atenção:** `fMovimentações` tem filtro de período **hardcoded** em M:
> `data >= 01/01/2026 AND data <= 31/05/2026`. Isso precisará ser parametrizado
> na migração web.

## Relacionamentos

| Chave | De | Para | Tipo |
|-------|----|------|------|
| Principal | `fMovimentações[data]` | `dCalendario[Date]` | Many-to-one |
| Principal | `Clientes consultoria total_v2[CADASTRO_DATA_IMPLANTACAO]` | `dCalendario[Date]` | Many-to-one |
| 10× LocalDate | Cada coluna de data em `Clientes consultoria total_v2` / `_copy` | LocalDateTable correspondente | Auto (PBI time intelligence) |

## Filtros / Segmentações

### Filtros fixos de página
- **Captação:** exclui 11 tipos de `descricao` (instrumentos de previdência, renda fixa etc.)
- **Aquisição / SDR:** `PIPE_VENDAS = 'SIM'`
- **Aquisição visão geral:** `PIPE_VENDAS = 'SIM'` (tabela `_copy`)
- **Geral:** `arquivo IN ('Avenue', 'BTG', 'XP')`
- **Avenue / BTG / XP:** `arquivo = '<corretora>'`

### Interações entre visuais
Página **Geral** tem 12 pares de interações `DataFilter` bidirecional entre 4 visuais — comportamento de cross-filter. Requer estado de filtro no cliente web.

### Filtro de período hardcoded
`fMovimentações` filtrado para jan–mai 2026 diretamente na query M. **Pendência:** parametrizar como variável de ambiente ou parâmetro de query na migração.

## Bookmarks / Drill-through / RLS

- **Bookmarks:** 2 (IDs `ccc79234…` e `bcee51de…`) — conteúdo pendente de leitura individual dos `.bookmark.json`.
- **Drill-through:** não identificado explicitamente — pendência.
- **RLS:** não localizado no TMDL — pendência de confirmação.

## Complexidade

**ALTA**

Justificativas:
1. **Regras de negócio sofisticadas no DAX** — piso de R$ 6.000 no ARR, lógica de zeragem por status, produtos especiais com `AMOUNT_FUNIL`.
2. **Tabela duplicada** (`_copy`) para isolar contextos de filtro — padrão não trivial de replicar em server-side rendering.
3. **42 medidas** com dependências em cadeia (`.ARR → MRR → Variavel closer → Variavel consultor aquisicao`).
4. **9 páginas** com filtros fixos distintos — cada página vira uma rota ou aba separada na web.
5. **Cross-filter bidirecional** na página Geral.
6. **Período hardcoded** na query de dados que precisará ser dinâmico.
7. **Duas views Snowflake** distintas alimentando o modelo.

## Riscos

| Risco | Severidade | Mitigation |
|-------|-----------|------------|
| Lógica de piso R$ 6k no ARR depende de contexto de linha DAX (`SELECTEDVALUE`) | Alta | Replicar exatamente em SQL/JS; validar resultado linha a linha |
| Tabela `_copy` = contexto de filtro independente | Alta | Na web, usar queries separadas com parâmetros distintos para cada rota |
| `dCalendario` sem fonte explícita identificada | Média | Confirmar se é gerada em M ou se existe view no Snowflake |
| Filtro de período hardcoded (jan–mai 2026) | Média | Parametrizar — ex.: env var `PERIOD_START` / `PERIOD_END` |
| Bookmarks (2) com comportamento desconhecido | Média | Ler `.bookmark.json` e decidir se viram estado de URL ou são descartados |
| 11 LocalDateTables = inteligência de tempo automática do PBI | Baixa | Usar `dCalendario` diretamente nas queries SQL; não replicar as LocalDateTables |
| Imagens de fundo PNG customizadas | Baixa | Recriar layout com Tailwind; as imagens servem apenas de fundo decorativo |

## Próximos passos

1. **`snowflake-mapeamento`** — confirmar colunas e nomes exatos em `VW_FUNIL_CONSULTORIA` e `VW_APORTE_RESGATE`; mapear `dCalendario`.
2. Definir qual página migrar primeiro (recomendado: **Aquisição** — é a principal e tem filtro simples).
3. **`gerar-dashboard-web`** — criar rota `/dashboards/dash-aquisicao` com a página Aquisição.
4. Ler bookmarks individuais para decidir tratamento.
