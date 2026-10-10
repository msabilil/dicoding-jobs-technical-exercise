import Link from "next/link";
import Image from "next/image";
import { Vacancy } from "@/lib/api";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export function JobCard({ vacancy }: { vacancy: Vacancy }) {
  return <Link className="job-card" href={`/lowongan/${vacancy.id}`}>
    <div className="brand-tile"><Image src="/dicoding-logo.png" alt="" width={75} height={21} /></div>
    <div className="job-summary"><h3>{vacancy.title}</h3><p><span aria-hidden="true">▣</span> Dicoding Indonesia <span className="job-type">{vacancy.employment_type}</span></p><p><span aria-hidden="true">♧</span> {vacancy.location}{vacancy.is_remote ? " · Remote" : ""} <span className="experience"><span aria-hidden="true">▣</span> {vacancy.minimum_experience}</span></p></div>
    <div className="job-dates"><p>Dibuat pada {formatDate(vacancy.created_at)}</p><p>Lamar sebelum {formatDate(vacancy.active_until)}</p></div>
  </Link>;
}
