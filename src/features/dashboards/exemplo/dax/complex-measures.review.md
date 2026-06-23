# Revisão de Medidas DAX Complexas — exemplo

> Gerado por `npm run dax:review-cards -- --slug exemplo`. Edite à mão para
> preencher a interpretação semântica, os filtros e os casos de teste.
> Toda medida abaixo precisa de **validação de paridade** antes do uso definitivo.

Medidas que exigem revisão: **2** de 5.

## Medida: Closer

### DAX original

```DAX
VAR Closer =
	CALCULATE(
		SELECTEDVALUE('Clientes consultoria total_v2'[CLOSER_FUNIL]),
		REMOVEFILTERS(dCalendario)
	)
RETURN
	Closer
```

### Classificação

Complexidade: **complex**

Motivos:

- uses CALCULATE
- uses SELECTEDVALUE
- uses REMOVEFILTERS
- uses VAR/RETURN

### Interpretação semântica

> _Explique em linguagem natural o que a medida faz. **Não** traduza ainda._

### Contexto de filtro

Filtros mantidos:

- _a confirmar (todos os filtros do contexto que NÃO foram removidos)_

Filtros removidos:

- dCalendario

Filtros alterados:

- _a confirmar_

### Dependências

Tabelas:

- Clientes consultoria total_v2

Colunas:

- _ver DAX acima_

Medidas dependentes:

- nenhuma

Relacionamentos relevantes:

- _a confirmar (USERELATIONSHIP/TREATAS, se houver)_

### Risco de tradução

**Alto**

### Estratégia recomendada

- [ ] SQL Snowflake
- [ ] adapter TypeScript
- [ ] pré-agregação
- [ ] query separada
- [ ] validação manual obrigatória
- [ ] **não migrar automaticamente**

### Tradução proposta

```sql
-- SQL candidato. NÃO use sem validação contra o Power BI.
```

### Casos de teste obrigatórios

| Cenário | Filtros aplicados | Resultado esperado Power BI | Resultado Snowflake | Status |
| ------- | ----------------- | --------------------------- | ------------------- | ------ |
| Contexto total (sem filtros) | nenhum | _preencher_ | _preencher_ | ⏳ |
| Com filtro de calendário | dCalendario | _preencher_ | _preencher_ | ⏳ |

### Pendências

- [ ] Confirmar regra com responsável de negócio
- [ ] Validar resultado contra Power BI
- [ ] Revisar comportamento com filtros de calendário

---

## Medida: Receita YTD

### DAX original

```DAX
TOTALYTD(SUM('Clientes consultoria total_v2'[VALOR]), dCalendario[Data])
```

### Classificação

Complexidade: **critical**

Motivos:

- uses time intelligence (TOTALYTD)

### Interpretação semântica

> _Explique em linguagem natural o que a medida faz. **Não** traduza ainda._

### Contexto de filtro

Filtros mantidos:

- _a confirmar (todos os filtros do contexto que NÃO foram removidos)_

Filtros removidos:

- nenhum filtro removido detectado automaticamente

Filtros alterados:

- _a confirmar_

### Dependências

Tabelas:

- Clientes consultoria total_v2
- dCalendario

Colunas:

- _ver DAX acima_

Medidas dependentes:

- nenhuma

Relacionamentos relevantes:

- _a confirmar (USERELATIONSHIP/TREATAS, se houver)_

### Risco de tradução

**Alto**

### Estratégia recomendada

- [ ] SQL Snowflake
- [ ] adapter TypeScript
- [ ] pré-agregação
- [ ] query separada
- [ ] validação manual obrigatória
- [ ] **não migrar automaticamente** ✅ (crítica — bloqueada por padrão)

### Tradução proposta

```sql
-- SQL candidato. NÃO use sem validação contra o Power BI.
```

### Casos de teste obrigatórios

| Cenário | Filtros aplicados | Resultado esperado Power BI | Resultado Snowflake | Status |
| ------- | ----------------- | --------------------------- | ------------------- | ------ |
| Contexto total (sem filtros) | nenhum | _preencher_ | _preencher_ | ⏳ |
| Com filtro de calendário | dCalendario | _preencher_ | _preencher_ | ⏳ |

### Pendências

- [ ] Confirmar regra com responsável de negócio
- [ ] Validar resultado contra Power BI
- [ ] Revisar comportamento com filtros de calendário

