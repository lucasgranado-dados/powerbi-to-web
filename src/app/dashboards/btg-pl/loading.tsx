import { LoadingState } from "@/components/dashboard/LoadingState";

/**
 * UI de carregamento da rota (Next.js App Router). Exibida enquanto o Server
 * Component busca os dados.
 */
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <LoadingState kpiCount={0} showChart={false} showTable />
    </main>
  );
}
