---
name: deploy-vercel
description: >-
  Faz o deploy do dashboard web na Vercel com as checagens e variáveis de
  ambiente corretas. Use quando o analista pedir para publicar, subir, fazer
  deploy (preview ou produção) na Vercel, configurar as variáveis do Snowflake na
  Vercel, ou preparar a publicação no DataHub.
---

# Deploy na Vercel

Publique o dashboard usando o **Vercel CLI real** (com autenticação do usuário),
após as checagens de qualidade. **Não** use endpoints de deploy anônimos.

## Regras-guarda

- **Nunca** prefixe credenciais com `NEXT_PUBLIC_`. As `SNOWFLAKE_*` são lidas
  apenas no servidor (`src/server/snowflake`, `server-only`).
- O build não deve exigir Snowflake real: sem as variáveis, a app cai em mock.

## Pré-deploy (sempre)

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
Corrija tudo antes de prosseguir.

## Deploy

```bash
npm i -g vercel     # uma vez
vercel              # deploy preview (na 1ª vez, vincula o projeto)
vercel --prod       # produção
```

> O login é interativo. Se precisar que o usuário rode o login, sugira que ele
> digite `! vercel login` no prompt da sessão.

## Variáveis de ambiente na Vercel

Em **Project → Settings → Environment Variables** (Production e Preview):

```
SNOWFLAKE_ACCOUNT, SNOWFLAKE_USERNAME, SNOWFLAKE_ROLE, SNOWFLAKE_WAREHOUSE,
SNOWFLAKE_DATABASE, SNOWFLAKE_SCHEMA, SNOWFLAKE_AUTHENTICATOR (SNOWFLAKE_JWT),
SNOWFLAKE_PRIVATE_KEY (PEM; pode usar \n literais),
SNOWFLAKE_PRIVATE_KEY_PASSPHRASE (opcional),
DASHBOARD_CACHE_SECONDS (opcional), NEXT_PUBLIC_APP_NAME (público)
```

## Pós-deploy

- Abra um PR com `.github/pull_request_template.md` (inclua a URL do preview).
- Publique/embuta a URL no **DataHub** conforme o processo da área e registre o
  link no PR.

## Referências

- `docs/07-deploy-vercel.md`, `docs/08-checklist-final.md`
- `prompts/07-revisao-final-e-pr.md`
