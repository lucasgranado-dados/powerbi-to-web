# Gabarito — plano de tradução de medida DAX

> Use para documentar a decisão de tradução de uma medida `complex`/`critical`
> antes de escrever o SQL definitivo.

## Medida: <nome>

- **Status atual:** extracted | classified | needs_review | translation_proposed |
  validation_required | validated | blocked_for_auto_translation
- **Risco:** baixo | médio | alto

## As 7 perguntas do CALCULATE (se aplicável)

1. Qual expressão está sendo calculada?
2. Quais filtros são adicionados?
3. Quais filtros são removidos?
4. Quais filtros são substituídos?
5. Quais filtros do dashboard permanecem?
6. Existe mudança de relacionamento?
7. Existe dependência de contexto visual?

> Se alguma pergunta ficar sem resposta com evidência → `blocked_for_auto_translation`.

## Estratégia escolhida

- [ ] SQL Snowflake direto
- [ ] Window function
- [ ] Adapter/derivação em TypeScript (server-side)
- [ ] Pré-agregação na camada ouro
- [ ] Query separada
- [ ] Não migrar automaticamente

## SQL candidato

```sql
-- Marcar SEMPRE como candidato até validar a paridade.
```

## Mapeamento de filtros

| Filtro do dashboard | Mantido? | Como entra no SQL |
| ------------------- | -------- | ----------------- |

## Pendências de validação

- [ ] Validado contra Power BI (ver `validation/dax/`)
- [ ] Assinado pelo responsável de negócio
