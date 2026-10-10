"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteVacancy, fetchDashboardVacancies } from "@/lib/api";
import { formatDate } from "@/components/job-card";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState("");
  const { data, isPending, isError } = useQuery({ queryKey: ["dashboard-vacancies"], queryFn: fetchDashboardVacancies });
  const remove = useMutation({
    mutationFn: deleteVacancy,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard-vacancies"] }),
        queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
      ]);
      setNotice("Lowongan berhasil dihapus.");
    },
  });

  function confirmDelete(id: number, title: string) {
    if (window.confirm(`Hapus lowongan “${title}”?`)) remove.mutate(id);
  }

  return <main className="dashboard-layout wrap">
    <aside className="dashboard-sidebar"><div className="dashboard-side-heading"><span>Jobs</span><svg className="dashboard-graphic" viewBox="0 0 100 92" fill="none" aria-hidden="true"><path d="M16 0v17c0 10 6 15 16 15h45c9 0 14 5 14 14v7c0 9-5 14-14 14H41c-9 0-14 5-14 14v11" stroke="currentColor" strokeWidth="3" /><circle cx="49" cy="32" r="7" fill="currentColor" /><circle cx="52" cy="67" r="7" fill="currentColor" /><rect x="73" y="81" width="27" height="11" fill="currentColor" /></svg></div><div className="sidebar-current"><span aria-hidden="true">▣</span> Lowongan Saya</div></aside>
    <section className="dashboard-main"><div className="dashboard-heading"><h1>Lowongan Saya</h1><Link className="primary-button" href="/buat-lowongan">＋ Buat lowongan</Link></div>
      {notice && <p className="success-message" role="status">{notice}</p>}
      {remove.isError && <p className="message" role="alert">Lowongan gagal dihapus. Coba lagi.</p>}
      {isPending && <p className="message" role="status">Memuat lowongan...</p>}
      {isError && <p className="message" role="alert">Lowongan gagal dimuat. Coba muat ulang halaman.</p>}
      {data?.length === 0 && <p className="message">Belum ada lowongan. Mulai dengan membuat lowongan baru.</p>}
      <div className="dashboard-cards">{data?.map(vacancy => <article className="dashboard-card" key={vacancy.id}>
        <div className="dashboard-brand"><Image src="/dicoding-jobs-logo.svg" alt="" width={81} height={32} /></div>
        <div className="dashboard-card-content"><h2>{vacancy.title}</h2><p className="dashboard-dates"><span>♧ Dibuat: {formatDate(vacancy.created_at)}</span><span>◷ Aktif hingga: {formatDate(vacancy.active_until)}</span></p><div className="dashboard-actions"><Link href={`/lowongan/${vacancy.id}/edit`} className="secondary-button" aria-label={`Edit ${vacancy.title}`}>✎　Edit</Link><button type="button" className="delete-button" onClick={() => confirmDelete(vacancy.id, vacancy.title)} disabled={remove.isPending} aria-label={`Hapus ${vacancy.title}`}>▤　Hapus</button></div></div>
      </article>)}</div>
    </section>
  </main>;
}
