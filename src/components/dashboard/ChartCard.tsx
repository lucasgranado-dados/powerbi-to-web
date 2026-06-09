import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** O gráfico em si (Recharts ou ECharts). Recebido por composição. */
  children: ReactNode;
  /** Altura do contêiner do gráfico. */
  height?: number;
}

/**
 * Contêiner genérico para gráficos. Não conhece a biblioteca de gráfico:
 * recebe o gráfico via children. Mantém título, descrição e altura consistentes.
 */
export function ChartCard({
  title,
  description,
  actions,
  children,
  height = 300,
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
