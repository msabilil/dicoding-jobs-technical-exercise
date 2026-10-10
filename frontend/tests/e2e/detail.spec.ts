import { expect, test } from "@playwright/test";
import { mockVacancies } from "./fixtures";

test("job seeker views vacancy details", async ({ page }) => {
  await mockVacancies(page);
  await page.goto("/");
  await page.getByRole("link", { name: /Android Developer/ }).click();
  await expect(page).toHaveURL(/\/lowongan\/1$/);
  await expect(page.getByRole("heading", { name: "Android Developer" })).toBeVisible();
  await expect(page.getByText("Membangun aplikasi Android.")).toBeVisible();
});

test("missing vacancy offers a way back to the list", async ({ page }) => {
  await mockVacancies(page);
  await page.goto("/lowongan/999");
  await expect(page.getByRole("heading", { name: "Lowongan tidak ditemukan" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Kembali ke daftar lowongan" })).toHaveAttribute("href", "/");
});
