import type { Viewport } from "next";
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

// I metadata (titolo/descrizione/robots) vivono nelle pagine (`/` ed `/en`)
// perché cambiano con la lingua; qui resta solo il viewport.

// Fondo scuro della chrome del browser (barra/indirizzo) sul mobile. I meta non
// possono leggere i token CSS, quindi l'hex è lo specchio di `--bg-deep` in
// globals.css: se cambia quel token, cambia anche qui.
export const viewport: Viewport = {
  themeColor: "#05070b",
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
          {/* Gutter stretto sotto 640px: a 375px si guadagnano 24px di
              contenuto, e con il rail laterale già presente tanto ce ne vuole. */}
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 w-full relative z-[1] flex flex-col flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}