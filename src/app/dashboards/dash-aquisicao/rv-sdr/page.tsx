import { Info } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency, formatNumber } from "@/lib/formatters";

import { getAquisicaoRvSdrData } from "@/features/dashboards/dash-aquisicao/snowflake-queries";
import type {
  AquisicaoFilters,
  AquisicaoRvSdrRow,
} from "@/features/dashboards/dash-aquisicao/contract";

export const revalidate = 300;

const tableColumns: DataTableColumn<AquisicaoRvSdrRow>[] = [
  { key: "mesAno", header: "Mês/Ano", cell: (r) => r.mesAno },
  { key: "sdr", header: "SDR", cell: (r) => r.sdr },
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
    key: "arrTotalMensal",
    header: "ARR Total (SDR)",
    align: "right",
    cell: (r) => formatCurrency(r.arrTotalMensal),
  },
  {
    key: "mediaMov3m",
    header: "Média Móvel 3M",
    align: "right",
    cell: (r) =>
      r.mediaMov3m != null ? formatCurrency(r.mediaMov3m) : "—",
  },
  {
    key: "faixa",
    header: "Faixa",
    align: "right",
    cell: (r) =>
      r.faixa != null ? formatNumber(r.faixa) : "—",
  },
  {
    key: "rvSdr",
    header: "RV SDR",
    align: "right",
    cell: (r) => (r.rvSdr != null ? formatCurrency(r.rvSdr) : "—"),
  },
];

export default async function RvSdrPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const filters: AquisicaoFilters = {
    periodoInicio: typeof params.inicio === "string" ? params.inicio : undefined,
    periodoFim: typeof params.fim === "string" ? params.fim : undefined,
    sdr: typeof params.sdr === "string" ? params.sdr : undefined,
  };

  const data = await getAquisicaoRvSdrData(filters);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <DashboardHeader
        title="RV — Remuneração Variável (SDR)"
        description="ARR mensal e remuneração variável calculados por SDR, com Faixa e Média Móvel 3M."
        source="SERVING_LAYER.CONSULTORIA.VW_FUNIL_CONSULTORIA"
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

      <Alert variant="default">
        <Info className="h-4 w-4" />
        <AlertTitle>Pendência de validação</AlertTitle>
        <AlertDescription>
          Os cálculos de Faixa e RV SDR desta página incluem a Média Móvel 3M do ARR
          acumulada desde o primeiro mês de cada SDR (M1). Valide os resultados com a
          área responsável antes de usar para pagamento de RV.
        </AlertDescription>
      </Alert>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Remuneração Variável por Mês</h2>
        <div className="overflow-x-auto">
          <DataTable
            columns={tableColumns}
            rows={data.rows}
            getRowId={(r, i) => `${r.mesAno}-${r.sdr}-${i}`}
            caption="RV SDR por mês e período selecionado"
            emptyMessage="Nenhum dado encontrado para o período selecionado."
          />
        </div>
      </section>
    </main>
  );
}
