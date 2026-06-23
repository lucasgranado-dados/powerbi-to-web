# Snippets — Autenticação Auth.js

Cópia copia-cola da camada de autenticação para plugar em **qualquer** projeto
Next.js App Router (mesmo fora deste boilerplate). No boilerplate, os arquivos
canônicos já existem nos caminhos abaixo — aqui ficam os **blocos de edição** e o
mapa de onde colar cada coisa.

## Mapa de arquivos (fonte de verdade)

Copie estes arquivos do boilerplate (são autocontidos):

| Arquivo | Cole em | Papel |
| --- | --- | --- |
| `src/server/auth/allowed-domains.ts` | mesmo caminho | Allowlist + `isEmailAllowed` (puro, testável) |
| `src/server/auth/config.ts` | mesmo caminho | `NextAuthConfig` edge-safe (Google, JWT, `signIn`, cookies de iframe) |
| `src/server/auth/index.ts` | mesmo caminho | `NextAuth()` server-only (`handlers`, `auth`, `signIn`, `signOut`) |
| `src/app/api/auth/[...nextauth]/route.ts` | mesmo caminho | Route handler `GET`/`POST` |
| `middleware.ts` | raiz | Proteção das rotas |
| `src/app/auth/signin/page.tsx` | mesmo caminho | Tela de login (iframe-aware, popup) |
| `src/app/auth/popup-done/page.tsx` | mesmo caminho | Retorno do popup |
| `src/app/auth/error/page.tsx` | mesmo caminho | Erro genérico |
| `src/app/healthz/route.ts` | mesmo caminho | Healthcheck público |
| `src/components/auth/SessionProvider.tsx` | mesmo caminho | Provider client |
| `src/components/auth/SignOutButton.tsx` | mesmo caminho | Logout (opcional) |
| `src/types/next-auth.d.ts` | mesmo caminho | Extensão de tipos |
| `tests/unit/allowed-domains.test.ts` | mesmo caminho | Teste da allowlist |

## 1. Dependência

```bash
npm install next-auth@^5
npx auth secret          # grava AUTH_SECRET em .env.local
```

## 2. `.env.example` / `.env.local` (bloco a colar)

```bash
# Autenticação (Auth.js / Google) — NUNCA NEXT_PUBLIC_
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_URL=
AUTH_TRUST_HOST=true
AUTH_ALLOWED_DOMAINS=suno.com.br,sunoresearch.com.br
DATAHUB_FRAME_ANCESTORS=
```

## 3. `src/app/layout.tsx` (edição — envolver os children)

```tsx
import { SessionProvider } from "@/components/auth/SessionProvider";
// ...
<body className="...">
  <SessionProvider>{children}</SessionProvider>
</body>
```

## 4. `next.config.ts` (edição — header de iframe)

```ts
const frameAncestors = process.env.DATAHUB_FRAME_ANCESTORS?.trim() || "'self'";

const nextConfig: NextConfig = {
  // ...config existente...
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${frameAncestors};`,
          },
        ],
      },
    ];
  },
};
```

## Notas

- **Domínios**: ajuste `AUTH_ALLOWED_DOMAINS` (ou o default em `allowed-domains.ts`).
- **`config.ts` sem `server-only`** (edge/middleware); **`index.ts` com** `server-only`.
- **Iframe**: ver `docs/14-datahub-iframe-auth.md` (popup + cookie particionado +
  `frame-ancestors`).
- **Google OAuth**: ver `docs/12-google-oauth-setup.md` (redirect URI
  `…/api/auth/callback/google`).
