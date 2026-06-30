"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AquisicaoChartPoint } from "./contract";
import { axisTickFormatter, getChartColor } from "@/lib/chart-utils";
import { formatCompact, formatNumber } from "@/lib/formatters";

/**
 * Gráfico de evolução mensal: barras (Qtd. Implantações) + linha (ARR API).
 * Client Component — Recharts usa o DOM.
 * Dados chegam prontos por props, sem regra de negócio aqui.
 */
export function AquisicaoSeriesChart({ data }: { data: AquisicaoChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis
          dataKey="mesAno"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          yAxisId="qtd"
          orientation="left"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={32}
          tickFormatter={(v: number) => String(v)}
        />
        <YAxis
          yAxisId="arr"
          orientation="right"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={56}
          tickFormatter={axisTickFormatter}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "Qtd. Implantações") return [formatNumber(value), name];
            return [formatCompact(value), name];
          }}
          labelClassName="text-xs font-medium"
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar
          yAxisId="qtd"
          dataKey="qtdImplantacoes"
          name="Qtd. Implantações"
          fill={getChartColor(1)}
          radius={[3, 3, 0, 0]}
          maxBarSize={40}
        />
        <Line
          yAxisId="arr"
          type="monotone"
          dataKey="arrApiMes"
          name="ARR API"
          stroke={getChartColor(0)}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
