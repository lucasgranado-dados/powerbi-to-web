import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface DashboardHeaderProps {
  title: string;
  description?: string;
  /** Texto da origem Power BI (ex.: nome do relatório). */
  source?: string;
  /** Rótulo de status, ex.: "Dados: Snowflake" ou "Dados: Mock". */
  badgeLabel?: string;
  badgeVariant?: "default" | "secondary" | "success" | "warning" | "outline";
  /** Slot à direita (ações, links). */
  actions?: ReactNode;
}

/**
 * Cabeçalho genérico de dashboard. Sem regra de negócio — recebe tudo por props.
 */
export function DashboardHeader({
  title,
  description,
  source,
  badgeLabel,
  badgeVariant = "secondary",
  actions,
}: DashboardHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {badgeLabel ? (
              <Badge variant={badgeVariant}>{badgeLabel}</Badge>
            ) : null}
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          {source ? (
            <p className="text-xs text-muted-foreground">
              Origem Power BI: <span className="font-medium">{source}</span>
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      <Separator />
    </header>
  );
}
