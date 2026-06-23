---
name: auth-nextauth
description: >-
  Adiciona ou valida a camada padrão de autenticação (Auth.js / NextAuth v5 +
  Google) nos dashboards migrados. Use quando o analista pedir para proteger o
  dashboard, adicionar login, restringir acesso ao domínio corporativo, auditar a
  autenticação, ou garantir que o painel embutido no DataHub (iframe) continue
  funcionando autenticado.
---

# Autenticação Auth.js (Google corporativo)

Adicione/valide a camada padrão de autenticação dos dashboards. Login **Google**
restrito aos domínios **@suno.com.br** e **@sunoresearch.com.br**, com sessão JWT,
middleware de proteção e compatibilidade com o **iframe do DataHub**. No boilerplate
a camada já existe; use esta skill para plugar/auditar/validar em um dashboard.

## Regras-guarda

- **Nunca** prefixe `AUTH_*` com `NEXT_PUBLIC_`. Elas são lidas só no servidor
  (`src/server/auth`, `middleware.ts`).
- `src/server/auth/config.ts` é **edge-safe** (sem `server-only`, usado pelo
  middleware); `src/server/auth/index.ts` é **`server-only`**.
- **Não invente** domínios nem segredos — use o default corporativo / `CHANGE_ME_*`.
- A camada **Snowflake não muda**: auth define *quem vê*, não como conecta.

## Pré-requisitos

- `next-auth@^5` no `package.json` (`npm install`).
- Credenciais OAuth do Google (`docs/12-google-oauth-setup.md`).
- `AUTH_SECRET` (`npx auth secret`) e demais `AUTH_*` em `.env.local`.

## Passos

1. **Núcleo** `src/server/auth/`: `allowed-domains.ts` (allowlist + `isEmailAllowed`),
   `config.ts` (Google, JWT, `signIn` por domínio + `email_verified`, cookies de
   iframe em produção), `index.ts` (`NextAuth()` server-only).
2. **Route handler** `src/app/api/auth/[...nextauth]/route.ts`.
3. **Middleware** `middleware.ts` — protege tudo, libera `/api/auth/*`, `/auth/*`,
   `/healthz`, assets.
4. **Telas** `src/app/auth/{signin,popup-done,error}`; `SessionProvider` no
   `layout.tsx`; `SignOutButton` opcional.
5. **Iframe** `next.config.ts` → `frame-ancestors` via `DATAHUB_FRAME_ANCESTORS`;
   `src/app/healthz/route.ts` público.
6. **Env** `.env.example`: `AUTH_*` + `DATAHUB_FRAME_ANCESTORS` (sem valores).
7. **Checagens** `npm run lint && npm run typecheck && npm run test && npm run build`.

## Próximo

`deploy-vercel` (configurar `AUTH_*` na Vercel) e publicação no DataHub.

## Referências

- `docs/11-autenticacao-auth-js.md`, `docs/12-google-oauth-setup.md`,
  `docs/13-variaveis-ambiente-auth.md`, `docs/14-datahub-iframe-auth.md`
- `docs/snippets/auth/README.md`
- `prompts/08-auditoria-autenticacao.md`, `prompts/09-implementar-autenticacao.md`,
  `prompts/10-validar-autenticacao.md`
