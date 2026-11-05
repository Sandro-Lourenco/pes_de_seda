import fs from "node:fs";
import path from "node:path";
import { test } from "@playwright/test";

const evidenceDir = path.resolve("evidencias");

for (const width of [390, 1440]) {
  test(`capturas editoriais em ${width}px`, async ({ page }) => {
    fs.mkdirSync(evidenceDir, { recursive: true });
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/");
    // Locator screenshots can focus the first keyboard target in Chromium;
    // hide that test-only focus artifact while keeping the real skip link tested separately.
    await page.addStyleTag({ content: ".skip-link { display: none !important; }" });
    await page.locator("#inicio").screenshot({ path: path.join(evidenceDir, `abertura-${width}.png`) });
    await page.locator("#historia").screenshot({ path: path.join(evidenceDir, `historia-${width}.png`) });
    await page.locator("#autora").screenshot({ path: path.join(evidenceDir, `autora-${width}.png`) });
    await page.locator("#oferta").screenshot({ path: path.join(evidenceDir, `oferta-${width}.png`) });
  });
}
