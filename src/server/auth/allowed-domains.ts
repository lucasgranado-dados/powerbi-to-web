/**
 * Allowlist de domínios corporativos para login.
 *
 * Módulo **puro** (sem `server-only`, sem dependências do Next/Auth.js) para ser
 * facilmente testável em unidade. O `config.ts` consome estas funções no callback
 * `signIn`. NUNCA imprime/serializa segredos.
 */

/** Domínios aceitos por padrão quando AUTH_ALLOWED_DOMAINS não está definido. */
export const DEFAULT_ALLOWED_DOMAINS = [
  "suno.com.br",
  "sunoresearch.com.br",
] as const;

/**
 * Lê AUTH_ALLOWED_DOMAINS (lista separada por vírgula) e normaliza para minúsculas.
 * Cai no default corporativo quando a variável está ausente/vazia.
 */
export function getAllowedDomains(): string[] {
  const raw = process.env.AUTH_ALLOWED_DOMAINS?.trim();
  if (!raw) return [...DEFAULT_ALLOWED_DOMAINS];
  return raw
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Decide se um e-mail pode entrar. Exige:
 *  - e-mail presente e verificado pelo provedor (`email_verified === true`);
 *  - domínio do e-mail dentro da allowlist.
 *
 * Não confia apenas no campo `hd` do Google — valida o domínio do próprio e-mail.
 */
export function isEmailAllowed(
  email: string | null | undefined,
  emailVerified: boolean | undefined,
  allowedDomains: string[] = getAllowedDomains(),
): boolean {
  if (!email || emailVerified !== true) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return allowedDomains.includes(domain);
}
