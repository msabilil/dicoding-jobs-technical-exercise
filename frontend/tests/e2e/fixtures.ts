import { Page } from "@playwright/test";

export const vacancies = [
  { id: 1, title: "Android Developer", position: "Engineering", employment_type: "Full-Time", candidate_count: 2, active_until: "2099-12-30", location: "Bandung", is_remote: false, description: "<h2>Job Description</h2><p>Membangun aplikasi Android.</p>", salary_min: 6000000, salary_max: null, show_salary: false, minimum_experience: "4-5 tahun", created_at: "2023-12-15T00:00:00.000000Z" },
  { id: 2, title: "Product Engineer", position: "Engineering", employment_type: "Full-Time", candidate_count: 1, active_until: "2099-12-30", location: "Bandung", is_remote: false, description: "<h2>Job Description</h2><p>Membangun produk.</p>", salary_min: 7000000, salary_max: null, show_salary: false, minimum_experience: "1-3 tahun", created_at: "2023-12-15T00:00:00.000000Z" },
];

export async function mockVacancies(page: Page) {
  await page.route(/\/api\/vacancies(?:\/\d+)?(?:\?.*)?$/, async route => {
    const url = new URL(route.request().url());
    const id = url.pathname.match(/\/api\/vacancies\/(\d+)$/)?.[1];
    if (id) {
      const vacancy = vacancies.find(item => item.id === Number(id));
      await route.fulfill({ status: vacancy ? 200 : 404, json: { data: vacancy ?? null } });
      return;
    }
    const q = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
    await route.fulfill({ json: { data: vacancies.filter(item => item.title.toLowerCase().includes(q)) } });
  });
}
