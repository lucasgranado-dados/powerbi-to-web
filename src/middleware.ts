import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/server/auth/config";

// Instância edge-safe (sem `server-only`) só para o middleware.
const { auth } = NextAuth(authConfig);

/**
 * Protege TODAS as rotas, exceto as liberadas pelo `matcher` abaixo
 * (endpoints do Auth.js, páginas de auth, healthcheck e assets estáticos).
 *
 * Sem sessão → redireciona para /auth/signin preservando o destino em
 * `callbackUrl`. A página de signin cuida do fluxo dentro do iframe do DataHub
 * (login em nível superior / popup).
 */
export default auth((req) => {
  if (req.auth?.user) return NextResponse.next();

  const { nextUrl } = req;
  const signInUrl = new URL("/auth/signin", nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", `${nextUrl.pathname}${nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  // Libera: rotas /api/auth/*, páginas /auth/*, /healthz, internals do Next e
  // qualquer arquivo com extensão (assets). Todo o resto exige sessão.
  matcher: [
    "/((?!api/auth|auth|healthz|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
