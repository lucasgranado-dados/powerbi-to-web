# 11 — Autenticação com Auth.js

Camada padrão de autenticação corporativa dos dashboards migrados. Usa
**Auth.js (NextAuth v5)** com login **Google** restrito aos domínios da empresa.
Todo dashboard gerado pela esteira já nasce com esta camada.

## Por que autenticar

O DataHub controla o acesso ao **item de catálogo**, mas a URL pública do
dashboard na Vercel ficaria acessível a qualquer pessoa. Esta camada protege a
própria URL: só entram contas Google **@suno.com.br** e **@sunoresearch.com.br**.

## Conceitos (Auth.js v5)

- **Provider Google** — login via conta Google corporativa (OAuth 2.0).
- **Sessão JWT** — sem banco de dados; a sessão vive num cookie assinado.
- **`signIn` callback** — porta de entrada da restrição por domínio.
- **`middleware.ts`** — protege as rotas antes da página renderizar.
- **Route handler** — `/api/auth/*` responde aos fluxos do Auth.js.

## Arquivos da camada

```text
src/server/auth/
├── allowed-domains.ts   # allowlist + validação (puro, testável)
├── config.ts            # NextAuthConfig (edge-safe, sem server-only)
└── index.ts             # NextAuth(): handlers, auth, signIn, signOut (server-only)
src/app/api/auth/[...nextauth]/route.ts   # handlers GET/POST
src/app/auth/signin/page.tsx              # tela de login (iframe-aware)
src/app/auth/popup-done/page.tsx          # retorno do popup de login
src/app/auth/error/page.tsx               # erro genérico
src/app/healthz/route.ts                  # healthcheck público
src/components/auth/SessionProvider.tsx   # provider client
src/components/auth/SignOutButton.tsx     # botão de logout (opcional)
middleware.ts                             # proteção das rotas
src/types/next-auth.d.ts                  # extensão de tipos
```

A camada Snowflake **não muda**: a autenticação define *quem vê* o dashboard; a
conexão server-side continua igual.

## Setup

```bash
npm install                 # next-auth já está no package.json
npx auth secret             # gera AUTH_SECRET e grava em .env.local
```

Preencha o restante de `.env.local` (ver `13-variaveis-ambiente-auth.md`):

```text
AUTH_SECRET=...                 # gerado acima
AUTH_GOOGLE_ID=...              # Google Cloud Console (ver 12-google-oauth-setup.md)
AUTH_GOOGLE_SECRET=...
AUTH_ALLOWED_DOMAINS=suno.com.br,sunoresearch.com.br
```

Rode `npm run dev` e acesse uma rota protegida: você será redirecionado para
`/auth/signin`.

## Restrição por domínio

O callback `signIn` em `src/server/auth/config.ts` só aprova quem tem:

1. **e-mail verificado** pelo Google (`email_verified === true`);
2. **domínio** do e-mail dentro de `AUTH_ALLOWED_DOMAINS`.

A lógica fica em `src/server/auth/allowed-domains.ts` (função pura `isEmailAllowed`),
coberta por testes em `tests/unit/allowed-domains.test.ts`. Não confiamos apenas
no campo `hd` do Google — validamos o domínio do próprio e-mail.

## Proteção de rotas

O `middleware.ts` protege **tudo**, exceto o que está liberado no `matcher`:
`/api/auth/*`, páginas `/auth/*`, `/healthz`, internals do Next e assets. Sem
sessão, redireciona para `/auth/signin?callbackUrl=<destino>`.

## Logout

Use `<SignOutButton />` (`src/components/auth/SignOutButton.tsx`) no header do
dashboard, ou chame `signOut()` do `next-auth/react`.

## Iframe (DataHub)

O login dentro do iframe do DataHub tem regras próprias (Google bloqueia frame,
cookies de terceiros). Ver `14-datahub-iframe-auth.md`.

## Próximo

Leia `12-google-oauth-setup.md` para criar as credenciais do Google.
