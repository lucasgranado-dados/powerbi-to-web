"use client";

import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Boundary de erro da rota. Mensagens são genéricas e NÃO expõem detalhes
 * sensíveis (credenciais, SQL bruto). Detalhes ficam apenas nos logs do servidor.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Não foi possível carregar o dashboard</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            Ocorreu um erro ao montar a página. Verifique a configuração do
            Snowflake e tente novamente.
          </p>
          {error.digest ? (
            <p className="text-xs opacity-70">Ref.: {error.digest}</p>
          ) : null}
          <Button variant="outline" size="sm" onClick={reset}>
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    </main>
  );
}
