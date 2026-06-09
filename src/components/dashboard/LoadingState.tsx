import { Skeleton } from "@/components/ui/skeleton";

export interface LoadingStateProps {
  /** Quantidade de KPIs a esqueletizar. */
  kpiCount?: number;
  /** Mostrar bloco de gráfico. */
  showChart?: boolean;
  /** Mostrar bloco de tabela. */
  showTable?: boolean;
}

/**
 * Estado de carregamento genérico (skeletons) coerente com o layout padrão de
 * dashboard: KPIs no topo, gráfico e tabela abaixo.
 */
export function LoadingState({
  kpiCount = 4,
  showChart = true,
  showTable = true,
}: LoadingStateProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: kpiCount }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      {showChart ? (
        <div className="space-y-3 rounded-xl border p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : null}
      {showTable ? (
        <div className="space-y-3 rounded-xl border p-6">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
