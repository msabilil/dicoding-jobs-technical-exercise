"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { VacancyForm } from "@/components/vacancy-form";
import { ApiError, fetchVacancy } from "@/lib/api";

export default function EditVacancy() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, error } = useQuery({ queryKey: ["vacancy", id], queryFn: () => fetchVacancy(id) });
  if (isPending) return <main className="form-wrap"><p role="status">Memuat lowongan...</p></main>;
  if (error instanceof ApiError && error.status === 404) return <main className="form-wrap"><h1>Lowongan tidak ditemukan</h1><Link href="/dashboard">Kembali ke Dashboard</Link></main>;
  if (error || !data) return <main className="form-wrap"><p role="alert">Lowongan gagal dimuat. Coba muat ulang halaman.</p></main>;
  return <VacancyForm key={data.id} initial={data} />;
}
