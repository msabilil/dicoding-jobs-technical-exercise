import { expect, test } from "@playwright/test";
import { mockVacancies, vacancies } from "./fixtures";

test("recruiter creates a vacancy and sees its detail", async ({ page }) => {
  await mockVacancies(page);
  await page.route(/\/api\/vacancies(?:\/3)?$/, async route => {
    const created = { ...vacancies[0], id: 3, title: "Frontend Engineer" };
    await route.fulfill({ status: route.request().method() === "POST" ? 201 : 200, json: { data: created } });
  });
  await page.goto("/buat-lowongan");
  await page.getByRole("textbox", { name: /Judul lowongan/ }).fill("Frontend Engineer");
  await page.getByLabel("Posisi *").selectOption("Engineering");
  await page.getByLabel("Full-Time").check();
  await page.getByRole("spinbutton", { name: /Kandidat yang dibutuhkan/ }).fill("2");
  await page.getByLabel("Aktif hingga *").fill("2099-12-30");
  await page.getByLabel("Lokasi *").selectOption("Bandung");
  await page.getByRole("textbox", { name: "Deskripsi" }).fill("Bangun antarmuka.");
  await page.getByRole("spinbutton", { name: "Gaji minimum" }).fill("6000000");
  await page.getByLabel("1-3 tahun").check();
  await page.getByRole("button", { name: "Buat lowongan" }).click();
  await expect(page).toHaveURL(/\/lowongan\/3$/);
  await expect(page.getByRole("heading", { name: "Frontend Engineer" })).toBeVisible();
});
