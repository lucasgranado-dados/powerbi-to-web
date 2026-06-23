# 14 — Autenticação + iframe do DataHub

Os dashboards continuam sendo embutidos via **iframe** no DataHub. Autenticação
dentro de iframe tem duas armadilhas conhecidas — esta camada já as trata.

## As duas armadilhas

1. **Google bloqueia frame** — a tela de login do Google não pode ser exibida
   dentro de um iframe (política anti-clickjacking do próprio Google).
2. **Cookies de terceiros** — quando o dashboard roda embutido em outra origem
   (DataHub), o navegador trata o cookie de sessão como "de terceiro" e pode
   bloqueá-lo (Safari ITP, Chrome).

## Estratégia adotada

- **Login em nível superior (popup)** — em `auth/signin/page.tsx`, quando a página
  detecta que está embutida (`window.self !== window.top`), o botão abre o login
  num **popup** (janela de nível superior), onde o Google funciona normalmente.
  Ao concluir, o popup chama `auth/popup-done` que envia `postMessage` ao iframe;
  o iframe recarrega já autenticado.
- **Cookie particionado** — em produção, o cookie de sessão é emitido com
  `SameSite=None; Secure; Partitioned` (CHIPS), permitindo que a sessão funcione
  dentro do iframe de terceiro. Configurado em `src/server/auth/config.ts`
  (`useSecureCookies`). Em desenvolvimento (HTTP), usa-se o padrão `Lax`.
- **`frame-ancestors`** — `next.config.ts` envia
  `Content-Security-Policy: frame-ancestors <DATAHUB_FRAME_ANCESTORS>`, permitindo
  o embed apenas a partir da(s) origem(ns) do DataHub. Substitui `X-Frame-Options`
  (que não permite allowlist de origem).

## Configuração necessária

1. Definir `DATAHUB_FRAME_ANCESTORS` com a origem do DataHub (ex.:
   `https://datahub.suno.com.br`) — local e na Vercel. Sem isso, o default
   `'self'` bloqueia o iframe.
2. Servir em **HTTPS** (Vercel já faz) — `SameSite=None; Secure` exige HTTPS.

## Troubleshooting

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| iframe em branco / "recusou conexão" | `frame-ancestors` não inclui a origem | Ajuste `DATAHUB_FRAME_ANCESTORS`. |
| Login abre mas iframe não atualiza | popup bloqueado ou `postMessage` de outra origem | Libere popups; confira que iframe e app têm a mesma origem. |
| Loga e volta deslogado no iframe | cookie de terceiro bloqueado | Confirme HTTPS e `SameSite=None; Secure; Partitioned` (produção). |
| Funciona fora do iframe, falha embutido | testando em HTTP | Teste em deploy HTTPS (preview/prod). |

## Teste manual

1. Faça deploy preview (HTTPS) e configure `DATAHUB_FRAME_ANCESTORS`.
2. Crie um HTML de teste na origem do DataHub com
   `<iframe src="https://<dashboard>.vercel.app/...">`.
3. Sem sessão → botão abre popup → login Google → popup fecha → iframe recarrega
   autenticado.

## Próximo

Volte ao `09-checklist-final.md` e marque os itens de autenticação.
