"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const dashboard = pathname === "/dashboard" || pathname === "/buat-lowongan" || pathname.endsWith("/edit");
  return <header className="site-header"><nav className="nav wrap" aria-label="Navigasi utama">
    <Link className="jobs-logo" href="/" aria-label="Dicoding Jobs, ke daftar lowongan"><Image src="/dicoding-jobs-logo.svg" alt="Dicoding Jobs" width={93} height={37} priority /></Link>
    <Link className={dashboard ? "" : "nav-active"} aria-current={dashboard ? undefined : "page"} href="/">Lowongan Kerja</Link>
    <Link className={dashboard ? "nav-active" : ""} aria-current={dashboard ? "page" : undefined} href="/dashboard">Dashboard</Link>
  </nav></header>;
}
