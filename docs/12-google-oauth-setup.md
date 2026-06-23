# 12 — Configurar o Google OAuth

Passo a passo para criar as credenciais OAuth 2.0 do Google que alimentam
`AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`. **Não** coloque segredos reais no repo.

## 1. Projeto no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie (ou selecione) um projeto da organização — idealmente um projeto único
   compartilhado pelos dashboards da esteira.

## 2. Tela de consentimento OAuth

1. **APIs & Services → OAuth consent screen**.
2. **User type: Internal** — restringe o login a contas da organização Google.
   (Se a org tiver mais de um domínio, garanta que ambos pertençam ao mesmo
   Google Workspace; a allowlist da app reforça a restrição.)
3. Preencha nome do app, e-mail de suporte e domínio.
4. Scopes: bastam os padrões `openid`, `email`, `profile`.

## 3. Credenciais OAuth 2.0

1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. **Application type: Web application**.
3. **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://<dashboard>.vercel.app` (produção)
   - URLs de preview da Vercel, se for usar login em preview.
4. **Authorized redirect URIs** — precisam casar **exatamente** com a URL do
   deploy + `/api/auth/callback/google`:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<dashboard>.vercel.app/api/auth/callback/google`
5. Salve. Copie o **Client ID** e o **Client secret**.

## 4. Gravar as variáveis

```text
AUTH_GOOGLE_ID=<client id>
AUTH_GOOGLE_SECRET=<client secret>
```

Local: em `.env.local`. Produção: nas Environment Variables da Vercel
(ver `08-deploy-vercel.md` e `13-variaveis-ambiente-auth.md`).

## Erros comuns

- **redirect_uri_mismatch** — a redirect URI não bate exatamente (http vs https,
  domínio, barra final, ou falta o sufixo `/api/auth/callback/google`).
- **acesso negado a contas externas** — confirme **Internal** na tela de consentimento
  e os domínios em `AUTH_ALLOWED_DOMAINS`.
- **preview da Vercel não loga** — cada URL de preview é um host diferente; adicione
  a origem/redirect ou faça login só em produção.

## Próximo

Leia `13-variaveis-ambiente-auth.md`.
