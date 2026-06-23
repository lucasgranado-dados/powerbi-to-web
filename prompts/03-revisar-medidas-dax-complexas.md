# Prompt 03 — Revisar medidas DAX complexas (DAX Review Layer)

> Substitua `{{DASHBOARD_SLUG}}` pelo slug real. Esta etapa é **obrigatória** para
> medidas complexas/críticas e vem **antes** do mapeamento Snowflake (prompt 04).

## Objetivo

Revisar, classificar, documentar e validar as medidas DAX que dependem do
**contexto de filtro** do Power BI **antes** de convertê-las para SQL/Snowflake,
TypeScript ou lógica da aplicação. Prefira **bloquear** uma tradução insegura a
gerar SQL incorreto.

## Antes de começar

Rode (ou confirme que já rodou) o pipeline da camada:

```bash
npm run dax:extract      -- --slug {{DASHBOARD_SLUG}}
npm run dax:classify     -- --slug {{DASHBOARD_SLUG}}
npm run dax:review-cards -- --slug {{DASHBOARD_SLUG}}
```

Isso gera, em `src/features/dashboards/{{DASHBOARD_SLUG}}/dax/`:
`measures.catalog.json`, `complex-measures.review.md`, `measure-translations.ts`,
`measure-validation-cases.ts`.

## O que você (IA) deve fazer

1. **Ler** `dax/measures.catalog.json`.
2. **Identificar** as medidas `complex` e `critical`.
3. **Criar/completar** os cards de revisão em `dax/complex-measures.review.md`.
4. **Explicar** o comportamento semântico de cada medida em linguagem natural.
5. **Identificar** filtros removidos, mantidos e alterados (use `dax-review/patterns/`).
6. **Propor SQL Snowflake apenas quando seguro**; caso contrário, deixe comentado.
7. **Marcar** medidas incertas como `blocked_for_auto_translation`.
8. **Criar** os casos de validação obrigatórios por medida.
9. **Atualizar** o `validation-notes.md` do dashboard.
10. **Impedir** que medidas complexas sejam usadas como definitivas sem validação.

## Regras inegociáveis

- Não traduza DAX complexo de forma ingênua.
- Toda medida complexa precisa de **explicação semântica** e **plano de validação**.
- Toda SQL proposta é **candidata** até validação de paridade contra o Power BI.
- Não invente nomes de tabela/coluna — use `CHANGE_ME_*` e registre a pendência.
- Consulte os padrões: `dax-review/patterns/` (`selectedvalue.md`, `calculate.md`,
  `removefilters.md`, `all-allselected.md`, `iterators.md`, `time-intelligence.md`).

## Para todo `CALCULATE`, responda

1. Qual expressão está sendo calculada?
2. Quais filtros são adicionados?
3. Quais filtros são removidos?
4. Quais filtros são substituídos?
5. Quais filtros do dashboard permanecem?
6. Existe mudança de relacionamento?
7. Existe dependência de contexto visual?

Se não conseguir responder com evidência → `blocked_for_auto_translation`.

## Exemplo obrigatório

```DAX
VAR Closer =
    CALCULATE(
        SELECTEDVALUE('Clientes consultoria total_v2'[CLOSER_FUNIL]),
        REMOVEFILTERS(dCalendario)
    )
```

Interprete como:

- existe uma variável chamada `Closer`;
- o valor vem de `CLOSER_FUNIL`;
- a tabela de origem é `'Clientes consultoria total_v2'`;
- o resultado depende de haver **exatamente um** valor selecionado;
- filtros de `dCalendario` devem ser **removidos**;
- os **demais** filtros do contexto devem ser **preservados**;
- a tradução SQL deve usar lógica equivalente a `COUNT(DISTINCT)` para simular
  `SELECTEDVALUE` (`CASE WHEN COUNT(DISTINCT col) = 1 THEN MAX(col) ELSE NULL END`);
- filtros de calendário **não** devem ser aplicados nessa métrica;
- a medida exige **validação de paridade** contra o Power BI.

## Saída esperada

- Cards preenchidos em `dax/complex-measures.review.md`.
- `dax/measure-translations.ts` com status realista (nenhuma `validated` sem prova).
- `dax/measure-validation-cases.ts` com cenários cobrindo com/sem calendário e
  valor único/múltiplo.
- `validation-notes.md` atualizado.

## Próximo

Vá para `04-mapear-snowflake-camada-ouro.md`. Medidas `blocked_for_auto_translation`
**não** entram no mapeamento até serem revisadas/validadas.
