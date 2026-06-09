"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "./contract";
import { axisTickFormatter, getChartColor } from "@/lib/chart-utils";
import { formatNumber } from "@/lib/formatters";

/**
 * Gráfico de série do template (Recharts — biblioteca padrão do boilerplate).
 *
 * É um Client Component (Recharts usa o DOM). Recebe os dados já adaptados via
 * props — nenhuma busca/regra de negócio aqui.
 *
 * Use ECharts apenas para gráficos complexos (mapas, sankey, grandes volumes),
 * com justificativa registrada em validation-notes.md.
 */
export function SeriesChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillSeries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getChartColor(0)} stopOpacity={0.4} />
            <stop offset="95%" stopColor={getChartColor(0)} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis
          tickFormatter={axisTickFormatter}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={48}
        />
        <Tooltip
          formatter={(value: number) => [formatNumber(value), "Valor"]}
          labelClassName="text-xs"
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={getChartColor(0)}
          fill="url(#fillSeries)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
