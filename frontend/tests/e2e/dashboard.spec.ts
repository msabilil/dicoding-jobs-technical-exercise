import { expect, test } from "@playwright/test";

test("dashboard navigates to edit and can delete a vacancy", async ({ page, request }) => {
  const title = `Dashboard Engineer ${Date.now()}`;
  const response = await request.post("/api/vacancies", { data: {
    title, position: "Engineering", employment_type: "Full-Time", candidate_count: 1,
    active_until: "2099-12-30", location: "Bandung", is_remote: false,
    description: "<p>Membangun produk.</p>", salary_min: 6000000, salary_max: null,
    show_salary: false, minimum_experience: "1-3 tahun",
  } });
  expect(response.ok()).toBeTruthy();

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByRole("heading", { name: "Lowongan Saya" })).toBeVisible();
  await expect(page.getByRole("link", { name: "＋ Buat lowongan" })).toBeVisible();
  await page.getByRole("link", { name: `Edit ${title}` }).click();
  await expect(page.getByRole("textbox", { name: /Judul lowongan/ })).toHaveValue(title);
  await page.getByRole("textbox", { name: /Judul lowongan/ }).fill(`${title} Baru`);
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(page.getByRole("heading", { name: `${title} Baru` })).toBeVisible();

  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: `Hapus ${title} Baru` }).click();
  await expect(page.getByRole("status").filter({ hasText: "berhasil dihapus" })).toBeVisible();
  await expect(page.getByRole("heading", { name: `${title} Baru` })).toHaveCount(0);
});
