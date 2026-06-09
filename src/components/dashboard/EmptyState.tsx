import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import type { ReactNode } from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

/**
 * Estado vazio genérico (sem dados / filtros sem resultado).
 */
export function EmptyState({
  title = "Nenhum dado encontrado",
  description = "Ajuste os filtros ou verifique a fonte de dados.",
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
