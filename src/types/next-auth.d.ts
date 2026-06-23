import type { DefaultSession } from "next-auth";

/**
 * Ponto de extensão dos tipos do Auth.js.
 *
 * Por padrão a sessão expõe apenas `name`/`email`/`image` (suficiente para os
 * dashboards). Adicione campos aqui (ex.: domínio, papéis) se algum dashboard
 * precisar — e popule-os no callback `session` de `src/server/auth/config.ts`.
 */
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"];
  }
}

export {};
