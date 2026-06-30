# Notas de validação — `btg-pl`

> Atualize este arquivo a cada etapa. Ele é a memória viva das pendências e
> decisões da migração deste dashboard.

## Status geral

- [ ] Diagnóstico PBIP/TMDL/PBIR concluído
- [ ] Source-map preenchido (sem `CHANGE_ME`)
- [ ] Queries Snowflake apontando para tabelas/views reais da camada ouro
- [ ] KPIs validados contra o Power BI
- [ ] Gráfico validado contra o Power BI
- [ ] Tabela de detalhe validada contra o Power BI
- [ ] Validação de negócio assinada por responsável

## Métricas pendentes

| Métrica | Status | Pendência |
| --- | --- | --- |
| Receita | pending_validation | Confirmar se inclui impostos/descontos |
| Pedidos | pending_validation | Confirmar contagem distinta de `ORDER_ID` |
| Ticket médio | pending_validation | Validar divisão por zero e granularidade |
| Conversão | pending_mapping | Origem de "Sessões" não localizada na camada ouro |

## Decisões de arquitetura

- (registre aqui escolhas relevantes: ECharts vs Recharts, agregações server-side, etc.)

## Riscos conhecidos

- Os dados exibidos por padrão são **MOCK** até o Snowflake ser configurado.
- Nenhum nome real de tabela/coluna foi assumido — placeholders `CHANGE_ME_*`.

## Responsável de negócio

- Nome: _a definir_
- Data da validação: _a definir_
