"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JobCard } from "@/components/job-card";
import { fetchVacancies } from "@/lib/api";

function SuccessNotice() {
  const title = useSearchParams().get("created");
  return title ? <p className="success-message" role="status">Lowongan “{title}” berhasil dibuat dan muncul pada daftar.</p> : null;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const { data, isPending, isError } = useQuery({ queryKey: ["vacancies", search], queryFn: () => fetchVacancies(search) });
  return <>
    <section className="hero"><div className="hero-inner"><span className="eyebrow">Dicoding Jobs</span><h1>Temukan lowongan yang<br /> cocok untuk kamu <span className="hero-accent" aria-hidden="true" /></h1></div></section>
    <main className="listing wrap"><Suspense fallback={null}><SuccessNotice /></Suspense><div className="listing-heading"><h2>{search.trim() ? "Hasil Pencarian" : "Daftar Pekerjaan Terbaru"}</h2><label className="search-box"><span className="search-icon" aria-hidden="true" /><input aria-label="Cari lowongan berdasarkan judul" value={search} onChange={event => setSearch(event.target.value)} placeholder="Pekerjaan apa yang sedang kamu cari?" /></label></div>
      {isPending && <p role="status" className="message">Memuat lowongan...</p>}
      {isError && <p role="alert" className="message">Lowongan gagal dimuat. Coba muat ulang halaman.</p>}
      {data && data.length === 0 && <p className="message">{search.trim() ? "Tidak ada lowongan yang cocok dengan pencarianmu." : "Belum ada lowongan tersedia."}</p>}
      <div className="job-list">{data?.map(vacancy => <JobCard key={vacancy.id} vacancy={vacancy} />)}</div></main>
  </>;
}
