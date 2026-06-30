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
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/formatters";

import { getAquisicaoVisaoGeralData } from "@/features/dashboards/dash-aquisicao/snowflake-queries";
import { AquisicaoSeriesChart } from "@/features/dashboards/dash-aquisicao/AquisicaoSeriesChart";
import type { AquisicaoDetalheRow, AquisicaoKpi } from "@/features/dashboards/dash-aquisicao/contract";

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

const tableColumns: DataTableColumn<AquisicaoDetalheRow>[] = [
  { key: "cliente", header: "Cliente", cell: (r) => r.cliente },
  { key: "etapaDoNegocio", header: "Etapa", cell: (r) => r.etapaDoNegocio },
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
    key: "taxa",
    header: "Taxa",
    align: "right",
    cell: (r) => formatPercent(r.taxa, 2),
  },
  {
    key: "dataImplantacao",
    header: "Implantação",
    cell: (r) => formatDate(r.dataImplantacao),
  },
  {
    key: "slaDias",
    header: "SLA",
    align: "right",
    cell: (r) => (r.slaDias != null ? `${formatNumber(r.slaDias)} d` : "—"),
  },
  { key: "consultor", header: "Consultor", cell: (r) => r.consultor },
];

export default async function AquisicaoVisaoGeralPage() {
  const data = await getAquisicaoVisaoGeralData();

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <DashboardHeader
        title="Aquisição — Visão Geral"
        description="Panorama consolidado das implantações: totais, evolução e detalhe resumido."
        source="Dash_Aquisicao.pbip — página Aquisição visão geral"
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
        <h2 className="text-lg font-semibold">Detalhe de implantações</h2>
        <div className="overflow-x-auto">
          <DataTable
            columns={tableColumns}
            rows={data.detalhes}
            getRowId={(r, i) => `${r.cliente}-${i}`}
            caption="Implantações no período — visão geral"
          />
        </div>
      </section>
    </main>
  );
}
