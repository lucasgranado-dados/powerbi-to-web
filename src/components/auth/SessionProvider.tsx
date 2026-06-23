"use client";

// Reexporta o SessionProvider do Auth.js como Client Component para uso no
// layout raiz (Server Component). Permite `useSession()` nos componentes client.
export { SessionProvider } from "next-auth/react";
