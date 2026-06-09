---
name: recharts
description: >-
  Cria gráficos responsivos em React com Recharts seguindo os padrões deste
  repositório (ChartCard + chart-utils + tokens de tema). Use ao construir gráficos
  de linha, barra, área, pizza/donut ou composições para os dashboards migrados,
  ou ao ajustar tooltips, eixos e cores dos gráficos.
---

# Recharts (padrão deste repositório)

Recharts é a **biblioteca de gráficos padrão** do boilerplate. Use ECharts apenas
para casos complexos (mapas, sankey, alta densidade, múltiplos eixos), com
justificativa registrada em `validation-notes.md`.

## Convenções deste repo (siga estas — não use estilos avulsos)

- O gráfico é um **Client Component** (`"use client"`) — ex.:
  `src/features/dashboards/<slug>/SeriesChart.tsx` — embrulhado pelo
  **`ChartCard`** (`src/components/dashboard/ChartCard.tsx`), que cuida de título,
  descrição e altura.
- Sempre `<ResponsiveContainer width="100%" height="100%">` (a altura vem do `ChartCard`).
- **Cores via tokens de tema**: use `getChartColor(i)` / `CHART_COLORS` de
  `src/lib/chart-utils.ts` (mapeiam as CSS vars `--chart-1..5`). Não fixe hex.
- **Eixos/valores**: `axisTickFormatter` (de `chart-utils`) e os formatadores de
  `src/lib/formatters.ts` (`formatNumber`, `formatCurrency`, `formatPercent`).
- **Transforme os dados fora do gráfico** (nos adapters/contract); o componente só
  renderiza pontos já no formato do `contract.ts`.

## Exemplo alinhado ao repo (área com gradiente)

```tsx
"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "./contract";
import { axisTickFormatter, getChartColor } from "@/lib/chart-utils";
import { formatNumber } from "@/lib/formatters";

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
        <YAxis tickFormatter={axisTickFormatter} tickLine={false} axisLine={false} width={48} fontSize={12} />
        <Tooltip formatter={(v: number) => [formatNumber(v), "Valor"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Area type="monotone" dataKey="value" stroke={getChartColor(0)} fill="url(#fillSeries)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

## Tipos de gráfico (Recharts)

- **Linha**: `LineChart` + `Line` (séries comparativas).
- **Barra**: `BarChart` + `Bar` (use `stackId` para empilhar).
- **Área**: `AreaChart` + `Area` (use `<linearGradient>` em `<defs>`).
- **Pizza/Donut**: `PieChart` + `Pie` + `Cell` (mapeie cores com `getChartColor`).
- **Referências**: `<ReferenceLine>` para metas/limiares.
- Dados em tempo real: `isAnimationActive={false}`.

## Referências

- `src/components/dashboard/ChartCard.tsx`, `src/lib/chart-utils.ts`
- Skill **`gerar-dashboard-web`** (onde o gráfico se encaixa na página).
