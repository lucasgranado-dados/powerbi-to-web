# 03 — Checar TMDL/PBIR

Antes do diagnóstico com IA, valide se o pacote PBIP está completo.

## Rodar a checagem

```bash
npm run pbip:check -- --slug <slug>
npm run pbip:inventory -- --slug <slug>
```

Saída esperada (exemplo):

```text
✅ PBIP encontrado
✅ Pasta Report encontrada
✅ definition.pbir encontrado
✅ PBIR granular encontrado
✅ SemanticModel encontrado
✅ TMDL encontrado
```

## Interpretando os resultados

| Sinal | Significado | Ação |
| --- | --- | --- |
| ❌ Nenhum `.tmdl` | TMDL não foi habilitado na exportação | Reexporte com TMDL ligado (`docs/02`) |
| ⚠️ `model.bim` | Modelo legado/TMSL (JSON único) | Prefira TMDL; reexporte se possível |
| ⚠️ `report.json` | Relatório legado (sem PBIR granular) | Habilite PBIR e reexporte |
| ⚠️ PBIR granular ausente | `.Report/definition` não existe | Habilite PBIR e salve novamente |
| ⚠️ Mais de um `.pbip` | Ambiguidade de projeto | Mantenha apenas o correto |

## O que significam

- **`model.bim`** — formato TMSL antigo do modelo. Funciona, mas é menos legível
  que o TMDL para a IA. Prefira TMDL.
- **`report.json`** — formato antigo do relatório, sem a granularidade do PBIR
  (páginas/visuais separados). Prefira PBIR.

## Quando o TMDL não aparece

Volte ao Power BI Desktop, habilite **TMDL** em Preview features, **salve
novamente** o `.pbip` e recopie para `powerbi-input/<slug>/`.

## Quando o PBIR granular não aparece

Habilite **enhanced report metadata (PBIR)**, salve novamente e recopie. A pasta
`.Report/definition/` deve conter os JSONs de páginas e visuais.

## Próximo

Leia `04-revisao-medidas-dax-complexas.md`.
