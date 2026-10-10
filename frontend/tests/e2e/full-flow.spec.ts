import { expect, test } from "@playwright/test";

test("recruiter creates a vacancy that job seeker can find and inspect through Laravel", async ({ page }) => {
  const title = `Engineer ${Date.now()}`;
  await page.goto("/buat-lowongan");
  await page.getByRole("textbox", { name: /Judul lowongan/ }).fill(title);
  await page.getByLabel("Posisi *").selectOption("Engineering");
  await page.getByLabel("Full-Time").check();
  await page.getByRole("spinbutton", { name: /Kandidat yang dibutuhkan/ }).fill("1");
  await page.getByLabel("Aktif hingga *").fill("2099-12-30");
  await page.getByLabel("Lokasi *").selectOption("Bandung");
  await page.getByRole("textbox", { name: "Deskripsi" }).fill("Membangun produk bersama tim.");
  await page.getByRole("spinbutton", { name: "Gaji minimum" }).fill("6000000");
  await page.getByLabel("1-3 tahun").check();
  await page.getByRole("button", { name: "Buat lowongan" }).click();
  await expect(page.getByRole("status").filter({ hasText: "berhasil dibuat" })).toBeVisible();
  await page.getByRole("textbox", { name: "Cari lowongan berdasarkan judul" }).fill(title);
  await expect(page.getByRole("link", { name: new RegExp(title) })).toBeVisible();
  await page.getByRole("link", { name: new RegExp(title) }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText("Membangun produk bersama tim.")).toBeVisible();
});
