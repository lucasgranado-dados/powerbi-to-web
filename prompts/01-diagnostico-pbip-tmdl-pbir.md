# Prompt 01 — Diagnóstico PBIP/TMDL/PBIR

Analise o pacote PBIP do dashboard `{{DASHBOARD_SLUG}}` e produza um diagnóstico
técnico. **Não altere código nesta etapa.**

## Entrada

- Pasta `powerbi-input/{{DASHBOARD_SLUG}}/` (TMDL/PBIR são a fonte de verdade).
- Inventário gerado: `docs/dashboards/{{DASHBOARD_SLUG}}/inventario-pbip.md`.

## Tarefas

1. Leia o **TMDL** (`.SemanticModel/definition/`) e o **PBIR**
   (`.Report/definition/`).
2. Liste, com base em evidência:
   - **páginas** do relatório;
   - **visuais** por página (tipo e campos);
   - **medidas** (nome + DAX resumido);
   - **tabelas** e colunas relevantes;
   - **relacionamentos**;
   - **filtros/segmentações** (slicers) e filtros de página/visual.
3. Identifique **bookmarks**, **drill-through** e **RLS** (se houver).
4. Aponte a **hierarquia visual** (o que é destaque, o que é detalhe).
5. **Classifique a complexidade** (baixa/média/alta) com justificativa.
6. **Liste riscos** (ex.: medidas complexas, dependências, RLS, dados sensíveis).

## Saída

Crie/atualize `docs/dashboards/{{DASHBOARD_SLUG}}/diagnostico.md` com as seções
acima. Onde faltar evidência, escreva **"pendência"** explicitamente — não
preencha por suposição.

Não escreva código nem crie queries ainda.
