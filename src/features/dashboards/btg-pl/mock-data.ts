import type { BtgPlDashboardData } from "./contract";

/**
 * MOCK DATA — fallback de desenvolvimento quando o Snowflake não está configurado.
 * Valores plausíveis mas inventados. NÃO usar para validação de paridade.
 */

export const mockBtgPlData: BtgPlDashboardData = {
  source: "mock",
  notice:
    "Exibindo dados MOCK (Snowflake não configurado). Configure SNOWFLAKE_* em .env.local para usar dados reais.",
  filterOptions: {
    codigosCliente: ["CLI001", "CLI002", "CLI003"],
    administradoras: ["BTG"],
    datasDisponiveis: ["2025-06-02", "2025-06-09", "2025-06-16"],
    generatedAts: ["2025-06-16 17:21:57", "2025-06-09 17:21:57", "2025-06-02 17:21:57"],
  },
  rows: [
    {
      codigoCliente: "CLI001",
      administradora: "BTG",
      posicaoData: "2025-06-16",
      valorLiquido: 150000.0,
      valorBruto: 162000.0,
      generatedAt: "2025-06-16 17:21:57",
    },
    {
      codigoCliente: "CLI002",
      administradora: "BTG",
      posicaoData: "2025-06-16",
      valorLiquido: 87500.5,
      valorBruto: 94000.75,
      generatedAt: "2025-06-16 17:21:57",
    },
    {
      codigoCliente: "CLI003",
      administradora: "BTG",
      posicaoData: "2025-06-16",
      valorLiquido: 210300.0,
      valorBruto: 225000.0,
      generatedAt: "2025-06-16 17:21:57",
    },
    {
      codigoCliente: "CLI001",
      administradora: "BTG",
      posicaoData: "2025-06-09",
      valorLiquido: 148000.0,
      valorBruto: 160000.0,
      generatedAt: "2025-06-09 17:21:57",
    },
  ],
};
