# Prompt 08 — Auditoria de autenticação

Audite a camada de autenticação de `{{DASHBOARD_SLUG}}` (ou do boilerplate) e
gere um relatório de lacunas. **Não** altere código neste prompt — só diagnostique.

## Objetivo

Verificar se o dashboard está protegido pela camada padrão de Auth.js (login
Google restrito aos domínios corporativos) e se segue as regras de segurança.

## Entrada

- Código do projeto (`src/server/auth`, `middleware.ts`, `src/app/auth/*`,
  `src/app/api/auth/[...nextauth]`, `next.config.ts`, `.env.example`).
- Docs `11-autenticacao-auth-js.md` … `14-datahub-iframe-auth.md`.

## Tarefas

1. **Presença**: existem `src/server/auth/{config,index,allowed-domains}.ts`,
   o route handler e o `middleware.ts`?
2. **Restrição de domínio**: o callback `signIn` exige `email_verified` e domínio
   em `AUTH_ALLOWED_DOMAINS` (default `suno.com.br,sunoresearch.com.br`)?
3. **Cobertura do middleware**: o `matcher` protege todas as rotas, liberando
   apenas `/api/auth/*`, `/auth/*`, `/healthz` e assets?
4. **Segredos**: nenhuma `AUTH_*` é exposta com `NEXT_PUBLIC_`; `index.ts` é
   `server-only`; o `config.ts` é edge-safe (sem `server-only`).
5. **Iframe/DataHub**: `next.config.ts` envia `frame-ancestors`
   (`DATAHUB_FRAME_ANCESTORS`); cookies de produção usam
   `SameSite=None; Secure; Partitioned`; a tela de signin trata iframe (popup).
6. **Variáveis**: `.env.example` lista todas as `AUTH_*` e `DATAHUB_FRAME_ANCESTORS`.

## Saída

Relatório `auditoria-auth.md` com: itens OK, lacunas (com arquivo/linha) e ações
recomendadas. Sem alterar código.

## Próximo

Use `09-implementar-autenticacao.md` para corrigir as lacunas.
