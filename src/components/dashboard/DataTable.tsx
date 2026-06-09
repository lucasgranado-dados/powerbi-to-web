import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/dashboard/EmptyState";

export interface DataTableColumn<T> {
  /** Chave única da coluna. */
  key: string;
  header: string;
  /** Renderiza a célula. Recebe a linha inteira. */
  cell: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Extrai uma key estável por linha. */
  getRowId: (row: T, index: number) => string;
  emptyMessage?: string;
  caption?: string;
}

/**
 * Tabela de detalhe genérica e tipada. Substitui as tabelas/matrizes do
 * Power BI. A formatação de valores deve ser feita pelas funções `cell`
 * (usando os formatters), não aqui.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  emptyMessage = "Sem dados para os filtros selecionados.",
  caption,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  const alignClass = (align?: "left" | "right" | "center") =>
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";

  return (
    <div className="rounded-lg border">
      <Table>
        {caption ? (
          <caption className="sr-only">{caption}</caption>
        ) : null}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(alignClass(col.align), col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={getRowId(row, index)}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn(
                    alignClass(col.align),
                    col.align === "right" && "tabular-nums",
                    col.className,
                  )}
                >
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
