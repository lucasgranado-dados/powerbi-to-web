// Healthcheck público (fora da proteção do middleware) para Vercel/monitoração.
export function GET() {
  return Response.json({ status: "ok" });
}
