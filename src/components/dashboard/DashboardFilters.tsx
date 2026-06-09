"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/dashboard/Label";

export interface SelectFilterConfig {
  type: "select";
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
}

export interface TextFilterConfig {
  type: "text";
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export type FilterConfig = SelectFilterConfig | TextFilterConfig;

export interface DashboardFiltersProps {
  filters: FilterConfig[];
}

/**
 * Barra de filtros genérica e controlada por props. Representa as
 * segmentações/slicers do Power BI. Não contém regra de negócio — apenas
 * dispara callbacks de mudança.
 */
export function DashboardFilters({ filters }: DashboardFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
      {filters.map((filter) => (
        <div key={filter.id} className="flex min-w-[180px] flex-col gap-1.5">
          <Label htmlFor={filter.id}>{filter.label}</Label>
          {filter.type === "select" ? (
            <Select
              value={filter.value}
              onValueChange={(v) => filter.onChange?.(v)}
            >
              <SelectTrigger id={filter.id}>
                <SelectValue placeholder={filter.placeholder ?? "Selecione"} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={filter.id}
              value={filter.value}
              placeholder={filter.placeholder}
              onChange={(e) => filter.onChange?.(e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
