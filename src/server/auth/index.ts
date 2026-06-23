import "server-only";

import NextAuth from "next-auth";

import { authConfig } from "./config";

/**
 * Instância principal do Auth.js — SERVER-SIDE APENAS.
 *
 * - `handlers` → route handler em `src/app/api/auth/[...nextauth]/route.ts`.
 * - `auth`     → ler a sessão em Server Components / Route Handlers.
 * - `signIn` / `signOut` → Server Actions de login/logout.
 *
 * O `import "server-only"` garante erro de build se um Client Component tentar
 * importar este módulo. O `middleware.ts` cria a sua própria instância a partir
 * de `config.ts` (edge-safe) e não importa este arquivo.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
