import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { isEmailAllowed } from "./allowed-domains";

/**
 * Configuração compartilhada do Auth.js (NextAuth v5).
 *
 * Mantida **edge-safe** (sem `server-only`, sem adapter de banco, estratégia JWT)
 * para poder ser usada tanto pelo `middleware.ts` (Edge Runtime) quanto pelo
 * route handler (Node). O segredo de autenticação (`AUTH_SECRET`) e as credenciais
 * do Google (`AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`) são lidos automaticamente pelo
 * Auth.js a partir das variáveis de ambiente — nunca prefixe com `NEXT_PUBLIC_`.
 */

// Em produção (HTTPS) usamos cookies particionados com SameSite=None para que a
// sessão sobreviva quando o dashboard é embutido via iframe no DataHub (CHIPS).
// Em desenvolvimento (HTTP localhost) mantemos o padrão (Lax) para o login funcionar.
const useSecureCookies = process.env.NODE_ENV === "production";

export const authConfig: NextAuthConfig = {
  // Necessário na Vercel/atrás de proxy (também via AUTH_TRUST_HOST=true).
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Google({
      // Sempre permite escolher a conta (evita login silencioso na conta errada).
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    /**
     * Porta de entrada da restrição corporativa: só passa quem tem e-mail
     * verificado e domínio na allowlist (AUTH_ALLOWED_DOMAINS).
     */
    signIn({ profile }) {
      const p = profile as
        | { email?: string | null; email_verified?: boolean }
        | undefined;
      return isEmailAllowed(p?.email, p?.email_verified);
    },
    /** Usado pelo wrapper do middleware: autorizado = tem sessão. */
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
  ...(useSecureCookies
    ? {
        cookies: {
          sessionToken: {
            name: "__Secure-authjs.session-token",
            options: {
              httpOnly: true,
              sameSite: "none",
              path: "/",
              secure: true,
              // Cookie particionado (CHIPS) — chave para iframe de terceiros.
              partitioned: true,
            },
          },
        },
      }
    : {}),
};
