import { expect, test } from "@playwright/test";

/**
 * Smoke E2E: a home carrega. Requer browsers: `npx playwright install`.
 * Não roda no CI por padrão.
 *
 * Observação: `/dashboards/_template` é uma pasta privada do App Router (prefixo
 * "_") e NÃO é uma rota. Dashboards reais (criados via `dashboard:init`) têm
 * slug sem "_" e são roteados — teste-os após criá-los.
 */
test("home carrega e mostra o título do kit", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Dashboards" }),
  ).toBeVisible();
});
