import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O snowflake-sdk é um pacote Node nativo e não deve ser empacotado pelo
  // bundler do servidor. Mantê-lo externo evita erros de build e garante que
  // a conexão aconteça apenas em runtime server-side.
  serverExternalPackages: ["snowflake-sdk"],
};

export default nextConfig;
