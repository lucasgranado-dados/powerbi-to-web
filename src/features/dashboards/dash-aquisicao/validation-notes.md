# Notas de validação — `dash-aquisicao`

> Atualize este arquivo a cada etapa. Ele é a memória viva das pendências e
> decisões da migração deste dashboard.

## Status geral

- [x] Diagnóstico PBIP/TMDL/PBIR concluído
- [x] Source-map preenchido (sem `CHANGE_ME`)
- [x] Queries Snowflake apontando para `SERVING_LAYER.CONSULTORIA` (VW_FUNIL_CONSULTORIA)
- [x] Bug `DETAIL_TABLE_SDR_SQL` (duplo GROUP BY) corrigido — split em `arr_card_cliente` + `arr_card_sdr`
- [x] Páginas RV Closer e RV SDR criadas com SQL completo (Faixa + Média Móvel 3M via window function)
- [ ] Credenciais Snowflake configuradas no `.env.local`
- [ ] KPIs validados contra o Power BI
- [ ] Tabela detalhe (Aquisição) validada
- [ ] Tabela SDR validada
- [ ] Gráfico série temporal validado
- [ ] RV Closer/SDR validados contra o Power BI (especialmente Faixa e Média Móvel 3M)
- [ ] Validação de negócio assinada por responsável

## Páginas mapeadas

| Página PBI | Rota web | Status |
|---|---|---|
| Aquisição | `/dashboards/dash-aquisicao` | ✅ UI gerada — pendente validação |
| Aquisição SDR | `/dashboards/dash-aquisicao/sdr` | ✅ UI gerada — bug SQL corrigido — pendente validação |
| Aquisição visão geral | `/dashboards/dash-aquisicao/visao-geral` | ✅ UI gerada — pendente validação |
| RV Closer | `/dashboards/dash-aquisicao/rv-closer` | ✅ UI gerada — pendente validação crítica |
| RV SDR | `/dashboards/dash-aquisicao/rv-sdr` | ✅ UI gerada — pendente validação crítica |

## Métricas — pendências críticas

| Métrica | Pendência | Criticidade |
|---|---|---|
| `.ARR Ajustado via API` | Validar piso R$6k linha a linha vs PBI | Alta |
| `Total ARR card ajustado` | Confirmar ausência de filtro de status (intencional?) | Alta |
| `Taxa efetiva closer` | Confirmar numerador: `.ARR Ajustado` (PL base) ou via API | Alta |
| `Variavel consultor aquisicao` | Confirmar cálculo em cadeia com negócio antes de publicar | Alta |
| `SLA Aquisicao` (card) | Confirmar se card usa MAX ou mediana | Média |
| `dCalendario` | Fonte não localizada na view — confirmar se existe view de calendário no Snowflake | Média |
| Filtro de período | PBI original hardcodado jan–mai 2026 via M; web usa parâmetros dinâmicos | Média |

## Decisões de arquitetura

- **Filtro de período**: parametrizado via `periodoInicio` / `periodoFim` em vez de hardcode.
  No PBI, `fMovimentações` tinha jan–mai/2026 fixo; aqui usa `CURRENT_DATE()` como fallback.
- **Tabela `_copy`**: a página "Aquisição visão geral" usa a mesma view com o mesmo filtro;
  o isolamento de contexto do PBI é desnecessário em SQL server-side.
- **EMAIL_CONSULTORIA**: coluna exposta apenas via Server Component — nunca como `NEXT_PUBLIC_`.
- **Fallback mock**: ativo quando Snowflake não está configurado. Em produção não deve aparecer.

## Riscos conhecidos

- Os dados exibidos por padrão são **MOCK** até o `.env.local` ser configurado.
- Bug do `DETAIL_TABLE_SDR_SQL` (duplo GROUP BY) corrigido em 2026-06-30. Revalidar resultado SDR contra o Power BI.
- **RV Closer/SDR — produtos especiais**: `ADV_PRODUTO_ADQUIRIDO_FUNIL` e `AMOUNT_FUNIL` confirmados na view (2026-06-30). Incluídos no cálculo de `ARR_TOTAL` e `ARR_BASE` para Mentoria, Assinatura Black e Grupo Elite.
- **RV — Média Móvel 3M**: o SQL computa a janela sobre TODOS os registros históricos (sem filtro de data na query interna) para garantir que M1 e meses anteriores ao período selecionado alimentem corretamente a janela. Isso é correto mas pode ser mais lento em tabelas grandes.
- **RV — M1 (first month)**: no DAX, M1 é fixado em 01/03/2026 como referência base. No SQL, M1 é calculado como o primeiro mês com ARR > 0 para cada Closer/SDR. Validar se essa diferença impacta o cálculo de Faixa no período inicial.
- Nenhum resultado de validação real foi obtido ainda.

## Responsável de negócio

- Nome: _a definir_
- Data da validação: _a definir_
