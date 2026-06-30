# Dashboard: dash-aquisicao

Documentação da migração do dashboard **dash-aquisicao**.

- `diagnostico.md` — análise do PBIP/TMDL/PBIR (gerado na etapa de diagnóstico).
- `arquitetura.md` — decisões de arquitetura Next.js.
- `inventario-pbip.md` — gerado por `npm run pbip:inventory -- --slug dash-aquisicao`.

## Fluxo

1. Copie o PBIP para `powerbi-input/dash-aquisicao/`.
2. `npm run pbip:check -- --slug dash-aquisicao`
3. `npm run pbip:inventory -- --slug dash-aquisicao`
4. Rode os prompts em `prompts/` na ordem.
