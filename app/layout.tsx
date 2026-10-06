import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans,JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layouts/navbar";
import BgScene from "@/components/layouts/bg-scene";
import { cn } from "@/lib/utils";

const archivo = Archivo({
  variable: "--font-archivo",
  weight: "variable",
  axes: ["wdth"],
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Sito non indicizzato su user-site diretto: bastano titolo e descrizione,
// niente Open Graph/Twitter né base URL (vedi review.md E3).
export const metadata: Metadata = {
  title: "SYS / 01 — Full Stack Web Developer",
  description: "Portfolio di uno sviluppatore web full stack: React, Next.js, Node, SQL, MongoDB.",
  // Sito non indicizzato per scelta: blocca anche mirror/deploys di anteprima.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={cn(
        "h-full antialiased scroll-smooth",
        archivo.variable,
        plexSans.variable,
        plexMono.variable,
        jetbrainMono.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <BgScene />
        <NavBar />
        {/* px di rails e sidebar: `--rail-w` / `--sidebar-w`, stessa fonte della navbar */}
        <div className="w-full pl-[var(--rail-w)] lg:pl-[var(--sidebar-w)]">
          <div className="max-w-[1180px] mx-auto px-8 w-full relative z-[1] flex flex-col flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}