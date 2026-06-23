# Prompt 10 — Validar autenticação

Valide a camada de autenticação de `{{DASHBOARD_SLUG}}` antes do deploy/PR.

## Objetivo

Confirmar que a restrição por domínio, a proteção de rotas e o fluxo no iframe
funcionam, e que as variáveis estão configuradas.

## Entrada

- Projeto com a camada implementada (prompt 09).
- Deploy preview (HTTPS) para os testes de iframe.

## Tarefas

1. **Testes automáticos**: `npm run lint && npm run typecheck && npm run test && npm run build`.
   Confirme o teste de `allowed-domains` (aceita/rejeita por domínio e
   `email_verified`).
2. **Domínio**: com conta `@suno.com.br`/`@sunoresearch.com.br` → entra; conta de
   outro domínio → barrada em `/auth/error`.
3. **Proteção de rota**: rota de dashboard sem sessão → redireciona para
   `/auth/signin?callbackUrl=...`; `/healthz` e `/api/auth/*` respondem sem auth.
4. **Iframe (preview HTTPS)**: embutir num iframe na origem do DataHub → sem
   sessão dispara popup de login → após login o iframe recarrega autenticado;
   conferir cookie `SameSite=None; Secure; Partitioned` e `frame-ancestors`.
5. **Segredos**: nenhuma `AUTH_*` aparece no bundle do cliente / como
   `NEXT_PUBLIC_`.
6. **Vercel**: `AUTH_*` e `DATAHUB_FRAME_ANCESTORS` configuradas em Production e
   Preview; redirect URI do Google bate com a URL.

## Saída

Checklist preenchido (itens de Autenticação de `docs/09-checklist-final.md`) e
pendências registradas em `validation-notes.md`.

## Próximo

Siga para `11-revisao-final-e-pr.md`.
