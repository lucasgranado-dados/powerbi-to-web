# Dashboard: btg-pl

Documentação da migração do dashboard **btg-pl**.

- `diagnostico.md` — análise do PBIP/TMDL/PBIR (gerado na etapa de diagnóstico).
- `arquitetura.md` — decisões de arquitetura Next.js.
- `inventario-pbip.md` — gerado por `npm run pbip:inventory -- --slug btg-pl`.

## Fluxo

1. Copie o PBIP para `powerbi-input/btg-pl/`.
2. `npm run pbip:check -- --slug btg-pl`
3. `npm run pbip:inventory -- --slug btg-pl`
4. Rode os prompts em `prompts/` na ordem.
