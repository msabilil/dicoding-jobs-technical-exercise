import { expect, Page, test } from "@playwright/test";
import { mockVacancies, vacancies } from "./fixtures";

async function fillVacancyForm(page: Page, salary: string | null) {
  await page.getByRole("textbox", { name: /Judul lowongan/ }).fill("Frontend Engineer");
  await page.getByLabel("Posisi *").selectOption("Engineering");
  await page.getByLabel("Full-Time").check();
  await page.getByRole("spinbutton", { name: /Kandidat yang dibutuhkan/ }).fill("2");
  await page.getByLabel("Aktif hingga *").fill("2099-12-30");
  await page.getByLabel("Lokasi *").selectOption("Bandung");
  await page.getByRole("textbox", { name: "Deskripsi" }).fill("Bangun antarmuka.");
  if (salary !== null) await page.getByRole("spinbutton", { name: "Gaji minimum" }).fill(salary);
  await page.getByLabel("1-3 tahun").check();
}

test("recruiter creates a vacancy and sees its detail", async ({ page }) => {
  await mockVacancies(page);
  await page.route(/\/api\/vacancies(?:\/3)?$/, async route => {
    const created = { ...vacancies[0], id: 3, title: "Frontend Engineer" };
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 201, json: { data: created } });
    } else {
      await route.fulfill({ json: { data: route.request().url().endsWith("/3") ? created : [created, ...vacancies] } });
    }
  });
  await page.goto("/buat-lowongan");
  await fillVacancyForm(page, "6000000");
  await page.getByRole("button", { name: "Buat lowongan" }).click();
  await expect(page).toHaveURL(/\/?\?created=Frontend%20Engineer$/);
  await expect(page.getByRole("status").filter({ hasText: "berhasil dibuat" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Frontend Engineer/ })).toBeVisible();
});

test("blank minimum salary is rejected without becoming zero", async ({ page }) => {
  let submittedSalary: unknown = "not submitted";
  await page.route(/\/api\/vacancies$/, async route => {
    submittedSalary = route.request().postDataJSON().salary_min;
    await route.fulfill({ status: 422, json: { message: "Validation failed", errors: { salary_min: ["Gaji minimum wajib diisi."] } } });
  });
  await page.goto("/buat-lowongan");
  await fillVacancyForm(page, null);
  await page.getByRole("button", { name: "Buat lowongan" }).click();
  await expect(page.getByText("Gaji minimum wajib diisi.")).toBeVisible();
  expect(submittedSalary).toBeNull();
});
