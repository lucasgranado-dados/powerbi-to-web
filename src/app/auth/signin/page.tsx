"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

/**
 * Tela de login.
 *
 * Quando o dashboard é aberto **embutido via iframe** (DataHub), o Google bloqueia
 * a própria tela de login dentro de frames. Por isso, ao detectar o iframe, o
 * login é feito num **popup** (janela de nível superior). Ao concluir, o popup
 * sinaliza via `postMessage` e o iframe recarrega já autenticado.
 *
 * Fora de iframe (acesso direto), o fluxo é o redirect padrão do Auth.js.
 */
const SIGNED_IN_MESSAGE = "authjs:signed-in";

function SignInInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const isPopup = searchParams.get("popup") === "1";
  const hasError = searchParams.has("error");

  const [embedded, setEmbedded] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    // window.top só difere de window.self quando estamos dentro de um iframe.
    setEmbedded(window.self !== window.top);
  }, []);

  // O iframe escuta o aviso do popup e recarrega quando o login termina.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data === SIGNED_IN_MESSAGE) {
        setWaiting(false);
        router.refresh();
        window.location.reload();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  const handleSignIn = useCallback(() => {
    // Dentro do popup (janela própria) ou em acesso direto: redirect padrão.
    // No popup, voltamos para /auth/popup-done, que avisa o iframe e fecha.
    if (isPopup || !embedded) {
      void signIn("google", {
        callbackUrl: isPopup ? "/auth/popup-done" : callbackUrl,
      });
      return;
    }

    // Dentro do iframe: abre o login num popup de nível superior.
    const url = new URL("/auth/signin", window.location.origin);
    url.searchParams.set("popup", "1");
    url.searchParams.set("callbackUrl", callbackUrl);
    const popup = window.open(
      url.toString(),
      "suno-auth",
      "width=480,height=680,menubar=no,toolbar=no",
    );
    setWaiting(Boolean(popup));
  }, [callbackUrl, embedded, isPopup]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Acesso restrito</h1>
        <p className="text-sm text-muted-foreground">
          Entre com sua conta corporativa Google. Apenas contas{" "}
          <strong>@suno.com.br</strong> e <strong>@sunoresearch.com.br</strong>{" "}
          são aceitas.
        </p>
      </div>

      {hasError && (
        <p className="text-sm text-destructive">
          Não foi possível entrar. Verifique se está usando uma conta corporativa
          autorizada.
        </p>
      )}

      <Button onClick={handleSignIn} disabled={waiting} className="w-full" size="lg">
        {waiting ? "Aguardando login…" : "Entrar com Google corporativo"}
      </Button>

      {waiting && (
        <p className="text-xs text-muted-foreground">
          Conclua o login na janela aberta. Se ela não apareceu, libere os popups
          deste site.
        </p>
      )}
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
