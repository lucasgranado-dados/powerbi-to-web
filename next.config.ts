import type { NextConfig } from "next";

// Origens autorizadas a embutir o dashboard em iframe (DataHub).
// Defina DATAHUB_FRAME_ANCESTORS com a(s) origem(ns) do DataHub, separadas por
// espaço, ex.: "https://datahub.suno.com.br". Default 'self' bloqueia iframes
// externos até a configuração — é o padrão seguro.
const frameAncestors = process.env.DATAHUB_FRAME_ANCESTORS?.trim() || "'self'";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O snowflake-sdk é um pacote Node nativo e não deve ser empacotado pelo
  // bundler do servidor. Mantê-lo externo evita erros de build e garante que
  // a conexão aconteça apenas em runtime server-side.
  serverExternalPackages: ["snowflake-sdk"],
  async headers() {
    return [
      {
        // `frame-ancestors` (CSP) substitui X-Frame-Options e permite allowlist
        // de origem — necessário para o DataHub embutir o dashboard via iframe.
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${frameAncestors};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
