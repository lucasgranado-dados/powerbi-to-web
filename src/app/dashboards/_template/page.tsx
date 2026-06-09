import { DollarSign, Info, Receipt, ShoppingCart, TrendingUp } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency, formatNumber } from "@/lib/formatters";

import { getTemplateDashboardData } from "@/features/dashboards/_template/snowflake-queries";
import { SeriesChart } from "@/features/dashboards/_template/SeriesChart";
import type { DetailRow } from "@/features/dashboards/_template/contract";

/**
 * Página do dashboard de exemplo (`_template`).
 *
 * Server Component: busca os dados no servidor (Snowflake com fallback de
 * mock) e renderiza os componentes reutilizáveis. Este arquivo é a referência
 * que a IA deve seguir ao gerar dashboards reais.
 */

// Revalidação baseada na env (cache server-side).
export const revalidate = 300;

const kpiIcons: Record<string, typeof DollarSign> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  avg_ticket: Receipt,
  conversion: TrendingUp,
};

const tableColumns: DataTableColumn<DetailRow>[] = [
  { key: "category", header: "Categoria", cell: (r) => r.category },
  {
    key: "orders",
    header: "Pedidos",
    align: "right",
    cell: (r) => formatNumber(r.orders),
  },
  {
    key: "revenue",
    header: "Receita",
    align: "right",
    cell: (r) => formatCurrency(r.revenue),
  },
  {
    key: "averageTicket",
    header: "Ticket médio",
    align: "right",
    cell: (r) => formatCurrency(r.averageTicket),
  },
];

export default async function TemplateDashboardPage() {
  const data = await getTemplateDashboardData();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <DashboardHeader
        title="Dashboard de exemplo"
        description="Referência de migração: KPIs, série temporal e tabela de detalhe."
        source="_template (PBIP de exemplo)"
        badgeLabel={data.source === "snowflake" ? "Dados: Snowflake" : "Dados: Mock"}
        badgeVariant={data.source === "snowflake" ? "success" : "warning"}
      />

      {data.notice ? (
        <Alert variant="warning">
          <Info className="h-4 w-4" />
          <AlertTitle>Origem dos dados</AlertTitle>
          <AlertDescription>{data.notice}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            deltaRatio={kpi.deltaRatio}
            deltaLabel={kpi.deltaLabel}
            icon={kpiIcons[kpi.id]}
          />
        ))}
      </section>

      <ChartCard
        title="Evolução por período"
        description="Série principal (substitui o gráfico de linhas/área do Power BI)."
      >
        <SeriesChart data={data.series} />
      </ChartCard>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Detalhe por categoria</h2>
        <DataTable
          columns={tableColumns}
          rows={data.table}
          getRowId={(r) => r.category}
        />
      </section>
    </main>
  );
}
