import { expect, test } from "@playwright/test";
import { mockVacancies } from "./fixtures";

test("job seeker opens the vacancies list", async ({ page }) => {
  await mockVacancies(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Daftar Pekerjaan Terbaru" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Android Developer/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Product Engineer/ })).toBeVisible();
});
