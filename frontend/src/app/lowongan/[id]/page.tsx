"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchVacancy } from "@/lib/api";

export default function VacancyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError } = useQuery({ queryKey: ["vacancy", id], queryFn: () => fetchVacancy(id) });
  if (isPending) return <main className="detail wrap"><p role="status">Memuat detail lowongan...</p></main>;
  if (isError || !data) return <main className="detail wrap"><h1>Lowongan tidak ditemukan</h1><Link href="/">Kembali ke daftar lowongan</Link></main>;
  return <main className="detail">
    <section className="detail-intro"><div className="wrap detail-intro-inner"><div className="brand-tile">dicoding<span>g</span></div><div><h1>{data.title}</h1><p>Sektor Bisnis: Technology</p><p><a href="https://www.dicoding.com/" target="_blank" rel="noreferrer">Dicoding Indonesia</a>　♧ {data.location}　♙ 50-100 Karyawan</p></div></div></section>
    <article className="detail-body"><span className="job-badge">{data.employment_type}</span><div className="description" dangerouslySetInnerHTML={{ __html: data.description }} /><h2>Informasi Tambahan</h2><div className="detail-facts"><div><strong>Pengalaman bekerja</strong><p>{data.minimum_experience}</p></div><div><strong>Kandidat yang dibutuhkan</strong><p>{data.candidate_count} kandidat</p></div><div><strong>Lokasi</strong><p>{data.location}{data.is_remote ? " · Remote" : ""}</p></div>{data.show_salary && <div><strong>Gaji per bulan</strong><p>Rp {data.salary_min.toLocaleString("id-ID")}{data.salary_max ? ` - Rp ${data.salary_max.toLocaleString("id-ID")}` : ""}</p></div>}</div><Link className="back-link" href="/">← Kembali ke daftar lowongan</Link></article>
  </main>;
}
