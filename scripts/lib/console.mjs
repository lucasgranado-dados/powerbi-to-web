// Helpers de log compartilhados pelos scripts de automação.
// Mantém saída consistente (✅/⚠️/❌) e utilitários de argumentos.

import { parseArgs } from "node:util";

export const ok = (msg) => console.log(`✅ ${msg}`);
export const warn = (msg) => console.warn(`⚠️  ${msg}`);
export const fail = (msg) => console.error(`❌ ${msg}`);
export const info = (msg) => console.log(`ℹ️  ${msg}`);
export const title = (msg) => console.log(`\n${msg}\n${"─".repeat(msg.length)}`);

/**
 * Lê e valida o --slug. Encerra o processo com erro se ausente/inválido.
 */
export function getSlug() {
  const { values } = parseArgs({
    options: {
      slug: { type: "string" },
      force: { type: "boolean", default: false },
    },
    allowPositionals: true,
    strict: false,
  });

  const slug = values.slug;
  if (!slug) {
    fail("Informe o slug: --slug nome-do-dashboard");
    process.exit(1);
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    fail(
      `Slug inválido: "${slug}". Use apenas minúsculas, números e hífens (ex.: vendas-por-hora).`,
    );
    process.exit(1);
  }
  return { slug, force: Boolean(values.force) };
}
