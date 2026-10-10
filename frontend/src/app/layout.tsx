import type { Metadata } from "next";
import Link from "next/link";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

export const metadata: Metadata = { title: "Dicoding Jobs", description: "Temukan lowongan kerja teknologi di Dicoding Jobs" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body><QueryProvider><header className="site-header"><nav className="nav wrap"><Link className="jobs-logo" href="/"><b>g</b> Jobs</Link><Link href="/">Lowongan Kerja</Link><Link href="/buat-lowongan">Buat Lowongan</Link></nav></header>{children}<footer className="footer wrap"><div className="dicoding-logo">dicoding<span>g</span></div><p>Dicoding Space<br />Jl. Batik Kumeli No.50, Sukaluyu,<br />Kec. Cibeunying Kaler, Kota Bandung Jawa Barat 40123</p></footer></QueryProvider></body></html>;
}
