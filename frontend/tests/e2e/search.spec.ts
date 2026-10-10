import { expect, test } from "@playwright/test";
import { mockVacancies } from "./fixtures";

test("job seeker searches by partial title", async ({ page }) => {
  await mockVacancies(page);
  await page.goto("/");
  await page.getByRole("textbox", { name: "Cari lowongan berdasarkan judul" }).fill("android");
  await expect(page.getByRole("heading", { name: "Hasil Pencarian" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Android Developer/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Product Engineer/ })).toHaveCount(0);
});
