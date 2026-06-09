# 07 — Deploy na Vercel

## Rodar local

```bash
npm run dev          # http://localhost:3000
```

## Build local (verificação)

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deploy preview

```bash
npm i -g vercel      # uma vez
vercel               # cria um deploy preview (primeira vez: vincula o projeto)
```

## Deploy produção

```bash
vercel --prod
```

## Variáveis de ambiente na Vercel

Configure em **Project → Settings → Environment Variables** (Production e Preview):

```text
SNOWFLAKE_ACCOUNT
SNOWFLAKE_USERNAME
SNOWFLAKE_ROLE
SNOWFLAKE_WAREHOUSE
SNOWFLAKE_DATABASE
SNOWFLAKE_SCHEMA
SNOWFLAKE_AUTHENTICATOR        # SNOWFLAKE_JWT
SNOWFLAKE_PRIVATE_KEY          # conteúdo PEM (pode usar \n literais)
SNOWFLAKE_PRIVATE_KEY_PASSPHRASE   # opcional
DASHBOARD_CACHE_SECONDS        # opcional
NEXT_PUBLIC_APP_NAME           # público
```

### Sobre a chave privada

- Cole o **PEM completo**. Se o painel não aceitar quebras de linha, substitua-as
  por `\n` literais — o `client.ts` reconverte para quebras reais.
- A chave é lida **apenas no servidor**.

## Evitar segredos no frontend

- **Nunca** prefixe credenciais com `NEXT_PUBLIC_`.
- A conexão Snowflake só acontece em `src/server/snowflake` (módulos
  `server-only`). Se um Client Component tentar importá-los, o build falha — isso
  é proposital.

## DataHub

Após o deploy, publique/embuta a URL no DataHub conforme o processo da sua área
(catálogo/descoberta). Registre o link no PR.

## Próximo

Leia `08-checklist-final.md`.
