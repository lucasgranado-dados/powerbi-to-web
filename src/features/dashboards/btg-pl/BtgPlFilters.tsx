"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { formatDate } from "@/lib/formatters";
import type { BtgPlFilterOptions } from "./contract";

const ALL = "__all__";

interface BtgPlFiltersProps {
  options: BtgPlFilterOptions;
  current: {
    codigoCliente?: string;
    administradora?: string;
    posicaoData?: string;
    generatedAt?: string;
  };
}

export function BtgPlFilters({ options, current }: BtgPlFiltersProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === ALL || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      router.push(`${pathname}?${next.toString()}`);
    },
    [router, pathname, params],
  );

  const toOpts = (values: string[], labelFn?: (v: string) => string) => [
    { value: ALL, label: "Todos" },
    ...values.map((v) => ({ value: v, label: labelFn ? labelFn(v) : v })),
  ];

  return (
    <DashboardFilters
      filters={[
        {
          type: "select",
          id: "cliente",
          label: "Código do Cliente",
          value: current.codigoCliente ?? ALL,
          placeholder: "Todos",
          options: toOpts(options.codigosCliente),
          onChange: (v) => update("cliente", v),
        },
        {
          type: "select",
          id: "admin",
          label: "Administradora",
          value: current.administradora ?? ALL,
          placeholder: "Todos",
          options: toOpts(options.administradoras),
          onChange: (v) => update("admin", v),
        },
        {
          type: "select",
          id: "data",
          label: "Data de Posição",
          value: current.posicaoData ?? ALL,
          placeholder: "Todas",
          options: toOpts(options.datasDisponiveis, (v) =>
            formatDate(v + "T00:00:00", { dateStyle: "short" }),
          ),
          onChange: (v) => update("data", v),
        },
        {
          type: "select",
          id: "geracao",
          label: "Geração",
          value: current.generatedAt ?? ALL,
          placeholder: "Todas",
          options: toOpts(options.generatedAts, (v) =>
            formatDate(v, { dateStyle: "short" }),
          ),
          onChange: (v) => update("geracao", v),
        },
      ]}
    />
  );
}
