"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

/**
 * Botão de logout opcional para o header dos dashboards.
 * Uso: `<SignOutButton />`.
 */
export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => void signOut({ callbackUrl: "/auth/signin" })}>
      Sair
    </Button>
  );
}
