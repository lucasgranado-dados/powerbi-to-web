# Gabarito — card de revisão de medida DAX

> Fonte do card gerado por `npm run dax:review-cards`. Use como referência ao
> preencher/editar `src/features/dashboards/<slug>/dax/complex-measures.review.md`.

## Medida: <nome>

### DAX original

```DAX
...
```

### Classificação

Complexidade: complex | critical

Motivos:

- ...

### Interpretação semântica

Explique em linguagem natural o que a medida faz.

### Contexto de filtro

Filtros mantidos:

- ...

Filtros removidos:

- ...

Filtros alterados:

- ...

### Dependências

Tabelas:

- ...

Colunas:

- ...

Medidas dependentes:

- ...

Relacionamentos relevantes:

- ...

### Risco de tradução

Baixo | Médio | Alto

### Estratégia recomendada

- SQL Snowflake;
- adapter TypeScript;
- pré-agregação;
- query separada;
- validação manual obrigatória;
- não migrar automaticamente.

### Tradução proposta

```sql
-- SQL candidato, se seguro
```

### Casos de teste obrigatórios

| Cenário | Filtros aplicados | Resultado esperado Power BI | Resultado Snowflake | Status |
| ------- | ----------------- | --------------------------- | ------------------- | ------ |

### Pendências

- [ ] Confirmar regra com responsável de negócio
- [ ] Validar resultado contra Power BI
- [ ] Revisar comportamento com filtros de calendário
