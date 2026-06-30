import { Info } from "lucide-react";
import { Suspense } from "react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency, formatDate } from "@/lib/formatters";

import { getBtgPlDashboardData } from "@/features/dashboards/btg-pl/snowflake-queries";
import { BtgPlFilters } from "@/features/dashboards/btg-pl/BtgPlFilters";
import type { BtgPlFilters as BtgPlFiltersType, BtgPlRow } from "@/features/dashboards/btg-pl/contract";

export const revalidate = 300;

const tableColumns: DataTableColumn<BtgPlRow>[] = [
  {
    key: "codigoCliente",
    header: "Código do Cliente",
    cell: (r) => r.codigoCliente,
  },
  {
    key: "administradora",
    header: "Administradora",
    cell: (r) => r.administradora,
  },
  {
    key: "posicaoData",
    header: "Data de Posição",
    cell: (r) => formatDate(r.posicaoData + "T00:00:00", { dateStyle: "short" }),
  },
  {
    key: "valorLiquido",
    header: "Valor Líquido",
    align: "right",
    cell: (r) => formatCurrency(r.valorLiquido),
  },
  {
    key: "valorBruto",
    header: "Valor Bruto",
    align: "right",
    cell: (r) => formatCurrency(r.valorBruto),
  },
  {
    key: "generatedAt",
    header: "Geração",
    cell: (r) => formatDate(r.generatedAt, { dateStyle: "short" }),
  },
];

export default async function BtgPlPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const filters: BtgPlFiltersType = {
    codigoCliente: typeof params.cliente   === "string" ? params.cliente   : undefined,
    administradora: typeof params.admin    === "string" ? params.admin     : undefined,
    posicaoData:   typeof params.data      === "string" ? params.data      : undefined,
    generatedAt:   typeof params.geracao   === "string" ? params.geracao   : undefined,
  };

  const data = await getBtgPlDashboardData(filters);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <DashboardHeader
        title="BTG PL"
        description="Posição de PL por cliente, administradora e data de posição."
        source="REFINED_ADVISORY.WEALTH_LEGADO.VW_BTG_PL_TOTAL"
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

      <Suspense>
        <BtgPlFilters
          options={data.filterOptions}
          current={filters}
        />
      </Suspense>

      <DataTable
        columns={tableColumns}
        rows={data.rows}
        getRowId={(r, i) =>
          `${r.codigoCliente}-${r.administradora}-${r.posicaoData}-${i}`
        }
        caption="Tabela BTG PL"
        emptyMessage="Nenhuma posição encontrada para os filtros selecionados."
      />
    </main>
  );
}
