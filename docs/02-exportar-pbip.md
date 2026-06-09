# 02 — Exportar PBIP

O **PBIP** (Power BI Project) é o formato de projeto, baseado em arquivos de
texto, que torna o dashboard legível para humanos e para a IA.

## Passo a passo (Power BI Desktop)

1. **Abra o `.pbix`** original no Power BI Desktop.
2. Habilite os formatos de projeto em **File → Options and settings → Options →
   Preview features**:
   - ✅ **Power BI Project (.pbip) save option**
   - ✅ **Store semantic model using TMDL format**
   - ✅ **Store reports using enhanced metadata format (PBIR)**
3. Reinicie o Power BI Desktop se solicitado.
4. **File → Save as** → escolha o tipo **Power BI project files (\*.pbip)**.
5. Salve em uma pasta nova.
6. **Salve novamente** (Ctrl+S) para garantir que TMDL e PBIR sejam materializados.

## Pastas geradas (esperado)

```text
<nome>.pbip
<nome>.Report/
├── definition.pbir
└── definition/                 # PBIR granular (pages/visuals em JSON)
<nome>.SemanticModel/
└── definition/                 # TMDL (.tmdl): tables, measures, relationships
```

## Copiar para o repositório

```bash
# crie a estrutura do dashboard (opcional, mas recomendado)
npm run dashboard:init -- --slug <slug>

# copie o PBIP exportado:
cp -r /caminho/do/export/* powerbi-input/<slug>/
```

> O conteúdo de `powerbi-input/` é ignorado pelo git (contém dados/segredos).

## Próximo

Leia `03-checar-tmdl-pbir.md`.
