# Prompt 09 — Implementar autenticação

Implemente (ou corrija) a camada de autenticação Auth.js em `{{DASHBOARD_SLUG}}`.
No boilerplate, a camada já existe — use este prompt para **plugá-la** num projeto
que ainda não a tem, ou para fechar lacunas apontadas pela auditoria (prompt 08).

## Objetivo

Deixar o dashboard protegido por login Google restrito a `@suno.com.br` e
`@sunoresearch.com.br`, sem expor segredos e mantendo o iframe do DataHub.

## Entrada

- Relatório `auditoria-auth.md` (se houver) do prompt 08.
- Snippets de referência em `docs/snippets/auth/` (cópia autocontida).
- Docs `11-autenticacao-auth-js.md` … `14-datahub-iframe-auth.md`.

## Tarefas

1. **Dependência**: garantir `next-auth@^5` no `package.json` (`npm install`).
2. **Núcleo** (`src/server/auth/`): `allowed-domains.ts` (allowlist + `isEmailAllowed`),
   `config.ts` (edge-safe: Google, JWT, `signIn` por domínio, cookies de iframe em
   produção), `index.ts` (`server-only` + `NextAuth()`).
3. **Route handler**: `src/app/api/auth/[...nextauth]/route.ts`.
4. **Middleware**: `middleware.ts` protegendo tudo, exceto `/api/auth/*`,
   `/auth/*`, `/healthz` e assets.
5. **Telas**: `src/app/auth/signin` (iframe-aware, popup), `auth/popup-done`,
   `auth/error`; `SessionProvider` no `layout.tsx`.
6. **Iframe**: `frame-ancestors` em `next.config.ts` via `DATAHUB_FRAME_ANCESTORS`;
   `healthz` route público.
7. **Env**: adicionar as `AUTH_*` e `DATAHUB_FRAME_ANCESTORS` ao `.env.example`
   (sem valores; nunca `NEXT_PUBLIC_`).

## Regras

- **Não inventar** domínio nem segredo. Use `CHANGE_ME_*` se faltar evidência.
- `AUTH_*` só no servidor. `config.ts` sem `server-only`; `index.ts` com.
- Não alterar a camada Snowflake.

## Saída

Arquivos criados/alterados explicados + `.env.example` atualizado. Rode
`lint`/`typecheck`/`test`/`build`.

## Próximo

Use `10-validar-autenticacao.md`.
