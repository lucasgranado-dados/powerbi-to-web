import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Página de erro de autenticação. Mensagem **genérica** — nunca expõe detalhes
 * do provedor, do motivo exato ou de configuração.
 */
export default function AuthErrorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Não foi possível entrar
        </h1>
        <p className="text-sm text-muted-foreground">
          Sua conta não tem acesso a este dashboard. Use uma conta corporativa
          autorizada (<strong>@suno.com.br</strong> ou{" "}
          <strong>@sunoresearch.com.br</strong>) ou fale com o responsável pelo
          painel.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/auth/signin">Tentar novamente</Link>
      </Button>
    </main>
  );
}
