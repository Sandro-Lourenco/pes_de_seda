import { expect, test } from "@playwright/test";

test("abertura, autora, oferta e FAQ permanecem navegáveis", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Pés de Seda" })).toBeVisible();
  await page.locator("#inicio").getByRole("link", { name: "Conhecer o conteúdo" }).click();
  await expect(page.getByRole("heading", { name: "Cuidado, palavra por palavra." })).toBeVisible();
  await page.locator("#autora").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Ana Maria Lourenço." })).toBeVisible();
  await page.locator("#oferta").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Pequenos gestos. Um novo ritual." })).toBeVisible();
  await expect(page.getByText("R$ 49,90", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Comprar por R\$ 49,90|Vendas em preparação/ })).toBeVisible();
  const question = page.getByText("Essa receita realmente funciona?", { exact: true });
  await question.click();
  await expect(page.getByText("O livro registra uma experiência familiar.", { exact: false })).toBeVisible();
});

test("navegação por teclado alcança o conteúdo e abre o FAQ", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#conteudo")).toBeInViewport();
  const summary = page.locator("summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("O livro registra uma experiência familiar.", { exact: false })).toBeVisible();
});

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`não apresenta transbordamento horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test("mantém conteúdo visível com movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Pés de Seda" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Perguntas que acolhem respostas." })).toBeVisible();
});
