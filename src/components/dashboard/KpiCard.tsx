import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  /** Texto secundário (ex.: período, comparação). */
  hint?: string;
  /** Variação relativa (0.12 = +12%). Define cor/seta automaticamente. */
  deltaRatio?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  /** Quando true, valores maiores são "ruins" (inverte a cor da variação). */
  invertDelta?: boolean;
}

/**
 * Card de KPI genérico. Substitui os "cartões"/medidas do Power BI.
 * Toda a lógica de cálculo deve vir pronta nas props (via adapters/metrics).
 */
export function KpiCard({
  label,
  value,
  hint,
  deltaRatio,
  deltaLabel,
  icon: Icon,
  invertDelta = false,
}: KpiCardProps) {
  const hasDelta = typeof deltaRatio === "number" && !Number.isNaN(deltaRatio);
  const positive = hasDelta ? deltaRatio! >= 0 : false;
  const good = invertDelta ? !positive : positive;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <div className="mt-1 flex items-center gap-2">
          {hasDelta ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                good ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {deltaLabel}
            </span>
          ) : null}
          {hint ? (
            <span className="text-xs text-muted-foreground">{hint}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
