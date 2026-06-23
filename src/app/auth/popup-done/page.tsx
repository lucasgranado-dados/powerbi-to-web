"use client";

import { useEffect } from "react";

/**
 * Página de retorno do popup de login (ver `auth/signin/page.tsx`).
 * Avisa o iframe que abriu o popup e fecha a janela.
 */
export default function PopupDonePage() {
  useEffect(() => {
    try {
      window.opener?.postMessage("authjs:signed-in", window.location.origin);
    } catch {
      // Sem opener (acesso direto): apenas mostra a mensagem abaixo.
    }
    window.close();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-muted-foreground">
        Login concluído. Você já pode fechar esta janela.
      </p>
    </main>
  );
}
