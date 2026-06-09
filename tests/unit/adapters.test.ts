import { describe, expect, it } from "vitest";

import {
  adaptKpis,
  adaptSeries,
  adaptTable,
  type RawDetailRow,
  type RawKpiRow,
  type RawSeriesRow,
} from "@/features/dashboards/_template/adapters";

describe("adapters do _template", () => {
  it("adapta KPIs e calcula a variação relativa", () => {
    const rows: RawKpiRow[] = [
      { METRIC_ID: "revenue", LABEL: "Receita", VALUE: 110, PREV_VALUE: 100, FORMAT: "currency" },
    ];
    const [kpi] = adaptKpis(rows);
    expect(kpi.id).toBe("revenue");
    expect(kpi.rawValue).toBe(110);
    expect(kpi.deltaRatio).toBeCloseTo(0.1, 5);
    expect(kpi.value).toContain("R$");
  });

  it("não calcula variação quando PREV_VALUE é nulo/zero", () => {
    const rows: RawKpiRow[] = [
      { METRIC_ID: "orders", LABEL: "Pedidos", VALUE: 50, PREV_VALUE: null, FORMAT: "number" },
    ];
    const [kpi] = adaptKpis(rows);
    expect(kpi.deltaRatio).toBeUndefined();
  });

  it("adapta a série convertendo VALUE para número", () => {
    const rows: RawSeriesRow[] = [{ BUCKET: "08:00", VALUE: 42 }];
    expect(adaptSeries(rows)).toEqual([{ label: "08:00", value: 42 }]);
  });

  it("adapta a tabela e deriva o ticket médio com proteção a divisão por zero", () => {
    const rows: RawDetailRow[] = [
      { CATEGORY: "A", ORDERS: 4, REVENUE: 400 },
      { CATEGORY: "B", ORDERS: 0, REVENUE: 0 },
    ];
    const out = adaptTable(rows);
    expect(out[0].averageTicket).toBe(100);
    expect(out[1].averageTicket).toBe(0);
  });
});
