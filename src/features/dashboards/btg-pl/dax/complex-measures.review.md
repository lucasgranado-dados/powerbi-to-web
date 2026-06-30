# Revisão de Medidas DAX Complexas — `btg-pl`

> Placeholder. Este arquivo é **regenerado** por
> `npm run dax:review-cards -- --slug <slug>` a partir de
> `dax/measures.catalog.json` (após `dax:extract` e `dax:classify`).
>
> Cada medida `complex`/`critical` recebe um card com: DAX original,
> classificação, interpretação semântica, contexto de filtro (mantidos /
> removidos / alterados), dependências, risco de tradução, estratégia
> recomendada, SQL candidata e casos de teste obrigatórios.

Nenhuma medida revisada ainda. Rode o fluxo:

```bash
npm run dax:extract -- --slug <slug>
npm run dax:classify -- --slug <slug>
npm run dax:review-cards -- --slug <slug>
```

Toda medida complexa precisa de **explicação semântica** e **plano de validação**
antes de ser usada de forma definitiva. Veja `dax-review/` e
`docs/04-revisao-medidas-dax-complexas.md`.
