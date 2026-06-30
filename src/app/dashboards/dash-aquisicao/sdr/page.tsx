import {
  Briefcase,
  Clock,
  CreditCard,
  Info,
  Percent,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";

import { getAquisicaoSdrData } from "@/features/dashboards/dash-aquisicao/snowflake-queries";
import { AquisicaoSeriesChart } from "@/features/dashboards/dash-aquisicao/AquisicaoSeriesChart";
import type { AquisicaoKpi, AquisicaoSdrRow } from "@/features/dashboards/dash-aquisicao/contract";

export const revalidate = 300;

const kpiIcons: Record<string, typeof TrendingUp> = {
  arr_ajustado_api: TrendingUp,
  mrr_api: Receipt,
  pl_consolidado: Briefcase,
  qtd_implantacoes: Users,
  taxa_efetiva_closer: Percent,
  sla_dias: Clock,
  delta_pl: TrendingUp,
  total_arr_card: CreditCard,
};

const tableColumns: DataTableColumn<AquisicaoSdrRow>[] = [
  { key: "sdr", header: "SDR", cell: (r) => r.sdr },
  {
    key: "carteirasConsolidadas",
    header: "Carteiras",
    align: "right",
    cell: (r) => formatNumber(r.carteirasConsolidadas),
  },
  {
    key: "plConsolidado",
    header: "PL Consolidado",
    align: "right",
    cell: (r) => formatCurrency(r.plConsolidado),
  },
  {
    key: "plTaxaBase",
    header: "PL Taxa Base",
    align: "right",
    cell: (r) => formatCurrency(r.plTaxaBase),
  },
  {
    key: "plWs",
    header: "PL WS",
    align: "right",
    cell: (r) => formatCurrency(r.plWs),
  },
  {
    key: "diferencaPercent",
    header: "Δ%",
    align: "right",
    cell: (r) => formatPercent(r.diferencaPercent, 1),
  },
  {
    key: "arrCard",
    header: "ARR Card",
    align: "right",
    cell: (r) => formatCurrency(r.arrCard),
  },
  {
    key: "mrr",
    header: "MRR",
    align: "right",
    cell: (r) => formatCurrency(r.mrr),
  },
  {
    key: "taxaEfetivaCloser",
    header: "Taxa Efetiva",
    align: "right",
    cell: (r) => formatPercent(r.taxaEfetivaCloser, 2),
  },
  {
    key: "arrApi",
    header: "ARR API",
    align: "right",
    cell: (r) => formatCurrency(r.arrApi),
  },
  {
    key: "mrrApi",
    header: "MRR API",
    align: "right",
    cell: (r) => formatCurrency(r.mrrApi),
  },
  {
    key: "variavelConsultor",
    header: "Var. Consultor",
    align: "right",
    cell: (r) => formatCurrency(r.variavelConsultor),
  },
];

export default async function AquisicaoSdrPage() {
  const data = await getAquisicaoSdrData();

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <DashboardHeader
        title="Aquisição SDR"
        description="Desempenho de captação agregado por SDR: carteiras, PL, ARR e variável."
        source="Dash_Aquisicao.pbip — página Aquisição SDR"
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

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.kpis.map((kpi: AquisicaoKpi) => (
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
        title="Evolução mensal — Implantações e ARR API"
        description="Quantidade de implantações (barras) e ARR API no mês (linha)."
        height={320}
      >
        <AquisicaoSeriesChart data={data.serie} />
      </ChartCard>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Detalhe por SDR</h2>
        <div className="overflow-x-auto">
          <DataTable
            columns={tableColumns}
            rows={data.detalhes}
            getRowId={(r) => r.sdr}
            caption="Desempenho por SDR no período"
          />
        </div>
      </section>
    </main>
  );
}
