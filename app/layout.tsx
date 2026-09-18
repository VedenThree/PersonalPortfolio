import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "FD / 01 — Full Stack Web Developer",
  description: "Portfolio di uno sviluppatore web full stack: React, Next.js, Node, SQL, MongoDB.",
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
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <BgScene />
        <NavBar />
        <div className="lg:pl-[220px] w-full">
          <div className="max-w-[1180px] mx-auto px-8 w-full relative z-[1] flex flex-col flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}