# 13 — Variáveis de ambiente (Autenticação)

Variáveis da camada de autenticação. **Nenhuma** é pública: nunca prefixe com
`NEXT_PUBLIC_`. Local em `.env.local`; produção/preview nas Environment Variables
da Vercel.

## Tabela

| Variável | Obrigatória | Onde obter | Observações |
| --- | --- | --- | --- |
| `AUTH_SECRET` | Sim | `npx auth secret` | Assina o cookie de sessão. Use valores distintos por ambiente. |
| `AUTH_GOOGLE_ID` | Sim | Google Cloud Console | Client ID OAuth (ver `12-google-oauth-setup.md`). |
| `AUTH_GOOGLE_SECRET` | Sim | Google Cloud Console | Client secret OAuth. Secreto. |
| `AUTH_URL` | Recomendada | — | URL pública (ex.: `https://<dashboard>.vercel.app`). Em local pode omitir. |
| `AUTH_TRUST_HOST` | Sim (Vercel) | — | `true` atrás de proxy. |
| `AUTH_ALLOWED_DOMAINS` | Não | — | Domínios aceitos, separados por vírgula. Default: `suno.com.br,sunoresearch.com.br`. |
| `DATAHUB_FRAME_ANCESTORS` | Para iframe | Time DataHub | Origem(ns) autorizadas a embutir via iframe (separadas por espaço). Sem valor = bloqueia iframe. Ver `14-datahub-iframe-auth.md`. |

## Regras

- **Anti-`NEXT_PUBLIC_`**: as `AUTH_*` são lidas apenas no servidor
  (`src/server/auth`, `middleware.ts`). Expor qualquer uma no frontend vaza
  segredo.
- **Segredos distintos por ambiente**: `AUTH_SECRET` de produção ≠ preview ≠ local.
- **Sem valores no git**: `.env.example` traz só os nomes; valores ficam em
  `.env.local` (ignorado) e na Vercel.

## Verificação rápida

```bash
npx auth secret        # gera AUTH_SECRET
npm run dev            # rota protegida deve redirecionar para /auth/signin
```

## Próximo

Leia `14-datahub-iframe-auth.md`.
