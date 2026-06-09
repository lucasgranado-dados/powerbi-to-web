# 09 — Snowflake (camada ouro)

## Papel no framework

O **Snowflake** é a **fonte preferencial dos dados reais** da aplicação web,
especialmente a **camada ouro** (GOLD): dados já tratados, governados e prontos
para consumo. O Power BI permanece como **referência** do dashboard; o Snowflake
fornece os **números**.

## Power BI (referência) vs Snowflake (fonte)

| Aspecto | Power BI | Snowflake (ouro) |
| --- | --- | --- |
| Papel | Referência visual e de regras (TMDL/PBIR) | Dados reais consumidos pela web |
| Uso na migração | Entender medidas, visuais, filtros | Alimentar KPIs, gráficos, tabelas |
| Verdade | De **negócio/visual** | De **dados** |

## Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha (ver `docs/07` para a Vercel):

```env
SNOWFLAKE_ACCOUNT=...
SNOWFLAKE_USERNAME=...
SNOWFLAKE_ROLE=...
SNOWFLAKE_WAREHOUSE=...
SNOWFLAKE_DATABASE=...
SNOWFLAKE_SCHEMA=GOLD
SNOWFLAKE_AUTHENTICATOR=SNOWFLAKE_JWT
SNOWFLAKE_PRIVATE_KEY=...
SNOWFLAKE_PRIVATE_KEY_PASSPHRASE=   # opcional
```

## Testar a conexão

```bash
npm run snowflake:check     # confere se as variáveis existem (sem imprimir valores)
npm run snowflake:test      # executa SELECT CURRENT_VERSION()
```

## Organizar queries

- SQL versionado em `snowflake/queries/dashboards/<slug>/*.sql` (com comentários
  de visual/medida/filtros/campos/validação).
- Espelho em `src/features/dashboards/<slug>/queries.ts` (executado em runtime).
- Funções de busca em `snowflake-queries.ts` (fetch + adapt + fallback).

## Mapear campos Power BI → camada ouro

Use o **source-map**:

- JSON: `snowflake/mappings/<slug>.source-map.json`
- Tipado: `src/features/dashboards/<slug>/source-map.ts`

Cada entrada liga **medida/visual do Power BI** → **tabela/view ouro** →
**componente**, com `status` (`pending_mapping` / `pending_validation` /
`validated`). **Não invente** nomes — use `CHANGE_ME_*` até confirmar.

## Evitar exposição de credenciais

- Conexão **só server-side** (`src/server/snowflake`, módulos `server-only`).
- Nunca `NEXT_PUBLIC_` para segredos.
- Erros retornados ao frontend são "seguros" (sem SQL bruto/credenciais).

## Quando usar mocks

Apenas como **fallback de desenvolvimento** (Snowflake não configurado). Em
produção, configure o Snowflake; o mock não deve aparecer.

## Validar contra o Power BI

Veja `06-validacao-paridade.md`.
