---
name: pbip-diagnostico
description: >-
  Diagnostica um dashboard Power BI a partir do PBIP/TMDL/PBIR e gera o
  diagnóstico técnico. Use quando o analista pedir para analisar/inventariar o
  dashboard original, checar se o PBIP está completo, ou entender páginas,
  visuais, medidas DAX, filtros, tabelas, relações, bookmarks, drill-through e RLS.
---

# Diagnóstico PBIP/TMDL/PBIR

Produza um diagnóstico técnico do dashboard original. **Não altere código de
aplicação nesta etapa** — apenas leia os artefatos e escreva a documentação.

## Quando usar

Logo após `npm run dashboard:init -- --slug <slug>` e a cópia do PBIP para
`powerbi-input/<slug>/`.

## Regras-guarda

- **TMDL/PBIR são a fonte de verdade.** Não suponha: onde faltar evidência,
  escreva **"pendência"** explicitamente.
- Não invente medidas, tabelas ou regras.

## Passos

1. **Checar o pacote** (estrutura PBIP, TMDL, PBIR):
   ```bash
   npm run pbip:check -- --slug <slug>
   ```
   Interprete ❌/⚠️ com `docs/03-checar-tmdl-pbir.md` (ex.: `model.bim` = legado;
   `report.json` = relatório sem PBIR granular). Resolva pendências antes de seguir.
2. **Inventariar** (contagens + inferências de tabelas/medidas/relações):
   ```bash
   npm run pbip:inventory -- --slug <slug>
   ```
   Gera `docs/dashboards/<slug>/inventario-pbip.md`.
3. **Ler** o TMDL (`*.SemanticModel/definition/`) e o PBIR
   (`*.Report/definition/`) e escrever o diagnóstico.

## Saída

Preencha `docs/dashboards/<slug>/diagnostico.md` com: páginas, visuais (tipo +
campos), medidas (nome + DAX resumido), tabelas, relacionamentos,
filtros/segmentações, bookmarks/drill-through/RLS, hierarquia visual,
**classificação de complexidade** (baixa/média/alta) e **riscos**.

## Próximo

Vá para **`snowflake-mapeamento`** (dados) e/ou **`gerar-dashboard-web`** (UI).

## Referências

- `prompts/01-diagnostico-pbip-tmdl-pbir.md`
- `docs/03-checar-tmdl-pbir.md`
