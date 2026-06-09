import { describe, expect, it } from "vitest";

import {
  formatCompact,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/formatters";

describe("formatters", () => {
  it("formata números com locale pt-BR", () => {
    expect(formatNumber(1234)).toBe("1.234");
  });

  it("retorna placeholder para valores nulos/NaN", () => {
    expect(formatNumber(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
    expect(formatPercent(Number.NaN)).toBe("—");
  });

  it("formata moeda em BRL", () => {
    const out = formatCurrency(10);
    expect(out).toContain("R$");
    expect(out).toContain("10,00");
  });

  it("formata percentual a partir de decimal", () => {
    expect(formatPercent(0.1234, 2)).toBe("12,34%");
  });

  it("abrevia números grandes", () => {
    expect(formatCompact(1500)).toMatch(/1,5\s?mil|1,5K/i);
  });
});
