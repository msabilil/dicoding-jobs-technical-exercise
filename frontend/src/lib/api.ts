export type Vacancy = {
  id: number; title: string; position: string; employment_type: string;
  candidate_count: number; active_until: string; location: string;
  is_remote: boolean; description: string; salary_min: number;
  salary_max: number | null; show_salary: boolean;
  minimum_experience: string; created_at: string;
};

export type VacancyInput = Omit<Vacancy, "id" | "created_at" | "salary_min"> & { salary_min: number | null };

export class ApiError extends Error {
  constructor(public status: number, public errors: Record<string, string[]> = {}) { super(`HTTP ${status}`); }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.errors ?? {});
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()).data as T;
}

export function fetchVacancies(query = "") {
  return request<Vacancy[]>(query.trim() ? `/api/vacancies?q=${encodeURIComponent(query.trim())}` : "/api/vacancies");
}

export function fetchVacancy(id: string) {
  return request<Vacancy>(`/api/vacancies/${encodeURIComponent(id)}`);
}

export function createVacancy(data: VacancyInput) {
  return request<Vacancy>("/api/vacancies", { method: "POST", body: JSON.stringify(data) });
}

export function fetchDashboardVacancies() {
  return request<Vacancy[]>("/api/dashboard/vacancies");
}

export function updateVacancy(id: number, data: VacancyInput) {
  return request<Vacancy>(`/api/vacancies/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteVacancy(id: number) {
  return request<void>(`/api/vacancies/${id}`, { method: "DELETE" });
}
