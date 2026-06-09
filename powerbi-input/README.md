# powerbi-input

Coloque aqui os pacotes **PBIP** exportados do Power BI, um por dashboard:

```text
powerbi-input/
└── <slug>/                 # ex.: vendas-por-hora
    ├── <nome>.pbip
    ├── <nome>.Report/
    │   ├── definition.pbir
    │   └── definition/      # PBIR granular (páginas, visuais)
    └── <nome>.SemanticModel/
        └── definition/      # TMDL (.tmdl)
```

## Importante

- O conteúdo desta pasta é **ignorado pelo git** (ver `.gitignore`), exceto este
  README e o `.gitkeep`. Os artefatos do Power BI podem conter dados/segredos e
  **não devem ser versionados**.
- Habilite **TMDL** e **PBIR** ao exportar (ver `docs/02-exportar-pbip.md`).
- Depois de copiar, valide com:

  ```bash
  npm run pbip:check -- --slug <slug>
  npm run pbip:inventory -- --slug <slug>
  ```

Os arquivos **TMDL/PBIR** são a **fonte de verdade técnica** para a IA entender
o dashboard original.
