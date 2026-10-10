import type { Metadata } from "next";
import Image from "next/image";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = { title: "Dicoding Jobs", description: "Temukan lowongan kerja teknologi di Dicoding Jobs" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body><QueryProvider><SiteHeader />{children}<footer className="footer wrap"><Image className="dicoding-logo" src="/dicoding-logo.png" alt="dicoding" width={189} height={52} /><p>Dicoding Space<br />Jl. Batik Kumeli No.50, Sukaluyu,<br />Kec. Cibeunying Kaler, Kota Bandung Jawa Barat 40123</p></footer></QueryProvider></body></html>;
}
